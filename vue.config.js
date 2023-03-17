const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    // 关闭eslint的语法检查
    lintOnSave: false,
    configureWebpack: {
        externals: {
            "BMap": 'BMap'
        }
    },
    
    devServer: {
        port: 8080,
        host: 'localhost',
        // 配置代理跨域
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000',
                pathRewrite: {'^/api':''}
            }
        }


    }
})
