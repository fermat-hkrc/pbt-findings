# Issue Language Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `language` frontmatter field to every issue markdown file and render it as a badge on the issue list and as a metadata card on the issue detail page.

**Architecture:** Extend `IssueMeta` with `language: string`, migrate all 13 existing markdown files, then update the two UI surfaces (list component and detail page) to render the value.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, gray-matter (frontmatter parsing)

---

### Task 1: Extend `IssueMeta` type in `src/lib/content.ts`

**Files:**
- Modify: `src/lib/content.ts`

- [ ] **Step 1: Add `language` field to `IssueMeta`**

Open `src/lib/content.ts`. In the `IssueMeta` interface, add after the `author` field:

```ts
export interface IssueMeta {
  id: string;
  date: string;
  repo: string;
  repo_url: string;
  title: string;
  cwe: string;
  cwe_name?: string;
  severity?: string;
  status: string;
  affected_version?: string;
  component?: string;
  issue_url?: string;
  file_paths?: string[];
  author?: string;
  has_poc?: boolean;
  language?: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add language field to IssueMeta type"
```

---

### Task 2: Migrate all issue markdown files

**Files:**
- Modify: `content/issues/AI-2026-AUTH-001.md`
- Modify: `content/issues/AI-2026-CODE-001.md`
- Modify: `content/issues/AI-2026-CONV-001.md`
- Modify: `content/issues/HITLS-2026-CRYPTO-001.md`
- Modify: `content/issues/HITLS-2026-CRYPTO-002.md`
- Modify: `content/issues/HITLS-2026-CRYPTO-003.md`
- Modify: `content/issues/HITLS-2026-CRYPTO-004.md`
- Modify: `content/issues/KUASAR-2026-KERNEL-001.md`
- Modify: `content/issues/KUASAR-2026-KERNEL-002.md`
- Modify: `content/issues/OH-2026-DEVMGR-002.md`
- Modify: `content/issues/OH-2026-DEVMGR-003.md`
- Modify: `content/issues/OH-2026-DRIVERS-002.md`
- Modify: `content/issues/OPENCLAW-2026-CHUNK-001.md`

Language assignments derived from affected file paths:

| File | Language |
|---|---|
| AI-2026-AUTH-001 | Python (`.py`) |
| AI-2026-CODE-001 | Python (`.py`) |
| AI-2026-CONV-001 | Python (`.py`) |
| HITLS-2026-CRYPTO-001 | C++ (`.h`) |
| HITLS-2026-CRYPTO-002 | C++ (`.h`) |
| HITLS-2026-CRYPTO-003 | C++ (`.c`) |
| HITLS-2026-CRYPTO-004 | C++ (`.c`) |
| KUASAR-2026-KERNEL-001 | Rust (`.rs`) |
| KUASAR-2026-KERNEL-002 | Rust (`.rs`) |
| OH-2026-DEVMGR-002 | C++ (`.cpp`) |
| OH-2026-DEVMGR-003 | C++ (`.cpp`) |
| OH-2026-DRIVERS-002 | C++ (`.c`) |
| OPENCLAW-2026-CHUNK-001 | TypeScript (`.ts`) |

- [ ] **Step 1: Add `language: Python` to AI-2026-AUTH-001.md**

In `content/issues/AI-2026-AUTH-001.md`, add after the `author:` line in frontmatter:

```yaml
language: Python
```

- [ ] **Step 2: Add `language: Python` to AI-2026-CODE-001.md**

In `content/issues/AI-2026-CODE-001.md`, add after the `author:` line:

```yaml
language: Python
```

- [ ] **Step 3: Add `language: Python` to AI-2026-CONV-001.md**

In `content/issues/AI-2026-CONV-001.md`, add after the `author:` line:

```yaml
language: Python
```

- [ ] **Step 4: Add `language: C++` to HITLS-2026-CRYPTO-001.md**

In `content/issues/HITLS-2026-CRYPTO-001.md`, add after the `author:` line:

```yaml
language: C++
```

- [ ] **Step 5: Add `language: C++` to HITLS-2026-CRYPTO-002.md**

In `content/issues/HITLS-2026-CRYPTO-002.md`, add after the `author:` line:

```yaml
language: C++
```

- [ ] **Step 6: Add `language: C++` to HITLS-2026-CRYPTO-003.md**

In `content/issues/HITLS-2026-CRYPTO-003.md`, add after the `author:` line:

```yaml
language: C++
```

- [ ] **Step 7: Add `language: C++` to HITLS-2026-CRYPTO-004.md**

In `content/issues/HITLS-2026-CRYPTO-004.md`, add after the `author:` line:

```yaml
language: C++
```

