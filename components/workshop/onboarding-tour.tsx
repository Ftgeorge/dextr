"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
    id: string
    target?: string // CSS selector for target element
    title?: string
    content: string
    position?: "top" | "bottom" | "left" | "right" | "center"
    navigateTo?: string // URL to navigate to for this step
}

const tourSteps: TourStep[] = [
    {
        id: "welcome",
        title: "Welcome to Dexter UI",
        content: "Welcome to Dexter UI — your personal component vault for building real products.",
        position: "center"
    },
    {
        id: "sidebar",
        target: "#dexter-sidebar",
        title: "Component Inventory",
        content: "Browse all available components here, organized by category.",
        position: "right",
        navigateTo: "/workshop/components"
    },
    {
        id: "finish",
        title: "You're all set!",
        content: "Build fast, stay consistent, and enjoy Dexter UI.",
        position: "center"
    }
]

// Page-specific tour steps for component detail pages
const componentDetailSteps: TourStep[] = [
    {
        id: "preview",
        target: "#dexter-component-preview",
        title: "Live Preview",
        content: "Preview components live before using them in your project.",
        position: "left"
    },
    {
        id: "code",
        target: "#dexter-code-viewer",
        title: "Code Viewer",
        content: "Copy production-ready code without leaving Dexter UI.",
        position: "left"
    },
    {
        id: "stack",
        target: "#dexter-stack-switcher",
        title: "Stack Switcher",
        content: "Switch between Web and React Native implementations instantly.",
        position: "bottom"
    }
]

// Workbench-specific tour steps
const workbenchSteps: TourStep[] = [
    {
        id: "workbench",
        target: "#dexter-workbench",
        title: "Live Playground",
        content: "Experiment with components and props before shipping them.",
        position: "right"
    }
]

interface OnboardingTourProps {
    isOpen: boolean
    onClose: () => void
    onComplete?: () => void
    tourType?: "main" | "component-detail" | "workbench"
}

