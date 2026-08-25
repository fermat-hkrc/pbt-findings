# 按检测性质分类的 DTS 工单

对 [`content/issues/`](../content/issues/) 中带有 **DTS** 工单号（`internal_issue_id`）的发现所做的归类，按检出该工单的 **pi-pbt 性质（预言机）** 分组。CWE / 失效模式分组归档在 [`finding_precision_by_project.md`](finding_precision_by_project.md) 文末。

- **已确认（FIXED）**：**73** — 下列目录（`CONFIRMED_FIXED` 报告）
- **非问题（NON-ISSUE）**：**10** — [目录](#非问题)
- **已判定**：**83** = 73 + 10
- **精确率**：**88.0%** = `73 / (73 + 10)` = 已确认 /（已确认 + 非问题）
- **严重级别**（仅已确认）：HIGH=15，MEDIUM=56，LOW=2
- **生成时间**：2026-08-25

## 概览


预言机分类来自 [pi-pbt `docs/oracles.md`](https://github.com/fermat-hkrc/pbt-agent/blob/main/docs/oracles.md)。每个工单标注的是**实际失败、从而检出缺陷的最强性质**（来自报告 / cloned 测试），而不是 CWE 症状。

| 性质（预言机） | 数量 | HIGH | MEDIUM | LOW |
|----------|------:|-----:|-------:|----:|
| [状态机](#状态机) | 2 | 1 | 0 | 1 |
| [差分](#差分) | 19 | 0 | 19 | 0 |
| [代数 — 往返](#代数--往返) | 3 | 2 | 1 | 0 |
| [代数 — 蜕变](#代数--蜕变) | 3 | 1 | 2 | 0 |
| [代数 — 不变量](#代数--不变量) | 27 | 7 | 19 | 1 |
| [否定 / 错误契约](#否定--错误契约) | 5 | 0 | 5 | 0 |
| [参考](#参考) | 5 | 1 | 4 | 0 |
| [仅崩溃](#仅崩溃) | 9 | 3 | 6 | 0 |
| **合计** | **73** | **15** | **56** | **2** |

强度顺序：状态机 ≻ 差分 ≻ 代数（往返 ≻ 幂等 ≻ 蜕变 ≻ 不变量 ≻ 否定/错误）≻ 参考 ≻ 仅崩溃。本集合中**幂等：0**。

### 按模块

`FIXED` = 本目录。`NI` = [非问题](#非问题)。**精确率** = `FIXED / (FIXED + NI)`。

| 模块 | FIXED | NI | HIGH | MEDIUM | LOW | 精确率 |
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
| `multimedia_media_foundation` | 1 | 3 | 1 | 0 | 0 | 25% |
| `multimedia_media_library` | 1 | 0 | 0 | 1 | 0 | 100% |
| **合计** | **73** | **10** | **15** | **56** | **2** | **88%** |

## DTS 索引

| DTS | 问题 ID | 性质 | 严重级别 | 仓库 |
|-----|----------|----------|----------|------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | 代数 — 不变量 | HIGH | `communication_netmanager_base` |
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | 参考 | HIGH | `commonlibrary_rust_ylong_http` |
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | 代数 — 不变量 | HIGH | `distributedhardware_device_manager` |
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | 代数 — 不变量 | MEDIUM | `distributedhardware_distributed_hardware_fwk` |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | 代数 — 不变量 | MEDIUM | `arkui_ace_engine` |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | 代数 — 不变量 | HIGH | `arkui_ace_engine` |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | 代数 — 往返 | MEDIUM | `arkui_ace_engine` |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | 代数 — 不变量 | HIGH | `arkui_ace_engine` |
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | 代数 — 蜕变 | HIGH | `graphic_graphic_2d` |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | 参考 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | 代数 — 往返 | HIGH | `graphic_graphic_2d` |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | 代数 — 不变量 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | 差分 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | 代数 — 不变量 | MEDIUM | `communication_netmanager_base` |
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | 状态机 | LOW | `multimedia_camera_framework` |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | 代数 — 不变量 | HIGH | `arkui_ace_engine` |
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | 仅崩溃 | HIGH | `multimedia_av_session` |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | 代数 — 不变量 | MEDIUM | `arkui_ace_engine` |
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | 代数 — 不变量 | HIGH | `communication_netmanager_base` |
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | 差分 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | 仅崩溃 | HIGH | `multimedia_media_foundation` |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | 差分 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | 差分 | MEDIUM | `distributeddatamgr_pasteboard` |
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | 否定 / 错误契约 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | 代数 — 蜕变 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | 代数 — 不变量 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | 仅崩溃 | MEDIUM | `ability_ability_runtime` |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | 仅崩溃 | MEDIUM | `communication_wifi` |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | 代数 — 不变量 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | 否定 / 错误契约 | MEDIUM | `ability_ability_runtime` |
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | 状态机 | HIGH | `distributeddatamgr_pasteboard` |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | 代数 — 不变量 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | 否定 / 错误契约 | MEDIUM | `distributeddatamgr_datamgr_service` |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | 代数 — 不变量 | HIGH | `arkui_ace_engine` |
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | 差分 | MEDIUM | `filemanagement_dfs_service` |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | 否定 / 错误契约 | MEDIUM | `filemanagement_storage_service` |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | 差分 | MEDIUM | `window_window_manager` |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | 差分 | MEDIUM | `multimedia_av_codec` |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | 代数 — 不变量 | MEDIUM | `multimedia_image_framework` |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | 代数 — 不变量 | MEDIUM | `multimedia_media_library` |
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | 仅崩溃 | MEDIUM | `multimedia_player_framework` |
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | 参考 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026072514260` | [OH-2026-ABILITY-003](../content/issues/OH-2026-ABILITY-003.md) | 仅崩溃 | MEDIUM | `ability_ability_runtime` |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | 仅崩溃 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | 代数 — 不变量 | MEDIUM | `communication_netmanager_base` |
| `DTS2026072921166` | [OH-2026-WM-002](../content/issues/OH-2026-WM-002.md) | 差分 | MEDIUM | `window_window_manager` |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | 否定 / 错误契约 | MEDIUM | `multimedia_av_codec` |
| `DTS2026073013382` | [OH-2026-IMG-009](../content/issues/OH-2026-IMG-009.md) | 代数 — 不变量 | MEDIUM | `multimedia_image_framework` |
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | 代数 — 往返 | HIGH | `multimedia_image_framework` |
| `DTS2026073020799` | [OH-2026-DEVMGR-004](../content/issues/OH-2026-DEVMGR-004.md) | 仅崩溃 | HIGH | `distributedhardware_device_manager` |
| `DTS2026073112258` | [ARK-2026-STR-001](../content/issues/ARK-2026-STR-001.md) | 代数 — 不变量 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026073116282` | [OH-2026-ARKUI-008](../content/issues/OH-2026-ARKUI-008.md) | 代数 — 不变量 | MEDIUM | `arkui_ace_engine` |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | 代数 — 不变量 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026073173354` | [OH-2026-ABILITY-004](../content/issues/OH-2026-ABILITY-004.md) | 差分 | MEDIUM | `ability_ability_runtime` |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | 代数 — 不变量 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | 代数 — 不变量 | LOW | `graphic_graphic_2d` |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | 代数 — 不变量 | MEDIUM | `communication_netmanager_base` |
| `DTS2026080813420` | [OH-2026-CAM-007](../content/issues/OH-2026-CAM-007.md) | 仅崩溃 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813622` | [OH-2026-CAM-008](../content/issues/OH-2026-CAM-008.md) | 差分 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813794` | [OH-2026-CAM-009](../content/issues/OH-2026-CAM-009.md) | 差分 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813827` | [OH-2026-CAM-010](../content/issues/OH-2026-CAM-010.md) | 代数 — 不变量 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813868` | [OH-2026-CAM-011](../content/issues/OH-2026-CAM-011.md) | 代数 — 不变量 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | 差分 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | 差分 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081135903` | [OH-2026-NET-007](../content/issues/OH-2026-NET-007.md) | 差分 | MEDIUM | `communication_netmanager_base` |
| `DTS2026081136698` | [OH-2026-NET-006](../content/issues/OH-2026-NET-006.md) | 差分 | MEDIUM | `communication_netmanager_base` |
| `DTS2026081318473` | [OH-2026-PLAYER-002](../content/issues/OH-2026-PLAYER-002.md) | 代数 — 蜕变 | MEDIUM | `multimedia_player_framework` |
| `DTS2026081413702` | [OH-2026-IMG-008](../content/issues/OH-2026-IMG-008.md) | 差分 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081417372` | [OH-2026-IMG-010](../content/issues/OH-2026-IMG-010.md) | 参考 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081421810` | [OH-2026-IMG-007](../content/issues/OH-2026-IMG-007.md) | 差分 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081424330` | [OH-2026-IMG-006](../content/issues/OH-2026-IMG-006.md) | 参考 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081713997` | [OH-2026-AVCODEC-003](../content/issues/OH-2026-AVCODEC-003.md) | 差分 | MEDIUM | `multimedia_av_codec` |
| `DTS2026082023118` | [OH-2026-DSOFTBUS-001](../content/issues/OH-2026-DSOFTBUS-001.md) | 差分 | MEDIUM | `communication_dsoftbus` |

## 检测性质（预言机）

缺陷是如何被发现的。分类与强度顺序遵循 pi-pbt（`pbt-oracles`）。CWE / 失效模式分组见 [`finding_precision_by_project.md`](finding_precision_by_project.md#archived-dts-tickets-by-bug-type)。

<a id="状态机"></a>

### 状态机

操作序列对照独立模型（生命周期 / 集合）。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | LOW | FixedSizeList ≡ 有界 FIFO 模型（add/remove 序列） |
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | HIGH | 任意 worker 停止（含超时）清除 isRunning |

<a id="差分"></a>

### 差分

候选实现对照同类（same-job）兄弟或同一契约的独立实现。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | MEDIUM | NumToStr(n) == std::to_string(n)（全体 int32） |
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | MEDIUM | IsDoubleRegex 接受 ⇒ 调用方 std::stoi 不抛 |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | MEDIUM | isIntegerRegex 接受 ⇒ std::stoi 不抛 |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | MEDIUM | 仅在每条记录已授权时导出 URI（同类 include 规则） |
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | MEDIUM | 子项 ReadFromParcel 失败则拒绝，与 Marshalling 同类一致 |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | MEDIUM | 宽高比检查与加宽无符号预言一致 |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | MEDIUM | byterange 终点与加宽安全加法一致 |
| `DTS2026072921166` | [OH-2026-WM-002](../content/issues/OH-2026-WM-002.md) | MEDIUM | 级联装饰剥离与加宽无符号预言一致 |
| `DTS2026073173354` | [OH-2026-ABILITY-004](../content/issues/OH-2026-ABILITY-004.md) | MEDIUM | 前缀匹配 ≡ 斜杠边界成员资格预言 |
| `DTS2026080813622` | [OH-2026-CAM-008](../content/issues/OH-2026-CAM-008.md) | MEDIUM | GetZoomRatioRange 边界 ≡ GetRAWZoomRatioRange 同类 |
| `DTS2026080813794` | [OH-2026-CAM-009](../content/issues/OH-2026-CAM-009.md) | MEDIUM | 月亮 FOV 前瞻 ≡ sketch 规格 FOV 同类边界 |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | MEDIUM | 缩放/平移拼接 ≡ MulAddMul / 旋转路径同类 |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | MEDIUM | RGBA_U16 的 alpha 类型与 RGBA_F16 同类组一致 |
| `DTS2026081135903` | [OH-2026-NET-007](../content/issues/OH-2026-NET-007.md) | MEDIUM | CheckIpv6InNet 前缀边界 ≡ 已修的 CheckIpv4InNet 同类 |
| `DTS2026081136698` | [OH-2026-NET-006](../content/issues/OH-2026-NET-006.md) | MEDIUM | IPv6 GetNetworkAddress 前缀边界 ≡ IPv4 同类插入拒绝 |
| `DTS2026081413702` | [OH-2026-IMG-008](../content/issues/OH-2026-IMG-008.md) | MEDIUM | HalfToUint32 LE/BE 与同类拼装 + HalfToFloat 一致 |
| `DTS2026081421810` | [OH-2026-IMG-007](../content/issues/OH-2026-IMG-007.md) | MEDIUM | IsLegalAxis 与 int64 加宽预言一致 |
| `DTS2026081713997` | [OH-2026-AVCODEC-003](../content/issues/OH-2026-AVCODEC-003.md) | MEDIUM | TITLE 不含逗号，与 DURATION 同类一致 |
| `DTS2026082023118` | [OH-2026-DSOFTBUS-001](../content/issues/OH-2026-DSOFTBUS-001.md) | MEDIUM | ConnectGroup 长度守卫 ≡ P2pConnectGroup 同类（size ≥ MODE） |

<a id="代数--往返"></a>

### 代数 — 往返

`f⁻¹(f(x)) = x`（或 Get/Set、编解码恒等）。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | MEDIUM | Get(SetEntry(row,col,v)) == v |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | HIGH | FromBgraInt(AsBgraInt(c)) == c |
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | HIGH | 单轴平移映射点且求逆取反 |

<a id="代数--蜕变"></a>

### 代数 — 蜕变

有依据的输入变换导出输出关系（`a+b==b+a`、名称对称、`p*=s` 与 `p*s`）。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | HIGH | Point3 加法交换律：a+b == b+a |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | MEDIUM | (p*s).xyz == p.xyz*s；p/=s 与 p/s 一致 |
| `DTS2026081318473` | [OH-2026-PLAYER-002](../content/issues/OH-2026-PLAYER-002.md) | MEDIUM | 复用器 START/STOP 映射名与编码器族对称 |

<a id="代数--不变量"></a>

### 代数 — 不变量

对所有生成的 x，`P(f(x))` 成立（有限、在范围内、终止、结构约束）。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | HIGH | match_loopback 仅对环回端点为 true |
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | HIGH | GeneratePinCode 长度 == 请求的 pinLength |
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | MEDIUM | 无符号校验只接受能放入目标类型的值 |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | MEDIUM | 布局高度 ≥ 0 |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | HIGH | FindInMatrix(x) 有值当且仅当 x 在矩阵中 |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | HIGH | 无法放置的 span 返回 -1 |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | MEDIUM | 空 Range 不含任何点；下标仅在 [0, size) |
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | MEDIUM | 对每个合法 IP，ToAnonymousIp(ip, true) ≠ ip |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | HIGH | 懒网格行位置重定含 spaceWidth_ |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | MEDIUM | 通道插值对递增/递减通道均为线性 |
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | HIGH | CIDR /0 匹配所有 IPv4 地址 |
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | MEDIUM | GetParams 对 N∈[0,65535] 终止 |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | MEDIUM | 超容量写入返回 false / 不越界 |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | MEDIUM | 已接受的曝光分母 ⇒ 内层除数 ≠ 0 |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | HIGH | GetIrregularHeight 有限且非负 |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | MEDIUM | top+height / left+width 的 int32 溢出绝不是合法裁剪 |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | MEDIUM | 仅含 bucket 的 URI 没有 file id（不是 bucket 名） |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | MEDIUM | RfindIp6 对任意起止查询终止 |
| `DTS2026073013382` | [OH-2026-IMG-009](../content/issues/OH-2026-IMG-009.md) | MEDIUM | width*bpp 溢出 ⇒ 过小 stride 被拒绝 |
| `DTS2026073112258` | [ARK-2026-STR-001](../content/issues/ARK-2026-STR-001.md) | MEDIUM | "/" 剥离后 size() 不损坏 |
| `DTS2026073116282` | [OH-2026-ARKUI-008](../content/issues/OH-2026-ARKUI-008.md) | MEDIUM | 任意描边下 circleAngle 有限 |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | MEDIUM | 设置 drawing.disable* 后再 Update 应关闭对应标志 |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | MEDIUM | IsNearEqual 比较全部 9 个矩阵元素 |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | LOW | Dump 独立打印 cubicCoffB 与 cubicCoffC |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | MEDIUM | 范围止于 255.255.255.255 时 GetIp4AndMask 终止 |
| `DTS2026080813827` | [OH-2026-CAM-010](../content/issues/OH-2026-CAM-010.md) | MEDIUM | TLV 剩余长度覆盖声称的 3×num 点 |
| `DTS2026080813868` | [OH-2026-CAM-011](../content/issues/OH-2026-CAM-011.md) | MEDIUM | 长度前缀 payload 落在剩余 count 内 |

<a id="否定--错误契约"></a>

### 否定 / 错误契约

域外输入按约定被拒绝。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | MEDIUM | 单元素美颜范围返回 OK/INVALID_ARG，不 SIGFPE |
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | MEDIUM | IsNumber 拒绝浮点；GetId 不截断 |
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | MEDIUM | IsValidPath 拒绝单独的 ".." |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | MEDIUM | 越界 userId 被拒绝（CheckUserIdRange） |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | MEDIUM | 截断的 %X 不被解码为字节 |

<a id="参考"></a>

### 参考

本 SUT 声称的权威规范 / 标准库 / IEEE / Unicode / 固定（pin）契约。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | HIGH | 配置证书真实 SPKI pin 的客户端能完成请求 |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | MEDIUM | RectF::Round 各边与 std::round 一致 |
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | MEDIUM | IsUtf8 拒绝 UTF-8 代理项半区（Unicode） |
| `DTS2026081417372` | [OH-2026-IMG-010](../content/issues/OH-2026-IMG-010.md) | MEDIUM | FloatToHalf(±0) == IEEE half 零 |
| `DTS2026081424330` | [OH-2026-IMG-006](../content/issues/OH-2026-IMG-006.md) | MEDIUM | HalfToFloat(+0) == 0.0f（IEEE half） |

<a id="仅崩溃"></a>

### 仅崩溃

`f(x) ≠ ⊥` — 在测试域上无 SEGV / SIGFPE / 未捕获抛出 / 双重释放。最弱预言机。

| DTS | ID | 严重级别 | 失败的性质 |
|-----|----|----------|------------------|
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | HIGH | 全连续字节标题下 GetAnonyTitle 不崩溃 |
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | HIGH | Stringify 对任何公共 Put*（含 PutIntBuffer）不崩溃 |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | MEDIUM | 任意 srcEntrance 下 .abc 路径构建不抛异常 |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | MEDIUM | 空指针 / 过短 hex 不使 HexString2Byte 崩溃 |
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | MEDIUM | Destroy + 析构不双重释放 |
| `DTS2026072514260` | [OH-2026-ABILITY-003](../content/issues/OH-2026-ABILITY-003.md) | MEDIUM | ParseURI 的 catch 不越界索引 uriVec |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | MEDIUM | 奇数 count 成对遍历不越界 |
| `DTS2026073020799` | [OH-2026-DEVMGR-004](../content/issues/OH-2026-DEVMGR-004.md) | HIGH | GenerateRandNum 采样合法分布（无 SIGSEGV） |
| `DTS2026080813420` | [OH-2026-CAM-007](../content/issues/OH-2026-CAM-007.md) | MEDIUM | 短/奇数 HIGH_QUALITY_SUPPORT 不越界 |

## 非问题

维护者驳回的 DTS。只计入分母。

**精确率** = 已确认 /（已确认 + 非问题）= **73 / (73 + 10) = 88.0%**。

| DTS | 项目 | 主题 | 为何非问题 |
|-----|------|------|------------|
| `DTS2026070145311` | `multimedia_av_session` | ConvertSessionType 丢掉通话类型 | 产品策略 — 无通话类型远端投射要求。cloned 中报告已缺失；暂留，见 [#1](https://github.com/fermat-hkrc/pbt-findings/issues/1)。 |
| `DTS2026070663477` | `distributedhardware_device_manager` | JsonObject cJSON int64 往返精度损失 | 死后端 — 生产使用 nlohmann_json（`use_nlohmann_json = true`）。 |
| `DTS2026071719364` | `multimedia_media_foundation` | CopyAVMemory 缺少 offset+size 守卫 | 不可达 — 产品侧 src offset 恒为 0。 |
| `DTS2026071725399` | `communication_netmanager_base` | 子进程非零退出时 ForkExec 仍 SUCCESS | 设计如此 — SUCCESS 表示子进程已创建。 |
| `DTS2026071809266` | `arkui_ace_engine` | GetTotalHeightOfItemsInView 空网格 → `-mainGap` | 稳定公式契约；共享 API 未改。 |
| `DTS2026072017450` | `communication_dsoftbus` | Hex 辅助函数未显式写 NUL | 调用方契约 — 零初始化的 `outBuf` 拥有终止符。cloned 中报告已缺失；暂留，见 [#1](https://github.com/fermat-hkrc/pbt-findings/issues/1)。 |
| `DTS2026072517792` | `arkcompiler_runtime_core` | SkipULeb128 空/截断越界 | 设计如此 — `void` 辅助无错误通道；畸形 ULEB 视为致命；debug `ASSERT` 即停止点。 |
| `DTS2026072720774` | `communication_netmanager_base` | GetAddrFamily 拒绝带 zone 的 IPv6 | 不同 API、不同职责 — 不是不一致。 |
| `DTS2026081129774` | `multimedia_media_foundation` | DataPacker::IsEmpty 谓词取反 | 死代码 — 交付路径未使用。 |
| `DTS2026081131247` | `multimedia_media_foundation` | OH_AVFormat GetString/Dump/GetKey 上限 + strcpy_s | 已交付 CAPI 契约 — 不能改。 |

来源：`~/cloned/*/pbt-out/bug_reports/non-issue/`（8 个文件）以及 [#1](https://github.com/fermat-hkrc/pbt-findings/issues/1) 中的两张工单。

## 说明

- 范围仅为已提交 DTS 的发现（`internal_issue_id`）。
- **精确率** = 已确认 /（已确认 + 非问题）。仍在提交 / 未关闭的工单不计。
- CWE / 缺陷类型分组：归档在 [`finding_precision_by_project.md`](finding_precision_by_project.md#archived-dts-tickets-by-bug-type)。
- 检测性质遵循 pi-pbt 预言机（`状态机` ≻ `差分` ≻ `代数` ≻ `参考` ≻ `仅崩溃`）。每个已确认工单一条主性质。
- 本地已确认报告：[`content/issues/`](../content/issues/)。
