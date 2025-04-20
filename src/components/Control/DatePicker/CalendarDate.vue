<script setup lang="ts">
import { toRefs } from 'vue'
import type { SelectDate } from '../type';
import type { RangeDateValue } from './type';
import DateItem from "./DateItem.vue"
import useDateRange from './useDateRange'

interface CalendarDateProps {
  min?: RangeDateValue
  max?: RangeDateValue
  currentDate: Date
  currentMonth: number
  currentYear: number
}

const props = defineProps<CalendarDateProps>()

const emits = defineEmits(['onSelectDate'])

const { currentYear, currentMonth } = toRefs(props)

const dateRange = useDateRange(currentYear, currentMonth)

const handleSelectDate = (date: SelectDate) => emits('onSelectDate', date)
</script>

<template>
  <div class="calendar-date">
    <DateItem
      v-for="(selectDate, idx) in dateRange"
      :key="idx"
      :min="min"
      :max="max"
      :currentDate="currentDate"
      :selectDate="selectDate"
      @onSelectDate="handleSelectDate"
    />
  </div>
</template>
