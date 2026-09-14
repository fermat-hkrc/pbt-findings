---
id: OH-2026-AVCODEC-006
date: "2026-09-01"
repo: multimedia_av_codec
repo_url: https://gitcode.com/openharmony/multimedia_av_codec
title: "[Bug]: DashStrToNonNegativeDouble accepts NaN (`result < 0` misses unordered)"
cwe: CWE-697
cwe_name: Incorrect Comparison
severity: MEDIUM
status: CONFIRMED_FIXED
affected_version: "master"
component: services/media_engine/plugins/source/http_source/dash/mpd_parser/dash_mpd_util.cpp
file_paths:
  - services/media_engine/plugins/source/http_source/dash/mpd_parser/dash_mpd_util.cpp
  - services/media_engine/plugins/source/http_source/dash/dash_mpd_downloader.cpp
  - services/media_engine/plugins/source/http_source/utils/string_utils.cpp
author: Toan
internal_issue_id: DTS2026090130983
language: C++
---

## Summary

`DashStrToNonNegativeDouble` parses with `strtod` then rejects only
`result < 0.0`. C99 `strtod("nan")` succeeds (full consume). IEEE 754: every
ordered comparison with NaN is false, so `NaN < 0.0` is false and the helper
returns `true` with a NaN. The identifier is **NonNegative** — success must
be a value ≥ 0; NaN is not ≥ 0.

Live DASH path: `ParseFrameRateToUint32` does
`static_cast<uint32_t>(std::ceil(fps))` on that NaN ([conv.fpint] UB) and
publishes garbage `StreamInfo.frameRate`. Sibling `SafeStoDouble` already
rejects `!std::isfinite` after the same libc call. Confirmed and fixed by
developers (`DTS2026090130983`).

## Vulnerable Code

`services/media_engine/plugins/source/http_source/dash/mpd_parser/dash_mpd_util.cpp`
(`DashStrToNonNegativeDouble` ~330–351):

```cpp
result = strtod(str.c_str(), &end);
pos = static_cast<size_t>(end - str.c_str());
if (pos == 0) { return false; }            // empty subject
if (pos < str.length()) { return false; }  // leftover
if (result < 0.0) { return false; }        // sign only — NaN is not < 0
return true;
```

The success predicate is **`result ≥ 0`**. The current guard is the complement
of the *wrong* predicate (`< 0` = “is negative?”). NaN is not a negative →
slips through. `!(result >= 0.0)` is the contract negated: NaN is unordered
so `NaN >= 0` is false → reject.

Sibling oracle — same plugin, same `strtod` + full-consume, then finite:

```cpp
// string_utils.cpp ~129  StringUtil::SafeStoDouble
if (end == str.c_str() || end != str.c_str() + str.size()
    || errno == ERANGE || !std::isfinite(result)) {
    return false;
}
```

Same-file `DashStrToDuration` uses `num > 0` after `strtod` (~229): `NaN > 0`
is false, so `"nan"` is accidentally NaN-safe.

## Trigger Conditions

1. MPD `@frameRate` on AdaptationSet / Representation is a C99 NaN spelling
   (`"nan"`, `"NaN"`, `"-nan"`, `"nan(1)"`, …). `GetAttr` copies the string
   with no numeric check.
2. `ParseFrameRateToUint32` calls `DashStrToNonNegativeDouble` (plain token
   ~2537, or slash arms ~2523).
3. Helper returns `true` + NaN. Caller `ceil`s into `uint32` and
   `AssignStreamInfo` writes `info.frameRate`.

Concrete MPD (well-formed XML; `@frameRate` is not a valid ISO/IEC 23009-1
`FrameRateType`, but `GetAttr` stores it):

```xml
<Representation id="1" bandwidth="1000000"
                width="1920" height="1080"
                frameRate="nan"
                codecs="avc1.640028" mimeType="video/mp4">
```

Slash form is the same hole: `"nan/1"` and `"1/nan"` — caller `fps < 0` is
the same IEEE miss (`NaN < 0` is false). Plain branch has no `fps < 0` at all.

## Impact

- Helper success + NaN → `ceil(NaN)` → `static_cast<uint32_t>(NaN)` is UB
  ([conv.fpint]) — garbage fps, not a defined integer.
