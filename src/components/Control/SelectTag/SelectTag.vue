<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, toRefs, watchEffect, inject, type StyleValue } from 'vue'
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
import SelectTagControl from './SelectTagControl.vue'
import SelectTagOption from './SelectTagOption.vue'
import NoteMessage from '@/components/UI/NoteMessage/NoteMessage.vue'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import useLangStore from '@/stores/LangStore'

export interface SelectTagProps {
  rootClassName?: string
  labelClassName?: string
  inputClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  inputStyle?: StyleValue
  options?: SelectOptions
  defaultTags?: any[]
  name?: string
  placeholder?: string
  sizes?: ComponentSize
  color?: ControlColor
  shape?: ControlShape
  placement?: ControlDropdownPlacement;
  async?: boolean
  loading?: boolean
  disabled?: boolean
  required?: boolean
  optional?: boolean
  hasClear?: boolean
  hasSearch?: boolean
  total?: number
  limit?: number
  rule?: FormRule
}

const props = withDefaults(defineProps<SelectTagProps>(), {
  rootClassName: '',
  labelClassName: '',
  inputClassName: '',
  sizes: 'md',
  color: 'blue',
  shape: 'square',
  placement: 'left',
  name: '',
  async: false,
  loading: false,
  disabled: false,
  hasClear: true,
  hasSearch: true,
  total: 100,
  limit: 10,
  options: () => [],
  defautTags: () => []
})

const emits = defineEmits(['onChangeSearch', 'onChangeSelect', 'onChangePage'])

const form = inject('form', null) as any

const { name, defaultTags } = toRefs(props)

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

const selectedOptions = ref<SelectOptions>([])

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

const showClearIcon = computed<boolean>(() => Boolean(search.value && !props.disabled && props.hasClear))

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
  emits('onChangeSearch', value)
}

const handleSelect = (option: Option) => {
  let selectedItems = [...selectedOptions.value]

  const idx = selectedItems.findIndex((item) => item.value === option.value)
  if (idx === -1) selectedItems = [...selectedItems, option]
  else selectedItems = selectedItems.filter((item) => item.value !== option.value)

  selectedOptions.value = selectedItems
  search.value = ''

  const tags = [...selectedItems].map((option) => option?.value)

  emits('onChangeSelect', tags)
  if (form?.isVee) setValue(tags)
}

const handleClearInput = () => {
  if (search.value) search.value = ''
}

const handleChangePage = (type: 'prev' | 'next') => {
  let page = currentPage.value
  if (type === 'prev') page -= 1
  else page += 1
  currentPage.value = page
  emits('onChangePage', page)
}

const getDefaultOptions = (tags: any[]) => {
  return [...props.options].filter((option) => {
    if (tags.includes(option.value)) return option
  }) as SelectOptions
}

// // Set default option
watchEffect(() => {
  if (!form?.isVee && defaultTags && defaultTags.value)
    return (selectedOptions.value = getDefaultOptions([...defaultTags.value]))
  if (veeValue.value) selectedOptions.value = getDefaultOptions([...veeValue.value])
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
      <span v-if="showOptional" className="label-optional">({{ t.lang.common.form.others.optional }})</span>
    </label>

    <div class="select-wrap">
      <SelectTagControl
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
        :selectedOptions="selectedOptions"
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
      </SelectTagControl>

      <SelectTagOption
        v-if="render"
        :async="async"
        :dropdown="dropdown"
        :loading="loading"
        :options="renderOptions"
        :selectedOptions="selectedOptions"
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
      </SelectTagOption>
    </div>

    <NoteMessage v-if="errorMessage" type="error" :message="errorMessage" />
  </div>
</template>
