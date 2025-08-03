<script setup lang="ts">
import { ref, computed, withDefaults, watchEffect, toRefs, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import type { CarouselItems } from './type.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import useCarousel from './useCarousel.ts'

export interface CarouselHorizontalProps {
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

const props = withDefaults(defineProps<CarouselHorizontalProps>(), {
  rootClassName: '',
  prevBtnClassName: '',
  nextBtnClassName: '',
  itemClassName: '',
  dotClassName: '',
  slideId: 'slide',
  mode: 'dark',
  time: 3000,
  hasArrow: true,
  prevButtonIcon: iconName.ANGLE_LEFT,
  nextButtonIcon: iconName.ANGLE_RIGHT,
  items: () => []
})

let interval: any

const TRANSLATE_TYPE = 'horizontal'

const { items } = toRefs(props)

const slidePos = ref<number>(0)

const touchStartPos = ref<number>(0)
const touchEndPos = ref<number>(0)
const touched = ref<boolean>(false)
const touchSwiped = ref<boolean>(false)

const mouseStartPos = ref<number>(0)
const mouseEndPos = ref<number>(0)
const clicked = ref<boolean>(false)
const clickSwiped = ref<boolean>(false)

const manualStop = ref<boolean>(props.time !== undefined)

const { translateFull, translatePartial, translateAnimation } = useCarousel({
  items,
  slidePos,
  slideId: props.slideId
})

const span = computed<number>(() => 100)

const modeClassName = computed<string>(() => `carousel-${props.mode}`)

const isReSlide = computed<boolean>(() => props.infinite || props.autoPlay)

const prevBtnDisabled = computed<boolean>(() => !isReSlide.value && slidePos.value === 0)

const nextBtnDisabled = computed<boolean>(() => !isReSlide.value && slidePos.value === props.items.length - 1)

const prevBtnDisabledClassName = computed<string>(() =>
  prevBtnDisabled.value ? 'carousel-action-disabled' : ''
)

const nextBtnDisabledClassName = computed<string>(() =>
  nextBtnDisabled.value ? 'carousel-action-disabled' : ''
)

const jumpToSlide = (pos: number) => {
  slidePos.value = pos
  translateFull(pos, TRANSLATE_TYPE)
}

const handleManualStop = () => {
  clearInterval(interval)
  if (props.hasManualStop) manualStop.value = false
}

const handlePrevSlide = () => {
  let newPos = slidePos.value
  if (newPos > 0) newPos--
  else if (isReSlide.value) newPos = props.items.length - 1
  translateFull(newPos, TRANSLATE_TYPE)
  slidePos.value = newPos
}

const handleNextSlide = () => {
  let newPos = slidePos.value
  if (newPos < props.items.length - 1) newPos++
  else if (isReSlide.value) newPos = 0
  translateFull(newPos, TRANSLATE_TYPE)
  slidePos.value = newPos
}

const onPrev = () => {
  handlePrevSlide()
}

const onNext = () => {
  handleNextSlide()
}

const onTouchStart = (e: TouchEvent) => {
  touchEndPos.value = e.targetTouches[0].clientX
  touchStartPos.value = e.targetTouches[0].clientX
  touched.value = true
  translateAnimation('fast')
  handleManualStop()
}

const onTouchMove = (e: TouchEvent) => {
  if (!touched.value) return
  touchEndPos.value = e.targetTouches[0].clientX
  const viewWidth = document.getElementById('carouselView')?.offsetWidth
  if (viewWidth) {
    const translate = ((touchEndPos.value - touchStartPos.value) / viewWidth) * span.value
    translatePartial(translate, TRANSLATE_TYPE)
    touchSwiped.value = true
  }
}

const onTouchEnd = () => {
  if (!touchSwiped.value) return
  if (touchEndPos.value - touchStartPos.value > 75) handlePrevSlide()
  else if (touchEndPos.value - touchStartPos.value < -75) handleNextSlide()
  else jumpToSlide(slidePos.value)
  translateAnimation('slow')
  touched.value = false
  touchSwiped.value = false
  manualStop.value = true
}

const onMouseStart = (e: MouseEvent) => {
  e.preventDefault()
  mouseEndPos.value = e.clientX
  mouseStartPos.value = e.clientX
  clicked.value = true
  translateAnimation('fast')
  handleManualStop()
}

const onMouseMove = (e: MouseEvent) => {
  e.preventDefault()
  if (!clicked.value) return
  mouseEndPos.value = e.clientX
  const viewWidth = document.getElementById('carouselView')?.offsetWidth
  if (viewWidth) {
    const translate = ((mouseEndPos.value - mouseStartPos.value) / viewWidth) * span.value
    translatePartial(translate, TRANSLATE_TYPE)
    clickSwiped.value = true
  }
}

const onMouseEnd = () => {
  if (!clickSwiped.value) return
  if (mouseEndPos.value - mouseStartPos.value > 100) handlePrevSlide()
  else if (mouseEndPos.value - mouseStartPos.value < -100) handleNextSlide()
  else jumpToSlide(slidePos.value)
  translateAnimation('slow')
  clicked.value = false
  clickSwiped.value = false
  manualStop.value = true
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
  <div :style="rootStyle" :class="['carousel', 'carousel-horizontal', modeClassName, rootClassName]">
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
      id="carouselView"
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
