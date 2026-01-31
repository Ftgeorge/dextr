"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Monitor, Smartphone, Tablet, RotateCcw } from "lucide-react"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: "center" | "start" | "end"
}

interface PreviewControlsContextType {
    setControls: (controls: React.ReactNode) => void
}

const PreviewControlsContext = React.createContext<PreviewControlsContextType | undefined>(undefined)

export function usePreviewControls(controls: React.ReactNode) {
    const context = React.useContext(PreviewControlsContext)
    
    React.useEffect(() => {
        if (context) {
            context.setControls(controls)
        }
    }, [controls, context])
}

export function ComponentPreview({
    children,
    className,
    align = "center",
    ...props
}: ComponentPreviewProps) {
    const [controls, setControls] = React.useState<React.ReactNode>(null)
    
    const ctxValue = React.useMemo(() => ({
        setControls
    }), [])

    return (
        <PreviewControlsContext.Provider value={ctxValue}>
            <div
                className={cn(
                    "group relative flex min-h-[450px] w-full flex-col overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950 shadow-sm",
                    className
                )}
                {...props}
            >
                {/* Controls */}
                {controls && (
                    <div className="absolute right-4 top-4 z-10 flex items-center gap-2 opacity-100 transition-opacity">
                        {controls}
                    </div>
                )}

                {/* Preview Area */}
                <div className="relative flex flex-1 w-full items-center justify-center overflow-auto p-10">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

                    {/* Content */}
                    <div className={cn(
                        "z-10 relative flex w-full",
                        align === "center" && "items-center justify-center",
                        align === "start" && "items-start justify-start",
                        align === "end" && "items-end justify-end"
                    )}>
                        {children}
                    </div>
                </div>

                {/* Footer / Info (Optional) */}
                <div className="border-t border-zinc-900 bg-zinc-900/30 px-4 py-2 flex justify-between items-center">
                    <div className="flex gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-zinc-800" />
                        <div className="h-2 w-2 rounded-full bg-zinc-800" />
                        <div className="h-2 w-2 rounded-full bg-zinc-800" />
                    </div>
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                        Preview Mode
                    </div>
                </div>
            </div>
        </PreviewControlsContext.Provider>
    )
}
