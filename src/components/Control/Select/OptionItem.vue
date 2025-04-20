<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { iconName } from '@/components/UI/Icon/constant'
import type { Option } from '@/components/Control/type'
import Icon from '@/components/UI/Icon/Icon.vue'

interface OptionItemProps {
  option: Option
  iconSize: number
  selectedOption: Option | null
}

const props = withDefaults(defineProps<OptionItemProps>(), {
  selectedOption: null
})

const emits = defineEmits(['onSelect'])

const isSelected = computed<boolean>(() => props.selectedOption?.value === props.option.value)

const selectedClassName = computed<string>(() => (isSelected.value ? 'list-item-selected' : ''))

const handleSelect = () => emits('onSelect', props.option)
</script>

<template>
  <div :class="['list-item', selectedClassName]" @click="handleSelect">
    <div class="item-label">
      <div v-if="option.icon" className="label-icon">
        <Icon :iconName="option.icon" :size="iconSize" />
      </div>
      <div>{{ option.label }}</div>
    </div>

    <Icon v-if="isSelected" :iconName="iconName.CHECK" :size="iconSize" />
  </div>
</template>
