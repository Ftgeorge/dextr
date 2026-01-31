import { ButtonWorkbench } from "@/components/ui/buttons/button-workbench"
import { BasicCardWorkbench } from "@/components/ui/cards/basic-card-workbench"
import { ComingSoon } from "@/components/ui/coming-soon"
import React, { ReactNode } from "react"

export type ComponentStatus = "production-ready" | "experimental" | "in-progress"
export type StackStatus = "stable" | "beta" | "alpha" | "deprecated"

export interface StackVersion {
    version: string
    status: StackStatus
    lastUpdated: string
    notes?: string
}

export interface ComponentStacks {
    web: StackVersion
    "react-native": StackVersion
}

export interface ComponentEntry {
    id: string
    name: string
    slug: string
    category: string
    description: string
    component: (props?: Record<string, unknown>) => ReactNode
    sourcePath: string
    sourceCode?: string
    status: ComponentStatus
    tags: string[]
    stacks: ComponentStacks
    usage?: {
        whenToUse: string[]
        whenNotToUse: string[]
        props: { name: string; type: string; description: string; defaultValue?: string | boolean | number | null }[]
    }
    notes?: {
        decisions: string[]
        performance?: string
    }
    changelog?: {
        version: string
        date: string
        stack: "web" | "react-native"
        changes: string[]
    }[]
    relatedProjects?: string[]
    updatedAt: string
    reuseCount: number
    isFeatured?: boolean
}

export interface ProjectEntry {
    name: string
    slug: string
    description: string
    status: string
    problemStatement: string
    outcome: string
    componentsUsed: string[]
}

