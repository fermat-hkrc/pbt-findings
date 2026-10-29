# arkui_ace_engine — ArkTS findings (GitCode, no DTS yet)

ArkTS / ohosTest PBT on `imageGeneratorDialog` (`advanced_ui_component`). **Not** part of the C++ DTS catalog ([`arkui_ace_engine_dts_bug_types.md`](./arkui_ace_engine_dts_bug_types.md), [`dts_bug_types.md`](./dts_bug_types.md)).

These residuals are **real as measured** on device. Internal triage against [`NON_ISSUE_BUG_REPORT_CHARACTERISTICS.md`](../../personal/cloned-md-backup/NON_ISSUE_BUG_REPORT_CHARACTERISTICS.md) parks them as **non-issue class 2/3** (zero production callers; `mat4toImageItem` also has an unreachable scale=0 band). They were **still filed upstream** so maintainers can decide fix-vs-dead-code. Internal DTS numbers are **not** assigned unless a developer confirms.

- **Repo (SUT):** `arkui_ace_engine` / `advanced_ui_component/imageGeneratorDialog`
- **Upstream:** https://gitcode.com/openharmony/arkui_ace_engine
- **Evidence fork / branch (PBT tests live here, not on upstream master):** https://gitcode.com/thanhtoantnt/arkui_ace_engine/tree/pandacheck
- **Local write-ups:** `~/testing/arkui_ace_engine/pbt-out-arkts/bug_reports/` (estimators under `non-issue/` + `zh/`)
- **Filed:** 2026-10-28 … 2026-10-29
- **Status:** 3 GitCode issues **open**, awaiting assign / maintainer verdict. **0 DTS.**

## Overview

| Status | Count |
|--------|------:|
| GitCode submitted (awaiting developer) | 3 |
| Confirmed (DTS) | 0 |
| Confirmed fixed | 0 |
| Internally parked non-issue (zero-caller gate) | 3 (same three) |

