<script setup lang="ts">
import { ref, computed, withDefaults, watchEffect, toRefs, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import type { CarouselItems } from './type.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import useCarousel from './useCarousel.ts'

export interface CarouselVerticalProps {
  rootClassName?: string
  prevBtnClassName?: string
  nextBtnClassName?: string
  itemClassName?: string
  dotClassName?: string
  rootStyle?: StyleValue
  prevBtnStyle?: StyleValue
  nextBtnStyle?: StyleValue
  itemStyle?: StyleValue
  dotStyle?: StyleValue
  items?: CarouselItems
  slideId?: string
  time?: number
  infinite?: boolean
  autoPlay?: boolean
  hasArrow?: boolean
  hasManualStop?: boolean
  prevButtonIcon?: string
  nextButtonIcon?: string
  mode?: 'dark' | 'light'
}

const props = withDefaults(defineProps<CarouselVerticalProps>(), {
  rootClassName: '',
  prevBtnClassName: '',
  nextBtnClassName: '',
  itemClassName: '',
  dotClassName: '',
  slideId: 'slide',
  mode: 'dark',
  time: 3000,
  hasArrow: true,
  prevButtonIcon: iconName.ANGLE_UP,
  nextButtonIcon: iconName.ANGLE_DOWN,
  items: () => []
})

let interval: any

const TRANSLATE_TYPE = 'vertical'

const { items } = toRefs(props)

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

const modeClassName = computed<string>(() => `carousel-${props.mode}`)

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
  <div :style="rootStyle" :class="['carousel', 'carousel-vertical', modeClassName, rootClassName]">
    <button
      v-if="hasArrow"
      :style="prevBtnStyle"
      :disabled="prevBtnDisabled"
      :class="['carousel-action', prevBtnClassName, prevBtnDisabledClassName]"
      @click="onPrev"
    >
      <Icon :iconName="prevButtonIcon" :size="25" />
    </button>
    <button
      v-if="hasArrow"
      :style="nextBtnStyle"
      :disabled="nextBtnDisabled"
      :class="['carousel-action', nextBtnClassName, nextBtnDisabledClassName]"
      @click="onNext"
    >
      <Icon :iconName="nextButtonIcon" :size="25" />
    </button>

    <div
      class="carousel-view"
      ref="containerRef"
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
        <slot name="content" :slide="item.comName"></slot>
      </div>
    </div>

    <div :style="dotStyle" :class="['carousel-dots', dotClassName]">
      <div
        v-for="(item, idx) in items"
        :key="item.id"
        :class="['dots-item', slidePos === idx ? 'dots-item-active' : '']"
        @click="() => jumpToSlide(idx)"
      />
    </div>
  </div>
</template>
