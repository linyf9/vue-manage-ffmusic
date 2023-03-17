<template>
    <div class="header-container">
        <div class="l-content">
            <el-button style="margin-right: 20px;" icon="el-icon-menu" size="mini" @click="updateIsCollapse"></el-button>
            <!-- 面包屑 -->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) in tabsList" :key="item.path"
                    :to="($route.path !== item.path && !($route.path === '/home' && item.path === '/')) && { path: item.path }"
                    @click.native="changAside(item, index)" ref="breadcrumbItem">{{
                        item.label
                    }}</el-breadcrumb-item>
                <!-- <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item> -->
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <!--  -->
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img class="user" src="../assets/images/admin.webp">
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="outLogin">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { removeToken } from '@/utils/auth';
export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapState('tab', ['tabsList']),
        ...mapState('user', ['userInfo']),
        // 或者
        // ...mapState({
        //     tabsList: state=>state.tab.tabsList
        // })

    },
    methods: {
        ...mapMutations('tab', ['updateIsCollapse', 'updateActiveIndex']),
        outLogin() {
            // 退出登录，应该清空token，和用户信息，并跳转到登录页面
            removeToken()
            this.$router.push({ name: 'login' })

        },
        changAside(item, index) {
            for (let i = 0; i < this.$refs.breadcrumbItem.length; i++) {
                // this.$refs.breadcrumbItem[i].$refs.link.style.color = '#666666'
            }
            // this.$refs.breadcrumbItem[index].$refs.link.style.color = '#ffffff'
            this.updateActiveIndex(item.name)
        }
    }
}
</script>

<style lang="less" scoped>
.header-container {

    height: 60px;
    background-color: #2d3e48;
    padding: 0 20px;
    display: flex;
    justify-content: space-between; //水平俩端对齐
    align-items: center; //垂直居中
    // border-bottom: none;

}

.l-content {
    display: flex;
    align-items: center;

    /deep/.el-breadcrumb__item {
        .el-breadcrumb__inner {
            font-weight: normal;

            &.is-link {
                color: #666;
            }


        }

        &:last-child {
            .el-breadcrumb__inner {
                color: #ffffff;
            }
        }
    }

    .text {
        font-size: 14px;
        color: #fff;
        margin-left: 20px;
    }
}

.r-content {
    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}

/deep/.el-dropdown {
    text-align: center !important;
    // line-height: 44px;
}
</style>