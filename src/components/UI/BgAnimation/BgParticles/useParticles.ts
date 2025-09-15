import { computed, ref, watchEffect } from 'vue'
import type { ISourceOptions } from '@tsparticles/engine'
import type { ParticlesOptionParams } from '../type'
import linksConfig from './sourceOptions/linksOptions'
import bubbleConfig from './sourceOptions/bubbleOptions'
import grabsConfig from './sourceOptions/grabsOptions'
import collideConfig from './sourceOptions/collideOptions'
import twinkleConfig from './sourceOptions/twinkleOptions'
import useLayoutStore from '../../Layout/LayoutStore'
import type { LayoutColor } from '../../Layout/type'

type Config = {
  hasColor?: boolean
  fullScreen?: boolean
  color?: LayoutColor
}

const colorWhite = '#fff'
const colorBlack = '#222'
const colorBlue = '#0ea5e9'
const colorRed = '#f43f5e'
const colorGreen = '#10b981'
const colorOrange = '#f5a316'
const colorYellow = '#ffe601'
const colorPurple = '#6366f1'
const colorPink = '#ec4899'

const useParticles = (config?: Config) => {
  const layout = useLayoutStore()

  const particlesTheme = ref<ParticlesOptionParams>({
    color: '',
    backgroundColor: ''
  })

  const bgColors = computed<Record<string, string>>(() => ({
    blue: colorBlue,
    green: colorGreen,
    red: colorRed,
    orange: colorOrange,
    yellow: colorYellow,
    purple: colorPurple,
    pink: colorPink
  }))

  const defaultConfig = computed<Config>(() => (config ? config : { hasColor: false, fullScreen: false }))

  // Set dark/light mode -> work when don't apply color theme
  watchEffect(() => {
    if (defaultConfig.value.hasColor) return
    if (layout.theme === 'light') {
      particlesTheme.value = {
        ...particlesTheme.value,
        backgroundColor: colorWhite,
        color: colorBlack,
        fullScreen: defaultConfig?.value?.fullScreen
      }
    } else {
      particlesTheme.value = {
        ...particlesTheme.value,
        backgroundColor: colorBlack,
        color: colorWhite,
        fullScreen: defaultConfig?.value?.fullScreen
      }
    }
  })

  // Set theme -> disabled dark/light mode
  watchEffect(() => {
    if (!defaultConfig.value.hasColor) return
    const { color } = defaultConfig.value
    particlesTheme.value = {
      ...particlesTheme.value,
      backgroundColor: bgColors.value[color ? color : layout.color],
      color: colorWhite,
      fullScreen: defaultConfig?.value?.fullScreen
    }
  })

  const optionsParams = computed<ParticlesOptionParams>(() => {
    const defaultParams = { fullScreen: defaultConfig.value.fullScreen }
    if (!defaultConfig.value.hasColor) return defaultParams
    return {
      ...defaultParams,
      backgroundColor: particlesTheme.value.backgroundColor,
      color: particlesTheme.value.color
    }
  })

  const linksOptions = computed<ISourceOptions>(() => linksConfig(optionsParams))

  const bubbleOptions = computed<ISourceOptions>(() => bubbleConfig(optionsParams))

  const grabsOptions = computed<ISourceOptions>(() => grabsConfig(optionsParams))

  const collideOptions = computed<ISourceOptions>(() => collideConfig(optionsParams))

  const twinkleOptions = computed<ISourceOptions>(() => twinkleConfig(optionsParams))

  const particlesLoaded = async (container: any) => {
    console.log('Particles container loaded', container)
  }

  return {
    particlesTheme,
    particlesLoaded,
    linksOptions,
    bubbleOptions,
    grabsOptions,
    collideOptions,
    twinkleOptions
  }
}

export default useParticles
