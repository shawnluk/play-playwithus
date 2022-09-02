import request from '@/utils//request.js'

export function getActivity () {
  return request({
    url: '/team/activity',
    method: 'get'
  })
}

export function deleteActivity (actiData) {
  return request({
    url: '/team/deleteactivity',
    method: 'post',
    data: actiData
  })
}
