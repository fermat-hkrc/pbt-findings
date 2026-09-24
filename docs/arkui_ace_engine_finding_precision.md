# arkui_ace_engine — Finding Precision (DTS Outcomes)

How often PBT-filed **DTS** tickets against `arkui_ace_engine` were accepted as real bugs versus closed as non-issues.

Only **dispositioned** tickets are counted. Freshly submitted / still-open DTS tickets are omitted — their outcome (bug vs non-issue) is not yet known.

Companion bug-type catalog: [arkui_ace_engine_dts_bug_types.md](./arkui_ace_engine_dts_bug_types.md).

## Scope and definitions

| Term | Meaning |
|------|---------|
| **FIXED** | DTS accepted **and fixed** (`CONFIRMED_FIXED`) |
| **CONFIRMED** | DTS accepted as a real bug; **not fixed yet** (`CONFIRMED_REAL`) |
| **NON-ISSUE** | DTS closed as not a product bug |
| **Decided** | `FIXED + CONFIRMED + NON-ISSUE` |
| **Precision** | `(FIXED + CONFIRMED) / (FIXED + CONFIRMED + NON-ISSUE)` |
| **False-positive rate** | `NON-ISSUE / (FIXED + CONFIRMED + NON-ISSUE)` |

**Sources**

- `~/cloned/arkui_ace_engine/pbt-out/bug_reports/{fixed,confirmed,non-issue}/` and `~/testing/arkui_ace_engine/pbt-out/bug_reports/`
- [`content/issues/OH-2026-ARKUI-*.md`](../content/issues/) (**20** = 12 fixed + 8 confirmed)
- Cross-repo context: [finding_precision_by_project.md](./finding_precision_by_project.md)

- **Generated:** 2026-09-22

## Scoreboard (decided only)

| Status | Count | Share of decided |
|--------|------:|-----------------:|
| FIXED | 12 | 48.0% |
| CONFIRMED (awaiting fix) | 8 | 32.0% |
| NON-ISSUE | 5 | 20.0% |
| **Total decided** | **25** | 100% |

- **Precision:** **(12+8)/25 = 80.0%**
- **False-positive rate:** **5/25 = 20.0%**

Compared with the cross-repo decided baseline (**84.8%** precision), arkui_ace_engine is **below** (80.0%).

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
| `DTS2026073116282` | [OH-2026-ARKUI-008](../content/issues/OH-2026-ARKUI-008.md) | MEDIUM | CWE-682 | DataPanel GetPaintPath computes NaN circleAngle via unguarded asin when stroke collapses radius |
| `DTS2026091012206` | [OH-2026-ARKUI-009](../content/issues/OH-2026-ARKUI-009.md) | HIGH | CWE-787 | Matrix3N::SetEntry / MatrixN3::SetEntry missing negative-index guard (OOB write / crash) |
| `DTS2026090922585` | [OH-2026-ARKUI-011](../content/issues/OH-2026-ARKUI-011.md) | MEDIUM | CWE-682 | BubbleLayoutAlgorithm::GetP2 asin domain break → NaN arrow clip path |
| `DTS2609150107715` | [OH-2026-ARKUI-019](../content/issues/OH-2026-ARKUI-019.md) | MEDIUM | CWE-193 | LazyGridLayoutInfo::SetSpace places a scrolled window one line too high when lanes > 1 |
| `DTS2609150123188` | [OH-2026-ARKUI-020](../content/issues/OH-2026-ARKUI-020.md) | MEDIUM | CWE-682 | LazyGridLayoutInfo::UpdatePosMapEnd leaves totalMainSize_ at the previous line end when the last line is partial |

<details><summary>Summaries</summary>

