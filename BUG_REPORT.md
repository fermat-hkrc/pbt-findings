# BUG REPORT: Property-Based Testing Found Issues in openGauss

## Executive Summary

Property-based testing discovered **6 findings** across ~225 tests in 14 categories.

| Bug # | Category | Severity | Classification | Only in A_FORMAT? |
|-------|----------|----------|----------------|-------------------|
| 1 | Integer Division | HIGH | **Design Choice** | No — all modes |
| 2 | Unicode Length | MEDIUM | **NOT A BUG** | No — encoding config |
| 3 | NaN Equality | MEDIUM | **Design Choice** | No — all modes |
| 4 | Float Precision | INFO | Expected | No — IEEE 754 |
| **5** | **Empty String = NULL** | **HIGH** | **Expected in A_FORMAT** | **YES — Oracle compat feature** |
| **6** | **NULL Concatenation** | **HIGH** | **Expected in A_FORMAT** | **YES — Oracle compat feature** |
| **7** | **POSITION Empty String** | **MEDIUM** | **Expected in A_FORMAT** | **YES — downstream of #5** |
| **8** | **Array NULL Equality** | **MEDIUM** | **Design Choice** | No — all modes |

### Key Finding on Bugs #5, #6, #7

**These are NOT bugs in the traditional sense.** They are **intentional Oracle-compatibility features** that are active only in `DBCOMPATIBILITY = 'A'` mode. The behavior correctly reflects Oracle Database semantics where empty string `''` equals `NULL`.

**The actual concern is that `A` is the default mode** when no `DBCOMPATIBILITY` is specified at `gs_initdb` time on single-node installations.

---

## BUG #1: Integer Division `/` Returns Float (Design Choice)

### Property Violated
```
Modulo Identity: a = (a / b) * b + (a % b)
```

### Evidence
```sql
SELECT 17 / 5;                              -- Returns: 3.4 (expected: 3)
SELECT pg_typeof(17 / 5);                    -- Returns: double precision (expected: integer)
SELECT 17 = (17 / 5) * 5 + (17 % 5);        -- Returns: false (expected: true)
```

### Source Code Analysis

**File**: `src/common/backend/utils/adt/int.cpp` (lines 820-858)

```cpp
Datum int4div(PG_FUNCTION_ARGS)
{
    // A db compatibility change the result to float.
    float8 result;
    result = (arg1 * 1.0) / (arg2 * 1.0);
    PG_RETURN_FLOAT8(result);
}
```

All integer types affected: `int2/int2`, `int4/int4`, `int8/int8` all return `float8`.

### Workaround
```sql
SELECT div(17, 5);                          -- Returns: 3 (numeric) ✓
SELECT 17 = div(17, 5) * 5 + (17 % 5);      -- Returns: true ✓
```

### Classification
**DESIGN CHOICE** — Intentional for DB compatibility (comment in source code), but violates modulo identity.

---

## BUG #2: Unicode Length — NOT A BUG (Encoding Issue)

### Root Cause
`gs_initdb` defaults to `SQL_ASCII` encoding. With `SQL_ASCII`, `pg_database_encoding_max_length() = 1`, so `length()` counts bytes. With `UTF8`, it counts characters correctly.

```sql
-- SQL_ASCII (default):
SELECT length('你好');  -- 6 (bytes)

-- UTF8 (with --encoding=UTF8):
SELECT length('你好');  -- 2 (characters) ✓
```

### Fix
```bash
gs_initdb -D /path/to/data -w password --nodename=node --encoding=UTF8 --locale=C
```

### Classification
**NOT A BUG** — Correct behavior for the configured encoding.

---

## BUG #3: NaN Equality Returns True (Intentional Design Choice)

### Source Code Analysis

**File**: `src/common/backend/utils/adt/float.cpp` (lines 904-926)

```cpp
int float8_cmp_internal(float8 a, float8 b)
{
    /*
     * We consider all NANs to be equal and larger than any non-NAN. This is
     * somewhat arbitrary; the important thing is to have a consistent sort
     * order.
     */
    if (isnan(a)) {
        if (isnan(b))
            return 0; /* NAN = NAN */
        else
            return 1; /* NAN > non-NAN */
    }
    ...
}
```

