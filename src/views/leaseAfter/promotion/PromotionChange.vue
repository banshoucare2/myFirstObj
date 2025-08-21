<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
      <van-sticky :offset-top="0">
         <van-tabs class="vanTabs">
            <van-tab title="基本信息" name="0" >
              <van-field
                :value="result.apply_title"
                label="申请标题"
                readonly
              />
              <van-field
                :value="result.startName"
                label="申请人"
                readonly
              />
              <van-field
                :value="result.apply_department"
                label="所属大区"
                readonly
              /> 
              <van-field
                :value="result.apply_reason"
                label="事项"
                readonly
                type="textarea"
              /> 
              <van-field
                :value="result.batch_no"
                label="批次号"
                readonly
              >
              <template slot="button">
                  <span @click="cdAialog1 = true">查看合同详情</span>
                </template>
              </van-field>           
              <van-field
                :value="result.listLength"
                label="合计确认合同数量"
                readonly
              /> 
              <van-field
                :value="formatMoney(result.total_amount || 0) +'元'"  
                label="合计返利金额"
                readonly
              />
              <van-field
                :value="formatMoney(result.deduction_amount || 0) +'元'"
                label="应扣除返利金额"
                readonly
              />
              <van-field
                :value="formatMoney(result.realty_amount || 0) +'元'"
                label="实际返利金额"
                readonly
              />  
              <van-field
                :value="result.startTime"  
                label="申请合同时间"
                readonly
              />        
            </van-tab>
            <van-tab title="附件信息" name="1" >
              <Upload-component ref="Upload" :uploadList="uploadList" :result="result" :orginUploadList="OlduploadList"/>          
            </van-tab>
          </van-tabs>
       </van-sticky>
       <van-dialog
          v-model="cdAialog1"
          title="合同详情"
          class="repayment-dialog"
          cancelButtonText="返回">
          <div class="list-item" :key="item.fileNo" v-for="item in tbPolicyCashDetails">
            <div class="list-item-content">
              <div class="item-content-text">合同号: {{ item.contract_no }}</div>
              <div class="item-content-text">客户名称: {{ item.cust_name }}</div>
              <div class="item-content-text">起租日期: {{ item.appr_founds_time }}</div>
              <div class="item-content-text">业务类型: {{ item.contract_type == '1'? '商用车':'乘用车' }}</div>
              <div class="item-content-text">政策名称: {{ item.promotion_policy_name }}</div>
              <div class="item-content-text">经销商名称: {{ item.dlr_name }}</div>
              <div class="item-content-text">主政策类型: {{ item.policy_type == '1'? '标准奖励':'超收益奖励' }}</div>
              <div class="item-content-text">返利类型: {{ typefn(item.link_type)}}</div>
              <div class="item-content-text">本次申请兑现金额: {{formatMoney(item.rebate_amount)}}</div>
            </div>        
          </div>
       </van-dialog> 
       <van-dialog
        title="审核"
        v-model="showAuth"
        :show-cancel-button="false"
        :show-confirm-button="false"
        cancelButtonText="取消"
      >
        <van-field name="LoanModel" label="意见" required>
          <template slot="input">
            <van-radio-group v-model="radio" direction="horizontal">
              <van-radio name="1">同意</van-radio>
              <van-radio name="2">不同意</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-cell-group>
          <van-field
            required
            type="textarea"
            v-model="message2"
            label="详情"
            placeholder="请输入详情"
            rows="2"
            autosize
            maxlength="500"
            show-word-limit
          />
        </van-cell-group>
        <div class="dialog-footer">
          <span @click="showAuth = false">取消</span>
          <span class="confirm" @click="confirmDialog">确认</span>
        </div>
      </van-dialog>  
  </div>
</template>

