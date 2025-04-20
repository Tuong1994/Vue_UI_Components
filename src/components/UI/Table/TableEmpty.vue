<script setup lang="ts">
import { iconName } from '@/components/UI/Icon/constant.ts'
import Icon from '@/components/UI/Icon/Icon.vue'
import useLangStore from '@/stores/LangStore'

const t = useLangStore()
</script>

<template>
  <div class="table-empty">
    <Icon :iconName="iconName.BOX_ARCHIVE" :size="35" />
    <span>{{ t.lang.common.table.empty }}</span>
  </div>
</template>
