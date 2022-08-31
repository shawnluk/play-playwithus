import request from '@/utils//request.js'

export function getTeamInfo () {
  return request({
    url: '/team/teaminfo',
    method: 'get'
  })
}

export function getTeamJoinStatus () {
  return request({
    url: '/team/joinstatus',
    method: 'post'
  })
}
