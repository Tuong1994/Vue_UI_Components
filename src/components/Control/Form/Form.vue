<script setup lang="ts" generic="M extends object">
import { withDefaults, watchEffect, toRef, provide, reactive, ref } from 'vue'
import { useForm } from 'vee-validate'
import type { ComponentSize } from '@/common/type'
import type { ControlColor, ControlShape } from '@/components/Control/type'
import type { FormStore, FormResult } from './type'

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

const emits = defineEmits<{
  (e: 'onFinish', payload: FormResult<M>): void
}>()

const submitDisabled = ref<boolean>(false)

const formStore = reactive<FormStore>({
  isVee: false,
  autoFocusValidation: props.autoFocusValidation ?? false,
  formData: props.initialValues ?? {},
  formColor: props.color ?? 'blue',
  formSize: props.sizes ?? 'md',
  formShape: props.shape ?? 'square',
  formDisabled: props.disabled ?? false,
  formSubmitDisabled: false,
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
  },
  disabledSubmit(submitDisabled: boolean) {
    formStore.formSubmitDisabled = submitDisabled
  }
})

const initialValues = toRef(props, 'initialValues')

const { handleSubmit, errors } = useForm<M>({ initialValues: initialValues.value })

const onSubmit = handleSubmit(
  (data) => {
    submitDisabled.value = false
    emits('onFinish', { success: true, data })
  },
  (errors) => {
    submitDisabled.value = true
    emits('onFinish', { success: false, errors })
  }
)

provide('form', formStore)

watchEffect(() => {
  formStore.formActive()
  formStore.bindData(props.initialValues)
  formStore.changeColor(props.color)
  formStore.changeSize(props.sizes)
  formStore.changeShape(props.shape)
  formStore.disabledForm(props.disabled)
  formStore.disabledAutoFocus(props.autoFocusValidation)
  formStore.disabledSubmit(submitDisabled.value)
})

watchEffect(() => {
  if (Object.keys(errors.value).length === 0) {
    submitDisabled.value = false
  }
})
</script>

<template>
  <form @submit="onSubmit">
    <slot></slot>
  </form>
</template>
