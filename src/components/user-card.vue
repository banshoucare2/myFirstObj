<template>
  <div>
    <van-image class="user-card-image" :src="require('@/assets/center/user-card.png')" />
    <div class="user-card-image extra-style flex-row-between">
      <div class="user-image-container">
        <!-- <div class="user-image">
          <van-image :src="imageUrl" width="74" height="74" radius="37" />
        </div> -->
        <div class="user-info">
          <div class="text-common username-text">{{ userInfo.userName }}</div>
          <div class="text-common mobile-text">{{ userInfo.mobile }}</div>
        </div>
      </div>
      <div class="rebind-btn flex-row-center" @click="routeToRebind">
        注销
      </div>
    </div>
     <van-dialog
      v-model="show"
      title="注销"
      message="是否继续"
      cancel-button-text="取消"
      confirm-button-text="确认"
      confirm-button-color="#F40604"
      show-cancel-button
      @confirm="confirm"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import cookies from "js-cookie";
export default {
  name: 'user-card',
  data () {
    return {
      originPath: '/dingding/center',
      show: false
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    imageUrl: function () {
      if (this.userInfo.headImgUrl) {
        return this.userInfo.headImgUrl
      }
      return require('@/assets/header.png')
    }
  },
  methods: {
    routeToRebind () {
      this.show = true
    },
    confirm () {
      cookies.get('ge_adminToken', '')
      this.$router.push({path: '/dingding/login'})
    }
  }
}
</script>

<style scoped>
.user-card-image {
  margin-left: 9px;
  height: 138px;
  width: 96%;
}
.extra-style {
  margin-top: -140px;
  margin-bottom: 10px;
}
.flex-row-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.flex-row-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.user-image-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
  z-index: 1;
  padding-left: 10px;
}
.user-image {
  width: 74px;
  height: 74px;
  border-radius: 37px;
  border: 2px solid #FFFFFF;
}
.user-info {
  margin-left: 15px;
}
.rebind-btn {
  z-index: 1;
  margin-right: 30px;
  border: 1px solid #FFFFFF;
  border-radius: 4px;
  font-size: 13px;
  color: #FFFFFF;
  text-align: center;
  font-weight: 400;
  width: 74px;
  height: 24px;
}
.text-common {
  color: white;
}
.username-text {
  font-size: 24px;
  font-weight: 600;
}
.mobile-text {
  margin-top: 4px;
  letter-spacing: 0.5px;
  font-size: 14px;
  font-weight: 400;
}
</style>
