
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

export function setPassword (data) {
  return request({
    url: '/my/setpassword',
    method: 'post',
    data: data
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

export function setPic (formData) {
  return request({
    url: '/my/setPic',
    method: 'post',
    data: formData
  })
}
