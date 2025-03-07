<script setup lang="ts">
import { ref, computed, withDefaults, type StyleValue, watch } from 'vue'
import { iconName } from '@/components/UI/Icon/constant'
import { useViewPoint } from '@/hooks'
import type { PaginationActionType, PaginationColor, PaginationShape } from './type'
import Icon from '@/components/UI/Icon/Icon.vue'
import usePagination from './usePagination'
import useLayoutStore from '../Layout/LayoutStore'
import useLangStore from '@/stores/LangStore'

export interface PaginationProps {
  rootClassName?: string
  rootStyle?: StyleValue
  total?: number
  limit?: number
  ghost?: boolean
  simple?: boolean
  hasContent?: boolean
  color?: PaginationColor
  shape?: PaginationShape
}

const props = withDefaults(defineProps<PaginationProps>(), {
  rootClassName: '',
  total: 100,
  limit: 10,
  color: 'blue',
  shape: 'round',
  simple: false
})

const emits = defineEmits(['onChangePage'])

const { isPhone } = useViewPoint()

const layout = useLayoutStore()

const t = useLangStore()

const currentPage = ref<number>(1)

const { pageRange, totalPages } = usePagination({
  siblingCount: 1,
  total: props.total,
  limit: props.limit,
  currentPage
})

const leftBtnsDisabled = computed<boolean>(() => currentPage.value === 1)

const rightBtnsDisabled = computed<boolean>(() => currentPage.value === totalPages)

const leftBtnsDisabledClassName = computed<string>(() => (leftBtnsDisabled.value ? 'range-btn-disabled' : ''))

const rightBtnsDisabledClassName = computed<string>(() =>
  rightBtnsDisabled.value ? 'range-btn-disabled' : ''
)

const shapeClassName = computed<string>(() => `pagination-${props.shape}`)

const colorClassName = computed<string>(() => {
  if (!props.ghost && !props.color) return ''
  if (props.ghost && !props.color) return `pagination-ghost`
  if (!props.ghost && props.color) return `pagination-color pagination-${props.color}`
  if (props.ghost && props.color) return `pagination-ghost pagination-ghost-${props.color}`
  return ''
})

const flexBetweenClassName = computed<string>(() => (props.hasContent ? 'pagination-flex-between' : ''))

const themeClassName = computed<string>(() => `pagination-${layout.theme}`)

const content = computed<string>(() => {
  const start = (currentPage.value - 1) * props.limit
  const end = start + props.limit
  const from = start === 0 ? 1 : start
  const to = end === props.total ? props.total : end
  const { showing, of, result } = t.lang.common.pagination
  return `${showing} ${from} - ${to} ${of} ${props.total} ${result}`
})

const handleChangePage = (type: PaginationActionType, page?: number) => {
  switch (type) {
    case 'first': {
      currentPage.value = 1
      break
    }
    case 'prev': {
      currentPage.value--
      break
    }
    case 'page': {
      currentPage.value = Number(page)
      break
    }
    case 'next': {
      currentPage.value++
      break
    }
    case 'last': {
      currentPage.value = totalPages
      break
    }
  }
}

watch(currentPage, (newValue) => emits('onChangePage', newValue))
</script>

<template>
  <div
    :style="rootStyle"
    :class="[
      'pagination',
      colorClassName,
      shapeClassName,
      flexBetweenClassName,
      themeClassName,
      rootClassName
    ]"
  >
    <div v-if="hasContent" class="pagination-content">
      {{ content }}
    </div>

    <div class="pagination-range">
      <button
        :disabled="leftBtnsDisabled"
        :class="['range-btn', leftBtnsDisabledClassName]"
        @click="() => handleChangePage('first')"
      >
        <Icon :size="13" :iconName="iconName.ANGLE_DOUBLE_LEFT" />
      </button>
      <button
        :disabled="leftBtnsDisabled"
        :class="['range-btn', leftBtnsDisabledClassName]"
        @click="() => handleChangePage('prev')"
      >
        <Icon :size="13" :iconName="iconName.ANGLE_LEFT" />
      </button>

      <div v-if="!simple" class="range-group">
        <template v-for="(page, idx) in pageRange">
          <button
            v-if="typeof page === 'number'"
            :key="idx"
            :class="['range-btn', currentPage === page ? 'range-btn-active' : '']"
            @click="() => handleChangePage('page', page)"
          >
            {{ page }}
          </button>
          <div v-if="typeof page === 'string'" :key="idx" class="range-dot">{{ page }}</div>
        </template>
      </div>

      <div v-if="simple || isPhone" class="range-simple-content">{{ currentPage }} / {{ totalPages }}</div>

      <button
        :disabled="rightBtnsDisabled"
        :class="['range-btn', rightBtnsDisabledClassName]"
        @click="() => handleChangePage('next')"
      >
        <Icon :size="13" :iconName="iconName.ANGLE_RIGHT" />
      </button>
      <button
        :disabled="rightBtnsDisabled"
        :class="['range-btn', rightBtnsDisabledClassName]"
        @click="() => handleChangePage('last')"
      >
        <Icon :size="13" :iconName="iconName.ANGLE_DOUBLE_RIGHT" />
      </button>
    </div>
  </div>
</template>
