import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Core Types
export interface ComponentNode {
  id: string
  type: string
  props: Record<string, unknown>
  children?: ComponentNode[]
  metadata: {
    version: string
    warnings?: string[]
    presets?: string[]
    category?: string
  }
}

export interface AnimationNode {
  id: string
  targetComponentId: string
  trigger: 'mount' | 'hover' | 'toggle' | 'focus' | 'scroll'
  preset: AnimationPreset
  config: AnimationConfig
}

export interface AnimationPreset {
  name: string
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'stagger' | 'bounce' | 'spring'
}

export interface AnimationConfig {
  duration?: number
  easing?: string
  delay?: number
  repeat?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate'
}

export interface WorkbenchScene {
  id: string
  name: string
  root: ComponentNode
  animations: AnimationNode[]
  metadata: {
    createdAt: string
    updatedAt: string
    version: string
  }
}

export interface WorkbenchState {
  // Current scene
  currentScene: WorkbenchScene | null
  selectedNodeId: string | null
  selectedAnimationId: string | null
  
  // Component library
  componentLibrary: Record<string, ComponentNode>
  
  // Animation presets
  animationPresets: Record<string, AnimationNode>
  
  // UI State
  sidebarWidth: number
  showAnimations: boolean
  showCode: boolean
  codeView: 'jsx' | 'tailwind' | 'animations' | 'all'
  
  // Actions
  setCurrentScene: (scene: WorkbenchScene) => void
  selectNode: (nodeId: string | null) => void
  selectAnimation: (animationId: string | null) => void
  
  // Node operations
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void
  addNode: (parentId: string, node: ComponentNode) => void
  removeNode: (nodeId: string) => void
  moveNode: (nodeId: string, newParentId: string) => void
  
  // Animation operations
  addAnimation: (animation: AnimationNode) => void
  updateAnimation: (animationId: string, updates: Partial<AnimationNode>) => void
  removeAnimation: (animationId: string) => void
  
  // UI actions
  setSidebarWidth: (width: number) => void
  toggleAnimations: () => void
  toggleCode: () => void
  setCodeView: (view: 'jsx' | 'tailwind' | 'animations' | 'all') => void
  
  // Scene operations
  createScene: (name: string, rootNode: ComponentNode) => WorkbenchScene
  duplicateScene: (sceneId: string) => WorkbenchScene | null
  deleteScene: (sceneId: string) => void
}

// Animation Preset Definitions
export const ANIMATION_PRESETS: Record<string, AnimationNode> = {
  'fade-in': {
    id: 'fade-in',
    targetComponentId: '',
    trigger: 'mount',
    preset: { name: 'Fade In', type: 'fade' },
    config: { duration: 0.25, easing: 'ease-out' }
  },
  'slide-up': {
    id: 'slide-up',
    targetComponentId: '',
    trigger: 'mount',
    preset: { name: 'Slide Up', type: 'slide' },
    config: { duration: 0.35, easing: 'ease-out', delay: 0.05 }
  },
  'scale-in': {
    id: 'scale-in',
    targetComponentId: '',
    trigger: 'mount',
    preset: { name: 'Scale In', type: 'scale' },
    config: { duration: 0.2, easing: 'ease-out' }
  },
  'hover-lift': {
    id: 'hover-lift',
    targetComponentId: '',
    trigger: 'hover',
    preset: { name: 'Hover Lift', type: 'scale' },
    config: { duration: 0.1, easing: 'ease-out' }
  },
  'stagger-children': {
    id: 'stagger-children',
    targetComponentId: '',
    trigger: 'mount',
    preset: { name: 'Stagger Children', type: 'stagger' },
    config: { duration: 0.3, easing: 'ease-out', delay: 0.05 }
  }
}

