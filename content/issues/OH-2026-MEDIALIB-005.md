---
id: OH-2026-MEDIALIB-005
date: "2026-08-26"
repo: multimedia_media_library
repo_url: https://gitcode.com/openharmony/multimedia_media_library
title: "[Bug]: GetVirtualPath / UpdateVirtualPath empty relativePath last-char UB"
cwe: CWE-125
cwe_name: Out-of-bounds Read
severity: HIGH
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/innerkitsimpl/medialibrary_data_extension/src/medialibrary_asset_operations.cpp
file_paths:
  - frameworks/innerkitsimpl/medialibrary_data_extension/src/medialibrary_asset_operations.cpp
author: Toan
internal_issue_id: DTS2608260052510
language: C++
---

## Summary

Both writers of `MEDIA_VIRTUAL_PATH` decide whether to insert `/` by reading
the last character of `relativePath` with **no empty check**.
`GetVirtualPath` uses `relativePath[relativePath.size() - 1]`;
`UpdateVirtualPath` uses `relativePath.back()`. Empty `relativePath` is a
production default (`FILE_RELATIVE_PATH_DEFAULT`,
`DEFAULT_ALBUM_RELATIVE_PATH` are `""`). `size_t` `0 - 1` wraps to
`SIZE_MAX` → ASan heap-buffer-overflow; `.back()` on empty `string` is UB.

Intended join for empty is `"/"` + `displayName`. UB happens first.
Same-repo siblings (`FormatRelativePath`, `GetRootDirFromRelativePath`)
already guard empty before `.back()`. Confirmed and fixed by developers
(`DTS2608260052510`). Not necessarily present on this fork.

## Vulnerable Code

`frameworks/innerkitsimpl/medialibrary_data_extension/src/medialibrary_asset_operations.cpp`:

```cpp
// GetVirtualPath ~918
if (relativePath[relativePath.size() - 1] != SLASH_CHAR) {
    return relativePath + SLASH_CHAR + displayName;
}

// UpdateVirtualPath ~1622
if (relativePath.back() != '/') {
    relativePath += '/';
}
```

`FillAssetInfo` stores `GetVirtualPath(fileAsset.GetRelativePath(),
fileAsset.GetDisplayName())` as `MEDIA_VIRTUAL_PATH`. Photo/audio update
paths call `UpdateVirtualPath`.

## Trigger Conditions

1. `GetRelativePath()` / album default is `""` (shipped cloud fixtures use
   `"relative_path":""`).
2. `FillAssetInfo` or photo/audio `UpdateVirtualPath` runs.
3. Last-char access on empty: `operator[]` at `SIZE_MAX`, or `.back()` UB.

Heap-allocated empty (`reserve(64)` then empty) is the ASan-visible form;
SSO empty is still UB.

## Impact

| Witness | Access | Empty `relativePath` |
|---------|--------|----------------------|
| `GetVirtualPath` | `relativePath[size() - 1]` | wrap → ASan OOB |
| `UpdateVirtualPath` | `relativePath.back()` | UB on empty `string` |

High: ASan heap-buffer-overflow / UB on a production default, not a crafted
edge. Canonical non-empty paths with/without trailing `/` are unaffected.

## Minimal Counterexample

```cpp
GetVirtualPath("", "photo.jpg");
// ASan: heap-buffer-overflow at medialibrary_asset_operations.cpp:918
// expected: "/photo.jpg"

std::string relativePath;
relativePath.back();  // same UB as UpdateVirtualPath
```

## How PBT Detected This

`pbt-native/medialibrary_asset_operations_get_virtual_path_pbt_test.cpp`
(production `GetVirtualPath` via `#line` extract). Oracle: empty relative
path joins as `"/"` + `displayName` and must not OOB.

| Case | Result |
|------|--------|
| `relativePath == ""`, `displayName == "photo.jpg"` | **FAIL** (ASan OOB) |
| heap-empty (`reserve(64)`) | **FAIL** (`heap-buffer-overflow`) |
| non-empty with / without trailing `/` | PASS |

Host UT `GetVirtualPathUt.HeapEmptyRelDoesNotOob` under ASan ABORTS (1 byte
left of the 65-byte region).

## Suggested Fix

Guard empty before the last-char read. Same predicate at both sites;
matches `FormatRelativePath` / `GetRootDirFromRelativePath`.

```diff
-    if (relativePath[relativePath.size() - 1] != SLASH_CHAR) {
+    if (relativePath.empty() || relativePath.back() != SLASH_CHAR) {
         return relativePath + SLASH_CHAR + displayName;
     }

-    if (relativePath.back() != '/') {
+    if (relativePath.empty() || relativePath.back() != '/') {
         relativePath += '/';
     }
```

`GetVirtualPath("", "photo.jpg")` → `"/photo.jpg"`. Non-empty paths
unchanged.

## References

- Bug: `medialibrary_asset_operations.cpp` (`GetVirtualPath`, `UpdateVirtualPath`)
- Callers: `FillAssetInfo`; photo/audio `UpdateVirtualPath`
- Sibling guards: `MediaFileUtils::FormatRelativePath`,
  `GetRootDirFromRelativePath`
- Defaults: `FILE_RELATIVE_PATH_DEFAULT`, `DEFAULT_ALBUM_RELATIVE_PATH` = `""`
- PBT: `pbt-native/medialibrary_asset_operations_get_virtual_path_pbt_test.cpp`
- Host UT: `pbt-native/medialibrary_asset_operations_get_virtual_path_ut.cpp`
- Local report: `multimedia_media_library/pbt-out/bug_reports/fixed/get_virtual_path_empty_rel_oob.md`
- Internal issue: `DTS2608260052510` (fixed in internal system)
