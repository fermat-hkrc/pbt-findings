/**
 * Validate frontmatter of every write-up under content/issues/.
 *
 * Usage: npm run validate   (or: npx tsx scripts/validate-issues.ts)
 *
 * Zero runtime dependencies: parses the simple frontmatter dialect used by
 * this repo (scalar `key: value` pairs plus `- item` lists) so it works on a
 * fresh clone without `npm install`.
 *
 * Errors fail the run (exit 1); warnings do not.
 */

import fs from "fs";
import path from "path";

const issuesDir = path.join(process.cwd(), "content", "issues");
const pocsDir = path.join(process.cwd(), "content", "pocs");

const REQUIRED_KEYS = ["id", "date", "repo", "repo_url", "title", "cwe", "status"] as const;
const VALID_STATUSES = new Set(["CONFIRMED_FIXED", "CONFIRMED_REAL", "SUBMITTED", "PENDING", "CLOSED"]);
const VALID_SEVERITIES = new Set(["HIGH", "MEDIUM", "LOW"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CWE_RE = /^CWE-\d+$/;
const DTS_RE = /^DTS\d{10,}$/;

type Frontmatter = Record<string, string | number | boolean | string[]>;

interface Result {
  file: string;
  errors: string[];
  warnings: string[];
}

function unquote(v: string): string {
  const t = v.trim();
  if (
    (t.startsWith('"') && t.endsWith('"') && t.length >= 2) ||
    (t.startsWith("'") && t.endsWith("'") && t.length >= 2)
  ) {
    return t.slice(1, -1);
  }
  return t;
}

/** Parse the repo's frontmatter dialect: `key: value` and `- item` list lines. */
function parseFrontmatter(raw: string): { data: Frontmatter; parseError?: string } {
  const normalized = raw.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, parseError: "file must start with a `---` frontmatter block" };
  }
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return { data: {}, parseError: "unterminated frontmatter block (missing closing `---`)" };

  const data: Frontmatter = {};
  let currentListKey: string | null = null;
  const lines = normalized.slice(4, end).split("\n");
  for (const line of lines) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const listItem = line.match(/^\s+-\s+(.*)$/);
    if (listItem && currentListKey) {
      const existing = data[currentListKey];
      const value = unquote(listItem[1]);
      if (Array.isArray(existing)) existing.push(value);
      else data[currentListKey] = [value];
      continue;
    }
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!kv) return { data: {}, parseError: `unparseable frontmatter line: ${line.trim()}` };
    const key = kv[1];
    const rawValue = kv[2].trim();
    currentListKey = rawValue === "" ? key : null;
    if (rawValue === "") continue; // list (or empty) — filled by `- item` lines
    const unquoted = unquote(rawValue);
    if (unquoted === "true" || unquoted === "false") data[key] = unquoted === "true";
    else if (/^-?\d+$/.test(unquoted)) data[key] = Number.parseInt(unquoted, 10);
    else data[key] = unquoted;
  }
  return { data };
}

