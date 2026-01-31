"use client"

import { useState } from "react"
import { Check, Copy, FileCode, ExternalLink } from "lucide-react"

interface CodeInspectorProps {
    code: string
    highlightedCode: string
    filename: string
    sourcePath: string
}

export function CodeInspector({ code, highlightedCode, filename, sourcePath }: CodeInspectorProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div id="dexter-code-viewer" className="flex flex-col overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/40 px-6 py-4">
                <div className="flex items-center gap-3">
                    <FileCode size={16} className="text-accent" />
                    <div className="flex flex-col">
                        <span className="text-xs font-black tracking-tight text-zinc-200">{filename}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">READ_ONLY_MODE</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
                    >
                        {copied ? (
                            <>
                                <Check size={12} className="text-emerald-500" />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy size={12} />
                                <span>Copy Implementation</span>
                            </>
                        )}
                    </button>
                    <a
                        href={`https://github.com/george/ergast/blob/main/${sourcePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all hover:border-zinc-700 hover:text-zinc-400"
                    >
                        <ExternalLink size={12} />
                        GitHub
                    </a>
                </div>
            </div>
            <div className="relative group">
                <div
                    className="overflow-hidden p-8 text-sm font-medium leading-relaxed font-mono selection:bg-accent/30 selection:text-zinc-100 [&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:m-0! [&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word [&_code]:whitespace-pre-wrap [&_code]:wrap-break-word"
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />

                {/* Subtle Glow Effect */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/50" />
            </div>
            <div className="flex items-center justify-between bg-zinc-900/20 px-6 py-3 border-t border-zinc-900">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">Source: {sourcePath}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">shiki-highlighter v1.0</span>
            </div>
        </div>
    )
}
