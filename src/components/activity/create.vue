<template>
  <div>
    <h5>创建活动页面</h5>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="比赛区域" prop="region">
        <el-input v-model="ruleForm.region"></el-input>
      </el-form-item>
      <el-form-item label="比赛时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" value-format="timestamp" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="比赛性质" prop="type" >
        <el-checkbox-group v-model="ruleForm.type" :max="1">
          <el-checkbox label="友谊赛" name="type"></el-checkbox>
          <el-checkbox label="联赛或杯赛" name="type"></el-checkbox>
          <el-checkbox label="自定义比赛" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="比赛场地" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上电竞比赛"></el-radio>
          <el-radio label="线下租约场地"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="比赛备注" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  inject: ['reload'],
  data () {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请选择一个比赛性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择比赛形式', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions('team', ['getTeamInfo']),
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          const data = {
            name: this.ruleForm.name,
            date1: this.ruleForm.date1,
            date2: this.ruleForm.date2,
            type: this.ruleForm.type[0],
            region: this.ruleForm.region,
            desc: this.ruleForm.desc,
            resource: this.ruleForm.resource,
            teamName: this.$store.state.team.teamInfo.teamName,
            teamID: this.$store.state.team.teamInfo.id
          }
          console.log(data)
          this.$API.activity.create(data).then(res => {
            console.log(res.data)
            if (res.data.status === 200) {
              this.$router.replace('/activity/list')
            }
          }).catch(err => {
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
    }
  },
  created () {
    /* 获取用户所在球队信息 */
    this.getTeamInfo()
  }
}
</script>

<style lang="less" scoped>

</style>
