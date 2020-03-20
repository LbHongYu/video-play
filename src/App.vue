<template>
  <div id="app" class="box x-y-center">
    <div class="video-player-wrapper">
      <video-player
        :url="url"
        :type="'video/mp4'"
        ref="videoRef"
        @loadeddata="loadeddata"
        @error="error"
      ></video-player>
    </div>
  </div>
</template>

<script>
import videoPlayer from './components/video-player'

export default {
  name: 'App',
  data () {
    return {
      url: 'https://interactive-examples.mdn.mozilla.net/media/examples/flower.mp4'
      // url: 'https://ugcws.video.gtimg.com/uwMROfz2r5zBIaQXGdGnC2dfJ6nAzEoO290Tsw9-2jpi_xWl/d0936jsm0z4.p701.1.mp4?sdtfrom=v1107&guid=5cc9aca901218f889ac4976e6b146536&vkey=2F048B3BC94C1141DC5512B04F825F0A592DB22DF095FFB625C875FAF4A28B2BC7B6885CC85A8FD001AD8E977FFD86AA07B18360A690533B4490343342EE0BC3E001B1005F5CE8550BEA7BD19AE8C9FD1CF0B1A9AAD85A4CD95D732AAA2C4D91D588E081A39D52CEF7002D60374301EB8F91E4BA9EFF2FA25BD668225D6B8D13'
    }
  },

  components: {
    videoPlayer
  },

  methods: {
    loadeddata () {     
    },
    error () {}
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.box {
  flex-direction: column;
}

/* 
  视频进度条样式覆盖
 */
::-ms-progress-value {
  background-color: rgba(244,92,72,1);
}

::-moz-progress-value {
  background-color: rgba(244,92,72,1);
}

::-webkit-progress-value {
  background-color: rgba(244,92,72,1);
}


.video-player-wrapper {
  height: 540px;
  width: 960px;
}
.x-y-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
