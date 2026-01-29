import { ButtonDemo } from "@/components/ui/buttons/button-demo"
import { BasicCard } from "@/components/ui/cards/basic-card"
import { ReactNode } from "react"

export type ComponentStatus = "production-ready" | "experimental" | "in-progress"

export interface ComponentEntry {
    name: string
    slug: string
    category: string
    description: string
    component: () => ReactNode
    sourcePath: string
    status: ComponentStatus
    tags: string[]
    usage?: {
        whenToUse: string[]
        whenNotToUse: string[]
        props: { name: string; type: string; description: string }[]
    }
    notes?: {
        decisions: string[]
        performance?: string
    }
    versions?: {
        version: string
        date: string
        status: "stable" | "deprecated" | "experimental"
        changelog: string
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
        name: "Button",
        slug: "button",
        category: "Inputs",
        description: "Single button component with variants (primary, secondary, outline, ghost, destructive, success, warning).",
        component: ButtonDemo,
        sourcePath: "components/ui/buttons/button.tsx",
        status: "production-ready",
        tags: ["interactive", "button", "variants"],
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
                { name: "variant", type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning'", description: "Visual style variant." },
                { name: "size", type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: "Button size." },
                { name: "isLoading", type: "boolean", description: "Shows a spinner and disables the button." },
                { name: "leftIcon", type: "ReactNode", description: "Optional leading icon (hidden while loading)." },
                { name: "rightIcon", type: "ReactNode", description: "Optional trailing icon (hidden while loading)." },
                { name: "fullWidth", type: "boolean", description: "Expands button to full container width." },
                { name: "children", type: "ReactNode", description: "Label content for the button." },
                { name: "onClick", type: "() => void", description: "Event handler for click interactions." },
                { name: "className", type: "string", description: "Optional CSS classes." }
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
        updatedAt: "2026-01-29",
        reuseCount: 0,
        isFeatured: true
    },
    {
        name: "Basic Card",
        slug: "basic-card",
        category: "Containers",
        description: "A versatile container with subtle border and zinc background.",
        component: BasicCard,
        sourcePath: "components/ui/cards/basic-card.tsx",
        status: "production-ready",
        tags: ["layout", "container", "card"],
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
