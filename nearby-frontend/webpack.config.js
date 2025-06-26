const path = require('path');


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
                target: 'http://localhost:8080',
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
        path: path.resolve(__dirname, 'dist'),
    }
};