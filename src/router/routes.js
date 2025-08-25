
import index from '@/components/index'
import personManage from '@/components/personManage'
import auth from '@/components/auth'
import login from '@/views/login'
import Center from '@/views/center/index.vue'
// import ProductPolicy from '@/views/productManager/productPolicy/Detail/index.vue'
// import ProductDefinition from '@/views/productManager/productDefinition/SubWarp/index.vue'

export const routes = [
  // 个人中心
  {
    path: '/index',
    name: 'index',
    component: Center,
    meta: { title: '主页' },
    children: [
      {
        path: 'personManage',
        name: 'personManage',
        component: personManage,
      },
    ]
  },
  {
    path: '/dingding/index',
    name: 'index',
    component: index,
    meta: { title: '主页' }
  },
  {
    path: '/dingding/auth',
    name: 'auth',
    component: auth,
    meta: { title: '审核' }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: { title: '登录' }
  },
  /* 临时 测试用 */
  // {
  //   path: '/dingding/productPolicy',
  //   name: 'productPolicy',
  //   component: ProductPolicy,
  //   meta: { title: '产品政策' }
  // },
  // {
  //   path: '/dingding/ProductDefinition',
  //   name: 'ProductDefinition',
  //   component: ProductDefinition,
  //   meta: { title: '产品定义' }
  // },
]
