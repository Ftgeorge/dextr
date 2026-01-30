"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle2, Wrench, AlertCircle, Search, ArrowUpDown, CornerDownLeft } from "lucide-react"

const STORAGE_KEY = "dextr:onboarding:dismissed"

export function OnboardingModal() {
    const [open, setOpen] = useState(() => {
        try {
            const dismissed = window.localStorage.getItem(STORAGE_KEY)
            return !dismissed
        } catch {
            return true
        }
    })

    useEffect(() => {
        if (!open) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [open])

    const close = () => {
        try {
            window.localStorage.setItem(STORAGE_KEY, "1")
        } catch {
            // ignore
        }
        setOpen(false)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={close} />
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 shadow-2xl">
                    <div className="flex items-start justify-between border-b border-zinc-900 bg-zinc-900/30 px-8 py-6">
                        <div className="flex flex-col gap-1">
                            <div className="text-lg font-black tracking-tight text-zinc-100">Welcome to Dextr</div>
                            <div className="text-xs font-medium leading-relaxed text-zinc-500">A personal workshop for building, validating, and reusing UI components.</div>
                        </div>
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-2 text-zinc-500 transition-colors hover:bg-zinc-900/40 hover:text-zinc-200"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="grid gap-8 px-8 py-8">
                        <div className="grid gap-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">What you’re looking at</div>
                            <div className="text-sm font-medium leading-relaxed text-zinc-300">
                                Use the sidebar to browse components by category, preview them in isolation, and inspect code + usage guidelines on the right.
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Status icons</div>
                            <div className="grid gap-3">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    <div className="text-xs font-medium text-zinc-300">
                                        <span className="font-black text-zinc-100">Production-ready</span> — stable and ready to ship.
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Wrench size={14} className="text-amber-500" />
                                    <div className="text-xs font-medium text-zinc-300">
                                        <span className="font-black text-zinc-100">Experimental</span> — usable, but still evolving.
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AlertCircle size={14} className="text-blue-500" />
                                    <div className="text-xs font-medium text-zinc-300">
                                        <span className="font-black text-zinc-100">In-progress</span> — planned or under active construction.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Quick navigation</div>
                            <div className="grid gap-3">
                                <div className="flex items-center gap-3">
                                    <Search size={14} className="text-zinc-500" />
                                    <div className="text-xs font-medium text-zinc-300">
                                        Press <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-200">/</span> to focus search.
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ArrowUpDown size={14} className="text-zinc-500" />
                                    <div className="text-xs font-medium text-zinc-300">
                                        Use <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-200">↑</span> / <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-200">↓</span> to navigate.
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CornerDownLeft size={14} className="text-zinc-500" />
                                    <div className="text-xs font-medium text-zinc-300">
                                        Press <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px] text-zinc-200">Enter</span> to open a selected component.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-zinc-900 bg-zinc-900/20 px-8 py-5">
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-xl bg-accent px-5 py-2 text-[10px] font-black uppercase tracking-widest text-accent-foreground transition-all hover:opacity-90 active:opacity-80"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
