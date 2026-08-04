---
id: OH-2026-DATAMGR-001
date: "2026-07-22"
repo: distributeddatamgr_datamgr_service
repo_url: https://gitcode.com/openharmony/distributeddatamgr_datamgr_service
title: "[Bug]: Constant::IsValidPath accepts lone \"..\""
cwe: CWE-22
cwe_name: Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/distributeddataservice/framework/utils/constant.cpp
file_paths:
  - services/distributeddataservice/framework/utils/constant.cpp
  - services/distributeddataservice/service/kvdb/kvdb_general_store.cpp
  - services/distributeddataservice/service/kvdb/kvdb_service_impl.cpp
author: Toan
internal_issue_id: DTS2026072223098
language: C++
---

## Summary

`Constant::IsValidPath` rejects only separator forms `"../…"` and `"…/.."`.
Bare `".."` matches neither flag and returns **true**. On the KVDB store path
this gates `meta.dataDir` before `SetKvStoreConfig`, so a `dataDir` of `".."`
passes and opens the store one level above the intended root.

Medium path-validation / defense-in-depth defect. Default create path uses
sanitized `DirectoryManager`; High would need proven attacker-settable custom
`baseDir`. Confirmed and fixed by developers (`DTS2026072223098`).

## Vulnerable Code

`services/distributeddataservice/framework/utils/constant.cpp` — `IsValidPath`
(~103):

```cpp
bool Constant::IsValidPath(const std::string &path)
{
    // rejects only "../…" (leading) and "…/.." (trailing)
    size_t pos = path.find(PATH_INVALID_FLAG_LEADING);   // "../"
    ...
    pos = path.rfind(PATH_INVALID_FLAG_TRAILING);        // "/.."
    ...
    return true;   // ".." matches neither → accepted
}
```

Caller — `kvdb_general_store.cpp` (~179):

```cpp
if (!Constant::IsValidPath(meta.dataDir)) {
    return;
}
manager_.SetKvStoreConfig({ meta.dataDir });
```

`dataDir` source (`kvdb_service_impl.cpp`): custom-dir uses app `baseDir`;
default path uses `DirectoryManager::GetStorePath` (sanitized).

Root cause: both invalid flags require a `/`. Bare `".."` has no separator, so
both searches miss.

## Trigger Conditions

1. `meta.dataDir` is exactly `".."` (custom-dir path with `baseDir == ".."`, if
   Options IPC allows it).
2. `IsValidPath("..")` returns true.
3. `SetKvStoreConfig` opens the store under the parent of the intended root.

## Impact

- Store opens under parent of intended root → wrong location / possible
  cross-store or sandbox escape relative to expected layout.
- Code defect is certain. Whether an untrusted caller can set `baseDir == ".."`
  depends on Options IPC (header outside this repo) — defense-in-depth at
  minimum.
- Not High: default create path does not use raw `".."`; High needs proven
  attacker-settable custom dir.
- Separator forms (`"../foo"`, `"foo/.."`, `"foo/../bar"`) correctly rejected.

## Minimal Counterexample

| input | expected | actual |
|-------|----------|--------|
| `".."` | false | **true** |
| `"../foo"` | false | false |
| `"foo/.."` | false | false |
| `"foo/../bar"` | false | false |
| `"foo"` | true | true |

## How PBT Detected This

`datamgr_pure_gates_wave10_pbt_test` (`Wave10_N280.ConstantDotDot`; same assert
in waves 11–16) — production SUT:

| Test | Result |
|------|--------|
| `Wave10_N280.ConstantDotDot` | **FAIL** (`EXPECT_FALSE(IsValidPath(".."))` — actual true) |

```bash
cmake -B pbt-native/build pbt-native
cmake --build pbt-native/build -j$(nproc) --target datamgr_pure_gates_wave10_pbt_test
(cd pbt-native/build && ctest -R wave10 --output-on-failure)
```

## Suggested Fix

```cpp
bool Constant::IsValidPath(const std::string &path)
{
    if (path == "..") {
        ZLOGE("invalid dataDir is %{public}s", Anonymous::Change(path).c_str());
        return false;
    }
    // existing "../" / "/.." checks …
}
```

Optional stronger fix: split on `/` and reject any segment equal to `".."`.
After fix, `Wave10_N280.ConstantDotDot` (and wave 11–16 twins) flip PASS.

## References

- Bug: `services/distributeddataservice/framework/utils/constant.cpp`
  (`IsValidPath`, `PATH_INVALID_FLAG_LEADING` / `TRAILING`)
- Caller: `kvdb_general_store.cpp` (`meta.dataDir` gate)
- `dataDir` assignment: `kvdb_service_impl.cpp` (custom `baseDir` vs
  `DirectoryManager`)
- PBT: `datamgr_pure_gates_wave10_pbt_test` (`Wave10_N280.ConstantDotDot`)
- Internal issue: `DTS2026072223098`
