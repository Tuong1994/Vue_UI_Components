<script setup lang="ts">
import { ref, computed, watchEffect, toRef } from 'vue'
import type { RangeDateValue } from './type';
import type { SelectDate } from '../type';
import CalendarHeader from './CalendarHeader.vue'
import CalendarDay from './CalendarDay.vue'
import CalendarDate from './CalendarDate.vue'

interface DatePickerCalendarProps {
  min?: RangeDateValue
  max?: RangeDateValue
  dropdown: boolean
  selectedDate: Date
}

const props = defineProps<DatePickerCalendarProps>()

const selectedDate = toRef(props, 'selectedDate')

const emits = defineEmits(['onSelect'])

const currentDate = ref<Date>(new Date())

const currentMonth = ref<number>(new Date().getMonth())

const currentYear = ref<number>(new Date().getFullYear())

const dropdownClassName = computed<string>(() => (props.dropdown ? 'wrap-calendar-active' : ''))

watchEffect(() => {
  currentDate.value = selectedDate.value
  currentMonth.value = selectedDate.value.getMonth()
  currentYear.value = selectedDate.value.getFullYear()
})

const handleSelectMonth = (month: number) => (currentMonth.value = month)

const handleSelectYear = (year: number) => (currentYear.value = year)

const handleSwitchMonth = (type: 'prev' | 'next') => {
  const newMonth = type === 'prev' ? currentMonth.value - 1 : currentMonth.value + 1
  currentMonth.value = newMonth
  if (newMonth < 0 || newMonth > 11) {
    const newDate = new Date(currentYear.value, newMonth, new Date().getDate())
    currentDate.value = newDate
    currentMonth.value = newDate.getMonth()
    currentYear.value = newDate.getFullYear()
  } else currentDate.value = new Date()
}

const handleSelectDate = (date: SelectDate) => {
  const newDate = date.fullDate
  if (date.month < currentMonth.value + 1 || date.month > currentMonth.value + 1) {
    currentDate.value = newDate
    currentMonth.value = newDate.getMonth()
    currentYear.value = newDate.getFullYear()
  } else currentDate.value = new Date()
  emits('onSelect', date)
}
</script>

<template>
  <div :class="['wrap-calendar', dropdownClassName]">
    <CalendarHeader
      :currentMonth="currentMonth"
      :currentYear="currentYear"
      @onSwitchMonth="handleSwitchMonth"
      @onSelectMonth="handleSelectMonth"
      @onSelectYear="handleSelectYear"
    />

    <CalendarDay />

    <CalendarDate
      :min="min"
      :max="max"
      :currentDate="currentDate"
      :currentYear="currentYear"
      :currentMonth="currentMonth"
      @onSelectDate="handleSelectDate"
    />
  </div>
</template>
