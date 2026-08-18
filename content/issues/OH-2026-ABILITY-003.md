---
id: OH-2026-ABILITY-003
date: "2026-07-25"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: DialogAbilityInfo::ParseURI — catch path indexes uriVec past the end after last-field stoi failure"
cwe: CWE-125
cwe_name: Out-of-bounds Read
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/abilitymgr/src/dialog_session/dialog_session_info.cpp
file_paths:
  - services/abilitymgr/src/dialog_session/dialog_session_info.cpp
author: Toan
internal_issue_id: DTS2026072514260
language: C++
---

## Summary

`DialogAbilityInfo::ParseURI` splits a dialog-session URI into 11 fields and
parses 8 of them with `std::stoi(uriVec[index++])`. The argument is evaluated
**before** `stoi` runs, so on failure of the **last** numeric field `index`
already equals `MEMBER_NUM` (11) while `uriVec.size() == 11`. The catch block
then logs `uriVec[index++]` — one past the end.

Production uses `operator[]`, so the read is **UB** (not a guaranteed abort);
ASan/hardened builds can crash the AMS dialog unmarshall path. A malformed or
hostile parcel string reaching `ReadFromParcel` triggers the bug. Confirmed
and fixed by developers (`DTS2026072514260`).

## Vulnerable Code

`services/abilitymgr/src/dialog_session/dialog_session_info.cpp` (~36–64):

```cpp
int index = 0;
bundleName = uriVec[index++];
// … moduleName, abilityName …
try {
    bundleIconId = stoi(uriVec[index++]);
    // … six more stoi fields …
    multiAppMode.maxCount = stoi(uriVec[index++]); // index → MEMBER_NUM, then stoi may throw
} catch (...) {
    TAG_LOGW(..., uriVec[index++].c_str()); // index == MEMBER_NUM → past end
    return false;
}
```

`TAG_LOGW` → `HILOG_IMPL` evaluates format arguments, so the bad index is not
dead code under production logging macros. Caller: `DialogSessionInfo::ReadFromParcel`
(dialog session IPC unmarshalling, ~84 and ~100).

## Trigger Conditions

1. Dialog session IPC parcel carries a URI string whose **last** field is
   non-numeric, e.g. `com.ex/entry/Main/1/2/3/4/1/0/0/x` (11 segments).
2. Last `stoi` argument evaluation advances `index` to 11, then throws.
3. Catch logs `uriVec[11]` with `uriVec.size() == 11` → OOB read.

Benign AMS `GetURI()` output uses `to_string` digits only, so well-formed
round-trips are safe; a malformed/hostile parcel string (or any future
`ParseURI` caller) hits the bug.

## Impact

- OOB read (UB) on the error path of dialog session IPC unmarshalling; in
  ASan/hardened builds a process abort instead of the intended soft
  `return false`.
- Mid-field bad `stoi` stays in-bounds but logs the **next** field's token
  rather than the failed one — misleading diagnostics.
- No auth/logic bypass; memory-safety defect on an error path → MEDIUM.

## Minimal Counterexample

```
uri = "com.ex/entry/Main/1/2/3/4/1/0/0/x"   // 11 segments; last not int
// after last stoi arg eval: index == 11, uriVec.size() == 11

Production: catch → uriVec[11]   // operator[] UB
Harness SUT: catch → uriVec.at(11) → std::out_of_range
Expected:   ParseURI → false, no throw, no OOB
```

| Test | Result |
|------|--------|
| `LastFieldBadStoi_MustReturnFalseNoThrow` | **FAIL** (throws `std::out_of_range`) |
| `LastFieldBadStoi_OobInCatch` | PASS (documents throw under `.at`) |
| `MidFieldBadStoiNeverThrows` / mid regression | PASS |
| Round-trip good URIs | PASS |

## How PBT Detected This

`pbt-native/dialog_ability_info_uri_pbt_test` — links the real
`DialogAbilityInfo::ParseURI` logic with the catch-path access mapped to
`.at()` so the latent OOB becomes a deterministic failure:

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target dialog_ability_info_uri_pbt_test
./pbt-native/build/dialog_ability_info_uri_pbt_test --gtest_filter='*LastField*'
```

## Suggested Fix

Log the failed token with a valid index instead of advancing past the end:

```diff
 } catch (...) {
-    TAG_LOGW(..., uriVec[index++].c_str());
+    if (index > 0 && static_cast<size_t>(index - 1) < uriVec.size()) {
+        TAG_LOGW(AAFwkTag::DIALOG, "stoi(%{public}s) failed", uriVec[index - 1].c_str());
+    } else {
+        TAG_LOGW(AAFwkTag::DIALOG, "stoi failed");
+    }
     return false;
 }
```

Or parse with `from_chars` / no-throw conversion so the catch is unnecessary.

## References

- Bug: `services/abilitymgr/src/dialog_session/dialog_session_info.cpp`
  (`DialogAbilityInfo::ParseURI`)
- Caller: `DialogSessionInfo::ReadFromParcel` (dialog session IPC)
- PBT: `pbt-native/dialog_ability_info_uri_pbt_test.cpp`
- Internal issue: `DTS2026072514260` (fixed in internal system)
