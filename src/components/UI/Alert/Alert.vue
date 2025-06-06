<script setup lang="ts">
import { computed, withDefaults, watchEffect, type StyleValue } from 'vue'
import type { AlertIcon, AlertPlacement } from './type.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import useRender from '@/hooks/useRender.ts'
import useAlertStore from './AlertStore'

export interface AlertProps {
  rootClassName?: string
  rootStyle?: StyleValue
}

let timeout: any

withDefaults(defineProps<AlertProps>(), {
  rootClassName: ''
})
const alertStore = useAlertStore()

const hadOpen = computed<boolean>(() => Boolean(alertStore.open))

const render = useRender(hadOpen)

const alertPlacement = computed<AlertPlacement>(() => alertStore.options.placement ?? 'top')

const alertIcon = computed<AlertIcon>(() => alertStore.options.icons as AlertIcon)

const typeClassName = computed<string>(() => `alert-${alertStore.type}`)

const placementClassName = computed<string>(() => `alert-${alertPlacement.value}`)

const activeClassName = computed<string>(() => (alertStore.open ? 'alert-active' : ''))

const handleClose = () => alertStore.onClose()

watchEffect((onStop) => {
  if (alertStore.open) timeout = setTimeout(() => handleClose(), 3000)
  onStop(() => clearTimeout(timeout))
})
</script>

<template>
  <Teleport to="#portal">
    <div
      v-if="render"
      :style="rootStyle"
      :class="['alert', typeClassName, placementClassName, activeClassName, rootClassName]"
      @click="handleClose"
    >
      <div className="alert-icon">
        <Icon v-if="alertStore.type === 'success'" :iconName="alertIcon.successIconName as string" />
        <Icon v-if="alertStore.type === 'error'" :iconName="alertIcon.errorIconName as string" />
        <Icon v-if="alertStore.type === 'warning'" :iconName="alertIcon.warningIconName as string" />
        <Icon v-if="alertStore.type === 'info'" :iconName="alertIcon.infoIconName as string" />
      </div>
      <p className="alert-message">{{ alertStore.message }}</p>
    </div>
  </Teleport>
</template>
