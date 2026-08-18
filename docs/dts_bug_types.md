# DTS Tickets by Bug Type

Categorization of [`content/issues/`](../content/issues/) findings that carry a **DTS** ticket (`internal_issue_id`), grouped by **bug type** (failure mode), not by component.

- **DTS tickets**: **52**
- **Status**: all listed tickets are `CONFIRMED_FIXED`
- **Severity**: HIGH=14, MEDIUM=36, LOW=2
- **Precision** (decided DTS): **87.0%** (47 FIXED / 54 decided) — [`finding_precision_by_project.md`](finding_precision_by_project.md)
- **Generated**: 2026-08-14

## Overview

| Bug type | Count | HIGH | MEDIUM | LOW |
|----------|------:|-----:|-------:|----:|
| [Arithmetic — Integer Overflow / Underflow](#arithmetic-integer-overflow-underflow) | 7 | 0 | 7 | 0 |
| [Arithmetic — Incorrect Calculation](#arithmetic-incorrect-calculation) | 9 | 3 | 5 | 1 |
| [Arithmetic — Divide by Zero](#arithmetic-divide-by-zero) | 3 | 1 | 2 | 0 |
| [Arithmetic — Off-by-One](#arithmetic-off-by-one) | 3 | 1 | 2 | 0 |
| [Memory Safety — Buffer / OOB Access](#memory-safety-buffer-oob-access) | 4 | 1 | 3 | 0 |
| [Memory Safety — Null Pointer Dereference](#memory-safety-null-pointer-dereference) | 1 | 1 | 0 | 0 |
| [Memory Safety — Double Free](#memory-safety-double-free) | 1 | 0 | 1 | 0 |
| [Control Flow — Infinite Loop / Hang](#control-flow-infinite-loop-hang) | 3 | 0 | 3 | 0 |
| [Logic — Incorrect Control Flow](#logic-incorrect-control-flow) | 5 | 2 | 3 | 0 |
| [Logic — Incorrect Operator / Predicate](#logic-incorrect-operator-predicate) | 1 | 1 | 0 | 0 |
| [Logic — Unchecked Return Value](#logic-unchecked-return-value) | 1 | 0 | 1 | 0 |
| [Undefined Behavior](#undefined-behavior) | 2 | 1 | 1 | 0 |
| [State / Lifecycle — Incomplete Cleanup or Stuck State](#state-lifecycle-incomplete-cleanup-or-stuck-state) | 1 | 1 | 0 | 0 |
| [Input Validation — Improper Checks](#input-validation-improper-checks) | 3 | 0 | 2 | 1 |
| [Input Validation — Uncaught Exception / Crash on Bad Input](#input-validation-uncaught-exception-crash-on-bad-input) | 2 | 0 | 2 | 0 |
| [Input Validation — Path Traversal](#input-validation-path-traversal) | 1 | 0 | 1 | 0 |
| [Input Validation — Encoding / Unicode](#input-validation-encoding-unicode) | 1 | 0 | 1 | 0 |
| [Security — Authorization / Access Control](#security-authorization-access-control) | 2 | 1 | 1 | 0 |
| [Security — Certificate Validation](#security-certificate-validation) | 1 | 1 | 0 | 0 |
| [Security — Information Leakage](#security-information-leakage) | 1 | 0 | 1 | 0 |
| **Total** | **52** | **14** | **36** | **2** |

### By family

| Family | Count |
|--------|------:|
| Arithmetic & Numeric Bugs | 22 |
| Memory Safety | 6 |
| Control Flow & Logic | 13 |
| Input Validation | 7 |
| Security | 4 |

### By module

Count is this catalog (`CONFIRMED_FIXED` write-ups). **Precision** is `FIXED / (FIXED + NON-ISSUE)` from [`finding_precision_by_project.md`](finding_precision_by_project.md). `ylong_http` and `distributed_hardware_fwk` are 100% (1 FIXED / 0 NON-ISSUE write-ups here; not in that decided inventory).

| Module | Count | HIGH | MEDIUM | LOW | Precision |
|--------|------:|-----:|-------:|----:|----------:|
| `graphic_graphic_2d` | 8 | 2 | 5 | 1 | 100% |
| `arkui_ace_engine` | 7 | 4 | 3 | 0 | 86% |
| `multimedia_camera_framework` | 6 | 0 | 5 | 1 | 100% |
| `communication_netmanager_base` | 5 | 2 | 3 | 0 | 71% |
| `arkcompiler_runtime_core` | 4 | 0 | 4 | 0 | 100% |
| `multimedia_image_framework` | 4 | 1 | 3 | 0 | 100% |
| `ability_ability_runtime` | 2 | 0 | 2 | 0 | 100% |
| `distributeddatamgr_pasteboard` | 2 | 1 | 1 | 0 | 100% |
| `multimedia_av_codec` | 2 | 0 | 2 | 0 | 100% |
| `commonlibrary_rust_ylong_http` | 1 | 1 | 0 | 0 | 100% |
| `communication_wifi` | 1 | 0 | 1 | 0 | 100% |
| `distributeddatamgr_datamgr_service` | 1 | 0 | 1 | 0 | 100% |
| `distributedhardware_device_manager` | 1 | 1 | 0 | 0 | 100% |
| `distributedhardware_distributed_hardware_fwk` | 1 | 0 | 1 | 0 | 100% |
| `filemanagement_dfs_service` | 1 | 0 | 1 | 0 | 100% |
| `filemanagement_storage_service` | 1 | 0 | 1 | 0 | 100% |
| `multimedia_av_session` | 1 | 1 | 0 | 0 | 50% |
| `multimedia_media_foundation` | 1 | 1 | 0 | 0 | 33% |
| `multimedia_media_library` | 1 | 0 | 1 | 0 | 100% |
| `multimedia_player_framework` | 1 | 0 | 1 | 0 | 100% |
| `window_window_manager` | 1 | 0 | 1 | 0 | 100% |
| **Total** | **52** | **14** | **36** | **2** | **87%** |

## DTS index

| DTS | Issue ID | Bug type | Severity | Repo |
|-----|----------|----------|----------|------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | Security — Authorization / Access Control | HIGH | `communication_netmanager_base` |
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | Security — Certificate Validation | HIGH | `commonlibrary_rust_ylong_http` |
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | Arithmetic — Off-by-One | HIGH | `distributedhardware_device_manager` |
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | Arithmetic — Integer Overflow / Underflow | MEDIUM | `distributedhardware_distributed_hardware_fwk` |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | Arithmetic — Incorrect Calculation | MEDIUM | `arkui_ace_engine` |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | Logic — Incorrect Control Flow | HIGH | `arkui_ace_engine` |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | Arithmetic — Incorrect Calculation | MEDIUM | `arkui_ace_engine` |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | Logic — Incorrect Control Flow | HIGH | `arkui_ace_engine` |
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | Arithmetic — Incorrect Calculation | HIGH | `graphic_graphic_2d` |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | Arithmetic — Incorrect Calculation | MEDIUM | `graphic_graphic_2d` |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | Arithmetic — Incorrect Calculation | HIGH | `graphic_graphic_2d` |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | Arithmetic — Integer Overflow / Underflow | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | Arithmetic — Integer Overflow / Underflow | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | Security — Information Leakage | MEDIUM | `communication_netmanager_base` |
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | Input Validation — Improper Checks | LOW | `multimedia_camera_framework` |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | Arithmetic — Incorrect Calculation | HIGH | `arkui_ace_engine` |
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | Memory Safety — Buffer / OOB Access | HIGH | `multimedia_av_session` |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | Undefined Behavior | MEDIUM | `arkui_ace_engine` |
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | Undefined Behavior | HIGH | `communication_netmanager_base` |
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | Input Validation — Uncaught Exception / Crash on Bad Input | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | Memory Safety — Null Pointer Dereference | HIGH | `multimedia_media_foundation` |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | Input Validation — Uncaught Exception / Crash on Bad Input | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | Security — Authorization / Access Control | MEDIUM | `distributeddatamgr_pasteboard` |
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | Arithmetic — Divide by Zero | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | Arithmetic — Incorrect Calculation | MEDIUM | `graphic_graphic_2d` |
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | Control Flow — Infinite Loop / Hang | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | Logic — Incorrect Control Flow | MEDIUM | `ability_ability_runtime` |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | Memory Safety — Buffer / OOB Access | MEDIUM | `communication_wifi` |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | Memory Safety — Buffer / OOB Access | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | Input Validation — Improper Checks | MEDIUM | `ability_ability_runtime` |
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | State / Lifecycle — Incomplete Cleanup or Stuck State | HIGH | `distributeddatamgr_pasteboard` |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | Arithmetic — Divide by Zero | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | Input Validation — Path Traversal | MEDIUM | `distributeddatamgr_datamgr_service` |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | Arithmetic — Divide by Zero | HIGH | `arkui_ace_engine` |
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | Logic — Unchecked Return Value | MEDIUM | `filemanagement_dfs_service` |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | Input Validation — Improper Checks | MEDIUM | `filemanagement_storage_service` |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | Arithmetic — Integer Overflow / Underflow | MEDIUM | `window_window_manager` |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | Arithmetic — Integer Overflow / Underflow | MEDIUM | `multimedia_av_codec` |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | Arithmetic — Integer Overflow / Underflow | MEDIUM | `multimedia_image_framework` |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | Arithmetic — Integer Overflow / Underflow | MEDIUM | `multimedia_media_library` |
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | Memory Safety — Double Free | MEDIUM | `multimedia_player_framework` |
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | Input Validation — Encoding / Unicode | MEDIUM | `graphic_graphic_2d` |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | Memory Safety — Buffer / OOB Access | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | Control Flow — Infinite Loop / Hang | MEDIUM | `communication_netmanager_base` |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | Arithmetic — Off-by-One | MEDIUM | `multimedia_av_codec` |
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | Logic — Incorrect Operator / Predicate | HIGH | `multimedia_image_framework` |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | Logic — Incorrect Control Flow | MEDIUM | `graphic_graphic_2d` |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | Arithmetic — Off-by-One | MEDIUM | `graphic_graphic_2d` |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | Arithmetic — Incorrect Calculation | LOW | `graphic_graphic_2d` |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | Control Flow — Infinite Loop / Hang | MEDIUM | `communication_netmanager_base` |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | Arithmetic — Incorrect Calculation | MEDIUM | `multimedia_image_framework` |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | Logic — Incorrect Control Flow | MEDIUM | `multimedia_image_framework` |

## Arithmetic & Numeric Bugs

### Arithmetic — Integer Overflow / Underflow

Wraparound from overflow/underflow produces wrong bounds, IDs, or ranges (often silent).

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | MEDIUM | CWE-190 (Integer Overflow or Wraparound) | `dh_utils_tool` · `distributedhardware_distributed_hardware_fwk` | cJSON uint validators accept values that overflow the destination type due to wrap-around in static_cast |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | MEDIUM | CWE-191 (Integer Underflow (Wrap or Wraparound)) | `static_core/verification/util/range.h` · `arkcompiler_runtime_core` | Range(empty container) underflows to SIZE_MAX, reporting it contains every point |
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | MEDIUM | CWE-190 (Integer Overflow or Wraparound) | `static_core/verification/util/str.h` · `arkcompiler_runtime_core` | NumToStr(INT_MIN) triggers signed-overflow undefined behaviour in verifier diagnostic formatter |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | MEDIUM | CWE-191 (Integer Underflow (Wrap or Wraparound)) | `utils/include/window_helper.h` · `window_window_manager` | IsAspectRatioSatisfiedWithSizeLimits decor uint32 underflow rejects valid ratios |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | MEDIUM | CWE-190 (Integer Overflow or Wraparound) | `services/media_engine/plugins/source/http_source/hls/hls_segment_manager.cpp` · `multimedia_av_codec` | HLS segment byterange offset_+length_-1 wraps in uint32_t → dropped / wrong range |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | MEDIUM | CWE-190 (Integer Overflow or Wraparound) | `frameworks/innerkitsimpl/converter/src/post_proc.cpp` · `multimedia_image_framework` | PostProc::GetCropValue accepts OOB crops when top+height / left+width overflows int32 |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | MEDIUM | CWE-191 (Integer Underflow (Wrap or Wraparound)) | `common/utils/src/media_uri_utils.cpp` · `multimedia_media_library` | GetFileIdStr returns bucket name on bucket-only URI (npos+1 wrap) |

<details><summary>Summaries</summary>

- **OH-2026-DHFWK-001** (`DTS2026060814531`): `IsUInt8`, `IsUInt16`, and `IsUInt32` validate a `cJSON` number by casting `valueint` to the target unsigned type and then comparing the cast result against `UINT*_MAX`. That check is too late: the narrowing cast has already wrapped the ...
- **ARK-2026-INT-002** (`DTS2026062915131`): The container constructor of `ark::verifier::Range<Int>` computes `to_` as `cont.size() - 1`. When the container is empty, `cont.size()` returns `0` and the subtraction underflows in `size_t` unsigned arithmetic, producing `SIZE_MAX`. Th...
- **ARK-2026-INT-001** (`DTS2026062916398`): `ark::verifier::NumToStr(Int val, ...)` negates negative inputs before digit extraction. For the minimum signed integer (`INT_MIN` / `INT32_MIN`), the positive magnitude cannot be represented in the same signed type, so `val = -val` is s...
- **OH-2026-WM-001** (`DTS2026072347788`): `WindowHelper::IsAspectRatioSatisfiedWithSizeLimits` subtracts the decor frame from size-limit mins/maxes with bare `uint32_t` arithmetic. When `minWidth_`/`minHeight_` are below the decor frame (default mins = 1), the subtract underflow...
- **OH-2026-AVCODEC-001** (`DTS2026072438019`): `HlsSegmentManager::ConfigureAndDownload` computes the inclusive HTTP Range end as `playInfo.offset_ + playInfo.length_ - 1` with both fields **`uint32_t`**. When mathematical `offset + length > 2^32`, the sum wraps before widening to `i...
- **OH-2026-IMG-002** (`DTS2026072438492`): `PostProc::GetCropValue` classifies a crop with bare `int32_t` adds `top + height` and `left + width`. When the mathematical sum exceeds `INT32_MAX`, the sum wraps (signed overflow is UB; common compilers wrap) and often compares `<= siz...
- **OH-2026-MEDIALIB-001** (`DTS2026072454808`): `MediaUriUtils::GetFileIdStr` extracts the file-id segment with `tmp.substr(tmp.find_first_of('/') + 1)`. When the post-prefix remainder has **no** `/` (bucket-only URI `file://media/<bucket>`), `find_first_of` returns `npos`; `npos + 1`...

</details>

### Arithmetic — Incorrect Calculation

Wrong formula, operand, rounding, or matrix/color/geometry math that breaks invariants without a pure overflow CWE.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | HIGH | CWE-682 (Incorrect Calculation) | `rosen/modules/2d_graphics/include/utils/point3.h` · `graphic_graphic_2d` | Point3::operator+ uses wrong operands for X and Y, breaking vector-addition commutativity |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | HIGH | CWE-682 (Incorrect Calculation) | `rosen/modules/render_service_base/src/common/rs_color.cpp` · `graphic_graphic_2d` | RSColor::FromBgraInt union field-order mismatch with AsBgraInt corrupts every channel on BGRA round-trip |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | HIGH | CWE-682 (Incorrect Calculation) | `frameworks/core/components_ng/pattern/lazy_grid_layout/lazy_grid_layout_info.cpp` · `arkui_ace_engine` | LazyGridLayoutInfo::UpdatePosMapStart omits spaceWidth_ when rebasing from a non-zero start index |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | MEDIUM | CWE-682 (Incorrect Calculation) | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` · `arkui_ace_engine` | GridLayoutInfo::GetContentHeightOfRegularGrid returns negative height for empty grids with positive gap |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | MEDIUM | CWE-682 (Incorrect Calculation) | `frameworks/base/geometry/matrix4.cpp` · `arkui_ace_engine` | Matrix4::SetEntry uses opposite storage order from Get/Set, breaking off-diagonal round-trips |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | MEDIUM | CWE-682 (Incorrect Calculation) | `rosen/modules/2d_graphics/include/utils/rect.h` · `graphic_graphic_2d` | RectF::Round() rounds incorrectly for negative coordinates (x+0.5 truncate vs std::round) |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | MEDIUM | CWE-682 (Incorrect Calculation) | `rosen/modules/2d_graphics/include/utils/point3.h` · `graphic_graphic_2d` | Point3 operator* / operator/= truncate float channels via integer cast |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | MEDIUM | CWE-682 (Incorrect Calculation) | `frameworks/innerkitsimpl/converter/src/matrix.cpp` · `multimedia_image_framework` | Matrix::SetConcat multiplies translations in scale/translate fast path |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | LOW | CWE-682 (Incorrect Calculation) | `rosen/modules/2d_graphics/include/utils/sampling_options.h` · `graphic_graphic_2d` | CubicResampler::Dump writes cubicCoffB into the cubicCoffC field |

<details><summary>Summaries</summary>

- **OH-2026-GFX-001** (`DTS2026062430430`): `Point3::operator+` adds the wrong operands for the X and Y components. The X component is computed as `p1.x_ + p1.y_` (ignoring `p2.x_`), and the Y component as `p2.x_ + p2.y_` (ignoring `p1.y_`). Only the Z component is correct. As a r...
- **OH-2026-GFX-002** (`DTS2026062701168`): `RSColor::FromBgraInt` decodes a `uint32_t` using a union whose bit-field order is reversed relative to how `AsBgraInt` encodes it. Every channel is therefore swapped on the round-trip `FromBgraInt(AsBgraInt(c))`: alpha↔blue and red↔gree...
- **OH-2026-ARKUI-005** (`DTS2026070318488`): `LazyGridLayoutInfo::UpdatePosMapStart()` recalculates the position anchor for the start of the cached lazy-grid position map. When the map starts at index > 0 and has no predecessor entry, the first-branch formula uses only `estimateIte...
- **OH-2026-ARKUI-001** (`DTS2026061256925`): `GridLayoutInfo::GetContentHeightOfRegularGrid()` returns a negative content height when the grid has zero items and `mainGap` is positive. The empty-grid case falls through the modulo branch and subtracts `mainGap` from zero, violating ...
- **OH-2026-ARKUI-003** (`DTS2026062427183`): `Matrix4::SetEntry(row, col, value)` writes to `matrix4x4_[row][col]`, but `Matrix4::Get(row, col)` and `Matrix4::Set(row, col, value)` read/write `matrix4x4_[col][row]`. Off-diagonal writes therefore do not round-trip: a value written t...
- **OH-2026-GFX-003** (`DTS2026062516469`): `OHOS::Rosen::Drawing::RectF::Round()` converted each edge with `DrawingFloatSaturate2Int(x + 0.5f)` (truncate toward zero after adding half). That is nearest-integer only for **non-negative** values. For negative half-values (e.g. `-0.5...
- **OH-2026-GFX-004** (`DTS2026071430826`): `Point3` stores its components as floats (`scalar x_`, `y_`, `z_`), but its scale operators cast back through integers — `static_cast<int64_t>(x_ * scale)` in `operator*` / `operator*=`, and `static_cast<int>(x_ / divisor)` in `operator/...
- **OH-2026-IMG-005** (`DTS2026081126994`): `Matrix::SetConcat` scale/translate fast path (no rotate/skew) composes translation as `tx1*tx2+tx1` instead of `sx1*tx2+tx1`. Full rotate path in the same function uses correct `MulAddMul`. Wrong composed geometry (e.g. scale then trans...
- **OH-2026-GFX-008** (`DTS2026080530843`): `CubicResampler::Dump` formats both labeled fields from `cubicCoffB` — copy-paste wrong operand — so the `cubicCoffC:` slot always shows B. Debug/trace string only; no crash, no filter math. Sampling itself uses real fields (`GetCubicCof...

</details>

### Arithmetic — Divide by Zero

Missing zero-denominator guards leading to `SIGFPE` or non-finite results.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | HIGH | CWE-369 (Divide By Zero) | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` · `arkui_ace_engine` | GetIrregularHeight divides by zero → +inf content height when itemRatio == 0 |
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | MEDIUM | CWE-369 (Divide By Zero) | `services/camera_service/src/hcapture_session.cpp` · `multimedia_camera_framework` | SwitchBeautyValToDataShareVal divides by zero (SIGFPE) when ability range.size() == 1 |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | MEDIUM | CWE-369 (Divide By Zero) | `frameworks/native/camera/base/src/session/capture_session.cpp` · `multimedia_camera_framework` | sensor-exposure numerator/(denominator/1e6) SIGFPE when \|denominator\| < 1e6 |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-007** (`DTS2026072325132`): `GridLayoutInfo::GetIrregularHeight` estimates total lines as `(lastKnownLine + 1) / itemRatio` where `itemRatio = (FindEndIdx(lastKnownLine).itemIdx + 1) / childrenCount`. When the line is missing from `gridMatrix_`, `FindEndIdx` return...
- **OH-2026-CAM-002** (`DTS2026071428596`): `MultiBeautyType::SwitchBeautyValToDataShareVal` interpolates a beauty value across a discrete ability range using `range.size() - 1` as an integer divisor. When the ability range contains exactly **one** element (`range.size() == 1`), t...
- **OH-2026-CAM-004** (`DTS2026072011242`): Six camera-session call sites convert a HAL exposure-time rational `(numerator, denominator)` to microseconds with:

</details>

### Arithmetic — Off-by-One

Loop bounds or size comparisons that miss the last element or accept one-too-short inputs.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | HIGH | CWE-193 (Off-by-One Error) | `dm_random` · `distributedhardware_device_manager` | GeneratePinCode off-by-one loop condition returns short PIN ~16% of the time, causing intermittent pairing failure |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | MEDIUM | CWE-193 (Off-by-one Error) | `services/media_engine/plugins/source/http_source/hls/hls_tags.cpp` · `multimedia_av_codec` | UriDecode escape guard off-by-one decodes truncated %X as a control byte |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | MEDIUM | CWE-193 (Off-by-one Error) | `rosen/modules/render_service_base/include/common/rs_matrix3.h` · `graphic_graphic_2d` | Matrix3::IsNearEqual compares only 8 of 9 elements (data_ + 8) |

<details><summary>Summaries</summary>

- **OH-2026-DEVMGR-003** (`DTS2026052974442`): `GeneratePinCode(pinLength)` in `utils/src/dm_random.cpp:101` returns `pinLength - 1` characters approximately 1/pinLength of the time (~16% for 6-digit PINs). This causes device pairing to fail intermittently with no clear error.
- **OH-2026-AVCODEC-002** (`DTS2026072935286`): File-static `UriDecode` in `hls_tags.cpp` enters the `%XX` escape branch with guard `i + 2 <= uri.size()`, which only ensures **one** character after `%`. `substr(i+1, 2)` then yields a 1-char hex string; `IsHexValid` accepts a single he...
- **OH-2026-GFX-007** (`DTS2026080528903`): `Matrix3<T>::IsNearEqual` uses `std::equal(data_, data_ + 8, …)` — half-open **[0, 8)** — and skips **`data_[8]`** (`PERSP_2`). Matrices that differ only at the last slot compare near-equal → animation may settle early via `RSRenderAnima...

</details>

## Memory Safety

### Memory Safety — Buffer / OOB Access

Reads/writes past buffer limits; can crash (`SEGV`) or corrupt adjacent state.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | HIGH | CWE-787 (Out-of-bounds Read) | `utils/include/avsession_utils.h` · `multimedia_av_session` | GetAnonyTitle crashes (SEGV) on all-continuation-byte media titles via empty-vector OOB read |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | MEDIUM | CWE-125 (Out-of-bounds Read) | `wifi/utils/src/wifi_common_util.cpp` · `communication_wifi` | HexString2Byte missing null checks and source bounds — OOB read + null deref |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | MEDIUM | CWE-787 (Out-of-bounds Write) | `static_core/libarkfile/file_writer.cpp` · `arkcompiler_runtime_core` | MemoryBufferWriter WriteByte/WriteBytes/AppendRange past-capacity OOB write returns true |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | MEDIUM | CWE-125 (Out-of-bounds Read) | `frameworks/native/camera/base/src/output/photo_output.cpp` · `multimedia_camera_framework` | CAPTURE_MIRROR_SUPPORTED pair walk OOB on odd item.count |

<details><summary>Summaries</summary>

- **OH-2026-AVSESSION-001** (`DTS2026070722498`): `AVSessionUtils::GetAnonyTitle` anonymizes a media title for logging. It scans the title for UTF-8 character starts (bytes that are *not* continuation bytes) and records their positions in `char_positions`, then — in the short-text branc...
- **OH-2026-WIFI-001** (`DTS2026071806709`): `HexString2Byte(hex, buf, len)` decodes a hex string into a byte buffer. It takes a length only for the **output** buffer; the source extent is implicit and unchecked. `Hex2byte` reads `ipos[0]`/`ipos[1]` with no null check and no source...
- **ARK-2026-BUF-001** (`DTS2026071807957`): `MemoryBufferWriter::WriteByte` / `WriteBytes` / `AppendRange` compute the destination as `sp_.SubSpan(offset_, n)` with **no check** that `offset_ + n <= capacity`, then `memcpy_s`. Past-capacity writes return `true` and advance `offset...
- **OH-2026-CAM-005** (`DTS2026072717921`): Five copy-pasted sites walk `OHOS_CONTROL_CAPTURE_MIRROR_SUPPORTED` as `(mode, flag)` pairs with step 2, but bound only `i < item.count` and then always read `item.data.u8[i + 1]` (body and debug log). Odd `item.count` → last `i` has `i ...

</details>

### Memory Safety — Null Pointer Dereference

Missing null checks on paths that still reach a dereference.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | HIGH | CWE-476 (NULL Pointer Dereference) | `src/meta/format.cpp` · `multimedia_media_foundation` | Format::Stringify null-dereferences (SIGSEGV) on a PutIntBuffer entry |

<details><summary>Summaries</summary>

- **OH-2026-MF-001** (`DTS2026071309672`): `Format::Stringify` SIGSEGVs on any format that holds a value stored via the public setter `PutIntBuffer`. Two cooperating defects in `src/meta/format.cpp` cause it:

</details>

### Memory Safety — Double Free

Lifetime-owned pointer freed twice (e.g. explicit destroy + destructor).

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | MEDIUM | CWE-415 (Double Free) | `services/utils/xml_parse.cpp` · `multimedia_player_framework` | XmlParser::Destroy double-frees mDoc_ (destructor re-enters without null) |

<details><summary>Summaries</summary>

- **OH-2026-PLAYER-001** (`DTS2026072457284`): `XmlParser::Destroy` frees the libxml document via `xmlFreeDoc(mDoc_)` but does **not** clear `mDoc_`. The destructor **always** calls `Destroy()` again → second `xmlFreeDoc` on a dangling pointer → **double free / process abort**.

</details>

## Control Flow & Logic

### Control Flow — Infinite Loop / Hang

Exit conditions never met (often from unsigned wrap or truncated counters).

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | MEDIUM | CWE-835 (Loop with Unreachable Exit Condition ('Infinite Loop')) | `disassembler/disassembler.cpp` · `arkcompiler_runtime_core` | GetParams uint8_t loop eternal hang for argument counts in [256, 65535] |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | MEDIUM | CWE-835 (Loop with Unreachable Exit Condition ('Infinite Loop')) | `services/netmanagernative/bpf/src/bitmap_manager.cpp` · `communication_netmanager_base` | RfindIp6 unsigned underflow hang/OOB when startBytes == 0 miss |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | MEDIUM | CWE-835 (Loop with Unreachable Exit Condition ('Infinite Loop')) | `services/netmanagernative/bpf/src/bitmap_manager.cpp` · `communication_netmanager_base` | GetIp4AndMask uint32 step wrap → infinite loop when range ends at 255.255.255.255 |

<details><summary>Summaries</summary>

- **ARK-2026-LOOP-001** (`DTS2026071433052`): `Disassembler::GetParams` indexes its fill loop with `uint8_t i` while comparing against `uint32_t params_num` (bounded by `MAX_ARG_NUM = 0xFFFF`). When `params_num ∈ [256, 65535]`, `i` wraps at 255 → `i < params_num` is **perpetually tr...
- **OH-2026-NET-004** (`DTS2026072750511`): `IpParamParser::RfindIp6` scans IPv6 bytes downward with `for (uint32_t i = endBytes; i >= startBytes; --i)`. On a **miss** with `startBit < 8` (`startBytes == 0`), `--i` past 0 wraps to `UINT_MAX` → **infinite loop** and `s6_addr[UINT_M...
- **OH-2026-NET-005** (`DTS2026080608464`): `IpParamParser::GetIp4AndMask` expands a MULTIPLE_IP start–end range to CIDRs with `while (startIpInt <= endIpInt)` and `startIpInt += (1 << cidrBits)`. When the range ends at `255.255.255.255` (`0xFFFFFFFF`), the last step wraps to `0` ...

</details>

### Logic — Incorrect Control Flow

Wrong branch, sentinel, or iterator selection that returns success/identity incorrectly.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | HIGH | CWE-670 (Always-Incorrect Control Flow Implementation) | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` · `arkui_ace_engine` | GridLayoutInfo::FindInMatrix returns wrong iterator for index=0 when item 0 is absent |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | HIGH | CWE-670 (Always-Incorrect Control Flow Implementation) | `frameworks/core/components_ng/pattern/grid/grid_item_drag_manager.cpp` · `arkui_ace_engine` | GridItemDragManager::FindAvailableColumn returns 0 instead of -1 for impossible span when row is absent |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | MEDIUM | CWE-754 (Improper Check or Handling of Exceptional Conditions) | `frameworks/native/ability/native/ability_runtime/js_ui_ability.cpp` · `ability_ability_runtime` | Stage-model .abc path builder unguarded erase(rfind('.')) crashes app on extensionless srcEntrance |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | MEDIUM | CWE-670 (Always-Incorrect Control Flow Implementation) | `rosen/modules/2d_graphics/src/drawing/config/DrawingConfig.cpp` · `graphic_graphic_2d` | UpdateDrawingProperties permanent no-op (enum vs string list size) |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | MEDIUM | CWE-670 (Always-Incorrect Control Flow Implementation) | `frameworks/innerkitsimpl/utils/src/image_utils.cpp` · `multimedia_image_framework` | GetValidAlphaTypeByFormat missing RGBA_U16 case returns UNKNOWN |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-002** (`DTS2026061512035`): `GridLayoutInfo::FindInMatrix(0)` unconditionally returns `gridMatrix_.begin()` instead of searching for item `0`. When the matrix is non-empty but starts at a row index greater than `0`, `begin()` points to a row that does not contain i...
- **OH-2026-ARKUI-004** (`DTS2026062427889`): `GridItemDragManager::FindAvailableColumn(matrix, row, colSpan, crossCount)` returns the first free column for an item of width `colSpan` within a grid of `crossCount` columns. When the target `row` is absent from the matrix, the functio...
- **OH-2026-ABILITY-001** (`DTS2026071544397`): The Stage-model `.abc` path builder constructs the compiled-arkts path from the HAP's module name and `srcEntrance`, then strips the source extension by calling `srcPath.erase(srcPath.rfind("."))`. There is **no `npos` guard**. When the ...
- **OH-2026-GFX-006** (`DTS2026073129863`): `DrawingConfig::UpdateDrawingProperties` compares `DrawingDisableFlag::COUNT` (42) to `gDrawingDisableFlagStr.size()` (41) and early-returns on mismatch — so **no** `drawing.disable*` param is ever applied and all flags stay `false`. The...
- **OH-2026-IMG-004** (`DTS2026081128460`): `ImageUtils::GetValidAlphaTypeByFormat` normalizes alpha type for RGBA-like formats by falling through a `break` group and returning the caller’s `dstType`. `RGBA_F16` is in that group; **`RGBA_U16` is missing** and hits `default` → `IMA...

</details>

### Logic — Incorrect Operator / Predicate

Wrong operator/predicate flips a boolean or type tag.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | HIGH | CWE-480 (Use of Incorrect Operator) | `frameworks/innerkitsimpl/converter/src/matrix.cpp` · `multimedia_image_framework` | Matrix::SetTranslate tags IDENTITY when either axis is zero |

<details><summary>Summaries</summary>

- **OH-2026-IMG-003** (`DTS2026073015200`): `Matrix::SetTranslate` stores translation floats correctly but tags `operType = IDENTITY` when **either** axis is zero (`tx == 0 || ty == 0`). Dispatch keys off `operType`, so pure-X or pure-Y pans are treated as a **no-op** by `GetXYPro...

</details>

### Logic — Unchecked Return Value

Failed subroutine result ignored; caller continues with invalid state.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | MEDIUM | CWE-252 (Unchecked Return Value) | `frameworks/native/clouddiskservice_kit_inner/src/cloud_disk_common.cpp` · `filemanagement_dfs_service` | ChangesResult::ReadFromParcel ignores ChangeData::ReadFromParcel failure |

<details><summary>Summaries</summary>

- **OH-2026-DFS-001** (`DTS2026072326318`): `ChangesResult::ReadFromParcel` loops over parcel items and calls `changeData.ReadFromParcel(parcel)` but **discards the bool**. On any sub-field read failure it still `push_back`s a default/partial `ChangeData` and returns `true`. Outer...

</details>

### Undefined Behavior

Relies on UB (shift width, signed cast patterns) with environment-dependent fallout.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | HIGH | CWE-758 (Reliance on Undefined, Unspecified, or Implementation-Defined Behavior) | `services/netconnmanager/src/pac_functions.cpp` · `communication_netmanager_base` | CheckIpv4InNet /0 CIDR mask via undefined behavior (1<<32), silently bypassing PAC catch-all proxy rules |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | MEDIUM | CWE-758 (Reliance on Undefined, Unspecified, or Implementation-Defined Behavior) | `frameworks/core/components/common/properties/color.cpp` · `arkui_ace_engine` | Color::LineColorTransition UB cast on decreasing channel (legacy DataPanel gradient) |

<details><summary>Summaries</summary>

- **OH-2026-NET-002** (`DTS2026070856960`): `CheckIpv4InNet` computes the CIDR subnet mask with:
- **OH-2026-ARKUI-006** (`DTS2026070856858`): `Color::LineColorTransition` interpolates two colors by casting the **channel delta alone** to `uint8_t` before adding the start channel:

</details>

### State / Lifecycle — Incomplete Cleanup or Stuck State

Timeout/error path leaves a flag or resource stuck, disabling later operations.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | HIGH | CWE-459 (Incomplete Cleanup) | `services/core/src/pasteboard_service.cpp` · `distributeddatamgr_pasteboard` | SetCurrentDistributedData timeout leaves isRunning stuck, permanently disabling cross-device clipboard publish |

<details><summary>Summaries</summary>

- **OH-2026-PB-002** (`DTS2026072000001`): `PasteboardService::SetCurrentDistributedData` runs its distributed-publish pipeline inside a worker lambda guarded by the `setDistributedMemory_.isRunning` flag. The flag is an ownership latch: the worker sets it `true` on entry, and la...

</details>

## Input Validation

### Input Validation — Improper Checks

Validators accept malformed or out-of-contract values.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | MEDIUM | CWE-1287 (Improper Validation of Specified Type of Input) | `frameworks/native/ability/native/data_uri_utils.cpp` · `ability_ability_runtime` | DataUriUtils::IsNumber accepts floats; GetId silently truncates to integer prefix |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | MEDIUM | CWE-20 (Improper Input Validation) | `services/storage_daemon/ipc/src/storage_daemon_provider.cpp` · `filemanagement_storage_service` | SA providers skip CheckUserIdRange on user-scoped IPC |
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | LOW | CWE-129 (Improper Validation of Array Index) | `common/utils/fixed_size_list.h` · `multimedia_camera_framework` | FixedSizeList::remove_at corrupts ring buffer after wraparound, losing live elements |

<details><summary>Summaries</summary>

- **OH-2026-ABILITY-002** (`DTS2026071809730`): `INTEGER_REGEX` accepts decimal floats via an optional fractional group, so `IsNumber("12.5")` returns **true**. Public `GetId` gates on `IsNumber` and returns `std::atoll(lastPath)`, which truncates the float to its integer prefix: `"12...
- **OH-2026-STORAGE-001** (`DTS2026072335866`): Shared SA gate `CheckUserIdRange` (`userId ∈ [START_USER_ID=0, MAX_USER_ID=10738]`, fail with **`E_USERID_RANGE`**) is missing on **10** user-scoped provider entries: **7** Daemon + **3** Manager. Out-of-range `userId` is accepted and fo...
- **OH-2026-CAM-001** (`DTS2026070238028`): `FixedSizeList::remove_at` unconditionally rewinds the write pointer (`index`) by 1 after any removal. After the internal circular buffer has wrapped, the rewound pointer lands on a slot holding a live element. The next `add` overwrites ...

</details>

### Input Validation — Uncaught Exception / Crash on Bad Input

Parsers throw/abort on values that passed a weak pre-check.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | MEDIUM | CWE-248 (Uncaught Exception) | `services/camera_service/src/camera_util.cpp` · `multimedia_camera_framework` | IsDoubleRegex guard too permissive → uncaught std::stoi throw in SetParameters |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | MEDIUM | CWE-248 (Uncaught Exception) | `services/camera_service/src/hcapture_session.cpp` · `multimedia_camera_framework` | UpdateBasicInfoForStream uncaught std::stoi out_of_range on accepted integer values |

<details><summary>Summaries</summary>

- **OH-2026-CAM-006** (`DTS2026071303295`): `IsDoubleRegex` accepts the double grammar via `operator>>(double&)` / `strtod`, then `HCameraService::SetParameters` calls unguarded `std::stoi` on the same string for `META_TYPE_BYTE` (and the same pattern fans out across `SetParameter...
- **OH-2026-CAM-003** (`DTS2026071411883`): `HCaptureSession::UpdateBasicInfoForStream` gates each non-string plugin code with `isIntegerRegex(pair.second)` and then feeds that same string to `std::stoi`. But `isIntegerRegex` only checks the shape `^-?[0-9]+$` with **no magnitude ...

</details>

### Input Validation — Path Traversal

Path allow-lists miss classic `..` (or similar) forms.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | MEDIUM | CWE-22 (Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')) | `services/distributeddataservice/framework/utils/constant.cpp` · `distributeddatamgr_datamgr_service` | Constant::IsValidPath accepts lone ".." |

<details><summary>Summaries</summary>

- **OH-2026-DATAMGR-001** (`DTS2026072223098`): `Constant::IsValidPath` rejects only separator forms `"../…"` and `"…/.."`. Bare `".."` matches neither flag and returns **true**. On the KVDB store path this gates `meta.dataDir` before `SetKvStoreConfig`, so a `dataDir` of `".."` passe...

</details>

### Input Validation — Encoding / Unicode

UTF-8/encoding checks accept illegal sequences.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | MEDIUM | CWE-176 (Improper Handling of Unicode Encoding) | `rosen/modules/2d_graphics/src/drawing/utils/string_util.cpp` · `graphic_graphic_2d` | IsUtf8 accepts UTF-8 surrogates on signed-char hosts |

<details><summary>Summaries</summary>

- **OH-2026-GFX-005** (`DTS2026072513315`): `OHOS::Rosen::IsUtf8` encodes intent to reject UTF-8 surrogate halves via `c == 0xED && (next & 0xA0) == 0xA0 → false`. On signed-`char` hosts (typical OH/Linux ARM/x86), `uint32_t c = text[i]` sign-extends `0xED` to `0xFFFFFFED`, so `c ...

</details>

## Security

### Security — Authorization / Access Control

Authz/firewall/grant checks fail open or classify traffic incorrectly.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | HIGH | CWE-285 (Improper Authorization) | `services/netmanagernative/bpf/include/netfirewall/netfirewall_match.h` · `communication_netmanager_base` | netfirewall match_loopback always returns true, classifying all traffic as loopback and short-circuiting deny rules |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | MEDIUM | CWE-862 (Missing Authorization) | `services/core/src/pasteboard_service.cpp` · `distributeddatamgr_pasteboard` | ProcessDistributedDelayUri exports URI without consulting per-record grant flag (fail-open) |

<details><summary>Summaries</summary>

- **OH-2026-NET-003** (`DTS2026050963138`): `match_loopback` in the eBPF netfirewall connection-tracking path computes a local `is_loopback` flag (from a `PROTOCOL_SAT_EXPAK && ifindex == 1` special case, or an src/dst lookup in the `LOOP_BACK_IPV4_MAP` / `LOOP_BACK_IPV6_MAP` LPM ...
- **OH-2026-PB-001** (`DTS2026071412383`): `PasteboardService::ProcessDistributedDelayUri` converts a local file URI to a DFS/distributed URI and encodes it for the remote peer. It calls `PasteboardWebController::CheckAppUriPermission(data)`, which writes the per-record `HasGrant...

</details>

### Security — Certificate Validation

TLS/pinning verification uses the wrong material or pointer.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | HIGH | CWE-295 (Improper Certificate Validation) | `ssl` · `commonlibrary_rust_ylong_http` | Certificate pinning bypass via wrong pointer in verify_pinned_pubkey |

<details><summary>Summaries</summary>

- **YLONG-2026-SSL-001** (`DTS2026052810677`): `verify_pinned_pubkey()` in `ylong_http_client/src/util/c_openssl/ssl/stream.rs:320` passes `&mut key.as_ptr()` (a pointer to a stack-allocated temporary) to `i2d_X509_PUBKEY` instead of `&mut key.as_mut_ptr()` (a pointer into the heap b...

</details>

### Security — Information Leakage

Masking/redaction fails; secrets or addresses reach logs.

| DTS | ID | Severity | CWE | Component / repo | Title |
|-----|----|----------|-----|------------------|-------|
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | MEDIUM | CWE-212 (Improper Removal of Sensitive Information Before Storage or Transfer) | `utils/common_utils/src/netmanager_base_common_utils.cpp` · `communication_netmanager_base` | ToAnonymousIp(maskMiddle=true) leaks compressed IPv6 addresses to logs unmasked |

<details><summary>Summaries</summary>

- **OH-2026-NET-001** (`DTS2026062926934`): `MaskIpMiddle` is the helper that `ToAnonymousIp(input, true)` delegates to for the production log path. It finds the first and last occurrence of the delimiter and masks every character between them. For IPv6 addresses written with `::`...

</details>

## CWE frequency (DTS only)

| CWE | Name | Count |
|-----|------|------:|
| CWE-682 | Incorrect Calculation | 9 |
| CWE-190 | Integer Overflow or Wraparound | 4 |
| CWE-670 | Always-Incorrect Control Flow Implementation | 4 |
| CWE-191 | Integer Underflow (Wrap or Wraparound) | 3 |
| CWE-369 | Divide By Zero | 3 |
| CWE-835 | Loop with Unreachable Exit Condition ('Infinite Loop') | 3 |
| CWE-125 | Out-of-bounds Read | 2 |
| CWE-193 | Off-by-one Error | 2 |
| CWE-248 | Uncaught Exception | 2 |
| CWE-758 | Reliance on Undefined, Unspecified, or Implementation-Defined Behavior | 2 |
| CWE-1287 | Improper Validation of Specified Type of Input | 1 |
| CWE-129 | Improper Validation of Array Index | 1 |
| CWE-176 | Improper Handling of Unicode Encoding | 1 |
| CWE-193 | Off-by-One Error | 1 |
| CWE-20 | Improper Input Validation | 1 |
| CWE-212 | Improper Removal of Sensitive Information Before Storage or Transfer | 1 |
| CWE-22 | Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal') | 1 |
| CWE-252 | Unchecked Return Value | 1 |
| CWE-285 | Improper Authorization | 1 |
| CWE-295 | Improper Certificate Validation | 1 |
| CWE-415 | Double Free | 1 |
| CWE-459 | Incomplete Cleanup | 1 |
| CWE-476 | NULL Pointer Dereference | 1 |
| CWE-480 | Use of Incorrect Operator | 1 |
| CWE-754 | Improper Check or Handling of Exceptional Conditions | 1 |
| CWE-787 | Out-of-bounds Write | 1 |
| CWE-787 | Out-of-bounds Read | 1 |
| CWE-862 | Missing Authorization | 1 |

## Notes

- Scope is DTS-submitted bugs only (`internal_issue_id`).
- Bug types are derived primarily from CWE, refined by title/symptom. Each ticket maps to one primary type.
- Local write-ups: [`content/issues/`](../content/issues/).

