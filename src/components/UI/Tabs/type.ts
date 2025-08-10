import type { ComponentColor } from '@/common/type'

export type TabsType = 'horizontal' | 'vertical'

export type TabsColor = Exclude<ComponentColor, 'white' | 'gray'>

type TabsLabelIcon = {
  type?: string
  iconName: string
}

export type TabsItem = {
  id: string
  label: string
  labelIcon?: TabsLabelIcon
  comName: string
}

export type TabsItems = TabsItem[]
