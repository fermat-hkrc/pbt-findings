---
id: OH-2026-STORAGE-001
date: "2026-07-23"
repo: filemanagement_storage_service
repo_url: https://gitcode.com/openharmony/filemanagement_storage_service
title: "[Bug]: SA providers skip CheckUserIdRange on user-scoped IPC"
cwe: CWE-20
cwe_name: Improper Input Validation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/storage_daemon/ipc/src/storage_daemon_provider.cpp
file_paths:
  - services/storage_daemon/ipc/src/storage_daemon_provider.cpp
  - services/storage_manager/ipc/src/storage_manager_provider.cpp
author: Toan
internal_issue_id: DTS2026072335866
language: C++
---

## Summary

Shared SA gate `CheckUserIdRange` (`userId ∈ [START_USER_ID=0, MAX_USER_ID=10738]`,
fail with **`E_USERID_RANGE`**) is missing on **10** user-scoped provider
entries: **7** Daemon + **3** Manager. Out-of-range `userId` is accepted and
forwarded into lifecycle / crypto / stats / notify work. Same-file siblings
already gate.

Class report (one root cause, many sites). Lead example: Daemon
`UpdateUserAuth` (crypto). Confirmed and fixed by developers
(`DTS2026072335866`).

## Vulnerable Code

Gates exist but are not called at listed sites:

- Daemon: `StorageDaemonProvider::CheckUserIdRange` (~99)
- Manager: `StorageManagerProvider::CheckUserIdRange` (~143)

Missing-site pattern (every listed handler):

```cpp
// no CheckUserIdRange — OOR userId forwarded into body
// existing body…
```

Sibling oracle (already correct):

```cpp
int32_t err = CheckUserIdRange(static_cast<int32_t>(userId));
if (err != E_OK) {
    LOGE("… userId out of range");
    return err;  // E_USERID_RANGE
}
// existing body…
```

### Daemon — missing gate (7)

`services/storage_daemon/ipc/src/storage_daemon_provider.cpp`

| ID | Function | Notes |
|----|----------|-------|
| **A.1** | **`UpdateUserAuth`** | **Lead** — crypto; Manager has gate |
| A.2 | `UnlockUserScreen` | `LockUserScreen` has gate |
| A.3 | `GetFileEncryptStatus` | Manager has gate |
| A.4 | `SetDirEncryptionPolicy` | Dir crypto policy |
| A.5 | `CompleteAddUser` | Lifecycle; Manager has gate |
| A.6 | `UpdateUserPublicDirPolicy` | Public-dir policy |
| A.7 | `StartUser` | Lower urgency — `UserManager::StartUser` re-checks |

Already gated (examples): `StopUser`, `PrepareUserDirs`, `DestroyUserDirs`,
`UpdateUseAuthWithRecoveryKey`, `ActiveUserKey`, `LockUserScreen`, …

### Manager — missing gate (3)

`services/storage_manager/ipc/src/storage_manager_provider.cpp`

| ID | Function | Notes |
|----|----------|-------|
| B.1 | `GetUserStorageStatsByType` | Sibling gated overload exists |
| B.2 | `NotifyCreateBundleDataDirWithEl` | Permission only |
| B.3 | `IsOsAccountExists` | Then `OsAccountManager` |

Already gated (examples): Manager `UpdateUserAuth`, `CompleteAddUser`,
`SetDirEncryptionPolicy`, `UnlockUserScreen`, `GetFileEncryptStatus`, …

Root cause: incomplete application of the shared SA range gate across
user-scoped IPC entries. Not a cross-user ACL (in-range `100` naming `105` is
out of scope for this gate).

## Trigger Conditions

1. Client invokes any listed SA entry with `userId` outside `[0, 10738]`
   (e.g. `-1`, `10739`, huge via IPC).
2. Provider skips `CheckUserIdRange`.
3. OOR id is forwarded into daemon/manager work instead of `E_USERID_RANGE`.

Direct Daemon IPC is worst case: client often has no range check either.
Manager-only gating is not enough — Daemon must enforce even when Manager
already checked (do not trust peer IPC).

## Impact

- OOR ids reach lifecycle / crypto / stats / notify without uniform SA reject.
- Crypto/lifecycle rows (e.g. `UpdateUserAuth`, `CompleteAddUser`) are higher
  care within Medium.
- Medium class: improper validation at SA boundary; not proven privilege
  escalation to another user’s data via this gate alone.
- Out of class: ExtBundle stats (`TOP_USER_ID`) already rejects OOR;
  `SystemMountManager::MountCloudByUserId` is not an SA provider entry.

## Minimal Counterexample

| `userId` | Expected | Actual without gate |
|----------|----------|---------------------|
| `< 0` / huge via IPC | `E_USERID_RANGE` | forwarded |
| `10739` | `E_USERID_RANGE` | forwarded |
| `0…10738` | proceed | proceed |

Lead site: Daemon `UpdateUserAuth` with OOR `userId` proceeds into crypto path.

## How PBT Detected This

Formula residuals in `pbt-native/` encode “no gate” (behavioral model, not
linked SUT); source audit of provider files is authoritative:

| Check | Result |
|-------|--------|
| Daemon §A missing (7) | Yes |
| Manager §B missing (3) | Yes |
| Class residuals `*OutOfRangeMustReject*` while open | **FAIL** |

```bash
cmake -B pbt-native/build -S pbt-native
cmake --build pbt-native/build -j --target \
  batch1_residuals_pbt_test batch4_residuals_pbt_test \
  batch6_residuals_pbt_test batch7_residuals_pbt_test \
  batch12_residuals_pbt_test batch14_residuals_pbt_test

for t in batch1 batch4 batch6 batch7 batch12 batch14; do
  ./pbt-native/build/${t}_residuals_pbt_test --gtest_filter='*OutOfRangeMustReject*'
done
```

## Suggested Fix

At every missing site (Daemon §A + Manager §B):

```cpp
int32_t err = CheckUserIdRange(static_cast<int32_t>(userId));
if (err != E_OK) {
    LOGE("… userId out of range");
    return err;  // E_USERID_RANGE
}
// existing body…
```

Match nearest sibling (e.g. Daemon `UpdateUseAuthWithRecoveryKey`, Manager
`UpdateUserAuth`). One PR (or Daemon/Manager commits); UT per site →
`E_USERID_RANGE`. Optional: ExtBundle switch to `CheckUserIdRange` +
`E_USERID_RANGE` for consistency.

## References

- Bug class: Daemon `storage_daemon_provider.cpp` (7 sites); Manager
  `storage_manager_provider.cpp` (3 sites)
- Gate: `CheckUserIdRange` / `E_USERID_RANGE` (`START_USER_ID=0`,
  `MAX_USER_ID=10738`)
- Lead: Daemon `UpdateUserAuth`; residual filters
  `B1_01_UpdateUserAuthUserIdPBT`, `B4_*`, `B6_*`, `B7_*`, `B12_*`
- PBT: `batch{1,4,6,7,12,14}_residuals_pbt_test` (`*OutOfRangeMustReject*`)
- Internal issue: `DTS2026072335866`