<script>
import store from '@/store'
import cookies from "js-cookie";
import Upload from '@/views/leaseAfter/customerCare/Upload';
import { Dialog } from 'vant'
import { formatMoney } from '@/utils/format'
import { approve } from '@/service/common'
import { getById } from '@/service/promotion'
export default {
  name: 'processForm',
  props: {
    businessKey: {
      type: String,
      default: ""
    },
    formData: {
      default: () => ({})
    },
    task: {
      type: Object,
      default: () => ({})
    },
  },
  data () {
    return {
      radio: '1',
      showAuth: false,
      OlduploadList: [
        // { name: '电子发票', attach: [] },
        // { name: '申请明细表', attach: [] },
        { name: '促销协议', attach: [] },
        { name: '促销政策', attach: [] },
        { name: '其他', attach: [] }
      ],
      tbPolicyCashDetails: [],
      cdAialog1: false,
      formatMoney,
      result: {
       
      }
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.init()
    this.$on('common_back', function () {
      this.showAuth = true
      // this.activityType = 'RZBFZR'
    })
  },
  methods: {
    async confirmDialog() {
      let _self = this;
      let variables = {};
      if (!this.radio) {
        this.$toast("请选择意见");
        return;
      }
      if (!this.message2) {
        this.$toast("请填写详情");
        return;
      }
      // if (this.errorFn()) {
      //   this.$toast(this.errorFn());
      //   return;
      // }
      let params = {
        agree: this.radio == "1" ? true : false,
        taskId: this.$parent.taskId,
        comment: this.message2,
        variables: variables,
      };
      _self.approveForm = params;
      const response2 = await approve(_self.approveForm);
      if (response2 && response2.code == "0") {
        this.$toast("审批提交成功");
        this.showAuth = false;
        this.$parent.routeToDetail();
      }
    },
    typefn (a) {
        if (a == 1) return '销售佣金'
        if (a == 2) return '达量奖励'
        if (a == 3) return '风险奖励'
        if (a == 4) return '基础奖励'
    },
    init (item) {   
      this.$store.dispatch('loading/show')
      getById({id:this.businessKey}).then((res) => {
        store.dispatch('loading/close')
        console.log(res)
        this.result = res.data.tbPolicyCash;
        this.tbPolicyCashDetails =  res.data.tbPolicyCashDetails
        this.result.listLength = res.data.tbPolicyCashDetails.length;
        this.result.startName = this.task.variables.startName
        this.result.startTime = this.task.startTime       
        if (res.data.tbPolicyCashFiles) {
            this.uploadList = res.data.tbPolicyCashFiles           
        } 
      });
    }    
  },
  components: {
    [Upload.name]: Upload
  }
}
</script>

<style scoped>
/deep/ .van-dialog__content {
  max-height: 500px;
  overflow-y: scroll;
}
/deep/ .vanTabs .van-tabs__content {
  overflow: scroll;
  height: calc(100vh - 120px);
}
.dialog-footer {
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .confirm {
    color: #0DB3A7;
  }
}
 .title {
    font-size: 1.1em;
    font-weight: bold;
    color: #015478;
    text-align: left;
    padding: 10px 10px 10px 20px;
  }
.padding {
  padding-left: 5px;
  padding-right: 5px;
}
.listDiv{
  max-height: 800px;
  overflow-y: scroll;
  margin-bottom: 50px;
}
/deep/ .van-cell {
  padding: 5px;
}
/deep/ .van-cell__value--alone {
  display: flex;
}
/deep/ .van-cell__value--alone span {
  width: 25%;
  text-align: center;
}
.page-container {
  height: 100%;
  background-color: #F9FAFE;
}
/deep/ .redVan .van-field__label{
  color: red;
}
/deep/ .redVan .van-field__control {
  color: red;
}
.flex-row-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.flex-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
/deep/ .van-dialog {
  width: 95%;
}
.list-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  min-height: 160px;
  overflow: hidden;
  background-color: white;
  /* border-style: solid; */
  /* border-color: #0DB3A7; */
  border-width: 1px;
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
}
.list-item-header {
  padding-left: 15px;
  min-height: 40px;
}
.list-item-content {
  min-height: 80px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-style: solid;
  border-bottom-color: #eee;
  border-bottom-width: 1px;
  border-top-color: #eee;
  border-top-style: solid;
  border-top-width: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.item-header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: #333;
}
.file-number-text {
  font-size: 15px;
  margin-left: 12px;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tag-common {
  height: 24px;
  font-size: 13px;
  border-radius: 12px;
  color: #0DB3A7;
  margin-right: 10px;
  text-align: center;
}
.item-content-text {
  text-align: left;
  font-size: 15px;
  color: #555;
  margin-left: 15px;
  line-height: 26px;
  letter-spacing: 1px;
}
.list-item-btn {
  min-height: 44px;
  color: #0DB3A7;
  font-size: 16px;
}
.unsigned-btn {
  color: #F40604;
}
.empty-container {
  padding-top: 20%;
  margin-bottom: 50%
}
</style>
