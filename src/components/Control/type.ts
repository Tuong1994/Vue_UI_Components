import type { ComponentColor, ComponentPlacement, ComponentShape } from '@/common/type'
import type { RuleExpression } from 'vee-validate'

export type ControlColor = Exclude<ComponentColor, 'white' | 'gray'>

export type ControlShape = Exclude<ComponentShape, 'circle'>

export type ControlDropdownPlacement = Exclude<ComponentPlacement, 'top' | 'bottom'>

export type FormRule = RuleExpression<any>

// Select
export type Option = {
  label: string
  value: string | number | boolean
  icon?: string
  children?: Option[]
}

export type SelectOptions = Option[]

// DatePicker
export type SelectDate = {
  fullDate: Date
  date: number
  day: number
  month: number
  year: number
  type: 'main' | 'sub'
}

// Upload
export type UploadError = {
  active: boolean
  type: 'fileType' | 'fileSize' | 'fileMax'
}

export type UploadItem = {
  id: string
  file?: File
  url?: string
}

export type UploadItems = UploadItem[]
