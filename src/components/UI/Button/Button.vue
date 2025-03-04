<script setup lang="ts">
import { computed, withDefaults, inject } from 'vue'
import type { ControlShape } from '@/components/Control/type.ts'
import type { ComponentColor, ComponentSize } from '@/common/type'
import type { ButtonColor, ButtonType } from './type'
import Spinner from '@/components/UI/Loading/Spinner.vue'
import useLayoutStore from '../Layout/LayoutStore'

export interface ButtonProps {
  rootClassName?: string
  shape?: ControlShape
  sizes?: ComponentSize
  color?: ButtonColor
  ghost?: boolean
  loading?: boolean
  disabled?: boolean
  text?: boolean
  type?: ButtonType
}

const props = withDefaults(defineProps<ButtonProps>(), {
  rootClassName: '',
  shape: 'square',
  sizes: 'md',
  type: 'button'
})

const form = inject('form', null) as any

const layout = useLayoutStore()

const buttonShape = computed<ControlShape>(() => (props.shape ? props.shape : form?.formShape))

const buttonSize = computed<ComponentSize>(() => (props.sizes ? props.sizes : form?.formSize))

const buttonColor = computed<ComponentColor>(() => (props.color ? props.color : form?.formColor))

const buttonDisabled = computed<boolean>(() => (form?.formDisabled ? form?.formDisabled : props.disabled))

const isLoading = computed<boolean>(() => props.loading && !props.text)

const sizeClassName = computed<string>(() => `button-${buttonSize.value}`)

const shapeClassName = computed<string>(() => `button-${buttonShape.value}`)

const textClassName = computed<string>(() => (props.text ? 'button-text' : ''))

const loadingClassName = computed<string>(() => (isLoading.value ? 'button-loading' : ''))

const disabledClassName = computed<string>(() => (buttonDisabled.value ? 'button-disabled' : ''))

const themeClassName = computed<string>(() => `button-${layout.theme}`)

const colorClassName = computed<string>(() => {
  if (props.text) return ''
  if (!props.ghost && !buttonColor.value) return ''
  if (props.ghost && !buttonColor.value) return 'button-ghost'
  if (!props.ghost && buttonColor.value) return `button-color button-${buttonColor.value}`
  if (props.ghost && buttonColor.value) return `button-ghost button-ghost-${buttonColor.value}`
  return ''
})
</script>

<template>
  <button
    :type="type"
    :disabled="buttonDisabled"
    :class="[
      'button',
      shapeClassName,
      sizeClassName,
      colorClassName,
      loadingClassName,
      textClassName,
      themeClassName,
      disabledClassName,
      rootClassName
    ]"
  >
    <span v-if="isLoading" class="button-loading-icon"><Spinner /></span>
    <span><slot></slot></span>
  </button>
</template>
