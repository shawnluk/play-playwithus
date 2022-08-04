<template>
  <!-- <div>CreateTeam</div>
   -->
   <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="teamName"
          name="球队名称"
          label="球队名称"
          placeholder="球队名称"
          :rules="[{ required: true, message: '请填写你要创建的球队名' }]"
        />
        <van-field
          v-model="teamSlogan"
          name="球队口号"
          label="球队口号"
          placeholder="球队口号"
          :rules="[{ required: true, message: '请填写你的球队口号' }]"
        />
        <van-field name="uploader" label="球队头像">
          <template #input>
            <van-uploader v-model="uploader" />
          </template>
        </van-field>
        <van-field
          v-model="message"
          rows="2"
          autosize
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
export default {
  data () {
    return {
      teamName: '',
      teamSlogan: '',
      uploader: [],
      message: ''
    }
  },
  methods: {
    onSubmit (values) {
      this.$router.replace('/user')
      console.log('submit', values)
    }
  },
  created () {
  }
}
</script>

<style>

</style>
