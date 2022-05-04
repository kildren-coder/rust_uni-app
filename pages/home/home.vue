<template>
    <view>
        <!-- 轮播图区域 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
            <!-- 循环渲染轮播图的item项 -->
            <swiper-item v-for="(item, i) in swiperList" :key="i">
                <navigator class="swiper-item" :url="'/subpkg/goods_detail/'">
                    <!-- 动态绑定图片的src属性 -->
                    <image :src="item.image_src"></image>
                </navigator>
            </swiper-item>
        </swiper>>
    </view>
</template>

<script>
    export default {
        data() {
            return{
                swiperList: [],
                //navList: [],
            };
        },
        
        onLoad() {
            this.getSwiperList()
            // TODO: 这部分留待以后考虑是否添加 到店取货、送货上门
            //this.getNavList()
        },
        
        methods: {
            async getSwiperList() {
                const { data: res } = await uni.$http.get('/api/swiperdata')
                if (res.status !== 200) {return uni.$showMsg()}
                this.swiperList = res.message
                },
            
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
    swiper {
        height: 330rpx;
        
        .swiper-item,
        image {
            width: 100%;
            height: 100%;
        }
    }
</style>
