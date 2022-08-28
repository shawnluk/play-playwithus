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
import axios from 'axios'
import { Toast } from 'vant'
export default {
  name: 'createTeam',
  data () {
    return {
      teamName: '',
      teamSlogan: '',
      fileList: [],
      teamDesc: ''
    }
  },
  methods: {
    async onSubmit (values) {
      // this.$router.replace('/user')
      console.log('submit', values)

      if (confirm('请确认你要创建的球队名为：' + values.teamName)) {
        // else if (values.teamName) {
        const token = localStorage.getItem('token')
        const { data: res } = await axios({
          method: 'post',
          headers: { Authorization: token },
          url: 'http://127.0.0.1:3030/team/create',
          data: {
            teamName: values.teamName,
            teamSlogan: values.teamSlogan,
            teamDesc: values.teamDesc
          }
        })
        console.log(res)
        // }
        if (res.status === 0) {
          if (values.teamPic.length !== 0) {
            const formData = new FormData()
            formData.append('avatar', values.teamPic[0].file)
            const url = 'http://127.0.0.1:3030/team/setPic'
            axios.post(url, formData,
              {
                headers: { Authorization: token, enctype: 'multipart/form-data' }
              }).then(res1 => {
              alert(JSON.stringify(res1.data))
            })
              .catch(err1 => {
                console.log(err1)
              })
          }
          alert(JSON.stringify(res))
          this.$router.replace('/user')
        } else {
          alert('发生错误，请重试')
        }
      }
    },
    beforeRead (file) {
      // console.log(file)
      if (file.type !== 'image/jpeg') {
        Toast('请上传 jpg 格式图片')
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
