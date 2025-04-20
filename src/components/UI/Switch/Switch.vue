<script setup lang="ts">
import { computed, withDefaults, type StyleValue } from 'vue'
import type { ComponentSize } from '@/common/type.ts'
import type { SwitchColor } from './type'

export interface SwitchProps {
  rootClassName?: string
  rootStyle?: StyleValue
  color?: SwitchColor
  sizes?: ComponentSize
}

const props = withDefaults(defineProps<SwitchProps>(), {
  rootClassName: '',
  color: 'blue',
  sizes: 'md'
})

const emits = defineEmits(['onSwitch'])

const colorClassName = computed<string>(() => `switch-${props.color}`)

const sizeClassName = computed<string>(() => `switch-${props.sizes}`)

const handleSwitch = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  emits('onSwitch', checked)
}
</script>

<template>
  <input
    type="checkbox"
    :style="rootStyle"
    :class="['switch', colorClassName, sizeClassName, rootClassName]"
    @input="handleSwitch"
  />
</template>
