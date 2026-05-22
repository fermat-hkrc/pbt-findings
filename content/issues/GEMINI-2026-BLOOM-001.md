---
id: GEMINI-2026-BLOOM-001
date: "2026-05-22"
repo: openGemini
repo_url: https://github.com/openGemini/openGemini
title: "[Bug]: DefaultOneHitBloomFilter panics with slice bounds out of range on undersized buffer"
cwe: CWE-129
cwe_name: Improper Validation of Array Index
severity: MEDIUM
status: SUBMITTED
issue_url: https://github.com/openGemini/openGemini/issues/940
affected_version: "*"
component: bloomfilter
file_paths:
  - lib/bloomfilter/bloomfilter.go
  - lib/logstore/constant.go
author: Toan
language: Go
---

## Summary

`DefaultOneHitBloomFilter` and `NewOneHitBloomFilter` panic with `slice bounds out of range` when the buffer size is too small for the hash values provided. The `Add()` and `Hit()` methods compute byte offsets directly from hash values without any bounds checking, and the API accepts any `int64` size with no validation or documentation of minimum size requirements.

## Vulnerable Code

**`bloomfilter.go:89-94`**
```go
func (b *OneHitBloomFilterV0) Add(hash uint64) {
    var offset = int(hash >> 49)           // offset can be 0..32767
    // ...
    s := binary.LittleEndian.Uint64(b.bytes[offset : offset+8]) // panic if offset+8 > len(b.bytes)
}
```

All three versions are affected with different offset calculations:

| Version | Offset Calculation | Max Offset | Min Required Size |
|---------|-------------------|------------|-------------------|
| V0/V1 | `hash >> 49` | 32,767 | 32,775 bytes |
| V2/V3 | `hash >> 46` | 262,143 | 262,151 bytes |

## Evidence

```go
// V0: min size = 32,775 bytes
bf := bloomfilter.DefaultOneHitBloomFilter(0, 8)
bf.Add(uint64(0x2000000000000))  // panic: slice bounds out of range [:9] with capacity 8

// V2: min size = 262,151 bytes
bf := bloomfilter.DefaultOneHitBloomFilter(2, 8)
bf.Add(uint64(0x400000000000))  // panic

// V3: min size = 262,151 bytes
bf := bloomfilter.DefaultOneHitBloomFilter(3, 8)
bf.Add(uint64(0x400000000000))  // panic

// Even one byte below minimum panics:
bf := bloomfilter.DefaultOneHitBloomFilter(0, 32774) // min is 32775
bf.Add(uint64(0x7FFF) << 49)  // panic: slice bounds out of range [:32775] with capacity 32774
```

## Production Status

Production code is **not currently affected** because it always uses correct sizes from constants:

```go
// lib/logstore/constant.go
LogStoreConstantV0 = InitConstant(32*1024+64, ...)  // 32,832 bytes (57 byte margin)
LogStoreConstantV2 = InitConstant(256*1024+64, ...) // 262,208 bytes (57 byte margin)
```

However, nothing prevents future code from passing an invalid size. The API accepts any `int64` with no validation or documentation, making this a latent risk.

## Impact

- **Panic / denial of service**: any caller passing an undersized buffer causes an unrecovered panic
- **No input validation**: the API gives no indication of minimum size requirements
- **Latent risk**: production is safe today only by convention, not enforcement

## Suggested Fix

Add minimum size validation in `DefaultOneHitBloomFilter`:

```go
func DefaultOneHitBloomFilter(version uint32, bloomfilterSize int64) Bloomfilter {
    minSize := int64(32775) // version <= 1
    if version >= 2 {
        minSize = 262151
    }
    if bloomfilterSize < minSize {
        panic(fmt.Sprintf("bloomfilter version %d requires at least %d bytes, got %d",
            version, minSize, bloomfilterSize))
    }
    bytes := make([]byte, bloomfilterSize)
    return NewOneHitBloomFilter(bytes, version)
}
```
