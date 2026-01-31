"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { ComponentDetail } from "@/components/workshop/component-detail"
import { components, ComponentEntry } from "@/lib/component-registry"
import { highlightCode } from "@/app/actions/highlight"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default function ComponentPage({ params }: PageProps) {
    const [highlightedCode, setHighlightedCode] = useState("")

    // For now, we'll use a placeholder approach since we can't read files on client side
    const slug = "button" // This would come from params
    const componentEntry = components.find((c: ComponentEntry) => c.slug === slug)

    const sourceCode = componentEntry?.sourceCode || "// Source code not available"


    // Generate highlighted code
    useEffect(() => {
        const highlightCodeFunc = async () => {
            try {
                const html = await highlightCode(sourceCode, 'tsx', 'github-dark-dimmed')
                setHighlightedCode(html)
            } catch (error) {
                console.error('Failed to highlight code:', error)
                // Fallback to plain code
                setHighlightedCode(`<pre><code class="language-tsx">${sourceCode}</code></pre>`)
            }
        }

        highlightCodeFunc()
    }, [sourceCode])

    // Early return must come AFTER all hooks
    if (!componentEntry) {
        notFound()
    }

    const { name, description } = componentEntry

    return (
        <div className="min-h-full bg-zinc-950 py-12 text-zinc-100">
            <div className="container mx-auto max-w-6xl px-6">
                <header className="mb-12">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                            {name}
                        </h1>
                        <p className="max-w-2xl text-lg text-zinc-400 leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>
                </header>

                <ComponentDetail
                    slug={slug}
                    sourceCode={sourceCode}
                    highlightedCode={highlightedCode}
                    basename="button.tsx"
                />
            </div>
        </div>
    )
}
