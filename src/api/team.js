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

export function getTeamMember (teamID) {
  return request({
    url: '/team/member',
    method: 'post',
    data: teamID
  })
}

export function getTeamList () {
  return request({
    url: '/team/teamlist',
    method: 'get'
  })
}

export function teamJoin (teamData) {
  return request({
    url: '/team/join',
    method: 'post',
    data: teamData
  })
}

export function teamQuit (newCaptain) {
  return request({
    url: '/team/quit',
    method: 'post',
    data: newCaptain
  })
}

export function teamDelete (data) {
  return request({
    url: '/team/delete',
    method: 'post',
    data: data
  })
}

export function DeleteJoinStatus () {
  return request({
    url: '/team/deleteJoinStatus',
    method: 'post'
  })
}
