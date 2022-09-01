
import request from '@/utils//request.js'

export function register (userData) {
  return request({
    url: '/user/register',
    method: 'post',
    data: userData
  })
}

export function login (userData) {
  return request({
    url: '/user/login',
    method: 'post',
    data: userData
  })
}

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
