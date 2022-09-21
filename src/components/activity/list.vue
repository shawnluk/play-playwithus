<template>
  <div>
    <h5>球队赛事活动页面</h5>
    <el-button  type="button" class="btn btn-primary" @click="createActivity" :disabled='buttonDisabled'>创建我的活动</el-button>
    <el-button  type="danger" class="btn btn-primary" @click="deleteActivity" :disabled='DeleteDisabled' plain>撤销活动申请</el-button>
    <div>
      <p>我的球队名称:   {{this.$store.state.team.teamInfo.teamName}}</p>
      <p>我的球队活动:   {{this.myActi_name}}</p>
    </div>
    <el-table
    :key="key"
    :data="this.$store.state.activity.activityList"
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

import { mapActions } from 'vuex'

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
      myActi_name: '',
      myActi_id: '',
      buttonDisabled: false,
      DeleteDisabled: false,
      activityForm: tableContent,
      key: 1
    }
  },
  methods: {
    ...mapActions('activity', ['getActivity']),
    ...mapActions('user', ['getUserInfo']),
    ...mapActions('team', ['getTeamInfo']),
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
      console.log(this.$store.state.user.userID + '+' + this.$store.state.team.teamInfo.captainID)
      if (this.$store.state.user.userID !== this.$store.state.team.teamInfo.captainID) {
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
          acti_id: this.myActi_id
          // updateTime: new Date().toJSON()
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
    this.getUserInfo()

    /* 获取用户所在球队信息 */
    this.getTeamInfo()

    /* 获取活动列表信息 */
    this.getActivity()
  },
  watch: {
    /**
      * 监控activityList内容，自动设置表格宽度
    */

    '$store.state.activity.activityList': {
      handler: function (valArr) {
        const _this = this
        this.formThead = tableContent.map(function (value) {
          const arr = valArr.map(x => x[value.prop]) // 获取每一列的所有数据
          arr.push(value.label) // 把每列的表头也加进去算
          value.width = _this.getMaxLength(arr) + 20 // 每列内容最大的宽度 + 表格的内间距(依据实际情况而定)
          return value
        })

        const arr = this.$store.state.activity.activityList.filter((item, index) => {
          return item.teamName === this.$store.state.team.teamInfo.teamName
        })
        if (arr.length === 0) {
          this.myActi_name = ''
        } else {
          this.myActi_name = arr[0].acti_name
          this.myActi_id = arr[0].id
          this.buttonDisabled = true
        }
      }
    }
  }
}

</script>

<style lang="less" scoped>

</style>
