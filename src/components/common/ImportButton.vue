<template>
  <MultipleUploader
    v-if="multiple"
    ref="FileList"
    style="margin: 0 10px 0 0;"
    :disabled="loading || disabled"
    :files-data="filesData"
    :acceptTypes="acceptTypes"
    v-bind="$attrs"
    @beforeUpload="beforeUpload"
    @uploadSucceed="uploadSucceed"
    @uploadFailed="uploadFailed"
    v-on="$listeners"
  >
    <el-button v-if="needIcon" :disabled="disabled" :loading="loading" :type="type" plain :icon="icon" size="small">
      {{ importText }}
    </el-button>
    <el-button v-else :disabled="disabled" :loading="loading" :type="type" plain size="small">
      {{ importText }}
    </el-button>
  </MultipleUploader>
  <Uploader
    v-else
    ref="FileList"
    style="margin: 0 10px 0 0;"
    :disabled="loading || disabled"
    :files-data="filesData"
    :showFileList="showFileList"
    :acceptTypes="acceptTypes"
    :limit="limit"
    v-bind="$attrs"
    @beforeUpload="beforeUpload"
    @uploadSucceed="uploadSucceed"
    @uploadFailed="uploadFailed"
    v-on="$listeners"
  >
    <el-button v-if="needIcon" :disabled="disabled" :loading="loading" :type="type" plain :icon="icon" size="small">
      {{ importText }}
    </el-button>
    <el-button v-else :disabled="disabled" :loading="loading" :type="type" plain size="small">
      {{ importText }}
    </el-button>
  </Uploader>
</template>

<script>

import Uploader from './Uploader.vue'
import MultipleUploader from './MultipleUploader.vue'

export default {
  name: 'ImportButton',
  components: { Uploader, MultipleUploader },
  props: {
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    importText: { type: String, default: '导入' },
    needIcon: { type: Boolean, default: true },
    showFileList: { type: Boolean, default: false },
    acceptTypes: { type: String, default: '' },
    icon: { type: String, default: 'el-icon-upload2' },
    filesData: { type: Object, default: () => {} },
    limit: { type: String, default: '' },
    maxcount: { type: Number, default: 20 },
    type: { type: String, default: 'primary' },
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
  },
  methods: {
    beforeUpload() {
      this.loading = true
      this.$emit('beforeImport')
    },
    uploadSucceed(response, fileList) {
      this.loading = false
      this.$emit('importSucceed', response, fileList)
    },
    uploadFailed(error) {
      this.loading = false
      this.$emit('importFailed', error)
    }
  }
}
</script>
