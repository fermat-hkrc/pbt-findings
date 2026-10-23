---
id: OH-2026-ABILITY-008
date: "2026-08-22"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: GetAppMemorySize / IsRamConstrainedDevice pass a null buffer to GetParameter"
cwe: CWE-476
cwe_name: NULL Pointer Dereference
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/abilitymgr/src/ability_manager_service.cpp
file_paths:
  - services/abilitymgr/src/ability_manager_service.cpp
author: Toan
internal_issue_id: DTS2026082252519
language: C++
---

## Summary

`AbilityManagerService::GetAppMemorySize` (~10253) and
`IsRamConstrainedDevice` (~10282) both call the C system-parameter API as:

```cpp
char *valueGet = nullptr;
unsigned int len = 128;
int ret = GetParameter(key, def, valueGet, len);   // value == NULL
```

`value` is a **caller-owned output buffer** (documented in `startup_init`
`parameter.h`); `parameter.c` returns `EC_INVALID (-9)` immediately when
`value == NULL` and **never reads the key**. Both product flags are dead:

- `const.product.islowram` never read → `IsRamConstrainedDevice()` always `false`
- `const.product.arkheaplimit` never read → `GetAppMemorySize()` always default `512`

One copy-paste, two sites; the `if (valueGet == nullptr)` fallback sits in
an arm unreachable because `-9` already failed the return check. Low-RAM
SKUs never see `true`; the product Ark heap limit is never applied.
No crash — null is rejected before any store.

Confirmed and fixed under `DTS2026082252519` (internal DTS system): both
sites pass a `char valueGet[128] = {0}` stack buffer per the documented
contract.

## Vulnerable Code

```cpp
char *valueGet = nullptr;                      // never allocated
unsigned int len = 128;                        // written as if a buffer existed
int ret = GetParameter(key, def, valueGet, len);
if ((ret != GET_PARAMETER_OTHER) && (ret != GET_PARAMETER_INCORRECT)) { ... }
```

## Trigger Conditions

Always — every JS/ETS/CJ `isRamConstrainedDevice` / `getAppMemorySize` call
hits the dead flags.

## Impact

Medium — two public APIs silently ignore product parameters.

## Minimal Counterexample

```cpp
svc.IsRamConstrainedDevice();  // GetParameter(..., NULL, 128) → -9 → false
svc.GetAppMemorySize();        // same → 512 — even with
                               // const.product.islowram=1 / arkheaplimit=256m
```

## How PBT Detected This

`pbt-native/getparameter_null_buffer_pbt_test.cpp` (SUT extracted from the
real TU). Reference oracle: the documented `GetParameter` contract — the
3rd argument (caller-owned output buffer) must not be null. Both sites FAIL.

## Suggested Fix

As landed: stack buffer per the in-repo sibling pattern
(`app_utils.cpp:638`, `watchdog.cpp:197`):

```diff
-    char *valueGet = nullptr;
+    char valueGet[128] = {0};
     unsigned int len = 128;
-    int ret = GetParameter(key, def, valueGet, len);
+    int ret = GetParameter(key, def, valueGet, sizeof(valueGet));
```

## References

- Sites: `ability_manager_service.cpp:10253` / `:10282`
- Contract: `startup_init` `parameter.h` / `parameter.c` (`EC_INVALID` on null `value`)
- Sibling callers: `app_utils.cpp:638`, `watchdog.cpp:197`, `WaitBootAnimationStart`
- Local report: `~/testing/ability_ability_runtime/pbt-out/bug_reports/fixed/getparameter_null_buffer.md`
- Internal issue: `DTS2026082252519` (confirmed and fixed in the internal DTS system)