| GitCode | Function | Oracle | Severity | Callers | Free reason (internal) |
|---------|----------|--------|----------|---------|------------------------|
| [#82600](https://gitcode.com/openharmony/arkui_ace_engine/issues/82600) | `estimateMipMapBytes` | Reference + Algebraic metamorphic + Algebraic invariant | MEDIUM | **0** tree-wide | class 3 dead path |
| [#82601](https://gitcode.com/openharmony/arkui_ace_engine/issues/82601) | `estimateYuv420Bytes` | Reference (I420) | MEDIUM | **0** tree-wide | class 3 dead path |
| [#82619](https://gitcode.com/openharmony/arkui_ace_engine/issues/82619) | `mat4toImageItem` | Algebraic invariant (finite fields) | MEDIUM | **0** tree-wide | class 2+3 unreachable scale=0 **and** dead export |

Precision is **not** computed here: nothing is decided by maintainers yet. Do not fold these into the 83.6% C++ DTS precision.

## How to reproduce (upstream cannot run these tests on master)

ohosTest PBT exists **only** on the fork branch. Upstream `openharmony/arkui_ace_engine` master has no `Estimate*Pbt` / `Mat4toImageItemPbt` sources.

```bash
git remote add thanhtoantnt https://gitcode.com/thanhtoantnt/arkui_ace_engine.git   # skip if present
git fetch thanhtoantnt pandacheck
git checkout -B pandacheck thanhtoantnt/pandacheck

cd advanced_ui_component/imageGeneratorDialog/source/image_generator_dialog_project
hvigorw genOnDeviceTestHap --mode module -p module=image_generator_dialog@ohosTest -p product=default --no-daemon
# sign + install ohosTest HAP, then e.g.:
hdc shell aa test -b com.ohos.image_generator_dialog_project -m image_generator_dialog_test \
  -s unittest OpenHarmonyTestRunner -s class EstimateMipMapBytesPbt -s timeout 300000
```

`describe` names (Hypium `-s class`): `EstimateMipMapBytesPbt`, `EstimateYuv420BytesPbt`, `Mat4toImageItemPbt`. Wired from [`List.test.ets`](https://gitcode.com/thanhtoantnt/arkui_ace_engine/blob/pandacheck/advanced_ui_component/imageGeneratorDialog/source/image_generator_dialog_project/image_generator_dialog/src/ohosTest/ets/test/List.test.ets).

---

## 1. `#82600` — `estimateMipMapBytes` returns 0 for 1×1 (and clamped) dims

**GitCode:** https://gitcode.com/openharmony/arkui_ace_engine/issues/82600  
**SUT:** `ImageMemoryEstimator.estimateMipMapBytes`  
**File:** `…/image_generator_dialog/src/main/ets/common/utils/ImageDebugPerfUtils.ets:206-221`  
**Intro:** !81573 / #73689 (wangyinhua, 2026-03-04, Feature, TDD/XTS 不涉及) — 4-file toolkit drop, never wired  
**Test:** [`EstimateMipMapBytesPbt.test.ets`](https://gitcode.com/thanhtoantnt/arkui_ace_engine/blob/pandacheck/advanced_ui_component/imageGeneratorDialog/source/image_generator_dialog_project/image_generator_dialog/src/ohosTest/ets/test/EstimateMipMapBytesPbt.test.ets) on `pandacheck` (`708ec824c17`)

**Law:** full mip chain includes the base LOD; `estimateMipMapBytes(1,1,c) = c`; generally `≥ max(1,⌊w⌋)·max(1,⌊h⌋)·c`.

**Witness:** `(1,1,1)` and clamped `(0,0,1)` → actual `0`, expected `1`. On-device: Tests run 9, Failure 5. Seeds 5050369 / 5050370 / 5050373 / 5050375.

**Root cause:** `while (w > 1 || h > 1)` never enters when already 1×1; `total += channels` for the 1×1 tail only runs after a halving step.

**Callers:** 0 in this repo and in `~/openharmony/` (entire module `ImageDebugPerfUtils` unused; not in GN-shipped `imagegeneratordialog.abc`).

**Local write-up:** `pbt-out-arkts/bug_reports/non-issue/estimateMipMapBytes_missing_1x1_base.md` (+ `zh/`)

---

## 2. `#82601` — `estimateYuv420Bytes` undercounts I420 on odd dims

**GitCode:** https://gitcode.com/openharmony/arkui_ace_engine/issues/82601  
**SUT:** `ImageMemoryEstimator.estimateYuv420Bytes`  
**File:** same `ImageDebugPerfUtils.ets:224-228`  
**Intro:** same !81573 toolkit drop  
**Test:** [`EstimateYuv420BytesPbt.test.ets`](https://gitcode.com/thanhtoantnt/arkui_ace_engine/blob/pandacheck/advanced_ui_component/imageGeneratorDialog/source/image_generator_dialog_project/image_generator_dialog/src/ohosTest/ets/test/EstimateYuv420BytesPbt.test.ets) on `pandacheck` (`dc9196537fd`)

**Law:** I420 size `= w·h + 2·⌈w/2⌉·⌈h/2⌉` after clamp.

**Witness:** `(1,1)` expected 3 actual 1; `(3,2)` expected 10 actual 9. On-device: Tests run 11, Failure 4. Seeds 1498685441 / 1498685447 / 1498685448.

**Root cause:** `Math.floor(w * h * 1.5)` matches I420 only when both dims are even; odd dims drop chroma ceil padding.

**Callers:** 0 (same module as #82600).

**Local write-up:** `pbt-out-arkts/bug_reports/non-issue/estimateYuv420Bytes_undercounts_chroma.md` (+ `zh/`)

---

## 3. `#82619` — `mat4toImageItem` NaN angle when `matrix[10] == 0`

**GitCode:** https://gitcode.com/openharmony/arkui_ace_engine/issues/82619  
**SUT:** `mat4toImageItem`  
**File:** `…/general/components/ImageOperate.ets:122-173` (public `.d.ets` + shipped `ImageOperate.js`)  
**Intro:** !77786 / #69941 (guan01, 2025-12-14, “补充高级组件的UX效果”) — born as `export declare` next to live `ImageOperate`; never called  
**Test:** [`Mat4toImageItemPbt.test.ets`](https://gitcode.com/thanhtoantnt/arkui_ace_engine/blob/pandacheck/advanced_ui_component/imageGeneratorDialog/source/image_generator_dialog_project/image_generator_dialog/src/ohosTest/ets/test/Mat4toImageItemPbt.test.ets) on `pandacheck` (`6c49ab84ae7`)

**Law (test-side):** accepted matrix + positive w/h → all `ImageItem` numeric fields finite, or reject.

**Witness:** all-zeros except `[15]=1`, `w=h=1` (seed `81006600`) → `rotation.angle` is NaN (`1/scale` Inf, then `asin`/`acos`). On-device: Tests run 13, Failure 2. Sibling `nonzero_scale_finite` **passes**.

**Root cause:** unguarded `1 / scale` at `:146-150` with `scale = matrix[10]`.

**Callers:** 0 tree-wide. Sibling `calcAABB` **is** live (`CanvasFramework`). Live pinch already floors scale (`scaleZ = Math.max(0.05 / this.storeMatrix[10], …)` at `:431`) — product domain excludes the witness. Stronger *surface* than the estimators (public export on a shipped module); weaker *oracle* (full-domain finite-fields vs live scale floor).

**Local write-up:** `pbt-out-arkts/bug_reports/mat4toImageItem_zero_scale_nan.md`  
**Review:** `~/tmp/mat4toImageItem_zero_scale_nan-review.md`

---

## Disposition rules (this set)

1. **Do not add DTS rows** until a maintainer confirms. Then follow `~/github/pbt-findings/` C++ workflow (internal ticket → `internal_issue_id` → move write-up).
2. **If rejected as 死代码 / 非问题:** keep parked; quote the maintainer in the local report; do not re-file without a new live caller (catalog folder rule).
3. **Zero-caller gate still applies** even though issues were filed: filing is “let developers decide,” not a claim that the witness is on the product domain.
4. **C++ vs ArkTS:** rejection classes used here (dead path, unreachable band, declaration ≠ producer) are language-agnostic. UB / `-O0` / ABI / parcel-era classes from the C++ catalog were **not** used.

## Pointers

| Path | Role |
|------|------|
| [`arkui_ace_engine_dts_bug_types.md`](./arkui_ace_engine_dts_bug_types.md) | C++ DTS in this repo (19 fixed) — different surface |
| [`dts_bug_types.md`](./dts_bug_types.md) | Cross-repo DTS + non-issue catalog |
| Fork `pandacheck` | Evidence branch: bugs stay unfixed; PBT ohosTest lives here |
| `pbt-out-arkts/bug_reports/` | Local EN reports |
| `pbt-out-arkts/bug_reports/zh/` | Chinese translations (estimators) |
| `pbt-out-arkts/bug_reports/non-issue/` | Parked estimator reports |
