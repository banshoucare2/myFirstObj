<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="clickModal"
    :close-on-press-escape="escape"
    :visible.sync="innerVisible"
    :before-close="beforeClose"
    :center="center"
    :title="title"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template slot="title">
      <slot name="title" />
    </template>
    <slot name="default" />
    <template slot="footer">
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogWrapper',
  // eslint-disable-next-line vue/require-default-prop
  props: {
    visible: Boolean,
    title: String,
    clickModal: { type: Boolean, default: false },
    escape: { type: Boolean, default: true },
    center: { type: Boolean, default: false },
  },
  data() {
    return {
      innerVisible: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.innerVisible = val
      },
      immediate: true
    }
  },
  methods: {
    beforeClose() {
      this.innerVisible = false
    }
  }
}
</script>

<style scoped>
/deep/ .el-dialog__header {
  padding: 16px 20px 10px;
  padding-bottom: 10px;
  border-bottom: 1px #F6F6F6 solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
/deep/ .el-dialog__headerbtn {
  position: relative;
  top: 0;
  right: 0;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 16px;
}
/deep/ .el-dialog__body {
  padding: 10px 20px 10px 16px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  /* max-height: 60vh; */
  overflow: auto;
}
/deep/ .el-dialog__footer {
  padding: 10px 20px;
  text-align: right;
  box-sizing: border-box;
  border-top: 1px #f6f6f6 solid;
}
/deep/ .el-form-item--small .el-form-item__content {
  line-height: 32px;
  /* max-width: 500px; */
}
/deep/ .el-input--small .el-input__inner {
  height: 34px;
  line-height: 32px;
  max-width: 500px;
}
/deep/ .el-input-number.is-controls-right .el-input__inner {
  text-align: left;
}
/deep/ .el-select {
  width: 100%;
  height: 34px;
  /* max-width: 500px; */
}
/deep/ .el-autocomplete {
  height: 34px;
  max-width: 500px;
  width: 100%;
}
/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 100%;
  height: 34px;
}
/deep/ .el-input-group, /deep/ .el-input-number--small {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
/deep/ .el-cascader--small {
  font-size: 13px;
  line-height: 32px;
  width: 100%;
  height: 34px;
}
/deep/ .el-range-editor--small.el-input__inner {
  width: 100%;
  height: 34px;
  max-width: 500px;
}
</style>
