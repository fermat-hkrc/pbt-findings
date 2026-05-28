---
id: SWARM-2026-PERM-001
date: "2026-04-23"
repo: jiuwenswarm
repo_url: https://gitcode.com/openJiuwen/jiuwenswarm
title: "[Bug]: match_wildcard trailing newline bypasses $ anchor in permission pattern guard"
cwe: CWE-625
cwe_name: Permissive Regular Expression
severity: MEDIUM
status: SUBMITTED
issue_url: https://gitcode.com/openJiuwen/jiuwenswarm/issues/394
affected_version: "*"
component: permissions
file_paths:
  - jiuwenclaw/agentserver/permissions/patterns.py
author: Toan
language: Python
---

## Summary

`match_wildcard` in `permissions/patterns.py` uses `$` to anchor the end of its regex pattern. Python's `re` module treats `$` as matching either the end of the string **or just before a trailing newline**, so any value with a single trailing `\n` passes the guard. The correct anchor for strict end-of-string matching is `\Z`.

## Vulnerable Code

**`jiuwenclaw/agentserver/permissions/patterns.py:95`**
```python
return bool(re.match("^" + escaped + "$", val, flags))
```

The docstring states the function provides full-string anchoring (`^...$`) to prevent injection. The `$` anchor does not fulfil that contract — `\Z` does.

## Evidence

```python
import re

# Python re: $ matches before trailing \n
assert re.match(r'^abc$', 'abc')    is not None  # expected
assert re.match(r'^abc$', 'abc\n') is not None  # BUG: also matches!
assert re.match(r'^abc\Z', 'abc\n') is None     # \Z is strict

# In match_wildcard:
from jiuwenclaw.agentserver.permissions.patterns import match_wildcard

assert match_wildcard("git status",   "git status *") is True   # correct
assert match_wildcard("git status\n", "git status *") is True   # BUG: should be False
assert match_wildcard("git status;x", "git status *") is False  # correct
```

## Scope of Impact

- `"safe_cmd\n"` passes any wildcard guard that would accept `"safe_cmd"`.
- Multi-line injection (`"safe\nmalicious"`) does **not** bypass — the embedded newline is not at the end, so `$` does not fire. Only a trailing newline is affected.
- In typical shell invocation via `subprocess.run(["bash", "-c", cmd])`, bash ignores a trailing newline — limiting practical exploitability in that path.
- If the command is passed through channels that preserve or interpret the newline differently (heredocs, multiline shell scripts, pipes to interpreters that split on `\n`), the trailing newline could cause unexpected behavior.
- The stated security contract is broken regardless of current exploitability.

## Impact

- **Permission bypass**: a command value with a trailing `\n` passes guards it should not
- **Broken security contract**: the docstring guarantees full-string anchoring; `$` does not deliver it
- **Latent risk**: exploitability depends on how the validated value is consumed downstream

## Suggested Fix

Replace `$` with `\Z` on line 95:

```python
# Before:
return bool(re.match("^" + escaped + "$", val, flags))

# After:
return bool(re.match("^" + escaped + r"\Z", val, flags))
```

`\Z` matches only at the absolute end of the string with no exception for trailing newlines.