- [ ] **Step 8: Add `language: Rust` to KUASAR-2026-KERNEL-001.md**

In `content/issues/KUASAR-2026-KERNEL-001.md`, add after the `author:` line:

```yaml
language: Rust
```

- [ ] **Step 9: Add `language: Rust` to KUASAR-2026-KERNEL-002.md**

In `content/issues/KUASAR-2026-KERNEL-002.md`, add after the `author:` line:

```yaml
language: Rust
```

- [ ] **Step 10: Add `language: C++` to OH-2026-DEVMGR-002.md**

In `content/issues/OH-2026-DEVMGR-002.md`, add after the `author:` line:

```yaml
language: C++
```

- [ ] **Step 11: Add `language: C++` to OH-2026-DEVMGR-003.md**

In `content/issues/OH-2026-DEVMGR-003.md`, add after the `author:` line:

```yaml
language: C++
```

- [ ] **Step 12: Add `language: C++` to OH-2026-DRIVERS-002.md**

In `content/issues/OH-2026-DRIVERS-002.md`, add after the `author:` line:

```yaml
language: C++
```

- [ ] **Step 13: Add `language: TypeScript` to OPENCLAW-2026-CHUNK-001.md**

In `content/issues/OPENCLAW-2026-CHUNK-001.md`, add after the `author:` line:

```yaml
language: TypeScript
```

- [ ] **Step 14: Verify all files have the field**

```bash
grep -l "^language:" content/issues/*.md | wc -l
```

Expected: `13`

- [ ] **Step 15: Commit**

```bash
git add content/issues/
git commit -m "content: add language field to all issue markdown files"
```

---

### Task 3: Show language badge on issue list

**Files:**
- Modify: `src/components/issues-list.tsx`

- [ ] **Step 1: Add a `LanguageBadge` component**

In `src/components/issues-list.tsx`, add this component above the `export default` line:

```tsx
function LanguageBadge({ language }: { language: string }) {
  const colors: Record<string, string> = {
    Python: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Rust: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "C++": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    TypeScript: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[language] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
    >
      {language}
    </span>
  );
}
```

- [ ] **Step 2: Render `LanguageBadge` in each issue row**

In the same file, find the metadata line that renders `issue.id`, `issue.repo`, `issue.date`, and `issue.author`. Add the language badge after the CWE span and before the metadata text line:

```tsx
{issue.language && (
  <LanguageBadge language={issue.language} />
)}
```

Place it inside the `<div className="flex items-center gap-2 mb-2">` block that already contains the CWE badge, so the full block becomes:

```tsx
{(issue.cwe || issue.language) && (
  <div className="flex items-center gap-2 mb-2 flex-wrap">
    {issue.cwe && (
      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#1a1a2e] text-blue-400 border border-blue-500/20">
        {issue.cwe}
        {issue.cwe_name && ` — ${issue.cwe_name}`}
      </span>
    )}
    {issue.language && <LanguageBadge language={issue.language} />}
  </div>
)}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/issues-list.tsx
git commit -m "feat: show language badge on issue list"
```

---

### Task 4: Show language on issue detail page

**Files:**
- Modify: `src/app/issues/[id]/page.tsx`

- [ ] **Step 1: Add language to the metadata card grid**

In `src/app/issues/[id]/page.tsx`, find the `<div className="grid grid-cols-2 gap-3 text-sm">` block. Add a language card after the existing `component` card and before the `affected_version` card:

```tsx
{issue.meta.language && (
  <div className="bg-[#141414] border border-[#262626] rounded-lg p-3">
    <div className="text-[#737373] text-xs mb-1">Language</div>
    <div className="text-white font-mono text-sm">{issue.meta.language}</div>
  </div>
)}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/issues/[id]/page.tsx
git commit -m "feat: show language on issue detail page"
```

---

### Task 5: Build and smoke-test

**Files:** none (verification only)

- [ ] **Step 1: Run the Next.js build**

```bash
npm run build
```

Expected: build completes with no errors. Static pages for all 13 issues are generated.

- [ ] **Step 2: Start the server and spot-check**

```bash
npm run start
```

Open `http://localhost:3000/issues` — verify each row shows a language badge.
Open `http://localhost:3000/issues/AI-2026-AUTH-001` — verify the metadata grid shows a `Language` card with value `Python`.
Open `http://localhost:3000/issues/KUASAR-2026-KERNEL-001` — verify `Language` shows `Rust`.
Open `http://localhost:3000/issues/HITLS-2026-CRYPTO-001` — verify `Language` shows `C++`.

- [ ] **Step 3: Commit if any last fixes were needed**

```bash
git add -p
git commit -m "fix: address build or display issues from smoke test"
```
