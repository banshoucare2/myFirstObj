
import { URLS } from '@/constants/config'
import Request from '@/utils/request'
export const getDetailById = (data = {}) => {
  const url = URLS.customerCare.getDetailById
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const qryIsyqContractNo = (data = {}) => {
  const url = URLS.customerCare.qryIsyqContractNo
  const method = 'post'
  const params = data
  return Request({url, method, params})
}
export const sendSign = (data = {}) => {
  const url = URLS.customerCare.sendSign
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const sendSms  = (data = {}) => {
  const url = URLS.customerCare.sendSms +'?applyId=' + data.applyId
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const passKillBill = (data = {}) => {
  const url = URLS.customerCare.passKillBill
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const getRepayPlan = (data = {}) => {
  const url = URLS.customerCare.getRepayPlan
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const getChangedRepayPlan = (data = {}) => {
  const url = URLS.customerCare.getChangedRepayPlan
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const attachmentUpload = (data = {}) => {
  const url = URLS.customerCare.upload
  const method = 'post'
  const headers = { 'Content-Type': 'multipart/form-data'}
  return Request({url, method, data, headers})
}
export const saveApplyInfo = (data = {}) => {
  const url = URLS.customerCare.saveApplyInfo
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const getyzqbtFjConfig = (data = {}) => {
  const url = URLS.customerCare.getyzqbtFjConfig
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
export const upMeeting = (data = {}) => {
  const url = URLS.customerCare.upMeeting
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const isPassMeeting = (data = {}) => {
  const url = URLS.customerCare.saveApplyInfo
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
export const isAddFn = (data = {}) => {
  const url = URLS.customerCare.isAddFn
  const method = 'get'
  const params = data
  return Request({url, method, params})
}