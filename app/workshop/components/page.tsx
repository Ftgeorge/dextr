"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"

const phrases = [
    "Redesign your interface system",
    "Harmonize component libraries",
    "Refine production patterns",
    "Prototype experimental ideas",
]

export default function WorkshopPage() {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [charIndex, setCharIndex] = useState(0)

    // Pre-generate color pattern for current phrase (only changes when phrase changes)
    const colorPattern = useMemo(() => {
        const currentPhrase = phrases[currentPhraseIndex]
        return currentPhrase.split('').map((_, index) => {
            // Use a deterministic hash based on phrase and character index
            const hash = (currentPhraseIndex * 31 + index) % 2
            return hash === 0
        })
    }, [currentPhraseIndex])

    useEffect(() => {
        const currentPhrase = phrases[currentPhraseIndex]
        const typingSpeed = isDeleting ? 30 : 80
        const pauseBeforeDelete = 2000
        const pauseBeforeType = 500

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Finished typing, pause then start deleting
            const timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete)
            return () => clearTimeout(timeout)
        }

        if (isDeleting && charIndex === 0) {
            // Finished deleting, move to next phrase
            const timeout = setTimeout(() => {
                setIsDeleting(false)
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
                setCharIndex(0)
            }, pauseBeforeType)
            return () => clearTimeout(timeout)
        }

        // Type or delete character
        const timeout = setTimeout(() => {
            if (isDeleting) {
                setDisplayedText(currentPhrase.substring(0, charIndex - 1))
                setCharIndex(charIndex - 1)
            } else {
                setDisplayedText(currentPhrase.substring(0, charIndex + 1))
                setCharIndex(charIndex + 1)
            }
        }, typingSpeed)

        return () => clearTimeout(timeout)
    }, [charIndex, isDeleting, currentPhraseIndex])

    return (
        <div className="flex h-full items-center justify-center bg-zinc-950 px-6 py-24 text-zinc-100">
            <div className="flex max-w-3xl flex-col items-center text-center">
                {/* Typewriter Effect */}
                <div className="mb-6 flex min-h-fit items-center justify-center">
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {displayedText.split('').map((char, index) => {
                            // Use pre-generated color pattern
                            const isAccent = colorPattern[index]
                            return (
                                <span
                                    key={`${currentPhraseIndex}-${index}`}
                                    className={isAccent ? "text-accent" : "text-zinc-100"}
                                    style={isAccent ? {
                                        filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))",
                                    } : undefined}
                                >
                                    {char}
                                </span>
                            )
                        })}
                        <motion.span
                            className="inline-block w-0.5 h-[0.9em] ml-1 bg-accent"
                            animate={{ opacity: [1, 1, 0, 0] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{
                                filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))",
                            }}
                        />
                    </h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    className="mb-12 text-sm leading-relaxed text-zinc-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    Choose a component from the sidebar to view its implementation details, usage guidelines, and version history.
                </motion.p>

                {/* Keyboard Shortcuts */}
                <motion.div
                    className="flex flex-col gap-2 text-xs text-zinc-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="flex items-center gap-2">
                        <kbd className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px]">/</kbd>
                        <span>Focus search</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px]">↑ ↓</kbd>
                        <span>Navigate list</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-[10px]">Enter</kbd>
                        <span>Open component</span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
