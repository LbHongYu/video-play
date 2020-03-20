<template>
  <div class= "video-viewer"
    @mousemove="showActions"
    ref="mediaViewerRef">
    <video
      ref="videoRef"
      class="media-player"
      preload="false"
      @loadstart="loadstart"
      @loadedmetadata="setVideoDuration"
      @loadeddata="loadeddata"
      @playing="playing"
      @pause="pause"
      @timeupdate="mediaTimeupdate"
      @ended="ended"
      @click="clickMedia"
      :data-fullscreen="isFullScreen"
      :autoplay="$props.autoplay"
    >
      <source
        ref="videoSourceRef"
        @error="error"
        :src="$props.url"
        :poster="$props.poster"
        :type="$props.type"
      />
    </video>

    <div class="custom-controls" 
      ref="CustomControlsRef" 
      :class="isMousemove ? 'in' : 'out'"
    >
      <div class="progress-wrapper"
        @mouseover="mouseActionOnProgress('over')"
        @mouseleave="mouseActionOnProgress('leave')"      
      >
        <progress class="progress-cell"
          @click="skipAhead"
          :class="{'active': bActiveProgress}"
          ref="ProgressRef"
          :value="currentTime"
          min="0"
          :max="duration"
        ></progress>
        <div class="icon" 
          :style="playProgress" 
          :class="{'active': bActiveProgress}"
          v-show="isMousemove"
          @mousedown="mousedownOnProgressIcon"
        ></div>        
      </div>
      <div class="controls-items">
        <div class="left">
          <span class="play-cell">
            <i class="iconfont"
              @click="onSwitchMediaStatus"
              :class="isPlay ? 'icon-pause' : 'icon-play'"
            ></i>
          </span>
          <span class="time-cell">
            {{hy_utils.formatTime(currentTime)}}
            <span class="total-time">
              / {{hy_utils.formatTime(duration)}}
            </span>
          </span>
        </div>
        <div class="right">
          <div class="play-rate tool-item">
            <playback-rate v-model="playRateValue"></playback-rate>
          </div>

          <div class="volume-control tool-item">
            <volume v-model="volumeValue"></volume>
          </div>

          <div class="full-screen tool-item">
            <i class="full-screen iconfont"
              @click="handleFullscreen"
              :class="isFullScreen ? 'icon-ExitFullScreen' : 'icon-FullScreen'"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 暂停视频时的遮罩 -->
    <div class="shelter x-y-center" 
      v-show="!isPlay"
      @click="onSwitchMediaStatus"
    >
        <i class="iconfont"
          :class="isPlay ? 'ic_video_pause' : 'icon-playcircle-fill'"
        ></i>
    </div>
  </div>
</template>
<script>
/* 
优化点:
  1. .video-viewer 添加 overflow: hidden
  2. 没有传入 url 时的容错处理
  3. 删除 progressBarRef[ref], progressBarWidth[computed]
 */

import tool from './tool.js';
import volume from './component/volume.vue';
import playbackRate from './component/playback-rate.vue';

