<template>
    <view class="login-container">
        <!-- 提示登录的图标 -->
        <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
        <!-- 登录按钮 -->
        <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
        <!-- 登录提示 -->
        <view class="tips-text">登录后尽享更多权益</view>
    </view>
</template>

<script>
    // 按需导入 mapMutations 辅助函数
    import { mapMutations, mapState } from 'vuex'
    
    export default {
        name:"my-login",
        data() {
            return {
                code: '',
                
            };
        },
        
        computed: {
            ...mapState('m_user', ['redirectInfo']),
        },
        
        methods: {
            // 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
            ...mapMutations('m_user', ['updateUserInfo', 'updateUserToken', 'updateRedirectInfo', 'updateUserid']),
            
          // 获取微信用户的基本信息
          getUserProfile(e) {
            
            uni.getUserProfile({
                desc: '用于完善用户信息', 
                fail: ()  => {uni.$showMsg('您取消了登录授权')},
                success: async (obj) => {
                    console.log('obg', obj)
                    // 更新用户信息
                    this.updateUserInfo(obj.userInfo)
                    
                    uni.login({
                        provider:'weixin',
                        fail: (errMsg) => {
                          uni.$showMsg('登录失败：' + errMsg)  
                        },
                        success: async (res) => {
                            console.log('res-login', res)
                            if (res.errMsg === 'login:ok') {
                                
                                const query = {
                                    code: res.code,
                                    userInfo: obj.userInfo
                                }
                                
                                const {data: loginResult} = await uni.$http.post('/api/wxlogin', query)
                                console.log("loginResult:", loginResult)
                                if (loginResult.status !== 200) return uni.$showMsg('登录失败！')
                                
                                // 登录成功，更新vues中的token
                                uni.$showMsg('登录成功')
                                this.updateUserToken(loginResult.message.Response[0])
                                this.updateUserid(loginResult.message.Response[1])
                            }
                        }
                    })
                    
                    this.navigateBack()
                }
            })
          },
          
          // 返回登录之前的页面
          navigateBack() {
            // redirectInfo 不为 null，并且导航方式为 switchTab
            if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
              // 调用小程序提供的 uni.switchTab() API 进行页面的导航
              uni.switchTab({
                // 要导航到的页面地址
                url: this.redirectInfo.from,
                // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
                complete: () => {
                  this.updateRedirectInfo(null)
                }
              })
            }
          }

          
          

        }
    }
</script>

<style lang="scss">
    .login-container {
      // 登录盒子的样式
      height: 750rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f8f8f8;
      position: relative;
      overflow: hidden;
    
      // 绘制登录盒子底部的半椭圆造型
      &::after {
        content: ' ';
        display: block;
        position: absolute;
        width: 100%;
        height: 40px;
        left: 0;
        bottom: 0;
        background-color: white;
        border-radius: 100%;
        transform: translateY(50%);
      }
    
      // 登录按钮的样式
      .btn-login {
        width: 90%;
        border-radius: 100px;
        margin: 15px 0;
        background-color: #c00000;
      }
    
      // 按钮下方提示消息的样式
      .tips-text {
        font-size: 12px;
        color: gray;
      }
    }


</style>