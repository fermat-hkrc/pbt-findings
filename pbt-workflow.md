# PBT Workflow: A Visual Guide

How to go from a codebase to confirmed bugs using property-based testing.

---

## The Big Picture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    The PBT Process                                   │
│                                                                     │
│   Codebase                                                          │
│      │                                                              │
│      ▼                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ Phase 1  │───►│ Phase 2  │───►│ Phase 3  │───►│ Phase 4  │     │
│  │  Select  │    │  Setup   │    │Strategies│    │Properties│     │
│  │ Targets  │    │   Env    │    │  Design  │    │Discovery │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                         │           │
│                                                         ▼           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ Phase 8  │◄───│ Phase 7  │◄───│ Phase 6  │◄───│ Phase 5  │     │
│  │  Stop    │    │  Confirm │    │  Run &   │    │  Write   │     │
│  │          │    │  & Report│    │  Iterate │    │  Tests   │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                     │
│                         Confirmed Bugs                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Target Selection

Not every function is worth testing with PBT. Score your candidates first.

### Scoring Matrix

Rate each function 1–5 on each criterion. Maximum score: 25.

```
                          Score
Criterion              1          3          5
─────────────────────────────────────────────────────────
Purity           Has I/O     Some I/O    Pure function
                 and state               (data in/out)

Complexity       Trivial     Some         Heavy
                 (1 branch)  branching    branching,
                             logic        type dispatch

Untested         Full test   Partial      No tests
                 coverage    coverage     at all

Bug surface      No risky    Some type    Parsing,
                 patterns    coercion     escaping,
                                          regex, eval

Dependency       10+ deps    A few deps   Imports
simplicity       to mock                  cleanly
```

```
Score ≥ 15  ──►  Excellent PBT target. Start here.
Score 10–14 ──►  Good target. May need some mocking.
Score  < 10 ──►  Skip or test indirectly.
```

### Where to Find Good Targets

```
High value targets                    Lower value targets
──────────────────────────────        ──────────────────────────────
✓ Data converters / serializers       ✗ Simple CRUD (save/load)
✓ Validators and normalizers          ✗ UI rendering
✓ Parsers (string, encoding)          ✗ One-line wrappers
✓ Security guards (regex, denylist)   ✗ Functions calling live services
✓ Template engines                    ✗ Functions with no branching
✓ Version/string utilities
✓ Configuration builders
```

---

## Phase 2: Test Environment Setup

Real packages have deep dependency trees. Loading the target often pulls in the entire framework. The setup phase isolates the code under test from those dependencies.

```
Without setup:                        With stubs + direct loading:

  import mymodule                       _load_directly("mymodule", path)
       │                                     │
       └── __init__.py                        ├── bypasses __init__.py
                │                            │
                └── framework               ├── stubs registered first
                          │                 │   in sys.modules
                          └── DB/network    │
                                   │        └── module loads cleanly ✓
                                   └── FAILS ✗
```

**Rules:**
- Read the target's imports first. Stub exactly what's needed — not more.
- Never put test files inside the package directory. Use a separate `tests/` tree.

---

## Phase 3: Strategy Design

A **strategy** defines how Hypothesis generates inputs. The goal is to generate inputs that are realistic — matching what the function actually receives in production.

### Strategy Complexity Levels

Start at Level 1. Only escalate when simpler strategies stop finding bugs.

```
Level 1: Simple scalars
─────────────────────────────────────────────────────────────
Individual values: text, integers, booleans, sampled from enum

         │  catches: basic crashes, missing type guards
         ▼

Level 2: Composite domain objects
─────────────────────────────────────────────────────────────
Objects built from multiple fields, all satisfying preconditions

         │  catches: structural bugs, missing field handling
         ▼

Level 3: Boundary values
─────────────────────────────────────────────────────────────
Empty, very long, unicode edge cases, whitespace-only

         │  catches: off-by-one errors, buffer issues
         ▼

Level 4: Adversarial inputs
─────────────────────────────────────────────────────────────
Characters or patterns the code is supposed to handle or reject

         │  catches: injection bugs, encoding issues
         ▼

Level 5: Invalid inputs (negative tests)
─────────────────────────────────────────────────────────────
Wrong types, missing fields, out-of-range values

         │  catches: missing validation, wrong error handling
```

