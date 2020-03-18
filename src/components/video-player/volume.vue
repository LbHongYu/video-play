<template>
  <tool-popup>
    <template v-slot:tool>
      <i class="iconfont icon-volume"></i>
    </template>

    <template v-slot:popup>
      <div class="volume-range-wrapper">
        <div class="value-num">{{~~($props.value * 100)}}</div>
        <div class="range-wrapper" 
          ref="RangeWrapperRef"
          @mousemove="moveByTrack" 
          @mouseleave="mouseleaveTrack"
          @mouseup="mouseupFromIcon"
        >
          <div class="range">
            <div class="value-track" @click="clickTrack">
              <div class="track" 
                :style="trackVolumeHeightStr" 
              ></div>
              <div class="icon" ref="trackIconRef" 
                :class="{'active': bCanChangeVolume}"
                @mousedown="mousedownOnIcon"
                @mouseup="mouseupFromIcon"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </tool-popup>
</template>
<script>
import toolPopup from './tool-popup.vue';

export default {
  name: 'volume',

  props: {
    value: {
      type: Number,
      validator (val) {
        return val <= 1 && val >= 0;
      },
      default: 0
    }
    // '$props.value': {
    //   handler () {

    //   },
    //   deep: true,
    //   immediate: true
    // }
  },

  computed: {
    trackVolumeHeightStr () {
      return `height: ${~~(this.$props.value * 100)}%`
    }
  },

  data () {
    return {
      bCanChangeVolume: false,
      // volumeValue: '50'
    };
  },

  components: {
    toolPopup
  },
  methods: {
    mousedownOnIcon () {
      this.bCanChangeVolume = true;
    },
    clickTrack (evt) {
      console.log(evt);
    },

    mouseleaveTrack () {
      this.bCanChangeVolume = false;
    }, 

    mouseupFromIcon () {
      this.bCanChangeVolume = false;
    },

    moveByTrack (evt) {
      if (!this.bCanChangeVolume) return;

      let res = 0;
      if (evt.target === this.$refs.trackIconRef) {
        res = +(this.$props.value * 100) + 10 - evt.offsetY
      } else {
        res = 100 - evt.offsetY;
      }

      if (res > 100) res = 100;
      if (res < 0) res = 0;

      this.$emit('input', res / 100);
    } 
  }
}
</script>
<style scoped>
  .icon-volume {
    font-size: 28px;
    color: #fff;  
    user-select: none;  
  }

  .volume-range-wrapper {
    width: 40px;
    height: 140px;
    padding: 5px;
    background: rgba(0,0,0,.8);
  }

  .volume-range-wrapper .range-wrapper {
    height: calc(100% - 40px);
  }
  
  .volume-range-wrapper .value-num{
    font-size: 16px;
    color: #fff;    
  }

  .volume-range-wrapper .range {
    width: 4px;
    height: 100%;
    margin: 0 auto;
    margin-top: 10px;
    background: #b3b3b3;
  }

  .volume-range-wrapper .value-track {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;  
    height: 100%;
    width: 4px;
  }
  .value-track .track {
    height: 20%;
    background: rgba(244,92,72,1);
    width: 100%;  
  }

  .value-track .icon.active {
    width: 12px;
    height: 12px;
  }
  .value-track .icon {
    cursor: pointer;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;   
    user-select: none;
  } 
  
</style>>