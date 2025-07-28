import type { ComponentSize } from '@/common/type'
import type { ControlColor, ControlShape } from '../type'

export type FormStore = {
  isVee: boolean
  autoFocusValidation: boolean
  formData: any
  formColor: ControlColor
  formSize: ComponentSize
  formShape: ControlShape
  formDisabled: boolean
  formSubmitDisabled: boolean
  formActive: () => void
  bindData: (data: any) => void
  changeSize: (size: ComponentSize) => void
  changeColor: (color: ControlColor) => void
  changeShape: (shape: ControlShape) => void
  disabledForm: (disabled: boolean) => void
  disabledSubmit: (submitDisabled: boolean) => void
  disabledAutoFocus: (autoFocused: boolean) => void
}

export type FormValueSuccess<M = unknown> = {
  success: boolean
  data: M
}

export type FormValueError = {
  success: boolean
  errors: unknown
}

export type FormResult<M = unknown> = FormValueSuccess<M> | FormValueError
