<script setup lang="ts">
import { computed, withDefaults, type StyleValue, useSlots } from 'vue'
import type { ContentPlacement, DividerType } from './type'
import useLayoutStore from '../Layout/LayoutStore'

export interface DividerProps {
  rootClassName?: string
  rootStyle?: StyleValue
  type?: DividerType
  placement?: ContentPlacement
  verticalSize?: number
  plain?: boolean
  dashed?: boolean
}

const props = withDefaults(defineProps<DividerProps>(), {
  rootClassName: '',
  type: 'horizontal',
  placement: 'left',
  verticalSize: 100
})

const slots = useSlots()

const layout = useLayoutStore()

const hasContent = computed<boolean>(() => slots.default !== undefined)

const placementClassName = computed<string>(() => `divider-${props.placement}`)

const plainClassName = computed<string>(() => (props.plain ? 'divider-plain' : ''))

const dashedClassName = computed<string>(() => (props.dashed ? 'divider-dashed' : ''))

const inlineClassName = computed<string>(() => (props.type === 'vertical' ? 'divider-inline' : ''))

const themeClassName = computed<string>(() => `divider-${layout.theme}`)

const verticalStyle = computed<StyleValue>(() => ({ height: `${props.verticalSize}px` }))
</script>

<template>
  <div
    :style="rootStyle"
    :class="['divider', placementClassName, plainClassName, dashedClassName, inlineClassName, themeClassName, rootClassName]"
  >
    <div v-if="type === 'horizontal'" class="divider-horizontal">
      <div v-if="hasContent" class="horizontal-content">
        <slot></slot>
      </div>
    </div>

    <div v-if="type === 'vertical'" :style="verticalStyle" class="divider-vertical">
      <div v-if="hasContent" class="vertical-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
