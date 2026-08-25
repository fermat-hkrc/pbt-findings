---
id: OH-2026-DSOFTBUS-001
date: "2026-08-24"
repo: communication_dsoftbus
repo_url: https://gitcode.com/openharmony/communication_dsoftbus
title: "[Bug]: P2pV1Processor::ConnectGroup off-by-one guard reads configs[3] on a 3-token group config"
cwe: CWE-125
cwe_name: Out-of-bounds Read
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: core/connection/wifi_direct_cpp/processor/p2p_v1_processor.cpp
file_paths:
  - core/connection/wifi_direct_cpp/processor/p2p_v1_processor.cpp
  - core/connection/wifi_direct_cpp/adapter/p2p_adapter.cpp
  - core/connection/wifi_direct_cpp/utils/wifi_direct_utils.h
author: Toan
internal_issue_id: DTS2026082023118
language: C++
---

## Summary

`P2pV1Processor::ConnectGroup` splits the legacy P2P group-config string
(`ssid\nbssid\npsk\nfreq[\nmode]`, 5 fields, `P2pGroupConfigIndex::MAX == 5`)
and reads `configs[P2P_GROUP_CONFIG_INDEX_FREQ]` — index 3 — after a guard
that only rejects `size < P2P_GROUP_CONFIG_INDEX_FREQ` (size < 3). A 3-token
config passes the guard and indexes one past `size()`:

```cpp
std::vector<std::string> configs = WifiDirectUtils::SplitString(groupConfig, "\n");
if (configs.size() < P2P_GROUP_CONFIG_INDEX_FREQ) {  // FREQ == 3: size==3 passes
    return SOFTBUS_INVALID_PARAM;
}
auto freq = strtol(configs[P2P_GROUP_CONFIG_INDEX_FREQ].c_str(), ...);  // configs[3] OOB
```

The config string comes from the peer: both live callers
(`ProcessConnectRequestAsNone` ~:970, `ProcessConnectResponseWithGoInfoAsNone`
~:1525) feed `msg.GetLegacyP2pGroupConfig()` from a received
`NegotiateMessage` — it is wire data, not a trusted local constant.

The in-tree sibling `P2pAdapter::P2pConnectGroup` (`p2p_adapter.cpp:123-126`)
already uses the correct bound for the same array:

```cpp
CONN_CHECK_AND_RETURN_RET_LOGW(configs.size() >= P2P_GROUP_CONFIG_INDEX_MODE, // MODE == 4
    SOFTBUS_CONN_REMOTE_CONFIG_NULL, CONN_WIFI_DIRECT, "remote group config info is empty");
```

`< INDEX_FREQ` is the correct guard only for reading `[INDEX_FREQ - 1]` (the
PSK); the freq field is the next slot. Not High: well-formed GO configs have
≥4 fields; sibling parsers already reject size < 4. Related unguarded site
same ticket: `InterfaceInfo::SetP2pGroupConfig` (`interface_info.cpp:252`)
indexes `[0..3]` with no size check, but live paths only reach it after
`ConnectGroup` returns.

Confirmed and fixed under `DTS2026082023118`.

## Vulnerable Code

`core/connection/wifi_direct_cpp/processor/p2p_v1_processor.cpp`
(~1712–1718):

```cpp
std::vector<std::string> configs = WifiDirectUtils::SplitString(groupConfig, "\n");
if (configs.size() < P2P_GROUP_CONFIG_INDEX_FREQ) {
    CONN_LOGI(CONN_WIFI_DIRECT, "wifi config spilt size is invaild param");
    return SOFTBUS_INVALID_PARAM;
}
auto freq = strtol(configs[P2P_GROUP_CONFIG_INDEX_FREQ].c_str(), nullptr, DECIMAL_BASE);
```

Index contract (`wifi_direct_types_struct.h:65`):

```cpp
enum P2pGroupConfigIndex { ..., P2P_GROUP_CONFIG_INDEX_FREQ = 3,
                           P2P_GROUP_CONFIG_INDEX_MODE = 4,
                           P2P_GROUP_CONFIG_INDEX_MAX = 5 };
```

## Trigger Conditions

1. Peer (or a buggy GO) sends a 3-line legacy P2P group config on the v1
   negotiate path (`"ssid\nbssid\npsk"`).
2. `ConnectGroup` guard `size < 3` passes (size == 3).
3. `configs[3]` — `std::vector::operator[]` one past `size()` → heap OOB read
   (ASan heap-buffer-overflow; release UB).

Unaffected: well-formed configs (`ssid\nbssid\npsk\n<freq>[\n<mode>]`,
size ≥ 4) and size < 3 (rejected).

## Impact

| Input `groupConfig` | tokens | Expected | Actual |
|---|---|---|---|
| `"ssid\nbssid"` | 2 | reject | `SOFTBUS_INVALID_PARAM` (PASS) |
| `"ssid\nbssid\npsk"` | 3 | reject (sibling: `SOFTBUS_CONN_REMOTE_CONFIG_NULL`) | **`configs[3]` OOB** |
| `"ssid\nbssid\npsk\n2412"` | 4 | proceed | OK (PASS) |

Honest limits: Medium — peer data on the negotiate path; well-formed configs
never take the bad branch; libstdc++ typically fatals or ASan reports, not a
silent wrong result.

## Minimal Counterexample

```text
groupConfig = "ssid\nbssid\npsk"    // size==3 == INDEX_FREQ
ConnectGroup: size < 3? no → configs[3] → OOB
P2pConnectGroup (sibling): size >= 4? no → SOFTBUS_CONN_REMOTE_CONFIG_NULL
```

## How PBT Detected This

Harness `pbt-native/p2p_v1_connect_group_pbt_test.cpp` (source-verbatim
extract of the production guard + index; `vector::at` so OOB is a throw).
Property set around the enum + sibling bound:

- `FewerThanFreqIndexRejected` PASS (size 0–2)
- `ModeOrMoreIsSafe` PASS (size ≥ 4; matches sibling)
- `SiblingNeverOob` PASS
- `ThreeTokensMustReject` **FAIL** — size 3 reaches `configs[3]`

Observed 5 PASS / 2 FAIL; witness `"ssid\nbssid\npsk"` → `Parse::Oob`, not
`Rejected`.

## Suggested Fix

Use the sibling bound (one line):

```diff
-    if (configs.size() < P2P_GROUP_CONFIG_INDEX_FREQ) {
+    if (configs.size() < P2P_GROUP_CONFIG_INDEX_MODE) {
         CONN_LOGI(CONN_WIFI_DIRECT, "wifi config spilt size is invaild param");
         return SOFTBUS_INVALID_PARAM;
     }
```

| After fix | Result |
|---|---|
| size 3 | reject (`SOFTBUS_INVALID_PARAM`) — `ThreeTokensMustReject` PASS |
| size ≥ 4 | unchanged |
| size < 3 | still rejected |

## References

- Bug: `p2p_v1_processor.cpp` (`P2pV1Processor::ConnectGroup`)
- Sibling (correct): `p2p_adapter.cpp:123-126` (`P2pAdapter::P2pConnectGroup`)
- Related site: `interface_info.cpp:252` (`SetP2pGroupConfig`)
- Same class (fixed): OH-2026-WM-001 `mirror_pair_walk_odd_count_oob` /
  DTS2026072717921
- Harness: `pbt-native/p2p_v1_connect_group_pbt_test.cpp`
- Internal issue: `DTS2026082023118`
