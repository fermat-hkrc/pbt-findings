---
id: TAURI-2026-FLOAT-001
date: "2026-06-04"
repo: tauri
repo_url: https://github.com/tauri-apps/tauri
title: "[Bug]: Panic on inf/-inf/NaN floats when converting acl::Value to serde_json::Value"
cwe: CWE-248
cwe_name: Uncaught Exception
severity: MEDIUM
status: PENDING
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

Property-based testing with [proptest](https://proptest-rs.github.io/proptest/). The test harness generates arbitrary `acl::Value` trees via a custom strategy and asserts that converting to `serde_json::Value` never panics.

### Test code (`pbt-tests/src/value_roundtrip.rs`)

```rust
use proptest::prelude::*;
use tauri_utils::acl::value::{Number, Value};

fn arb_acl_value() -> impl Strategy<Value = Value> {
    let leaf = prop_oneof![
        Just(Value::Null),
        any::<bool>().prop_map(Value::Bool),
        any::<i64>().prop_map(|n| Value::Number(Number::Integer(n))),
        any::<f64>().prop_map(|f| Value::Number(Number::Float(f))),
        ".*".prop_map(Value::String),
    ];
    leaf.prop_recursive(4, 64, 10, |inner| {
        prop_oneof![
            proptest::collection::vec(inner.clone(), 0..10)
                .prop_map(Value::Array),
            prop_oneof![
                ("[0-9a-z]{1,8}", inner.clone()),
            ]
            .prop_map(|entries| {
                Value::Object(entries.into_iter().collect())
            }),
        ]
    })
}

proptest! {
    #[test]
    fn value_to_serde_json_never_panics(val in arb_acl_value()) {
        // This should never panic regardless of the Value contents.
        let _: serde_json::Value = val.into();
    }
}
```

### Result

Running `cargo test` immediately produces:

```
thread 'value_to_serde_json_never_panics' panicked at 'called `Option::unwrap()`
on a `None` value', crates/tauri-utils/src/acl/value.rs:69
```

The **minimal failing inputs** are:
- `Value::Number(Number::Float(f64::INFINITY))`
- `Value::Number(Number::Float(f64::NEG_INFINITY))`
- `Value::Number(Number::Float(f64::NAN))`

The property `value_to_serde_json_never_panics` fails for any of these three values.

### Regression tests

Two `#[should_panic]` tests were added alongside the bug report. They verify the current broken behavior and will flip from passing to failing once a fix is applied, serving as documentation of the fix scope:

```rust
#[test]
#[should_panic(expected = "None")]
fn bug2_inf_panics_conversion() {
    let v = Value::Number(Number::Float(f64::INFINITY));
    let _: serde_json::Value = v.into();
}

#[test]
#[should_panic(expected = "None")]
fn bug2_nan_panics_conversion() {
    let v = Value::Number(Number::Float(f64::NAN));
    let _: serde_json::Value = v.into();
}
```

### Test environment

```
proptest = "1"
tauri-utils = { git = "https://github.com/tauri-apps/tauri" }
```

Run with:
```bash
cargo test --test value_roundtrip  # fails immediately on first iteration
```

The bug is caught on the very first generated input because `any::<f64>()` rapidly produces non-finite values (they are common in the f64 value space).
