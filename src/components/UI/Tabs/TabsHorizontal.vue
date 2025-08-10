<script setup lang="ts">
import { ref, computed, withDefaults, defineEmits, type StyleValue } from 'vue'
import type { TabsColor, TabsItem, TabsItems } from './type.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import useLayoutStore from '../Layout/LayoutStore'

export interface TabsHorizontalProps {
  rootClassName?: string
  headClassName?: string
  contentClassName?: string
  rootStyle?: StyleValue
  headStyle?: StyleValue
  contentStyle?: StyleValue
  items: TabsItems
  color?: TabsColor
}

const props = withDefaults(defineProps<TabsHorizontalProps>(), {
  rootClassName: '',
  headClassName: '',
  contentClassName: '',
  color: 'blue',
  items: () => []
})

const emits = defineEmits(['onSelectTab'])

const layout = useLayoutStore()

const activeTab = ref({ tabId: props.items[0].id, comName: props.items[0].comName })

const colorClassName = computed<string>(() => `tabs-horizontal-${props.color}`)

const themeClassName = computed<string>(() => `tabs-horizontal-${layout.theme}`)

const handleChangeTab = (tab: TabsItem) => {
  activeTab.value = { tabId: tab.id, comName: tab.comName }
  emits('onSelectTab', tab)
}
</script>

<template>
  <div :style="rootStyle" :class="['tabs-horizontal', colorClassName, themeClassName, rootClassName]">
    <div :style="headStyle" :class="['tabs-horizontal-head', headClassName]">
      <div
        v-for="tab in items"
        :key="tab.id"
        :class="['head-item', activeTab.tabId === tab.id ? 'head-item-active' : '']"
        @click="() => handleChangeTab(tab)"
      >
        <div class="item-inner">
          <Icon
            v-if="tab.labelIcon"
            rootClassName="inner-icon"
            :type="tab.labelIcon.type"
            :iconName="tab.labelIcon.iconName"
          />
          <span>{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <div :style="contentStyle" :class="['tabs-horizontal-content', contentClassName]">
      <slot name="content" :comName="activeTab.comName"></slot>
    </div>
  </div>
</template>