### Behavior
| Comparison | openGauss | IEEE 754 | PostgreSQL |
|------------|-----------|----------|------------|
| `NaN = NaN` | `true` | `false` | `false` |
| `NaN <> NaN` | `false` | `true` | `false` |
| `NaN > 0` | `true` | `false` | `true` |

### Classification
**DESIGN CHOICE** — Intentional for consistent sort ordering. The comment in the source code explicitly states: *"We consider all NANs to be equal and larger than any non-NAN. This is somewhat arbitrary; the important thing is to have a consistent sort order."*

---

## BUG #4: Float Associativity (Expected Behavior)

```sql
SELECT ((0.1::float8 + 0.2::float8) + 0.3::float8) =
       (0.1::float8 + (0.2::float8 + 0.3::float8));  -- Returns: false
```

**Classification**: **EXPECTED** — IEEE 754 floating point precision limitation.

---

## BUG #5: Empty String Treated as NULL (CRITICAL BUG — Oracle Compat)

### Property Violated
```
SQL Standard: Empty string ('') IS NOT NULL
```

### Evidence
```sql
SELECT '' IS NULL;                       -- Returns: TRUE  (WRONG! Should be FALSE)
SELECT ''::text IS NULL;                 -- Returns: TRUE  (WRONG!)
SELECT ''::varchar IS NULL;              -- Returns: TRUE  (WRONG!)
SELECT ''::char(1) IS NULL;              -- Returns: TRUE  (WRONG!)
SELECT length('');                       -- Returns: NULL  (WRONG! Should be 0)
SELECT '' = '';                          -- Returns: NULL  (WRONG! Should be TRUE)
```

### Table Test
```sql
CREATE TABLE empty_test(v text);
INSERT INTO empty_test VALUES ('');     -- insert empty string
INSERT INTO empty_test VALUES (NULL);   -- insert null
INSERT INTO empty_test VALUES ('a');

SELECT v, v IS NULL AS isnull, length(v) AS len FROM empty_test;
--  v | isnull | len
-- ---+--------+----
--    |   t    |       ← '' stored but treated as NULL!
--    |   t    |       ← NULL also NULL
--  a |   f    |  1
```

### Root Cause: Source Code

**File**: `src/common/backend/parser/gram.cpp` (lines 103732–103764)

```cpp
static Node *
makeStringConst(char *str, int location)
{
    A_Const *n = makeNode(A_Const);

    if (u_sess->attr.attr_sql.sql_compatibility == A_FORMAT)   // ← A_FORMAT mode
    {
        if (NULL == str || (0 == strlen(str) && !ACCEPT_EMPTY_STR))  // ← empty string?
        {
            n->val.type = T_Null;    // ← CONVERT TO NULL AT PARSE TIME!
            ...
        }
        else
        {
            n->val.type = T_String;  // ← normal string
            ...
        }
    }
    else
    {
        n->val.type = T_String;      // ← standard: empty string stays string
        ...
    }
}
```

At **parse time**, the SQL parser converts every `''` literal to a `T_Null` AST node when running in A_FORMAT (Oracle-compatible) mode and the `accept_empty_str` flag is NOT set. By the time the query executes, `''` has already become `NULL`.

### Confirmation of A_FORMAT Mode
```sql
SELECT datcompatibility FROM pg_database WHERE datname = 'postgres';
-- Returns: A   ← Oracle-compatible mode is active by default!
```

### Fix / Workaround
```sql
-- Per-session workaround: set the flag that preserves empty strings
SET behavior_compat_options = 'accept_empty_str';

-- After setting:
SELECT '' IS NULL;    -- Returns: FALSE ✓
SELECT length('');    -- Returns: 0     ✓
SELECT '' = '';       -- Returns: TRUE  ✓
```

### GUC Flag
| Flag | Bit | Macro | Effect |
|------|-----|-------|--------|
| `accept_empty_str` | `1LL << 27` | `ACCEPT_EMPTY_STR` | When set, preserves empty strings as strings (standard SQL behavior) |

### Expected Behavior (PostgreSQL)
```sql
SELECT '' IS NULL;  -- Returns: FALSE
SELECT length('');  -- Returns: 0
SELECT '' = '';     -- Returns: TRUE
```

