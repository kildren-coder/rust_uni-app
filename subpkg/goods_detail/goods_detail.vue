<template>
    <view v-if="goods_info.good.sku_name">
        <!-- 轮播图区域-->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
            <swiper-item v-for="(item, i) in goods_info.imgs" :key="i">
                <image :src="item.img_src" @click="preview(i)"></image>
            </swiper-item>
        </swiper>
        
        <!-- 商品信息 -->
        <view class="goods">
            <!-- 商品信息区域 -->
            <view class="goods-info-box">
              <!-- 商品价格 -->
              <view class="price">￥{{goods_info.good.min_price}}起</view>
              <!-- 信息主体区域 -->
              <view class="goods-info-body">
                <!-- 商品名称 -->
                <view class="goods-name">{{goods_info.good.sku_name}} 一堆那就看你华师大可能发生的农夫i那就</view>
                <!-- 收藏 TODO: 待实现功能 -->
                <view class="favi">
                  <uni-icons type="star" size="18" color="gray"></uni-icons>
                  <text>收藏</text>
                </view>
              </view>
              
            </view>
            
            <!-- 商品详情信息 TODO；待实现 -->
            <view class="goods-intro">
                <view class="intro-title">商品介绍</view>
                <view class="goods-intro-text" v-for="(value, key) in goods_intro" :key="key">
                    <text class="intro-prop">{{key}}</text>
                    <text class="intro-content">{{value}}</text>
                </view>
            </view>
        </view>
    
        <!-- 商品导航组件 -->
        <view class="goods_nav">
          <!-- fill 控制右侧按钮的样式 -->
          <!-- options 左侧按钮的配置项 -->
          <!-- buttonGroup 右侧按钮的配置项 -->
          <!-- click 左侧按钮的点击事件处理函数 -->
          <!-- buttonClick 右侧按钮的点击事件处理函数 -->
          <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
        </view>

    </view>
</template>

<script>
    export default {
        data() {
            return {
                goods_info: {},
                goods_intro: {},
                
                // 左侧按钮组的配置对象
                    options: [{
                      icon: 'shop',
                      text: '店铺'
                    }, {
                      icon: 'cart',
                      text: '购物车',
                      info: 2
                    }],
                    // 右侧按钮组的配置对象
                    buttonGroup: [{
                        text: '加入购物车',
                        backgroundColor: '#ff0000',
                        color: '#fff'
                      }
                    ]
                
            };
        },
        
        onLoad(options) {
            const goods_id = options.goods_id
            this.getGoodsDetail(goods_id)
        },
        
        methods: {
            async getGoodsDetail(goods_id) {
                const { data: res } = await uni.$http.get('/api/good/detail/' + goods_id)
                if (res.status !== 200) return uni.$showMsg()
                // 为 data 中的数据赋值
                this.goods_info = res.message
                this.goods_intro = this.goods_info.intro
            },
            
            async getGoodsIntro() {
                if (this.goods_info.good.sku_brief !== '') {
                    let intro_map = new Map();
                    let brief = this.goods_info.good.sku_brief.split('|')
                    brief.forEach(item => {
                        let kw = item.trim().split(':')
                        intro_map.set(kw[0], kw[1])
                    })
                    
                    console.log(intro_map)
                    this.goods_intro = new Map(intro_map)
                }
                this.$forceUpdate()
                console.log("FINISH")
            },
            
            preview(i) {
                uni.previewImage({
                    current: i,
                    urls: this.goods_info.imgs
                })
            },
            
            onClick(e) {
                if (e.content.text === '购物车') {
                    uni.switchTab({
                        url: '/pages/cart/cart'
                    })
                } else if (e.content.text === '店铺') {
                    uni.switchTab({
                        url: '/pages/home/home'
                    })
                }
                
                
            }
        }
    }
</script>

<style lang="scss">
    swiper {
      height: 750rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .goods {
        background-color: #efefef;
        padding-bottom: 200rpx;
    }
    
    // 商品信息区域的样式
    .goods-info-box {
      background-color: white;
      padding: 10px;
      padding-right: 0;
      border: 5px solid #efefef;
      border-radius: 15px 15px;
    
      .price {
        color: #c00000;
        font-size: 18px;
        margin: 10px 0;
      }
    
      .goods-info-body {
        display: flex;
        justify-content: space-between;
    
        .goods-name {
          font-size: 13px;
          padding-right: 10px;
        }
        // 收藏区域
        .favi {
          width: 120px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-left: 1px solid #efefef;
          color: gray;
        }
      }
    }
    
    .goods-intro {
        background-color: white;
        border: 5px solid #efefef;
        border-radius: 10px 10px;
        padding: 5px, 15px;

        .intro-title {
          font-size: 20px;
          font-weight: 600;
          margin-left: 10px;
          margin-bottom: 10px;
          margin-top: 5px;
        }

        .goods-intro-text {
          display: flex;
          height: 55rpx;
          
          .intro-prop {
              width: 175rpx;
              font-size: 13px;
              margin-left: 10px;
              color: #767676;
          }
          
          .intro-content {
              font-size: 13px;
              margin-left: 10px;
          }
        }
    }
    
    .goods-detail-container {
      // 给页面外层的容器，添加 50px 的内padding，
      // 防止页面内容被底部的商品导航组件遮盖
      padding-bottom: 50px;
    }
    
    .goods_nav {
      // 为商品导航组件添加固定定位
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }

    
</style>
