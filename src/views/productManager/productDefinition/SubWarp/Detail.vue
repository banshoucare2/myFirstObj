<template>
  <div class="main-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-nav-bar v-if="showTitle" :title="handleTitle" fixed style="z-index: 9999;" />
    <!-- 融资要素 -->
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">融资要素</van-divider>
    <van-cell-group>
      <van-cell title="产品类型" :value="$getValue(valueList.PRODUCT_TYPE, ruleForm.businessClassify)" />
      <van-cell title="产品属性" :value="$getValue(valueList.PRODUCT_ATTRIBUTES, ruleForm.isFlexible)" />
      <van-cell v-if="ruleForm.dbrzStr === '无'" title="打包融资项" :value="ruleForm.dbrzStr" />
      <van-cell v-else title="打包融资项" is-link @click="showIsDbrz = true" :value="ruleForm.dbrzStr" />
      <van-action-sheet v-model="showIsDbrz" :actions="ruleForm.dbrzItem" />
      <van-cell v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName) && ruleForm.isXzrzbl === '1'" title="融资比例(%)" :value="ruleForm.rzbl" />
      <van-cell v-if="['lingshou_LH'].includes(productDiyName)" title="市场利率IRR(%)" :value="ruleForm.irr" />
      <van-cell v-if="['lingshou_DZ'].includes(productDiyName) && ruleForm.isXzrzbl === '0'" title="首付比例下限(%)" :value="ruleForm.downpaymentRateMin" />
      <van-cell v-if="['lingshou_LH'].includes(productDiyName) && ruleForm.isXzrzbl === '0'" title="首期比例下限(%)" :value="ruleForm.firperiodRateMin" />
      <van-cell v-if="['pifa', 'lingshou_DZ'].includes(productDiyName)" title="产品利率(%)" :value="ruleForm.loanRate" />
      <van-cell title="融资期限(月)" :value="ruleForm.loanPeriodTypeStr" />
      <van-cell v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" title="返利后收益率(%)" :value="ruleForm.afterRebateIrr" />
      <van-cell v-if="['pifa'].includes(productDiyName)" title="计息方式" :value="$getValue(valueList.PRODUCT_CALC_INTEREST, ruleForm.interestType)" />
      <van-cell v-if="['pifa'].includes(productDiyName)" title="罚息利率(%)" :value="ruleForm.punishRate" />
      <van-cell title="留购价款是否参与收益率计算" :value="ruleForm.isDepoistCalIrr === '1' ? '是' : ruleForm.isDepoistCalIrr === '0' ? '否' : '-'" />
      <van-cell title="担保模式" :value="$getValue(valueList.MODE_TYPE, ruleForm.modeType)" />
      <!-- 还款日相关 -->
      <van-cell title="还款日类型" :value="handleRefundDayType(ruleForm.refundDayType)" />
      <van-cell v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName) && ruleForm.refundDayType.includes('2')" title="固定日还款规则" :value="$getValue(valueList.repayDateConfigList, ruleForm.productDateConfigId)" />
      <van-cell v-if="ruleForm.refundDayType.includes('1')" title="对日还款是否首月按日计息" :value="ruleForm.isFirmonthDailyCal === '1' ? '是' : ruleForm.isFirmonthDailyCal === '0' ? '否' : '-'" />
    </van-cell-group>
    <!-- 还款方式 -->
    <van-divider v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">还款方式</van-divider>
    <van-collapse v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" v-model="ruleForm.activeNamesHK">
      <van-collapse-item v-for="(item, index) in ruleForm.activeNamesHKItems" :key="index" :title="item.title" :name="index + 1" :is-link="item.isLink" :readonly="!item.isLink">
        <van-cell v-for="(im, i) in item.items" :key="i" :title="handleDynamicTitle(im)" :value="handleDynamicValue(im)" />
      </van-collapse-item>
    </van-collapse>
    <!-- 缴费类型 -->
    <van-divider v-if="ruleForm.tprFinaProductFees.length > 0" :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">缴费类型</van-divider>
    <van-cell-group>
      <van-row v-for="(item, index) in ruleForm.tprFinaProductFees" :key="index" justify="center" style="margin-bottom: 10px;">
        <van-col span="8">{{ item.feeTypeDesc }}</van-col>
        <van-col span="8">{{ item.amountDesc }}</van-col>
        <van-col span="8">{{ item.isAllowReducePayDesc }}</van-col>
      </van-row>
    </van-cell-group>
    <!-- 账期产品 -->
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">账期产品</van-divider>
    <van-cell-group>
      <van-cell title="是否关联IRR试算" :value="ruleForm.isZqEffectIrr === '1' ? '是' : ruleForm.isZqEffectIrr === '0' ? '否' : '-'" />
      <div v-if="ruleForm.isZqEffectIrr === '1'">
        <van-row v-for="(item, index) in ruleForm.tprProductFoundConfigs" :key="index" class="vanRow">
          <van-col span="8">
            {{ $getValue(valueList.PRODUCT_PERIOD_TYPE, item.periodType) }}
          </van-col>
          <van-col span="8">
            第{{ item.period }}期
          </van-col>
          <van-col span="8">
            放款{{ Number(item.scale * 100).toFixed(2) }}%
          </van-col>
        </van-row>
      </div>
    </van-cell-group>
    <!-- 结清规则 -->
    <van-divider v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">结清规则</van-divider>
    <van-collapse v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" v-model="activeNames">
      <van-collapse-item title="提前结清规则" name="1" :value="ruleForm.clearDetail.clearName">
        <van-row class="vanRow">
          <van-col span="12">
            <van-cell v-if="ruleForm.clearDetail.isFillInte === '1'" title="补充利息：" :value="`${ruleForm.clearDetail.firstNPeriod}期`" />
            <van-cell v-else title="补充利息：" value="无" title-style="flex: 8;" />
          </van-col>
          <van-col span="12">
            <van-cell v-if="ruleForm.clearDetail.isExemptLoss === '1'" title="免除损失金：" :value="`前${ruleForm.clearDetail.beforeNum}${ruleForm.clearDetail.type === '1' ? '期' : '天'}`" />
            <!-- <van-cell v-if="ruleForm.clearDetail.isExemptLoss === '1'" title="免除损失金：" :value="`前${ruleForm.clearDetail.beforeNum}${ruleForm.clearDetail.type === '1' ? '期' : '天'}，后${ruleForm.clearDetail.afterNum}${ruleForm.clearDetail.type === '1' ? '期' : '天'}`" /> -->
            <van-cell v-else title="免除损失金：" value="无" title-style="flex: 8;" />
          </van-col>
        </van-row>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th v-for="(row, index) in ruleForm.headers" :key="index">{{ row }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in ruleForm.clearDetail.clearTableData" :key="rowIndex">
                <td>{{ `${row['clearStartMonth']}-${row['clearEndMonth']}` }}</td>
                <td>{{ row.clearRate }}</td>
                <td>{{ $getValue(valueList.CALCULATION_METHOD, row['calculationMethod']) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </van-collapse-item>
    </van-collapse>
    <!-- 贴息配置 -->
    <van-divider v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">贴息配置</van-divider>
    <van-cell v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" title="是否贴息" :value="ruleForm.isInterestSubsidy === '1' ? '是' : '否'" />
    <van-cell v-if="['lingshou_DZ', 'lingshou_LH'].includes(productDiyName)" title="是否免息" :value="ruleForm.isInterestFree === '1' ? '是' : '否'" />

    <!-- 产品定义附件 -->
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">附件信息</van-divider>
    <van-tabs v-model="active" @change="onClickTab" color="#f6cacf">
      <van-tab v-for="item in documentTypeOptions" :key="item.id" :title="item.label">
        <van-grid :column-num="3">
          <van-grid-item v-for="(file, i ) in uploadImages" :key="file.id">
            <template v-if="file.isImage">
              <van-image width='100' height="100" fit="contain" lazy-load :src="file.filePath" @click="showPreview(i)">
                <template v-slot:error>加载失败</template>
              </van-image>
            </template>
            <template v-else>
              <!-- 文件图标和下载 -->
              <div class="file-container" @click="chooseFile(file)">
                <div class="file-icon" :class="'file-type-' + getFileExtension(file.filePath)">
                  {{ file.fileName || getFileExtension(file.filePath) }}
                </div>
              </div>
            </template>
          </van-grid-item>
        </van-grid>
      </van-tab>
    </van-tabs>
    <!-- 图片预览 -->
    <van-image-preview v-model="showImg" :images="imgUrls" :close-on-click-image="false" :start-position="showImgIndex">
      <template #default="{ image }">
        <div class="image-preview-info">
          <p class="image-name">{{ image.fileName }}</p>
        </div>
      </template>
    </van-image-preview>
    <!-- 非图片选择下载 -->
    <van-action-sheet v-model="showFileDown" :actions="[{ name: '预览', value: '1' }]" cancel-text="取消" close-on-click-action @select="onSelect" />
    <!-- 预览弹窗 -->
    <van-popup v-model="showPreviewUrl" position="bottom" round closeable style="height: 90vh; width:100vw;overflow: hidden;" @click-overlay="cancelPreviewUrl"
    @click-close-icon="cancelPreviewUrl">
      <iframe
        v-if="this.fileUrl"
        :src="this.fileUrl"
        style="width: 90vw;height: 80vh;margin-top:6vh;"
      ></iframe>
    </van-popup>

    <div style="width: 100%; height: 50px;"></div>
  </div>
</template>

<script>
import { getBatchValuesList } from '@/service/common'
import { detailProductDefinition, queryProductParamList, productClearDetail, productClearDetailList, queryInterestFreeList, queryDocument, queryRepayDateConfigList } from '@/service/product'

const dynamicFields = [
  {
    label: '平息规则',
    prop: 'pxType'
  },
  {
    label: '还款频率',
    prop: 'repayFrequn'
  },
  {
    label: 'N的上限(等额平息)',
    prop: 'nPeriodPx'
  },
  {
    label: 'N的上限(等额本息)',
    prop: 'nPeriodDb'
  },
  {
    label: '缓供期数',
    prop: 'hgPeriod'
  },
  {
    label: '尾款比例',
    prop: 'finalPaymentRate'
  },
  {
    label: '展期期数',
    prop: 'finalPaymentPeriod'
  },
  {
    label: '尾款月费率',
    prop: 'finalPaymentMonthRate'
  }
]

export default {
  name: 'product-definition-detail', // 产品定义详情
  props: {
    businessKey: { type: String, default: '' },
    showTitle: { type: Boolean, default: true }
  },
  data () {
    return {
      title: '产品定义',
      showIsDbrz: false, // 融资项弹出层
      activeNames: [], // 结清规则
      valueList: {
        PRODUCT_APPLY_STATUS: [], // 状态
        ASSET_TYPE: [], // 资产类型(商用车/乘用车)
        PRODUCT_BUSINESS_TYPE: [], // 业务类型(自助/助贷)
        PRODUCT_CATEGORY: [], // 产品类别(商用车批发/商用车零售/乘用车零售/乘用车批发)
        PRODUCT_TYPE: [], // 产品类型(零售/批发)
        BUSINESS_SCEN: [], // 场景
        PRODUCT_ATTRIBUTES: [], // 产品属性(定制/灵活)
        REFUND_TYPE: [], // 还款方式
        LOAN_RANGE: [], // 融资范围
        MODE_TYPE: [], // 担保模式
        CUST_TYPE: [], // 适用客户
        PRODUCT_REPAY_DAY: [], // 还款日
        PRODUCT_CALC_INTEREST: [], // 计息方式
        PRODUCT_REPAY_METHOD: [], // 还款方式
        PARAM_UNIT: [], // 单位
        CALCULATION_METHOD: [], // 提前结清-计算方式
        PRODUCT_PERIOD_TYPE: [], // 期数类型
        PRODUCT_FLAT_INTEREST_RULE: [], // 平息规则
        repayDateConfigList: [], // 固定还款日规则
      },
      ruleForm: {
        finaProductId: '',
        finaProductCode: '',
        finaProductName: '',
        /* 融资要素 */
        businessClassify: '',
        isFlexible: '',
        dbrzStr: '', // 打包融资项
        dbrzItem: [], // 打包融资项
        isXzrzbl: '', //是否限制融资比例
        rzbl: '', // 融资比例
        irr: '', // 融资比例
        downpaymentRateMin: '', // 首付比例下限
        firperiodRateMin: '', // 首期比例下限
        loanRate: '',
        loanPeriodTypeStr: '',
        refundDayType: '', // 还款日类型
        productDateConfigId: '', // 固定日还款规则
        interestType: '', // 计息方式
        repayMethods: '', // 还款方式（隐藏）
        activeNamesHK: [],
        activeNamesHKItems: [], // 还款方式
        punishRate: '',
        isFirmonthDailyCal: '',
        isDepoistCalIrr: '',
        modeType: '',
        afterRebateIrr: '',
        /* 还款方式动态字段 */
        pxType: '',
        repayFrequn: '',
        nPeriodPx: '',
        nPeriodDb: '',
        hgPeriod: '',
        finalPaymentRate: '',
        finalPaymentPeriod: '',
        finalPaymentMonthRate: '',
        /* 缴费类型 */
        feesTableData: [],
        tprFinaProductFees: [],
        /* 账期产品 */
        isZqEffectIrr: '',
        tprProductFoundConfigs: [], // 账期表格
        /* 结清规则 */
        clearDetail: {
          clearName: '', // 规则名称
          isFillInte: '', // 是否补充前N期利息：
          firstNPeriod: '',
          isExemptLoss: '', // 是否免除损失金
          beforeNum: '', // 前
          afterNum: '', // 尾
          type: '', // 类型
          clearTableData: [], // 明细表
        },
        headers: [
          '提前结清期数(月)',
          '损失金比例(%)',
          '方式'
        ],
        /* 贴息配置 */
        isInterestSubsidy: '', // 是否贴息
        isInterestFree: '', // 是否免息
      },
      /*  */
      active: '',
      uploadImages: [],
      imgUrls: [],
      showImg: false,
      showImgIndex: null,
      documentTypeOptions: [],
      imageTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'], // 图片类型
      showFileDown: false,
      /* 在线预览 */
      currentUrl: '',
      fileUrl: '',
      showPreviewUrl: false,
      previewLoading: false,

    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.init()
  },
  computed: {
    handleTitle() {
      if (this.ruleForm.finaProductName) return this.title + '-' + this.ruleForm.finaProductName
      else return this.title
    },
    /* 产品定义三类：批发、零售灵活、零售定制 */
    productDiyName() {
      const { businessClassify, isFlexible } = this.ruleForm
      if (businessClassify === '2' && isFlexible === '1') {
        return 'pifa'
      } else if (businessClassify === '1' && isFlexible === '2') {
        return 'lingshou_LH'
      } else if (businessClassify === '1' && isFlexible === '1') {
        return 'lingshou_DZ'
      } else {
        ''
      }
    },
    /* 处理还款方式动态字段 */
    handleDynamicTitle() {
      return (prop) => {
        const findItem = dynamicFields.find(item => item.prop === prop)
        if (findItem) {
          return findItem.label
        } else {
          return ''
        }
      }
    },
    handleDynamicValue() {
      return (prop) => {
        if (prop === 'pxType' && this.valueList.PRODUCT_FLAT_INTEREST_RULE.length > 0) {
          return this.$getValue(this.valueList.PRODUCT_FLAT_INTEREST_RULE, this.ruleForm[prop])
        } else if (['repayFrequn', 'hgPeriod', 'finalPaymentPeriod'].includes(prop)) {
          return `${this.ruleForm[prop]}月`
        } else if (['finalPaymentRate', 'finalPaymentMonthRate'].includes(prop)) {
          return `${this.ruleForm[prop]}%`
        } else {
          return this.ruleForm[prop]
        }
      }
    },
    handleRefundDayType() {
      return (val) => {
        if (!val || !this.valueList.PRODUCT_REPAY_DAY || !this.valueList.PRODUCT_REPAY_DAY.length) return ''
  
        const tempArr = val.split(',')
        let labelArr = []
        tempArr.map(t => {
          const findItem = this.valueList.PRODUCT_REPAY_DAY.find(item => item.value === t)
          if (findItem) {
            labelArr.push(findItem.label)
          }
        })
        return labelArr.join('、')
      }
    }
  },
  methods: {
    async init() {
      if (this.businessKey) {
        this.ruleForm.finaProductId = this.businessKey
      }
      await this.getValuesList()
      this.queryDetail(this.ruleForm.finaProductId) // test
      this.queryRepayDateConfigList() // 查询固定还款日规则
    },
    async getValuesList(){
      /* 批量值列表 */
      const dictCodes = 'PRODUCT_CATEGORY,PRODUCT_BUSINESS_TYPE,BUSINESS_SCEN,ASSET_TYPE,PRODUCT_TYPE,PRODUCT_ATTRIBUTES,REFUND_TYPE,LOAN_RANGE,' +
      'MODE_TYPE,CUST_TYPE,PRODUCT_APPLY_STATUS,PRODUCT_REPAY_DAY,PRODUCT_CALC_INTEREST,PARAM_UNIT,CALCULATION_METHOD,PRODUCT_PERIOD_TYPE,' +
      'PRODUCT_FLAT_INTEREST_RULE,PRODUCT_REPAY_METHOD'
      this.$store.dispatch('loading/show')
      const response = await getBatchValuesList({ dictCodes }).catch((err) => console.log(err));
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        response.data.map(item => {
          this.valueList[item.dictCode].push(item)
        })
      }
    },
    /* 根据产品类型+产品属性查询对应缴费类型以及表格 */
    async queryParamsName() {
      const params = {
        businessClassify: this.ruleForm.businessClassify,
        isFlexible: this.ruleForm.isFlexible,
        pageIndex: 1,
        pageSize: 999999
      }
      this.$store.dispatch('loading/show')
      const response = await queryProductParamList(params).catch((err) => console.log(err));
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        let paramList = response.data.results || []
        paramList = paramList.filter(item => item.isEnable === '1')
        if (paramList.length) {
          this.ruleForm.feesTableData = paramList.map(item => {
            return {
              /* 编码 + 展示名称 */
              feeType: item.paramCode,
              feeTypeDesc: `${item.paramName}(${this.$getValue(this.valueList.PARAM_UNIT, item.paramUnit)})`,
              paramUnit: item.paramUnit
            }
          })
        }
      }
    },
    async productClearDetail(id) {
      this.$store.dispatch('loading/show')
      const response = await productClearDetail(id).catch((err) => console.log(err));
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        const clearData = response.data
        for (const key in clearData) {
          if (this.ruleForm.clearDetail.hasOwnProperty(key)) {
            this.ruleForm.clearDetail[key] = clearData[key];
          }
        }
      }
    },
    async productClearDetailList(id) {
      this.$store.dispatch('loading/show')
      const response = await productClearDetailList({ tprFinaProductClearId: id }).catch((err) => console.log(err));
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        const results = response.data.results || []
        if (results.length) {
          this.ruleForm.clearDetail.clearTableData = results.map(item => {
            return {
              ...item,
              clearRate: Number(item.clearRate * 100).toFixed(2)
            }
          })
        } else {
          this.ruleForm.clearDetail.clearTableData = []
        }
      }
    },
    /* 还款方式展示（零售定制、零售灵活）--- 根据传入计息方式以及还款方式组合 */
    allHKType(jx_arr, hk_arr) {
      console.log('jx_arr', jx_arr);
      console.log('hk_arr', hk_arr);
      if (!jx_arr.length || !this.valueList.PRODUCT_CALC_INTEREST.length || !this.valueList.PRODUCT_REPAY_METHOD.length) return []
      const jxArr = this.valueList.PRODUCT_CALC_INTEREST.filter(item => jx_arr.some(s => s === item.value))
      const hkArr = this.valueList.PRODUCT_REPAY_METHOD.filter(item => hk_arr.some(s => s === item.value))
      let temp = []
      jxArr.map(jx => {
        if (hkArr.length > 0) {
          hkArr.map(hk => {
            if (jx.value === '1')  { // 等额本息
              if (hk.value === '4') {
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['nPeriodDb', 'hgPeriod'],
                  isLink: true
                })
              } else if (hk.value === '11') {
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: [],
                  isLink: true
                })
              } else {
                const findItem = temp.find(item => item.title === jx.label)
                if (!findItem) {
                  temp.push({
                    title: `${jx.label}`,
                    items: [],
                    isLink: false
                  })
                }
              }
            } else if (jx.value === '2') { // 等额本金
              if (hk.value === '12') {
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: [],
                  isLink: true
                })
              }
            } else if (jx.value === '3') { // 等额平息
              if (hk.value === '1') { // 尾款
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType', 'finalPaymentRate', 'finalPaymentPeriod', 'finalPaymentMonthRate'],
                  isLink: true
                })
              } else if (hk.value === '2') { // 阶梯还款
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType'],
                  isLink: true
                })
              } else if (hk.value === '3') { // 春节不还款
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType'],
                  isLink: true
                })
              } else if (hk.value === '5') { // 不规则还款
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType', 'repayFrequn'],
                  isLink: true
                })
              } else if (hk.value === '6') { // 尾款+春节不还款
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType', 'finalPaymentRate', 'finalPaymentPeriod', 'finalPaymentMonthRate'],
                  isLink: true
                })
              } else if (hk.value === '7') { // 尾款+前N期不还本
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType', 'nPeriodPx', 'hgPeriod', 'finalPaymentRate', 'finalPaymentPeriod', 'finalPaymentMonthRate'],
                  isLink: true
                })
              } else if (hk.value === '8') { // 尾款+春节不还款+前N期不还本
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType', 'nPeriodPx', 'hgPeriod', 'finalPaymentRate', 'finalPaymentPeriod', 'finalPaymentMonthRate'],
                  isLink: true
                })
              } else if (hk.value === '10') { // 前N期不还本（等额平息）
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: ['pxType', 'nPeriodPx', 'hgPeriod'],
                  isLink: true
                })
              } else if (hk.value === '13') {
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: [],
                  isLink: true
                })
              }
            } else if (jx.value === '4') { // 先息后本
              if (hk.value === '14') {
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: [],
                  isLink: true
                })
              }
            } else if (jx.value === '5') { // 利随本清
              if (hk.value === '15') {
                temp.push({
                  title: `${jx.label}(${hk.label})`,
                  items: [],
                  isLink: true
                })
              }
            } else {
              const findItem = temp.find(item => item.title === jx.label)
              if (!findItem) {
                temp.push({
                  title: `${jx.label}`,
                  items: [],
                  isLink: false
                })
              }
            }
          })
        } else {
          temp.push({
            title: `${jx.label}`,
            items: [],
            isLink: false
          })
        }
      })
      return temp
    },
    /* 查询--政策附件（万网） */
    async queryDocumentDefined() {
      const params = { 
        businessId: this.ruleForm.finaProductId,
        documentType: '202', // 产品定义
      }
      this.$store.dispatch('loading/show')
      const response = await queryDocument(params).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        const resultData = response.data || []
        this.documentTypeOptions = this.handleDocument(resultData)
        console.log('【this.documentTypeOptions当前】', this.documentTypeOptions);
        if (this.documentTypeOptions.length > 0) {
          this.active = 0
          this.uploadImages = (this.documentTypeOptions[0].documents || []).map(item => {
            return {
              ...item,
              isImage: this.isImageFile(item.filePath)
            }
          })
          this.imgUrls = this.uploadImages.map(item => item.filePath)
        } else {
          this.uploadImages = []
          this.imgUrls = []
        }
      }
    },
    /* 图片预览 */
    showPreview(i) {
      this.showImg = true
      this.showImgIndex = i
    },
    // 判断文件是否为图片
    isImageFile(url) {
      const ext = this.getFileExtension(url);
      return this.imageTypes.includes(ext.toLowerCase());
    },
    // 提取文件扩展名
    getFileExtension(url) {
      return url.split('.').pop() || '';
    },
    chooseFile(file) {
      this.showFileDown = true
      this.currentUrl = `https://docs.tsflc.com/onlinePreview?url=${this.correctEncode(file.filePath)}`
    },
    /* 原始URL → (UTF8处理) → Base64 → URLEncode → 最终参数 */
    correctEncode(url) {
      const utf8Str = unescape(encodeURIComponent(url));
      const base64 = btoa(utf8Str);
      return encodeURIComponent(base64)
      .replace(/=/g, '%3D')  // 替换等号
      .replace(/\+/g, '%2B') // 替换加号
      .replace(/\//g, '%2F'); // 替换斜杠
    },
    handleDocument(data) {
      if (!data || !data.length) return []
      const result = []
      const traverse = (items) => {
        items.forEach(item => {
          if (item.document === true) {
            result.push({
              label: item.name,
              id: String(item.id),
              documents: item.documents || []
            })
          }
          if (item.document === false && Array.isArray(item.child) && item.child.length > 0) {
            traverse(item.child)
          }
        })
      }
      traverse(data)
      return result
    },
    onClickTab(value) {
      this.active = value
      const findItem = this.documentTypeOptions[value]
      if (findItem) {
        this.uploadImages = (findItem.documents || []).map(item => {
          return {
            ...item,
            isImage: this.isImageFile(item.filePath)
          }
        })
        this.imgUrls = this.uploadImages.map(item => item.filePath)
      } else {
        this.uploadImages = []
        this.imgUrls = []
      }
    },
    async onSelect({ value }) {
      if (value === '1') {// 预览
        this.showPreviewUrl = true
        this.fileUrl = this.currentUrl
      }
    },
    cancelPreviewUrl() {
      this.showPreviewUrl = false
      this.currentUrl = ''
      this.fileUrl = ''
    },
    /* 详情 */
    async queryDetail(id) {
      this.$store.dispatch('loading/show')
      const response = await detailProductDefinition(id).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        const originData = response.data
        /* 确定产品两要素 */
        this.ruleForm.businessClassify = originData.businessClassify
        this.ruleForm.isFlexible = originData.isFlexible
        /* 查询缴费类型参数表 */
        await this.queryParamsName()
        /* 提前结清详情查询 */
        if (['lingshou_DZ', 'lingshou_LH'].includes(this.productDiyName) && originData.tprFinaProductClearId) {
          this.productClearDetail(originData.tprFinaProductClearId)
          this.productClearDetailList(originData.tprFinaProductClearId)
        }
        // 是否打包融资参数
        this.ruleForm.dbrzItem = []
        this.ruleForm.dbrzStr = ''
        originData.dbRzFees.forEach(item => {
          const label = item.feeType === '1' ? '保险（元）' : item.feeType === '2' ? '购置税（元）' : item.feeType === '3' ? '其他费用（元）' : ''
          this.ruleForm.dbrzItem.push({
            str: item.feeType === '1' ? '保险' : item.feeType === '2' ? '购置税' : item.feeType === '3' ? '其他费用' : '',
            name: `${label}：${Number(item.amountMin).toFixed(2)}-${Number(item.amountMax).toFixed(2)}`
          })
        })
        if (this.ruleForm.dbrzItem.length > 0) {
          const tempArr = this.ruleForm.dbrzItem.map(item => item.str)
          this.ruleForm.dbrzStr = tempArr.join('、')
        } else {
          this.ruleForm.dbrzStr = '无'
        }
        // 融资期限
        if (originData.loanPeriodType === '1') {
          originData.loanPeriodTypeStr = `${originData.loanPeriodMin}-${originData.loanPeriodMax}`
        } else if (originData.loanPeriodType === '2') {
          originData.loanPeriodTypeStr = `${originData.loanPeriodFixed}`
        }
        // 缴费类型
        let tempProductFees = []
        originData.tprFinaProductFees.map(item => {
          const findItem = this.ruleForm.feesTableData.find(f => f.feeType == item.feeType)
          if (findItem) {
            // 处理%单位
            let amountDesc = ''
            if (item.paymentPlan === '1') {
              amountDesc = item.amount
              if (findItem.paramUnit == '2') amountDesc = Number(amountDesc * 100).toFixed(2)
            } else if (item.paymentPlan === '2') {
              amountDesc = `${item.amountMin}-${item.amountMax}`
              if (findItem.paramUnit == '2') amountDesc = `${Number(item.amountMin * 100).toFixed(2)}-${Number(item.amountMax * 100).toFixed(2)}`
            }

            tempProductFees.push({
              feeTypeDesc: findItem.feeTypeDesc,
              amountDesc,
              isAllowReducePayDesc: item.isAllowReducePay === '0' ? '足额支付' : item.isAllowReducePay === '1' ? '差额支付' : ''
            })
          }
        })
        originData.tprFinaProductFees = tempProductFees

        /* 特殊处理 */
        if (['pifa'].includes(this.productDiyName)) {
          // 计息方式
          if (originData.interestTypes && originData.interestTypes.length > 0) {
            originData.interestType = originData.interestTypes[0].properValue
          } else {
            originData.interestType = ''
          }
        } else if (['lingshou_DZ', 'lingshou_LH'].includes(this.productDiyName)) {
          originData.rzbl = `${Number(originData.rzblMin * 100).toFixed(2)}-${Number(originData.rzblMax * 100).toFixed(2)}`
          if (this.productDiyName === 'lingshou_DZ') {
            // 计息方式
            if (originData.interestTypes && originData.interestTypes.length > 0) {
              originData.interestType = originData.interestTypes[0].properValue
            } else {
              originData.interestType = ''
            }
            // 还款方式--获取关联动态字段
            if (Array.isArray(originData.repayMethods) && originData.repayMethods.length > 0) {
              originData.repayMethods = originData.repayMethods[0].properValue
              originData.activeNamesHKItems = this.allHKType([originData.interestType], [originData.repayMethods])
            } else {
              originData.activeNamesHKItems = this.allHKType([originData.interestType], [])
            }
          } else if (this.productDiyName === 'lingshou_LH') {
            originData.irr = `${Number(originData.irrMin * 100).toFixed(2)}-${Number(originData.irrMax * 100).toFixed(2)}`
            // 计息方式
            if (Array.isArray(originData.interestTypes) && originData.interestTypes.length > 0) {
              originData.interestType = originData.interestTypes.map(item => item.properValue)
            } else {
              originData.interestType = []
            }
            // 还款方式
            if (originData.repayMethods && originData.repayMethods.length > 0) {
              originData.repayMethods = originData.repayMethods.map(item => item.properValue)
            } else {
              originData.repayMethods = []
            }
            // 获取关联动态字段
            originData.activeNamesHKItems = this.allHKType(originData.interestType, originData.repayMethods)
          }
          // this.$store.dispatch('loading/show')
          const freeListResult = await queryInterestFreeList({ finaProductId: id, assetType: originData.assetType }).catch(err => console.log(err))
          if (freeListResult && freeListResult.code == 0 && freeListResult.data.results && freeListResult.data.results.length > 0) {
            originData.isInterestSubsidy = '1'
          }
          // originData.activeNamesHK = [...Array(originData.activeNamesHKItems.length).keys()].map(i => i + 1)
        }

        const handleRadioFields = ['downpaymentRateMin', 'firperiodRateMin', 'loanRate', 'finalPaymentRate', 'finalPaymentMonthRate', 'punishRate', 'afterRebateIrr']
        for (const key in originData) {
          if (this.ruleForm.hasOwnProperty(key)) {
            this.ruleForm[key] = originData[key];
            if (handleRadioFields.includes(key)) {
              if (this.ruleForm[key]) this.ruleForm[key] = Number(this.ruleForm[key] * 100).toFixed(2)
            }
          }
        }

        /* 查询产品定义附件 */
        this.queryDocumentDefined()
      }
    },
    /* 查询固定还款日规则 */
    async queryRepayDateConfigList() {
      this.$store.dispatch('loading/show')
      const response = await queryRepayDateConfigList().catch((err) => console.log(err));
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        this.valueList.repayDateConfigList = (response.data.results || []).map(item => {
          return {
            ...item,
            label: item.configName,
            value: item.productDateConfigId
          }
        })
      }
    },
  }
}
</script>

<style scoped>
.main-container {
  height: 100%;
  position: relative;
}
/deep/.main-container .van-nav-bar {
  background-color: var(--navbar-color, #bb2f25);
}
/deep/.main-container .van-nav-bar .van-nav-bar__arrow {
  color: white;
}
/deep/.main-container .van-nav-bar .van-nav-bar__text {
  color: white;
}
/deep/.main-container .van-nav-bar .van-nav-bar__title {
  color: white;
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
.image-preview-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 5px;
  border-radius: 5px;
}
.image-name {
  font-size: 12px;
  margin: 0;
}
.vanRow {
  margin-bottom: 12px;
}
.file-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.file-icon {
  width: 100px;
  height: 100px;
  background-color: #f7f8fa;
  border: 1px solid #ddd;
  font-size: 14px;
  color: #666;
  overflow: auto;
  word-break: break-all; /* 强制长单词/数字换行 */
  display: flex;
  align-items: center;
}
.van-grid-item {
  border: 1px dashed #ddd;
  overflow: hidden;
}
.van-grid-item img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
