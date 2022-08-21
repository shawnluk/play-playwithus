<template>
  <div>
    <h5>更改密码页面</h5>
    <!-- <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
        :colon="true"
        disabled
      />
      <van-field
        v-model="oldPwd"
        type="password"
        name="oldPwd"
        label="输入旧密码"
        placeholder="输入旧密码"
        :rules="[{ required: true, message: this.message1 }]"
        :colon="true"
      />
      <van-field
        v-model="newPwd"
        type="text"
        name="newPwd"
        label="输入新密码"
        placeholder="输入新密码"
        :rules='this.rules'
        :formatter="comparePwd"
        format-trigger="onBlur"
        :colon="true"
      />

      <van-field
        v-model="newPwdConfirm"
        type="password"
        name="newPwdConfirm"
        label="确认新密码"
        placeholder="确认新密码"
        :rules="[{ required: true,pattern,message: this.message3 }]"
        :colon="true"
      />
      <div style="margin: 16px;">
        <p>密码格式: 长度6-10, 支持英文字母大小写和数字</p>
      </div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form> -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名"  >
        <el-input type="text" v-model="ruleForm.username" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="旧密码" >
        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="pass" >
        <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass" >
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import bus from '@/router/eventBus.js'
import axios from 'axios'

export default {
  // data () {
  //   return {
  //     username: '',
  //     oldPwd: '',
  //     newPwd: '',
  //     newPwdConfirm: '',
  //     pattern: /^[a-zA-Z0-9]{6,10}$/,
  //     message1: '请填写旧密码',
  //     message2: '密码格式不正确',
  //     message3: '请再次确认输入的新密码'
  //   }
  // },
  data () {
    const validatePass = (rule, value, callback) => {
      // console.log(value)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!this.pattern.test(this.ruleForm.newPass)) {
        callback(new Error('密码格式不正确'))
      } else if (this.ruleForm.newPass === this.ruleForm.oldPass) {
        callback(new Error('新密码和旧密码一样'))
      }
      // else {
      //   if (this.ruleForm.checkPass !== '') {
      //     this.$refs.ruleForm.validateField('checkPass')
      //   }
      callback()
      // }
    }
    const validatePass2 = (rule, value, callback) => {
      // console.log(value)
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      pattern: /^[a-zA-Z0-9]{6,10}$/,
      ruleForm: {
        username: '',
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert(JSON.stringify(this.ruleForm))
          confirm('你确定要修改成新密码吗？')
          if (!confirm) { return }
          const token = localStorage.getItem('token')
          // const params = this.ruleForm
          const res = axios({
            // params,
            method: 'post',
            url: 'http://127.0.0.1:3030/my/setpwd',
            headers: { Authorization: token },
            data: {
              oldPass: this.ruleForm.oldPass,
              newPass: this.ruleForm.newPass
            }
          })
          res.then(res1 => {
            // console.log(res1)
            if (res1.data.status === 0 && res1.data.message === '重置密码成功') {
              alert('请重新登陆')
              localStorage.removeItem('token')
              this.$router.push('/user/login')
            }
          }).catch(err => {
            // alert(err)
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.oldPass = ''
      this.ruleForm.newPass = ''
      this.ruleForm.checkPass = ''
    }
    // comparePwd (e) {
    //   // if (e.target.value === this.oldPwd) {
    //   //   this.message2 = '新密码和旧密码一致'
    //   //   this.newPwd = ''
    //   console.log(e)
    //   // }
    // },
    // onSubmit (values) {
    //   // console.log('submit', values)

    // }
  },
  created () {
    // const token = localStorage.getItem('token')
    // if (!token) {
    //   return alert('token过期,请重新登陆')
    // }
    // bus.$on('share', (val) => {
    // console.log('触发了')
    // this.username = val
    // console.log(this.username)
    // })
    const token = localStorage.getItem('token')
    const url = 'http://127.0.0.1:3030/my/userinfo'
    const res = axios({
      url,
      headers: { Authorization: token }
    })

    res.then(res1 => {
      // console.log(res1.data)
      this.ruleForm.username = res1.data.data.username
      // console.log(this.username)
      this.ruleForm.oldPass = ''
    })
  }
}
</script>

<style lang="less" scoped>

</style>
