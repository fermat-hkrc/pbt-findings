# Finding Precision by Project (DTS Outcomes)

How often PBT-filed **DTS** tickets were accepted as real bugs versus closed as non-issues, broken down by project.

- **Precision:** **87.0%** (47 FIXED / 54 decided)
- **False-positive rate:** **13.0%** (7 NON-ISSUE)

Only **dispositioned** tickets are counted. Freshly submitted / still-open DTS tickets are omitted — their outcome (bug vs non-issue) is not yet known.

## Scope and definitions

| Term | Meaning |
|------|---------|
| **FIXED** | DTS accepted; fix landed (or confirmed fixed in tree) |
| **NON-ISSUE** | DTS closed as not a product bug (by design, unreachable, dead code, caller contract, etc.) |
| **Decided** | `FIXED + NON-ISSUE` (terminal maintainer outcomes only) |
| **Precision** | `FIXED / (FIXED + NON-ISSUE)` — share of closed tickets that were real bugs |
| **False-positive rate** | `NON-ISSUE / (FIXED + NON-ISSUE)` |

**Sources**

- DTS inventory: `~/cloned/BUG_REPORTS.md` (dispositioned subset: **54** of 90 unique DTS)
- Confirmed write-ups with DTS: [`content/issues/`](../content/issues/) (**52** issues, all `CONFIRMED_FIXED`)
- Non-issue write-ups: `~/cloned/*/pbt-out/bug_reports/non-issue/`

- **Generated:** 2026-08-14

### Global DTS scoreboard (decided only)

| Status | Count | Share of decided |
|--------|------:|-----------------:|
| FIXED | 47 | 87.0% |
| NON-ISSUE | 7 | 13.0% |
| **Total decided** | **54** | 100% |

- **Precision:** **47/54 = 87.0%** — almost nine in ten closed tickets were real bugs.
- **False-positive rate:** **7/54 = 13.0%**.

> Precision means *maintainer-accepted defect rate among dispositioned DTS*, not static-analysis alert rate. Open/submitted tickets are out of scope until closed.

## Per-project scoreboard

Projects with at least one decided DTS, ordered by decided volume, then precision.

