---
id: OH-2026-MEDIALIB-002
date: "2026-07-18"
repo: multimedia_media_library
repo_url: https://gitcode.com/openharmony/multimedia_media_library
title: "[Bug]: GetTimeIdFromUri uncaught stoi on empty / non-integer &offset="
cwe: CWE-248
cwe_name: Uncaught Exception
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/innerkitsimpl/media_library_helper/src/media_file_uri.cpp
file_paths:
  - frameworks/innerkitsimpl/media_library_helper/src/media_file_uri.cpp
  - frameworks/innerkitsimpl/media_library_manager/media_library_manager.cpp
  - pbt-native/media_file_uri_get_time_id_from_uri_pbt_test.cpp
author: Toan
internal_issue_id: DTS2026071806648
language: C++
---

## Summary

`MediaFileUri::GetTimeIdFromUri` (4-arg) read the documented `&offset=` query
value with `std::stoi` and no digit / full-consume gate. A present key whose
value is empty or not an `int` threw. The caller does not catch.

`GetAstcsByOffset` feeds `start`/`count` into `QueryTimeIdBatch` → SQL
`Limit(count, start)`. Public `GetBatchAstcs` routes here whenever the first
URI contains `CONST_ML_URI_OFFSET`. An app-supplied 2-URI ASTC batch with a
blank or non-integer `&offset=` aborted the helper instead of returning
`E_INVALID_URI`.

Confirmed and fixed (`DTS2026071806648`). Upstream
[!12693](https://gitcode.com/openharmony/multimedia_media_library/merge_requests/12693)
(`8059fa184`) added `MediaFileUtils::IsValidInteger` before `stoi`. PBT + host
UTs PASS on the merged tree.

## Vulnerable Code

`frameworks/innerkitsimpl/media_library_helper/src/media_file_uri.cpp` — 4-arg
`GetTimeIdFromUri` (pre-fix):

```cpp
if (indexEnd + string(CONST_ML_URI_OFFSET).length() <= uri.size()) {
    offset.emplace_back(stoi(uri.substr(indexEnd + string(CONST_ML_URI_OFFSET).length())));
}
```

The length check only asks whether the **key** fits. An empty value
(`...&offset=` at end of string) still passes. `stoi("")` / `stoi("A")` throw
`std::invalid_argument`. `stoi("2147483648")` throws `std::out_of_range`.
No `try`. `GetAstcsByOffset` / `GetBatchAstcs` do not catch.

## Trigger Conditions

1. Public `GetBatchAstcs` is called with a 2-URI ASTC batch.
2. Both URIs carry `&time_id=` and `&offset=`.
3. The offset value is empty, non-integer (`"A"`), or overflow (`"2147483648"`).

## Impact

| Witness | Offset | Pre-fix | After fix |
|---------|--------|---------|-----------|
| Empty | `""` (URI ends at `&offset=`) | `std::invalid_argument` | no throw; `start`/`count` untouched |
| Non-integer | `"A"` | `std::invalid_argument` | same |
| Overflow | `"2147483648"` | `std::out_of_range` | same |
| Valid | `"42"` | 42 | unchanged |

Medium: uncaught `stoi` aborts an `EXPORT` helper on app-supplied URI query.

## Minimal Counterexample

```cpp
std::vector<std::string> uriBatch = {
    "file://media/Photo/64/IMG_063/IMG_11311.jpg?oper=astc&width=256&height=256&time_id=&offset=",
    "file://media/Photo/64/IMG_063/IMG_11311.jpg?oper=astc&width=256&height=256&time_id=&offset=",
};
int32_t start = -1;
int32_t count = -1;
MediaFileUri::GetTimeIdFromUri(uriBatch, timeIdBatch, start, count);
// pre-fix: throws std::invalid_argument from stoi("")
```

Same throw with `"A"` or `"2147483648"` after `&offset=`.

## How PBT Detected This

`pbt-native/media_file_uri_get_time_id_from_uri_pbt_test.cpp` (real
`media_file_uri.cpp` SUT). Oracle: malformed offset must not throw;
`start`/`count` stay untouched.

| Case | Pre-fix | Post-fix |
|------|---------|----------|
| URI ends at `&offset=` | FAIL (throw) | PASS |
| `&offset=A` | FAIL (throw) | PASS |
| `&offset=2147483648` | FAIL (throw) | PASS |
| `&offset=42` | PASS | PASS |

Host UTs in `pbt-native/media_file_uri_get_time_id_from_uri_ut.cpp` (empty /
`"A"` / overflow) now PASS.

## Suggested Fix

Reuse sibling `MediaStringUtils::ConvertToInt` (`from_chars` + `ptr == end`)
and push only on success. Upstream instead gated with
`MediaFileUtils::IsValidInteger` then still `stoi`:

```cpp
if (!MediaFileUtils::IsValidInteger(uri.substr(indexEnd + string(CONST_ML_URI_OFFSET).length()))) {
    return;
}
offset.emplace_back(stoi(uri.substr(indexEnd + string(CONST_ML_URI_OFFSET).length())));
```

That closes the three throw witnesses. Partial tokens like `"42abc"` still
pass the gate (separate `IsValidInteger` ticket).

## References

- Bug: `frameworks/innerkitsimpl/media_library_helper/src/media_file_uri.cpp`
  (`GetTimeIdFromUri` 4-arg)
- Callers: `media_library_manager.cpp` (`GetAstcsByOffset`, `GetBatchAstcs`)
- Sibling parse: `common/utils/src/media_string_utils.cpp` (`ConvertToInt`)
- PBT: `pbt-native/media_file_uri_get_time_id_from_uri_pbt_test.cpp`
- Upstream PR: [!12693](https://gitcode.com/openharmony/multimedia_media_library/merge_requests/12693) (`8059fa184`)
- Internal issue: `DTS2026071806648`
- Local report: `multimedia_media_library/pbt-out/bug_reports/fixed/get_time_id_from_uri_stoi_throw.md`
