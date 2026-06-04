---
id: TAURI-2026-FLOAT-001
date: "2026-06-04"
repo: tauri
repo_url: https://github.com/tauri-apps/tauri
title: "[Bug]: Panic on inf/-inf/NaN floats when converting acl::Value to serde_json::Value"
cwe: CWE-248
cwe_name: Uncaught Exception
severity: MEDIUM
status: SUBMITTED
issue_url: https://github.com/tauri-apps/tauri/issues/15477
affected_version: "*"
component: tauri-utils
file_paths:
  - crates/tauri-utils/src/acl/value.rs
author: Toan
language: Rust
stars: 107483
---

## Summary

`From<Value> for serde_json::Value` in `crates/tauri-utils/src/acl/value.rs` calls `serde_json::Number::from_f64(f).unwrap()` without guarding against non-finite float values. `from_f64` returns `None` for `inf`, `-inf`, and `NaN` (which JSON cannot represent), so `.unwrap()` panics. The panic is unrecoverable.

Reachable through normal TOML config parsing — TOML 1.0 supports `inf`, `-inf`, and `nan` as valid float literals, and the `From<toml::Value> for Value` impl passes them through without validation.

## Vulnerable Code

```rust
// crates/tauri-utils/src/acl/value.rs
impl From<Value> for serde_json::Value {
  fn from(value: Value) -> Self {
    match value {
      Value::Number(Number::Float(f)) => {
        serde_json::Value::Number(serde_json::Number::from_f64(f).unwrap())
        //                                                         ^^^^^^^^
        //                                   panics when f is inf, -inf, or NaN
      }
      // ...
    }
  }
}
```

The TOML entry point has no guard either:

```rust
// ~line 139
Toml::Float(f) => f.into(),  // passes inf/nan directly into Number::Float
```

## Reproduction

**Via TOML config:**
```toml
[scope]
some_value = inf
```

Walks `Tauri.toml → toml::Value → acl::Value → serde_json::Value → panic`.

**Programmatically:**
```rust
let v = Value::Number(Number::Float(f64::INFINITY));
let _: serde_json::Value = v.into();
// panic: called `Option::unwrap()` on a `None` value
```

## Impact

- Unrecoverable panic from a `From` impl
- Reachable through normal config parsing
- Any app using a capability file with a float-typed scope value crashes

## Suggested Fix

**Option A — map to null at serialization (lowest friction):**
```rust
Value::Number(Number::Float(f)) => {
    serde_json::Number::from_f64(f)
        .map(serde_json::Value::Number)
        .unwrap_or(serde_json::Value::Null)
}
```

**Option B — reject at TOML entry point:**
```rust
Toml::Float(f) if f.is_finite() => f.into(),
Toml::Float(_) => Value::Null,
```

## How This Was Found

Property-based testing with [proptest](https://proptest-rs.github.io/proptest/). The test exercises roundtrip through `acl::Value → serde_json::Value` and panics on `Float(inf)`, `Float(-inf)`, and `Float(NaN)`. Regression tests (`bug2_inf_panics_conversion`, `bug2_nan_panics_conversion`) in `pbt-tests/src/value_roundtrip.rs` will flip from passing to failing once the bug is fixed.
