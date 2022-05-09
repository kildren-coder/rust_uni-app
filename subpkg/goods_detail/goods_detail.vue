<template>
    <!-- 弹窗 -->
    <page-meta :page-style="'overflow:'+(show?'hidden':'visible')"></page-meta>
    	<view class="container">
    		<!-- 普通弹窗 -->
    		<uni-popup ref="popup" type="buttom">
                <view class="pop-container">
                    <view class="pop-top">
                        <image :src="pop_image_src[0].img_src" @click="popPreview()"></image>
                        <view class="pop-good">
                            <text class="pop-good-name">{{goods_info.good.sku_name}}</text>
                            <text class="pop-good-price" v-if="spec_price != 0">￥{{spec_price}}</text>
                        </view>
                    </view>
                    <view class="pop-prop">
                        <view class="pop-num">
                            <view class="pop-num-text">数量</view>
                            <uni-number-box class="numbox" :min="2" :value="good_num" @change="changeNum" />
                        </view>
                        <!-- 第一级属性 -->
                        <view class="prop">
                            <view class="pop-prop-name" >{{prop1[0].prop_name}}</view>
                            <view class="pop-prop-list">
                                <uni-tag :text="item.spec_name" v-for="(item, i) in prop1.slice(1, prop1.length)" :key="i" @click="select(item)"></uni-tag>
                            </view>
                        </view>
                        <!-- 第二级属性 -->
                        <view class="prop" v-if="prop2.length != 0">
                            <view class="pop-prop-name" >{{prop2[0].prop_name}}</view>
                            <view class="pop-prop-list">
                                <uni-tag :text="item.spec_name" v-for="(item, i) in prop2_visit" :key="i" @click="select(item)"></uni-tag>
                            </view>
                        </view>
                        <view class="prop" v-if="prop3.length != 0">
                            <view class="pop-prop-name" >{{prop3[0].prop_name}}</view>
                            <view class="pop-prop-list">
                                <uni-tag :text="item.spec_name" v-for="(item, i) in prop3_visit" :key="i" @click="select(item)"></uni-tag>
                            </view>
                        </view>
                    </view>
                </view>
                
                <view class="goods_nav">
                  <!-- fill 控制右侧按钮的样式 -->
                  <!-- options 左侧按钮的配置项 -->
                  <!-- buttonGroup 右侧按钮的配置项 -->
                  <!-- click 左侧按钮的点击事件处理函数 -->
                  <!-- buttonClick 右侧按钮的点击事件处理函数 -->
                  <uni-goods-nav :fill="true" :options="[]" :buttonGroup="buttonGroup" @buttonClick="popButtonClick" />
                </view>
                
                
    		</uni-popup>
    	</view>
    
    
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
                <view class="goods-name">{{goods_info.good.sku_name}}</view>
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
    import {mapState} from 'vuex'
    
    export default {
        data() {
            return {
                goods_info: {},
                goods_intro: {},
                show: false,
                test: {},
                pop_image_src: {},
                goods_specs: {},
                prop1: [],
                prop2: [],
                prop3: [],
                active1: {},
                active2: {},
                active3: {},
                // 规格有关信息的map
                spec_info: {},
                
                spec_price: 0,
                spec_img: '',
                good_num: 1,
                
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
                    ],
                    
                    pop_buttonGroup: [{
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
                this.goods_specs = res.message.specs
                this.goods_intro = this.goods_info.intro
                this.pop_image_src = this.goods_info.imgs
                
                this.active1 = 0
                this.active2 = 0
                this.active3 = 0
                this.getPropInfo()
                this.getSpecInfo()
                console.log(this.spec_info)
                console.log("123:" +  this.prop2_visit.length)
            },
            
            getPropInfo() {
                if (this.goods_info.good.prop1_id != null) {
                    this.prop1 = this.goods_specs.filter((item) => {
                        return item.prop_id == this.goods_info.good.prop1_id
                    })
                    this.active1 = this.prop1[1].spec_id
                }
                
                if (this.goods_info.good.prop2_id != null) {
                    this.prop2 = this.goods_specs.filter((item) => {
                        return item.prop_id == this.goods_info.good.prop2_id
                    })
                    this.active2 = this.prop2[1].spec_id
                }
                
                if (this.goods_info.good.prop3_id != null) {
                    this.prop3 = this.goods_specs.filter((item) => {
                        return item.prop_id == this.goods_info.good.prop3_id
                    })
                    this.active3 = this.prop3[1].spec_id
                }
                
            },
            
            getSpecInfo() {
                let spec_map = new Map()
                
                this.goods_info.specs_info.forEach(item => {
                    console.log(item)
                    spec_map.set(item.prop_spec_id, {img_src: item.img_src, price: item.price})
                })
                this.$set(this, 'spec_info', spec_map)
            },
            
            preview(i) {
                uni.previewImage({
                    current: i,
                    urls: this.goods_info.imgs.map(x => x.img_src)
                })
            },
            
            popPreview() {
                uni.previewImage({
                    urls: this.pop_image_src.map(x => x)
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
            },
            
            open() {
                this.$refs.popup.open('bottom')
                this.changePriceAndImg()
            },
            
            buttonClick(e) {
                this.open()
            },
            
            popButtonClick(e) {
                //TODO: 添加到购物车
            },
            
            changePriceAndImg() {
                let tmpId = this.getSpecPropId().join("1").slice(1)
                this.spec_price = this.spec_info.get(tmpId).price
                // TODO: 增加图片更改功能
                // spec_img
            },
            
            select(item) {
                if (item.prop_id == this.goods_info.good.prop1_id) {
                    this.active1 = item.spec_id
                    this.changeActive2()
                    this.changeActive3()
                } else if (item.prop_id == this.goods_info.good.prop2_id) {
                    this.active2 = item.spec_id
                    this.changeActive3()
                } else {
                    this.active3 = item.spec_id
                }
                
                // 更改图片和价格
                this.changePriceAndImg()
            },
            
            changeNum(value) {
                this.good_num = value
                console.log(this.good_num)
            },
            
            getSpecPropId() {
                let spec_prop_id = [1]
                if (this.active1 != 0) {
                    spec_prop_id.push(this.prop1[0].prop_id)
                    spec_prop_id.push(this.active1)
                }
                
                if (this.active2 != 0) {
                    spec_prop_id.push(this.prop2[0].prop_id)
                    spec_prop_id.push(this.active2)
                }
                
                if (this.active3 != 0) {
                    spec_prop_id.push(this.prop3[0].prop_id)
                    spec_prop_id.push(this.active3)
                }
                
                return spec_prop_id
            },
            
            // 如果prop2_visit中仍包含当前的active1，就没必要改变，否则就要改变active2
            changeActive2() {
                console.log("active1: " + this.active1)
                console.log("active2: " + this.active2)                
                console.log(this.prop2_visit)
                
                if (this.prop2 == 0 || this.prop2_visit.length == 0) {
                    this.active2 = 0
                } else if (this.prop2_visit.findIndex(
                    item => item.spec_id == this.active2) !== 0) 
                {
                    this.active2 = this.prop2_visit[0].spec_id
                }
                
                console.log(this.active2)
            },
            
            changeActive3() {
                if (this.prop3 == 0 || this.prop3_visit.length == 0) {
                    this.active3 = 0
                } else if (this.prop3_visit().findIndex(
                    item => item.spec_id == this.active3) !== 0) 
                {
                    this.active3 = this.prop3_visit[0].spec_id
                }
            },
            
        },
        
        computed: {
            // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
            // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
            ...mapState('m_cart', ['cart']),
            
            prop2_visit() {
                return this.prop2.slice(1).filter((item) => {
                        // findIndex()返回0，说明存在该数 
                        return item.visible.findIndex(item => item === this.active1) == 0
                })
            },
            
            prop3_visit() {
                return this.prop3.slice(1).filter((item) => {
                        // findIndex()返回0，说明存在该数 
                        return item.visible.findIndex(item => item === this.active2) == 0
                })
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

    
    .pop-container {
        background: white;
        
        
        .pop-top {
            display: flex;
            //height: rpx;
            height: 230rpx;
            padding-bottom: 10rpx;
            
            image {
              //display: flex;
              display: block;
              image-rendering: auto;
              width: 200rpx;
              height: 200rpx;
              //padding: 50rpx;
              margin-left: 15rpx;
              margin-right: 15rpx;
              margin-top: 15rpx;
              border: 2px solid #efefef;
              border-radius: 8px 8px;
            }
            
            
            .pop-good {
                display: flex;
                flex-direction: column;
                
                .pop-good-name {
                    margin-top: 15rpx;
                    font-size: 20px;
                    font-weight: 500;
                    
                }
                
                .pop-good-price {
                    font-size: 25px;
                    font-weight: 600;
                    padding-top: 45px;
                    color: #c00000;
                }
            }
        }
        
        .pop-num {
            display: flex;
            padding-top: 5px;
            padding-bottom: 5px;
            
            .pop-num-text {
                flex: 1;
                justify-content: space-between;
                align-items: center;
                padding-left: 5px;
                font-size: 20px;
            }
            
        }
        
        .pop-prop {
            padding-bottom: 100px;
            
            .prop {
                .pop-prop-name {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-left: 5px;
                    font-size: 20px;
                    border-bottom: 1px solid #efefef;
                }
                
                .pop-prop-list {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 8px;
                    padding-bottom: 10px;
                    padding-left: 5px ;
                 
                    .uni-tag {
                        font-weight: 500;
                        color: black;
                        background-color: #f4f4f4;
                        margin-right: 5px;
                    }
                }
            }
        }
        

    }
    
    /*
    <uni-popup ref="popup" type="buttom">
        <view class="pop-container">
            <image :src="pop_image_src[0].img_src" @click="popPreview()"></image>
            <view class="pop-prop">
                <!-- 第一级属性 -->
                <view class="prop1">
                    <view class="pop-prop1-name" >{{prop1[0].prop_name}}</view>
                    <uni-tag :text="item.spec_name" v-for="(item, i) in prop1.slice(1, prop1.length)" :key="i" @click="select(item)"></uni-tag>
                </view>
                <!-- 第二级属性 -->
                <view class="prop2" v-if="prop2.length != 0">
                    <view class="pop-prop2-name" >{{prop2[0].prop_name}}</view>
                    <view class="pop-prop2-value" v-for="(item, i) in prop2_visit">{{item.spec_name}}</view>
                </view>
                
                <!-- 第三级属性 
                <view class="prop3" v-if="prop3.length != 0">
                    <view class="pop-prop3-name" >{{prop3[0].prop_name}}</view>
                    <view class="pop-prop3-value" v-for="(item, i) in prop3(active2)">{{item.spec_name}}</view>
                </view>
                -->
            </view>
        </view>
    </uni-popup>
    */
</style>
