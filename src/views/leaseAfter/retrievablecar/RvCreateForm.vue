<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-sticky :offset-top="0">
      <van-tabs v-model="active">
         <van-tab title="收车方案" name="7">
          <div>
            <van-field
              readonly
              label="开始时间"
              :value="bill.termStart == null ? '未填写' : bill.termStart"
              @click="show_termStartFn()"
            />
            <van-field
              readonly
              label="结束时间"
              :value="bill.termEnd == null ? '未填写' : bill.termEnd"
              @click="show_termEndFn()"
            />
            <van-field
              readonly
              label="第三方收车公司"
              :value="comNameFn(bill)"
              @click="Picker1Fn()"
            />
            <van-field
              readonly
              label="收车人"
              :value="rvUserNameFn(bill)"
              @click="Picker2Fn()"
            />
          </div>
        </van-tab>
        <van-tab title="车辆信息" name="0">
          <div class="listDiv">
            <div
              class="list-item"
              v-for="(item, index) in vehicleList"
              :key="index"
              style="text-align: left"
            >
              <div class="list-item-content">
                <div class="item-content-text">车架号: {{ item.vinNo }}</div>
                <div class="item-content-text">
                  发动机号: {{ item.engineNo }}
                </div>
                <div class="item-content-text">车牌号: {{ item.carNo }}</div>
                <div class="item-content-text">
                  车辆品牌: {{ item.distributorName }}
                </div>
                <div class="item-content-text">
                  收车状态: {{ item.rvStatusContent }}
                </div>
              </div>
            </div>
            <div style="height: 60px">&nbsp;</div>
            <div
              v-if="!vehicleList || vehicleList.length === 0"
              class="empty-container"
            >
              <van-empty description="暂无信息" />
            </div>
          </div>
        </van-tab>
        <van-tab title="收车信息" name="2">
          <van-field
            :value="contractNoFn(bill.rvChannel)"
            label="收车主体"
            readonly
          />
          <van-cell-group>
            <van-field
              :disabled="this.task != null && this.task.activityId != 'start'"
              type="textarea"
              v-model="bill.rvReason"
              label="申请原因"
              rows="2"
              autosize
              maxlength="1000"
              show-word-limit
            />
          </van-cell-group>
        </van-tab>
        <van-tab title="合同信息" name="3">
          <div>

            <van-field :value="contract.contractNo" label="合同号" readonly />
            <van-field
              :value="contract.vehicleType == '1' ? '商用车' : '乘用车'"
              label="业务类型"
              readonly
            />
            <van-field :value="contract.dealerName" label="经销商" readonly />
            <van-field :value="contract.areaName" label="所属区域" readonly />
            <van-field
              :value="contract.startDate"
              label="合同开始时间"
              readonly
            />
            <van-field
              :value="contract.endDate"
              label="合同结束时间"
              readonly
            />
            <van-field :value="contract.financeAmount" label="融资金额" readonly />
            <van-field :value="contract.depositAmount" label="保证金" readonly />
            <van-field :value="contract.fkCompany" label="放款公司" readonly />
            <van-field :value="contract.isBuyBack" label="是否回购" readonly />
          </div>
        </van-tab>
        <van-tab title="客户信息" name="4">
          <van-field :value="contract.customerName" label="客户名称" readonly />
          <van-field :value="contract.customerIdNo" label="证件号" readonly />
          <van-field :value="contract.customerPhone" label="联系电话" readonly />
        </van-tab>
        <van-tab title="催收历史" name="6">
          <div class="listDiv">
            <div
              class="list-item"
              v-if="csLogList.length > 0"
              v-for="(item, index) in csLogList"
              :key="index"
              style="text-align: left"
            >
              <div class="list-item-content">
                <div class="item-content-text">
                  是否上门: {{ item.row.scIsVisit }}
                </div>
                <div
                  v-if="item.row.scIsVisit == '是' && item.row.scLocation"
                  class="item-content-text"
                >
                  会见地点: {{ item.row.scLocation }}
                </div>
                <div
                  v-if="item.row.scIsVisit == '是' && item.row.scTargetName"
                  class="item-content-text"
                >
                  会见人员: {{ item.row.scTargetName }}
                </div>
                <div
                  v-if="item.row.scIsVisit == '是' && item.row.scTime"
                  class="item-content-text"
                >
                  会见时间: {{ item.row.scTime }}
                </div>
                <div v-if="item.row.willingness" class="item-content-text">
                  还款意愿: {{ item.row.willingness == "1" ? "有" : "无" }}
                </div>
                <div
                  v-if="item.row.willingness == '1'"
                  class="item-content-text"
                >
                  承诺还款时间: {{ item.row.promiseTime }}
                </div>
                <div
                  v-if="item.row.willingness == '0'"
                  class="item-content-text"
                >
                  不还款原因: {{ item.row.reason }}
                </div>
                <div
                  v-if="item.row.willingness == '0'"
                  class="item-content-text"
                >
                  其他原因: {{ item.row.reasonOther }}
                </div>
                <div v-if="item.row.defuseSuggest" class="item-content-text">
                  化解建议: {{ item.row.defuseSuggest }}
                </div>
                <div class="item-content-text">
                  回执概述: {{ item.row.log }}
                </div>
                <van-field label="附件:">
                  <template slot="input">
                    <div class="attach-list">
                      <a
                        style="display: block"
                        v-for="(item, index) in item.row.attachList"
                        :key="index"
                        :href="item.url"
                        target="_blank"
                        class="attach-item"
                        >{{ item.name }}</a
                      >
                    </div>
                  </template>
                </van-field>
              </div>
            </div>
            <div style="height: 60px">&nbsp;</div>
            <div
              v-if="!csLogList || csLogList.length === 0"
              class="empty-container"
            >
              <van-empty description="暂无信息" />
            </div>
          </div>
        </van-tab>
       
      </van-tabs>
    </van-sticky>
    <van-popup v-model="show_termStart" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        @confirm="confirm_termStart"
      />
    </van-popup>
    <van-popup v-model="show_termEnd" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        @confirm="confirm_termEnd"
      />
    </van-popup>
    <van-popup v-model="Picker1" position="bottom">
      <van-picker
        show-toolbar
        :columns="comListName"
        @confirm="onConfirm1"
        @cancel="Picker1 = false"
      />
    </van-popup>
    <van-popup v-model="Picker2" position="bottom">
      <van-picker
        show-toolbar
        :columns="rvUserListName"
        @confirm="onConfirm2"
        @cancel="Picker2 = false"
      />
    </van-popup>
    <!-- 审核 -->
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
import { Dialog } from "vant";
import {
  getRvBiz,
  getTaskLogList,
  rvComList,
  findUserByRoleId,
  updateRvTerm,
  bizUpdate,
  approve,
  getLsContract,
} from "@/service/common";
export default {
  name: "processForm",
  props: {
    businessKey: {
      type: String,
      default: "",
    },
    formData: {
      type: Object,
    },
    task: {
      type: Object,
    },
  },
  data() {
    return {
      params: null,
      message2: "",
      radio: "1",
      showAuth: false,
      updateRvTermObj: {},
      Picker1: false,
      Picker2: false,
      minDate: new Date(2015, 10, 1),
      list: [],
      show_termStart: false,
      show_termEnd: false,
      currentDate: new Date(),
      loading: false,
      finished: false,
      refreshing: false,
      active: "0",
      searchKeyWord: "",
      showPlan: false,
      vehicleList: [],
      csLogList: [],
      bill: {
        comId: "",
        termStart: "",
        termEnd: "",
        comName: "",
        rvUserName: "",
        rvUserId: "",
      },
      comList: [],
      rvUserList: [],
      comListName: [],
      rvUserListName: [],
      contract: "",
    };
  },
  async created() {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + "px";
    this.init();
    this.$on("createSaveBtn", function () {
      this.showAuth = true;
      console.log("保存并提交");
      this.params.rvReason = this.bill.rvReason;
      let _self = this;
      bizUpdate({
        id: this.businessKey,
        params: JSON.stringify(this.params),
      });
    });
    this.$on("termSubmit", function () {
      this.showAuth = true;
    });
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
      if (this.errorFn()) {
        this.$toast(this.errorFn());
        return;
      }
      let params = {
        agree: this.radio == "1" ? true : false,
        taskId: this.$parent.taskId,
        comment: this.message2,
        variables: variables,
      };
      _self.approveForm = params;
      this.successFn();
      const response2 = await approve(_self.approveForm);
      if (response2 && response2.code == "0") {
        this.$toast("审批提交成功");
        this.showAuth = false;
        this.successFn();
        this.$parent.routeToDetail();
      }
    },
    successFn() {
      if (this.task.activityId == "Activity_18qx20j") {
        console.log(JSON.stringify(this.updateRvTermObj))
         this.params = {
          ...this.params,
          termForm: this.updateRvTermObj,
        };

        bizUpdate({
          id: this.businessKey,
          params: JSON.stringify(this.params),
        });
      }
    },
    errorFn() {
      if (this.task.activityId == "Activity_18qx20j") {
        let a = this.bill;
        this.updateRvTermObj.termStart = a.termStart;
        this.updateRvTermObj.termEnd = a.termEnd;
        this.updateRvTermObj.comId = a.comId;
        this.updateRvTermObj.rvUserId = a.rvUserId;
        this.updateRvTermObj.rvUserName = a.rvUserName;
        this.updateRvTermObj.bizId = this.businessKey;
        if (!this.updateRvTermObj.termStart) {
          return "请选择收车方案开始时间";
        }
        if (!this.updateRvTermObj.termEnd) {
          return "请选择收车方案结束时间";
        }
        if (this.updateRvTermObj.termStart > this.updateRvTermObj.termEnd) {
          return "收车方案开始时间不能超过结束时间";
        }
        console.log(this.updateRvTermObj)
      }
      return "";
    },
    comNameFn(bill) {

      // 如果收车渠道不是第三方，显示"无需选择"
      if (bill.rvChannel != 2) {
        return "无需选择";
      }
      
      // 检查 params 和 termForm 是否存在
      if (!this.params || !this.params.termForm || !this.params.termForm.comId) {
        return "未填写";
      }
      
      // 从 comList 中查找对应的公司名称
      const company = this.comList.find(item => item.id == this.params.termForm.comId);
      return company ? company.comName : "未填写";
    },
    rvUserNameFn(bill) {
      let a = "";
      if (bill.rvUserName == null) {
        a = "未填写";
      } else {
        a = bill.rvUserName;
      }
      if (bill.rvChannel != 3 && bill.rvUserName == null) {
        a = "无需选择";
      }
      return a;
    },
    show_termStartFn() {
      if (this.task.activityId == "Activity_18qx20j")
        this.show_termStart = true;
    },
    show_termEndFn() {
      if (this.task.activityId == "Activity_18qx20j") this.show_termEnd = true;
    },
    Picker1Fn() {
      if (
        this.task.activityId == "Activity_18qx20j" &&
        this.bill.rvChannel == 2
      )
        this.Picker1 = true;
    },
    Picker2Fn() {
      if (
        this.task.activityId == "Activity_18qx20j" &&
        this.bill.rvChannel == 3
      )
        this.Picker2 = true;
    },
    onConfirm1(value) {
      // 查找选中的公司
      const selectedCompany = this.comList.find(item => item.comName == value);
      
      if (selectedCompany) {
        // 确保 params.termForm 存在
        if (!this.params.termForm) {
          this.params.termForm = {};
        }
        
        // 更新 params.termForm
        this.params.termForm.comId = selectedCompany.id;
        this.params.termForm.comName = selectedCompany.comName;
        
        // 使用 Vue.set 确保响应式更新
        this.$set(this.bill, 'comId', selectedCompany.id);
        this.$set(this.bill, 'comName', selectedCompany.comName);
      }
      this.Picker1 = false;
    },
    onConfirm2(value) {
      this.bill.rvUserName = value;
      this.bill.rvUserId = this.rvUserList.find((val) => val.userName).id;
      this.Picker2 = false;
    },
    contractNoFn(a) {
      if (a == "1") return "经销商";
      if (a == "2") return "第三方";
      if (a == "3") return "自主收车";
      return a;
    },
    confirm_termStart(time) {
      let day = time.getDate();
      if (time.getDate() < 10) {
        day = "0" + day;
      }
      var hour = time.getHours(); // 时
      var minutes = time.getMinutes(); // 分
      let month = Number(time.getMonth()) + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      this.bill.termStart =
        time.getFullYear() +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        "00";
      this.show_termStart = false;
    },
    confirm_termEnd(time) {
      let day = time.getDate();
      if (time.getDate() < 10) {
        day = "0" + day;
      }
      var hour = time.getHours(); // 时
      var minutes = time.getMinutes(); // 分
      let month = Number(time.getMonth()) + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      }
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      this.bill.termEnd =
        time.getFullYear() +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        "00";
      this.show_termEnd = false;
    },
    init(item) {
      rvComList({ comName: "" }).then((rep) => {
        this.comList = rep.data;
        this.comListName = rep.data.map((val) => val.comName);
      });

      findUserByRoleId({ roleId: 172 }).then((rep) => {
        this.rvUserList = rep.data;
        this.rvUserListName = rep.data.map((val) => val.userName);
      });
      if (this.businessKey) {
        getRvBiz({ id: this.businessKey }).then((res) => {
          if (res.code == 0) {
            this.bill = res.data;
            let params = JSON.parse(res.data.params);
            this.params = params;
            this.bill.rvChannel = parseInt(params.rvChannel);
            this.bill.rvReason = params.rvReason;
            this.bill.rvRemark = params.rvRemark;
            this.vehicleList = params.cars == null ? [] : params.cars;
            if (params.termForm != null) {
              this.bill.termStart = params.termForm.termStart;
              this.bill.termEnd = params.termForm.termEnd;
              this.bill.rvUserName = params.termForm.rvUserName;
            }
            this.files = params.files == null ? [] : params.files;
            let contractNo = this.bill.contractNo;
            this.contractNo = contractNo;
            // csContractDetail({ contractNo }).then((res) => {
            //   if (res.code == 0) {
            //     this.contract = res.data;
            //     this.contractNo = this.contract.contractNo;
            //     this.repayPlanList = res.data.repayPlanList;
            //   } else {
            //     this.$notify.error(res.message);
            //   }
            // });
            getLsContract(contractNo).then((res) => {
              if (res.code == 0) {
                this.contract = res.data;
                this.contractNo = this.contract.contractNo;
                this.repayPlanList = res.data.repayPlanList;
              } else {
                this.$notify.error(res.message);
              }
            });
            // this.bill = res.data;
            // this.contract = res.data.contractDetail;
            // this.vehicleList = res.data.cars;
            // this.csLogList = res.data.caLogList;
            // getTaskLogList({ contractNo: res.data.contractNo }).then((res) => {
            //   if (res.code == 0) {
            //     this.csLogList = res.data;
            //     // this.csLogList = [
            //     //   {row:{
            //     //     scIsVisit:'是',
            //     //     scLocation: '1',
            //     //     scTargetName: '扳手',
            //     //     willingness: '1',
            //     //     promiseTime: '21312',
            //     //     defuseSuggest: '11',
            //     //     log:'log',
            //     //     attachList: [
            //     //       {url: '11',name: '11',},
            //     //       {url: '22',name: '22',},
            //     //       {url: '33',name: '33',}
            //     //     ]
            //     //   }}
            //     // ]
            //     this.csLogList.forEach((item) => {
            //       if (item.attach) {
            //         item.attachList = JSON.parse(item.attach);
            //       } else {
            //         item.attachList = [];
            //       }
            //     });
            //   }
            // });
          } else {
            this.$notify.error(res.message);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .confirm {
    color: #0db3a7;
  }
}
.listDiv {
  max-height: 800px;
  overflow-y: scroll;
  margin-bottom: 50px;
}
.page-container {
  height: 100%;
  background-color: #f9fafe;
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
  color: #0db3a7;
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
  color: #0db3a7;
  font-size: 16px;
}
.unsigned-btn {
  color: #f40604;
}
.empty-container {
  padding-top: 20%;
  margin-bottom: 50%;
}
</style>
