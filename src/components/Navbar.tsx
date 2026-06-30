import React from "react";
import { Sparkles, Download, Copy, Check, Github, Code2, Globe } from "lucide-react";

interface NavbarProps {
  onCopy: () => void;
  onDownload: () => void;
  isCopied: boolean;
  profileName: string;
}

export default function Navbar({ onCopy, onDownload, isCopied, profileName }: NavbarProps) {
  return (
    <nav className="border-b border-[#30363d] bg-[#0d1117] px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-[#58a6ff] to-[#1f6feb] shadow-md border border-[#30363d]">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-lg font-bold tracking-tight text-[#58a6ff]">
                README Architect
              </span>
              <span className="rounded-full bg-[#161b22] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-[#7ee787] border border-[#30363d]">
                PRO BUILDER
              </span>
            </div>
            <p className="font-mono text-xs text-[#8b949e]">
              Personalized for <span className="text-[#c9d1d9] font-semibold">{profileName}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Center Banner (High design fidelity, no tech larping) */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-[#161b22] border border-[#30363d] px-4 py-1.5 text-xs text-[#8b949e] font-sans">
          <Sparkles className="h-3.5 w-3.5 text-[#e3b341] animate-pulse" />
          <span>Interactive Markdown Canvas & AI Resume Polisher</span>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            id="nav-btn-copy"
            onClick={onCopy}
            className="flex items-center gap-2 rounded-lg bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] active:scale-95 transition-all px-3 py-2 text-xs font-medium text-[#c9d1d9] cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 text-[#7ee787] animate-bounce" />
                <span className="text-[#7ee787] font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#8b949e]" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            id="nav-btn-download"
            onClick={onDownload}
            className="flex items-center gap-2 rounded-lg bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043]/35 active:scale-95 transition-all px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-950/20 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Download README.md</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
