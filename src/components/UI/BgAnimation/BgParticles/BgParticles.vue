<script setup lang="ts">
import { computed, defineProps, toRefs, type StyleValue } from 'vue'
import type { ISourceOptions } from '@tsparticles/engine'
import type { LayoutColor } from '../../Layout/type'
import linksOptions from './sourceOptions/linksOptions'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import useParticles from './useParticles'

interface BgParticlesProps {
  rootClassName?: string
  rootStyle?: StyleValue
  hasColor?: boolean
  fullScreen?: boolean
  color?: LayoutColor
  zIndex?: number
  options?: ISourceOptions
}

const props = withDefaults(defineProps<BgParticlesProps>(), {
  rootClassName: '',
  hasColor: false,
  zIndex: 0,
  fullScreen: true
})

const layout = useLayoutStore()

const { rootStyle } = toRefs(props)

const { particlesTheme, particlesLoaded } = useParticles({
  hasColor: props.hasColor,
  color: props.color,
  fullScreen: props.fullScreen
})

const particlesOptions = computed<ISourceOptions>(() => {
  if (props.options) return props.options
  return linksOptions(particlesTheme)
})

const style = computed<StyleValue>(() => ({
  ...(rootStyle?.value as object),
  zIndex: props.zIndex
}))
</script>

<template>
  <div :style="style" :class="['bg-particles', rootClassName]">
    <vue-particles
      id="tsparticles"
      class="bg-particles-view"
      :key="layout.theme"
      :options="particlesOptions"
      @particles-loaded="particlesLoaded"
    />
  </div>
</template>