- **OH-2026-ARKUI-001** (`DTS2026061256925`): `GridLayoutInfo::GetContentHeightOfRegularGrid()` returns a negative content height when the grid has zero items and `mainGap` is positive. The empty-grid case falls through the modulo branch and subtracts `mainGap` from zero, violating ...
- **OH-2026-ARKUI-002** (`DTS2026061512035`): `GridLayoutInfo::FindInMatrix(0)` unconditionally returns `gridMatrix_.begin()` instead of searching for item `0`. When the matrix is non-empty but starts at a row index greater than `0`, `begin()` points to a row that does not contain i...
- **OH-2026-ARKUI-003** (`DTS2026062427183`): `Matrix4::SetEntry(row, col, value)` writes to `matrix4x4_[row][col]`, but `Matrix4::Get(row, col)` and `Matrix4::Set(row, col, value)` read/write `matrix4x4_[col][row]`. Off-diagonal writes therefore do not round-trip: a value written t...
- **OH-2026-ARKUI-004** (`DTS2026062427889`): `GridItemDragManager::FindAvailableColumn(matrix, row, colSpan, crossCount)` returns the first free column for an item of width `colSpan` within a grid of `crossCount` columns. When the target `row` is absent from the matrix, the functio...
- **OH-2026-ARKUI-005** (`DTS2026070318488`): `LazyGridLayoutInfo::UpdatePosMapStart()` recalculates the position anchor for the start of the cached lazy-grid position map. When the map starts at index > 0 and has no predecessor entry, the first-branch formula uses only `estimateIte...
- **OH-2026-ARKUI-006** (`DTS2026070856858`): `Color::LineColorTransition` interpolates two colors by casting the **channel delta alone** to `uint8_t` before adding the start channel:
- **OH-2026-ARKUI-007** (`DTS2026072325132`): `GridLayoutInfo::GetIrregularHeight` estimates total lines as `(lastKnownLine + 1) / itemRatio` where `itemRatio = (FindEndIdx(lastKnownLine).itemIdx + 1) / childrenCount`. When the line is missing from `gridMatrix_`, `FindEndIdx` return...
- **OH-2026-ARKUI-008** (`DTS2026073116282`): `DataPanelModifier::GetPaintPath()` computes circle-cap angle as unguarded `asin(thickness*0.5/(radius-thickness*0.5))`. Stroke at or above half the min side drives `radius <= 0` → NaN `circleAngle`.
- **OH-2026-ARKUI-009** (`DTS2026091012206`): `Matrix3N::SetEntry` / `MatrixN3::SetEntry` reject only `row/col >= bound`. Negative `int32_t` becomes a huge `size_t` subscript → SIGSEGV / heap abort. Same-file `Matrix3` and 4×N / N×4 siblings already reject negatives.
- **OH-2026-ARKUI-011** (`DTS2026090922585`): `GetP2` calls `asin(r/side)` with no `|r| < |side|` guard. JS-legal tiny arrows (`1×1` vs production `r=2`) yield NaN P2 / clip path. Same class as DataPanel `DTS2026073116282`.
- **OH-2026-ARKUI-019** (`DTS2609150107715`): `SetSpace` seeds `prevIndex=-1` / `prevPos=0`; `LanesFloor(-1)` undercounts one line when `lanes>1`.
- **OH-2026-ARKUI-020** (`DTS2609150123188`): covering `totalMainSize_` uses the line-packing cursor, so a partial last line leaves the scroll range one line short.

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
- `DTS2026073116282` — `fixed/data_panel_circle_angle_asin_nan.md`
- `DTS2026091012206` — `fixed/Matrix3N_SetEntry_negative_index.md`
- `DTS2026090922585` — `fixed/getp2_asin_nan_tiny_arrow.md`
- `DTS2609150107715` — `fixed/set_space_scrolled_window_off_by_one_line.md`
- `DTS2609150123188` — `fixed/update_pos_map_end_partial_last_line_total.md`

## CONFIRMED DTS (awaiting fix)

| DTS | Issue ID | Severity | CWE | Title |
|-----|----------|----------|-----|-------|
| `DTS2609150153371` | [OH-2026-ARKUI-010](../content/issues/OH-2026-ARKUI-010.md) | MEDIUM | CWE-682 | CalculateStartCachedCount overcounts when the last regular line is partial |
| `DTS2609150153174` | [OH-2026-ARKUI-012](../content/issues/OH-2026-ARKUI-012.md) | MEDIUM | CWE-670 | Backward GetTargetIndexInfoWithBenchMark starts a new line after a partial last matrix line |
| `DTS2026090919800` | [OH-2026-ARKUI-013](../content/issues/OH-2026-ARKUI-013.md) | HIGH | CWE-670 | MediaQueryer::MatchCondition drops AND-group when it is not the last OR-clause |
| `DTS2026090920220` | [OH-2026-ARKUI-014](../content/issues/OH-2026-ARKUI-014.md) | HIGH | CWE-682 | CheckColorAlpha casts unit alpha to uint8_t before scaling to 255 |
| `DTS2026091029544` | [OH-2026-ARKUI-015](../content/issues/OH-2026-ARKUI-015.md) | MEDIUM | CWE-682 | Quaternion::Slerp at t=0 returns -this when from·to < 0 |
| `DTS2026091412083` | [OH-2026-ARKUI-016](../content/issues/OH-2026-ARKUI-016.md) | HIGH | CWE-670 | MediaQueryer::MatchCondition never matches min-/max- features with an explicit px unit |
| `DTS2026091425514` | [OH-2026-ARKUI-017](../content/issues/OH-2026-ARKUI-017.md) | MEDIUM | CWE-670 | GridLayoutInfo::FindEndIdx skips item 0 and falls back to {0,0,0} |
| `DTS2026091437627` | [OH-2026-ARKUI-018](../content/issues/OH-2026-ARKUI-018.md) | MEDIUM | CWE-682 | LazyGridLayoutInfo::UpdatePosMap puts the whole body delta on adjustOffset.start when only gap changed |

- **OH-2026-ARKUI-010** (`DTS2609150153371`): `CalculateStartCachedCountByIrregular` returns `budget * crossCount` when `diff >= budget * C`, ignoring a partial last regular line. Full-line model wants `rem + (budget-1)*C`. Extra preload above the viewport; confirmed, not fixed yet.
- **OH-2026-ARKUI-012** (`DTS2609150153174`): Backward `GetTargetIndexInfoWithBenchMark` always seeds `lastLine+1` / `lastItem+1`. A leftover last matrix line still owns `lastItem+1`; `scrollToIndex` starts one main line too far down. Confirmed, not fixed yet.

Local reports: `~/cloned/arkui_ace_engine/pbt-out/bug_reports/confirmed/calculate_start_cached_count_partial_last_line.md`, `get_target_index_info_backward_partial_last_line.md`

## NON-ISSUE DTS

| DTS | Report theme | Rejection class |
|-----|--------------|-----------------|
| `DTS2026071809266` | GridLayoutInfo::GetTotalHeightOfItemsInView returns -mainGap for empty / fully-pruned windows | Stable API contract (formula) |
| `DTS2026072522059` | IsAllItemsMeasured false on span-marker last cell | Unreachable under live callers |
| `DTS2026082235589` | Color::FromRGBO wraps out-of-range opacity instead of clamping | Caller-owned clamp (internal packer) |
| `DTS2026082235533` | FindItemCount overcounts when the range starts on a multi-row continuation | Unreachable under live callers |
| `DTS2026073119063` | GetDistanceToBottom returns LayoutInfinity when height map extends past endMainLineIndex_ | By-design irregular-span sentinel |

**Reports:** `~/cloned/arkui_ace_engine/pbt-out/bug_reports/non-issue/GetTotalHeightOfItemsInView_NegMainGap.md`, `IsAllItemsMeasured_span_marker_false.md`, `fromrgbo_opacity_wrap.md`, `finditemcount_continuation_overcount.md`; `~/testing/arkui_ace_engine/pbt-out/bug_reports/non-issue/GetDistanceToBottom_prefetch_layout_infinity.md`

### Why closed

**`DTS2026071809266`:** Long-standing n=0 formula contract (~2y); maintainers declined shared-API change; no user-visible product symptom. Empty → -mainGap is expected formula output, not a defect.

**`DTS2026072522059`:** `-idx` span markers exist only on the irregular-filler matrix. That layout never calls `IsAllItemsMeasured` (`UseIrregularLayout()` → `GetIrregularHeight`). The two real callers run on `GridScrollWithOptions`, which stores the same positive index in every spanned cell. PBT mixed two disjoint encodings.

**`DTS2026082235589`:** `FromRGBO` is an internal packer. Domain is `[0, 1]`; clamp is the caller’s job (canvas already clamps; `ParseColorString` rejects). In-range packing is already correct. Maintainers refuse a shared-API change because out-of-range mapping would shift (`opacity == 2` is alpha 254 today, 255 after). If a product symptom appears, clamp at that caller (`FromString` / `ChangeOpacity`), not inside `FromRGBO`.

**`DTS2026082235533`:** `FindItemCount` is `max-min+1` for consecutive **positive** IDs on the regular/scroll path (`GetContentOffset` / `GetContentHeight`). Irregular layout uses `GetIrregularOffset` / `GetIrregularHeight` and never this helper. `-idx` continuations exist only on the filler matrix. PBT mixed two encodings (same class as `IsAllItemsMeasured`).

**`DTS2026073119063`:** `GetDistanceToBottom` third guard (`endMainLineIndex_ < lineHeightMap_.rbegin()->first` → `LayoutInfinity`) is the irregular/custom end sentinel: leftover span rows of the last in-view item still sit below the viewport. Maintainers: 有意为之; old callers (`offsetEnd_`, `IsOutOfEnd(irregular)`, `GetEndOffset`) treat ∞ / large positive as not at end. PBT’s extra-key witness is span remainder, not prefetch dirt (`PreloadItems` runs after `UpdateLayoutInfo`). Dropping the guard would mark a still-extending last item as at end.

**Implication for future filings:** an algebraically odd empty-path return is not enough if it is the long-standing shared contract and callers couple to it. Prefer call-site impact / user-visible symptom before requesting a shared helper change. Also prove the matrix encoding under test is an input the live caller actually produces. Do not demand nearest-end clamp on an internal helper whose owners pin the domain on the caller — canvas already clamping is caller duty, not a missing helper clamp. Same `color.cpp` float→`uint8_t` class as LineColorTransition, but that one was a live decreasing-channel UB (FIXED). Do not feed irregular-filler `-idx` into `FindItemCount` / `IsAllItemsMeasured`. Do not treat extra `lineHeightMap_` keys past `endMainLineIndex_` as prefetch dirt — that is the irregular span-remainder signal.

## Component mix (FIXED only)

| Component | Count |
|-----------|------:|
| `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | 3 |
| `frameworks/base/geometry/matrix4.cpp` | 1 |
| `frameworks/base/geometry/matrix3.cpp` | 1 |
| `frameworks/core/components/common/properties/color.cpp` | 1 |
| `frameworks/core/components_ng/pattern/data_panel/data_panel_modifier.cpp` | 1 |
| `frameworks/core/components_ng/pattern/bubble/bubble_layout_algorithm.cpp` | 1 |
| `frameworks/core/components_ng/pattern/grid/grid_item_drag_manager.cpp` | 1 |
| `frameworks/core/components_ng/pattern/lazy_grid_layout/lazy_grid_layout_info.cpp` | 3 |

