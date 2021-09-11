const fs = require('fs')

module.exports = app => {
  // 读取当前目录下所有文件
  fs.readdirSync(__dirname).forEach(file => {
    // 除去归纳的 `index.js` 文件，其他的都要注册到 `app` 中
    if (file === 'index.js' || /^\./.test(file)) {
      return
    }
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}