"use client"

import { useId, useState } from "react"

import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/buttons/button"
import { Dropdown } from "@/components/ui/dropdown"
import { usePreviewControls } from "@/components/workshop/component-preview"

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
                <Dropdown
                    id={variantSelectId}
                    value={variant}
                    onValueChange={(value) => setVariant(value as ButtonVariant)}
                    options={variants.map(v => ({ value: v.value, label: v.label }))}
                    aria-label="Select button variant"
                />
            </div>

            <div className="flex items-center gap-3">
                <label
                    htmlFor={sizeSelectId}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500"
                >
                    Size
                </label>
                <Dropdown
                    id={sizeSelectId}
                    value={size}
                    onValueChange={(value) => setSize(value as ButtonSize)}
                    options={sizes.map(s => ({ value: s.value, label: s.label }))}
                    aria-label="Select button size"
                />
            </div>
        </div>
    )

    return (
        <Button variant={variant} size={size}>Button</Button>
    )
}
