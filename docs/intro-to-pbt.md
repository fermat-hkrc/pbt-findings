# Introduction to Property-Based Testing

A guide to thinking about tests differently — and finding bugs that hand-written tests miss.

---

## The Problem with Example-Based Tests

Traditional unit tests work by picking specific inputs and checking specific outputs:

```python
def test_reverse():
    assert reverse([1, 2, 3]) == [3, 2, 1]
    assert reverse([]) == []
```

This works — but you only test what you thought to test. Bugs hide in the inputs you didn't think of.

**Property-based testing flips the question:**

> Instead of "what does this input produce?", ask "what must ALWAYS be true?"

---

## Example-Based vs Property-Based

```
Example-Based Testing          Property-Based Testing
──────────────────────         ──────────────────────
You pick the inputs            The framework picks inputs
You know the expected output   You define what must always hold
Tests a handful of cases       Tests thousands of cases
Finds bugs you anticipated     Finds bugs you didn't think of
```

### A concrete comparison

**Example-based:**
```python
def test_sort():
    assert sort([3, 1, 2]) == [1, 2, 3]
```

**Property-based:**
```python
from hypothesis import given
import hypothesis.strategies as st

@given(lst=st.lists(st.integers()))
def test_sort_properties(lst):
    result = sort(lst)
    assert len(result) == len(lst)          # same length
    assert sorted(result) == result         # is sorted
    assert set(result) == set(lst)          # same elements
```

The property-based version runs with hundreds of randomly generated lists — including edge cases like `[]`, `[0]`, `[1, 1, 1]`, very long lists, lists with negative numbers — without you writing any of them.

---

## How Hypothesis Works

```
┌─────────────────────────────────────────────────────────┐
│                    Your @given test                      │
│                                                         │
│  @given(s=st.text())                                    │
│  def test_normalize_idempotent(s):                      │
│      assert normalize(normalize(s)) == normalize(s)     │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │   Hypothesis Engine     │
          │                         │
          │  1. Generate inputs     │◄──── strategy: st.text()
          │  2. Run your test       │
          │  3. If FAIL → shrink   │
          │  4. Report minimal case │
          └─────────────────────────┘
```

**Shrinking** is key: when Hypothesis finds a failing input, it automatically simplifies it to the smallest possible case that still fails. A failure on a 500-character string might shrink to `"\n"`.

---

## The Eight Property Types

Not all properties are equal. Here they are from weakest to strongest bug-finding power:

```
  Strongest ──────────────────────────────────────► Weakest
  ┌─────────────┬────────────┬──────────┬──────────┬────────────┐
  │  Round-Trip │ Idempotency│Invariants│Metamorphic│Never Crashes│
  └─────────────┴────────────┴──────────┴──────────┴────────────┘
```

### 1. Round-Trip (strongest)

> Encode then decode returns the original.

```python
@given(job=st_valid_job())
def test_round_trip(job):
    assert Job.from_dict(job.to_dict()) == job
```

Catches: data loss in serialization, type coercion bugs, omitted fields.

---

### 2. Idempotency

> Applying an operation twice equals applying it once.

```python
@given(s=st.text())
def test_normalize_idempotent(s):
    once = normalize(s)
    assert normalize(once) == once
```

Catches: normalizers that keep modifying already-normalized data.

---

### 3. Invariants

> The output always satisfies some constraint.

```python
@given(s=st.text())
def test_title_bounded(s):
    assert len(make_title(s)) <= MAX_TITLE_LEN
```

Catches: off-by-one errors, missing guards, truncation bugs.

---

### 4. Metamorphic

> A known relationship between f(x) and f(transformed_x).

```python
# If a value is safe, adding "\n" should not change the result
@given(v=st_safe_value())
def test_newline_does_not_change_match(v):
    assert match(v, "*") == match(v + "\n", "*")
```

Catches: regex anchor bugs (`$` vs `\Z`), encoding inconsistencies.  
Useful when you don't know the correct output — only how it should relate to a change in input.

---

### 5. Output Structure

> The result has the expected shape or type.

```python
@given(data=st_raw_input())
def test_result_has_required_keys(data):
    result = transform(data)
    assert "id" in result
    assert isinstance(result["count"], int)
```

---

### 6. Consistency

> Two related functions agree on classification.

```python
@given(s=st.text())
def test_valid_iff_normalize_succeeds(s):
    sentinel = "__missing__"
    assert is_valid(s) == (normalize(s, default=sentinel) != sentinel)
```

---

### 7. Negative / Denylist

> Invalid inputs are always rejected.

```python
UNSAFE = ";&|`<>\n\t"

@given(
    safe=st.text(alphabet=SAFE_CHARS, min_size=1),
    bad=st.sampled_from(list(UNSAFE)),
)
def test_unsafe_always_rejected(safe, bad):
    assert is_allowed(safe + bad) is False
```

Critical for security validators.

---

### 8. Never Crashes (weakest)

> The function always returns, never raises unexpectedly.

```python
@given(v=st.one_of(st.none(), st.integers(), st.text(), st.binary()))
def test_never_crashes(v):
    result = extract_text(v)
    assert isinstance(result, str)
