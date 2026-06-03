---
id: BUN-2026-ARITH-001
date: "2026-05-29"
repo: bun
repo_url: https://github.com/oven-sh/bun
title: "[Bug]: BabyVec::extend_from_slice / append / prepend_from lack u32 overflow guards"
cwe: CWE-190
cwe_name: Integer Overflow or Wraparound
severity: LOW
status: PENDING
issue_url: https://github.com/oven-sh/bun/issues/31555
affected_version: "b69085e"
component: bun_alloc
stars: 92745
file_paths:
  - src/bun_alloc/baby_vec.rs
author: Toan
language: Rust
---

## Summary

Three methods in `BabyVec` perform `self.len += n as u32` with no overflow guard, confirmed by [Kani](https://github.com/model-checking/kani) formal verification. For non-ZST types, `reserve()` panics before overflow (64-bit arithmetic catches it first). For ZSTs, `reserve` is a no-op and the overflow is reachable — though ZSTs carry no data so impact is limited to a wrong length. This is a **defense-in-depth** improvement.

## Vulnerable Code

**`extend_from_slice`** — `src/bun_alloc/baby_vec.rs:333`
```rust
unsafe {
    ptr::copy_nonoverlapping(other.as_ptr(), self.ptr.as_ptr().add(self.len as usize), n);
    self.len += n as u32;  // ← no overflow check
}
```

**`append`** — `src/bun_alloc/baby_vec.rs:232`
```rust
self.len += n as u32;  // ← no overflow check
```

**`prepend_from`** — `src/bun_alloc/baby_vec.rs:254`
```rust
self.len += src_len as u32;  // ← no overflow check
```

## Why `reserve()` Protects Non-ZSTs

For non-ZST types, `reserve()` uses 64-bit arithmetic and panics via `grow_to()` before the unsafe block:

```rust
pub fn reserve(&mut self, additional: usize) {
    let need = self.len as usize + additional;  // 64-bit — no wrap
    if need > self.cap as usize {
        self.grow_to(need);  // asserts at_least <= u32::MAX → panic
    }
}
```

So for non-ZSTs, the u32 overflow is unreachable in practice.

## ZST Case

For ZSTs (`size_of::<T>() == 0`), `cap = u32::MAX` and `grow_to()` returns early, making `reserve()` a no-op. After ~4 billion operations, `self.len` wraps from `u32::MAX` to `0`. Consequence: wrong length — no memory corruption since ZSTs carry no data. No `BabyVec<ZST>` instances found in the current codebase.

## Formal Verification

Verified with **Kani model checker**:

```rust
#[cfg(kani)]
#[kani::proof]
fn check_extend_u32_overflow() {
    let len: u32 = kani::any();
    let n: u32 = kani::any();
    kani::assume(len > u32::MAX - 10);
    kani::assume(n > 0 && n <= 20);
    let new_len = len.wrapping_add(n);
    kani::assert(new_len >= len, "u32 overflow: new_len < old len after extend — BUG");
}
```

```
Status: FAILURE
Description: "u32 overflow: new_len < old len after extend — BUG"
VERIFICATION: FAILED
```

## Suggested Fix

Replace unchecked addition with `checked_add` in all three methods:

```rust
// extend_from_slice
self.len = self.len
    .checked_add(n as u32)
    .expect("BabyVec::extend_from_slice: length overflow past u32::MAX");

// append
self.len = self.len
    .checked_add(n as u32)
    .expect("BabyVec::append: length overflow past u32::MAX");

// prepend_from
self.len = self.len
    .checked_add(src_len as u32)
    .expect("BabyVec::prepend_from: length overflow past u32::MAX");
```

Cost: one branch per call — negligible compared to the `ptr::copy_nonoverlapping` that follows.

## Related

`set_len` at line 137 uses `debug_assert!(new_len <= cap)` which is stripped in release builds. If a caller passes `new_len > cap`, the violation goes undetected in release. Since `set_len` is `unsafe` with a documented safety contract this is expected Rust convention, but worth noting.
