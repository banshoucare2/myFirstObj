<template>
  <div style="margin-top: 60px;">
   <el-form style="width: 400px;
    margin: 0 auto;" :model="formData" label-width="auto" label-suffix=":" size="small" :rules="rules" ref="formPost" class="search-form2">         
      <el-row :gutter="5">
        <el-col :span="24">
          <el-form-item label="账号" prop="username">
            <el-input placeholder="请输入账号"   v-model="formData.username">
            </el-input>
          </el-form-item>
        </el-col>          
      </el-row>
      <el-row :gutter="5">
        <el-col :span="24">
          <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码"  type="password"   v-model="formData.password">
            </el-input>
          </el-form-item>
        </el-col>          
      </el-row>      
      <el-row :gutter="5" style="text-align: right;">
        <el-button  type="primary" @click="onSubmitBefore">登录</el-button>
      </el-row>
   </el-form>
    
  </div>
</template>

<script>
import PageHeader from '@/layout/header.vue'
import Patterns from '@/utils/patterns'
import cookies from "js-cookie"
import { login, findUserByParam, sendLoginSms } from '../service/common'

export default {
  components: { PageHeader},
  data () {
    return {
      formData: {
        username: '',
        password: '',
        qiye:'',
        iphone: '',
        yzm: ''
      },
      rules: {     
        username: [
          { required: true, message: '请输入该项', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入该项', trigger: 'change' }   
        ]
      },    
    }
  },
  created () {
    // 获取缓存表单数据
    cookies.set('ge_adminToken', '')
  },
  methods: {
    onSubmitBefore () {
       this.$refs['formPost'].validate(valid1 => {
        if (valid1) {
          let  params = {
            type: 'normal',
            tenantId: '1',
            username: this.formData.username,
            password: this.formData.password
          }  
          this.onSubmit(params)
        }
      })
    },
    async onSubmit (params) {
       const response = await login(params)
          this.$startLoad();
          if (response && response.code == '0') {
            this.$endLoad();
            cookies.set('ge_adminToken', response.data.token)
            this.$message.success('操作成功')
            this.$router.push({path: '/index'})    
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
