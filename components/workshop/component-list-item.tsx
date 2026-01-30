"use client"

import Link from "next/link"
import { ComponentStatus } from "@/lib/component-registry"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Wrench, ChevronRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ComponentListItemProps {
    name: string
    slug: string
    category: string
    status: ComponentStatus
    reuseCount: number
    updatedAt: string
    description: string
}

const statusIcons: Record<ComponentStatus, LucideIcon> = {
    "production-ready": CheckCircle2,
    "experimental": Wrench,
    "in-progress": AlertCircle,
}

export function ComponentListItem({
    name,
    slug,
    category,
    status,
    reuseCount,
    updatedAt,
    description
}: ComponentListItemProps) {
    const StatusIcon = statusIcons[status] || AlertCircle

    return (
        <Link
            href={`/workshop/components/${slug}`}
            className="group flex flex-col border-b border-zinc-900 bg-transparent transition-all hover:bg-zinc-900/40"
        >
            <div className="flex items-center gap-4 px-4 py-4 sm:px-6">
                {/* Name & Slug Column */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-zinc-100 group-hover:text-accent transition-colors">
                            {name}
                        </span>
                    </div>
                    <span className="truncate text-[10px] font-medium text-zinc-600">
                        {slug}
                    </span>
                </div>

                {/* Category Column */}
                <div className="hidden w-24 shrink-0 sm:block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {category}
                    </span>
                </div>

                {/* Status Column */}
                <div className="hidden w-32 shrink-0 items-center gap-2 sm:flex">
                    <div className={cn(
                        "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                        status === "production-ready" && "bg-emerald-500/10 text-emerald-500",
                        status === "experimental" && "bg-amber-500/10 text-amber-500",
                        status === "in-progress" && "bg-blue-500/10 text-blue-500",
                    )}>
                        <StatusIcon size={10} />
                        {status.split("-")[0]}
                    </div>
                </div>

                {/* Reuse Count Column */}
                <div className="hidden w-20 shrink-0 text-center sm:block">
                    <span className="text-[10px] font-bold text-zinc-400">
                        {reuseCount}
                    </span>
                    <span className="ml-1 text-[8px] font-black uppercase tracking-tighter text-zinc-600">ops</span>
                </div>

                {/* Date Column */}
                <div className="hidden w-24 shrink-0 text-right sm:block">
                    <span className="text-[10px] font-medium text-zinc-500">
                        {updatedAt}
                    </span>
                </div>

                {/* Arrow */}
                <div className="shrink-0 text-zinc-800 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600">
                    <ChevronRight size={16} />
                </div>
            </div>

            {/* Optional Hover Description (mobile/expanded) */}
            <div className="max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-20">
                <div className="px-4 pb-4 pt-0 sm:px-6">
                    <p className="text-[11px] leading-relaxed text-zinc-500 line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    )
}
