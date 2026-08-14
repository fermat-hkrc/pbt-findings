# arkui_ace_engine — DTS Tickets by Bug Type

Categorization of **confirmed fixed** DTS findings in `arkui_ace_engine`, grouped by **bug type** (failure mode).

Scoped to this repo only. Companion precision report: [arkui_ace_engine_finding_precision.md](./arkui_ace_engine_finding_precision.md).

- **Repo:** `arkui_ace_engine`
- **Confirmed fixed (DTS + write-up):** **7**
- **Status:** all listed tickets are `CONFIRMED_FIXED`
- **Severity:** HIGH=4, MEDIUM=3, LOW=0
- **Sources:** [`content/issues/OH-2026-ARKUI-*.md`](../content/issues/), `~/cloned/arkui_ace_engine/pbt-out/bug_reports/fixed/`
- **Generated:** 2026-08-14

## Overview

| Bug type | Count | HIGH | MEDIUM | LOW |
|----------|------:|-----:|-------:|----:|
| [Arithmetic — Incorrect Calculation](#arithmetic-incorrect-calculation) | 3 | 1 | 2 | 0 |
| [Arithmetic — Divide by Zero](#arithmetic-divide-by-zero) | 1 | 1 | 0 | 0 |
| [Logic — Incorrect Control Flow](#logic-incorrect-control-flow) | 2 | 2 | 0 | 0 |
| [Undefined Behavior](#undefined-behavior) | 1 | 0 | 1 | 0 |
| **Total** | **7** | **4** | **3** | **0** |

### By family

| Family | Count |
|--------|------:|
| Arithmetic & Numeric | 4 |
| Logic | 2 |
| Undefined Behavior | 1 |

## DTS index

| DTS | Issue ID | Bug type | Severity | Component |
|-----|----------|----------|----------|-----------|
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | Arithmetic — Incorrect Calculation | MEDIUM | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | Logic — Incorrect Control Flow | HIGH | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | Arithmetic — Incorrect Calculation | MEDIUM | `frameworks/base/geometry/matrix4.cpp` |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | Logic — Incorrect Control Flow | HIGH | `frameworks/core/components_ng/pattern/grid/grid_item_drag_manager.cpp` |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | Arithmetic — Incorrect Calculation | HIGH | `frameworks/core/components_ng/pattern/lazy_grid_layout/lazy_grid_layout_info.cpp` |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | Undefined Behavior | MEDIUM | `frameworks/core/components/common/properties/color.cpp` |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | Arithmetic — Divide by Zero | HIGH | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` |

## Arithmetic — Incorrect Calculation

Wrong formula, operand, or matrix/layout math that breaks geometric or color invariants.

| DTS | ID | Severity | CWE | Component | Title |
|-----|----|----------|-----|-----------|-------|
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | HIGH | CWE-682 (Incorrect Calculation) | `frameworks/core/components_ng/pattern/lazy_grid_layout/lazy_grid_layout_info.cpp` | LazyGridLayoutInfo::UpdatePosMapStart omits spaceWidth_ when rebasing from a non-zero start index |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | MEDIUM | CWE-682 (Incorrect Calculation) | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | GridLayoutInfo::GetContentHeightOfRegularGrid returns negative height for empty grids with positive gap |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | MEDIUM | CWE-682 (Incorrect Calculation) | `frameworks/base/geometry/matrix4.cpp` | Matrix4::SetEntry uses opposite storage order from Get/Set, breaking off-diagonal round-trips |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-005** (`DTS2026070318488`): `LazyGridLayoutInfo::UpdatePosMapStart()` recalculates the position anchor for the start of the cached lazy-grid position map. When the map starts at index > 0 and has no predecessor entry, the first-branch formula uses only `estimateIte...
- **OH-2026-ARKUI-001** (`DTS2026061256925`): `GridLayoutInfo::GetContentHeightOfRegularGrid()` returns a negative content height when the grid has zero items and `mainGap` is positive. The empty-grid case falls through the modulo branch and subtracts `mainGap` from zero, violating ...
- **OH-2026-ARKUI-003** (`DTS2026062427183`): `Matrix4::SetEntry(row, col, value)` writes to `matrix4x4_[row][col]`, but `Matrix4::Get(row, col)` and `Matrix4::Set(row, col, value)` read/write `matrix4x4_[col][row]`. Off-diagonal writes therefore do not round-trip: a value written t...

</details>

## Arithmetic — Divide by Zero

Missing zero-denominator guards leading to non-finite layout results.

| DTS | ID | Severity | CWE | Component | Title |
|-----|----|----------|-----|-----------|-------|
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | HIGH | CWE-369 (Divide By Zero) | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | GetIrregularHeight divides by zero → +inf content height when itemRatio == 0 |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-007** (`DTS2026072325132`): `GridLayoutInfo::GetIrregularHeight` estimates total lines as `(lastKnownLine + 1) / itemRatio` where `itemRatio = (FindEndIdx(lastKnownLine).itemIdx + 1) / childrenCount`. When the line is missing from `gridMatrix_`, `FindEndIdx` return...

</details>

## Logic — Incorrect Control Flow

Wrong branch, sentinel, or iterator selection that returns success/identity incorrectly.

| DTS | ID | Severity | CWE | Component | Title |
|-----|----|----------|-----|-----------|-------|
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | HIGH | CWE-670 (Always-Incorrect Control Flow Implementation) | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | GridLayoutInfo::FindInMatrix returns wrong iterator for index=0 when item 0 is absent |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | HIGH | CWE-670 (Always-Incorrect Control Flow Implementation) | `frameworks/core/components_ng/pattern/grid/grid_item_drag_manager.cpp` | GridItemDragManager::FindAvailableColumn returns 0 instead of -1 for impossible span when row is absent |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-002** (`DTS2026061512035`): `GridLayoutInfo::FindInMatrix(0)` unconditionally returns `gridMatrix_.begin()` instead of searching for item `0`. When the matrix is non-empty but starts at a row index greater than `0`, `begin()` points to a row that does not contain i...
- **OH-2026-ARKUI-004** (`DTS2026062427889`): `GridItemDragManager::FindAvailableColumn(matrix, row, colSpan, crossCount)` returns the first free column for an item of width `colSpan` within a grid of `crossCount` columns. When the target `row` is absent from the matrix, the functio...

</details>

## Undefined Behavior

Relies on UB (e.g. out-of-range cast) with environment-dependent fallout.

| DTS | ID | Severity | CWE | Component | Title |
|-----|----|----------|-----|-----------|-------|
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | MEDIUM | CWE-758 (Reliance on Undefined, Unspecified, or Implementation-Defined Behavior) | `frameworks/core/components/common/properties/color.cpp` | Color::LineColorTransition UB cast on decreasing channel (legacy DataPanel gradient) |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-006** (`DTS2026070856858`): `Color::LineColorTransition` interpolates two colors by casting the **channel delta alone** to `uint8_t` before adding the start channel:

</details>

## CWE frequency

| CWE | Name | Count |
|-----|------|------:|
| CWE-682 | Incorrect Calculation | 3 |
| CWE-670 | Always-Incorrect Control Flow Implementation | 2 |
| CWE-369 | Divide By Zero | 1 |
| CWE-758 | Reliance on Undefined, Unspecified, or Implementation-Defined Behavior | 1 |

## Notes

- Only **confirmed fixed** DTS with write-ups under `content/issues/OH-2026-ARKUI-*.md` are typed here.
- The single arkui **NON-ISSUE** DTS is covered in the [precision report](./arkui_ace_engine_finding_precision.md), not in this bug-type catalog.
- Open/submitted DTS (not yet dispositioned) are omitted.
- Cross-repo taxonomy: [dts_bug_types.md](./dts_bug_types.md).

