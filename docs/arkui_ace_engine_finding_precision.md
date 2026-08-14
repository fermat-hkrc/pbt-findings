# arkui_ace_engine — Finding Precision (DTS Outcomes)

How often PBT-filed **DTS** tickets against `arkui_ace_engine` were accepted as real bugs versus closed as non-issues.

Only **dispositioned** tickets are counted. Freshly submitted / still-open DTS tickets are omitted — their outcome (bug vs non-issue) is not yet known.

Companion bug-type catalog: [arkui_ace_engine_dts_bug_types.md](./arkui_ace_engine_dts_bug_types.md).

## Scope and definitions

| Term | Meaning |
|------|---------|
| **FIXED** | DTS accepted; fix landed / confirmed fixed |
| **NON-ISSUE** | DTS closed as not a product bug |
| **Decided** | `FIXED + NON-ISSUE` |
| **Precision** | `FIXED / (FIXED + NON-ISSUE)` |
| **False-positive rate** | `NON-ISSUE / (FIXED + NON-ISSUE)` |

**Sources**

- `~/cloned/arkui_ace_engine/pbt-out/bug_reports/{fixed,non-issue}/`
- [`content/issues/OH-2026-ARKUI-*.md`](../content/issues/) (**7** confirmed write-ups)
- Cross-repo context: [finding_precision_by_project.md](./finding_precision_by_project.md)

- **Generated:** 2026-08-14

## Scoreboard (decided only)

| Status | Count | Share of decided |
|--------|------:|-----------------:|
| FIXED | 7 | 87.5% |
| NON-ISSUE | 1 | 12.5% |
| **Total decided** | **8** | 100% |

- **Precision:** **7/8 = 87.5%**
- **False-positive rate:** **1/8 = 12.5%**

Compared with the cross-repo decided baseline (**87.0%** precision), arkui_ace_engine is essentially **on par** (87.5%).

## FIXED DTS

