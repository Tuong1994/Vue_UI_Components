<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, watchEffect, toRef, type StyleValue } from 'vue'
import type { SelectOptions } from '@/components/Control/type.ts'
import { iconName } from '@/components/UI/Icon/constant.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import Spinner from '@/components/UI/Loading/Spinner/Spinner.vue'
import Tags from './Tags.vue'

interface SelectTagControlProps {
  inputClassName?: string
  inputStyle?: StyleValue
  placeholder?: string
  errorMessage?: string
  iconSize: number
  autoFocusValidation?: boolean;
  showClearIcon: boolean
  dropdown: boolean
  disabled: boolean
  readonly: boolean
  loading: boolean
  hasAddonAfter: boolean
  hasAddonBefore: boolean
  renderValue: string
  selectedOptions: SelectOptions
}

const props = withDefaults(defineProps<SelectTagControlProps>(), {
  inputClassName: '',
  selectedOptions: () => []
})

const slots = useSlots()

const emits = defineEmits(['onClearInput', 'onDropdown', 'onSearch'])

const errorMessage = toRef(props, 'errorMessage')

const controlRef = ref<HTMLDivElement | null>(null)

const iconRotateClassName = computed<string>(() => (props.dropdown ? 'action-icon-rotate' : ''))

const handleDropdown = () => emits('onDropdown')

const handleSearch = (e: Event) => emits('onSearch', e)

const handleClearInput = () => emits('onClearInput')

watchEffect(() => {
  if(!props.autoFocusValidation) return
  if (errorMessage?.value && controlRef.value) controlRef.value.click()
})
</script>

<template>
  <div ref="controlRef" :style="inputStyle" :class="['wrap-group', inputClassName]" @click="handleDropdown">
    <div v-if="hasAddonBefore" class="group-addon group-addon-before">
      <slot name="addonBefore"></slot>
    </div>

    <div class="group-control">
      <Tags v-if="selectedOptions.length" :selectedOptions="selectedOptions" />

      <input
        type="text"
        class="control-box"
        :value="renderValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleSearch"
      />

      <div v-if="showClearIcon" class="control-action" @click="handleClearInput">
        <Icon :size="iconSize" :iconName="iconName.X_MARK_CIRCLE" />
      </div>

      <div className="control-action">
        <Icon
          :size="iconSize"
          :iconName="iconName.ANGLE_DOWN"
          :rootClassName="['action-icon', iconRotateClassName]"
        />
      </div>
    </div>

    <div v-if="hasAddonAfter" className="group-addon group-addon-after">
      <slot name="addonAfter"></slot>
    </div>

    <div v-if="loading" className="group-loading">
      <Spinner />
    </div>
  </div>
</template>
