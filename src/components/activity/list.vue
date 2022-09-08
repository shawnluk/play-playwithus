<template>
  <div>
    <h5>球队赛事活动页面</h5>
    <el-button  type="button" class="btn btn-primary" @click="createActivity" :disabled='buttonDisabled'>创建我的活动</el-button>
    <el-button  type="danger" class="btn btn-primary" @click="deleteActivity" :disabled='DeleteDisabled' plain>撤销活动申请</el-button>
    <div>
      <p>我的球队名称:   {{this.teamInfo.teamName}}</p>
      <p>我的球队活动:   {{this.myActi_name}}</p>
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
      prop="teamName"
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
      :prop="item.prop === 'acti_date' ? 'acti_date':null || item.prop === 'teamName' ? 'teamName':null"
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
<el-button type="info" @click="GoBackIndex">回到首页</el-button>
  </div>
</template>

<script>

// import axios from 'axios'
// import getMaxLength from '@/api/tableWidth'

const tableContent = [
  // { label: '序号', prop: 'id' },
  { label: '日期', prop: 'acti_date' },
  { label: '活动名称', prop: 'acti_name' },
  { label: '球队名称', prop: 'teamName' },
  { label: '联系队长', prop: 'newCaptain' },
  { label: '地址', prop: 'acti_region' },
  { label: '比赛类型', prop: 'acti_type' },
  { label: '比赛形式', prop: 'acti_resource' },
  { label: '比赛描述', prop: 'acti_desc' }
]

export default {
  name: 'teamActivity',
  inject: ['reload'],
  data () {
    return {
      userinfo: {
        userID: '',
        username: '',
        password: '',
        nickname: '',
        email: '',
        userPic: '',
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
      myActi_name: '',
      myActi_id: '',
      buttonDisabled: false,
      DeleteDisabled: false,
      activityForm: tableContent,
      key: 1
    }
  },
  methods: {
    GoBackIndex () {
      this.$router.replace('/home')
    },
    handleChat (index, row) {
      console.log(row)
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

    createActivity () {
      if (this.userinfo.userID !== this.teamInfo.captainID) {
        return alert('你不是球队队长，不能创建活动')
      }
      this.$router.push('/activity/create')
    },
    deleteActivity () {
      // console.log('撤销活动申请')
      if (!this.myActi_name) {
        alert('乱点，你都没申请活动')
        return
      }
      if (confirm('你是否真的要撤销活动：' + this.myActi_name)) {
        const data = {
          acti_name: this.myActi_name,
          acti_id: this.myActi_id,
          updateTime: new Date().toJSON()
        }
        this.$API.activity.deleteActivity(data).then(res => {
          if (res.data.status === 200) {
            console.log(res.data)
            this.reload()
            return
          }
          console.log(res.data)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  created () {
    /* 获取用户信息和球队信息 */
    this.$API.user.getUserInfo().then(resUser => {
      if (resUser.data.status === 200) {
        console.log(resUser.data)
        this.userinfo.userID = resUser.data.userData.id
        this.userinfo.username = resUser.data.userData.username
        this.userinfo.nickname = resUser.data.userData.nickname
        this.userinfo.email = resUser.data.userData.email
        this.userinfo.userPic = resUser.data.userData.userPic

        // 拼接用户头像src
        if (this.userinfo.userPic !== null) {
          const picUrl = 'https://' + this.userinfo.userPic
          this.userinfo.picUrl = picUrl
        }
        return
      }
      console.log(resUser.data)
    }).catch(errUser => {
      console.log('获取用户信息失败' + errUser)
    })

    /* 获取用户所在球队信息 */
    this.$API.team.getTeamInfo().then(resTeam => {
      // 已经加入球队
      if (resTeam.data.status === 200) {
        console.log(resTeam.data)
        this.teamInfo.teamName = resTeam.data.teamInfo[0].teamName
        this.teamInfo.teamID = resTeam.data.teamInfo[0].id
        this.teamInfo.teamCaptain = resTeam.data.teamInfo[0].newCaptain
        this.teamInfo.captainID = resTeam.data.teamInfo[0].CaptainID
        return
      }
      // 处于球队加入申请状态
      if (resTeam.data.status === 201) {
        this.$API.team.getTeamJoinStatus().then(resJoin => {
          if (resJoin.data.status === 200) {
            console.log(resJoin.data)
            this.teamInfo.teamName = resJoin.data.joinData.teamName + '（等待队长同意加入申请）'
            this.teamInfo.teamID = resJoin.data.joinData.teamID
            return
          }
          // if (resJoin.data.status === 201) {
          //   return console.log(resJoin.data)
          // }
          console.log(resJoin.data)
        }).catch(errJoin => {
          console.log('获取球队申请状态失败' + errJoin)
        })
        return
      }
      console.log(resTeam.data)
    }).catch(errTeam => {
      console.log('获取球队信息失败' + errTeam)
    })

    /* 获取活动列表信息 */
    this.$API.activity.getActivity().then(resActi => {
      console.log(resActi.data)
      if (resActi.data.status === 200) {
        this.activityList = resActi.data.ActiData
        const arrRes = this.activityList.filter((item, index) => {
          return item.teamName === this.teamInfo.teamName
        })
        // console.log(arrRes)
        if (arrRes.length === 0) {
          this.myActi_name = ''
        } else {
          this.myActi_name = arrRes[0].acti_name
          this.myActi_id = arrRes[0].id
          this.buttonDisabled = true
        }
        return
      }
      console.log(resActi.data)
      // console.log(this.activityList)
    }).catch(errActi => {
      console.log('获取活动列表失败' + errActi)
    })
  },
  watch: {
    /**
         * 监控表格的数据data，自动设置表格宽度
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
