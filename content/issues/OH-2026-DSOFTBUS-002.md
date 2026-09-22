---
id: OH-2026-DSOFTBUS-002
date: "2026-08-31"
repo: communication_dsoftbus
repo_url: https://gitcode.com/openharmony/communication_dsoftbus
title: "[Bug]: ConvertBtMacToBinary ignores strtoul leftover and uint8 overflow"
cwe: CWE-20
cwe_name: Improper Input Validation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: core/common/utils/softbus_utils.c
file_paths:
  - core/common/utils/softbus_utils.c
author: Toan
internal_issue_id: DTS2026083116823
language: C
---

## Summary

`ConvertBtMacToBinary` parses each colon-separated MAC token with
`strtoul(..., &endptr, 16)` and **never reads `endptr`**, then stores the
result into `uint8_t` with no range check. Callers treat `SOFTBUS_OK` as “here
is a usable `BT_ADDR`.”

`strtoul` only means “read a number **from the start**.” It does **not** mean
“this token **is** one hex octet”:

| Token | `strtoul` result | Leftover |
|-------|------------------|----------|
| `"0g"` | `0` | `g` |
| `"Z0"` | `0` | whole token (`endptr == token`) |
| `"100"` | `0x100` | none — then **truncated** to `0` in `uint8_t` |

The sibling encoder `ConvertBtMacToStr` only emits `%02x:%02x:…`. The same
repo already rejects leftover in `trans_split_serviceid.c`. Token **contents**
are the missing half of the contract.

Confirmed and fixed under `DTS2026083116823`.

## Vulnerable Code

`core/common/utils/softbus_utils.c` — `ConvertBtMacToBinary` (~337–369):

```c
char *endptr = NULL;
for (int i = 0; i < BT_ADDR_LEN; i++) {
    if (token == NULL) { return SOFTBUS_ERR; }          // too few fields only
    binMac[i] = strtoul(token, &endptr, BT_ADDR_BASE);  // endptr unused; truncates
    token = strtok_r(NULL, BT_ADDR_DELIMITER, &nextTokenPtr);
}
return SOFTBUS_OK;   // extra 7th field ignored
```

Wrapper `ConvertBtMacToU64` (~431) only calls this with `BT_MAC_LEN` — no
second patch needed once the parser rejects malformed tokens.

## Trigger Conditions

A colon-separated string of length ≥ 18 with six `strtok` fields where any
field is:

1. non-hex / leftover (`"Z0"`, `"0g"`), or
2. out of octet range (`"100"`),

and not exactly the string `"00:00:00:00:00:00"` (that path is a separate
`strncmp` reject).

Live callers include BLE/BR connect and heartbeat utils
(`ConnGattClientConnect`, `softbus_conn_ble_server.c`,
`softbus_conn_br_connection.c`, `lnn_heartbeat_utils.c`).

## Impact

| Input | Actual | Expected |
|-------|--------|----------|
| `"00:00:Z0:00:01:00"` | `SOFTBUS_OK`, `Z0` → `0` | `≠ OK` |
| `"00:00:00:00:00:0g"` | `SOFTBUS_OK`, **all-zero** (bypasses zero-MAC reject) | `≠ OK` |
| `"100:00:00:00:00:01"` | `SOFTBUS_OK`, `0x100` truncated to `0` | `≠ OK` |
| `"aa:bb:cc:dd:ee:ff"` | `SOFTBUS_OK` | `SOFTBUS_OK` (unchanged) |

Zero-MAC bypass: reject is `strncmp(strMac, "00:00:00:00:00:00", BT_MAC_LEN)`.
`"…:0g"` is **not** that string, so it passes; `strtoul("0g")` then writes six
zeros and returns `OK`. BLE/BR treat `OK` as a usable `BT_ADDR`.

**Medium**, not High: well-formed `ConvertBtMacToStr` output is unaffected; no
crash/UB. Typo / peer / stored malformed MACs are accepted instead of
`SOFTBUS_INVALID_PARAM` / `SOFTBUS_ERR`.

## Minimal Counterexample

```text
ConvertBtMacToBinary("00:00:Z0:00:01:00", …)
// production: SOFTBUS_OK, binMac has 0 at the bad slot
// expected:   ≠ SOFTBUS_OK
```

## How PBT Detected This

Harness: `pbt-native/convert_bt_mac_to_binary_pbt_test.cpp` (real
`softbus_utils.c`). Contract: each field is fully consumed hex in `0…255`
(encoder shape + in-tree `endptr` check). Pack/round-trip vs
`ConvertBtMacToStr` stays PASS.

| Property | Result |
|----------|--------|
| `MalformedRejected` | **FAIL** |
| `regression_nonhex_token` (`"00:00:Z0:00:01:00"`) | **FAIL** |
| Pack / round-trip vs `ConvertBtMacToStr` | PASS |

## Suggested Fix

Use the `endptr` already computed. Reject leftover and `val > 0xFF`. Optional:
reject a 7th `strtok` field.

```diff
-        binMac[i] = strtoul(token, &endptr, BT_ADDR_BASE);
+        unsigned long val = strtoul(token, &endptr, BT_ADDR_BASE);
+        if (endptr == token || *endptr != '\0' || val > 0xFF) {
+            SoftBusFree(tmpMac);
+            return SOFTBUS_ERR;
+        }
+        binMac[i] = (uint8_t)val;
         token = strtok_r(NULL, BT_ADDR_DELIMITER, &nextTokenPtr);
     }
+    if (token != NULL) {
+        SoftBusFree(tmpMac);
+        return SOFTBUS_ERR;
+    }
```

Same check as `trans_split_serviceid.c:45`, plus the octet cap. After fix:
`"Z0"` / `"0g"` / `"100"` → `≠ OK`; well-formed and round-trip unchanged.

## References

- Bug: `core/common/utils/softbus_utils.c` — `ConvertBtMacToBinary` /
  `ConvertBtMacToU64`
- Sibling leftover check: `trans_split_serviceid.c`
- Sibling encoder: `ConvertBtMacToStr`
- Harness: `pbt-native/convert_bt_mac_to_binary_pbt_test.cpp`
- Cloned report: `pbt-out/bug_reports/fixed/convert_bt_mac_to_binary_accepts_nonhex.md`
- Related dsoftbus fixed: [OH-2026-DSOFTBUS-001](OH-2026-DSOFTBUS-001.md)
- Internal issue: `DTS2026083116823`
