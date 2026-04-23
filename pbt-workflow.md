---
name: building-property-based-tests
description: Use when writing property-based tests for any codebase using Hypothesis, QuickCheck, or similar frameworks — covers target selection, strategy design, invariant discovery, and bug triage
---

# Building Property-Based Tests: A Practical Workflow

## Overview

Property-based testing (PBT) generates thousands of random inputs to find bugs that hand-written tests miss. This workflow covers the full cycle: **select targets → design strategies → write properties → find bugs → confirm → report**.

## When to Use

- Complex functions with many input combinations
- Data transformation/validation/parsing code
- Pure or nearly-pure functions
- Code with no existing tests
- Before refactoring critical modules

## When NOT to Use

- Simple CRUD operations with obvious behavior
- UI rendering code
- Code that depends heavily on external services you can't mock
- One-line wrapper functions

---

## Phase 1: Target Selection (30 min)

### Target Scoring Matrix

Rate each candidate module on these criteria (1-5 each):

| Criterion | What to look for |
|-----------|-----------------|
| **Purity** | Functions take data in, return data out. No DB/network. |
| **Complexity** | Branching logic, type dispatch, string manipulation |
| **Untested** | No existing test coverage |
| **Bug surface** | Type conversions, parsing, escaping, edge cases |
| **Dependency simplicity** | Can be imported without 10+ transitive deps |

**Score >= 15**: Excellent PBT target.  
**Score 10-14**: Good target, needs some mocking.  
**Score < 10**: Skip or test indirectly.

### Where to Look

1. **Data converters/serializers** — type coercion, format translation
2. **Validators** — boundary conditions, invalid input handling
3. **Parsers** — string manipulation, escaping, encoding
4. **Graph algorithms** — cycle detection, connectivity, traversal
5. **Template engines** — variable substitution, expression evaluation
6. **Version/string utilities** — parsing, comparison, formatting
7. **Configuration builders** — parameter aggregation, default handling

### Quick Scan for Potential Bugs

Before writing tests, read the source for these patterns:

| Pattern | Bug likelihood |
|---------|---------------|
| `ast.literal_eval()` with string replacement | HIGH — corrupts substrings |
| Bare `except:` or `except Exception:` | HIGH — swallows real errors |
| `str.replace()` for parsing/transforming | HIGH — corrupts overlapping matches |
| `dict[key]` without `.get()` or `KeyError` | MEDIUM — crashes on missing keys |
| `int()` / `float()` without error handling | MEDIUM — crashes on non-numeric |
| Manual string concatenation across lines | MEDIUM — continuation bugs |
| Iterating and mutating same collection | MEDIUM — concurrent modification |
| `.pop()` inside iteration over same dict | LOW (if `list()` snapshot used) |

---

## Phase 2: Test Environment Setup

### The Import Problem

Real codebases have deep dependency chains. Your test conftest needs to handle this.

**Pattern: Direct Module Loading** (most reliable)

```python
# conftest.py
import importlib.util, pathlib, sys, types

def _load_directly(module_name, file_path):
    """Load module bypassing __init__.py"""
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = mod
    spec.loader.exec_module(mod)
    return mod

# 1. Build stubs for external framework packages
# 2. Register stubs in sys.modules
# 3. Load your target module directly with _load_directly()
```

**Why this works:** Package `__init__.py` files often import everything transitively. Direct loading bypasses this entirely.

**Key lesson:** Never put test files inside the package directory being tested. Python loads `__init__.py` before conftest runs. Put tests in a separate `tests/` tree.

### Stub Building Pattern

```python
# For each external package your module imports:
_oj = types.ModuleType("openjiuwen")
_oj_logging = types.ModuleType("openjiuwen.core.common.logging")
_oj_logging.logger = logging.getLogger("stub")
sys.modules["openjiuwen.core.common.logging"] = _oj_logging
# ... register all needed submodules
```

**Rule of thumb:** Read the target module's imports first, stub exactly what's needed.

---

## Phase 3: Strategy Design

### Strategy Types by Input Domain

| Input Type | Strategy | Example |
|------------|----------|---------|
| Node IDs | `st.text(alphabet=hex_chars, min_size=4, max_size=8)` | Unique, URL-safe |
| Type enums | `st.sampled_from(list(MyEnum))` | Valid enum values |
| Graph topology | `@st.composite` with explicit construction | Guaranteed acyclic |
| JSON-like data | `st.recursive()` or `st.fixed_dictionaries()` | Nested structures |
| Free text | `st.text(min_size=0, max_size=100)` | Human-readable |
| Numbers with bounds | `st.integers(min_value=0, max_value=99)` | Avoid overflow |

### Composite Strategy Pattern

For complex domain objects, use `@st.composite`:

