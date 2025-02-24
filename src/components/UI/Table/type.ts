import type { ComponentColor } from "@/common/type"

type TableComponent = {
  node: any
  slotContent?: any
  props?: any
}

export type TableRowKey = string | number

export type TableColumn<Record = unknown> = {
  id: string
  title: string
  dataIndex: keyof Record
  component?: (record: Record, idx: number) => TableComponent
  render?: (record: Record, idx: number) => string
}

export type TableColumns<Record = unknown> = TableColumn<Record>[]

export type TableExpand = {
  node: any
  props?: any
}

export type TableColor = Exclude<ComponentColor, "white" | "gray">;