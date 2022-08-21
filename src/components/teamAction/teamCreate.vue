<template>
  <div>
    <el-input v-model="teamName" placeholder="请输入你要创建的球队名称"></el-input>
    <el-row>
      <el-button type="success" round @click="submit">提交</el-button>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      teamName: ''
    }
  },
  methods: {
    async submit () {
      const token = localStorage.getItem('token')
      // console.log(this)
      // console.log('提交成功')
      // console.log(this.teamName)
      // const content_type = confirm('请确认你要创建的球队名为：' + this.teamName)
      // console.log(content_type)
      if (confirm('请确认你要创建的球队名为：' + this.teamName)) {
        const { data: res } = await axios.post('http://127.0.0.1:3030/team/create', {
          teamName: this.teamName,
          headers: { Authorization: token }
        })
        // console.log(res)
        // res.then(res1 => {
        //   return res1.data
        // })
        // console.log(res)
        alert(JSON.stringify(res))
        this.$router.replace('/my/userinfo')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
