# DTS Tickets by Detecting Property

Categorization of [`content/issues/`](../content/issues/) findings that carry a **DTS** ticket (`internal_issue_id`), grouped by the **pi-pbt property (oracle)** that found each ticket. CWE / failure-mode grouping is archived at the end of [`finding_precision_by_project.md`](finding_precision_by_project.md).

- **Confirmed (FIXED)**: **73** — listed below (`CONFIRMED_FIXED` write-ups)
- **Non-issue**: **11** — [catalog](#non-issues)
- **Decided**: **84** = 73 + 11
- **Precision**: **86.9%** = `73 / (73 + 11)` = confirmed / (confirmed + non-issues)
- **Severity** (confirmed only): HIGH=15, MEDIUM=56, LOW=2
- **Generated**: 2026-08-25

## Overview


Oracle taxonomy from [pi-pbt `docs/oracles.md`](https://github.com/fermat-hkrc/pbt-agent/blob/main/docs/oracles.md). Each ticket is tagged with the **strongest property that actually failed** (from the write-up / cloned harness), not the CWE symptom.

| Property (oracle) | Count | HIGH | MEDIUM | LOW |
|----------|------:|-----:|-------:|----:|
| [State Machine](#state-machine) | 2 | 1 | 0 | 1 |
| [Differential](#differential) | 19 | 0 | 19 | 0 |
| [Algebraic — Round-trip](#algebraic--round-trip) | 3 | 2 | 1 | 0 |
| [Algebraic — Metamorphic](#algebraic--metamorphic) | 3 | 1 | 2 | 0 |
| [Algebraic — Invariant](#algebraic--invariant) | 27 | 7 | 19 | 1 |
| [Negative / Error Contract](#negative--error-contract) | 5 | 0 | 5 | 0 |
| [Reference](#reference) | 5 | 1 | 4 | 0 |
| [Crash-Only](#crash-only) | 9 | 3 | 6 | 0 |
| **Total** | **73** | **15** | **56** | **2** |

Strength order: State Machine ≻ Differential ≻ Algebraic (Round-trip ≻ Idempotence ≻ Metamorphic ≻ Invariant ≻ Negative/Error) ≻ Reference ≻ Crash-Only. **Idempotence: 0** in this set.

### By module

`FIXED` = this catalog. `NI` = [non-issues](#non-issues). **Precision** = `FIXED / (FIXED + NI)`.

| Module | FIXED | NI | HIGH | MEDIUM | LOW | Precision |
|--------|------:|---:|-----:|-------:|----:|----------:|
| `multimedia_camera_framework` | 11 | 0 | 0 | 10 | 1 | 100% |
| `multimedia_image_framework` | 9 | 0 | 1 | 8 | 0 | 100% |
| `arkui_ace_engine` | 8 | 1 | 4 | 4 | 0 | 89% |
| `graphic_graphic_2d` | 8 | 0 | 2 | 5 | 1 | 100% |
| `communication_netmanager_base` | 7 | 2 | 2 | 5 | 0 | 78% |
| `arkcompiler_runtime_core` | 5 | 1 | 0 | 5 | 0 | 83% |
| `ability_ability_runtime` | 4 | 0 | 0 | 4 | 0 | 100% |
| `multimedia_av_codec` | 3 | 0 | 0 | 3 | 0 | 100% |
| `distributeddatamgr_pasteboard` | 2 | 0 | 1 | 1 | 0 | 100% |
| `distributedhardware_device_manager` | 2 | 1 | 2 | 0 | 0 | 67% |
| `multimedia_player_framework` | 2 | 0 | 0 | 2 | 0 | 100% |
| `window_window_manager` | 2 | 0 | 0 | 2 | 0 | 100% |
| `commonlibrary_rust_ylong_http` | 1 | 0 | 1 | 0 | 0 | 100% |
| `communication_dsoftbus` | 1 | 1 | 0 | 1 | 0 | 50% |
| `communication_wifi` | 1 | 0 | 0 | 1 | 0 | 100% |
| `distributeddatamgr_datamgr_service` | 1 | 0 | 0 | 1 | 0 | 100% |
| `distributedhardware_distributed_hardware_fwk` | 1 | 0 | 0 | 1 | 0 | 100% |
| `filemanagement_dfs_service` | 1 | 0 | 0 | 1 | 0 | 100% |
| `filemanagement_storage_service` | 1 | 0 | 0 | 1 | 0 | 100% |
| `multimedia_av_session` | 1 | 1 | 1 | 0 | 0 | 50% |
| `multimedia_media_foundation` | 1 | 4 | 1 | 0 | 0 | 20% |
| `multimedia_media_library` | 1 | 0 | 0 | 1 | 0 | 100% |
| **Total** | **73** | **11** | **15** | **56** | **2** | **87%** |

## DTS index

| DTS | Issue ID | Property | Severity | Repo |
|-----|----------|----------|----------|------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | Algebraic — Invariant | HIGH | `communication_netmanager_base` |
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | Reference | HIGH | `commonlibrary_rust_ylong_http` |
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | Algebraic — Invariant | HIGH | `distributedhardware_device_manager` |
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | Algebraic — Invariant | MEDIUM | `distributedhardware_distributed_hardware_fwk` |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | Algebraic — Invariant | MEDIUM | `arkui_ace_engine` |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | Algebraic — Invariant | HIGH | `arkui_ace_engine` |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | Algebraic — Round-trip | MEDIUM | `arkui_ace_engine` |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | Algebraic — Invariant | HIGH | `arkui_ace_engine` |
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | Algebraic — Metamorphic | HIGH | `graphic_graphic_2d` |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | Reference | MEDIUM | `graphic_graphic_2d` |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | Algebraic — Round-trip | HIGH | `graphic_graphic_2d` |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | Algebraic — Invariant | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | Differential | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | Algebraic — Invariant | MEDIUM | `communication_netmanager_base` |
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | State Machine | LOW | `multimedia_camera_framework` |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | Algebraic — Invariant | HIGH | `arkui_ace_engine` |
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | Crash-Only | HIGH | `multimedia_av_session` |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | Algebraic — Invariant | MEDIUM | `arkui_ace_engine` |
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | Algebraic — Invariant | HIGH | `communication_netmanager_base` |
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | Differential | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | Crash-Only | HIGH | `multimedia_media_foundation` |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | Differential | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | Differential | MEDIUM | `distributeddatamgr_pasteboard` |
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | Negative / Error Contract | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | Algebraic — Metamorphic | MEDIUM | `graphic_graphic_2d` |
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | Algebraic — Invariant | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | Crash-Only | MEDIUM | `ability_ability_runtime` |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | Crash-Only | MEDIUM | `communication_wifi` |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | Algebraic — Invariant | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | Negative / Error Contract | MEDIUM | `ability_ability_runtime` |
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | State Machine | HIGH | `distributeddatamgr_pasteboard` |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | Algebraic — Invariant | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | Negative / Error Contract | MEDIUM | `distributeddatamgr_datamgr_service` |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | Algebraic — Invariant | HIGH | `arkui_ace_engine` |
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | Differential | MEDIUM | `filemanagement_dfs_service` |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | Negative / Error Contract | MEDIUM | `filemanagement_storage_service` |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | Differential | MEDIUM | `window_window_manager` |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | Differential | MEDIUM | `multimedia_av_codec` |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | Algebraic — Invariant | MEDIUM | `multimedia_image_framework` |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | Algebraic — Invariant | MEDIUM | `multimedia_media_library` |
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | Crash-Only | MEDIUM | `multimedia_player_framework` |
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | Reference | MEDIUM | `graphic_graphic_2d` |
| `DTS2026072514260` | [OH-2026-ABILITY-003](../content/issues/OH-2026-ABILITY-003.md) | Crash-Only | MEDIUM | `ability_ability_runtime` |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | Crash-Only | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | Algebraic — Invariant | MEDIUM | `communication_netmanager_base` |
| `DTS2026072921166` | [OH-2026-WM-002](../content/issues/OH-2026-WM-002.md) | Differential | MEDIUM | `window_window_manager` |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | Negative / Error Contract | MEDIUM | `multimedia_av_codec` |
| `DTS2026073013382` | [OH-2026-IMG-009](../content/issues/OH-2026-IMG-009.md) | Algebraic — Invariant | MEDIUM | `multimedia_image_framework` |
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | Algebraic — Round-trip | HIGH | `multimedia_image_framework` |
| `DTS2026073020799` | [OH-2026-DEVMGR-004](../content/issues/OH-2026-DEVMGR-004.md) | Crash-Only | HIGH | `distributedhardware_device_manager` |
| `DTS2026073112258` | [ARK-2026-STR-001](../content/issues/ARK-2026-STR-001.md) | Algebraic — Invariant | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026073116282` | [OH-2026-ARKUI-008](../content/issues/OH-2026-ARKUI-008.md) | Algebraic — Invariant | MEDIUM | `arkui_ace_engine` |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | Algebraic — Invariant | MEDIUM | `graphic_graphic_2d` |
| `DTS2026073173354` | [OH-2026-ABILITY-004](../content/issues/OH-2026-ABILITY-004.md) | Differential | MEDIUM | `ability_ability_runtime` |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | Algebraic — Invariant | MEDIUM | `graphic_graphic_2d` |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | Algebraic — Invariant | LOW | `graphic_graphic_2d` |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | Algebraic — Invariant | MEDIUM | `communication_netmanager_base` |
| `DTS2026080813420` | [OH-2026-CAM-007](../content/issues/OH-2026-CAM-007.md) | Crash-Only | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813622` | [OH-2026-CAM-008](../content/issues/OH-2026-CAM-008.md) | Differential | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813794` | [OH-2026-CAM-009](../content/issues/OH-2026-CAM-009.md) | Differential | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813827` | [OH-2026-CAM-010](../content/issues/OH-2026-CAM-010.md) | Algebraic — Invariant | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813868` | [OH-2026-CAM-011](../content/issues/OH-2026-CAM-011.md) | Algebraic — Invariant | MEDIUM | `multimedia_camera_framework` |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | Differential | MEDIUM | `multimedia_image_framework` |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | Differential | MEDIUM | `multimedia_image_framework` |
| `DTS2026081135903` | [OH-2026-NET-007](../content/issues/OH-2026-NET-007.md) | Differential | MEDIUM | `communication_netmanager_base` |
| `DTS2026081136698` | [OH-2026-NET-006](../content/issues/OH-2026-NET-006.md) | Differential | MEDIUM | `communication_netmanager_base` |
| `DTS2026081318473` | [OH-2026-PLAYER-002](../content/issues/OH-2026-PLAYER-002.md) | Algebraic — Metamorphic | MEDIUM | `multimedia_player_framework` |
| `DTS2026081413702` | [OH-2026-IMG-008](../content/issues/OH-2026-IMG-008.md) | Differential | MEDIUM | `multimedia_image_framework` |
| `DTS2026081417372` | [OH-2026-IMG-010](../content/issues/OH-2026-IMG-010.md) | Reference | MEDIUM | `multimedia_image_framework` |
| `DTS2026081421810` | [OH-2026-IMG-007](../content/issues/OH-2026-IMG-007.md) | Differential | MEDIUM | `multimedia_image_framework` |
| `DTS2026081424330` | [OH-2026-IMG-006](../content/issues/OH-2026-IMG-006.md) | Reference | MEDIUM | `multimedia_image_framework` |
| `DTS2026081713997` | [OH-2026-AVCODEC-003](../content/issues/OH-2026-AVCODEC-003.md) | Differential | MEDIUM | `multimedia_av_codec` |
| `DTS2026082023118` | [OH-2026-DSOFTBUS-001](../content/issues/OH-2026-DSOFTBUS-001.md) | Differential | MEDIUM | `communication_dsoftbus` |

## Detecting property (oracle)

How the bug was found. Taxonomy and strength order follow pi-pbt (`pbt-oracles`). CWE / failure-mode grouping lives in [`finding_precision_by_project.md`](finding_precision_by_project.md#archived-dts-tickets-by-bug-type).

<a id="state-machine"></a>

### State Machine

Operation sequences vs an independent model (lifecycle / collection).

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | LOW | FixedSizeList ≡ bounded FIFO model across add/remove |
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | HIGH | any worker stop (incl. timeout) clears isRunning |

<a id="differential"></a>

### Differential

Candidate vs a same-job sibling or independent implementation of the same contract.

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | MEDIUM | NumToStr(n) == std::to_string(n) for all int32 |
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | MEDIUM | IsDoubleRegex accept ⇒ caller std::stoi does not throw |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | MEDIUM | isIntegerRegex accept ⇒ std::stoi does not throw |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | MEDIUM | export URI only when per-record grant is set (sibling include rule) |
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | MEDIUM | item ReadFromParcel failure rejects, as Marshalling sibling does |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | MEDIUM | aspect-ratio check agrees with widened uint oracle |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | MEDIUM | byterange end agrees with widened (secure) add |
| `DTS2026072921166` | [OH-2026-WM-002](../content/issues/OH-2026-WM-002.md) | MEDIUM | cascade decor strip agrees with widened uint oracle |
| `DTS2026073173354` | [OH-2026-ABILITY-004](../content/issues/OH-2026-ABILITY-004.md) | MEDIUM | prefix match ≡ slash-boundary membership oracle |
| `DTS2026080813622` | [OH-2026-CAM-008](../content/issues/OH-2026-CAM-008.md) | MEDIUM | GetZoomRatioRange bound ≡ GetRAWZoomRatioRange sibling |
| `DTS2026080813794` | [OH-2026-CAM-009](../content/issues/OH-2026-CAM-009.md) | MEDIUM | moon FOV look-ahead ≡ sketch spec-FOV sibling bound |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | MEDIUM | scale/translate concat ≡ MulAddMul / rotate-path sibling |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | MEDIUM | RGBA_U16 alpha type matches RGBA_F16 sibling group |
| `DTS2026081135903` | [OH-2026-NET-007](../content/issues/OH-2026-NET-007.md) | MEDIUM | CheckIpv6InNet prefix bound ≡ fixed CheckIpv4InNet sibling |
| `DTS2026081136698` | [OH-2026-NET-006](../content/issues/OH-2026-NET-006.md) | MEDIUM | IPv6 GetNetworkAddress prefix bound ≡ IPv4 sibling insert reject |
| `DTS2026081413702` | [OH-2026-IMG-008](../content/issues/OH-2026-IMG-008.md) | MEDIUM | HalfToUint32 LE/BE matches sibling assemble + HalfToFloat |
| `DTS2026081421810` | [OH-2026-IMG-007](../content/issues/OH-2026-IMG-007.md) | MEDIUM | IsLegalAxis agrees with int64 widened oracle |
| `DTS2026081713997` | [OH-2026-AVCODEC-003](../content/issues/OH-2026-AVCODEC-003.md) | MEDIUM | TITLE excludes the comma, same as DURATION sibling |
| `DTS2026082023118` | [OH-2026-DSOFTBUS-001](../content/issues/OH-2026-DSOFTBUS-001.md) | MEDIUM | ConnectGroup size guard ≡ P2pConnectGroup sibling (size ≥ MODE) |

<a id="algebraic--round-trip"></a>

### Algebraic — Round-trip

`f⁻¹(f(x)) = x` (or Get/Set, encode/decode identity).

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | MEDIUM | Get(SetEntry(row,col,v)) == v |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | HIGH | FromBgraInt(AsBgraInt(c)) == c |
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | HIGH | axis translate maps points and invert negates |

<a id="algebraic--metamorphic"></a>

### Algebraic — Metamorphic

A source-grounded input transform implies a relation on outputs (`a+b==b+a`, name symmetry, `p*=s` vs `p*s`).

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | HIGH | Point3 addition is commutative: a+b == b+a |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | MEDIUM | (p*s).xyz == p.xyz*s; p/=s agrees with p/s |
| `DTS2026081318473` | [OH-2026-PLAYER-002](../content/issues/OH-2026-PLAYER-002.md) | MEDIUM | muxer START/STOP map names match encoder-family symmetry |

<a id="algebraic--invariant"></a>

### Algebraic — Invariant

`P(f(x))` holds for all generated x (finite, in-range, terminates, structural).

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | HIGH | match_loopback is true only for loopback endpoints |
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | HIGH | GeneratePinCode length == requested pinLength |
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | MEDIUM | uint validators accept only values that fit the destination type |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | MEDIUM | layout height ≥ 0 |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | HIGH | FindInMatrix(x) found iff x is in the matrix |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | HIGH | impossible span returns -1 |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | MEDIUM | empty Range contains nothing; indices only in [0, size) |
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | MEDIUM | ToAnonymousIp(ip, true) ≠ ip for every valid IP |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | HIGH | lazy-grid line-position rebase includes spaceWidth_ |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | MEDIUM | channel lerp is linear for increasing and decreasing channels |
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | HIGH | CIDR /0 matches every IPv4 address |
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | MEDIUM | GetParams terminates for N in [0, 65535] |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | MEDIUM | past-capacity write returns false / stays in bounds |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | MEDIUM | accepted exposure denominator ⇒ inner divisor ≠ 0 |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | HIGH | GetIrregularHeight is finite and non-negative |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | MEDIUM | int32 overflow of top+height / left+width is never a valid crop |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | MEDIUM | bucket-only URI has no file id (not the bucket name) |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | MEDIUM | RfindIp6 terminates for every start/end query |
| `DTS2026073013382` | [OH-2026-IMG-009](../content/issues/OH-2026-IMG-009.md) | MEDIUM | width*bpp overflow ⇒ tiny stride rejected |
| `DTS2026073112258` | [ARK-2026-STR-001](../content/issues/ARK-2026-STR-001.md) | MEDIUM | "/" strip does not corrupt size() |
| `DTS2026073116282` | [OH-2026-ARKUI-008](../content/issues/OH-2026-ARKUI-008.md) | MEDIUM | circleAngle is finite for any stroke |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | MEDIUM | setting a drawing.disable* param then Update disables that flag |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | MEDIUM | IsNearEqual uses all 9 matrix elements |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | LOW | Dump prints cubicCoffB and cubicCoffC independently |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | MEDIUM | GetIp4AndMask terminates when the range ends at 255.255.255.255 |
| `DTS2026080813827` | [OH-2026-CAM-010](../content/issues/OH-2026-CAM-010.md) | MEDIUM | TLV remaining length covers claimed 3×num points |
| `DTS2026080813868` | [OH-2026-CAM-011](../content/issues/OH-2026-CAM-011.md) | MEDIUM | length-prefix payload fits in remaining count |

<a id="negative--error-contract"></a>

### Negative / Error Contract

Inputs outside the valid domain are rejected as specified.

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | MEDIUM | single-element beauty range returns OK/INVALID_ARG, never SIGFPE |
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | MEDIUM | IsNumber rejects floats; GetId does not truncate |
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | MEDIUM | IsValidPath rejects lone ".." |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | MEDIUM | out-of-range userId is rejected (CheckUserIdRange) |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | MEDIUM | truncated %X is not decoded as a byte |

<a id="reference"></a>

### Reference

Authoritative spec / stdlib / IEEE / Unicode / pinning contract that this SUT claims.

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | HIGH | client with the cert's real SPKI pin completes the request |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | MEDIUM | RectF::Round edge-wise matches std::round |
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | MEDIUM | IsUtf8 rejects UTF-8 surrogate halves (Unicode) |
| `DTS2026081417372` | [OH-2026-IMG-010](../content/issues/OH-2026-IMG-010.md) | MEDIUM | FloatToHalf(±0) == IEEE half zero |
| `DTS2026081424330` | [OH-2026-IMG-006](../content/issues/OH-2026-IMG-006.md) | MEDIUM | HalfToFloat(+0) == 0.0f (IEEE half) |

<a id="crash-only"></a>

### Crash-Only

`f(x) ≠ ⊥` — no SEGV / SIGFPE / uncaught throw / double-free on the tested domain. Last-resort oracle.

| DTS | ID | Severity | Failing property |
|-----|----|----------|------------------|
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | HIGH | GetAnonyTitle never crashes on continuation-only titles |
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | HIGH | Stringify survives any public Put* including PutIntBuffer |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | MEDIUM | abc-path builder never throws on any srcEntrance |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | MEDIUM | null / short hex does not crash HexString2Byte |
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | MEDIUM | Destroy + destructor does not double-free |
| `DTS2026072514260` | [OH-2026-ABILITY-003](../content/issues/OH-2026-ABILITY-003.md) | MEDIUM | ParseURI catch never indexes uriVec past end |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | MEDIUM | odd-count pair walk must not OOB |
| `DTS2026073020799` | [OH-2026-DEVMGR-004](../content/issues/OH-2026-DEVMGR-004.md) | HIGH | GenerateRandNum samples a valid distribution (no SIGSEGV) |
| `DTS2026080813420` | [OH-2026-CAM-007](../content/issues/OH-2026-CAM-007.md) | MEDIUM | short/odd HIGH_QUALITY_SUPPORT must not OOB |

## Non-issues

Maintainer-rejected DTS. Counted in the denominator only.

**Precision** = confirmed / (confirmed + non-issues) = **73 / (73 + 11) = 86.9%**.

| DTS | Project | Theme | Why non-issue |
|-----|---------|-------|---------------|
| `DTS2026070145311` | `multimedia_av_session` | ConvertSessionType drops call types | Product policy — no call-type remote-cast requirement. |
| `DTS2026070663477` | `distributedhardware_device_manager` | JsonObject cJSON int64 round-trip loss | Dead backend — production uses nlohmann_json (`use_nlohmann_json = true`). |
| `DTS2026071719364` | `multimedia_media_foundation` | CopyAVMemory missing offset+size guard | Unreachable — product src offset is always 0. |
| `DTS2026071725399` | `communication_netmanager_base` | ForkExec SUCCESS on non-zero child exit | By design — SUCCESS means the child was created. |
| `DTS2026071809266` | `arkui_ace_engine` | GetTotalHeightOfItemsInView empty → `-mainGap` | Stable formula contract; shared API unchanged. |
| `DTS2026072017450` | `communication_dsoftbus` | Hex helpers omit explicit NUL write | Caller-owned contract — zero-init `outBuf` owns the terminator. |
| `DTS2026072517792` | `arkcompiler_runtime_core` | SkipULeb128 empty/truncated OOB | By design — `void` helper has no error channel; malformed ULEB is fatal; debug `ASSERT` is the stop. |
| `DTS2026072720774` | `communication_netmanager_base` | GetAddrFamily rejects zoned IPv6 | Different APIs, different jobs — not inconsistency. |
| `DTS2026072938754` | `multimedia_media_foundation` | Format::Stringify SIGSEGV on bool-stored tag | Not reproduced on product `-O2`; crash only on host `-O0`. |
| `DTS2026081129774` | `multimedia_media_foundation` | DataPacker::IsEmpty inverted | Dead code — unused on the shipped path. |
| `DTS2026081131247` | `multimedia_media_foundation` | OH_AVFormat GetString/Dump/GetKey cap + strcpy_s | Shipped CAPI contract — incompatible to change. |

Sources: `~/cloned/*/pbt-out/bug_reports/non-issue/` (11 files).

## Notes

- Scope is DTS-submitted findings only (`internal_issue_id`).
- **Precision** = confirmed / (confirmed + non-issues). Open / still-submitted tickets are omitted.
- CWE / bug-type grouping: archived in [`finding_precision_by_project.md`](finding_precision_by_project.md#archived-dts-tickets-by-bug-type).
- Detecting property follows pi-pbt oracles (`State Machine` ≻ `Differential` ≻ `Algebraic` ≻ `Reference` ≻ `Crash-Only`). One primary property per confirmed ticket.
- Local confirmed write-ups: [`content/issues/`](../content/issues/).

