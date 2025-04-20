<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { iconName } from '@/components/UI/Icon/constant'
import Icon from '@/components/UI/Icon/Icon.vue'

interface OptionPaginationProps {
  currentPage: number
  totalPages: number
  loading: boolean
}

const props = withDefaults(defineProps<OptionPaginationProps>(), {
  currentPage: 1
})

const emits = defineEmits(['onChangePage'])

const prevBtnDisabled = computed<boolean>(() => props.currentPage === 1 || props.loading)

const nextBtnDisabled = computed<boolean>(() => props.currentPage === props.totalPages || props.loading)

const prevBtnDisabledClassName = computed<string>(() => (prevBtnDisabled.value ? 'actions-btn-disabled' : ''))

const nextBtnDisabledClassName = computed<string>(() => (nextBtnDisabled.value ? 'actions-btn-disabled' : ''))

const handleChangePage = (type: 'prev' | 'next') => emits('onChangePage', type)
</script>

<template>
  <div className="option-pagination">
    <div className="pagination-content">{{ currentPage }} / {{ totalPages }}</div>

    <div className="pagination-actions">
      <button
        type="button"
        :disabled="prevBtnDisabled"
        :class="['actions-btn', prevBtnDisabledClassName]"
        @click="() => handleChangePage('prev')"
      >
        <Icon :iconName="iconName.ANGLE_LEFT" />
      </button>
      <button
        type="button"
        :disabled="nextBtnDisabled"
        :class="['actions-btn', nextBtnDisabledClassName]"
        @click="() => handleChangePage('next')"
      >
        <Icon :iconName="iconName.ANGLE_RIGHT" />
      </button>
    </div>
  </div>
</template>
