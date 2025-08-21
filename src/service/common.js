
import { URLS } from '@/constants/config'
import Request from '@/utils/request'
export const querySignRole = (data = {}) => {
  const url = URLS.CREDIT_API.QUERY_SIGN_ROLE
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const login = (data = {}) => {
  const url = URLS.COMMON_API.LOGIN
  const method = 'post'
  // const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data})
}
export const findUserByParam = (data = {}) => {
  const url = URLS.COMMON_API.findUserByParam
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const sendLoginSms = (data = {}) => {
  const url = URLS.COMMON_API.sendLoginSms
  const method = 'post'
  const params = data
  return Request({url, method, params})
}
export const getCurrentUser = (data = {}) => {
  const url = URLS.COMMON_API.getCurrentUser
  const method = 'get'
  return Request({url, method, data})
}
export const geCamunda = (data = {}) => {
  const url = URLS.COMMON_API.geCamunda
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const userPage = (data = {}) => {
  const url = URLS.COMMON_API.userPage
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const quickLogin = (data = {}) => {
  const url = URLS.COMMON_API.quickLogin
  const method = 'post'
  const params = data
  return Request({url, method, params})
}

export const deleteTo = (data = {}) => {
  const url = URLS.COMMON_API.deleteTo
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const getTaskById = (data = {}) => {
  const url = URLS.COMMON_API.getTaskById
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const instance = (data = {}) => {
  const url = URLS.COMMON_API.instance
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const getProcessDefinition = (data = {}) => {
  const url = URLS.COMMON_API.getProcessDefinition
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const getInstHis = (data = {}) => {
  const url = URLS.COMMON_API.getInstHis
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const approve = (data = {}) => {
  const url = URLS.COMMON_API.approve
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const back = (data = {}) => {
  const url = URLS.COMMON_API.back
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const findUserByUserIds = (data = {}) => {
  const url = URLS.COMMON_API.findUserByUserIds
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const rvComList = (data = {}) => {
  const url = URLS.SHOUCHE_API.rvComList
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const updateRvTerm = (data = {}) => {
  const url = URLS.SHOUCHE_API.updateRvTerm
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const findUserByRoleId = (data = {}) => {
  const url = URLS.SHOUCHE_API.findUserByRoleId
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const getRvBiz = (data = {}) => {
  const url = URLS.SHOUCHE_API.getRvBiz
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}

export const bizUpdate = (data = {}) => {
  const url = URLS.SHOUCHE_API.bizUpdate
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}

export const csContractDetail = (data = {}) => {
  const url = URLS.SHOUCHE_API.csContractDetail
  const method = 'get'
  const params = data
  return Request({url, method, params })
}

export const getTaskLogList = (data = {}) => {
  const url = URLS.SHOUCHE_API.getTaskLogList
  const method = 'get'
  const params = data
  return Request({url, method, params})
}

/* 值列表 */
export const getBatchValuesList = (data = {}) => {
  const url = '/basic/sys/dict/many'
  const method = 'get'
  const params = data
  return Request({url, method, params})
}

/* 转办 */
export const forward = (data = {}) => {
  const url = URLS.COMMON_API.forward
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 加签 */
export const addSig = (data = {}) => {
  const url = URLS.COMMON_API.addSig
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 终止 */
export const terminate = (data = {}) => {
  const url = URLS.COMMON_API.terminate
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}

export const findUserByNameOrMobile = (data = null) => {
  const url = '/basic/systemUser/findByNameOrMobileLike?search=' + data
  const method = 'get'
  const params = data
  return Request({url, method, params})
}

export const getLsContract = (contractNo) => {
  const url = URLS.LEASE_AFTER_API.getLsContract + '?contractNo='+contractNo
  const method = 'get'
  const params = contractNo
  return Request({url, method, params})
}