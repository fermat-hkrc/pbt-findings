---
id: TAURI-2026-INT-001
date: "2026-06-05"
repo: tauri
repo_url: https://github.com/tauri-apps/tauri
title: "[Bug]: Number::Int is silently coerced to Number::Float on serde_json round-trip"
cwe: CWE-681
cwe_name: Incorrect Conversion between Numeric Types
severity: HIGH
status: CONFIRMED_FIXED
issue_url: https://github.com/tauri-apps/tauri/issues/15480
affected_version: "*"
component: tauri-utils
file_paths:
  - crates/tauri-utils/src/acl/value.rs
author: Toan
language: Rust
stars: 107483
---

## Summary

Any `acl::Value::Number(Number::Int(i))` is silently converted to `Number::Float(i as f64)` after a round-trip through `serde_json::Value`. The integer/float distinction is permanently lost. Affects serialization, deserialization, scope evaluation, and any code that pattern-matches on the `Number` variant.

## Reproduction

```rust
use tauri_utils::acl::{Number, Value};

let original = Value::Number(Number::Int(0));
let json: serde_json::Value = original.clone().into();
let back: Value = json.into();

assert_eq!(original, back);
// FAILS: left=Number(Int(0)), right=Number(Float(0.0))
```

Proptest shrunk counterexample:
```
input:    Map({"": Number(Int(0))})
expected: Map({"": Number(Int(0))})
actual:   Map({"": Number(Float(0.0))})
```

## Root Cause

`From<serde_json::Value> for Value` checks `as_f64()` **before** `as_i64()`:

```rust
// Current — broken order
serde_json::Value::Number(n) => Value::Number(if let Some(f) = n.as_f64() {
    Number::Float(f)          // ← always wins for any integer that fits in f64
} else if let Some(n) = n.as_u64() {
    Number::Int(n as i64)
} else if let Some(n) = n.as_i64() {
    Number::Int(n)
} else {
    Number::Int(0)
}),
```

`serde_json::Number::as_f64()` succeeds for every integer in `[-(2^53), 2^53]`, so the `as_i64()` branch is never reached for typical integer values.

## Impact

- **ACL scope evaluation**: Scopes that compare integer values (e.g. `{ "allow": [{ "port": 8080 }] }`) may fail to match because the parsed value is `Float(8080.0)` instead of `Int(8080)`.
- **TOML → JSON round-trip**: Values written as TOML integers (`port = 8080`) are correctly parsed as `Number::Int(8080)` via `From<toml::Value>`, but lose that distinction the moment they pass through serde_json.
- **Debugging**: `Debug` output prints `Float(0.0)` where a developer expects `Int(0)`, making logs and error messages misleading.

## Suggested Fix

Reverse the check order — prefer integer interpretation first:

```rust
// Fixed order
serde_json::Value::Number(n) => Value::Number(if let Some(i) = n.as_i64() {
    Number::Int(i)
} else if let Some(u) = n.as_u64() {
    // WARNING: `u as i64` wraps for values > i64::MAX, producing large
    // negative numbers (e.g. i64::MAX + 1 → i64::MIN). This is a
    // behavioural change from the current code, which converts those
    // values to Float instead. Consider saturating to i64::MAX, returning
    // an error, or keeping them as Number::Float(u as f64) to at least
    // preserve approximate magnitude.
    Number::Int(u as i64)
} else if let Some(f) = n.as_f64() {
    Number::Float(f)
} else {
    Number::Int(0)
}),
```

This matches serde_json's own convention: its `Visitor` implementations prefer `visit_i64`/`visit_u64` over `visit_f64` when the number has no decimal component.

## How This Was Found

Property-based testing with [proptest](https://proptest-rs.github.io/proptest/) in `pbt-tests/src/value_pbt.rs`. Three PBT properties are violated:

- **`value_to_serdejson_and_back`** — `acl::Value → serde_json::Value → acl::Value` must be the identity.
- **`serdejson_to_value_and_back`** — `serde_json::Value → acl::Value → serde_json::Value` must be the identity.
- **`list_structure_preserved`** — list/object structure preserved across round-trip.

All three fail with the same minimal counterexample: `Number(Int(0))` becomes `Number(Float(0.0))`. Proptest's shrinking reduces the failing case to a single integer in a single-key object.
