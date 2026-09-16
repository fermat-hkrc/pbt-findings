---
id: OH-2026-MEDIALIB-004
date: "2026-08-20"
repo: multimedia_media_library
repo_url: https://gitcode.com/openharmony/multimedia_media_library
title: "[Bug]: IsFileTablePath / IsPhotoTablePath treat ROOT_MEDIA_DIR as substring then substr from 0"
cwe: CWE-670
cwe_name: Always-Incorrect Control Flow Implementation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/innerkitsimpl/media_library_helper/src/media_file_utils.cpp
file_paths:
  - frameworks/innerkitsimpl/media_library_helper/src/media_file_utils.cpp
  - frameworks/innerkitsimpl/medialibrary_data_extension/src/medialibrary_object_utils.cpp
  - frameworks/js/src/file_asset_napi.cpp
author: Toan
internal_issue_id: DTS2026082012348
language: C++
---

## Summary

`MediaFileUtils::IsFileTablePath` (and sibling `IsPhotoTablePath`) is true
iff the path is **under** the media root **and** the relative segment starts
with `Docs/` (resp. a photo bucket). The implementation uses
`path.find(ROOT_MEDIA_DIR) == npos` (containment **anywhere**) then
`path.substr(ROOT_MEDIA_DIR.size())` from index **0**, not from `find()`.
A non-rooted string whose first `|ROOT|` characters are followed by `Docs/`
(or `Photo` / `Pictures/` / `Videos/` / `Camera/`) and that also embeds
`ROOT` later is misclassified as a media-root path.

Callers branch on this boolean for SQL table, virtual URI type,
Favorite/Trash strategy, and close URI. Confirmed and fixed by developers
(`DTS2026082012348`). Not necessarily present on this fork.

## Vulnerable Code

`frameworks/innerkitsimpl/media_library_helper/src/media_file_utils.cpp`
(`IsFileTablePath` ~2266; same pattern in `IsPhotoTablePath` ~2283):

```cpp
if (path.find(ROOT_MEDIA_DIR) == string::npos) {   // containment anywhere
    return false;
}
string relativePath = path.substr(ROOT_MEDIA_DIR.size());  // ALWAYS from index 0
if (relativePath.find(DOCS_PATH) == 0) {
    return true;
}
```

Sibling in the same feature already does a prefix check
(`GetRelativePathFromPath` in `medialibrary_object_utils.cpp`):

```cpp
if (path.find(ROOT_MEDIA_DIR) == 0) {
    relativePath = path.substr(ROOT_MEDIA_DIR.length());
}
```

## Trigger Conditions

1. `path` is longer than `ROOT_MEDIA_DIR` (`"/storage/cloud/files/"`, length 22).
2. `path` does **not** start with `ROOT`, but embeds `ROOT` later.
3. The prefix-sized slice from index 0 starts with `Docs/` (file table) or a
   photo bucket (`Photo`, `Pictures/`, `Videos/`, `Camera/`).

Canonical on-device library paths already start with `ROOT`, so the
false-positive family is non-canonical / crafted rather than the scanner
happy path.

## Impact

| check | witness |
|-------|---------|
| `path.starts_with(ROOT)` | **false** |
| `path.find(ROOT)` | 27 (embedded later) |
| `path.substr(ROOT.size())` | starts with `Docs/` |
| expected `IsFileTablePath` | **false** |
| actual `IsFileTablePath` | **true** |

- `GetTableNameByPath` / object_utils table selection → wrong table
  (`file` vs `Photos` vs `Audios`)
- `file_asset_napi` Favorite/Trash → `*ByInsert` vs `*ByUpdate`
- `fetch_result` / virtualId → `MEDIA_TYPE_FILE` URI for a non-Docs path

Medium: silent wrong-boolean on the path→table / path→compat-URI
classifier. Not High: common scanner inputs still agree with the contract.

## Minimal Counterexample

```text
ROOT = "/storage/cloud/files/"          # length 22
path = string(22, 'Q') + "Docs/" + ROOT + "x.pdf"
     = "QQQQQQQQQQQQQQQQQQQQQQDocs//storage/cloud/files/x.pdf"

IsFileTablePath(path)  →  true    // bug
Expected               →  false
```

Twin: `string(22, 'Q') + "Photo" + ROOT + "1.jpg"` → `IsPhotoTablePath`
true, expected false. Same FP for `Pictures/`, `Videos/`, `Camera/`.

## How PBT Detected This

Real-SUT harnesses
`pbt-native/media_file_utils_is_file_table_path_pbt_test.cpp` and
`pbt-native/media_file_utils_is_photo_table_path_pbt_test.cpp`.
Oracle: prefix check (`find == 0`) then relative bucket, matching
`GetRelativePathFromPath`.

| Test | Result |
|------|--------|
| `EmbeddedRootAfterDocsIsNotFileTablePath` | **FAIL** (RC) |
| `BugDocs_EmbeddedRootAfterSyntheticDocsHead_IsFalse` | **FAIL** (pinned) |
| `IsPhotoTablePath.AgreesWithPrefixOracle` | **FAIL** (differential) |
| `EmbeddedRootAfterEachBucket_IsFalse` | **FAIL** ×4 buckets |
| well-formed ROOT+Docs / ROOT+bucket / empty / short | PASS |

## Suggested Fix

Prefix check, then relative slice — both sites:

```diff
-    if (path.find(ROOT_MEDIA_DIR) == string::npos) {
+    if (path.find(ROOT_MEDIA_DIR) != 0) {
         return false;
     }
```

(`path.compare(0, ROOT_MEDIA_DIR.size(), ROOT_MEDIA_DIR) != 0` is
equivalent.) Existing unit tests and well-formed PBT props stay green;
false-positive props flip to pass.

## References

- Bug: `media_file_utils.cpp` (`IsFileTablePath`, `IsPhotoTablePath`)
- Callers: `medialibrary_object_utils.cpp`, `media_scanner_db.cpp`,
  `fetch_result.cpp`, `file_asset_napi.cpp`
- Sibling prefix check: `GetRelativePathFromPath`
- PBT: `pbt-native/media_file_utils_is_file_table_path_pbt_test.cpp`,
  `pbt-native/media_file_utils_is_photo_table_path_pbt_test.cpp`
- Local report: `multimedia_media_library/pbt-out/bug_reports/fixed/is_file_table_path_find_substr_mismatch.md`
- Internal issue: `DTS2026082012348` (fixed in internal system)
