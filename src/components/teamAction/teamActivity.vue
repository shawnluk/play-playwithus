<template>
  <div>
    <h5>球队赛事活动页面</h5>
    <el-button  type="button" class="btn btn-primary" @click="createTeamAction" :disabled='buttonDisabled'>创建我的活动</el-button>
    <el-button  type="danger" class="btn btn-primary" @click="DeleteTeamAction" :disabled='DeleteDisabled' plain>撤销活动申请</el-button>
    <div>
      <p>我的球队活动:   {{this.MyActivityName}}</p>
    </div>
      <!-- <el-table
    :data="activityList"
    height="250"
    border
    style="width: 100%"
    :default-sort = "{prop: 'acti_date', order: 'descending'}"
    > -->
    <!-- v-fit-columns -->
    <!-- width="100" -->
    <!-- <el-table-column
      prop="acti_date"
      label="日期"
      sortable
      fixed
    > -->

    <!-- </el-table-column>
    <el-table-column
      prop="teamname"
      label="球队名称"
    >
    </el-table-column>
    <el-table-column
      prop="username"
      label="创建者">
    </el-table-column>
        <el-table-column
      prop="acti_region"
      label="地址">
    </el-table-column>
        <el-table-column
      prop="acti_type"
      label="比赛类型">
    </el-table-column>
        <el-table-column
      prop="acti_resource"
      label="比赛形式">
    </el-table-column>
        <el-table-column
      prop="acti_desc"
      label="比赛描述">
    </el-table-column>
  </el-table> -->
    <el-table
    :key="key"
    :data="activityList"
    style="width: 100%;"
    :default-sort = "{prop: 'acti_date', order: 'descending'}"
    >
    <el-table-column v-for="(item,index) in activityForm"
      :sortable="index === 0 || index === 1"
      :fixed="index === 0 ? true: false"
      :key="item.prop"
      :label="item.label"
      :width="item.width"
      :prop="item.prop === 'acti_date' ? 'acti_date':null || item.prop === 'teamname' ? 'teamname':null"
    >
    <template slot-scope="scope">
      {{ scope.row[item.prop] }}
    </template>
  </el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
      <el-button
        size="mini"
        type="danger"
        @click="handleChat(scope.$index, scope.row)">联系
      </el-button>
    </template>
  </el-table-column>
</el-table>
  </div>
</template>

<script>

import axios from 'axios'
// import getMaxLength from '@/api/tableWidth'

const tableContent = [
  // { label: '序号', prop: 'id' },
  { label: '日期', prop: 'acti_date' },
  { label: '球队名称', prop: 'teamname' },
  { label: '创建者', prop: 'username' },
  { label: '地址', prop: 'acti_region' },
  { label: '比赛类型', prop: 'acti_type' },
  { label: '比赛形式', prop: 'acti_resource' },
  { label: '比赛描述', prop: 'acti_desc' }
]

