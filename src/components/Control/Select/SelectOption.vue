<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import type { SelectOptions, Option } from '@/components/Control/type'
import OptionItem from './OptionItem.vue'
import OptionEmpty from './OptionEmpty.vue'
import OptionLoading from './OptionLoading.vue'
import OptionPagination from './OptionPagination.vue'

interface SelectOptionProps {
  async: boolean
  dropdown: boolean
  loading: boolean
  hasDropdownSlot: boolean
  options: SelectOptions
  selectedOption: Option | null
  currentPage: number
  totalPages: number
  iconSize: number
}

const props = withDefaults(defineProps<SelectOptionProps>(), {
  selectedOption: null,
  options: () => []
})

const emits = defineEmits(['onSelect', 'onChangePage'])

const optionScrollClassName = computed<string>(() => (props.options.length > 10 ? 'option-list-scroll' : ''))

const dropdownClassName = computed<string>(() => (props.dropdown ? 'wrap-option-active' : ''))

const handleSelect = (option: Option) => emits('onSelect', option)

const handleChangePage = (type: 'prev' | 'next') => emits('onChangePage', type)
</script>

<template>
  <div :class="['wrap-option', dropdownClassName]">
    <div :class="['option-list', optionScrollClassName]">
      <OptionLoading v-if="loading" />

      <OptionEmpty v-if="!options.length" />

      <slot v-if="hasDropdownSlot" name="dropdown" :options="options"></slot>

      <template v-else-if="!loading && options.length > 0">
        <OptionItem
          v-for="(option, idx) in options"
          :key="idx"
          :option="option"
          :iconSize="iconSize"
          :selectedOption="selectedOption"
          @onSelect="handleSelect"
        />
      </template>
    </div>

    <OptionPagination
      v-if="async && totalPages > 1"
      :loading="loading"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @onChangePage="handleChangePage"
    />
  </div>
</template>