### The Soundness Principle

```
Soundness:    only generate inputs the function was designed to receive.
Completeness: cover all inputs the function can receive.

When they conflict ──► PREFER SOUNDNESS

Unsound strategy ──► false alarms (test design errors, not bugs)
Sound strategy   ──► real bugs
```

---

## Phase 4: Property Discovery

Ask these questions about each function to find testable properties:

```
┌─────────────────────────────────────────────────────────────────┐
│              Property Discovery Questions                        │
│                                                                 │
│  "Can I undo this operation?"          ──►  Round-Trip          │
│  "Does doing it twice change anything?"──►  Idempotency         │
│  "What must ALWAYS be true?"           ──►  Invariant           │
│  "If I change input this way, how      ──►  Metamorphic         │
│   does output change?"                                          │
│  "Do these two functions agree?"       ──►  Consistency         │
│  "What shape must the output have?"    ──►  Output Structure    │
│  "What inputs must always be rejected?"──►  Negative/Denylist   │
│  "Does it always return, never crash?" ──►  Never Crashes       │
└─────────────────────────────────────────────────────────────────┘
```

### Property Power Spectrum

```
Bug-finding power:  HIGH ──────────────────────────────────► LOW

Round-Trip  Idempotency  Invariant  Metamorphic  Structure  Never Crashes
    │            │           │          │            │           │
    ▼            ▼           ▼          ▼            ▼           ▼
 encode       f(f(x))    output     f(x) vs     result      no
 decode       == f(x)    always     f(g(x))     has shape   exception
 == original             satisfies  related
                         rule
```

Only test properties the code explicitly claims. Evidence comes from docstrings, type annotations, comments, and existing tests. Do not invent properties — invented properties produce false alarms.

---

## Phase 5: Writing Tests

### File Layout

```
tests/
├── unit/
│   ├── properties/
│   │   ├── conftest.py                  ← stubs + module loading
│   │   ├── test_properties_<module>.py  ← one file per source module
│   │   └── ...
│   └── test_confirmed_bugs.py           ← plain pytest, one class per bug
└── ...
```

### Structure

- One `@given` test per property
- Strategies defined once at the top, reused across tests
- Keep property tests separate from bug confirmation tests

### `max_examples` Guide

```
Scenario                    Recommended minimum
────────────────────────────────────────────────
Core invariants             200–500
(idempotency, round-trip)

Structural checks           100–200
(output shape, type)

Slow functions              50–100  (add deadline=None)

Negative / denylist         200+
```

Never go below 100 for properties you care about. Hypothesis's value comes from volume.

---

## Phase 6: Running and Iterating

### The Feedback Loop

```
                    ┌─────────────────────────────────┐
                    │            Run tests             │
                    └────────────────┬────────────────┘
                                     │
                     ┌───────────────▼───────────────┐
                     │         All tests pass?        │
                     └──────────┬────────────┬────────┘
                                │            │
                               YES           NO
                                │            │
                    ┌───────────▼──┐   ┌─────▼───────────────────┐
                    │ Are properties│   │  Hypothesis found a      │
                    │ meaningful?   │   │  failing example         │
                    └──────┬────┬───┘   └──────────┬──────────────┘
                           │    │                  │
                          YES   NO                 ▼
                           │    │      ┌───────────────────────┐
                           │  Strengthen  Three-step triage    │
                           │  properties └──────────┬──────────┘
                           │             and strategies        │
                           │                        │
                           │            ┌───────────▼──────────┐
                           │            │      Real bug?        │
                           │            └────┬──────────┬───────┘
                           │                 │          │
                           │                YES         NO
                           │                 │          │
                           │     ┌───────────▼─┐  ┌────▼──────────────┐
                           │     │ Confirm bug │  │ Fix strategy or   │
                           │     │ document it │  │ property, rerun   │
                           │     └─────────────┘  └───────────────────┘
                           │
                    ┌──────▼──────────────────────┐
                    │  Stop when checklist is done │
                    └─────────────────────────────┘
```

