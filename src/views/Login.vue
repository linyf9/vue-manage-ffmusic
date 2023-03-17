<template>
    <div>
        <img src="../assets/登录背景图.webp" alt="" class="bigimg">
        <el-form ref="form" label-width="70px" :inline="true" class="login-container" :model="form" :rules="rules">
            <h3 class="login_title">欢迎来到ffmusic后台</h3>
            <el-form-item label="用户名" prop="user_name">
                <el-input v-model="form.user_name" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" @click="submit" style="margin-left: 105px;margin-top: 10px;"
                    type="primary">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
import { mapMutations } from 'vuex'
import moment from 'moment'
import BMap from 'BMap'
export default {
    data() {
        return {
            loading: false,
            form: {
                user_name: 'admin',
                password: '666666'
            },
            rules: {
                user_name: [
                    { required: true, trigger: 'blur', message: '请输入用户名' }
                ],
                password: [
                    { required: true, trigger: 'blur', message: '请输入密码' }
                ]
            }
        }
    },
    computed: {

    },
    methods: {
        ...mapMutations('user', ['SETLOGINTIME', 'SETLOGINADDRESS']),
        // 登录
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$api.user.reqLogin(this.form).then(res => {
                        console.log(res);
                        // 登录成功后，跳转到首页，并把loading设为false，将token存到cookie，还有仓库
                        if (res.code == 200) {
                            setToken(res.token)
                            this.$store.commit('user/SET_TOKEN', res.token)
                            this.$store.commit('user/GETUSERINFO', res.data.userInfo)
                            this.$router.replace('/home')
                            // 登录时间
                            let loginTime = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
                            console.log(loginTime, '888');
                            this.SETLOGINTIME(loginTime)
                            this.loading = false

                        } else {
                            this.$message.error(data.message);
                            this.loading = false
                        }
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 获取登录地点
        city() {    //定义获取城市方法
            const geolocation = new BMap.Geolocation();
            var _this = this
            return new Promise((resolve, resject) => {
                geolocation.getCurrentPosition(function getinfo(position) {
                    console.log(position)
                    let province = position.address.province; //获取省份信息
                    let city = position.address.city; //获取城市信息
                    resolve(province + '-' + city)
                }, function (e) {
                    _this.LocationCity = "定位失败"
                }, { provider: 'baidu' });
            })

        },
    },
    async mounted() {
        let res = await this.city()
        this.SETLOGINADDRESS(res)
        // LocationPCity: "",    //正在定位所在省 + 市
    }
}
</script>
<style lang="less" scoped>
.bigimg {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    // background-color: #000;
}

.login-container {
    width: 350px;
    // border: 1px solid #eaeaea;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    background-color: rgba(87, 170, 204, 0.6);
    border-radius: 15px;
    // box-shadow: 0 0 25px #cac6c6;
    box-sizing: border-box;

    .login_title {
        text-align: center;
        margin-bottom: 40px;
        // color: #505458;
        color: #fff;
    }

    .el-input {
        width: 198px;
    }


}

/deep/.el-form-item__label {
    color: #ffffff;
}
</style>