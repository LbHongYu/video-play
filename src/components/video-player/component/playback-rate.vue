<template>
  <tool-popup>
    <template v-slot:tool>
      <div class="play-rate-icon">{{rateLabelStr}}</div>
    </template>

    <template v-slot:popup>
      <ul class="rate-list">
        <li 
          v-for="(item, index) in rateList"
          :key="index"
          @click="selectRateItem(item)"
          :class="{active: item.actived}"
        >{{item.value}}</li>
      </ul>
    </template>
  </tool-popup>
</template>
<script>
import toolPopup from './tool-popup.vue';

export default {
  name: 'playbackRate',

  props: {
    value: {
      type: Number,
      default: 1,
      validator (val) {
        return [0.5, 1, 1.25, 1.5, 1.75, 2].includes(val);
      }
    },
    rateLabel: {
      type: String,
      default: '倍速'
    }
  },

  data () {
    return {
      rateList: [
        {
          name: '0.5',
          value: 0.5,
          actived: false
        },{
          name: '1',
          value: 1,
          actived: false
        },{
          name: '1.25',
          value: 1.25,
          actived: false
        },{
          name: '1.5',
          value: 1.5,
          actived: false
        },{
          name: '1.75',
          value: 1.75,
          actived: false
        },{
          name: '2',
          value: 2,
          actived: false
        }
      ]
    };
  },

  watch: {
    '$props.value': {
      handler () {
        this.rateList.every(d => {
          if (d.value === this.$props.value){
            d.actived = true;
            return false;
          }
          return true;
        });        
      }
    }
  },

  computed: {
    rateLabelStr () {
      return this.$props.value === 1 ? '倍速' : this.$props.value + 'x';
    }
  },

  components: {
    toolPopup
  },

  methods: {
    selectRateItem (item) {
      this.rateList.forEach(d => {
        d.actived = false;
      });

      item.actived = true;

      this.$emit('input', item.value);
    }
  }
}
</script>
<style scoped>
.play-rate-icon {
    font-size: 18px;
    width: 36px;
    color: #fff;
    cursor: pointer;
}
.rate-list {
  background: rgba(0,0,0,.8);
  font-size: 16px;
  /* text-align: left; */
  padding: 10px;
}
.rate-list li {
  padding: 6px 2px;
  width: 80px;
  cursor: pointer;
  cursor: pointer;
}
.rate-list li.active,
.rate-list li:hover {
  color: rgba(244,92,72,1);
}
.rate-list li+li {
  margin-top: 5px;
}
</style>