<template>
    <div id="app">
        <!-- <router-link to="/login">点我跳转到登录页面</router-link> -->
        <!-- 主路由的出口 -->
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {
        // HelloWorld
    },
}
</script>

<style>
html,
body,
h3,
p {
    margin: 0;
    padding: 0;
}
</style>
