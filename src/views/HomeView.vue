<script setup lang="ts">
import * as yup from 'yup'
import { ref } from 'vue'
import { UI, Control } from '@/components'
import type { TableColumns, TableRowKey } from '@/components/UI/Table/type'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import { iconName } from '@/components/UI/Icon/constant'
import { ELayoutTheme } from '@/components/UI/Layout/enum'

const { Section, Button, Image, Table, Divider, Tabs, Grid, Layout, BgAnimation } = UI

const {} = Control

const { BgFloating } = BgAnimation
</script>

<template>
  <Section :rootStyle="{width: '100%', height: '500px'}">
    <BgFloating color="purple" shape="bubble" />
  </Section>
</template>
