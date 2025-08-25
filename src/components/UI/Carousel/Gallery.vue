<script setup lang="ts">
import { ref, computed, withDefaults, watchEffect, toRefs, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import { useRender } from '@/hooks'
import type { CarouselItems } from './type.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import Image from '@/components/UI/Image/Image.vue'
import useCarousel from './useCarousel.ts'

export interface CarouselGalleryProps {
  rootClassName?: string
  prevBtnClassName?: string
  nextBtnClassName?: string
  itemClassName?: string
  rootStyle?: StyleValue
  prevBtnStyle?: StyleValue
  nextBtnStyle?: StyleValue
  itemStyle?: StyleValue
  items?: CarouselItems
  slideId?: string
  time?: number
  open?: boolean
  infinite?: boolean
  autoPlay?: boolean
  hasManualStop?: boolean
  prevButtonIcon?: string
  nextButtonIcon?: string
  mode?: 'dark' | 'light'
}

const props = withDefaults(defineProps<CarouselGalleryProps>(), {
  rootClassName: '',
  prevBtnClassName: '',
  nextBtnClassName: '',
  itemClassName: '',
  slideId: 'slide',
  mode: 'dark',
  time: 3000,
  prevButtonIcon: iconName.ANGLE_LEFT,
  nextButtonIcon: iconName.ANGLE_RIGHT,
  items: () => []
})

let interval: any

const TRANSLATE_TYPE = 'horizontal'

const { open, items } = toRefs(props)

const emits = defineEmits(['onClose'])

const showList = ref<boolean>(false)

const containerRef = ref<HTMLDivElement | null>(null)

const slideRefs = ref<HTMLDivElement[]>([])

const isReSlide = computed<boolean>(() => props.infinite || props.autoPlay)

const {
  slidePos,
  manualStop,
  clicked,
  touched,
  handlePrevSlide,
  handleNextSlide,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseStart,
  onMouseMove,
  onMouseEnd,
  jumpToSlide
} = useCarousel({
  time: props.time,
  hasManualStop: props.hasManualStop,
  isReSlide,
  containerRef,
  slideRefs,
  translateType: TRANSLATE_TYPE
})

const render = useRender(open)

const modeClassName = computed<string>(() => `carousel-${props.mode}`)

const openClassName = computed<string>(() => (props.open ? 'carousel-gallery-active' : ''))

const listActiveClassName = computed<string>(() => (showList.value ? 'carousel-gallery-list-active' : ''))

const prevBtnDisabled = computed<boolean>(() => !isReSlide.value && slidePos.value === 0)

const nextBtnDisabled = computed<boolean>(() => !isReSlide.value && slidePos.value === props.items.length - 1)

const prevBtnDisabledClassName = computed<string>(() =>
  prevBtnDisabled.value ? 'carousel-action-disabled' : ''
)

const nextBtnDisabledClassName = computed<string>(() =>
  nextBtnDisabled.value ? 'carousel-action-disabled' : ''
)

const onPrev = () => {
  handlePrevSlide()
}

const onNext = () => {
  handleNextSlide()
}

const handleClose = () => emits('onClose')

watchEffect((onStop) => {
  if (props.autoPlay) {
    if (manualStop.value && !clicked.value && !touched.value) {
      interval = setInterval(() => handleNextSlide(), props.time)
    }
  }
  onStop(() => clearInterval(interval))
})
</script>

<template>
  <Teleport to="#portal">
    <div
      v-if="render"
      :style="rootStyle"
      :class="[
        'carousel',
        'carousel-gallery',
        openClassName,
        listActiveClassName,
        modeClassName,
        rootClassName
      ]"
    >
      <div class="gallery-view">
        <button
          :style="prevBtnStyle"
          :disabled="prevBtnDisabled"
          :class="['carousel-action', prevBtnClassName, prevBtnDisabledClassName]"
          @click="onPrev"
        >
          <Icon :iconName="prevButtonIcon" :size="25" />
        </button>
        <button
          :style="nextBtnStyle"
          :disabled="nextBtnDisabled"
          :class="['carousel-action', nextBtnClassName, nextBtnDisabledClassName]"
          @click="onNext"
        >
          <Icon :iconName="nextButtonIcon" :size="25" />
        </button>

        <div className="view-head">
          <div className="head-content">{{ slidePos + 1 }} / {{ items.length }}</div>
          <div className="head-action">
            <Icon
              :iconName="iconName.LIST"
              :size="16"
              class="action-icon"
              @click="() => (showList = !showList)"
            />
            <Icon :iconName="iconName.X_MARK" :size="16" class="action-icon" @click="handleClose" />
          </div>
        </div>

        <div
          ref="containerRef"
          class="carousel-view"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseStart"
          @mousemove="onMouseMove"
          @mouseup="onMouseEnd"
          @mouseleave="onMouseEnd"
        >
          <div
            v-for="(item, idx) in items"
            ref="slideRefs"
            :key="item.id"
            :id="`${slideId}-${idx}`"
            :style="itemStyle"
            :class="['view-item', itemClassName]"
          >
            <img :src="item.url" class="item-content" />
          </div>
        </div>
      </div>

      <div class="gallery-list">
        <Image
          v-for="(item, idx) in items"
          imgWidth="100%"
          imgHeight="100%"
          :key="item.id"
          :src="item.url"
          :rootClassName="`list-item ${slidePos === idx ? 'list-item-active' : ''}`"
          @onClick="() => jumpToSlide(idx)"
        />
      </div>
    </div>
  </Teleport>
</template>
