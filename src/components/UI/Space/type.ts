import type { ComponentAligns, ComponentJustify, ComponentSize } from "@/common/type";

export type SpaceSize = ComponentSize | number

export type SpaceJustify = Exclude<ComponentJustify, 'between' | 'around' | 'evenly'>

export type SpaceAligns = Exclude<ComponentAligns, 'baseline'>