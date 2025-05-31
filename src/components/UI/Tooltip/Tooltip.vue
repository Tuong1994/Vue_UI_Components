<script setup lang="ts">
import { computed, withDefaults, type StyleValue, useSlots } from 'vue'
import type { ComponentPlacement } from '@/common/type'
import type { TooltipColor } from './type'

export interface TooltipProps {
  rootClassName?: string
  titleClassName?: string
  contentClassName?: string
  rootStyle?: StyleValue
  titleStyle?: StyleValue
  contentStyle?: StyleValue
  placement?: ComponentPlacement
  color?: TooltipColor
}

const props = withDefaults(defineProps<TooltipProps>(), {
  rootClassName: '',
  titleClassName: '',
  contentClassName: '',
  placement: 'bottom',
  color: 'black'
})

const emits = defineEmits(['onClick'])

const slots = useSlots()

const hasContent = computed<boolean>(() => slots.content !== undefined)

const placementClassName = computed<string>(() => `tooltip-${props.placement}`)

const colorClassName = computed<string>(() => `tooltip-${props.color}`)

const arrowColorClassName = computed<string>(() => `title-arrow-${props.color}`)

const handleClick = (e: Event) => emits('onClick', e)
</script>

<template>
  <div
    :style="rootStyle"
    :class="['tooltip', placementClassName, colorClassName, rootClassName]"
    @click="handleClick"
  >
    <div :style="titleStyle" :class="['tooltip-title', titleClassName]">
      <slot name="title"></slot>
      <span v-if="hasContent" :class="['title-arrow', arrowColorClassName]"></span>
    </div>
    <div v-if="hasContent" :style="contentStyle" :class="['tooltip-content', contentClassName]">
      <slot name="content"></slot>
    </div>
  </div>
</template>
