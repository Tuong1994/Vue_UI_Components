<script setup lang="ts">
import { withDefaults, defineEmits, type StyleValue } from 'vue'
import type { TabsColor, TabsItem, TabsItems, TabsType } from './type.ts'
import TabsHorizontal from './TabsHorizontal.vue'
import TabsVertical from './TabsVertical.vue'

export interface TabsProps {
  rootClassName?: string
  headClassName?: string
  contentClassName?: string
  rootStyle?: StyleValue
  headStyle?: StyleValue
  contentStyle?: StyleValue
  type?: TabsType
  items: TabsItems
  color?: TabsColor
}

const props = withDefaults(defineProps<TabsProps>(), {
  rootClassName: '',
  headClassName: '',
  contentClassName: '',
  color: 'blue',
  type: 'horizontal',
  items: () => []
})

const emits = defineEmits(['onSelectTab'])

const handleSelectTab = (tab: TabsItem) => emits('onSelectTab', tab)
</script>

<template>
  <TabsHorizontal v-if="type === 'horizontal'" v-bind="props" @onSelectTab="handleSelectTab">
    <template #content="comName">
      <slot name="content" :content="comName"></slot>
    </template>
  </TabsHorizontal>
  <TabsVertical v-if="type === 'vertical'" v-bind="props" @onSelectTab="handleSelectTab">
    <template #content="comName">
      <slot name="content" :content="comName"></slot>
    </template>
  </TabsVertical>
</template>
