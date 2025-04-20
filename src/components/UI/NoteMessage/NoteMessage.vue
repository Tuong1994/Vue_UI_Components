<script setup lang="ts">
import { computed, withDefaults, toRefs, type StyleValue } from 'vue'
import type { ComponentSize } from '@/common/type.ts'
import type { MessageType } from './type'
import useLayoutStore from '../Layout/LayoutStore'

export interface NoteMessageProps {
  rootClassName?: string
  rootStyle?: StyleValue
  size?: ComponentSize
  type?: MessageType
  weight?: number
  italic?: boolean
  message?: string
}

const props = withDefaults(defineProps<NoteMessageProps>(), {
  rootClassName: '',
  weight: 400,
  size: 'md',
  type: 'default',
  message: 'Note message'
})

const layout = useLayoutStore()

const { rootStyle } = toRefs(props)

const italicClassName = computed<string>(() => (props.italic ? 'note-message-italic' : ''))

const typeClassName = computed<string>(() => `note-message-${props.type}`)

const themeClassName = computed<string>(() => `note-message-${layout.theme}`)

const inlineStyle = computed<StyleValue>(() => {
  const customStyle: StyleValue = { ...(rootStyle?.value as object), fontWeight: props.weight }
  if (props.size === 'sm') return { ...customStyle, fontSize: '12px' }
  if (props.size === 'md') return { ...customStyle, fontSize: '14px' }
  if (props.size === 'lg') return { ...customStyle, fontSize: '18px' }
  return { ...customStyle }
})
</script>

<template>
  <div
    :style="inlineStyle"
    :class="['note-message', italicClassName, typeClassName, themeClassName, rootClassName]"
  >
    {{ message }}
  </div>
</template>
