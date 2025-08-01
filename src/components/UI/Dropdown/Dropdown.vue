<script setup lang="ts">
import { ref, computed, withDefaults, defineEmits, useSlots, type StyleValue } from 'vue'
import type { ComponentPlacement } from '@/common/type.ts'
import type { DropdownItem, DropdownItems } from './type.ts'
import { useRender, useClickOutside } from '@/hooks'
import useLayoutStore from '../Layout/LayoutStore'

type TriggerType = 'hover' | 'click'

export interface DropdownProps {
  rootClassName?: string
  labelClassName?: string
  dropdownClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  dropdownStyle?: StyleValue
  placement?: Exclude<ComponentPlacement, 'top' | 'bottom'>
  defaultSelectedId?: string;
  items?: DropdownItems
  trigger?: TriggerType
}

const props = withDefaults(defineProps<DropdownProps>(), {
  rootClassName: '',
  labelClassName: '',
  boxClassName: '',
  placement: 'left',
  trigger: 'click',
  defaultSelectedId: '',
  items: () => []
})

const emits = defineEmits(['onSelect'])

const dropdown = ref<boolean>(false)

const selectedId = ref<string>(props.defaultSelectedId)

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

const handleSelect = (item: DropdownItem) => {
  selectedId.value = item.id
  emits('onSelect', item)
}
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
    <div v-if="render" :style="dropdownStyle" :class="['dropdown-list', activeClassName, dropdownClassName]">
      <slot v-if="hasDropdownSlot" name="dropdown" :items="items"></slot>

      <template v-else>
        <div v-for="item in items" :key="item.id" :class="['list-item', selectedId === item.id ? 'list-item-selected' : '']" @click="handleSelect(item)">
          <slot name="item" :item="item.comName"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
