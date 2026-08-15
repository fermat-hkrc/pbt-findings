---
id: OH-2026-PLAYER-002
date: "2026-08-13"
repo: multimedia_player_framework
repo_url: https://gitcode.com/openharmony/multimedia_player_framework
title: "[Bug]: TransRecorderStatus muxer map missing START + duplicate STOP key"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/utils/media_utils.cpp
file_paths:
  - services/utils/media_utils.cpp
  - services/engine/histreamer/recorder/hirecorder_impl.cpp
author: Toan
internal_issue_id: DTS2026081318473
language: C++
---

## Summary

`TransRecorderStatus` static map `recorder_statusPair` has a copy-paste row
that keys `ERROR_MUXER_STOP_FAILED` to `MSERR_MUXER_START_FAILED`, then a
second STOP→STOP row that `unordered_map` **ignores** (first insert wins).
There is **no** `ERROR_MUXER_START_FAILED` key.

Result: muxer **stop** failures are reported as **start** failed; muxer
**start** failures fall through to generic `MSERR_FRAMEWORK_ERROR`. Sibling
AUD/VID START/STOP rows in the same map are correct. Not High: wrong error
code on failure path only — no crash/UB. Confirmed and fixed by developers
(`DTS2026081318473`).

## Vulnerable Code

`services/utils/media_utils.cpp` — `recorder_statusPair` (~71), lookup
`TransRecorderStatus` (~269):

```cpp
{Status::ERROR_MUXER_FAILED, MSERR_MUXER_FAILED},
{Status::ERROR_MUXER_INIT_FAILED, MSERR_MUXER_INIT_FAILED},
{Status::ERROR_MUXER_STOP_FAILED, MSERR_MUXER_START_FAILED},  // BUG: key should be START
{Status::ERROR_MUXER_STOP_FAILED, MSERR_MUXER_STOP_FAILED},  // duplicate key; insert ignored
```

Callers: `hirecorder_impl.cpp` — every pipeline status surface
(`Start`/`Stop`/`Pause`/`Resume`/`HandleStopOperation`/…) goes through
`TransRecorderStatus(...)`.

Root cause: copy-paste wrong key on first muxer lifecycle row; duplicate STOP
never replaces it. Same class as cubic-resampler wrong-field dump (miscopied
operand).

## Trigger Conditions

1. Recorder pipeline surfaces `ERROR_MUXER_STOP_FAILED` or
   `ERROR_MUXER_START_FAILED`.
2. `TransRecorderStatus` looks up `recorder_statusPair`.
3. STOP → wrong START code; START → unmapped → `MSERR_FRAMEWORK_ERROR`.

## Impact

- Apps/DFX see **“Muxer start failed”** (`MSERR_MUXER_START_FAILED`, -28) on a
  real **stop** failure instead of `MSERR_MUXER_STOP_FAILED` (-29).
- Real **start** failure loses the dedicated code → generic
  `MSERR_FRAMEWORK_ERROR` (-30); JS/ext mapping and logs lose the specific
  fault.
- Reachable on all hirecorder status returns. Not a crash; wrong diagnostic /
  API error only → Medium.

## Minimal Counterexample

| Input `Status` | Expected `MSERR_*` | Actual |
|----------------|--------------------|--------|
| `ERROR_MUXER_STOP_FAILED` | `MSERR_MUXER_STOP_FAILED` (**-29**) | `MSERR_MUXER_START_FAILED` (**-28**) |
| `ERROR_MUXER_START_FAILED` | `MSERR_MUXER_START_FAILED` (**-28**) | `MSERR_FRAMEWORK_ERROR` (**-30**) |
| `ERROR_AUD_START_FAILED` (control) | `MSERR_AUD_START_FAILED` | OK (sibling) |

## How PBT Detected This

`pbt-native/trans_recorder_status_pbt_test` — links REAL
`services/utils/media_utils.cpp` (not a model):

| Test | Result |
|------|--------|
| `EncoderAndMuxerFamiliesRespectNameSymmetry` | **FAIL** (`-30 == -28` on START) |
| Image / default-arm / mapped-spec / determinism | PASS |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build --target trans_recorder_status_pbt_test -j
./pbt-native/build/trans_recorder_status_pbt_test \
  --gtest_filter='TransRecorderStatus.EncoderAndMuxerFamiliesRespectNameSymmetry'
```

Local contract: every `ERROR_<FAM>_{START,STOP}_FAILED` key must map to
matching `MSERR_<FAM>_{START,STOP}_FAILED` — AUD/VID already do; MUXER must
follow.

## Suggested Fix

```diff
     {Status::ERROR_MUXER_FAILED, MSERR_MUXER_FAILED},
     {Status::ERROR_MUXER_INIT_FAILED, MSERR_MUXER_INIT_FAILED},
-    {Status::ERROR_MUXER_STOP_FAILED, MSERR_MUXER_START_FAILED},
-    {Status::ERROR_MUXER_STOP_FAILED, MSERR_MUXER_STOP_FAILED},
+    {Status::ERROR_MUXER_START_FAILED, MSERR_MUXER_START_FAILED},
+    {Status::ERROR_MUXER_STOP_FAILED, MSERR_MUXER_STOP_FAILED},
```

One key correction; delete the duplicate. No caller changes. After fix:
name-symmetry property → PASS.

## References

- Bug: `services/utils/media_utils.cpp` (`recorder_statusPair` /
  `TransRecorderStatus`)
- Callers: `hirecorder_impl.cpp` (all pipeline status returns)
- Sibling oracle: same-map AUD/VID START/STOP rows
- Same class: OH-2026-GFX-008 (copy-paste wrong field)
- PBT: `pbt-native/trans_recorder_status_pbt_test.cpp`
- Internal issue: `DTS2026081318473`
