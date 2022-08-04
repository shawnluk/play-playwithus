// 百度地图API功能

const ak = 'wRGMCc3oNOyxhqQrhbqxEDKSa3zwyj8G'

export function loadBaiDuMap () {
  return new Promise(function (resolve, reject) {
    try {
      console.log('BMap is defined:', BMap === undefined || BMap)
      resolve(BMap)
    } catch (err) {
      window.init = function () {
        resolve(BMap)
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}`
      script.onerror = reject
      document.body.appendChild(script)
    }
  })
}
