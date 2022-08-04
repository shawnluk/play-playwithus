
function getPosition () {
  // console.log(navigator)
  navigator.geolocation.getCurrentPosition(function (position) {
    // console.log('当前地理位置', position)
    const RTP = position.coords
    console.log(RTP)
    return RTP
  })

  // return res
}

export default getPosition
