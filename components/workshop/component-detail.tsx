"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {  components } from "@/lib/component-registry"
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
    Repeat
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Preview Controls Component
function ComponentPreviewControls({ 
    componentEntry, 
    previewProps, 
    setPreviewProps 
}: { 
    componentEntry: any
    previewProps: Record<string, any>
    setPreviewProps: (props: Record<string, any>) => void 
}) {
    const handlePropChange = (propName: string, value: any) => {
        setPreviewProps(prev => ({ ...prev, [propName]: value }))
    }

    return (
        <div className="flex flex-wrap gap-3 p-4 border-b border-zinc-800">
            {componentEntry.usage?.props?.map((prop: any) => (
                <div key={prop.name} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-400">{prop.name}:</span>
                    
                    {prop.type.includes("boolean") ? (
                        <Dropdown
                            value={previewProps[prop.name] ? "true" : "false"}
                            onValueChange={(value) => handlePropChange(prop.name, value === "true")}
                            options={[
                                { value: "true", label: "True" },
                                { value: "false", label: "False" },
                            ]}
                            className="w-20"
                        />
                    ) : prop.name === "variant" ? (
                        <Dropdown
                            value={previewProps[prop.name] || "primary"}
                            onValueChange={(value) => handlePropChange(prop.name, value)}
                            options={[
                                { value: "primary", label: "Primary" },
                                { value: "secondary", label: "Secondary" },
                                { value: "outline", label: "Outline" },
                                { value: "ghost", label: "Ghost" },
                                { value: "destructive", label: "Destructive" },
                                { value: "success", label: "Success" },
                                { value: "warning", label: "Warning" },
                                { value: "icon", label: "Icon" },
                            ]}
                            className="w-32"
                        />
                    ) : prop.name === "size" ? (
                        <Dropdown
                            value={previewProps[prop.name] || "md"}
                            onValueChange={(value) => handlePropChange(prop.name, value)}
                            options={[
                                { value: "xs", label: "XS" },
                                { value: "sm", label: "SM" },
                                { value: "md", label: "MD" },
                                { value: "lg", label: "LG" },
                                { value: "xl", label: "XL" },
                            ]}
                            className="w-24"
                        />
                    ) : prop.name === "children" ? (
                        <input
                            type="text"
                            value={previewProps[prop.name] || ""}
                            onChange={(e) => handlePropChange(prop.name, e.target.value)}
                            className="w-24 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                        />
                    ) : null}
                </div>
            ))}
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
    
    // Preview controls state
    const [previewProps, setPreviewProps] = useState<Record<string, any>>({
        variant: "primary",
        size: "md",
        isLoading: false,
        fullWidth: false,
        children: "Button",
        hasIcon: false,
        iconPosition: "left",
        iconPack: "lucide",
        iconName: "none",
        leftIcon: null,
        rightIcon: null
    })

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

    return (
        <div className="flex flex-col gap-10">
            {/* Metrics & Context */}
            <div className="flex flex-col gap-4 border-b border-zinc-900 pb-10">
                <div className="flex flex-wrap items-center gap-6">
                    <div className={cn(
                        "flex items-center gap-2 rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-wider",
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
                            "rounded-full px-2 py-0.5 text-[9px] font-bold",
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
                            "rounded-full px-2 py-0.5 text-[9px] font-bold",
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
                    <div className="flex flex-wrap gap-2 rounded-2xl bg-zinc-900/40 p-1.5 border border-zinc-900 w-fit">
                        {tabs.map((tab) => {
                            const Icon = tabIcons[tab]
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "relative flex items-center gap-2.5 rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all",
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
                                <ComponentPreview>
                                    <ComponentPreviewControls 
                                        componentEntry={componentEntry}
                                        previewProps={previewProps}
                                        setPreviewProps={setPreviewProps}
                                    />
                                    <Component {...previewProps} />
                                </ComponentPreview>
                            )}

                            {activeTab === "Code" && (
                                <CodeInspector
                                    code={sourceCode}
                                    highlightedCode={highlightedCode}
                                    filename={basename}
                                    sourcePath={sourcePath}
                                />
                            )}

                            {activeTab === "Usage" && (
                                <div className="grid gap-8">
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <section className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-8 shadow-inner">
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
                                        <section className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-8 shadow-inner">
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
                                        <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/10">
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
                                    <section className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-10">
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
                                        <section className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-10">
                                            <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">Performance Considerations</h3>
                                            <p className="text-sm font-medium leading-relaxed text-amber-500/70">{componentEntry.notes.performance}</p>
                                        </section>
                                    )}
                                </div>
                            )}

                            {activeTab === "Changelog" && (
                                <div className="flex flex-col gap-6">
                                    {componentEntry.changelog?.map((entry, i) => (
                                        <div key={i} className="flex flex-col gap-4 rounded-2xl border border-zinc-900 bg-zinc-900/10 p-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-lg font-black text-zinc-100">v{entry.version}</span>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em]">{entry.date}</span>
                                                            <div className={cn(
                                                                "inline-flex items-center rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]",
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
                                        <div className="flex h-60 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-900 text-zinc-800">
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
