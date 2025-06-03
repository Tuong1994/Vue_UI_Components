<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, watch, toRef, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import type { AccordionType } from './type'
import Icon from '@/components/UI/Icon/Icon.vue'
import useLayoutStore from '../Layout/LayoutStore'
import utils from '@/utils'

export interface AccordionProps {
  rootClassName?: string
  labelClassName?: string
  contentClassName?: string
  rootStyle?: StyleValue
  labelStyle?: StyleValue
  contentStyle?: StyleValue
  label?: string
  labelIcon?: string
  extraIcon?: string
  contentId?: string
  type?: AccordionType
  bordered?: boolean
  showLabelIcon?: boolean
  isCollapsed?: boolean
}

const props = withDefaults(defineProps<AccordionProps>(), {
  rootClassName: '',
  labelClassName: '',
  contentClassName: '',
  label: 'Accordion',
  type: 'default',
  labelIcon: iconName.ANGLE_DOWN,
  bordered: true,
  showLabelIcon: true,
  isCollapsed: false
})

const emits = defineEmits(['onCollapse', 'onSelect'])

const isCollapsed = toRef(props, 'isCollapsed')

const slots = useSlots()

const layout = useLayoutStore()

const collapse = ref<boolean>(false)

const contentId = ref<string>(props.contentId ? props.contentId : utils.uuid())

const hasExtraLabel = computed<boolean>(() => slots.extraLabel !== undefined)

const hasContent = computed<boolean>(() => slots.default !== undefined)

const collapsed = computed<boolean>(() => (props.type === 'default' ? collapse.value : isCollapsed.value))

const borderedClassName = computed<string>(() => (props.bordered ? 'accordion-bordered' : ''))

const collapsedClassName = computed<string>(() => (collapsed.value ? 'accordion-collapsed' : ''))

const themeClassName = computed<string>(() => `accordion-${layout.theme}`)

const handleCollapse = () => {
  if (props.type !== 'default') return
  const el = document.getElementById(contentId.value)
  if (!el) return
  if (el.style.maxHeight) el.style.maxHeight = ''
  else el.style.maxHeight = `${el.scrollHeight}px`
  collapse.value = !collapse.value
}

const handleSelect = () => emits('onSelect')

watch(collapse, (newValue) => emits('onCollapse', newValue))

watch(isCollapsed, (newValue) => {
  const el = document.getElementById(contentId.value)
  if (!el) return
  if (!newValue) el.style.maxHeight = ''
  else el.style.maxHeight = `${el.scrollHeight}px`
})
</script>

<template>
  <div
    :style="rootStyle"
    :class="['accordion', borderedClassName, collapsedClassName, themeClassName, rootClassName]"
    @click="handleSelect"
  >
    <div :style="labelStyle" :class="['accordion-label', labelClassName]" @click="handleCollapse">
      <div class="label-title">
        <Icon v-if="!hasExtraLabel && showLabelIcon" :iconName="labelIcon" rootClassName="title-icon" />
        <div v-if="hasExtraLabel">
          <slot name="extraLabel"></slot>
        </div>
        <span>{{ label }}</span>
      </div>
      <Icon v-if="extraIcon" :iconName="extraIcon" />
    </div>

    <div :id="contentId" :style="contentStyle" :class="['accordion-content', contentClassName]">
      <div v-if="hasContent" class="content-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
