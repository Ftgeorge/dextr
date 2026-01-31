"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComingSoon } from "@/components/ui/coming-soon"
import { cn } from "@/lib/utils"
import { Search, ChevronRight, CheckCircle2, AlertCircle, Wrench, HelpCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Logo from "../ui/logo"
import { useSimpleOnboarding } from "./simple-onboarding"
import { components, ComponentStatus } from "@/lib/component-registry"

const statusIcons: Record<ComponentStatus, LucideIcon> = {
    "production-ready": CheckCircle2,
    "experimental": Wrench,
    "in-progress": AlertCircle,
}

interface WorkshopSidebarProps {
    className?: string
}

type Framework = "react" | "react-native" | "flutter"

export function WorkshopSidebar({ className }: WorkshopSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [framework, setFramework] = useState<Framework>("react")
    const { startOnboarding } = useSimpleOnboarding()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    // Get active slug from URL
    const activeSlug = pathname?.split("/").pop() || ""

    // Filter and group components
    const filteredComponents = useMemo(() => {
        return components.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [searchQuery])

    const groupedComponents = useMemo(() => {
        const groups: Record<string, typeof components> = {}
        filteredComponents.forEach(component => {
            if (!groups[component.category]) {
                groups[component.category] = []
            }
            groups[component.category].push(component)
        })
        return groups
    }, [filteredComponents])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Focus search with /
            if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
                e.preventDefault()
                searchInputRef.current?.focus()
                return
            }

            // Arrow navigation
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault()
                const maxIndex = filteredComponents.length - 1
                if (e.key === "ArrowDown") {
                    setSelectedIndex(prev => Math.min(prev + 1, maxIndex))
                } else {
                    setSelectedIndex(prev => Math.max(prev - 1, 0))
                }
            }

            // Enter to navigate
            if (e.key === "Enter" && selectedIndex >= 0) {
                const component = filteredComponents[selectedIndex]
                if (component) {
                    window.location.href = `/workshop/components/${component.slug}`
                }
            }

            // Escape to clear search
            if (e.key === "Escape") {
                setSearchQuery("")
                searchInputRef.current?.blur()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [filteredComponents, selectedIndex])

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
            selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" })
        }
    }, [selectedIndex])

    return (
        <aside
            id="dexter-sidebar"
            className={cn("flex h-full flex-col bg-zinc-950 border-r border-zinc-900", className)}
            role="navigation"
            aria-label="Component sidebar"
        >
            {/* Sticky Search Header */}
            <div className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950 p-4">
                <div className="mb-4 flex flex-col gap-3">
                    <Link href="/workshop" className="flex items-center gap-3">
                        <Logo/>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div id="dexter-stack-switcher" className="flex min-w-0 flex-1">
                            <div className="w-full overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-900/30 p-1 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <div className="flex min-w-max items-center gap-1 whitespace-nowrap">
                                    <button
                                type="button"
                                onClick={() => setFramework("react")}
                                className={cn(
                                    "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                    framework === "react" ? "bg-zinc-800 text-accent" : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                React
                            </button>
                                    <button
                                type="button"
                                onClick={() => setFramework("react-native")}
                                className={cn(
                                    "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                    framework === "react-native" ? "bg-zinc-800 text-accent" : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                React Native
                            </button>
                                    <button
                                type="button"
                                onClick={() => setFramework("flutter")}
                                className={cn(
                                    "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                    framework === "flutter" ? "bg-zinc-800 text-accent" : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                Flutter
                            </button>
                                </div>
                            </div>
                        </div>
                        {/* {framework !== "next" ? (
                            <span className="rounded-full border border-zinc-900 bg-zinc-900/20 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                                Coming soon
                            </span>
                        ) : null} */}
                    </div>
                </div>
                <div className="relative group" role="search">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-zinc-900 bg-zinc-900/30 py-2.5 pl-10 pr-10 text-xs font-medium text-zinc-100 outline-none ring-accent/10 transition-all focus:border-accent/40 focus:bg-zinc-900/50 focus:ring-2"
                        aria-label="Search components"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-[9px] font-black text-zinc-600" aria-hidden="true">
                        /
                    </div>
                </div>
                <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-zinc-600" role="status" aria-live="polite">
                    {filteredComponents.length} Components
                </div>
            </div>

            {/* Scrollable Component List */}
            <div ref={listRef} className="flex-1 overflow-y-auto" role="list">
                {framework !== "react" ? (
                    <div className="p-4">
                        <ComingSoon
                            title="Framework support"
                            description="Vue, React Native, and Flutter component implementations will be added here."
                        />
                    </div>
                ) : Object.keys(groupedComponents).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <Search size={32} className="mb-3 text-zinc-800" />
                        <p className="text-xs font-bold text-zinc-600">No components found</p>
                    </div>
                ) : (
                    Object.entries(groupedComponents).map(([category, categoryComponents]) => (
                        <div key={category} className="mb-6">
                            {/* Category Header */}
                            <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm px-4 py-2 border-b border-zinc-900/50">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                                    {category}
                                </h3>
                            </div>

                            {/* Component Items */}
                            <div className="py-1">
                                {categoryComponents.map((component) => {
                                    const globalIndex = filteredComponents.indexOf(component)
                                    const isActive = component.slug === activeSlug
                                    const isSelected = globalIndex === selectedIndex
                                    const StatusIcon = statusIcons[component.status] || AlertCircle

                                    return (
                                        <Link
                                            key={component.slug}
                                            href={`/workshop/components/${component.slug}`}
                                            data-index={globalIndex}
                                            role="listitem"
                                            aria-current={isActive ? "page" : undefined}
                                            className={cn(
                                                "group flex items-center gap-3 px-4 py-2.5 transition-all",
                                                isActive && "bg-accent/10 border-l-2 border-accent",
                                                !isActive && isSelected && "bg-zinc-900/50",
                                                !isActive && !isSelected && "hover:bg-zinc-900/30"
                                            )}
                                        >
                                            {/* Status Icon */}
                                            <div className={cn(
                                                "shrink-0",
                                                component.status === "production-ready" && "text-emerald-500",
                                                component.status === "experimental" && "text-amber-500",
                                                component.status === "in-progress" && "text-blue-500"
                                            )}>
                                                <StatusIcon size={12} />
                                            </div>

                                            {/* Component Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className={cn(
                                                    "text-xs font-bold truncate transition-colors",
                                                    isActive ? "text-accent" : "text-zinc-300 group-hover:text-zinc-100"
                                                )}>
                                                    {component.name}
                                                </div>
                                                <div className="text-[9px] font-medium text-zinc-600 truncate">
                                                    {component.slug}
                                                </div>
                                            </div>

                                            {/* Arrow Indicator */}
                                            <ChevronRight
                                                size={14}
                                                className={cn(
                                                    "shrink-0 transition-all",
                                                    isActive ? "text-accent opacity-100" : "text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                                                )}
                                            />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer with Workbench Link */}
            <div className="sticky bottom-0 border-t border-zinc-900 bg-zinc-950 p-4 space-y-2">
                <button
                    onClick={() => {
                        console.log('Help button clicked, starting onboarding...')
                        startOnboarding()
                    }}
                    className="flex items-center justify-between w-full rounded-lg border border-zinc-900 bg-zinc-900/30 px-4 py-3 transition-all hover:border-accent/40 hover:bg-zinc-900/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-zinc-800 p-1.5">
                            <HelpCircle size={14} className="text-zinc-500" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-zinc-300">Help</span>
                            <span className="text-[9px] font-medium text-zinc-600">Take a tour</span>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-600" />
                </button>
                
                <Link
                    id="dexter-workbench"
                    href="/workbench"
                    className="flex items-center justify-between rounded-lg border border-zinc-900 bg-zinc-900/30 px-4 py-3 transition-all hover:border-accent/40 hover:bg-zinc-900/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-zinc-800 p-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-300">Workbench</span>
                            <span className="text-[9px] font-medium text-zinc-600">Active experiments</span>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-700" />
                </Link>
            </div>

            {/* TODO: Add favorites, pinning, tree view toggle */}
        </aside>
    )
}
