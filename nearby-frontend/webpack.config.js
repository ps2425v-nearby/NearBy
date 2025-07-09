const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devServer: {
        port: 8081,
        historyApiFallback: true,
        compress: false,
        proxy: [
            {
                context: ['/api'],
                target: process.env.BACKEND_URL,
                secure: false,
                changeOrigin: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            },
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                exclude: /node_modules\/(leaflet|leaflet-draw|leaflet-geosearch)/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('@tailwindcss/postcss'),
                                    require('autoprefixer'),
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                include: /node_modules\/(leaflet|leaflet-draw|leaflet-geosearch)/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true, // Optional: cleans the build folder before each build
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/images', to: 'images' }
            ],
        }),
        new webpack.DefinePlugin({
            'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)
        }),
    ]
};