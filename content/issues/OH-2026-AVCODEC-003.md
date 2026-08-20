---
id: OH-2026-AVCODEC-003
date: "2026-08-17"
repo: multimedia_av_codec
repo_url: https://gitcode.com/openharmony/multimedia_av_codec
title: "[Bug]: ValuesListTag::ParseAttributes TITLE includes the leading comma"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/media_engine/plugins/source/http_source/hls/hls_tags.cpp
file_paths:
  - services/media_engine/plugins/source/http_source/hls/hls_tags.cpp
author: Toan
internal_issue_id: DTS2026081713997
language: C++
---

## Summary

`ValuesListTag::ParseAttributes` parses HLS `#EXTINF:duration,title` format,
splitting on the comma between duration and title. The DURATION arm correctly
uses `substr(0, pos)` (excludes the comma), but the TITLE arm uses
`substr(pos)` (includes the comma). The result is that every titled segment’s
TITLE attribute starts with a leading comma (`",Opening"` instead of
`"Opening"`). Not High: metadata only; duration parsing is correct; playback
may still work with noisy titles. Confirmed and fixed by developers
(`DTS2026081713997`).

## Vulnerable Code

`services/media_engine/plugins/source/http_source/hls/hls_tags.cpp` —
`ValuesListTag::ParseAttributes` (~319):

```cpp
void ValuesListTag::ParseAttributes(const std::string& field)
{
    auto pos = field.find(',');
    std::shared_ptr<Attribute> attr;
    if (pos != std::string::npos) {
        attr = std::make_shared<Attribute>("DURATION", field.substr(0, pos));  // excludes ','
        if (attr) { AddAttribute(attr); }
        attr = std::make_shared<Attribute>("TITLE", field.substr(pos));         // includes ',' ← BUG
        if (attr) { AddAttribute(attr); }
    }
}
```

Sibling (correct): DURATION’s `substr(0, pos)` stops before the comma.
BUG: TITLE’s `substr(pos)` starts **at** the comma.

Contract: `#EXTINF:duration,title` — TITLE must start **after** the comma,
matching DURATION’s left split.

## Trigger Conditions

1. HLS `#EXTINF` tag contains a titled segment (`"10.0,Opening"`).
2. `ParseAttributes` runs to split duration from title.
3. TITLE attribute value is built from `substr(pos)` (includes comma).

Untitled segments or missing comma (broken EXTINF) are unaffected.

## Impact

- Every titled segment’s TITLE attribute starts with a leading comma.
- Players / DFX that read EXTINF TITLE see `",Opening"` instead of `"Opening"`.
- Metadata noise — title may be wrong or concatenated incorrectly downstream.
- Medium: silent wrong metadata; not crash/OOB; duration arm correct.

## Minimal Counterexample

| `field` | Expected TITLE | Actual TITLE |
|---------|----------------|--------------|
| `"10.0,Opening"` | `Opening` | `,Opening` |
| `"5,"` | empty | `,` |
| `"10.0"` (no comma) | (no TITLE attr) | OK |

## How PBT Detected This

`pbt-native/new_bugs_pbt_test.cpp` — links the REAL `hls_tags.cpp` (**not** a
model):

| Check | Result |
|-------|--------|
| `ValuesListTag TITLE` — title starts after comma | **FAIL** (`",Opening"` vs `"Opening"`) |
| Sibling oracle: DURATION `substr(0, pos)` is correct | PASS |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target new_bugs_pbt_test
./pbt-native/build/new_bugs_pbt_test
```

## Suggested Fix

Skip the comma in TITLE (`substr(pos + 1)`) matching DURATION’s split logic:

```diff
         attr = std::make_shared<Attribute>("DURATION", field.substr(0, pos));
         if (attr) {
             AddAttribute(attr);
         }
-        attr = std::make_shared<Attribute>("TITLE", field.substr(pos));  // keeps ','
+        attr = std::make_shared<Attribute>("TITLE", field.substr(pos + 1)); // skip ','
```

After fix: `"10.0,Opening"` → DURATION=`"10.0"`, TITLE=`"Opening"`; `"5,"` →
TITLE=`""`.

## References

- Bug: `hls_tags.cpp` (`ValuesListTag::ParseAttributes` TITLE includes comma)
- Same class: OH-2026-AVCODEC-002 (UriDecode off-by-one — sibling `substr(0, pos)` pattern)
- PBT: `pbt-native/new_bugs_pbt_test.cpp`
- Internal issue: `DTS2026081713997`