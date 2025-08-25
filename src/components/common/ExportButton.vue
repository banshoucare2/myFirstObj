<template>
  <el-button :loading="loading" :type="type" plain :icon="icon" size="small" v-bind="$attrs" v-on="$listeners" @click="exportTableData">
    {{ exportText }}
  </el-button>
</template>

<script>
export default {
  name: 'ExportButton',
  props: {
    icon: { type: String, default: 'el-icon-download' },
    type: { type: String, default: 'primary' },
    exportText: { type: String, default: '导出' },
    fileName: { type: String, default: '' },
    requestParams: { type: [Object, String], default: () => {} },
    exportRequest: { type: [String, Function], default: '' }
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
  },
  methods: {
    async exportTableData() {
      try {
        if (typeof this.exportRequest !== 'function') return console.warn('未设置导出请求函数')
        // 执行导出请求函数
        this.loading = true
        const result = await this.exportRequest(this.requestParams).catch(err => console.log(err))
        this.loading = false
        if (result.status == 200) {
          const blob = new Blob([result.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.fileName)
          document.body.appendChild(link)
          link.click()
          link.remove()
        } else {
          this.$message.error('导出失败')
        }
      } catch (error) {
        this.loading = false
        this.$message.error(error)
      }
    }
  }
}
</script>