### Impact
- **Cannot distinguish empty string from NULL** — critical data integrity issue
- Queries filtering `WHERE col IS NULL` also match empty strings
- `length('')` returns NULL, breaking string calculations
- Causes Bug #6 (NULL concatenation) and Bug #7 (position empty string)

### Cross-Mode Verification

Testing the same queries across all four `DBCOMPATIBILITY` modes:

| Database | Mode | `'' IS NULL` | `length('')` | `NULL\|\|'x'` | `''=''` |
|----------|------|-------------|-------------|--------------|---------|
| db_a | **A** (Oracle) | **TRUE** ← | **NULL** ← | **x** ← | **NULL** ← |
| db_b | B (MySQL) | false | 0 | NULL | TRUE |
| db_c | C (Teradata) | false | 0 | NULL | TRUE |
| db_pg | PG (PostgreSQL) | false | 0 | NULL | TRUE |
| db_default | **A** (default!) | **TRUE** ← | **NULL** ← | **x** ← | **NULL** ← |

The behaviors in column `A` are all expected Oracle-compat features. Modes B, C, and PG all follow SQL standard.

### Source Code: Why `A` is the Default

**File**: `src/bin/initdb/initdb.cpp` (lines 1820–1838)

```cpp
/*
 * If we do not specify database compatibility, set B defaultly for distribution,
 * A defaultly for single.
 */
if (strlen(dbcompatibility) == 0) {
#ifdef ENABLE_MULTIPLE_NODES
    bki_lines = replace_token(bki_lines, "DB_COMPATIBILITY", g_dbCompatArray[DB_CMPT_B].name);
#else
    bki_lines = replace_token(bki_lines, "DB_COMPATIBILITY", g_dbCompatArray[DB_CMPT_A].name);
                                                            // ↑ single-node defaults to A!
#endif
}
```

In single-node mode (our Docker setup), `gs_initdb` without `--dbcompatibility` defaults to **`A`** (Oracle). This is the intended behavior: openGauss single-node targets Oracle compatibility.

### Fix / Workaround
```sql
-- Per-session: suppress just the empty-string conversion
SET behavior_compat_options = 'accept_empty_str';
SELECT '' IS NULL;    -- Returns: FALSE ✓
SELECT length('');    -- Returns: 0     ✓
SELECT '' = '';       -- Returns: TRUE  ✓

-- Or use a non-Oracle database:
-- CREATE DATABASE mydb DBCOMPATIBILITY = 'PG';
```

### Classification
**EXPECTED FEATURE in A_FORMAT (Oracle-compat) mode.** All four DBCOMPATIBILITY modes (A, B, C, PG) are supported. `A` is the default for single-node because openGauss targets Oracle migration. Users expecting SQL-standard behavior should use `DBCOMPATIBILITY = 'PG'`.

---

## BUG #6: NULL Concatenation Returns Non-NULL (HIGH BUG — Oracle Compat)

### Property Violated
```
SQL Standard: NULL || any_value = NULL
```

### Evidence
```sql
SELECT NULL || 'hello';                  -- Returns: 'hello'  (WRONG! Should be NULL)
SELECT 'hello' || NULL;                  -- Returns: 'hello'  (WRONG! Should be NULL)
SELECT NULL::text || 'hello'::text;      -- Returns: 'hello'  (WRONG!)
SELECT (NULL || 'hello') IS NULL;        -- Returns: FALSE    (WRONG! Should be TRUE)
```

### Root Cause: Source Code

**File**: `src/common/backend/utils/adt/varlena.cpp` (lines 923–951)

