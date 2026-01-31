"use client"

import { useState, useEffect } from "react"
import { Construction, Play, Code2, Copy, Check, Sparkles, HelpCircle } from "lucide-react"
import { useWorkbenchStore, ComponentNode } from "@/lib/workbench-store"
import { ComponentRenderer } from "@/components/workbench/component-renderer"
import { cn } from "@/lib/utils"
import { WorkbenchSidebar } from "@/components/workbench/workbench-sidebar"
import { useTour } from "@/components/tour/tour-provider"

export default function WorkbenchPage() {
    const [copiedCode, setCopiedCode] = useState(false)
    
    // Tour functionality
    const { startWorkbenchTour } = useTour()

    // Workbench store
    const {
        currentScene,
        selectedNodeId,
        showAnimations,
        showCode,
        setCurrentScene,
        selectNode,
        toggleAnimations,
        toggleCode,
        createScene,
        addAnimation,
        animationPresets
    } = useWorkbenchStore()

    // Initialize with a default scene
    useEffect(() => {
        if (!currentScene) {
            const rootNode: ComponentNode = {
                id: 'root',
                type: 'button',
                props: {
                    variant: 'primary',
                    size: 'md',
                    children: 'Hello World'
                },
                metadata: {
                    version: '1.0.0',
                    category: 'Inputs'
                }
            }

            const scene = createScene('Default Scene', rootNode)
            setCurrentScene(scene)

            // Add a fade-in animation
            const animation = {
                ...animationPresets['fade-in'],
                id: crypto.randomUUID(),
                targetComponentId: rootNode.id
            }
            addAnimation(animation)
        }
    }, [currentScene, setCurrentScene, createScene, addAnimation, animationPresets])


    const generateCode = () => {
        if (!currentScene) return ""

        const { root, animations } = currentScene

        // Generate component props
        const props = Object.entries(root.props || {})
            .filter(([, value]) => value !== undefined && value !== "")
            .map(([key, value]) => {
                if (typeof value === "boolean") {
                    return value ? key : ""
                }
                if (typeof value === "string") {
                    return `${key}="${value}"`
                }
                return `${key}={JSON.stringify(value)}`
            })
            .filter(Boolean)
            .join(" ")

        // Generate component code
        let code = `<${root.type} ${props} />`

        // Add animation code if animations exist
        if (animations && animations.length > 0) {
            const animationCode = animations.map(anim => {
                const preset = animationPresets[anim.id]
                if (!preset) return ""

                return `// ${preset.preset.name} Animation
// Trigger: ${anim.trigger}
// Duration: ${anim.config.duration}s
// Easing: ${anim.config.easing}
${anim.trigger === 'hover' ? 'whileHover={{ scale: 1.05, y: -2 }}' : `initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: ${anim.config.duration}, ease: "easeOut" }}`}`
            }).join('\n\n')

            if (animationCode) {
                code += `\n\n// Animations:\n${animationCode}`
            }
        }

        return code
    }

    const copyCode = async () => {
        const code = generateCode()
        await navigator.clipboard.writeText(code)
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
    }

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-accent selection:text-accent-foreground">

            {/* Header */}
            <div className="flex flex-1 overflow-hidden">
                <WorkbenchSidebar />

                {/* Main Content - Preview & Code */}
                <main className="flex-1 overflow-y-auto">
                    {/* Fixed Header */}
                    <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
                        <div className="container mx-auto max-w-7xl px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Construction size={20} className="text-accent" />
                                    <div>
                                        <h1 className="text-xl font-black tracking-tight">Workbench</h1>
                                        <p className="text-[10px] text-zinc-500">Live Component Playground</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={startWorkbenchTour}
                                        className={cn(
                                            'p-2 rounded-md transition-colors',
                                            'hover:bg-zinc-800'
                                        )}
                                        title="Start Tour"
                                    >
                                        <HelpCircle size={16} />
                                    </button>
                                    
                                    <button
                                        id="dexter-animation-controls"
                                        onClick={toggleAnimations}
                                        className={cn(
                                            'p-2 rounded-md transition-colors',
                                            showAnimations ? 'bg-accent text-accent-foreground' : 'hover:bg-zinc-800'
                                        )}
                                        title="Toggle Animations"
                                    >
                                        <Sparkles size={16} />
                                    </button>

                                    <button
                                        id="dexter-code-view-toggle"
                                        onClick={toggleCode}
                                        className={cn(
                                            'p-2 rounded-md transition-colors',
                                            showCode ? 'bg-accent text-accent-foreground' : 'hover:bg-zinc-800'
                                        )}
                                        title="Toggle Code View"
                                    >
                                        <Code2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="container mx-auto max-w-7xl px-4 py-8">
                        <div className="space-y-6">
                            {/* Preview Area */}
                            <div className="rounded-md border border-zinc-900 bg-zinc-900/20 p-6" id="dexter-preview-area">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-300">
                                        <Play size={16} />
                                        Live Preview
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-md px-2 py-1 text-[9px] font-bold bg-accent/20 text-accent">
                                            {currentScene?.root.type || 'None'}
                                        </span>
                                        {showAnimations && (
                                            <span className="rounded-md px-2 py-1 text-[9px] font-bold bg-emerald-500/20 text-emerald-500">
                                                Animated
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="min-h-48 flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 p-8">
                                    <div className="w-full">
                                        {currentScene && (
                                            <ComponentRenderer
                                                node={currentScene.root}
                                                animations={currentScene.animations}
                                                selectedNodeId={selectedNodeId}
                                                onSelect={selectNode}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Code Output */}
                            {showCode && (
                                <div className="rounded-md border border-zinc-900 bg-zinc-900/20 p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-300">
                                            <Code2 size={16} />
                                            Generated Code
                                        </h3>
                                        <button
                                            onClick={copyCode}
                                            className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
                                        >
                                            {copiedCode ? (
                                                <>
                                                    <Check size={12} />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="rounded-md bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm text-zinc-300">
                                        <pre className="whitespace-pre-wrap break-all">
                                            {generateCode()}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
