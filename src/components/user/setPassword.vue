<template>
  <div>
    <h5>更改密码页面</h5>
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

export default {
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
      callback()
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
          if (!confirm('你确定要修改成新密码吗？')) {
            return false
          }
          const data = {
            oldPass: this.ruleForm.oldPass,
            newPass: this.ruleForm.newPass
            // time: new Date().toJSON()
          }
          this.$API.user.setPassword(data).then(res => {
            console.log(res.data)
            if (res.data.status === 200) {
              alert('修改密码成功，请重新登录')
              this.$router.replace('/user/login')
            }
          }).catch(err => {
            console.log(err)
          })
          // })
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
  },
  created () {
    this.$API.user.getUserInfo().then(res => {
      console.log(res.data)
      if (res.data.status === 200) {
        this.ruleForm.username = res.data.userData.username
      }
    })
  }
}
</script>

<style lang="less" scoped>

</style>
