<template>
  <el-upload
    ref="multipleUploader"
    :name="uploadId"
    list-type="picture"
    :multiple="true"
    :auto-upload="false"
    :on-change="handleChange"
    :action="actionUrl"
    :accept="acceptTypes"
    :with-credentials="false"
    :show-file-list="showFileList"
    :limit="maxcount"
    :data="uploadData"
    :headers="headers"
    :before-upload="beforeUpload"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="default" />
  </el-upload>
  <!-- <el-progress v-if="progressFlag" :percentage="loadProgress" /> -->
  <!-- <el-image style="width: 100%; display: none" :src="url" :preview-src-list="srcList" /> -->
</template>
<script>

import cookies from "js-cookie";

export default {
  name: 'MultipleUploader',
  props: {
    name: { type: String, default: 'uploadFile' },
    actionUrl: { type: String, default: '' },
    maxcount: { type: Number, default: 10 }, // 传入最大上传数量
    maxSize: { type: Number, default: 50 * 1024 * 1024 }, // 默认50M
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
      url: '',
      uploadData: {},
      srcList: [],
      fileNumber: 0,
      loadProgress: 0,
      progressFlag: false,
      fileList: [], // 上传的文件列表
      uploadFiles: [],
      uploadId: Math.random().toString(36).substr(2).toLocaleUpperCase()
    }
  },
  computed: {
    headers() {
      return {
        "Content-Type": "multipart/form-data",
        'Authorization': cookies.get('ge_adminToken')
      }
    }
  },
  watch: {
    initFileList() {
      this.fileList = this.initFileList
    },
    filesData() { // 强制数据更新
      this.uploadData = { ...this.uploadData, ...this.filesData }
    }
  },
  async created() {
  },
  destroyed() {
    this.fileList = []
  },
  methods: {
  // 选择文件时，往fileList里添加
    handleChange(file, fileList) {
      // 获取添加文件进来的状态
      if (file.status == 'ready') this.uploadFiles.push(file.raw)
      // 获取原始文件的个数
      // console.log('getElementsByName: ', document.getElementsByName(this.uploadId))
      this.fileTotal = document.getElementsByName(this.uploadId)[0].files.length
      // 如果原始文件和upload的个数相同的时候就说明已经添加完了，可以触发上传的方法了
      // console.log('uploadFiles length: ', this.uploadFiles.length, this.fileTotal)
      if (this.uploadFiles.length === this.fileTotal) {
        // 触发上传文件列表的方法
        const { uploadFiles, action, data } = this.$refs.multipleUploader
        this.$emit('beforeUpload')
        this.uploadFilesRequest({ uploadFiles, data, action,
          success: (response) => {
            if (response && typeof response === 'string') {
              const res = JSON.parse(response)
              // console.log('success res: ', res, typeof res)
              if (res && res.result === '1') {
                this.$message.success('上传成功')
                this.$emit('uploadSucceed', res)
              } else {
                this.$message.error(res.msg)
                this.$emit('uploadFailed', res)
              }
            } else {
              this.$message.error('上传失败')
            }
            this.$refs.multipleUploader.clearFiles()
            this.uploadFiles = []
          },
          error: (error) => {
            this.uploadFiles = []
            this.$emit('uploadFailed', error)
            console.log('上传失败', error)
          }
        })
      }
    },
    uploadFilesRequest({ uploadFiles, headers, data, action, success, error }) {
      const form = new FormData()
      // 文件对象
      uploadFiles.map(file => form.append('file', file.raw))
      // 附件参数
      for (const key in data) {
        form.append(key, data[key])
      }
      const xhr = new XMLHttpRequest()
      // 异步请求
      xhr.open('post', action, true)
      // 设置请求头
      xhr.setRequestHeader('Authorization', this.headers.Authorization)
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            success && success(xhr.responseText)
          } else {
            error && error(xhr.status)
          }
        }
      }
      xhr.send(form)
    },
    // 文件超出个数限制时的钩子
    handleExceed() {
      this.$message.error(`单次最多上传${this.maxcount}个文件`)
    },
    beforeUpload(file) {
      console.log('beforeUpload: ', file)
      // 外部的校验
      const result = this.fileBeforeUpload(file)
      if (result == false) return false
      if (file.size > this.maxSize) {
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
      if (this.$refs.multipleUploader) {
        this.$refs.multipleUploader.clearFiles()
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
