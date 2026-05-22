# 2026-05-22 Issue Language Metadata Design

## Summary
Add an explicit required `language` frontmatter field to every issue markdown file under `content/issues/`, and render that language on both the issue list page and the issue detail page.

## Goals
- Make primary implementation language visible for each issue
- Keep issue markdown as the source of truth
- Support current languages: `Python`, `Rust`, `C++`
- Show language in both `/issues` and `/issues/[id]`

## Non-Goals
- Automatic language inference from file paths or PoC files
- Multi-language support per issue
- New filtering or search behavior by language
- Broad content model refactors

## Existing Context
- Issue content lives in `content/issues/*.md` with YAML frontmatter
- `src/lib/content.ts` parses markdown frontmatter into `IssueMeta`
- `src/components/issues-list.tsx` renders the issue list page
- `src/app/issues/[id]/page.tsx` renders issue detail pages
- Homepage and other pages also consume `IssueMeta`, so type additions must remain compatible there

## Chosen Approach
Use a manual single-value frontmatter field:

```yaml
language: Python
```

This field is required for all current and future issue entries.

## Alternatives Considered

### 1. Infer language from `file_paths` or PoC files
Rejected. File extensions are not always a reliable source of primary issue language, and inference would introduce hidden rules and brittle behavior.

### 2. Store language in a separate mapping file
Rejected. This duplicates metadata already belonging to issue content and increases drift risk.

## Data Model
Extend `IssueMeta` with:

```ts
language: string;
```

Content convention treats this field as required after migration. The UI will render the provided string directly.

## Content Migration
Update every existing markdown file in `content/issues/` to include a `language` field with one of:
- `Python`
- `Rust`
- `C++`

Each value should be chosen manually from the issue context, such as affected file paths and repository language.

## UI Changes

### Issue list
Render language as a compact badge within each issue row, consistent with the existing metadata/badge style.

### Issue detail
Render language in the metadata card grid as a dedicated `Language` field.

## Validation Strategy
- Type-level support in `src/lib/content.ts`
- If issue validation tooling exists later, require `language` there too
- No inference fallback; missing data should be treated as incomplete content, not silently guessed

## Testing
- Verify issue list page shows language for migrated entries
- Verify issue detail page shows language field
- Verify no existing pages break from the new metadata field
- Run existing lint/build or validation commands available in the repository

## Risks
- Incorrect manual language assignment during migration
- Inconsistent badge/card styling if list and detail implementations diverge

## Mitigations
- Use affected file paths and repository context when assigning language
- Reuse existing metadata visual patterns instead of introducing a new presentation system
