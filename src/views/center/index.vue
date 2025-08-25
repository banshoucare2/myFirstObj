<template>
  <div class="page-container" style="height: 100vh">
    <el-header class="header-container">
      <div class="header-left">
        <!-- Logo和标题 -->
        <div class="logo" @click="goHome">
          <img src="@/assets/logo.png" alt="Logo" class="logo-img">
          <span class="system-name">管理系统</span>
        </div>
        <!-- 导航菜单 -->
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          background-color="#409EFF"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleMenuSelect"
          class="nav-menu"
        >
          <el-submenu index="system">
            <template slot="title">系统管理</template>
            <el-menu-item index="/index/personManage">
              用户管理
             </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <div class="header-right">
        <!-- 搜索框 -->
        <el-input
          v-model="searchText"
          placeholder="搜索..."
          prefix-icon="el-icon-search"
          class="search-input"
          @keyup.enter.native="handleSearch"
        ></el-input>

        <!-- 消息通知 -->
        <el-dropdown trigger="click" class="notification-dropdown">
          <span class="el-dropdown-link">
            <el-badge :value="5" class="item">
              <el-button icon="el-icon-bell" circle></el-button>
            </el-badge>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div class="notification-item">
                <el-avatar :size="30" src="@/assets/avatar1.png"></el-avatar>
                <div class="notification-content">
                  <p>张三 评论了你的文章</p>
                  <span class="notification-time">2分钟前</span>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="notification-item">
                <el-avatar :size="30" src="@/assets/avatar2.png"></el-avatar>
                <div class="notification-content">
                  <p>系统更新通知</p>
                  <span class="notification-time">1小时前</span>
                </div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-button type="text" @click="viewAllNotifications">查看全部</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 用户信息 -->
        <el-dropdown trigger="click" class="user-dropdown">
          <span class="el-dropdown-link">
            <el-avatar :size="36" :src="userInfo.avatar" class="user-avatar"></el-avatar>
            <span class="user-name">{{ userInfo.userName }}</span>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="goProfile">
              <i class="el-icon-user"></i>个人中心
            </el-dropdown-item>
            <el-dropdown-item @click.native="goSettings">
              <i class="el-icon-setting"></i>账户设置
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="handleLogout">
              <i class="el-icon-switch-button"></i>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 全屏切换 -->
        <el-tooltip content="全屏" placement="bottom">
          <el-button
            icon="el-icon-full-screen"
            circle
            @click="toggleFullscreen"
            class="fullscreen-btn"
          ></el-button>
        </el-tooltip>
      </div>
    </el-header>
    <div class="mainDiv">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import cookies from "js-cookie"
import { mapState } from 'vuex'
// import Main from '@/components/main.vue'
export default {
  name: 'center',
  // components: { Main },
  data () {
    return {
      searchText: '',
      activeMenu: '/dashboard',
      // userInfo: {
      //   name: '管理员',
      //   role: '超级管理员'
      // },
      isFullscreen: false
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    // this.$store.dispatch('user/queryDealerInfo', this.userInfo.mobile)
    // if (this.userInfo.accountName == 'admin') {
    //   this.list.push({ src: require('@/assets/center/grid-8.png'), disabled: false, text: '员工管理', path: '/dingding/personManage' })
    // }
  },
  mounted () {
    console.log(1111111)
    console.log(this.userInfo)
    
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
     // 菜单选择处理
    handleMenuSelect(index) {
      if (index && index !== this.$route.path) {
        this.$router.push(index)
      }
    },
    // 跳转到首页
    goHome() {
      this.$router.push('/dashboard')
    },
    
    // 搜索处理
    handleSearch() {
      if (this.searchText.trim()) {
        this.$router.push(`/search?keyword=${encodeURIComponent(this.searchText)}`)
        this.searchText = ''
      }
    },
    
    // 查看个人资料
    goProfile() {
      this.$router.push('/profile')
    },
    
    // 账户设置
    goSettings() {
      this.$router.push('/settings/profile')
    },
    
    // 查看所有通知
    viewAllNotifications() {
      this.$router.push('/notifications')
    },
    
    // 退出登录
    handleLogout() {
      this.$confirm('确定要退出登出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里调用退出登录的API
        cookies.get('ge_adminToken', '')
        this.$message.success('退出成功')
        this.$router.push('/login')
      }).catch(() => {})
    },
    
    // 切换全屏
    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error('全屏请求失败:', err)
        })
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
      this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style scoped>
.mainDiv {
  overflow-y: scroll;
  height: calc(100% - 50px);
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #409EFF;
  color: #fff;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 30px;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.system-name {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.nav-menu {
  border-bottom: none;
  background-color: transparent !important;
}

.nav-menu.el-menu--horizontal {
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  width: 200px;
}

.search-input /deep/ .el-input__inner {
  border-radius: 20px;
  border: none;
}

.notification-dropdown .el-badge {
  cursor: pointer;
}

.user-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  color: #fff;
  font-size: 14px;
  margin-right: 5px;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  min-width: 250px;
}

.notification-content {
  margin-left: 10px;
  flex: 1;
}

.notification-content p {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.fullscreen-btn {
  border: none;
  background: transparent;
  color: #fff;
}

.fullscreen-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .header-container {
    padding: 0 10px;
  }
  
  .system-name {
    display: none;
  }
  
  .nav-menu {
    display: none;
  }
  
  .search-input {
    width: 120px;
  }
}
</style>
