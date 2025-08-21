<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
      <van-sticky :offset-top="0">
         <van-tabs class="vanTabs">
            <van-tab title="基本信息" name="0" >
              <div class="title">
                融资申请
              </div>
              <van-field
                :value="result.contractNo"
                label="合同号"
                readonly
              />
              <van-field
                :value="result.custName"
                label="客户名"
                readonly
              />
              <van-field
                :value="formatMoney(result.loanPrices || 0)+'元'"
                label="融资额"
                readonly
              /> 
              <van-field
                :value="result.loanPeriods"
                label="融资期数"
                readonly
              /> 
              <van-field
                :value="result.foundsTime"
                label="放款日"
                readonly
              />
              <van-field
                :value="result.loanVehicles+'台'"
                label="车辆台数"
                readonly
              /> 
              <van-field
                :value="result.yearRate"
                label="合同利率"
                readonly
              /> 
              <van-field
                :value="result.irr"
                label="IRR"
                readonly
              /> 
              <van-field
                :value="formatMoney(result.leftMoney) +'元'"
                label="剩余本金"
                readonly
              />
              <van-field
                :value="formatMoney(result.leftAmount) +'元'"
                label="剩余租金"
                readonly
              /> 
              <van-field
                :value="result.areaName"
                label="业务大区"
                readonly
              /> 
              <van-field
                :value="result.dlrName"
                label="经销商"
                readonly
              />
              <van-field
                :value="result.modeTypeName"
                label="担保模式"
                readonly
              />
              <van-field
                :value="result.ghTimes"
                label="关怀申请次数"
                readonly
              > 
              <!-- <template slot="button">
                <span @click="cdAialog1 = true">查看详情</span>
              </template> -->
             </van-field>
              <van-field
                :value="result.czTimes"
                label="重组申请次数"
                readonly
              >
                <!-- <template slot="button">
                  <span  @click="cdAialog2 = true">查看详情</span>
                </template> -->
              </van-field> 
              <div class="title">
                关怀方案
              </div>
              <van-field
                :value="fnChange(result.changeType)"
                label="关怀类型"
                readonly
              /> 
              <van-field
                :value="result.periods1"
                :label="titleFn(result.changeType)"
                readonly
              />
              <van-field
                v-if="result.changeType==3"
                :value="result.periods2"
                label="延期分摊期数"
                readonly
              />
              <van-field
                v-if="result.changeType==1"
                :value="result.zqRate"
                label="展期利率"
                readonly
              />
              <van-field
                v-if="result.changeType==1"
                :value="result.irrRate"
                label="展期IRR"
                readonly
              />
              <van-field            
                :value="formatMoney(result.changeFee) +'元'"
                label="关怀申请费用"
                readonly
              />
              <van-field            
                @change="seachZfb()"
                v-model="result.feeRelief"
                label="关怀减免费用"
                :readonly="!(task && task.activityId == 'KHJL')"  
              />
               <!--  -->
              <van-field  class="redVan"
                 v-if="result.formula"          
                :value="result.formula"
                label="计算公式"
                readonly
              />
              <van-field            
                :value="result.feeRayType ==1? '一次性支付':'分期支付'"
                label="费用支付方式"
                readonly
              >
                <template slot="button">
                  <span @click="cdAialog1 = true">查看支付表</span>
                </template>
              </van-field>
              <van-field            
                v-if ='result.feeRayType ==2'
                :value="result.feeRayPeriods"
                label="费用分期支付期数"
                readonly
              />
              <van-field            
                :value="result.discountReason"
                label="减免原因"
                readonly
                type="textarea"
              />
              <van-field            
                :value="result.applyReason"
                label="申请原因"
                readonly
                type="textarea"
              />
            </van-tab>
            <van-tab title="附件信息" name="1" >
              <Upload-component ref="Upload" :uploadList="uploadList" :result="result"/>          
            </van-tab>
          </van-tabs>
       </van-sticky>
       <van-dialog
          v-model="cdAialog1"
          title="支付表"
          class="repayment-dialog"
          cancelButtonText="返回">
          <van-tabs>
            <van-tab title="新支付表" name="0" > 
              <div class="cell-list padding" style="max-height: 500px;overflow: scroll;">
                  <van-cell class="padding">
                    <span>应收日期</span>
                    <span>应还本金</span>
                    <span>应还利息</span>
                    <span>应还费用</span>
                  </van-cell>
                <van-cell v-for="(item, index) in result.changedPlan" :key="index">             
                  <span>
                    {{item.needReceDate}}
                  </span>
                  <span>
                    {{item.repayMoney}}
                  </span>
                  <span>
                    {{item.interest}}
                  </span>
                  <span>
                    {{item.toltofee}}
                  </span>
                </van-cell>
              </div> 
            </van-tab>
            <van-tab title="原支付表" name="1" >
              <div class="cell-list padding"style="max-height: 500px;overflow: scroll;">
                  <van-cell class="padding">
                    <span>应收日期</span>
                    <span>应还本金</span>
                    <span >应还利息</span>
                    <span>应还费用</span>
                  </van-cell>
                <van-cell v-for="(item, index) in result.originPlan" :key="index">             
                  <span>
                    {{item.needReceDate}}
                  </span>
                  <span>
                    {{item.repayMoney}}
                  </span>
                  <span>
                    {{item.interest}}
                  </span>
                  <span>
                    {{item.toltofee}}
                  </span>
                </van-cell>
              </div>   
            </van-tab>
           </van-tabs> 
         
      </van-dialog>
      <van-dialog 
      title="审核"
      v-model="showAuth"
      :show-cancel-button="false" 
      :show-confirm-button="false"
      cancelButtonText="取消"
      > 
        <van-field
            name="LoanModel"
            label="意见"
            required
          >
          <template slot="input">
            <van-radio-group
              v-model="radio"
              direction="horizontal"
            >
              <van-radio name="1">同意</van-radio>
              <van-radio name="2">不同意</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-cell-group >
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
          <van-field
            v-if="task.activityName == '评审会秘书安排上会'"
            v-model="selectSomeoneString"
            label="操作人员:"
            readonly
            @click="showFn()"
          />
        </van-cell-group>  
        <div class="dialog-footer">
          <span @click="showAuth= false">取消</span>
          <span class="confirm" @click="confirmDialog">确认</span>
        </div>
      </van-dialog> 
      <!-- task.variables.userList -->
      <van-popup v-model="showPPicker" position="bottom">
        <div style="width: 100%;display: flex;justify-content: space-between;">
              <div style="margin: 10px" @click="showPPicker = false">取消</div>
              <div style="margin: 10px" @click="surefn()">确认</div>
        </div>
        <div style="max-height: 300px;overflow-y: scroll">
          <div style="height: 50px;" v-for="(item, index) in task.variables.userList || []" :key="item.lookup_VALUE">    
            <div style="position: relative;height: 50px;line-height: 50px;">
              {{item.lookup_VALUE_NAME }}
              <van-checkbox style="position: absolute;right: 10px;top: 15px;" v-model="item.checked"></van-checkbox>
            </div>            
          </div> 
        </div>     
      </van-popup>
  </div>
