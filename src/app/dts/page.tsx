import type { Metadata } from "next";
import { getDtsIssues } from "@/lib/content";
import IssuesListClient from "@/components/issues-list";

export const metadata: Metadata = {
  title: "DTS Issues - PBT Findings",
  description: "PBT findings tracked with internal DTS tickets.",
};

export default function DtsIssuesPage() {
  const issues = getDtsIssues();
  return (
    <IssuesListClient
      issues={issues}
      title="DTS Issues"
      description={`${issues.length} issues tracked with internal DTS tickets`}
    />
  );
}
