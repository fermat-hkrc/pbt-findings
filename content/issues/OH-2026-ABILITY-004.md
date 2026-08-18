---
id: OH-2026-ABILITY-004
date: "2026-07-31"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: CheckFileManagerUriPermission matches Download/Desktop/Documents prefix without '/' boundary"
cwe: CWE-863
cwe_name: Incorrect Authorization
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/uripermmgr/src/file_permission_manager.cpp
file_paths:
  - services/uripermmgr/src/file_permission_manager.cpp
author: Toan
internal_issue_id: DTS2026073173354
language: C++
---

## Summary

`CheckFileManagerUriPermission` decides "is this path under the Download /
Desktop / Documents folder" with a bare character-prefix test:
`path.find(PREFIX) == 0`. The three constants carry **no trailing `/`**, so
sibling directories (`…/DownloadEvil`, `…/DesktopEvil`) and glued strings
(`…/Download` + `bundleName`) pass as in-folder. In the Download branch the
remainder's first segment being equal to `bundleName` short-circuits to
`return true` **without** an RW permission check.

Permission-scope confusion on the uripermmgr security boundary (no crash).
The sibling `APPDATA_URI` in the same file already does it right: trailing
`/` + `StartsWithIgnoreCase`. Confirmed and fixed by developers
(`DTS2026073173354`).

## Vulnerable Code

`services/uripermmgr/src/file_permission_manager.cpp` (~125–154):

```cpp
const std::string DOWNLOAD_PATH  = "/storage/Users/currentUser/Download";   // no '/'
const std::string DESKTOP_PATH   = "/storage/Users/currentUser/Desktop";
const std::string DOCUMENTS_PATH = "/storage/Users/currentUser/Documents";
const std::string APPDATA_URI    = "/storage/Users/currentUser/appdata/";  // trailing '/'

if (path.find(DOWNLOAD_PATH) == 0) {
    path = path.substr(DOWNLOAD_PATH.size());
    if (path.find(BACKFLASH) == 0) { path = path.substr(1); }
    // first segment == bundleName → return true (no RW check)
    // else VerifyRWDownloadPermission()
}
if (path.find(DESKTOP_PATH) == 0)  { return VerifyRWDeskTopPermission(); }
if (path.find(DOCUMENTS_PATH) == 0){ return VerifyRWDocumentsPermission(); }
```

Call site (`CheckUriPersistentPermission` ~181–184): authority `"docs"` and
this check true → grant without the sandbox persist path.

## Trigger Conditions

1. A file-manager URI reaches `CheckUriPersistentPermission` with authority
   `"docs"`; `FileUri::GetRealPathBySA` yields a real path.
2. Path starts with a folder name but **not** at a `/` boundary —
   `…/DownloadEvil/x`, or `…/Downloadcom.ex` with bundle `com.ex`.
3. Raw `find(PREFIX) == 0` accepts it → RW-scope branch / Download bundle
   shortcut applies to a path that is **not** under the folder.

Honest limit: no proven field URI that emits `DownloadEvil` / glued paths —
which is why this is MEDIUM, not HIGH.

## Impact

| Outcome | When |
|---------|------|
| **RW scope expand** | Token has `VerifyRWDownload/Desktop/Documents`; path is `PREFIX` + non-`/` suffix (`DownloadEvil`) → treated as in-folder |
| **Download auto-grant** | Remainder's first segment equals `bundleName` without `/` after `Download` (glued path) → `return true` with no RW check |

Not claimed: unconditional grant without any RW permission (except the
Download+bundleName glue case), or a proven device-side producer of such
paths.

## Minimal Counterexample

| Path | Under folder? | `find(PREFIX)==0` |
|------|---------------|-------------------|
| `…/Download/foo` | yes | yes |
| `…/Download` | yes | yes |
| **`…/DownloadEvil`** | **no** | **yes** |
| **`…/Download` + `com.app` (glued)** | **no** | **yes** → bundle shortcut may auto-grant |
| `…/DesktopEvil` / `…/DocumentsEvil` | no | yes → RW* branch |

## How PBT Detected This

Three harnesses (`download` / `desktop` / `documents_path_prefix_pbt_test`)
compare the production membership formula against a slash-boundary oracle:

```cpp
bool IsPathPrefixForPbt(path) { return path.find(PATH) == 0; }       // production shape
bool IsPathSafeForPbt(path) { /* PATH + optional '/' remainder */ } // oracle
// EvilMatches: prefix true, safe false → FAIL, shrinks to glued string
```

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target \
  download_path_prefix_pbt_test desktop_path_prefix_pbt_test documents_path_prefix_pbt_test
ctest --test-dir pbt-native/build -R 'path_prefix' --output-on-failure
```

## Suggested Fix

Path-component prefix, mirroring the in-file `APPDATA_URI` convention:

```cpp
static bool IsPathUnder(const std::string &path, const std::string &prefix)
{
    if (path.compare(0, prefix.size(), prefix) != 0) {
        return false;
    }
    return path.size() == prefix.size() || path[prefix.size()] == '/';
}

// IsPathUnder(path, DOWNLOAD_PATH) / DESKTOP_PATH / DOCUMENTS_PATH
// or give the constants a trailing '/' like APPDATA_URI
```

After the fix: evil / glued paths → false; real children unchanged.

## References

- Bug: `services/uripermmgr/src/file_permission_manager.cpp`
  (`CheckFileManagerUriPermission`, `DOWNLOAD_PATH` / `DESKTOP_PATH` /
  `DOCUMENTS_PATH`)
- Correct sibling in same file: `APPDATA_URI` (trailing `/` +
  `StartsWithIgnoreCase`)
- Caller: `CheckUriPersistentPermission` (~181–184)
- PBT: `pbt-native/download_path_prefix_pbt_test.cpp`,
  `pbt-native/desktop_path_prefix_pbt_test.cpp`,
  `pbt-native/documents_path_prefix_pbt_test.cpp`
- Internal issue: `DTS2026073173354` (fixed in internal system)
