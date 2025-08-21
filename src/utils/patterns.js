
// 姓名 (2-13个中文字符)
const usernameReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{1,10}$/

// 身份证号(15位、18位均支持)
const idCardReg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/

// 银行卡号
const bankCardReg = /^(\d{15,19})$/

// 手机号
const phoneNumReg = /^(1[3456789])\d{9}$/

// 邮箱正则
const emailReg = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

// 验证码(4-6位数字)
const verifyCodeReg = /^[0-9]{4,6}/

// 非空字符串
const noVoidReg = /\S/

// 车架号
const vinCodeReg = /^[A-Z0-9]{17}$/

// 统一社会信用代码
// eslint-disable-next-line no-useless-escape
// const corporateCodeReg = /^([\d\[A-Z]{2})(\d{6})([\d\[A-Z]{9})(\d{1}|[A-Z]{1})$/
const corporateCodeReg = /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/

export default {
  usernameReg,
  idCardReg,
  bankCardReg,
  phoneNumReg,
  emailReg,
  verifyCodeReg,
  noVoidReg,
  corporateCodeReg,
  vinCodeReg
}
