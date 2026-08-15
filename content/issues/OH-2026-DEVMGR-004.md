---
id: OH-2026-DEVMGR-004
date: "2026-07-30"
repo: distributedhardware_device_manager
repo_url: https://gitcode.com/openharmony/distributedhardware_device_manager
title: "[Bug]: GenerateRandNum invalid uniform_int_distribution(1, 0xFFFFFFFF) → SIGSEGV"
cwe: CWE-190
cwe_name: Integer Overflow or Wraparound
severity: HIGH
status: CONFIRMED_FIXED
affected_version: "master"
component: services/implementation/src/device_manager_service_impl.cpp
file_paths:
  - services/implementation/src/device_manager_service_impl.cpp
  - 3rd/services/implementation/src/device_manager_service_impl_3rd.cpp
  - utils/src/dm_random.cpp
author: Toan
internal_issue_id: DTS2026073020799
language: C++
---

## Summary

`GenerateRandNum` builds `std::uniform_int_distribution<>(1, 0xFFFFFFFF)`.
Default element type is `int`; `0xFFFFFFFF` as `int` is **`-1`** → range
`(a=1, b=-1)` with **`a > b`**. C++ requires `a ≤ b`; sampling is UB. On
libstdc++ (OHOS Linux) the first sample is a **deterministic SIGSEGV**.

Live bind / logical-session create path when `version_ == ""` or remote is
newer than `DM_VERSION_5_0_OLD_MAX`. Old peers with non-empty version ≤
old-max skip the call. Confirmed and fixed by developers
(`DTS2026073020799`).

## Vulnerable Code

`services/implementation/src/device_manager_service_impl.cpp` —
`GenerateRandNum` (~527); twin in `device_manager_service_impl_3rd.cpp` (~282):

```cpp
std::uniform_int_distribution<> rand_dis(1, 0xFFFFFFFF);  // defaults to int
uint32_t randomNumber = static_cast<uint32_t>(rand_dis(gen));
```

Caller: `BindTargetImpl` (~1907) on new-protocol logical session.

Correct in-tree pattern (`utils/src/dm_random.cpp` — `GenRandInt` /
`GenRandLongLong` / `GenRandUnLongLong`): explicit element type matching the
intended range; callers keep `a ≤ b`.

| Rule | In-tree correct (`dm_random`) | This bug |
|------|-------------------------------|----------|
| Element type | Explicit `<int>` / `<long long>` / `<unsigned long long>` | Default `<>` → `int` |
| Bounds fit type | `1..9`, `1..INT16_MAX`, … | `0xFFFFFFFF` as `int` → **`-1`** |
| `a ≤ b` | yes | **`1 > -1`** → sample SIGSEGV |

Root cause: type/literal mismatch — full u32 intent expressed with default
`int` distribution.

## Trigger Conditions

1. New-protocol bind: `version_ == ""` **or**
   `CompareVersion(version_, DM_VERSION_5_0_OLD_MAX)` (remote newer).
2. `BindTargetImpl` calls `GenerateRandNum`.
3. First sample of invalid distribution → SIGSEGV on libstdc++.

Unaffected: non-empty `version_ ≤ DM_VERSION_5_0_OLD_MAX` (else branch; call
not taken).

## Impact

| Path | Result |
|------|--------|
| New-protocol bind → `GenerateRandNum` | **device_manager SA SIGSEGV**; bind/logical session fails until process restart |
| Old-protocol peer (version ≤ old max) | call not taken |
| `device_manager_service_impl_3rd` | same bad line at its bind sites |

Honest limits:
- Crash proven on **libstdc++** (typical OHOS Linux). Other libcs: `a > b` is
  still UB (signal may differ).
- Field rate = how often **new-protocol** logical-session create runs — not
  every DM call.
- High = **reachable deterministic crash** on that path, not universal bind
  failure.
- Out of scope: bit packing `(sessionId << 16) | randomNumber` aliasing
  (separate Medium class).

## Minimal Counterexample

| Construction | Expected | Actual (libstdc++) |
|--------------|----------|---------------------|
| `uniform_int_distribution<>(1, 0xFFFFFFFF)` then sample | valid u32 / no crash | **`a=1, b=-1` → SIGSEGV** |
| `0xFFFFFFFF` as `int` | (polarity) | **`-1`** |
| `uniform_int_distribution<uint32_t>(1u, 0xFFFFFFFFu)` | samples in `[1, 0xFFFFFFFFu]` | OK |

```cpp
std::uniform_int_distribution<> rand_dis(1, 0xFFFFFFFF);
(void)rand_dis(std::mt19937{1});  // SIGSEGV on libstdc++
```

## How PBT Detected This

`pbt-native/generate_rand_num_pbt_test`:

| Test | Result |
|------|--------|
| `Death_ProductionDistributionSampleSegfaults` | **PASS** (dies as expected — documents crash) |
| `Witness_HexLiteralBecomesNegativeInt` | **PASS** |
| `Uint32DistributionSamplesInRange` | **PASS** (fix shape) |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target generate_rand_num_pbt_test
./pbt-native/build/generate_rand_num_pbt_test --gtest_filter='*Death*:*Witness_Hex*:*Uint32*'
```

## Suggested Fix

Match correct in-tree pattern (`GenRandUnLongLong` shape, narrowed to u32) on
**both** `GenerateRandNum` copies:

```cpp
std::uniform_int_distribution<uint32_t> rand_dis(1u, 0xFFFFFFFFu);
uint32_t randomNumber = rand_dis(gen);
```

Do **not** keep default `<>` with a 32-bit hex upper bound. After fix: convert
death test to in-range assert; `Uint32*` stays PASS.

## References

- Bug: `device_manager_service_impl.cpp` (`GenerateRandNum`); twin
  `device_manager_service_impl_3rd.cpp`
- Caller: `BindTargetImpl` (new-protocol branch)
- Correct sibling: `utils/src/dm_random.cpp` (`GenRandInt` /
  `GenRandUnLongLong`)
- Related class (separate): signed misuse of full-width hex bound /
  `NumToStr` INT_MIN (`DTS2026062916398`)
- PBT: `pbt-native/generate_rand_num_pbt_test.cpp`
- Internal issue: `DTS2026073020799`
