<script setup lang="ts">
import { RouterView } from 'vue-router'
import FlexProvider from './components/UI/Flex/FlexProvider.vue'
</script>

<template>
  <FlexProvider>
    <RouterView />
  </FlexProvider>
</template>
