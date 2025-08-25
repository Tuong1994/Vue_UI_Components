import { computed, type Ref } from 'vue'

type TranslateType = 'horizontal' | 'vertical'

type Params = {
  slidePos: Ref<number>
  slideRefs: Ref<HTMLDivElement[]>
}

const useCarousel = (args: Params) => {
  const { slidePos, slideRefs } = args

  const span = computed<number>(() => 100)

  const slideItems = computed<HTMLDivElement[]>(() => (slideRefs.value ? slideRefs.value : []))

  const translateFull = (pos: number, type: TranslateType) => {
    const translate = -pos * span.value
    slideItems.value.forEach((slideItem) => {
      if (slideItem) {
        if (type === 'horizontal') slideItem.style.transform = `translateX(${translate}%)`
        else slideItem.style.transform = `translateY(${translate}%)`
      }
    })
  }

  const translatePartial = (pos: number, type: TranslateType) => {
    const currentPos = -slidePos.value * span.value
    const translate = currentPos + pos
    slideItems.value.forEach((slideItem) => {
      if (slideItem) {
        if (type === 'horizontal') slideItem.style.transform = `translateX(${translate}%)`
        else slideItem.style.transform = `translateY(${translate}%)`
      }
    })
  }

  const translateAnimation = (type: 'fast' | 'slow') => {
    for (let i = Math.max(0, slidePos.value - 2); i < Math.min(slideItems.value.length, slidePos.value + 3); i++) {
      const el = slideItems.value[i]
      if (el) {
        if (type === 'fast') el.style.transitionDuration = `0.1s`
        else el.style.transitionDuration = `0.4s`
      }
    }
  }

  return { translateFull, translatePartial, translateAnimation }
}

export default useCarousel
