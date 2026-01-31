"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { highlightCode } from "@/app/actions/highlight"
import { components } from "@/lib/component-registry"
import { ComponentPreview } from "@/components/workshop/component-preview"
import { CodeInspector } from "@/components/workshop/code-inspector"
import { Dropdown } from "@/components/ui/dropdown"
import { cn } from "@/lib/utils"
import {
    Eye,
    Code2,
    BookOpen,
    StickyNote,
    History,
    CheckCircle2,
    AlertCircle,
    Wrench,
    Repeat,
    Copy,
    Check
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Simplified Preview Controls Component
function ComponentPreviewControls({
    componentEntry,
    previewProps,
    setPreviewProps
}: {
    componentEntry: typeof components[number]
    previewProps: Record<string, string | boolean>
    setPreviewProps: (props: Record<string, string | boolean> | ((prev: Record<string, string | boolean>) => Record<string, string | boolean>)) => void
}) {
    const handlePropChange = (propName: string, value: string | boolean) => {
        setPreviewProps((prev: Record<string, string | boolean>) => ({ ...prev, [propName]: value }))
    }

    const { usage } = componentEntry

    if (!usage) return null

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {usage.props.map((prop) => {
                // Determine control type based on prop definition
                const isBoolean = prop.type.includes("boolean")
                const isUnion = prop.type.includes("|")
                const options = isUnion ? prop.type.split("|").map(s => s.trim().replace(/'/g, "")) : []

                // Filter out complex types that we can't easily control with a simple input
                if (prop.type.includes("ReactNode") && prop.name !== "children") return null
                if (prop.name === "iconName" || prop.name === "iconPack") return null // Specialized controls could be added later

                return (
                    <div key={prop.name} className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{prop.name}</span>

                        {isBoolean ? (
                            <Dropdown
                                value={previewProps[prop.name] ? "true" : "false"}
                                onValueChange={(value) => handlePropChange(prop.name, value === "true")}
                                options={[
                                    { value: "true", label: "True" },
                                    { value: "false", label: "False" },
                                ]}
                                className="w-full"
                            />
                        ) : isUnion ? (
                            <Dropdown
                                value={String(previewProps[prop.name])}
                                onValueChange={(value) => handlePropChange(prop.name, value)}
                                options={options.map(opt => ({ value: opt, label: opt.charAt(0).toUpperCase() + opt.slice(1) }))}
                                className="w-full"
                            />
                        ) : (
                            <input
                                type="text"
                                value={String(previewProps[prop.name] || "")}
                                onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 outline-none transition-all focus:border-accent/40 focus:ring-1 focus:ring-accent/40"
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

interface ComponentDetailProps {
    slug: string
    sourceCode: string
    highlightedCode: string
    basename: string
}

type Tab = "Preview" | "Code" | "Usage" | "Notes" | "Changelog"

const tabIcons: Record<Tab, LucideIcon> = {
    "Preview": Eye,
    "Code": Code2,
    "Usage": BookOpen,
    "Notes": StickyNote,
    "Changelog": History,
}

const statusIcons: Record<string, LucideIcon> = {
    "production-ready": CheckCircle2,
    "experimental": Wrench,
    "in-progress": AlertCircle,
}

export function ComponentDetail({ slug, sourceCode, highlightedCode, basename }: ComponentDetailProps) {
    const [activeTab, setActiveTab] = useState<Tab>("Preview")
    const [framework, setFramework] = useState("next.js")
    const componentEntry = components.find(c => c.slug === slug)

    // Dynamic Preview Controls State
    const [previewProps, setPreviewProps] = useState<Record<string, string | boolean>>({})
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (componentEntry?.usage?.props) {
            const initialProps = componentEntry.usage.props.reduce((acc, prop) => {
                acc[prop.name] =
                    typeof prop.defaultValue === "number"
                        ? String(prop.defaultValue)
                        : prop.defaultValue ?? (prop.type.includes("boolean") ? false : "")
                return acc
            }, {} as Record<string, string | boolean>)
            setPreviewProps(initialProps)
            setIsInitialized(true)
        }
    }, [componentEntry])

    const [usageHighlightedCode, setUsageHighlightedCode] = useState("")
    const [copied, setCopied] = useState(false)
    const [isHighlighting, setIsHighlighting] = useState(true)

    const generateUsageCode = () => {
        if (!componentEntry || !componentEntry.usage) return ""

        const props = Object.entries(previewProps)
            .filter(([key, value]) => {
                const propDef = componentEntry.usage?.props.find(p => p.name === key)
                // Filter out null/undefined, empty strings, and values that match the default
                if (value === undefined || value === null || value === "") return false
                if (key === "children") return false // Handle children separately
                if (propDef && value === propDef.defaultValue) return false
                return true
            })
            .map(([key, value]) => typeof value === "boolean" ? key : `${key}="${value}"`)
            .join(" ")

        return `<${componentEntry.name}${props ? " " + props : ""}>
    ${previewProps.children}
</${componentEntry.name}>`
    }

    useEffect(() => {
        const highlight = async () => {
            const code = generateUsageCode()
            setIsHighlighting(true)
            try {
                const html = await highlightCode(code, 'tsx', 'github-dark-dimmed')
                setUsageHighlightedCode(html)
            } catch (e) {
                console.error("Highlighting failed", e)
                // Fallback to basic sanitization or just raw code wrapped if shiki fails
            } finally {
                setIsHighlighting(false)
            }
        }
        highlight()
    }, [previewProps])

    if (!componentEntry) return null

    const { component: Component, status, tags, reuseCount, updatedAt, sourcePath } = componentEntry

    const tabs: Tab[] = ["Preview", "Code", "Usage", "Notes", "Changelog"]

    const frameworkOptions = [
        { value: "next.js", label: "Next.js" },
        { value: "react.js", label: "React.js" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
        { value: "angular", label: "Angular" },
    ]

    const StatusIcon = statusIcons[status] || AlertCircle

    if (!isInitialized) return null // or a skeletal loader

    return (
        <div className="flex flex-col gap-10">
            {/* Metrics & Context */}
            <div className="flex flex-col gap-4 border-b border-zinc-900 pb-10">
                <div className="flex flex-wrap items-center gap-6">
                    <div className={cn(
                        "flex items-center gap-2 rounded-sm px-2 py-1 text-[11px] font-black uppercase tracking-wider",
                        status === "production-ready" && "bg-emerald-500/10 text-emerald-500",
                        status === "experimental" && "bg-amber-500/10 text-amber-500",
                        status === "in-progress" && "bg-blue-500/10 text-blue-500",
                    )}>
                        <StatusIcon size={14} />
                        {status.replace("-", " ")}
                    </div>

                    {/* Web Version Badge */}
                    <div className="flex items-center gap-2 text-zinc-500">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Web</span>
                        <div className={cn(
                            "rounded-sm px-2 py-0.5 text-[9px] font-bold",
                            componentEntry.stacks.web.status === "stable" && "bg-emerald-500/20 text-emerald-500",
                            componentEntry.stacks.web.status === "beta" && "bg-blue-500/20 text-blue-500",
                            componentEntry.stacks.web.status === "alpha" && "bg-amber-500/20 text-amber-500"
                        )}>
                            v{componentEntry.stacks.web.version}
                        </div>
                    </div>

                    {/* React Native Version Badge */}
                    <div className="flex items-center gap-2 text-zinc-500">
                        <span className="text-[10px] font-bold uppercase tracking-widest">React Native</span>
                        <div className={cn(
                            "rounded-sm px-2 py-0.5 text-[9px] font-bold",
                            componentEntry.stacks["react-native"].status === "stable" && "bg-emerald-500/20 text-emerald-500",
                            componentEntry.stacks["react-native"].status === "beta" && "bg-blue-500/20 text-blue-500",
                            componentEntry.stacks["react-native"].status === "alpha" && "bg-amber-500/20 text-amber-500"
                        )}>
                            v{componentEntry.stacks["react-native"].version}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500">
                        <Repeat size={14} className="text-zinc-700" />
                        <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Used in {reuseCount} Applications</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500">
                        <History size={14} className="text-zinc-700" />
                        <span className="text-[11px] font-bold uppercase tracking-widest leading-none">Updated {updatedAt}</span>
                    </div>

                    <div className="ml-auto flex gap-2">
                        {tags.map(tag => (
                            <span key={tag} className="rounded-md border border-zinc-900 bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs Layout */}
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2 rounded-md bg-zinc-900/40 p-1 border border-zinc-900 w-fit">
                        {tabs.map((tab) => {
                            const Icon = tabIcons[tab]
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "relative flex items-center gap-2.5 rounded-md px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all",
                                        activeTab === tab
                                            ? "bg-zinc-800 text-accent shadow-lg"
                                            : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    <Icon size={14} />
                                    {tab}
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Framework:</span>
                        <Dropdown
                            value={framework}
                            onValueChange={setFramework}
                            options={frameworkOptions}
                            aria-label="Select framework"
                            className="w-32"
                        />
                    </div>
                </div>

                <div className="min-h-125">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {activeTab === "Preview" && (
                                <div className="flex flex-col gap-6">
                                    <ComponentPreview>
                                        <Component {...previewProps} />
                                    </ComponentPreview>

                                    <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5">
                                        <div className="flex items-center gap-2 pb-2 mb-4 border-b border-zinc-900/50">
                                            <Wrench size={14} className="text-zinc-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                Configuration
                                            </span>
                                        </div>
                                        <ComponentPreviewControls
                                            componentEntry={componentEntry}
                                            previewProps={previewProps}
                                            setPreviewProps={setPreviewProps}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "Code" && (
                                <div className="grid gap-8">


                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Implementation</h3>
                                        </div>
                                        <CodeInspector
                                            code={sourceCode}
                                            highlightedCode={highlightedCode}
                                            filename={basename}
                                            sourcePath={sourcePath}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "Usage" && (
                                <div className="grid gap-8">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Usage</h3>
                                        </div>
                                        <div className="rounded-md border border-zinc-900 bg-zinc-950 shadow-2xl relative group overflow-hidden">
                                            <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/40 px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-red-500/20" />
                                                    <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
                                                    <div className="h-2 w-2 rounded-full bg-green-500/20" />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const code = generateUsageCode()
                                                        navigator.clipboard.writeText(code)
                                                        setCopied(true)
                                                        setTimeout(() => setCopied(false), 2000)
                                                    }}
                                                    className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check size={12} className="text-emerald-500" />
                                                            <span>Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={12} />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="relative">
                                                <div
                                                    className="overflow-x-auto p-6 text-sm font-medium leading-relaxed font-mono selection:bg-accent/30 selection:text-zinc-100 [&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:m-0! [&_code]:bg-transparent! [&_span]:text-[inherit]!"
                                                    dangerouslySetInnerHTML={{ __html: usageHighlightedCode || `<pre class="shiki"><code>${generateUsageCode()}</code></pre>` }}
                                                />
                                                {/* Parsing overlay if highlighting is slow */}
                                                {isHighlighting && !usageHighlightedCode && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur-[1px]">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-200" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <section className="rounded-md border border-zinc-900 bg-zinc-900/20 p-8 shadow-inner">
                                            <h3 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                                                <CheckCircle2 size={14} />
                                                When to use
                                            </h3>
                                            <ul className="list-inside list-disc space-y-3 text-sm text-zinc-400 font-medium">
                                                {componentEntry.usage?.whenToUse.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                )) || <li>No usage guidelines provided.</li>}
                                            </ul>
                                        </section>
                                        <section className="rounded-md border border-zinc-900 bg-zinc-900/20 p-8 shadow-inner">
                                            <h3 className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
                                                <AlertCircle size={14} />
                                                When not to use
                                            </h3>
                                            <ul className="list-inside list-disc space-y-3 text-sm text-zinc-400 font-medium">
                                                {componentEntry.usage?.whenNotToUse.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                )) || <li>No placement guidelines provided.</li>}
                                            </ul>
                                        </section>
                                    </div>

                                    <section>
                                        <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Properties Typed Definition</h3>
                                        <div className="overflow-hidden rounded-md border border-zinc-900 bg-zinc-900/10">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-zinc-900/50 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                                    <tr>
                                                        <th className="px-6 py-4">Name</th>
                                                        <th className="px-6 py-4">Type</th>
                                                        <th className="px-6 py-4">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-900 text-zinc-400 font-medium">
                                                    {componentEntry.usage?.props.map((prop, i) => (
                                                        <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                                                            <td className="px-6 py-4 font-mono text-zinc-200">{prop.name}</td>
                                                            <td className="px-6 py-4 font-mono text-accent">{prop.type}</td>
                                                            <td className="px-6 py-4">{prop.description}</td>
                                                        </tr>
                                                    )) || (
                                                            <tr>
                                                                <td colSpan={3} className="px-6 py-12 text-center text-zinc-700 italic">No prop metadata available</td>
                                                            </tr>
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === "Notes" && (
                                <div className="flex flex-col gap-8">
                                    <section className="rounded-md border border-zinc-900 bg-zinc-900/20 p-10">
                                        <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Engineering Decisions</h3>
                                        <ul className="space-y-6">
                                            {componentEntry.notes?.decisions.map((item, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <span className="text-accent mt-1">/</span>
                                                    <p className="text-sm font-medium leading-relaxed text-zinc-300">{item}</p>
                                                </li>
                                            )) || <li className="text-zinc-600 italic">No specific engineering notes recorded.</li>}
                                        </ul>
                                    </section>

                                    {componentEntry.notes?.performance && (
                                        <section className="rounded-md border border-amber-500/10 bg-amber-500/5 p-10">
                                            <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">Performance Considerations</h3>
                                            <p className="text-sm font-medium leading-relaxed text-amber-500/70">{componentEntry.notes.performance}</p>
                                        </section>
                                    )}
                                </div>
                            )}

                            {activeTab === "Changelog" && (
                                <div className="flex flex-col gap-6">
                                    {componentEntry.changelog?.map((entry, i) => (
                                        <div key={i} className="flex flex-col gap-4 rounded-md border border-zinc-900 bg-zinc-900/10 p-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-lg font-black text-zinc-100">v{entry.version}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em]">{entry.date}</span>
                                                            <div className={cn(
                                                                "inline-flex items-center rounded-md px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]",
                                                                entry.stack === "web" ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                                                            )}>
                                                                {entry.stack}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul className="space-y-2">
                                                {entry.changes.map((change, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                                                        <span className="text-accent mt-1">•</span>
                                                        <span>{change}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )) || (
                                            <div className="flex h-60 flex-col items-center justify-center rounded-md border-2 border-zinc-900 text-zinc-800">
                                                <History size={48} className="mb-4 opacity-10" />
                                                <p className="text-xs font-black uppercase tracking-[0.3em]">No changelog entries found.</p>
                                            </div>
                                        )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
