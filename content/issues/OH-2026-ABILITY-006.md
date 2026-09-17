---
id: OH-2026-ABILITY-006
date: "2026-08-08"
repo: ability_ability_runtime
repo_url: https://gitcode.com/openharmony/ability_ability_runtime
title: "[Bug]: DataUriUtils::AttachId missing rfind npos guard — replace(npos+1) wraps to 0 and rewrites the URI from the start"
cwe: CWE-754
cwe_name: Improper Check or Handling of Exceptional Conditions
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: frameworks/native/ability/native/data_uri_utils.cpp
file_paths:
  - frameworks/native/ability/native/data_uri_utils.cpp
author: Toan
internal_issue_id: DTS2026080812965
language: C++
---

## Summary

`DataUriUtils::AttachId` appends `/<id>` onto the last path segment by
rewriting the full URI string: it `rfind`s `"/" + lastPath` inside
`ToString()`, then calls `replace(lastPathPos + 1, …)` — with **no `npos`
guard**. When the `rfind` misses (path segments non-empty but the segment text
does not occur as `"/"+lastPath` in the string form, e.g. encoding / form
mismatch), `lastPathPos == std::string::npos` and `npos + 1` **wraps the
`size_t` back to 0**. The `replace` then rewrites the URI **from the first
character**, silently corrupting scheme/authority/path instead of failing
closed.

The same file already guards this exact pattern in the sibling
`UriUpateLastPath` (~214–216): `if (lastPathPos == -1) return dataUri;` before
`replace`. `AttachId` drops that guard.

Confirmed and fixed under `DTS2026080812965`.

## Vulnerable Code

`frameworks/native/ability/native/data_uri_utils.cpp` — `AttachId` (~52–85):

```cpp
string lastPath = pathVector[pathVector.size() - 1];
// ...
string newLastPath = lastPath + string(SEPARATOR) + string(longBuffer);

// find "/+lastPath"
string tempLastPath = string(SEPARATOR) + lastPath;
auto lastPathPos = uriString.rfind(tempLastPath);   // may be npos — NO CHECK

uriString.replace(lastPathPos + 1, tempLastPath.size() - 1, newLastPath.c_str());
return Uri(uriString);
```

Guarded sibling in the same file (`UriUpateLastPath`):

```cpp
int lastPathPos = (int)uriString.rfind(string(SEPARATOR) + lastPath);
if (lastPathPos == -1) {
    return dataUri;
}
uriString.replace(lastPathPos, lastPath.size() + 1, strUpdateLastPath);
```

## Trigger Conditions

All of:

1. `GetPath()` non-empty and `GetPathSegments()` non-empty (past both early
   returns).
2. `sprintf_s` of the id succeeds.
3. `rfind("/" + lastPath)` **misses** — the last segment text does not appear
   as `"/"+lastPath` in `ToString()`.

Step 3 needs the segment form to differ from the string form (percent-encoding,
normalized spelling). The common `scheme://authority/path1/…/lastPath` shape
hits, which keeps store apps on the happy path — but the API takes any
RFC 2396 URI, and nothing upstream guarantees the two representations agree.

## Impact

- `replace` from offset 0 **overwrites scheme/host/entire URI** with
  `lastPath + "/" + id` — garbage URI, not a no-op.
- Downstream open/query/DataAbility consumers of the returned Uri get a wrong
  or unparseable identifier (wrong path → miss; wrong scheme → hard failure).
- **Not a guaranteed crash** — a silent data-integrity / correctness bug on
  the miss path. **Medium** for the same reason as the sibling
  [OH-2026-ABILITY-001](OH-2026-ABILITY-001.md) npos bug: live public-API code
  path, hard failure when triggered, low field likelihood because well-formed
  URIs hit.

## Minimal Counterexample

| URI shape | `rfind("/"+lastPath)` | Production result | Expected (sibling) |
|-----------|------------------------|-------------------|--------------------|
| `dataability://.../foo`, last segment `foo` | hit | `…/foo/<id>` | same |
| segments non-empty, string form has no `"/"+lastPath` (encoding/form mismatch) | **npos** | **`replace` from 0 — URI corrupted from the start** | return original `dataUri` |

```cpp
// lastPathPos == npos
uriString.replace(lastPathPos + 1, tempLastPath.size() - 1, newLastPath.c_str());
// npos + 1 wraps size_t to 0
// → replace(0, …) → scheme/host/whole string overwritten
```

## How PBT Detected This

Structural contrast surfaced while building the property-based harness for the
same file (`pbt-native/data_uri_float_pbt_test`, the `GetId`/`IsNumber`
predicate bug [OH-2026-ABILITY-002](OH-2026-ABILITY-002.md)): the extracted
model for `AttachId` could not state the round-trip property
`GetId(AttachId(u, id)) == id` because the rewrite step assumes
`rfind` always hits. The same-file sibling `UriUpateLastPath` already encodes
the correct fail-closed contract (`rfind` miss → return input unchanged);
`AttachId` diverges from it. Contract: on a miss, never call `replace` with an
unchecked `rfind` result.

## Suggested Fix

Guard on `npos`, fail closed exactly like `UriUpateLastPath`:

```diff
 string tempLastPath = string(SEPARATOR) + lastPath;
 auto lastPathPos = uriString.rfind(tempLastPath);
+if (lastPathPos == std::string::npos) {
+    return dataUri;  // fail closed, match UriUpateLastPath
+}
 uriString.replace(lastPathPos + 1, tempLastPath.size() - 1, newLastPath.c_str());
 return Uri(uriString);
```

Happy path (segment found) is unchanged; the miss path returns the original URI
instead of a corrupted one.

## References

- Bug: `frameworks/native/ability/native/data_uri_utils.cpp` — `AttachId`
- Guarded sibling: same file, `UriUpateLastPath` (~214–216)
- Public API: `interfaces/kits/native/ability/native/data_uri_utils.h`
- Related npos-guard findings:
  [OH-2026-ABILITY-001](OH-2026-ABILITY-001.md) (`erase(rfind('.'))`),
  [OH-2026-ABILITY-003](OH-2026-ABILITY-003.md)
- Internal issue: `DTS2026080812965`
