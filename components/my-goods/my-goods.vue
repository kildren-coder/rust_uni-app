<template>
    <view>
        <view class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left">
            <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
            <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
            <!-- 商品标题 -->
            <view class="goods-name">{{goods.goods_name}}</view>
            <view class="goods-spec" v-for="(value, key) in goods.specs" :key="key">
                <text class="spec-prop">{{key}}:</text>
                <text class="spec-content">{{value}}</text>
            </view>

            <view class="goods-info-box">
              <!-- 商品价格 -->
              <view class="goods-price">￥{{goods.price | tofixed}}</view>
              <!-- 商品数量 -->
              <uni-number-box :min="1" :max="9999" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum"></uni-number-box>
            </view>
          </view>
        </view>
    </view>
</template>

<script>
    export default {
        name:"my-goods",
        props: {
            goods: {
                type: Object,
                default: {}
            },
            
            // 是否展示图片左侧的 radio
            showRadio: {
              type: Boolean,
              // 如果外界没有指定 show-radio 属性的值，则默认不展示 radio 组件
              default: false,
            },
                        
            // 是否展示价格右侧的 NumberBox 组件
            showNum: {
              type: Boolean,
              default: false,
            },
        },
        
        data() {
            return {
                defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
            };
        },
        
        methods: {
            radioClickHandler(e) {
                console.log("good-radio")
                console.log(this.goods)
                console.log(this.goods.goods_id)
                
                this.$emit('radio-change', {
                    goods_id: this.goods.goods_id,
                    spec_id: this.goods.spec_id,
                    goods_state: !this.goods.goods_state
                })
            },
            
            // NumberBox 组件的 change 事件处理函数
            numChangeHandler(val) {
                // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
                this.$emit('num-change', {
                // 商品的 Id
                goods_id: this.goods.goods_id,
                spec_id: this.goods.spec_id,
                // 商品的最新数量
                goods_count: +val
                })
            }
        },
        
        filters: {
            tofixed(num) {
                return Number(num).toFixed(2)
            }
        }
    }
</script>

<style lang="scss">
    .goods-item {
      // 让 goods-item 项占满整个屏幕的宽度
      width: 750rpx;
      // 设置盒模型为 border-box
      box-sizing: border-box;
        
      display: flex;
      padding: 10px 5px;
      border-bottom: 1px solid #f0f0f0;
      background: white;
    
      .goods-item-left {
        margin-right: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    
        .goods-pic {
          width: 100px;
          height: 100px;
          display: block;
        }
      }
    
      .goods-item-right {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
    
        .goods-name {
          font-size: 15px;
        }
        
        .goods-spec {
            font-size: 12px;
        }
        
        .goods-info-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .goods-price {
              font-size: 15px;
              color: #c00000;
            }
        }
      }
    }
</style>