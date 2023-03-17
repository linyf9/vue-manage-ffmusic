<template>
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
        :collapse="isCollapse" background-color="#232a47" text-color="#fff" active-text-color="#79b4c4">
        <h3>{{ isCollapse ? '后台' : 'ffmusic后台管理系统' }}</h3>
        <el-menu-item @click="clickMenu(item)" v-for="item in menuData" :key="item.name" :index="item.name">
            <i :class="`el-icon-${item.icon}`"></i>
            <span slot="title">{{ item.label }}</span>
        </el-menu-item>
        <!-- <el-submenu v-for="item in hasChildren" :key="item.label" :index="item.label">
            <template slot="title">
                <i :class="`el-icon-${item.icon}`"></i>
                <span slot="title">{{ item.label }}</span>
            </template>
            <el-menu-item-group v-for="subItem in item.children" :key="subItem.path">
                <el-menu-item :index="subItem.path">{{ subItem.label }}</el-menu-item>
            </el-menu-item-group>

        </el-submenu> -->
    </el-menu>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {
            // activeIndex: 'home',
            // menuData: [
            //     {
            //         path: '/',
            //         name: 'home',
            //         label: '首页',
            //         icon: 's-home',
            //         url: 'Home/Home',
            //     },
            //     {
            //         path: '/singer',
            //         name: 'singer',
            //         label: '歌手管理',
            //         icon: 's-custom',
            //         url: 'SingerManage/SingerManage',
            //     },
            //     {
            //         path: '/list',
            //         name: 'list',
            //         label: '歌单管理',
            //         icon: 's-order',
            //         url: 'ListManage/ListManage',
            //     },
            //     {
            //         path: '/song',
            //         name: 'song',
            //         label: '歌曲管理',
            //         icon: 's-unfold',
            //         url: 'SongManage/SongManage',
            //     },
            //     {
            //         path: '/user',
            //         name: 'user',
            //         label: '用户管理',
            //         icon: 'user-solid',
            //         url: 'UserManage/UserManage',
            //     },
            // {
            //     label: "其他",
            //     icon: "location",
            //     children: [
            //         {
            //             path: '/page1',
            //             name: 'page1',
            //             label: '页面1',
            //             icon: 'message-solid',
            //             uerl: 'Other/PageOne'
            //         },
            //         {
            //             path: '/page2',
            //             name: 'page2',
            //             label: '页面2',
            //             icon: 'setting',
            //             uerl: 'Other/PageTwo'
            //         },
            //     ]
            // }
            // ]
        };
    },
    computed: {
        // 没有子菜单
        // noChildren() {
        //     return this.menuData.filter(item => !item.children)
        // },
        // 有子菜单
        // hasChildren() {
        //     return this.menuData.filter(item => item.children)
        // },
        ...mapState('tab', ['isCollapse', 'menuData', 'activeIndex'])
    },
    methods: {
        ...mapMutations('tab', ['selectMenu', 'updateActiveIndex']),
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        // 点击菜单进行路由跳转
        clickMenu(item) {
            // 参数path为即将跳转的路径，而this.$route.path为当前页面的路径
            // 当前页面的路由与跳转的路由不一致才允许跳转
            if (this.$route.path !== item.path && !(this.$route.path === '/home' && item.path === '/')) {
                this.$router.push(item.path)
            }
            this.selectMenu(item)
        }
    },
    mounted() {
        this.updateActiveIndex(this.$route.name)
    }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu {
    height: 100vh;
    border-right: none;

    h3 {
        color: #fff;
        text-align: center;
        line-height: 48px;
        font-size: 16px;
        font-weight: 400;
    }
}

.el-menu-item span {
    padding-right: 9px;
}

.el-menu-item:nth-child(1) {
    padding-right: 48px !important;
}

.el-submenu__title span {
    padding-right: 36px;
}
</style>