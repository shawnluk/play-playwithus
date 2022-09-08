<template>
  <!-- <div>CreateTeam</div>
   -->
   <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="teamName"
          name="teamName"
          label="球队名称"
          placeholder="球队名称"
          :rules="[{ required: true, message: '请填写你要创建的球队名' }]"
        />
        <van-field
          v-model="teamSlogan"
          name="teamSlogan"
          label="球队口号"
          placeholder="球队口号"
          :rules="[{ required: true, message: '请填写你的球队口号' }]"
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
        <van-button round block type="info" native-type="submit">立即创建我的球队</van-button>
      </div>
    </van-form>
   </div>

</template>

<script>
// import axios from 'axios'
import { Toast } from 'vant'

export default {
  name: 'createTeam',
  inject: ['reload'],

  data () {
    return {
      teamID: '',
      teamName: '',
      teamSlogan: '',
      teamDesc: '',
      fileList: []
    }
  },
  methods: {
    onSubmit (values) {
      console.log('submit', values)

      if (confirm('请确认你要创建的球队名为：' + values.teamName)) {
        const teamData = {
          teamName: values.teamName,
          teamSlogan: values.teamSlogan,
          teamDesc: values.teamDesc,
          createTime: new Date().toJSON()
        }

        this.$API.team.createTeam(teamData).then(res => {
          console.log(res.data)
          if (res.data.status === 200) {
            this.teamID = res.data.teamID

            if (values.teamPic.length !== 0) {
              const formData = new FormData()
              formData.append('avatar', values.teamPic[0].file, this.teamID)

              this.$API.team.setPic(formData).then(result => {
                console.log(result.data)
              }).catch(error => {
                console.log(error)
              })
            }
            this.$router.replace('/team/teamCenter')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    beforeRead (file) {
      // console.log(file)
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast('请上传 jpg 或 png 格式图片')
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
  },
  created () {
  }
}
</script>

<style>

</style>
