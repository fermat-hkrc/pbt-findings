---
id: OH-2026-PLAYER-004
date: "2026-08-20"
repo: multimedia_player_framework
repo_url: https://gitcode.com/openharmony/multimedia_player_framework
title: "[Bug]: GetPackageName tokenizes syspara via stringstream >> (drops whitespace / multi-token)"
cwe: CWE-20
cwe_name: Improper Input Validation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/utils/media_utils.cpp
file_paths:
  - services/utils/media_utils.cpp
author: Toan
internal_issue_id: DTS2026082009479
language: C++
---

## Summary

`GetPackageName` copies a syspara with `stringstream >>`, which strips
leading whitespace and truncates at the first token. Screen-capture config
then compares a corrupted bundle/ability name. Sibling
`SystemSoundManagerUtils::GetScannerFirstParameter` assigns the full
`paramValue`. Confirmed and fixed under `DTS2026082009479` (`value.assign`).

## Vulnerable Code

`services/utils/media_utils.cpp` `GetPackageName` used `stringstream >>`
instead of a full-string copy.

## Impact

Live `GetScreenCaptureSystemParam` consumers (`screen_capture_server.cpp`,
`ElementName` routing) mis-compare when a value has whitespace. Medium:
production constants are usually whitespace-free.

## References

- Bug: `services/utils/media_utils.cpp` (`GetPackageName`)
- Sibling: `SystemSoundManagerUtils::GetScannerFirstParameter`
- PBT: `~/cloned/multimedia_player_framework/pbt-native/get_package_name_pbt_test.cpp`
- Cloned report: `pbt-out/bug_reports/fixed/get_package_name_stringstream_tokenizes.md`
- Internal issue: `DTS2026082009479`
