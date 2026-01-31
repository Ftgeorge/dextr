import { AnimationNode, AnimationPreset, AnimationConfig } from './workbench-store'

// Animation output types
export interface FramerMotionAnimation {
  initial?: any
  animate?: any
  whileHover?: any
  whileTap?: any
  transition?: any
  variants?: any
}

export interface CSSAnimation {
  keyframes: string
  duration: string
  easing: string
  delay: string
  fillMode: string
}

export interface ReactNativeAnimation {
  type: string
  config: Record<string, unknown>
}

export interface AnimationOutput {
  framerMotion: FramerMotionAnimation
  css: CSSAnimation
  reactNative: ReactNativeAnimation
}

export class AnimationRuntime {
  // Convert animation preset to different framework outputs
  static generateAnimationCode(animation: AnimationNode): AnimationOutput {
    const { preset, config, trigger } = animation
    
    switch (preset.type) {
      case 'fade':
        return this.generateFadeAnimation(config, trigger)
      case 'slide':
        return this.generateSlideAnimation(config, trigger)
      case 'scale':
        return this.generateScaleAnimation(config, trigger)
      case 'rotate':
        return this.generateRotateAnimation(config, trigger)
      case 'stagger':
        return this.generateStaggerAnimation(config, trigger)
      case 'bounce':
        return this.generateBounceAnimation(config, trigger)
      case 'spring':
        return this.generateSpringAnimation(config, trigger)
      default:
        return this.generateDefaultAnimation(config, trigger)
    }
  }

  private static generateFadeAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    const duration = config.duration || 0.3
    const easing = config.easing || 'ease-out'
    const delay = config.delay || 0

