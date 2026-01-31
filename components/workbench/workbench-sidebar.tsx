"use client";

import { ComponentEntry, components } from "@/lib/component-registry"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Construction, Download, Heart, Menu, Search, Settings, Star, Upload, X, HelpCircle, CheckCircle2, AlertCircle, Wrench, Sparkles, LucideIcon, Plus, Minus, Check, Copy, Trash, Edit, Eye, EyeOff, Lock, Unlock, Bell, Mail, User, Users, Home, Folder, File, Calendar, Clock, Play, Pause } from "lucide-react"
import { Dropdown } from "../ui/dropdown"
import { ComponentNode, useWorkbenchStore } from "@/lib/workbench-store"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link";
import Logo from "../ui/logo";
import { usePathname } from "next/navigation";
import { useSimpleOnboarding } from "../workshop/simple-onboarding";
import { useTour } from "../tour/tour-provider";

interface ComponentProp {
    name: string
    type: string
    description?: string
}

const statusIcons: Record<string, LucideIcon> = {
    "production-ready": CheckCircle2,
    "experimental": Wrench,
    "in-progress": AlertCircle,
}

type Framework = "react" | "react-native" | "flutter"

export function WorkbenchSidebar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [framework, setFramework] = useState<Framework>("react")
    const { startOnboarding } = useSimpleOnboarding()
    const { startWorkbenchTour } = useTour()
    const searchInputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()

    // Workbench store
    const {
        currentScene,
        setCurrentScene,
        updateNodeProps,
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
                    isLoading: false,
                    fullWidth: false,
                    children: 'Button',
                    leftIcon: null,
                    rightIcon: null
                },
                children: [],
                metadata: {
                    version: "",
                    warnings: undefined,
                    presets: undefined,
                    category: undefined
                }
            }

            createScene('button', rootNode)

            // Add a fade-in animation
            const animation = {
                ...animationPresets['fade-in'],
                id: crypto.randomUUID(),
                targetComponentId: rootNode.id
            }
            addAnimation(animation)
        }
    }, [currentScene, setCurrentScene, createScene, addAnimation, animationPresets])

    const selectedComponent = currentScene ? components.find((c: ComponentEntry) => c.id === currentScene.root.type) : null
    const availableComponents = components.filter((c: ComponentEntry) => c.status === "production-ready")

    const handleComponentChange = (componentId: string) => {
        const component = components.find((c: ComponentEntry) => c.id === componentId)
        if (component && currentScene) {
            let defaultProps: Record<string, unknown> = {}

            // Set default props based on component type
            if (componentId === "button") {
                defaultProps = {
                    variant: "primary",
                    size: "md",
                    isLoading: false,
                    fullWidth: false,
                    children: "Button",
                    leftIcon: null,
                    rightIcon: null
                }
            } else if (componentId === "basic-card") {
                defaultProps = {
                    title: "Card Title",
                    description: "Card description goes here.",
                    children: null
                }
            }

            const updatedRootNode = {
                ...currentScene.root,
                type: componentId,
                props: defaultProps
            }

            setCurrentScene({
                ...currentScene,
                root: updatedRootNode,
                metadata: {
                    ...currentScene.metadata,
                    updatedAt: new Date().toISOString()
                }
            })
        }
    }

    const handlePropChange = (propName: string, value: unknown) => {
        if (currentScene) {
            const updatedRootNode = {
                ...currentScene.root,
                props: {
                    ...currentScene.root.props,
                    [propName]: value
                }
            }

            setCurrentScene({
                ...currentScene,
                root: updatedRootNode,
                metadata: {
                    ...currentScene.metadata,
                    updatedAt: new Date().toISOString()
                }
            })
        }
    }

    const handleAnimationChange = (animationPresetId: string) => {
        if (currentScene) {
            // Remove existing animations for this component
            const filteredAnimations = currentScene.animations.filter(
                anim => anim.targetComponentId !== currentScene.root.id
            )

            // Add new animation - preserve the preset ID for dropdown matching
            const newAnimation = {
                ...animationPresets[animationPresetId],
                id: animationPresetId, // Use preset ID instead of random UUID for dropdown matching
                targetComponentId: currentScene.root.id
            }

            const updatedScene = {
                ...currentScene,
                animations: [...filteredAnimations, newAnimation],
                metadata: {
                    ...currentScene.metadata,
                    updatedAt: new Date().toISOString()
                }
            }

            setCurrentScene(updatedScene)
        }
    }

    const getCurrentAnimation = () => {
        if (!currentScene) return null
        return currentScene.animations.find(anim => anim.targetComponentId === currentScene.root.id)
    }

    // Comprehensive icon options for icon variant
    const iconOptions = [
        { value: 'none', label: 'No Icon', icon: null },
        { value: 'Search', label: 'Search', icon: Search },
        { value: 'Menu', label: 'Menu', icon: Menu },
        { value: 'X', label: 'Close', icon: X },
        { value: 'ChevronLeft', label: 'Chevron Left', icon: ChevronLeft },
        { value: 'ChevronRight', label: 'Chevron Right', icon: ChevronRight },
        { value: 'ChevronDown', label: 'Chevron Down', icon: ChevronDown },
        { value: 'ChevronUp', label: 'Chevron Up', icon: ChevronUp },
        { value: 'Heart', label: 'Heart', icon: Heart },
        { value: 'Star', label: 'Star', icon: Star },
        { value: 'Download', label: 'Download', icon: Download },
        { value: 'Upload', label: 'Upload', icon: Upload },
        { value: 'Settings', label: 'Settings', icon: Settings },
        { value: 'Plus', label: 'Plus', icon: Plus },
        { value: 'Minus', label: 'Minus', icon: Minus },
        { value: 'Check', label: 'Check', icon: Check },
        { value: 'Copy', label: 'Copy', icon: Copy },
        { value: 'Trash', label: 'Trash', icon: Trash },
        { value: 'Edit', label: 'Edit', icon: Edit },
        { value: 'Eye', label: 'Eye', icon: Eye },
        { value: 'EyeOff', label: 'Eye Off', icon: EyeOff },
        { value: 'Lock', label: 'Lock', icon: Lock },
        { value: 'Unlock', label: 'Unlock', icon: Unlock },
        { value: 'Bell', label: 'Bell', icon: Bell },
        { value: 'Mail', label: 'Mail', icon: Mail },
        { value: 'User', label: 'User', icon: User },
        { value: 'Users', label: 'Users', icon: Users },
        { value: 'Home', label: 'Home', icon: Home },
        { value: 'Folder', label: 'Folder', icon: Folder },
        { value: 'File', label: 'File', icon: File },
        { value: 'Calendar', label: 'Calendar', icon: Calendar },
        { value: 'Clock', label: 'Clock', icon: Clock },
        { value: 'Play', label: 'Play', icon: Play },
        { value: 'Pause', label: 'Pause', icon: Pause },
    ]

    const getIconComponent = (iconName: string, iconPack: string = "lucide") => {
        if (iconPack === "lucide") {
            const iconOption = iconOptions.find(opt => opt.value === iconName)
            return iconOption?.icon || null
        }
        // For other icon packs, return placeholder for now
        return iconName === 'none' ? null : null
    }

    const getIconOptions = (iconPack: string = "lucide") => {
        if (iconPack === "lucide") {
            return iconOptions.map(opt => ({ value: opt.value, label: opt.label }))
        }
        // Placeholder options for other icon packs
        return [
            { value: 'none', label: 'No Icon' },
            { value: 'placeholder1', label: 'Icon 1 (Coming Soon)' },
            { value: 'placeholder2', label: 'Icon 2 (Coming Soon)' },
        ]
    }

    // Get active slug from URL
    const activeSlug = pathname?.split("/").pop() || ""

    // Filter and group components
    const filteredComponents = useMemo(() => {
        return components.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [searchQuery])

    const groupedComponents = useMemo(() => {
        const groups: Record<string, typeof components> = {}
        filteredComponents.forEach(component => {
            if (!groups[component.category]) {
                groups[component.category] = []
            }
            groups[component.category].push(component)
        })
        return groups
    }, [filteredComponents])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Focus search with /
            if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
                e.preventDefault()
                searchInputRef.current?.focus()
                return
            }

            // Arrow navigation
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault()
                const maxIndex = filteredComponents.length - 1
                if (e.key === "ArrowDown") {
                    setSelectedIndex(prev => Math.min(prev + 1, maxIndex))
                } else {
                    setSelectedIndex(prev => Math.max(prev - 1, 0))
                }
            }

            // Enter to navigate
            if (e.key === "Enter" && selectedIndex >= 0) {
                const component = filteredComponents[selectedIndex]
                if (component) {
                    window.location.href = `/workshop/components/${component.slug}`
                }
            }

            // Escape to clear search
            if (e.key === "Escape") {
                setSearchQuery("")
                searchInputRef.current?.blur()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [filteredComponents, selectedIndex])

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
            selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" })
        }
    }, [selectedIndex])

    return (
        <aside
            id="dexter-sidebar"
            className="flex h-full flex-col bg-zinc-950 border-r border-zinc-900 w-80"
            role="navigation"
            aria-label="Workbench sidebar"
        >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950 p-4">
                <div className="mb-4 flex flex-col gap-3">
                    <Logo />

                    <div className="flex items-center justify-between">
                        <div id="dexter-stack-switcher" className="flex min-w-0 flex-1">
                            <div className="w-full overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-900/30 p-1 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <div className="flex min-w-max items-center gap-1 whitespace-nowrap">
                                    <button
                                        type="button"
                                        onClick={() => setFramework("react")}
                                        className={cn(
                                            "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                            framework === "react" ? "bg-zinc-800 text-accent" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        React
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFramework("react-native")}
                                        className={cn(
                                            "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                            framework === "react-native" ? "bg-zinc-800 text-accent" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        React Native
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFramework("flutter")}
                                        className={cn(
                                            "shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest",
                                            framework === "flutter" ? "bg-zinc-800 text-accent" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                    >
                                        Flutter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Component Selector */}
                <div className="relative group" role="search">
                    <div className="relative group" role="search">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-accent transition-colors" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-zinc-900 bg-zinc-900/30 py-2.5 pl-10 pr-10 text-xs font-medium text-zinc-100 outline-none ring-accent/10 transition-all focus:border-accent/40 focus:bg-zinc-900/50 focus:ring-2"
                            aria-label="Search components"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-[9px] font-black text-zinc-600" aria-hidden="true">
                            /
                        </div>
                    </div>
                    <div className="mt-3 mb-1 text-[9px] font-bold uppercase tracking-widest text-zinc-600" role="status" aria-live="polite">
                        {availableComponents.length} Components
                    </div>
                    <div className="w-full">
                        <Dropdown
                            value={currentScene?.root.type || ''}
                            onValueChange={handleComponentChange}
                            options={availableComponents.map((c: ComponentEntry) => ({ value: c.id, label: c.name }))}
                            aria-label="Select component"
                            className=""
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
                data-scrollable-content
            >
                {framework !== "react" ? (
                    <div className="p-4">
                        <div className="text-center py-8">
                            <div className="text-zinc-600 text-sm">Framework support coming soon</div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Properties Section */}
                        <div className="mb-6">
                            <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm px-4 py-2 border-b border-zinc-900/50">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                                    Properties
                                </h3>
                            </div>

                            <div className="py-1">
                                {selectedComponent?.usage?.props ? (
                                    selectedComponent.usage.props.map((prop: ComponentProp) => (
                                        <div key={prop.name} className="group flex items-center gap-3 px-4 py-2.5 transition-all hover:bg-zinc-900/30">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-bold truncate text-zinc-300 group-hover:text-zinc-100">
                                                    {prop.name}
                                                </div>
                                                <div className="text-[9px] font-medium text-zinc-600 truncate">
                                                    {prop.type}
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                {prop.type.includes("boolean") ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as boolean) ? "true" : "false"}
                                                        onValueChange={(value) => handlePropChange(prop.name, value === "true")}
                                                        options={[
                                                            { value: "true", label: "True" },
                                                            { value: "false", label: "False" },
                                                        ]}
                                                        aria-label={`Select ${prop.name}`}
                                                    />
                                                ) : prop.name === "variant" ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as string) || "primary"}
                                                        onValueChange={(value) => handlePropChange(prop.name, value)}
                                                        options={[
                                                            { value: "primary", label: "Primary" },
                                                            { value: "secondary", label: "Secondary" },
                                                            { value: "outline", label: "Outline" },
                                                            { value: "ghost", label: "Ghost" },
                                                            { value: "destructive", label: "Destructive" },
                                                            { value: "success", label: "Success" },
                                                            { value: "warning", label: "Warning" },
                                                            { value: "icon", label: "Icon" },
                                                        ]}
                                                        aria-label={`Select ${prop.name}`}
                                                    />
                                                ) : prop.name === "size" ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as string) || "md"}
                                                        onValueChange={(value) => handlePropChange(prop.name, value)}
                                                        options={[
                                                            { value: "xs", label: "XS" },
                                                            { value: "sm", label: "SM" },
                                                            { value: "md", label: "MD" },
                                                            { value: "lg", label: "LG" },
                                                            { value: "xl", label: "XL" },
                                                        ]}
                                                        aria-label={`Select ${prop.name}`}
                                                    />
                                                ) : prop.name === "hasIcon" ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as boolean) ? "true" : "false"}
                                                        onValueChange={(value) => {
                                                            const hasIcon = value === "true"
                                                            handlePropChange(prop.name, hasIcon)
                                                            // Reset icon props when toggling off
                                                            if (!hasIcon) {
                                                                handlePropChange("iconPosition", "left")
                                                                handlePropChange("iconPack", "lucide")
                                                                handlePropChange("iconName", "none")
                                                            }
                                                        }}
                                                        options={[
                                                            { value: "true", label: "Yes" },
                                                            { value: "false", label: "No" },
                                                        ]}
                                                        aria-label={`Select ${prop.name}`}
                                                    />
                                                ) : prop.name === "iconPosition" ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as string) || "left"}
                                                        onValueChange={(value) => handlePropChange(prop.name, value)}
                                                        options={[
                                                            { value: "left", label: "Left" },
                                                            { value: "right", label: "Right" },
                                                        ]}
                                                        aria-label={`Select ${prop.name}`}
                                                        disabled={!currentScene?.root.props.hasIcon}
                                                    />
                                                ) : prop.name === "iconPack" ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as string) || "lucide"}
                                                        onValueChange={(value) => {
                                                            handlePropChange(prop.name, value)
                                                            // Reset icon name when changing pack
                                                            handlePropChange("iconName", "none")
                                                        }}
                                                        options={[
                                                            { value: "lucide", label: "Lucide React" },
                                                            { value: "fontawesome", label: "Font Awesome" },
                                                            { value: "heroicons", label: "Heroicons" },
                                                            { value: "feather", label: "Feather Icons" },
                                                        ]}
                                                        aria-label={`Select ${prop.name}`}
                                                        disabled={!currentScene?.root.props.hasIcon}
                                                    />
                                                ) : prop.name === "iconName" ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as string) || "none"}
                                                        onValueChange={(value) => {
                                                            const iconComponent = value === 'none' ? null : getIconComponent(value, (currentScene?.root.props.iconPack as string) || "lucide")
                                                            handlePropChange(prop.name, value)
                                                            // Set the appropriate icon prop based on position
                                                            const position = currentScene?.root.props.iconPosition || "left"
                                                            if (position === "left") {
                                                                handlePropChange("leftIcon", iconComponent)
                                                                handlePropChange("rightIcon", null)
                                                            } else {
                                                                handlePropChange("rightIcon", iconComponent)
                                                                handlePropChange("leftIcon", null)
                                                            }
                                                        }}
                                                        options={getIconOptions((currentScene?.root.props.iconPack as string) || "lucide")}
                                                        aria-label={`Select ${prop.name}`}
                                                        disabled={!currentScene?.root.props.hasIcon}
                                                    />
                                                ) : prop.name === "children" ? (
                                                    <input
                                                        type="text"
                                                        value={(currentScene?.root.props[prop.name] as string) || ""}
                                                        onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                                        className="w-42 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:border-accent/40 focus:outline-none"
                                                        placeholder="Text"
                                                    />
                                                ) : (prop.name === "leftIcon" || prop.name === "rightIcon") ? (
                                                    <Dropdown
                                                        value={(currentScene?.root.props[prop.name] as string) || 'none'}
                                                        onValueChange={(value) => {
                                                            const iconComponent = value === 'none' ? null : getIconComponent(value)
                                                            handlePropChange(prop.name, iconComponent)
                                                        }}
                                                        options={iconOptions.map(opt => ({ value: opt.value, label: opt.label }))}
                                                        aria-label={`Select ${prop.name}`}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={(currentScene?.root.props[prop.name] as string) || ""}
                                                        onChange={(e) => handlePropChange(prop.name, e.target.value)}
                                                        className="w-42 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2 py-2.5 text-xs text-zinc-300 placeholder-zinc-600 focus:border-accent/40 focus:outline-none"
                                                        placeholder="Value"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-4 text-center">
                                        <div className="text-xs text-zinc-600">No properties available</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Animation Section */}
                        <div className="mb-6">
                            <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm px-4 py-2 border-b border-zinc-900/50">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                                    Animation
                                </h3>
                            </div>

                            <div className="py-1">
                                <div className="group flex items-center gap-3 px-4 py-2.5 transition-all hover:bg-zinc-900/30">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold truncate text-zinc-300 group-hover:text-zinc-100">
                                            Animation Preset
                                        </div>

                                        {getCurrentAnimation() && (
                                            <div className="pt-1 text-[10px] text-zinc-600">
                                                <div>Trigger: {getCurrentAnimation()?.trigger}</div>
                                                <div>Duration: {getCurrentAnimation()?.config.duration}s</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="shrink-0 w-42">
                                        <Dropdown
                                            value={getCurrentAnimation()?.id || 'none'}
                                            onValueChange={(value) => {
                                                if (value === 'none') {
                                                    // Remove animation
                                                    if (currentScene) {
                                                        const filteredAnimations = currentScene.animations.filter(
                                                            anim => anim.targetComponentId !== currentScene.root.id
                                                        )
                                                        const updatedScene = {
                                                            ...currentScene,
                                                            animations: filteredAnimations,
                                                            metadata: {
                                                                ...currentScene.metadata,
                                                                updatedAt: new Date().toISOString()
                                                            }
                                                        }
                                                        setCurrentScene(updatedScene)
                                                    }
                                                } else {
                                                    handleAnimationChange(value)
                                                    // Auto-scroll to bottom when animation is selected with smooth scrolling
                                                    setTimeout(() => {
                                                        const scrollableContent = document.querySelector('[data-scrollable-content]')
                                                        if (scrollableContent) {
                                                            scrollableContent.scrollTo({
                                                                top: scrollableContent.scrollHeight,
                                                                behavior: 'smooth'
                                                            })
                                                        }
                                                    }, 100)
                                                }
                                            }}
                                            options={[
                                                { value: 'none', label: 'None' },
                                                { value: 'fade-in', label: 'Fade In' },
                                                { value: 'slide-up', label: 'Slide Up' },
                                                { value: 'scale-in', label: 'Scale In' },
                                                { value: 'hover-lift', label: 'Hover Lift' },
                                                { value: 'stagger-children', label: 'Stagger Children' },
                                            ]}
                                            aria-label="Select animation"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-zinc-900 bg-zinc-950 p-4 space-y-2">
                <button
                    onClick={() => startWorkbenchTour()}
                    className="flex items-center justify-between w-full rounded-lg border border-zinc-900 bg-zinc-900/30 px-4 py-3 transition-all hover:border-accent/40 hover:bg-zinc-900/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-zinc-800 p-1.5">
                            <HelpCircle size={14} className="text-zinc-500" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-zinc-300">Help</span>
                            <span className="text-[9px] font-medium text-zinc-600">Get started</span>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-600" />
                </button>

                <Link
                    href="/workshop/components"
                    className="flex items-center justify-between rounded-lg border border-zinc-900 bg-zinc-900/30 px-4 py-3 transition-all hover:border-accent/40 hover:bg-zinc-900/50"
                >
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-zinc-800 p-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-zinc-300">Workshop</span>
                            <span className="text-[9px] font-medium text-zinc-600">Components Gallery</span>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-700" />
                </Link>
            </div>
        </aside>
    )
}