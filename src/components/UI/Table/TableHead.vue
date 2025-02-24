<script setup lang="ts" generic="M">
import { withDefaults } from 'vue'
import { iconName } from '@/components/UI/Icon/constant.ts'
import type { TableColumns, TableRowKey } from './type.ts'
import Button, { type ButtonProps } from '../Button/Button.vue'
import Icon from '@/components/UI/Icon/Icon.vue'
import TableCell from './TableCell.vue'
import CheckBox from '@/components/Control/CheckBox/CheckBox.vue'
import useLangStore from '@/stores/LangStore'

export interface TableHeadProps<M> {
  dataSource: M[]
  columns: TableColumns<M>
  rowSelectedKeys: TableRowKey[]
  hasRowSelection: boolean
  hasExpand: boolean
  removeButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
}

const props = withDefaults(defineProps<TableHeadProps<M>>(), {
  dataSource: () => [],
  columns: () => [],
  rowSelectedKeys: () => [],
  removeButtonProps: () => ({
    sizes: 'sm',
    color: 'red',
    rootClassName: 'actions-btn'
  }),
  cancelButtonProps: () => ({
    sizes: 'sm',
    rootClassName: 'actions-btn'
  })
})

const emits = defineEmits(['onSelectAll', 'onRowSelect', 'onCancelSelect'])

const t = useLangStore()

const handleSelectAll = () => emits('onSelectAll')

const handleRowSelect = () => emits('onRowSelect')

const handleCancelSelect = () => emits('onCancelSelect')
</script>

<template>
  <thead>
    <tr>
      <th v-if="hasRowSelection">
        <TableCell>
          <div
            v-if="rowSelectedKeys.length > 0 && rowSelectedKeys.length !== dataSource.length"
            class="cell-checked-mixed"
            @click="handleSelectAll"
          >
            <Icon :iconName="iconName.MINUS" />
          </div>
          <CheckBox v-if="rowSelectedKeys.length === 0" color="white" @onCheck="handleSelectAll" />
          <CheckBox
            v-if="rowSelectedKeys.length === dataSource.length"
            color="white"
            :checked="rowSelectedKeys.length === dataSource.length"
            @onCheck="handleSelectAll"
          />
        </TableCell>
      </th>

      <th v-if="rowSelectedKeys.length" :colSpan="columns.length">
        <div class="table-head-remove-actions">
          <Button v-bind="removeButtonProps" @click="handleRowSelect">
            <slot name="headRemoveButton">{{ t.lang.common.actions.remove }}</slot>
          </Button>
          <Button v-bind="cancelButtonProps" @click="handleCancelSelect">
            <slot name="headCancelButton">{{ t.lang.common.actions.cancel }}</slot>
          </Button>
        </div>
      </th>

      <th v-if="hasExpand" />

      <template v-if="!rowSelectedKeys.length">
        <th v-for="column in columns" :key="column.id">
          <TableCell>
            {{ column.title }}
          </TableCell>
        </th>
      </template>
    </tr>
  </thead>
</template>
