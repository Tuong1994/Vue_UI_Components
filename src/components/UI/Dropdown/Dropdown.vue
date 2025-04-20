<script setup lang="ts">
import { ref, computed, withDefaults, defineEmits, useSlots, watch, type StyleValue } from 'vue'
import { useRender, useClickOutside } from '@/hooks'
import type { DropdownContentPlacement, DropdownItems, DropdownTriggerType } from './type'
import useLayoutStore from '../Layout/LayoutStore'

export interface DropdownProps {
  rootClassName?: string
  labelClassName?: string
  boxClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  placement?: DropdownContentPlacement
  items?: DropdownItems
  trigger?: DropdownTriggerType
}

const props = withDefaults(defineProps<DropdownProps>(), {
  rootClassName: '',
  labelClassName: '',
  boxClassName: '',
  placement: 'left',
  trigger: 'click',
  items: () => []
})

const emits = defineEmits(['onDropdown'])

const dropdown = ref<boolean>(false)

const dropdownRef = ref<HTMLDivElement>()

useClickOutside(dropdownRef, dropdown)

const render = useRender(dropdown)

const layout = useLayoutStore()

const slots = useSlots()

const hasDropdownSlot = computed<boolean>(() => slots.dropdown !== undefined)

const placementClassName = computed<string>(() => `dropdown-${props.placement}`)

const activeClassName = computed<string>(() => (dropdown.value ? 'dropdown-list-active' : ''))

const themeClassName = computed<string>(() => `dropdown-${layout.theme}`)

const handleDropdown = () => (dropdown.value = !dropdown.value)

watch(dropdown, (newValue) => emits('onDropdown', newValue))
</script>

<template>
  <div
    ref="dropdownRef"
    :style="rootStyle"
    :class="['dropdown', placementClassName, themeClassName, rootClassName]"
    @mouseenter="trigger === 'hover' && handleDropdown()"
    @mouseleave="trigger === 'hover' && handleDropdown()"
  >
    <div
      :style="labelStyle"
      :class="['dropdown-label', labelClassName]"
      @click="trigger === 'click' && handleDropdown()"
    >
      <slot name="label"></slot>
    </div>
    <div v-if="render" :class="['dropdown-list', activeClassName, boxClassName]">
      <slot v-if="hasDropdownSlot" name="dropdown" :items="items"></slot>

      <template v-else>
        <div v-for="item in items" :key="item.id" class="list-item">
          <slot name="item" :item="item.comName"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
