import type { ComponentColor, ComponentShape } from '@/common/type'

export type AvatarShape = Exclude<ComponentShape, 'round'>

export type AvatarColor = Exclude<ComponentColor, 'white' | 'gray'>
