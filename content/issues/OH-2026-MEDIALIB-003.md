---
id: OH-2026-MEDIALIB-003
date: "2026-08-17"
repo: multimedia_media_library
repo_url: https://gitcode.com/openharmony/multimedia_media_library
title: "[Bug]: GetDateAddedMs calls GetDateModified (copy-paste)"
cwe: CWE-682
cwe_name: Incorrect Calculation
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/c_api/media_asset_impl.cpp
file_paths:
  - frameworks/native/c_api/media_asset_impl.cpp
  - frameworks/native/c_api/media_asset_capi/media_asset_capi.cpp
author: Toan
internal_issue_id: DTS2026081715287
language: C++
---

## Summary

`MediaAssetImpl::GetDateAddedMs` is named and exported as **date added (ms)**
(`OH_MediaAsset_GetDateAddedMs`), but the body copies
`fileAsset_->GetDateModified()`. Whenever added ≠ modified, the public ms
API returns last-modified instead of date-added. Sibling `GetDateAdded`
already uses `GetDateAdded()`; sibling `GetDateModifiedMs` correctly uses
`GetDateModified()`. Copy-paste of the ModifiedMs body under the AddedMs
name. Confirmed and fixed by developers (`DTS2026081715287`). Not
necessarily present on this fork.

## Vulnerable Code

`frameworks/native/c_api/media_asset_impl.cpp` (~150–175):

```cpp
// GetDateAdded — OK
*dateAdded = static_cast<uint32_t>(fileAsset_->GetDateAdded() / MILLI_TO_SECOND);

// GetDateAddedMs — BUG
*dateAddedMs = static_cast<uint32_t>(fileAsset_->GetDateModified());  // wrong field

// GetDateModifiedMs — OK (same shape, right field)
*dateModifiedMs = static_cast<uint32_t>(fileAsset_->GetDateModified());
```

Public wrapper: `OH_MediaAsset_GetDateAddedMs` in
`media_asset_capi.cpp`.

## Trigger Conditions

1. C-API consumer calls `OH_MediaAsset_GetDateAddedMs`.
2. The asset has been edited so `GetDateAdded() ≠ GetDateModified()`.
3. Returned value is the modified timestamp (ms), not added.

Never-edited assets hide the bug (`added == modified`).

## Impact

| Asset | Added | Modified | `GetDateAddedMs` | Expected |
|-------|-------|----------|------------------|----------|
| photo | T_add | T_mod ≠ T_add | **T_mod** | T_add |
| never edited | T | T | T (bug hidden) | T |

`OH_MediaAsset_GetDateAddedMs` and `OH_MediaAsset_GetDateModifiedMs` return
**identical** values for every asset. Gallery “recently added” vs “recently
edited” collapse when both ms APIs are used. Seconds API `GetDateAdded` is
correct. Medium: wrong field only — no crash, OOB, hang, or security bypass.
(`uint32_t` truncation of large int64 ms is a separate footgun.)

## Minimal Counterexample

```cpp
// fileAsset: GetDateAdded() == 1000, GetDateModified() == 2000
uint32_t addedMs = 0;
MediaAssetImpl::GetDateAddedMs(&addedMs);
// actual: 2000   expected: 1000
```

## How PBT Detected This

Structural / sibling-pair PBT in `pbt-native/doc_pbt_test.cpp` and
`pbt-native/new_bugs_pbt_test.cpp`. Oracle: `GetDateAddedMs` sources
`GetDateAdded()`, not `GetDateModified()`; AddedMs and ModifiedMs must
differ when the two fields differ.

| Case | Result |
|------|--------|
| `GetDateAddedMs` call site is `GetDateModified()` | **FAIL** (wrong source) |
| AddedMs ≡ ModifiedMs for every asset | **FAIL** (identical bodies) |
| `GetDateAdded` / `GetDateModifiedMs` siblings | PASS |

## Suggested Fix

```diff
 MediaLibrary_ErrorCode MediaAssetImpl::GetDateAddedMs(uint32_t* dateAddedMs)
 {
     CHECK_AND_RETURN_RET_LOG(fileAsset_ != nullptr, MEDIA_LIBRARY_INTERNAL_SYSTEM_ERROR, "fileAsset is nullptr");
-    *dateAddedMs = static_cast<uint32_t>(fileAsset_->GetDateModified());
+    *dateAddedMs = static_cast<uint32_t>(fileAsset_->GetDateAdded());
     return MEDIA_LIBRARY_OK;
 }
```

## References

- Bug: `frameworks/native/c_api/media_asset_impl.cpp` (`GetDateAddedMs`)
- Public API: `OH_MediaAsset_GetDateAddedMs` (`media_asset_capi.cpp`)
- Siblings: `GetDateAdded`, `GetDateModifiedMs` (same file)
- PBT: `pbt-native/doc_pbt_test.cpp`, `pbt-native/new_bugs_pbt_test.cpp`
- Local report: `multimedia_media_library/pbt-out/bug_reports/fixed/GetDateAddedMs_uses_GetDateModified_copy_paste.md`
- Internal issue: `DTS2026081715287` (fixed in internal system)
