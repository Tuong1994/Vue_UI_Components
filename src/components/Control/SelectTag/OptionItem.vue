<script setup lang="ts">
import { ref, computed, withDefaults, toRef } from 'vue'
import { iconName } from '@/components/UI/Icon/constant'
import type { SelectOptions, Option } from '@/components/Control/type'
import Icon from '@/components/UI/Icon/Icon.vue'

interface OptionItemProps {
  option: Option
  iconSize: number
  selectedOptions: SelectOptions
}

const props = withDefaults(defineProps<OptionItemProps>(), {
  selectedOptions: () => []
})

const emits = defineEmits(['onSelect'])

const selectedOptions = toRef(props, 'selectedOptions')

const selected = ref<boolean>(false)

const isSelected = computed<boolean>(
  () => selectedOptions.value?.findIndex((op) => op.value === props.option.value) > -1
)

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
