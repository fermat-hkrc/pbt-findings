# DTS 缺陷汇总表

| # | 项目 | 缺陷摘要 | 缺陷类别 | 位置 | 状态 | 非问题原因 | DTS 编号 |
|---|------|----------|----------|------|------|------------|----------|
| 1 | arkcompiler_runtime_core | MemoryBufferWriter 的 WriteByte/WriteBytes/AppendRange 超容量越界写仍返回 true | 缓冲区/越界访问 | `static_core/libarkfile/file_writer.cpp` | 已确认并修复 |  | DTS2026071807957 |
| 2 | arkcompiler_runtime_core | NumToStr(INT_MIN) 在校验器诊断格式化中触发有符号溢出未定义行为 | 整数溢出/下溢 | `static_core/verification/util/str.h` | 已确认并修复 |  | DTS2026062916398 |
| 3 | arkcompiler_runtime_core | Range(空容器) 下溢为 SIZE_MAX，报告包含所有点 | 整数溢出/下溢 | `static_core/verification/util/range.h` | 已确认并修复 |  | DTS2026062915131 |
| 4 | arkcompiler_runtime_core | GetParams 的 uint8_t 循环在参数个数 ∈[256, 65535] 时永久挂起 | 死循环/挂起 | `disassembler/disassembler.cpp` | 已确认并修复 |  | DTS2026071433052 |
| 5 | arkcompiler_runtime_core | RemoveSlashFromBothEnds("/") 变为空后 pop_back()（UB / size 损坏） | 控制流错误 | `panda_guard/util/string_util.cpp` | 已确认并修复 |  | DTS2026073112258 |
| 6 | ability_ability_runtime | Stage 模型 .abc 路径构建对无扩展名 srcEntrance 无守卫 erase(rfind('.')) 导致应用崩溃 | 控制流错误 | `frameworks/native/ability/native/ability_runtime/js_ui_ability.cpp` | 已确认并修复 |  | DTS2026071544397 |
| 7 | ability_ability_runtime | DataUriUtils::IsNumber 接受浮点；GetId 静默截成整数前缀 | 检查不当 | `frameworks/native/ability/native/data_uri_utils.cpp` | 已确认并修复 |  | DTS2026071809730 |
| 8 | ability_ability_runtime | DialogAbilityInfo::ParseURI 的 catch 在末字段 stoi 失败后越界索引 uriVec | 缓冲区/越界访问 | `services/abilitymgr/src/dialog_session/dialog_session_info.cpp` | 已确认并修复 |  | DTS2026072514260 |
| 9 | ability_ability_runtime | CheckFileManagerUriPermission 匹配 Download/Desktop/Documents 前缀无 '/' 边界 | 授权/访问控制 | `services/uripermmgr/src/file_permission_manager.cpp` | 已确认并修复 |  | DTS2026073173354 |
| 10 | ability_ability_runtime | ConvertStringToUint32 用有符号 stoi 解析（丢弃 >INT_MAX，接受 "8a" 与 "-1"） | 计算错误 | `frameworks/native/ability/native/resource_config_helper.cpp` | 已确认并修复 |  | DTS2026082254944 |
| 11 | arkui_ace_engine | GridLayoutInfo::GetContentHeightOfRegularGrid 对带正 gap 的空网格返回负高度 | 计算错误 | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | 已确认并修复 |  | DTS2026061256925 |
| 12 | arkui_ace_engine | GridLayoutInfo::FindInMatrix 在缺 item 0 时对 index=0 返回错误迭代器 | 控制流错误 | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | 已确认并修复 |  | DTS2026061512035 |
| 13 | arkui_ace_engine | Matrix4::SetEntry 存储序与 Get/Set 相反，非对角往返失败 | 计算错误 | `frameworks/base/geometry/matrix4.cpp` | 已确认并修复 |  | DTS2026062427183 |
| 14 | arkui_ace_engine | GridItemDragManager::FindAvailableColumn 在行缺失且 span 无法放置时返回 0 而非 -1 | 控制流错误 | `frameworks/core/components_ng/pattern/grid/grid_item_drag_manager.cpp` | 已确认并修复 |  | DTS2026062427889 |
| 15 | arkui_ace_engine | LazyGridLayoutInfo::UpdatePosMapStart 从非零 start 重定时漏掉 spaceWidth_ | 计算错误 | `frameworks/core/components_ng/pattern/lazy_grid_layout/lazy_grid_layout_info.cpp` | 已确认并修复 |  | DTS2026070318488 |
| 16 | arkui_ace_engine | Color::LineColorTransition 在通道递减时 UB 转型（旧 DataPanel 渐变） | 未定义行为 | `frameworks/core/components/common/properties/color.cpp` | 已确认并修复 |  | DTS2026070856858 |
| 17 | arkui_ace_engine | GetIrregularHeight 在 itemRatio == 0 时除零 → 内容高度为 +inf | 除零 | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | 已确认并修复 |  | DTS2026072325132 |
| 18 | arkui_ace_engine | DataPanel GetPaintPath 在描边把半径压到 0 时无守卫 asin 比值得到 NaN circleAngle | 计算错误 | `frameworks/core/components_ng/pattern/data_panel/data_panel_modifier.cpp` | 已确认并修复 |  | DTS2026073116282 |
| 19 | multimedia_av_codec | HLS 分段 byterange 的 offset_+length_-1 在 uint32_t 中回绕 → 丢弃/错误范围 | 整数溢出/下溢 | `services/media_engine/plugins/source/http_source/hls/hls_segment_manager.cpp` | 已确认并修复 |  | DTS2026072438019 |
| 20 | multimedia_av_codec | UriDecode 转义守卫差一，把截断的 %X 解成控制字节 | 差一 | `services/media_engine/plugins/source/http_source/hls/hls_tags.cpp` | 已确认并修复 |  | DTS2026072935286 |
| 21 | multimedia_av_codec | ValuesListTag::ParseAttributes 的 TITLE 含前导逗号 | 计算错误 | `services/media_engine/plugins/source/http_source/hls/hls_tags.cpp` | 已确认并修复 |  | DTS2026081713997 |
| 22 | multimedia_av_codec | GraphicPixelFmtToVideoPixelFmt 把 YCRCB_P010 映射成 NV12（应为 NV21） | 计算错误 | `frameworks/native/capi/avcodec/preprocessor_format_utils.cpp` | 已确认并修复 |  | DTS2026082007640 |
| 23 | multimedia_av_session | GetAnonyTitle 对全连续字节媒体标题经空向量越界读崩溃（SEGV） | 缓冲区/越界访问 | `utils/include/avsession_utils.h` | 已确认并修复 |  | DTS2026070722498 |
| 24 | multimedia_av_session | TransformStrToInt64 溢出抛异常；有符号串因从 0 扫描被拒绝 | 坏输入未捕获异常/崩溃 | `services/session/server/softbus/softbus_session_utils.h` | 已确认并修复 |  | DTS2026080300753 |
| 25 | multimedia_camera_framework | FixedSizeList::remove_at 回绕后破坏环形缓冲，丢失仍存活元素 | 检查不当 | `common/utils/fixed_size_list.h` | 已确认并修复 |  | DTS2026070238028 |
| 26 | multimedia_camera_framework | SwitchBeautyValToDataShareVal 在 ability range.size() == 1 时除零（SIGFPE） | 除零 | `services/camera_service/src/hcapture_session.cpp` | 已确认并修复 |  | DTS2026071428596 |
| 27 | multimedia_camera_framework | UpdateBasicInfoForStream 对已接受的整数值未捕获 std::stoi out_of_range | 坏输入未捕获异常/崩溃 | `services/camera_service/src/hcapture_session.cpp` | 已确认并修复 |  | DTS2026071411883 |
| 28 | multimedia_camera_framework | 传感器曝光 numerator/(denominator/1e6) 在 \|denominator\| < 1e6 时 SIGFPE | 除零 | `frameworks/native/camera/base/src/session/capture_session.cpp` | 已确认并修复 |  | DTS2026072011242 |
| 29 | multimedia_camera_framework | CAPTURE_MIRROR_SUPPORTED 成对遍历在奇数 item.count 时越界 | 缓冲区/越界访问 | `frameworks/native/camera/base/src/output/photo_output.cpp` | 已确认并修复 |  | DTS2026072717921 |
| 30 | multimedia_camera_framework | IsDoubleRegex 守卫过宽 → SetParameters 中未捕获 std::stoi 抛出 | 坏输入未捕获异常/崩溃 | `services/camera_service/src/camera_util.cpp` | 已确认并修复 |  | DTS2026071303295 |
| 31 | multimedia_camera_framework | HIGH_QUALITY_SUPPORT 成对遍历 / 默认 u8[1] 在短或奇数 count 时越界 | 缓冲区/越界访问 | `frameworks/native/camera/base/src/output/photo_output.cpp` | 已确认并修复 |  | DTS2026080813420 |
| 32 | multimedia_camera_framework | GetZoomRatioRange 步长 3 的 FOV 读取缺少兄弟函数边界 | 缓冲区/越界访问 | `frameworks/native/camera/base/src/session/capture_session.cpp` | 已确认并修复 |  | DTS2026080813622 |
| 33 | multimedia_camera_framework | 月亮增强 FOV 三元组读取 ui32[i+1]/[i+2] 无边界（两处） | 缓冲区/越界访问 | `frameworks/native/camera/base/src/output/sketch_wrapper.cpp` | 已确认并修复 |  | DTS2026080813794 |
| 34 | multimedia_camera_framework | QueryZoomPerformance TLV 遍历越界（mode / num / points） | 缓冲区/越界访问 | `services/camera_service/src/hcapture_session.cpp` | 已确认并修复 |  | DTS2026080813827 |
| 35 | multimedia_camera_framework | ParsingCameraConcurrentLimted 长度前缀越界 | 缓冲区/越界访问 | `frameworks/native/camera/base/src/input/camera_manager.cpp` | 已确认并修复 |  | DTS2026080813868 |
| 36 | distributeddatamgr_datamgr_service | Constant::IsValidPath 接受单独的 ".." | 路径穿越 | `services/distributeddataservice/framework/utils/constant.cpp` | 已确认并修复 |  | DTS2026072223098 |
| 37 | distributedhardware_device_manager | GeneratePinCode 循环条件差一，约 16% 次返回过短 PIN，导致间歇配对失败 | 差一 | `utils/src/dm_random.cpp` | 已确认并修复 |  | DTS2026052974442 |
| 38 | distributedhardware_device_manager | GenerateRandNum 非法 uniform_int_distribution(1, 0xFFFFFFFF) → SIGSEGV | 整数溢出/下溢 | `services/implementation/src/device_manager_service_impl.cpp` | 已确认并修复 |  | DTS2026073020799 |
| 39 | filemanagement_dfs_service | ChangesResult::ReadFromParcel 忽略 ChangeData::ReadFromParcel 失败 | 未检查返回值 | `frameworks/native/clouddiskservice_kit_inner/src/cloud_disk_common.cpp` | 已确认并修复 |  | DTS2026072326318 |
| 40 | distributedhardware_distributed_hardware_fwk | cJSON 无符号校验因 static_cast 回绕接受溢出目标类型的值 | 整数溢出/下溢 | `utils/src/dh_utils_tool.cpp` | 已确认并修复 |  | DTS2026060814531 |
| 41 | communication_dsoftbus | P2pV1Processor::ConnectGroup 守卫差一，3 段 group 配置时读 configs[3] | 缓冲区/越界访问 | `core/connection/wifi_direct_cpp/processor/p2p_v1_processor.cpp` | 已确认并修复 |  | DTS2026082023118 |
| 42 | graphic_graphic_2d | Point3::operator+ 的 X、Y 用错操作数，破坏向量加法交换律 | 计算错误 | `rosen/modules/2d_graphics/include/utils/point3.h` | 已确认并修复 |  | DTS2026062430430 |
| 43 | graphic_graphic_2d | RSColor::FromBgraInt 与 AsBgraInt 联合体字段序不一致，BGRA 往返损坏所有通道 | 计算错误 | `rosen/modules/render_service_base/src/common/rs_color.cpp` | 已确认并修复 |  | DTS2026062701168 |
| 44 | graphic_graphic_2d | RectF::Round() 对负坐标舍入错误（x+0.5 截断 vs std::round） | 计算错误 | `rosen/modules/2d_graphics/include/utils/rect.h` | 已确认并修复 |  | DTS2026062516469 |
| 45 | graphic_graphic_2d | Point3 operator* / operator/= 经整数转型截断浮点通道 | 计算错误 | `rosen/modules/2d_graphics/include/utils/point3.h` | 已确认并修复 |  | DTS2026071430826 |
| 46 | graphic_graphic_2d | IsUtf8 在 signed-char 主机上接受 UTF-8 代理项 | 编码/Unicode | `rosen/modules/2d_graphics/src/drawing/utils/string_util.cpp` | 已确认并修复 |  | DTS2026072513315 |
| 47 | graphic_graphic_2d | UpdateDrawingProperties 永久空操作（枚举与字符串列表长度不一致） | 控制流错误 | `rosen/modules/2d_graphics/src/drawing/config/DrawingConfig.cpp` | 已确认并修复 |  | DTS2026073129863 |
| 48 | graphic_graphic_2d | Matrix3::IsNearEqual 只比较 9 个元素中的 8 个（data_ + 8） | 差一 | `rosen/modules/render_service_base/include/common/rs_matrix3.h` | 已确认并修复 |  | DTS2026080528903 |
| 49 | graphic_graphic_2d | CubicResampler::Dump 把 cubicCoffB 写入 cubicCoffC 字段 | 计算错误 | `rosen/modules/2d_graphics/include/utils/sampling_options.h` | 已确认并修复 |  | DTS2026080530843 |
| 50 | multimedia_image_framework | PostProc::GetCropValue 在 top+height / left+width 的 int32 溢出时接受越界裁剪 | 整数溢出/下溢 | `frameworks/innerkitsimpl/converter/src/post_proc.cpp` | 已确认并修复 |  | DTS2026072438492 |
| 51 | multimedia_image_framework | Matrix::SetTranslate 任一轴为零时打上 IDENTITY 标记 | 运算符/谓词错误 | `frameworks/innerkitsimpl/converter/src/matrix.cpp` | 已确认并修复 |  | DTS2026073015200 |
| 52 | multimedia_image_framework | GetValidAlphaTypeByFormat 缺少 RGBA_U16 分支返回 UNKNOWN | 控制流错误 | `frameworks/innerkitsimpl/utils/src/image_utils.cpp` | 已确认并修复 |  | DTS2026081128460 |
| 53 | multimedia_image_framework | Matrix::SetConcat 在缩放/平移快路径上把平移量相乘 | 计算错误 | `frameworks/innerkitsimpl/converter/src/matrix.cpp` | 已确认并修复 |  | DTS2026081126994 |
| 54 | multimedia_image_framework | HalfToFloat 把 half +0（0x0000）映射成 2^-15 而非 0.0f | 计算错误 | `frameworks/innerkitsimpl/converter/include/pixel_convert.h` | 已确认并修复 |  | DTS2026081424330 |
| 55 | multimedia_image_framework | PixelYuvUtils::IsLegalAxis 拒绝所有合法负平移（INT32_MAX - offset 有符号溢出） | 整数溢出/下溢 | `frameworks/innerkitsimpl/utils/src/pixel_yuv_utils.cpp` | 已确认并修复 |  | DTS2026081421810 |
| 56 | multimedia_image_framework | HalfToUint32 小端/大端分支写反（每个有效 half 通道都被字节交换） | 计算错误 | `frameworks/innerkitsimpl/converter/include/pixel_convert.h` | 已确认并修复 |  | DTS2026081413702 |
| 57 | multimedia_image_framework | IsValidRowStride 的 int32 溢出接受不可能的 stride（width*bpp 回绕为负） | 整数溢出/下溢 | `frameworks/innerkitsimpl/converter/src/pixel_convert.cpp` | 已确认并修复 |  | DTS2026073013382 |
| 58 | multimedia_image_framework | FloatToHalf 把 0.0f 映射成 Half 2.0（0x4000）— 重定减的无符号下溢 | 计算错误 | `frameworks/innerkitsimpl/converter/include/pixel_convert.h` | 已确认并修复 |  | DTS2026081417372 |
| 59 | multimedia_media_library | GetFileIdStr 对仅含 bucket 的 URI 返回 bucket 名（npos+1 回绕） | 整数溢出/下溢 | `common/utils/src/media_uri_utils.cpp` | 已确认并修复 |  | DTS2026072454808 |
| 60 | multimedia_media_library | GetTimeIdFromUri 对空/非整数 &offset= 未捕获 stoi | 坏输入未捕获异常/崩溃 | `frameworks/innerkitsimpl/media_library_helper/src/media_file_uri.cpp` | 已确认并修复 |  | DTS2026071806648 |
| 61 | multimedia_media_foundation | Format::Stringify 对 PutIntBuffer 项空指针解引用（SIGSEGV） | 空指针解引用 | `src/meta/format.cpp` | 已确认并修复 |  | DTS2026071309672 |
| 62 | communication_netmanager_base | ToAnonymousIp(maskMiddle=true) 把压缩 IPv6 原样泄漏到日志 | 信息泄漏 | `utils/common_utils/src/netmanager_base_common_utils.cpp` | 已确认并修复 |  | DTS2026062926934 |
| 63 | communication_netmanager_base | CheckIpv4InNet 的 /0 CIDR 掩码经未定义行为（1<<32），静默绕过 PAC 全匹配代理规则 | 未定义行为 | `services/netconnmanager/src/pac_functions.cpp` | 已确认并修复 |  | DTS2026070856960 |
| 64 | communication_netmanager_base | netfirewall 的 match_loopback 恒为 true，把所有流量当环回并短路拒绝规则 | 授权/访问控制 | `services/netmanagernative/bpf/include/netfirewall/netfirewall_match.h` | 已确认并修复 |  | DTS2026050963138 |
| 65 | communication_netmanager_base | RfindIp6 在 startBytes == 0 未命中时无符号下溢挂起/越界 | 死循环/挂起 | `services/netmanagernative/bpf/src/bitmap_manager.cpp` | 已确认并修复 |  | DTS2026072750511 |
| 66 | communication_netmanager_base | GetIp4AndMask 的 uint32 步长回绕 → 范围止于 255.255.255.255 时死循环 | 死循环/挂起 | `services/netmanagernative/bpf/src/bitmap_manager.cpp` | 已确认并修复 |  | DTS2026080608464 |
| 67 | communication_netmanager_base | Ip6RuleMap::GetNetworkAddress 在 prefixLen > 128 时越界 — netfirewall 位图错误合并 | 缓冲区/越界访问 | `services/netmanagernative/bpf/include/bitmap_manager.h` | 已确认并修复 |  | DTS2026081136698 |
| 68 | communication_netmanager_base | CheckIpv6InNet 缺少前缀边界 — 负数全匹配 / /129+ 越界 | 缓冲区/越界访问 | `services/netconnmanager/src/pac_functions.cpp` | 已确认并修复 |  | DTS2026081135903 |
| 69 | communication_netmanager_base | StrToUint64 把前导负号回绕成 UINT64_MAX | 整数溢出/下溢 | `utils/common_utils/src/netmanager_base_common_utils.cpp` | 已确认并修复 |  | DTS2026071727054 |
| 70 | communication_netmanager_base | StrToInt / StrToUint / StrToUint64 把前导零十进制当八进制解析 | 计算错误 | `utils/common_utils/src/netmanager_base_common_utils.cpp` | 已确认并修复 |  | DTS20260717048 |
| 71 | distributeddatamgr_pasteboard | ProcessDistributedDelayUri 导出 URI 不查每条 grant 标志（失败开放） | 授权/访问控制 | `services/core/src/pasteboard_service.cpp` | 已确认并修复 |  | DTS2026071412383 |
| 72 | distributeddatamgr_pasteboard | SetCurrentDistributedData 超时后 isRunning 卡住，永久关闭跨设备剪贴板发布 | 清理不完整或卡住 | `services/core/src/pasteboard_service.cpp` | 已确认并修复 |  | DTS2026073012747 |
| 73 | multimedia_player_framework | XmlParser::Destroy 双重释放 mDoc_（析构未置空再次进入） | 双重释放 | `services/utils/xml_parse.cpp` | 已确认并修复 |  | DTS2026072457284 |
| 74 | multimedia_player_framework | TransRecorderStatus 复用器映射缺 START 且 STOP 键重复 | 计算错误 | `services/utils/media_utils.cpp` | 已确认并修复 |  | DTS2026081318473 |
| 75 | multimedia_player_framework | MSExtErrorToString 在 extend 落空分支减去错误的枚举基 | 计算错误 | `frameworks/native/common/media_errors.cpp` | 已确认并修复 |  | DTS2026081703440 |
| 76 | filemanagement_storage_service | SA 提供者在用户范围 IPC 上跳过 CheckUserIdRange | 检查不当 | `services/storage_daemon/ipc/src/storage_daemon_provider.cpp` | 已确认并修复 |  | DTS2026072335866 |
| 77 | telephony_core_service | Asn1Utils::BytesToInt 在 offset+length 的 uint32 回绕时段错误 | 整数溢出/下溢 | `utils/codec/src/asn1_utils.cpp` | 已确认并修复 |  | DTS2026082565627 |
| 78 | communication_wifi | HexString2Byte 缺少空指针检查与源边界 — 越界读 + 空指针解引用 | 缓冲区/越界访问 | `wifi/utils/src/wifi_common_util.cpp` | 已确认并修复 |  | DTS2026071806709 |
| 79 | communication_wifi | GetCurStateName 对空 mStateVector 越界读 — mStateVector[-1] 上 SEGV | 缓冲区/越界访问 | `wifi/base/state_machine/src/state_machine.cpp` | 已确认并修复 |  | DTS2026073028465 |
| 80 | window_window_manager | IsAspectRatioSatisfiedWithSizeLimits 装饰 uint32 下溢拒绝合法比例 | 整数溢出/下溢 | `utils/include/window_helper.h` | 已确认并修复 |  | DTS2026072347788 |
| 81 | window_window_manager | ComputeRectByAspectRatio 级联装饰条带 uint32 下溢 | 整数溢出/下溢 | `wmserver/src/window_layout_policy_cascade.cpp` | 已确认并修复 |  | DTS2026072921166 |
| 82 | commonlibrary_rust_ylong_http | verify_pinned_pubkey 用错指针导致证书固定（pinning）被绕过 | 证书校验 | `ylong_http_client/src/util/c_openssl/ssl/stream.rs` | 已确认并修复 |  | DTS2026052810677 |
| 83 | communication_bluetooth_service | ClassicUtils::ConvertStringToUuid 死循环并丢掉最后一个 UUID | 死循环/挂起 | `services/bluetooth/service/src/classic/classic_utils.cpp` | 已确认并修复 |  | DTS2026063023525 |
| 84 | communication_bluetooth_service | ClassicUtils::ConvertHexStringToInt 未捕获 stol 抛出与静默前缀解析 | 坏输入未捕获异常/崩溃 | `services/bluetooth/service/src/classic/classic_utils.cpp` | 已确认并修复 |  | DTS2026063027223 |
| 85 | arkcompiler_runtime_core | SkipULeb128 空/截断输入越界读 + size_t 下溢 | 缓冲区/越界访问 | `static_core/libarkfile/helpers.h` | 非问题 | 辅助函数为 void；畸形 ULEB 对 VM 视为致命；debug ASSERT 即停止点 | DTS2026072517792 |
| 86 | arkui_ace_engine | GetTotalHeightOfItemsInView 对空/全剪枝窗口返回 -mainGap | 计算错误 | `frameworks/core/components_ng/pattern/grid/grid_layout_info.cpp` | 非问题 | n=0 时 sum-mainGap 的公式结果；约两年稳定；滚动/过滚调用图很宽；兄弟 API 空→0 是另一接口 | DTS2026071809266 |
| 87 | communication_dsoftbus | ConvertBytesToHexString 虽要求 HEXIFY_LEN +1 容量却从不写 NUL | 控制流错误 | `core/common/utils/softbus_utils.c` | 非问题 | 内部辅助；所有调用方零初始化 outBuf；终止符由调用方拥有 | DTS2026072017450 |
| 88 | communication_netmanager_base | ForkExecParentProcess 在子进程非零/异常退出后仍返回 SUCCESS | 未检查返回值 | `utils/common_utils/src/netmanager_base_common_utils.cpp` | 非问题 | 只关心创建是否成功；iptables/ip-rule 已存在类失败在批量场景必须可忽略 | DTS2026071725399 |
| 89 | communication_netmanager_base | GetAddrFamily 不像兄弟 IsIPv6LinkLocal 那样剥离 IPv6 %scope | 控制流错误 | `utils/common_utils/src/netmanager_base_common_utils.cpp` | 非问题 | 职责不同 — 族判断按 inet_pton 严格；zone 在下游添加 | DTS2026072720774 |
| 90 | distributeddatamgr_datamgr_service | DeviceMatrix::ConvertIndex 末尾 index-- 导致 uint16 回绕 | 差一 | `services/distributeddataservice/service/matrix/src/device_matrix.cpp` | 非问题 | index-- 适配旧版 dynamicApps_（少一位）；回绕不在现行 ConvertDynamic 路径 | DTS2026082738345 |
| 91 | distributedhardware_device_manager | JsonObject cJSON 后端 64 位整数往返精度损失 | 计算错误 | `json/src/json_object_cjson.cpp` | 非问题 | 生产 use_nlohmann_json=true；cJSON 分支未走；已知限制，延后处理 | DTS2026070663477 |
| 92 | multimedia_av_session | ConvertSessionType 从 JSON 丢掉 SESSION_TYPE_VIDEO_CALL / VOICE_CALL | 控制流错误 | `services/session/server/json_utils.cpp` | 非问题 | 通话会话不走远端投射路径；省略是有意的 | DTS2026070145311 |
| 93 | multimedia_media_foundation | CopyAVMemory 缺少 offset+size≤capacity 守卫 | 缓冲区/越界访问 | `src/buffer/avbuffer/avbuffer.cpp` | 非问题 | 产品侧 src offset 恒为 0；抽象越界不可达 | DTS2026071719364 |
| 94 | multimedia_media_foundation | DataPacker::IsEmpty 谓词取反（有数据时返回 true） | 运算符/谓词错误 | `engine/pipeline/filters/demux/data_packer.cpp` | 非问题 | 函数体已死/不再使用；现行 demux/type-finder 不调用 | DTS2026081129774 |
| 95 | multimedia_media_foundation | Format::Stringify 对已注册 tag 把 bool AnyCast 成 int32 时 SIGSEGV | 未定义行为 | `src/meta/format.cpp` | 非问题 | 主机 -O0 会陷入；产品/UT -O2 不会；维护者配置无法复现崩溃 | DTS2026072938754 |
| 96 | multimedia_media_foundation | OH_AVFormat_GetStringValue / DumpInfo / GetKey 用 strcpy_s 失败关闭而非截断 | 控制流错误 | `src/capi/native_avformat.cpp` | 非问题 | 失败关闭（false / nullptr）是已交付 CAPI；改成 strncpy_s 截断不兼容 | DTS2026081131247 |
