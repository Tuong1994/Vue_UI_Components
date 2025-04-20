<script setup lang="ts">
import { computed, withDefaults, type StyleValue } from 'vue'
import type { BadgeColor, BadgeShape } from './type'
import useLayoutStore from '../Layout/LayoutStore'

export interface BadgeProps {
  rootClassName?: string
  rootStyle?: StyleValue
  color?: BadgeColor
  shape?: BadgeShape
  ghost?: boolean
}

const props = withDefaults(defineProps<BadgeProps>(), {
  rootClassName: '',
  shape: 'round'
})

const layout = useLayoutStore()

const shapeClassName = computed<string>(() => `badge-${props.shape}`)

const themeClassName = computed<string>(() => `badge-${layout.theme}`)

const colorClassName = computed<string>(() => {
  if (!props.ghost && !props.color) return ''
  if (props.ghost && !props.color) return 'badge-ghost'
  if (!props.ghost && props.color) return `badge-color badge-${props.color}`
  if (props.ghost && props.color) return `badge-ghost badge-ghost-${props.color}`
  return ''
})
</script>

<template>
  <div :style="rootStyle" :class="['badge', colorClassName, shapeClassName, themeClassName, rootClassName]">
    <slot></slot>
  </div>
</template>
