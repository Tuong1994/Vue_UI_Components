<script setup lang="ts">
import { ref, computed, withDefaults, useSlots, watchEffect, inject, type StyleValue } from 'vue'
import { ACCEPT_FILE_TYPE, DEFAULT_FILE_SIZE } from '../constant.ts'
import { REPLACE_NUM_REGEX, REPLACE_TYPE_REGEX } from '@/common/constant/regex'
import type {
  UploadItems,
  ControlColor,
  ControlShape,
  UploadError,
  UploadItem
} from '@/components/Control/type'
import NoteMessage from '@/components/UI/NoteMessage/NoteMessage.vue'
import UploadControl from './UploadControl.vue'
import UploadFiles from './UploadFiles.vue'
import useLayoutStore from '@/components/UI/Layout/LayoutStore'
import useLangStore from '@/stores/LangStore'
import utils from '@/utils'

export interface FileUploadProps {
  rootClassName?: string
  controlClassName?: string
  rootStyle?: StyleValue
  controlStyle?: StyleValue
  color?: ControlColor
  shape?: ControlShape
  limit?: number
  fileAccepted?: string
  disabled?: boolean
  multiple?: boolean
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  rootClassName: '',
  controlClassName: '',
  color: 'blue',
  shape: 'square',
  limit: DEFAULT_FILE_SIZE,
  fileAccepted: ''
})

const emits = defineEmits(['onUpload'])

const form = inject('form', null) as any

const slots = useSlots()

const layout = useLayoutStore()

const t = useLangStore()

const files = ref<UploadItems>([])

const error = ref<UploadError | null>(null)

const dragged = ref<boolean>(false)

const hasLabel = computed<boolean>(() => slots.label !== undefined)

const controlColor = computed<ControlColor>(() => (form?.isVee ? form?.formColor : props.color))

const controlShape = computed<ControlShape>(() => (form?.isVee ? form?.formShape : props.shape))

const controlDisabled = computed<boolean>(() => (form?.isVee ? form?.formDisabled : props.disabled))

const colorClassName = computed<string>(() => `file-upload-${controlColor.value}`)

const shapeClassName = computed<string>(() => `file-upload-${controlShape.value}`)

const themeClassName = computed<string>(() => `file-upload-${layout.theme}`)

const gapClassName = computed<string>(() => (form?.isVee ? 'file-upload-gap' : ''))

const errorMessage = computed<string | undefined>(() => {
  if (!error.value) return ''
  if (error.value.type === 'fileSize')
    return t.lang.common.form.others.fileSize.replace(REPLACE_NUM_REGEX, `${props.limit / (1024 * 1024)}`)
  if (error.value.type === 'fileType')
    return t.lang.common.form.others.fileType.replace(REPLACE_TYPE_REGEX, `${props.fileAccepted}`)
})

const handleUpload = (fileList: File[]) => {
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    if (props.fileAccepted && !props.fileAccepted.includes(file.type))
      return (error.value = { type: 'fileType', active: true })
    if (file.size > props.limit) return (error.value = { type: 'fileSize', active: true })
  }

  const uploadFiles: UploadItems = fileList.map((file) => ({ id: utils.uuid(), file }))
  if (!files.value.length) files.value = uploadFiles
  else files.value = [...files.value, ...uploadFiles]
  error.value = null
}

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files) return
  const files: File[] = Array.from(target.files)
  handleUpload(files)
}

const handleDrag = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === 'dragenter' || e.type === 'dragover') dragged.value = true
  else if (e.type === 'dragleave') dragged.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragged.value = false
  if (e.dataTransfer && e.dataTransfer.files) {
    const uploadFiles: File[] = Array.from(e.dataTransfer.files)
    handleUpload(uploadFiles)
  }
}

const handleRemove = (uploadFile: UploadItem) => {
  const inputEl = document.getElementById('fileUpload') as HTMLInputElement
  if (files.value && inputEl && inputEl.files) {
    const dataTransfer = new DataTransfer()
    const uploadFiles: File[] = Array.from(inputEl.files)
    const filterFiles: File[] = uploadFiles.filter((f) => f.name !== uploadFile.file?.name)

    filterFiles.forEach((file) => {
      const remainFile = new File([file.name], file.name)
      dataTransfer.items.add(remainFile)
    })
    inputEl.files = dataTransfer.files
  }
  files.value = [...files.value].filter((file) => file.id !== uploadFile.id)
}

watchEffect(() => {
  emits(
    'onUpload',
    files.value.map((uploadFile) => uploadFile.file as File)
  )
})
</script>

<template>
  <div
    :style="rootStyle"
    :class="['file-upload', colorClassName, shapeClassName, gapClassName, themeClassName, rootClassName]"
  >
    <UploadControl
      id="fileUpload"
      :controlClassName="controlClassName"
      :controlStyle="controlStyle"
      :error="error"
      :hasLabel="hasLabel"
      :dragged="dragged"
      :disabled="controlDisabled"
      :multiple="multiple"
      :accept="fileAccepted ?? ACCEPT_FILE_TYPE.join(',')"
      @onChange="handleChange"
      @onDrag="handleDrag"
      @onDrop="handleDrop"
    />

    <NoteMessage v-if="error && error.active" type="error" :message="errorMessage" />

    <UploadFiles :files="files" :disabled="controlDisabled" @onRemove="handleRemove" />
  </div>
</template>
