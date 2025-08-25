<template>
  <el-button :loading="loading" type="primary" :icon="icon" size="small" v-bind="$attrs" v-on="$listeners" @click="exportXlsx">
    {{ exportText }}
  </el-button>
</template>

<script>

import { exportToExcel } from '@/utils/exportToExcel'

export default {
  name: 'ExportXlsxButton',
  props: {
    icon: { type: String, default: 'el-icon-download' },
    exportText: { type: String, default: '导出' },
    fileName: { type: String, default: '' },
    header: { type: Array, default: () => [] },
    headerKeys: { type: Array, default: () => [] },
    tableData: { type: Array, default: () => [] },
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
  },
  methods: {
    async exportXlsx() {
      try {
        const obj = {
          exportData: {
            data: this.tableData,
            header: this.header,
            headerKeys: this.headerKeys,
            fileName: this.fileName
          },
          extendSet: {
            col: 40,
            row: 20
          }
        }
        exportToExcel(obj)
      } catch (error) {
        this.$message.error(error)
      }
    }
  }
}
</script>
