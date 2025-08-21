import { get } from 'lodash'
import { downloadBlob } from "@/service/product";

/* 处理值列表 */
export function getValue(arr, value, key = 'value', targetkey = 'label', defaultVal = '') {
  if (!Array.isArray(arr)) return ''
  return get(arr.find(v => v[key] == value), targetkey, defaultVal)
}

/* 处理下载 */
export const downloadFile = async({ url, fileName }) => {
  try {
    const resultBlob = await downloadBlob({ url, fileName }).catch(err => console.log(err))
    // console.log('resultBlob', resultBlob);
    if (resultBlob instanceof Blob) {
      const url = window.URL.createObjectURL(resultBlob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      link.remove()
      return { success: true }
    } else {
      console.error('下载失败:', error)
    }
  } catch (error) {
    console.error('下载失败:', error)
    throw error
  }
}