"use server"

import { codeToHtml } from "shiki"

export async function highlightCode(code: string, lang: string = 'tsx', theme: string = 'github-dark-dimmed') {
    if (!code) return ""
    try {
        const html = await codeToHtml(code, {
            lang,
            theme
        })
        return html
    } catch (error) {
        console.error("Server-side highlighting failed:", error)
        // Return basic fallback if highlighting fails
        return `<pre><code>${code}</code></pre>`
    }
}
