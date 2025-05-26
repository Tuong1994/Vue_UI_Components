<script setup lang="ts">
import { computed, withDefaults, useSlots, watchEffect, reactive, provide type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant'
import { ListStore } from './type'

export interface ListProps {
  rootClassName?: string
  headClassName?: string
  contentClassName?: string
  rootStyle?: StyleValue
  headStyle?: StyleValue
  contentStyle?: StyleValue
  icon?: string
}

const props = withDefaults(defineProps<ListProps>(), {
  rootClassName: '',
  headClassName: '',
  contentClassName: '',
  icon: iconName.CHECK
})

const listStore = reactive<ListStore>({
  icon: iconName.CHECK,
  changeIcon(iconName) {
    listStore.icon = iconName
  }
})

const slots = useSlots()

const hasHead = computed<boolean>(() => slots.head !== undefined)

provide('list', listStore)

watchEffect(() => list.changeIcon(props.icon))
</script>

<template>
  <div :style="rootStyle" :class="['list', rootClassName]">
    <h4 v-if="hasHead" :style="headStyle" :class="['list-title', headClassName]">
      <slot name="head"></slot>
    </h4>
    <ul :style="contentStyle" :class="['list-inner', contentClassName]">
      <slot></slot>
    </ul>
  </div>
</template>
