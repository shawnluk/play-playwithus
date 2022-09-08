<!-- <template>
  <div id="container"></div>
</template>

<script>
import { loadBaiDuMap } from '@/api/BmapSearch.js'

export default {
  name: 'Stadium',
  data () {
    return {
      map: null
    }
  },
  methods: {
    initMap () {
      loadBaiDuMap().then((BMap) => {
        const map = new BMap.Map('container')
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
        const local = new BMap.LocalSearch(map, {
          renderOptions: { map: map }
        })
        local.search('景点')
      })
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="less" scoped>
  #container{
    width: 100%;
    height: 300px;
  }
</style> -->

<template>
  <div>
    <div id="Text"></div>
    <input v-model="lat">
    <input v-model="lnd">
    <!-- <label>关键词：<input v-model="keyword"></label>
    <label>地区：<input v-model="location"></label> -->
    <baidu-map :center="location" :zoom="zoom" @ready="handler">
      <bm-view class="map"></bm-view>
      <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" :pageCapacity="pageCapacity"></bm-local-search>
    </baidu-map>
  </div>
</template>

<script>
import axios from 'axios'
// import getPosition from '@/api/position.js'
export default {
  data () {
    return {
      location: '广州',
      keyword: '足球场',
      lat: '',
      lnd: '',
      rtp: '',
      zoom: 15,
      pageCapacity: 6
    }
  },
  created () {
    this.initRTP()
    // console.log(this)
    // const _this = this
    // navigator.geolocation.getCurrentPosition(function (position) {
    //   _this.lat = position.coords.latitude
    //   _this.lnd = position.coords.longitude
    // })
    // console.log(_this.lat)
  },
  methods: {
    handler ({ BMap, map }) {
    // console.log(BMap, map)
      // this.center.lng = this.lat
      // this.center.lat = this.lnd
      // this.zoom = 15
    },
    async initRTP () {
      const { data: res } = await axios.get('https://api.map.baidu.com/geoconv/v1/?coords=114.21892734521,29.575429778924&from=1&to=5&ak=wRGMCc3oNOyxhqQrhbqxEDKSa3zwyj8G')
      console.log(res)
      //   const options = {
      //     enableHighAccuracy: true,
      //     timeout: 5000,
      //     maximumAge: 0
      //   }

      //   // const _this = this
      //   function success (position) {
      //     // const crd = pos.coords
      //     // _this.rtp = crd
      //     const latitude = position.coords.latitude
      //     const longitude = position.coords.longitude
      //     const str = '位置：' + longitude + ',' + latitude
      //     document.getElementById('Text').innerHTML = str
      //   };

      //   function error (err) {
      //     console.warn('ERROR(' + err.code + '): ' + err.message)
      //   };

    //   navigator.geolocation.getCurrentPosition(success, error, options)
    },
    getLongitudeLatitude () {
      const _this = this
      // console.log(this)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // locationSuccess 获取成功的话
          function (position) {
            _this.lat = position.coords.longitude
            _this.lnd = position.coords.latitude
            // console.log(_this.lnd)
            // console.log(_this)
          },
          // locationError  获取失败的话
          function (error) {
            const errorType = [
              '您拒绝共享位置信息',
              '获取不到位置信息',
              '获取位置信息超时'
            ]
            console.log(errorType[error.code - 1])
          }
        )
      }
      // console.log(this)
    }
  },
  mounted () {
    // this.initRTP()
    // console.log(this.rtp)
    this.getLongitudeLatitude()
    // console.log(this)
  }
}
</script>

<style>
.map{
  width: 100%;
  height: 250px;
}
</style>
