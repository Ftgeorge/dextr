"use client"

import { useState } from "react"
import { WorkshopSidebar } from "@/components/workshop/workshop-sidebar"
import { MobileSidebarToggle } from "@/components/workshop/mobile-sidebar-toggle"
import { MobileSidebarOverlay } from "@/components/workshop/mobile-sidebar-overlay"
import Logo from "@/components/ui/logo"

export default function WorkshopComponentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950">
            {/* Desktop Sidebar - Fixed width, scrollable */}
            <div className="hidden lg:flex lg:shrink-0">
                <WorkshopSidebar className="w-80" />
            </div>

            {/* Mobile Sidebar Overlay */}
            <MobileSidebarOverlay open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

            {/* Main Pane - Flexible, scrollable */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header with Toggle */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-900">
                    <MobileSidebarToggle onClick={() => setMobileSidebarOpen(true)} />
                    <Logo/>
                    <div className="w-10" />
                </div>

                {children}
            </main>
        </div>
    )
}
