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
  formActive: () => void
  bindData: (data: any) => void
  changeSize: (size: ComponentSize) => void
  changeColor: (color: ControlColor) => void
  changeShape: (shape: ControlShape) => void
  disabledForm: (disabled: boolean) => void
  disabledAutoFocus: (autoFocused: boolean) => void
}
