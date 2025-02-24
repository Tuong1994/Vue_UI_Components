<script setup lang="ts" generic="M">
import { ref, withDefaults } from 'vue'
import type { TableColumns, TableRowKey, TableExpand, TableColor } from './type.ts'
import TableCell from './TableCell.vue'
import CheckBox from '@/components/Control/CheckBox/CheckBox.vue'

export interface TableBodyProps<M> {
  dataSource: M[]
  columns: TableColumns<M>
  color: TableColor
  rowKey: TableRowKey
  rowSelectedKeys: TableRowKey[]
  hasRowSelection: boolean
  hasExpand: boolean
  expand?: TableExpand
}

const props = withDefaults(defineProps<TableBodyProps<M>>(), {
  color: 'blue',
  rowKey: '',
  rowSelectedKeys: () => [],
  dataSource: () => [],
  columns: () => []
})

const emits = defineEmits(['onSelectRow'])

const expandedRowKey = ref<TableRowKey>('')

const key = (data: M, idx: number) =>
  props.rowKey ? (data[props.rowKey as keyof M] as TableRowKey) : `row-${idx}`

const selected = (key: TableRowKey) => props.rowSelectedKeys.includes(key)

const handleSelectRow = (key: TableRowKey) => emits('onSelectRow', key)

const handleExpand = (key: TableRowKey) => {
  if (expandedRowKey.value === key) return (expandedRowKey.value = '')
  expandedRowKey.value = key
}
</script>

<template>
  <tbody>
    <template v-for="(data, idx) in dataSource" :key="key(data, idx)">
      <tr :class="selected(key(data, idx)) ? 'table-row-selected' : ''">
        <td v-if="hasRowSelection">
          <TableCell>
            <CheckBox
              :color="color"
              :checked="selected(key(data, idx))"
              @onCheck="() => handleSelectRow(key(data, idx))"
            />
          </TableCell>
        </td>

        <td v-if="hasExpand">
          <TableCell>
            <div
              :class="[
                'cell-expand-action',
                expandedRowKey === key(data, idx) ? 'cell-expand-action-expanded' : ''
              ]"
              @click="() => handleExpand(key(data, idx))"
            >
              <div class="action-icon" />
            </div>
          </TableCell>
        </td>

        <td v-for="column in columns">
          <TableCell v-if="column.component">
            <component :is="column.component(data, idx).node" v-bind="column.component(data, idx).props">
              {{ column.component(data, idx).slotContent }}
            </component>
          </TableCell>

          <TableCell v-else-if="column.render" v-html="column.render(data, idx)"></TableCell>

          <TableCell v-else>{{ data[column.dataIndex] }}</TableCell>
        </td>
      </tr>

      <tr v-if="hasExpand && expandedRowKey === key(data, idx)" class="table-row-expand">
        <td />
        <td :colspan="columns.length + 1">
          <TableCell>
            <slot name="expand" :data="data"></slot>
          </TableCell>
        </td>
      </tr>
    </template>
  </tbody>
</template>
