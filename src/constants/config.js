import { getLsContract } from "../service/common"

export const BASE_CONFIG = {
  // PROXY_DOMAIN: 'http://gzh.tsflc.com', // 生产
  // PDF_VIEW_TIME: 5, // PDF附件预览时间
  // TYPE: 'production'
  // docs_host: 'https://docs.tsflc.com/',

  // PROXY_DOMAIN: 'https://pf-test.tsflc.com/api', // 测试
  // PDF_VIEW_TIME: 5, // PDF附件预览时间
  // TYPE: 'text'
  docs_host: 'https://docs-test.tsflc.com/',
  PROXY_DOMAIN: '/api', // 本地
  APP_ID: 'wx148972fab32c0b58',
  PDF_VIEW_TIME: 5, // PDF附件预览时间
  TYPE: 'my'
}
export const URLS = {
  LEASE_AFTER_API: {
    getLsContract: '/after/front/ls/contract/getLsContract',
  },
  // 通用接口相关API
  COMMON_API: {
    // 登录
    LOGIN: '/auth/login',
    findUserByParam: '/basic/systemUser/findUserByParam', //企业信息
    sendLoginSms: '/auth/sendLoginSms', //短信验证
    getCurrentUser: '/auth/getCurrentUser',
    geCamunda: 'camunda/front/todo/page',
    userPage: 'basic/systemUser/userPage',
    quickLogin: '/auth/admin/login/userId',
    deleteTo: '/camunda/front/todo/delete',
    getTaskById: '/camunda/front/process/task', // 查询任务详情
    instance: '/camunda/front/process/instance',  // 查询流程实例详情
    getProcessDefinition: '/camunda/front/process/definition',  // 查询流程定义
    findUserByUserIds: '/basic/systemUser/findUserByUserIds',
    getInstHis: '/camunda/front/process/inst/his',// 审批历史
    approve: '/camunda/front/process/approve',
    back: '/camunda/front/process/back',
    forward: '/camunda/front/process/forward',
    addSig: '/camunda/front/process/addSig',
    terminate: '/camunda/front/process/terminate'
  },
  SHOUCHE_API: {
    csContractDetail: '/after/front/cs/contract/detail',
    rvComList: '/recoup-server/com/queryList',
    updateRvTerm: '/after/front/sc/updateRvTerm',
    findUserByRoleId: '/basic/systemUser/findByRoleIdAndDeptId',
    getRvBiz: '/recoup-server/biz/queryOne',
    bizUpdate: '/recoup-server/biz/update',
    findByRoleIdAndDeptId: '/after/front/sc/bizInfo',
    getTaskLogList: '/after/front/cs/inner/task/log/list'
  },
  refundApply: {
    getDetailById: '/assist-loan-server/tbRefundApply/getById',
  },
  customerCare: {
    getRepayPlan: '/assist-loan-server/repayChange/getRepayPlan',
    getChangedRepayPlan: '/assist-loan-server/repayChange/getChangedRepayPlan',
    sendSms: '/assist-loan-server/repayChange/sendSms',
    passKillBill: '/assist-loan-server/repayChange/passKillBill',
    sendSign: '/assist-loan-server/repayChange/sendSign',
    getDetailById: '/assist-loan-server/repayChange/getDetailById',
    qryIsyqContractNo: '/assist-loan-server/repayChange/qryIsyqContractNo',
    upload: '/after/front/attachment/upload',
    getyzqbtFjConfig:  '/assist-loan-server/repayChange/getyzqbtFjConfig',
    saveApplyInfo: '/assist-loan-server/repayChange/saveApplyInfo',
    upMeeting: '/assist-loan-server/tbCzMeeting/upMeeting',
    isPassMeeting: '/assist-loan-server/repayChange/tbCzMeeting/isPassMeeting',
    isAddFn: '/assist-loan-server/tbCzMeeting/isAdd'
  },
  promotion: {
    getById: '/assist-loan-server/policyCash/getById'
  },
  message: {
    /* 查询附件 */
    queryTmsgFileList: '/message-server/tmsgAttachment/selectList',
    /* 查询附件结构（万网） */
    queryDocument: '/financial-lease/FlsBaseDocument/document'
  },
  product: {
    /* 产品政策 */
    detailProductApply: '/product-server/tprFinaProductApply',
    queryProductApplyDetailList: '/product-server/tprFinaProductApply/detail/list',
    /* 产品定义 */
    detailProductDefinition: '/product-server/tprFinaProduct/detail',
    /* 缴费类型参数查询 */
    queryProductParamList: '/product-server/tprFinaProductParam/list',
    /* 提前结清详情 */
    productClearDetail: '/product-server/tprFinaProductClear',
    /* 提前结清明细详情 */
    productClearDetailList: '/product-server/tprFinaProductClear/detail/list',
    /* 产品贴息配置查询 */
    queryInterestFreeList: '/product-server/tprFinaProduct/interestFree/list',
    /* 金融产品变更记录列表 */
    changeRecordList: '/product-server/tprFinaProductChangeRecord/list',
    /* 查询产品定义工作流来源---是手动新增还是政策申请 */
    qryProductSource: '/product-server/tprFinaProduct/qryProductSource',
  },
  performance: {
    /* 获取绩效表信息 */
    queryPerformanceById: '/performance-server/api/performance/h5/get',
    /* 绩效分计算 */
    calculate: '/performance-server/api/performance/calculate',
    /* 获取组内所有绩效列表 */
    queryGroupPerformList: '/performance-server/api/performance/list',
    /* 提交绩效 */
    submitFill: '/performance-server/api/performance/h5/submit/fill',
    /* 暂存绩效 */
    tempFill: '/performance-server/api/performance/h5/temp/fill',
    /* 单个审批 */
    handleSingle: '/performance-server/api/performance/h5/handle',
    /* 批量审批 */
    handleBatch: '/performance-server/api/performance/h5/handle/batch',
    /* 终审调整指标 */
    adjustPerform: '/performance-server/api/performance/h5/adjust',
    /* 获取终审明细列表 */
    summaryDataList: '/performance-server/api/summary/list/data',
    /* 获取主summary */
    summaryGet: '/performance-server/api/summary/get',
    /* 提交数字签名 */
    signatureHandle: '/performance-server/api/performance/h5/signature/handle',
  },
}
