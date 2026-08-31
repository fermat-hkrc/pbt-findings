---
id: OH-2026-AVCODEC-004
date: "2026-08-20"
repo: multimedia_av_codec
repo_url: https://gitcode.com/openharmony/multimedia_av_codec
title: "[Bug]: GraphicPixelFmtToVideoPixelFmt maps YCRCB_P010 to NV12 (should be NV21)"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/capi/avcodec/preprocessor_format_utils.cpp
file_paths:
  - frameworks/native/capi/avcodec/preprocessor_format_utils.cpp
  - frameworks/native/capi/avcodec/preprocessor_manager.cpp
  - frameworks/native/capi/avcodec/preprocessor_encoder.cpp
author: Toan
internal_issue_id: DTS2026082007640
language: C++
---

## Summary

`GraphicPixelFmtToVideoPixelFmt` (GraphicPixelFormat → VideoPixelFormat, used
by the preprocessor) collapses both 10-bit P010 variants into a single `case`
arm that hard-codes `NV12`. A `GRAPHIC_PIXEL_FMT_YCRCB_P010` buffer (CrCb
order, i.e. NV21-order) is therefore reported as `NV12`. Copy-paste defect:
the function's own 8-bit arms ten lines above split the pair correctly
(`YCRCB_420_SP → NV21`), and the sibling forward map
(`ConvertVideoPixelFormat2GraphicPixelFormat`) emits `YCRCB_P010` **only** for
`NV21` + Main10 — so the unambiguous reverse is `NV21`. Effect: chroma
channels (U/V) swap → red/blue-ish tint on 10-bit NV21/YCRCB surfaces, no hard
failure. Confirmed and fixed by developers (`DTS2026082007640`).

## Vulnerable Code

`frameworks/native/capi/avcodec/preprocessor_format_utils.cpp` (~21–46):

```cpp
// 10-bit formats (HEVC Main10 profile)
case GraphicPixelFormat::GRAPHIC_PIXEL_FMT_YCBCR_P010:
case GraphicPixelFormat::GRAPHIC_PIXEL_FMT_YCRCB_P010:
    outVideoFmt = VideoPixelFormat::NV12;  // "P010 maps to NV12 in codec context"
    return true;
```

The comment erases the CrCb/CbCr distinction the sibling forward map preserves
(`preprocessor.cpp:660–679`):

```cpp
case VideoPixelFormat::NV21:
    return is10BitData ? GraphicPixelFormat::GRAPHIC_PIXEL_FMT_YCRCB_P010
                       : GraphicPixelFormat::GRAPHIC_PIXEL_FMT_YCRCB_420_SP;
// NV12 → YCBCR_P010 / YCBCR_420_SP
```

Round-trip proof of the bug: `NV21` → (forward) `YCRCB_P010` → (reverse)
`NV12` ≠ `NV21`. Header contract states the function is the **reverse** of the
forward map. In-file oracle: the 8-bit arms (`YCRCB_420_SP → NV21`) already
implement the chroma-order invariant. Other P010 consumers
(`cpu_image_processor.cpp`, `fast_kits_interface.cpp`) only do layout/row-bytes
checks where chroma order is irrelevant — no contradiction.

## Trigger Conditions

1. Surface buffer reports `format = GRAPHIC_PIXEL_FMT_YCRCB_P010` (10-bit NV21
   / HEVC Main10 CrCb).
2. `FillStreamDescription` (`preprocessor_manager.cpp` ~706) or the encoder
   input-format override (`preprocessor_encoder.cpp` ~954) calls the mapping.
3. `VIDEO_PIXEL_FORMAT` is published as `NV12` while the buffer memory layout
   is CrCb (NV21-order) 10-bit.

8-bit `YCRCB_420_SP` is unaffected (its arm is correct).

## Impact

- Downstream consumers that trust `VIDEO_PIXEL_FORMAT` for chroma plane order
  swap U/V on 10-bit NV21/YCRCB surfaces — wrong colors (red↔blue tint)
  without a hard failure.
- Encoder stream description mislabels the input format.
- Medium: silent wrong result on the message/description path; no crash/OOB.

## Minimal Counterexample

| Input | Expected | Actual |
|-------|----------|--------|
| `GRAPHIC_PIXEL_FMT_YCRCB_P010` | `true`, `NV21` | `true`, `NV12` |
| `GRAPHIC_PIXEL_FMT_YCBCR_P010` | `true`, `NV12` | OK |
| `GRAPHIC_PIXEL_FMT_YCRCB_420_SP` (8-bit control) | `true`, `NV21` | OK |

## How PBT Detected This

`pbt-native/graphicpixelfmttovideopixelfmt_pbt_test` — links the REAL
`preprocessor_format_utils.cpp` (not a model):

| Test | Result |
|-------|--------|
| `DifferentialVsSiblingBackedSpec` | **FAIL** (shrunk `int: 6` = `YCRCB_P010`) |
| `P010ChromaOrderMustRemainDistinct` | **FAIL** |
| `YcrcbP010MustMapToNv21NotNv12` | **FAIL** (`NV12` vs `NV21`) |
| Mapped/8-bit/determinism controls | PASS |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target graphicpixelfmttovideopixelfmt_pbt_test
RC_PARAMS="max_success=1000" ./pbt-native/build/graphicpixelfmttovideopixelfmt_pbt_test \
  --gtest_filter='*YcrcbP010*:*P010Chroma*:*DifferentialVsSibling*'
```

## Suggested Fix

Split the P010 arms to mirror the 8-bit arms and the forward sibling:

```diff
         // 10-bit formats (HEVC Main10 profile)
         case GraphicPixelFormat::GRAPHIC_PIXEL_FMT_YCBCR_P010:
-        case GraphicPixelFormat::GRAPHIC_PIXEL_FMT_YCRCB_P010:
             outVideoFmt = VideoPixelFormat::NV12;  // P010 maps to NV12 in codec context
             return true;
+        case GraphicPixelFormat::GRAPHIC_PIXEL_FMT_YCRCB_P010:
+            outVideoFmt = VideoPixelFormat::NV21;  // mirror 8-bit YCRCB_420_SP → NV21
+            return true;
```

No caller changes. After fix: round-trip `NV21 → YCRCB_P010 → NV21` holds;
all three failing properties flip to PASS.

## References

- Bug: `preprocessor_format_utils.cpp` (`GraphicPixelFmtToVideoPixelFmt`)
- Forward sibling: `preprocessor.cpp`
  (`ConvertVideoPixelFormat2GraphicPixelFormat` ~660)
- Callers: `preprocessor_manager.cpp` (`FillStreamDescription` ~706),
  `preprocessor_encoder.cpp` (~954)
- Same class: OH-2026-PLAYER-003 (miscopied operand / wrong-base arithmetic)
- PBT: `pbt-native/graphicpixelfmttovideopixelfmt_pbt_test.cpp`
- Internal issue: `DTS2026082007640`
