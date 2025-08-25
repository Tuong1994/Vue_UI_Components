<script setup lang="ts">
import { UI, Control } from '@/components'
import type { CarouselItems } from '@/components/UI/Carousel/type'

const { Section, Carousel } = UI

const {} = Control

const { Gallery } = Carousel

const items: CarouselItems = [
  { id: 'slide-1', comName: 'slide-1' },
  { id: 'slide-2', comName: 'slide-2' },
  { id: 'slide-3', comName: 'slide-3' },
  { id: 'slide-4', comName: 'slide-4' },
  { id: 'slide-5', comName: 'slide-5' }
]
</script>

<template>
  <Section :rootStyle="{ width: '100%', height: '500px' }">
    <Gallery open :items="items">
      <template #content="content">
        <div v-if="content.slide === 'slide-1'">Slide 1</div>
        <div v-if="content.slide === 'slide-2'">Slide 2</div>
        <div v-if="content.slide === 'slide-3'">Slide 3</div>
        <div v-if="content.slide === 'slide-4'">Slide 4</div>
        <div v-if="content.slide === 'slide-5'">Slide 5</div>
      </template>
    </Gallery>
  </Section>
</template>
