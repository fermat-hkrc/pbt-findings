import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllIssueIds, getIssue } from "@/lib/content";
import IssueContent from "@/components/issue-content";
import PocViewer from "@/components/poc-viewer";

export function generateStaticParams() {
  return getAllIssueIds().map((id) => ({ id }));
}

export const dynamicParams = false;

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    CONFIRMED_REAL: "bg-green-500/20 text-green-400 border-green-500/30",
    CONFIRMED_FIXED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CLOSED: "bg-red-500/20 text-red-400 border-red-500/30",
    SUBMITTED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PENDING: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    NEEDS_REVIEW: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    FALSE_POSITIVE: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    CODE_QUALITY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  const labels: Record<string, string> = {
    CONFIRMED_REAL: "Confirmed",
    CONFIRMED_FIXED: "Fixed",
    CLOSED: "Closed",
    SUBMITTED: "Submitted",
    PENDING: "Pending",
    NEEDS_REVIEW: "Review",
    FALSE_POSITIVE: "FP",
    CODE_QUALITY: "Quality",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
    >
      {labels[status] || status}
    </span>
  );
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = getIssue(id);
  if (!issue) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-[#737373] mb-6">
        <Link href="/" className="hover:text-white">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/issues" className="hover:text-white">
          Issues
        </Link>
        <span>/</span>
        <span className="text-[#a3a3a3]">{issue.meta.id}</span>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <StatusBadge status={issue.meta.status} />
          {issue.meta.cwe && (
            <span className="text-xs font-mono text-blue-400 bg-[#1a1a2e] px-2 py-0.5 rounded border border-blue-500/20">
              {issue.meta.cwe}
              {issue.meta.cwe_name && ` — ${issue.meta.cwe_name}`}
            </span>
          )}
        </div>
        <h1 className="text-xl font-bold text-white mb-4">
          {issue.meta.title}
        </h1>

        {issue.meta.issue_url && (
          <a
            href={issue.meta.issue_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-4 px-4 py-2.5 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-300 hover:bg-blue-600/30 hover:text-blue-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-sm font-medium">View Upstream Issue</span>
            <span className="text-xs text-blue-400/70">{issue.meta.issue_url.replace(/https?:\/\//, "")}</span>
          </a>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          {issue.meta.repo && (
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-3">
              <div className="text-[#737373] text-xs mb-1">Repository</div>
              <div className="text-white font-mono text-sm">
                {issue.meta.repo_url ? (
                  <a href={issue.meta.repo_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    {issue.meta.repo}
                  </a>
                ) : issue.meta.repo}
              </div>
            </div>
          )}
          {issue.meta.date && (
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-3">
              <div className="text-[#737373] text-xs mb-1">Date</div>
              <div className="text-white font-mono text-sm">{issue.meta.date}</div>
            </div>
          )}
          {issue.meta.component && (
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-3">
              <div className="text-[#737373] text-xs mb-1">Component</div>
              <div className="text-white font-mono text-sm">{issue.meta.component}</div>
            </div>
          )}
          {issue.meta.language && (
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-3">
              <div className="text-[#737373] text-xs mb-1">Language</div>
              <div className="text-white font-mono text-sm">{issue.meta.language}</div>
            </div>
          )}
          {issue.meta.affected_version && (
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-3">
              <div className="text-[#737373] text-xs mb-1">Affected Version</div>
              <div className="text-white font-mono text-sm">{issue.meta.affected_version}</div>
            </div>
          )}
        </div>

        {issue.meta.file_paths && issue.meta.file_paths.length > 0 && (
          <div className="mt-3 bg-[#141414] border border-[#262626] rounded-lg p-3">
            <div className="text-[#737373] text-xs mb-2">Affected Files</div>
            <div className="flex flex-wrap gap-2">
              {issue.meta.file_paths.map((fp) => (
                <span key={fp} className="text-xs font-mono px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded text-[#d4d4d4]">
                  {fp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <IssueContent content={issue.content} />
      </div>

      {issue.poc && <PocViewer poc={issue.poc} />}
    </div>
  );
}
