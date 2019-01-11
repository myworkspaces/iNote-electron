const path = require('path')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    target: 'electron-main',
    entry: {
        main: './src/main/index.js'
    },
    output: {
        path: resolve('dist'),
        filename: 'main.js'
    }
}