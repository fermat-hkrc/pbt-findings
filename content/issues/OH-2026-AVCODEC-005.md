---
id: OH-2026-AVCODEC-005
date: "2026-08-17"
repo: multimedia_av_codec
repo_url: https://gitcode.com/openharmony/multimedia_av_codec
title: "[Bug]: AvcParser::ParseSpsInfo else-branch writes bitDepthLuma_ twice (bitDepthChroma_ never set)"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: LOW
status: CONFIRMED_FIXED
affected_version: "master"
component: services/media_engine/plugins/ffmpeg_adapter/muxer/mpeg4_muxer/avc_parser.cpp
file_paths:
  - services/media_engine/plugins/ffmpeg_adapter/muxer/mpeg4_muxer/avc_parser.cpp
author: Toan
internal_issue_id: DTS2026081706437
language: C++
---

## Summary

The `if` branch of `AvcParser::ParseSpsInfo` sets `bitDepthLuma_` then
`bitDepthChroma_`. The `else` fallback writes `bitDepthLuma_` twice, so
`bitDepthChroma_` stays at the struct default. Copy-paste. Confirmed and
fixed under `DTS2026081706437`. Low: default `0xF8` matches the intended
constant; field often not serialized for baseline/main.

## Vulnerable Code

```cpp
} else {
    avccBox_->chromaFormat_  = 0xFD;
    avccBox_->bitDepthLuma_  = 0xF8;
    avccBox_->bitDepthLuma_  = 0xF8;  // should be bitDepthChroma_
}
```

## References

- Bug: `avc_parser.cpp` (`AvcParser::ParseSpsInfo`)
- Caller: `AvcParser::UpdateSpsParser` → MP4 avcC box
- Cloned report: `pbt-out/bug_reports/fixed/avc_parser_bitDepthChroma_copy_paste.md`
- Internal issue: `DTS2026081706437`
