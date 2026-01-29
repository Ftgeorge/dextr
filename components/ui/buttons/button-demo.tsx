"use client"

import { useId, useState } from "react"

import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/buttons/button"
import { usePreviewControls } from "@/components/workshop/component-preview"
import { cn } from "@/lib/utils"

const variants: { label: string; value: ButtonVariant }[] = [
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
    { label: "Outline", value: "outline" },
    { label: "Ghost", value: "ghost" },
    { label: "Destructive", value: "destructive" },
    { label: "Success", value: "success" },
    { label: "Warning", value: "warning" },
]

const sizes: { label: string; value: ButtonSize }[] = [
    { label: "XS", value: "xs" },
    { label: "SM", value: "sm" },
    { label: "MD", value: "md" },
    { label: "LG", value: "lg" },
    { label: "XL", value: "xl" },
]

export function ButtonDemo() {
    const variantSelectId = useId()
    const sizeSelectId = useId()
    const [variant, setVariant] = useState<ButtonVariant>("primary")
    const [size, setSize] = useState<ButtonSize>("md")

    usePreviewControls(
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
                <label
                    htmlFor={variantSelectId}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
                >
                    Variant
                </label>
                <div className="relative">
                    <select
                        id={variantSelectId}
                        value={variant}
                        onChange={(e) => setVariant(e.target.value as ButtonVariant)}
                        className={cn(
                            "h-9 appearance-none rounded-lg border border-zinc-800 bg-zinc-950 pl-3 pr-9 text-xs font-black uppercase tracking-widest text-zinc-200",
                            "shadow-[0_0_0_1px_rgba(24,24,27,0.6)]",
                            "transition-colors hover:border-zinc-700",
                            "focus:outline-none focus:ring-2 focus:ring-accent/40"
                        )}
                    >
                        {variants.map((v) => (
                            <option key={v.value} value={v.value} className="bg-zinc-950">
                                {v.label}
                            </option>
                        ))}
                    </select>
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        fill="currentColor"
                    >
                        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
                    </svg>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label
                    htmlFor={sizeSelectId}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
                >
                    Size
                </label>
                <div className="relative">
                    <select
                        id={sizeSelectId}
                        value={size}
                        onChange={(e) => setSize(e.target.value as ButtonSize)}
                        className={cn(
                            "h-9 appearance-none rounded-lg border border-zinc-800 bg-zinc-950 pl-3 pr-9 text-xs font-black uppercase tracking-widest text-zinc-200",
                            "shadow-[0_0_0_1px_rgba(24,24,27,0.6)]",
                            "transition-colors hover:border-zinc-700",
                            "focus:outline-none focus:ring-2 focus:ring-accent/40"
                        )}
                    >
                        {sizes.map((s) => (
                            <option key={s.value} value={s.value} className="bg-zinc-950">
                                {s.label}
                            </option>
                        ))}
                    </select>
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        fill="currentColor"
                    >
                        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" />
                    </svg>
                </div>
            </div>
        </div>
    )

    return (
        <Button variant={variant} size={size}>Button</Button>
    )
}
