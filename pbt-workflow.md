# PBT Workflow

How to go from a codebase to confirmed bugs using property-based testing.

---

## The Big Picture

```
                              ┌─────────────┐
                              │   Codebase  │
                              └──────┬──────┘
                                     │
          ┌──────────────────────────▼──────────────────────────┐
          │                   UNDERSTAND                         │
          │  Phase 1: Select Targets                            │
          │  Phase 2: Setup Test Environment                    │
          └──────────────────────────┬──────────────────────────┘
                                     │
          ┌──────────────────────────▼──────────────────────────┐
          │                     BUILD                            │
          │  Phase 3: Design Strategies                         │
          │  Phase 4: Discover Properties                       │
          │  Phase 5: Write Tests                               │
          └──────────────────────────┬──────────────────────────┘
                                     │
          ┌──────────────────────────▼──────────────────────────┐
          │                      RUN                             │
          │  Phase 6: Run & Iterate                             │
          │  Phase 7: Confirm & Report Bugs                     │
          │  Phase 8: Stop when checklist is done               │
          └──────────────────────────┬──────────────────────────┘
                                     │
                              ┌──────▼──────┐
                              │  Confirmed  │
                              │    Bugs     │
                              └─────────────┘
```

---

## Phase 1: Target Selection

Not every function is worth testing with PBT. Score your candidates first.

### Scoring Matrix

Rate each function 1–5 on each criterion. Maximum score: 25.

| Criterion | Score 1 | Score 3 | Score 5 |
|-----------|---------|---------|---------|
| **Purity** | Has I/O and state | Some I/O | Pure function (data in/out) |
| **Complexity** | Trivial (1 branch) | Some branching logic | Heavy branching, type dispatch |
| **Untested** | Full test coverage | Partial coverage | No tests at all |
| **Bug surface** | No risky patterns | Some type coercion | Parsing, escaping, regex, eval |
| **Dependency simplicity** | 10+ deps to mock | A few deps | Imports cleanly |

```
Score >= 15  →  Excellent PBT target. Start here.
Score 10–14  →  Good target. May need some mocking.
Score  < 10  →  Skip or test indirectly.
```

### Where to Find Good Targets

| Good targets | Poor targets |
|-------------|-------------|
| Data converters / serializers | Simple CRUD (save/load) |
| Validators and normalizers | UI rendering |
| Parsers (string, encoding) | One-line wrappers |
| Security guards (regex, denylist) | Functions calling live services |
| Template engines | Functions with no branching |
| Version/string utilities | |
| Configuration builders | |

---

## Phase 2: Test Environment Setup

Real packages have deep dependency trees. Loading the target often pulls in the entire framework. The setup phase isolates the code under test from those dependencies.

**Without setup:**

```
import mymodule
    │
    └── __init__.py
            │
            └── framework
                    │
                    └── DB / network
                              │
                              └── FAILS ✗ (no DB in test env)
```

**With stubs + direct loading:**

```
load_directly("mymodule", path)
    │
    ├── stubs registered in sys.modules first
    │       (framework.db, framework.net, ...)
    │
    ├── bypasses __init__.py entirely
    │
    └── module loads cleanly ✓
```

**Rules:**
- Read the target's imports first. Stub exactly what's needed — not more.
- Never put test files inside the package directory. Use a separate `tests/` tree.

---

## Phase 3: Strategy Design

A **strategy** defines how Hypothesis generates inputs. The goal is to generate inputs that are realistic — matching what the function actually receives in production.

### Strategy Complexity Levels

Start at Level 1. Only escalate when simpler strategies stop finding bugs.

| Level | Input Type | What it catches |
|-------|-----------|-----------------|
| **1** | Simple scalars — text, integers, booleans, enum values | Basic crashes, missing type guards |
| **2** | Composite domain objects — multiple fields satisfying preconditions | Structural bugs, missing field handling |
| **3** | Boundary values — empty, very long, unicode, whitespace-only | Off-by-one errors, buffer issues |
| **4** | Adversarial inputs — characters the code is supposed to handle or reject | Injection bugs, encoding issues |
| **5** | Invalid inputs — wrong types, missing fields, out-of-range values | Missing validation, wrong error handling |

### The Soundness Principle

> **Soundness:** only generate inputs the function was designed to receive.
> **Completeness:** cover all inputs the function can receive.

When they conflict → **prefer soundness.**

- Unsound strategy → false alarms (test design errors, not real bugs)
- Sound strategy → real bugs

---

## Phase 4: Property Discovery

Ask these questions about each function to find testable properties:

| Question | Property Type |
|----------|--------------|
| "Can I undo this operation?" | Round-Trip |
| "Does doing it twice change anything?" | Idempotency |
| "What must ALWAYS be true about the output?" | Invariant |
| "If I change the input this way, how does output change?" | Metamorphic |
| "Do these two functions agree on classification?" | Consistency |
| "What shape must the output have?" | Output Structure |
| "What inputs must always be rejected?" | Negative / Denylist |
| "Does it always return without crashing?" | Never Crashes |

### Property Power Spectrum

From highest to lowest bug-finding power:

