<template>
  <div>
    <MainPageWrapper :showed="showed">
    <SearchQroup :label-width="120" reset-text="重置" @search="refreshTableData" @reset="reset">
      <el-form-item slot="form-item0" label="查询信息">
        <el-input v-model.trim="tableParams.param" placeholder="请输入手机号/姓名" maxlength="100" clearable/>
      </el-form-item>
    </SearchQroup>
    <TableView ref="tableView" :query-table-data="userPage" :table-params="tableParams" :needIndex="false">
      <template slot="table-columns">
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <el-button @click="quick({userId: scope.row.id})" type="text" >登录</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="员工姓名" align="center" width="130" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="手机号" align="center" width="150"></el-table-column>
				<el-table-column prop="accountName" label="登录名" align="center"></el-table-column>
				<el-table-column prop="available" label="状态" align="center" width="80">
					<template slot-scope="scope">
						{{ ({ true: '可用', false: '不可用' })[scope.row.available] }}
					</template>
				</el-table-column>
				<el-table-column prop="jobStatus" label="在职状态" align="center" width="80">
					<template slot-scope="scope">
						{{ ({ 0: '试用', 1: '正式', 2: '临时', 3: '试用延期', 4: '解聘', 5: '离职', 6: '退休', 7: '无效' })[scope.row.jobStatus] || '--' }}
					</template>
				</el-table-column>
				<el-table-column label="任职信息" align="center">
					<template slot-scope="scope">
						<el-tag type="primary" size="mini" v-for="(item, index) in scope.row.deptDutyInfos" :key="index">
							<template v-if="item.organName !== item.deptName">{{ item.organName }}-{{ item.deptName }}-{{ item.dutyName }}</template>
							<template v-else>{{ item.deptName }}-{{ item.dutyName }}</template>
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="权限角色" align="center">
					<template slot-scope="scope">
						{{ ( scope.row.roles || [] ).map(item => item.name).join(' / ') }}
					</template>
				</el-table-column>
      </template>
    </TableView>
    </MainPageWrapper>
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
      userPage,
      showed: true,
      tableParams: {
        param: ''
      },
    }
  },
  created () {
    this.refreshTableData()
  },
  methods: {
    reset() {
      this.tableParams = this.$options.data().tableParams;
      this.refreshTableData();
    },
    refreshTableData () {
      this.$nextTick(_ => { this.$refs.tableView.getInitialData() })
    },
    returnFn () {
      this.$router.push({ name: 'Center'})
    },
    quick (param) {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         this.quickLoginFn(param)
      }).catch(() => {})
    },
    async quickLoginFn (param) {
      this.$startLoad();
      const response = await quickLogin(param)
      this.$endLoad();
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
