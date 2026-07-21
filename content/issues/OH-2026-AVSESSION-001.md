---
id: OH-2026-AVSESSION-001
date: "2026-07-07"
repo: multimedia_av_session
repo_url: https://gitee.com/openharmony/multimedia_av_session
title: "[Bug]: GetAnonyTitle crashes (SEGV) on all-continuation-byte media titles via empty-vector OOB read"
cwe: CWE-787
cwe_name: Out-of-bounds Read
severity: HIGH
status: CONFIRMED_FIXED
affected_version: "master"
component: utils/include/avsession_utils.h
file_paths:
  - utils/include/avsession_utils.h
  - services/session/server/avsession_service.cpp
  - services/session/server/avsession_item.cpp
  - services/session/server/avcontroller_item.cpp
author: Toan
internal_issue_id: DTS2026070722498
language: C++
---

## Summary

`AVSessionUtils::GetAnonyTitle` anonymizes a media title for logging. It scans
the title for UTF-8 character starts (bytes that are *not* continuation bytes)
and records their positions in `char_positions`, then — in the short-text
branch — reads `char_positions[0]`. When the title is composed entirely of UTF-8
continuation bytes (each byte in `0x80–0xBF`, e.g. `"\x80\x81\x82"`), no byte
is a character start, so `char_positions` stays **empty**. The short-text guard
`char_count <= VERY_SHORT_TEXT_LENGTH` is still satisfied (`0 <= 3`), and the
code dereferences `char_positions[0]` on the empty vector — undefined behavior
that manifests as a **SEGV** (process death).

The callers pass **app-supplied media titles** (`meta.GetTitle()`, `songName`,
`metaDataCache_.GetTitle()`) across 10+ AV-session sites, so a malicious or
buggy app that sets a continuation-byte title crashes the AV session service (a
system-ability process) the next time that title is logged/anonymized.

Upstream fix merged (PR #3214 / issue #2636) with a `char_count == 0` guard.

## Vulnerable Code

`utils/include/avsession_utils.h:345-410` (`GetAnonyTitle`); crash at line 363:

```cpp
static std::string GetAnonyTitle(const std::string& title, double ratio = 0.3)
{
    if (title.empty()) return "";
    const unsigned char UTF8_CONTINUATION_BYTE_MASK  = 0xC0;
    const unsigned char UTF8_CONTINUATION_BYTE_VALUE = 0x80;
    std::vector<int> char_positions;
    for (size_t i = 0; i < title.size(); ++i) {
        if ((static_cast<unsigned char>(title[i]) & UTF8_CONTINUATION_BYTE_MASK) != UTF8_CONTINUATION_BYTE_VALUE) {
            char_positions.push_back(i);   // only non-continuation bytes recorded
        }
    }
    const int char_count = static_cast<int>(char_positions.size());
    const int VERY_SHORT_TEXT_LENGTH = 3;
    if (char_count <= VERY_SHORT_TEXT_LENGTH) {                       // line 362 — true when char_count == 0
        std::string first_char = title.substr(char_positions[0], 3);  // line 363 — OOB read, vector is empty
        ...
    }
    ...
}
```

For an all-continuation-byte title, `char_positions` is empty and `char_count`
is `0`; `0 <= 3` enters the short branch and line 363 reads
`char_positions[0]` out of bounds → SEGV.

## Trigger Conditions

1. An app sets a media title composed only of UTF-8 continuation bytes
   (`0x80–0xBF`, e.g. `"\x80\x81\x82"`) on its AV session metadata.
2. Any code path that logs/anonymizes the title calls
   `AVSessionUtils::GetAnonyTitle(title)`.
3. `char_positions` is empty; the short-text branch dereferences it unconditionally.
4. The AV session SA process crashes (SEGV), taking down all AV sessions hosted
   in that process — not just the misbehaving app.

The input is fully app-controlled via media metadata (`meta.GetTitle()`).

## Impact

- **Availability:** the AV session SA crashes (SEGV) when anonymizing /
  log-printing an all-continuation-byte title. Media playback control, cast
  (`hw_cast_stream_player.cpp`), and migration logging paths that touch the
  title take down the system service.
- The crash is in the SA process, affecting all AV sessions hosted there, not
  just the misbehaving app.
- **High:** deterministic SEGV in the AV session SA, app-triggerable via media
  metadata.

**Honest caveat:** the trigger input is unusual — a real app title is normally
valid UTF-8, so accidental hits are rare. But the input is fully app-controlled
and the crash is deterministic, so it is a genuine app-triggerable DoS of the AV
session SA, not theoretical UB.

## Minimal Counterexample

```cpp
GetAnonyTitle("\x80\x81\x82");
//   char_positions = {}   (no byte is a UTF-8 char start)
//   char_count = 0
//   0 <= VERY_SHORT_TEXT_LENGTH(3)  →  enter short branch
//   title.substr(char_positions[0], 3)  →  OOB read on empty vector  →  SEGV
```

```
$ g++ -std=c++17 repro.cpp -o repro && ./repro
Segmentation fault (core dumped)        # exit 139
```

No shrinking required — the defect is deterministic.

## How PBT Detected This

`GetAnonyTitleBugHunt.AllContinuationInputsReturnMask` — formal: ∀ non-empty
title composed only of UTF-8 continuation bytes, `GetAnonyTitle(title)` must
return a mask (e.g. `"***"`) **without crashing**. The current implementation
reads an empty vector and faults.

`GetAnonyTitle` is a pure `std::string`/`std::vector` function with no OHOS
dependency, so the production logic compiles and runs directly; two independent
confirmations — (1) a standalone reproducer built from verbatim lines 345–365
crashes with exit 139 on `"\x80\x81\x82"`; (2) the in-repo
`GetAnonyTitleBugHunt.AllContinuationInputsReturnMask` FAILs.

### Why existing tests did not catch this

1. Valid UTF-8 titles always have at least one character-start byte, so
   `char_positions` is non-empty — the empty case only arises from
   malformed/continuation-only input.
2. Existing tests use ASCII / valid-UTF-8 titles.
3. The upstream fix exists (PR #3214) but was not back-ported to this tree.

## Suggested Fix

Guard the empty-vector case before the dereference (matches the upstream fix):

```diff
--- a/utils/include/avsession_utils.h
+++ b/utils/include/avsession_utils.h
@@ -360,6 +360,9 @@ static std::string GetAnonyTitle(const std::string& title, double ratio = 0.3)
         const int char_count = static_cast<int>(char_positions.size());
+        if (char_count == 0) {
+            return "*" + title + "*";
+        }
         const int VERY_SHORT_TEXT_LENGTH = 3;
```

After the fix, `GetAnonyTitleBugHunt.AllContinuationInputsReturnMask` flips from
FAIL to PASS.

## References

- Bug: `utils/include/avsession_utils.h:345-410` — `GetAnonyTitle` (crash at line 363)
- Callers (app-reachable): `services/session/server/avsession_service.cpp:4663,4667,4671`, `avsession_item.cpp:617,623`, `avcontroller_item.cpp:123,150,570`, `hw_cast_stream_player.cpp:257`, `migrate_avsession_server_for_next.cpp:203`
- PBT test: `pbt-native/get_anony_title_pbt_test.cpp` — `GetAnonyTitleBugHunt.AllContinuationInputsReturnMask`
- Upstream: issue #2636, PR #3214 (`char_count == 0` guard)
- Internal issue: `DTS2026070722498`
