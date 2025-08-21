// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {
  Button, Image, Toast, Dialog, Overlay, Step, Steps, Loading, Form, Field,
  Divider, Icon, Cell, CellGroup, Popup, Picker, List, PullRefresh,
  Uploader, Empty, Checkbox, Tabs, Tab, Cascader, Switch, Grid, GridItem,
  IndexBar, IndexAnchor, Search, NoticeBar, DatetimePicker, Col, Row, NavBar,
  Slider, ContactCard, RadioGroup, Radio, CheckboxGroup, Calendar, Area, Sticky,
  Collapse, CollapseItem, Sidebar, SidebarItem, TreeSelect, Lazyload, ImagePreview,
  Popover, ActionSheet, Swipe, SwipeItem, Card, Panel, SubmitBar, Stepper, Skeleton, Tag
} from 'vant'
import 'vant/lib/index.css'
// 按需导入vant-ui组件
Vue.use(Button)
Vue.use(Image)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Overlay)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Loading)
Vue.use(Form)
Vue.use(Field)
Vue.use(Divider)
Vue.use(Icon)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Popup)
Vue.use(Picker)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(Uploader)
Vue.use(Empty)
Vue.use(Checkbox)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cascader)
Vue.use(Switch)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(IndexBar)
Vue.use(IndexAnchor)
Vue.use(Search)
Vue.use(NoticeBar)
Vue.use(DatetimePicker)
Vue.use(Col)
Vue.use(Row)
Vue.use(NavBar)
Vue.use(Slider)
Vue.use(ContactCard)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(CheckboxGroup)
Vue.use(Calendar)
Vue.use(Area)
Vue.use(Sticky)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Sidebar)
Vue.use(SidebarItem)
Vue.use(TreeSelect)
Vue.use(Lazyload)
Vue.use(ImagePreview)
Vue.use(Popover)
Vue.use(ActionSheet)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Card)
Vue.use(Panel)
Vue.use(Skeleton)
Vue.use(Tag)
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
