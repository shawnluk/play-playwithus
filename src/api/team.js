import request from '@/utils//request.js'
// import axios from 'axios'

export function createTeam (teamData) {
  return request({
    url: '/team/create',
    method: 'post',
    data: teamData
  })
}

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

export function setTeamInfo (teamData) {
  return request({
    url: 'team/setTeamInfo',
    method: 'post',
    data: teamData
  })
}

export function setPic (formData) {
  return request({
    url: '/team/setPic',
    method: 'post',
    data: formData
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

export function deleteTeamJoin (updateTime) {
  return request({
    url: '/team/deleteTeamJoin',
    method: 'post',
    data: updateTime
  })
}
