<template>
  <div>
    <h1>更新个人信息资料</h1>
    <van-cell-group>
      <van-field v-model="nickValue" label="昵称" placeholder="请输入你的昵称" />
      <van-field v-model="emailValue" label="邮箱" placeholder="请输入你的邮箱" />
    </van-cell-group>
    <button type="button" class="btn btn-primary" @click="upload">确定修改个人资料</button>
    <van-cell is-link @click="uploadPic">上传头像</van-cell>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }" class="popup">
      <van-uploader v-model="fileList" :after-read="afterRead" :before-read="beforeRead" :max-count="1" class="uploader" preview-full-image>
        <!-- <div  #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </div> -->
      </van-uploader>
    </van-popup>
    <button type="button" class="btn btn-primary" @click="toUserinfo" >回到用户中心</button>
  </div>
</template>

<script>
// import axios from 'axios'
import { Toast } from 'vant'
import { mapActions } from 'vuex'

export default {
  name: 'setUserInfo',
  inject: ['reload'],
  data () {
    return {
      nickValue: '',
      emailValue: '',
      fileList: [],
      show: false
    }
  },
  methods: {
    ...mapActions('user', ['getUserInfo']),

    uploadPic () {
      this.show = true
    },

    upload () {
      const confirmRes = confirm('你要更新的信息是：' + '昵称：' + this.nickValue + ' 邮箱：' + this.emailValue)
      if (confirmRes) {
        const data = {
          nickname: this.nickValue,
          email: this.emailValue
          // time: new Date().toJSON()
        }
        // console.log(typeof data.updateTime)
        this.$API.user.setUserInfo(data).then(resSetUser => {
          console.log(resSetUser.data)
          alert(JSON.stringify(resSetUser.data))
          this.getUserInfo()
        }).catch(errSetUser => {
          console.log('修改用户信息失败' + errSetUser)
        })
      }
    },

    afterRead (file) {
      // console.log(file)
      file.status = 'uploading'
      file.message = '上传中...'
      if (!this.fileList[0].file.name) {
        setTimeout(() => {
          file.status = 'failed'
          file.message = '上传失败'
        }, 3000)
      } else {
        setTimeout(() => {
          file.status = 'done'
          file.message = '上传成功'
        }, 3000)
        setTimeout(() => {
          if (!confirm('是否要上传此图片作为您的头像')) {
            this.fileList = []
            return
          }
          const formData = new FormData()
          formData.append('avatar', file.file)
          this.$API.user.setPic(formData).then(resUserPic => {
            console.log(resUserPic.data)
            this.getUserInfo()
            this.reload()
          }).catch(errUserPic => {
            console.log(errUserPic)
          })
        }, 4000)
      }
    },
    beforeRead (file) {
      console.log(file)
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        Toast('请上传 jpg 或 png 格式图片')
        return false
      }
      return true
    },
    toUserinfo () {
      this.$router.replace('/my/userinfo')
    }
  }
}
</script>

<style lang="less" scoped>
  .popup{
    display: flex;
    // position: relative;
    .uploader {
      // position: absolute;
        width: 100%;
        height: 100%;
        justify-content:center;
    }
  }

</style>
