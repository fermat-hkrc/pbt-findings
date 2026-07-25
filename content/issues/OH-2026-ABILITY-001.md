---
id: OH-2026-ABILITY-001
date: "2026-07-15"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: Stage-model .abc path builder unguarded erase(rfind('.')) crashes app on extensionless srcEntrance"
cwe: CWE-754
cwe_name: Improper Check or Handling of Exceptional Conditions
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/ability/native/ability_runtime/js_ui_ability.cpp
file_paths:
  - frameworks/native/ability/native/ability_runtime/js_ui_ability.cpp
  - frameworks/native/appkit/app/main_thread.cpp
  - frameworks/native/appkit/ability_runtime/app/js_ability_stage.cpp
  - frameworks/native/ability/native/js_ability.cpp
  - frameworks/native/ability/native/ui_extension_ability/js_ui_extension.cpp
author: Toan
internal_issue_id: DTS2026071544397
language: C++
---

## Summary

The Stage-model `.abc` path builder constructs the compiled-arkts path from the
HAP's module name and `srcEntrance`, then strips the source extension by calling
`srcPath.erase(srcPath.rfind("."))`. There is **no `npos` guard**. When the
combined path has no `.` (a non-empty `srcEntrance` with no file extension),
`rfind(".")` returns `npos`, `erase(npos)` throws `std::out_of_range`, and the
app process aborts at ability/stage/extension start.

The same three-line pattern is copy-pasted across **10+ production load sites**
(UIAbility, AbilityStage, ServiceExtension, FormExtension, AutoFill, UIExtension,
AppService, legacy FA ability, main-thread preload). A sibling site
(`js_child_process.cpp`) was already fixed with the `npos` guard in 2023-10
(`dc1673b2d6`) but the fix was never generalized to the ability load sites.

Confirmed and fixed under `DTS2026071544397`.

## Vulnerable Code

`frameworks/native/ability/native/ability_runtime/js_ui_ability.cpp` — Stage
model branch (`JsUIAbility::Init`, ~377), after the empty-`srcEntrance` early
return:

```cpp
std::string srcPath(abilityInfo->package);
srcPath.append("/");
srcPath.append(abilityInfo->srcEntrance);
srcPath.erase(srcPath.rfind("."));   // no npos check; whole-path last dot
srcPath.append(".abc");
```

Same unguarded block in 10+ sites (non-exhaustive):

| File | Role |
|------|------|
| `js_ui_ability.cpp` | UIAbility load |
| `main_thread.cpp` | PreloadMainAbility |
| `js_ability_stage.cpp` | AbilityStage load |
| `js_ui_extension.cpp` / `js_ui_extension_base.cpp` | UIExtension |
| `js_service_extension.cpp` | ServiceExtension GetSrcPath |
| `js_ability.cpp` | FA/legacy ability |
| `js_form_extension.cpp` | Form extension |
| `js_app_service_extension.cpp` | App service extension |
| `js_auto_fill_extension.cpp` | AutoFill |
| `js_ui_service_extension.cpp` | UI service extension |

Already-fixed sibling (`js_child_process.cpp`, 2023-10):

```cpp
if (srcPath.rfind(".") != std::string::npos) {
    srcPath.erase(srcPath.rfind("."));
}
srcPath.append(".abc");
```

## Trigger Conditions

All of:

