<script setup lang="ts">
import { computed, withDefaults, type StyleValue } from 'vue'
import type { ComponentSize } from '@/common/type.ts'
import type { SwitchColor } from './type'

export interface SwitchProps {
  rootClassName?: string
  rootStyle?: StyleValue
  switched?: boolean
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
  <div :class="['switch', colorClassName, sizeClassName, rootClassName]">
    <label>
      <input
        type="checkbox"
        class="switch-input"
        :style="rootStyle"
        :checked="switched"
        @input="handleSwitch"
      />
      <div className="switch-slider">
        <div className="slider-dot">
          <div className="dot-center"></div>
        </div>
      </div>
    </label>
  </div>
</template>