```python
@st.composite
def st_valid_graph(draw):
    """Generate a valid DAG guaranteed to satisfy invariants."""
    # Use draw() to make choices
    node_count = draw(st.integers(min_value=2, max_value=8))
    
    # Build invariants into the strategy
    nodes = [make_start(), make_end()]
    for i in range(node_count - 2):
        nodes.append(make_node(draw(st_node_id)))
    
    # Construct edges that maintain acyclicity
    edges = []
    for i in range(1, len(nodes)):
        src = draw(st.integers(0, i - 1))
        edges.append(Edge(source=nodes[src], target=nodes[i]))
    
    return Graph(nodes=nodes, edges=edges)
```

**Critical rule:** Strategy output should ALWAYS satisfy the preconditions of the code under test. Invalid inputs go in separate "negative" strategies.

### Strategy Composition Levels

Start simple, add complexity:

```
Level 1: Linear chains    (easiest, catches basic crashes)
Level 2: Diamond shapes   (branching/merging)
Level 3: Mixed patterns   (switch + merge + loop)
Level 4: Random DAGs      (adversarial, finds edge cases)
Level 5: Invalid inputs   (negative tests, validation)
```

Run each level separately — simpler strategies find simpler bugs faster.

---

## Phase 4: Property Discovery

### The Property Taxonomy

Properties fall into these categories. For each target function, try to write at least one from each:

#### 1. **Never Crashes** (the most basic property)

```python
@given(input=st_valid_input())
def test_never_crashes(input):
    try:
        result = function(input)
        assert result is not None or result is None  # just checking it returns
    except ExpectedException:
        pass  # acceptable
```

#### 2. **Round-Trip** (encode then decode = identity)

```python
@given(data=st_data())
def test_round_trip(data):
    encoded = encode(data)
    decoded = decode(encoded)
    assert decoded == data
```

#### 3. **Output Structure** (result has expected shape)

```python
@given(input=st_valid_input())
def test_output_has_required_fields(input):
    result = convert(input)
    assert "id" in result
    assert isinstance(result["items"], list)
```

#### 4. **Idempotency** (applying twice = applying once)

```python
@given(input=st_valid_input())
def test_idempotent(input):
    result1 = transform(input)
    result2 = transform(result1)  # apply to output
    assert result1 == result2
```

#### 5. **Invariants** (something that must ALWAYS be true)

```python
@given(graph=st_valid_graph())
def test_all_targets_valid(graph):
    result = convert(graph)
    valid_ids = {n.id for n in result.nodes}
    for edge in result.edges:
        assert edge.target in valid_ids
```

#### 6. **Ordering/Comparison** (for sorting, version comparison)

```python
@given(a=st_version(), b=st_version())
def test_antisymmetry(a, b):
    assert compare(a, b) != compare(b, a) or a == b
```

#### 7. **Negative** (invalid input always fails correctly)

```python
@given(bad_input=st_invalid_input())
def test_rejects_invalid(bad_input):
    with pytest.raises(ValueError):
        validate(bad_input)
```

### Property Discovery Questions

For each function, ask:

| Question | Property Type |
|----------|---------------|
| "What must ALWAYS be true about the output?" | Invariant |
| "Can I undo this operation?" | Round-trip |
| "What should NEVER happen?" | Never Crashes / Negative |
| "Does doing it twice change anything?" | Idempotency |
| "What shape must the output have?" | Output Structure |
| "How should it compare to other values?" | Ordering |

---

## Phase 5: Writing Tests

### Test Organization Pattern

```
tests/
  target_module/
    conftest.py              # Stubs + env setup
    test_properties.py       # PBT tests
    test_bug_confirmations.py # Unit tests confirming specific bugs
```

### Class Structure

Group tests by property type or function under test:

```python
class TestFunctionNameProperties:
    """Properties for function_name."""
    
    @given(input=st_strategy())
    @settings(max_examples=100)
    def test_never_crashes(self, input):
        ...
    
    @given(input=st_strategy())
    @settings(max_examples=100)
    def test_output_structure(self, input):
        ...
```

### Settings Guide

| Scenario | max_examples | deadline | suppress_health_check |
|----------|-------------|----------|----------------------|
| Pure functions | 200-500 | None | [too_slow] |
| Slightly slow | 100-200 | None | [too_slow] |
| Network/IO (mocked) | 50-100 | 5000ms | [too_slow] |
| Complex strategies | 50-100 | 10000ms | [too_slow] |
| Termination tests | 30-50 | 5000ms | [too_slow] |

### Handling `assume()`

Use `assume()` to skip inputs that don't meet preconditions:

```python
@given(items=st.lists(st_items()))
def test_no_duplicates_in_output(items):
    assume(len(items) == len({i.id for i in items}))  # skip if input has dupes
    result = process(items)
    ...
```

