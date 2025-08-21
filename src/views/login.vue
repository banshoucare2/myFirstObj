<template>
  <div style="margin-top: 60px;">
    <!-- <PageHeader /> -->
    <van-form @submit="onSubmit" @failed="onFailed">
      <div v-if="btnText == '验证码登录'">
        <van-field
          v-model="formData.username"
          name="username"
          label="账号"
          placeholder="请输入账号"
          :formatter="formatSpace"
          :required="true"
          :error="false"
          :rules="[{ pattern: formPatterns.noVoidReg, message: '请输入账号' }]"
        />
        <van-field
          type="password"
          v-model="formData.password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :formatter="formatSpace"
          :required="true"
          :error="false"
          :rules="[{ pattern: formPatterns.noVoidReg, message: '请输入密码' }]"
        />
      </div>
      <div v-if="btnText == '密码登录'">
        <van-field
          @input="iphoneChange"
          v-model="formData.iphone"
          name="iphone"
          label="手机号"
          placeholder="请输入手机号"
          :formatter="formatSpace"
          :required="true"
          :error="false"
          :rules="[{ pattern: formPatterns.telPattern, message: '请输入手机' }]"
        />
        <div style="display: flex;">
          <van-field
            v-model="formData.yzm"
            name="yzm"
            label="验证码"
            placeholder="请输入验证码"
            :formatter="formatSpace"
            :required="true"
            :error="false"
            :rules="[{ pattern: formPatterns.noVoidReg, message: '请输入验证码' }]"
          />
          <van-button :disabled = 'getYzmDis' style="margin:5px 10px 0 10px;padding: 0 5px;height: 38px;width: 120px;" @click ="getYzm()" type="info">{{yzm}}</van-button>
        </div>
        <van-field 
            v-if ="showQIye"
            @click="Picker = true"
            v-model="formData.qiye"
            name="qiye"
            label="所属企业"
            placeholder="请选择所属企业"
            :formatter="formatSpace"
            :required="true"
            :error="false"
            readonly
            :rules="[{ pattern: formPatterns.noVoidReg, message: '请选择所属企业' }]"
          />
      </div>
      <van-popup v-model="Picker" position="bottom">
        <van-picker
          show-toolbar
          :columns="qiyeList"
          @confirm="onConfirm"
          @cancel="Picker = false"
        />
      </van-popup>
      <div style="text-align: right;height:50px;line-height: 50px;">
        <a style="margin: 25px;text-decoration: underline;" @click ="changeFn()" type="info">{{btnText}}</a>
      </div>  
      <van-button class="btn-container" block type="info" native-type="submit">登录</van-button>
    </van-form>
  </div>
</template>

<script>
import PageHeader from '@/layout/header.vue'
import Patterns from '@/utils/patterns'
import cookies from "js-cookie"
import { formatSpace } from '@/utils/format'
import { login, findUserByParam, sendLoginSms } from '../service/common'

export default {
  components: { PageHeader},
  data () {
    return {
      getYzmDis: false,
      arry: [],
      selectId: '',
      Picker: false,
      yzm: '获取验证码',
      btnText: '验证码登录',
      showQIye: false,
      qiyeList: [],
      formData: {
        username: '',
        password: '',
        qiye:'',
        iphone: '',
        yzm: ''
      },
      formatSpace,
      // 正则验证
      formPatterns: {
        noVoidReg: Patterns.noVoidReg,
        telPattern: Patterns.phoneNumReg
      },
    }
  },
  created () {
    // 获取缓存表单数据
    cookies.set('ge_adminToken', '')
    const domain = process.env.NODE_ENV === 'production' ? 'https://pf.tsflc.com' : 'https://pf-test.tsflc.com';

    //测试环境
    // const domain = 'https://pf-test.tsflc.com';
    const url = domain + "/financial_lease_app_html/#/";
    window.location.href = url
  },
  methods: {
    async sendLoginSms (iphone) {
      let params = {
        mobile:iphone
      }
      const response = await sendLoginSms(params)
      if (response && response.code == '0') {
        this.$toast('短信发送成功！')
      }
    },
    getYzm () {
      if (!Patterns.phoneNumReg.test(this.formData.iphone)){
        this.$toast('请输入正确的手机号')
        return
      }
      this.sendLoginSms (this.formData.iphone)
      this.getYzmDis = true
      let i = 60  // 倒计时秒数
      let t = setInterval(countDown, 1000);
      let _this = this
      function countDown() {
        _this.yzm = (i + '秒后获取验证码')
        if (i === 0) {
          _this.yzm = '获取验证码'
          _this.getYzmDis = false
          clearInterval(t);
        }
        i--;
      }
    },
    onConfirm (value, index) {
     this.Picker = false
     this.formData.qiye = value
     this.selectId = this.arry.find(val => val.companyName).id
     console.log(this.selectId)
    },
    iphoneChange () {
      if (Patterns.phoneNumReg.test(this.formData.iphone)){
        this.showQIye = true
        this.findUserByParam(this.formData.iphone)
      } else {
        this.showQIye = false
      }
    },
    async findUserByParam (iphone) {
      let params = {
        search:iphone
      }
      const response = await findUserByParam(params)
      if (response && response.code == '0') {
        this.arry = response.data
        this.formData.qiye = response.data[0].companyName
        this.qiyeList = response.data.map(val =>val.companyName)
      }
    },
    changeFn () {
      if (this.btnText == '验证码登录') {
        this.btnText = '密码登录'
      } else {
        this.btnText = '验证码登录'
      }
    },
    async onSubmit () {
      this.$store.dispatch('loading/show')
      let params = {}
      if (this.btnText == '验证码登录') {
        params = {
          type: 'normal',
          tenantId: '1',
          username: this.formData.username,
          password: this.formData.password
        }
      }
      if (this.btnText == '密码登录') {
        params = {
          type: 'code',
          tenantId: '1',
          username: this.formData.iphone,
          password: this.formData.yzm
        }
      }   
      const response = await login(params)
      if (response && response.code == '0') {
        cookies.set('ge_adminToken', response.data.token)
        this.$router.push({path: '/dingding/center'})
      }
    },
    onFailed (error) {
      console.log('Error: ', error)
    }
  }
}
</script>

<style scoped>
.btn-container {
  width: 95%;
  margin: 10px;
  background-color: #0DB3A7;
  border-color: #0DB3A7;
}
</style>
