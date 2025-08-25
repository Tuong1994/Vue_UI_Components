<script setup lang="ts">
import { ref, computed, withDefaults, watchEffect, toRefs, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import type { CarouselItems } from './type.ts'
import { useRender, useClickOutside } from '@/hooks'
import Icon from '@/components/UI/Icon/Icon.vue'
import useCarousel from './useCarousel.ts'

export interface CarouselProductProps {
  rootClassName?: string
  rootStyle?: StyleValue
  items?: CarouselItems
  slideId?: string
  time?: number
  infinite?: boolean
  autoPlay?: boolean
  hasManualStop?: boolean
  prevButtonIcon?: string
  nextButtonIcon?: string
  mode?: 'dark' | 'light'
}

const props = withDefaults(defineProps<CarouselProductProps>(), {
  rootClassName: '',
  slideId: 'slide',
  mode: 'dark',
  time: 3000,
  prevButtonIcon: iconName.ANGLE_LEFT,
  nextButtonIcon: iconName.ANGLE_RIGHT,
  items: () => []
})

let interval: any

const TRANSLATE_TYPE = 'horizontal'

const { items } = toRefs(props)

const showList = ref<boolean>(false)

const listRef = ref<HTMLDivElement>()

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
  jumpToSlide,
} = useCarousel({
  time: props.time,
  hasManualStop: props.hasManualStop,
  isReSlide,
  containerRef,
  slideRefs,
  translateType: TRANSLATE_TYPE
})

const render = useRender(showList)

useClickOutside(listRef, showList)

const modeClassName = computed<string>(() => `carousel-${props.mode}`)

const prevBtnDisabled = computed<boolean>(() => !isReSlide.value && slidePos.value === 0)

const nextBtnDisabled = computed<boolean>(() => !isReSlide.value && slidePos.value === props.items.length - 1)

const prevBtnDisabledClassName = computed<string>(() =>
  prevBtnDisabled.value ? 'carousel-action-disabled' : ''
)

const nextBtnDisabledClassName = computed<string>(() =>
  nextBtnDisabled.value ? 'carousel-action-disabled' : ''
)

const showListClassName = computed<string>(() => (showList.value ? 'responsive-list-active' : ''))

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
  <div :style="rootStyle" :class="['carousel', 'carousel-product', modeClassName, rootClassName]">
    <div class="product-list">
      <div
        v-for="(item, idx) in items"
        :key="item.id"
        :class="['list-item', slidePos === idx ? 'list-item-active' : '']"
        @click="() => jumpToSlide(idx)"
      >
        <slot name="content" :slide="item.comName"></slot>
      </div>
    </div>

    <div class="product-view">
      <button
        :disabled="prevBtnDisabled"
        :class="['carousel-action', prevBtnDisabledClassName]"
        @click="onPrev"
      >
        <Icon :iconName="prevButtonIcon" :size="25" />
      </button>
      <button
        :disabled="nextBtnDisabled"
        :class="['carousel-action', nextBtnDisabledClassName]"
        @click="onNext"
      >
        <Icon :iconName="nextButtonIcon" :size="25" />
      </button>

      <div class="view-slide">
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
            :key="item.id"
            :id="`${slideId}-${idx}`"
            ref="slideRefs"
            class="view-item"
          >
            <slot name="content" :slide="item.comName"></slot>
          </div>
        </div>
      </div>
    </div>

    <div ref="listRef" class="product-list-responsive">
      <div class="responsive-label" @click="() => (showList = !showList)">
        <Icon :iconName="iconName.LIST" />
      </div>

      <div v-if="render" :class="['responsive-list', showListClassName]">
        <div
          v-for="(item, idx) in items"
          :key="item.id"
          :class="['list-item', slidePos === idx ? 'list-item-active' : '']"
          @click="() => jumpToSlide(idx)"
        >
          <slot name="content" :slide="item.comName"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
