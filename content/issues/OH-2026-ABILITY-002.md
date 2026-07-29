---
id: OH-2026-ABILITY-002
date: "2026-07-18"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: DataUriUtils::IsNumber accepts floats; GetId silently truncates to integer prefix"
cwe: CWE-1287
cwe_name: Improper Validation of Specified Type of Input
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/ability/native/data_uri_utils.cpp
file_paths:
  - frameworks/native/ability/native/data_uri_utils.cpp
  - interfaces/kits/native/ability/native/data_uri_utils.h
  - frameworks/native/ability/native/ability.cpp
author: Toan
internal_issue_id: DTS2026071809730
language: C++
---

## Summary

`INTEGER_REGEX` accepts decimal floats via an optional fractional group, so
`IsNumber("12.5")` returns **true**. Public `GetId` gates on `IsNumber` and
returns `std::atoll(lastPath)`, which truncates the float to its integer
prefix: `"12.5"` → id `12` instead of `-1`.

Predicate-inversion correctness bug on a public DataAbility helper. Same class
as the accepted/fixed `ark::verifier::Range` empty-container predicate bug.
Confirmed and fixed by developers (`DTS2026071809730`).

## Vulnerable Code

`frameworks/native/ability/native/data_uri_utils.cpp`:

```cpp
const std::regex INTEGER_REGEX("^[-+]?([0-9]+)([.]([0-9]+))?$"); // line 27

long long DataUriUtils::GetId(const Uri &dataUri)
{
    // ...
    string lastPath = pathVector[pathVector.size() - 1];
    if (!IsNumber(lastPath)) { // gate passes for "12.5"
        return -1;
    }
    return std::atoll(lastPath.c_str()); // "12.5" → 12
}
```

Public API: `interfaces/kits/native/ability/native/data_uri_utils.h` (`GetId`).
In-tree caller: `Ability::ExecuteResultIndex` (`ability.cpp`) uses `GetId` on
DataAbility result URIs.

Root cause: the regex is named `INTEGER_REGEX` but the optional
`([.]([0-9]+))?` group makes any `<digits>.<digits>` match. `GetId` trusts
`IsNumber`, then `atoll` truncates without signaling.

## Trigger Conditions

1. A DataAbility returns a result URI whose last path segment is a float
   (e.g. `content://com.example.provider/items/12.5`).
2. Caller invokes public `DataUriUtils::GetId` (or `Ability::ExecuteResultIndex`
   does so for a non-empty result URI).
3. `IsNumber` accepts the segment; `atoll` returns the floor-truncated id.

No layer enforces integer-only segments. Fractional ids are uncommon in the
field, but the contract bug is reachable through the public API.

## Impact

- `GetId` returns a **floor-truncated** id for a fractional path segment instead
  of `-1` (not-a-number). Callers cannot distinguish "valid id 12" from
  "truncated from 12.5".
- DataAbility consumers that round-trip a URI through `AttachId` / `GetId`
  with a non-integer segment see a silently wrong id — index mis-selection in
  `ExecuteResultIndex`, or wrong row addressing if used as a DB key.
- No crash, no security bypass: public-API contract correctness bug → MEDIUM.

## Minimal Counterexample

| input | INTEGER_REGEX | IsNumber | atoll / GetId |
|-------|---------------|----------|---------------|
| `"42"` | match | true | `42` (correct) |
| `"12.5"` | match | **true** | **`12` (defect)** |
| `"1.0"` | match | **true** | **`1` (defect)** |
| `"3.14"` | match | **true** | **`3` (defect)** |
| `"abc"` | no | false | `-1` (correct) |
| `"-7"` | match | true | `-7` (correct) |

RapidCheck shrink of `FloatNotIntegerId`: minimal witness `"0.0"`.

## How PBT Detected This

`pbt-native/data_uri_float_pbt_test` — SUT extracted **verbatim** from
production (`extract_data_uri_float.sh` lifts the exact regex string and
`GetId`/`IsNumber` bodies):

| Property | Result |
|----------|--------|
| `FloatNotIntegerId` | **FAIL** (shrinks to `"0.0"`) |
| `FloatAcceptedAndTruncated` | PASS (pins current wrong behavior) |
| `IntOk` | PASS |

```bash
cmake -B pbt-native/build pbt-native
cmake --build pbt-native/build -j$(nproc) --target data_uri_float_pbt_test
(cd pbt-native/build && ctest -R data_uri_float_pbt_test --output-on-failure)
```

## Suggested Fix

Tighten the regex to reject the fractional part:

```diff
- const std::regex INTEGER_REGEX("^[-+]?([0-9]+)([.]([0-9]+))?$");
+ const std::regex INTEGER_REGEX("^[-+]?[0-9]+$");
```

After this, `IsNumber("12.5")==false` → `GetId` returns `-1` for fractional
segments. Defense-in-depth alternative: replace `atoll` with a full-consume
`from_chars`/`strtoll` end-check so even a regex miss cannot truncate.

## References

- Bug: `frameworks/native/ability/native/data_uri_utils.cpp` (`INTEGER_REGEX`,
  `IsNumber`, `GetId`)
- Public API: `interfaces/kits/native/ability/native/data_uri_utils.h`
- Caller: `frameworks/native/ability/native/ability.cpp` (`ExecuteResultIndex`)
- PBT: `pbt-native/data_uri_float_pbt_test`,
  `pbt-native/scripts/extract_data_uri_float.sh`
- Cousin (same predicate-inversion class, fixed): `ark::verifier::Range`
  empty-container / `DTS2026062915131`
- Internal issue: `DTS2026071809730`
