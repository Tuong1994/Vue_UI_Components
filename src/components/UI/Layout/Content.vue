<script setup lang="ts">
import { computed, withDefaults, type StyleValue } from 'vue'
import useLayoutStore from './LayoutStore.ts'

export interface LayoutContentProps {
  rootClassName?: string
  rootStyle?: StyleValue
}

withDefaults(defineProps<LayoutContentProps>(), {
  rootClassName: ''
})

const layout = useLayoutStore()

const layoutClassName = computed<string>(() => (layout.isLayout ? 'content-layout' : ''))

const shrinkClassName = computed<string>(() => (layout.shrinked ? 'content-shrinked' : ''))

const resizeClassName = computed<string>(() => (layout.resizeContent ? 'content-resize' : ''))

const themeClassName = computed<string>(() => `content-${layout.theme}`)
</script>

<template>
  <div :style="rootStyle" :class="['content', layoutClassName, shrinkClassName, resizeClassName, themeClassName, rootClassName]">
    <slot></slot>
  </div>
</template>
