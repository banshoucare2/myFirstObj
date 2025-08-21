<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-nav-bar v-if="showTitle" :title="handleTitle" fixed style="z-index: 9999;" />
    <van-divider>{{ performance.title }}</van-divider>
    <van-sticky>
      <van-cell-group :style="{paddingTop:10}" v-if="performance.performId">
        <van-cell title="考核对象" :value="performance.targetName+''" value-class="value-class" title-class="title-class"/>
        <van-cell title="所属部门" :value="performance.targetDeptName+'   '"  value-class="value-class" title-class="title-class"/>
        <van-cell title="填报截止日期" :value="performance.fillEndTime+'   '"  value-class="value-class" title-class="title-class"/>
        <van-cell title="总分" :value="performance.totalScore" value-class="totalScore" label-class="value-class" title-class="title-class"/>
      </van-cell-group>
    </van-sticky>
    <van-form @submit="onSubmit" v-if="performance.performId">
      <div  :key="i" v-for="(type,i) in performance.performTypeList">
        <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">{{ type.typeName+('（权重：'+(type.typeWeight?jx.floatToPercent(type.typeWeight):'无占比')+'）') }}</van-divider>
        <van-collapse v-model="type.activeNames">
          <van-collapse-item :title-style="{'text-align': 'left','flex': '0 0 60%','max-width': '60%',}"
                             :value-style="{'text-align': 'right','flex': '1'}"
                             icon="passed" :title="''+index.indexName" :name="j+''"
                             :key="index.indexId" v-for="(index,j) in type.performIndexList">
            <template #value>
              <span class="custom-value" style="color: #bb2f25;font-weight: bold">{{ (index.indexScoreUpdate?index.indexScoreUpdate:'暂无') }}</span>
            </template>
            <div>
              <van-cell-group :style="{paddingTop:10}">
                <van-cell title="指标占比" :value="index.indexWeight" value-class="value-class" title-class="title-class" />
                <van-cell title="目标值" :value="index.targetValue" value-class="value-class" title-class="title-class" />
                <van-cell title="完成情况说明" :value="index.remark?index.remark:'未填写'" value-class="value-class" title-class="title-class"/>
                <div :key="'bc'+k" v-for="(basic,k) in index.performBasicIndexList" style="border: #efefef solid 1px">
                  <van-cell :label="basic.basicName" :title="'基础指标'+(k+1)"
                            value-class="index-value-class" title-class="index-title-class" class="custom-border-cell">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                      <span class="custom-title">{{ '基础指标'+(k+1) }}</span>
                      <van-tag type="info" v-if="basic.dataSource && basic.dataSource === 0">系统提取</van-tag>
                      <van-tag type="success" v-else>手动录入</van-tag>
                    </template>
                  </van-cell>
                  <van-cell title="填报值" :value="basic.basicValue"
                            value-class="index-value-class" title-class="title-class">
                  </van-cell>
                  <van-cell title="如需调整"
                            value-class="input-value-class" title-class="title-class">
                    <van-field v-model="basic.basicValueUpdate" placeholder="如需调整请输入" input-align="center"
                               :min="0" @input="calculate(type,index)" input-width="60px" />
                  </van-cell>
                </div>
              </van-cell-group>
            </div>
          </van-collapse-item>
        </van-collapse>
        <div style="padding: 3px">
          <van-divider :style="{ color: '#bb2f25', borderColor: 'coral' }">调整记录</van-divider>
          <van-list
            v-if="performance && performance.modifyLogList"
            v-model="loading"
            :finished="true"
            :finished-text="(performance && performance.modifyLogList && performance.modifyLogList.length>0)?'':'没有更多了'">
            <van-cell v-for="(item,mi) in performance.modifyLogList" :key="mi" >
              <div style="display: flex;justify-content: space-between" class="modify-name">
                <span>{{item.basicName}}</span>
                <span>修改前：<span>{{item.valueBefore}}</span>{{' '}}修改后：<span style="color: #bb2f25;">{{item.valueAfter}}</span></span>
              </div>
              <div style="display: flex;justify-content: space-between" class="modify-text">
                <span>{{item.updateTime}}</span>
                <span>调整人：{{item.modifyUserName?item.modifyUserName:'未知'}}</span>
              </div>
            </van-cell>
          </van-list>
          <div v-else>暂无调整记录</div>
        </div>
      </div>
    </van-form>
    <van-skeleton title :row="10" v-if="!performance || !performance.performId"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getPerformance } from "@/service/performance";