```cpp
Datum textcat(PG_FUNCTION_ARGS)
{
    // Empty string to NULL
    text* t1 = NULL;
    text* t2 = NULL;

    if (u_sess->attr.attr_sql.sql_compatibility == A_FORMAT) {  // ← A_FORMAT mode
        if (PG_ARGISNULL(0) && PG_ARGISNULL(1))
            PG_RETURN_NULL();                     // both NULL → NULL
        else if (PG_ARGISNULL(0)) {               // LEFT is NULL
            t2 = PG_GETARG_TEXT_PP(1);
            PG_RETURN_TEXT_P(t2);                 // ← returns right arg (ignores NULL!)
        } else if (PG_ARGISNULL(1)) {             // RIGHT is NULL
            t1 = PG_GETARG_TEXT_PP(0);
            PG_RETURN_TEXT_P(t1);                 // ← returns left arg (ignores NULL!)
        } else {
            PG_RETURN_TEXT_P(text_catenate(t1, t2));  // normal concat
        }
    } else {
        if (!PG_ARGISNULL(0) && !PG_ARGISNULL(1)) {
            PG_RETURN_TEXT_P(text_catenate(t1, t2));
        } else {
            PG_RETURN_NULL();  // ← STANDARD: any NULL → NULL
        }
    }
}
```

When in A_FORMAT mode, `textcat()` treats NULL as an empty string — if one argument is NULL and the other is not, it returns the non-null argument unchanged. This implements Oracle behavior where `NULL || 'text' = 'text'`.

The comment `// Empty string to NULL` at line 925 confirms this is the dual of Bug #5: empty string→NULL and NULL→empty string are two sides of Oracle's `''`/`NULL` equivalence.

### Fix / Workaround
**Bug #6 is NOT fixed by `accept_empty_str`** — the NULL-in-concat behavior is hardcoded in `textcat()` for A_FORMAT mode with no individual flag to suppress it. The only fix is to avoid A_FORMAT mode.

```sql
-- No per-session fix available for textcat NULL behavior!
-- accept_empty_str fixes Bug #5 but NOT Bug #6:
SET behavior_compat_options = 'accept_empty_str';
SELECT NULL || 'hello';  -- Still returns 'hello' (not fixed!)
```

### Expected Behavior (PostgreSQL)
```sql
SELECT NULL || 'hello';  -- Returns: NULL
SELECT 'hello' || NULL;  -- Returns: NULL
```

### Classification
**EXPECTED FEATURE in A_FORMAT (Oracle-compat) mode.** Oracle treats `NULL || 'text'` as `'text'`. This is correct behavior in A_FORMAT. Modes B, C, PG all follow SQL standard (NULL propagates). No per-session workaround available for this specific behavior.

---

## BUG #7: `position('' IN string)` Returns NULL (MEDIUM BUG — Oracle Compat)

### Property Violated
```
SQL Standard: POSITION('' IN any_string) = 1 (empty string found at position 1)
```

### Evidence
```sql
SELECT position('' in 'hello');          -- Returns: NULL   (WRONG! Should be 1)
SELECT position('' in 'hello') IS NULL;  -- Returns: TRUE   (WRONG!)
SELECT position('' in '');               -- Returns: NULL   (WRONG! Should be 1)
```

### Root Cause: Source Code