1. Stage-model load (`isModuleJson` / module.json path) on an unguarded site.
2. `srcEntrance` is **not empty** (empty → early return).
3. `package + "/" + srcEntrance` contains **no `.`` — i.e. an extensionless
   `srcEntrance` whose module/package name has no dot either.

Then `rfind(".")` = `npos` → `erase(npos)` throws `std::out_of_range` → app
abort at init.

Bundle parser (`module_profile`) accepts any string for `srcEntrance`/`srcEntry`
— **no extension is required**. The "`srcEntrance` always has `.`" assumption is
a DevEco packing convention, not a runtime invariant; no upper-level code
validates a file extension.

### Defect B (wrong path, no crash)

When the last `.` is in a **directory** and the file has no extension, the
whole-path `rfind` strips the wrong segment:

```
entry + ets/v1.2/Index  →  entry/ets/v1.abc   (wanted …/Index.abc)
```

Files with an extension still work even with dotted directories
(`…/v1.2/Index.ets` → `…/Index.abc`).

## Impact

- **Process death at app start** for a non-empty, extensionless `srcEntrance`
  (defect A). The app dies in its own process at start ("won't open"), not in
  AMS — no dedicated HiSysEvent on this line, so the crash is hard to cluster.
- **Wrong compiled-arkts path** when a directory has `.` and the file has no
  extension (defect B).
- **Medium:** live Stage load path, hard process abort when the trigger hits,
  but field likelihood is low — official producers (DevEco / in-tree system
  HAPs) always emit `.ets`/`.ts`, so the dangerous branch is not taken on store
  apps. Input is the app's own HAP metadata, not arbitrary remote IPC.

## Minimal Counterexample

| package | srcEntrance | full path | result |
|---------|-------------|-----------|--------|
| `entry` | `ets/pages/Index` | `entry/ets/pages/Index` | **abort** (no `.`) |
| `entry` | `ets/entryability/EntryAbility.ets` | has `.` | OK |
| `entry` | `""` | empty early return | OK |

```cpp
std::string srcPath("entry");
srcPath.append("/");
srcPath.append("ets/pages/Index");      // no '.'
srcPath.erase(srcPath.rfind("."));      // rfind == npos → erase(npos) → throw
// → std::out_of_range → app abort
```

Defect B:

```
BuildJsAbilityAbcPath("entry", "ets/v1.2/Index")
  SUT:    "entry/ets/v1.abc"        ← wrong (strips dotted dir)
  safe:   "entry/ets/v1.2/Index.abc"
```

## How PBT Detected This

`pbt-native/js_ability_abc_path_pbt_test` (extracted pure builder):

- `NeverThrowsOnAnySegments` / `ExtensionlessPathCrashesToday` — **FAIL**:
  `("entry", "ets/pages/Index")` throws `basic_string::erase npos`.
- `VersionedDirWithoutExt_WrongAbcPathToday` — **FAIL**: dotted dir strips
  wrong segment.
- Normal `.ets` path + file-extension property — PASS (the happy path that kept
  store apps green and hid the bug).

## Suggested Fix

Close defect A: guard `erase` on `npos` — the same one-liner `js_child_process`
already uses (apply across all unguarded sites, or centralize in a shared util):

```cpp
srcPath.append("/");
srcPath.append(abilityInfo->srcEntrance);
if (srcPath.rfind(".") != std::string::npos) {
    srcPath.erase(srcPath.rfind("."));
}
srcPath.append(".abc");
```

Happy path with `.ets`/`.ts` is unchanged; extensionless metadata appends
`.abc` only (soft load fail if missing, not process kill).

Optional full fix (defect A + B): operate on the filename-only stem so a dotted
directory is not stripped:

```cpp
auto slash = srcPath.rfind('/');
std::string file = (slash == std::string::npos) ? srcPath : srcPath.substr(slash + 1);
std::string dir  = (slash == std::string::npos) ? std::string() : srcPath.substr(0, slash + 1);
auto dot = file.rfind('.');
if (dot != std::string::npos) {
    file = file.substr(0, dot);
}
srcPath = dir + file + ".abc";
```

## References

- Bug (unguarded sites): `js_ui_ability.cpp`, `main_thread.cpp`,
  `js_ability_stage.cpp`, `js_ability.cpp`, `js_ui_extension.cpp`,
  `js_ui_extension_base.cpp`, `js_service_extension.cpp`, `js_form_extension.cpp`,
  `js_app_service_extension.cpp`, `js_auto_fill_extension.cpp`,
  `js_ui_service_extension.cpp`
- Already-fixed sibling: `js_child_process.cpp` (`dc1673b2d6`, 2023-10)
- Guarded precedent: `JsUIAbility::TryLoadSkillEntry`,
  `JsServiceExtension::TryLoadSkillEntry`, `js_startup_task`,
  `ets_ability_stage`, `js_insight_intent_executor`, `ExtractBaseName`
- PBT: `pbt-native/js_ability_abc_path_pbt_test`
- Internal issue: `DTS2026071544397`
