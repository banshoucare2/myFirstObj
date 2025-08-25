<template>
  <div>
    <el-upload
      ref="uploadComponents"
      :name="name"
      list-type="picture"
      :multiple="false"
      :action="actionUrl"
      :accept="acceptTypes"
      :with-credentials="false"
      :show-file-list="showFileList"
      :limit="maxcount"
      :data="uploadData"
      :headers="headers"
      :on-progress="uploadVideoProcess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :disabled="disabled"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot name="default" />
    </el-upload>
    <el-progress v-if="showFileList && progressFlag" :percentage="loadProgress" />
    <el-image
      v-if="showFileList"
      style="width: 100%; display: none"
      :src="url"
      :preview-src-list="srcList"
    />
  </div>
</template>

<script>

import cookies from "js-cookie";

export default {
  name: 'Uploader',
  props: {
    name: { type: String, default: 'uploadFile' },
    actionUrl: { type: String, default: '' },
    maxcount: { type: Number, default: 20 }, // 传入最大上传数量
    maxSize: { type: Number, default: 50 }, // 默认50M
    // limit: { type: String, default: 'pdf,xls,xlsx,doc,docx,jpg,jpeg,png,rar,zip,mp4' }, // 文件类型限制
    limit: { type: String, default: '' }, // 文件类型限制
    uploadText: { type: String, default: '点击上传' },
    succeedText: { type: String, default: '上传成功' },
    showFileList: { type: Boolean, default: false },
    acceptTypes: { type: String, default: '' },
    // 额外参数
    filesData: { type: Object, default: () => {} },
    needTenancyId: { type: Boolean, default: true },
    fileBeforeUpload: {
      type: Function,
      default: () => {
        return () => { return true }
      }
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      uploaderVisible: false, // 展示预览图
      uploaderImageUrl: '', // 预览图片链接
      isMax: false, // 隐藏上传按钮
      imgQuality: 0.5, // 压缩质量
      fileList: [], // 上传的文件列表, 例如: ['https://xxx.cdn.com/xxx.jpg']
      url: '',
      uploadData: {},
      srcList: [],
      fileNumber: 0,
      loadProgress: 0,
      progressFlag: false
    }
  },
  computed: {
    headers() {
      return {
        'Pragma': 'no-cache', // 缓存标识
        'Cache-Control': 'no-cache, no-store, max-age=0,must-revalidate',
        'Authorization': cookies.get('ge_adminToken')
      }
    }
  },
  watch: {
    initFileList() {
      this.fileList = this.initFileList
    },
    filesData: { // 强制数据更新
      handler(newVal) {
        this.uploadData = { ...this.uploadData, ...newVal };
      },
      immediate: true,
      deep: true
    }
  },
  async created() {

  },
  destroyed() {
    this.fileList = []
  },
  methods: {
    removeFileList() {
      this.fileList = []
    },
    // 预览图片
    async handlePictureCardPreview(file) {
    },
    // 下载图片
    async handlePictureDownload(file) {
    },
    // 上传文件成功
    async handleSuccess(response, file, fileList) {
      console.log('handleSuccess: ', response)
      
      const { code, errorMsg, message, rows } = response
      if (code != '0') {
        if (fileList && fileList.length > 0) {
          fileList.splice(fileList.length - 1, 1)
        }
        this.$message.error(errorMsg || message)
        this.$emit('uploadFailed')
        return
      }
      console.log('handleSuccess file', file)
      // 上传成功的附件添加上返回的附件ID
      if (rows && rows.length > 0) {
        file.attachmentInfoId = rows[0].attachmentInfoId
      }

      this.fileList = fileList
      this.$message.success(this.succeedText || message)
      this.$emit('uploadSucceed', response, fileList)
      this.fileNumber = fileList.length
    },
    handleError() {
      this.$emit('uploadFailed')
    },
    // 删除文件
    async handleRemove(file) {
      console.log('handleRemove file', file)
      if (file.attachmentInfoId) {
        const { result, msg } = await deleteFile({
          ids: file.attachmentInfoId
        })

        if (result !== '1') {
          this.$message.error(msg)
          return
        }
        this.$message.success(msg)
      }

      this.srcList = this.srcList.filter(item => {
        return item != file.url
      })
      this.fileNumber = this.srcList.length
    },
    // 文件超出个数限制时的钩子
    handleExceed() {
      this.$message.error(`最多上传${this.maxcount}文件`)
    },
    dataURItoBlob(dataURI, type) {
      const binary = atob(dataURI.split(',')[1])
      const array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: 'jpg' })
    },
    beforeUpload(file) {
      console.log('beforeUpload: ', file)
      // 外部的校验
      const result = this.fileBeforeUpload(file)
      if (result == false) return false
      let limitSize = 10 * 1024 * 1024 // 10M
      if (this.maxSize) limitSize = this.maxSize * 1024 * 1024

      if (file.size > limitSize) {
        this.$message.error(`最大上传文件${this.maxSize}MB!`)
        return false
      }

      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
      if (this.limit) {
        if (this.limit.toLowerCase().indexOf(suffix.toLowerCase()) === -1) {
          this.$message.error(`上传文件类型错误, 目前支持的文件类型有：${this.limit}`)
          return false
        }
      }
      this.$emit('beforeUpload')
    },
    // 暴露给外面ref用
    clearFiles() {
      if (this.$refs.uploadComponents) {
        this.$refs.uploadComponents.clearFiles()
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.progressFlag = true
      this.loadProgress = parseInt(event.percent)
      if (this.loadProgress >= 100) {
        this.loadProgress = 100
        setTimeout(() => this.progressFlag = false, 1000)
      }
    }
  }
}
</script>

<style scoped>
.list {
  display: flex;
  justify-content: space-between;
}
.moveTop {
  margin-top: -38px;
}
.el-upload-list__item-name {
  margin-right: 15px;
}
.item-name {
  max-width: 260px;
  display: inline-block;
}
.item-label {
  margin-left: 5px;
}
</style>
