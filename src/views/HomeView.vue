<script setup lang="ts">
import { Section, BgAnimation } from '@/components/UI'
import useParticles from '@/components/UI/BgAnimation/BgParticles/useParticles'

const { BgParticles } = BgAnimation

const { grabsOptions } = useParticles({ hasColor: true, color: 'purple', fullScreen: false })
</script>

<template>
  <Section>
    <div :style="{ width: '100%', height: '300px' }">
      <BgParticles :options="grabsOptions" />
    </div>
  </Section>
</template>
