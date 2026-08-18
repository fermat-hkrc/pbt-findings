# Finding Precision by Project (DTS Outcomes)

How often PBT-filed **DTS** tickets were accepted as real bugs versus closed as non-issues, broken down by project.

- **Precision:** **88.1%** (59 FIXED / 67 decided)
- **False-positive rate:** **11.9%** (8 NON-ISSUE)

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

- DTS inventory: `~/cloned/BUG_REPORTS.md` (**101** unique DTS; **37** still SUBMITTED, omitted)
- Confirmed write-ups with DTS: [`content/issues/`](../content/issues/) (**59** issues, all `CONFIRMED_FIXED`)
- Non-issue write-ups: `~/cloned/*/pbt-out/bug_reports/non-issue/` (**8** DTS-stamped)

- **Generated:** 2026-08-18

### Global DTS scoreboard (decided only)

| Status | Count | Share of decided |
|--------|------:|-----------------:|
| FIXED | 59 | 88.1% |
| NON-ISSUE | 8 | 11.9% |
| **Total decided** | **67** | 100% |

- **Precision:** **59/67 = 88.1%** — almost nine in ten closed tickets were real bugs.
- **False-positive rate:** **8/67 = 11.9%**.

> Precision means *maintainer-accepted defect rate among dispositioned DTS*, not static-analysis alert rate. Open/submitted tickets are out of scope until closed.

## Per-project scoreboard

Projects with at least one decided DTS, ordered by decided volume, then precision.

