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
      <div v-for="(item) in $store.state.team.teamList" :key="item.id">
            <div>{{item.id}}</div>
            <!-- index:{{index}} -->
            <div>{{item.value}}</div>
            <div v-show='false'>{{item.CaptainID}}</div>
            <div v-show='false'>{{item.newCaptain}}</div>
            <el-button type="primary" size="mini" @click="Join">加入</el-button>
      </div>
    </div>
  </div>
</template>

<script>

// import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      // teamList: [],
      state: ''
    }
  },
  methods: {
    ...mapActions('team', ['getTeamList', 'getTeamInfo']),
    ioJoinTeam (newCaptain) {
      this.$socket.emit('ioJoinTeam', newCaptain)
    },
    Join (e) {
      const innerID = parseInt(e.currentTarget.parentElement.children.item(0).innerHTML)
      const innerName = e.currentTarget.parentElement.children.item(1).innerHTML
      const newCaptain = e.currentTarget.parentElement.children.item(3).innerHTML
      // console.log(CaptainID)
      const teamObj = {
        teamID: innerID,
        teamName: innerName
      }
      if (confirm('你想加入的球队是：' + JSON.stringify(teamObj))) {
        this.$API.team.teamJoin(teamObj).then(resJoin => {
          console.log(resJoin.data)
          if (resJoin.data.status === 200) {
            this.$socket.close()
            this.$socket.open()
            this.$socket.emit('connectServer', this.$store.state.user.userinfo.username)
            this.ioJoinTeam(newCaptain)
            this.getTeamInfo()
            this.$router.replace('/team/teamCenter')
          }
        }).catch(errJoin => {
          console.log('errJoin' + errJoin)
        })
      }
    },
    querySearch (queryString, cb) {
      const teamList = this.$store.state.team.teamList
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
    this.getTeamList()
  }
}
</script>

<style lang="less" scoped>

</style>
