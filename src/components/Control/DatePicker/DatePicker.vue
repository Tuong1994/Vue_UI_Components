<script setup lang="ts">
import { ref, computed, withDefaults, toRefs, useSlots, watchEffect, inject, type StyleValue } from 'vue'
import { useField } from 'vee-validate'
import { useRender, useClickOutside, useDetectBottom } from '@/hooks'
import type { ComponentSize } from '@/common/type'
import type { ControlColor, ControlShape, FormRule, SelectDate } from '@/components/Control/type'
import type { RangeDateValue } from './type'
import DatePickerControl from './DatePickerControl.vue'
import DatePickerCalender from './DatePickerCalendar.vue'
import NoteMessage from '@/components/UI/NoteMessage/NoteMessage.vue'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import useLangStore from '@/stores/LangStore'

export interface DatePickerProps {
  rootClassName?: string
  labelClassName?: string
  inputClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  inputStyle?: StyleValue
  disabled?: boolean
  defaultDate?: Date
  format?: string
  name?: string
  max?: RangeDateValue
  min?: RangeDateValue
  sizes?: ComponentSize
  color?: ControlColor
  shape?: ControlShape
  required?: boolean
  optional?: boolean
  hasReset?: boolean
  rule?: FormRule
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  rootClassName: '',
  labelClassName: '',
  inputClassName: '',
  name: '',
  sizes: 'md',
  color: 'blue',
  shape: 'square',
  format: 'DD/MM/YYYY',
  hasReset: true,
  defaultDate: () => new Date()
})

const emits = defineEmits(['onChangeSelect'])

const slots = useSlots()

const form = inject('form', null) as any

const { defaultDate, name } = toRefs(props)

const {
  value: veeValue,
  errorMessage,
  setValue
} = useField(name, !props.disabled ? props.rule : undefined, {
  initialValue: form?.formData[name.value]
})

const layout = useLayoutStore()

const t = useLangStore()

const selectedDate = ref<Date>(defaultDate.value)

const dropdown = ref<boolean>(false)

const datepickerRef = ref<HTMLDivElement>()

const render = useRender(dropdown)

const bottom = useDetectBottom(datepickerRef)

useClickOutside(datepickerRef, dropdown)

const controlColor = computed<ControlColor>(() => (form?.isVee ? form?.formColor : props.color))

const controlSize = computed<ComponentSize>(() => (form?.isVee ? form?.formSize : props.sizes))

const controlShape = computed<ControlShape>(() => (form?.isVee ? form?.formShape : props.shape))

const controlDisabled = computed<boolean>(() => (form?.isVee ? form?.formDisabled : props.disabled))

const hasLabel = computed<boolean>(() => slots.label !== undefined)

const hasAddonBefore = computed<boolean>(() => slots.addonBefore !== undefined)

const hasAddonAfter = computed<boolean>(() => slots.addonAfter !== undefined)

const showResetIcon = computed<boolean>(() =>
  Boolean(selectedDate.value.getDate() !== new Date().getDate() && !props.disabled && props.hasReset)
)

const showOptional = computed<boolean>(() => (props.required ? false : props.optional))

const sizeClassName = computed<string>(() => `datepicker-${controlSize.value}`)

const colorClassName = computed<string>(() => `datepicker-${controlColor.value}`)

const shapeClassName = computed<string>(() => `datepicker-${controlShape.value}`)

const gapClassName = computed<string>(() => (form?.isVee ? `datepicker-gap-${controlSize.value}` : ''))

const bottomClassName = computed<string>(() => (bottom?.value ? 'datepicker-bottom' : ''))

const disabledClassName = computed<string>(() => (controlDisabled.value ? 'datepicker-disabled' : ''))

const errorClassName = computed<string>(() => (errorMessage?.value ? 'datepicker-error' : ''))

const themeClassName = computed<string>(() => `datepicker-${layout.theme}`)

const iconSize = computed<number>(() => {
  if (controlSize.value === 'sm') return 12
  if (controlSize.value === 'lg') return 16
  return 14
})

const handleDropdown = () => {
  if (controlDisabled.value) return
  dropdown.value = !dropdown.value
}

const handleSelect = (date: SelectDate) => {
  selectedDate.value = date.fullDate
  emits('onChangeSelect', date.fullDate)
  if (form?.isVee) setValue(date.fullDate)
}

const handleResetInput = () => {
  selectedDate.value = new Date()
  if (form?.isVee) setValue(new Date())
}

// Set default value
watchEffect(() => {
  if (form?.isVee && veeValue.value) selectedDate.value = new Date(veeValue.value)
})
</script>

<template>
  <div
    ref="datepickerRef"
    :style="rootStyle"
    :class="[
      'datepicker',
      colorClassName,
      sizeClassName,
      shapeClassName,
      gapClassName,
      bottomClassName,
      errorClassName,
      themeClassName,
      rootClassName,
      disabledClassName
    ]"
  >
    <label v-if="hasLabel" :style="labelStyle" :class="['datepicker-label', labelClassName]">
      <span v-if="required" className="label-required">*</span>
      <slot name="label"></slot>
      <span v-if="showOptional" className="label-optional">({{ t.lang.common.form.others.optional }})</span>
    </label>

    <div class="datepicker-wrap">
      <DatePickerControl
        :inputClassName="inputClassName"
        :inputStyle="inputStyle"
        :selectedDate="selectedDate"
        :showResetIcon="showResetIcon"
        :hasAddonBefore="hasAddonBefore"
        :hasAddonAfter="hasAddonAfter"
        :dropdown="dropdown"
        :format="format"
        :iconSize="iconSize"
        @onDropdown="handleDropdown"
        @onResetInput="handleResetInput"
      >
        <template #addonBefore>
          <slot name="addonBefore"></slot>
        </template>
        <template #addonAfter>
          <slot name="addonAfter"></slot>
        </template>
      </DatePickerControl>

      <DatePickerCalender
        v-if="render"
        :min="min"
        :max="max"
        :dropdown="dropdown"
        :selectedDate="selectedDate"
        @onSelect="handleSelect"
      />
    </div>

    <NoteMessage v-if="errorMessage" type="error" :message="errorMessage" />
  </div>
</template>
