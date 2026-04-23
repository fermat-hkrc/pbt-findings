# Property-Based Testing Workflow

How to go from a codebase to confirmed bugs using property-based testing.

---

## The Big Picture

```
                    ┌─────────────┐
                    │   Codebase  │
                    └──────┬──────┘
                           │
            ┌──────────────▼──────────────┐
            │       0. CHOOSE ORACLE      │
            │                             │
            │  Pick your approach FIRST.  │
            │  Everything else follows.   │
            └──────────────┬──────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    ┌─────────────────┐       ┌─────────────────┐
    │   Approach A    │       │   Approach B    │
    │  Property-Based │       │ Reference Model │
    │     Oracle      │       │     Oracle      │
    └────────┬────────┘       └────────┬────────┘
             └─────────────┬───────────┘
                           │
            ┌──────────────▼──────────────┐
            │        1. UNDERSTAND        │
            │  Select targets.            │
            │  Read what the code claims. │
            │  (A: identify invariants)   │
            │  (B: draw state machine)    │
            └──────────────┬──────────────┘
                           │
            ┌──────────────▼──────────────┐
            │          2. BUILD           │
            │  Design generators.         │
            │  Discover properties.       │
            │  Write tests.               │
            └──────────────┬──────────────┘
                           │
            ┌──────────────▼──────────────┐
            │           3. RUN            │
            │  Execute, triage failures,  │
            │  confirm bugs, stop.        │
            └──────────────┬──────────────┘
                           │
                    ┌──────▼──────┐
                    │  Confirmed  │
                    │    Bugs     │
                    └─────────────┘
```

---

## Step 0: Choose an Oracle Approach

**This is the first decision you make — before selecting targets, before writing any code.**

The **oracle** is how a test decides whether an output is correct. Your choice determines the entire shape of the work that follows: how you score targets, what kind of generators you build, and what properties you test.

**Approach A — Property-Based Oracle:**

```
generator
    │
    ▼
function(input)
    │
    ▼
assert property holds
(round-trip, invariant, negative, ...)
```

**Approach B — Reference Model Oracle:**

```
generator
    │
    ▼
real_impl(op) ──► actual output / state
ref_model(op) ──► expected output / state
    │
    ▼
assert actual == expected
```

| | Approach A | Approach B |
|--|-----------|-----------|
| **Best for** | Pure functions, data transformers, validators, parsers | Stateful APIs with explicit lifecycles (init / update / final / deinit) |
| **Catches** | Crashes, data loss, invariant violations, round-trip failures | Silent wrong output, illegal state transitions, use-after-clear |
| **Misses** | Silent state violations | Bugs in the model itself |
| **Oracle is** | A logical property expressed in code | A simplified correct reimplementation of the state machine |
| **Extra work** | None — oracle is the test itself | Must build and validate the reference model first |

### Decision rule

```
Does the target have an explicit lifecycle?
(init / update / final / deinit, or an explicit state enum)
         │
         ├── NO  ──►  Use Approach A
         │
         └── YES ──►  Do you suspect silent wrong output
                      (not just crashes) that plain properties
                      would miss?
                              │
                              ├── NO  ──►  Use Approach A
                              └── YES ──►  Use Approach B
```

> **When in doubt, start with Approach A.** It finds real bugs with less setup. Upgrade to Approach B only when you have evidence that silent state violations are the risk.

---

## Step 1: Understand

**Goal:** Know what to test, what the code claims, and which oracle approach fits.

### 1a. Select Targets

Score candidates 1–5 on each criterion (max 25):

| Criterion | Score 1 | Score 3 | Score 5 |
|-----------|---------|---------|---------|
| **Purity / State** | Has I/O and mutable state | Some I/O | Pure function or clean state machine |
| **Complexity** | Trivial (1 branch) | Some branching | Heavy branching, type dispatch |
| **Untested** | Full coverage | Partial | No tests at all |
| **Bug surface** | No risky patterns | Some type coercion | Parsing, escaping, regex, lifecycle ops |
| **Testability** | Many deps to isolate | A few deps | Isolates cleanly |

```
Score >= 15  →  Excellent target
Score 10–14  →  Good target
Score  < 10  →  Skip or test indirectly
```

