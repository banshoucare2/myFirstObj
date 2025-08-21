
import { URLS } from '@/constants/config'
import Request from '@/utils/request'
export const getById = (data = {}) => {
  const url = URLS.promotion.getById
  const method = 'get'
  const params = data
  return Request({url, method, params})
}
