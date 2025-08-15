const path = require('path');

module.exports = {
    entry: './run/kage/index.js',
    output: {
        filename: 'kage.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    devServer: {
        port: 8080,
        open: true,
        hot: true,
        proxy: [
            {
                context: ['/processids'],
                target: 'http://localhost:3500',
                changeOrigin: true,
                secure: false
            }
        ],
        historyApiFallback: true
    }
};
