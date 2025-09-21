<script setup lang="ts">
import { ref, computed, withDefaults, toRefs, type StyleValue } from 'vue'
import type { ImageLazyType, ImageObjectFit, ImageSize } from './type'
import type { ControlColor } from '@/components/Control/type'
import ImageLoading from './ImageLoading.vue'
import ImageView from './ImageView.vue'

export interface ImageProps {
  rootClassName?: string
  rootStyle?: StyleValue
  size?: ImageSize
  imgWidth?: number | string
  imgHeight?: number | string
  objectFit?: ImageObjectFit
  lazyType?: ImageLazyType
  src?: string
  hasView?: boolean
  hasRemove?: boolean
  hasCheck?: boolean
  checkboxColor?: ControlColor
}

const props = withDefaults(defineProps<ImageProps>(), {
  rootClassName: '',
  objectFit: 'fill',
  lazyType: 'lazy',
  src: 'https://cdn.hswstatic.com/gif/space-smell-2.jpg',
  hasView: false,
  hasRemove: false,
  hasCheck: false
})

const emits = defineEmits(['onClick', 'onRemove', 'onCheck'])

const { src, rootStyle } = toRefs(props)

const isChecked = ref<boolean>(false)

const loading = ref<boolean>(true)

const rootCheckedClassName = computed<string>(() => (isChecked.value ? 'image-checked' : ''))

const fitClassName = computed<string>(() => `image-${props.objectFit}`)

const imageSize = computed<StyleValue>(() => {
  if (props.size) {
    if (props.size === 'sm') return { width: `100px`, height: `100px` }
    if (props.size === 'md') return { width: `200px`, height: `200px` }
    if (props.size === 'lg') return { width: `300px`, height: `300px` }
  }
  const width = typeof props.imgWidth === 'string' ? props.imgWidth : `${props.imgWidth}px`
  const height = typeof props.imgHeight === 'string' ? props.imgHeight : `${props.imgHeight}px`
  if (props.imgWidth && !props.imgHeight) return { width, height: 'auto' }
  if (props.imgHeight && !props.imgWidth) return { width: 'auto', height }
  if (props.imgWidth && props.imgHeight) return { width, height }
  return { width: 'auto', height: 'auto' }
})

const inlineStyle = computed<StyleValue>(() => ({ ...(rootStyle?.value as object), ...(imageSize.value as object) }))

const handleLoad = () => (loading.value = false)

const handleRemove = () => emits('onRemove')

const handleClick = () => emits('onClick')

const handleCheck = (checked: boolean) => {
  isChecked.value = checked
  emits('onCheck', checked)
}
</script>

<template>
  <div
    id="image"
    :style="inlineStyle"
    :class="['image', fitClassName, rootCheckedClassName, rootClassName]"
    @click="handleClick"
  >
    <ImageLoading v-if="loading" :imageSize="imageSize" />
    <ImageView
      :src="src"
      :imageSize="imageSize"
      :lazyType="lazyType"
      :isChecked="isChecked"
      :loading="loading"
      :hasView="hasView"
      :hasRemove="hasRemove"
      :hasCheck="hasCheck"
      :checkboxColor="checkboxColor"
      @onLoad="handleLoad"
      @onRemove="handleRemove"
      @onCheck="handleCheck"
    />
  </div>
</template>