export function OnboardingTour({ isOpen, onClose, onComplete, tourType = "main" }: OnboardingTourProps) {
    console.log('OnboardingTour render, isOpen:', isOpen)
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
    const spotlightRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    // Get the appropriate steps based on tour type
    const getSteps = () => {
        switch (tourType) {
            case "component-detail":
                return componentDetailSteps
            case "workbench":
                return workbenchSteps
            default:
                return tourSteps
        }
    }

    const steps = getSteps()
    const step = steps[currentStep]
    const isLastStep = currentStep === steps.length - 1
    const isFirstStep = currentStep === 0

    // Update position when step changes or on scroll/resize
    useEffect(() => {
        if (!isOpen) return

        const handleResize = () => {
            if (step.target && step.position !== "center") {
                const target = document.querySelector(step.target)
                if (target) {
                    const rect = target.getBoundingClientRect()
                    setTargetRect(rect)
                } else {
                    setTargetRect(null)
                }
            } else {
                setTargetRect(null)
            }
        }

        const handleScroll = handleResize

        window.addEventListener("resize", handleResize)
        window.addEventListener("scroll", handleScroll)

        // Initial position update
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("scroll", handleScroll)
        }
    }, [isOpen, step.target, step.position])

    // Scroll target into view if needed
    useEffect(() => {
        if (!isOpen || !step.target || step.position === "center") return

        // Navigate to the correct page first
        if (step.navigateTo) {
            console.log('Navigating to:', step.navigateTo)
            router.push(step.navigateTo)
            // Wait a bit for navigation to complete before scrolling and switching tabs
            setTimeout(() => {
                console.log('Looking for target:', step.target)
                const target = document.querySelector(step.target!)
                if (target) {
                    console.log('Found target, scrolling to it')
                    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })

                    // If this is the code viewer step, switch to Code tab
                    if (step.id === "code") {
                        console.log('Switching to Code tab...')
                        setTimeout(() => {
                            const codeTab = Array.from(document.querySelectorAll('button')).find(btn =>
                                btn.textContent?.trim() === 'Code'
                            ) as HTMLButtonElement
                            console.log('Code tab found:', codeTab)
                            if (codeTab) {
                                console.log('Clicking Code tab')
                                codeTab.click()
                                // Give it time to switch, then update target position
                                setTimeout(() => {
                                    const codeViewer = document.querySelector('#dexter-code-viewer')
                                    if (codeViewer) {
                                        const rect = codeViewer.getBoundingClientRect()
                                        setTargetRect(rect)
                                    }
                                }, 300)
                            }
                        }, 1000)
                    }
                } else {
                    console.log('Target not found')
                }
            }, 500)
        } else {
            const target = document.querySelector(step.target)
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })

                // If this is the code viewer step, switch to Code tab
                if (step.id === "code") {
                    setTimeout(() => {
                        const codeTab = Array.from(document.querySelectorAll('button')).find(btn =>
                            btn.textContent?.trim() === 'Code'
                        ) as HTMLButtonElement
                        if (codeTab) {
                            codeTab.click()
                            setTimeout(() => {
                                const codeViewer = document.querySelector('#dexter-code-viewer')
                                if (codeViewer) {
                                    const rect = codeViewer.getBoundingClientRect()
                                    setTargetRect(rect)
                                }
                            }, 300)
                        }
                    }, 500)
                }
            }
        }
    }, [currentStep, isOpen, step, router])

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Escape":
                    onClose()
                    break
                case "ArrowRight":
                case "ArrowDown":
                    if (!isLastStep) {
                        setCurrentStep(prev => prev + 1)
                    }
                    break
                case "ArrowLeft":
                case "ArrowUp":
                    if (!isFirstStep) {
                        setCurrentStep(prev => prev - 1)
                    }
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose, isLastStep, isFirstStep])

    const handleNext = () => {
        if (isLastStep) {
            onComplete?.()
            onClose()
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleSkip = () => {
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Backdrop with rectangular spotlight mask */}
            {targetRect ? (
                <div
                    className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md pointer-events-auto"
                    style={{
                        mask: `linear-gradient(to bottom, black 0%, black ${targetRect.top - 8}px, transparent ${targetRect.top - 8}px, transparent ${targetRect.bottom + 8}px, black ${targetRect.bottom + 8}px, black 100%)`,
                        WebkitMask: `linear-gradient(to bottom, black 0%, black ${targetRect.top - 8}px, transparent ${targetRect.top - 8}px, transparent ${targetRect.bottom + 8}px, black ${targetRect.bottom + 8}px, black 100%)`,
                    }}
                    onClick={handleSkip}
                />
            ) : (
                <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md pointer-events-auto" onClick={handleSkip} />
            )}

            {/* Spotlight */}
            {targetRect && (
                <div
                    ref={spotlightRef}
                    className="absolute pointer-events-none transition-all duration-500 ease-out"
                    style={{
                        left: targetRect.left - 8,
                        top: targetRect.top - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                    }}
                >
                    <div className="absolute inset-0 border border-emerald-500/50 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.2)]" />
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-emerald-500/10" />
                </div>
            )}

            {/* Tooltip */}
            <div
                ref={tooltipRef}
                className={cn(
                    "absolute pointer-events-auto transition-all duration-500 ease-out",
                    "max-w-sm rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-0 shadow-2xl",
                    step.position === "center" && "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                    step.position === "top" && targetRect && `bottom-${window.innerHeight - targetRect.top + 16} left-1/2 -translate-x-1/2`,
                    step.position === "bottom" && targetRect && `top-${targetRect.bottom + 16} left-1/2 -translate-x-1/2`,
                    step.position === "left" && targetRect && `right-${window.innerWidth - targetRect.left + 16} top-1/2 -translate-y-1/2`,
                    step.position === "right" && targetRect && `left-${targetRect.right + 16} top-1/2 -translate-y-1/2`
                )}
                style={
                    step.position === "center" ? {} :
                        step.position === "top" && targetRect ? { bottom: `${window.innerHeight - targetRect.top + 16}px`, left: "50%", transform: "translateX(-50%)" } :
                            step.position === "bottom" && targetRect ? { top: `${targetRect.bottom + 16}px`, left: "50%", transform: "translateX(-50%)" } :
                                step.position === "left" && targetRect ? { right: `${window.innerWidth - targetRect.left + 16}px`, top: "50%", transform: "translateY(-50%)" } :
                                    step.position === "right" && targetRect ? { left: `${targetRect.right + 16}px`, top: "50%", transform: "translateY(-50%)" } :
                                        {}
                }
            >
                <div className="relative p-6 pt-12">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
                        aria-label="Close tour"
                    >
                        <X size={14} />
                    </button>

                    {/* Step Indicator */}
                    <div className="absolute top-6 left-6 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-zinc-500">
                            STEP {currentStep + 1}
                        </span>
                        <span className="text-[10px] font-medium text-zinc-700">/</span>
                        <span className="text-[10px] font-medium text-zinc-700">
                            {steps.length}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="mb-6 mt-2">
                        {step.title && (
                            <h3 className="mb-2 text-base font-bold text-zinc-100">
                                {step.title}
                            </h3>
                        )}
                        <p className="text-sm font-medium leading-relaxed text-zinc-400">
                            {step.content}
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="mb-6 flex gap-1">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-0.5 flex-1 rounded-full transition-all duration-300",
                                    index <= currentStep ? "bg-emerald-500" : "bg-zinc-800"
                                )}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={handleSkip}
                            className="text-[11px] font-bold text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                            Skip Tour
                        </button>

                        <div className="flex items-center gap-2">
                            {!isFirstStep && (
                                <button
                                    onClick={handlePrevious}
                                    className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-[11px] font-bold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-1.5 text-[11px] font-bold text-white shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-600 hover:shadow-emerald-500/20 active:scale-95"
                            >
                                {isLastStep ? "Finish" : "Next"}
                                {!isLastStep && <ArrowRight size={12} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Legacy hook for backward compatibility - use useTour from tour-provider instead
export function useOnboardingTour() {
    const [isOpen, setIsOpen] = useState(() => {
        try {
            const completed = localStorage.getItem("dexter-onboarding-complete")
            return !completed // Start tour immediately if not completed
        } catch {
            return false
        }
    })

    const startTour = useCallback(() => {
        console.log('startTour called, setting isOpen to true')
        // Clear completion flag to allow replay
        try {
            localStorage.removeItem("dexter-onboarding-complete")
        } catch {
            // Ignore localStorage errors
        }
        setIsOpen(true)
    }, [])

    const closeTour = useCallback(() => {
        setIsOpen(false)
    }, [])

    const completeTour = useCallback(() => {
        try {
            localStorage.setItem("dexter-onboarding-complete", "true")
        } catch {
            // Ignore localStorage errors
        }
    }, [])

    return {
        isOpen,
        startTour,
        closeTour,
        completeTour
    }
}
