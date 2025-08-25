<template>
  <el-descriptions :column="column" border size="mini" :title="title" v-bind="$attrs" v-on="$listeners">
    <template v-for="(item, index) in dataList.filter(x => !x.noShow)">
      <el-descriptions-item
        v-if="!item.hidden"
        :key="index"
        :label="item.label"
        :span="item.span || 1"
        :label-style="item.labelStyle || labelStyle1"
        :content-style="contentStyle1"
        :content-class-name="item.contentClassName"
      >
        <template v-if="item.fn">
          <span v-if="item.disableClick && item.disableClick(rows)">
            {{ item.formatter ? item.formatter(rows) : rows[item.model] }}
          </span>
          <span v-else class="theme-color" :style="{cursor: 'pointer', textDecoration: 'underline'}" @click="() => item.fn(item)">
            {{ item.formatter ? item.formatter(rows) : rows[item.model] }}
          </span>
        </template>
        <span v-else-if="item.formatter"><span v-html="item.formatter(rows)" /></span>
        <span v-else>{{ rows[item.model] }}</span>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>
<script>
import { cloneDeep } from 'lodash'
const LABELSTYLE = {
  // 'min-width': '140px',
  'word-break': 'keep-all',
  'text-align': 'right',
  'background': '#f6f6f6',
  'color': '#666',
  'border': '1px solid rgba(232,232,232,1)'
}
const CONTENTSTYLE = {
  // 'min-width': '200px', // 最小宽度
  'word-break': 'break-all', // 过长时自动换行
  'border': '1px solid rgba(232,232,232,1)',
  'color': '#000',
  'font-weight': '400'
}

export default {
  name: 'LyDescriptions',
  props: {
    column: { type: Number, default: 3 },
    labelStyle: { type: Object, default: () => ({}) },
    contentStyle: { type: Object, default: () => ({}) },
    row: { type: Object, default: () => ({}) },
    dataList: { type: Array, default: () => ([]) },
    options: { type: Array, default: () => ([]) },
    title: { type: String, default: '' }
  },
  data() {
    return {
      // rows: this.row,
      labelStyle1: {},
      contentStyle1: {}
    }
  },
  computed: {
    rows() {
      return cloneDeep(this.row)
    }
  },
  watch: {
    labelStyle: {
      deep: true,
      immediate: true,
      handler(newVal) {
        const widthRatio = `${100 / (this.column * 2)}%`
        this.labelStyle1 = { ...LABELSTYLE, width: widthRatio, ...this.labelStyle }
        this.contentStyle1 = { ...CONTENTSTYLE, width: widthRatio, ...this.contentStyle }
      }
    }
  },
  methods: {
    handleChange(v) {
      this.$emit('changeSelect', v)
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .m-descriptions-content{
  background: rgb(255, 255, 204) !important;
}
</style>
