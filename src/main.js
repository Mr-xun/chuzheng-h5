import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap';
import FastClick from 'fastclick';
import api from "@/api";

import 'amfe-flexible/index.js'
import "normalize.css";
import '@/styles/global.css';
import '@/styles/index.scss';
import './plugins/vant';
Vue.config.productionTip = false
FastClick.attach(document.body);
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'f012e701b8e4079310a99bd7d4ffbeb2',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
