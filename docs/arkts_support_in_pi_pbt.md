# Introducing ArkTS support in pi-pbt

2026-11-09. This note introduces the task. It is not the contract.

The contract is [`docs/pbt/arkts.md`](https://github.com/fermat-hkrc/FMBot-PBT/blob/main/docs/pbt/arkts.md) in FMBot-PBT. The open tracking issue is [#366](https://github.com/fermat-hkrc/FMBot-PBT/issues/366). The score below is that page on `main` after [#692](https://github.com/fermat-hkrc/FMBot-PBT/pull/692).

## The task

Support the ArkTS language in pi-pbt. A property must be able to run against real ArkTS code, and the set of types and call shapes that property may draw has to grow without faking a result.

pi-pbt does not add an ArkTS mode beside PBT. `pi-pbt build-run` sees the tree and runs the same campaign — property, ledger, report — on one runner.

A `passing` or `failing` result is legal only if the suite imports the real `--scope` file and calls `--func` with a value that matches that signature. If it cannot, the honest close is `retired`. Copying the function into the test, or casting with `as`, is a rejected run, not a result. A green build is not a result either.

## Why there are two runners

The property does not change. The place the `.ets` file can actually run does.

| | HAP ohosTest | Host panda |
|---|---|---|
| Tree | an app: `oh-package.json5` and `build-profile.json5` | compiler `.ets`, no app |
| Compile | `hvigorw` calls `es2panda` | the build command calls `es2panda` |
| Run | signed HAP, installed, `aa test` on an emulator or phone | desktop `ark` |
| Test wrapper | Hypium (`describe` / `it` / `expect`) | a `main()` |
| Value drawing | PandaCheck | PandaCheck |
| Verdict line | `OHOS_REPORT_RESULT` | `PANDACHECK_RESULT` |

An emulator does not replace host panda. `aa test` needs a HAP to install. A compiler checkout has none, and inventing one is forbidden. The other way around is also wrong: Photos imports `@ohos.*` / `@kit.*`, and desktop `ark` does not have those APIs.

If both could apply, the HAP manifests win. A Photos checkout is never silently run on the desktop.

Not every repo without an app is host panda. A C++ OpenHarmony component stays on the C++ build. A koala or generated ArkUI tree is not this task. The honest close there is `retired`.

## The compile step both runners share

ArkTS is compiled like Java, not like C++.

```text
.ets source  ->  es2panda  ->  .abc  ->  ark
.java source ->  javac     ->  .class ->  JVM
```

`es2panda` is the compiler. It writes an `abc` file, which is Ark bytecode, the way a `.class` file is Java bytecode. It does not run the test.

`ark` is the runtime. It loads the `abc` file and runs it, the way the JVM loads a `.class` file. On host panda you start desktop `ark` yourself. On a phone the same kind of runtime is already in the device, and `aa test` starts it.

C and C++ do not have this step. They compile to a native binary, and the operating system runs that binary.

## Host panda

Use this when the tree is not an app.

All of these must be true:

- no `oh-package.json5` and no `build-profile.json5`
- `PANDA_BUILD` points at a Panda build with `bin/es2panda` and `bin/ark`
- `--scope` is a `.ets` file, or `--build-cmd` itself calls `es2panda` or `ark`

`build-run` then sets `PBT_PANDA=1`. There is no Hypium, no `ohosTest`, no `hdc`, and no signing. `string` and `boolean` are reserved type names on this runner, so those generators are `text()` and `bool()`.

The trees below are a teaching shape, not a checkout we have.

`abs.ets`:

```ets
export function abs(n: int): int {
  return n < 0 ? -n : n
}
```

`pbt-main.ets`:

```ets
import { check, integer, property } from "PandaCheck"
import { abs } from "./abs"

function main(): int {
  let r = check(property(integer(), (n: int): boolean => abs(n) >= 0))
  return r.failed ? 1 : 0
}
```

```bash
PANDA_BUILD=~/panda pi-pbt build-run \
  --build-cmd "es2panda abs.ets && ark --panda-files=abs.abc pbt-main.abc" \
  --repo ~/compiler/ets-utils \
  --workdir ~/compiler/ets-utils \
  --scope abs.ets \
  --func abs \
  --lang en
```

`check` prints `PANDACHECK_RESULT failed=0|1 seed=… numRuns=… counterexample=…`. That line is the result. Compiling `abs.abc` is not.

One row in `docs/pbt/arkts.md` says host panda was removed. That row is stale. The code still has this runner. Do not treat "restore host panda" as open work.

## HAP ohosTest

This is the app runner, and the one a Photos-style campaign uses.

pi-pbt treats a directory as a HAP root when it contains both:

- `oh-package.json5` — the dependency file. `ohpm install` reads it. Hypium and PandaCheck are named here. It is the Harmony version of `package.json`.
- `build-profile.json5` — the build file. `hvigorw` reads the SDK pin, the product, and the module list from it. `compileSdkVersion` lives here. pi-pbt does not rewrite it.

A third file, `module.json5`, names abilities and permissions. That one is the manifest. It does not select the runner.

`build-run` sets `PBT_HAP=1` and ignores host panda.

The test is not a loose script. It is packaged with the app code into a HAP (Harmony Ability Package), the installable package, like an APK. `hvigorw` builds it, it is signed, and `hdc install` puts it on the emulator. It is not opened from the launcher. `aa test` starts the test package.

### What the test file is

Hypium is the on-device test framework. `describe`, `it`, and `expect` come from it. A unit test and a property test both use that wrapper. Hypium does not know the difference. It only sees one test that passed or failed.

PandaCheck is the property library inside the `it`. It draws the values and calls the real function. Hypium does not generate those values.

`entry/src/ohosTest/ets/test/AbsPbt.test.ets`, registered in `List.test.ets`:

```ets
import { describe, it, expect } from '@ohos/hypium';
import { check, integer, property } from 'PandaCheck';
import { abs } from '../../../main/ets/Abs';

export default function absPbt() {
  describe('absPbt', () => {
    it('abs_is_non_negative', 0, () => {
      const r = check(property(integer(), (n: number): boolean => abs(n) >= 0));
      expect(r.failed ? `failed: ${r.counterexample} seed=${r.seed}` : 'passed').assertEqual('passed');
    });
  });
}
```

`~/apps/abs-hap` is the same kind of teaching shape. The real demo of this runner is Photos `formatDuration`, below.

### How one command runs it

The operator does not run the `.ets` file by hand. One `build-run` writes the suite and runs it:

```bash
pi-pbt build-run \
  --build-cmd "hvigorw assembleHap --mode module -p module=entry@ohosTest -p product=default --no-daemon" \
  --repo ~/apps/abs-hap \
  --workdir ~/apps/abs-hap \
  --scope entry/src/main/ets/Abs.ets \
  --func abs \
  --lang en
```

After the suite exists, the same command continues:

1. `hvigorw assembleHap … entry@ohosTest` builds the test HAP. `hvigorw` is the project build wrapper, Harmony's `gradlew`. The trailing `w` means wrapper. It calls `es2panda` for you. The output is often still `*-unsigned.hap`. A green log only means the package was built.
2. Sign it, if the project did not already. `signingConfigs` in `build-profile.json5` makes `hvigorw` sign during the build. Otherwise the campaign runs `sign-hap.sh` with the DevEco SDK debug key. An emulator accepts that signature. A retail phone usually does not. pi-pbt has no certificate of its own.
3. `hdc install` puts the signed HAP on the emulator.
4. `hdc shell aa test` starts Hypium. `aa` is Ability Assistant, the Harmony version of Android's `am`. `aa test` is how both unit tests and PBT tests start on the device. It does not open the app from the launcher.
5. The result is the `OHOS_REPORT_RESULT` line: how many tests ran, and how many failed.

A HAR library is the same runner with a different build task: `genOnDeviceTestHap`, not `assembleHap`. One emulator means one `aa test` at a time.

`--isolate` is still this runner. It builds a smaller HAP around one function so a large app does not have to be assembled whole. It does not edit the product file. It is still signed, installed, and started with `aa test`.

Before `build-run` starts, the operator must already have a writable DevEco SDK that matches the project's pins, a green `ohpm install`, and a `--build-cmd` that already exits 0. pi-pbt will not fix those pins, invent `ohosTest`, or rewrite `compileSdkVersion`.

## What "support a feature" means

The score is the OpenHarmony tutorial checklist, 34 named types and call shapes. It is not a percent of ArkTS, and not a percent of product code.

On `main` today: **22 supported, 6 partial, 6 not supported**.

- Supported: a `passing` or `failing` property can use that form, and close-out requires it.
- Partial: only some forms of that heading are drawn or caught.
- Not supported: do not draw it, or the honest close is `retired`. `retired` on those is a good close, not a failed tool.

The six partial rows are the language work still open:

- getter / setter
- object literal
- `Record<K, V>`
- interface
- generic constraint
- generic default

Not supported, on purpose: bare `Object`, inheritance / `super` / abstract, `private` / `protected`, dynamic `import()`, `@interface`, and ArkUI. `@Sendable` is outside the 34-row count and also retires. A branded SDK type such as `Length` or `Resource` retires. A one-dimensional branded array such as `ImageItem[]` may only be `[]`.

These are not the language checklist, and they are not the next feature row unless the scope changes: non-empty branded values, a Sendable runner, a koala runner, line coverage, and naming an SDK mismatch without rewriting the tree. `@Component` is Kea, a different command. fast-check is gone on `main`. The old HAP path is the branch `ArkTS-fast-check`.

## The demo to point at

Use Photos `formatDuration`, not an ArkUI component.

`common/src/main/ets/default/model/common/DurationFormatter.ets` in `~/testing/applications_photos` exports `formatDuration(seconds: number): string`. The import graph is small, so `--isolate` is the right demo, not a full Photos assemble. It is still the HAP runner.

The law: for a finite non-negative `x`, `formatDuration(x) === formatDuration(Math.floor(x))`. A property that only draws `integer()` will not see the bug. The counterexample to show is `0.1`.

```bash
pi-pbt build-run \
  --isolate \
  --build-cmd "hvigorw assembleHap --mode module -p module=entry@ohosTest -p product=default --no-daemon" \
  --repo ~/testing/applications_photos \
  --workdir ~/testing/applications_photos \
  --scope common/src/main/ets/default/model/common/DurationFormatter.ets \
  --func formatDuration \
  --lang en
```

The result on screen is `OHOS_REPORT_RESULT` with that counterexample. Point the same command at a `Length` or `@Component` parameter and the correct result is `retired`.
