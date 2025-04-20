<script setup lang="ts">
import { computed, withDefaults, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import type { ComponentColor } from '@/common/type'
import type { SpinnerType } from './type'
import Icon from '@/components/UI/Icon/Icon.vue'

export interface SpinnerProps {
  rootClassName?: string
  color?: ComponentColor
  size?: number
  type?: SpinnerType
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  rootClassName: '',
  size: 15,
  color: 'gray',
  type: 'default'
})
const colorClassName = computed<string>(() => {
  if (props.type === 'bubble') return `spinner-bubble-${props.color}`
  return `spinner-${props.color}`
})

const dotStyle = computed<StyleValue>(() => ({ width: `${props.size}px`, height: `${props.size}px` }))
</script>

<template>
  <Icon
    v-if="type === 'default'"
    :size="size"
    :iconName="iconName.SPINNER"
    :rootClassName="['spinner', colorClassName]"
  />
  <div v-if="type === 'bubble'" :class="['spinner-bubble', colorClassName, rootClassName]">
    <div v-for="(_, idx) in [...Array(2)]" :key="idx" className="bubble-item">
      <div :style="dotStyle" className="item-dot" />
      <div :style="dotStyle" className="item-dot" />
    </div>
  </div>
</template>
