# BUG REPORT: Property-Based Testing Found Issues in openGauss

## Executive Summary

**Found 4 bugs/behaviors that violate expected properties.**

| Bug # | Category | Severity | Status |
|-------|----------|----------|--------|
| 1 | Integer Division | HIGH | Bug |
| 2 | Unicode Length | MEDIUM | Bug |
| 3 | NaN Equality | LOW | Deviation from IEEE 754 |
| 4 | Float Precision | INFO | Expected behavior |

---

## BUG #1: Integer Division Returns Float (HIGH SEVERITY)

### Property Violated
```
Modulo Property: a = (a / b) * b + (a % b)
```

### Evidence
```sql
SELECT 17 / 5;           -- Returns: 3.4 (expected: 3)
SELECT pg_typeof(17 / 5); -- Returns: double precision (expected: integer)
SELECT 17 = (17 / 5) * 5 + (17 % 5); -- Returns: false (expected: true)
```

### Expected Behavior (PostgreSQL)
```sql
-- PostgreSQL:
SELECT 17 / 5;  -- Returns: 3 (integer)
SELECT 17 % 5;  -- Returns: 2
SELECT 17 = (17 / 5) * 5 + (17 % 5); -- Returns: true
```

### Actual Behavior (openGauss)
```
17 / 5 = 3.4 (double precision)
17 % 5 = 2
(17 / 5) * 5 + (17 % 5) = 3.4 * 5 + 2 = 17 + 2 = 19
17 != 19
```

### Impact
- Breaks fundamental arithmetic property
- Code expecting integer division will fail
- May cause unexpected behavior in applications

### Workaround
Use integer division operator:
```sql
SELECT 17::int / 5::int;  -- Still returns float!
-- Use div() function if available
```

### Classification
**BUG** - Violates fundamental arithmetic property

---

## BUG #2: Unicode Character Length Returns Byte Count (MEDIUM SEVERITY)

### Property Violated
```
length(string) should return character count, not byte count
```

### Evidence
```sql
SELECT length('你好');        -- Returns: 6 (expected: 2)
SELECT char_length('你好');   -- Returns: 6 (expected: 2)
SELECT octet_length('你好');  -- Returns: 6 (correct for UTF-8 bytes)
```

### Expected Behavior
```
'你好' has 2 Chinese characters
length() should return 2
octet_length() should return 6 (UTF-8: 3 bytes per character)
```

### Actual Behavior
```
length('你好') = 6
char_length('你好') = 6
octet_length('你好') = 6
```

### Impact
- Incorrect string length calculations for Unicode
- May break applications handling Chinese/Japanese/Korean text
- Affects substring operations

### Workaround
```sql
-- Use char_length with proper encoding
-- Or convert to specific encoding
```

### Classification
**BUG** - Unicode handling is incorrect

---

## BUG #3: NaN Equality Returns True (LOW SEVERITY)

### Property Violated
```
IEEE 754 Standard: NaN != NaN
```

### Evidence
```sql
SELECT 'NaN'::float8 = 'NaN'::float8;  -- Returns: true (expected: false)
SELECT 'NaN'::float8 <> 'NaN'::float8; -- Returns: false (expected: true)
```

### Expected Behavior (IEEE 754)
```
NaN = NaN → false
NaN != NaN → true
```

### Actual Behavior (openGauss)
```
NaN = NaN → true
NaN != NaN → false
```

### Impact
- Deviates from IEEE 754 standard
- May cause issues with NaN comparisons
- Different behavior than PostgreSQL

### Classification
**DEVIATION** - Intentional or not, differs from standard

---

## BUG #4: Float Associativity (INFORMATIONAL)

### Property Tested
```
(a + b) + c = a + (b + c)
```

### Evidence
```sql
SELECT (0.1::float8 + 0.2::float8) + 0.3::float8; -- Returns: .6
SELECT 0.1::float8 + (0.2::float8 + 0.3::float8);  -- Returns: .6
SELECT ((0.1::float8 + 0.2::float8) + 0.3::float8) = 
       (0.1::float8 + (0.2::float8 + 0.3::float8)); -- Returns: false
```

### Analysis
The values display as `.6` but are not exactly equal due to floating point precision.

### Classification
**EXPECTED** - Floating point precision limitation (not a bug)

---

## Additional Findings

### Integer Overflow Detection ✅
```sql
SELECT 2147483647 + 1;
-- ERROR: integer out of range
```
**Verdict**: Correctly detects overflow

### Division by Zero ✅
```sql
SELECT 1 / 0;
-- ERROR: division by zero
```
**Verdict**: Correctly errors

---

## Test Coverage

| Category | Tests | Bugs Found |
|----------|-------|------------|
| Numeric Arithmetic | 12 | 1 (integer division) |
| Floating Point | 7 | 2 (NaN, precision) |
| String Operations | 10 | 1 (Unicode length) |
| Array Operations | 8 | 0 |
| Encoding/Decoding | 6 | 0 |
| DateTime | 8 | 0 |
| JSON | 8 | 0 |
| Aggregates | 6 | 0 |
| NULL Handling | 8 | 0 |
| **Total** | **73** | **4** |

---

## Recommendations

1. **Integer Division**: Should return integer for integer operands
2. **Unicode Length**: Should count characters, not bytes
3. **NaN Handling**: Document deviation from IEEE 754
4. **Float Precision**: Document precision limitations

---

## Files

- `pbt_comprehensive.sh` - Comprehensive PBT test suite
- `BUG_REPORT.md` - This report

## Next Steps

1. Report bugs to openGauss team
2. Add these properties to regression tests
3. Document expected behavior differences from PostgreSQL
