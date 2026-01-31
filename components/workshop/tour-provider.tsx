"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { OnboardingTour } from "./onboarding-tour"

interface TourContextType {
    startTour: (tourType?: "main" | "component-detail" | "workbench") => void
    closeTour: () => void
    isTourOpen: boolean
    tourType: "main" | "component-detail" | "workbench"
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
    const [isTourOpen, setIsTourOpen] = useState(false)
    const [tourType, setTourType] = useState<"main" | "component-detail" | "workbench">("main")

    const startTour = (type: "main" | "component-detail" | "workbench" = "main") => {
        console.log(`Starting ${type} tour`)
        setTourType(type)
        setIsTourOpen(true)
    }

    const closeTour = () => {
        console.log('Closing tour')
        setIsTourOpen(false)
    }

    const completeTour = () => {
        console.log('Tour completed')
        setIsTourOpen(false)
        // Mark as completed in localStorage for main tour
        if (tourType === "main") {
            localStorage.setItem("dexter-onboarding-complete", "true")
        }
    }

    return (
        <TourContext.Provider value={{ startTour, closeTour, isTourOpen, tourType }}>
            {children}
            <OnboardingTour 
                isOpen={isTourOpen} 
                onClose={closeTour} 
                onComplete={completeTour}
                tourType={tourType}
            />
        </TourContext.Provider>
    )
}

export function useTour() {
    const context = useContext(TourContext)
    if (context === undefined) {
        throw new Error("useTour must be used within a TourProvider")
    }
    return context
}