export const useWorkbenchStore = create<WorkbenchState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentScene: null,
    selectedNodeId: null,
    selectedAnimationId: null,
    componentLibrary: {},
    animationPresets: ANIMATION_PRESETS,
    sidebarWidth: 320,
    showAnimations: false,
    showCode: false,
    codeView: 'jsx',
    
    // Actions
    setCurrentScene: (scene: WorkbenchScene) => set({ currentScene: scene, selectedNodeId: null, selectedAnimationId: null }),
    
    selectNode: (nodeId: string | null) => set({ selectedNodeId: nodeId, selectedAnimationId: null }),
    selectAnimation: (animationId: string | null) => set({ selectedAnimationId: animationId, selectedNodeId: null }),
    
    updateNodeProps: (nodeId: string, props: Record<string, unknown>) => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene) return
      
      const updateNode = (node: ComponentNode): ComponentNode => {
        if (node.id === nodeId) {
          return { ...node, props: { ...node.props, ...props } }
        }
        if (node.children) {
          return { ...node, children: node.children.map(updateNode) }
        }
        return node
      }
      
      set({
        currentScene: {
          ...currentScene,
          root: updateNode(currentScene.root),
          metadata: { ...currentScene.metadata, updatedAt: new Date().toISOString() }
        }
      })
    },
    
    addNode: (parentId: string, node: ComponentNode) => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene) return
      
      const addNodeToTree = (treeNode: ComponentNode): ComponentNode => {
        if (treeNode.id === parentId) {
          return {
            ...treeNode,
            children: [...(treeNode.children || []), node]
          }
        }
        if (treeNode.children) {
          return {
            ...treeNode,
            children: treeNode.children.map(addNodeToTree)
          }
        }
        return treeNode
      }
      
      set({
        currentScene: {
          ...currentScene,
          root: addNodeToTree(currentScene.root),
          metadata: { ...currentScene.metadata, updatedAt: new Date().toISOString() }
        }
      })
    },
    
    removeNode: (nodeId: string) => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene) return
      
      const removeNodeFromTree = (node: ComponentNode): ComponentNode | null => {
        if (node.id === nodeId) return null
        if (node.children) {
          const filteredChildren = node.children
            .map(removeNodeFromTree)
            .filter(Boolean) as ComponentNode[]
          return { ...node, children: filteredChildren }
        }
        return node
      }
      
      set({
        currentScene: {
          ...currentScene,
          root: removeNodeFromTree(currentScene.root)!,
          metadata: { ...currentScene.metadata, updatedAt: new Date().toISOString() }
        }
      })
    },
    
    moveNode: (nodeId: string, newParentId: string) => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene) return
      
      // First, remove the node from its current position
      let nodeToMove: ComponentNode | null = null
      const removeNode = (node: ComponentNode): ComponentNode | null => {
        if (node.id === nodeId) {
          nodeToMove = node
          return null
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(removeNode).filter(Boolean) as ComponentNode[]
          }
        }
        return node
      }
      
      const updatedRoot = removeNode(currentScene.root)!
      
      // Then add it to the new parent
      const addNode = (node: ComponentNode): ComponentNode => {
        if (node.id === newParentId && nodeToMove) {
          return {
            ...node,
            children: [...(node.children || []), nodeToMove]
          }
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(addNode)
          }
        }
        return node
      }
      
      set({
        currentScene: {
          ...currentScene,
          root: addNode(updatedRoot),
          metadata: { ...currentScene.metadata, updatedAt: new Date().toISOString() }
        }
      })
    },
    
    addAnimation: (animation: AnimationNode) => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene) return
      
      set({
        currentScene: {
          ...currentScene,
          animations: [...currentScene.animations, animation],
          metadata: { ...currentScene.metadata, updatedAt: new Date().toISOString() }
        }
      })
    },
    
    updateAnimation: (animationId: string, updates: Partial<AnimationNode>) => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene) return
      
      set({
        currentScene: {
          ...currentScene,
          animations: currentScene.animations.map((anim: AnimationNode) =>
            anim.id === animationId ? { ...anim, ...updates } : anim
          ),
          metadata: { ...currentScene.metadata, updatedAt: new Date().toISOString() }
        }
      })
    },
    
    removeAnimation: (animationId: string) => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene) return
      
      set({
        currentScene: {
          ...currentScene,
          animations: currentScene.animations.filter((anim: AnimationNode) => anim.id !== animationId),
          metadata: { ...currentScene.metadata, updatedAt: new Date().toISOString() }
        }
      })
    },
    
    setSidebarWidth: (width: number) => set({ sidebarWidth: width }),
    toggleAnimations: () => set((state) => ({ showAnimations: !state.showAnimations })),
    toggleCode: () => set((state) => ({ showCode: !state.showCode })),
    setCodeView: (view: 'jsx' | 'tailwind' | 'animations' | 'all') => set({ codeView: view }),
    
    createScene: (name: string, rootNode: ComponentNode): WorkbenchScene => ({
      id: crypto.randomUUID(),
      name,
      root: rootNode,
      animations: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    }),
    
    duplicateScene: (sceneId: string): WorkbenchScene | null => {
      const currentState = get()
      const { currentScene } = currentState
      if (!currentScene || currentScene.id !== sceneId) return null
      
      return {
        ...currentScene,
        id: crypto.randomUUID(),
        name: `${currentScene.name} (Copy)`,
        metadata: {
          ...currentScene.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    },
    
    deleteScene: (sceneId: string) => {
      const currentState = get()
      const { currentScene } = currentState
      if (currentScene?.id === sceneId) {
        set({ currentScene: null, selectedNodeId: null, selectedAnimationId: null })
      }
    }
  }))
)

// Selectors
export const useCurrentScene = () => useWorkbenchStore((state: WorkbenchState) => state.currentScene)
export const useSelectedNode = () => {
  const state = useWorkbenchStore((state: WorkbenchState) => ({
    currentScene: state.currentScene,
    selectedNodeId: state.selectedNodeId
  }))
  
  const { currentScene, selectedNodeId } = state
  
  if (!currentScene || !selectedNodeId) return null
  
  const findNode = (node: ComponentNode): ComponentNode | null => {
    if (node.id === selectedNodeId) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child)
        if (found) return found
      }
    }
    return null
  }
  
  return findNode(currentScene.root)
}

export const useSelectedAnimation = () => {
  const state = useWorkbenchStore((state: WorkbenchState) => ({
    currentScene: state.currentScene,
    selectedAnimationId: state.selectedAnimationId
  }))
  
  const { currentScene, selectedAnimationId } = state
  
  if (!currentScene || !selectedAnimationId) return null
  
  return currentScene.animations.find((anim: AnimationNode) => anim.id === selectedAnimationId) || null
}
