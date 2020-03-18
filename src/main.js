import Vue from 'vue'
import App from './App.vue'

import utils from '@/utils'
import '@/assets/icon/iconfont.css';
import '@/assets/reset.css';

Vue.config.productionTip = false;

if (Vue) {
  Vue.prototype.hy_utils = utils;
}

new Vue({
  render: h => h(App),
}).$mount('#app')
