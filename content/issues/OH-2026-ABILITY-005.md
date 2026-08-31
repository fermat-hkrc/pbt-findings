---
id: OH-2026-ABILITY-005
date: "2026-08-22"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: ConvertStringToUint32 parses with signed stoi (drops >INT_MAX, accepts \"8a\" and \"-1\")"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/ability/native/resource_config_helper.cpp
file_paths:
  - frameworks/native/ability/native/resource_config_helper.cpp
  - frameworks/native/ability/native/ability_thread/main_thread.cpp
author: Toan
internal_issue_id: DTS2026082254944
language: C++
---

## Summary

`ResourceConfigHelper::ConvertStringToUint32` is named and typed as
**string → `uint32_t`** — callers apply the out-param only on `true`
(`SetMcc` / `SetMnc` / `SetThemeId` / …). The body is `std::stoi` plus a
`uint32_t` cast: a **signed int** parse behind an unsigned contract. Three
distinct failures from one line: values above `INT_MAX` (valid `uint32`) are
rejected; trailing garbage after a digit prefix is accepted; a leading `-` is
accepted and wraps to a huge value. MCC/MNC/theme IDs are silently dropped or
corrupted. No crash. Confirmed and fixed by developers (`DTS2026082254944`).

## Vulnerable Code

`frameworks/native/ability/native/resource_config_helper.cpp` (188–197):

```cpp
bool ResourceConfigHelper::ConvertStringToUint32(std::string source, uint32_t &result)
{
    try {
        result = static_cast<uint32_t>(std::stoi(source));
    } catch (...) {
        return false;
    }
    return true;
}
```

`stoi` stops at the first non-digit, accepts a sign, and throws on values that
do not fit in `int` — three silent contract violations for an unsigned
full-consume parse.

## Trigger Conditions

1. `UpdateResConfig` / `MainThread` feed SYSTEM_MCC / SYSTEM_MNC / theme
   strings through this gate.
2. A value above `2147483647` (valid uint32) throws → `false` → ID dropped.
3. A malformed string like `"8a"` parses as 8 → accepted with the prefix; or
   `"-1"` wraps to `4294967295`.

## Impact

| Witness | Input | Actual | Expected |
|---|---|---|---|
| Above `INT_MAX` | `"2147483648"` | `false` (throw) | `true`, `2147483648` |
| Prefix leftover | `"8a"` | `true`, `8` | `false` |
| Leading minus | `"-1"` | `true`, `4294967295` | `false` |

Theme ID or MCC above `INT_MAX` silently dropped; malformed input becomes a
wrong ID. Medium: silent wrong result / rejection, no crash or OOB.

## How PBT Detected This

`pbt-native/convert_string_to_uint32_pbt_test` — links the REAL
`resource_config_helper.cpp` (not a model). Oracle: unsigned full-consume
decimal in `[0, UINT32_MAX]`.

| Case | Result |
|------|--------|
| `to_string(n)` for `n > INT_MAX` | **FAIL** (false) |
| leftover after prefix | **FAIL** (true + prefix) |
| leading `-` | **FAIL** (true + wrap) |
| `"42"` and in-range controls | PASS |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target convert_string_to_uint32_pbt_test
./pbt-native/build/convert_string_to_uint32_pbt_test
```

## Suggested Fix

Unsigned full-consume parse via `strtoul` with explicit validation:

```diff
 bool ResourceConfigHelper::ConvertStringToUint32(std::string source, uint32_t &result)
 {
-    try {
-        result = static_cast<uint32_t>(std::stoi(source));
-    } catch (...) {
-        TAG_LOGW(AAFwkTag::ABILITY, "invalid source:%{public}s", source.c_str());
-        return false;
+    if (source.empty() || source[0] == '-' || source[0] == '+') {
+        return false;
     }
-    return true;
+    char *end = nullptr;
+    errno = 0;
+    unsigned long v = std::strtoul(source.c_str(), &end, 10);
+    if (errno == ERANGE || end == source.c_str() || *end != '\0' || v > UINT32_MAX) {
+        TAG_LOGW(AAFwkTag::ABILITY, "invalid source:%{public}s", source.c_str());
+        return false;
+    }
+    result = static_cast<uint32_t>(v);
+    return true;
 }
```

(needs `<cerrno>` / `<cstdlib>` if not already pulled in). After the fix:
`"2147483648"` succeeds; `"8a"` / `"-1"` fail; `"42"` unchanged.

## References

- Bug: `frameworks/native/ability/native/resource_config_helper.cpp:188-197`
- Callers: same file `:154-186`; `main_thread.cpp:1274-1282`
- PBT: `pbt-native/convert_string_to_uint32_pbt_test.cpp`
- Internal issue: `DTS2026082254944` (fixed in internal system)
