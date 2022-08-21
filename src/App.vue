<template>
 <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
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
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      active: 'home',
      isRouterAlive: 'true'
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
