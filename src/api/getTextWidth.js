// /**
//  * 使用span标签包裹内容，然后计算span的宽度 width： px
//  * @param valArr
//  */

// eslint-disable-next-line space-before-function-paren
function getTextWidth(str) {
  let width = 0
  const html = document.createElement('span')
  html.innerText = str
  html.className = 'getTextWidth'
  document.querySelector('body').appendChild(html)
  width = document.querySelector('.getTextWidth').offsetWidth
  document.querySelector('.getTextWidth').remove()
  return width
}

export default getTextWidth
