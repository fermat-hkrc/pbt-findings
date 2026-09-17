---
id: OH-2026-STORAGE-002
date: "2026-08-25"
repo: filemanagement_storage_service
repo_url: https://gitcode.com/openharmony/filemanagement_storage_service
title: "[Bug]: StringToUint32 parses through signed int and cuts at INT32_MAX"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/storage_daemon/utils/file_utils.cpp
file_paths:
  - services/storage_daemon/utils/file_utils.cpp
  - services/storage_daemon/client/sdc.cpp
author: Toan
internal_issue_id: DTS2026082537775
language: C++
---

## Summary

`OHOS::StorageDaemon::StringToUint32` writes a `uint32_t &` out-param but
parses through a **signed `int`**: `StrToInt`, then reject
`value >= INT32_MAX`. Two independent cuts: a fencepost that drops
`INT32_MAX` (`2147483647` fits in both types, `>=` excludes it), and the
wrong parser — everything above `INT32_MAX` (including `UINT32_MAX`) never
survives `StrToInt`. Accepted set is `[0, INT32_MAX)` while the public
header (`file_utils.h:51`) promises `uint32_t`. Same-file sibling
`StringToBool` parses the type it writes. Confirmed and fixed by developers
(`DTS2026082537775`).

## Vulnerable Code

`services/storage_daemon/utils/file_utils.cpp` (430–451):

```cpp
bool StringToUint32(const std::string &str, uint32_t &num)
{
    if (str.empty()) {
        return false;
    }
    if (!IsNumericStr(str)) {
        return false;
    }

    int value;
    if (!StrToInt(str, value)) {          // signed parse behind uint contract
        return false;
    }
    if (value < 0 || value >= INT32_MAX) { // drops INT32_MAX (fencepost)
        return false;
    }
    num = static_cast<uint32_t>(value);
    return true;
}
```

`IsNumericStr` only says "digits"; `StrToInt` is a signed parser that cannot
represent the upper half of the out-param's type. Changing `>=` to `>` fixes
only the fencepost — `"4294967295"` still dies inside `StrToInt`.

## Trigger Conditions

1. `sdc.cpp` parses CLI tokens into `uint32_t userId` / `uint32_t flags`
   (`PrepareUserDirs` `:62-66`, `DestroyUserSpace`, `UpdateUserAuth`, …):
   `false` → `"Parameter input error"` / `-EINVAL`.
2. Same TU `ReadDigitDir` (`:530`) skips a directory name when the parse
   fails.
3. Any `flags` bit at or above bit 31, or any caller using the public header
   as a general uint32 parser, is silently rejected.

Live userId/flags callers (`userId ∈ [0, 10738]`, `CRYPTO_FLAG_EL1..EL5` =
1, 2, 4, 8, 16) stay below the cut — an API domain lie, not a demonstrated
field crash.

## Impact

| Witness | Input | Actual | Expected |
|---|---|---|---|
| Fencepost | `"2147483647"` | `false`, out-param unchanged | `true`, `INT32_MAX` |
| Neighbor | `"2147483646"` | `true` | `true` |
| uint32 max | `"4294967295"` | `false` (`StrToInt` fails) | `true`, `UINT32_MAX` |

Valid `uint32` decimals in the upper half are rejected with no error
distinction from malformed input; the CLI reports a parameter error and
`ReadDigitDir` silently skips entries. Medium: silent wrong result, no crash
or OOB.

## How PBT Detected This

`services/storage_daemon/utils/test/string_to_uint32_pbt_test.cpp` — links
the REAL `file_utils.cpp` (not a model). Oracle: `to_string` /
`std::from_chars` on `uint32_t`.

| Property | Result |
|---|---|
| `UserIdRangeToStringRoundTrip` (`[0, 10738]`) | PASS |
| `CryptoFlagsToStringRoundTrip` | PASS |
| `Uint32ToStringRoundTrip` | **FAIL** `"2147483647"` |
| `AgreesWithFromCharsOnDecimal` | **FAIL** same witness |
| `EmptyAndNonNumericRejected` | PASS |
| `regression_int32_max` / `regression_uint32_max` | FAIL |

```bash
# serial reconfirm
PBT_TEST_JOBS=1 ./string_to_uint32_pbt_test
```

## Suggested Fix

Parse as unsigned; keep the existing `empty` / `IsNumericStr` gates:

```diff
-    int value;
-    if (!StrToInt(str, value)) {
-        LOGE("... String to int convert failed");
+    errno = 0;
+    char *end = nullptr;
+    unsigned long val = strtoul(str.c_str(), &end, 10);
+    if (end == str.c_str() || *end != '\0' || errno == ERANGE || val > UINT32_MAX) {
+        LOGE("... value out of range");
         return false;
     }
-    if (value < 0 || value >= INT32_MAX) {
-        LOGE("... value out of range");
-        return false;
-    }
-    num = static_cast<uint32_t>(value);
+    num = static_cast<uint32_t>(val);
```

(needs `<cerrno>` / `<cstdlib>` if not already pulled in). After the fix:
`"2147483647"` / `"4294967295"` succeed; userIds and flags `1..16`
unchanged; empty / non-numeric still `false`.

## References

- Bug: `file_utils.cpp:430-451`; header contract: `file_utils.h:51`
- Sibling (typed parse, same file): `StringToBool` `:454`
- Not this ticket: `ConvertStringToInt32` (`string_utils.cpp:311` — signed, own fencepost)
- Callers: `sdc.cpp:62-66`; `ReadDigitDir` `file_utils.cpp:530`
- PBT: `services/storage_daemon/utils/test/string_to_uint32_pbt_test.cpp`
- Internal issue: `DTS2026082537775` (fixed in internal system; this fork may still show pre-fix code)