**Primary cause**: `src/common/backend/parser/gram.cpp` line 103739 (same as Bug #5)

**Function**: `src/common/backend/utils/adt/varlena.cpp` (lines 1518–1524)

```cpp
Datum textpos(PG_FUNCTION_ARGS)
{
    text* str = PG_GETARG_TEXT_PP(0);         // string to search in
    text* search_str = PG_GETARG_TEXT_PP(1);  // pattern ('' becomes NULL)
    ...
    PG_RETURN_INT32((int32)text_position(str, search_str));
}
```

When `position('' in 'hello')` is parsed, `makeStringConst()` converts `''` to a `T_Null` AST node (Bug #5). By execution time, the call becomes `position(NULL in 'hello')`. Since `textpos()` is a strict function (NULL inputs → NULL output), the function returns NULL before ever executing. The `text_position()` implementation at line 1563 would correctly return 1 for an empty pattern, but it is never reached.

### Fix / Workaround
```sql
SET behavior_compat_options = 'accept_empty_str';
SELECT position('' in 'hello');  -- Returns: 1 ✓  (FIXED!)
```

### Expected Behavior (PostgreSQL)
```sql
SELECT position('' in 'hello');  -- Returns: 1
SELECT position('' in '');       -- Returns: 1
```

### Classification
**EXPECTED FEATURE in A_FORMAT (Oracle-compat) mode.** Downstream of Bug #5: `''` becomes NULL → `position(NULL in s)` = NULL. Fixed by `accept_empty_str` flag. Modes B, C, PG correctly return 1.

---

## BUG #8: Array with NULL Elements Equality Returns True (MEDIUM BUG — All Modes)

### Property Violated
```
SQL Standard: ARRAY[1,NULL,3] = ARRAY[1,NULL,3] should return NULL
(element-wise: NULL = NULL is NULL, not TRUE)
```

### Evidence
```sql
SELECT ARRAY[1,NULL,3] = ARRAY[1,NULL,3];       -- Returns: TRUE  (WRONG! Should be NULL)
SELECT ARRAY[NULL]::int[] = ARRAY[NULL]::int[];  -- Returns: TRUE  (WRONG!)
```

### Root Cause: Source Code

**File**: `src/common/backend/utils/adt/arrayfuncs.cpp` (lines 4017–4026)

```cpp
/*
 * We consider two NULLs equal; NULL and not-NULL are unequal.
 */
if (isnull1 && isnull2) {
    continue;          // ← NULL == NULL treated as EQUAL, skip to next element
}
if (isnull1 || isnull2) {
    result = false;    // ← NULL vs non-NULL is unequal
    break;
}
```

The comment explicitly documents the design: *"We consider two NULLs equal."* When both corresponding elements are NULL, the comparison `continue`s (treats them as equal) rather than returning NULL per SQL standard three-valued logic.

This behavior is in `array_eq_inner()` which is used across **all database modes**, not only A_FORMAT:

```cpp
Datum array_eq(PG_FUNCTION_ARGS) {
    ...
    if (DB_IS_CMPT(A_FORMAT) && COMPATIBLE_A_DB_ARRAY) {
        result = array_eq_db_a_inner(...);  // A_FORMAT alternate path
    } else {
        result = array_eq_inner(...);       // ← DEFAULT: all modes, including non-Oracle
    }
    PG_RETURN_BOOL(result);
}
```

### Fix / Workaround
No GUC flag suppresses this behavior. The `compatible_a_db_array` flag routes to a different algorithm (`array_eq_db_a_inner`) but does not fix the NULL semantics.

```sql
-- No per-session fix available.
-- Use IS NOT DISTINCT FROM for NULL-aware equality:
SELECT ARRAY[1,NULL,3] IS NOT DISTINCT FROM ARRAY[1,NULL,3];  -- TRUE (intentional)
-- Or compare non-null elements separately.
```

### Expected Behavior (PostgreSQL)
```sql
SELECT ARRAY[1,NULL,3] = ARRAY[1,NULL,3];  -- Returns: NULL
```

### Impact
- Array deduplication may not work correctly when arrays contain NULLs
- Queries comparing arrays with NULL elements return wrong boolean results
- Affects ALL database modes, not just Oracle-compatible mode

### Classification
**MEDIUM BUG** — Hardcoded in `array_eq_inner()`, active across all modes. Intentional design choice but inconsistent with SQL standard NULL semantics.

---

## Additional Findings

### Behaviors Observed (Not Bugs)

| Behavior | openGauss | PostgreSQL | Standard | Notes |
|----------|-----------|------------|----------|-------|
| `round(2.5)` | `3` | `3` | half-away-zero | Consistent |
| `(-7) % 3` | `-1` | `-1` | sign follows dividend | Consistent |
| `0^0` | `1` | `1` | `1` | Consistent |
| `5 IN (1,2,NULL)` | `NULL` | `NULL` | `NULL` | Correct per SQL |
| `NaN IS NAN` | ERROR | ERROR | N/A | `IS NAN` not supported |
| `1/3 * 3 = 1` (numeric) | `false` | `false` | Expected | Finite precision |
| `substr(s,0,3) = substring(s from 0 for 3)` | `false` | `false` | Different semantics | Documented |
| Month interval round-trip | `2024-01-29` | `2024-01-29` | Implementation | Calendar clamping |

### Correctly Behaving Properties
- Integer overflow detection ✓
- Division by zero errors ✓
- CHECK / FK / NOT NULL / UNIQUE constraints ✓
- Recursive CTEs ✓
- Set operations (UNION/INTERSECT/EXCEPT) ✓
- Boolean De Morgan's laws ✓
- Aggregate properties (sum, count, avg, min, max) ✓
- Date arithmetic ✓
- JSON/JSONB basic operations ✓

---

## Test Coverage

| Category | Tests Run | Bugs Found |
|----------|-----------|------------|
| Numeric Arithmetic | ~35 | 1 (integer division - design) |
| Floating Point | ~15 | 1 (NaN - design) |
| String Operations | ~30 | 3 (bugs #5,6,7) |
| Array Operations | ~15 | 1 (bug #8) |
| Encoding/Decoding | ~10 | 0 |
| DateTime | ~20 | 0 |
| JSON/JSONB | ~15 | 0 |
| Aggregates | ~15 | 0 |
| NULL Handling | ~15 | 0 |
| Type Casting | ~15 | 0 |
| Set Operations | ~10 | 0 |
| Window Functions | ~10 | 0 |
| Constraints | ~10 | 0 |
| CTEs/Subqueries | ~10 | 0 |
| **Total** | **~225** | **6 bugs** |

---

## Root Cause Analysis

### Bugs #5, #6, #7: Oracle-Compatibility Features (A_FORMAT), NOT Bugs

openGauss supports 4 `DBCOMPATIBILITY` modes: `A` (Oracle), `B` (MySQL), `C` (Teradata), `PG` (PostgreSQL).

**Single-node `gs_initdb` defaults to `A`** per `initdb.cpp:1836`. This means all `''`-as-NULL behaviors are intentional Oracle compatibility — correctly documented, correctly implemented.

```
initdb.cpp:1836:  → A_FORMAT (Oracle) is default for single-node
gram.cpp:103737:  → makeStringConst(): '' becomes T_Null in A_FORMAT
varlena.cpp:929:  → textcat(): NULL arg treated as '' in A_FORMAT
```

**The actual concern**: developers unfamiliar with `DBCOMPATIBILITY` modes may be surprised by Oracle semantics when they expected standard SQL.

### Bug #8: Independent Design in array_eq_inner (All Modes)

```
arrayfuncs.cpp:4018:  "We consider two NULLs equal"
arrayfuncs.cpp:4021:  if (isnull1 && isnull2) continue;  ← NULL==NULL = TRUE in ALL modes
```

Unlike bugs #5-7, this is active in **all** DBCOMPATIBILITY modes and has no workaround flag.

---

## Recommendations

### For Users
1. **Choose DBCOMPATIBILITY intentionally** at `gs_initdb` time:
   - Oracle migration: use `A` (default single-node)
   - MySQL migration: use `B` (default distributed)
   - Standard SQL: use `PG`

2. **In A_FORMAT**: set `behavior_compat_options = 'accept_empty_str'` to restore standard empty-string handling while keeping other Oracle compatibility features.

3. **Array NULL equality (Bug #8)**: use `IS NOT DISTINCT FROM` for NULL-aware comparison; it works consistently across all modes.

### For openGauss Team
1. **Bug #8 (Array NULL equality)**: Consider adding a `behavior_compat_options` flag to make array equality propagate NULLs per SQL standard.

2. **Bug #1 (Integer Division)**: Document clearly that `/` returns float. Recommend `div()`.

3. **Default compatibility documentation**: Make the `A`-is-default-for-single-node behavior more prominent in getting-started documentation.

---

## Files

| File | Description |
|------|-------------|
| `pbt_bug_finder_v2.sh` | Core bug-finding PBT tests |
| `pbt_deep_dive.sh` | Comprehensive 16-category PBT suite (225+ tests) |
| `pbt_comprehensive.sh` | Original PBT suite |
| `HOW_TO_CONFIRM_BUGS.md` | Docker instructions to verify bugs |
| `BUG_REPORT.md` | This report |

---

## Document Version

- **Updated**: April 2026
- **openGauss Version**: 7.0.0-RC2
- **Platform**: openEuler-24.03-LTS (aarch64)
- **Test Encoding**: UTF8 database (for correct Unicode behavior)
- **Database Mode**: A_FORMAT (Oracle-compatible, default)
- **Tests Run**: ~225 property-based tests across 14 categories