| Project | FIXED | NON-ISSUE | Decided | Precision |
|---------|------:|----------:|--------:|----------:|
| [`graphic_graphic_2d`](#graphic-graphic-2d) | 8 | 0 | 8 | 100% |
| [`arkui_ace_engine`](#arkui-ace-engine) | 6 | 1 | 7 | 86% |
| [`communication_netmanager_base`](#communication-netmanager-base) | 5 | 2 | 7 | 71% |
| [`multimedia_camera_framework`](#multimedia-camera-framework) | 5 | 0 | 5 | 100% |
| [`arkcompiler_runtime_core`](#arkcompiler-runtime-core) | 4 | 0 | 4 | 100% |
| [`multimedia_image_framework`](#multimedia-image-framework) | 3 | 0 | 3 | 100% |
| [`multimedia_media_foundation`](#multimedia-media-foundation) | 1 | 2 | 3 | 33% |
| [`ability_ability_runtime`](#ability-ability-runtime) | 2 | 0 | 2 | 100% |
| [`distributeddatamgr_pasteboard`](#distributeddatamgr-pasteboard) | 2 | 0 | 2 | 100% |
| [`multimedia_av_codec`](#multimedia-av-codec) | 2 | 0 | 2 | 100% |
| [`multimedia_av_session`](#multimedia-av-session) | 1 | 1 | 2 | 50% |
| [`communication_wifi`](#communication-wifi) | 1 | 0 | 1 | 100% |
| [`distributeddatamgr_datamgr_service`](#distributeddatamgr-datamgr-service) | 1 | 0 | 1 | 100% |
| [`distributedhardware_device_manager`](#distributedhardware-device-manager) | 1 | 0 | 1 | 100% |
| [`filemanagement_dfs_service`](#filemanagement-dfs-service) | 1 | 0 | 1 | 100% |
| [`filemanagement_storage_service`](#filemanagement-storage-service) | 1 | 0 | 1 | 100% |
| [`multimedia_media_library`](#multimedia-media-library) | 1 | 0 | 1 | 100% |
| [`multimedia_player_framework`](#multimedia-player-framework) | 1 | 0 | 1 | 100% |
| [`window_window_manager`](#window-window-manager) | 1 | 0 | 1 | 100% |
| [`communication_dsoftbus`](#communication-dsoftbus) | 0 | 1 | 1 | 0% |
| **Total** | **47** | **7** | **54** | **87%** |

## Precision tiers

### Tier A — Perfect precision (100%, ≥1 FIXED, 0 NON-ISSUE)

`graphic_graphic_2d` (8 fixed), `multimedia_camera_framework` (5 fixed), `arkcompiler_runtime_core` (4 fixed), `multimedia_image_framework` (3 fixed), `ability_ability_runtime` (2 fixed), `distributeddatamgr_pasteboard` (2 fixed), `multimedia_av_codec` (2 fixed), `communication_wifi` (1 fixed), `distributeddatamgr_datamgr_service` (1 fixed), `distributedhardware_device_manager` (1 fixed), `filemanagement_dfs_service` (1 fixed), `filemanagement_storage_service` (1 fixed), `multimedia_media_library` (1 fixed), `multimedia_player_framework` (1 fixed), `window_window_manager` (1 fixed)

These projects have **no maintainer-rejected DTS** among dispositioned tickets.

### Tier B — Mixed (both FIXED and NON-ISSUE)

| Project | FIXED | NON-ISSUE | Precision | What non-issues teach |
|---------|------:|----------:|----------:|----------------------|
| `arkui_ace_engine` | 6 | 1 | 86% | Empty-grid `-mainGap` is stable formula output, not a defect; real layout/math bugs still fixed at high rate. |
| `communication_netmanager_base` | 5 | 2 | 71% | Helper semantics (ForkExec) and API role split (zoned IPv6) ≠ bugs; firewall/IP/mask defects accepted. |
| `multimedia_media_foundation` | 1 | 2 | 33% | Abstract OOB / dead inverted predicate rejected; live `Format::Stringify` null-deref fixed. |
| `multimedia_av_session` | 1 | 1 | 50% | Call-type JSON omission = product policy; OOB crash in `GetAnonyTitle` still fixed. |

### Tier C — Only NON-ISSUE (0 FIXED)

- `communication_dsoftbus`: 1 non-issue — dispositioned findings not accepted as product bugs.

## Non-issue DTS catalog (all projects)

All **7** maintainer-rejected tickets. Useful as negative examples for future filing.

| DTS | Project | Report theme | Rejection class |
|-----|---------|--------------|-----------------|
| `DTS2026071809266` | `arkui_ace_engine` | GetTotalHeightOfItemsInView empty → -mainGap | Stable API contract (formula) |
| `DTS2026072017450` | `communication_dsoftbus` | Hex helpers omit explicit NUL write | Caller-owned contract (internal API) |
| `DTS2026071725399` | `communication_netmanager_base` | ForkExec SUCCESS on non-zero child exit | By-design helper semantics |
| `DTS2026072720774` | `communication_netmanager_base` | GetAddrFamily rejects zoned IPv6 | Different APIs, different jobs |
| `DTS2026070145311` | `multimedia_av_session` | ConvertSessionType drops call types | Product policy / intentional omission |
| `DTS2026071719364` | `multimedia_media_foundation` | CopyAVMemory missing offset+size guard | Unreachable under product invariant |
| `DTS2026081129774` | `multimedia_media_foundation` | DataPacker::IsEmpty inverted | Dead code / no shipped callers |

### Rejection classes (count)

| Class | Count | Implication for future PBT filings |
|------:|------:|--------------------------------------|
| By-design / product policy / stable contract | 3 | Validate *product* intent and call-graph impact, not only algebraic oddity |
| Unreachable invariant / dead code | 2 | Constrain generators to **production domain**; prove a live caller |
| Caller-owned or split-API contract | 2 | Read in-tree callers and sibling APIs before claiming inconsistency |

## Per-project detail

For each project with decided DTS: outcome mix, precision, non-issue notes (if any), and link-through to confirmed write-ups in this repo when present.

### `graphic_graphic_2d`

| Metric | Value |
|--------|------:|
| FIXED | 8 |
| NON-ISSUE | 0 |
| Decided | 8 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026062430430` — [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md): Point3::operator+ uses wrong operands for X and Y, breaking vector-addition commutativity
- `DTS2026062516469` — [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md): RectF::Round() rounds incorrectly for negative coordinates (x+0.5 truncate vs std::round)
- `DTS2026062701168` — [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md): RSColor::FromBgraInt union field-order mismatch with AsBgraInt corrupts every channel on BGRA round-trip
- `DTS2026071430826` — [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md): Point3 operator* / operator/= truncate float channels via integer cast
- `DTS2026072513315` — [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md): IsUtf8 accepts UTF-8 surrogates on signed-char hosts
- `DTS2026073129863` — [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md): UpdateDrawingProperties permanent no-op (enum vs string list size)
- `DTS2026080528903` — [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md): Matrix3::IsNearEqual compares only 8 of 9 elements (data_ + 8)
- `DTS2026080530843` — [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md): CubicResampler::Dump writes cubicCoffB into the cubicCoffC field

High-confidence project: **8** accepted fixes and **no** rejected DTS.

### `arkui_ace_engine`

| Metric | Value |
|--------|------:|
| FIXED | 6 |
| NON-ISSUE | 1 |
| Decided | 7 |
| Precision | 85.7% |

**FIXED DTS**

- `DTS2026061256925` — [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md): GridLayoutInfo::GetContentHeightOfRegularGrid returns negative height for empty grids with positive gap
- `DTS2026061512035` — [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md): GridLayoutInfo::FindInMatrix returns wrong iterator for index=0 when item 0 is absent
- `DTS2026062427183` — [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md): Matrix4::SetEntry uses opposite storage order from Get/Set, breaking off-diagonal round-trips
- `DTS2026062427889` — [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md): GridItemDragManager::FindAvailableColumn returns 0 instead of -1 for impossible span when row is absent
- `DTS2026070318488` — [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md): LazyGridLayoutInfo::UpdatePosMapStart omits spaceWidth_ when rebasing from a non-zero start index
- `DTS2026070856858` — [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md): Color::LineColorTransition UB cast on decreasing channel (legacy DataPanel gradient)

**NON-ISSUE DTS**

- `DTS2026071809266` — GetTotalHeightOfItemsInView empty → -mainGap. *Long-standing formula contract; shared API unchanged.*

Mixed outcomes: maintainers accepted **6** and rejected **1**. Net precision **86%**.

### `communication_netmanager_base`

| Metric | Value |
|--------|------:|
| FIXED | 5 |
| NON-ISSUE | 2 |
| Decided | 7 |
| Precision | 71.4% |

**FIXED DTS**

- `DTS2026050963138` — [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md): netfirewall match_loopback always returns true, classifying all traffic as loopback and short-circuiting deny rules
- `DTS2026062926934` — [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md): ToAnonymousIp(maskMiddle=true) leaks compressed IPv6 addresses to logs unmasked
- `DTS2026070856960` — [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md): CheckIpv4InNet /0 CIDR mask via undefined behavior (1<<32), silently bypassing PAC catch-all proxy rules
- `DTS2026072750511` — [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md): RfindIp6 unsigned underflow hang/OOB when startBytes == 0 miss
- `DTS2026080608464` — [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md): GetIp4AndMask uint32 step wrap → infinite loop when range ends at 255.255.255.255

**NON-ISSUE DTS**

- `DTS2026071725399` — ForkExec SUCCESS on non-zero child exit. *By design — SUCCESS means child created.*
- `DTS2026072720774` — GetAddrFamily rejects zoned IPv6. *Different API jobs, not inconsistency.*

Mixed outcomes: maintainers accepted **5** and rejected **2**. Net precision **71%**.

### `multimedia_camera_framework`

| Metric | Value |
|--------|------:|
| FIXED | 5 |
| NON-ISSUE | 0 |
| Decided | 5 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026070238028` — [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md): FixedSizeList::remove_at corrupts ring buffer after wraparound, losing live elements
- `DTS2026071411883` — [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md): UpdateBasicInfoForStream uncaught std::stoi out_of_range on accepted integer values
- `DTS2026071428596` — [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md): SwitchBeautyValToDataShareVal divides by zero (SIGFPE) when ability range.size() == 1
- `DTS2026072011242` — [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md): sensor-exposure numerator/(denominator/1e6) SIGFPE when |denominator| < 1e6
- `DTS2026072717921` — [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md): CAPTURE_MIRROR_SUPPORTED pair walk OOB on odd item.count

High-confidence project: **5** accepted fixes and **no** rejected DTS.

### `arkcompiler_runtime_core`

| Metric | Value |
|--------|------:|
| FIXED | 4 |
| NON-ISSUE | 0 |
| Decided | 4 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026062915131` — [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md): Range(empty container) underflows to SIZE_MAX, reporting it contains every point
- `DTS2026062916398` — [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md): NumToStr(INT_MIN) triggers signed-overflow undefined behaviour in verifier diagnostic formatter
- `DTS2026071433052` — [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md): GetParams uint8_t loop eternal hang for argument counts in [256, 65535]
- `DTS2026071807957` — [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md): MemoryBufferWriter WriteByte/WriteBytes/AppendRange past-capacity OOB write returns true

High-confidence project: **4** accepted fixes and **no** rejected DTS.

### `multimedia_image_framework`

| Metric | Value |
|--------|------:|
| FIXED | 3 |
| NON-ISSUE | 0 |
| Decided | 3 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072438492` — [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md): PostProc::GetCropValue accepts OOB crops when top+height / left+width overflows int32
- `DTS2026081126994` — [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md): Matrix::SetConcat multiplies translations in scale/translate fast path
- `DTS2026081128460` — [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md): GetValidAlphaTypeByFormat missing RGBA_U16 case returns UNKNOWN

High-confidence project: **3** accepted fixes and **no** rejected DTS.

### `ability_ability_runtime`

| Metric | Value |
|--------|------:|
| FIXED | 2 |
| NON-ISSUE | 0 |
| Decided | 2 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026071544397` — [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md): Stage-model .abc path builder unguarded erase(rfind('.')) crashes app on extensionless srcEntrance
- `DTS2026071809730` — [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md): DataUriUtils::IsNumber accepts floats; GetId silently truncates to integer prefix

### `distributeddatamgr_pasteboard`

| Metric | Value |
|--------|------:|
| FIXED | 2 |
| NON-ISSUE | 0 |
| Decided | 2 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026071412383` — [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md): ProcessDistributedDelayUri exports URI without consulting per-record grant flag (fail-open)
- `DTS2026072000001` — [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md): SetCurrentDistributedData timeout leaves isRunning stuck, permanently disabling cross-device clipboard publish

### `multimedia_av_codec`

| Metric | Value |
|--------|------:|
| FIXED | 2 |
| NON-ISSUE | 0 |
| Decided | 2 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072438019` — [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md): HLS segment byterange offset_+length_-1 wraps in uint32_t → dropped / wrong range
- `DTS2026072935286` — [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md): UriDecode escape guard off-by-one decodes truncated %X as a control byte

### `multimedia_media_foundation`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 2 |
| Decided | 3 |
| Precision | 33.3% |

**FIXED DTS**

- `DTS2026071309672` — [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md): Format::Stringify null-dereferences (SIGSEGV) on a PutIntBuffer entry

**NON-ISSUE DTS**

- `DTS2026071719364` — CopyAVMemory missing offset+size guard. *Unreachable — product src offset always 0.*
- `DTS2026081129774` — DataPacker::IsEmpty inverted. *Dead code — unused on shipped path.*

Mixed outcomes: maintainers accepted **1** and rejected **2**. Net precision **33%**.

### `multimedia_av_session`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 1 |
| Decided | 2 |
| Precision | 50.0% |

**FIXED DTS**

- `DTS2026070722498` — [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md): GetAnonyTitle crashes (SEGV) on all-continuation-byte media titles via empty-vector OOB read

**NON-ISSUE DTS**

- `DTS2026070145311` — ConvertSessionType drops call types. *Product policy — no call-type remote cast requirement.*

Mixed outcomes: maintainers accepted **1** and rejected **1**. Net precision **50%**.

### `communication_wifi`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026071806709` — [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md): HexString2Byte missing null checks and source bounds — OOB read + null deref

### `distributeddatamgr_datamgr_service`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072223098` — [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md): Constant::IsValidPath accepts lone ".."

### `distributedhardware_device_manager`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026052713376`

### `filemanagement_dfs_service`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072326318` — [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md): ChangesResult::ReadFromParcel ignores ChangeData::ReadFromParcel failure

### `filemanagement_storage_service`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072335866` — [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md): SA providers skip CheckUserIdRange on user-scoped IPC

### `multimedia_media_library`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072454808` — [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md): GetFileIdStr returns bucket name on bucket-only URI (npos+1 wrap)

### `multimedia_player_framework`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072457284` — [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md): XmlParser::Destroy double-frees mDoc_ (destructor re-enters without null)

### `window_window_manager`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072347788` — [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md): IsAspectRatioSatisfiedWithSizeLimits decor uint32 underflow rejects valid ratios

### `communication_dsoftbus`

| Metric | Value |
|--------|------:|
| FIXED | 0 |
| NON-ISSUE | 1 |
| Decided | 1 |
| Precision | 0.0% |

**NON-ISSUE DTS**

- `DTS2026072017450` — Hex helpers omit explicit NUL write. *Caller contract — zero-init outBuf owns terminator.*

All dispositioned tickets so far are non-issues — treat new filings with extra contract/call-site evidence.

## Relation to `content/issues/` write-ups

This repo’s [`content/issues/`](../content/issues/) currently carries **52** DTS-linked reports, all status `CONFIRMED_FIXED`.
That set is a **curated success slice** (plus narrative detail), not the full dispositioned population.

| Population | Count | Role |
|------------|------:|------|
| Decided DTS (FIXED + NON-ISSUE) | 54 | Ground truth for precision |
| FIXED | 47 | Maintainer-accepted |
| NON-ISSUE | 7 | Maintainer-rejected |
| Write-ups in `content/issues` with DTS | 52 | Published confirmed bugs |

**Do not** compute precision from `content/issues` alone — it omits non-issues by design. Use this document (or dispositioned rows in `BUG_REPORTS.md`) for acceptance rate.

See also: [DTS tickets by bug type](./dts_bug_types.md) for failure-mode taxonomy of the confirmed set.

## Takeaways

1. **Overall precision is high (87%)** — PBT filings that reach a DTS decision are usually real defects.
2. **False positives cluster in a few patterns** (7 tickets): by-design helpers, dead/unreachable code, caller-owned contracts, intentional product omissions — not flaky reproduction.
3. **Several large surfaces are clean so far** (e.g. `graphic_graphic_2d`, `multimedia_camera_framework`, `arkcompiler_runtime_core` among high-volume FIXED with 0 NON-ISSUE).
4. **Filing bar that non-issues imply:** prove a live production caller, state the product contract, and avoid “algebraic inconsistency across differently purposed APIs” without impact.

## Methodology notes

- One row per unique DTS ID from `BUG_REPORTS.md` (EN reports), **restricted to FIXED and NON-ISSUE**.
- Open/submitted tickets are excluded: outcome unknown, so they must not enter precision or false-positive rates.
- Sibling write-ups sharing one DTS (e.g. dsoftbus NUL trio) count once.
- Status labels follow the inventory (`FIXED` / `NON-ISSUE`), not git-commit archaeology.
- A small number of FIXED DTS in the inventory may lag or lead `content/issues/` sync; counts prefer the cloned inventory as ground truth for precision.
- Non-DTS local reviews under `non-issue/` without a ticket are **excluded** (never filed → not false positives).

