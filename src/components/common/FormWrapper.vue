<template>
  <div class="form-wrapper">
    <el-form ref="ruleForm" v-bind="$attrs" v-on="$listeners">
      <slot name="default" />
      <div style="height: 20px" />
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FormWrapper',
  props: {
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        const ruleFormRef = this.$refs['ruleForm']
        ruleFormRef.validate(async(valid) => {
          if (valid) {
            resolve(valid)
          } else {
            this.$message.warning("请检查必填项")
            this.$nextTick(_ => {
              const isError = document.getElementsByClassName('is-error')
              isError[0].scrollIntoView({
                // 滚动到指定节点
                // 值有start,center,end，nearest，当前显示在视图区域中间
                block: 'center',
                // 值有auto、instant,smooth，缓动动画（当前是慢速的）
                behavior: 'smooth'
              })
            })
            resolve(valid)
          }
        })
      })
    },
    clearFields() {
      this.$refs['ruleForm'].clearValidate()
    },
    resetFields() {
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style scoped>
.form-wrapper {
  background-color: white;
  padding: 10px 18px 0 0;
}
/deep/ .el-form-item .el-form-item__content {
  line-height: 34px;
  min-height: 35px;
}
.form-wrapper /deep/ .el-form-item .el-form-item__label{
  line-height: 18px;
  display: flex;
  align-items: center;
  justify-content: right;
  min-height: 34px;
}
/deep/ .el-input .el-input__inner {
  height: 33px;
  line-height: 32px;
  max-width: 500px;
}
/deep/ .el-input-number.is-controls-right .el-input__inner {
  text-align: left;
}
/deep/ .el-select {
  width: 100%;
  height: 34px;
  max-width: 500px;
}
/deep/ .el-select .el-input .el-input__inner {
  max-width: 100%;
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
/deep/ .el-input-group, /deep/ .el-input-number {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
/deep/ .el-cascader {
  font-size: 13px;
  line-height: 32px;
  width: 100%;
  height: 34px;
}
/deep/ .el-range-editor.el-input__inner {
  width: 100%;
  height: 34px;
  max-width: 500px;
}
/* 禁用颜色 */
/deep/ .el-input.is-disabled .el-input__inner {
  color: #3b3b3b;
}
/deep/ .el-radio__input.is-disabled .el-radio__inner { /* 单选框 */
  border-color: #9fa1a4;
}
/deep/ .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
  border-color: #9fa1a4;
}
/deep/ .el-radio__input.is-disabled + span.el-radio__label {
  color: #3b3b3b;
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner { /* 复选框 */
  border-color: #9fa1a4;
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #9fa1a4;
}
/deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #3b3b3b;
}
/deep/ .el-range-editor.is-disabled input {
  color: #3b3b3b;
}
</style>
