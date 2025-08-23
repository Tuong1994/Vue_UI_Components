<script setup lang="ts">
import { computed, defineProps, withDefaults, type StyleValue } from 'vue'
import type { LayoutColor } from '../../Layout/type'
import type { BgFloatingShape } from '../type'
import useLayoutStore from '../../Layout/LayoutStore'

interface BgFloadingProps {
  rootClassName?: string
  rootStyle?: StyleValue
  color?: LayoutColor
  shape?: BgFloatingShape
  count?: number
  fullScreen?: boolean
}

const props = withDefaults(defineProps<BgFloadingProps>(), {
  color: 'blue',
  shape: 'square',
  count: 80,
  fullScreen: false
})

const layout = useLayoutStore()

const bgColor = props.color ? props.color : layout.color

const fixedClassName = computed<string>(() => props.fullScreen ? `bg-floating-fixed` : "")

const colorClassName = computed<string>(() => `bg-floating-${bgColor}`)

// Generate unique style for each item
const itemStyles = computed<StyleValue[]>(() => {
  return Array.from({ length: props.count }, () => {
    const size = Math.random() * 40 + 10 // 10px - 50px
    const duration = Math.random() * 15 + 10 // 10s - 25s
    return {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${duration}s`,
      animationDelay: `${Math.random() * 20}s`,
      borderRadius: props.shape === 'square' ? (Math.random() > 0.7 ? '6px' : '3px') : '50%',
    }
  })
})
</script>

<template>
  <div :class="['bg-floating', fixedClassName, colorClassName, rootClassName]">
    <div
      v-for="(style, idx) in itemStyles"
      :key="idx"
      :style="style"
      class="bg-floating-item"
    ></div>
  </div>
</template>
