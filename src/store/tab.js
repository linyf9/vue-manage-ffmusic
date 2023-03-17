// import '' from '../api'

export default {
    namespaced: true,
    state: {
        isCollapse: false, // 控制菜单栏的展开与隐藏
        menuData: [ //左侧菜单
            {
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
            },
            {
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
            },
            {
                path: '/user',
                name: 'user',
                label: '用户管理',
                icon: 'user-solid',
                url: 'UserManage/UserManage',
            }
        ],
        tabsList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 's-home',
                url: 'Home/Home',
            }
        ], //面包屑数据
        activeIndex: 'home',
    },
    mutations: {
        // 修改菜单栏显示与隐藏的状态
        updateIsCollapse(state) {
            state.isCollapse = !state.isCollapse
        },
        // 点击侧边栏，联动顶部导航栏
        selectMenu(state, val) {
            // 先判断是否为首页
            if (val.name !== 'home') {
                const index = state.tabsList.findIndex(item => item.name === val.name)
                // 如果不存在
                if (index === -1) {
                    state.tabsList.push(val)
                }
            }

        },

        // 点击tag，联动顶部导航栏
        clickTag(state, item) {

        },

        // 点击关闭（删除）tabsList 相关的数据
        closeTag(state, item) {
            // 获取传进来的item在数组中的位置索引值
            const index = state.tabsList.findIndex(val => val.name === item.name)
            // 删除这个索引对应的数据
            state.tabsList.splice(index, 1)
        },

        // 刷新时设置tabsList的值
        updateTabsList(state, tabsList) {
            state.tabsList = tabsList
        },

        // 点击
        updateActiveIndex(state, activeIndex) {
            state.activeIndex = activeIndex
        }
    },
    actions: {},
    getters: {}
}