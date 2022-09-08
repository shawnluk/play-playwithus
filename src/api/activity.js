import request from '@/utils//request.js'

export function create (actiData) {
  return request({
    url: '/team/createActivity',
    method: 'post',
    data: actiData
  })
}

export function getActivity () {
  return request({
    url: '/team/activity',
    method: 'get'
  })
}

export function deleteActivity (actiData) {
  return request({
    url: '/team/deleteActivity',
    method: 'post',
    data: actiData
  })
}
