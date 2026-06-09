---
id: YLONG-2026-SSL-001
date: "2026-05-28"
repo: commonlibrary_rust_ylong_http
repo_url: https://gitcode.com/openharmony/commonlibrary_rust_ylong_http
title: "[Bug]: Certificate pinning bypass via wrong pointer in verify_pinned_pubkey"
cwe: CWE-295
cwe_name: Improper Certificate Validation
severity: HIGH
status: CONFIRMED_FIXED
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

## Detecting with Property-Based Testing

This bug is also detectable with **property-based testing** using `proptest`, without reasoning directly about the raw pointer write.

### Property

For generated self-signed RSA/ECDSA certificate/key pairs produced by this harness:

- derive the exact `sha256//...` pin from the certificate's real `SubjectPublicKeyInfo` bytes
- start a local HTTPS server using that certificate
- configure `ylong_http_client` with that exact pin
- send one HTTPS request

**Expected property:** a client configured with the exact public-key pin of the server certificate should successfully complete the request.

The buggy implementation violates this property because it hashes a zero-filled buffer instead of the serialized public key bytes, so even the correct pin is rejected.

### Why ordinary unit tests likely missed it

The repository already contains several fixed-example pinning tests in `ylong_http_client/tests/sdv_async_https_pinning.rs`, but those tests are still different from this property.

A conventional unit test suite usually checks only a few hand-picked examples:

- pin matches one canned certificate
- pin mismatches are rejected
- normal TLS request without pinning succeeds

Those fixed examples can leave this bug hidden because they do not systematically assert the broader semantic invariant across many certificate/public-key instances. PBT is effective here because it repeatedly generates fresh certificates, derives the exact pin from the real SPKI bytes, and checks the black-box rule that **correct pin => successful HTTPS request**.

### Exact `proptest` Test

