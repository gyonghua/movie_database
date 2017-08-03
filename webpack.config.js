var path = require("path")
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
entry: "./app/index.js",
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
     },
module: {
    rules:[
        {test: /\.(js)$/, use: "babel-loader"},
        {test: /\.css$/, use: ["style-loader", "css-loader"]},
        {test: /\.(png|jpg|gif|woff|woff2)$/, use: "url-loader"},
        {test: /\.(ttf|eot|svg)$/, use: "file-loader"}
    ]
    },
devServer: {
        historyApiFallback: true
    },
plugins: [new HtmlWebpackPlugin({
    template: "app/index.html"
})]
}