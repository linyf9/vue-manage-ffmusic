<template>
    <div class="main">
        <el-container>
            <el-aside width="auto">
                <CommonAside />
            </el-aside>
            <el-container>
                <el-header>
                    <CommonHeader />
                </el-header>
                <!-- tags -->
                <CommonTags />
                <el-main>
                    <!-- 子路由的出口 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'
import CommonTags from '@/components/CommonTags.vue';
export default {
    name: 'Main',
    components: {
        CommonAside,
        CommonHeader,
        CommonTags
    }
}
</script>

<style lang="less" scoped>
.main {
    overflow: hidden;
}

.el-header {
    padding: 0;
}

// .el-header,
// .el-footer {
//     background-color: #B3C0D1;
//     color: #333;
//     text-align: center;
//     line-height: 60px;
// }

// .el-aside {
//     background-color: #D3DCE6;
//     color: #333;
//     text-align: center;
//     line-height: 200px;
// }

// .el-main {
//     background-color: #E9EEF3;
//     color: #333;
//     text-align: center;
//     line-height: 160px;
// }

// body>.el-container {
//     margin-bottom: 40px;
// }

// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//     line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//     line-height: 320px;
// }
</style>