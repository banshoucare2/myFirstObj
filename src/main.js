// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'  // 引入样式文件

import router from './router'
import store from './store'
import {
	Pagination, Dialog, Dropdown, DropdownMenu, DropdownItem,
	Menu, Submenu, MenuItem, MenuItemGroup, Input, InputNumber,
	Radio, RadioGroup, RadioButton, Checkbox, CheckboxGroup,
	Select, Option, OptionGroup, Button, ButtonGroup,
	Table, TableColumn, DatePicker, Popover, Progress,
	Tooltip, Form, FormItem, Tabs, TabPane, Tag, Tree, Row,
	Col, Upload, Badge, Collapse, CollapseItem, Cascader, CascaderPanel,
	Container, Header, Aside, Main, Footer, Drawer, Divider,
	Image, MessageBox, Message, Notification, Loading,
	Avatar, Timeline, TimelineItem, Card, Alert,InfiniteScroll, Switch, Steps, Step, PageHeader,
	Descriptions, DescriptionsItem, Empty, Link, Popconfirm, Breadcrumb, BreadcrumbItem, Backtop,
	Statistic, Slider, Autocomplete
} from 'element-ui'
/** 常用组件 */
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Progress)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Badge)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(CascaderPanel)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Drawer)
Vue.use(Divider)
Vue.use(Image)
Vue.use(Avatar)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Card)
Vue.use(Alert)
Vue.use(InfiniteScroll)
Vue.use(Switch)
Vue.use(Steps)
Vue.use(Step)
Vue.use(PageHeader)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Empty)
Vue.use(Link)
Vue.use(Popconfirm)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Backtop)
Vue.use(Statistic)
Vue.use(Slider)
Vue.use(Autocomplete)
// 公共通用组件
import ConfirmButton from './components/common/ConfirmButton.vue'
import CustomTooltip from './components/common/CustomTooltip.vue'
import DialogWrapper from './components/common/DialogWrapper.vue'
import ExportButton from './components/common/ExportButton.vue'
import FormWrapper from './components/common/FormWrapper.vue'
import ImportButton from './components/common/ImportButton.vue'
import MainPageWrapper from './components/common/MainPageWrapper.vue'
import NavigationBar from './components/common/NavigationBar.vue'
import OperateGroup from './components/common/OperateGroup.vue'
import SearchQroup from './components/common/SearchQroup.vue'
import SectionBar from './components/common/SectionBar.vue'
import SubpageWrapper from './components/common/SubpageWrapper.vue'
import TableView from './components/common/TableView.vue'
import Uploader from './components/common/Uploader.vue'
import LyDescriptions from './components/common/Descriptions.vue'
// 全局注册自定义组件
Vue.component(ConfirmButton.name, ConfirmButton)
Vue.component(CustomTooltip.name, CustomTooltip)
Vue.component(DialogWrapper.name, DialogWrapper)
Vue.component(ExportButton.name, ExportButton)
Vue.component(FormWrapper.name, FormWrapper)
Vue.component(ImportButton.name, ImportButton)
Vue.component(MainPageWrapper.name, MainPageWrapper)
Vue.component(NavigationBar.name, NavigationBar)
Vue.component(OperateGroup.name, OperateGroup)
Vue.component(SearchQroup.name, SearchQroup)
Vue.component(SectionBar.name, SectionBar)
Vue.component(SubpageWrapper.name, SubpageWrapper)
Vue.component(TableView.name, TableView)
Vue.component(Uploader.name, Uploader)
Vue.component(LyDescriptions.name, LyDescriptions)

Vue.prototype.$notify = Notification
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$message = Message
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt  = MessageBox.prompt
Vue.prototype.$startLoad = (querySelector, loadingText) => {
	if (window.loadInstance) return
	let option = {
		target: querySelector || '.loadZone',
		text: loadingText ||'读取中...',
		customClass: 'font-30',
		background: 'rgba(255,255,255,.7)'
	}
	window.loadInstance = Loading.service(option)
}
Vue.prototype.$endLoad = () => {
	if (!window.loadInstance) return
	window.loadInstance.close()
	window.loadInstance = false
}
Vue.use(Loading)
Vue.config.productionTip = false
// 客户端机型
const userAgent = navigator.userAgent
const isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
Vue.prototype.$isIOS = isIOS

// 屏幕设备宽高
const SCREEN_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const SCREEN_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
Vue.prototype.$SCREEN_WIDTH = SCREEN_WIDTH
Vue.prototype.$SCREEN_HEIGHT = SCREEN_HEIGHT

import { getValue } from '@/utils/util'
Vue.prototype.$getValue = getValue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
