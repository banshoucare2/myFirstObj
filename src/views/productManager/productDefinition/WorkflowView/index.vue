<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }" >
    <!-- 不带变更 -->
    <van-nav-bar :title="handleTitle" fixed style="z-index: 9999;" />
    <div v-if="switchPage === 'detailPage'">
      <van-tabs v-model="activeTab" @change="handleTabChange" color="#f6cacf" class="workflow-container">
        <van-tab title="定义详情" style="padding-top: 46px;">
          <DefinitionDetail ref="detailRef" :businessKey="businessKey" :showTitle="false" />
        </van-tab>
        <van-tab v-if="showPolicyDetail" title="申请流程信息">
          <PolicyDetail ref="policyRef" :businessKey="policyApplyId" :showTitle="false" />
        </van-tab>
      </van-tabs>
      <!-- <van-swipe ref="swipe" class="swipe-container" :loop="false" :show-indicators="false" @change="handleSwipeChange">
        <van-swipe-item>
          <DefinitionDetail ref="detailRef" :businessKey="businessKey" :showTitle="false" />
        </van-swipe-item>
        <van-swipe-item v-if="showPolicyDetail">
          <PolicyDetail ref="policyRef" :businessKey="policyApplyId" :showTitle="false" />
        </van-swipe-item>
      </van-swipe> -->
    </div>
    <!-- 带变更的 -->
    <div v-if="switchPage === 'changePage'">
      <van-tabs v-model="activeTab" @change="handleTabChange" color="#f6cacf" class="workflow-container">
        <van-tab title="变更记录" style="padding-top: 46px;">
          <!-- 变更记录 -->
          <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">变更记录</van-divider>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th v-for="(row, index) in ruleForm.headers" :key="index">{{ row }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in ruleForm.changeTableData" :key="rowIndex">
                  <td>{{ row.changeItem }}</td>
                  <td>{{ row.oldValue }}</td>
                  <td>{{ row.newValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">变更说明</van-divider>
          <van-cell title="变更说明" is-link arrow-direction="down" :value="ruleForm.remark" />
        </van-tab>
        <van-tab title="变更后产品详情" style="padding-top: 46px;">
          <DefinitionDetail ref="detailRef" :businessKey="businessKey" :showTitle="false" />
        </van-tab>
        <van-tab v-if="showPolicyDetail" title="申请流程信息">
          <PolicyDetail ref="policyRef" :businessKey="policyApplyId" :showTitle="false" />
        </van-tab>
      </van-tabs>
      <!-- <van-swipe ref="swipe" class="swipe-container" :loop="false" :show-indicators="false" @change="handleSwipeChange">
        <van-swipe-item>
          <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">变更记录</van-divider>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th v-for="(row, index) in ruleForm.headers" :key="index">{{ row }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in ruleForm.changeTableData" :key="rowIndex">
                  <td>{{ row.changeItem }}</td>
                  <td>{{ row.oldValue }}</td>
                  <td>{{ row.newValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">变更说明</van-divider>
          <van-cell title="变更说明" is-link arrow-direction="down" :value="ruleForm.remark" />
        </van-swipe-item>
        <van-swipe-item>
          <DefinitionDetail ref="detailRef" :businessKey="businessKey" :showTitle="false" />
        </van-swipe-item>
        <van-swipe-item v-if="showPolicyDetail">
          <PolicyDetail ref="policyRef" :businessKey="policyApplyId" :showTitle="false" />
        </van-swipe-item>
      </van-swipe> -->
    </div>
  </div>
</template>

<script>
import DefinitionDetail from '../SubWarp/Detail'
import PolicyDetail from '../../productPolicy/Detail/index'
import { qryProductSource, changeRecordList } from '@/service/product'
export default {
  name: 'product-definition-workflow', // 产品定义工作流
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} }
  },
  components: { DefinitionDetail, PolicyDetail },
  data() {
    return {
      activeTab: 0,
      SCREEN_HEIGHT: '',
      ruleForm: {
        headers: [
          '变更项',
          '变更前',
          '变更后',
        ],
        changeTableData: [],
        remark: ''
      },
      showPolicyDetail: false, // 是否存在关联的产品政策
      policyApplyId: ''
    }
  },
  watch: {
    'switchPage': {
      handler(val) {
        if (val === 'changePage') {
          this.changeRecordList()
        }
      },
      immediate: true
    }
  },
  computed: {
    switchPage() {
      if (this.task && this.task.variables && this.task.variables.processType === '1') {
        return 'detailPage'
      } else if (this.task && this.task.variables && this.task.variables.processType === '2' && this.task.variables.isChangeElement === '1') {
        return 'changePage'
      } else {
        return ''
      }
    },
    handleTitle() {
      if (this.task && this.task.variables && this.task.variables.subject) {
        return this.task.variables.subject
      } else {
        return ''
      }
    },
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
  },
  async mounted() {
    this.showPolicyDetail = false
    this.policyApplyId = ''
    if (!this.businessKey) return
    const response = await qryProductSource(this.businessKey).catch((err) => console.log(err))
    if (response && response.code == 0) {
      if (response.data !== '') {
        this.showPolicyDetail = true
        this.policyApplyId = response.data
      }
    }
  },
  methods: {
    async changeRecordList() {
      const params = {
        finaProductIdAf: this.businessKey
      }
      this.$store.dispatch('loading/show')
      const response = await changeRecordList(params).catch((err) => console.log(err));
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        this.ruleForm.changeTableData = response.data.results || []
        if (this.ruleForm.changeTableData.length > 0) {
          this.ruleForm.remark = this.ruleForm.changeTableData[0].remark || ''
        }
      }
    },
    handleTabChange(index) {
      // this.$refs.swipe.swipeTo(index);
    },
    // handleSwipeChange(index) {
    //   this.activeTab = index;
    // }
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
/deep/.workflow-container >.van-tabs__wrap {
  position: fixed;
  top: 46px;
  z-index: 999;
  width: 100%;
}

.table-container {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid #ddd;
}
.table-container table {
  width: 100%;
  border-collapse: collapse;
}
.table-container th, td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}
.table-container thead th {
  background-color: #f7f8fa;
  position: sticky;
  top: 0;
  z-index: 1;
}
.tabs {
  height: 44px;
}
.swipe-container {
  flex: 1;
  background: #f7f8fa;
}
</style>