<script setup lang="ts">
import { UI, Control } from '@/components'

const { Section, Divider } = UI

const {} = Control
</script>

<template>
  <Section :rootStyle="{ width: '100%', height: '500px' }">
    <Divider dashed placement="center">Divider</Divider>
    <Divider dashed type="vertical" placement="center">Divider</Divider>
    <span>Content</span>
    <Divider dashed type="vertical" placement="center">Divider</Divider>
    <span>Content</span>
    <Divider dashed type="vertical" placement="center">Divider</Divider>
  </Section>
</template>
