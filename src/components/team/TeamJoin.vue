<template>
  <div>
    <el-row class="demo-autocomplete">
      <!-- <el-col :span="12">
        <div class="sub-title">激活即列出输入建议</div>
        <el-autocomplete
          class="inline-input"
          v-model="state1"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
        ></el-autocomplete>
      </el-col> -->
      <el-col :span="12">
        <!-- <div class="sub-title">输入后匹配输入建议</div> -->
        <el-autocomplete
          class="inline-input"
          v-model="state2"
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

import axios from 'axios'

export default {
  data () {
    return {
      teamList: [],
      state1: '',
      state2: ''
    }
  },
  methods: {
    async Join (e) {
      // console.log(e)
      // console.log(e.currentTarget.parentElement.children.item(0).innerHTML)
      // console.log(e.currentTarget.firstElementChild)
      // const results = e.currentTarget.parentElement.children.item(0).innerHTML
      // console.log(results)
      // console.log(typeof results)
      const innerID = parseInt(e.currentTarget.parentElement.children.item(0).innerHTML)
      const innerName = e.currentTarget.parentElement.children.item(1).innerHTML
      // console.log(innerID)
      // console.log(typeof innerID)
      // console.log(innerName)
      const teamObj = {
        id: innerID,
        teamName: innerName
      }

      alert('你想加入的球队是：' + JSON.stringify(teamObj))

      const token = localStorage.getItem('token')
      // console.log(userID)

      const { data: res } = await axios.post('http://127.0.0.1:3030/team/join', {
        token,
        teamID: innerID,
        teamName: innerName
      })
      console.log(res)
      this.$router.replace('/my/userinfo')
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
    async loadAll () {
      // return [
      //   { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
      // ]
      const { data: res } = await axios({
        url: 'http://127.0.0.1:3030/team/join',
        method: 'get'
      })
      for (let i = 0; i < res.length; i++) {
        this.teamList.push({
          id: res[i].id,
          value: res[i].teamName
        }
        )
      }
      // console.log(this.teamList)
    },
    async handleSelect (item) {
      // console.log(item.value)
      alert('你想加入的球队是：' + item.value)
      const { data: res } = await axios.post('http://127.0.0.1:3030/team/join')
      console.log(res)
    }
    // search (queryString) {
    //   console.log('开始搜索' + queryString)
    // }
  },
  created () {
    this.loadAll()
  }
}
</script>

<style lang="less" scoped>

</style>
