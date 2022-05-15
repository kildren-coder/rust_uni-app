export default {
  // 开启命名空间
  namespaced: true,

  // state 数据
  state: () => ({
    // 收货地址
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    // 用户的基本信息
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 登录成功之后的 token 字符串
    token: uni.getStorageSync('token') || '',
    // 重定向的 object 对象 {openType:返回方式, from：之前的url地址}
    redirectInfo: null,
    // 用户Id
    user_id: {}
  }),

  // 方法
  mutations: {
      // 更新重定向的信息对象
      updateRedirectInfo(state, info) {
        state.redirectInfo = info
      },
      
    // 更新收货地址
    updateAddress(state, address) {
        state.address = address
        
        // 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
        this.commit('m_user/saveAddressToStorage')
          
    },
    
    // 保存收获地址
    saveAddressToStorage(state) {
        uni.setStorageSync('address', JSON.stringify(state.address))
    },
    
    // 更新用户的基本信息
    updateUserInfo(state, userinfo) {
        state.userinfo = userinfo
        // 通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方法，将 userinfo 对象持久化存储到本地
        this.commit('m_user/saveUserInfoToStorage')
    },
    
    // 更新用户的openid
    updateUserToken(state, token) {
        state.token = token
        this.commit('m_user/saveTokenToStorage')
    },
    
    // 更新用户id
    updateUserid(state, user_id) {
      state.user_id = user_id
      this.commit('m_user/saveUseridToStorage')
    },
    
    // 将用户id持久化存储到本地
    saveUseridToStorage(state) {
        uni.setStorageSync('user_id', state.user_id)
    },
    
    // 将 userinfo 持久化存储到本地
    saveUserInfoToStorage(state) {
        uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    
    // 将token字符串持久化到本地
    saveTokenToStorage(state) {
        uni.setStorageSync('token', state.token)
    }
  },

  // 数据包装器
  getters: {
    // 收货详细地址的计算属性
    addstr(state) {
        if (!state.address.provinceName) return ''

        // 拼接 省，市，区，详细地址 的字符串并返回给用户
        return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
      
  },
}
