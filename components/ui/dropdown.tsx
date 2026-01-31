"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownOption {
    value: string
    label: string
    disabled?: boolean
}

interface DropdownProps {
    value: string
    onValueChange: (value: string) => void
    options: DropdownOption[]
    placeholder?: string
    className?: string
    disabled?: boolean
    id?: string
    "aria-label"?: string
}

export function Dropdown({
    value,
    onValueChange,
    options,
    placeholder = "Select...",
    className,
    disabled = false,
    id,
    "aria-label": ariaLabel,
}: DropdownProps) {
    const [open, setOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const selectedOption = options.find(opt => opt.value === value)
    const displayValue = selectedOption?.label || placeholder

    // Close on click outside
    useEffect(() => {
        if (!open) return

        const handleClickOutside = (e: MouseEvent) => {
            if (triggerRef.current?.contains(e.target as Node) || listRef.current?.contains(e.target as Node)) {
                return
            }
            setOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [open])

    // Keyboard navigation
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault()
                    setHighlightedIndex(prev => {
                        const next = prev + 1
                        if (next >= options.length) return 0
                        return next
                    })
                    break
                case "ArrowUp":
                    e.preventDefault()
                    setHighlightedIndex(prev => {
                        const next = prev - 1
                        if (next < 0) return options.length - 1
                        return next
                    })
                    break
                case "Enter":
                case " ":
                    e.preventDefault()
                    if (highlightedIndex >= 0) {
                        const option = options[highlightedIndex]
                        if (!option.disabled) {
                            onValueChange(option.value)
                            setOpen(false)
                        }
                    }
                    break
                case "Escape":
                    e.preventDefault()
                    setOpen(false)
                    triggerRef.current?.focus()
                    break
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [open, highlightedIndex, options, onValueChange])

    // Scroll highlighted item into view
    useEffect(() => {
        if (open && highlightedIndex >= 0 && listRef.current) {
            const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
            highlightedElement?.scrollIntoView({ block: "nearest" })
        }
    }, [open, highlightedIndex])

    return (
        <div className={cn("relative", className)}>
            <button
                ref={triggerRef}
                type="button"
                id={id}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => !disabled && setOpen(!open)}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2",
                    "text-xs font-black uppercase tracking-widest text-zinc-200",
                    "shadow-[0_0_0_1px_rgba(24,24,27,0.6)]",
                    "transition-colors hover:border-zinc-700",
                    "focus:outline-none focus:ring-2 focus:ring-accent/40",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            >
                <span className={cn("truncate", !selectedOption && "text-zinc-500")}>
                    {displayValue}
                </span>
                <ChevronDown
                    size={16}
                    className={cn(
                        "shrink-0 transition-transform",
                        open && "rotate-180"
                    )}
                />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    role="listbox"
                    aria-activedescendant={highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined}
                    className={cn(
                        "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg",
                        "focus:outline-none"
                    )}
                >
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            id={`${id}-option-${index}`}
                            role="option"
                            aria-selected={option.value === value}
                            aria-disabled={option.disabled}
                            className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-xs font-medium outline-none",
                                "transition-colors",
                                option.value === value && "bg-accent/20 text-accent",
                                highlightedIndex === index && !option.disabled && "bg-zinc-800 text-zinc-100",
                                option.disabled && "cursor-not-allowed opacity-50 text-zinc-700",
                                !option.disabled && option.value !== value && highlightedIndex !== index && "text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100"
                            )}
                            onClick={() => {
                                if (!option.disabled) {
                                    onValueChange(option.value)
                                    setOpen(false)
                                }
                            }}
                        >
                            {option.label}
                            {option.value === value && (
                                <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-accent" />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
