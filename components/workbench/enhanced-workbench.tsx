"use client"

import { useState, useCallback, JSX } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, Copy, Check, Layers, 
  Plus, Trash2, Eye, Sparkles,
  ChevronRight, ChevronDown, TreePine
} from 'lucide-react'
import { useWorkbenchStore, ComponentNode, AnimationNode } from '@/lib/workbench-store'
import { ComponentRenderer } from './component-renderer'
import { AnimationRuntime } from '@/lib/animation-runtime'
import { Dropdown } from '@/components/ui/dropdown'
import { cn } from '@/lib/utils'

interface EnhancedWorkbenchProps {
  className?: string
}

export function EnhancedWorkbench({ className }: EnhancedWorkbenchProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  
  const {
    currentScene,
    selectedNodeId,
    showAnimations,
    showCode,
    codeView,
    selectNode,
    updateNodeProps,
    toggleAnimations,
    toggleCode,
    setCodeView,
    addAnimation,
    removeAnimation,
    animationPresets
  } = useWorkbenchStore()

  const selectedNode = currentScene?.root.id === selectedNodeId ? currentScene.root : null

  // Generate code functions
  const generateJSXCode = useCallback(() => {
    if (!currentScene) return ''
    
    const renderNode = (node: ComponentNode, depth = 0): string => {
      const indent = '  '.repeat(depth)
      const props = Object.entries(node.props || {})
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key}="${value}"`
          } else if (typeof value === 'boolean') {
            return value ? key : ''
          } else {
            return `${key}={${JSON.stringify(value)}}`
          }
        })
        .filter(Boolean)
        .join(' ')

      const openingTag = props ? `<${node.type} ${props}>` : `<${node.type}>`
      const closingTag = `</${node.type}>`

      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        const childrenCode = node.children.map((child: ComponentNode) => renderNode(child, depth + 1)).join('\n')
        return `${indent}${openingTag}\n${childrenCode}\n${indent}${closingTag}`
      } else {
        return `${indent}${openingTag}${closingTag}`
      }
    }

    return `// Generated JSX\n${renderNode(currentScene.root)}`
  }, [currentScene])

  const generateAnimationCode = () => {
    if (!currentScene) return ''
    
    return currentScene.animations.map(anim => {
      return AnimationRuntime.generateComponentAnimationCode(anim.targetComponentId, [anim], 'framer-motion')
    }).join('\n\n')
  }

  // Generate code for current scene
  const generateCode = useCallback(() => {
    if (!currentScene) return ''

    const generateTailwindCode = () => {
      // Generate Tailwind classes based on component props
      const extractTailwindClasses = (node: ComponentNode): string[] => {
        const classes: string[] = []
        
        // Extract classes from props
        Object.values(node.props || {}).forEach(value => {
          if (typeof value === 'string' && value.includes('className=')) {
            const match = value.match(/className="([^"]+)"/)
            if (match) classes.push(match[1])
          }
        })

        // Recursively extract from children
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: ComponentNode) => {
            classes.push(...extractTailwindClasses(child))
          })
        }

        return classes
      }

      const allClasses = extractTailwindClasses(currentScene.root)
      const uniqueClasses = [...new Set(allClasses)]

      return `/* Tailwind Classes */\n${uniqueClasses.join('\n')}`
    }

    switch (codeView) {
      case 'jsx':
        return generateJSXCode()
      case 'tailwind':
        return generateTailwindCode()
      case 'animations':
        return generateAnimationCode()
      case 'all':
        return `${generateJSXCode()}\n\n${generateTailwindCode()}\n\n${generateAnimationCode()}`
      default:
        return generateJSXCode()
    }
  }, [currentScene, codeView, generateJSXCode, generateAnimationCode])

  // Copy code to clipboard
  const copyCode = async () => {
    const code = generateCode()
    await navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Toggle node expansion in tree view
  const toggleNodeExpansion = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }, [])

  // Render component tree
  const renderComponentTree = (node: ComponentNode, depth = 0): JSX.Element => {
    const nodeId = node.id as string
    const isExpanded = expandedNodes.has(nodeId)
    const hasChildren = node.children && Array.isArray(node.children) && node.children.length > 0
    const isSelected = selectedNodeId === nodeId

    return (
      <div key={nodeId} className="select-none">
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors',
            'hover:bg-zinc-800',
            isSelected && 'bg-accent/20 text-accent'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => selectNode(nodeId)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNodeExpansion(nodeId)
              }}
              className="p-0.5 hover:bg-zinc-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>
          )}
          
          <span className="text-sm font-medium">{node.type}</span>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Toggle visibility
              }}
              className="p-0.5 hover:bg-zinc-700 rounded"
            >
              <Eye size={12} />
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && Array.isArray(node.children) && (
          <div className="ml-2">
            {node.children.map((child: ComponentNode) => renderComponentTree(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // Render animation controls
  const renderAnimationControls = () => {
    if (!selectedNode) return null

    const nodeAnimations = currentScene?.animations.filter(
      anim => anim.targetComponentId === selectedNode.id
    ) || []

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Animations</h4>
          <button
            onClick={() => {
              const newAnimation = {
                ...animationPresets['fade-in'],
                id: crypto.randomUUID(),
                targetComponentId: selectedNode.id
              }
              addAnimation(newAnimation)
            }}
            className="p-1 hover:bg-zinc-700 rounded"
          >
            <Plus size={14} />
          </button>
        </div>

        {nodeAnimations.length === 0 ? (
          <p className="text-xs text-zinc-500">No animations added</p>
        ) : (
          <div className="space-y-2">
            {nodeAnimations.map((animation) => (
              <div
                key={animation.id}
                className="flex items-center gap-2 p-2 bg-zinc-800 rounded"
              >
                <Sparkles size={12} />
                <span className="text-xs flex-1">{animation.preset.name}</span>
                <span className="text-xs text-zinc-500">{animation.trigger}</span>
                <button
                  onClick={() => removeAnimation(animation.id)}
                  className="p-0.5 hover:bg-zinc-700 rounded"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!currentScene) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        <div className="text-center">
          <Layers size={48} className="mx-auto mb-4 opacity-50" />
          <p>No scene loaded</p>
          <p className="text-sm mt-2">Create or select a scene to start</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Enhanced Workbench</h2>
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <span>v{currentScene?.metadata?.version || '1.0'}</span>
            <span>•</span>
            <span>{currentScene?.metadata?.updatedAt ? new Date(currentScene.metadata.updatedAt).toLocaleDateString() : 'Just now'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAnimations}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showAnimations ? 'bg-accent text-accent-foreground' : 'hover:bg-zinc-800'
            )}
          >
            <Sparkles size={16} />
          </button>
          
          <button
            onClick={toggleCode}
            className={cn(
              'p-2 rounded-lg transition-colors',
              showCode ? 'bg-accent text-accent-foreground' : 'hover:bg-zinc-800'
            )}
          >
            <Code2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-zinc-900 flex flex-col">
          {/* Component Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <TreePine size={16} />
              <h3 className="text-sm font-medium">Component Tree</h3>
            </div>
            
            <div className="space-y-1">
              {renderComponentTree(currentScene.root)}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="border-t border-zinc-900 p-4">
            <h3 className="text-sm font-medium mb-4">Properties</h3>
            
            {selectedNode ? (
              <div className="space-y-3">
                {Object.entries(selectedNode.props || {}).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs text-zinc-400">{key}</label>
                    <input
                      type="text"
                      value={String(value)}
                      onChange={(e) => updateNodeProps(selectedNode.id, { [key]: e.target.value })}
                      className="w-full px-2 py-1 text-xs bg-zinc-800 border border-zinc-700 rounded"
                    />
                  </div>
                ))}
                
                {renderAnimationControls()}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Select a component to edit properties</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="min-h-full flex items-center justify-center">
              <div className="relative">
                <ComponentRenderer
                  node={currentScene.root}
                  animations={currentScene.animations}
                  selectedNodeId={selectedNodeId}
                  onSelect={selectNode}
                />
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 300 }}
                exit={{ height: 0 }}
                className="border-t border-zinc-900"
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} />
                      <span className="text-sm font-medium">Generated Code</span>
                      
                      <Dropdown
                        value={codeView}
                        onValueChange={(value: string) => setCodeView(value as 'jsx' | 'tailwind' | 'animations' | 'all')}
                        options={[
                          { value: 'jsx', label: 'JSX' },
                          { value: 'tailwind', label: 'Tailwind' },
                          { value: 'animations', label: 'Animations' },
                          { value: 'all', label: 'All' }
                        ]}
                      />
                    </div>

                    <button
                      onClick={copyCode}
                      className="flex items-center gap-2 px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-auto">
                    <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">
                      {generateCode()}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
