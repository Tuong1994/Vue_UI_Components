import { computed, type Ref } from 'vue'
import type { SelectDate } from '../type'
import type { RangeDateValue } from './type'

type Params = {
  date: Ref<SelectDate>
  min: Ref<RangeDateValue>
  max: Ref<RangeDateValue>
}

const DISABLED_CLASSNAME = 'date-item-disabled'

const useSelectRange = (args: Params) => {
  const { date, min, max } = args

  const selectRange = computed(() => {
    let className: string = ''

    let disabled: boolean = false

    const newDate = new Date()

    const minDate = min && min.value ? new Date(min.value).getTime() : 0

    const maxDate = max && max.value ? new Date(max.value).getTime() : 0

    const selectDate = date.value.fullDate.getTime()

    const today = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()).getTime()

    //  Case 1: min and max are not defined
    if (!min.value && !max.value) return { className, disabled }

    //  Case 2: min is defined and max not defined
    if (min.value && !max.value) {
      if (min.value === 'today' && selectDate < today) {
        className = DISABLED_CLASSNAME
        disabled = true
      }

      if (selectDate < minDate) {
        className = DISABLED_CLASSNAME
        disabled = true
      }
    }

    //  Case 3: max is defined and min not defined
    if (!min.value && max.value) {
      if (max.value === 'today' && selectDate > today) {
        className = DISABLED_CLASSNAME
        disabled = true
      }

      if (selectDate > maxDate) {
        className = DISABLED_CLASSNAME
        disabled = true
      }
    }

    //  Case 4: both max and min are defined
    if (min.value && max.value) {
      // both max and min value are "today"
      if (max.value === 'today' && min.value === 'today' && selectDate !== today) {
        className = DISABLED_CLASSNAME
        disabled = true
      }

      // max value is "today" and min value are specific date
      if (max.value === 'today' && min.value !== 'today') {
        if (selectDate > today || selectDate < minDate) {
          className = DISABLED_CLASSNAME
          disabled = true
        }
      }

      // min value is "today" and max value are specific date
      if (max.value !== 'today' && min.value === 'today') {
        if (selectDate < today || selectDate > maxDate) {
          className = DISABLED_CLASSNAME
          disabled = true
        }
      }

      // both max and min value are specific date
      if (selectDate < minDate || selectDate > maxDate) {
        className = DISABLED_CLASSNAME
        disabled = true
      }
    }

    return { className, disabled }
  })

  return selectRange
}

export default useSelectRange
