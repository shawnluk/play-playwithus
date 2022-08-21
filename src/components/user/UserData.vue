<template>
  <div>
    <h1>更新个人信息资料</h1>
    <van-cell-group>
      <van-field v-model="nickValue" label="昵称" placeholder="请输入你的昵称" />
      <van-field v-model="emailValue" label="邮箱" placeholder="请输入你的邮箱" />
    </van-cell-group>
    <!-- <el-upload
      class="avatar-uploader"
      action='http://127.0.0.1:3030/my/setPic'
      :show-file-list="true"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload> -->
    <!-- <van-uploader v-model="fileList" :after-read="afterRead" :before-read="beforeRead" :max-count="1"  /> -->
    <button type="button" class="btn btn-primary" @click="upload">确定修改个人资料</button>
    <van-cell is-link @click="uploadPic">上传头像</van-cell>
    <van-popup v-model="show" position="bottom" :style="{ height: '30%' }" class="popup">
      <van-uploader v-model="fileList" :after-read="afterRead" :before-read="beforeRead" :max-count="1" class="uploader" preview-full-image>
        <!-- <div  #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </div> -->
      </van-uploader>
    </van-popup>
    <!-- <button type="button" class="btn btn-primary" @click="uploadPic" >上传头像</button> -->
  </div>
</template>

<script>
import axios from 'axios'
import { Toast } from 'vant'
export default {
  data () {
    return {
      nickValue: '',
      emailValue: '',
      fileList: [],
      show: false
    }
  },
  methods: {
    uploadPic () {
      this.show = true
    },
    async upload () {
      // console.log('准备上传')
      const token = localStorage.getItem('token')
      // console.log(this.nickValue)
      const { data: res1 } = await axios({
        method: 'post',
        headers: { Authorization: token },
        url: 'http://127.0.0.1:3030/my/baseInfoSet',
        data: {
          nickname: this.nickValue,
          email: this.emailValue
        }
      })
      // console.log(res1)
      const confirmRes = confirm('你要更新的信息是：' + '昵称：' + this.nickValue + ' 邮箱：' + this.emailValue)
      if (confirmRes) {
        alert(JSON.stringify(res1))
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
          const token = localStorage.getItem('token')
          const url = 'http://127.0.0.1:3030/my/setPic'
          const formData = new FormData()
          formData.append('avatar', file.file)
          // console.log(formData.get('avatar'))
          axios.post(url, formData, {
            headers: { Authorization: token, enctype: 'multipart/form-data' }
          }).then(res => {
            // console.log(res.data)
            if (res.data.status === 0) {
              alert(JSON.stringify(res.data))
            }
          })
        }, 4000)
      }
    },
    beforeRead (file) {
      // console.log(file)
      if (file.type !== 'image/jpeg') {
        Toast('请上传 jpg 格式图片')
        return false
      }
      return true
    }
    // -----------------------
    //  返回promise
    // asyncBeforeRead(file) {
    //   return new Promise((resolve, reject) => {
    //     if (file.type !== 'image/jpeg') {
    //       Toast('请上传 jpg 格式图片');
    //       reject();
    //     } else {
    //       let img = new File(['foo'], 'bar.jpg', {
    //         type: 'image/jpeg',
    //       });
    //       resolve(img);
    //     }
    //   });
    // },
    // -----------------------
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    // beforeAvatarUpload (file) {
    //   const isJPG = file.type === 'image/jpeg'
    //   const isLt2M = file.size / 1024 / 1024 < 2

    //   if (!isJPG) {
    //     this.$message.error('上传头像图片只能是 JPG 格式!')
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!')
    //   }
    //   return isJPG && isLt2M
    // }
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

//   .avatar-uploader .el-upload {
//   border: 1px dashed #d9d9d9;
//   border-radius: 6px;
//   cursor: pointer;
//   position: relative;
//   overflow: hidden;
// }
// .avatar-uploader .el-upload:hover {
//   border-color: #409EFF;
// }
// .avatar-uploader-icon {
//   font-size: 28px;
//   color: #8c939d;
//   width: 178px;
//   height: 178px;
//   line-height: 178px;
//   text-align: center;
// }
// .avatar {
//   width: 178px;
//   height: 178px;
//   display: block;
// }
</style>
