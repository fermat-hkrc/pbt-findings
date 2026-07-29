---
id: OH-2026-AVCODEC-001
date: "2026-07-24"
repo: multimedia_av_codec
repo_url: https://gitcode.com/openharmony/multimedia_av_codec
title: "[Bug]: HLS segment byterange offset_+length_-1 wraps in uint32_t → dropped / wrong range"
cwe: CWE-190
cwe_name: Integer Overflow or Wraparound
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/media_engine/plugins/source/http_source/hls/hls_segment_manager.cpp
file_paths:
  - services/media_engine/plugins/source/http_source/hls/hls_segment_manager.cpp
  - services/media_engine/plugins/source/http_source/hls/playlist_downloader.h
  - services/media_engine/plugins/source/http_source/hls/m3u8.cpp
  - services/media_engine/plugins/source/http_source/download/downloader.cpp
author: Toan
internal_issue_id: DTS2026072438019
language: C++
---

## Summary

`HlsSegmentManager::ConfigureAndDownload` computes the inclusive HTTP Range end
as `playInfo.offset_ + playInfo.length_ - 1` with both fields **`uint32_t`**.
When mathematical `offset + length > 2^32`, the sum wraps before widening to
`int64_t` for `SetRangePos`, so production end is `math_end - 2^32` and always
`< offset`. Downstream `BeginDownload` then drops the range (`endPos_ <= 0` →
start forced to 0) or gets a non-positive `requestSize`.

Playlist-driven correctness / playback failure. Not a trust-boundary bypass:
playlist author already controls segment URLs and legitimate ranges. Confirmed
and fixed by developers (`DTS2026072438019`).

## Vulnerable Code

`services/media_engine/plugins/source/http_source/hls/hls_segment_manager.cpp`
(`ConfigureAndDownload` ~328):

```cpp
if (!playInfo.rangeUrl_.empty()) {
    if (!isRequestWholeFile) {
        downloadRequest->SetRangePos(
            playInfo.offset_,
            playInfo.offset_ + playInfo.length_ - 1);  // all uint32_t
    }
}
```

Types: `PlayInfo::offset_` / `length_` are `uint32_t` (`playlist_downloader.h`).
Operands come from `#EXT-X-BYTERANGE` via `Attribute::GetByteRange` →
`M3U8::UpdateByteRange` with **no check** before assignment into `uint32_t`.

Root cause: `(uint32 + uint32) - 1u` in the uint32 domain, then cast to
`int64_t`. Widen **before** add/sub.

## Trigger Conditions

1. Playlist supplies `#EXT-X-BYTERANGE` such that `length_ > 0` (range path
   entered) and mathematical `offset + length > 2^32`.
2. `ConfigureAndDownload` runs with non-empty `rangeUrl_`.
3. Wrapped end is `< offset` (often `0`); `BeginDownload` drops or mis-sizes
   the range.

Concrete playlist (syntactically valid):

```
#EXTM3U
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
#EXT-X-BYTERANGE:2@4294967295
segment.mp4
#EXT-X-ENDLIST
```

→ `SetRangePos(4294967295, 0)` → `endPos_ <= 0` → range dropped, read from
file start.

## Impact

- **Lost/wrong byterange on download** when wrap yields `end < start` or
  `end == 0` — not a clean inverted `Range:` header for the primary witnesses.
- Playback failure or wrong slice of a same-URL byterange asset (malformed
  playlist, or single-file VOD whose offset+length crosses 2³²).
- Medium: correctness on live download path; playlist author already chooses
  URLs. Deeper ceiling: `uint32_t` storage still cannot represent single-file
  VOD offsets/lengths past 4 GiB even after the expression is widened.

## Minimal Counterexample

```
offset = 2
length = 0xFFFFFFFF   // UINT32_MAX; length > 0 → range path used

// association: (offset + length) - 1u  in uint32
Production end: static_cast<int64_t>(2u + 0xFFFFFFFFu - 1u)
              = static_cast<int64_t>(0)     // 2+max → 1; 1-1 → 0
Secure end:     2 + 4294967295 - 1 = 4294967296

SetRangePos(2, 0)
// BeginDownload: endPos_ <= 0 → startPos_ = 0,
// requestSize_ = FIRST_REQUEST_SIZE  — range dropped
```

Also: `offset = 0x80000000`, `length = 0x80000001` → end `0` (same drop path).

## How PBT Detected This

`pbt-native/hls_byterange_end_pbt_test` — expression mismatch only (HTTP header /
`BeginDownload` path code-traced, not PBT-linked):

| Property / test | Result |
|-----------------|--------|
| `SmallRangeAgreesWithSecure` | PASS |
| `EndNotBeforeStartWhenLengthPositive` | **FAIL** (wrap cases) |
| `ProductionMatchesSecure` | **FAIL** (wrap cases) |
| `Uint32WrapYieldsWrongEnd` | **FAIL** (documents expr gap) |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target hls_byterange_end_pbt_test
./pbt-native/build/hls_byterange_end_pbt_test
```

## Suggested Fix

Widen before add/sub:

```cpp
const int64_t start = static_cast<int64_t>(playInfo.offset_);
const int64_t end =
    static_cast<int64_t>(playInfo.offset_) + static_cast<int64_t>(playInfo.length_) - 1;
downloadRequest->SetRangePos(start, end);
```

Optional follow-ups (not required to close the expr bug): cap/reject absurd
`length` before download; promote `offset_` / `length_` beyond `uint32_t` if
>4 GiB byterange VOD is in scope.

## References

- Bug: `hls_segment_manager.cpp` (`ConfigureAndDownload`)
- Types: `playlist_downloader.h` (`PlayInfo::offset_` / `length_`)
- Parse: `m3u8.cpp` (`UpdateByteRange`); `hls_tags.cpp` (`GetByteRange`)
- Downstream: `downloader.cpp` (`SetRangePos`, `BeginDownload` `endPos_ <= 0`)
- Map-path contrast only (alloc/`size_t` hygiene, not segment parity):
  `m3u8.cpp` length cap + `offset <= SIZE_MAX - length`
- PBT: `pbt-native/hls_byterange_end_pbt_test`
- Internal issue: `DTS2026072438019`
