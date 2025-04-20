<script setup lang="ts">
import { computed, withDefaults, toRefs, type StyleValue } from 'vue'
import type { TitleLevel, TypoAligns, TypoVariant } from './type.ts'
import useLayoutStore from '../Layout/LayoutStore'

export interface TitleProps {
  rootClassName?: string
  rootStyle?: StyleValue
  weight?: number
  italic?: boolean
  remove?: boolean
  underline?: boolean
  level?: TitleLevel
  aligns?: TypoAligns
  variant?: TypoVariant
}

const props = withDefaults(defineProps<TitleProps>(), {
  rootClassName: '',
  weight: 500,
  aligns: 'left',
  variant: 'default',
  level: 1
})

const layout = useLayoutStore()

const propsRef = toRefs(props)

const alignsClassName = computed<string>(() => `title-${props.aligns}`)

const variantClassName = computed<string>(() => `title-${props.variant}`)

const underlineClassName = computed<string>(() => (props.underline ? 'title-underline' : ''))

const removeClassName = computed<string>(() => (props.remove ? 'title-remove' : ''))

const italicClassName = computed<string>(() => (props.italic ? 'title-italic' : ''))

const themeClassName = computed<string>(() => `title-${layout.theme}`)

const inlineStyle = computed<StyleValue>(() => ({
  ...(propsRef.rootStyle?.value as object),
  fontWeight: props.weight
}))

const commonProps = computed<any>(() => ({
  class: [
    'title',
    `title-level-${props.level}`,
    alignsClassName.value,
    variantClassName.value,
    underlineClassName.value,
    removeClassName.value,
    italicClassName.value,
    themeClassName.value,
    props.rootClassName
  ],
  style: inlineStyle.value
}))
</script>

<template>
  <h1 v-if="level === 1" v-bind="commonProps"><slot></slot></h1>
  <h2 v-if="level === 2" v-bind="commonProps"><slot></slot></h2>
  <h3 v-if="level === 3" v-bind="commonProps"><slot></slot></h3>
  <h4 v-if="level === 4" v-bind="commonProps"><slot></slot></h4>
  <h5 v-if="level === 5" v-bind="commonProps"><slot></slot></h5>
  <h6 v-if="level === 6" v-bind="commonProps"><slot></slot></h6>
</template>