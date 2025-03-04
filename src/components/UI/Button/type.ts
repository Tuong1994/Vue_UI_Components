import type { ComponentColor } from "@/common/type"

export type ButtonType = 'submit' | 'button' | 'reset'

export type ButtonColor = Exclude<ComponentColor, 'white' | 'gray'>