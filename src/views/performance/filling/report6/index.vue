<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-nav-bar v-if="showTitle" :title="handleTitle" fixed style="z-index: 9999;" />
    <van-empty description="请移至批发系统PC端处理" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getSum, getSumList } from "@/service/performance";

export default {
  name: 'report1',
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: true }
  },
  data () {
    return {
      title: '绩效前置数据上报',
      loading: false,
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    //终审H5无调整功能，无调整指标功能
    this.init()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    handleTitle() {
      return this.title
    },
  },
  methods: {
    async init() {

    },
  }
}
</script>
<style scoped>
.page-container {
  padding-top: 200px;
  padding-bottom: 34px;
  height: 100%;
  position: relative;
}
/deep/.page-container .van-nav-bar {
  background-color: var(--navbar-color, #bb2f25);
}
/deep/.page-container .van-nav-bar .van-nav-bar__arrow {
  color: white;
}
/deep/.page-container .van-nav-bar .van-nav-bar__text {
  color: white;
}
/deep/.page-container .van-nav-bar .van-nav-bar__title {
  color: white;
}
.table-container table {
  width: auto;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.table-container th, td {
  min-width: 30vw; /* 最小宽度 */
  max-width: 30vw; /* 最大宽度 */
  width: 30vw; /* 固定宽度 */
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
  white-space: normal; /* 允许换行 */
  word-break: break-all; /* 允许单词断行 */
}
.table-container thead th {
  background-color: #f7f8fa;
  position: sticky;
  top: 0;
  z-index: 1;
}
.van-grid-item img {
  display: block;
  width: 100%;
  height: 100%;
}
/deep/.page-container .van-dialog {
  padding: 12px !important;
}
/deep/.page-container .van-dialog .van-dialog__header {
  padding: 8px 0 16px 0 !important;
  font-weight: 700;
}
.van-cell{
  padding: 10px 6px;
}
.totalScore{
  color: #bb2f25;
  font-size: 20px;
  font-family: Silom,sans-serif;
}
.title-class{
  text-align: right;
  justify-content: flex-end;
  flex: 2;
}
.value-class{
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
}
.index-title-class{
  text-align: left;
  justify-content: left;
  flex: 5;
}
.index-value-class{
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
}
.custom-border-cell {
  width: 100%;
  border: 1px solid #efefef !important;
  border-radius: 1px !important;
}
.custom-border-cell::after {
  display: none !important;
}
/* van-collapse-item标题栏背景色 */
/deep/ .van-collapse-item__title {
  border: #dddddd solid 1px;
  background-color: white;
}
/deep/ .van-collapse-item__value {
  color: #bb2f25 !important;
}

/deep/ .van-nav-bar__content{
  background-color: #bb2f25 !important;
}
/deep/ .van-nav-bar__title {
  color: white !important;
}
/deep/ .van-nav-bar__title  {
  max-width: 100%;
}
</style>