export default {
  name: 'teamActivity',

  data () {
    return {
      userinfo: {
        userID: '',
        username: '',
        password: '',
        nickname: '',
        email: '',
        userpic: '',
        picUrl: ''
      },
      teamInfo: {
        teamName: '',
        teamID: '',
        joinStatus: false,
        activeName: '0',
        checkTeamMemberDisable: false,
        teamMemberList: [],
        joinTeam_memberList: [],
        teamCaptain: '',
        captainID: ''
        // selectCaptain: ''
      },
      activityList: [],
      MyActivityName: '',
      buttonDisabled: false,
      DeleteDisabled: false,
      activityForm: tableContent,
      key: 1
    }
  },
  methods: {
    handleChat (index, row) {
      console.log(row)
      // if (row.userid !== this.userinfo.userID) {
      //   alert('你没有权限删除')
      // }
      // const ChatPerson = {
      // userid: row.userid,
      // username: row.username
      // }
      alert('你要联系的活动发起者为' + row.username)
    },
    getMaxLength (arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          const calcLen = this.getTextWidth(item)
          if (acc < calcLen) {
            acc = calcLen
          }
        }
        return acc
      }, 0)
    },

    getTextWidth (str) {
      let width = 0
      const html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },

    createTeamAction () {
      if (this.userinfo.userID !== this.teamInfo.captainID) {
        return alert('你不是球队队长，不能创建活动')
      }
      this.$router.push('/team/createTeamAction')
    },
    DeleteTeamAction () {
      console.log('撤销活动申请')
    }
  },
  created () {
    // 获取个人信息及球队信息
    const token = localStorage.getItem('token')
    if (!token) {
      alert('无登陆信息，请点击立即登陆')
      this.$router.replace('/login')
    } else {
      const url = 'http://127.0.0.1:3030/my/userinfo'
      const res = axios({
        url,
        headers: { Authorization: token }
      })
      res.then(res1 => {
        if (res1.data.status === 0) {
          this.userinfo.userID = res1.data.data.id
          this.userinfo.username = res1.data.data.username
          this.userinfo.nickname = res1.data.data.nickname
          this.userinfo.email = res1.data.data.email
          this.userinfo.userpic = res1.data.data.userpic
          this.teamInfo.teamName = res1.data.data.teamName
          this.teamInfo.teamID = res1.data.data.teamID

          if (this.teamInfo.teamID !== null) {
            const teamMemberRes = axios({
              url: 'http://127.0.0.1:3030/team/memberlist',
              method: 'post',
              headers: { Authorization: token },
              data: {
                teamID: this.teamInfo.teamID
              }
            })
            teamMemberRes.then(res3 => {
              this.teamInfo.teamMemberList = res3.data.data.list1
              this.teamInfo.joinTeam_memberList = res3.data.data.list2
              this.teamInfo.teamCaptain = res3.data.data.list3[0].newCaptain
              this.teamInfo.captainID = res3.data.data.list3[0].CaptainId
              this.teamInfo.teamMemberList.splice(this.teamInfo.teamMemberList.findIndex(item => item.id === this.teamInfo.captainID), 1)

              if (this.teamInfo.captainID !== this.userinfo.userID) {
                this.DeleteDisabled = true
              }
            })
          }
          // 获取活动信息
          const getActiRes = axios({
            url: 'http://127.0.0.1:3030/team/getTeamActivity',
            method: 'post',
            headers: { Authorization: token }
            // data: {
            //   userID: this.userinfo.userID,
            //   username: this.userinfo.username,
            //   teamID: this.teamInfo.teamID,
            //   teamName: this.teamInfo.teamName
            // }
          })

          getActiRes.then((res2) => {
            // console.log(res2.data)
            if (res2.data.status === 200) {
              // console.log(res2.data.ActiData)
              this.activityList = res2.data.ActiData

              console.log(this.activityList)
              // const _this = this
              // console.log(_this.userinfo)
              const arrRes = this.activityList.filter((item, index) => {
                return item.teamname === this.teamInfo.teamName
              })
              // console.log(arrRes)
              if (arrRes.length === 0) {
                this.MyActivityName = ''
              } else {
                this.MyActivityName = arrRes[0].acti_name
                this.buttonDisabled = true
              }

              // console.log(this.MyActivityName)
            } else {
              console.log(res2)
            }
          }).catch(err2 => {
            console.log(err2)
          })
        }
      }).catch(err => {
        console.log(err)
        alert('载入页面出错，请重新登陆')
        this.$router.replace('/login')
      })
    }
    // getMaxLength()
  },
  watch: {
    /**
         * 监控表格的数据data，自动设置表格宽度
         * @param valArr
         */
    activityList (valArr) {
      const _this = this
      this.formThead = tableContent.map(function (value) {
        const arr = valArr.map(x => x[value.prop]) // 获取每一列的所有数据
        arr.push(value.label) // 把每列的表头也加进去算
        value.width = _this.getMaxLength(arr) + 20 // 每列内容最大的宽度 + 表格的内间距(依据实际情况而定)
        return value
      })
    }
  }

}

</script>

<style lang="less" scoped>

</style>
