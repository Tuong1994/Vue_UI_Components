<script setup lang="ts">
import { withDefaults, computed, type StyleValue, inject } from 'vue'
import Icon from '@/components/UI/Icon/Icon.vue'

export interface ListItemProps {
  rootClassName?: string
  contentClassName?: string
  rootStyle?: StyleValue
  contentStyle?: StyleValue
  icon?: string
}

const props = withDefaults(defineProps<ListItemProps>(), {
  rootClassName: '',
  contentClassName: ''
})

const list = inject('list', null) as any

const iconName = computed<string>(() => (props.icon ? props.icon : list.icon))
</script>

<template>
  <li :style="rootStyle" :class="['list-item', rootClassName]">
    <div class="item-icon">
      <Icon :iconName="iconName" />
    </div>
    <div :style="contentStyle" :class="['item-content', contentClassName]">
      <slot></slot>
    </div>
  </li>
</template>
