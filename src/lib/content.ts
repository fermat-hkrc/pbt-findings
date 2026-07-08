import fs from "fs";
import path from "path";
import matter from "gray-matter";

const issuesDirectory = path.join(process.cwd(), "content/issues");
const pocsDirectory = path.join(process.cwd(), "content/pocs");

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
  internal_issue_id?: string;
  stars?: number;
}

export interface Issue {
  meta: IssueMeta;
  content: string;
  poc?: PocData;
}

export interface PocData {
  files: { name: string; content: string; language: string }[];
  output?: string;
}

const HIDDEN_STATUSES = new Set(["PENDING", "CLOSED"]);

export function getAllIssueIds(): string[] {
  if (!fs.existsSync(issuesDirectory)) return [];
  return fs
    .readdirSync(issuesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .filter((id) => {
      const meta = getIssueMeta(id);
      return meta !== null && !HIDDEN_STATUSES.has(meta.status);
    });
}

function getDtsIndex(internalIssueId?: string): number {
  if (!internalIssueId) return -1;
  const match = internalIssueId.match(/(\d{5})$/);
  return match ? Number.parseInt(match[1], 10) : -1;
}

function compareIssues(a: IssueMeta, b: IssueMeta): number {
  const byDate = b.date.localeCompare(a.date);
  if (byDate !== 0) return byDate;

  const aDts = getDtsIndex(a.internal_issue_id);
  const bDts = getDtsIndex(b.internal_issue_id);
  if (aDts !== bDts) return bDts - aDts;

  return b.id.localeCompare(a.id);
}

export function getAllIssues(): IssueMeta[] {
  return getAllIssueIds()
    .map((id) => getIssueMeta(id))
    .filter((m): m is IssueMeta => m !== null)
    .sort(compareIssues);
}

export function getIssueMeta(id: string): IssueMeta | null {
  const filePath = path.join(issuesDirectory, `${id}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  const meta = data as IssueMeta;
  if (!meta.has_poc) {
    const pocDir = path.join(pocsDirectory, id);
    if (fs.existsSync(pocDir)) {
      const entries = fs.readdirSync(pocDir).filter((f) => !f.startsWith("."));
      if (entries.length > 0) meta.has_poc = true;
    }
  }
  return meta;
}

export function getIssue(id: string): Issue | null {
  const filePath = path.join(issuesDirectory, `${id}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const poc = getPocData(id);
  return { meta: data as IssueMeta, content, poc: poc ?? undefined };
}

function getPocData(issueId: string): PocData | null {
  const pocDir = path.join(pocsDirectory, issueId);
  if (!fs.existsSync(pocDir)) return null;
  const entries = fs.readdirSync(pocDir);
  const files = entries
    .filter((f) => !f.startsWith("."))
    .map((f) => {
      const ext = path.extname(f).slice(1);
      const langMap: Record<string, string> = {
        c: "c",
        cpp: "cpp",
        h: "c",
        py: "python",
        sh: "bash",
        txt: "text",
        md: "markdown",
        rs: "rust",
        go: "go",
        java: "java",
        js: "javascript",
        ts: "typescript",
      };
      return {
        name: f,
        content: fs.readFileSync(path.join(pocDir, f), "utf-8"),
        language: langMap[ext] || "text",
      };
    });
  const outputFile = files.find((f) => f.name === "output.txt");
  return {
    files: files.filter((f) => f.name !== "output.txt"),
    output: outputFile?.content,
  };
}

export function getVerifiedPocIssues(): IssueMeta[] {
  const issues = getAllIssues();
  return issues.filter((i) => i.has_poc === true);
}

export function getConfirmedIssues(): IssueMeta[] {
  const issues = getAllIssues();
  return issues.filter(
    (i) => i.status === "CONFIRMED_REAL" || i.status === "CONFIRMED_FIXED"
  ).filter((i) => i.status !== "CLOSED");
}

export function getDtsIssues(): IssueMeta[] {
  return getAllIssues().filter((i) => i.internal_issue_id?.startsWith("DTS"));
}

export function getUnconfirmedIssues(): IssueMeta[] {
  const issues = getAllIssues();
  return issues.filter(
    (i) =>
      i.status !== "CONFIRMED_REAL" &&
      i.status !== "CONFIRMED_FIXED" &&
      i.status !== "CLOSED"
  );
}

export interface Stats {
  total: number;
  confirmed: number;
  fixed: number;
  unconfirmed: number;
  repos: number;
  byCwe: Record<string, number>;
  byStatus: Record<string, number>;
  byRepo: Record<string, number>;
  bySeverity: Record<string, number>;
}

export function getStats(): Stats {
  const issues = getAllIssues();
  const byCwe: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byRepo: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};

  for (const issue of issues) {
    const cweLabel = issue.cwe_name
      ? `${issue.cwe} ${issue.cwe_name}`
      : issue.cwe;
    byCwe[cweLabel] = (byCwe[cweLabel] || 0) + 1;
    byStatus[issue.status] = (byStatus[issue.status] || 0) + 1;
    byRepo[issue.repo] = (byRepo[issue.repo] || 0) + 1;
    const sev = issue.severity || "UNKNOWN";
    bySeverity[sev] = (bySeverity[sev] || 0) + 1;
  }

  const confirmed = issues.filter(
    (i) => i.status === "CONFIRMED_REAL" || i.status === "CONFIRMED_FIXED"
  ).length;

  const unconfirmed = issues.filter(
    (i) =>
      i.status !== "CONFIRMED_REAL" &&
      i.status !== "CONFIRMED_FIXED" &&
      i.status !== "CLOSED" &&
      i.status !== "PENDING"
  ).length;

  return {
    total: issues.length,
    confirmed,
    fixed: 0,
    unconfirmed,
    repos: Object.keys(byRepo).length,
    byCwe,
    byStatus,
    byRepo,
    bySeverity,
  };
}