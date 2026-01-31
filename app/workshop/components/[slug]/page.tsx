"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { ComponentDetail } from "@/components/workshop/component-detail"
import { useSimpleOnboarding } from "@/components/workshop/simple-onboarding"
import { components, ComponentEntry } from "@/lib/component-registry"
import { codeToHtml } from "shiki"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default function ComponentPage({ params }: PageProps) {
    const { startOnboarding } = useSimpleOnboarding()
    const [highlightedCode, setHighlightedCode] = useState("")
    
    // For now, we'll use a placeholder approach since we can't read files on client side
    const slug = "button" // This would come from params
    const componentEntry = components.find((c: ComponentEntry) => c.slug === slug)

    // Get the actual source code for the button component
    const sourceCode = `import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = 
  | "primary" 
  | "secondary" 
  | "outline" 
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "icon"

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  icon?: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 
    "bg-accent text-accent-foreground hover:opacity-90 active:opacity-80 shadow-sm",
  secondary: 
    "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 active:bg-zinc-700 shadow-sm",
  outline: 
    "border border-zinc-300 bg-zinc-50 text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700",
  ghost: 
    "text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700",
  destructive: 
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
  success: 
    "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 shadow-sm",
  warning: 
    "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 shadow-sm",
  icon:
    "p-2 rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-base",
  xl: "h-11 px-6 text-lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, fullWidth = false, icon, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className
    )

    if (variant === "icon" && icon) {
      return (
        <button
          className={combinedClassName}
          ref={ref}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            icon
          )}
        </button>
      )
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  }

Button.displayName = "Button"

export type { ButtonVariant, ButtonSize }`

    // Combined useEffect for both onboarding and code highlighting - MUST be before any conditional returns
    useEffect(() => {
        // Auto-start simple onboarding when page loads
        const onboardingTimer = setTimeout(() => {
            startOnboarding()
        }, 1000)
        
        // Generate highlighted code
        const highlightCode = async () => {
            try {
                const html = await codeToHtml(sourceCode, {
                    lang: 'tsx',
                    theme: 'github-dark-dimmed'
                })
                setHighlightedCode(html)
            } catch (error) {
                console.error('Failed to highlight code:', error)
                // Fallback to plain code
                setHighlightedCode(`<pre><code class="language-tsx">${sourceCode}</code></pre>`)
            }
        }
        
        highlightCode()
        
        return () => clearTimeout(onboardingTimer)
    }, [startOnboarding, sourceCode])

    // Early return must come AFTER all hooks
    if (!componentEntry) {
        notFound()
    }

    const { name, description } = componentEntry

    return (
        <div className="min-h-full bg-zinc-950 py-12 text-zinc-100">
            <div className="container mx-auto max-w-5xl px-6">
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
