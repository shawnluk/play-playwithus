<template>
  <div>
    <h5>球队信息修改页面</h5>
      <van-form @submit="onSubmit">
        <van-field
          v-model="teamName"
          name="teamName"
          label="球队名称"
          placeholder="球队名称"
          disabled
        />
        <van-field
          v-model="teamSlogan"
          name="teamSlogan"
          label="球队口号"
          placeholder="球队口号"
        />
        <van-field name="teamPic" label="球队头像">
          <template #input>
            <van-uploader v-model="fileList" :max-count="1" :after-read="afterRead" :before-read="beforeRead"/>
          </template>
        </van-field>
        <van-field
          v-model="teamDesc"
          rows="2"
          autosize
          name='teamDesc'
          label="球队描述"
          type="textarea"
          maxlength="50"
          placeholder="请输入你的球队描述"
          show-word-limit
        />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交修改</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>

// import axios from 'axios'
import { Toast } from 'vant'

export default {
  name: 'SetTeamInfo',
  data () {
    return {
      teamID: '',
      teamName: '',
      teamSlogan: '',
      teamDesc: '',
      fileList: []
    }
  },

  created () {
    /* 获取个人信息 */
    this.$API.user.getUserInfo().then(res => {
      if (res.data.status === 200) {
        console.log(res.data)
        this.teamName = res.data.userData.teamName
        this.teamID = res.data.userData.teamID
        return
      }
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })
  },

  methods: {
    onSubmit (values) {
      if (values.teamDesc === '' && values.teamSlogan === '' && values.teamPic.length === 0) {
        return alert('啥也没干，不能提交')
      }
      // console.log('submit', values)
      if (confirm('确认修改球队' + this.teamName + '的信息吗')) {
        if (values.teamDesc !== '' || values.teamSlogan !== '') {
          const teamData = {
            teamSlogan: values.teamSlogan,
            teamDesc: values.teamDesc,
            teamID: this.teamID,
            updateTime: new Date().toJSON()
          }
          this.$API.team.setTeamInfo(teamData).then(res => {
            console.log(res.data)
          }).catch(err => {
            console.log(err)
          })
        }

        if (values.teamPic.length !== 0) {
          const formData = new FormData()
          // formData.append('avatar', { team: this.teamID }, values.teamPic[0].file)
          formData.append('avatar', values.teamPic[0].file, this.teamID)

          this.$API.team.setPic(formData).then(result => {
            console.log(result.data)
          }).catch(error => {
            console.log(error)
          })
        }
      }
      this.$router.replace('/team/teamCenter')
    },
    beforeRead (file) {
      // console.log(file)
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast('请上传 jpg 或者 png 格式图片')
        return false
      }
      return true
    },
    afterRead (file) {
      // const formData = new FormData()
      // formData.append('avatar', file.file)
      // console.log(file)
      // console.log('111:' + typeof file.file)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
