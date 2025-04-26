<script setup lang="ts">
import { computed, withDefaults, useSlots, toRefs, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import type { AvatarColor, AvatarShape } from './type'
import Icon from '@/components/UI/Icon/Icon.vue'

export interface AvatarProps {
  rootClassName?: string
  rootStyle?: StyleValue
  size?: number
  dot?: boolean
  badge?: string
  letter?: string
  shape?: AvatarShape
  color?: AvatarColor
}

const props = withDefaults(defineProps<AvatarProps>(), {
  rootClassName: '',
  size: 30,
  shape: 'circle',
  color: 'blue',
  letter: '',
  badge: ''
})

const { rootStyle } = toRefs(props)

const slots = useSlots()

const hasSlot = computed<boolean>(() => slots.default !== undefined)

const contentSize = computed<number>(() => (props.size >= 30 ? props.size - 16 : props.size - 10))

const colorClassName = computed<string>(() => `avatar-color avatar-${props.color}`)

const shapeClassName = computed<string>(() => `avatar-${props.shape}`)

const badgeRadiusClassName = computed<string>(() => (props.badge.length > 1 ? 'avatar-badge-radius' : ''))

const letterContent = computed<string>(() =>
  props.letter.length > 1 ? props.letter.charAt(0) : props.letter
)

const rootInlineStyle = computed<StyleValue>(() => ({
  ...(rootStyle?.value as object),
  width: `${props.size}px`,
  height: `${props.size}px`
}))

const letterStyle = computed<StyleValue>(() => ({ fontSize: `${contentSize.value}px` }))
</script>

<template>
  <div :style="rootInlineStyle" :class="['avatar', shapeClassName, colorClassName, rootClassName]">
    <div v-if="dot" class="avatar-dot" />
    <div v-if="badge" :class="['avatar-badge', badgeRadiusClassName]">
      {{ badge }}
    </div>
    <div class="avatar-content">
      <Icon v-if="!letter && !hasSlot" :size="contentSize" :iconName="iconName.USER" />
      <span v-if="letter && !hasSlot" :style="letterStyle">{{ letterContent }}</span>
      <slot v-if="hasSlot"></slot>
    </div>
  </div>
</template>
