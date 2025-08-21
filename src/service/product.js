
import { URLS } from '@/constants/config'
import Request from '@/utils/request'

/* ====产品政策==== */
/* 详情 */
export const detailProductApply = (data = {}) => {
  const url = URLS.product.detailProductApply + `/${data}`
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 产品明细列表 */
export const queryProductApplyDetailList = (data = {}) => {
  const url = URLS.product.queryProductApplyDetailList
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 查询附件 */
export const queryTmsgFileList = (data = {}) => {
  const url = URLS.message.queryTmsgFileList
  const method = 'get'
  const params = data
  return Request({url, method, params})
}

export const queryDocument = (data = {}) => {
  const url = URLS.message.queryDocument
  const method = 'get'
  const params = data
  return Request({url, method, params})
}

/* ====产品定义 ==== */
/* 详情 */
export const detailProductDefinition = (data = {}) => {
  const url = URLS.product.detailProductDefinition + `/${data}`
  const method = 'get'
  return Request({url, method })
}
/* 查询缴费类型参数表 */
export const queryProductParamList = (data = {}) => {
  const url = URLS.product.queryProductParamList
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 提前结清详情 */
export const productClearDetail = (data = {}) => {
  const url = URLS.product.productClearDetail + `/${data}`
  const method = 'get'
  return Request({url, method })
}
/* 提前结清明细详情 */
export const productClearDetailList = (data = {}) => {
  const url = URLS.product.productClearDetailList
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 产品贴息配置查询 */
export const queryInterestFreeList = (data = {}) => {
  const url = URLS.product.queryInterestFreeList
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 金融产品变更记录列表 */
export const changeRecordList = (data = {}) => {
  const url = URLS.product.changeRecordList
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
/* 查询产品定义工作流来源---是手动新增还是政策申请 */
export const qryProductSource = (data = {}) => {
  const url = URLS.product.qryProductSource + `/${data}`
  const method = 'get'
  return Request({url, method})
}
/* 根据url下载附件 */
export const downloadBlob = (data = {}) => {
  const url = '/message-server/tmsgEmailRecord/downloadFile'
  const method = 'get'
  const params = data
  return Request({url, method, params, responseType: 'blob'})
}

/* 评委会投票 */
export const isPassMeeting = (data = {}) => {
  const url = '/product-server/meeting/isPassMeeting'
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}
/* 查询上会投票信息 */
export const getMeetingTpInfo = (data = {}) => {
  const url = '/product-server/meeting/getMeetingTpInfo'
  const method = 'get'
  const params = data
  return Request({url, method, params})
}

/* 查询固定还款日规则 */
export const queryRepayDateConfigList = (data = {}) => {
  const url = '/product-server/gdRepayDateConfig/list'
  const method = 'get'
  const params = data
  return Request({url, method, params})
}