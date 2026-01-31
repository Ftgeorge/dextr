"use client"

import { useState } from "react"
import { Dropdown } from "@/components/ui/dropdown"
import { usePreviewControls } from "../workshop/component-preview"

const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
    { value: "disabled", label: "Disabled Option", disabled: true },
]

export function DropdownDemo() {
    const [selectedValue, setSelectedValue] = useState("option1")

    usePreviewControls(
        <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                Selected: {selectedValue}
            </span>
        </div>
    )

    return (
        <div className="w-64">
            <Dropdown
                value={selectedValue}
                onValueChange={setSelectedValue}
                options={options}
                placeholder="Select an option..."
                aria-label="Demo dropdown"
            />
        </div>
    )
}
