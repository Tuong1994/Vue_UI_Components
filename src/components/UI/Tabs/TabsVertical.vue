<script setup lang="ts">
import { ref, computed, withDefaults, defineEmits, type StyleValue } from 'vue'
import type { TabsColor, TabsItem, TabsItems } from './type.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import useLayoutStore from '../Layout/LayoutStore'

export interface TabsVerticalProps {
  rootClassName?: string
  headClassName?: string
  contentClassName?: string
  rootStyle?: StyleValue
  headStyle?: StyleValue
  contentStyle?: StyleValue
  items: TabsItems
  color?: TabsColor
}

const props = withDefaults(defineProps<TabsVerticalProps>(), {
  rootClassName: '',
  headClassName: '',
  contentClassName: '',
  color: 'blue',
  items: () => []
})

const emits = defineEmits(['onSelectTab'])

const layout = useLayoutStore()

const activeTab = ref({ tabId: props.items[0].id, comName: props.items[0].comName })

const colorClassName = computed<string>(() => `tabs-vertical-${props.color}`)

const themeClassName = computed<string>(() => `tabs-vertical-${layout.theme}`)

const handleChangeTab = (tab: TabsItem) => {
  activeTab.value = { tabId: tab.id, comName: tab.comName }
  emits('onSelectTab', tab)
}
</script>

<template>
  <div :style="rootStyle" :class="['tabs-vertical', colorClassName, themeClassName, rootClassName]">
    <div :style="headStyle" :class="['tabs-vertical-title', headClassName]">
      <div
        v-for="tab in items"
        :key="tab.id"
        :class="['title-item', activeTab.tabId === tab.id ? 'title-item-active' : '']"
        @click="() => handleChangeTab(tab)"
      >
        <Icon v-if="tab.labelIcon" rootClassName="item-icon" :iconName="tab.labelIcon" />
        <span>{{ tab.label }}</span>
      </div>
    </div>
    <div class="tabs-vertical-divider" />
    <div :style="contentStyle" :class="['tabs-vertical-content', contentClassName]">
      <slot name="content" :comName="activeTab.comName"></slot>
    </div>
  </div>
</template>