import { calculate } from "@/service/performance";
import jx from "@/utils/jx";
import cookies from "js-cookie";
import {handleSingleAppr} from "@/service/performance";

export default {
  // 单个审核
  name: 'single',
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: true }
  },
  data () {
    return {
      title: '绩效审核',
      loading: false,
      performance:{},
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.$on('submit', this.onSubmit)
    this.init()
  },
  computed: {
    jx() {
      return jx
    },
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
      //businessKey = '2011412199305777155';
      console.log('businessId:',businessId)
      const response = await getPerformance(businessId)
      console.log('response:',response)
      if (response && response.code === 0) {
        this.performance = response.data;
        this.title = this.performance.title;
        this.performance.taskId = this.task.id;
        if(this.performance){
          this.performance.performTypeList.forEach((t) => {
            if (t.performIndexList) {
              t.performIndexList.forEach((i) => {
                this.calculate(t,i);
              });
            }
          });
        }
      }
    },
    async calculate(type,index){
      console.log("计算指标")
      const basicIndexValueList = index.performBasicIndexList.filter(i => i.basicValueUpdate !== null && i.basicValueUpdate !== undefined);
      if(basicIndexValueList.length !== index.performBasicIndexList.length){
        console.log("指标不齐直接跳过..")
        return;
      }
      //{indexId: row.indexId,typeWeight:row.typeWeight,targetValue: row.targetValue,basicList: basicIndexValueList,calculateType:0
      const param = {
        indexId: index.indexId,
        typeWeight:type.typeWeight,
        targetValue: index.targetValue,
        basicList: index.performBasicIndexList,
        calculateType:1
      };
      const response = await calculate(param)
      console.log('response:',response)
      if (response && response.code === 0) {
        const data = response.data;
        this.performance.performTypeList.forEach((t) =>{
          if(t.performIndexList){
            t.performIndexList.forEach((i) =>{
              if(i.indexId === index.indexId){
                i.indexValueUpdate = data.indexValue;
                i.indexRateUpdate = data.indexRate;
                i.indexScoreUpdate = data.indexScore;
                i.valueFormulaProcess = data.valueFormulaProcess;
                i.rateFormulaProcess = data.rateFormulaProcess;
                i.scoreFormulaProcess = data.scoreFormulaProcess;
              }
            });
          }
        });
        console.log('XXXXXXX',this.performance.performTypeList)
        //刷新总分
        this.refreshTotalScore();
      }
    },
    refreshTotalScore(){
      console.log("刷新绩效总分....");
      let totalScore = 0;
      this.performance.performTypeList.forEach((t) =>{
        if(t.performIndexList) {
          t.performIndexList.forEach((i) => {
            totalScore += jx.percentToFloat(i.indexScoreUpdate);
          });
        }
      });
      const totalScoreUpdate = jx.floatToPercent(totalScore);
      this.performance.totalScore = totalScoreUpdate;
    },
    async onSubmit(){
      if(this.performance){
        console.log("正常提交..")
        const response = await handleSingleAppr({ ...this.performance,
          taskId: this.task.id,
          currentUserId: this.task.assignee
        })
        if (response && response.code === 0) {
          cookies.set('taskId', '')
          this.$router.push({path: '/dingding/index'})
        }else{
          this.$toast(response.message)
        }
      }
    }
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
.input-value-class{
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  margin: 4px;
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
