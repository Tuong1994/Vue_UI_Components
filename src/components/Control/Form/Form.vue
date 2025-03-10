<script setup lang="ts" generic="M extends object">
import { withDefaults, watchEffect, toRef, provide, reactive } from 'vue'
import { useForm } from 'vee-validate'
import type { ComponentSize } from '@/common/type'
import type { ControlColor, ControlShape } from '@/components/Control/type'
import type { FormStore } from './type'

export interface FormProps<M> {
  initialValues: M
  disabled?: boolean
  autoFocusValidation?: boolean
  color?: ControlColor
  sizes?: ComponentSize
  shape?: ControlShape
}

const props = withDefaults(defineProps<FormProps<M>>(), {
  color: 'blue',
  sizes: 'md',
  shape: 'square',
  autoFocusValidation: true
})

const emits = defineEmits(['onFinish'])

const formStore = reactive<FormStore>({
  isVee: false,
  autoFocusValidation: props.autoFocusValidation ?? false,
  formData: props.initialValues ?? {},
  formColor: props.color ?? 'blue',
  formSize: props.sizes ?? 'md',
  formShape: props.shape ?? 'square',
  formDisabled: props.disabled ?? false,
  formActive() {
    formStore.isVee = true
  },
  bindData(data: any) {
    formStore.formData = data
  },
  changeSize(size: ComponentSize) {
    formStore.formSize = size
  },
  changeColor(color: ControlColor) {
    formStore.formColor = color
  },
  changeShape(shape: ControlShape) {
    formStore.formShape = shape
  },
  disabledForm(disabled: boolean) {
    formStore.formDisabled = disabled
  },
  disabledAutoFocus(autoFocused: boolean) {
    formStore.autoFocusValidation = autoFocused
  }
})

const initialValues = toRef(props, 'initialValues')

const { handleSubmit } = useForm<M>({ initialValues: initialValues.value })

const onSubmit = handleSubmit((data) => emits('onFinish', data))

provide('form', formStore)

watchEffect(() => {
  formStore.formActive()
  formStore.bindData(props.initialValues)
  formStore.changeColor(props.color)
  formStore.changeSize(props.sizes)
  formStore.changeShape(props.shape)
  formStore.disabledForm(props.disabled)
  formStore.disabledAutoFocus(props.autoFocusValidation)
})
</script>

<template>
  <form @submit="onSubmit">
    <slot></slot>
  </form>
</template>