**Warning:** If >50% of generated inputs are filtered by `assume()`, your strategy is wrong. Fix the strategy instead.

---

## Phase 6: Running and Iterating

### The PBT Feedback Loop

```
Run tests → ALL PASS
    ↓
Add more aggressive strategies / edge cases
    ↓
Run tests → FAILURE FOUND
    ↓
Analyze: Is this a real bug or a test assumption error?
    ↓
If real bug: Write confirmation unit test, document
If test error: Fix test assumption, continue
    ↓
Add more strategies targeting the area around the bug
    ↓
Repeat until diminishing returns
```

### Interpreting Failures

| Failure Pattern | What it means |
|----------------|---------------|
| Crashes on empty input | Missing null/empty check |
| Crashes on large input | Resource limit or infinite loop |
| Output corruption on specific chars | Encoding/escaping bug |
| Fails only with many examples | Edge case in combinatorics |
| Fails with `deadline` exceeded | Performance issue or infinite loop |
| `assume()` filters too much | Strategy doesn't match real inputs |

### Bug vs Test Error Checklist

When a test fails, check:

1. **Is the test assumption correct?** Did I misunderstand the function's contract?
2. **Is the strategy generating valid inputs?** Are preconditions satisfied?
3. **Is this a real bug in the code?** Does it violate documented behavior?
4. **What's the minimal reproducing case?** Hypothesis provides this — save it.

---

## Phase 7: Bug Confirmation and Reporting

### Confirmation Pattern

For each suspected bug:

1. **Extract the minimal case** from Hypothesis output
2. **Write a standalone unit test** that reproduces it without Hypothesis
3. **Verify the bug exists** by running the unit test
4. **Document with clear before/after**

```python
# In test_bug_confirmations.py

def test_bug_4_literal_eval_corrupts_falsehood():
    """BUG: naive true/false replacement corrupts strings containing these substrings."""
    content = '{"word": "falsehood"}'
    bv = BaseValue(type="constant", content=content, schema={"type": "object"})
    result = base_value_convert(bv)
    assert result == {"word": "falsehood"}, (
        f"BUG: got {result!r} — naive string replacement corrupted the data"
    )
```

### Report Template

```markdown
## Bug: [Title]

**Severity:** HIGH/MEDIUM/LOW
**File:** path/to/file.py:line_number
**Function:** function_name()

### Root Cause
[1-2 sentences explaining the bug]

### Impact
[What breaks in production]

### Reproduction
[Minimal input that triggers the bug]

### Expected vs Actual
| Input | Expected | Actual |
|-------|----------|--------|
| ... | ... | ... |

### Fix
[Specific code change needed]

### Confirmed By
[List of test functions that reproduce this]
```

---

## Phase 8: Escalation Strategy

### When to Stop Testing a Module

Stop when you've checked all these boxes:

- [ ] All pure functions tested with `max_examples >= 100`
- [ ] All enum/variant branches exercised
- [ ] Null/empty/missing input cases covered
- [ ] Boundary values tested (0, max, off-by-one)
- [ ] String edge cases (unicode, empty, very long, special chars)
- [ ] Concurrent/multi-input scenarios tested
- [ ] Negative tests for invalid inputs
- [ ] At least one round-trip or idempotency property tested

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Testing only happy path | Add negative strategies |
| Too many `assume()` filters | Fix strategy to generate valid inputs |
| Not testing `None`/empty | Add `st.none()`, `st.just("")` |
| Ignoring error paths | Test that correct exceptions are raised |
| Tests pass but find nothing | Make strategies more adversarial |
| Finding test bugs not code bugs | Verify assumptions before declaring a bug |

---

## Real Results Reference

From a production workflow engine codebase:

| Module | Lines | Tests | Bugs Found | Time |
|--------|-------|-------|------------|------|
| DSL converter | ~3000 | 958-line test file | 2 (type mismatch, not-implemented-called) | 3 hrs |
| Graph adapter | 361 | 75 tests | 0 (well-implemented) | 2 hrs |
| Convertor components | 500 | 79 tests | 1 HIGH (string corruption), 1 MEDIUM (data loss) | 1.5 hrs |
| **Total** | | **~210+ tests** | **3 confirmed bugs** | **~6.5 hrs** |

### Bugs Found by Type

| Bug | Detection Property | Strategy |
|-----|-------------------|----------|
| workflow_version type mismatch | Never crashes on valid input | Valid workflow generation |
| PLUGIN node not called | Known bug confirmation | Targeted unit test |
| true/false string corruption | Output structure invariant | Strings containing "true"/"false" |

### Key Insight

The most valuable property is **"never corrupts data"** — test that functions preserve information you care about, not just that they don't crash. The string corruption bug was found by checking that output values matched input values for specific string patterns, not by checking for crashes.
