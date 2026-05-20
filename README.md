# PBT Findings

A live dashboard tracking bugs and vulnerabilities discovered through **Property-Based Testing**.

**Live site:** https://fermat-hkrc.github.io/pbt-findings/

## What is this?

This site catalogs bugs found by applying property-based testing (PBT) to open-source codebases. Each finding includes:

- **CWE classification** and severity
- **Vulnerable code** with trace
- **Trigger conditions** and impact analysis
- **Suggested fixes**
- **Upstream issue links** and status tracking

## Tech Stack

- **Next.js 16** (static export via `next build`)
- **Tailwind CSS v4** for styling
- **gray-matter** for Markdown frontmatter parsing
- **react-markdown** with rehype/remark plugins for issue rendering
- **GitHub Pages** for deployment

## Project Structure

```
content/
  issues/          # PBT-*.md — bug reports with frontmatter
  pocs/            # Proof-of-concept files per issue (optional)
src/
  app/             # Next.js App Router pages
  components/      # React components (issues list, content, PoC viewer)
  lib/             # content.ts — issue loading/parsing
docs/              # Background documentation
```

## Issue Format

Each issue is a Markdown file in `content/issues/` with frontmatter:

```yaml
---
id: PBT-OH-2026-DEVMGR-002
date: "2026-05-18"
repo: distributedhardware_device_manager
repo_url: https://gitcode.com/openharmony/distributedhardware_device_manager
title: "Description of the bug"
cwe: CWE-20
cwe_name: Improper Input Validation
severity: MEDIUM
status: SUBMITTED         # CONFIRMED_REAL | CONFIRMED_FIXED | SUBMITTED | PENDING
issue_url: https://...
affected_version: "*"
component: module_name
file_paths:
  - path/to/vulnerable/file.c
author: finder_name
---

## Summary
...
## Vulnerable Code
...
## Suggested Fix
...
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```

## Adding a New Finding

1. Create `content/issues/PBT-<PROJECT>-2026-<CATEGORY>-<NNN>.md` with frontmatter
2. Optionally add PoC files under `content/pocs/<issue-id>/`
3. Run `npm run validate` to check frontmatter
4. Push to `main` — GitHub Actions deploys automatically

## Documentation

- [Introduction to Property-Based Testing](docs/intro-to-pbt.md)
- [PBT Workflow Guide](docs/pbt-workflow.md)
- [openGauss Findings](docs/openGauss_findings.md)

## Related

- [Fermat Review Board](https://fermat-hkrc.github.io/Fermat-Review-Board/) — full vulnerability tracking dashboard (PBT + static analysis)
- [PBT Skills](https://github.com/fermat-hkrc/pbt-skills) — testing skills and strategies