<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRender, useClickOutside } from '@/hooks'
import { iconName } from '@/components/UI/Icon/constant'
import type { SelectOptions, Option } from '../type.ts'
import type { DateSelectType } from './type'
import Icon from '@/components/UI/Icon/Icon.vue'

interface HeaderSelectProps {
  type: DateSelectType
  options: SelectOptions
  currentOption: number | string
}

const props = defineProps<HeaderSelectProps>()

const emits = defineEmits(['onSelect'])

const dropdown = ref<boolean>(false)

const selectedOption = ref<Option | null>(null)

const selectRef = ref<HTMLDivElement>()

const render = useRender(dropdown)

useClickOutside(selectRef, dropdown)

const dropdownClassName = computed<string>(() => (dropdown.value ? 'select-dropdown-active' : ''))

watchEffect(() => {
  selectedOption.value = [...props.options].find((option) => option.value === props.currentOption) as Option
})

const handleDropdown = () => (dropdown.value = !dropdown.value)

const handleSelect = (option: Option) => {
  selectedOption.value = option
  dropdown.value = false
  emits('onSelect', option)
}
</script>

<template>
  <div ref="selectRef" class="control-select">
    <div class="select-box" @click="handleDropdown">
      <span class="box-value">{{ type === 'year' ? currentOption : selectedOption?.label }}</span>
      <Icon :iconName="iconName.ANGLE_DOWN" rootClassName="box-icon" />
    </div>

    <div v-if="render" :class="['select-dropdown', dropdownClassName]">
      <div
        v-for="(option, idx) in options"
        :key="idx"
        class="dropdown-item"
        @click="() => handleSelect(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