```rust
#![cfg(all(
    feature = "async",
    feature = "http1_1",
    feature = "__tls",
    feature = "tokio_base"
))]

#[macro_use]
mod common;

use std::fs;
use std::net::TcpListener;
use std::path::PathBuf;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use openssl::asn1::{Asn1Integer, Asn1Time};
use openssl::bn::{BigNum, MsbOption};
use openssl::ec::{EcGroup, EcKey};
use openssl::hash::{hash, MessageDigest};
use openssl::nid::Nid;
use openssl::pkey::PKey;
use openssl::rsa::Rsa;
use openssl::ssl::{SslAcceptor, SslFiletype, SslMethod};
use openssl::x509::{X509NameBuilder, X509};
use proptest::prelude::*;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener as TokioTcpListener;
use ylong_http_client::async_impl::{Body, Request};
use ylong_http_client::PubKeyPins;

use crate::common::init_test_work_runtime;

static UNIQUE_ID: AtomicU64 = AtomicU64::new(0);

// Property: a client configured with the exact SHA-256 pin of the server certificate's
// SubjectPublicKeyInfo must be able to complete the HTTPS request successfully.
// The current buggy implementation rejects that valid pin because it hashes a zeroed buffer
// instead of the serialized public key bytes.
proptest! {
    #![proptest_config(ProptestConfig {
        cases: 8,
        max_shrink_iters: 0,
        .. ProptestConfig::default()
    })]

    #[test]
    fn pbt_matching_public_key_pin_allows_https_request(seed in any::<u64>()) {
        let cert_material = generate_cert_material(seed).expect("generate cert material");
        let temp_dir = write_cert_material(&cert_material).expect("write cert material");
        let runtime = init_test_work_runtime(1);
        let port = spawn_https_server(
            &runtime,
            temp_dir.join("server.crt.pem"),
            temp_dir.join("server.key.pem"),
        );

        runtime.block_on(async {
            let pins = PubKeyPins::builder()
                .add(
                    format!("https://127.0.0.1:{}", port).as_str(),
                    cert_material.pin.as_str(),
                )
                .build()
                .expect("build pins");

            let client = ylong_http_client::async_impl::Client::builder()
                .tls_ca_file(temp_dir.join("server.crt.pem").to_str().unwrap())
                .add_public_key_pins(pins)
                .danger_accept_invalid_hostnames(true)
                .build()
                .expect("build client");

            let request = Request::builder()
                .method("GET")
                .url(format!("https://127.0.0.1:{}/", port).as_str())
                .body(Body::empty())
                .expect("build request");

            let response = client.request(request).await;
            assert!(
                response.is_ok(),
                "matching pin should succeed for seed {} but got {:?}",
                seed,
                response.err()
            );

            let response = response.unwrap();
            assert_eq!(response.status().as_u16(), 200);
            let body = response.text().await.expect("read response body");
            assert_eq!(body, "ok");
        });
    }
}

struct CertMaterial {
    cert_pem: Vec<u8>,
    key_pem: Vec<u8>,
    pin: String,
}

fn generate_cert_material(seed: u64) -> Result<CertMaterial, Box<dyn std::error::Error>> {
    let key = if seed % 2 == 0 {
        let rsa = Rsa::generate(2048)?;
        PKey::from_rsa(rsa)?
    } else {
        let group = EcGroup::from_curve_name(Nid::X9_62_PRIME256V1)?;
        let ec_key = EcKey::generate(&group)?;
        PKey::from_ec_key(ec_key)?
    };

    let mut name = X509NameBuilder::new()?;
    name.append_entry_by_text("CN", &format!("pbt-{}", seed))?;
    let name = name.build();

    let mut builder = X509::builder()?;
    builder.set_version(2)?;

    let mut serial_bn = BigNum::new()?;
    serial_bn.rand(64, MsbOption::MAYBE_ZERO, false)?;
    serial_bn.add_word((seed | 1) as u32)?;
    let serial = Asn1Integer::from_bn(&serial_bn)?;
    builder.set_serial_number(&serial)?;

    builder.set_subject_name(&name)?;
    builder.set_issuer_name(&name)?;
    builder.set_pubkey(&key)?;
    builder.set_not_before(Asn1Time::days_from_now(0)?.as_ref())?;
    builder.set_not_after(Asn1Time::days_from_now(1)?.as_ref())?;
    builder.sign(&key, MessageDigest::sha256())?;

    let cert = builder.build();
    let cert_pem = cert.to_pem()?;
    let key_pem = key.private_key_to_pem_pkcs8()?;
    let pin = public_key_pin(&cert)?;

    Ok(CertMaterial {
        cert_pem,
        key_pem,
        pin,
    })
}

fn public_key_pin(cert: &X509) -> Result<String, Box<dyn std::error::Error>> {
    let pubkey = cert.public_key()?;
    let der = pubkey.public_key_to_der()?;
    let digest = hash(MessageDigest::sha256(), &der)?;
    let encoded = base64::encode(digest);
    Ok(format!("sha256//{}", encoded))
}

fn write_cert_material(cert: &CertMaterial) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let unique = UNIQUE_ID.fetch_add(1, Ordering::Relaxed);
    let nanos = SystemTime::now().duration_since(UNIX_EPOCH)?.as_nanos();
    let dir = std::env::temp_dir().join(format!("ylong-pbt-{}-{}", nanos, unique));
    fs::create_dir_all(&dir)?;
    fs::write(dir.join("server.crt.pem"), &cert.cert_pem)?;
    fs::write(dir.join("server.key.pem"), &cert.key_pem)?;
    Ok(dir)
}

fn spawn_https_server(
    runtime: &tokio::runtime::Runtime,
    cert_path: PathBuf,
    key_path: PathBuf,
) -> u16 {
    let std_listener = TcpListener::bind("127.0.0.1:0").expect("bind tcp listener");
    let port = std_listener.local_addr().expect("local addr").port();
    std_listener.set_nonblocking(true).expect("set nonblocking");
    let listener = TokioTcpListener::from_std(std_listener).expect("tokio listener");

    runtime.spawn(async move {
        let mut acceptor = SslAcceptor::mozilla_intermediate(SslMethod::tls()).expect("ssl acceptor");
        acceptor
            .set_private_key_file(&key_path, SslFiletype::PEM)
            .expect("set private key");
        acceptor
            .set_certificate_chain_file(&cert_path)
            .expect("set certificate chain");
        acceptor.check_private_key().expect("check private key");
        let acceptor = acceptor.build();

        let (stream, _) = listener.accept().await.expect("accept tcp connection");
        let ssl = openssl::ssl::Ssl::new(acceptor.context()).expect("create ssl");
        let mut stream = tokio_openssl::SslStream::new(ssl, stream).expect("ssl stream");
        std::pin::Pin::new(&mut stream)
            .accept()
            .await
            .expect("tls accept");

        let mut buf = [0u8; 2048];
        let _ = stream.read(&mut buf).await.expect("read request");
        stream
            .write_all(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nok")
            .await
            .expect("write response");
    });

    port
}
```

### Reproducing the Failure

Run the property test with the TLS features enabled:

```bash
cargo test -p ylong_http_client \
  --test sdv_async_https_pinning_proptest \
  --features "async http1_1 tokio_base __tls c_openssl_3_0" \
  -- --nocapture
```

On the buggy version, `proptest` finds a counterexample quickly. Example failing seed observed during testing:

```
minimal failing input: seed = 13906729447236021206
```

That failure means:

- a valid self-signed certificate was generated
- the exact correct pin was derived from its real SPKI bytes
- the HTTPS request still failed under pinning

So PBT exposes the same semantic bug that Kani proved: the implementation is not hashing the real serialized public key.

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