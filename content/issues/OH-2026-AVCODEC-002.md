---
id: OH-2026-AVCODEC-002
date: "2026-07-29"
repo: multimedia_av_codec
repo_url: https://gitcode.com/openharmony/multimedia_av_codec
title: "[Bug]: UriDecode escape guard off-by-one decodes truncated %X as a control byte"
cwe: CWE-193
cwe_name: Off-by-one Error
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/media_engine/plugins/source/http_source/hls/hls_tags.cpp
file_paths:
  - services/media_engine/plugins/source/http_source/hls/hls_tags.cpp
  - services/media_engine/plugins/source/http_source/hls/m3u8.cpp
author: Toan
internal_issue_id: DTS2026072935286
language: C++
---

## Summary

File-static `UriDecode` in `hls_tags.cpp` enters the `%XX` escape branch with
guard `i + 2 <= uri.size()`, which only ensures **one** character after `%`.
`substr(i+1, 2)` then yields a 1-char hex string; `IsHexValid` accepts a single
hex digit and `SafeStringToInt` decodes it as a byte. Trailing truncated `%X`
becomes a control byte (e.g. `"a%4"` → `"a\x04"`).

Live HLS query path via sole caller `ParseUriQuery`. Not High: no crash/OOB;
well-formed `%XX` and normal playlists OK; needs truncated escape at EOS.
Confirmed and fixed by developers (`DTS2026072935286`).

## Vulnerable Code

`services/media_engine/plugins/source/http_source/hls/hls_tags.cpp` — `UriDecode`
(~539):

```cpp
if (uri[i] == '%' && i + 2 <= uri.size()) { // comments: "%20" triple
    std::string hex = uri.substr(i + 1, 2); // may be 1 char when only one remains
    if (IsHexValid(hex)) {
        UriInsert(result, hex, 16);
        i += 3;
    } else {
        result += uri.substr(i, 3);
        i += 3;
    }
}
```

Caller: `ParseUriQuery` → `m3u8.cpp` tag URI query map.

Root cause: `%XX` needs indices `i`, `i+1`, `i+2` → guard must be
`i + 3 <= size`. Contributing: `IsHexValid` does not require `hex.size() == 2`.

## Trigger Conditions

1. HLS tag URI query string ends with truncated escape `%X` (one hex digit after
   `%`, e.g. `"a%4"` / `"%4"`).
2. `ParseUriQuery` runs `UriDecode` on that query before `ExtractPairs`.
3. Escape branch enters; 1-char hex validates; decoded control byte injected
   into the query string.

Lone trailing `%` (`…%`) already outside the branch — OK. Well-formed `%XX`
unchanged.

## Impact

- **Silent wrong decode** on live HLS query path: truncated `%X` becomes a
  control byte before key/value map extraction → wrong query map.
- Well-formed `%XX` / no `%` / stock playlists: unchanged.
- Medium: live parse path + silent corruption when that token appears; no
  crash/OOB; field needs truncated escape at end of query (malformed / cut-off
  URL).

## Minimal Counterexample

| Input | Expected (own `%XX` intent) | Actual |
|-------|-----------------------------|--------|
| `"a%4"` | `"a%4"` (pass through) | **`"a\x04"`** |
| `"%4"` | `"%4"` | **`"\x04"`** |
| `"a%04"` | `"a\x04"` (well-formed) | `"a\x04"` OK |
| `"a%"` | `"a%"` (guard fails) | `"a%"` OK |
| `"hello%20world"` | spaces | OK |

## How PBT Detected This

`pbt-native/hls_uridecode_pbt_test` — production `.cpp` included:

| Test | Result |
|------|--------|
| `UriDecode_BugDocs.TruncatedEscapeAtEosIsDecoded` | **FAIL** (`"a%4"` → `"a\x04"`) |
| Round-trip / `+` / invalid hex / identity | PASS |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target hls_uridecode_pbt_test
./pbt-native/build/hls_uridecode_pbt_test --gtest_filter='*Truncated*'
```

## Suggested Fix

Require a full `%XX` triple in range:

```cpp
if (uri[i] == '%' && i + 3 <= uri.size()) {
    std::string hex = uri.substr(i + 1, 2);
    if (IsHexValid(hex)) {
        UriInsert(result, hex, 16);
        i += 3;
    } else {
        result += uri.substr(i, 3);
        i += 3;
    }
}
```

Optional belt: `IsHexValid` require `hex.size() == 2`. After fix: truncated EOS
→ pass through; well-formed props stay PASS.

## References

- Bug: `hls_tags.cpp` (`UriDecode`)
- Caller: `ParseUriQuery` → `m3u8.cpp` tag URI query map
- Contract pins: body comments (`// 2:"%20"`, `i += 3 // 3:"%20"`); `ParseUriQuery`
  UTs (`hello%20world`, `+` → space)
- PBT: `pbt-native/hls_uridecode_pbt_test.cpp`
- Internal issue: `DTS2026072935286`
