<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-nav-bar v-if="showTitle" :title="handleTitle" fixed style="z-index: 9999;" />
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">产品范围</van-divider>
    <van-cell title="资产类型" :value="$getValue(valueList.ASSET_TYPE, ruleForm.assetType)" />
    <van-cell title="业务类型" :value="$getValue(valueList.PRODUCT_BUSINESS_TYPE, ruleForm.productType)" />
    <van-cell title="产品类型" :value="$getValue(valueList.PRODUCT_CATEGORY, ruleForm.productCategory)" />
    <van-cell v-if="!(ruleForm.assetType === '2' && ruleForm.productCategory === '3')" title="业务分类/模式" :value="$getValue(FILTER_BUSINESS_SCEN, ruleForm.businessScen)" />
    <van-cell title="车型/客户类型" :value="$getValue(FILTER_PRODUCT_VEHICLE_MODEL, ruleForm.modelCustomerType)" />
    <van-cell title="最低首期比例(%)" :value="ruleForm.downPaymentRatioMin" />
    <van-cell title="最低IRR(%)" :value="ruleForm.irrMin" />
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">限定条件</van-divider>
    <van-cell title="是否调整信审政策" :value="ruleForm.isChangeCredit === '1' ? '是' : ruleForm.isChangeCredit === '0' ? '否' : '-'" />
    <van-cell title="是否突破信审政策" :value="ruleForm.isBreakCredit === '1' ? '是' : ruleForm.isBreakCredit === '0' ? '否' : '-'" />
    <van-cell title="是否调整风险政策" :value="ruleForm.isChangeRisk === '1' ? '是' : ruleForm.isChangeRisk === '0' ? '否' : '-'" />
    <van-cell title="是否突破风险政策" :value="ruleForm.isBreakRisk === '1' ? '是' : ruleForm.isBreakRisk === '0' ? '否' : '-'" />
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">项目描述</van-divider>
    <van-cell title="项目描述" is-link arrow-direction="down" :value="ruleForm.projectDesc" />
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">产品明细</van-divider>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="明细列表" name="1">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th v-for="(row, index) in ruleForm.tableData" :key="index">{{ index + 1 }}</th>
              </tr>
            </thead>
            <tbody>
              <!-- 遍历表头 -->
              <tr v-for="(header, headerIndex) in ruleForm.headers" :key="headerIndex">
                <td>{{ header }}</td>
                <!-- 遍历每一列对应的数据 -->
                <td v-for="(row, rowIndex) in ruleForm.tableData" :key="rowIndex">
                  {{ getCellValue(headerIndex, row) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </van-collapse-item>
    </van-collapse>
    <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">附件信息</van-divider>
    <van-tabs v-model="active" @change="onClickTab" color="#f6cacf">
      <van-tab v-for="(item, index) in documentTypeOptions" :key="index" :title="item.label">
        <van-grid :column-num="3">
          <van-grid-item v-for="(file, i ) in uploadImages" :key="file.tmsgAttachmentId">
            <template v-if="file.isImage">
              <van-image width='100' height="100" fit="contain" lazy-load :src="file.url" @click="showPreview(i)">
                <template v-slot:error>加载失败</template>
              </van-image>
            </template>
            <template v-else>
              <!-- 文件图标和下载 -->
              <div class="file-container" @click="chooseFile(file)">
                <div class="file-icon" :class="'file-type-' + getFileExtension(file.url)">
                  {{ file.originalFileName || getFileExtension(file.url) }}
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
          <p class="image-name">{{ image.originalFileName }}</p>
        </div>
      </template>
    </van-image-preview>
    <!-- 非图片选择下载 -->
    <van-action-sheet v-model="showFileDown" :actions="[{ name: '预览', value: '1' }]" cancel-text="取消" close-on-click-action @select="onSelect" />

    <!-- 上会投票结果 -->
    <div v-if="allowPollResult">
      <van-divider v-if="meetingResult.hzResultMsg && !currentTaskName.startsWith('评审会投票')" :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">评审会投票结果</van-divider>
      <van-notice-bar v-if="meetingResult.hzResultMsg && !currentTaskName.startsWith('评审会投票')" left-icon="volume-o" :text="meetingResult.hzResultMsg" />
      <div v-if="meetingResult.voList.length > 0" class="table-container">
        <table>
          <tbody>
            <!-- 遍历表头 -->
            <tr v-for="(header, headerIndex) in meetingResult.headers" :key="headerIndex">
              <td>{{ header }}</td>
              <!-- 遍历每一列对应的数据 -->
              <td v-for="(row, rowIndex) in meetingResult.voList" :key="rowIndex">
                {{ getCellValuePoll(headerIndex, row) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 上会相关附件 -->
    <div v-if="allowPollFile">
      <van-divider :style="{ color: '#bb2f25', borderColor: '#bb2f25' }">评审会相关附件</van-divider>
      <van-tabs v-model="pollActive" @change="onClickTabPoll" :ellipsis="false" color="#f6cacf">
        <van-tab v-for="(item, index) in pollFileOptions" :key="index" :title="item.label">
          <van-grid :column-num="3">
            <van-grid-item v-for="(file, i ) in pollUploadImages" :key="file.tmsgAttachmentId">
              <template v-if="file.isImage">
                <van-image width='100' height="100" fit="contain" lazy-load :src="file.url" @click="showPreview(i)">
                  <template v-slot:error>加载失败</template>
                </van-image>
              </template>
              <template v-else>
                <!-- 文件图标和下载 -->
                <div class="file-container" @click="chooseFile(file)">
                  <div class="file-icon" :class="'file-type-' + getFileExtension(file.url)">
                    {{ file.originalFileName || getFileExtension(file.url) }}
                  </div>
                </div>
              </template>
            </van-grid-item>
          </van-grid>
        </van-tab>
      </van-tabs>
    </div>
    <div style="width: 100%; height: 50px;"></div>
    
    <!-- 评委人员进行投票 -->
    <van-dialog title="投票结果" v-model="pollVisible" :show-cancel-button="false"  :show-confirm-button="false" cancelButtonText="取消">
      <van-field name="typeDesc" v-model="pollForm.votingOpinionsDesc" is-link label="动作" placeholder="请选择" @click="showPoll = true" required />
      <van-cell-group>
        <van-field type="textarea" v-model="pollForm.opinionDescription" label="意见" placeholder="请输入" rows="5" maxlength="300" show-word-limit />
      </van-cell-group>
      <div class="dialog-footer">
        <span @click="pollVisible= false">取消</span>
        <span class="confirm" @click="confirmPoll">确认</span>
      </div>
    </van-dialog>
    <van-popup v-model="showPoll" destroy-on-close position="bottom">
      <van-picker
        :columns="[
          { text: '同意', value: 1 },
          { text: '不同意', value: 0 },
          { text: '附条件同意', value: 2 }
        ]"
        v-model="pollForm.votingOpinions"
        show-toolbar
        @confirm="onConfirmPoll"
        @cancel="showPoll = false"
      />
    </van-popup>

    <!-- 预览弹窗 -->
    <van-popup v-model="showPreviewUrl" position="bottom" round closeable style="height: 90vh; width:100vw;overflow: hidden;" @click-overlay="cancelPreviewUrl"
    @click-close-icon="cancelPreviewUrl">
      <iframe
        v-if="this.fileUrl"
        :src="this.fileUrl"
        style="width: 90vw;height: 80vh;margin-top:6vh;"
      ></iframe>
    </van-popup>
  </div>
</template>

<script>
import cookies from "js-cookie";
import { mapState } from 'vuex'
import { getBatchValuesList, getCurrentUser } from '@/service/common'
import { detailProductApply, queryProductApplyDetailList, queryTmsgFileList, queryDocument, isPassMeeting, getMeetingTpInfo } from '@/service/product'
import { downloadFile } from '@/utils/util'
import { RESTRICTED_ROLE_CODES, RESTRICTED_ACTIVITIES } from './const'

export default {
  name: 'product-policy', // 产品政策
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: true }
  },
  data () {
    return {
      title: '产品政策申请',
      valueList: {
        PRODUCT_APPLY_STATUS: [], // 状态
        ASSET_TYPE: [], // 资产类型
        PRODUCT_BUSINESS_TYPE: [], // 业务类型
        PRODUCT_CATEGORY: [], // 产品类别
        PRODUCT_VEHICLE_MODEL: [], // 车型/客户类型
        BUSINESS_SCEN: [], // 业务分类/模式
        PRODUCT_ATTRIBUTES: [], // 产品属性(定制/灵活)
        PRODUCT_CALC_INTEREST: [],
        PRODUCT_REPAY_METHOD: [],
        LOAN_RANGE: [], // 融资范围
        MODE_TYPE: [], // 担保模式
        CUST_TYPE: [], // 适用客户
        P_CAR_TYPE: [], // 适用品系--商用
        PRODUCT_CAR_USE: [], // 适用品系--乘用
        GLOBAL_CAR_TYPE: [],
      },
      ruleForm: {
        tprFinaProductApplyId: '',
        title: '',
        /* 产品范围 */
        assetType: '', // 资产类型
        productType: '', // 业务类型
        productCategory: '', // 产品类型
        businessScen: '', // 业务分类/模式
        modelCustomerType: '', // 车型/客户类型
        downPaymentRatioMin: '', // 最低首期比例
        irrMin: '', // 最低IRR
        /* 限定条件 */
        isChangeCredit: '',
        isBreakCredit: '',
        isChangeRisk: '',
        isBreakRisk: '',
        /* 项目描述 */
        projectDesc: '',
        /* 产品明细 */
        headers: [
          '产品类型',
          '首期比例%/首付比例%',
          '保证金比例(%)',
          '最大期限(月)',
          '计息方式',
          '还款方式',
          '还款方式说明',
          '账期说明',
          '市场收益率(%)',
          '资产类型',
          '主车留购价款(元/台)',
          '挂车留购价款(元/台)',
          '商务政策',
          '融资范围(%)',
          '担保模式',
          '适用客户',
          '适用品系',
          '适用品牌',
          '业务提报渠道',
          '产品到期日',
          '预计业务量(万元)',
          '资产属性',
          '返利后最低IRR(%)',
          '备注',
        ],
        tableData: [],
        /*  */
        isMeet: false, // 是否上会
        isCx: false, // 是否促销
      },
      filesData: {
        groupId: '',
        groupType: '', // 组类型
      },
      active: '',
      activeNames: ['1'],
      uploadImages: [],
      imgUrls: [],
      showImg: false,
      showImgIndex: null,
      /*  */
      documentTypeOptions: [],
      imageTypes: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'], // 图片类型
      showFileDown: false,
      /*  */
      pollVisible: false,
      showPoll: false,
      pollForm: {
        votingOpinions: '',
        votingOpinionsDesc: '',
        opinionDescription: ''
      },
      meetingResult: {
        hzResultMsg: '',
        headers: [
          '评审会成员',
          '投票结果',
          '投票时间',
          '投票意见'
        ],
        voList: [],
      },
      pollFileOptions: [],
      pollActive: '',
      pollUploadImages: [],
      commonArgs: 'productPolicy_', // 政策附件固定groupId前缀
      /* 在线预览 */
      currentUrl: '',
      fileUrl: '',
      showPreviewUrl: false,
      previewLoading: false,
      /* 登录人角色信息 */
      currentRoles: [],
      RESTRICTED_ROLE_CODES,
      RESTRICTED_ACTIVITIES
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.init()
    this._queryUserInfo()
    this.$on('meetingResult', this.handleDiySubmit)
    this.$on('poll', this.handlePoll)
    this.$on('popass', this.handlePopass)
  },
  watch: {
    allowPollResult: {
      handler(val) {
        if (val) {
          this.queryMeetingResult()
        }
      },
      immediate: true
    },
    allowPollFile: {
      handler(val) {
        if (val) {
          this.queryDocumentPoll()
        }
      },
      immediate: true
    },
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    handleTitle() {
      if (this.ruleForm.title) return this.title + '-' + this.ruleForm.title
      else return this.title
    },
    /* 业务类型/模式 动态展示 */
    FILTER_BUSINESS_SCEN() {
      if (!this.ruleForm.assetType || !this.ruleForm.productCategory || !this.valueList.BUSINESS_SCEN || !this.valueList.BUSINESS_SCEN.length) return []
      if (this.ruleForm.assetType === '1') {
        if (this.ruleForm.productCategory === '1') {
          /* 商用车-零售 （新车担保、新车共担、新车免担、经营性租赁、二手车担保、二手车免担） */
          return this.valueList.BUSINESS_SCEN.filter(item => ['1', '2', '3', '4', '5', '6'].includes(item.value))
        } else if (this.ruleForm.productCategory === '2') {
          /* 商用车-库融 （发车库存融-担保、存货库存融-担保） */
          return this.valueList.BUSINESS_SCEN.filter(item => ['20', '21'].includes(item.value))
        } else if (this.ruleForm.productCategory === '3') {
          /* 商用车-大客户 （公路运输、工程、国企、央企一级货源/存量老客户） */
          return this.valueList.BUSINESS_SCEN.filter(item => ['14', '15', '16'].includes(item.value))
        } else if (this.ruleForm.productCategory === '4') {
          /* 商用车-员工购及试驾车 （合作渠道员工购车/试驾车、“集团、公司、战略合作品牌购车”） */
          return this.valueList.BUSINESS_SCEN.filter(item => ['22', '23'].includes(item.value))
        } else {
          return []
        }
      } else if (this.ruleForm.assetType === '2') {
        if (this.ruleForm.productCategory === '1') {
          /* 乘用车-零售 （新车(经销商)-免息-免担、新车(经销商)低息-免担、新车(经销商)非贴息、低息-免担、新车(经销商)非贴息-担保、新车(代理商)-担保、二手车(代理商、交易融)-担保、二手车(代理商、车主融)-免担） */
          return this.valueList.BUSINESS_SCEN.filter(item => ['7', '8', '9', '10', '11', '12', '13'].includes(item.value))
        } else if (this.ruleForm.productCategory === '2') {
          /* 乘用车-库融  (新车发车库存融-担保、新车存货库存融-担保、二手车存货库存融-担保) */
          return this.valueList.BUSINESS_SCEN.filter(item => ['17', '18', '19'].includes(item.value))
        } else if (this.ruleForm.productCategory === '3') {
          /* 乘用车-大客户 无 */
          return []
        } else if (this.ruleForm.productCategory === '4') {
          /* 乘用车-员工购及试驾车 （合作渠道员工购车/试驾车、“集团、公司、战略合作品牌购车”） */
          return this.valueList.BUSINESS_SCEN.filter(item => ['22', '23'].includes(item.value))
        } else {
          return []
        }
      } else {
        return []
      }
    },
    /* 车型/客户类型 动态展示 */
    FILTER_PRODUCT_VEHICLE_MODEL() {
      if (!this.ruleForm.assetType || !this.ruleForm.productCategory || !this.valueList.PRODUCT_VEHICLE_MODEL || !this.valueList.PRODUCT_VEHICLE_MODEL.length) return []
      if (this.ruleForm.assetType === '1') {
        if (this.ruleForm.productCategory === '1') {
          if (!this.ruleForm.businessScen) return []
          /* 商用车-零售 */
          /* [“新车担保”, “新车共担”].includes(业务分类) ==> 载货车、其他车型、老客户 */
          if (['1', '2'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['1', '2', '3'].includes(item.value))
          /* [“新车免担”].includes(业务分类) ==> 载货车、牵引车、其他车型、老客户 */
          else if (['3'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['1', '2', '3', '4'].includes(item.value))
          /* [“经营性租赁”, “二手车担保”, “二手车免担”].includes(业务分类) ==> 不限 */
          else if (['4', '5', '6'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['8'].includes(item.value))
          else return []
        } else if (this.ruleForm.productCategory === '2') {
          /* 商用车-库融 ==> 不限 */
          return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['8'].includes(item.value))
        } else if (this.ruleForm.productCategory === '3') {
          if (!this.ruleForm.businessScen) return []
          /* 商用车-大客户 */
          /* [“公路运输-免担”].includes(业务分类) ==> 载货车、其他车型 */
          if (['14'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['1', '2'].includes(item.value))
          /* [“工程-免担”].includes(业务分类) ==> 其他车型 */
          else if (['15'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['2'].includes(item.value))
          /* [“国企、央企一级货源/存量老客户”].includes(业务分类) ==> 不限 */
          else if (['16'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['8'].includes(item.value))
          else return []
        } else if (this.ruleForm.productCategory === '4') {
          /* 商用车-员工购及试驾车 ==> 不限 */
          return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['8'].includes(item.value))
        } else {
          return []
        }
      } else if (this.ruleForm.assetType === '2') {
        if (this.ruleForm.productCategory === '1') {
          if (!this.ruleForm.businessScen) return []
          /* 乘用车-零售 */
          /* [“新车-经销商-免息-免担”].includes(业务分类) ==> 星海系列 */
          if (['7'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['5'].includes(item.value))
          /* [“新车-经销商-低息-免担”].includes(业务分类) ==> 菱智系列 */
          else if (['8'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['6'].includes(item.value))
          /* [“新车-经销商-非贴息、低息-免担”].includes(业务分类) ==> 星海系列、菱智系列 */
          else if (['9'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['7'].includes(item.value))
          /* [“新车-经销商-非贴息-担保”, “新车-代理商-担保”, “二手车-代理商-交易融-担保”, “二手车-代理商-车主融-免担”].includes(业务分类) ==> 不限 */
          else if (['10', '11', '12', '13'].includes(this.ruleForm.businessScen)) return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['8'].includes(item.value))
          else return []
        } else if (['2', '3', '4'].includes(this.ruleForm.productCategory)) {
          /* 乘用车-库融|大客户|员工购及试驾车 ==> 不限 */
          return this.valueList.PRODUCT_VEHICLE_MODEL.filter(item => ['8'].includes(item.value))
        } else {
          return []
        }
      } else {
        return []
      }
    },
    handle_loanRange() {
      return (val) => {
        if (val && !Array.isArray(val)) val = val.split(',')
        if (!val || !val.length || !this.valueList.LOAN_RANGE || !this.valueList.LOAN_RANGE.length) return ''
        
        const tempArr = val.map(item => {
          return this.$getValue(this.valueList.LOAN_RANGE, item)
        })
        const result = tempArr.join('+')
        return result
      }
    },
    handle_custType() {
      return (val) => {
        if (val && !Array.isArray(val)) val = val.split(',')
        if (!val || !val.length || !this.valueList.CUST_TYPE || !this.valueList.CUST_TYPE.length) return ''

        const tempArr = val.map(item => {
          return this.$getValue(this.valueList.CUST_TYPE, item)
        })
        const result = tempArr.join('、')
        return result
      }
    },
    currentTaskName() {
      return this.task && this.task.activityName ? this.task.activityName : ''
    },
    allowPollResult() {
      if (['评审会投票','秘书汇总结果(评审会)','董事长表决','秘书汇总结果(董事长)','评审会主任审核'].some(task => this.currentTaskName.startsWith(task)) && this.ruleForm.isMeet) {
        return true
      } else {
        return false
      }
    },
    allowPollFile() {
      if (['评审会投票','秘书汇总结果(评审会)','董事长表决','秘书汇总结果(董事长)','评审会主任审核','申请人确认','产品岗确认','产品岗配置产品'].some(task => this.currentTaskName.startsWith(task)) && this.ruleForm.isMeet) {
        return true
      } else {
        return false
      }
    },
    handle_interestType() {
      return (val) => {
        if (val && !Array.isArray(val)) val = val.split(',')
        if (!val || !val.length || !this.valueList.PRODUCT_CALC_INTEREST || !this.valueList.PRODUCT_CALC_INTEREST.length) return ''
        if (Array.isArray(val)) {
          const tempArr = val.map(item => {
            return this.$getValue(this.valueList.PRODUCT_CALC_INTEREST, item)
          })
          const result = tempArr.join('、')
          return result
        } else {
          return this.$getValue(this.valueList.PRODUCT_CALC_INTEREST, val)
        }
      }
    },
    handle_refundType() {
      return (val) => {
        if (val && !Array.isArray(val)) val = val.split(',')
        if (!val || !val.length || !this.valueList.PRODUCT_REPAY_METHOD || !this.valueList.PRODUCT_REPAY_METHOD.length) return ''
        if (Array.isArray(val)) {
          const tempArr = val.map(item => {
            return this.$getValue(this.valueList.PRODUCT_REPAY_METHOD, item)
          })
          const result = tempArr.join('、')
          return result
        } else {
          return this.$getValue(this.valueList.PRODUCT_REPAY_METHOD, val)
        }
      }
    },
    handleVehicleSeries() {
      return (row) => {
        const { vehicleSeries, assetType } = row
        if (!vehicleSeries || !vehicleSeries.length ||!assetType) return ''
        if (assetType === '1' && !this.valueList.P_CAR_TYPE.length) return ''
        else if (assetType === '2' && !this.valueList.PRODUCT_CAR_USE.length) return ''

        if (Array.isArray(vehicleSeries)) {
          if (assetType === '1') {
            const tempArr = vehicleSeries.map(item => {
              return this.$getValue(this.valueList.P_CAR_TYPE, item)
            })
            const result = tempArr.join('、')
            return result
          } else if (assetType === '2') {
            const tempArr = vehicleSeries.map(item => {
              return this.$getValue(this.valueList.PRODUCT_CAR_USE, item)
            })
            const result = tempArr.join('、')
            return result
          }
        } else {
          if (assetType === '1') return this.$getValue(this.valueList.P_CAR_TYPE, vehicleSeries)
          else if (assetType === '2') return this.$getValue(this.valueList.PRODUCT_CAR_USE, vehicleSeries)
        }
      }
    },
    handle_assetCondition() {
      return (val) => {
        if (!val || !val.length || !this.valueList.GLOBAL_CAR_TYPE || !this.valueList.GLOBAL_CAR_TYPE.length) return ''

        if (Array.isArray(val)) {
          const tempArr = val.map(item => {
            return this.$getValue(this.valueList.GLOBAL_CAR_TYPE, item)
          })
          const result = tempArr.join('、')
          return result
        } else {
          return this.$getValue(this.valueList.GLOBAL_CAR_TYPE, val)
        }
      }
    },
  },
  methods: {
    async init() {
      if (this.businessKey) {
        this.ruleForm.tprFinaProductApplyId = this.businessKey
      }
      await this.getValuesList()
      this.queryDetail(this.ruleForm.tprFinaProductApplyId)
      this.queryDetailList()
    },
    /* 查询申请人以及申请部门 */
    async _queryUserInfo() {
      const response = await getCurrentUser().catch(err => { console.log(err); })
      if (response && response.code == 0) {
        const { id, userName, roles } = response.data
        this.currentRoles = roles
      }
    },
    async getValuesList(){
      /* 批量值列表 */
      const dictCodes = 'PRODUCT_CATEGORY,PRODUCT_VEHICLE_MODEL,PRODUCT_BUSINESS_TYPE,BUSINESS_SCEN,ASSET_TYPE,PRODUCT_ATTRIBUTES,LOAN_RANGE,MODE_TYPE,CUST_TYPE,PRODUCT_APPLY_STATUS,P_CAR_TYPE,PRODUCT_CAR_USE,PRODUCT_CALC_INTEREST,PRODUCT_REPAY_METHOD,GLOBAL_CAR_TYPE'
      const response = await getBatchValuesList({ dictCodes })
      if (response && response.code == 0) {
        response.data.map(item => {
          this.valueList[item.dictCode].push(item)
        })
      }
    },
    /* 查询--政策附件（万网） */
    async queryDocumentPolicy() {
      const params = { 
        businessId: this.filesData.groupId,
        documentType: '200', // 业务表类型
      }
      this.$store.dispatch('loading/show')
      const response = await queryDocument(params).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        const resultData = response.data || []
        this.documentTypeOptions = this.handleDocument(resultData)
        if (this.documentTypeOptions.length) {
          this.active = this.documentTypeOptions[0].id
          this.filesData.groupType = this.documentTypeOptions[0].id
          this.queryFile()
        }
      }
    },
    handleDocument(data) {
      if (!data || !data.length) return []
      const result = []
      const traverse = (items) => {
        items.forEach(item => {
          if (item.document === true) {
            result.push({
              label: item.name,
              id: String(item.id)
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
    /* 详情 */
    async queryDetail(id) {
      this.$store.dispatch('loading/show')
      const response = await detailProductApply(id).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        const data = response.data
        this.filesData.groupId = data.groupId || ''
        this.queryDocumentPolicy()
        for (const key in data) {
          if (this.ruleForm.hasOwnProperty(key)) {
            this.ruleForm[key] = data[key];
            if (['downPaymentRatioMin', 'irrMin'].includes(key)) {
              this.ruleForm[key] = Number(this.ruleForm[key] * 100).toFixed(2)
            }
            if (['isMeet', 'isCx'].includes(key)) {
              this.ruleForm[key] = this.ruleForm[key] == '1' ? true : false
            }
          }
        }
      }
    },
    /* 产品明细 */
    async queryDetailList() {
      this.$store.dispatch('loading/show')
      const response = await queryProductApplyDetailList({ tprFinaProductApplyId: this.ruleForm.tprFinaProductApplyId }).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        this.ruleForm.tableData = response.data || []
      }
    },
    getCellValue(headerIndex, row) {
      const fields = [
        'isFlexible',
        'combine', // 首期比例%/首付比例%
        'bondRate',
        'loanPeriod',
        'interestType',
        'refundType',
        'refundTypeRemark',
        'zqDesc',
        'rate',
        'assetType',
        'deposit',
        'trailerDeposit',
        'businessPolicy',
        'loanRange',
        'modeType',
        'custType',
        'vehicleSeries',
        'vehicleBrand',
        'reportAccountDesc',
        'productExpireDate',
        'expectedBusinessVolume',
        'assetCondition',
        'afterRebateIrr',
        'remark',
      ];

      
      if (fields[headerIndex] === 'isFlexible') {
        return this.$getValue(this.valueList.PRODUCT_ATTRIBUTES, row[fields[headerIndex]])
      } else if (fields[headerIndex] === 'combine') {
        if (row['businessClassify'] === '1' && row['isFlexible'] === '1') { // 零售定制
          return Number(row['downpaymentRate'] * 100).toFixed(2)
        } else if (row['businessClassify'] === '1' && row['isFlexible'] === '2') { // 零售灵活
          return Number(row['firperiodRate'] * 100).toFixed(2)
        }
      } else if (fields[headerIndex] === 'interestType') {
        return this.handle_interestType(row[fields[headerIndex]])
      } else if (fields[headerIndex] === 'refundType') {
        return this.handle_refundType(row[fields[headerIndex]])
      } else if (fields[headerIndex] === 'loanRange') {
        return this.handle_loanRange(row[fields[headerIndex]])
      } else if (fields[headerIndex] === 'modeType') {
        return this.$getValue(this.valueList.MODE_TYPE, row[fields[headerIndex]])
      } else if (fields[headerIndex] === 'custType') {
        return this.handle_custType(row[fields[headerIndex]])
      } else if (fields[headerIndex] === 'assetType') {
        return this.$getValue(this.valueList.ASSET_TYPE, row[fields[headerIndex]])
      } else if (fields[headerIndex] === 'vehicleSeries') {
        return this.handleVehicleSeries(row)
      } else if (fields[headerIndex] === 'assetCondition') {
        if (row['businessClassify'] === '1') {
          return this.$getValue(this.valueList.GLOBAL_CAR_TYPE, row[fields[headerIndex]])
        } else if (row['businessClassify'] === '2') {
          return this.handle_assetCondition(row[fields[headerIndex]])
        }
      }
      
      const handleRadioFields = ['bondRate', 'rate', 'afterRebateIrr']
      if (handleRadioFields.includes(fields[headerIndex]) && row[fields[headerIndex]]) {
        return Number(row[fields[headerIndex]] * 100).toFixed(2)
      } else {
        return row[fields[headerIndex]];
      }
    },
    onClickTab(value) {
      this.active = value
      this.filesData.groupType = this.documentTypeOptions[value].id
      this.queryFile()
    },
    async queryFile() {
      const params = { groupId: this.filesData.groupId, groupType: this.filesData.groupType }
      this.$store.dispatch('loading/show')
      const response = await queryTmsgFileList(params).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        this.uploadImages = response.data.map(item => {
          return {
            ...item,
            isImage: this.isImageFile(item.url)
          }
        })
        this.imgUrls = response.data.map(item => item.url)
      } else {
        this.uploadImages = []
        this.imgUrls = []
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
      this.currentUrl = `https://docs.tsflc.com/onlinePreview?url=${this.correctEncode(file.url)}`
    },
    cancelPreviewUrl() {
      this.showPreviewUrl = false
      this.currentUrl = ''
      this.fileUrl = ''
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
    isDingTalk() {
      return navigator.userAgent.includes('DingTalk')
    },
    async onSelect({ value }) {
      if (value === '1') {// 预览
        this.showPreviewUrl = true
        this.fileUrl = this.currentUrl
      }
    },
    routeToDetail (item, isRefused) {
      cookies.set('taskId', '')
      this.$router.push({path: '/dingding/index'})
    },
    /* 秘书组织上会人员 */
    handleDiySubmit() {
      this.$toast('请移至PC端处理')
    },
    /* 秘书上传 */
    handlePopass() {
      this.$toast('请移至PC端处理')
    },
    /* 投票 */
    handlePoll() {
      this.pollVisible = true
    },
    onConfirmPoll({ value, text }) {
      this.pollForm.votingOpinions = value
      this.pollForm.votingOpinionsDesc = text
      this.showPoll = false
    },
    async confirmPoll() {
      if (this.pollForm.votingOpinions === '') {
        this.$toast("请投票");
        return;
      }

      const params = {
        applyId: this.businessKey,
        votingOpinions: this.pollForm.votingOpinions,
        opinionDescription: this.pollForm.opinionDescription,
        id: this.userInfo.id,
        members: this.userInfo.userName,
        taskId: this.task.id
      } 

      this.$store.dispatch('loading/show')
      const res = await isPassMeeting(params).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (res.code == 0) {
        this.$toast('投票成功')
        this.pollVisible = false;
        setTimeout(() => {
          this.routeToDetail()
        }, 1000);
      } else {
        this.$toast(res.message)
      }
    },
    getCellValuePoll(headerIndex, row) {
      const fields = [
        'members',
        'votingOpinions',
        'pollingTime',
        'opinionDescription'
      ];
      if (fields[headerIndex] === 'votingOpinions') {
        if (row['votingOpinions'] === '0') return '不同意'
        else if (row['votingOpinions'] === '1') return '同意'
        else if (row['votingOpinions'] === '2') return '附条件同意'
        else return ''
      }
      return row[fields[headerIndex]];
    },
    /* 查询评审会投票结果 */
    async queryMeetingResult() {
      const params = {
        applyId: this.businessKey,
        id: this.userInfo.id
      }
      this.$store.dispatch('loading/show')
      const result = await getMeetingTpInfo(params).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (result && result.code == 0) {
        const { hzResultMsg, voList } = result.data
        this.meetingResult.hzResultMsg = hzResultMsg || ''
        this.meetingResult.voList = voList || []
      }
    },
    /* 查询--上会阶段附件（万网） */
    async queryDocumentPoll() {
      const params = {
        businessId: this.businessKey,
        documentType: '201', // 业务表类型
        hasGuarantee: '0', // 有无担保
      }
      this.$store.dispatch('loading/show')
      const response = await queryDocument(params).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        let resultData = response.data || []
        if (['申请人确认', '产品岗确认', '产品岗配置产品'].some(task => this.currentTaskName.startsWith(task))) {
          resultData = resultData.filter(item => item.id == '891') // 评审委员会批复意见书
        }
        this.pollFileOptions = this.handleDocument(resultData)
        if (this.pollFileOptions.length) {
          this.pollActive = this.pollFileOptions[0].id
          this.filesData.groupType = this.pollFileOptions[0].id
          this.queryFilePoll()
        }
      }
    },
    onClickTabPoll(value) {
      this.pollActive = value
      this.filesData.groupType = this.pollFileOptions[value].id
      this.queryFilePoll()
    },
    async queryFilePoll() {
      const params = { groupId: this.commonArgs + this.businessKey, groupType: this.filesData.groupType }
      this.$store.dispatch('loading/show')
      const response = await queryTmsgFileList(params).catch(err => console.log(err))
      this.$store.dispatch('loading/close')
      if (response && response.code == 0) {
        this.pollUploadImages = response.data.map(item => {
          return {
            ...item,
            isImage: this.isImageFile(item.url)
          }
        })
        this.imgUrls = response.data.map(item => item.url)
      } else {
        this.pollUploadImages = []
        this.imgUrls = []
      }
    },
    /* 根据角色权限过滤任务列表 */
    filterProcessComment(taskList) {
      // 检查是否拥有最高权限code
      const hasPermission = this.currentRoles.some(role => RESTRICTED_ROLE_CODES.includes(role.code));
      
      // 有权限时返回完整列表
      if (hasPermission) return taskList;
      
      // 无权限时过滤敏感流程
      return taskList.filter(task => 
        !RESTRICTED_ACTIVITIES.some(activity => task.activityName.startsWith(activity)
      ));
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
.table-container {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid #ddd;
  -webkit-overflow-scrolling: touch;
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
/deep/.page-container .van-dialog {
  padding: 12px !important;
}
/deep/.page-container .van-dialog .van-dialog__header {
  padding: 8px 0 16px 0 !important;
  font-weight: 700;
}
.dialog-footer {
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.dialog-footer .confirm {
  color: #ee0a24;
}
</style>
