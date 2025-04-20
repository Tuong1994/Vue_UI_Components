import type { ComponentSize } from '@/common/type'

export type ImageSize = ComponentSize

export type ImageObjectFit = 'fill' | 'cover' | 'contain' | 'none'

export type ImageLazyType = 'immediate' | 'lazy'

export type ImageViewerActive = {
  active: boolean
  imgUrl: string
}
