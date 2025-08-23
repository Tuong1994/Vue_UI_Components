import type { ComputedRef, Ref } from 'vue'
import type { ISourceOptions } from '@tsparticles/engine'
import type { ParticlesOptionParams } from '../../type'

const linksOptions = (
  params?: Ref<ParticlesOptionParams> | ComputedRef<ParticlesOptionParams>
): ISourceOptions => {
  return {
    fullScreen: params?.value.fullScreen ?? true,
    background: {
      color: {
        value: params?.value.backgroundColor ?? '#fff'
      }
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'repulse'
        }
      },
      modes: {
        bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40
        },
        push: {
          quantity: 4
        },
        repulse: {
          distance: 200,
          duration: 0.4
        }
      }
    },
    particles: {
      color: {
        value: params?.value.color ?? '#222'
      },
      links: {
        color: params?.value.color ?? '#222',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: 'bounce',
        random: false,
        speed: 6,
        straight: false
      },
      number: {
        density: {
          enable: true
        },
        value: 120
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: 'circle'
      },
      size: {
        value: { min: 1, max: 5 }
      }
    },
    detectRetina: true
  }
}

export default linksOptions
