"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingStep {
    id: string
    title: string
    description: string
    screenshot?: string
}

const onboardingSteps: OnboardingStep[] = [
    {
        id: "welcome",
        title: "Welcome to Dexter UI",
        description: "Dexter UI is your personal component vault for building real products. Browse components, preview them live, and copy production-ready code instantly.",
        screenshot: "/onboarding/welcome.svg"
    },
    {
        id: "sidebar",
        title: "Component Inventory",
        description: "Browse all available components in the sidebar. Components are organized by category and show their status (production-ready, experimental, or in-progress). Click any component to view its details.",
        screenshot: "/onboarding/sidebar.svg"
    },
    {
        id: "preview",
        title: "Live Preview",
        description: "See components in action with the live preview. Experiment with different props and see changes instantly before using them in your project.",
        screenshot: "/onboarding/preview.svg"
    },
    {
        id: "code",
        title: "Code Viewer",
        description: "Copy production-ready code with a single click. Switch between Web and React Native implementations to see the appropriate code for your stack.",
        screenshot: "/onboarding/code.svg"
    },
    {
        id: "workbench",
        title: "Live Playground",
        description: "The workbench is your experimental space. Select components, modify their props, and see live changes. Generate code and copy it directly to your clipboard.",
        screenshot: "/onboarding/workbench.svg"
    },
    {
        id: "metadata",
        title: "Component Metadata",
        description: "Each component includes detailed metadata: version information for Web and React Native stacks, usage guidelines, performance notes, and changelog history.",
        screenshot: "/onboarding/metadata.svg"
    },
    {
        id: "ready",
        title: "You're Ready!",
        description: "Build fast, stay consistent, and enjoy Dexter UI. Start exploring components or head to the workbench to experiment with live code.",
        screenshot: "/onboarding/ready.svg"
    }
]

interface SimpleOnboardingProps {
    isOpen: boolean
    onClose: () => void
}

export function SimpleOnboarding({ isOpen, onClose }: SimpleOnboardingProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const isLastStep = currentStep === onboardingSteps.length - 1

    const handleNext = () => {
        if (isLastStep) {
            handleComplete()
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleComplete = () => {
        localStorage.setItem("dexter-simple-onboarding-complete", "true")
        onClose()
    }

    const handleSkip = () => {
        handleComplete()
    }

    const step = onboardingSteps[currentStep]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative mx-4 max-w-2xl w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 transition-colors hover:text-zinc-200"
                >
                    <X size={20} />
                </button>

                {/* Progress indicator */}
                <div className="mb-6 flex items-center gap-2">
                    {onboardingSteps.map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "h-1 flex-1 rounded-full transition-colors",
                                index <= currentStep ? "bg-accent" : "bg-zinc-800"
                            )}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold text-zinc-100">
                        {step.title}
                    </h2>
                    <p className="text-lg text-zinc-300 leading-relaxed">
                        {step.description}
                    </p>
                    
                    {/* Screenshot */}
                    {step.screenshot && (
                        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                            <Image 
                                src={step.screenshot} 
                                alt={`${step.title} screenshot`}
                                width={600}
                                height={400}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSkip}
                        className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
                    >
                        Skip tour
                    </button>
                    
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90"
                    >
                        {isLastStep ? "Get Started" : "Next"}
                        {!isLastStep && <ArrowRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Hook for managing simple onboarding
export function useSimpleOnboarding() {
    const [isOpen, setIsOpen] = useState(false)

    const startOnboarding = () => {
        // Clear completion flag to allow replay
        try {
            localStorage.removeItem("dexter-simple-onboarding-complete")
        } catch {
            // Ignore localStorage errors
        }
        setIsOpen(true)
    }

    const closeOnboarding = () => {
        setIsOpen(false)
        // Mark as completed when closed
        try {
            localStorage.setItem("dexter-simple-onboarding-complete", "true")
        } catch {
            // Ignore localStorage errors
        }
    }

    // Check if we should start onboarding on first render
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                const completed = localStorage.getItem("dexter-simple-onboarding-complete")
                if (!completed) {
                    // Start onboarding immediately if not completed
                    setIsOpen(true)
                }
            } catch {
                // Ignore localStorage errors
            }
        }, 100) // Small delay to avoid hydration issues
        
        return () => clearTimeout(timer)
    }, [])

    return {
        isOpen,
        startOnboarding,
        closeOnboarding
    }
}

// Provider for simple onboarding
interface SimpleOnboardingProviderProps {
    children: React.ReactNode
}

export function SimpleOnboardingProvider({ children }: SimpleOnboardingProviderProps) {
    const { isOpen, closeOnboarding } = useSimpleOnboarding()

    return (
        <>
            {children}
            <SimpleOnboarding isOpen={isOpen} onClose={closeOnboarding} />
        </>
    )
}
