<template>
  <!-- <div><h1>Home</h1></div> -->
  <div class="home">

    <!-- 顶部搜索框 -->
    <div class="search_header">
      <div class="demo-type">
          <el-avatar icon="el-icon-user-solid" class="el-avatar" :src='$store.state.user.userinfo.userPic'></el-avatar>
      </div>
      <van-search v-model="searchValue" placeholder="请输入搜索关键词"  />
      <div @click="onSearch" class="search_text">搜索</div>
    </div>

    <!--  中间轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000"  lazy-render>
      <van-swipe-item v-for="item in this.newList" :key="item.id">
        <van-image class="van-swipe-img" :src="item.picUrl" fix=" fill" :show-error="true" />
      </van-swipe-item>
    </van-swipe>

    <!-- 按钮列表  -->
    <div class="btn_wrap">
      <el-row>
        <el-button size="medium" round @click="CreateTeam">我要组队</el-button>
        <el-button size="medium" round @click="CreateTeamActivity">发布赛事</el-button>
      </el-row>
    </div>

    <!-- notice -->
    <van-notice-bar left-icon="volume-o" :text="notice_text" :scrollable='scrollable'  delay=0 @replay ='replay' />

    <!-- 内容列表 -->
    <el-tabs type="border-card" stretch>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date">近期活动</i></span>
        <el-table
        :data="this.$store.state.activity.activityList"
        style="width: 100%">
          <el-table-column
            label="日期"
          >
          <!-- v-fit-columns -->
            <template slot-scope="scope">
              <!-- <i class="el-icon-time"></i> -->
              <span>{{ scope.row.acti_date }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="球队"
            >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>创建者: {{ scope.row.username }}</p>
                <p>球队名: {{ scope.row.teamName }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.teamName }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="活动名称"
            >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>比赛形式: {{ scope.row.acti_resource }}</p>
                <p>比赛类型: {{ scope.row.acti_type }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.acti_name }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="活动地址"
            >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>比赛描述: {{ scope.row.acti_desc }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.acti_region }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">查看更多</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">报名中</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="球队推荐"></el-tab-pane>
      <el-tab-pane label="球场推荐">球场推荐</el-tab-pane>
    </el-tabs>
    <!-- <el-button size="medium" round @click='testArr'>测试数组</el-button> -->
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      newList: [],
      searchValue: '',
      notice_text: '',
      scrollable: false
    }
  },
  created () {
    // this.initImgList()

    /* 获取用户信息和球队信息 */
    this.getUserInfo()

    /* 获取用户所在球队信息 */
    this.getTeamInfo()

    /* 获取活动列表信息 */
    this.getActivity()
  },
  mounted () {
    // console.log(this.$store.state.user.userinfo.username)
    // setTimeout(() => {
    // this.$socket.open()
    // console.log(this.$socket.io.opts.store)
    // }, 100)
  },
  methods: {
    ...mapActions('activity', ['getActivity']),
    ...mapActions('user', ['getUserInfo']),
    ...mapActions('team', ['getTeamInfo']),
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    onSearch () {
      console.log('搜索')
    },
    async initImgList () {
      const { data: res } = await axios.get('http://api.tianapi.com/football/index?key=d388d86cba602a7b9d3db549bf2e4aca&num=4')
      console.log(res)
      this.newList = res.newslist
    },
    CreateTeam () {
      if (!this.$store.state.user.userinfo.id) {
        return alert('请先登录')
      }
      if (this.$store.state.team.teamInfo.teamName) {
        return alert('已加入球队，不能再申请创建或加入其他球队')
      }
      this.$router.push('/team/create')
    },
    testArr () {
      const arr = this.$store.state.activity.activityList
      const newArr = arr.map((item) => {
        return {
          活动名称: item.acti_name,
          活动日期: item.acti_date
        }
      })
      this.notice_text = JSON.stringify(newArr[Math.floor(Math.random() * newArr.length)])
    },
    replay () {
      setTimeout(this.testArr, 755 % 60 * 1000)
    },
    CreateTeamActivity () {
      if (!this.$store.state.user.userinfo.id) {
        return alert('请先登录')
      }
      if (this.$store.state.user.userinfo.id !== this.$store.state.team.teamInfo.CaptainID) {
        return alert('你不是球队队长，不能创建活动')
      }
      if (!this.$store.state.team.teamInfo.id) {
        return alert('你未加入任何球队，不能发起赛事活动')
      }
      const teamNameRes = this.$store.state.activity.activityList.filter(item => {
        return item.teamName === this.$store.state.team.teamInfo.teamName
      })
      console.log(teamNameRes.length)
      if (teamNameRes.length !== 0) {
        return alert('你的球队已经创建了活动')
      }
      this.$router.push('/activity/create')
    },
    connectServer () {
      this.$socket.emit('connectServer', this.$store.state.user.userinfo.username)
    }
  },
  watch: {
    '$store.state.activity.activityList': {
      handler: function (newValue, oldValue) {
        if (newValue.length > 0) {
          const newObj = {
            活动名称: this.$store.state.activity.activityList[0].acti_name,
            活动日期: this.$store.state.activity.activityList[0].acti_date
          }
          this.notice_text = JSON.stringify(newObj)
          this.scrollable = true
          return
        }
        this.notice_text = '暂无活动数据'
      },
      immediate: true
    },
    '$store.state.user.userinfo.username': {
      handler: function (newValue, oldValue) {
        // console.log(newValue + '+' + oldValue)
        if (newValue) {
          this.$socket.close()
          this.$socket.open()
          this.connectServer()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
  .home{
    margin-bottom: 50px;
    border:none
  }
  .search_header{
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color:red;
  }
  .van-search{
    background-color: red;
     flex-basis:80%
  }

  .search_text{
    line-height: 54px;
    color: white;
    flex-basis:25%;
    text-align: center;
  }
  .demo-type{
  flex-basis:25% ;
  width: 54px;
  height: 54px;
    .el-avatar{
      display:block;
      margin: 0 auto;
      margin-top: 7px;
    }
  }

  .my-swipe .van-swipe-item {
    width: 100%;
    // color: #fff;
    // font-size: 20px;
    // line-height: 150px;
    // text-align: center;
    // background-color: #39a9ed;
  }
  // .el-carousel__item {
  //   width: 100%;
  //   height: 340px;
  //   margin: 0 auto;
  //   img{
  //     display: inline-box;
  //     width: 100%;
  //   }
  // }

  // .el-carousel__item:nth-child(2n) {
  //   background-color: #99a9bf;
  // }

  // .el-carousel__item:nth-child(2n+1) {
  //   background-color: #d3dce6;
  // }
  .my-swipe{
    // overflow: hidden;
    width:90%;
    height: 500px;
    // position: relative;
    // background-size: cover;
    // padding-top: 100%;
    margin-top: 30px;
    margin: 0 auto;
    .van-swipe-img {
      width: 100%;
      height: 100%;
      // position: absolute;
    }
  }
  .btn_wrap{
    margin-top: 10px;
    .el-row{
      display: flex;
      justify-content: space-between;
      width: 100%;
      .el-button{
      width: 100px;
      height: 40px;
      background-color: red;
      color: white;
    }
    }
  }
  .van-notice-bar{
    margin-top: 10px;
  }
  .el-tabs{
    .el-tab-pane{
      .el-table{
        // display: flex;
      }
      .el-table-column:first-child{
        // width: 40%;
        // flex-basis: 40%;
        min-width:200px
      }
    }
    margin-top: 10px;
  }

</style>
