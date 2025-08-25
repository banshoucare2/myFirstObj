<template>
  <div>
    <!-- 表格 -->
    <el-table
      ref="tableView"
      v-loading="tableLoading"
      :cell-style="{ padding: '0px' }"
      :style="{ width }"
      :height="tableHeight"
      :data="tableData"
      :header-cell-style="headerStyle"
      :row-style="rowStyle"
      :fit="true"
      :border="true"
      :stripe="stripe"
      :highlight-current-row="false"
      :span-method="spanMethod"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-table-column v-if="needIndex" prop="index" type="index" :label="indexLabel" width="50" align="center" />
      <slot name="table-columns" />
    </el-table>
    <!-- 分页器 -->
    <div
      v-if="needPagination"
      class="pagination-container"
      :style="{ 'justify-content': paginationTypes[position] ? paginationTypes[position] : 'flex-end' }"
    >
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>

import EventBus from '@/utils/eventBus'

/* eslint-disable vue/require-default-prop */
export default {
  name: 'TableView',
  props: {
    position: { type: String, default: 'right' }, // 分页器定位 left/center/right
    width: { type: String, default: '100%' },
    height: [String, Number], // 固定Table高度
    aboveHeight: { type: Number, default: 0 }, // 表格上方高度
    needIndex: { type: Boolean, default: true }, // 是否显示序号
    needPopover: { type: Boolean, default: false }, // 操作栏是否有二次确认操作
    indexLabel: { type: String, default: '序号' }, // 序号文本
    needPagination: { type: Boolean, default: true }, // 是否显示Pagination
    stripe: { type: Boolean, default: true }, // 是否显示条纹
    tableParams: { type: [String, Object], default: () => { return {} } }, // Table数据源接口入参
    queryTableData: Function, // 获取Table数据源
    spanMethod: { type: Function, default: () => {} }
  },
  watch: {
    tableParams: {
      handler(val, oldValue) {
        this._tableParams = val
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      headerStyle: { 'background': '#F9F9F9', 'color': '#909399' },
      // headerStyle: { 'background': '#333333', 'color': '#DFDFDF' },
      // headerStyle: { 'background': '#C3002F', color: '#FFFFFF' },
      rowStyle: { 'height': '36px' },
      paginationTypes: {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end'
      },
      tableHeight: 300,
      tableLoading: false,
      tableData: [], // 列表数据
      pageIndex: 1,
      pageSize: 20,
      total: 0
    }
  },
  mounted() {
    window.addEventListener('resize', () => this.getTableHeight(), false)
    EventBus.$on('search-group-changed', () => this.getTableHeight())
    setTimeout(() => this.getTableHeight(), 50)
  },
  destroyed() {
    window.removeEventListener('resize', () => this.getTableHeight(), false)
  },
  methods: {
    async getInitialData(index) {
      this.pageIndex = index || 1
      const { pageIndex, pageSize } = this._tableParams
      if (pageIndex) this.pageIndex = pageIndex
      if (pageSize) this.pageSize = pageSize
      const tableParams = this._tableParams
      const params = { pageIndex: this.pageIndex, pageSize: this.pageSize, ...tableParams }
      this.tableLoading = true
      const response = await this.queryTableData(params).catch(err => console.log(err))
      this.tableLoading = false
      if (response && response.code == 0) {
        // 根据项目后端具体返回字段
        const { count, results } = response.data
        if (this.needPopover && results && results.length > 0) {
          this.tableData = results.map(item => {
            item.visible = false
            return item
          })
        } else {
          this.tableData = results || []
        }
        this.total = Number(count) || 0
        // 特殊情况返给外层: 1-接口中row和rows均有返回 2: 初始化处理表格数据
        this.$emit('handleSuccess', this.tableData)
      }
      // 刷新Table高度
      this.getTableHeight()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getInitialData()
    },
    handleCurrentChange(page) {
      this.pageIndex = page
      this.getInitialData(page)
    },
    getTableHeight() {
      if (this.height) return (this.tableHeight = this.height)
      // 获取SearchQroup组件DOM高度
      const searchHeight = this.getSearchHeight() ? this.getSearchHeight() : 0
      console.log('searchHeight: ', searchHeight)
      // 获取OperaterQroup组件DOM高度
      const operateHeight = this.getOperaterHeight() ? this.getOperaterHeight() : 0
      console.log('【operateHeight】', operateHeight)
      const aboveHeight = searchHeight + operateHeight + this.aboveHeight
      console.log('【表格上方高度】', this.aboveHeight)
      console.log('【aboveHeight】', aboveHeight)

      let clientHeight = document.body.clientHeight
      // eslint-disable-next-line no-undef
      // if (process.env.NODE_ENV !== 'development') clientHeight += 64
      console.log('clientHeight', clientHeight)

      // const navBarHeight = 42 // 导航条高度
      const navBarHeight = 50 // 导航条高度
      // const menuContext = 40 // 路由菜单高度
      const menuContext = 0 // 路由菜单高度

      const spaceHeight = 18 // el-table padding值
      const paginationHeight = 36 // 分页组件高度
      // const footMenuHeight = 24 + 8 // 底部菜单栏高度 + el-table底部到菜单的距离
      const footMenuHeight = 18
      this.tableHeight = clientHeight - aboveHeight - navBarHeight - menuContext - spaceHeight - footMenuHeight
      if (this.needPagination) this.tableHeight -= paginationHeight
      console.log('this.tableHeight', this.tableHeight);
    },
    getSearchHeight() {
      const searchContainerDom = document.querySelector('.search-container')
      if (searchContainerDom) return +window.getComputedStyle(searchContainerDom, null).height.replace('px', '')
      return 8
    },
    getOperaterHeight() {
      const operateContainerDom = document.querySelector('.operate-container')
      if (operateContainerDom) return +window.getComputedStyle(operateContainerDom, null).height.replace('px', '') + 8 + 10
      return 8
    }
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 36px;
  background-color: white;
  border: 1px solid #ebeef5;
  border-top: none;
}
/deep/ .el-table th.el-table__cell {
  overflow: hidden;
  -webkit-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
  user-select: initial;
  background-color: #FFFFFF;
}
/deep/ .el-table .el-table__cell {
  text-align: center;
}
/deep/ .el-table th.el-table__cell > .cell {
  white-space: pre;
}
/deep/ .el-table table th.star div:before{
  content: '*';
  color:red;
}
</style>
