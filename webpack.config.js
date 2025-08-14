const path = require('path');

module.exports = {
    entry: './run/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    performance: {
        maxEntrypointSize: 1024 * 1024 * 1024,
        maxAssetSize: 1024 * 1024 * 1024
    },
    mode: 'production'
};
