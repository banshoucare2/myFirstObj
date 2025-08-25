
import axios from 'axios'
import { BASE_CONFIG } from '@/constants/config'
import store from '@/store'
import cookies from "js-cookie";
import router from '../router'
import { Message } from 'element-ui'
// import { generateAuthRedirectUri } from '@/utils/wechat'

let service

// 处理参数
const encodeQuery = (params = {}) => {
  // console.log('[接口请求-参数] encodeQuery params: ', params)
  return Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
}

const formatFormData = (params = {}) => {
  // console.log('[接口请求-参数] formatFormData: ', params)
  let formData = new FormData()
  Object.keys(params).map(key => formData.append(key, params[key]))
  return formData
}
service = axios.create({
  baseURL: BASE_CONFIG.PROXY_DOMAIN,
  timeout: 60000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  paramsSerializer: params => encodeQuery(params)
})

service.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Access-Control-Allow-Headers'] = 'X-Requested-With,Content-Type'
    config.headers['Access-Control-Allow-Methods'] = 'PUT,POST,GET,DELETE,OPTIONS'
    config.headers.Authorization = cookies.get('ge_adminToken') || ''

    const token = sessionStorage.getItem('token')
    if (token) config.url = config.url + '?token=' + token
    // console.log('[口令-Token]: ', token)
    // console.log('[接口请求-地址]: ', config.url)
    // 传JSON入参
    if (config.headers['Content-Type'] === 'application/json') {
      // console.log('[接口请求-参数] json data: ', config.data)
      // console.log('[接口请求-参数] json data stringfy: ', JSON.stringify(config.data))
      config.data = JSON.stringify(config.data)
      return config
    }

    // form-data入参
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      config.data = formatFormData(config.data)
      // console.log('[接口请求-参数] form data: ', config.data)
      return config
    }
    // 序列化 urlencoded
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      // console.log('[接口请求-参数] urlencoded data: ', config.data)
      config.data = encodeQuery(config.data)
    }
    return config
  },
  (error) => {
    console.log(error) // for debug
  }
)

service.interceptors.response.use(
  (response) => {
    const result = response.data
    // console.log('result: ', result, response)

    // 检测返回的不是文件流
    const config = response.config
    if (config && config.responseType === 'blob') {
      return result
    }
    if (result && result.code == '0') {
      // console.log('[接口请求-返回数据]: ', result)
      return result
    } else {
      Message.error(result.message)
      window.loadInstance.close()
	    window.loadInstance = false
      // console.log('[接口报错-错误信息]: ', result)
    }
    // console.log('[接口报错-错误信息]: ', result)
  },
  (error) => {
    console.log(error)
    if (`${error}`.indexOf('401') > -1) {
      Message.error(`请先登录`)
      router.push({path: '/login'})
    } else {
      Message.error(`${error}`)
    }
    console.log(`Error: ${error}`, error, typeof error)
  }
)

// const routeToOriginPath = () => {
//   setTimeout(() => {
//     const originPath = sessionStorage.getItem('origin-path')
//     if (originPath) {
//       const authUrl = generateAuthRedirectUri(originPath)
//       location.replace(authUrl)
//     }
//   }, 1000)
// }

export default service
