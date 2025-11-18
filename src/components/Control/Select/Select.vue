<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, toRef, watchEffect, inject, type StyleValue } from 'vue'
import { useField } from 'vee-validate'
import { useRender, useDetectBottom, useClickOutside } from '@/hooks'
import type { ComponentSize } from '@/common/type.ts'
import type {
  SelectOptions,
  Option,
  FormRule,
  ControlColor,
  ControlShape,
  ControlDropdownPlacement
} from '@/components/Control/type.ts'
import SelectControl from './SelectControl.vue'
import SelectOption from './SelectOption.vue'
import NoteMessage from '@/components/UI/NoteMessage/NoteMessage.vue'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import useLangStore from '@/stores/LangStore'

export interface SelectProps {
  rootClassName?: string
  labelClassName?: string
  inputClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  inputStyle?: StyleValue
  options?: SelectOptions
  defaultValue?: number | string | boolean
  name?: string
  placeholder?: string
  sizes?: ComponentSize
  color?: ControlColor
  shape?: ControlShape
  placement?: ControlDropdownPlacement
  async?: boolean
  loading?: boolean
  disabled?: boolean
  total?: number
  limit?: number
  required?: boolean
  optional?: boolean
  hasClear?: boolean
  hasSearch?: boolean
  rule?: FormRule
}

const props = withDefaults(defineProps<SelectProps>(), {
  rootClassName: '',
  labelClassName: '',
  inputClassName: '',
  sizes: 'md',
  color: 'blue',
  shape: 'square',
  placement: "left",
  name: '',
  async: false,
  loading: false,
  disabled: false,
  hasClear: true,
  hasSearch: true,
  total: 100,
  limit: 10,
  options: () => []
})

const emits = defineEmits(['onChangeSearch', 'onChangeSelect', 'onChangePage'])

const form = inject('form', null) as any

const name = toRef(props, 'name')

const {
  value: veeValue,
  errorMessage,
  setValue
} = useField(name, !props.disabled ? props.rule : undefined, {
  initialValue: form?.formData[name.value]
})

const slots = useSlots()

const layout = useLayoutStore()

const t = useLangStore()

const dropdown = ref<boolean>(false)

const currentPage = ref<number>(1)

const selectedOption = ref<Option | null>(null)

const search = ref<string>('')

const selectRef = ref<HTMLDivElement>()

const render = useRender(dropdown)

const bottom = useDetectBottom(selectRef)

useClickOutside(selectRef, dropdown)

const controlColor = computed<ControlColor>(() => (form?.isVee ? form?.formColor : props.color))

const controlSize = computed<ComponentSize>(() => (form?.isVee ? form?.formSize : props.sizes))

const controlShape = computed<ControlShape>(() => (form?.isVee ? form?.formShape : props.shape))

const controlDisabled = computed<boolean>(() => (form?.isVee ? form?.formDisabled : props.disabled))

const hasLabel = computed<boolean>(() => slots.label !== undefined)

const hasAddonBefore = computed<boolean>(() => slots.addonBefore !== undefined)

const hasAddonAfter = computed<boolean>(() => slots.addonAfter !== undefined)

const hasDropdownSlot = computed<boolean>(() => slots.dropdown !== undefined)

const showClearIcon = computed<boolean>(() =>
  Boolean((search.value || selectedOption.value) && !props.disabled && props.hasClear)
)

const showOptional = computed<boolean>(() => (props.required ? false : props.optional))

const totalPages = computed<number>(() => Math.ceil(props.total / props.limit))

const sizeClassName = computed<string>(() => `select-${controlSize.value}`)

const colorClassName = computed<string>(() => `select-${controlColor.value}`)

const shapeClassName = computed<string>(() => `select-${controlShape.value}`)

const placementClassName = computed<string>(() => `select-${props.placement}`)

const gapClassName = computed<string>(() => (form?.isVee ? `select-gap-${controlSize.value}` : ''))

const bottomClassName = computed<string>(() => (bottom?.value ? 'select-bottom' : ''))

const errorClassName = computed<string>(() => (errorMessage?.value ? 'select-error' : ''))

const disabledClassName = computed<string>(() => (controlDisabled.value ? 'select-disabled' : ''))

const themeClassName = computed<string>(() => `select-${layout.theme}`)

