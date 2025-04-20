import type { ComponentPlacement } from "@/common/type"

export type DropdownItem = {
  id: string
  comName: string
}

export type DropdownItems = DropdownItem[]

export type DropdownTriggerType = 'hover' | 'click'

export type DropdownContentPlacement = Exclude<ComponentPlacement, 'top' | 'bottom'>