<script setup lang="ts">
import { UI, Control } from '@/components'
import useParticles from '@/components/UI/BgAnimation/BgParticles/useParticles'

const { Section, BgAnimation } = UI

const {} = Control

const { BgParticles } = BgAnimation

const { bubbleOptions, grabsOptions, twinkleOptions, collideOptions } = useParticles({ layoutColor: true })
</script>

<template>
  <Section :rootStyle="{ width: '100%', height: '500px' }">
    <BgParticles layoutColor :options="collideOptions" />
  </Section>
</template>