```

Use as a floor, not a target. A test that only checks "it didn't crash" catches very little.

---

## The Full Workflow at a Glance

```
┌──────────────────────────────────────────────────────────────┐
│                   PBT Workflow (10 Phases)                    │
│                                                              │
│  1. Understand ──► Read source, docstrings, callers, tests  │
│         │                                                    │
│  2. Select ──────► Score functions (purity, complexity...)  │
│         │                                                    │
│  3. Setup ───────► conftest.py, stubs, direct loading       │
│         │                                                    │
│  4. Strategies ──► Design input generators                  │
│         │                                                    │
│  5. Properties ──► Discover what must always be true        │
│         │                                                    │
│  6. Write ───────► @given tests with @settings              │
│         │                                                    │
│  7. Run & Triage ► Three-step failure triage                │
│         │                                                    │
│  8. Confirm ─────► Standalone bug reproduction tests        │
│         │                                                    │
│  9. Assess ──────► Branch coverage + property strength      │
│         │                                                    │
│ 10. Common Traps ► Avoid false alarms and weak properties   │
└──────────────────────────────────────────────────────────────┘
```

---

## Strategies: Generating the Right Inputs

A **strategy** is what tells Hypothesis how to generate inputs. Getting strategies right is the most important skill in PBT.

### Common strategies

| What you need | Strategy |
|---------------|----------|
| Any text | `st.text()` |
| Non-empty, stripped text | `st.text().map(str.strip).filter(len)` |
| Integer in a range | `st.integers(min_value=0, max_value=100)` |
| One of a fixed set | `st.sampled_from(["a", "b", "c"])` |
| Boolean | `st.booleans()` |
| List of integers | `st.lists(st.integers())` |
| UUID as string | `st.uuids().map(str)` |
| Either/or types | `st.one_of(st.none(), st.text())` |

### The soundness rule

> A strategy must only generate inputs the function was designed to receive.

**Wrong:** Generating `mode="Agent"` when the function lowercases it internally — your round-trip test will fail, but it's a test design error, not a bug.

**Right:** Generate `mode="agent"` (already lowercase), and add a comment explaining why.

### The `.filter()` trap

```python
# WRONG: guarantees non-empty after strip, but not that strip is a no-op
st.text().filter(lambda s: s.strip())
# " hello " passes — but the function strips it to "hello", breaking round-trips

# CORRECT: the string IS already stripped
st.text().map(str.strip).filter(len)
```

---

## Three-Step Bug Triage

Not every Hypothesis failure is a real bug. Before reporting one, apply this triage:

```
┌─────────────────────────────────────────────────────┐
│              Three-Step Triage                       │
│                                                     │
│  Step 1: REPRODUCIBILITY                            │
│  ─────────────────────────                          │
│  Can you reproduce it with a fixed input?           │
│  Write a standalone script. If not → investigate.  │
│                                                     │
│  Step 2: LEGITIMACY                                 │
│  ───────────────────                                │
│  • Is this input realistic?                         │
│  • Do callers always validate before calling?       │
│  • Does an existing test ASSERT this behavior?  ◄── most important
│    (If yes → intentional design, not a bug)         │
│                                                     │
│  Step 3: IMPACT                                     │
│  ─────────────                                      │
│  Would this affect real users?                      │
│  Does it violate documented behavior?               │
│                                                     │
│  ALL THREE PASS → confirmed bug                     │
│  STEP 2 FAILS  → false alarm, fix your strategy    │
└─────────────────────────────────────────────────────┘
```

---

## What a Confirmed Bug Looks Like

When a real bug is found, document it with a standalone test:

```python
class TestBug1RegexAnchorBypass:
    """Bug 1: $ anchor allows trailing \\n to bypass the security guard.

    Root cause: re.match("^...$") — Python's $ matches before trailing \\n.
    Fix: replace $ with \\Z in patterns.py line 95.
    """

    def test_root_cause(self):
        import re
        # $ matches before \n — this is Python's documented behavior
        assert re.match(r"^abc$",  "abc\n") is not None   # passes — BUG
        assert re.match(r"^abc\Z", "abc\n") is None        # blocked — FIX

    def test_trailing_newline_bypasses_guard(self):
        assert match_wildcard("git status\n", "git status *") is True  # BUG
```

---

## When to Use PBT (and When Not To)

```
USE PBT                              SKIP PBT
───────────────────────────          ─────────────────────────────
✓ Complex functions                  ✗ Simple CRUD operations
✓ Data transformers / parsers        ✗ UI rendering code
✓ Pure functions (no I/O)            ✗ Code that requires live services
✓ Security validators                ✗ One-line wrapper functions
✓ Code with no existing tests        ✗ Functions with no branching
✓ Before refactoring critical code
✓ When unit tests only cover
  happy-path examples
```

---

## Quick Start

**1. Install**

```bash
pip install pytest hypothesis
```

**2. Write your first property test**

```python
from hypothesis import given, settings
import hypothesis.strategies as st

@given(items=st.lists(st.integers()))
@settings(max_examples=200)
def test_sort_is_idempotent(items):
    once = sorted(items)
    assert sorted(once) == once
```

**3. Run it**

```bash
pytest test_mymodule.py -v
```

Hypothesis will generate 200 random lists and report any failure with the minimal reproducing case.

---

## Common Mistakes to Avoid

| Mistake | What happens | Fix |
|---------|-------------|-----|
| Strategy generates inputs the function never receives | False alarms | Read callers; constrain strategy to match real domain |
| Declaring a failure a bug without checking existing tests | Documents intentional behavior as a bug | Search the test suite first |
| Using `.filter()` when the code normalizes internally | Round-trips fail for valid inputs | Use `.map(normalize).filter(len)` |
| Using `return` to skip inputs instead of `assume()` | Test passes vacuously | Use `assume()` so Hypothesis redraws |
| Testing properties the code never claimed | Invented properties fail on don't-care cases | Ground every property in docstrings/code |
| Setting `max_examples` below 100 | Misses rare edge cases | Never go below 100 for invariants |

---

## Further Reading

- `pbt-workflow-guide.md` — the full 10-phase workflow with code examples and a real-results reference table
- [Hypothesis docs](https://hypothesis.readthedocs.io/) — strategies, settings, and advanced patterns
- [Property-based testing with Hypothesis](https://hypothesis.works/articles/what-is-property-based-testing/) — conceptual introduction
