<template>
    <view>
        <view class="search-box">
            <!-- 使用自定义搜索组件 -->
            <my-search @click="gotoSearch"></my-search>
        </view>
        
        <!-- 轮播图区域 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
            <!-- 循环渲染轮播图的item项 -->
            <swiper-item v-for="(item, i) in swiperList" :key="i">
                <navigator class="swiper-item" :url="'/subpkg/goods_detail/'">
                    <!-- 动态绑定图片的src属性 -->
                    <image :src="item.image_src"></image>
                </navigator>
            </swiper-item>
        </swiper>
        
        <!-- 商品列表 -->
        <view class="scroll-view-container">
          <!-- 左侧的滚动视图区域 -->
          <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
            <block v-for="(item, i) in cateList" :key="i">
                 <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">{{item.cate.cate_name}}</view>
            </block>
          </scroll-view>
          <!-- 右侧的滚动视图区域 -->
          <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
            <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
                <view class="cate-lv2-title">--- {{item2.cate.cate_name}} ---</view>
                <!-- 三级分类 Item 项 -->
                <view class="cate-lv3-item" v-for="(good, gid) in item2.children" :key="gid" @click="gotoGoodsList(good)">
                  <view class="thumb">
                    <image :src="good.image_src"></image>
                  </view>
                  <view class="info">
                    <text class="good-name">{{good.sku_name}}</text>
                    <text class="good-brief">{{good.sku_brief}}</text>
                    <text class="good-price">￥：{{good.min_price}}</text>
                  </view>
                </view>
            </view>
          </scroll-view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return{
                swiperList: [],
                cateList: [],
                cateLevel2: [],
                wh: 0,
                active: 0,
                scrollTop: 0
                //navList: [],
            };
        },
        
        onLoad() {
            this.getSwiperList()
            this.getCateList()
            // 获取当前系统的信息
            const sysInfo = uni.getSystemInfoSync()
            // 为wh窗口可用高度动态赋值
            this.wh = sysInfo.windowHeight
            // TODO: 这部分留待以后考虑是否添加 到店取货、送货上门
            //this.getNavList()
        },
        
        methods: {
            async getSwiperList() {
                const { data: res } = await uni.$http.get('/api/swiperdata')
                if (res.status !== 200) {return uni.$showMsg()}
                this.swiperList = res.message
            },
            
            async getCateList() {
                let {data: res} = await uni.$http.get('/api/catelist')
                if (res.status !== 200) {return uni.$showMsg('分类信息无法加载！')}
                res = res.message
                this.cateList = res.catelists
                this.cateLevel2 = res.catelists[0].children
            },
            
            gotoGoodsList(gid) {
                uni.navigateTo({
                    url:'/subpkg/goods_list/goods_list?cid=' + good.sku_id
                })
            },
            
            
            activeChanged(i) {
                this.active = i
                // 为二级分类列表重新赋值
                this.cateLevel2 = this.cateList[i].children
                this.scrollTop = this.scrollTop ? 0 : 1
            },
            
            gotoSearch() {
                uni.navigateTo({
                    url: '/subpkg/search/search'
                })
            }
            
            /*    
            async getNavList() {
                const {data: res} = await uni.$http.get('/api/catitems')
                if (res.status !== 200) return uni.$showMsg()
                this.navList = res.message
            }
            */
        },

    }
</script>

<style lang="scss">
    
    .search-box {
        // "吸顶"
        position: sticky;
        // "吸顶位置"
        top: 0;
        // 提高层级，防止被轮播图覆盖
        z-index: 999;
    }
    
    
    swiper {
        height: 330rpx;
        
        .swiper-item,
        image {
            width: 100%;
            height: 100%;
        }
    }
    
    .scroll-view-container {
        display: flex;
        
        .left-scroll-view {
            width: 120px;
            
            .left-scroll-view-item {
                line-height: 60px;
                background-color: #f7f7f7;
                text-align: center;
                font-size: 12px;
                
                // 激活项的样式
                &.active {
                    background-color: #ffffff;
                    position: relative;
                
                    // 渲染激活项左侧的红色指示边线
                    &::before {
                      content: ' ';
                      display: block;
                      width: 3px;
                      height: 30px;
                      background-color: #c00000;
                      position: absolute;
                      left: 0;
                      top: 50%;
                      transform: translateY(-50%);
                    }
                }
            }
        }
    }

    .cate-lv2-title {
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        padding: 15px 0;
    }
    
    .cate-lv3-item {
      display: flex;
      padding: 15rpx;
      border: 1rpx solid #efefef;
      border-radius: 8rpx;
      margin: 15rpx;
      box-shadow: 1rpx 1rpx 15rpx #ddd;
      
      .thumb image {
        width: 250rpx;
        height: 250rpx;
        display: block;
        margin-right: 15rpx;
      }
      
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 24rpx;
      }
      
      .shop-title {
        font-weight: bold;
      }
    }
    
    
    
</style>
