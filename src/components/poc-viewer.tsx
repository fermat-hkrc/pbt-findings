"use client";

import { useState } from "react";
import type { PocData } from "@/lib/content";

export default function PocViewer({ poc }: { poc: PocData }) {
  const [activeFile, setActiveFile] = useState(0);

  return (
    <div className="mt-8">
      <h2
        id="poc-验证"
        className="text-xl font-semibold text-white border-b border-[#262626] pb-3 mb-4 scroll-mt-8"
      >
        PoC 验证
      </h2>

      {/* File tabs */}
      {poc.files.length > 1 && (
        <div className="flex gap-1 mb-2 overflow-x-auto">
          {poc.files.map((file, i) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(i)}
              className={`px-3 py-1.5 text-xs font-mono rounded-t border border-b-0 transition-colors whitespace-nowrap ${
                i === activeFile
                  ? "bg-[#1a1a2e] text-white border-[#333]"
                  : "bg-[#111] text-[#737373] border-[#262626] hover:text-[#a3a3a3]"
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>
      )}

      {/* Code viewer */}
      {poc.files.length > 0 && (
        <div className="relative">
          <div className="absolute top-2 right-2 text-xs text-[#737373] font-mono">
            {poc.files[activeFile].language}
          </div>
          <pre className="bg-[#1a1a2e] border border-[#262626] rounded-b-lg p-4 overflow-x-auto text-sm leading-relaxed">
            <code className={`language-${poc.files[activeFile].language}`}>
              {poc.files[activeFile].content}
            </code>
          </pre>
        </div>
      )}

      {/* Output */}
      {poc.output && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[#a3a3a3] mb-2">
            Expected Output
          </h3>
          <pre className="bg-[#111] border border-[#262626] rounded-lg p-4 overflow-x-auto text-sm leading-relaxed text-green-400">
            {poc.output}
          </pre>
        </div>
      )}
    </div>
  );
}