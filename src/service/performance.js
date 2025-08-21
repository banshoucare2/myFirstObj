
import { URLS } from '@/constants/config'
import Request from '@/utils/request'

/* ====绩效考核==== */
/* 获取详情 */
export const getPerformance = (id) => {
  const url = URLS.performance.queryPerformanceById + '/'+id
  //const url = 'http://localhost:60019/api/performance/h5/get/' +id
  const method = 'get'
  const params = {}
  return Request({url, method, params})
}
/* 计算得分 */
export const calculate = (data = {}) => {
  const url = URLS.performance.calculate
  //const url = 'http://localhost:60019/api/performance/calculate' ;
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 根据组数据获取绩效表列表 */
export const queryGroupPerformList = (data = {}) => {
  const url = URLS.performance.queryGroupPerformList
  //const url = 'http://localhost:60019/api/performance/list' ;
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 提交填报 */
export const handlePerformance = (data = {}) => {
  const url = URLS.performance.submitFill
  //const url = 'http://localhost:60019/api/performance/h5/submit/fill' ;
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 暂存填报 */
export const tempPerformance = (data = {}) => {
  const url = URLS.performance.tempFill
  //const url = 'http://localhost:60019/api/performance/h5/temp/fill' ;
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 单个审批提交 */
export const handleSingleAppr = (data = {}) => {
  const url = URLS.performance.handleSingle
  //const url = 'http://localhost:60019/api/performance/h5/handle' ;
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 批量审批提交 */
export const handleBatchAppr = (data = {}) => {
  const url = URLS.performance.handleBatch
  //const url = 'http://localhost:60019/api/performance/h5/handle/batch' ;
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 终审调整 */
export const handleFinalAdjust = (data = {}) => {
  const url = URLS.performance.adjustPerform
  //const url = 'http://localhost:60019/api/performance/h5/adjust' ;
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 终审列表 */
export const getSumList = (data = {}) => {
  const url = URLS.performance.summaryDataList
  //const url = 'http://localhost:60019/api/summary/list/data' ;
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 获得sum */
export const getSum = (id = {}) => {
  const url = URLS.performance.summaryGet + '/'+id
  //const url = 'http://localhost:60019/api/summary/get/'+id ;
  const method = 'get'
  const params = {}
  return Request({url, method, params})
}

/* 提交数字签名 */
export const signatureHandle = (data = {}) => {
  const url = URLS.performance.signatureHandle
  //const url = 'http://localhost:60019/api/performance/h5/signature/handle' ;
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
