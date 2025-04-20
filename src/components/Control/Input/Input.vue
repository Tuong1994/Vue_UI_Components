<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, toRef, watchEffect, inject, type StyleValue } from 'vue'
import { useField } from 'vee-validate'
import { iconName } from '@/components/UI/Icon/constant'
import type { ComponentSize } from '@/common/type'
import type { FormRule, ControlColor, ControlShape } from '@/components/Control/type'
import Icon from '@/components/UI/Icon/Icon.vue'
import NoteMessage from '@/components/UI/NoteMessage/NoteMessage.vue'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import useLangStore from '@/stores/LangStore'

export interface InputProps {
  rootClassName?: string
  labelClassName?: string
  inputClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  inputStyle?: StyleValue
  sizes?: ComponentSize
  color?: ControlColor
  shape?: ControlShape
  modelValue?: string
  placeholder?: string
  name?: string
  disabled?: boolean
  required?: boolean
  optional?: boolean
  hasClear?: boolean
  rule?: FormRule
}

const props = withDefaults(defineProps<InputProps>(), {
  rootClassName: '',
  labelClassName: '',
  inputClassName: '',
  sizes: 'md',
  color: 'blue',
  shape: 'square',
  name: '',
  hasClear: true
})

const form = inject('form', null) as any

const name = toRef(props, 'name')

const {
  value: veeValue,
  errorMessage,
  handleBlur: veeOnBlur,
  setValue
} = useField(name, !props.disabled ? props.rule : undefined, {
  initialValue: form?.formData[name.value]
})

const slots = useSlots()

const layout = useLayoutStore()

const t = useLangStore()

const emits = defineEmits(['update:modelValue', 'onBlur'])

const inputRef = ref<HTMLInputElement | null>(null)

const controlValue = computed<string>(() => (form?.isVee ? veeValue?.value : props.modelValue))

const controlColor = computed<ControlColor>(() => (form?.isVee ? form?.formColor : props.color))

const controlSize = computed<ComponentSize>(() => (form?.isVee ? form?.formSize : props.sizes))

const controlShape = computed<ControlShape>(() => (form?.isVee ? form?.formShape : props.shape))

const controlDisabled = computed<boolean>(() => (form?.isVee ? form?.formDisabled : props.disabled))

const controlPlaceholder = computed<string>(() => props.placeholder ?? t.lang.common.form.placeholder.enter)

const hasLabel = computed<boolean>(() => slots.label !== undefined)

const hasAddonBefore = computed<boolean>(() => slots.addonBefore !== undefined)

const hasAddonAfter = computed<boolean>(() => slots.addonAfter !== undefined)

const showClearIcon = computed<boolean>(
  () => Boolean(form?.isVee ? veeValue?.value : props.modelValue) && props.hasClear
)

const showOptional = computed<boolean>(() => (props.required ? false : props.optional))

const colorClassName = computed<string>(() => `input-${controlColor.value}`)

const sizeClassName = computed<string>(() => `input-${controlSize.value}`)

const shapeClassName = computed<string>(() => `input-${controlShape.value}`)

const gapClassName = computed<string>(() => (form?.isVee ? `input-gap-${controlSize.value}` : ''))

const errorClassName = computed<string>(() => (errorMessage?.value ? 'input-error' : ''))

const disabledClassName = computed<string>(() => (controlDisabled.value ? 'input-disabled' : ''))

const themeClassName = computed<string>(() => `input-${layout.theme}`)

const iconSize = computed<number>(() => {
  if (controlSize.value === 'sm') return 12
  if (controlSize.value === 'lg') return 16
  return 14
})

const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (form?.isVee) setValue(value)
  emits('update:modelValue', value)
}

const handleBlur = (e: FocusEvent) => {
  if(form?.isVee) veeOnBlur(e)
  emits('onBlur', e)
}

const handleClearInput = () => {
  if (form?.isVee) setValue('')
  emits('update:modelValue', '')
}

watchEffect(() => {
  if (!form?.autoFocusValidation) return
  if (errorMessage?.value && inputRef.value) inputRef.value.click()
})
</script>

<template>
  <div
    :style="rootStyle"
    :class="[
      'input',
      gapClassName,
      colorClassName,
      sizeClassName,
      shapeClassName,
      errorClassName,
      themeClassName,
      rootClassName,
      disabledClassName
    ]"
  >
    <label>
      <div v-if="hasLabel" :style="labelStyle" :class="['input-label', labelClassName]">
        <span v-if="required" className="label-required">*</span>
        <slot name="label"></slot>
        <span v-if="showOptional" className="label-optional">({{ t.lang.common.form.others.optional }})</span>
      </div>

      <div ref="inputRef" class="input-group">
        <div v-if="hasAddonBefore" class="group-addon group-addon-before">
          <slot name="addonBefore"></slot>
        </div>

        <div class="group-control">
          <input
            type="text"
            :name="name"
            :value="controlValue"
            :placeholder="controlPlaceholder"
            :disabled="controlDisabled"
            :class="['control-box', inputClassName]"
            @input="handleChange"
            @blur="handleBlur"
          />

          <div v-if="showClearIcon" class="control-action" @click="handleClearInput">
            <Icon :size="iconSize" :iconName="iconName.X_MARK_CIRCLE" />
          </div>
        </div>

        <div v-if="hasAddonAfter" className="group-addon group-addon-after">
          <slot name="addonAfter"></slot>
        </div>
      </div>
    </label>

    <NoteMessage v-if="errorMessage" type="error" :message="errorMessage" />
  </div>
</template>
