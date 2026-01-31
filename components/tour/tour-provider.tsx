"use client"

import { createContext, useContext, useEffect, useRef } from "react"
import Shepherd from "shepherd.js"
import "shepherd.js/dist/css/shepherd.css"
import "./tour-styles.css"

interface TourContextType {
    startWorkshopTour: () => void
    startWorkbenchTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function useTour() {
    const context = useContext(TourContext)
    if (!context) {
        throw new Error("useTour must be used within a TourProvider")
    }
    return context
}

export function TourProvider({ children }: { children: React.ReactNode }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tourRef = useRef<any>(null)

    useEffect(() => {
        // Initialize tour instance
        tourRef.current = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
                classes: 'shepherd-theme-custom',
                scrollTo: { behavior: 'smooth', block: 'center' },
                cancelIcon: {
                    enabled: true
                }
            }
        })

        return () => {
            if (tourRef.current) {
                tourRef.current.cancel()
            }
        }
    }, [])

    const startWorkshopTour = () => {
        if (!tourRef.current) return

        // Reset tour
        tourRef.current.cancel()

        // Define steps
        const steps = []

        // Only add welcome step if header exists (we are on the landing page)
        if (document.querySelector('#workshop-header')) {
            steps.push({
                id: 'workshop-intro',
                title: 'Welcome to the Workshop',
                text: 'The Workshop is your component library. Here you can explore all available UI components.',
                attachTo: { element: '#workshop-header', on: 'bottom' },
                buttons: [
                    {
                        text: 'Next',
                        action: tourRef.current.next,
                        classes: 'shepherd-button-primary'
                    }
                ]
            })
        }

        steps.push(
            {
                id: 'workshop-search',
                title: 'Search Components',
                text: 'Quickly find what you need by typing in the search bar. You can also use the "/" shortcut.',
                attachTo: { element: '#dexter-sidebar input[type="text"]', on: 'right' },
                buttons: [
                    {
                        text: 'Back',
                        action: tourRef.current.back,
                        classes: 'shepherd-button'
                    },
                    {
                        text: 'Next',
                        action: tourRef.current.next,
                        classes: 'shepherd-button-primary'
                    }
                ]
            },
            {
                id: 'workshop-list',
                title: 'Component List',
                text: 'Navigate through category groups to find specific components.',
                attachTo: { element: '#dexter-sidebar [data-scrollable-content]', on: 'right' },
                buttons: [
                    {
                        text: 'Back',
                        action: tourRef.current.back,
                        classes: 'shepherd-button'
                    },
                    {
                        text: 'Done',
                        action: tourRef.current.complete,
                        classes: 'shepherd-button-primary'
                    }
                ]
            }
        )

        tourRef.current.addSteps(steps)
        tourRef.current.start()
    }

    const startWorkbenchTour = () => {
        if (!tourRef.current) return

        // Reset tour completely
        tourRef.current.cancel()
        
        // Clear any existing steps by creating a new tour instance
        tourRef.current = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
                classes: 'shepherd-theme-custom',
                scrollTo: { behavior: 'smooth', block: 'center' },
                cancelIcon: {
                    enabled: true
                }
            }
        })

        // Add workbench-specific steps
        const steps = [
            {
                id: 'workbench-intro',
                title: 'Workbench Playground',
                text: 'Welcome to the Workbench! This is where you can experiment with components in real-time.',
                attachTo: { element: '#dexter-preview-area', on: 'bottom' },
                buttons: [
                    {
                        text: 'Next',
                        action: tourRef.current.next,
                        classes: 'shepherd-button-primary'
                    }
                ]
            },
            {
                id: 'workbench-sidebar',
                title: 'Component Settings',
                text: 'Use the sidebar to change component properties, variants, and sizes.',
                attachTo: { element: '#dexter-sidebar', on: 'right' },
                buttons: [
                    {
                        text: 'Back',
                        action: tourRef.current.back,
                        classes: 'shepherd-button'
                    },
                    {
                        text: 'Next',
                        action: tourRef.current.next,
                        classes: 'shepherd-button-primary'
                    }
                ]
            },
            {
                id: 'workbench-animations',
                title: 'Animation Controls',
                text: 'Toggle animations on or off to see how they affect the component.',
                attachTo: { element: '#dexter-animation-controls', on: 'bottom' },
                buttons: [
                    {
                        text: 'Back',
                        action: tourRef.current.back,
                        classes: 'shepherd-button'
                    },
                    {
                        text: 'Next',
                        action: tourRef.current.next,
                        classes: 'shepherd-button-primary'
                    }
                ]
            },
            {
                id: 'workbench-code',
                title: 'Get the Code',
                text: 'View the generated code here. You can copy it directly to your clipboard.',
                attachTo: { element: '#dexter-code-view-toggle', on: 'bottom' },
                buttons: [
                    {
                        text: 'Back',
                        action: tourRef.current.back,
                        classes: 'shepherd-button'
                    },
                    {
                        text: 'Done',
                        action: tourRef.current.complete,
                        classes: 'shepherd-button-primary'
                    }
                ]
            }
        ]

        tourRef.current.addSteps(steps)
        tourRef.current.start()
    }

    return (
        <TourContext.Provider value={{ startWorkshopTour, startWorkbenchTour }}>
            {children}
        </TourContext.Provider>
    )
}
