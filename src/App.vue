<template>
 <div id="app">
    <router-view></router-view>
    <van-tabbar v-model="active" v-if='$route.meta.TabBarShow' route>
      <van-tabbar-item icon="home-o" to="/home" name="home">主页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/team" name="team">球队</van-tabbar-item>
      <van-tabbar-item icon="search" to="/stadium" name="stadium">球场</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/user" name="user">我的</van-tabbar-item>
    </van-tabbar>
 </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      active: 'home'
    }
  }
}
</script>

<style lang="less" scoped>
</style>
