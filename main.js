
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from './store/store.js'

import { $http } from '@escook/request-miniprogram'
uni.$http = $http
import utils from './utils/utils';
uni.$utils = utils;
// 配置请求根路径
$http.baseUrl = 'http://192.168.203.129:8666'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
  
  if (options.url.indexOf('/my/') !== -1) {
      // 为请求头添加身份认证字段
      options.header = {
          Authorization: store.state.m_user.token,
      }
  }
  
}

// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}

uni.$showMsg = function(title = '数据加载失败!', duration = 1500) {
    uni.showToast({
        title,
        duration,
        icon: 'none',
    })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store,
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif