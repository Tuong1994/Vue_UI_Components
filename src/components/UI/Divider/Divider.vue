<script setup lang="ts">
import { computed, withDefaults, type StyleValue, useSlots } from 'vue'
import type { ContentPlacement, DividerType } from './type'
import useLayoutStore from '../Layout/LayoutStore'

export interface DividerProps {
  rootClassName?: string
  rootStyle?: StyleValue
  type?: DividerType
  placement?: ContentPlacement
  plain?: boolean
}

const props = withDefaults(defineProps<DividerProps>(), {
  rootClassName: '',
  type: 'horizontal',
  placement: 'left'
})

const slots = useSlots()

const layout = useLayoutStore()

const hasContent = computed<boolean>(() => slots.default !== undefined)

const placementClassName = computed<string>(() => `divider-horizontal-${props.placement}`)

const plainClassName = computed<string>(() => (props.plain ? `divider-horizontal-plain` : ''))

const themeClassName = computed<string>(() => `divider-horizontal-${layout.theme}`)
</script>

<template>
  <div
    v-if="type === 'horizontal'"
    :style="rootStyle"
    :class="['divider-horizontal', placementClassName, plainClassName, themeClassName, rootClassName]"
  >
    <div v-if="hasContent" class="horizontal-content">
      <slot></slot>
    </div>
  </div>

  <div :style="rootStyle" :class="['divider-vertical', rootClassName]" />
</template>
