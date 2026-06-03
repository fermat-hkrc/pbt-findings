---
id: AI-2026-SYNTAX-001
date: "2026-05-30"
repo: agent-studio
repo_url: https://gitcode.com/openJiuwen/agent-studio
title: "[Bug]: NOT_CONTAIN operator generates `not_in` (invalid Python syntax) in switch branch conditions"
cwe: CWE-693
cwe_name: Protection Mechanism Failure
severity: HIGH
status: SUBMITTED
issue_url: https://gitcode.com/openJiuwen/agent-studio/issues/877
affected_version: "*"
component: switch
stars: 2631
file_paths:
  - backend/openjiuwen_studio/core/manager/convertor/components/switch.py
author: Toan
language: Python
---

## Summary

When a workflow switch node uses the `NOT_CONTAIN` operator (`nin` / `not_contains`), `_bool_expression_assemble` generates `"y not_in x"` instead of `"y not in x"`. `not_in` is not valid Python syntax. The generated branch condition raises `SyntaxError` when evaluated at workflow execution time.

## Vulnerable Code

`backend/openjiuwen_studio/core/manager/convertor/components/switch.py:72`

```python
OperatorType.CONTAIN:     lambda l, r: f"{r} in {l}",       # line 71 — correct
OperatorType.NOT_CONTAIN: lambda l, r: f"{r} not_in {l}",   # line 72 — BUG
```

`in` is a Python keyword. Its negation is the two-word keyword pair `not in` (with a space). `not_in` is parsed as an identifier, producing a `SyntaxError`.

Line 118 contains a comment reinforcing the same wrong spelling:

```python
# 只有 in / not_in 才按数组展开
```

## Reproduction

```python
from openjiuwen_studio.core.manager.convertor.components.switch import (
    _bool_expression_assemble,
    OperatorType,
)
import ast

expr = _bool_expression_assemble("haystack", "needle", OperatorType.NOT_CONTAIN)
print(expr)          # "needle not_in haystack"
ast.parse(expr)      # SyntaxError: invalid syntax
```

## Impact

Any workflow branch condition using `NOT_CONTAIN` (`nin` or `not_contains` in the DSL) stores a syntactically invalid Python expression. When the branch is reached at workflow execution time, `SyntaxError` is raised and the workflow fails.

The operator is reachable through two DSL string aliases:

```python
# switch.py lines 44–46
"nin":          OperatorType.NOT_CONTAIN,
"not_contains": OperatorType.NOT_CONTAIN,
```

## Fix

Two lines need to change:

```python
# line 72 — fix the generated expression
- OperatorType.NOT_CONTAIN: lambda l, r: f"{r} not_in {l}",
+ OperatorType.NOT_CONTAIN: lambda l, r: f"{r} not in {l}",

# line 118 — fix the reinforcing comment
- # 只有 in / not_in 才按数组展开
+ # 只有 in / not in 才按数组展开
```

## How This Was Found

Property-based testing with [Hypothesis](https://hypothesis.readthedocs.io/). `test_output_is_valid_python` generates identifier pairs, runs every operator through `_bool_expression_assemble`, and calls `ast.parse(..., mode="eval")` on the result. Fails immediately for `NOT_CONTAIN`:

```
SyntaxError: invalid syntax
  operator=NOT_CONTAIN
  left='x', right='y'
  expr='y not_in x'
```

`test_not_contains_has_correct_order` independently catches the same bug by asserting `" not in "` (with spaces) must appear in the output.
