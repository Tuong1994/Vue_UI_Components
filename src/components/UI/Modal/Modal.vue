<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, toRefs, watchEffect, type StyleValue } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import { useRender, useOverflow } from '@/hooks'
import type { ComponentColor, ComponentSize } from '@/common/type'
import Button, { type ButtonProps } from '@/components/UI/Button/Button.vue'
import Icon from '@/components/UI/Icon/Icon.vue'
import useLayoutStore from '../Layout/LayoutStore'

export interface ModalProps {
  rootClassName?: string
  headClassName?: string
  bodyClassName?: string
  footClassName?: string
  rootStyle?: StyleValue
  headStyle?: StyleValue
  bodyStyle?: StyleValue
  footStyle?: StyleValue
  hasHead?: boolean
  hasFoot?: boolean
  hasCloseIcon?: boolean
  backdropClose?: boolean
  hasCancelButton?: boolean
  open?: boolean
  sizes?: ComponentSize
  color?: ComponentColor
  okButtonTitle?: string
  cancelButtonTitle?: string
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
}

const props = withDefaults(defineProps<ModalProps>(), {
  rootClassName: '',
  headClassName: '',
  bodyClassName: '',
  footClassName: '',
  hasHead: true,
  hasFoot: true,
  hasCloseIcon: true,
  backdropClose: true,
  hasCancelButton: true,
  sizes: 'md',
  color: 'blue',
  okButtonTitle: 'Ok',
  cancelButtonTitle: 'Cancel',
  okButtonProps: () => ({}),
  cancelButtonProps: () => ({})
})

const emits = defineEmits(['onOk', 'onClose'])

const { open } = toRefs(props)

const render = useRender(open)

const slots = useSlots()

const layout = useLayoutStore()

useOverflow(open)

const modalRef = ref<HTMLDivElement>()

const modalBackdropRef = ref<HTMLDivElement>()

const hasHeadTitle = computed<boolean>(() => slots.head !== undefined)

const sizesClassName = computed<string>(() => `modal-${props.sizes}`)

const colorClassName = computed<string>(() => `modal-${props.color}`)

const themeClassName = computed<string>(() => `modal-${layout.theme}`)

const hasHeadClassName = computed<string>(() => (hasHeadTitle.value ? 'modal-head-flex' : ''))

const backdropActiveClassName = computed<string>(() => (props.open ? 'modal-backdrop-active' : ''))

const modalActiveClassName = computed<string>(() => (props.open ? 'modal-active' : ''))

const okButtonColor = computed(() =>
  props.color === 'white' || props.color === 'gray' ? 'blue' : props.okButtonProps?.color ?? props.color
)

const okActionProps = computed<ButtonProps>(() => ({ ...props.okButtonProps, color: okButtonColor.value }))

watchEffect(() => {
  if (!document) return
  const modals = document.querySelectorAll('.modal-active')
  if (modals.length === 1) return
  if (modalRef.value && modalBackdropRef.value) {
    const modalzIndex = 35 + modals.length
    const backdropszIndex = 34 + modals.length
    modalRef.value.style.zIndex = `${modalzIndex}`
    modalBackdropRef.value.style.zIndex = `${backdropszIndex}`
  }
})

const handleOk = () => emits('onOk')

const handleClose = () => emits('onClose')
</script>

<template>
  <Teleport to="#portal">
    <div
      v-if="render"
      ref="modalBackdropRef"
      :class="['modal-backdrop', backdropActiveClassName]"
      @click="() => backdropClose && handleClose()"
    />

    <div
      v-if="render"
      ref="modalRef"
      :class="['modal', colorClassName, sizesClassName, themeClassName, modalActiveClassName, rootClassName]"
    >
      <div v-if="hasHead" :class="['modal-head', hasHeadClassName, headClassName]">
        <slot v-if="hasHeadTitle" name="head"></slot>

        <button v-if="hasCloseIcon" type="button" class="head-close-action" @click="handleClose">
          <Icon :iconName="iconName.X_MARK" />
        </button>
      </div>

      <div :class="['modal-body', bodyClassName]">
        <slot name="body"></slot>
      </div>

      <div v-if="hasFoot" :class="['modal-foot', footClassName]">
        <Button v-if="hasCancelButton" v-bind="cancelButtonProps" @click="handleClose">
          {{ cancelButtonTitle }}
        </Button>
        <Button v-bind="okActionProps" @click="handleOk">
          {{ okButtonTitle }}
        </Button>
      </div>
    </div>
  </Teleport>
</template>