| DTS | Issue ID | Severity | CWE | Title |
|-----|----------|----------|-----|-------|
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | MEDIUM | CWE-682 | GridLayoutInfo::GetContentHeightOfRegularGrid returns negative height for empty grids with positive gap |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | HIGH | CWE-670 | GridLayoutInfo::FindInMatrix returns wrong iterator for index=0 when item 0 is absent |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | MEDIUM | CWE-682 | Matrix4::SetEntry uses opposite storage order from Get/Set, breaking off-diagonal round-trips |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | HIGH | CWE-670 | GridItemDragManager::FindAvailableColumn returns 0 instead of -1 for impossible span when row is absent |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | HIGH | CWE-682 | LazyGridLayoutInfo::UpdatePosMapStart omits spaceWidth_ when rebasing from a non-zero start index |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | MEDIUM | CWE-758 | Color::LineColorTransition UB cast on decreasing channel (legacy DataPanel gradient) |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | HIGH | CWE-369 | GetIrregularHeight divides by zero → +inf content height when itemRatio == 0 |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-001** (`DTS2026061256925`): `GridLayoutInfo::GetContentHeightOfRegularGrid()` returns a negative content height when the grid has zero items and `mainGap` is positive. The empty-grid case falls through the modulo branch and subtracts `mainGap` from zero, violating ...
- **OH-2026-ARKUI-002** (`DTS2026061512035`): `GridLayoutInfo::FindInMatrix(0)` unconditionally returns `gridMatrix_.begin()` instead of searching for item `0`. When the matrix is non-empty but starts at a row index greater than `0`, `begin()` points to a row that does not contain i...
- **OH-2026-ARKUI-003** (`DTS2026062427183`): `Matrix4::SetEntry(row, col, value)` writes to `matrix4x4_[row][col]`, but `Matrix4::Get(row, col)` and `Matrix4::Set(row, col, value)` read/write `matrix4x4_[col][row]`. Off-diagonal writes therefore do not round-trip: a value written t...
- **OH-2026-ARKUI-004** (`DTS2026062427889`): `GridItemDragManager::FindAvailableColumn(matrix, row, colSpan, crossCount)` returns the first free column for an item of width `colSpan` within a grid of `crossCount` columns. When the target `row` is absent from the matrix, the functio...
- **OH-2026-ARKUI-005** (`DTS2026070318488`): `LazyGridLayoutInfo::UpdatePosMapStart()` recalculates the position anchor for the start of the cached lazy-grid position map. When the map starts at index > 0 and has no predecessor entry, the first-branch formula uses only `estimateIte...
- **OH-2026-ARKUI-006** (`DTS2026070856858`): `Color::LineColorTransition` interpolates two colors by casting the **channel delta alone** to `uint8_t` before adding the start channel:
- **OH-2026-ARKUI-007** (`DTS2026072325132`): `GridLayoutInfo::GetIrregularHeight` estimates total lines as `(lastKnownLine + 1) / itemRatio` where `itemRatio = (FindEndIdx(lastKnownLine).itemIdx + 1) / childrenCount`. When the line is missing from `gridMatrix_`, `FindEndIdx` return...

</details>

### Local fixed reports

Under `~/cloned/arkui_ace_engine/pbt-out/bug_reports/fixed/`:

- `DTS2026061256925` — `fixed/GridLayoutInfo_NegativeHeight.md`
- `DTS2026061512035` — `fixed/FindInMatrix_WrongIteratorForIndex0.md`
- `DTS2026062427183` — `fixed/matrix4_setentry_get_roundtrip.md`
- `DTS2026062427889` — `fixed/FindAvailableColumn_WrongEarlyReturn.md`
- `DTS2026070318488` — `fixed/UpdatePosMapStart_MissingSpaceWidth.md`
- `DTS2026070856858` — `fixed/line_color_transition_no_clamp.md`
- `DTS2026072325132` — `fixed/GetIrregularHeight_itemRatio_div_zero_inf.md`

## NON-ISSUE DTS

| DTS | Report theme | Rejection class |
|-----|--------------|-----------------|
| `DTS2026071809266` | GridLayoutInfo::GetTotalHeightOfItemsInView returns -mainGap for empty / fully-pruned windows | Stable API contract (formula) |

**Report:** `~/cloned/arkui_ace_engine/pbt-out/bug_reports/non-issue/GetTotalHeightOfItemsInView_NegMainGap.md`

### Why closed

Long-standing n=0 formula contract (~2y); maintainers declined shared-API change; no user-visible product symptom. Empty → -mainGap is expected formula output, not a defect.

**Implication for future filings:** an algebraically odd empty-path return is not enough if it is the long-standing shared contract and callers couple to it. Prefer call-site impact / user-visible symptom before requesting a shared helper change.

## Component mix (FIXED only)

| Component | Count |
|-----------|------:|
| `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | 3 |
| `frameworks/base/geometry/matrix4.cpp` | 1 |
| `frameworks/core/components/common/properties/color.cpp` | 1 |
| `frameworks/core/components_ng/pattern/grid/grid_item_drag_manager.cpp` | 1 |
| `frameworks/core/components_ng/pattern/lazy_grid_layout/lazy_grid_layout_info.cpp` | 1 |

## Severity mix (FIXED only)

| Severity | Count |
|----------|------:|
| HIGH | 4 |
| MEDIUM | 3 |
| LOW | 0 |

## Takeaways

1. **7 real bugs fixed** across grid layout, lazy grid, matrix storage, and color transition — strong confirmed yield for one UI engine repo.
2. **Precision 88%** on decided tickets: one non-issue (stable empty-height formula) against seven fixes.
3. Dominant failure modes: **incorrect calculation**, **wrong control-flow sentinels**, plus **div-by-zero** and **UB cast**.
4. Non-issue lesson is contract/call-graph sensitivity, not flaky reproduction — PBT still witnessed the raw return as a contract property.

## Methodology notes

- Decided set = DTS present under `bug_reports/fixed/` or `bug_reports/non-issue/`, aligned with `content/issues` for FIXED write-ups.
- `GetIrregularHeight` (`DTS2026072325132`) is counted **FIXED** (report lives under `fixed/` and write-up is `CONFIRMED_FIXED`), even if a broader inventory snapshot still labeled it submitted.
- Open/submitted root reports with DTS are excluded from precision until dispositioned.
- Non-DTS low-severity local notes are excluded (never filed → not false positives).

