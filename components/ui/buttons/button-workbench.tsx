"use client"

import { Button } from "@/components/ui/buttons/button"

interface ButtonWorkbenchProps {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success" | "warning"
    size?: "xs" | "sm" | "md" | "lg" | "xl"
    isLoading?: boolean
    fullWidth?: boolean
    children?: React.ReactNode
}

export function ButtonWorkbench({ 
    variant = "primary", 
    size = "md", 
    isLoading = false, 
    fullWidth = false,
    children = "Button" 
}: ButtonWorkbenchProps) {
    return (
        <Button 
            variant={variant}
            size={size}
            isLoading={isLoading}
            fullWidth={fullWidth}
        >
            {children}
        </Button>
    )
}