export const components: ComponentEntry[] = [
    {
        id: "button",
        name: "Button",
        slug: "button",
        category: "Inputs",
        description: "Single button component with variants (primary, secondary, outline, ghost, destructive, success, warning).",
        component: (props) => <ButtonWorkbench {...(props as Record<string, unknown>)} />,
        sourcePath: "components/ui/buttons/button.tsx",
        sourceCode: `import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = 
  | "primary" 
  | "secondary" 
  | "outline" 
  | "ghost"
  | "destructive"
  | "success"
  | "warning"

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 
    "bg-accent text-accent-foreground hover:opacity-90 active:opacity-80 shadow-sm",
  secondary: 
    "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 active:bg-zinc-700 shadow-sm",
  outline: 
    "border border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-900/40 active:bg-zinc-900/60",
  ghost: 
    "bg-transparent text-zinc-200 hover:bg-zinc-900/40 active:bg-zinc-900/60",
  destructive: 
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm",
  success: 
    "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm",
  warning: 
    "bg-amber-500 text-zinc-950 hover:bg-amber-600 active:bg-amber-700 shadow-sm",
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1.5 text-xs rounded",
  sm: "px-3 py-2 text-sm rounded-md",
  md: "px-4 py-2.5 text-base rounded-md",
  lg: "px-6 py-3 text-lg rounded-lg",
  xl: "px-8 py-4 text-xl rounded-lg",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false, 
    disabled, 
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          // Custom className
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -ml-1 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = "Button"

export type { ButtonVariant, ButtonSize }`,
        status: "production-ready",
        tags: ["interactive", "button", "variants"],
        stacks: {
            web: {
                version: "1.0.0",
                status: "stable",
                lastUpdated: "2026-01-29",
                notes: "Production-ready with all variants"
            },
            "react-native": {
                version: "0.9.0",
                status: "beta",
                lastUpdated: "2026-01-29",
                notes: "React Native version in development"
            }
        },
        usage: {
            whenToUse: [
                "Primary actions (primary variant).",
                "Secondary actions (secondary, outline, or ghost variants).",
                "Status/feedback actions (success, warning, destructive variants).",
                "Any place you need a consistent button API across projects."
            ],
            whenNotToUse: [
                "As a link (use an anchor or Link component instead).",
                "For navigation between routes (use Link/navigation components instead).",
                "When the only state is loading (consider disabling the whole UI section instead)."
            ],
            props: [
                { name: "variant", type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'icon'", description: "Visual style variant.", defaultValue: "primary" },
                { name: "size", type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: "Button size.", defaultValue: "md" },
                { name: "isLoading", type: "boolean", description: "Shows a spinner and disables the button.", defaultValue: false },
                { name: "fullWidth", type: "boolean", description: "Expands button to full container width.", defaultValue: false },
                { name: "children", type: "ReactNode", description: "Label content for the button.", defaultValue: "Button" },
                { name: "hasIcon", type: "boolean", description: "Whether to show an icon with the button.", defaultValue: false },
                { name: "iconPosition", type: "'left' | 'right'", description: "Position of the icon relative to text.", defaultValue: "left" },
                { name: "iconPack", type: "'lucide' | 'fontawesome' | 'heroicons' | 'feather'", description: "Icon pack to choose from.", defaultValue: "lucide" },
                { name: "iconName", type: "string", description: "Name of the icon from selected pack.", defaultValue: "none" },
                { name: "leftIcon", type: "ReactNode", description: "Left icon component.", defaultValue: null },
                { name: "rightIcon", type: "ReactNode", description: "Right icon component.", defaultValue: null }
            ]
        },
        notes: {
            decisions: [
                "Implemented as a forwardRef button to support composition and focus management.",
                "Unified variants and sizes via lookup maps to keep the API stable and prevent class sprawl.",
                "Loading state disables the button and swaps icons for a spinner to avoid layout jitter.",
                "Uses focus ring + offset for accessible keyboard navigation."
            ],
            performance: "Zero-dependency component; class merging via cn() and constant style maps."
        },
        changelog: [
            {
                version: "1.0.0",
                date: "2026-01-29",
                stack: "web",
                changes: ["Initial production release", "All variants implemented", "Loading state added"]
            }
        ],
        updatedAt: "2026-01-29",
        reuseCount: 0,
        isFeatured: true
    },
    {
        id: "basic-card",
        name: "Basic Card",
        slug: "basic-card",
        category: "Containers",
        description: "A versatile container with subtle border and zinc background.",
        component: BasicCardWorkbench,
        sourcePath: "components/ui/cards/basic-card.tsx",
        sourceCode: `export function BasicCard() {
    return (
        <div className="w-full max-w-xs overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="aspect-video bg-zinc-100 dark:bg-zinc-900" />
            <div className="p-4">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Card Title</h4>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    This is a simple card component used for displaying content in a grid.
                </p>
            </div>
        </div>
    )
}`,
        status: "production-ready",
        tags: ["layout", "container", "card"],
        stacks: {
            web: {
                version: "1.0.0",
                status: "stable",
                lastUpdated: "2024-01-15",
                notes: "Stable container component"
            },
            "react-native": {
                version: "0.8.0",
                status: "alpha",
                lastUpdated: "2024-01-15",
                notes: "React Native version planned"
            }
        },
        updatedAt: "2024-01-15",
        reuseCount: 24,
        isFeatured: true
    }
]

export const projects: ProjectEntry[] = [
    {
        name: "Admin Dashboard v2",
        slug: "admin-dashboard",
        description: "A complete overhaul of the internal management tool with a focus on data density and speed.",
        status: "Live",
        problemStatement: "The previous dashboard struggled with layout shifts under heavy data load and had inconsistent action cues.",
        outcome: "Improved user task completion time by 30% and unified the visual language across 14 internal pages.",
        componentsUsed: ["button", "basic-card"]
    },
    {
        name: "Dextr Marketing",
        slug: "Dextr-marketing",
        description: "Waitlist and feature landing page for the Dextr ecosystem.",
        status: "In Progress",
        problemStatement: "Needed a high-performance landing page that showcases the workshop aesthetic.",
        outcome: "Currently achieving 98+ Lighthouse scores and 15% conversion rate on early traffic.",
        componentsUsed: ["button"]
    }
]
