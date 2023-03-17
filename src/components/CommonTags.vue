<template>
    <div class="tabs">
        <el-tag size="mini" v-for="(item, index) in tabsList" :key="item.label" :closable="item.name !== 'home'"
            :effect="$route.name === item.name ? 'dark' : 'plain'" @click="changeMenu(item)"
            @close="handleClose(item, index)">
            {{ item.label }}
        </el-tag>


    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapState({
            tabsList: state => state.tab.tabsList
        })
    },
    methods: {
        ...mapMutations('tab', ['selectMenu', 'clickTag', 'closeTag', 'updateActiveIndex', 'updateTabsList']),
        // 点击tag跳转的功能
        changeMenu(item) {
            // 参数path为即将跳转的路径，而this.$route.path为当前页面的路径
            // 当前页面的路由与跳转的路由不一致才允许跳转
            if (this.$route.path !== item.path && !(this.$route.path === '/home' && item.path === '/')) {
                this.$router.push({ name: item.name })
                this.updateActiveIndex(this.$route.name)
                // console.log(this.$route.name);
            }
        },
        // 点击tag删除的功能
        handleClose(item, index) {
            this.closeTag(item)
            const length = this.tabsList.length
            // 删除之后的跳转逻辑(当前的不会跳转，只有别的才会跳转)
            if (item.name !== this.$route.name) return
            // 删除最后一项的跳转逻辑
            if (index === length) {
                this.updateActiveIndex(this.tabsList[index - 1].name)
                this.$router.push({
                    name: this.tabsList[index - 1].name
                })


            } else {
                this.updateActiveIndex(this.tabsList[index].name)
                // 删除中间项的跳转逻辑
                this.$router.push({
                    name: this.tabsList[index].name
                })


            }

        },

        // 防止页面刷新，面包屑丢失
        getMatched() {
            if (this.$route.name == "home") {
                this.updateTabsList([{
                    path: '/',
                    name: 'home',
                    label: '首页',
                    icon: 's-home',
                    url: 'Home/Home',
                }])
            } else if (this.$route.name == "singer") {
                this.updateTabsList([{
                    path: '/',
                    name: 'home',
                    label: '首页',
                    icon: 's-home',
                    url: 'Home/Home',
                },
                {
                    path: '/singer',
                    name: 'singer',
                    label: '歌手管理',
                    icon: 's-custom',
                    url: 'SingerManage/SingerManage',
                },])
            } else if (this.$route.name == "list") {
                this.updateTabsList([{
                    path: '/',
                    name: 'home',
                    label: '首页',
                    icon: 's-home',
                    url: 'Home/Home',
                },
                {
                    path: '/singer',
                    name: 'singer',
                    label: '歌手管理',
                    icon: 's-custom',
                    url: 'SingerManage/SingerManage',
                }, {
                    path: '/list',
                    name: 'list',
                    label: '歌单管理',
                    icon: 's-order',
                    url: 'ListManage/ListManage',
                }])
            } else if (this.$route.name == "song") {
                this.updateTabsList([{
                    path: '/',
                    name: 'home',
                    label: '首页',
                    icon: 's-home',
                    url: 'Home/Home',
                },
                {
                    path: '/singer',
                    name: 'singer',
                    label: '歌手管理',
                    icon: 's-custom',
                    url: 'SingerManage/SingerManage',
                }, {
                    path: '/list',
                    name: 'list',
                    label: '歌单管理',
                    icon: 's-order',
                    url: 'ListManage/ListManage',
                },
                {
                    path: '/song',
                    name: 'song',
                    label: '歌曲管理',
                    icon: 's-unfold',
                    url: 'SongManage/SongManage',
                }])
            } else if (this.$route.name == "user") {
                this.updateTabsList([{
                    path: '/',
                    name: 'home',
                    label: '首页',
                    icon: 's-home',
                    url: 'Home/Home',
                },
                {
                    path: '/singer',
                    name: 'singer',
                    label: '歌手管理',
                    icon: 's-custom',
                    url: 'SingerManage/SingerManage',
                }, {
                    path: '/list',
                    name: 'list',
                    label: '歌单管理',
                    icon: 's-order',
                    url: 'ListManage/ListManage',
                },
                {
                    path: '/song',
                    name: 'song',
                    label: '歌曲管理',
                    icon: 's-unfold',
                    url: 'SongManage/SongManage',
                }, {
                    path: '/user',
                    name: 'user',
                    label: '用户管理',
                    icon: 'user-solid',
                    url: 'UserManage/UserManage',
                }])
            }
        },
    },
    created() {
        this.getMatched()
    },

}
</script>

<style lang="less" scoped>
.tabs {
    padding: 20px;

    .el-tag {
        margin-right: 15px;
        cursor: pointer;
    }
}
</style>