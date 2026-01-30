"use client"

import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileSidebarToggleProps {
    onClick: () => void
    className?: string
}

export function MobileSidebarToggle({ onClick, className }: MobileSidebarToggleProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-900 bg-zinc-900/30 text-zinc-500 transition-colors hover:bg-zinc-900/50 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-accent/20",
                className
            )}
            aria-label="Open sidebar"
        >
            <Menu size={18} />
        </button>
    )
}
