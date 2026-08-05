---
id: OH-2026-PLAYER-001
date: "2026-07-24"
repo: multimedia_player_framework
repo_url: https://gitcode.com/openharmony/multimedia_player_framework
title: "[Bug]: XmlParser::Destroy double-frees mDoc_ (destructor re-enters without null)"
cwe: CWE-415
cwe_name: Double Free
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/utils/xml_parse.cpp
file_paths:
  - services/utils/xml_parse.cpp
  - services/engine/common/recorder_profiles/recorder_profiles_xml_parser.cpp
  - services/engine/common/recorder_profiles/recorder_profiles_ability_singleton.cpp
author: Toan
internal_issue_id: DTS2026072457284
language: C++
---

## Summary

`XmlParser::Destroy` frees the libxml document via `xmlFreeDoc(mDoc_)` but does
**not** clear `mDoc_`. The destructor **always** calls `Destroy()` again →
second `xmlFreeDoc` on a dangling pointer → **double free / process abort**.

Public `Destroy()` + dtor pairing means the method is not safe to use.
Production singleton currently relies on RAII only (single free — works by
accident of not calling `Destroy`). Not a hot-path crash on every profile
parse. Confirmed and fixed by developers (`DTS2026072457284`).

## Vulnerable Code

`services/utils/xml_parse.cpp`:

```cpp
void XmlParser::Destroy()
{
    if (mDoc_ != nullptr) {
        xmlFreeDoc(mDoc_);
        // mDoc_ left dangling — not set to nullptr
    }
}

XmlParser::~XmlParser()
{
    Destroy();   // second free if Destroy() already called
}
```

Subclass / production use: `RecorderProfilesXmlParser`; load path
`RecorderProfilesAbilitySingleton::ParseRecorderProfilesXml` (`shared_ptr` →
`LoadConfiguration` / `Parse` → dtor only, **no** explicit `Destroy` today).

Root cause: missing `mDoc_ = nullptr` after `xmlFreeDoc`.

## Trigger Conditions

1. Caller loads a document (`LoadConfiguration` sets `mDoc_`).
2. Explicit `Destroy()` frees the doc but leaves `mDoc_` non-null.
3. Destructor re-enters `Destroy()` → `xmlFreeDoc(dangling)` → double free abort.
   Alternate: `Destroy()` then `Parse()` → use-after-free on `mDoc_`.

## Impact

| Path | Behavior |
|------|----------|
| Dtor only (no prior `Destroy`) | Single free — **OK** (current production load path) |
| `Destroy()` then dtor | **Double free → process abort** |
| `Destroy()` then `Parse()` | **Use-after-free** on `mDoc_` |

- Public API is unsafe; any caller (tests, future reload/teardown) that pairs
  `Destroy()` with normal destruction crashes.
- In-tree production load path does **not** call `Destroy()` today — field
  crash likelihood is **low** unless something starts using the public method.
- Related (separate root cause, optional follow-up): `LoadConfiguration`
  assigns `mDoc_ = xmlReadFile(...)` without freeing a previous document
  (leak / second live doc on reload).
- Medium: definite double free when path is hit; not hot-path on every parse.

## Minimal Counterexample

```
XmlParserProbe p;                     // subclass exposing Destroy
p.LoadConfiguration(valid_xml_path);  // mDoc_ set
p.Destroy();                          // xmlFreeDoc(mDoc_); mDoc_ still non-null
// ~XmlParser → Destroy() → xmlFreeDoc(dangling) → abort
// free(): double free detected in tcache 2
```

## How PBT Detected This

`pbt-native/xml_parse_pbt_test` — real SUT `xml_parse.cpp`:

| Test | Result |
|------|--------|
| `LoadConfigurationParseAndDestroyVisitsXmlRoot` | **ABORT** (double free) |
| Other XmlParser helper props | PASS (no explicit `Destroy`) |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target xml_parse_pbt_test
./pbt-native/build/xml_parse_pbt_test \
  --gtest_filter='XmlParserPBT.LoadConfigurationParseAndDestroyVisitsXmlRoot'
```

## Suggested Fix

```cpp
void XmlParser::Destroy()
{
    if (mDoc_ != nullptr) {
        xmlFreeDoc(mDoc_);
        mDoc_ = nullptr;
    }
}
```

One line. Makes `Destroy` idempotent and matches the destructor’s re-entry.
Maintainers confirmed the double-free; fixed by nulling `mDoc_` after free.

## References

- Bug: `services/utils/xml_parse.cpp` (`Destroy`, `~XmlParser`)
- Production use: `RecorderProfilesXmlParser`;
  `RecorderProfilesAbilitySingleton::ParseRecorderProfilesXml`
- PBT: `pbt-native/xml_parse_pbt_test.cpp`
- Internal issue: `DTS2026072457284`
