const path = require('path');

const config = {
    entry: './ui/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            { test: /\.jsx?$/, use: 'babel-loader' },
        ],
    },
};

module.exports = config;
