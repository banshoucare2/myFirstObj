<template>
  <div class="operate-container flex-row-between">
    <div class="left-item flex-row-center">
      <slot name="left-operate-items" />
    </div>
    <div class="right-item flex-row-center">
      <slot name="right-operate-items" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'OperateGroup'
}
</script>

<style lang="less" scoped>
.operate-container {
  width: 100%;
  height: 36px;
  background-color: transparent;
  margin: 8px 0 10px 0;
}
.left-item {
  margin-left: 2px;
}
.right-item {
  margin-right: 8px;
}
/deep/ .right-item .el-button--text {
  font-size: 14px;
  color: #515151;
  &:hover {
    color: red;
  }
}
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}
.flex-row-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
/deep/ .el-button [class*=el-icon-] + span {
  margin-left: 0px;
}
</style>
