<template>
    <view>
        <view class="goods-list">
          <block v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
            <my-goods :goods="item"></my-goods>
          </block>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                isloading: false,
                queryObj: {
                    // 查询关键词
                    query: '',
                    cid: '',
                    pagenum: 1,
                    pagesize: 10
                },
                
                goodsList: [],
                // 总数，便于分页
                total: 0,
                defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
            };
        },
        
        onLoad(options) {
            this.queryObj.query = options.query || ''
            this.queryObj.cid = options.cid || ''
            this.getTotal()
            this.getGoodsList()
        },
        
        methods: {
            async getTotal() {
                const { data: res } = await uni.$http.get('/api/good/total', { query: this.query })
                if (res.status !== 200) return uni.$showMsg()
                this.total = res.message
            },
            
            async getGoodsList(cb) {
                this.isloading = true
                // 发起请求
                const { data: res } = await uni.$http.get('/api/good/search/list', this.queryObj)
                this.isloading = false
                // 数据一旦请求完毕，就立即按需调用cb回调函数
                cb && cb()
                
                if (res.status !== 200) return uni.$showMsg()
                // 为数据赋值
                this.goodsList = [...this.goodsList, ...res.message.goods]
                this.total = res.message.total
            }
        },
        
        onReachBottom() {
            if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
            if (this.isloading) return
            
            this.queryObj.pagenum += 1
            this.getGoodsList()
        },
        
        onPullDownRefresh() {
            this.queryObj.pagenum = 1
            this.total = this.getTotal()
            this.isloading = false
            this.goodsList = []
        
            // 重新发起请求
            this.getGoodsList(() => uni.stopPullDownRefresh())
        },
        
        gotoDetail(item) {
          uni.navigateTo({
            url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.sku_id
          })
        }
        
    }
</script>

<style lang="scss">
    


</style>