</template>

<script>
import store from '@/store'
import cookies from "js-cookie";
import Upload from '@/views/leaseAfter/customerCare/Upload';
import { Dialog } from 'vant'
import { formatMoney } from '@/utils/format'
import { approve } from '@/service/common'
import { getDetailById, sendSign, getRepayPlan, getChangedRepayPlan, qryIsyqContractNo } from '@/service/customerCare'
export default {
  name: 'processForm',
  props: {
    businessKey: {
      type: String,
      default: ""
    },
    formData: {
      type: {}
    },
    task: {
      type: {}
    },
  },
  data () {
    return {
      contractNoYq: '',
      showPPicker: false,
      userList: [
        {
        lookup_VALUE_NAME:1,
        lookup_VALUE:'1'
      },
      {
        lookup_VALUE_NAME:2,
        lookup_VALUE:'2'
      },
      {
        lookup_VALUE_NAME:3,
        lookup_VALUE:'3'
      },
      {
        lookup_VALUE_NAME:3,
        lookup_VALUE:'3'
      },
      {
        lookup_VALUE_NAME:4,
        lookup_VALUE:'4'
      },
      {
        lookup_VALUE_NAME:3,
        lookup_VALUE:'3'
      },
      {
        lookup_VALUE_NAME:3,
        lookup_VALUE:'3'
      },
      {
        lookup_VALUE_NAME:4,
        lookup_VALUE:'4'
      },
      {
        lookup_VALUE_NAME:3,
        lookup_VALUE:'3'
      },
      {
        lookup_VALUE_NAME:3,
        lookup_VALUE:'3'
      },
      {
        lookup_VALUE_NAME:4,
        lookup_VALUE:'4'
      }
    ],
      selectSomeoneString: '',
      approveForm:{},
      selectSomeone: [],
      radio: '1',
      message2: '',
      showAuth: false,
      uploadList: [],
      cdAialog1: false,
      cdAialog2: false,
      formatMoney,
      result: {
       
      }
    }
  },
  created () {
      // 秘书上会回调
      this.$on('up', function () {
      this.showAuth = true
    })
    // 客户经理
    this.$on('KHJL', function () {
      this.showAuth = true
    })
    // 上会投票
    this.$on('SHTP', function () {
      this.showAuth = true
    })
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.init()
  },
  methods: {
    showFn () {
      this.showPPicker = true
      this.task.variables.userList || [].forEach(val => {
        if (this.selectSomeone.find(a =>a.lookup_VALUE == val.lookup_VALUE)) {
          val.checked = a.checked? true : false
        }
      })
    },
    surefn () {
      if (this.task.variables.userList || [].filter(val => val.checked).length == 0) {
          this.$toast('请选择操作人员')
          return
      }
      this.selectSomeoneString = this.task.variables.userList || [].filter(val => val.checked).map(a => a.lookup_VALUE_NAME).toString()
      this.selectSomeone = this.task.variables.userList || [].filter(val => val.checked).map(a => a.lookup_VALUE_NAME)
      this.showPPicker = false   
    },  
    getFormData() {
       let formData =this.task.variables.formData;
       formData.feeRayType = this.result.feeRayType;
       formData.isdq = this.result.isdq;
       formData.applyId = this.businessKey
       return formData
    },
    async confirmDialog () {
      if (!this.radio) {
        this.$toast('请选择意见')
        return
      }
      if (!this.message2) {
        this.$toast('请填写详情')
        return
      }
      let formData = this.getFormData()
      if (this.task.activityName == '评审会秘书安排上会' && this.radio == true) {
        if (this.selectSomeone.length == 0) {
          this.$toast('请选择操作人员');
          this.return
        }      
      }   
      if (this.task.activityName == '上会投票') {
       this.newSubmint()
       return    
      }   
      if (this.contractNoYq.isyh == 1 && this.approveForm.agree == true) {
        this.$toast('当期已还无法审核通过');
        return
      }
      if (this.contractNoYq.isyq == 1 && this.approveForm.agree == true) {
        this.$toast('档期逾期无法审核通过');
        return
      }
      let params = {
        agree: this.radio == '1'? true :false,
        taskId: this.$parent.taskId,
        comment: this.message2,
        // variables: variables,
        formData: formData
      }
      this.approveForm = params
      this.approveForm.formData = formData
      this.$store.dispatch('loading/show')
      const response2 = await approve( this.approveForm)
      this.$store.dispatch('loading/close')
      if (response2 && response2.code == '0') {
        this.$toast('审批提交成功')
        this.showAuth = false
        this.successFn()
        cookies.set('taskId', '')
        this.$router.push({path: '/dingding/index'})
      }
    },
    successFn () {
      if (this.task && this.task.activityId == 'KHJL' && this.approveForm.agree) {      
        sendSign({applyId:this.businessKey}).then((res) => {})
      }
    },
    seachZfb () {
        if (!this.result.feeRelief) {
          this.$toast('请输入关怀减免费用')
          this.result.feeRelief = 0
          return
        }
        let obj = {
          zqRate: this.result.zqRate,
          contractNo: this.result.contractNo,
          changeType: this.result.changeType,
          repayPeriod: this.result.repayPeriods || '',
          changePeriod: this.result.periods1 || '',
          yqPeriod: this.result.periods2 || '',
          // 新参数
          feeRayPeriods: this.result.feeRayPeriods || '',      
          feeRayType: this.result.feeRayType,
          feeRelief: this.result.feeRelief || '',
        }
        getRepayPlan(obj).then((res) => {
        if (res.code == 0) {
          this.result.originPlan = res.data.originPlan
          getChangedRepayPlan(obj).then((res1) => {
            if (res1.code == 0) {
              this.result.changedPlan = res1.data.changedPlan
              this.result.irrRate = res1.data.apply.irrRate
              this.result.applyAmount = res1.data.apply.applyAmount
              this.result.changeFee = res1.data.apply.changeFee
              this.result.applyMoney = res1.data.apply.applyMoney
              this.result.amountHis = res1.data.apply.amountHis                   
            }
          });
        }
      });     
    },
    // getVariables() {
    //   if (this.businessKey) {
    //     if (this.$parent.task) {
    //       return this.$parent.task.variables
    //     }
        
    //   } else {
    //     return {};
    //   }   
    // },
    // preview(filePath) {
    //   filePath ='https://t8.baidu.com/it/u=2661189947,4292098609&amp;fm=218&amp;app=126&amp;size=f242,150&amp;n=0&amp;f=PNG?s=27E8FE584E61441788193C5F0300D076&amp;sec=1710608400&amp;t=897c55d76c282bec3edde64e7540e0b3'
    //   let url =
    //   BASE_CONFIG.docs_host +
    //     "onlinePreview?url=" +
    //     encodeURIComponent(Base64.encode(filePath));
    //   window.open(url, "", "width=1000,height=1000");
    // },
    titleFn (a) {
       if (a == 1) {
        return '展期期数'
       }
       if (a == 2) {
        return '报停期数'
       }
       if (a == 3) {
        return '延期期数'
       }
    },
    fnChange(a) {
         if (a == 1) {
          return '展期'
         }
         if (a == 2) {
          return '报停'
         }
         if (a == 3) {
          return '延期'
         }
      },
   approveSelf (_self) {
      let this1 = this
      this.errorAlertFn(_self, function(){
        if (this1.contractNoYq.isyh == 1 && _self.approveForm.agree == true) {
          _self.$toast('当期已还无法审核通过');
          return
        }
        if (this1.contractNoYq.isyq == 1 && _self.approveForm.agree == true) {
          _self.$toast('档期逾期无法审核通过');
          return
        }
        _self.$store.dispatch('loading/show')
        approve(_self.approveForm).then(res1 => {
          if (res1.code == 0) {
            _self.$store.dispatch('loading/close')
            _self.$toast('审批提交成功')
            _self.showAuth = false
            _self.routeToDetail()
          }
        })
      })
    },
    errorAlertFn (_self, callback) {
      if (this.task.activityName == '合同上传（客户经理）' && _self.approveForm.agree) {
        var obj = {
          applyId:this.businessKey
        }
        getDetailById(obj).then((res) => {
          if (res.code == 0 && res.data) {
           if (!res.data.uplodeFileInfo.find(val =>val.bussType.includes('租金支付表'))) {
            this.$toast("请上传保存租金支付表附件")
            return
           }
           if (!res.data.uplodeFileInfo.find(val =>val.bussType.includes('申请表'))) {
            this.$toast("请上传保存申请表附件")
            return
           }
           if (callback) {
             callback()
           }
          }       
       });
      } else {
        if (callback) {
             callback()
        }
      }
    },
    init (item) {   
      this.$store.dispatch('loading/show')
      qryIsyqContractNo({applyId:this.businessKey}).then((res) => {
          if (res.code == 0 && res.data) {
            this.contractNoYq = res.data        
          }       
      });
      getDetailById({applyId:this.businessKey}).then((res) => {
        store.dispatch('loading/close')
        console.log(res)
        this.result = res.data;
        if (res.data.uplodeFileInfo) {
            this.uploadList = res.data.uplodeFileInfo    
            // this.$refs['Upload'].init()         
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
