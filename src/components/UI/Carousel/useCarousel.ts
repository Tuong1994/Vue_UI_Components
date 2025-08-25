import { computed, ref, type Ref } from 'vue'

type TranslateType = 'horizontal' | 'vertical'

type Params = {
  time?: number
  hasManualStop?: boolean
  isReSlide?: Ref<boolean>
  slidePos?: Ref<number>
  translateType?: TranslateType
  containerRef?: Ref<HTMLDivElement | null>
  slideRefs: Ref<HTMLDivElement[]>
}

let interval: any

const useCarousel = (args: Params) => {
  const { time, isReSlide, hasManualStop, translateType = 'horizontal', containerRef, slideRefs } = args

  const slidePos = ref<number>(0)

  const touchStartPos = ref<number>(0)
  const touchEndPos = ref<number>(0)
  const touched = ref<boolean>(false)
  const touchSwiped = ref<boolean>(false)

  const mouseStartPos = ref<number>(0)
  const mouseEndPos = ref<number>(0)
  const clicked = ref<boolean>(false)
  const clickSwiped = ref<boolean>(false)

  const manualStop = ref<boolean>(time !== undefined)

  const span = computed<number>(() => 100)

  const slideItems = computed<HTMLDivElement[]>(() => (slideRefs.value ? slideRefs.value : []))

  const isHorizontal = translateType === 'horizontal'

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
    for (
      let i = Math.max(0, slidePos.value - 2);
      i < Math.min(slideItems.value.length, slidePos.value + 3);
      i++
    ) {
      const el = slideItems.value[i]
      if (el) {
        if (type === 'fast') el.style.transitionDuration = `0.1s`
        else el.style.transitionDuration = `0.4s`
      }
    }
  }

  const jumpToSlide = (pos: number) => {
    slidePos.value = pos
    translateFull(pos, translateType)
  }

  const handleManualStop = () => {
    clearInterval(interval)
    if (hasManualStop) manualStop.value = false
  }

  const handlePrevSlide = () => {
    let newPos = slidePos.value
    if (newPos > 0) newPos--
    else if (isReSlide?.value) newPos = slideItems.value.length - 1
    translateFull(newPos, translateType)
    slidePos.value = newPos
  }

  const handleNextSlide = () => {
    let newPos = slidePos.value
    if (newPos < slideItems.value.length - 1) newPos++
    else if (isReSlide?.value) newPos = 0
    translateFull(newPos, translateType)
    slidePos.value = newPos
  }

  const onTouchStart = (e: TouchEvent) => {
    const eventTouch = isHorizontal ? e.targetTouches[0].clientX : e.targetTouches[0].clientY;
    touchEndPos.value = eventTouch
    touchStartPos.value = eventTouch
    touched.value = true
    translateAnimation('fast')
    handleManualStop()
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!touched.value) return
    if (!containerRef?.value) return
    const eventTouch = isHorizontal ? e.targetTouches[0].clientX : e.targetTouches[0].clientY;
    touchEndPos.value = eventTouch
    const viewWidth = containerRef?.value.offsetWidth
    if (viewWidth) {
      const translate = ((touchEndPos.value - touchStartPos.value) / viewWidth) * span.value
      translatePartial(translate, translateType)
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
    const eventMouse = isHorizontal ? e.clientX : e.clientY;
    mouseEndPos.value = eventMouse
    mouseStartPos.value = eventMouse
    clicked.value = true
    translateAnimation('fast')
    handleManualStop()
  }

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    if (!clicked.value) return
    if (!containerRef?.value) return
    const eventMouse = isHorizontal ? e.clientX : e.clientY;
    mouseEndPos.value = eventMouse
    const viewWidth = containerRef?.value.offsetWidth
    if (viewWidth) {
      const translate = ((mouseEndPos.value - mouseStartPos.value) / viewWidth) * span.value
      translatePartial(translate, translateType)
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

  return {
    slidePos,
    manualStop,
    touched,
    clicked,
    translateFull,
    translatePartial,
    translateAnimation,
    handleManualStop,
    handlePrevSlide,
    handleNextSlide,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseStart,
    onMouseMove,
    onMouseEnd,
    jumpToSlide,
  }
}

export default useCarousel