```
HIGH                                                        LOW
 │                                                           │
 ▼                                                           ▼
Round-Trip → Idempotency → Invariant → Metamorphic → Structure → Never Crashes

Round-Trip:   encode → decode → must equal original
Idempotency:  f(f(x)) == f(x)
Invariant:    output always satisfies a rule
Metamorphic:  f(x) and f(g(x)) are related in a known way
Structure:    result has the expected shape
Never Crashes: no unhandled exception raised
```

> Only test properties the code explicitly claims. Evidence comes from docstrings, type annotations, comments, and existing tests. Invented properties produce false alarms.

---

## Phase 5: Writing Tests

### File Layout

```
tests/
├── unit/
│   ├── properties/
│   │   ├── conftest.py                   ← stubs + module loading
│   │   ├── test_properties_<module>.py   ← one file per source module
│   │   └── ...
│   └── test_confirmed_bugs.py            ← plain pytest, one class per bug
└── ...
```

### Structure

- One `@given` test per property
- Strategies defined once at the top, reused across tests
- Keep property tests separate from bug confirmation tests

### `max_examples` Guide

| Scenario | Recommended minimum |
|----------|-------------------|
| Core invariants (idempotency, round-trip) | 200–500 |
| Structural checks (output shape, type) | 100–200 |
| Slow functions | 50–100 (add `deadline=None`) |
| Negative / denylist | 200+ |

> Never go below 100 for properties you care about. Hypothesis's value comes from volume.

---

## Phase 6: Running and Iterating

### The Feedback Loop

```
Run tests
    │
    ├── ALL PASS
    │       │
    │       └── Are properties meaningful?
    │               │
    │               ├── YES → Stop when checklist is done
    │               │
    │               └── NO  → Strengthen properties and strategies → Run again
    │
    └── FAILURE FOUND
            │
            └── Apply three-step triage
                    │
                    ├── Real bug confirmed
                    │       └── Document and write confirmation test
                    │
                    └── False alarm / test error
                            └── Fix strategy or property → Run again
```

### Three-Step Bug Triage

Every failure must pass all three steps before being called a bug.

**Step 1 — Reproducibility**

Can you reproduce it with a fixed input (not Hypothesis)? Use the minimal case Hypothesis reported.

- Fails to reproduce → investigate test setup
- Reproduces reliably → go to Step 2

**Step 2 — Legitimacy**

- Is this a realistic input (not a precondition violation)?
- Do callers always validate before reaching this function?
- **Does an existing test assert this behavior?** ← most critical — if yes, it is intentional design, not a bug.

- Fails legitimacy → false alarm. Fix strategy or property.
- Passes → go to Step 3

**Step 3 — Impact**

- Would this affect real users?
- Does it violate documented behavior or a security rule?
- Trace all callers — is this code path actually reachable?

- LOW → log as cosmetic, move on
- MEDIUM / HIGH → confirmed bug, document and report

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
        A passing test means the bug was not reproduced correctly
             │
             ▼
Step 4: Write the bug report
```

### Bug Report Structure

| Field | Content |
|-------|---------|
| **Title** | Short descriptive summary |
| **Severity** | HIGH / MEDIUM / LOW |
| **Type** | Logic / Crash / Contract |
| **File** | `path/to/file.py:line_number` |
| **Root Cause** | 1–2 sentences naming the exact mechanism |
| **Impact** | What breaks in production |
| **Reproduction** | Minimal input that triggers the bug |
| **Expected vs Actual** | Table showing the discrepancy |
| **Fix** | Exact code change needed |
| **Confirmed By** | Test class and method that reproduces it |

**Bug types:**
- **Logic** — wrong result, violated property, silent data loss
- **Crash** — valid input causes unhandled exception
- **Contract** — behavior differs from documented contract

---

## Phase 8: When to Stop

### Completeness Checklist

**Functions**
- [ ] All pure functions tested with `max_examples >= 100`
- [ ] All branches and variants exercised

**Input coverage**
- [ ] Empty / null / missing inputs covered
- [ ] Boundary values (minimum, maximum, off-by-one)
- [ ] Edge cases relevant to the function's domain

**Property coverage**
- [ ] At least one round-trip or idempotency property per transformer
- [ ] At least one rejection property per security validator
- [ ] Negative tests for all documented error conditions

**Quality**
- [ ] Branch coverage > 70% on tested functions
- [ ] Every failure triaged with the three-step process
- [ ] Each property rules out wrong implementations *(verify: replace the function body with a stub — does the test still fail?)*

---

## Quick Reference

| Step | Action |
|------|--------|
| **1. Select** | Score candidates on purity, complexity, and coverage |
| **2. Setup** | Isolate the target with stubs and direct module loading |
| **3. Strategy** | Start simple (scalars), escalate through levels 1→5 |
| **4. Discover** | Ask the 8 property questions for each function |
| **5. Write** | One `@given` test per property, `max_examples >= 100` |
| **6. Run** | Triage every failure with the 3-step process |
| **7. Confirm** | Standalone test + bug report for each real bug |
| **8. Stop** | When the completeness checklist is satisfied |

**Golden rules:**
- Read existing tests before declaring any failure a bug
- Prefer soundness over completeness in strategies
- Only test properties the code explicitly claims
- The most valuable property: "never corrupts data"