export default {
  name: 'VideoViewer',

  props: {
    url: {
      type: String,
      required: true
    },
    poster: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    skip: {
      type: Number,
      default: 3      
    }
  },

  data () {
    return {
      currentTime: 0, // 当前播放时间
      isPlay: false, // 视频是否正在播放
      isFullScreen: false, // 是否全屏
      isLoading: true, // 视频是否正在加载,用于显示加载效果
      isFoucsed: false, // 是否聚焦在播放器
      isMousemove: true, // 鼠标是否在播放器上移动
      duration: 0, // 视频时长
      volumeValue: 0, // 音量
      playRateValue: 1, // 播放倍速
      bActiveProgress: false, // 鼠标悬浮在进度条上
      bPressProgressIcon: false, // 是否按住进度条的定位图标
      startMovePos: 0 // 按住进度条的定位图标的起始位置
    };
  },

  computed: {
    playProgress () {
      let res = 0;
      if (this.duration) {
        res = (this.currentTime / this.duration) * 100;
      }
      res >= 99 ? 99 : ~~res;
      return `left: ${res}%`;
    }

  },

  watch: {
    '$props.url': {
      handler () {
        this.currentTime = 0;
        this.isPlay = false;
        this.isLoading = true;
        this.isFoucsed = false;
        this.isMousemove = true;
        this.duration = 0;
      },
      deep: true,
      immediate: true
    },
    playRateValue (newV) {
      if (newV) {
        this.$refs.videoRef.playbackRate = newV;
      }
    },
    volumeValue (newV) {
      if (newV) {
        this.$refs.videoRef.volume = newV;
      }
    }
  },


  created () {},

  mounted () {
    let doc = document;
    doc.addEventListener('click', this.onFocusMediaViewer);
    doc.addEventListener('keydown', this.onKeydown);
    doc.addEventListener('mousemove', this.mousemoveOnDocument);
    doc.addEventListener('mouseup', this.mousemupOnDocument);

    this.$refs.videoRef.volume = this.volumeValue;
  },

  components: {
    volume,
    playbackRate
  },
  methods: {
    onFocusMediaViewer (evt) {
      if (!this.$refs.mediaViewerRef.contains(evt.target)) {
        this.isFoucsed = false;
      } else {
        this.isFoucsed = true;
      }
    },

    // 聚焦时的【暂停/开始】,前进或者后退
    onKeydown (evt) {
      let code = evt.keyCode;
      if (this.isFoucsed && code === 32) {
        evt.preventDefault();

        this.onSwitchMediaStatus();
      } else if (this.isFoucsed && (code === 37 || code === 39)) {
        evt.preventDefault();

        let oldV = this.currentTime;
        let type = code === 37 ? 'minus' : 'plus';

        let newV = getNewCurTime.call(this, oldV, type);
        this.currentTime = this.$refs.videoRef.currentTime = newV;
        this.isPlay = true;
        this.$refs.videoRef.play();
      }

      function getNewCurTime (oldV, type) {
        let res = oldV;
        if (type === 'minus') {
          let newV = oldV - this.$props.skip;
          res = newV < 0 ? 0 : newV;
        } else {
          if (oldV >= this.duration - 1) {
            res = oldV;
          } else {
            let newV = oldV + this.$props.skip;
            res = newV > this.duration ? this.duration - 1 : newV;
          }
        }
        return res;
      }
    },

    // 
    mousedownOnProgressIcon (evt) {
      this.bPressProgressIcon = true;
      this.iconPos = tool.getOffsetLeft(evt.target);
    },

    mousemoveOnDocument (evt) {
      if (this.bPressProgressIcon) {
        let curPos = getCurIconPostion.call(this, evt) - tool.getOffsetLeft(this.$refs.ProgressRef);
        
        let cutTime = ( curPos / this.$refs.ProgressRef.offsetWidth) * this.$refs.videoRef.duration;
        this.currentTime = this.$refs.videoRef.currentTime =  cutTime;
      }

      function getCurIconPostion (evt) {
        let clientX = evt.clientX;
        let progressleft = tool.getOffsetLeft(this.$refs.ProgressRef);
        let progressWidth = this.$refs.ProgressRef.offsetWidth;

        //  progressleft |----------clientX---------| progressleft + progressWidth
        if (clientX < progressleft) {
          return progressleft;
        } else if (clientX > progressleft + progressWidth){
          return progressleft + progressWidth;
        } else {
          return clientX;
        }

      }
    },

    mousemupOnDocument () {
      this.bPressProgressIcon = false;
      this.iconPos = 0;
    },

    // 【暂停/开始】 播放
    onSwitchMediaStatus () {
      this.isPlay = !this.isPlay;

      if (this.$props.url) {
        if (this.isPlay) {
          this.$refs.videoRef.play();
        } else {
          this.$refs.videoRef.pause();
        }
      }
    },

    // complete to load the video resource, set media duration
    setVideoDuration () {
      // console.log('loadedmetadata');
      this.isLoading = false;

      let ref = this.$refs.videoRef;
      if (ref) {
        this.currentTime = 0;
        this.duration = ref.duration;
      }
    },

    // 点击进度条，前进或者后退
    skipAhead (evt) {
      if (this.$props.url) {
        let ref = this.$refs;
        var pos = evt.offsetX / ref.ProgressRef.offsetWidth;
        this.currentTime = ref.videoRef.currentTime = pos * ref.videoRef.duration;
        this.isPlay = true;
        this.$refs.videoRef.play();
      }
    },

    mouseActionOnProgress (action) {
      this.bActiveProgress = action === 'over' ? true : false;
    },

    loadstart () {
      this.isLoading = true;
      this.$emit('loadstart');
    },

    // 在媒体数据已经有足够的数据（至少播放数帧）可供播放时触发。这个事件对应CAN_PLAY的readyState。
    loadeddata () {
      this.isLoading = false;
      this.$emit('loadeddata');

      this.$nextTick(() => {
        if (this.$props.autoplay) {
          let instance = this.$refs.videoRef.play();

          // 在某些情况下无法调用播放器的 play 方法
          instance.then(() => {
            this.isPlay = true;
          }).catch(() => {
            this.isPlay = false;
          });
        }
      });
    },

    // 每次开始播放的时候（包括重新播放）执行
    playing () {
      // fix: 通过键盘开始播放，隐藏暂停按钮
      this.isPlay = true;
      this.$emit('playing');
    },

    pause () {
      // fix: 通过键盘暂停播放，显示暂停按钮
      this.isPlay = false;
      this.$emit('pause');
    },

    // media time update
    mediaTimeupdate () {
      if (this.$refs.videoRef) {
        let currentTime = this.$refs.videoRef.currentTime;
        this.currentTime = currentTime;
      }
    },

    ended () {
      this.$emit('ended');
      this.isPlay = false;
    },

    error () {
      this.isLoading = false;
      this.$emit('error');
    },

    clickMedia () {
      this.onSwitchMediaStatus();
    },

    showActions () {
      if (this.isLoading) return;
      this.isMousemove = true;
      if (this.showActions.timer) clearTimeout(this.showActions.timer);
      this.showActions.timer = setTimeout(() => {
        this.isMousemove = false;
      }, 2000);
    },

    handleFullscreen () {
      let elem = this.$refs.mediaViewerRef;
      if (tool.isFullScreenFn()) {
        document.exitFullscreen();
        this.isFullScreen = false;
      } else {
        elem.requestFullscreen();
        this.isFullScreen = true;
      }
    },

    getPlayedDuration (bDetail = false) {
      let duration = 0;
      let detail = [];
      if (!this.$refs.videoRef) {
        return bDetail ? { duration: duration, detail: [] } : duration;
      } else {
        for (let i = 0; i < this.$refs.videoRef.played.length; i++) {
          let start = this.$refs.videoRef.played.start(i);
          let end = this.$refs.videoRef.played.end(i);
  
          detail.push([start, end]);
          duration += end - start;
        }

        return bDetail ? { duration: duration, detail: detail } : duration;
      }

    }
  },

  beforeDestroy () {
    document.removeEventListener('click', this.onFocusMediaViewer);
    document.removeEventListener('keydown', this.onKeydown);
  }
};
</script>
<style scoped>
  .video-viewer {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #161823;
    user-select: none;
  }
  .video-viewer video {
    width: 100%;
    height: 100%;
  }

  .shelter {
    position: absolute;
    top: 0;
    background:rgba(0,0,0,0.2);;
    width: 100%;
    height: 100%;
    z-index: 0;
  }


  .shelter .iconfont {
    font-size: 56px;

  }  
  .custom-controls {
    position: absolute;
    width: 100%;
    background: rgba(0,0,0,0.6);
    height: 80px;
    transition: bottom 0.25s;
  }
  .custom-controls.in {
    bottom: 0px;
  }
  .custom-controls.out {
    bottom: -76px;
  }

  .iconfont {
    cursor: pointer;
    color: #fff;
  }

  .progress-wrapper {
    height: 4px;
  }
  
  .progress-cell.active {
    height: 6px;
    top: -1px;
  }

  .progress-cell {
    cursor: pointer;
    width: 100%;
    background: rgba(255,255,255,0.6);
    height: 4px;
    position: absolute;
    top: 0;
    left: 0;
    transition: width 0.4s;
    z-index: 2;
  }


  .progress-wrapper .icon {
    cursor: pointer;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    user-select: none;
    z-index: 2;
    display: inline-block;
    position: absolute;
    top: -3px;
  } 
  .progress-wrapper .icon.active {
    width: 12px;
    height: 12px;    
  }
  .controls-items {
    z-index: 1;
    display: flex;
  }

  .controls-items .left {
    flex: 1;
    z-index: 1;
    text-align: left;
  }

  .controls-items .left .play-cell {
    display: inline-block;
    font-size: 24px;
    vertical-align: middle;
    padding: 24px 30px 24px 30px;
  }

  .controls-items .left .iconfont {
    font-size: 24px;
    cursor: pointer;
    }
  .controls-items .left .time-cell {
    color: #fff;
    font-size: 16px;
  }
  .controls-items .left .total-time {
    color: #B3B3B3;
  }
  .controls-items .right .iconfont {
    font-size: 28px;
  }
  .controls-items .right {
    z-index: 5;
    height: 32px;
    font-size: 24px;
    padding: 22px 30px 22px 30px;
  }    
  .controls-items .right .tool-item {
    width: 32px;
    display: inline-block;
    vertical-align: middle;
  }
  
  .controls-items .right .tool-item + .tool-item{
    margin-left: 20px;
  }
 
</style>