function validateFile(fileName: string): Result {
  const res: Result = { file: fileName, errors: [], warnings: [] };
  const stem = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(issuesDir, fileName), "utf-8");

  const { data: fm, parseError } = parseFrontmatter(raw);
  if (parseError) {
    res.errors.push(parseError);
    return res;
  }

  // Required keys present and non-empty
  for (const key of REQUIRED_KEYS) {
    const v = fm[key];
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) {
      res.errors.push(`missing required frontmatter key: ${key}`);
    }
  }
  if (res.errors.length > 0) return res; // nothing more can be checked reliably

  // id must match the filename
  if (fm.id !== stem) res.errors.push(`id "${fm.id}" does not match filename "${stem}"`);

  // status enum
  if (typeof fm.status !== "string" || !VALID_STATUSES.has(fm.status)) {
    res.errors.push(`invalid status "${fm.status}" (expected one of ${[...VALID_STATUSES].join(", ")})`);
  }

  // severity enum (optional but must be valid when present)
  if (fm.severity !== undefined && !VALID_SEVERITIES.has(String(fm.severity))) {
    res.errors.push(`invalid severity "${fm.severity}" (expected HIGH, MEDIUM, or LOW)`);
  } else if (fm.severity === undefined) {
    res.warnings.push("no severity set");
  }

  // date format
  if (typeof fm.date !== "string" || !DATE_RE.test(fm.date)) {
    res.errors.push(`invalid date "${fm.date}" (expected YYYY-MM-DD)`);
  }

  // CWE shape
  if (typeof fm.cwe !== "string" || !CWE_RE.test(fm.cwe)) {
    res.errors.push(`invalid cwe "${fm.cwe}" (expected CWE-<number>)`);
  }

  // URLs
  for (const urlKey of ["repo_url", "issue_url"]) {
    const v = fm[urlKey];
    if (v !== undefined && v !== "" && !/^https?:\/\//.test(String(v))) {
      res.errors.push(`${urlKey} "${v}" is not an http(s) URL`);
    }
  }

  // file_paths shape
  if (fm.file_paths !== undefined) {
    if (!Array.isArray(fm.file_paths) || fm.file_paths.length === 0 || !fm.file_paths.every((p) => typeof p === "string" && p !== "")) {
      res.errors.push("file_paths must be a non-empty list of strings");
    }
  }

  // internal_issue_id shape (warning for non-DTS-shaped ids — see docs)
  if (fm.internal_issue_id !== undefined) {
    const id = String(fm.internal_issue_id);
    if (!DTS_RE.test(id)) {
      res.warnings.push(`internal_issue_id "${id}" does not match DTS<digits> (odd-length ids exist historically)`);
    }
  }

  // body sanity: must not be empty, should have a Summary section
  const body = raw.slice(raw.indexOf("\n---", 4) + 4);
  if (body.trim() === "") res.errors.push("empty body (no content after frontmatter)");
  else if (!/^##\s+Summary\b/m.test(body)) res.warnings.push("body has no `## Summary` section");

  // PoC directory cross-check
  if (fm.has_poc === true) {
    const pocPath = path.join(pocsDir, stem);
    if (!fs.existsSync(pocPath) || fs.readdirSync(pocPath).filter((f) => !f.startsWith(".")).length === 0) {
      res.warnings.push("has_poc: true but content/pocs/<id>/ is missing or empty");
    }
  }

  return res;
}

function main(): number {
  if (!fs.existsSync(issuesDir)) {
    console.error(`issues directory not found: ${issuesDir}`);
    return 2;
  }
  const files = fs.readdirSync(issuesDir).filter((f) => f.endsWith(".md")).sort();
  if (files.length === 0) {
    console.error("no issues found under content/issues/");
    return 2;
  }

  const results = files.map(validateFile);
  const withErrors = results.filter((r) => r.errors.length > 0);
  const withWarnings = results.filter((r) => r.errors.length === 0 && r.warnings.length > 0);

  for (const r of withErrors) {
    console.error(`\n✗ ${r.file}`);
    for (const e of r.errors) console.error(`    ERROR: ${e}`);
    for (const w of r.warnings) console.error(`    warn:  ${w}`);
  }
  for (const r of withWarnings) {
    console.warn(`~ ${r.file}`);
    for (const w of r.warnings) console.warn(`    warn: ${w}`);
  }

  const counts = { published: 0, unpublished: 0 };
  for (const r of results) {
    const raw = fs.readFileSync(path.join(issuesDir, r.file), "utf-8");
    const { data } = parseFrontmatter(raw);
    if (data.status === "CONFIRMED_FIXED" || data.status === "CONFIRMED_REAL") counts.published += 1;
    else counts.unpublished += 1;
  }

  console.log(
    `\n${files.length} issues checked: ${withErrors.length} with errors, ${withWarnings.length} with warnings` +
      ` (${counts.published} published [CONFIRMED_*], ${counts.unpublished} not shown on site [${["SUBMITTED", "PENDING", "CLOSED"].join("/")}])`
  );

  return withErrors.length > 0 ? 1 : 0;
}

process.exit(main());
