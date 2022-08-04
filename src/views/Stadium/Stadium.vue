<template>
  <div>
    <div id="container"></div>
  </div>

</template>

<script>
// import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  name: 'Stadium',
  data () {
    return {
      map: null
    }
  },
  methods: {

  },
  mounted () {
    this.initMap()
  }
}
</script>

<style scoped>
  #container{
    padding:0px;
    margin: 0px;
    width: 100%;
    height: 300px;
  }
</style>
