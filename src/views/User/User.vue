<template>
  <!-- <div><h1>user</h1></div> -->
  <div id="user_wrap">
    <div class="user_img_wrap">
      <div class="user_img">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
      </div>
      <el-row>
        <el-button round @click="ToLogin">立即登陆</el-button>
      </el-row>
    </div>
    <div class="my_data">我的数据</div>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <van-cell-group inset>
      <van-cell title="我的消息" value="" is-link />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="当前赛事" value="" is-link />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="我的球队" value="" label="高州中学阿森纳" is-link />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="个人资料" value="" is-link />
      <van-cell title="意见反馈" value="" is-link />
      <van-cell title="分享" value="" is-link />
      <van-cell title="联系客服" value="" is-link />
      <van-cell title="点赞" value="" is-link />
    </van-cell-group>
    <el-row class="user_logout" round>
      <el-button round>退出登陆</el-button>
    </el-row>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'User',
  data () {
    return {
      activeName: '1'
      // AxiosResponse: ''
    }
  },
  methods: {
    ToLogin () {
      const _this = this
      if (!localStorage.getItem('token')) {
        this.$router.push('/user/login')
      } else {
        const oldToken = localStorage.getItem('token')
        const url = 'http://127.0.0.1:3030/my/userinfo'
        async function getToken () {
          const { data: res } = await axios({
            method: 'get',
            url: url,
            headers: { Authorization: oldToken }
          })
          // .then(response => {
          //   // _this.AxiosResponse = response.data
          //   console.log(response)
          //   // alert({
          //   //   status: response.data.status,
          //   //   message: response.data.message
          //   // })
          // })
          // .catch(err => {
          //   console.log(err.response)
          //   if (err.response) {
          //     _this.$router.push('/user/login')
          //   }
          // })
          // console.log(res)
          // if (res.status) {
          //   if (res.status === 0) {
          //     _this.$router.push('/my/userinfo')
          //   }
          // }
          if (res.status === 0) {
            _this.$router.push('/my/userinfo')
          }
          if (res.status === 403) {
            // alert({
            //   message:res.message,
            //   status：res.status
            // })
            // console.log(res.message)
            alert(JSON.stringify(res))
            _this.$router.push('/user/login')
          }
        }
        getToken()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .user_img_wrap{
    width: 100%;
    height: 120px;
    background-color: rgb(15, 112, 202);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    .user_img{
      margin-bottom: 5px;
    }
    .el-button{
      width: 50%;
    }
  }
  .my_data{
    font-size: 13px;
    margin: 5px 0;
  }
  .el-row {
  margin-bottom: 20px;
  // margin-top: 20px;
  &:last-child {
    margin-bottom: 0;
  }
 }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #e5e9f2;
  }
  .bg-purple {
    background: #e5e9f2;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .van-cell-group{
    border: 1px solid gray;
    margin-top: 20px;
  }
  .user_logout{
    text-align: center;
    margin-top: 30px;
    .el-button{
      background-color: red;
      color: black;
      // font-size: 16px;
      width: 50%;
    }
  }
</style>