| Project | FIXED | NON-ISSUE | Decided | Precision |
|---------|------:|----------:|--------:|----------:|
| [`communication_netmanager_base`](#communication-netmanager-base) | 7 | 2 | 9 | 78% |
| [`graphic_graphic_2d`](#graphic-graphic-2d) | 8 | 0 | 8 | 100% |
| [`arkui_ace_engine`](#arkui-ace-engine) | 7 | 1 | 8 | 88% |
| [`multimedia_camera_framework`](#multimedia-camera-framework) | 6 | 0 | 6 | 100% |
| [`ability_ability_runtime`](#ability-ability-runtime) | 4 | 0 | 4 | 100% |
| [`arkcompiler_runtime_core`](#arkcompiler-runtime-core) | 4 | 0 | 4 | 100% |
| [`multimedia_image_framework`](#multimedia-image-framework) | 4 | 0 | 4 | 100% |
| [`multimedia_media_foundation`](#multimedia-media-foundation) | 1 | 3 | 4 | 25% |
| [`distributeddatamgr_pasteboard`](#distributeddatamgr-pasteboard) | 2 | 0 | 2 | 100% |
| [`distributedhardware_device_manager`](#distributedhardware-device-manager) | 2 | 0 | 2 | 100% |
| [`multimedia_av_codec`](#multimedia-av-codec) | 2 | 0 | 2 | 100% |
| [`multimedia_av_session`](#multimedia-av-session) | 1 | 1 | 2 | 50% |
| [`multimedia_player_framework`](#multimedia-player-framework) | 2 | 0 | 2 | 100% |
| [`window_window_manager`](#window-window-manager) | 2 | 0 | 2 | 100% |
| [`commonlibrary_rust_ylong_http`](#commonlibrary-rust-ylong-http) | 1 | 0 | 1 | 100% |
| [`communication_wifi`](#communication-wifi) | 1 | 0 | 1 | 100% |
| [`distributeddatamgr_datamgr_service`](#distributeddatamgr-datamgr-service) | 1 | 0 | 1 | 100% |
| [`distributedhardware_distributed_hardware_fwk`](#distributedhardware-distributed-hardware-fwk) | 1 | 0 | 1 | 100% |
| [`filemanagement_dfs_service`](#filemanagement-dfs-service) | 1 | 0 | 1 | 100% |
| [`filemanagement_storage_service`](#filemanagement-storage-service) | 1 | 0 | 1 | 100% |
| [`multimedia_media_library`](#multimedia-media-library) | 1 | 0 | 1 | 100% |
| [`communication_dsoftbus`](#communication-dsoftbus) | 0 | 1 | 1 | 0% |
| **Total** | **59** | **8** | **67** | **88%** |

## Precision tiers

### Tier A — Perfect precision (100%, ≥1 FIXED, 0 NON-ISSUE)

`graphic_graphic_2d` (8 fixed), `multimedia_camera_framework` (6 fixed), `ability_ability_runtime` (4 fixed), `arkcompiler_runtime_core` (4 fixed), `multimedia_image_framework` (4 fixed), `distributeddatamgr_pasteboard` (2 fixed), `distributedhardware_device_manager` (2 fixed), `multimedia_av_codec` (2 fixed), `multimedia_player_framework` (2 fixed), `window_window_manager` (2 fixed), `commonlibrary_rust_ylong_http` (1 fixed), `communication_wifi` (1 fixed), `distributeddatamgr_datamgr_service` (1 fixed), `distributedhardware_distributed_hardware_fwk` (1 fixed), `filemanagement_dfs_service` (1 fixed), `filemanagement_storage_service` (1 fixed), `multimedia_media_library` (1 fixed)

These projects have **no maintainer-rejected DTS** among dispositioned tickets.

### Tier B — Mixed (both FIXED and NON-ISSUE)

| Project | FIXED | NON-ISSUE | Precision | What non-issues teach |
|---------|------:|----------:|----------:|----------------------|
| `arkui_ace_engine` | 7 | 1 | 88% | Empty-grid `-mainGap` is stable formula output, not a defect; real layout/math bugs still fixed at high rate. |
| `communication_netmanager_base` | 7 | 2 | 78% | Helper semantics (ForkExec) and API role split (zoned IPv6) ≠ bugs; firewall/IP/mask defects accepted. |
| `multimedia_media_foundation` | 1 | 3 | 25% | Abstract OOB / dead inverted predicate / shipped CAPI cap rejected; live `Format::Stringify` null-deref fixed. |
| `multimedia_av_session` | 1 | 1 | 50% | Call-type JSON omission = product policy; OOB crash in `GetAnonyTitle` still fixed. |

### Tier C — Only NON-ISSUE (0 FIXED)

- `communication_dsoftbus`: 1 non-issue — dispositioned findings not accepted as product bugs.

## Non-issue DTS catalog (all projects)

All **8** maintainer-rejected tickets. Useful as negative examples for future filing.

| DTS | Project | Report theme | Rejection class |
|-----|---------|--------------|-----------------|
| `DTS2026071809266` | `arkui_ace_engine` | GetTotalHeightOfItemsInView empty → -mainGap | Stable API contract (formula) |
| `DTS2026072017450` | `communication_dsoftbus` | Hex helpers omit explicit NUL write | Caller-owned contract (internal API) |
| `DTS2026071725399` | `communication_netmanager_base` | ForkExec SUCCESS on non-zero child exit | By-design helper semantics |
| `DTS2026072720774` | `communication_netmanager_base` | GetAddrFamily rejects zoned IPv6 | Different APIs, different jobs |
| `DTS2026070145311` | `multimedia_av_session` | ConvertSessionType drops call types | Product policy / intentional omission |
| `DTS2026071719364` | `multimedia_media_foundation` | CopyAVMemory missing offset+size guard | Unreachable under product invariant |
| `DTS2026081129774` | `multimedia_media_foundation` | DataPacker::IsEmpty inverted | Dead code / no shipped callers |
| `DTS2026081131247` | `multimedia_media_foundation` | OH_AVFormat GetString/Dump/GetKey cap + strcpy_s | Shipped CAPI contract (incompatible to change) |

### Rejection classes (count)

| Class | Count | Implication for future PBT filings |
|------:|------:|--------------------------------------|
| By-design / product policy / stable contract | 4 | Validate *product* intent and call-graph impact, not only algebraic oddity |
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
| FIXED | 7 |
| NON-ISSUE | 1 |
| Decided | 8 |
| Precision | 87.5% |

**FIXED DTS**

- `DTS2026061256925` — [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md): GridLayoutInfo::GetContentHeightOfRegularGrid returns negative height for empty grids with positive gap
- `DTS2026061512035` — [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md): GridLayoutInfo::FindInMatrix returns wrong iterator for index=0 when item 0 is absent
- `DTS2026062427183` — [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md): Matrix4::SetEntry uses opposite storage order from Get/Set, breaking off-diagonal round-trips
- `DTS2026062427889` — [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md): GridItemDragManager::FindAvailableColumn returns 0 instead of -1 for impossible span when row is absent
- `DTS2026070318488` — [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md): LazyGridLayoutInfo::UpdatePosMapStart omits spaceWidth_ when rebasing from a non-zero start index
- `DTS2026070856858` — [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md): Color::LineColorTransition UB cast on decreasing channel (legacy DataPanel gradient)
- `DTS2026072325132` — [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md): GetIrregularHeight divides by zero → +inf content height when itemRatio == 0

**NON-ISSUE DTS**

- `DTS2026071809266` — GetTotalHeightOfItemsInView empty → -mainGap. *Long-standing formula contract; shared API unchanged.*

Mixed outcomes: maintainers accepted **7** and rejected **1**. Net precision **88%**.

### `communication_netmanager_base`

| Metric | Value |
|--------|------:|
| FIXED | 7 |
| NON-ISSUE | 2 |
| Decided | 9 |
| Precision | 77.8% |

**FIXED DTS**

- `DTS2026050963138` — [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md): netfirewall match_loopback always returns true, classifying all traffic as loopback and short-circuiting deny rules
- `DTS2026062926934` — [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md): ToAnonymousIp(maskMiddle=true) leaks compressed IPv6 addresses to logs unmasked
- `DTS2026070856960` — [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md): CheckIpv4InNet /0 CIDR mask via undefined behavior (1<<32), silently bypassing PAC catch-all proxy rules
- `DTS2026072750511` — [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md): RfindIp6 unsigned underflow hang/OOB when startBytes == 0 miss
- `DTS2026080608464` — [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md): GetIp4AndMask uint32 step wrap → infinite loop when range ends at 255.255.255.255
- `DTS2026081135903` — [OH-2026-NET-007](../content/issues/OH-2026-NET-007.md): CheckIpv6InNet missing prefix bounds — match-all on negative / OOB on /129+
- `DTS2026081136698` — [OH-2026-NET-006](../content/issues/OH-2026-NET-006.md): Ip6RuleMap::GetNetworkAddress OOB on prefixLen > 128

**NON-ISSUE DTS**

- `DTS2026071725399` — ForkExec SUCCESS on non-zero child exit. *By design — SUCCESS means child created.*
- `DTS2026072720774` — GetAddrFamily rejects zoned IPv6. *Different API jobs, not inconsistency.*

Mixed outcomes: maintainers accepted **7** and rejected **2**. Net precision **78%**.

### `multimedia_camera_framework`

| Metric | Value |
|--------|------:|
| FIXED | 6 |
| NON-ISSUE | 0 |
| Decided | 6 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026070238028` — [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md): FixedSizeList::remove_at corrupts ring buffer after wraparound, losing live elements
- `DTS2026071303295` — [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md): IsDoubleRegex guard too permissive → uncaught std::stoi throw in SetParameters
- `DTS2026071411883` — [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md): UpdateBasicInfoForStream uncaught std::stoi out_of_range on accepted integer values
- `DTS2026071428596` — [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md): SwitchBeautyValToDataShareVal divides by zero (SIGFPE) when ability range.size() == 1
- `DTS2026072011242` — [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md): sensor-exposure numerator/(denominator/1e6) SIGFPE when |denominator| < 1e6
- `DTS2026072717921` — [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md): CAPTURE_MIRROR_SUPPORTED pair walk OOB on odd item.count

High-confidence project: **6** accepted fixes and **no** rejected DTS.

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
| FIXED | 4 |
| NON-ISSUE | 0 |
| Decided | 4 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072438492` — [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md): PostProc::GetCropValue accepts OOB crops when top+height / left+width overflows int32
- `DTS2026073015200` — [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md): Matrix::SetTranslate tags IDENTITY when either axis is zero
- `DTS2026081126994` — [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md): Matrix::SetConcat multiplies translations in scale/translate fast path
- `DTS2026081128460` — [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md): GetValidAlphaTypeByFormat missing RGBA_U16 case returns UNKNOWN

High-confidence project: **4** accepted fixes and **no** rejected DTS.

### `ability_ability_runtime`

| Metric | Value |
|--------|------:|
| FIXED | 4 |
| NON-ISSUE | 0 |
| Decided | 4 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026071544397` — [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md): Stage-model .abc path builder unguarded erase(rfind('.')) crashes app on extensionless srcEntrance
- `DTS2026071809730` — [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md): DataUriUtils::IsNumber accepts floats; GetId silently truncates to integer prefix
- `DTS2026072514260` — [OH-2026-ABILITY-003](../content/issues/OH-2026-ABILITY-003.md): ParseURI catch indexes uriVec past the end after last-field stoi failure
- `DTS2026073173354` — [OH-2026-ABILITY-004](../content/issues/OH-2026-ABILITY-004.md): CheckFileManagerUriPermission matches Download/Desktop/Documents prefix without '/' boundary

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
| NON-ISSUE | 3 |
| Decided | 4 |
| Precision | 25.0% |

**FIXED DTS**

- `DTS2026071309672` — [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md): Format::Stringify null-dereferences (SIGSEGV) on a PutIntBuffer entry

**NON-ISSUE DTS**

- `DTS2026071719364` — CopyAVMemory missing offset+size guard. *Unreachable — product src offset always 0.*
- `DTS2026081129774` — DataPacker::IsEmpty inverted. *Dead code — unused on shipped path.*
- `DTS2026081131247` — OH_AVFormat GetString/Dump/GetKey cap + strcpy_s. *Shipped CAPI contract — incompatible to change.*

Mixed outcomes: maintainers accepted **1** and rejected **3**. Net precision **25%**.

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
| FIXED | 2 |
| NON-ISSUE | 0 |
| Decided | 2 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026052974442` — [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md): GeneratePinCode off-by-one loop condition returns short PIN ~16% of the time
- `DTS2026073020799` — [OH-2026-DEVMGR-004](../content/issues/OH-2026-DEVMGR-004.md): GenerateRandNum invalid uniform_int_distribution(1, 0xFFFFFFFF) → SIGSEGV

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
| FIXED | 2 |
| NON-ISSUE | 0 |
| Decided | 2 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072457284` — [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md): XmlParser::Destroy double-frees mDoc_ (destructor re-enters without null)
- `DTS2026081318473` — [OH-2026-PLAYER-002](../content/issues/OH-2026-PLAYER-002.md): TransRecorderStatus muxer map missing START + duplicate STOP key

### `window_window_manager`

| Metric | Value |
|--------|------:|
| FIXED | 2 |
| NON-ISSUE | 0 |
| Decided | 2 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026072347788` — [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md): IsAspectRatioSatisfiedWithSizeLimits decor uint32 underflow rejects valid ratios
- `DTS2026072921166` — [OH-2026-WM-002](../content/issues/OH-2026-WM-002.md): ComputeRectByAspectRatio cascade decor strip uint32 underflow

### `commonlibrary_rust_ylong_http`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026052810677` — [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md): Certificate pinning bypass via wrong pointer in verify_pinned_pubkey

### `distributedhardware_distributed_hardware_fwk`

| Metric | Value |
|--------|------:|
| FIXED | 1 |
| NON-ISSUE | 0 |
| Decided | 1 |
| Precision | 100.0% |

**FIXED DTS**

- `DTS2026060814531` — [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md): cJSON uint validators accept values that overflow the destination type due to wrap-around in static_cast

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

This repo’s [`content/issues/`](../content/issues/) currently carries **59** DTS-linked reports, all status `CONFIRMED_FIXED`.
That set is the **FIXED** count here. Non-issues come from `~/cloned/BUG_REPORTS.md` / `pbt-out/bug_reports/non-issue/`.

| Population | Count | Role |
|------------|------:|------|
| Decided DTS (FIXED + NON-ISSUE) | 67 | Ground truth for precision |
| FIXED | 59 | Maintainer-accepted (`content/issues`) |
| NON-ISSUE | 8 | Maintainer-rejected (cloned inventory) |
| Write-ups in `content/issues` with DTS | 59 | Published confirmed bugs |

**Do not** compute precision from `content/issues` alone — it omits non-issues by design. Use this document (or dispositioned rows in `BUG_REPORTS.md`) for acceptance rate.

See also: [DTS tickets by bug type](./dts_bug_types.md) for failure-mode taxonomy of the confirmed set.

## Takeaways

1. **Overall precision is high (88%)** — PBT filings that reach a DTS decision are usually real defects.
2. **False positives cluster in a few patterns** (8 tickets): by-design helpers, dead/unreachable code, caller-owned contracts, shipped CAPI / product omissions — not flaky reproduction.
3. **Several large surfaces are clean so far** (e.g. `graphic_graphic_2d`, `multimedia_camera_framework`, `arkcompiler_runtime_core` among high-volume FIXED with 0 NON-ISSUE).
4. **Filing bar that non-issues imply:** prove a live production caller, state the product contract, and avoid “algebraic inconsistency across differently purposed APIs” without impact.

## Methodology notes

- One row per unique DTS ID from `BUG_REPORTS.md` (EN reports), **restricted to FIXED and NON-ISSUE**.
- Open/submitted tickets are excluded: outcome unknown, so they must not enter precision or false-positive rates.
- Sibling write-ups sharing one DTS (e.g. dsoftbus NUL trio) count once.
- Status labels follow the inventory (`FIXED` / `NON-ISSUE`), not git-commit archaeology.
- FIXED counts follow `content/issues/` (`CONFIRMED_FIXED`). NON-ISSUE counts follow DTS-stamped reports under `~/cloned/*/pbt-out/bug_reports/non-issue/` (`BUG_REPORTS.md`).
- Non-DTS local reviews under `non-issue/` without a ticket are **excluded** (never filed → not false positives).