| Good targets for Approach A | Good targets for Approach B |
|----------------------------|------------------------------|
| Data converters / serializers | Cryptographic primitives (MAC, cipher, RNG) |
| Validators and normalizers | Protocol or session state machines |
| Parsers (string, encoding) | Resource lifecycle (open / read / write / close) |
| Security guards (regex, denylist) | Any API with explicit init / deinit |
| Configuration builders | |

### 1b. Understand What the Code Claims

For each target, answer these before writing any test:

1. **What does it claim to do?** Read documentation, type signatures, and comments.
2. **Who calls it?** Callers often impose implicit preconditions — inputs callers never pass produce false alarms.
3. **Do existing tests document expected behavior?** An existing test asserting X means X is intentional, not a bug.
4. **What does it normalize or transform?** These constrain how generators must be built.
5. **Does it have a lifecycle?** If yes, draw the state machine → consider Approach B.

### 1c. Draw the State Machine (Approach B only)

Before writing any code, map out states and transitions on paper:

```
         ┌─────────────────────────────────────────────────┐
         │                                                 │
         │  op_init                                        │ op_init
         ▼                                                 │
    ┌─────────┐  op_init  ┌─────────┐  op_update  ┌────────┴──┐
    │  IDLE   │──────────►│  READY  │────────────►│  ACTIVE   │
    └─────────┘           └────┬────┘             └─────┬─────┘
                               │                        │
                               │ op_final               │ op_final
                               │                        │
                               ▼                        │
                          ┌─────────┐◄──────────────────┘
                          │  DONE   │
                          └────┬────┘
                               │
                               │ op_deinit
                               ▼
                          ┌─────────┐
                          │  DEAD   │
                          └─────────┘
```

Then encode as plain data + transition functions, each returning `(new_state, expected_return_code)` without calling the real implementation.

> **Golden rule for Approach B:** if an existing test asserts a behavior, the model must agree with it.

---

## Step 2: Build

**Goal:** Design generators and write tests against the chosen oracle.

### 2a. Design Generators

A **generator** defines how the framework produces inputs. It must be *sound*.

```
Soundness:    only generate inputs the function was designed to receive
Completeness: cover all inputs the function can receive

             When they conflict → PREFER SOUNDNESS

  Unsound generator ──► false alarms
  Sound generator   ──► real bugs
```

Start simple and escalate only when simpler generators stop finding bugs.

**Approach A — single inputs:**

```
Level 1: Simple scalars          ──► crashes, missing type guards
    │
    ▼
Level 2: Composite objects       ──► structural bugs, missing fields
    │
    ▼
Level 3: Boundary values         ──► off-by-one, edge cases
    │
    ▼
Level 4: Adversarial inputs      ──► injection, encoding issues
    │
    ▼
Level 5: Invalid inputs          ──► missing validation
```

**Approach B — operation sequences:**

```
Level 1: Valid sequences (happy path)       ──► basic state violations
    │
    ▼
Level 2: Random valid sequences             ──► illegal transitions
    │
    ▼
Level 3: Sequences with injected failures   ──► error recovery paths
    │
    ▼
Level 4: Boundary values                    ──► off-by-one, overflow
    │
    ▼
Level 5: Post-lifecycle operations          ──► use-after-clear bugs
```

### 2b. Discover Properties

**Approach A** — ask these for each target:

```
"Can I undo this?"              ──►  Round-Trip        (highest power)
"Twice = once?"                 ──►  Idempotency
"Output always satisfies X?"    ──►  Invariant
"f(x) relates to f(g(x))?"      ──►  Metamorphic
"Two functions agree?"          ──►  Consistency
"Output has expected shape?"    ──►  Output Structure
"Invalid input always rejected?"──►  Negative / Denylist
"Always returns, never throws?" ──►  Never Crashes     (lowest power)
```

**Approach B** — the primary property is always:

```
┌──────────────────────────────────────────────────────┐
│  For every operation sequence:                        │
│                                                      │
│  impl(op).return_code  ==  model(op).return_code     │
│  impl(op).state_after  ==  model(op).state_after     │
└──────────────────────────────────────────────────────┘
```

Then add: Equivalence, Independence, Causality, Invariants.

> Only test properties the code explicitly claims. Invented properties produce false alarms.

### 2c. Write the Tests

- One test per property
- Generators defined once, reused across tests
- Property tests and bug confirmation tests in separate files

| Scenario | Recommended minimum samples |
|----------|-----------------------------|
| Core invariants (round-trip, idempotency, state match) | 200–500 |
| Structural checks | 100–200 |
| Slow functions | 50–100 |
| Negative / denylist | 200+ |

