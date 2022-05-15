<template>
    <view>
        <uni-forms ref="userForm" :modelValue="userFormData" :label-position="top">
            <uni-forms-item label="客户姓名" required>
                <uni-easyinput v-model="userFormData.username" placeholder="请输入客户姓名" />
            </uni-forms-item>
            <uni-forms-item label="公司名称" required>
                <uni-easyinput v-model="userFormData.company" placeholder="请输入公司名称" />
            </uni-forms-item>
            <uni-forms-item label="电话" required>
                <uni-easyinput v-model="baseFormData.phone" placeholder="请输入电话" />
            </uni-forms-item>
        </uni-forms>
        <button type="primary" @click="submit('userForm')">提交</button>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                userFormData: {
                    user_name: '',
                    company: '',
                    phone: '',
                },
            };
        },
        
        methods: {
            submit(ref) {
                this.$refs[ref].validate().then(res => {
                    console.log('success', res);
                    uni.showToast({
                        title: `创建成功`
                    })
                    
                    uni.$http.
                    
                }).catch(err => {
                    console.log('err', err);
                })
            },
        }
    }
</script>

<style lang="scss">

</style>
