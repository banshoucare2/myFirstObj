/*
 * @Author: wulongyun
 * @Date: 2022-10-31 18:03:34
 * @LastEditTime: 2022-11-14 09:49:38
 * @LastEditors: wulongyun
 * @Description:
 */

// 金额千分化 s: 金额  n: 保留小数位数
export const formatMoney = (s, n, isInt) => {
  // console.log('formatMoney: ', s, Number(s))
  if (!s || isNaN(Number(s))) return isInt ? '0' : '0.00'
  if (s === null || s === undefined) return ''

  n = n > 0 && n <= 20 ? n : 2
  if (isInt) n = 0
  // eslint-disable-next-line no-useless-escape
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  let l = s.split('.')[0].split('').reverse()
  let r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  if (isInt) return t.split('').reverse().join('')
  return t.split('').reverse().join('') + '.' + r
}

// 去千分化处理
// eslint-disable-next-line no-useless-escape
export const formatMoneyBack = (s) => parseFloat(s.replace(/[^\d\.-]/g, ''))

// 去空格
export const formatSpace = (str) => str.replace(/\s/g, '')

// 取整并去空格
export const formatInteger = (str) => {
  if (str && !isNaN(Number(str))) return String(parseInt(str)).replace(/\s/g, '')
  return ''
}

const add0 = (m) => m < 10 ? '0' + m : m

// 时间戳转日期(ms)
export const formatTime = (timeStamp) => {
  if (!timeStamp) return ''
  const time = new Date(timeStamp)
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  const h = time.getHours()
  const mm = time.getMinutes()
  const s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

// 小写转大写
export const toUpperCase = (str) => str.replace(str, str.toUpperCase())