## Severity mix (FIXED only)

| Severity | Count |
|----------|------:|
| HIGH | 5 |
| MEDIUM | 7 |
| LOW | 0 |

## Takeaways

1. **12 real bugs fixed** (+ 8 confirmed awaiting fix) across grid layout, lazy grid, media query, SVG alpha, quaternion slerp, matrix storage, color/asin geometry, and partial-last-line scroll/cache — strong confirmed yield for one UI engine repo.
2. **Precision 80%** on decided tickets: five non-issues (stable empty-height formula; `-idx` encoding never seen by `IsAllItemsMeasured` / `FindItemCount`; FromRGBO caller-owned `[0, 1]` clamp; GetDistanceToBottom LayoutInfinity is the irregular last-item span sentinel) against twelve fixes and eight confirmed.
3. Dominant failure modes: **incorrect calculation**, **wrong control-flow sentinels**, plus **div-by-zero**, **UB cast**, **OOB write**, and unguarded **`asin`**.
4. Non-issue lessons are contract/call-graph sensitivity and production-domain encoding, not flaky reproduction — PBT still witnessed the raw returns as contract properties.

## Methodology notes

- Decided set = DTS present under `bug_reports/fixed/` or `bug_reports/non-issue/`, aligned with `content/issues` for FIXED write-ups.
- `GetIrregularHeight` (`DTS2026072325132`) is counted **FIXED** (report lives under `fixed/` and write-up is `CONFIRMED_FIXED`), even if a broader inventory snapshot still labeled it submitted.
- Open/submitted root reports with DTS are excluded from precision until dispositioned.
- Non-DTS low-severity local notes are excluded (never filed → not false positives).

