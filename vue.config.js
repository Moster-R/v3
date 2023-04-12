const {defineConfig} = require('@vue/cli-service')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,
    filenameHashing: true,  // 开启打包hash
    // 部署应用包时的基本 URL
    publicPath: process.env.NODE_ENV === 'production'
        ? '/production-sub-path/'
        : '/',
    // 打包输出目录
    outputDir: 'dist',
    // 静态资源目录
    assetsDir: 'static',
    // 指定生成的 index.html 的输出路径
    indexPath: 'index.html',
    // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
    lintOnSave: process.env.NODE_ENV !== 'production',
    // 是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    // 是否为生产环境构建生成 source map
    productionSourceMap: true,
    // 调整内部的 webpack 配置
    configureWebpack: {
        // 警告 webpack 的性能提示
        performance: {
            hints: 'warning',
            // 入口起点的最大体积
            maxEntrypointSize: 50000000,
            // 生成文件的最大体积
            maxAssetSize: 30000000,
            // 只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js')
            }
        },
        // 解析模块请求的选项
        resolve: {
            // 配置别名
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@c': path.resolve(__dirname, './src/components'),
                'vue$': 'vue/dist/vue.esm.js'
            }
        },
        // 配置 externals
        externals: {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios'
        }
    },
    // 对内部的 webpack 配置（比如修改、增加Loader选项）(链式操作)
    chainWebpack: config => {
        // 添加新的svg-sprite-loader处理svgIcon
        config.module
            .rule('svgIcon')
            .test(/\.svg$/)
            .include
            .add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        // 修改images loader 添加svg处理
        config.module
            .rule('images')
            .exclude.add(path.resolve(__dirname, './src/icons'))
            .end()
        config.module
            .rule('svg')
            .test(/\.svg$/)
            .include
            .add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('file-loader')
            .loader('file-loader')
            .options({
                name: 'img/[name].[hash:8].[ext]'
            })
            .end()
    },
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            css: {
                modules: {
                    auto: () => true
                }
            },
        }
    },
    // webpack-dev-server 相关配置
    devServer: {
        // 自动打开浏览器
        open: true,
        // 端口号
        port: 8080,
        // 启用 https
        https: false,
        // 热更新
        hotOnly: false,
        // 配置代理
        proxy: {
            '/api': {
                // 目标 API 地址
                target: 'http://localhost:3000',
                // 如果要代理 websockets
                ws: true,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
})


