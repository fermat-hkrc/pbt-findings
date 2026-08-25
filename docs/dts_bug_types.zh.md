# 按缺陷类型分类的 DTS 工单

对 [`content/issues/`](../content/issues/) 中带有 **DTS** 工单号（`internal_issue_id`）的发现所做的归类，按**缺陷类型**（失效模式）分组，而非按组件分组。

- **DTS 工单数**：**73**
- **状态**：所列工单均为 `CONFIRMED_FIXED`（已确认修复）
- **严重级别**：HIGH=15，MEDIUM=56，LOW=2
- **精确率**（判定为 DTS）：**88.0%**（73 个 FIXED / 83 个已判定）— [`finding_precision_by_project.md`](finding_precision_by_project.md)
- **生成时间**：2026-08-25

## 概览

| 缺陷类型 | 数量 | HIGH | MEDIUM | LOW |
|----------|------:|-----:|-------:|----:|
| [算术 — 整数上溢 / 下溢](#算术-整数上溢-下溢) | 11 | 1 | 10 | 0 |
| [算术 — 计算错误](#算术-计算错误) | 15 | 3 | 11 | 1 |
| [算术 — 除零](#算术-除零) | 3 | 1 | 2 | 0 |
| [算术 — 差一错误](#算术-差一错误) | 3 | 1 | 2 | 0 |
| [内存安全 — 缓冲区 / 越界访问](#内存安全-缓冲区-越界访问) | 13 | 1 | 12 | 0 |
| [内存安全 — 空指针解引用](#内存安全-空指针解引用) | 1 | 1 | 0 | 0 |
| [内存安全 — 重复释放](#内存安全-重复释放) | 1 | 0 | 1 | 0 |
| [控制流 — 死循环 / 挂起](#控制流-死循环-挂起) | 3 | 0 | 3 | 0 |
| [逻辑 — 控制流错误](#逻辑-控制流错误) | 6 | 2 | 4 | 0 |
| [逻辑 — 运算符 / 谓词错误](#逻辑-运算符-谓词错误) | 1 | 1 | 0 | 0 |
| [逻辑 — 未检查返回值](#逻辑-未检查返回值) | 1 | 0 | 1 | 0 |
| [未定义行为](#未定义行为) | 2 | 1 | 1 | 0 |
| [状态 / 生命周期 — 清理不完整或状态卡死](#状态-生命周期-清理不完整或状态卡死) | 1 | 1 | 0 | 0 |
| [输入校验 — 校验不当](#输入校验-校验不当) | 3 | 0 | 2 | 1 |
| [输入校验 — 非法输入导致未捕获异常 / 崩溃](#输入校验-非法输入导致未捕获异常-崩溃) | 2 | 0 | 2 | 0 |
| [输入校验 — 路径穿越](#输入校验-路径穿越) | 1 | 0 | 1 | 0 |
| [输入校验 — 编码 / Unicode](#输入校验-编码-unicode) | 1 | 0 | 1 | 0 |
| [安全 — 授权 / 访问控制](#安全-授权-访问控制) | 3 | 1 | 2 | 0 |
| [安全 — 证书校验](#安全-证书校验) | 1 | 1 | 0 | 0 |
| [安全 — 信息泄露](#安全-信息泄露) | 1 | 0 | 1 | 0 |
| **合计** | **73** | **15** | **56** | **2** |

### 按家族

| 家族 | 数量 |
|--------|------:|
| 算术与数值类缺陷 | 32 |
| 内存安全 | 15 |
| 控制流与逻辑 | 14 |
| 输入校验 | 7 |
| 安全 | 5 |

### 按模块

数量为本目录（`CONFIRMED_FIXED` 已确认修复）的报告数。**精确率**为 `FIXED / (FIXED + NON-ISSUE)`，来自 [`finding_precision_by_project.md`](finding_precision_by_project.md)。

| 模块 | 数量 | HIGH | MEDIUM | LOW | 精确率 |
|--------|------:|-----:|-------:|----:|----------:|
| `multimedia_camera_framework` | 11 | 0 | 10 | 1 | 100% |
| `multimedia_image_framework` | 9 | 1 | 8 | 0 | 100% |
| `arkui_ace_engine` | 8 | 4 | 4 | 0 | 89% |
| `graphic_graphic_2d` | 8 | 2 | 5 | 1 | 100% |
| `communication_netmanager_base` | 7 | 2 | 5 | 0 | 78% |
| `arkcompiler_runtime_core` | 5 | 0 | 5 | 0 | 83% |
| `ability_ability_runtime` | 4 | 0 | 4 | 0 | 100% |
| `multimedia_av_codec` | 3 | 0 | 3 | 0 | 100% |
| `distributeddatamgr_pasteboard` | 2 | 1 | 1 | 0 | 100% |
| `distributedhardware_device_manager` | 2 | 2 | 0 | 0 | 67% |
| `multimedia_player_framework` | 2 | 0 | 2 | 0 | 100% |
| `window_window_manager` | 2 | 0 | 2 | 0 | 100% |
| `commonlibrary_rust_ylong_http` | 1 | 1 | 0 | 0 | 100% |
| `communication_dsoftbus` | 1 | 0 | 1 | 0 | 50% |
| `communication_wifi` | 1 | 0 | 1 | 0 | 100% |
| `distributeddatamgr_datamgr_service` | 1 | 0 | 1 | 0 | 100% |
| `distributedhardware_distributed_hardware_fwk` | 1 | 0 | 1 | 0 | 100% |
| `filemanagement_dfs_service` | 1 | 0 | 1 | 0 | 100% |
| `filemanagement_storage_service` | 1 | 0 | 1 | 0 | 100% |
| `multimedia_av_session` | 1 | 1 | 0 | 0 | 50% |
| `multimedia_media_foundation` | 1 | 1 | 0 | 0 | 25% |
| `multimedia_media_library` | 1 | 0 | 1 | 0 | 100% |
| **合计** | **73** | **15** | **56** | **2** | **88%** |

## DTS 索引

| DTS | 问题 ID | 缺陷类型 | 严重级别 | 仓库 |
|-----|----------|----------|----------|------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | 安全 — 授权 / 访问控制 | HIGH | `communication_netmanager_base` |
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | 安全 — 证书校验 | HIGH | `commonlibrary_rust_ylong_http` |
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | 算术 — 差一错误 | HIGH | `distributedhardware_device_manager` |
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `distributedhardware_distributed_hardware_fwk` |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | 算术 — 计算错误 | MEDIUM | `arkui_ace_engine` |
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | 逻辑 — 控制流错误 | HIGH | `arkui_ace_engine` |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | 算术 — 计算错误 | MEDIUM | `arkui_ace_engine` |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | 逻辑 — 控制流错误 | HIGH | `arkui_ace_engine` |
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | 算术 — 计算错误 | HIGH | `graphic_graphic_2d` |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | 算术 — 计算错误 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | 算术 — 计算错误 | HIGH | `graphic_graphic_2d` |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | 安全 — 信息泄露 | MEDIUM | `communication_netmanager_base` |
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | 输入校验 — 校验不当 | LOW | `multimedia_camera_framework` |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | 算术 — 计算错误 | HIGH | `arkui_ace_engine` |
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | 内存安全 — 缓冲区 / 越界访问 | HIGH | `multimedia_av_session` |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | 未定义行为 | MEDIUM | `arkui_ace_engine` |
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | 未定义行为 | HIGH | `communication_netmanager_base` |
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | 输入校验 — 非法输入导致未捕获异常 / 崩溃 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | 内存安全 — 空指针解引用 | HIGH | `multimedia_media_foundation` |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | 输入校验 — 非法输入导致未捕获异常 / 崩溃 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | 安全 — 授权 / 访问控制 | MEDIUM | `distributeddatamgr_pasteboard` |
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | 算术 — 除零 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | 算术 — 计算错误 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | 控制流 — 死循环 / 挂起 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | 逻辑 — 控制流错误 | MEDIUM | `ability_ability_runtime` |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `communication_wifi` |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | 输入校验 — 校验不当 | MEDIUM | `ability_ability_runtime` |
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | 状态 / 生命周期 — 清理不完整或状态卡死 | HIGH | `distributeddatamgr_pasteboard` |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | 算术 — 除零 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | 输入校验 — 路径穿越 | MEDIUM | `distributeddatamgr_datamgr_service` |
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | 算术 — 除零 | HIGH | `arkui_ace_engine` |
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | 逻辑 — 未检查返回值 | MEDIUM | `filemanagement_dfs_service` |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | 输入校验 — 校验不当 | MEDIUM | `filemanagement_storage_service` |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `window_window_manager` |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `multimedia_av_codec` |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `multimedia_image_framework` |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `multimedia_media_library` |
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | 内存安全 — 重复释放 | MEDIUM | `multimedia_player_framework` |
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | 输入校验 — 编码 / Unicode | MEDIUM | `graphic_graphic_2d` |
| `DTS2026072514260` | [OH-2026-ABILITY-003](../content/issues/OH-2026-ABILITY-003.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `ability_ability_runtime` |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | 控制流 — 死循环 / 挂起 | MEDIUM | `communication_netmanager_base` |
| `DTS2026072921166` | [OH-2026-WM-002](../content/issues/OH-2026-WM-002.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `window_window_manager` |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | 算术 — 差一错误 | MEDIUM | `multimedia_av_codec` |
| `DTS2026073013382` | [OH-2026-IMG-009](../content/issues/OH-2026-IMG-009.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `multimedia_image_framework` |
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | 逻辑 — 运算符 / 谓词错误 | HIGH | `multimedia_image_framework` |
| `DTS2026073020799` | [OH-2026-DEVMGR-004](../content/issues/OH-2026-DEVMGR-004.md) | 算术 — 整数上溢 / 下溢 | HIGH | `distributedhardware_device_manager` |
| `DTS2026073112258` | [ARK-2026-STR-001](../content/issues/ARK-2026-STR-001.md) | 逻辑 — 控制流错误 | MEDIUM | `arkcompiler_runtime_core` |
| `DTS2026073116282` | [OH-2026-ARKUI-008](../content/issues/OH-2026-ARKUI-008.md) | 算术 — 计算错误 | MEDIUM | `arkui_ace_engine` |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | 逻辑 — 控制流错误 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026073173354` | [OH-2026-ABILITY-004](../content/issues/OH-2026-ABILITY-004.md) | 安全 — 授权 / 访问控制 | MEDIUM | `ability_ability_runtime` |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | 算术 — 差一错误 | MEDIUM | `graphic_graphic_2d` |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | 算术 — 计算错误 | LOW | `graphic_graphic_2d` |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | 控制流 — 死循环 / 挂起 | MEDIUM | `communication_netmanager_base` |
| `DTS2026080813420` | [OH-2026-CAM-007](../content/issues/OH-2026-CAM-007.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813622` | [OH-2026-CAM-008](../content/issues/OH-2026-CAM-008.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813794` | [OH-2026-CAM-009](../content/issues/OH-2026-CAM-009.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813827` | [OH-2026-CAM-010](../content/issues/OH-2026-CAM-010.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026080813868` | [OH-2026-CAM-011](../content/issues/OH-2026-CAM-011.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `multimedia_camera_framework` |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | 算术 — 计算错误 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | 逻辑 — 控制流错误 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081135903` | [OH-2026-NET-007](../content/issues/OH-2026-NET-007.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `communication_netmanager_base` |
| `DTS2026081136698` | [OH-2026-NET-006](../content/issues/OH-2026-NET-006.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `communication_netmanager_base` |
| `DTS2026081318473` | [OH-2026-PLAYER-002](../content/issues/OH-2026-PLAYER-002.md) | 算术 — 计算错误 | MEDIUM | `multimedia_player_framework` |
| `DTS2026081413702` | [OH-2026-IMG-008](../content/issues/OH-2026-IMG-008.md) | 算术 — 计算错误 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081417372` | [OH-2026-IMG-010](../content/issues/OH-2026-IMG-010.md) | 算术 — 计算错误 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081421810` | [OH-2026-IMG-007](../content/issues/OH-2026-IMG-007.md) | 算术 — 整数上溢 / 下溢 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081424330` | [OH-2026-IMG-006](../content/issues/OH-2026-IMG-006.md) | 算术 — 计算错误 | MEDIUM | `multimedia_image_framework` |
| `DTS2026081713997` | [OH-2026-AVCODEC-003](../content/issues/OH-2026-AVCODEC-003.md) | 算术 — 计算错误 | MEDIUM | `multimedia_av_codec` |
| `DTS2026082023118` | [OH-2026-DSOFTBUS-001](../content/issues/OH-2026-DSOFTBUS-001.md) | 内存安全 — 缓冲区 / 越界访问 | MEDIUM | `communication_dsoftbus` |

## 算术与数值类缺陷

### 算术 — 整数上溢 / 下溢

上溢/下溢回绕产生错误的边界、ID 或范围（通常无显式报错）。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026060814531` | [OH-2026-DHFWK-001](../content/issues/OH-2026-DHFWK-001.md) | MEDIUM | CWE-190（整数溢出或回绕） | `dh_utils_tool` · `distributedhardware_distributed_hardware_fwk` | cJSON 无符号整数校验因 static_cast 回绕，接受了溢出目标类型的值 |
| `DTS2026062915131` | [ARK-2026-INT-002](../content/issues/ARK-2026-INT-002.md) | MEDIUM | CWE-191（整数下溢（回绕）） | `static_core/verification/util/range.h` · `arkcompiler_runtime_core` | Range(空容器) 下溢为 SIZE_MAX，报告其包含所有点 |
| `DTS2026062916398` | [ARK-2026-INT-001](../content/issues/ARK-2026-INT-001.md) | MEDIUM | CWE-190（整数溢出或回绕） | `static_core/verification/util/str.h` · `arkcompiler_runtime_core` | 校验器诊断格式化中 NumToStr(INT_MIN) 触发有符号溢出未定义行为 |
| `DTS2026072347788` | [OH-2026-WM-001](../content/issues/OH-2026-WM-001.md) | MEDIUM | CWE-191（整数下溢（回绕）） | `utils/include/window_helper.h` · `window_window_manager` | IsAspectRatioSatisfiedWithSizeLimits 装饰框 uint32 下溢拒绝合法宽高比 |
| `DTS2026072438019` | [OH-2026-AVCODEC-001](../content/issues/OH-2026-AVCODEC-001.md) | MEDIUM | CWE-190（整数溢出或回绕） | `services/media_engine/plugins/source/http_source/hls/hls_segment_manager.cpp` · `multimedia_av_codec` | HLS 分段 byterange 的 offset_+length_-1 在 uint32_t 中回绕 → Range 丢失/错误 |
| `DTS2026072438492` | [OH-2026-IMG-002](../content/issues/OH-2026-IMG-002.md) | MEDIUM | CWE-190（整数溢出或回绕） | `frameworks/innerkitsimpl/converter/src/post_proc.cpp` · `multimedia_image_framework` | 当 top+height / left+width 溢出 int32 时 PostProc::GetCropValue 接受越界裁剪 |
| `DTS2026072454808` | [OH-2026-MEDIALIB-001](../content/issues/OH-2026-MEDIALIB-001.md) | MEDIUM | CWE-191（整数下溢（回绕）） | `common/utils/src/media_uri_utils.cpp` · `multimedia_media_library` | GetFileIdStr 在仅含 bucket 的 URI 上返回 bucket 名（npos+1 回绕） |
| `DTS2026072921166` | [OH-2026-WM-002](../content/issues/OH-2026-WM-002.md) | MEDIUM | CWE-191（整数下溢（回绕）） | `wmserver/src/window_layout_policy_cascade.cpp` · `window_window_manager` | ComputeRectByAspectRatio 级联布局剥离装饰框时 uint32 下溢 |
| `DTS2026073020799` | [OH-2026-DEVMGR-004](../content/issues/OH-2026-DEVMGR-004.md) | HIGH | CWE-190（整数溢出或回绕） | `utils/src/dm_random.cpp` · `distributedhardware_device_manager` | GenerateRandNum 无效的 uniform_int_distribution(1, 0xFFFFFFFF) → SIGSEGV |
| `DTS2026073013382` | [OH-2026-IMG-009](../content/issues/OH-2026-IMG-009.md) | MEDIUM | CWE-190（整数溢出或回绕） | `frameworks/innerkitsimpl/converter/src/pixel_convert.cpp` · `multimedia_image_framework` | IsValidRowStride 的 int32 溢出接受不可能的 stride（width*bpp 回绕） |
| `DTS2026081421810` | [OH-2026-IMG-007](../content/issues/OH-2026-IMG-007.md) | MEDIUM | CWE-190（整数溢出或回绕） | `frameworks/innerkitsimpl/utils/src/pixel_yuv_utils.cpp` · `multimedia_image_framework` | PixelYuvUtils::IsLegalAxis 拒绝一切合法负向平移（INT32_MAX - offset 回绕） |

<details><summary>摘要</summary>

- **OH-2026-DHFWK-001**（`DTS2026060814531`）：`IsUInt8`、`IsUInt16` 和 `IsUInt32` 通过把 `valueint` 转换为目标无符号类型、再将转换结果与 `UINT*_MAX` 比较来校验 `cJSON` 数字。该检查为时已晚：收窄转换已经把值回绕了……
- **ARK-2026-INT-002**（`DTS2026062915131`）：`ark::verifier::Range<Int>` 的容器构造函数把 `to_` 计算为 `cont.size() - 1`。当容器为空时，`cont.size()` 返回 `0`，该减法在 `size_t` 无符号算术下下溢，得到 `SIZE_MAX`。于……
- **ARK-2026-INT-001**（`DTS2026062916398`）：`ark::verifier::NumToStr(Int val, ...)` 在提取数字之前先对负输入取反。对于最小有符号整数（`INT_MIN` / `INT32_MIN`），其正的绝对值无法用同一有符号类型表示，因此 `val = -val` 是……
- **OH-2026-WM-001**（`DTS2026072347788`）：`WindowHelper::IsAspectRatioSatisfiedWithSizeLimits` 用裸 `uint32_t` 算术从尺寸限制的最小/最大值中减去装饰框。当 `minWidth_`/`minHeight_` 小于装饰框（默认最小值为 1）时，减法下溢……
- **OH-2026-AVCODEC-001**（`DTS2026072438019`）：`HlsSegmentManager::ConfigureAndDownload` 用两个 **`uint32_t`** 字段计算含端点的 HTTP Range 结尾 `playInfo.offset_ + playInfo.length_ - 1`。当数学上的 `offset + length > 2^32` 时，和在加宽之前就已回绕……
- **OH-2026-IMG-002**（`DTS2026072438492`）：`PostProc::GetCropValue` 用裸 `int32_t` 加法 `top + height` 和 `left + width` 对裁剪分类。当数学和超出 `INT32_MAX` 时，和发生回绕（有符号溢出是 UB；常见编译器按回绕处理），并且常常通过 `<= size` 的比较……
- **OH-2026-MEDIALIB-001**（`DTS2026072454808`）：`MediaUriUtils::GetFileIdStr` 用 `tmp.substr(tmp.find_first_of('/') + 1)` 提取文件 ID 段。当前缀之后的剩余部分**没有** `/`（仅含 bucket 的 URI `file://media/<bucket>`）时，`find_first_of` 返回 `npos`；`npos + 1`……
- **OH-2026-WM-002**（`DTS2026072921166`）：`ComputeRectByAspectRatio` 用裸 `uint32_t -=` 剥离装饰框。小于 `WINDOW_FRAME_WIDTH`（5）的请求会发生下溢，级联布局使用了回绕后的尺寸。
- **OH-2026-DEVMGR-004**（`DTS2026073020799`）：`GenerateRandNum` 构造 `uniform_int_distribution<>(1, 0xFFFFFFFF)`。默认类型是 `int`；`0xFFFFFFFF` 是 **-1** → 无效范围 `[1, -1]` → SIGSEGV。
- **OH-2026-IMG-009**（`DTS2026073013382`）：`PixelConvert::IsValidRowStride` 用 `int32` 乘 `width * bpp`。溢出（如 RGBA_F16 `width=INT32_MAX/8+1`）回绕为负，因此 `rowStride=1` 被接受。同类 `pixel_map.cpp` 已使用 `int64_t`。
- **OH-2026-IMG-007**（`DTS2026081421810`）：`IsLegalAxis` 用 `size > INT32_MAX - offset` 守卫 `size + offset`。负 offset 使减法回绕；每一个合法 YUV 平移-收缩都在 `[1, MAX_DIMENSION]` 检查之前被拒绝。

</details>

### 算术 — 计算错误

错误的公式、操作数、舍入，或破坏不变量的矩阵/颜色/几何运算，但不属于纯粹溢出类 CWE。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026062430430` | [OH-2026-GFX-001](../content/issues/OH-2026-GFX-001.md) | HIGH | CWE-682（计算错误） | `rosen/modules/2d_graphics/include/utils/point3.h` · `graphic_graphic_2d` | Point3::operator+ 的 X、Y 分量使用错误操作数，破坏向量加法交换律 |
| `DTS2026062701168` | [OH-2026-GFX-002](../content/issues/OH-2026-GFX-002.md) | HIGH | CWE-682（计算错误） | `rosen/modules/render_service_base/src/common/rs_color.cpp` · `graphic_graphic_2d` | RSColor::FromBgraInt 联合体字段顺序与 AsBgraInt 不匹配，BGRA 往返后所有通道损坏 |
| `DTS2026070318488` | [OH-2026-ARKUI-005](../content/issues/OH-2026-ARKUI-005.md) | HIGH | CWE-682（计算错误） | `frameworks/core/components_ng/pattern/lazy_grid_layout/lazy_grid_layout_info.cpp` · `arkui_ace_engine` | LazyGridLayoutInfo::UpdatePosMapStart 从非零起始索引重定时漏加 spaceWidth_ |
| `DTS2026061256925` | [OH-2026-ARKUI-001](../content/issues/OH-2026-ARKUI-001.md) | MEDIUM | CWE-682（计算错误） | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` · `arkui_ace_engine` | GridLayoutInfo::GetContentHeightOfRegularGrid 在空网格且有正间距时返回负高度 |
| `DTS2026062427183` | [OH-2026-ARKUI-003](../content/issues/OH-2026-ARKUI-003.md) | MEDIUM | CWE-682（计算错误） | `frameworks/base/geometry/matrix4.cpp` · `arkui_ace_engine` | Matrix4::SetEntry 与 Get/Set 存储顺序相反，非对角元素无法往返一致 |
| `DTS2026062516469` | [OH-2026-GFX-003](../content/issues/OH-2026-GFX-003.md) | MEDIUM | CWE-682（计算错误） | `rosen/modules/2d_graphics/include/utils/rect.h` · `graphic_graphic_2d` | RectF::Round() 对负坐标舍入错误（x+0.5 截断 vs std::round） |
| `DTS2026071430826` | [OH-2026-GFX-004](../content/issues/OH-2026-GFX-004.md) | MEDIUM | CWE-682（计算错误） | `rosen/modules/2d_graphics/include/utils/point3.h` · `graphic_graphic_2d` | Point3 的 operator* / operator/= 经整数转换截断 float 分量 |
| `DTS2026081126994` | [OH-2026-IMG-005](../content/issues/OH-2026-IMG-005.md) | MEDIUM | CWE-682（计算错误） | `frameworks/innerkitsimpl/converter/src/matrix.cpp` · `multimedia_image_framework` | Matrix::SetConcat 缩放/平移快速路径中平移量相乘错误 |
| `DTS2026080530843` | [OH-2026-GFX-008](../content/issues/OH-2026-GFX-008.md) | LOW | CWE-682（计算错误） | `rosen/modules/2d_graphics/include/utils/sampling_options.h` · `graphic_graphic_2d` | CubicResampler::Dump 把 cubicCoffB 写入 cubicCoffC 字段 |
| `DTS2026081318473` | [OH-2026-PLAYER-002](../content/issues/OH-2026-PLAYER-002.md) | MEDIUM | CWE-682（计算错误） | `services/utils/media_utils.cpp` · `multimedia_player_framework` | TransRecorderStatus 复用器映射缺少 START 键 + STOP 键重复 |
| `DTS2026081413702` | [OH-2026-IMG-008](../content/issues/OH-2026-IMG-008.md) | MEDIUM | CWE-682（计算错误） | `frameworks/innerkitsimpl/converter/include/pixel_convert.h` · `multimedia_image_framework` | HalfToUint32 小端/大端分支对调（每个 live half 通道都被字节交换） |
| `DTS2026081417372` | [OH-2026-IMG-010](../content/issues/OH-2026-IMG-010.md) | MEDIUM | CWE-682（计算错误） | `frameworks/innerkitsimpl/converter/include/pixel_convert.h` · `multimedia_image_framework` | FloatToHalf 把 0.0f 映射为 Half 2.0（0x4000）— 重基减法无符号下溢 |
| `DTS2026081424330` | [OH-2026-IMG-006](../content/issues/OH-2026-IMG-006.md) | MEDIUM | CWE-682（计算错误） | `frameworks/innerkitsimpl/converter/include/pixel_convert.h` · `multimedia_image_framework` | HalfToFloat 把 half +0（0x0000）映射为 2^-15 而非 0.0f |
| `DTS2026081713997` | [OH-2026-AVCODEC-003](../content/issues/OH-2026-AVCODEC-003.md) | MEDIUM | CWE-682（计算错误） | `services/media_engine/plugins/source/http_source/hls/hls_tags.cpp` · `multimedia_av_codec` | ValuesListTag::ParseAttributes 的 TITLE 包含前导逗号 |
| `DTS2026073116282` | [OH-2026-ARKUI-008](../content/issues/OH-2026-ARKUI-008.md) | MEDIUM | CWE-682（计算错误） | `frameworks/core/components_ng/pattern/data_panel/data_panel_modifier.cpp` · `arkui_ace_engine` | DataPanel GetPaintPath 无守卫 asin → 描边压垮半径时 circleAngle 为 NaN |

<details><summary>摘要</summary>

- **OH-2026-GFX-001**（`DTS2026062430430`）：`Point3::operator+` 对 X 和 Y 分量使用了错误的操作数。X 分量被计算为 `p1.x_ + p1.y_`（忽略 `p2.x_`），Y 分量被计算为 `p2.x_ + p2.y_`（忽略 `p1.y_`）。只有 Z 分量是正确的。作为……
- **OH-2026-GFX-002**（`DTS2026062701168`）：`RSColor::FromBgraInt` 使用联合体解码 `uint32_t`，其位域顺序与 `AsBgraInt` 编码时的顺序相反。因此在往返 `FromBgraInt(AsBgraInt(c))` 中每个通道都被交换：alpha↔blue、red↔gree……
- **OH-2026-ARKUI-005**（`DTS2026070318488`）：`LazyGridLayoutInfo::UpdatePosMapStart()` 为懒加载网格位置映射的起始处重新计算位置锚点。当映射起始索引 > 0 且没有前驱条目时，首分支公式只使用了 `estimateIte……`
- **OH-2026-ARKUI-001**（`DTS2026061256925`）：`GridLayoutInfo::GetContentHeightOfRegularGrid()` 在网格没有条目且 `mainGap` 为正时返回负的内容高度。空网格的情形落入取模分支并从零中减去 `mainGap`，违反……
- **OH-2026-ARKUI-003**（`DTS2026062427183`）：`Matrix4::SetEntry(row, col, value)` 写入 `matrix4x4_[row][col]`，但 `Matrix4::Get(row, col)` 和 `Matrix4::Set(row, col, value)` 读写的是 `matrix4x4_[col][row]`。因此非对角写入无法往返：写入到……
- **OH-2026-GFX-003**（`DTS2026062516469`）：`OHOS::Rosen::Drawing::RectF::Round()` 用 `DrawingFloatSaturate2Int(x + 0.5f)`（加 0.5 后向零截断）转换每条边。这只对**非负**值是最近整数舍入。对于负的半值（例如 `-0.5……`
- **OH-2026-GFX-004**（`DTS2026071430826`）：`Point3` 以 float 存储分量（`scalar x_`、`y_`、`z_`），但其缩放运算符却经整数转换回来 — `operator*` / `operator*=` 中的 `static_cast<int64_t>(x_ * scale)`，以及 `operator/……` 中的 `static_cast<int>(x_ / divisor)`
- **OH-2026-IMG-005**（`DTS2026081126994`）：`Matrix::SetConcat` 缩放/平移快速路径（无旋转/倾斜）把平移组合为 `tx1*tx2+tx1` 而非 `sx1*tx2+tx1`。同函数中的完整旋转路径使用了正确的 `MulAddMul`。错误的组合几何（例如先缩放后……
- **OH-2026-GFX-008**（`DTS2026080530843`）：`CubicResampler::Dump` 从 `cubicCoffB` 格式化两个带标签的字段 — 复制粘贴错操作数 — 因此 `cubicCoffC:` 槽位总是显示 B。仅影响调试/跟踪字符串；无崩溃、无滤镜计算。采样本身使用真实字段（`GetCubicCof……`
- **OH-2026-PLAYER-002**（`DTS2026081318473`）：`TransRecorderStatus` 映射把 `ERROR_MUXER_STOP_FAILED` 映射到 `MSERR_MUXER_START_FAILED`（复制粘贴），随后第二行 STOP→STOP 被 `unordered_map` 忽略。START 复用器错误永远无法映射；STOP 报告为 START。
- **OH-2026-IMG-008**（`DTS2026081413702`）：`HalfToUint32` 的 LE/BE 三元分支对调。实际 LE 路径构造 `(lo<<8)|hi` — 每个 half 都被字节交换。通道 `1.0`（`0x3C00`）变成 `0`；同类 `HalfTranslate` 已正确按 LE 加载。
- **OH-2026-IMG-010**（`DTS2026081417372`）：`FloatToHalf` 重基减法 `(magnitude >> 13) - 0x1C000` 在 ±0.0f 上下溢 → 低 16 位 `0x4000`（half +2.0）而非 `0x0000`。纯黑 / 透明 alpha 被编码为 2.0。
- **OH-2026-IMG-006**（`DTS2026081424330`）：`HalfToFloat` 把仅适用于正规数的指数重基 `((mag << 13) + 0x38000000)` 用到所有输入。half ±0 的幅度为 0 → 造出 `0x38000000` = `2^-15` 而非 `0.0f`。
- **OH-2026-AVCODEC-003**（`DTS2026081713997`）：`ValuesListTag::ParseAttributes` 拆分 HLS `#EXTINF:duration,title`。DURATION 用 `substr(0, pos)`（不含逗号）；TITLE 用 `substr(pos)`（含逗号）→ 每个带标题分段的 TITLE 都以 `,` 开头。
- **OH-2026-ARKUI-008**（`DTS2026073116282`）：`DataPanelModifier::GetPaintPath` 用无守卫的 `asin(thickness/2 / (radius - thickness/2))` 计算 `circleAngle`。描边 ≥ 最小边一半时 `radius <= 0` → 角度为 NaN / 弧线损坏。

</details>

### 算术 — 除零

缺少分母为零的守卫，导致 `SIGFPE` 或非有限结果。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072325132` | [OH-2026-ARKUI-007](../content/issues/OH-2026-ARKUI-007.md) | HIGH | CWE-369（除零） | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` · `arkui_ace_engine` | itemRatio == 0 时 GetIrregularHeight 除零 → 内容高度为 +inf |
| `DTS2026071428596` | [OH-2026-CAM-002](../content/issues/OH-2026-CAM-002.md) | MEDIUM | CWE-369（除零） | `services/camera_service/src/hcapture_session.cpp` · `multimedia_camera_framework` | ability range.size() == 1 时 SwitchBeautyValToDataShareVal 除零（SIGFPE） |
| `DTS2026072011242` | [OH-2026-CAM-004](../content/issues/OH-2026-CAM-004.md) | MEDIUM | CWE-369（除零） | `frameworks/native/camera/base/src/session/capture_session.cpp` · `multimedia_camera_framework` | 当 \|denominator\| < 1e6 时 sensor-exposure 的 numerator/(denominator/1e6) 触发 SIGFPE |

<details><summary>摘要</summary>

- **OH-2026-ARKUI-007**（`DTS2026072325132`）：`GridLayoutInfo::GetIrregularHeight` 把总行数估计为 `(lastKnownLine + 1) / itemRatio`，其中 `itemRatio = (FindEndIdx(lastKnownLine).itemIdx + 1) / childrenCount`。当该行不在 `gridMatrix_` 中时，`FindEndIdx` 返回……
- **OH-2026-CAM-002**（`DTS2026071428596`）：`MultiBeautyType::SwitchBeautyValToDataShareVal` 用 `range.size() - 1` 作为整数除数，在离散能力范围内插值美颜值。当能力范围恰好只含**一个**元素（`range.size() == 1`）时，……
- **OH-2026-CAM-004**（`DTS2026072011242`）：六处相机会话调用点按如下方式把 HAL 曝光时间有理数 `(numerator, denominator)` 转换为微秒：

</details>

### 算术 — 差一错误

循环边界或大小比较漏掉最后一个元素，或接受少一位的输入。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026052974442` | [OH-2026-DEVMGR-003](../content/issues/OH-2026-DEVMGR-003.md) | HIGH | CWE-193（差一错误） | `dm_random` · `distributedhardware_device_manager` | GeneratePinCode 循环条件差一，约 16% 的概率返回短 PIN，导致配对间歇性失败 |
| `DTS2026072935286` | [OH-2026-AVCODEC-002](../content/issues/OH-2026-AVCODEC-002.md) | MEDIUM | CWE-193（差一错误） | `services/media_engine/plugins/source/http_source/hls/hls_tags.cpp` · `multimedia_av_codec` | UriDecode 转义守卫差一，把截断的 %X 解码为控制字节 |
| `DTS2026080528903` | [OH-2026-GFX-007](../content/issues/OH-2026-GFX-007.md) | MEDIUM | CWE-193（差一错误） | `rosen/modules/render_service_base/include/common/rs_matrix3.h` · `graphic_graphic_2d` | Matrix3::IsNearEqual 只比较 9 个元素中的 8 个（data_ + 8） |

<details><summary>摘要</summary>

- **OH-2026-DEVMGR-003**（`DTS2026052974442`）：`utils/src/dm_random.cpp:101` 的 `GeneratePinCode(pinLength)` 以约 1/pinLength 的概率（6 位 PIN 约 16%）返回 `pinLength - 1` 个字符。这导致设备配对间歇性失败且无明显错误。
- **OH-2026-AVCODEC-002**（`DTS2026072935286`）：`hls_tags.cpp` 中文件静态函数 `UriDecode` 以守卫 `i + 2 <= uri.size()` 进入 `%XX` 转义分支，这只保证 `%` 后还有**一个**字符。`substr(i+1, 2)` 随后得到 1 字符的十六进制串；`IsHexValid` 接受单个十六进制……
- **OH-2026-GFX-007**（`DTS2026080528903`）：`Matrix3<T>::IsNearEqual` 使用 `std::equal(data_, data_ + 8, …)` — 半开区间 **[0, 8)** — 跳过了 **`data_[8]`**（`PERSP_2`）。仅在最后一个槽位不同的矩阵被判为近似相等 → 动画可能经 `RSRenderAnima……` 提前稳定

</details>

## 内存安全

### 内存安全 — 缓冲区 / 越界访问

越过缓冲区边界的读写；可能导致崩溃（`SEGV`）或破坏相邻状态。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026070722498` | [OH-2026-AVSESSION-001](../content/issues/OH-2026-AVSESSION-001.md) | HIGH | CWE-787（越界读取） | `utils/include/avsession_utils.h` · `multimedia_av_session` | GetAnonyTitle 在全连续字节的媒体标题上因空向量越界读崩溃（SEGV） |
| `DTS2026071806709` | [OH-2026-WIFI-001](../content/issues/OH-2026-WIFI-001.md) | MEDIUM | CWE-125（越界读取） | `wifi/utils/src/wifi_common_util.cpp` · `communication_wifi` | HexString2Byte 缺少空指针检查和源边界检查 — 越界读 + 空指针解引用 |
| `DTS2026071807957` | [ARK-2026-BUF-001](../content/issues/ARK-2026-BUF-001.md) | MEDIUM | CWE-787（越界写入） | `static_core/libarkfile/file_writer.cpp` · `arkcompiler_runtime_core` | MemoryBufferWriter 的 WriteByte/WriteBytes/AppendRange 超容量越界写仍返回 true |
| `DTS2026072717921` | [OH-2026-CAM-005](../content/issues/OH-2026-CAM-005.md) | MEDIUM | CWE-125（越界读取） | `frameworks/native/camera/base/src/output/photo_output.cpp` · `multimedia_camera_framework` | CAPTURE_MIRROR_SUPPORTED 成对遍历在奇数 item.count 时越界 |
| `DTS2026072514260` | [OH-2026-ABILITY-003](../content/issues/OH-2026-ABILITY-003.md) | MEDIUM | CWE-125（越界读取） | `services/abilitymgr/src/dialog_session/dialog_session_info.cpp` · `ability_ability_runtime` | ParseURI 的 catch 在最后一个字段 stoi 失败后越界索引 uriVec |
| `DTS2026081136698` | [OH-2026-NET-006](../content/issues/OH-2026-NET-006.md) | MEDIUM | CWE-125（越界读取） | `services/netmanagernative/bpf/include/bitmap_manager.h` · `communication_netmanager_base` | prefixLen > 128 时 Ip6RuleMap::GetNetworkAddress 越界 |
| `DTS2026081135903` | [OH-2026-NET-007](../content/issues/OH-2026-NET-007.md) | MEDIUM | CWE-125（越界读取） | `services/netconnmanager/src/pac_functions.cpp` · `communication_netmanager_base` | CheckIpv6InNet 缺少前缀长度边界 — 负值时全匹配 / /129+ 时越界 |
| `DTS2026080813420` | [OH-2026-CAM-007](../content/issues/OH-2026-CAM-007.md) | MEDIUM | CWE-125（越界读取） | `frameworks/native/camera/base/src/output/photo_output.cpp` · `multimedia_camera_framework` | HIGH_QUALITY_SUPPORT 成对遍历 / 默认 u8[1] 在短或奇数 count 时越界 |
| `DTS2026080813622` | [OH-2026-CAM-008](../content/issues/OH-2026-CAM-008.md) | MEDIUM | CWE-125（越界读取） | `frameworks/native/camera/base/src/session/capture_session.cpp` · `multimedia_camera_framework` | GetZoomRatioRange 步长 3 的 FOV 读取缺少同类边界检查 |
| `DTS2026080813794` | [OH-2026-CAM-009](../content/issues/OH-2026-CAM-009.md) | MEDIUM | CWE-125（越界读取） | `frameworks/native/camera/base/src/output/sketch_wrapper.cpp` · `multimedia_camera_framework` | 月亮增强 FOV 三元组读取 ui32[i+1]/[i+2] 无界（两处） |
| `DTS2026080813827` | [OH-2026-CAM-010](../content/issues/OH-2026-CAM-010.md) | MEDIUM | CWE-125（越界读取） | `services/camera_service/src/hcapture_session.cpp` · `multimedia_camera_framework` | QueryZoomPerformance TLV 遍历越界（mode / num / points） |
| `DTS2026080813868` | [OH-2026-CAM-011](../content/issues/OH-2026-CAM-011.md) | MEDIUM | CWE-125（越界读取） | `frameworks/native/camera/base/src/input/camera_manager.cpp` · `multimedia_camera_framework` | ParsingCameraConcurrentLimted 长度前缀越界 |
| `DTS2026082023118` | [OH-2026-DSOFTBUS-001](../content/issues/OH-2026-DSOFTBUS-001.md) | MEDIUM | CWE-125（越界读取） | `core/connection/wifi_direct_cpp/processor/p2p_v1_processor.cpp` · `communication_dsoftbus` | ConnectGroup 差一守卫在 3 段 group config 上读取 configs[3] |

<details><summary>摘要</summary>

- **OH-2026-AVSESSION-001**（`DTS2026070722498`）：`AVSessionUtils::GetAnonyTitle` 对媒体标题做日志脱敏。它扫描标题中的 UTF-8 字符起始（*非*连续字节的字节）并把位置记入 `char_positions`，然后 — 在短文本分支……
- **OH-2026-WIFI-001**（`DTS2026071806709`）：`HexString2Byte(hex, buf, len)` 把十六进制字符串解码到字节缓冲区。它只为**输出**缓冲区接收长度；源范围是隐式且未检查的。`Hex2byte` 读取 `ipos[0]`/`ipos[1]` 时既无空检查也无源……
- **ARK-2026-BUF-001**（`DTS2026071807957`）：`MemoryBufferWriter::WriteByte` / `WriteBytes` / `AppendRange` 把目标计算为 `sp_.SubSpan(offset_, n)`，**没有检查** `offset_ + n <= capacity`，然后 `memcpy_s`。超容量写入返回 `true` 并推进 `offset……`
- **OH-2026-CAM-005**（`DTS2026072717921`）：五处复制粘贴的代码以步长 2 把 `OHOS_CONTROL_CAPTURE_MIRROR_SUPPORTED` 当作 `(mode, flag)` 对遍历，但边界只检查 `i < item.count`，然后总是读取 `item.data.u8[i + 1]`（函数体和调试日志）。奇数 `item.count` → 最后一个 `i` 满足 `i ……`
- **OH-2026-ABILITY-003**（`DTS2026072514260`）：最后一个 `stoi(uriVec[index++])` 在抛出异常前把 `index` 推进到 11；catch 中记录 `uriVec[index++]` 越界（对 `operator[]` 是 UB）。
- **OH-2026-NET-006**（`DTS2026081136698`）：`Ip6RuleMap::GetNetworkAddress` 以 `prefixLen / 8` 索引 `s6_addr` 且无上界。`prefixLen > 128` → 越界读和错误的 netfirewall 位图键。
- **OH-2026-NET-007**（`DTS2026081135903`）：`CheckIpv6InNet` 在索引 `s6_addr` 前没有 `prefixLen` 边界检查。PAC 的 `atoi` 可能为负（全匹配）或 `/129+`（越界）。
- **OH-2026-CAM-007**（`DTS2026080813420`）：`IsAutoHighQualityPhotoSupported` 在没有 `count >= 2` 时读 `u8[1]`，并以 `i < count` 成对遍历后读 `u8[i+1]`。短/奇数 `HIGH_QUALITY_SUPPORT` → 越界；Find 失败则遍历未初始化的 `item`。
- **OH-2026-CAM-008**（`DTS2026080813622`）：`GetZoomRatioRange` 以步长 3 遍历 scene-zoom 三元组，边界只有 `i < count`，然后读 `i32[i+1]`/`[i+2]`。同类 `GetRAWZoomRatioRange` 已检查 `i + maxOffset`。
- **OH-2026-CAM-009**（`DTS2026080813794`）：两处月亮增强 FOV 站点只以 `i < count` 读 `ui32[i+1]`/`[i+2]`。截断的 FOV 尾部 → 越界。sketch 浮点同类已使用 `i < count - 2`。
- **OH-2026-CAM-010**（`DTS2026080813827`）：`QueryZoomPerformance` 信任 TLV 的 `num` 且无剩余长度检查，随后 `GetCrossZoomAndTime` 步长 3 无尾部守卫。短/虚报 `num` → 越界。
- **OH-2026-CAM-011**（`DTS2026080813868`）：`ParsingCameraConcurrentLimted` 读取长度前缀 `originInfo[i+1]` 再读 payload，没有 `i+1 < count` / `i+2+length <= count`。辅助函数盲目循环 `k < length`。
- **OH-2026-DSOFTBUS-001**（`DTS2026082023118`）：`ConnectGroup` 守卫 `configs.size() < INDEX_FREQ`（3）然后读 `configs[3]`。3 段对端 group config 通过守卫并越界。同类 `P2pConnectGroup` 要求 `size >= INDEX_MODE`（4）。

</details>

### 内存安全 — 空指针解引用

在仍会执行解引用的路径上缺少空指针检查。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071309672` | [OH-2026-MF-001](../content/issues/OH-2026-MF-001.md) | HIGH | CWE-476（空指针解引用） | `src/meta/format.cpp` · `multimedia_media_foundation` | Format::Stringify 在 PutIntBuffer 条目上空指针解引用（SIGSEGV） |

<details><summary>摘要</summary>

- **OH-2026-MF-001**（`DTS2026071309672`）：`Format::Stringify` 在任何通过公共 setter `PutIntBuffer` 存入值的 format 上发生 SIGSEGV。`src/meta/format.cpp` 中两个相互配合的缺陷导致了它：

</details>

### 内存安全 — 重复释放

拥有生命周期的指针被释放两次（例如显式 destroy + 析构函数）。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072457284` | [OH-2026-PLAYER-001](../content/issues/OH-2026-PLAYER-001.md) | MEDIUM | CWE-415（双重释放） | `services/utils/xml_parse.cpp` · `multimedia_player_framework` | XmlParser::Destroy 重复释放 mDoc_（析构函数未置空再次进入） |

<details><summary>摘要</summary>

- **OH-2026-PLAYER-001**（`DTS2026072457284`）：`XmlParser::Destroy` 通过 `xmlFreeDoc(mDoc_)` 释放 libxml 文档但**没有**清空 `mDoc_`。析构函数**总是**再次调用 `Destroy()` → 对悬垂指针的第二次 `xmlFreeDoc` → **双重释放 / 进程中止**。

</details>

## 控制流与逻辑

### 控制流 — 死循环 / 挂起

退出条件永远无法满足（常因无符号回绕或计数器截断）。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071433052` | [ARK-2026-LOOP-001](../content/issues/ARK-2026-LOOP-001.md) | MEDIUM | CWE-835（无可达退出条件的循环（"死循环"）） | `disassembler/disassembler.cpp` · `arkcompiler_runtime_core` | 参数个数在 [256, 65535] 时 GetParams 的 uint8_t 循环永久挂起 |
| `DTS2026072750511` | [OH-2026-NET-004](../content/issues/OH-2026-NET-004.md) | MEDIUM | CWE-835（无可达退出条件的循环（"死循环"）） | `services/netmanagernative/bpf/src/bitmap_manager.cpp` · `communication_netmanager_base` | startBytes == 0 且未命中时 RfindIp6 无符号下溢导致挂起/越界 |
| `DTS2026080608464` | [OH-2026-NET-005](../content/issues/OH-2026-NET-005.md) | MEDIUM | CWE-835（无可达退出条件的循环（"死循环"）） | `services/netmanagernative/bpf/src/bitmap_manager.cpp` · `communication_netmanager_base` | GetIp4AndMask 的 uint32 步进回绕 → 范围终止于 255.255.255.255 时死循环 |

<details><summary>摘要</summary>

- **ARK-2026-LOOP-001**（`DTS2026071433052`）：`Disassembler::GetParams` 用 `uint8_t i` 索引填充循环，与 `uint32_t params_num`（受 `MAX_ARG_NUM = 0xFFFF` 限制）比较。当 `params_num ∈ [256, 65535]` 时，`i` 在 255 处回绕 → `i < params_num` **永远为真**……
- **OH-2026-NET-004**（`DTS2026072750511`）：`IpParamParser::RfindIp6` 用 `for (uint32_t i = endBytes; i >= startBytes; --i)` 向下扫描 IPv6 字节。在**未命中**且 `startBit < 8`（`startBytes == 0`）时，越过 0 的 `--i` 回绕到 `UINT_MAX` → **死循环**且 `s6_addr[UINT_M……`
- **OH-2026-NET-005**（`DTS2026080608464`）：`IpParamParser::GetIp4AndMask` 用 `while (startIpInt <= endIpInt)` 和 `startIpInt += (1 << cidrBits)` 把 MULTIPLE_IP 起止范围展开为 CIDR。当范围终止于 `255.255.255.255`（`0xFFFFFFFF`）时，最后一步回绕到 `0`……

</details>

### 逻辑 — 控制流错误

错误的分支、哨兵值或迭代器选择，导致错误地返回成功/恒等结果。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026061512035` | [OH-2026-ARKUI-002](../content/issues/OH-2026-ARKUI-002.md) | HIGH | CWE-670（控制流实现始终错误） | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` · `arkui_ace_engine` | 当条目 0 不存在时 GridLayoutInfo::FindInMatrix 对 index=0 返回错误迭代器 |
| `DTS2026062427889` | [OH-2026-ARKUI-004](../content/issues/OH-2026-ARKUI-004.md) | HIGH | CWE-670（控制流实现始终错误） | `frameworks/core/components_ng/pattern/grid/grid_item_drag_manager.cpp` · `arkui_ace_engine` | 行不存在且 span 无法满足时 GridItemDragManager::FindAvailableColumn 返回 0 而非 -1 |
| `DTS2026071544397` | [OH-2026-ABILITY-001](../content/issues/OH-2026-ABILITY-001.md) | MEDIUM | CWE-754（异常条件检查或处理不当） | `frameworks/native/ability/native/ability_runtime/js_ui_ability.cpp` · `ability_ability_runtime` | Stage 模型 .abc 路径构建器中 erase(rfind('.')) 无守卫，无扩展名 srcEntrance 导致应用崩溃 |
| `DTS2026073129863` | [OH-2026-GFX-006](../content/issues/OH-2026-GFX-006.md) | MEDIUM | CWE-670（控制流实现始终错误） | `rosen/modules/2d_graphics/src/drawing/config/DrawingConfig.cpp` · `graphic_graphic_2d` | UpdateDrawingProperties 永久空操作（枚举与字符串列表大小不一致） |
| `DTS2026081128460` | [OH-2026-IMG-004](../content/issues/OH-2026-IMG-004.md) | MEDIUM | CWE-670（控制流实现始终错误） | `frameworks/innerkitsimpl/utils/src/image_utils.cpp` · `multimedia_image_framework` | GetValidAlphaTypeByFormat 缺少 RGBA_U16 分支，返回 UNKNOWN |
| `DTS2026073112258` | [ARK-2026-STR-001](../content/issues/ARK-2026-STR-001.md) | MEDIUM | CWE-680（整数溢出导致缓冲区溢出） | `panda_guard/util/string_util.cpp` · `arkcompiler_runtime_core` | RemoveSlashFromBothEnds("/") 对空串 pop_back()（UB / 损坏 size） |

<details><summary>摘要</summary>

- **OH-2026-ARKUI-002**（`DTS2026061512035`）：`GridLayoutInfo::FindInMatrix(0)` 无条件返回 `gridMatrix_.begin()` 而不是搜索条目 `0`。当矩阵非空但起始行索引大于 `0` 时，`begin()` 指向一个不包含……
- **OH-2026-ARKUI-004**（`DTS2026062427889`）：`GridItemDragManager::FindAvailableColumn(matrix, row, colSpan, crossCount)` 返回宽度为 `colSpan` 的条目在 `crossCount` 列网格中的第一个空闲列。当目标 `row` 不在矩阵中时，函数……
- **OH-2026-ABILITY-001**（`DTS2026071544397`）：Stage 模型 `.abc` 路径构建器从 HAP 的模块名和 `srcEntrance` 构造编译后的 arkts 路径，然后调用 `srcPath.erase(srcPath.rfind("."))` 去掉源扩展名。**没有 `npos` 守卫**。当……
- **OH-2026-GFX-006**（`DTS2026073129863`）：`DrawingConfig::UpdateDrawingProperties` 把 `DrawingDisableFlag::COUNT`（42）与 `gDrawingDisableFlagStr.size()`（41）比较，不匹配即提前返回 — 因此**没有任何** `drawing.disable*` 参数被应用，所有标志保持 `false`。……
- **OH-2026-IMG-004**（`DTS2026081128460`）：`ImageUtils::GetValidAlphaTypeByFormat` 对 RGBA 类格式归一化 alpha 类型时落穿 `break` 组并返回调用者的 `dstType`。`RGBA_F16` 在该组中；**缺少 `RGBA_U16`**，落入 `default` → `IMA……`
- **ARK-2026-STR-001**（`DTS2026073112258`）：`RemoveSlashFromBothEnds` 剥离 `/pattern/` 定界符。守卫 `!empty() && front=='/' && back=='/'` 对单个 `"/"`（同一字符）也通过。`erase()` 清空后再对空串 `pop_back()` → UB；libstdc++ 的 `size()` 下溢到约 7.2e16。

</details>

### 逻辑 — 运算符 / 谓词错误

错误的运算符/谓词翻转了布尔值或类型标记。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026073015200` | [OH-2026-IMG-003](../content/issues/OH-2026-IMG-003.md) | HIGH | CWE-480（使用错误运算符） | `frameworks/innerkitsimpl/converter/src/matrix.cpp` · `multimedia_image_framework` | Matrix::SetTranslate 在任一轴为零时标记为 IDENTITY |

<details><summary>摘要</summary>

- **OH-2026-IMG-003**（`DTS2026073015200`）：`Matrix::SetTranslate` 正确存储平移 float，但在**任一**轴为零时（`tx == 0 || ty == 0`）标记 `operType = IDENTITY`。分发基于 `operType`，因此纯 X 或纯 Y 平移被 `GetXYPro……` 视为**空操作**……

</details>

### 逻辑 — 未检查返回值

子例程的失败结果被忽略；调用者带着无效状态继续执行。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072326318` | [OH-2026-DFS-001](../content/issues/OH-2026-DFS-001.md) | MEDIUM | CWE-252（未检查返回值） | `frameworks/native/clouddiskservice_kit_inner/src/cloud_disk_common.cpp` · `filemanagement_dfs_service` | ChangesResult::ReadFromParcel 忽略 ChangeData::ReadFromParcel 的失败 |

<details><summary>摘要</summary>

- **OH-2026-DFS-001**（`DTS2026072326318`）：`ChangesResult::ReadFromParcel` 循环处理 parcel 条目并调用 `changeData.ReadFromParcel(parcel)`，但**丢弃了返回的 bool**。任何子字段读取失败时它仍 `push_back` 一个默认/残缺的 `ChangeData` 并返回 `true`。外层……

</details>

### 未定义行为

依赖未定义行为（移位宽度、有符号转换模式），后果随环境而异。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026070856960` | [OH-2026-NET-002](../content/issues/OH-2026-NET-002.md) | HIGH | CWE-758（依赖未定义、未指明或实现定义的行为） | `services/netconnmanager/src/pac_functions.cpp` · `communication_netmanager_base` | CheckIpv4InNet 经未定义行为（1<<32）计算 /0 CIDR 掩码，静默绕过 PAC 全量代理规则 |
| `DTS2026070856858` | [OH-2026-ARKUI-006](../content/issues/OH-2026-ARKUI-006.md) | MEDIUM | CWE-758（依赖未定义、未指明或实现定义的行为） | `frameworks/core/components/common/properties/color.cpp` · `arkui_ace_engine` | Color::LineColorTransition 在通道递减时未定义行为转换（旧版 DataPanel 渐变） |

<details><summary>摘要</summary>

- **OH-2026-NET-002**（`DTS2026070856960`）：`CheckIpv4InNet` 按如下方式计算 CIDR 子网掩码：
- **OH-2026-ARKUI-006**（`DTS2026070856858`）：`Color::LineColorTransition` 对两个颜色插值时，先把**通道差值单独**转换为 `uint8_t` 再加起始通道：

</details>

### 状态 / 生命周期 — 清理不完整或状态卡死

超时/错误路径使标志或资源卡死，禁用后续操作。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072000001` | [OH-2026-PB-002](../content/issues/OH-2026-PB-002.md) | HIGH | CWE-459（清理不完整） | `services/core/src/pasteboard_service.cpp` · `distributeddatamgr_pasteboard` | SetCurrentDistributedData 超时后 isRunning 卡死，永久禁用跨设备剪贴板发布 |

<details><summary>摘要</summary>

- **OH-2026-PB-002**（`DTS2026072000001`）：`PasteboardService::SetCurrentDistributedData` 在由 `setDistributedMemory_.isRunning` 标志守护的 worker lambda 内运行分布式发布流水线。该标志是所有权闩锁：worker 进入时置 `true`，……

</details>

## 输入校验

### 输入校验 — 校验不当

校验器接受格式错误或超出契约的值。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071809730` | [OH-2026-ABILITY-002](../content/issues/OH-2026-ABILITY-002.md) | MEDIUM | CWE-1287（对指定类型输入的不当校验） | `frameworks/native/ability/native/data_uri_utils.cpp` · `ability_ability_runtime` | DataUriUtils::IsNumber 接受浮点数；GetId 静默截断为整数前缀 |
| `DTS2026072335866` | [OH-2026-STORAGE-001](../content/issues/OH-2026-STORAGE-001.md) | MEDIUM | CWE-20（输入校验不当） | `services/storage_daemon/ipc/src/storage_daemon_provider.cpp` · `filemanagement_storage_service` | SA 提供者在用户级 IPC 上跳过 CheckUserIdRange |
| `DTS2026070238028` | [OH-2026-CAM-001](../content/issues/OH-2026-CAM-001.md) | LOW | CWE-129（数组索引校验不当） | `common/utils/fixed_size_list.h` · `multimedia_camera_framework` | FixedSizeList::remove_at 在回绕后损坏环形缓冲区，丢失有效元素 |

<details><summary>摘要</summary>

- **OH-2026-ABILITY-002**（`DTS2026071809730`）：`INTEGER_REGEX` 通过可选的小数部分组接受十进制浮点数，因此 `IsNumber("12.5")` 返回 **true**。公共 `GetId` 以 `IsNumber` 为门控并返回 `std::atoll(lastPath)`，后者把浮点数截断为整数前缀：`"12……`
- **OH-2026-STORAGE-001**（`DTS2026072335866`）：共享 SA 门控 `CheckUserIdRange`（`userId ∈ [START_USER_ID=0, MAX_USER_ID=10738]`，失败返回 **`E_USERID_RANGE`**）在 **10** 个用户级 provider 入口上缺失：**7** 个 Daemon + **3** 个 Manager。越界的 `userId` 被接受并转发……
- **OH-2026-CAM-001**（`DTS2026070238028`）：`FixedSizeList::remove_at` 在任何移除后无条件把写指针（`index`）回退 1。内部环形缓冲区回绕之后，回退的指针落在持有有效元素的槽位上。下一次 `add` 会覆盖……

</details>

### 输入校验 — 非法输入导致未捕获异常 / 崩溃

解析器对通过了宽松预检查的值抛出异常/中止。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026071303295` | [OH-2026-CAM-006](../content/issues/OH-2026-CAM-006.md) | MEDIUM | CWE-248（未捕获异常） | `services/camera_service/src/camera_util.cpp` · `multimedia_camera_framework` | IsDoubleRegex 守卫过宽 → SetParameters 中 std::stoi 未捕获抛出 |
| `DTS2026071411883` | [OH-2026-CAM-003](../content/issues/OH-2026-CAM-003.md) | MEDIUM | CWE-248（未捕获异常） | `services/camera_service/src/hcapture_session.cpp` · `multimedia_camera_framework` | UpdateBasicInfoForStream 对已接受的整数值发生未捕获的 std::stoi out_of_range |

<details><summary>摘要</summary>

- **OH-2026-CAM-006**（`DTS2026071303295`）：`IsDoubleRegex` 通过 `operator>>(double&)` / `strtod` 接受 double 语法，随后 `HCameraService::SetParameters` 对同一字符串为 `META_TYPE_BYTE` 调用未加守卫的 `std::stoi`（同一模式扩散到 `SetParameter……`）
- **OH-2026-CAM-003**（`DTS2026071411883`）：`HCaptureSession::UpdateBasicInfoForStream` 用 `isIntegerRegex(pair.second)` 门控每个非字符串插件代码，然后把同一字符串喂给 `std::stoi`。但 `isIntegerRegex` 只检查形如 `^-?[0-9]+$` 的形状，**没有数值范围……**

</details>

### 输入校验 — 路径穿越

路径白名单漏掉经典的 `..`（或类似）形式。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072223098` | [OH-2026-DATAMGR-001](../content/issues/OH-2026-DATAMGR-001.md) | MEDIUM | CWE-22（对受限目录的路径名限制不当（"路径穿越"）） | `services/distributeddataservice/framework/utils/constant.cpp` · `distributeddatamgr_datamgr_service` | Constant::IsValidPath 接受单独的 '..' |

<details><summary>摘要</summary>

- **OH-2026-DATAMGR-001**（`DTS2026072223098`）：`Constant::IsValidPath` 只拒绝分隔符形式 `"../…"` 和 `"…/.."`。裸的 `".."` 与两个标志都不匹配并返回 **true**。在 KVDB 存储路径上它门控 `meta.dataDir` 后传给 `SetKvStoreConfig`，因此 `dataDir` 为 `".."` 时通过……

</details>

### 输入校验 — 编码 / Unicode

UTF-8/编码检查接受非法序列。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026072513315` | [OH-2026-GFX-005](../content/issues/OH-2026-GFX-005.md) | MEDIUM | CWE-176（Unicode 编码处理不当） | `rosen/modules/2d_graphics/src/drawing/utils/string_util.cpp` · `graphic_graphic_2d` | IsUtf8 在 signed-char 平台上接受 UTF-8 代理项 |

<details><summary>摘要</summary>

- **OH-2026-GFX-005**（`DTS2026072513315`）：`OHOS::Rosen::IsUtf8` 通过 `c == 0xED && (next & 0xA0) == 0xA0 → false` 表达了拒绝 UTF-8 代理项半区的意图。在 signed-`char` 平台（典型 OH/Linux ARM/x86）上，`uint32_t c = text[i]` 把 `0xED` 符号扩展为 `0xFFFFFFED`，因此 `c ……`

</details>

## 安全

### 安全 — 授权 / 访问控制

授权/防火墙/授予检查失效开放（fail-open）或错误分类流量。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026050963138` | [OH-2026-NET-003](../content/issues/OH-2026-NET-003.md) | HIGH | CWE-285（授权不当） | `services/netmanagernative/bpf/include/netfirewall/netfirewall_match.h` · `communication_netmanager_base` | netfirewall 的 match_loopback 恒返回 true，把所有流量判定为环回并短路拒绝规则 |
| `DTS2026071412383` | [OH-2026-PB-001](../content/issues/OH-2026-PB-001.md) | MEDIUM | CWE-862（缺少授权） | `services/core/src/pasteboard_service.cpp` · `distributeddatamgr_pasteboard` | ProcessDistributedDelayUri 导出 URI 时未检查每条记录的授权标志（fail-open） |
| `DTS2026073173354` | [OH-2026-ABILITY-004](../content/issues/OH-2026-ABILITY-004.md) | MEDIUM | CWE-863（授权错误） | `services/uripermmgr/src/file_permission_manager.cpp` · `ability_ability_runtime` | CheckFileManagerUriPermission 匹配 Download/Desktop/Documents 前缀时缺少 '/' 边界 |

<details><summary>摘要</summary>

- **OH-2026-NET-003**（`DTS2026050963138`）：eBPF netfirewall 连接跟踪路径中的 `match_loopback` 计算局部 `is_loopback` 标志（来自 `PROTOCOL_SAT_EXPAK && ifindex == 1` 特例，或在 `LOOP_BACK_IPV4_MAP` / `LOOP_BACK_IPV6_MAP` LPM ……
- **OH-2026-PB-001**（`DTS2026071412383`）：`PasteboardService::ProcessDistributedDelayUri` 把本地文件 URI 转换为 DFS/分布式 URI 并为远端编码。它调用 `PasteboardWebController::CheckAppUriPermission(data)`，后者写入每条记录的 `HasGrant……`
- **OH-2026-ABILITY-004**（`DTS2026073173354`）：无尾部 `/` 的 `path.find(PREFIX) == 0` 把兄弟目录（`DownloadEvil`）和 `Download`+`bundleName` 粘连形式视为文件夹内；Download 可能在没有 RW 检查的情况下自动授权。

</details>

### 安全 — 证书校验

TLS/固定校验使用了错误的材料或指针。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026052810677` | [YLONG-2026-SSL-001](../content/issues/YLONG-2026-SSL-001.md) | HIGH | CWE-295（证书校验不当） | `ssl` · `commonlibrary_rust_ylong_http` | verify_pinned_pubkey 中指针错误导致证书固定（pinning）绕过 |

<details><summary>摘要</summary>

- **YLONG-2026-SSL-001**（`DTS2026052810677`）：`ylong_http_client/src/util/c_openssl/ssl/stream.rs:320` 的 `verify_pinned_pubkey()` 把 `&mut key.as_ptr()`（指向栈上临时对象的指针）而非 `&mut key.as_mut_ptr()`（指向堆缓冲区内……的指针）传给了 `i2d_X509_PUBKEY`

</details>

### 安全 — 信息泄露

脱敏/遮蔽失败；敏感信息或地址进入日志。

| DTS | ID | 严重级别 | CWE | 组件 / 仓库 | 标题 |
|-----|----|----------|-----|------------------|-------|
| `DTS2026062926934` | [OH-2026-NET-001](../content/issues/OH-2026-NET-001.md) | MEDIUM | CWE-212（存储或传输前敏感信息清除不当） | `utils/common_utils/src/netmanager_base_common_utils.cpp` · `communication_netmanager_base` | ToAnonymousIp(maskMiddle=true) 把压缩格式 IPv6 地址未脱敏写入日志 |

<details><summary>摘要</summary>

- **OH-2026-NET-001**（`DTS2026062926934`）：`MaskIpMiddle` 是生产日志路径上 `ToAnonymousIp(input, true)` 委托的辅助函数。它查找分隔符的首次和最后一次出现，并掩盖其间的每个字符。对于以 `::` 书写的 IPv6 地址……

</details>

## CWE 频次（仅 DTS）

| CWE | 名称 | 数量 |
|-----|------|------:|
| CWE-682 | 计算错误 | 15 |
| CWE-125 | 越界读取 | 11 |
| CWE-190 | 整数溢出或回绕 | 7 |
| CWE-670 | 控制流实现始终错误 | 4 |
| CWE-191 | 整数下溢（回绕） | 4 |
| CWE-369 | 除零 | 3 |
| CWE-835 | 无可达退出条件的循环（"死循环"） | 3 |
| CWE-193 | 差一错误 | 2 |
| CWE-248 | 未捕获异常 | 2 |
| CWE-758 | 依赖未定义、未指明或实现定义的行为 | 2 |
| CWE-1287 | 对指定类型输入的不当校验 | 1 |
| CWE-129 | 数组索引校验不当 | 1 |
| CWE-176 | Unicode 编码处理不当 | 1 |
| CWE-193 | 差一错误 | 1 |
| CWE-20 | 输入校验不当 | 1 |
| CWE-212 | 存储或传输前敏感信息清除不当 | 1 |
| CWE-22 | 对受限目录的路径名限制不当（"路径穿越"） | 1 |
| CWE-252 | 未检查返回值 | 1 |
| CWE-285 | 授权不当 | 1 |
| CWE-295 | 证书校验不当 | 1 |
| CWE-415 | 双重释放 | 1 |
| CWE-459 | 清理不完整 | 1 |
| CWE-476 | 空指针解引用 | 1 |
| CWE-480 | 使用错误运算符 | 1 |
| CWE-680 | 整数溢出导致缓冲区溢出 | 1 |
| CWE-754 | 异常条件检查或处理不当 | 1 |
| CWE-787 | 越界写入 | 1 |
| CWE-787 | 越界读取 | 1 |
| CWE-862 | 缺少授权 | 1 |
| CWE-863 | 授权错误 | 1 |

## 说明

- 范围仅为已提交 DTS 的缺陷（`internal_issue_id`）。
- 缺陷类型主要依据 CWE 推导，并结合标题/症状细化。每个工单只映射到一个主要类型。
- 本地报告：[`content/issues/`](../content/issues/)。
