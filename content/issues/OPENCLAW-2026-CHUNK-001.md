---
id: OPENCLAW-2026-CHUNK-001
date: "2026-04-10"
repo: openclaw
repo_url: https://github.com/openclaw/openclaw
title: "[Bug]: chunkTextByBreakResolver final chunk has trailing whitespace"
cwe: CWE-20
cwe_name: Improper Input Validation
severity: MEDIUM
status: CONFIRMED_FIXED
issue_url: https://github.com/openclaw/openclaw/issues/64036
affected_version: "*"
component: text-chunking
file_paths:
  - src/shared/text-chunking.ts
author: Toan
language: TypeScript
---

## Summary

The `chunkTextByBreakResolver` function in `src/shared/text-chunking.ts` produces chunks with trailing whitespace in the **final chunk** (the one added after the loop exits). This is inconsistent with chunks produced inside the loop, which are properly trimmed.

Discovered through property-based testing (PBT) using fast-check.

## Vulnerable Code

```typescript
while (remaining.length > limit) {
  // ... chunk extraction logic ...
  const rawChunk = remaining.slice(0, breakIdx);
  const chunk = rawChunk.trimEnd(); // Line 22: chunks ARE trimmed
  if (chunk.length > 0) {
    chunks.push(chunk);
  }
  // ... update remaining ...
}
if (remaining.length) {
  chunks.push(remaining); // Line 31: final chunk is NOT trimmed ← BUG
}
```

### Trace

For input `"  ! "` with limit `2`:

**Iteration 1:**
- `remaining = "  ! "` (length 4 > 2, enter loop)
- `window = "  "` (first 2 chars), `lastIndexOf(" ")` = 1
- `rawChunk = " "`, `chunk = "".trimEnd()` = `""` (empty, skipped)
- `remaining = "! "`

**Iteration 2:**
- `remaining = "! "` (length 2, NOT > 2, exit loop)

**After loop:**
- `remaining.length > 0`, push `"! "` ← **BUG: trailing space NOT trimmed**

### Current Exposure

```typescript
chunkTextByBreakResolver("  ! ", 2, (w) => w.lastIndexOf(" ") || w.length);
// Result: ["! "]  ✗ Trailing space preserved

chunkTextByBreakResolver("a b ", 2, (w) => w.lastIndexOf(" ") || w.length);
// Result: ["a", "b "]  ✗ Trailing space preserved in final chunk
```

## Trigger Conditions

Any input where the final `remaining` string after the loop contains trailing whitespace. The `trimEnd()` call inside the loop handles interior chunks but is missing for the tail chunk.

## Impact

Inconsistent chunk output — callers expecting trimmed chunks receive trailing whitespace in edge cases, which can cause downstream text processing errors.

## Suggested Fix

Apply `trimEnd()` to the final chunk before pushing:

```typescript
if (remaining.length) {
  const finalChunk = remaining.trimEnd();
  if (finalChunk.length > 0) {
    chunks.push(finalChunk);
  }
}
```