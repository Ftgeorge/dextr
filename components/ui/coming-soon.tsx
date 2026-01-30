import { ReactNode } from "react"

interface ComingSoonProps {
    title?: string
    description?: string
    icon?: ReactNode
}

export function ComingSoon({ title = "Coming soon", description = "This component is planned and will be implemented here.", icon }: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-900 bg-zinc-900/20 px-10 py-10 text-center">
            {icon ? <div className="text-zinc-600">{icon}</div> : null}
            <div className="text-sm font-black tracking-tight text-zinc-100">{title}</div>
            <div className="max-w-sm text-xs font-medium leading-relaxed text-zinc-500">{description}</div>
            <div className="mt-1 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                Coming soon
            </div>
        </div>
    )
}
