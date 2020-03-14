<template>
  <div id="app" class="x-y-center">
    <div class="video-player-wrapper">
      <video-player
        :url="url"
        :type="'video/mp4'"
        @loaded="loaded"
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
    }
  },

  components: {
    videoPlayer
  },

  methods: {
    loaded () {},
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
