import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ComponentStatus } from "@/lib/component-registry"
import { CheckCircle2, AlertCircle, Wrench } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface WorkshopCardProps {
    name: string
    slug: string
    category: string
    description: string
    preview: ReactNode
    status: ComponentStatus
    tags: string[]
}

const statusIcons: Record<ComponentStatus, LucideIcon> = {
    "production-ready": CheckCircle2,
    "experimental": Wrench,
    "in-progress": AlertCircle,
}

export function WorkshopCard({ name, slug, category, description, preview, status, tags }: WorkshopCardProps) {
    const StatusIcon = statusIcons[status] || AlertCircle

    return (
        <Link
            href={`/workshop/components/${slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 transition-all hover:border-accent/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.05)]"
        >
            <div className="flex h-56 items-center justify-center border-b border-zinc-900 bg-zinc-900/30 p-10 transition-all group-hover:bg-zinc-900/10">
                <div className="scale-90 transition-transform duration-500 group-hover:scale-100">
                    {preview}
                </div>
            </div>
            <div className="flex flex-col p-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-accent transition-colors">
                        {category}
                    </div>
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
                <h3 className="text-xl font-black tracking-tight text-zinc-100 mb-3">
                    {name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-medium">
                    {description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="rounded-lg bg-zinc-900 px-3 py-1 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}
