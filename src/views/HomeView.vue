<script setup lang="ts">
import { Section } from '@/components/UI'
import { Select, SelectTag, TreeSelect, DatePicker } from '@/components/Control'
</script>

<template>
  <Section>
    <DatePicker placement="right" :rootStyle="{ width: '120px' }" />
    <TreeSelect
    placement="right"
      :rootStyle="{ width: '120px' }"
      :options="[
        { label: 'This is option 1', value: 1 },
        { label: 'This is option 2', value: 2 }
      ]"
    />
  </Section>
</template>
