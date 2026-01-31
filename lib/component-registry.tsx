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
    status: ComponentStatus
    tags: string[]
    stacks: ComponentStacks
    usage?: {
        whenToUse: string[]
        whenNotToUse: string[]
        props: { name: string; type: string; description: string }[]
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
                { name: "variant", type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'icon'", description: "Visual style variant." },
                { name: "size", type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", description: "Button size." },
                { name: "isLoading", type: "boolean", description: "Shows a spinner and disables the button." },
                { name: "fullWidth", type: "boolean", description: "Expands button to full container width." },
                { name: "children", type: "ReactNode", description: "Label content for the button." },
                { name: "hasIcon", type: "boolean", description: "Whether to show an icon with the button." },
                { name: "iconPosition", type: "'left' | 'right'", description: "Position of the icon relative to text." },
                { name: "iconPack", type: "'lucide' | 'fontawesome' | 'heroicons' | 'feather'", description: "Icon pack to choose from." },
                { name: "iconName", type: "string", description: "Name of the icon from selected pack." },
                { name: "leftIcon", type: "ReactNode", description: "Left icon component." },
                { name: "rightIcon", type: "ReactNode", description: "Right icon component." }
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
    },
    {
        id: "dropdown",
        name: "Dropdown",
        slug: "dropdown",
        category: "Inputs",
        description: "Accessible dropdown component with keyboard navigation and search functionality.",
        component: () => <ComingSoon title="Dropdown" description="Coming soon to Dexter UI" />,
        sourcePath: "components/ui/dropdown.tsx",
        status: "in-progress",
        tags: ["interactive", "form", "select", "navigation"],
        stacks: {
            web: {
                version: "0.8.0",
                status: "beta",
                lastUpdated: "2026-01-29",
                notes: "In development with keyboard navigation"
            },
            "react-native": {
                version: "0.5.0",
                status: "alpha",
                lastUpdated: "2026-01-29",
                notes: "React Native version planned"
            }
        },
        usage: {
            whenToUse: [
                "Selecting from a list of options.",
                "Form inputs with predefined choices.",
                "Navigation menus with multiple destinations."
            ],
            whenNotToUse: [
                "For simple binary choices (use radio buttons or toggle instead).",
                "When you need multi-select (use checkboxes instead).",
                "For very long lists (consider a searchable dropdown)."
            ],
            props: [
                { name: "value", type: "string", description: "Currently selected value." },
                { name: "onValueChange", type: "(value: string) => void", description: "Callback when selection changes." },
                { name: "options", type: "DropdownOption[]", description: "Array of available options." },
                { name: "placeholder", type: "string", description: "Placeholder text when no value is selected." },
                { name: "disabled", type: "boolean", description: "Whether the dropdown is disabled." }
            ]
        },
        notes: {
            decisions: [
                "Full keyboard navigation support (Arrow keys, Enter, Escape).",
                "ARIA attributes for screen reader accessibility.",
                "Click outside to close functionality.",
                "Custom styling to match Dexter design system."
            ],
            performance: "Optimized event handling and minimal re-renders."
        },
        updatedAt: "2026-01-29",
        reuseCount: 0
    },
    {
        id: "logo",
        name: "Logo",
        slug: "logo",
        category: "Branding",
        description: "Animated DEXTR logo component with smooth transitions and glow effects.",
        component: () => <ComingSoon title="Logo" description="Coming soon to Dexter UI" />,
        sourcePath: "components/ui/logo.tsx",
        status: "in-progress",
        tags: ["branding", "animation", "logo", "typography"],
        stacks: {
            web: {
                version: "0.9.0",
                status: "beta",
                lastUpdated: "2026-01-29",
                notes: "Animated logo with Framer Motion"
            },
            "react-native": {
                version: "0.6.0",
                status: "alpha",
                lastUpdated: "2026-01-29",
                notes: "React Native animation version planned"
            }
        },
        usage: {
            whenToUse: [
                "Application headers and navigation.",
                "Loading screens and splash pages.",
                "Brand consistency across pages."
            ],
            whenNotToUse: [
                "In contexts where animation might be distracting.",
                "When a static logo is preferred.",
                "In performance-critical sections."
            ],
            props: [
                { name: "size", type: "'sm' | 'md' | 'lg'", description: "Logo size variant." },
                { name: "animated", type: "boolean", description: "Whether to show animations." },
                { name: "variant", type: "'full' | 'icon' | 'text'", description: "Logo display variant." }
            ]
        },
        notes: {
            decisions: [
                "Uses Framer Motion for smooth animations.",
                "Drop shadow effects for visual depth.",
                "Staggered letter animations for dynamic feel.",
                "Responsive sizing for different contexts."
            ],
            performance: "Optimized animations with GPU acceleration."
        },
        updatedAt: "2026-01-29",
        reuseCount: 0
    },
    {
        id: "badge",
        name: "Badge",
        slug: "badge",
        category: "Data Display",
        description: "Small status indicators and labels for categorization and metadata display.",
        component: () => <ComingSoon title="Badge" description="Coming soon to Dexter UI" />,
        sourcePath: "components/ui/badge/badge.tsx",
        status: "experimental",
        tags: ["label", "status", "indicator", "metadata"],
        stacks: {
            web: {
                version: "0.3.0",
                status: "alpha",
                lastUpdated: "2026-01-29",
                notes: "Early development stage"
            },
            "react-native": {
                version: "0.2.0",
                status: "alpha",
                lastUpdated: "2026-01-29",
                notes: "Planned for future release"
            }
        },
        usage: {
            whenToUse: [
                "Displaying status information (success, warning, error).",
                "Categorizing content with labels.",
                "Showing counts or metadata."
            ],
            whenNotToUse: [
                "For interactive elements (use buttons instead).",
                "When large amounts of text need to be displayed.",
                "As primary navigation elements."
            ],
            props: [
                { name: "variant", type: "'default' | 'success' | 'warning' | 'error'", description: "Visual style variant." },
                { name: "size", type: "'sm' | 'md' | 'lg'", description: "Badge size." },
                { name: "children", type: "ReactNode", description: "Badge content." }
            ]
        },
        updatedAt: "2026-01-29",
        reuseCount: 0
    },
    {
        id: "input",
        name: "Input",
        slug: "input",
        category: "Inputs",
        description: "Text input component with validation, states, and accessibility features.",
        component: () => <ComingSoon title="Input" description="Coming soon to Dexter UI" />,
        sourcePath: "components/ui/input/input.tsx",
        status: "experimental",
        tags: ["form", "text", "validation", "input"],
        stacks: {
            web: {
                version: "0.4.0",
                status: "alpha",
                lastUpdated: "2026-01-29",
                notes: "Form validation integration planned"
            },
            "react-native": {
                version: "0.3.0",
                status: "alpha",
                lastUpdated: "2026-01-29",
                notes: "React Native text input planned"
            }
        },
        usage: {
            whenToUse: [
                "User text input in forms.",
                "Search fields and filters.",
                "Data entry interfaces."
            ],
            whenNotToUse: [
                "For rich text editing (use a text editor component).",
                "When you need file uploads (use file input component).",
                "For password fields (use password input variant)."
            ],
            props: [
                { name: "value", type: "string", description: "Input value." },
                { name: "onChange", type: "(value: string) => void", description: "Change handler." },
                { name: "placeholder", type: "string", description: "Placeholder text." },
                { name: "error", type: "boolean", description: "Whether input has validation error." },
                { name: "disabled", type: "boolean", description: "Whether input is disabled." }
            ]
        },
        updatedAt: "2026-01-29",
        reuseCount: 0
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
