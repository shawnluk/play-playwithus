import request from '@/utils//request.js'

export function getUserInfo () {
  return request({
    url: '/my/userinfo',
    method: 'get'
  })
}

export function setUserInfo (data) {
  return request({
    url: '/my/baseInfoSet',
    method: 'post',
    data: data
  })
}

export function setUserPic (FormData) {
  return request({
    url: '/my/setpic',
    method: 'post',
    FormData,
    headers: { enctype: 'multipart/form-data' }
  })
}
