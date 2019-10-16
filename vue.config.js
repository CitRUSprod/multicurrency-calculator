const { ProvidePlugin } = require("webpack")


module.exports = {
    configureWebpack: {
        plugins: [
            new ProvidePlugin({
                _: "lodash",
                vp: "vuex-pathify",
                msgRequest: ["@/init/renderer", "msgRequest"]
            })
        ]
    },
    pluginOptions: {
        electronBuilder: {
            outputDir: "dist",
            builderOptions: {
                productName: "Multicurrency Calculator",
                appId: "com.citrus.multicurrencycalculator",
                win: {
                    icon: "public/icon.png"
                },
                linux: {
                    icon: "public/icon.png"
                }
            }
        }
    }
}
