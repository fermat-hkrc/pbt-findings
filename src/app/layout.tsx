import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PBT Findings — Property-Based Testing Bug Tracker",
  description:
    "Security vulnerabilities and bugs discovered through Property-Based Testing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}