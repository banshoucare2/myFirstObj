
import { URLS } from '@/constants/config'
import Request from '@/utils/request'
// export const getDetailById = (data = {}) => {
//   const url = URLS.refundApply.getDetailById
//   const method = 'post'
//   const params = data
//   return Request({url, method, params})
// }
export const getDetailById = (data = {}) => {
  const url = URLS.refundApply.getDetailById
  const method = 'post'
  const headers = {'Content-Type': 'application/json'}
  return Request({url, method, data, headers})
}