<template>
   <div class="page-container">
      <div class="process-form" >
        <component
          :is='formComponent'
          :task="task"
          :businessKey="processInstance.businessKey"
          v-if="processInstance.businessKey"
          ref="processForm"/>
      </div>
      <div style="position: fixed;bottom: 20px;left: 0;right: 0;z-index: 40;">
      <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; padding: 8px 0;" class="divBtn">
        <van-button v-if="defaultDefinedBtns.approvalBtn" type="danger" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="authFn">提交</van-button>
        <van-button v-if="defaultDefinedBtns.forwardBtn && !disableForward" type="default" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="forward">转交</van-button>
        <van-button v-if="defaultDefinedBtns.addSigBtn" type="default" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="addSig">加签</van-button>
        <van-button v-if="defaultDefinedBtns.backBtn" type="default" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="backFn">回退</van-button>
        <van-button v-if="defaultDefinedBtns.terminateBtn" type="default" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="terminate">终止</van-button>
        <!-- 自定义按钮 -->
        <van-button v-for="item in userDefinedBtns" :key="item.key" type="default" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="userDefinedBtnClick(item.key)">
          {{ item.name }}
        </van-button>
        <van-button type="default" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="authHistory">审批历史</van-button>
        <van-button type="default" style="padding: 0 10px; min-width: auto; white-space: nowrap; font-size: 12px;" @click="routeToDetail">返回</van-button>
      </div>
    </div>
    <!-- 审核记录 -->
    <van-dialog title="审核历史" v-model="showPlan" @confirm="showPlanconfirm">
      <div style="margin-top: -13px;text-align: left;max-height: 550px;overflow-y: scroll;">
        <van-steps class="steps" direction="vertical" :active="taskList.length-2" center>
          <van-step  v-for="task in taskList" :key="task.id">
            <p><span style="font-weight: bold;">{{task.activityName}}</span> - {{ task.startTime }}</p>
            <p>处理人: {{task.variables.actionUserName ? task.variables.actionUserName : userMap[task.assignee]}}</p>
            <p>审批意见:
              <span v-if="task.actionType == 'agree'">同意</span>
              <span v-if="task.actionType == 'refuse'">拒绝</span>
              <span v-if="task.actionType == 'skip'">跳过</span>
              <span v-if="task.actionType == 'back'">回退（逐级审批）</span>
              <span v-if="task.actionType == 'back_origin'">回退（回到当前节点）</span>
              <span v-if="task.actionType == 'voted'">已投票</span>
              <span v-if="task.actionType == 'start_vote'">发起投票</span>
              <span v-if="task.actionType == 'forward'">转交</span>
              <span v-if="task.actionType == 'add_sig'">加签</span>
              <span v-if="task.actionType == 'terminate'">终止</span>
            </p>
            <p style="word-wrap:break-word">意见描述: {{task.comment}}</p>
          </van-step>
        </van-steps>
      </div>
    </van-dialog>
    <!-- 提交 -->
    <van-dialog title="提交" v-model="showAuth" :show-cancel-button="false" :show-confirm-button="false" cancelButtonText="取消">
      <van-cell-group >
        <van-field
          required
          type="textarea"
          v-model="approveForm.comment"
          label="意见"
          placeholder="请输入"
          rows="5"
          maxlength="300"
          show-word-limit
        />
      </van-cell-group>
      <div class="dialog-footer">
        <span @click="showAuth= false">取消</span>
        <span class="confirm" @click="confirmDialog">确认</span>
      </div>
    </van-dialog>

    <!-- 定制转办/加签弹框 -->
    <van-dialog :title="forwardDialogOptions.title" v-model="forwardDialogVisible" :show-cancel-button="false" :show-confirm-button="false" cancelButtonText="取消">
      <van-search v-model="forwardForm.searchInput" show-action placeholder="请搜索名字或手机号">
        <template #action>
          <div @click="forwardHandleSearch">搜索</div>
        </template>
      </van-search>
      <van-cell-group >
        <van-field
          type="textarea"
          v-model="forwardForm.comment"
          label="意见"
          placeholder="请输入"
          rows="5"
          maxlength="300"
          show-word-limit
        />
      </van-cell-group>
      <div class="dialog-footer">
        <span @click="forwardDialogVisible= false">取消</span>
        <span class="confirm" @click="handleForwardSubmit">确认</span>
      </div>
    </van-dialog>
    <van-popup v-model="forwardShowDropdown" destroy-on-close position="bottom">
      <van-picker
        :columns="forwardOptions"
        v-model="forwardForm.newUserId"
        show-toolbar
        @confirm="forwardConfirm"
        @cancel="forwardShowDropdown = false"
      />
    </van-popup>

    <!-- 终止 -->
    <van-dialog title="终止流程" v-model="terminateDialogVisible" :show-cancel-button="false" :show-confirm-button="false" cancelButtonText="取消">
      <van-cell-group >
        <van-field
          required
          type="textarea"
          v-model="terminateForm.comment"
          label="意见"
          placeholder="请输入"
          rows="5"
          maxlength="300"
          show-word-limit
        />
      </van-cell-group>
      <div class="dialog-footer">
        <span @click="terminateDialogVisible= false">取消</span>
        <span class="confirm" @click="terminateSubmit">确认</span>
      </div>
    </van-dialog>

    <!-- 回退 -->
    <van-dialog title="回退" v-model="showBack" :show-cancel-button="false"  :show-confirm-button="false" cancelButtonText="取消">
      <!-- 回退选择 -->
      <van-field name="typeDesc" v-model="backForm.typeDesc" is-link label="回退到" placeholder="请选择" @click="showType = true" required />
      <!-- 回退模式 -->
      <van-field name="subTypeDesc" v-model="backForm.subTypeDesc" is-link label="回退模式" placeholder="请选择" @click="showMode = true" required />
      <!-- 节点选择 -->
      <van-field v-if="backForm.type == 3" v-model="backForm.targetIdDesc" is-link name="picker" label="回退节点" placeholder="选择节点" @click="showTargetId = true" required />
      <van-cell-group >
        <van-field type="textarea" v-model="backForm.comment" label="意见" placeholder="请输入" rows="5" maxlength="300" show-word-limit />
      </van-cell-group>
      <div class="dialog-footer">
        <span @click="showBack= false">取消</span>
        <span class="confirm" @click="confirmBack">确认</span>
      </div>
    </van-dialog>
    <!-- 回退选择 -->
    <van-popup v-model="showType" destroy-on-close position="bottom">
      <van-picker
        :columns="[
          { text: '发起人', value: 1 },
          { text: '上一个节点', value: 2 },
          { text: '指定节点', value: 3 }
        ]"
        v-model="backForm.type"
        show-toolbar
        @confirm="onConfirmType"
        @cancel="showType = false"
      />
    </van-popup>
    <!-- 回退模式选择 -->
    <van-popup v-model="showMode" destroy-on-close position="bottom">
      <van-picker
        :columns="[
          { text: '逐级审批', value: 1 },
          { text: '回到当前节点', value: 2 }
        ]"
        v-model="backForm.subType"
        show-toolbar
        @confirm="onConfirmMode"
        @cancel="showMode = false"
      />
    </van-popup>
    <!-- 回退节点 -->
    <van-popup v-model="showTargetId" destroy-on-close position="bottom">
      <van-picker
        :columns="backNodeList"
        v-model="backForm.targetId"
        show-toolbar
        @confirm="onConfirm"
        @cancel="showTargetId = false"
      />
    </van-popup>
  </div>
