import request from '@/utils//request.js'

export function getActivity () {
  return request({
    url: '/team/activity',
    method: 'get'
  })
}