### Three-Step Bug Triage

Every failure must pass all three steps before being called a bug.

```
┌──────────────────────────────────────────────────────────────┐
│  Step 1: REPRODUCIBILITY                                      │
│                                                              │
│  Can you reproduce it with a fixed input (not Hypothesis)?   │
│  Use the minimal case Hypothesis reported.                   │
│                                                              │
│  FAILS → investigate test setup                              │
│  PASSES → go to Step 2                                       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 2: LEGITIMACY                                           │
│                                                              │
│  • Is this a realistic input (not a precondition violation)? │
│  • Do callers always validate before reaching this function? │
│  • Does an existing test assert this behavior?  ◄── critical │
│    (If yes: intentional design, not a bug.)                  │
│                                                              │
│  FAILS → false alarm. Fix strategy or property.              │
│  PASSES → go to Step 3                                       │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 3: IMPACT                                               │
│                                                              │
│  • Would this affect real users?                             │
│  • Does it violate documented behavior or a security rule?   │
│  • Trace all callers — is this code path reachable?          │
│                                                              │
│  LOW → log as cosmetic, move on                              │
│  MEDIUM / HIGH → confirmed bug, document and report          │
└──────────────────────────────────────────────────────────────┘
```

---

## Phase 7: Bug Confirmation and Reporting

### Confirmation Steps

```
Hypothesis reports a failing example
             │
             ▼
Step 1: Extract the minimal case
        Write a standalone script to reproduce it without Hypothesis
             │
             ▼
Step 2: Write a named confirmation test
        One class per bug in test_confirmed_bugs.py
        Document root cause and proposed fix in the docstring
             │
             ▼
Step 3: Run the confirmation test — it must FAIL
        A passing confirmation test means the bug wasn't reproduced correctly
             │
             ▼
Step 4: Write the bug report
```

### Bug Report Structure

```
## Bug: [Short descriptive title]

Severity:  HIGH / MEDIUM / LOW
Type:      Logic | Crash | Contract
File:      path/to/file.py:line_number
Function:  function_name()

Root Cause   — 1–2 sentences naming the exact mechanism
Impact       — what breaks in production
Reproduction — minimal input that triggers it
Expected vs Actual — table showing the discrepancy
Fix          — exact code change needed
Confirmed By — test class and method that reproduces it
```

**Bug types:**
- **Logic** — wrong result, violated property, silent data loss
- **Crash** — valid input causes unhandled exception
- **Contract** — behavior differs from documented contract

---

## Phase 8: When to Stop

```
Completeness checklist
──────────────────────────────────────────────────────────────────

  Functions
  □ All pure functions tested with max_examples ≥ 100
  □ All branches and variants exercised

  Input coverage
  □ Empty / null / missing inputs covered
  □ Boundary values (minimum, maximum, off-by-one)
  □ Edge cases relevant to the function's domain

  Property coverage
  □ At least one round-trip or idempotency property per transformer
  □ At least one rejection property per security validator
  □ Negative tests for all documented error conditions

  Quality
  □ Branch coverage > 70% on tested functions
  □ Every failure triaged with the three-step process
  □ Each property rules out wrong implementations
    (verify: replace function body with stub — does the test fail?)
```

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│  PBT Workflow at a Glance                                       │
│                                                                 │
│  1. SELECT   Score candidates on purity, complexity, coverage   │
│  2. SETUP    Isolate the target with stubs and direct loading   │
│  3. STRATEGY Start simple (scalars), escalate to complex        │
│  4. DISCOVER Ask the 8 property questions for each function     │
│  5. WRITE    One @given test per property, max_examples ≥ 100   │
│  6. RUN      Triage every failure with the 3-step process       │
│  7. CONFIRM  Standalone test + bug report for each real bug     │
│  8. STOP     When the completeness checklist is satisfied       │
│                                                                 │
│  Golden rules:                                                  │
│  • Read existing tests before declaring any failure a bug       │
│  • Prefer soundness over completeness in strategies             │
│  • Only test properties the code explicitly claims              │
│  • The most valuable property: "never corrupts data"            │
└─────────────────────────────────────────────────────────────────┘
```
