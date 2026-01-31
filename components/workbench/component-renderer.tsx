"use client"

import { Suspense, memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ComponentNode, AnimationNode } from '@/lib/workbench-store'
import { AnimationRuntime } from '@/lib/animation-runtime'
import { components } from '@/lib/component-registry'

interface ComponentRendererProps {
  node: ComponentNode
  animations: AnimationNode[]
  selectedNodeId?: string | null
  onSelect?: (nodeId: string) => void
  depth?: number
  parentSelected?: boolean
}

// Memoized component to prevent unnecessary re-renders
const ComponentRenderer = memo<ComponentRendererProps>(({
  node,
  animations,
  selectedNodeId,
  onSelect,
  depth = 0,
  parentSelected = false
}) => {
  // Get relevant animations for this component
  const relevantAnimations = useMemo(() => {
    return animations.filter(anim => anim.targetComponentId === node.id)
  }, [animations, node.id])

  // Generate animation props
  const animationProps = useMemo(() => {
    if (relevantAnimations.length === 0) return {}

    const mountAnimations = relevantAnimations.filter(anim => anim.trigger === 'mount')
    const hoverAnimations = relevantAnimations.filter(anim => anim.trigger === 'hover')

    const props: Record<string, unknown> = {}

    if (mountAnimations.length > 0) {
      const firstMount = mountAnimations[0]
      const output = AnimationRuntime.generateAnimationCode(firstMount)
      
      props.initial = output.framerMotion.initial
      props.animate = output.framerMotion.animate
      props.transition = output.framerMotion.transition
    }

    if (hoverAnimations.length > 0) {
      const firstHover = hoverAnimations[0]
      const output = AnimationRuntime.generateAnimationCode(firstHover)
      
      props.whileHover = output.framerMotion.whileHover
    }

    return props
  }, [relevantAnimations])

  // Get the actual component from registry
  const Component = useMemo(() => {
    const componentEntry = components.find(c => c.id === node.type)
    return componentEntry?.component || UnknownComponent
  }, [node.type])

  // Check if this node is selected
  const isSelected = selectedNodeId === node.id
  const isChildOfSelected = parentSelected

  // Handle selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect(node.id)
    }
  }

  // Render children if they exist
  const renderChildren = () => {
    if (!node.children || node.children.length === 0) return null

    return (
      <div className="component-children">
        {node.children.map((child) => (
          <Suspense 
            key={child.id} 
            fallback={<div className="animate-pulse bg-zinc-800 rounded h-8 w-20" />}
          >
            <ComponentRenderer
              node={child}
              animations={animations}
              selectedNodeId={selectedNodeId}
              onSelect={onSelect}
              depth={depth + 1}
              parentSelected={isSelected || isChildOfSelected}
            />
          </Suspense>
        ))}
      </div>
    )
  }

  // Wrap with motion if animations exist
  const WrappedComponent = relevantAnimations.length > 0 ? motion.div : 'div'

  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <WrappedComponent
        {...animationProps}
        className={`
          component-node
          ${isChildOfSelected ? 'ring-1 ring-accent/50' : ''}
          ${onSelect ? 'cursor-pointer' : ''}
          ${depth > 0 ? 'ml-4' : ''}
          transition-all duration-200
          max-w-fit
        `}
        onClick={handleClick}
        data-component-id={node.id}
        data-component-type={node.type}
        data-depth={depth}
      >
        <div className="component-wrapper">
          {/* Component */}
          <div className="component-content">
            <Component {...node.props} />
          </div>
          
          {/* Children */}
          {renderChildren()}
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute -top-6 left-0 text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
              {node.type}
            </div>
          )}
        </div>
      </WrappedComponent>
    </div>
  )
})

// Fallback component for unknown types
const UnknownComponent = ({ type }: { type?: string }) => (
  <div className="text-red-500 p-2 border border-red-200 rounded">
    Unknown Component: {type || 'Unknown'}
  </div>
)

ComponentRenderer.displayName = 'ComponentRenderer'

export { ComponentRenderer }
