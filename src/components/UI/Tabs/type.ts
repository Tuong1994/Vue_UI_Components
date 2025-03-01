import type { ComponentColor } from "@/common/type"

export type TabsType = 'horizontal' | 'vertical'

export type TabsColor = Exclude<ComponentColor, 'white' | 'gray'>

export type TabsItem = {
  id: string
  label: string
  labelIcon?: string
  comName: string
}

export type TabsItems = TabsItem[]