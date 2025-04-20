<script setup lang="ts">
import { computed, withDefaults, toRefs, type StyleValue } from 'vue'
import type { SpaceAligns, SpaceJustify, SpaceSize } from './type'

export interface SpaceProps {
  rootClassName?: string
  rootStyle?: StyleValue
  justify?: SpaceJustify
  aligns?: SpaceAligns
  size?: SpaceSize
}

const props = withDefaults(defineProps<SpaceProps>(), {
  rootClassName: '',
  justify: 'start',
  aligns: 'top',
  size: 'sm'
})

const { rootStyle } = toRefs(props)

const justifyClassName = computed<string>(() => `space-${props.justify}`)

const alignClassName = computed<string>(() => `space-${props.aligns}`)

const inlineStyle = computed<StyleValue>(() => {
  const style = rootStyle?.value as object
  if (typeof props.size === 'number') return { ...style, gap: `10px ${props.size}px` }
  if (props.size === 'sm') return { ...style, gap: '10px' }
  if (props.size === 'md') return { ...style, gap: '10px 30px' }
  if (props.size === 'lg') return { ...style, gap: '10px 60px' }
  return { ...style }
})
</script>

<template>
  <div :style="inlineStyle" :class="['space', justifyClassName, alignClassName, rootClassName]">
    <slot></slot>
  </div>
</template>
