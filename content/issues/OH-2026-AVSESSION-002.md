---
id: OH-2026-AVSESSION-002
date: "2026-08-03"
repo: multimedia_av_session
repo_url: https://gitcode.com/openharmony/multimedia_av_session
title: "[Bug]: TransformStrToInt64 throws on overflow; signed strings rejected by scan from 0"
cwe: CWE-248
cwe_name: Uncaught Exception
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/session/server/softbus/softbus_session_utils.h
file_paths:
  - services/session/server/softbus/softbus_session_utils.h
  - services/session/server/migrate/migrate_avsession_server.cpp
author: Toan
internal_issue_id: DTS2026080300753
language: C++
---

## Summary

`SoftbusSessionUtils::TransformStrToInt64` had two defects:

1. Digit-only overflow called `std::stoll` with no catch — `"10000000000000000000"`
   (`10^19`) throws `std::out_of_range`. Caller `SetSeekTime` on remote SEEK has
   no try/catch.
2. It skipped a leading `+`/`-` (`pos = 1`) then scanned from index `0`, so
   every signed string (`"-2"`) was rejected as `-1` before `stoll`. Packer
   `TransformInt64ToStr` is `std::to_string` (emits `"-2"`).

Confirmed and fixed under `DTS2026080300753` (upstream `9ae4dc94`,
`fix security warning 0729`).

## Vulnerable Code

`services/session/server/softbus/softbus_session_utils.h` (~279):

```cpp
if (str[0] == '-' || str[0] == '+') { pos = 1; }
for (size_t i = 0; i < str.size(); ++i) {   // not pos
    if (str[i] < '0' || str[i] > '9') { return -1; }
}
return std::stoll(str);                     // throws on overflow
```

Caller `migrate_avsession_server.cpp` (`SYNC_MEDIASESSION_CALLBACK_ON_SEEK`):

```cpp
cmd.SetSeekTime(SoftbusSessionUtils::TransformStrToInt64(command));
```

## Trigger Conditions

1. Remote migrate SEEK command is a too-large decimal → uncaught `out_of_range`.
2. Remote SEEK command is signed (`"-2"`) → `-1` (treated as invalid seek), not
   the packed value.

## Impact

- Overflow: unwind in the migrate server (no try at the caller). Medium, not a
  guaranteed process kill if the runtime aborts on uncaught exception in that
  thread.
- Sign: round-trip with `TransformInt64ToStr` broken for negatives.

Sibling `AVCastControllerProxy::SetDisplaySurface` already used
`strtoll` + `ERANGE` (no throw).

## Minimal Counterexample

```
TransformStrToInt64("10000000000000000000")  // throws; expected -1
TransformStrToInt64("-2")                    // -1; expected -2
```

## How PBT Detected This

`transform_str_to_int64_pbt_test` (header-only SUT):

| Case | Before | After `9ae4dc94` |
|------|--------|------------------|
| `regression_overflow_1e19` | throw | `-1` |
| `regression_negative_two` | `-1` | `-2` |

## Suggested Fix

Shipped in `9ae4dc94` — `i = pos`; `strtoll` + `ERANGE` → `-1`:

```cpp
for (size_t i = pos; i < str.size(); ++i) {
    if (str[i] < '0' || str[i] > '9') {
        return -1;
    }
}
errno = 0;
char* endPtr = nullptr;
long long result = std::strtoll(str.c_str(), &endPtr, 10);
if (errno == ERANGE || endPtr == str.c_str()) {
    return -1;
}
return static_cast<int64_t>(result);
```

## References

- Bug: `softbus_session_utils.h` — `TransformStrToInt64`
- Caller: `migrate_avsession_server.cpp` (`ON_SEEK` / `SetSeekTime`)
- Sibling: `avcast_controller_proxy.cpp` `SetDisplaySurface` (`strtoll` + `ERANGE`)
- Packer: `TransformInt64ToStr` (`std::to_string`)
- Upstream: `9ae4dc94` (`fix security warning 0729`)
- Internal issue: `DTS2026080300753`
