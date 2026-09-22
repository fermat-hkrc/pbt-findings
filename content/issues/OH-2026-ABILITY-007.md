---
id: OH-2026-ABILITY-007
date: "2026-07-25"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: ParseNormalizedOhmUrl short import path substr throws std::out_of_range on preload-SO startup"
cwe: CWE-248
cwe_name: Uncaught Exception
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/appkit/app_startup/preload_so_startup_task.cpp
file_paths:
  - frameworks/native/appkit/app_startup/preload_so_startup_task.cpp
author: Toan
internal_issue_id: DTS2026072515209
language: C++
---

## Summary

`ParseNormalizedOhmUrl` accepts a 5-field `@normalized:` URL, then always
strips a `lib` prefix and `.so` suffix from the import path with
`soName.substr(SO_PREFIX_LEN, soName.size() - SO_PREFIX_LEN - SO_SUFFIX_LEN)`
(`SO_PREFIX_LEN = SO_SUFFIX_LEN = 3`). There is **no length guard**. When the
import segment is shorter than 3 (`""`, `"x"`, `"ab"`), `substr(3, …)` throws
`std::out_of_range`.

The throw is uncaught. `ParseOhmUrl` and `PreloadSoStartupTask::RunTaskInit`
have no `try`/`catch`. Bad **field count** already returns
`ERR_STARTUP_INVALID_VALUE` (soft-fail: log and skip the task). A short import
bypasses that path and aborts the process.

Confirmed and fixed under `DTS2026072515209`.

## Vulnerable Code

`frameworks/native/appkit/app_startup/preload_so_startup_task.cpp` —
`ParseNormalizedOhmUrl` (~56–64):

```cpp
if (res.size() != OHM_URL_NORMALIZED_ARGS_NUM) {
    return ERR_STARTUP_INVALID_VALUE;   // soft fail — good
}
soName = res[OHM_URL_NORMALIZED_IMPORT_PATH_INDEX];  // field 3 of 5
// Delete the prefix "lib" and suffix ".so".
soName = soName.substr(SO_PREFIX_LEN, soName.size() - SO_PREFIX_LEN - SO_SUFFIX_LEN);
// SO_PREFIX_LEN = SO_SUFFIX_LEN = 3; no length guard
return ERR_OK;
```

`std::string::substr(pos, n)` throws `std::out_of_range` when `pos > size()`,
i.e. `importPath.size() < 3`. `RunTaskInit` only handles error **codes**:

```cpp
if (code != ERR_OK) {
    TAG_LOGW(...);
    return ERR_OK;   // never reached if substr throws
}
```

## Trigger Conditions

All of:

1. `ohmUrl_` is a 5-field `@normalized:` URL (passes the field-count check).
2. Import path (field 3) has length **0, 1, or 2**.
3. The URL is registered as a preload-SO startup task (`PreloadSoStartupTask`
   ctor / app startup config).

A malformed normalized URL in that config is enough — no second-process attack
if the app ships bad startup metadata. Normal `lib…so` imports are long enough.

## Impact

- Uncaught `std::out_of_range` on preload-SO init → **process terminate**.
- Sibling bad field-count path is a logged skip. This throw **bypasses** that
  dispatcher handling.
- **Medium**, not High: needs developer/config bad URL, not random UI input.
  Crash-on-bad-config, not a remote unauthenticated exploit by itself.

Length 3–5 / trailing-slash `@app:` empty `soName` with `ERR_OK` is a separate
residual (not this ticket).

## Minimal Counterexample

```
ohmUrl = "@normalized:Y&&&x&1"     // import path "x", size 1
// or  = "@normalized:Y&&&&1"      // import path "", size 0

// substr(3, …) with size < 3 → std::out_of_range
Production: ParseOhmUrl → throws (uncaught in RunTaskInit)
Expected:   ERR_STARTUP_INVALID_VALUE, no throw
```

| Import path | size | Behavior |
|-------------|------|----------|
| `""` / `"x"` / `"ab"` | 0–2 | **`substr` throws** |
| `"lib"` … length 3–5 | 3–5 | no throw; strip can yield empty/`ERR_OK` (separate residual) |
| `"libfoo.so"` | 9 | OK → `"foo"` |

## How PBT Detected This

Harness: `pbt-native/ohm_url_parse_pbt_test.cpp` (extracted from
`preload_so_startup_task.cpp`, no logic rewrite). Contract: invalid ohmUrl
returns `ERR_STARTUP_INVALID_VALUE`, not throw — the same-function field-count
path already encodes that. Strip assumes `lib` + `.so`, so
`size >= SO_PREFIX_LEN + SO_SUFFIX_LEN` (6) before `substr`, or reject.

| Property | Result |
|----------|--------|
| `ShortImportPathMustNotThrow` | **FAIL** (does not survive) |
| `EmptyImportPathThrowsOutOfRange` / `ShortImportPathThrowsOutOfRange` | PASS (documents throw) |
| `WellFormedNormalizedStripsLibSo` / `WellFormedAppRoundTrip` | PASS |

## Suggested Fix

Reject short import paths before `substr`, then refuse an empty stripped name:

```diff
 soName = res[OHM_URL_NORMALIZED_IMPORT_PATH_INDEX];
+if (soName.size() < SO_PREFIX_LEN + SO_SUFFIX_LEN) {
+    TAG_LOGE(AAFwkTag::STARTUP, "invalid import path in ohmUrl: %{public}s", ohmUrl.c_str());
+    return ERR_STARTUP_INVALID_VALUE;
+}
 soName = soName.substr(SO_PREFIX_LEN, soName.size() - SO_PREFIX_LEN - SO_SUFFIX_LEN);
+if (soName.empty()) {
+    return ERR_STARTUP_INVALID_VALUE;
+}
+return ERR_OK;
```

After fix: `ShortImportPathMustNotThrow` → PASS; flip throw-pinning regressions
to `EXPECT_EQ(ERR_STARTUP_INVALID_VALUE)`.

## References

- Bug: `frameworks/native/appkit/app_startup/preload_so_startup_task.cpp` —
  `ParseNormalizedOhmUrl` / `ParseOhmUrl` / `PreloadSoStartupTask::RunTaskInit`
- PBT: `pbt-native/ohm_url_parse_pbt_test.cpp`
- Cloned report: `pbt-out/bug_reports/fixed/parse_normalized_ohmurl_short_import_substr_throw.md`
- Related uncaught / npos-guard findings:
  [OH-2026-ABILITY-001](OH-2026-ABILITY-001.md) (`erase(rfind('.'))`),
  [OH-2026-ABILITY-003](OH-2026-ABILITY-003.md)
- Internal issue: `DTS2026072515209`
