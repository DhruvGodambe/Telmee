// A few JavaScript Functions for Images and Files
// Author: Justin Mitchel
// Source: https://kirr.co/ndywes

// Convert a Base64-encoded string to a File object
export function base64StringtoFile (base64String, filename) {
  var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {type: mime})
}

// Download a Base64-encoded file

export function downloadBase64File (base64Data, filename) {
  var element = document.createElement('a')
  element.setAttribute('href', base64Data)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// Extract an Base64 Image's File Extension
export function extractImageFileExtensionFromBase64 (base64Data) {
  return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'))
}

// Base64 Image to Canvas with a Crop
export function image64toCanvasRef (canvasRef, image64, percentCrop, imageWidth, imageHeight) {
  const canvas = canvasRef // document.createElement('canvas');
  canvas.width = imageWidth * percentCrop.width / 100
  canvas.height = imageHeight * percentCrop.height / 100
  const ctx = canvas.getContext('2d')
  const image = new Image()
  console.log('x: ', imageWidth * percentCrop.x / 100)
  console.log('y: ', imageHeight * percentCrop.y / 100)
  console.log('width: ', imageWidth * percentCrop.width / 100)
  console.log('height: ', imageHeight * percentCrop.height / 100)
  image.src = image64
  image.onload = function () {
    ctx.drawImage(
      image,
      imageWidth * 2.5 * percentCrop.x / 100,
      imageHeight * 2.5 * percentCrop.y / 100,
      imageWidth * 2.5 * percentCrop.width / 100,
      imageHeight * 2.5 * percentCrop.height / 100,
      0,
      0,
      imageWidth * percentCrop.width / 100,
      imageHeight * percentCrop.height / 100
    )
  }
}
