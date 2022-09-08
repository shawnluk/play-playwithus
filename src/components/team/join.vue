<template>
  <div>
    <el-row class="demo-autocomplete">
      <el-col :span="12">
        <!-- <div class="sub-title">输入后匹配输入建议</div> -->
        <el-autocomplete
          class="inline-input"
          v-model="state"
          :fetch-suggestions="querySearch"
          placeholder="请输入你想加入的球队名称"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
    </el-row>
    <div>
      <div v-for="(item) in teamList" :key="item.id">
            <div>{{item.id}}</div>
            <!-- index:{{index}} -->
            <div>{{item.value}}</div>
            <el-button type="primary" size="mini" @click="Join">加入</el-button>
      </div>
    </div>
  </div>
</template>

<script>

// import axios from 'axios'

export default {
  data () {
    return {
      teamList: [],
      state: ''
    }
  },
  methods: {
    Join (e) {
      const innerID = parseInt(e.currentTarget.parentElement.children.item(0).innerHTML)
      const innerName = e.currentTarget.parentElement.children.item(1).innerHTML
      const teamObj = {
        teamID: innerID,
        teamName: innerName,
        createTime: new Date().toJSON
      }
      if (confirm('你想加入的球队是：' + JSON.stringify(teamObj))) {
        this.$API.team.teamJoin(teamObj).then(resJoin => {
          console.log(resJoin.data)
          if (resJoin.data.status === 200) {
            this.$router.replace('/team/teamCenter')
          }
        }).catch(errJoin => {
          console.log('errJoin' + errJoin)
        })
      }
    },
    querySearch (queryString, cb) {
      const teamList = this.teamList
      const results = queryString ? teamList.filter(this.createFilter(queryString)) : teamList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (teamList) => {
        return (teamList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item)
    }
  },
  created () {
    this.$API.team.getTeamList().then(resTeam => {
      console.log(resTeam.data)
      if (resTeam.data.status === 200) {
        for (let i = 0; i < resTeam.data.teamList.length; i++) {
          this.teamList.push({
            id: resTeam.data.teamList[i].id,
            value: resTeam.data.teamList[i].teamName
          })
        }
      }
    }).catch(errTeam => {
      console.log('errTeam' + errTeam)
    })
  }
}
</script>

<style lang="less" scoped>

</style>
