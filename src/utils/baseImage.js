
// Base64 Image旋转后的base64
export const rotateBase64Img = (src, edg, callback) => {
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  var imgW // 图片宽度
  var imgH // 图片高度
  var size // canvas初始大小

  if (edg % 90 !== 0) {
    console.error('旋转角度必须是90的倍数!')
    // eslint-disable-next-line no-throw-literal
    throw '旋转角度必须是90的倍数!'
  }
  (edg < 0) && (edg = (edg % 360) + 360)
  const quadrant = (edg / 90) % 4 // 旋转象限
  const cutCoor = {
    sx: 0,
    sy: 0,
    ex: 0,
    ey: 0
  } // 裁剪坐标

  var image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = src

  image.onload = function () {
    imgW = image.width
    imgH = image.height
    size = imgW > imgH ? imgW : imgH

    canvas.width = size * 2
    canvas.height = size * 2
    switch (quadrant) {
      case 0:
        cutCoor.sx = size
        cutCoor.sy = size
        cutCoor.ex = size + imgW
        cutCoor.ey = size + imgH
        break
      case 1:
        cutCoor.sx = size - imgH
        cutCoor.sy = size
        cutCoor.ex = size
        cutCoor.ey = size + imgW
        break
      case 2:
        cutCoor.sx = size - imgW
        cutCoor.sy = size - imgH
        cutCoor.ex = size
        cutCoor.ey = size
        break
      case 3:
        cutCoor.sx = size
        cutCoor.sy = size - imgW
        cutCoor.ex = size + imgH
        cutCoor.ey = size + imgW
        break
    }

    ctx.translate(size, size)
    ctx.rotate(edg * Math.PI / 180)
    ctx.drawImage(image, 0, 0)

    var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey)
    if (quadrant % 2 === 0) {
      canvas.width = imgW
      canvas.height = imgH
    } else {
      canvas.width = imgH
      canvas.height = imgW
    }
    ctx.putImageData(imgData, 0, 0)
    callback(canvas.toDataURL())
  }
}

export const base64ImageCompress = (base64String, w, quality = 1) => {
  var newImage = new Image()
  var imgWidth, imgHeight

  var promise = new Promise(resolve => (newImage.onload = resolve))
  newImage.src = base64String
  return promise.then(() => {
    imgWidth = newImage.width
    imgHeight = newImage.height
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    if (Math.max(imgWidth, imgHeight) > w) {
      if (imgWidth > imgHeight) {
        canvas.width = w
        canvas.height = (w * imgHeight) / imgWidth
      } else {
        canvas.height = w
        canvas.width = (w * imgWidth) / imgHeight
      }
    } else {
      canvas.width = imgWidth
      canvas.height = imgHeight
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height)
    // var base64 = canvas.toDataURL(getMimeType(base64String), quality)
    var base64 = canvas.toDataURL('image/jpeg', quality)
    return base64
  })
}

// base64转blob
const base64ToBlob = (base64Data) => {
  const arr = base64Data.split(',')
  const fileType = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let l = bstr.length
  const u8Arr = new Uint8Array(l)

  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l)
  }
  return new Blob([u8Arr], { type: fileType })
}

// blob转file
const blobToFile = (newBlob, fileName) => {
  newBlob.lastModifiedDate = new Date()
  newBlob.name = fileName
  return newBlob
}

export const base64ToFile = (base64Data, fileName = '') => {
  const blobData = base64ToBlob(base64Data)
  return blobToFile(blobData, fileName)
}

export const dataUrlToFile = (dataurl, filename = '') => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
