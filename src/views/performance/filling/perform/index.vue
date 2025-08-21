<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-nav-bar v-if="showTitle" :title="handleTitle" fixed style="z-index: 9999;"/>
    <van-divider v-if="false">{{ performance.title }}</van-divider>
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
                <van-cell title="完成情况说明" value-class="input-value-class" title-class="title-class">
                  <van-field v-model="index.remark" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入完成情况说明" show-word-limit/>
                </van-cell>
                <div :key="'bc'+k" v-for="(basic,k) in index.performBasicIndexList">
                  <van-cell :label="basic.basicName" :title="'基础指标'+(k+1)"
                            value-class="index-value-class" title-class="index-title-class" class="custom-border-cell">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                      <span class="custom-title">{{ '基础指标'+(k+1) }}</span>
                      <span>
                        <van-tag type="success" v-if="basic.dataSource && basic.dataSource === 1">手动录入</van-tag>
                        <van-tag type="primary" v-else>系统提取</van-tag>
                      </span>
                    </template>

                    <van-field v-if="basic.dataSource && basic.dataSource === 1" input-align="center" v-model="basic.basicValue"
                               :min="0" input-width="60px" class="field-value-class" button-size="22" @input="calculate(type,index,basic)" />
                    <span v-else>{{basic.basicValue}}</span>
                  </van-cell>
                </div>
              </van-cell-group>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </van-form>
    <van-skeleton title :row="10" v-if="!performance || !performance.performId"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {getPerformance} from "@/service/performance";
import {calculate} from "@/service/performance";
import jx from "@/utils/jx";
import cookies from "js-cookie";
import {handlePerformance, tempPerformance} from "../../../../service/performance";

export default {
  // 绩效填报
  name: 'filling',
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: true }
  },
  data () {
    return {
      title: '绩效填报',
      performance:{},
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.init()
    this.$on('submit', this.onSubmit)
    this.$on('draft', this.tempSubmit)
  },
  watch: {

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
      //businessKey = '2011412199423217673';
      console.log('businessId:',businessId)
      console.log('task:',this.task)
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
    async calculate(type, index, basic) {
      console.log("计算指标")
      if (basic != null && !basic.basicValue) {
        console.log("无值直接跳过..")
        return;
      }
      const param = {
        indexId: index.indexId,
        typeWeight: type.typeWeight,
        targetValue: index.targetValue,
        basicList: index.performBasicIndexList,
        calculateType: 0
      };
      const response = await calculate(param)
      console.log('response:', response)
      if (response && response.code === 0) {
        const data = response.data;
        this.performance.performTypeList.forEach((t) => {
          if (t.performIndexList) {
            t.performIndexList.forEach((i) => {
              if (i.indexId === index.indexId) {
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
        console.log('XXXXXXX', this.performance.performTypeList)
        //刷新总分
        this.refreshTotalScore();
      }
    },
    refreshTotalScore() {
      console.log("刷新绩效总分....");
      let totalScore = 0;
      this.performance.performTypeList.forEach((t) => {
        if (t.performIndexList) {
          t.performIndexList.forEach((i) => {
            totalScore += jx.percentToFloat(i.indexScoreUpdate);
          });
        }
      });
      this.performance.totalScore = jx.floatToPercent(totalScore);
    },
    async tempSubmit(){
      const userId = this.task.assignee;
      const response = await tempPerformance({...this.performance,currentUserId:userId})
      console.log('response:', response)
      if (response && response.code === 0) {
        cookies.set('taskId', '')
        this.$router.push({path: '/dingding/index'})
      }else{
        this.$toast(response.message);
      }
    },
    async onSubmit() {
      let check = true;
      this.performance.performTypeList.forEach((t) => {
        if (t.performIndexList) {
          t.performIndexList.forEach((i) => {
            i.performBasicIndexList.forEach((b) => {
              if (b.dataSource === 1 && !b.basicValue) {
                check = false;
              }
            });
          });
        }
      });
      if (check) {
        console.log("正常提交..")
        const userId = this.task.assignee;
        const response = await handlePerformance({...this.performance,currentUserId:userId})
        console.log('response:', response)
        if (response && response.code === 0) {
          cookies.set('taskId', '')
          this.$router.push({path: '/dingding/index'})
        }else{
          this.$toast(response.message);
        }
      } else {
        this.$toast('请填报所有需要手工填报的指标项');
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
/deep/ .page-container .van-nav-bar {
  background-color: var(--navbar-color, #bb2f25);
}
/deep/ .page-container .van-nav-bar .van-nav-bar__arrow {
  color: white;
}
/deep/ .page-container .van-nav-bar .van-nav-bar__text {
  color: white;
}
/deep/ .page-container .van-nav-bar .van-nav-bar__title {
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

/deep/ .page-container .van-dialog {
  padding: 12px !important;
}

/deep/ .page-container .van-dialog .van-dialog__header {
  padding: 8px 0 16px 0 !important;
  font-weight: 700;
}

.van-cell {
  padding: 10px 6px;
}

.totalScore {
  color: #bb2f25;
  font-size: 20px;
  font-family: Silom, sans-serif;
}

.title-class {
  text-align: right;
  justify-content: flex-end;
  flex: 2;
}

.value-class {
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
}

.index-title-class {
  text-align: left;
  font-weight: bold;
  justify-content: left;
  flex: 2;
}

.index-value-class {
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
}

.input-value-class {
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  margin: 4px;
}
.field-value-class {
  font-weight: bold;
  text-align: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
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
