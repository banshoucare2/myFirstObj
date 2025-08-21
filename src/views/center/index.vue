<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <UserCard />
    <van-grid icon-size="32px" :border="false" :column-num="3" :clickable="true">
        <van-grid-item
          v-for="item in list"
          :key="item.text"
          :icon="item.src"
          :text="item.text"
          @click="routeToPath(item)"
        />
  </van-grid>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import UserCard from '@/components/user-card.vue'
export default {
  name: 'center',
  components: { UserCard },
  data () {
    return {
      list: [
        { src: require('@/assets/center/grid-3.png'), disabled: false, text: '待办处理', path: '/dingding/index' }      
      ]
    }
  },
  created () {
    console.log(this.userInfo)
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.$store.dispatch('user/queryDealerInfo', this.userInfo.mobile)
    if (this.userInfo.accountName == 'admin') {
      this.list.push({ src: require('@/assets/center/grid-8.png'), disabled: false, text: '员工管理', path: '/dingding/personManage' })
    }
  },
  mounted () {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.closeWindow, false)
    }
  },
  destroyed () {
    window.removeEventListener('popstate', this.closeWindow, false)
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    closeWindow () {
      // wx.closeWindow()
    },
    routeToPath (item) {
      if (item.disabled) return this.$toast('敬请期待!')
      this.$router.push(item)
    }
  }
}
</script>

<style scoped>
.page-container {
  padding-top: 15px;
  padding-bottom: 34px;
  height: 100%;
  background-color: #F9FAFE;
}
.page-content {
  margin-top: 10px;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
}
.cell-value-authed {
  color: #0DB3A7;
  font-weight: bold;
}
.cell-value-unauth {
  color: rgb(199, 61, 26);
  font-weight: bold;
}
</style>
