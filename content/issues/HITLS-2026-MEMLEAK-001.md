---
id: HITLS-2026-MEMLEAK-001
date: "2026-03-30"
repo: openHiTLS
repo_url: https://gitcode.com/openHiTLS/openhitls
title: "[Bug]: Memory leak in ConstructUserPsk when identity allocation fails"
cwe: CWE-401
cwe_name: Missing Release of Memory after Effective Lifetime
severity: MEDIUM
status: CONFIRMED_FIXED
issue_url: https://gitcode.com/openHiTLS/openhitls/issues/145
affected_version: "*"
component: handshake
stars: 1102
file_paths:
  - tls/handshake/send/src/send_client_hello.c
author: Toan
language: C
---

## Summary

`ConstructUserPsk` in `tls/handshake/send/src/send_client_hello.c` allocates `userPsk->pskSession` via `HITLS_SESS_Dup(sessoin)` at line 388. If the subsequent `identity` allocation fails at line 389, the function frees `userPsk` at line 392 but does not free `userPsk->pskSession`, leaking the duplicated session object.

## Vulnerable Code

**`tls/handshake/send/src/send_client_hello.c:375-399`**
```c
static UserPskList *ConstructUserPsk(HITLS_Session *sessoin, const uint8_t *identity, uint32_t identityLen,
    uint8_t curIndex)
{
    if (identityLen > HS_PSK_IDENTITY_MAX_LEN || sessoin == NULL) {
        BSL_LOG_BINLOG_FIXLEN(BINLOG_ID17114, BSL_LOG_LEVEL_ERR, BSL_LOG_BINLOG_TYPE_RUN,
            "identityLen err or sessoin NULL", 0, 0, 0, 0);
        return NULL;
    }
    UserPskList *userPsk = BSL_SAL_Calloc(1, sizeof(UserPskList));
    if (userPsk == NULL) {
        BSL_LOG_BINLOG_FIXLEN(BINLOG_ID17115, BSL_LOG_LEVEL_ERR, BSL_LOG_BINLOG_TYPE_RUN, "Calloc fail", 0, 0, 0, 0);
        return NULL;
    }
    userPsk->pskSession = HITLS_SESS_Dup(sessoin);  // ← allocation
    userPsk->identity = BSL_SAL_Calloc(1, identityLen);
    if (userPsk->identity == NULL) {
        BSL_LOG_BINLOG_FIXLEN(BINLOG_ID17116, BSL_LOG_LEVEL_ERR, BSL_LOG_BINLOG_TYPE_RUN, "Calloc fail", 0, 0, 0, 0);
        BSL_SAL_FREE(userPsk);  // ← leak: pskSession not freed
        return NULL;
    }
    (void)memcpy_s(userPsk->identity, identityLen, identity, identityLen);
    userPsk->identityLen = identityLen;
    userPsk->num = curIndex;
    return userPsk;
}
```

## Impact

- **Memory leak**: every failed `identity` allocation leaks one duplicated session object
- **Trigger condition**: low-memory scenarios or large `identityLen` values that cause allocation failure
- **Accumulation**: repeated handshake attempts under memory pressure compound the leak

## Suggested Fix

Free `userPsk->pskSession` before freeing `userPsk` on the error path:

```c
if (userPsk->identity == NULL) {
    BSL_LOG_BINLOG_FIXLEN(BINLOG_ID17116, BSL_LOG_LEVEL_ERR, BSL_LOG_BINLOG_TYPE_RUN, "Calloc fail", 0, 0, 0, 0);
    HITLS_SESS_Free(userPsk->pskSession);  // ← add this
    BSL_SAL_FREE(userPsk);
    return NULL;
}
```

Alternatively, check if `HITLS_SESS_Dup` can return `NULL` and handle that case before allocating `identity`.
