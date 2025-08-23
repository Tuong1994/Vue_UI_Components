<script setup lang="ts">
import { computed, defineProps, type StyleValue } from 'vue'
import type { ISourceOptions } from '@tsparticles/engine'
import linksOptions from './sourceOptions/linksOptions'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import useParticles from './useParticles'

interface BgParticlesProps {
  rootClassName?: string
  rootStyle?: StyleValue
  layoutColor?: boolean
  fullScreen?: boolean
  options?: ISourceOptions
}

const props = withDefaults(defineProps<BgParticlesProps>(), {
  rootClassName: '',
  layoutColor: false,
  fullScreen: true
})

const layout = useLayoutStore()

const { particlesTheme, particlesLoaded } = useParticles({
  layoutColor: props.layoutColor,
  fullScreen: props.fullScreen
})

const particlesOptions = computed<ISourceOptions>(() => {
  if (props.options) return props.options
  return linksOptions(particlesTheme)
})
</script>

<template>
  <div :style="rootStyle" :class="['bg-particles', rootClassName]">
    <vue-particles
      id="tsparticles"
      class="bg-particles-view"
      :key="layout.theme"
      :options="particlesOptions"
      @particles-loaded="particlesLoaded"
    />
  </div>
</template>