    return {
      framerMotion: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration, delay, ease: "easeOut" }
      },
      css: {
        keyframes: `
          from { opacity: 0; }
          to { opacity: 1; }
        `,
        duration: `${duration}s`,
        easing: easing,
        delay: `${delay}s`,
        fillMode: 'both'
      },
      reactNative: {
        type: 'opacity',
        config: {
          duration: duration * 1000,
          delay: delay * 1000,
          useNativeDriver: true
        }
      }
    }
  }

  private static generateSlideAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    const duration = config.duration || 0.4
    const easing = config.easing || 'ease-out'
    const delay = config.delay || 0

    return {
      framerMotion: {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration, delay, ease: "easeOut" }
      },
      css: {
        keyframes: `
          from { 
            transform: translateY(20px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        `,
        duration: `${duration}s`,
        easing: easing,
        delay: `${delay}s`,
        fillMode: 'both'
      },
      reactNative: {
        type: 'translateY',
        config: {
          duration: duration * 1000,
          delay: delay * 1000,
          useNativeDriver: true
        }
      }
    }
  }

  private static generateScaleAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    const duration = config.duration || 0.2
    const easing = config.easing || 'ease-out'
    const delay = config.delay || 0

    if (trigger === 'hover') {
      return {
        framerMotion: {
          whileHover: { scale: 1.05, y: -2 },
          transition: { duration: duration * 0.5, ease: "easeOut" }
        },
        css: {
          keyframes: `
            to { 
              transform: scale(1.05) translateY(-2px);
            }
          `,
          duration: `${duration * 0.5}s`,
          easing: easing,
          delay: `${delay}s`,
          fillMode: 'both'
        },
        reactNative: {
          type: 'scale',
          config: {
            duration: duration * 500,
            delay: delay * 1000,
            useNativeDriver: true
          }
        }
      }
    }

    return {
      framerMotion: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration, delay, ease: "easeOut" }
      },
      css: {
        keyframes: `
          from { 
            transform: scale(0.9);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        `,
        duration: `${duration}s`,
        easing: easing,
        delay: `${delay}s`,
        fillMode: 'both'
      },
      reactNative: {
        type: 'scale',
        config: {
          duration: duration * 1000,
          delay: delay * 1000,
          useNativeDriver: true
        }
      }
    }
  }

  private static generateRotateAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    const duration = config.duration || 0.3
    const easing = config.easing || 'ease-out'
    const delay = config.delay || 0

    return {
      framerMotion: {
        initial: { rotate: -5 },
        animate: { rotate: 0 },
        transition: { duration, delay, ease: easing }
      },
      css: {
        keyframes: `
          from { transform: rotate(-5deg); }
          to { transform: rotate(0deg); }
        `,
        duration: `${duration}s`,
        easing: easing,
        delay: `${delay}s`,
        fillMode: 'both'
      },
      reactNative: {
        type: 'rotate',
        config: {
          duration: duration * 1000,
          delay: delay * 1000,
          useNativeDriver: true
        }
      }
    }
  }

  private static generateStaggerAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    const duration = config.duration || 0.3
    const easing = config.easing || 'ease-out'
    const delay = config.delay || 0

    return {
      framerMotion: {
        variants: {
          container: {
            animate: {
              transition: {
                staggerChildren: delay || 0.1
              }
            }
          },
          item: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration, ease: easing }
          }
        }
      },
      css: {
        keyframes: `
          from { 
            transform: translateY(20px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        `,
        duration: `${duration}s`,
        easing: easing,
        delay: `${delay}s`,
        fillMode: 'both'
      },
      reactNative: {
        type: 'stagger',
        config: {
          duration: duration * 1000,
          delay: delay * 1000,
          staggerDelay: (delay || 0.1) * 1000,
          useNativeDriver: true
        }
      }
    }
  }

  private static generateBounceAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    const duration = config.duration || 0.6
    const easing = config.easing || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    const delay = config.delay || 0

    return {
      framerMotion: {
        initial: { scale: 0.3, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { 
          duration, 
          delay, 
          ease: [0.68, -0.55, 0.265, 1.55] 
        }
      },
      css: {
        keyframes: `
          0% { 
            transform: scale(0.3);
            opacity: 0;
          }
          50% { 
            transform: scale(1.05);
          }
          70% { 
            transform: scale(0.9);
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        `,
        duration: `${duration}s`,
        easing: easing,
        delay: `${delay}s`,
        fillMode: 'both'
      },
      reactNative: {
        type: 'bounce',
        config: {
          duration: duration * 1000,
          delay: delay * 1000,
          useNativeDriver: true
        }
      }
    }
  }

  private static generateSpringAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    const duration = config.duration || 0.5
    const delay = config.delay || 0

    return {
      framerMotion: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { 
          type: 'spring',
          duration,
          delay,
          stiffness: 100,
          damping: 10
        }
      },
      css: {
        keyframes: `
          0% { 
            transform: scale(0.8);
            opacity: 0;
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        `,
        duration: `${duration}s`,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        delay: `${delay}s`,
        fillMode: 'both'
      },
      reactNative: {
        type: 'spring',
        config: {
          duration: duration * 1000,
          delay: delay * 1000,
          useNativeDriver: true,
          tension: 100,
          friction: 10
        }
      }
    }
  }

  private static generateDefaultAnimation(config: AnimationConfig, trigger: string): AnimationOutput {
    return this.generateFadeAnimation(config, trigger)
  }

  // Generate complete animation code for a component
  static generateComponentAnimationCode(
    componentId: string,
    animations: AnimationNode[],
    framework: 'framer-motion' | 'css' | 'react-native' = 'framer-motion'
  ): string {
    const relevantAnimations = animations.filter(anim => anim.targetComponentId === componentId)
    
    if (relevantAnimations.length === 0) {
      return ''
    }

    const animationCodes = relevantAnimations.map(anim => {
      const output = this.generateAnimationCode(anim)
      
      switch (framework) {
        case 'framer-motion':
          return this.generateFramerMotionCode(anim, output.framerMotion)
        case 'css':
          return this.generateCSSCode(anim, output.css)
        case 'react-native':
          return this.generateReactNativeCode(anim, output.reactNative)
        default:
          return ''
      }
    })

    return animationCodes.join('\n\n')
  }

  private static generateFramerMotionCode(animation: AnimationNode, motionConfig: FramerMotionAnimation): string {
    const { trigger } = animation
    
    let code = '// Framer Motion Animation\n'
    
    if (trigger === 'mount') {
      code += `const motionProps = {\n`
      if (motionConfig.initial) code += `  initial: ${JSON.stringify(motionConfig.initial)},\n`
      if (motionConfig.animate) code += `  animate: ${JSON.stringify(motionConfig.animate)},\n`
      if (motionConfig.transition) code += `  transition: ${JSON.stringify(motionConfig.transition)},\n`
      code += `}\n`
    } else if (trigger === 'hover') {
      code += `const motionProps = {\n`
      if (motionConfig.whileHover) code += `  whileHover: ${JSON.stringify(motionConfig.whileHover)},\n`
      if (motionConfig.transition) code += `  transition: ${JSON.stringify(motionConfig.transition)},\n`
      code += `}\n`
    }

    return code
  }

  private static generateCSSCode(animation: AnimationNode, cssConfig: CSSAnimation): string {
    const { trigger } = animation
    
    let code = '/* CSS Animation */\n'
    
    if (trigger === 'mount') {
      code += `.component-${animation.targetComponentId} {\n`
      code += `  animation: ${animation.preset.name} ${cssConfig.duration} ${cssConfig.easing} ${cssConfig.delay} ${cssConfig.fillMode};\n`
      code += `}\n\n`
      
      code += `@keyframes ${animation.preset.name} {\n`
      code += cssConfig.keyframes.replace(/^\s+/, '').replace(/\n/g, '\n  ')
      code += '\n}\n'
    }

    return code
  }

  private static generateReactNativeCode(animation: AnimationNode, rnConfig: ReactNativeAnimation): string {
    const { trigger } = animation
    
    let code = '// React Native Animation\n'
    
    if (trigger === 'mount') {
      code += `import { Animated } from 'react-native';\n\n`
      code += `const animatedValue = new Animated.Value(0);\n\n`
      code += `Animated.${rnConfig.type}(animatedValue, {\n`
      Object.entries(rnConfig.config).forEach(([key, value]) => {
        code += `  ${key}: ${JSON.stringify(value)},\n`
      })
      code += `}).start();\n`
    }

    return code
  }
}