- That garbage is published as stream fps; demuxer treats `frameRate != 0`
  as set.
- Medium: live parse path, silent corruption when the token appears. Not
  High/security — MPD author already controls the manifest. Well-formed
  `"24"` / `"30000/1001"` unchanged. Needs a C99 NaN spelling, not a valid
  `FrameRateType`.

## Minimal Counterexample

| Input | Expected | Actual |
|-------|----------|--------|
| `"nan"` / `"NaN"` / `"NAN"` | `false` | **`true`, result NaN** |
| `"-nan"` / `"+nan"` | `false` | **`true`, result NaN** |
| `"nan(1)"` / `"NAN()"` | `false` | **`true`, result NaN** |
| `"-1"` / `"-29.97"` | `false` | OK (`< 0` fires) |
| `""` / `"24x"` | `false` | OK (empty / leftover) |
| `"24"` / `"0"` | `true`, that value | OK |

```cpp
double r = 0;
bool ok = DashStrToNonNegativeDouble("nan", r);  // true, r is NaN
```

`!(>=)` still accepts `+Inf` (`Inf >= 0` is true). Optional follow-up:
match `SafeStoDouble` with `!std::isfinite`.

## How PBT Detected This

`pbt-native/dash_str_to_nonnegative_double_pbt_test` — links the REAL
`dash_mpd_util.cpp` (not a model). Oracle: success ⇒ `result >= 0` and
`!isnan`.

| Property / test | Result |
|-----------------|--------|
| `RejectsNanLexical` (`"nan"` / `"NaN"` / `"-nan"` / `"nan(1)"`) | **FAIL** (`true`) |
| `SuccessImpliesNonNegative` | **FAIL** (NaN is not ≥ 0) |
| `test_DashStrToNonNegativeDouble_regression_accepts_nan` | **FAIL** |
| `RejectsStrictlyNegative` / `RejectsEmpty` / `RejectsLeftoverAfterNumber` | PASS |
| `RoundTripNonNegFinite` / `FrameRateIntegerToken` | PASS |

End-to-end `ParseFrameRateToUint32` / `AssignStreamInfo` are code-traced, not
PBT-linked. Existing UTs (`ParseFrameRateToUint32_001`–`_014`) never pass
`"nan"`.

```bash
cmake -S pbt-native -B pbt-native/build -DCMAKE_BUILD_TYPE=Release
cmake --build pbt-native/build -j --target dash_str_to_nonnegative_double_pbt_test
./pbt-native/build/dash_str_to_nonnegative_double_pbt_test \
  --gtest_filter='*Nan*:*SuccessImplies*:*regression_accepts_nan*'
```

## Suggested Fix

Negate the contract, not the wrong predicate:

```diff
--- a/services/media_engine/plugins/source/http_source/dash/mpd_parser/dash_mpd_util.cpp
+++ b/services/media_engine/plugins/source/http_source/dash/mpd_parser/dash_mpd_util.cpp
@@ -344,7 +344,7 @@ bool DashStrToNonNegativeDouble(const std::string &str, double &result)
     if (pos < str.length()) {
         return false;
     }
-    if (result < 0.0) {
+    if (!(result >= 0.0)) {
         return false;
     }
     return true;
```

`NaN >= 0` is false → reject. Negatives still rejected. `0` / `24` unchanged.
`+Inf` still accepted. Optional: `!std::isfinite(result) || result < 0.0` to
also reject `±Inf`. Caller `fps < 0` has the same unordered hole; fixing the
helper is enough so NaN never arrives.

## References

- Bug: `dash_mpd_util.cpp` (`DashStrToNonNegativeDouble`)
- Caller: `dash_mpd_downloader.cpp` (`ParseFrameRateToUint32` ~2523/2537,
  `AssignStreamInfo` ~2580)
- Token source: `dash_mpd_parser.cpp` (`@frameRate`); `dash_generic_node.cpp`
  (`GetAttr`)
- Sibling oracle: `string_utils.cpp` (`StringUtil::SafeStoDouble`)
- Cloned report: `pbt-out/bug_reports/fixed/dash_str_to_nonnegative_double_accepts_nan.md`
- PBT: `pbt-native/dash_str_to_nonnegative_double_pbt_test.cpp`
- Internal issue: `DTS2026090130983`
