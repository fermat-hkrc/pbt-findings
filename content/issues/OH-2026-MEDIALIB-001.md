---
id: OH-2026-MEDIALIB-001
date: "2026-07-24"
repo: multimedia_media_library
repo_url: https://gitcode.com/openharmony/multimedia_media_library
title: "[Bug]: GetFileIdStr returns bucket name on bucket-only URI (npos+1 wrap)"
cwe: CWE-191
cwe_name: Integer Underflow (Wrap or Wraparound)
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: common/utils/src/media_uri_utils.cpp
file_paths:
  - common/utils/src/media_uri_utils.cpp
  - services/media_permission/src/media_permission_helper.cpp
  - services/media_assets_manager/src/media_assets_service.cpp
author: Toan
internal_issue_id: DTS2026072454808
language: C++
---

## Summary

`MediaUriUtils::GetFileIdStr` extracts the file-id segment with
`tmp.substr(tmp.find_first_of('/') + 1)`. When the post-prefix remainder has
**no** `/` (bucket-only URI `file://media/<bucket>`), `find_first_of` returns
`npos`; `npos + 1` wraps to `0` in `size_t`, so `substr(0)` returns the whole
remainder — the **bucket name** — instead of the error sentinel `"-1"`.

Live callers then look up / query that string. Not crash/OOB; typical field
outcome is **fail-closed miss** (no row for `FILE_ID = "Photo"`), not a grant
of another asset’s rights. Confirmed and fixed by developers
(`DTS2026072454808`).

## Vulnerable Code

`common/utils/src/media_uri_utils.cpp` — `GetFileIdStr` (~167):

```cpp
std::string tmp = uri.substr(URI_PREFIX_INNER.size());   // e.g. "Photo"
tmp = tmp.substr(tmp.find_first_of('/') + 1);            // npos + 1 → 0
std::string fileIdStr = tmp.substr(0, tmp.find_first_of('/')); // "Photo"
if (fileIdStr.empty()) { return ERROR; }                 // not empty → returns "Photo"
return fileIdStr;
```

Callers:

- `media_permission_helper.cpp` — pushes result into photo/audio id vectors and
  `FILE_ID` predicates **without** rejecting non-`"-1"` garbage.
- `media_assets_service.cpp` (`CollectCheckedPhotoUris`) — treats only `empty`
  / `"-1"` as format error; bucket string is accepted as a candidate id.

Sibling already correct: `file://media/Photo/` → after slash, empty segment →
`"-1"` via the empty check. Only the **missing** second slash is mishandled.

Root cause: never tests `find` result `== npos` before `+ 1`.

## Trigger Conditions

1. Input URI is bucket-only (or truncated): `file://media/Photo` (no file-id
   segment after bucket).
2. `GetFileIdStr` wraps `npos + 1` → returns `"Photo"` instead of `"-1"`.
3. Callers that special-case `"-1"` skip the format-error path and continue
   with the bucket string as a file id.

## Impact

| Input | Today | After fix |
|-------|--------|-----------|
| `file://media/Photo/123/…` | `"123"` | unchanged |
| `file://media/Photo/` | `"-1"` | unchanged |
| `file://media/Photo` | **`"Photo"`** | `"-1"` |

- **Permission helper:** id vector / `FILE_ID IN (...)` gets `"Photo"`. DB
  usually has no such file id → permission check **misses** (deny / false),
  not a silent grant of another user’s asset.
- **Assets service:** does **not** classify as `URI_FORMAT_ERROR` (only
  `"-1"` / empty); continues with bogus id → `FILE_NOT_EXIST`-style path.
- Well-formed `…/<bucket>/<fileId>/…` paths unaffected.
- How often clients send bare `file://media/Photo` is unproven — treat as
  malformed/truncated input. Not crash, OOB, or privilege escalation on the
  traced paths.
- Medium: silent wrong id / fail-closed miss on live callers.

## Minimal Counterexample

```
GetFileIdStr("file://media/Photo")  →  "Photo"   // bug
Expected                            →  "-1"

// size_t: find_first_of('/') == npos; npos + 1 == 0; substr(0) == "Photo"
```

Same for `file://media/Audio`, `file://media/<any single segment>`.

## How PBT Detected This

`pbt-native/media_uri_utils_get_file_id_str_pbt_test`:

| Test | Result |
|------|--------|
| `BucketOnlyUriHasNoFileId` | **FAIL** (`"Photo"` vs `"-1"`) |
| Wrong prefix / empty segment / well-formed round-trip | PASS |

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target media_uri_utils_get_file_id_str_pbt_test
./pbt-native/build/media_uri_utils_get_file_id_str_pbt_test \
  --gtest_filter='GetFileIdStrPbt_BugDocs.BucketOnlyUriHasNoFileId'
```

## Suggested Fix

```cpp
std::string tmp = uri.substr(URI_PREFIX_INNER.size());
size_t slash = tmp.find_first_of('/');
if (slash == std::string::npos) {
    MEDIA_ERR_LOG("uri has no file id segment");
    return ERROR;
}
tmp = tmp.substr(slash + 1);
std::string fileIdStr = tmp.substr(0, tmp.find_first_of('/'));
if (fileIdStr.empty()) {
    MEDIA_ERR_LOG("fileId is empty");
    return ERROR;
}
return fileIdStr;
```

After fix: `BucketOnlyUriHasNoFileId` → PASS; existing empty-segment /
round-trip props stay PASS.

## References

- Bug: `common/utils/src/media_uri_utils.cpp` (`GetFileIdStr`)
- Callers: `media_permission_helper.cpp`; `media_assets_service.cpp`
  (`CollectCheckedPhotoUris`)
- Distinct from `CheckIsCloudFile` assign-vs-eq
- PBT: `pbt-native/media_uri_utils_get_file_id_str_pbt_test.cpp`
- Internal issue: `DTS2026072454808`
