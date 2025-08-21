<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-nav-bar v-if="showTitle" :title="handleTitle" fixed style="z-index: 9999;" />
    <van-divider>调整绩效请移至PC端处理</van-divider>
    <van-collapse v-model="activeNames">
      <van-collapse-item :title-style="{'text-align': 'left','flex': '0 0 60%','max-width': '60%',}"
                         :value-style="{'text-align': 'right','flex': '1'}"
                         icon="manager-o" :title="''+perform.userName" :name="perform.userId"
                         :key="i" v-for="(perform,i) in performList">
        <template #value>
          <span>绩效指标：<span class="custom-value" style="color: #bb2f25;font-weight: bold">{{ (perform.totalFactor) }}</span></span>
        </template>
        <div>
          <van-cell-group :style="{paddingTop:10}">
            <van-cell title="部门" :value="perform.deptName" value-class="value-class" title-class="title-class" />
            <van-cell title="职位" :value="perform.dutyName" value-class="value-class" title-class="title-class" />
            <van-cell title="公司级系数" :value="perform.companyFactor" value-class="value-class" title-class="title-class" />
            <van-cell title="部门级系数" :value="perform.departmentFactor" value-class="value-class" title-class="title-class" />
            <van-cell title="岗位级系数" :value="perform.personalFactor" value-class="value-class" title-class="title-class" />
            <van-cell title="绩效系数" :value="perform.totalFactor" value-class="value-class" title-class="title-class" />
            <van-cell title="轧差系数" :value="perform.nettingFactor" value-class="value-class" title-class="title-class" />
          </van-cell-group>
        </div>
      </van-collapse-item>
    </van-collapse>
    <van-skeleton title :row="10" v-if="!performList"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getSum, getSumList } from "@/service/performance";

export default {
  name: 'final', // 人力、领导终审
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: true }
  },
  data () {
    return {
      title: '绩效审核',
      loading: false,
      sum: {},
      activeNames: [],
      performList: [],
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
      let businessId = this.businessKey;
      console.log('businessId:',businessId)
      const sumRes = await getSum(businessId)
      console.log('sumRes:',sumRes)
      if (sumRes && sumRes.code === 0) {
        this.sum = sumRes.data;
        this.title = this.sum.version+"通盛绩效完成情况明细表";
      }
      const response = await getSumList({sumId:businessId})
      console.log('response:',response)
      if (response && response.code === 0) {
        this.performList = response.data;
      }
    },
  }
}
</script>

<style scoped>
.page-container {
  padding-top: 46px;
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
