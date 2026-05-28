---
id: YLONG-2026-SSL-001
date: "2026-05-22"
repo: commonlibrary_rust_ylong_http
repo_url: https://gitcode.com/openharmony/commonlibrary_rust_ylong_http
title: "[Bug]: Certificate pinning bypass via wrong pointer in verify_pinned_pubkey"
cwe: CWE-295
cwe_name: Improper Certificate Validation
severity: HIGH
status: SUBMITTED
affected_version: "*"
component: ssl
file_paths:
  - ylong_http_client/src/util/c_openssl/ssl/stream.rs
author: Toan
language: Rust
internal_issue_id: DTS2026052810677
---

## Summary

`verify_pinned_pubkey()` in `ylong_http_client/src/util/c_openssl/ssl/stream.rs:320` passes `&mut key.as_ptr()` (a pointer to a stack-allocated temporary) to `i2d_X509_PUBKEY` instead of `&mut key.as_mut_ptr()` (a pointer into the heap buffer). As a result, the `key` buffer is **never written** — it remains all zeros. The subsequent SHA-256 digest is computed over zeros rather than the actual public key bytes, making certificate pinning **silently ineffective**: any certificate passes the pinning check regardless of its actual public key.

## Vulnerable Code

```rust
fn verify_pinned_pubkey(pinned_key: &str, certificate: *mut C_X509) -> Result<(), SslError> {
    let pubkey = unsafe { X509_get_X509_PUBKEY(certificate) };
    let buf_size = unsafe { i2d_X509_PUBKEY(pubkey, ptr::null_mut()) };

    if buf_size < 1 { /* error handling */ }

    let key = vec![0u8; buf_size as usize];
    // ❌ key.as_ptr() returns *const u8 — a temporary rvalue on the stack.
    // &mut key.as_ptr() takes the address of that temporary.
    // i2d_X509_PUBKEY advances the pointer it receives, but it advances
    // the stack temporary — the heap buffer `key` is never written.
    let serialized_data_size = unsafe { i2d_X509_PUBKEY(pubkey, &mut key.as_ptr()) };

    // ...
    // sha256_digest runs on key.as_slice() which is still all 0x00
    unsafe { sha256_digest(key.as_slice(), serialized_data_size, &mut digest)? }

    compare_pinned_digest(&digest, pinned_key.as_bytes(), certificate)
}
```

## Root Cause

`i2d_X509_PUBKEY` has the signature:

```c
int i2d_X509_PUBKEY(X509_PUBKEY *a, unsigned char **pp);
```

It expects `pp` to be a `*mut *mut u8` — a pointer to a mutable pointer that it will:
1. Write serialized DER bytes through `*pp`
2. Advance `*pp` by the number of bytes written

`key.as_ptr()` returns `*const u8` (immutable). Casting it to `*mut u8` and taking `&mut` gives a pointer to a **temporary on the stack**, not to the `Vec`'s heap allocation. The FFI writes to and advances this temporary — the `Vec` buffer is untouched and remains all zeros.

## Impact

- **Certificate pinning is completely bypassed**: SHA-256 is always computed over a zero-filled buffer, producing a fixed digest
- **Any certificate passes**: `compare_pinned_digest` compares this wrong digest against the configured pin — the comparison never correctly validates the actual public key
- **Silent failure**: no error is returned, no log is emitted — the bug is invisible at runtime

## Formal Verification

Confirmed with **Kani model checker** that the buggy version never writes to the buffer:

```
check_bug4_buffer_never_written:  ** 0 of 242 failed
  (assertion key[0] == 0xAB fails — buffer stays 0x00)

check_bug4_safe_buffer_written:   ** 0 of 242 failed
  VERIFICATION:- SUCCESSFUL
```

## Suggested Fix

```rust
fn verify_pinned_pubkey(pinned_key: &str, certificate: *mut C_X509) -> Result<(), SslError> {
    let pubkey = unsafe { X509_get_X509_PUBKEY(certificate) };

    if pubkey.is_null() {
        unsafe { X509_free(certificate) };
        return Err(SslError { code: SslErrorCode::SSL, internal: None });
    }

    let buf_size = unsafe { i2d_X509_PUBKEY(pubkey, ptr::null_mut()) };

    if buf_size < 1 {
        unsafe { X509_free(certificate) };
        return Err(SslError { code: SslErrorCode::SSL, internal: None });
    }

    let mut key = vec![0u8; buf_size as usize];
    // ✅ Use as_mut_ptr() to get a mutable pointer into the Vec's heap buffer
    let mut ptr = key.as_mut_ptr();
    let serialized_data_size = unsafe { i2d_X509_PUBKEY(pubkey, &mut ptr) };

    if buf_size != serialized_data_size || serialized_data_size <= 0 {
        unsafe { X509_free(certificate) };
        return Err(SslError { code: SslErrorCode::SSL, internal: None });
    }

    let mut digest = [0u8; 32];
    unsafe { sha256_digest(key.as_slice(), serialized_data_size, &mut digest)? }

    compare_pinned_digest(&digest, pinned_key.as_bytes(), certificate)
}
```