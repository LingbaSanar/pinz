const path = require('path');

module.exports = {
    entry: './run/kage/index.js',
    output: {
        filename: 'kage.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production'
};
