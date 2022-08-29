<template>
  <!-- <div><h1>Home</h1></div> -->
  <div>
    <div class="search_header">
      <div class="demo-type">
        <div>
          <el-avatar icon="el-icon-user-solid" class="el-avatar" :src='this.userinfo.picUrl'></el-avatar>
        </div>
      </div>
      <van-search v-model="value" placeholder="请输入搜索关键词"  />
      <div @click="onSearch" class="search_text">搜索</div>
    </div>
    <van-swipe class="my-swipe" :autoplay="3000"  lazy-render>
      <van-swipe-item>
        <van-image class="van-swipe-img" src="//n.sinaimg.cn/sports/crawl/270/w750h320/20220627/7fbf-cfdafb302ffa174a4b8fa6476b29cd81.jpg" fix=" fill" :show-error="true" />
      </van-swipe-item>
      <van-swipe-item>
        <van-image class="van-swipe-img" src="//n.sinaimg.cn/sports/crawl/117/w550h367/20220627/4495-66a5f28d19a1751705da9964e2314f0c.jpg" fix=" fill" :show-error="true"/>
      </van-swipe-item>
    </van-swipe>
    <div class="btn_wrap">
      <el-row>
        <el-button size="medium" round @click="CreateTeam">我要组队</el-button>
        <el-button size="medium" round @click="CreateTeamActivity">发布赛事</el-button>
      </el-row>
    </div>
    <van-notice-bar left-icon="volume-o" :text="notice_text" scrollable  delay=0 @replay ='replay' />
    <el-tabs type="border-card" stretch>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 近期活动</span>
        <el-table
        :data="activityList"
        style="width: 100%">
          <el-table-column
            label="日期"
            width="190"
          >
          <!-- v-fit-columns -->
            <template slot-scope="scope">
              <!-- <i class="el-icon-time"></i> -->
              <span>{{ scope.row.acti_date }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="球队"
            width="100">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>创建者: {{ scope.row.username }}</p>
                <p>球队名: {{ scope.row.teamname }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.teamname }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="活动名称"
            width="100">
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
            width="200">
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

export default {
  name: 'Home',
  data () {
    return {
      newList: [],
      value: '',
      activityList: [],
      notice_text: '',
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
      }

    }
  },
  created () {
    this.initImgList()

    // todo =>获取用户信息
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('create:token不存在')
    }
    const UserRes = axios({
      method: 'get',
      url: 'http://127.0.0.1:3030/my/userinfo',
      headers: { Authorization: token }
    })
    UserRes.then(res => {
      console.log(res)
      this.userinfo.userID = res.data.data.id
      this.userinfo.username = res.data.data.username
      this.userinfo.nickname = res.data.data.nickname
      this.userinfo.email = res.data.data.email
      this.userinfo.userpic = res.data.data.userpic
      this.teamInfo.teamName = res.data.data.teamName
      this.teamInfo.teamID = res.data.data.teamID
      if (this.userinfo.userpic !== null) {
        const picUrl = 'https://' + this.userinfo.userpic
        // console.log(picUrl)
        this.userinfo.picUrl = picUrl
        this.avatarShow = false
      }
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
          // this.teamInfo.teamMemberList = res3.data.data.list1
          // this.teamInfo.joinTeam_memberList = res3.data.data.list2
          this.teamInfo.teamCaptain = res3.data.data.list3[0].newCaptain
          this.teamInfo.captainID = res3.data.data.list3[0].CaptainId
          // this.teamInfo.teamMemberList.splice(this.teamInfo.teamMemberList.findIndex(item => item.id === this.teamInfo.captainID), 1)
        })
      }
    }).catch(err => {
      console.log(err)
    })

    // todo => 获取活动信息

    const getActiRes = axios({
      url: 'http://127.0.0.1:3030/team/getTeamActivity'
    })
    getActiRes.then((res2) => {
      // console.log(res2.data)
      // console.log(res2.data.ActiData)
      this.activityList = res2.data.ActiData
      const newObj = {
        '活动名称:': this.activityList[0].acti_name,
        '活动日期:': this.activityList[0].acti_date
      }
      this.notice_text = JSON.stringify(newObj)
      console.log(this.activityList)
    }).catch(err2 => {
      console.log('err2' + err2)
    })

    // todo => 获取球队列表信息
  },
  methods: {
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
      const { data: res } = await axios.get('htt://api.tianapi.com/tiyu/index?key=d388d86cba602a7b9d3db549bf2e4aca&num=4')
      this.newList = res.newslist
      // console.log(this.newList)
    },
    CreateTeam () {
      if (this.teamInfo.teamName !== null) {
        return alert('已加入球队，不能再申请创建或加入其他球队')
      }
      this.$router.push('/team/Create')
    },
    testArr () {
      const arr = this.activityList
      const newArr = arr.map((item) => {
        return {
          name: item.acti_name,
          date: item.acti_date
        }
      })
      console.log(newArr)
      this.notice_text = JSON.stringify(newArr[Math.floor(Math.random() * newArr.length)])
      // console.log('this.notice_text的值是:' + this.notice_text)
    },
    replay () {
      // console.log('hello')
      setTimeout(this.testArr, 755 % 60 * 1000)
    },
    CreateTeamActivity () {
      if (!this.userinfo.userID) {
        return alert('请先登录')
      }
      if (this.userinfo.userID !== this.teamInfo.captainID) {
        return alert('你不是球队队长，不能创建活动')
      }
      if (!this.teamInfo.teamID) {
        return alert('你未加入任何球队，不能发起赛事活动')
      }
      // if ()
      const teamNameRes = this.activityList.filter(item => {
        return item.teamname === this.teamInfo.teamName
      })
      console.log(teamNameRes.length)
      if (teamNameRes.length !== 0) {
        return alert('你的球队已经创建了活动')
      }
      // console.log('可以创建')
      this.$router.push('/team/createTeamActivity')
    }
  }
}
</script>

<style lang="less" scoped>
  .search_header{
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color:red;
  }
  .van-search{
    background-color: red;
  }

  .search_text{
    line-height: 54px;
    color: white;
  }

  .demo-type{
    position: relative;
    width: 54px;
    height: 54px;
    .el-avatar{
      position: absolute;
      margin: auto;
      padding: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }

  }
  .my-swipe .van-swipe-item {
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
    height: 200px;
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
    margin-top: 10px;
  }

</style>
