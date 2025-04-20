<script setup lang="ts">
import Spinner from '@/components/UI/Loading/Spinner/Spinner.vue'
</script>

<template>
  <div class="table-loading">
    <Spinner :size="8" type="bubble" color="black" />
  </div>
</template>