</template>

<script>
import store from '@/store'
import cookies from "js-cookie";
import { getTaskById, instance, getProcessDefinition, findUserByUserIds, getInstHis, approve, back, forward, addSig, terminate, findUserByNameOrMobile } from '@/service/common'
import LoadingComponent from '@/components/loading';
import ErrorComponent from '@/components/error';
import { notifyTodoRefresh } from '../utils/todoMessageUtil.js';
export default {
  name: 'HelloWorld',
  data () {
    return {
      taskDefinition:'',
      updateRvTermObj: {},
      vueName: '',
      taskId: '',
      formComponent: LoadingComponent,
      processDefinition: '',
      task: null,
      processInstance: {},
      loading: false,
      finished: false,
      refreshing: false,
      showPlan: false,
      showAuth: false,
      taskList: [],
      userMap: '',
      userDefinedBtns:[],
      defaultDefinedBtns: {
        approvalBtn: true,
        backBtn: false,
        forwardBtn: true,
        addSigBtn: true,
        terminateBtn: false
      },
      /* 提交 */
      approveForm: {
        agree: true,
        comment: ''
      },
      /* 回退 */
      showBack: false,
      showType: false, // 回退选择
      showMode: false, // 回退模式选择
      showTargetId: false, // 节点选择
      backForm: {
        type: '2',
        typeDesc: '上一个节点',
        subType: '1',
        subTypeDesc: '逐级审批',
        targetId: '',
        targetIdDesc: '',
        comment: ''
      },
      backNodeList: [],
      /* 转交|加签|终止 */
      disableForward: false,
      forwardDialogVisible: false,
      forwardDialogOptions: {},
      forwardForm: { searchInput: "", newUserId: "", comment: "" },
      forwardOptions: [],
      forwardShowDropdown: false,
      terminateDialogVisible: false,
      terminateForm: { taskId: "", comment: ""},
    }
  },
  created () {
    const url = location.href || location.hash;
    console.log("this.url:",url)
    if (url.split('?')[1]){
      this.taskId = url.split('?')[1].split('=')[1]
      console.log("this.taskId1:",this.taskId)
    } else {
      // this.taskId = this.$route.params.taskId || cookies.get('taskId')
      this.taskId = this.$route.query.taskId
      console.log("this.taskId2:",this.taskId)
    }
    this.init(this.taskId)
  },
  methods: {
    async init (taskId) {
      const params = { taskId : taskId}
      const response = await getTaskById(params)
      if (response && response.code == '0') {
        this.task = response.data;
        const response1 = await instance({instId:this.task.processInstanceId})
          if (response1 && response1.code == '0') {
            this.processInstance = response1.data;
            const response2 = await getProcessDefinition({definitionId: this.task.processDefinitionId})
            if (response2 && response2.code == '0') {
              this.processDefinition = response2.data;
              this.taskDefinition = this.processDefinition.taskDefinitions[this.task.activityId];
              if (this.processDefinition.properties.formComponent) {
                let path = this.processDefinition.properties.formComponent;
                if (this.taskDefinition && this.taskDefinition.properties && this.taskDefinition.properties['formComponent']) {
                  //update path if activity has its own formComponent path
                  path = this.taskDefinition.properties['formComponent']
                }                
                // this.loadComponent('retrievablecar/RvCreateForm')
                this.vueName = path
                console.log('PATHHHHHHH:',path)
                this.loadComponent(path);
                this.praseTaskDefinitionProperties()
              } else {
                this.$toast('流程定义没有设置 formComponent 属性');
              }
            }
          }
      } else {
        this.routeToDetail()
      }
    },
    loadComponent(path) {
      if (path.includes('productManager')) {
        this.formComponent = () => ({
          component: import('@/views/' + path).catch(err => setTimeout(() => window.location.href = '/dingding/center', 500)),
          loading: LoadingComponent,
          error: ErrorComponent,
          delay: 200,
          timeout: 3000
        });
      }else if (path.includes('performance')) {
        this.formComponent = () => ({
          component: import('@/views/' + path).catch(err => setTimeout(() => window.location.href = '/dingding/center', 500)),
          loading: LoadingComponent,
          error: ErrorComponent,
          delay: 200,
          timeout: 3000
        });
      } else {
        this.formComponent = () => ({
          component: import('@/views/leaseAfter/' + path).catch(err => {
            this.$toast("请前往PC端处理");
            setTimeout(() => {
              this.routeToDetail()
            }, 3000);
          }),
          loading: LoadingComponent,
          error: ErrorComponent,
          delay: 200,
          timeout: 3000
        });
      }
  	},
    praseTaskDefinitionProperties() {
      if (this.taskDefinition && this.taskDefinition.properties && this.taskDefinition.properties['approvalBtn']) {
        this.$set(this.defaultDefinedBtns, 'approvalBtn', this.taskDefinition.properties['approvalBtn'] === 'true');
      }
      if (this.taskDefinition && this.taskDefinition.properties && this.taskDefinition.properties['backBtn']) {
        this.$set(this.defaultDefinedBtns, 'backBtn', this.taskDefinition.properties['backBtn'] === 'true');
      }
      if (this.taskDefinition && this.taskDefinition.properties && this.taskDefinition.properties['forwardBtn']) {
        this.$set(this.defaultDefinedBtns, 'forwardBtn', this.taskDefinition.properties['forwardBtn'] === 'true');
      }
      if (this.taskDefinition && this.taskDefinition.properties && this.taskDefinition.properties['addSigBtn']) {
        this.$set(this.defaultDefinedBtns, 'addSigBtn', this.taskDefinition.properties['addSigBtn'] === 'true');
      }
      if (this.taskDefinition && this.taskDefinition.properties && this.taskDefinition.properties['terminateBtn']) {
        this.$set(this.defaultDefinedBtns, 'terminateBtn', this.taskDefinition.properties['terminateBtn'] === 'true');
      }
      if (this.taskDefinition && this.taskDefinition.properties && this.taskDefinition.properties['userDefinedBtns']) {
        try {
          this.userDefinedBtns = JSON.parse(this.taskDefinition.properties['userDefinedBtns']);
        } catch(err) {
          this.$toast('用户节点-自定义按钮格式异样')
        }
      }
    },
    userDefinedBtnClick(key) {
      this.$refs['processForm'].$emit(key);
    },
    async authHistory () {
     this.showPlan = true
     const res = await getInstHis({instId:this.task.processInstanceId})
     if (res.code == 0) {
        let taskList = res.data.taskList;
        let userIds = [];
        taskList.forEach(t => {if (t.assignee) {
          userIds.push(t.assignee);
        }});
        findUserByUserIds({userIds:userIds.join(',')}).then(res1 => {
          if (res1.code == 0 && res1.data) {
            let userMap = {};
            res1.data.forEach(u => userMap[u.id] = u.userName);
            this.userMap = userMap;
          }
        })
        this.taskList = this.filter(taskList);
      } else {
        this.$toast(res.message);
      }
    },
    filter(data) {
      console.log('【原始】', data)
      let processForm = this.$refs["processForm"];
      if (processForm.filterProcessComment) {
        console.log('【执行后】', processForm.filterProcessComment(data));
        return processForm.filterProcessComment(data);
      }
      return data;
    },
    showPlanconfirm () {
     this.showPlan = false
    },
    authFn () {
     this.showAuth = true
    },
    /* 提交 */
    async confirmDialog () {
      let _self = this
      let processForm = this.$refs.processForm
      let variables = {};
      let formData = {};
      if (processForm.getVariables) {
        variables = processForm.getVariables();
      }
      if (processForm.getFormData) {
        formData = processForm.getFormData();
      }

      let params = {
        taskId: this.taskId,
        formData: formData,
        variables: variables,
        ...this.approveForm
      }
      _self.approveForm = params
      // 自定义的提交接口
      if (processForm.approveSelf) {
        processForm.approveSelf(_self);
        return
      }
      this.$store.dispatch('loading/show')
      const response2 = await approve( _self.approveForm)
      this.$store.dispatch('loading/close')
      if (response2 && response2.code == '0') {
        this.$toast('审批提交成功')
         // 提交后回调
        if (processForm.successAfter) {
          processForm.successAfter()
        }
        this.showAuth = false
        this.routeToDetail()
      }
    },
    routeToDetail (item, isRefused) {
      cookies.set('taskId', '')
      this.$router.push({path: '/dingding/index'})
    },
    async backFn() {
      this.showBack = true;
      this.$store.dispatch('loading/show')
      const res = await getInstHis({instId:this.task.processInstanceId})
      this.$store.dispatch('loading/close')
      if (res.code == 0) {
        this.backNodeList = [];
        for (var i = 0; i < res.data.taskList.length; i++) {
          let item = res.data.taskList[i];
          if (this.task.activityId === item.activityId) {
            break;
          }
          let index = this.backNodeList.findIndex(x => x.activityId === item.activityId);
          if (index < 0) {
            this.backNodeList.push({
              ...item,
              text: item.activityName,
              value: item.activityId
            });
          }
        }
      }
    },
    onConfirmType({ value, text }) {
      this.backForm.type = value
      this.backForm.typeDesc = text
      this.showType = false
      if (value !== 3) {
        this.backForm.targetId = ''
        this.backForm.targetIdDesc = ''
      }
    },
    onConfirmMode({ value, text }) {
      this.backForm.subType = value
      this.backForm.subTypeDesc = text
      this.showMode = false
    },
    onConfirm({ value, text }) {
      this.backForm.targetId = value
      this.backForm.targetIdDesc = text
      this.showTargetId = false
    },
    /* 驳回 */
    async confirmBack() {
      if (!this.backForm.type) {
        this.$toast('请选择回退到')
        return
      }
      if (!this.backForm.subType) {
        this.$toast('请选择回退模式')
        return
      }
      if (this.backForm.type == 3 && !this.backForm.targetId) {
        this.$toast('请选择回退节点')
        return
      }

      let params = {
        taskId: this.taskId,
        type: this.backForm.type,
        subType: this.backForm.subType,
        comment: this.backForm.comment,
        targetId: this.backForm.targetId
      };
      this.$store.dispatch('loading/show')
      const res = await back(params)
      this.$store.dispatch('loading/close')
      if (res.code == 0) {
        this.$toast('回退成功')
        this.showBack = false
        this.routeToDetail()
      }
    },
    /*  */
    setDisableForward() {
      if (this.task != null && this.task != undefined
        && this.task.variables != null && this.task.variables != undefined
        && this.task.variables.disableForward != null
        && this.task.variables.disableForward != undefined) {
        this.disableForward = this.task.variables.disableForward === true;
      }
    },
    clearForwardData() {
      this.forwardForm = this.$options.data().forwardForm
      this.forwardDialogOptions = {};
      this.forwardOptions = [];
    },
    /* 转交 */
    forward(options = {}) {
      this.clearForwardData();
      const dialogOptions = {
        title: "转交",
        apiFunction: this.forwardApi,
        ...options,
      };
      this.forwardDialogVisible = true;
      this.forwardDialogOptions = dialogOptions;
    },
    async forwardApi() {
      this.forwardForm.taskId = this.taskId;

      if (!this.forwardForm.newUserId) {
        this.$toast("请选择" + this.forwardDialogOptions.title + "人员");
        return;
      }

      this.$store.dispatch('loading/show')
      const res = await forward(this.forwardForm)
      this.$store.dispatch('loading/close')
      if (res.code == 0) {
        this.$toast(this.forwardDialogOptions.title +'提交成功')
        this.forwardDialogVisible = false;
        setTimeout(() => {
          this.routeToDetail()
        }, 1000);
        notifyTodoRefresh('process-approval-component forward')
      } else {
        this.$toast(res.message)
      }
    },
    async forwardHandleSearch() {
      const query = this.forwardForm.searchInput.trim();
      this.forwardForm.newUserId = '';
      if (query) {
        try {
          this.$store.dispatch('loading/show')
          const response = await findUserByNameOrMobile(query);
          this.$store.dispatch('loading/close')
          if (response.code === 0) {
            this.forwardOptions = response.data.map((user) => ({
              value: user.id,
              text: `${user.userName} (${user.mobile})`,
            }));

            this.forwardShowDropdown = this.forwardOptions.length > 0;
          } else {
            console.error("API return error:", response);
            this.forwardOptions = [];
            this.forwardShowDropdown = false;
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          this.forwardOptions = [];
          this.forwardShowDropdown = false;
        }
      } else {
        this.forwardOptions = [];
        this.forwardShowDropdown = false;
      }
    },
    forwardConfirm({ value, text }) {
      console.log('value', value);
      console.log('text', text);
      this.forwardForm.newUserId = value
      this.forwardForm.searchInput = text;
      this.forwardShowDropdown = false;
    },
    async handleForwardSubmit() {
      this.$store.dispatch('loading/show')
      try {
        if (this.forwardDialogOptions.apiFunction) {
          await this.forwardDialogOptions.apiFunction();
          console.log("Action completed successfully!");
        } else {
          console.error("No API function provided.");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.$store.dispatch('loading/close')
      }
    },
    /* 加签 */
    addSig(options = {}) {
      this.clearForwardData();
      const dialogOptions = {
        title: "加签",
        apiFunction: this.addSigApi,
        ...options,
      };
      this.forwardDialogVisible = true;
      this.forwardDialogOptions = dialogOptions;
    },
    async addSigApi() {
      this.forwardForm.taskId = this.taskId;

      if (!this.forwardForm.newUserId) {
        this.$toast("请选择" + this.forwardDialogOptions.title + "人员");
        return;
      }

      this.$store.dispatch('loading/show')
      const res = await addSig(this.forwardForm)
      this.$store.dispatch('loading/close')
      if (res.code == 0) {
        this.$toast(this.forwardDialogOptions.title +'提交成功')
        this.forwardDialogVisible = false;
        setTimeout(() => {
          this.routeToDetail()
        }, 1000);
        notifyTodoRefresh('process-approval-component addSig')
      } else {
        this.$toast(res.message)
      }
    },
    /* 终止 */
    terminate() {
      this.terminateDialogVisible = true;
    },
    async terminateSubmit() {
      const params = {
        taskId: this.taskId,
        comment: this.terminateForm.comment
      };
      this.$store.dispatch('loading/show')
      const res = await terminate(params)
      this.$store.dispatch('loading/close')
      if (res.code == 0) {
        this.$notify.success('流程终止成功');
        this.terminateDialogVisible = false;
        setTimeout(() => {
          this.routeToDetail()
        }, 1000);
        notifyTodoRefresh('process-approval-component terminate')
      } else {
        this.$toast(res.message)
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/deep/ .divBtn button {
  height: 36px!important;
  border: 1px solid #ccc;
}
.plus-container {
  position: fixed;
  bottom: 10%;
  left: 50%;
  margin-left: -35px;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: #0DB3A7;
  box-shadow: 0px 0px 4px 4px #0DB3A720;
}
.page-container {
  height: 100%;
  background-color: #F9FAFE;
  padding-bottom: 16px;
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
.dialog-footer {
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .confirm {
    color: #ee0a24;
  }
}
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
  color: #0DB3A7;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tag-common {
  height: 24px;
  font-size: 14px;
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
.unsigned-btn {
  color: #F40604;
}
.list-item-btn {
  height: 40px;
  color: #0DB3A7;
  font-size: 16px;
  border-top-style: solid;
  border-top-color: #efefef;
  border-top-width: 1px;
}
.empty-container {
  padding-top: 20%;
  margin-bottom: 50%
}
.creditlistform>>>.van-list__finished-text{
  margin-bottom: 50px;
}
/*  */
/deep/.page-container .van-dialog {
        padding: 12px !important;
      }
/deep/.page-container .van-dialog__header {
        padding: 8px 0 16px 0 !important;
        font-weight: 700;
      }
</style>
