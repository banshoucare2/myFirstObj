<template>
   <div class="page-container" style="  padding-top: 10px;">
    <div class="creditList">
        <div class="page-container creditlistform" :style="{ minHeight: SCREEN_HEIGHT }">
          <van-sticky style="position: relative;">
            <van-search  v-model="searchKeyWord" @input="onLoad()" placeholder="请输入查询信息" />
            <van-button @click="returnFn" type="primary" style="    position: absolute;
            top: 9px;
            right: 13px;
            height: 35px;
            /* padding: 0 10px; */
            height: 36px;">个人中心</van-button>
          </van-sticky>
          <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onLoad(1)">
            <van-list :immediate-check="false" v-if="list && list.length > 0" v-model="loading" finished-text="没有更多数据了" :finished="finished" @load="onLoad(2)">
              <div class="list-item" :key="item.fileNo" v-for="item in list">
                <!-- <div class="list-item-header flex-row-between">
                </div> -->
                <div class="list-item-content">
                  <div class="item-content-text">员工姓名: {{ item.userName }}</div>
                  <div class="item-content-text">手机号: {{ item.mobile }}</span></div>
                  <div class="item-content-text">登录名: {{ item.accountName }}</div>
                  <div class="item-content-text">状态: {{ item.available? '可用' : '不可用' }}</div>
                  <div class="item-content-text">权限角色: {{juese(item)}}</div>
                </div>
                <div style="display: flex;justify-content: space-around;">
                  <div :class="['list-item-btn', 'flex-row-center']" @click="quick({userId: item.id})">
                  快捷登录
                  </div>
                  <!-- <div :class="['list-item-btn', 'flex-row-center']" @click="delect(item)">
                    删除
                  </div> -->
                </div>          
              </div>
            </van-list>
          </van-pull-refresh>
          <div v-if="!list || list.length === 0" class="empty-container">
            <van-empty description="暂无信息" />
          </div>
          <!-- <div class="plus-container flex-row-center" @click="routeToDetail">
            <van-icon name="plus" color="white" size="55" />
          </div> -->
        </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import cookies from "js-cookie";
import { Dialog } from 'vant'
import { userPage, quickLogin} from '@/service/common'
export default {
  name: 'HelloWorld',
  data () {
    return {
      list: [],
      searchKeyWord: '',
      loading: false,
      finished: false,
      refreshing: false,
      pageSize: 0,
      pageIndex: 1,
      timeLmit: false
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.onLoad()
  },
  methods: {
    juese (a) {
      return a.roles.map(b => b.name).toString()
    },
    statusFn (val) {
      if (val == 1) {
        return '进行中'
      }
      if (val == 0) {
        return '待处理'
      }
      return ''
    },
    returnFn () {
      this.$router.push({ name: 'Center'})
    },
    async onLoad (type) {
      if (!type || type == 1) {
        this.pageIndex = 1
        this.pageSize = 10
      } else {
        this.pageIndex = this.pageIndex + 1
        this.pageSize = 10
      }
      console.log(this.pageIndex)
      console.log(this.pageSize)
      this.loading = true
      // this.$store.dispatch('loading/show')
      const params = { pageIndex: this.pageIndex, pageSize: this.pageSize}
      params.param = this.searchKeyWord
      params.roleId = ''
      params.status = ''
      params.jobStatus = '' 
      const response = await userPage(params)
      // store.dispatch('loading/close')
      if (response && response.code == '0') {
        if (!type || type == 1) {
          this.list = response.data.results
        } else {
          let a = this.list
          let b = response.data.results        
          this.list = a.concat(b)
          
        }   
        console.log(this.list)
        this.loading = false
        this.refreshing = false
        if (response.data.results.length > 0) {
          this.finished = false
        } else {
          this.finished = true
        }
        
      }
    }, 
    async delectFn (params) {
      const response = await deleteTo(params)
      if (response && response.code == '0') {
        this.$toast('操作成功')
        this.onLoad()
      }
    },
    quick (param) {
      Dialog.confirm({
        title: '温馨提示',
        message: '是否快捷登录？',
        confirmButtonText: '确认',
        confirmButtonColor: '#0DB3A7',
        cancelButtonText: '取消',
        cancelButtonColor: '#999'
      }).then(() => {
        this.quickLoginFn(param)
      }).catch(() => {})
    },
    async quickLoginFn (param) {
      this.$store.dispatch('loading/show')
      const response = await quickLogin(param)
      this.$store.dispatch('loading/hide')
      cookies.set('ge_adminToken', response.data, { expires: 1 })
      this.returnFn()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  text-align: left;
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
</style>
