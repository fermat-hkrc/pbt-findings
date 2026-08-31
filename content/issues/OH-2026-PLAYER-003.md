---
id: OH-2026-PLAYER-003
date: "2026-08-17"
repo: multimedia_player_framework
repo_url: https://gitcode.com/openharmony/multimedia_player_framework
title: "[Bug]: MSExtErrorToString subtracts the wrong enum base on the extend fall-through"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/common/media_errors.cpp
file_paths:
  - frameworks/native/common/media_errors.cpp
  - frameworks/js/recorder/recorder_callback_napi.cpp
  - frameworks/taihe/media/src/recoder_callback_taihe.cpp
author: Toan
internal_issue_id: DTS2026081703440
language: C++
---

## Summary

`MSExtErrorToString` (the human-string converter for `MediaServiceExtErrCode`)
correctly **guards** the extend band with `MSERR_EXT_EXTEND_START` (= 100) but
then **subtracts** the similarly-named `MSERR_EXTEND_START`
(`MS_ERR_OFFSET + 0xF000` = 331411456) — the extend base of the **other**
enum, `MediaServiceErrCode`. Copy-paste / name-collision defect: every unmapped
Ext code strictly above 100 emits a nonsense large-magnitude (usually negative)
offset — apps see `"extend error:-331411355"` instead of `"extend error:1"`.
Not High: diagnostic/message path only, no crash/UB; the 11 mapped codes
(0–9, 100) are unaffected. Confirmed and fixed by developers
(`DTS2026081703440`).

## Vulnerable Code

`frameworks/native/common/media_errors.cpp` (~560–570):

```cpp
std::string MSExtErrorToString(MediaServiceExtErrCode code)
{
    if (MSEXTERRCODE_INFOS.count(code) != 0) {
        return MSEXTERRCODE_INFOS.at(code);
    }
    if (code > MSERR_EXT_EXTEND_START) {
        // BUG: subtracts MediaServiceErrCode's MSERR_EXTEND_START
        // (331411456) instead of the matching Ext-enum base (100).
        return "extend error:" + std::to_string(static_cast<int32_t>(code - MSERR_EXTEND_START));
    }
    return "invalid error code:" + std::to_string(static_cast<int32_t>(code));
}
```

Sibling `MSErrorToString` in the same file (~547) does it correctly for
`MediaServiceErrCode`: guards with `MSERR_EXTEND_START`, subtracts
`MSERR_EXTEND_START` — matching base. The Ext function breaks the pattern.

Callers (live error-message path): non-video branch of
`RecorderCallbackNapi::SendErrorCallback`
(`frameworks/js/recorder/recorder_callback_napi.cpp`) and
`recoder_callback_taihe.cpp` put this string into the JS/app error callback.
In-tree unit tests only walk mapped `MSEXTERRCODE_INFOS` keys, so the extend
arm is never covered.

Arithmetic identity:

```
MSERR_EXTEND_START    = MS_ERR_OFFSET + 0xF000 = 331411456  // wrong base
MSERR_EXT_EXTEND_START = 100                                // correct base
101 - 331411456 = -331411355   // what production emits
101 - 100       = 1            // what the sibling shape requires
```

## Trigger Conditions

1. A caller passes a `MediaServiceExtErrCode` **not** in `MSEXTERRCODE_INFOS`
   and **strictly greater than** `MSERR_EXT_EXTEND_START` (100).
2. The extend fall-through computes the offset against the wrong enum base.
3. The wrong string reaches the JS/Taihe app error callback.

## Impact

- Every unmapped Ext code > 100 produces `"extend error:<huge negative>"` in
  the app-visible error message instead of the small non-negative delta from
  100 — misleading diagnostics, wrong error reporting.
- Mapped codes (`MSERR_EXT_OK` … `MSERR_EXT_UNSUPPORT`,
  `MSERR_EXT_EXTEND_START`) are unaffected; unit tests that only walk the map
  still pass.
- No crash, no wrong control flow → Medium.

## Minimal Counterexample

| Input `MediaServiceExtErrCode` | Numeric | Expected (sibling contract) | Actual |
|--------------------------------|---------|------------------------------|--------|
| `MSERR_EXT_EXTEND_START + 1` | **101** | `"extend error:1"` | `"extend error:-331411355"` |
| `MSERR_EXT_EXTEND_START + 100` | **200** | `"extend error:100"` | `"extend error:-331411256"` |
| `MSERR_EXT_UNSUPPORT` (control) | **9** | `"unsupport interface"` | OK |
| `MSERR_EXT_EXTEND_START` (control) | **100** | `"extend err start"` | OK |

## How PBT Detected This

`pbt-native/ms_ext_error_to_string_pbt_test` — links REAL
`frameworks/native/common/media_errors.cpp` (not a model; `nm` confirms the
production symbol):

| Test | Result |
|------|--------|
| `ExtendBranchUsesExtBase` | **FAIL** (`"extend error:-331411355" == "extend error:1"` after 1 test) |
| `ExtendOffsetEqualsDelta` (metamorphic) | **FAIL** |
| `WitnessExtend101Offset` / `WitnessExtend200Offset` | **FAIL** |
| Core-spec differential / totality / determinism / non-extend shape / OK+EXTEND_START mapped / gap-invalid | PASS |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build --target ms_ext_error_to_string_pbt_test -j
./pbt-native/build/ms_ext_error_to_string_pbt_test --rc-max-success=1000
```

Local contract (sibling oracle): for `code > MSERR_EXT_EXTEND_START`, the
fall-through must emit `"extend error:" + (code - MSERR_EXT_EXTEND_START)`,
exactly as `MSErrorToString` subtracts its own matching base.

## Suggested Fix

One token in the subtraction:

```diff
     if (code > MSERR_EXT_EXTEND_START) {
-        return "extend error:" + std::to_string(static_cast<int32_t>(code - MSERR_EXTEND_START));
+        return "extend error:" + std::to_string(static_cast<int32_t>(code - MSERR_EXT_EXTEND_START));
     }
```

No caller changes. After fix: all four failing properties flip to PASS; the
already-green mapped/non-extend properties stay green.

## References

- Bug: `frameworks/native/common/media_errors.cpp` (`MSExtErrorToString`)
- Sibling oracle: same-file `MSErrorToString` (matching-base pattern)
- Enum base: `MSERR_EXT_EXTEND_START = 100` (`media_core.h`,
  `MediaServiceExtErrCode`); `MSERR_EXTEND_START = MS_ERR_OFFSET + 0xF000`
  belongs to `MediaServiceErrCode`
- Callers: `recorder_callback_napi.cpp`, `recoder_callback_taihe.cpp`
  (non-video `SendErrorCallback` branches)
- Same class: OH-2026-PLAYER-002 (miscopied operand / copy-paste)
- PBT: `pbt-native/ms_ext_error_to_string_pbt_test.cpp`
- Internal issue: `DTS2026081703440`