---

## Step 3: Run

**Goal:** Execute tests, triage every failure honestly, confirm real bugs, and know when to stop.

### 3a. The Feedback Loop

```
                    ┌───────────┐
                    │ Run tests │
                    └─────┬─────┘
                          │
           ┌──────────────┴──────────────┐
           ▼                             ▼
     ALL PASS                     FAILURE FOUND
           │                             │
           ▼                             ▼
  Are properties                  Three-step triage
  meaningful?                           │
           │                   ┌────────┴─────────┐
      ┌────┴────┐               ▼                  ▼
      YES       NO           Real bug         False alarm
      │         │               │                  │
      ▼         ▼               ▼                  ▼
   Proceed   Strengthen    Confirm &          Fix generator
   to stop   and run       report             or property
   criteria  again                            and run again
```

### 3b. Three-Step Bug Triage

```
┌─────────────────────────────────────────────────────┐
│  Step 1 — REPRODUCIBILITY                           │
│                                                     │
│  Reproduce with a fixed input, without the          │
│  framework. Use the minimal case it reported.       │
│                                                     │
│  Fails   ──►  investigate setup                     │
│  Passes  ──►  go to Step 2                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  Step 2 — LEGITIMACY                                │
│                                                     │
│  • Realistic input, not a precondition violation?   │
│  • Callers always validate before here?             │
│  • Existing test asserts this behavior?  ◄ critical │
│    (If yes → intentional design, not a bug)         │
│                                                     │
│  Fails   ──►  false alarm, fix generator            │
│  Passes  ──►  go to Step 3                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  Step 3 — IMPACT                                    │
│                                                     │
│  • Affects real users?                              │
│  • Violates documented behavior or security rule?   │
│  • Code path reachable in production?               │
│                                                     │
│  LOW     ──►  log as cosmetic                       │
│  MEDIUM / HIGH  ──►  confirmed bug, report it       │
└─────────────────────────────────────────────────────┘
```

### 3c. Confirming and Reporting a Bug

```
Framework reports a failing example
             │
             ▼
   Extract the minimal case
   Reproduce without the framework
             │
             ▼
   Write a named confirmation test
   ── it must FAIL when run ──
             │
             ▼
      Write the bug report
```

**Bug report fields:**

| Field | Content |
|-------|---------|
| **Title** | Short descriptive summary |
| **Severity** | HIGH / MEDIUM / LOW |
| **Type** | Logic / Crash / Contract |
| **Location** | File and line |
| **Root Cause** | 1–2 sentences — exact mechanism |
| **Impact** | What breaks in production |
| **Reproduction** | Minimal input or sequence that triggers the bug |
| **Expected vs Actual** | Table showing the discrepancy |
| **Fix** | Code change needed |
| **Confirmed By** | Test name that reproduces it |

### 3d. When to Stop

**Both approaches**
- [ ] All selected targets tested with sufficient sample count
- [ ] All branches and variants exercised
- [ ] Empty / null / boundary / edge case inputs covered
- [ ] Every failure triaged with the three-step process
- [ ] Each property rules out wrong implementations *(stub the function — does the test fail?)*
- [ ] Branch coverage > 70% on tested functions

**Approach A only**
- [ ] At least one round-trip or idempotency property per data transformer
- [ ] At least one rejection property per security validator

**Approach B only**
- [ ] All state transitions covered (valid and invalid)
- [ ] Post-lifecycle operations tested (use after deinit, etc.)
- [ ] State match and output match verified after every operation type

---

## Quick Reference

| Step | Approach A | Approach B |
|------|-----------|-----------|
| **0. Choose Oracle** | Use when target is a pure function, transformer, or validator | Use when target has explicit init/update/final/deinit lifecycle |
| **1. Understand** | Identify invariants from docs and existing tests | Draw the state machine; encode as a model |
| **2. Build** | Single-input generators; 8 property types | Operation-sequence generators; state-match property |
| **3. Run** | Three-step triage on every failure | Three-step triage; test wrapper and internal layers separately |

**Golden rules:**
- Read existing tests before declaring any failure a bug
- Prefer soundness over completeness in generators
- Only test properties the code explicitly claims
- The most dangerous bugs produce no error — they produce wrong output silently
- The most valuable property: "never corrupts data, never produces silent wrong output"
