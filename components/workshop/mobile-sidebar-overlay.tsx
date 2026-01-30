"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { WorkshopSidebar } from "./workshop-sidebar"

interface MobileSidebarOverlayProps {
    open: boolean
    onClose: () => void
}

export function MobileSidebarOverlay({ open, onClose }: MobileSidebarOverlayProps) {
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute inset-y-0 left-0 w-80 bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-zinc-900">
                    <div className="text-xs font-black uppercase tracking-widest text-zinc-600">Menu</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-2 text-zinc-500 transition-colors hover:bg-zinc-900/40 hover:text-zinc-200"
                        aria-label="Close sidebar"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="h-[calc(100vh-73px)] overflow-y-auto">
                    <WorkshopSidebar className="border-0 bg-transparent" />
                </div>
            </div>
        </div>
    )
}