const controlPlaceholder = computed<string>(() => {
  if (props.placeholder) return props.placeholder
  if (dropdown.value && props.hasSearch) return t.lang.common.form.placeholder.search
  return t.lang.common.form.placeholder.select
})

const iconSize = computed<number>(() => {
  if (controlSize.value === 'sm') return 12
  if (controlSize.value === 'lg') return 16
  return 14
})

const renderValue = computed<string>(() => {
  if (search.value) return search.value
  if (selectedOption.value) return selectedOption.value.label
  return ''
})

const renderOptions = computed<SelectOptions>(() => {
  if (props.async) return props.options
  if (!search.value) return props.options
  return props.options.filter((option) => option.label.toLowerCase().includes(search.value.toLowerCase()))
})

const handleDropdown = () => (dropdown.value = !dropdown.value)

const handleSearch = (e: Event) => {
  if (!dropdown.value) dropdown.value = true
  const value = (e.target as HTMLInputElement).value
  search.value = value
  selectedOption.value = null
  emits('onChangeSearch', value)
}

const handleSelect = (option: Option) => {
  selectedOption.value = option
  search.value = ''
  emits('onChangeSelect', option.value)
  if (form?.isVee) setValue(option.value)
}

const handleClearInput = () => {
  if (search.value) search.value = ''
  if (selectedOption.value) selectedOption.value = null
  if (form?.isVee) setValue(null)
}

const handleChangePage = (type: 'prev' | 'next') => {
  let page = currentPage.value
  if (type === 'prev') page -= 1
  else page += 1
  currentPage.value = page
  emits('onChangePage', page)
}

// // Set default option
watchEffect(() => {
  let defaultOption: Option | null = null
  if (
    !form?.isVee &&
    props.defaultValue !== false &&
    props.defaultValue !== undefined &&
    props.defaultValue !== null
  ) {
    defaultOption = [...props.options].find((option) => option.value === props.defaultValue) as Option
  } else if (veeValue.value) {
    defaultOption = [...props.options].find((option) => option.value === veeValue.value) as Option
  }
  selectedOption.value = defaultOption
})
</script>

<template>
  <div
    ref="selectRef"
    :style="rootStyle"
    :class="[
      'select',
      gapClassName,
      sizeClassName,
      colorClassName,
      shapeClassName,
      placementClassName,
      bottomClassName,
      errorClassName,
      themeClassName,
      rootClassName,
      disabledClassName
    ]"
  >
    <label v-if="hasLabel" :style="labelStyle" :class="['select-label', labelClassName]">
      <span v-if="required" className="label-required">*</span>
      <slot name="label"></slot>
      <span v-if="showOptional" className="label-optional">(Optional)</span>
    </label>

    <div class="select-wrap">
      <SelectControl
        :inputClassName="inputClassName"
        :inputStyle="inputStyle"
        :placeholder="controlPlaceholder"
        :iconSize="iconSize"
        :dropdown="dropdown"
        :disabled="controlDisabled"
        :loading="loading"
        :readonly="!hasSearch"
        :showClearIcon="showClearIcon"
        :hasAddonBefore="hasAddonBefore"
        :hasAddonAfter="hasAddonAfter"
        :renderValue="renderValue"
        :errorMessage="errorMessage"
        :autoFocusValidation="form?.autoFocusValidation"
        @onDropdown="handleDropdown"
        @onSearch="handleSearch"
        @onClearInput="handleClearInput"
      >
        <template #addonBefore>
          <slot name="addonBefore"></slot>
        </template>
        <template #addonAfter>
          <slot name="addonAfter"></slot>
        </template>
      </SelectControl>

      <SelectOption
        v-if="render"
        :async="async"
        :dropdown="dropdown"
        :loading="loading"
        :options="renderOptions"
        :selectedOption="selectedOption"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :iconSize="iconSize"
        :hasDropdownSlot="hasDropdownSlot"
        @onDropdown="handleDropdown"
        @onSelect="handleSelect"
        @onChangePage="handleChangePage"
      >
        <template #dropdown="dropdown">
          <slot name="dropdown" :data="dropdown"></slot>
        </template>
      </SelectOption>
    </div>

    <NoteMessage v-if="errorMessage" type="error" :message="errorMessage" />
  </div>
</template>
