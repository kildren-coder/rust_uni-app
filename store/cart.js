export default {
    namespaced: true,
    
    state: () => ({
        // cart 存储每个商品的信息对象
        // id、名称、价格、数量、规格信息、small_logo
        cart: [],
    }),
    
    // 模块的  mutations 方法
    mutations: {
        addToCart(state, goods) {
            
            const findResult = state.cart.find((x) => 
                x.goods_id === goods.goods_id && 
                x.spec_id === goods.spec_id)
                
                
            if (!findResult) {
                state.cart.push(goods)
            } else {
                findResult.goods_count += goods.goods_count
            }
            
            console.log(state.cart)
        },
        
        updateGoodsState(state, goods) {
            console.log(goods)            
            const findResult = state.cart.find(x => x.goods_id === goods.goods_id && x.spec_id === goods.spec_id)
            console.log(findResult)
        
            // 有对应的商品信息对象
            if (findResult) {
                // 更新对应商品的勾选状态
                findResult.goods_state = goods.goods_state
                console.log(findResult.goods_state)
                // 持久化存储到本地
                this.commit('m_cart/saveToStorage')
            }
        },
        
        // 更新购物车中商品的数量
        updateGoodsCount(state, goods) {
          // 根据 goods_id 查询购物车中对应商品的信息对象
          const findResult = state.cart.find(x => x.goods_id === goods.goods_id && x.spec_id === goods.spec_id)
        
          if(findResult) {
            // 更新对应商品的数量
            findResult.goods_count = goods.goods_count
            // 持久化存储到本地
            this.commit('m_cart/saveToStorage')
          }
        },
        
        // 根据 Id 从购物车中删除对应的商品信息
        removeGoodsByIds(state, goods) {
          // 调用数组的 filter 方法进行过滤
          state.cart = state.cart.filter(x => x.goods_id !== goods.goods_id && x.spec_id !== goods.spec_id)
          // 持久化存储到本地
          this.commit('m_cart/saveToStorage')
        },
        
        // 更新所有商品的勾选状态
        updateAllGoodsState(state, newState) {
          // 循环更新购物车中每件商品的勾选状态
          state.cart.forEach(x => x.goods_state = newState)
          // 持久化存储到本地
          this.commit('m_cart/saveToStorage')
        },
        
        // 将购物车中的数据持久化存储到本地
        saveToStorage(state) {
           uni.setStorageSync('cart', JSON.stringify(state.cart))
        }

    },
    
    // 模块的 getters 属性
    getters: {
        total(state) {
            let c = 0
            state.cart.forEach(goods => c += goods.goods_count)
            return c
        },
        
        // 勾选的商品的总数量
        checkedCount(state) {
            // 先使用 filter 方法，从购物车中过滤器已勾选的商品
            // 再使用 reduce 方法，将已勾选的商品总数量进行累加
            // reduce() 的返回值就是已勾选的商品的总数量
            return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
        },
        
        // 已勾选的商品的总价
        checkedGoodsAmount(state) {
          // 先使用 filter 方法，从购物车中过滤器已勾选的商品
          // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
          // reduce() 的返回值就是已勾选的商品的总价
          // 最后调用 toFixed(2) 方法，保留两位小数
          return state.cart.filter(x => x.goods_state)
                           .reduce((total, item) => total += item.goods_count * item.price, 0)
                           .toFixed(2)
        }

    },
}