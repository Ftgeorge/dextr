"use client"

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react"

interface ComponentPreviewProps {
    children: ReactNode
}

interface PreviewControlsContextValue {
    setControls: (controls: ReactNode | null) => void
}

const PreviewControlsContext = createContext<PreviewControlsContextValue | null>(null)

export function usePreviewControls(controls: ReactNode | null) {
    const ctx = useContext(PreviewControlsContext)

    useEffect(() => {
        if (!ctx) return
        ctx.setControls(controls)
        return () => ctx.setControls(null)
    }, [ctx, controls])
}

export function ComponentPreview({ children }: ComponentPreviewProps) {
    const [controls, setControls] = useState<ReactNode | null>(null)

    const ctxValue = useMemo<PreviewControlsContextValue>(() => ({ setControls }), [])

    return (
        <PreviewControlsContext.Provider value={ctxValue}>
            <div id="dexter-component-preview" className="flex min-h-[200px] w-full flex-col gap-8 rounded-xl border border-zinc-200 bg-zinc-50 p-10 dark:border-zinc-800 dark:bg-zinc-900/50">
                {controls ? (
                    <div className="w-full flex items-center justify-start">{controls}</div>
                ) : null}
                <div className="flex flex-1 items-center justify-center">{children}</div>
            </div>
        </PreviewControlsContext.Provider>
    )
}
