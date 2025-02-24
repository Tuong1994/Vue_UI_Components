<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, watchEffect, toRefs, inject, type StyleValue } from 'vue'
import { useField } from 'vee-validate'
import type { FormRule } from '@/components/Control/type.ts'
import type { ComponentSize, ComponentColor } from '@/common/type.ts'
import { iconName } from '@/components/UI/Icon/constant.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import NoteMessage from '@/components/UI/NoteMessage/NoteMessage.vue'
import useLangStore from '@/stores/LangStore'

export interface CheckBoxProps {
  rootClassName?: string
  labelClassName?: string
  controlClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  controlStyle?: StyleValue
  sizes?: ComponentSize
  color?: Exclude<ComponentColor, 'gray'>
  value?: string | number | boolean
  name?: string
  checked?: boolean
  disabled?: boolean
  required?: boolean
  optional?: boolean
  rule?: FormRule
}

const props = withDefaults(defineProps<CheckBoxProps>(), {
  rootClassName: '',
  labelClassName: '',
  controlClassName: '',
  sizes: 'md',
  color: 'blue',
  name: '',
  checked: false
})

const form = inject('form', null) as any

const { name } = toRefs(props)

const {
  value: veeValue,
  errorMessage,
  setValue,
  handleChange: veeOnChange
} = useField(name, !props.disabled ? props.rule : undefined, {
  type: 'checkbox',
  checkedValue: props.value ? props.value : true
})

const slots = useSlots()

const t = useLangStore()

const emits = defineEmits(['onCheck', 'onInput', 'onBlur'])

const isCheck = ref<boolean>(false)

const hasLabel = computed<boolean>(() => slots.default !== undefined)

const controlValue = computed<string>(() => (form?.isVee ? veeValue?.value : props.value))

const controlColor = computed<ComponentColor>(() => (form?.isVee ? form?.formColor : props.color))

const controlSize = computed<ComponentSize>(() => (form?.isVee ? form?.formSize : props.sizes))

const controlDisabled = computed<boolean>(() => (form?.isVee ? form?.formDisabled : props.disabled))

const showOptional = computed<boolean>(() => (props.required ? false : props.optional))

const sizeClassName = computed<string>(() => `checkbox-${controlSize.value}`)

const colorClassName = computed<string>(() =>
  isCheck.value ? `checkbox-checked checkbox-checked-${controlColor.value}` : `checkbox-${controlColor.value}`
)

const gapClassName = computed<string>(() => (form?.isVee ? `checkbox-gap-${controlSize.value}` : ''))

const errorClassName = computed<string>(() => (errorMessage?.value ? 'checkbox-group-error' : ''))

const disabledClassName = computed<string>(() => (controlDisabled.value ? 'checkbox-group-disabled' : ''))

const iconSize = computed<number>(() => {
  if (controlSize.value === 'sm') return 12
  if (controlSize.value === 'lg') return 16
  return 14
})

const handleChange = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  const value = (e.target as HTMLInputElement).value
  isCheck.value = checked

  if (form?.isVee) {
    if (!props.value) return setValue(checked)
    else return veeOnChange(veeValue.value)
  }

  emits('onCheck', checked)
  if (checked) emits('onInput', value)
  else emits('onInput', '')
}

const handleBlur = (e: Event) => emits('onBlur', e)

watchEffect(() => {
  if (!form?.isVee) return (isCheck.value = props.checked)

  const defaultValue = form?.formData[name.value]
  if (!defaultValue) return

  const isBoolean = typeof defaultValue === 'boolean'
  const isPrimitive = typeof defaultValue !== 'boolean' && typeof defaultValue !== 'object'
  const isArray = Array.isArray(defaultValue)

  if (isBoolean) return (isCheck.value = defaultValue)
  if (isPrimitive) return (isCheck.value = defaultValue === props.value)
  if (isArray) return (isCheck.value = [...Array.from(defaultValue)].includes(props.value))
})
</script>

<template>
  <div :style="rootStyle" :class="['checkbox', gapClassName, sizeClassName, colorClassName, rootClassName]">
    <label :class="['checkbox-group', errorClassName, disabledClassName]">
      <input
        type="checkbox"
        class="group-control"
        :checked="isCheck"
        :disabled="controlDisabled"
        :value="controlValue"
        @input="handleChange"
        @blur="handleBlur"
      />

      <div class="group-checked">
        <Icon class="checked-icon" :iconName="iconName.CHECK" :size="iconSize" />
      </div>

      <div v-if="hasLabel" class="group-label">
        <span v-if="required" className="label-required">*</span>
        <slot></slot>
        <span v-if="showOptional" className="label-optional">({{ t.lang.common.form.others.optional }})</span>
      </div>
    </label>

    <NoteMessage v-if="errorMessage" type="error" :message="errorMessage" />
  </div>
</template>
