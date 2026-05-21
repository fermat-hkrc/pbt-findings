import type { Metadata } from "next";
import Link from "next/link";
import { getUnconfirmedIssues } from "@/lib/content";

export const metadata: Metadata = {
  title: "Unconfirmed Issues — PBT Findings",
  description: "PBT findings not yet confirmed or fixed by upstream maintainers.",
};

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    SUBMITTED: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PENDING: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    NEEDS_REVIEW: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    FALSE_POSITIVE: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    CODE_QUALITY: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  const labels: Record<string, string> = {
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

function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) return null;
  const colors: Record<string, string> = {
    CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
    HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    LOW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[severity] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
    >
      {severity}
    </span>
  );
}

export default function UnconfirmedPage() {
  const issues = getUnconfirmedIssues();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#737373] mb-4">
          <Link href="/" className="hover:text-white">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#a3a3a3]">Unconfirmed Issues</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Unconfirmed Issues
        </h1>
        <p className="text-[#a3a3a3]">
          {issues.length} findings not yet confirmed or fixed by upstream maintainers.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-lg overflow-hidden divide-y divide-[#1e1e1e]">
        {issues.length === 0 ? (
          <div className="px-6 py-12 text-center text-[#737373]">
            No unconfirmed issues yet.
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="px-6 py-5 hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <StatusBadge status={issue.status} />
                    <SeverityBadge severity={issue.severity} />
                    <Link
                      href={`/issues/${issue.id}`}
                      className="text-[15px] font-medium text-white hover:text-blue-300 transition-colors"
                    >
                      {issue.title}
                    </Link>
                  </div>
                  {issue.cwe && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#1a1a2e] text-blue-400 border border-blue-500/20">
                        {issue.cwe}
                        {issue.cwe_name && ` — ${issue.cwe_name}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[#737373]">
                    <span className="font-mono">{issue.id}</span>
                    <span>{issue.repo}</span>
                    <span>{issue.date}</span>
                    {issue.author && <span>by {issue.author}</span>}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {issue.issue_url && (
                    <a
                      href={issue.issue_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Issue
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}