# 基于koa搭建的服务器

## 技术栈与工具准备

1. node.js
2. koa 框架

   - koa-router 路由中间件
   - koa-body
   - koa2-cors 配置跨域中间件

3. mysql 数据库
4. navicat 可视化数据库操作工具

## 目录结构

- server 根目录文件夹

  1. app.js 程序启动文件(主文件)
  2. routes 文件夹；路由层，管理所有路由(存放路由文件)

     - index.js 对所有路由进行处理，并作为整个路由的出口文件，在 app.js 中引入

  3. controllers 文件夹；控制器，操作层 执行服务端模板渲染，json 接口返回数据，页面跳转
  4. models 文件夹；数据模型层 执行数据操作(存放操作数据库的文件)
  5. views 文件夹；存放模板文件
  6. public 文件夹；存放静态资源，如 css、图片等
  7. utils：文件夹；存放工具类的文件
  8. logs：文件夹；日志文件(存放日志目录)
  9. package.json 存储项目的信息，比如项目名、描述、作者、依赖等
  10. node_modules 项目的依赖库
  11. config 配置文件

      <!-- 12. services 文件夹；业务层，实现数据层 model 到操作层 controller 的耦合封装 -->

## 创建步骤

1. 新建文件夹并初始化

```js
// -y 直接跳过配置项
npm init - y
```

- 初始化配置

```js
{
    "name": "koa2", // 项目名
    "version": "1.0.0", // 版本
    "description": "", // 描述
    "main": "index.js",
    "scripts": {
        "test": "echo "Error: no test specified" && exit 1",
        "start": "node app.js", // 加上这一行，可以使用 npm start 代替 node app.js 启动服务
    },
    "keywords": [], // 关键词
    "author": "", // 作者
    "license": "ISC", // 协议
    "dependencies": {
        "koa": "^2.13.1" // koa版本
    }
}
```

2. 安装 koa 及相关插件

```js
//安装框架及所需要的配置
npm install koa koa - body koa - router--save
//安装配置跨域的插件
npm install koa2 - cors
```

3. 安装 mql

```js
npm install mysql--save
```

## 启动服务

1. `node app.js`

2. `npm start`

## 连接数据库

- 新建 `mysql/index.js` 文件

```js
// 引入 mql
var mysql = require('mysql')

// 封装 连接数据库方法
function __connection() {
  // 1. 创建连接
  var connection = mysql.createConnection({
    host: 'localhost', // 本地数据库的地址
    user: 'root', // 用户名
    password: 'root', // 密码
    database: 'owl' // 数据库名称
  })
  // 2. 连接数据库
  connection.connect()
  return connection
}

// 3. 执行数据库操作
// 3.1 查询数据
// userInfo：表名称
// connection.query('SELECT * FROM `userInfo` ', function (error, results, fields) {
//   if (error) throw error;
//   console.log(results); //返回查询数据库的结果
// })

// 暴露 query 方法，供 model 模块使用
exports.query = function(sql, parmas = null) {
  //1.获取数据库连接对象
  var connection = __connection()
  return new Promise(function(reject, resolve) {
    // 3. 执行数据库操作
    connection.query(sql, parmas, function(error, results, fields) {
      if (error) throw error
      reject(results)
    })
    // 4. 关闭数据库
    connection.end()
  })
}
```

## 数据库操作

1. 增删改查

### 查询数据

1. 在 `routes/user.js` 文件中创建路由

```js
// 获取用户列表的路由
router.get('/list', getUserList)
```

2. 在 `contrllers/user.js` 文件中编写逻辑，查询数据

```js
// 获取用户列表
async getUserList(ctx) {
    // const query = ctx.request.query // 获取查询的参数
    // if (query.name !== '') {
    //   // 查询条件不为空
    //   var sql = `select * from user_list where name = '${query.name}'`
    // } else {
    //   var sql = 'select * from `user_list`'
    // }
    var sql = 'select * from `user_list`'
    var result = await dataBase.query(sql)
    dataObj.data = result
    ctx.response.body = dataObj
}
```

### 新增数据

1. 在 `routes/user.js` 文件中创建路由

```js
// 新增用户的路由
router.post('/', createUser)
```

2. 在 `contrllers/user.js` 文件中编写逻辑，插入数据

```js
// 新增用户
async createUser(ctx) {
    // koa-bodyparser 中间件，使用 `ctx.request.body` 进行获取 POST 请求参数
    const postData = ctx.request.body
    // 往数据库插入数据
    let sql = 'insert into user_list' // user_list为表名
    sql += ` (id, name, mobile, password, email) values ('${postData.id}','${postData.name}', '${postData.mobile}', '${postData.password}', '${postData.email}' )`
    dataBase.query(sql)
    // 将post传的参数返回客户端
    ctx.body = postData
}
```

### 修改数据

1. 在 `routes/user.js` 文件中创建路由

```js
// 编辑用户的路由
router.put('/', updateUser)
```

2. 在 `contrllers/user.js` 文件中编写逻辑，插入数据

```js
// 编辑用户
// koa-bodyparser 中间件，使用 `ctx.request.body` 进行获取 POST 请求参数
const tempData = ctx.request.body
// 修改指定数据
let sql = 'update user_list set' // user_list为表名
sql += ` name='${tempData.name}',mobile='${tempData.mobile}',password='${tempData.password}',email='${tempData.email}' where id='${tempData.id}'`
dataBase.query(sql)
// 将post传的参数返回客户端
ctx.body = tempData
```

### 删除数据

1. 在 `routes/user.js` 文件中创建路由

```js
// 删除用户的路由
router.delete('/:id', deleteUser)
```

2. 在 `contrllers/user.js` 文件中编写逻辑，删除数据

```js
// 删除用户
async deleteUser(ctx) {
    // 获取参数 id
    const {
        id
    } = ctx.params
    // 根据id删除数据
    let sql = `delete from user_list where id = '${id}'` // user_list为表名
    dataBase.query(sql)
    // 将post传的参数返回客户端
    ctx.body = ctx.params
}
```

### 获取数据详情

1. 在 `routes/user.js` 文件中创建路由

```js
// 获取用户详情的路由
router.get('/detail/:id', getUserDetail)
```

2. 在 `contrllers/user.js` 文件中编写逻辑，获取数据

```js
async getUserDetail(ctx) {
 const { id } = ctx.params // 获取参数
 // 根据id查询具体数据
 var sql = `select * from user_list where id = '${id}'`
 var result = await dataBase.query(sql)
 dataObj.data = result
 ctx.response.body = dataObj.data[0]
}
```

## 其他工具

### nodemon

1. 介绍

- nodemon 是一种工具，可以自动检测到目录中的文件更改时通过重新启动应用程序来调试基于 node. js 的应用程序

2. 安装

```js
npm install--save - dev nodemon
// 或
npm install nodemon - D
```

3. 使用

- 在 `package.json` 文件中添加一条 nodemon 的命令

```js
"scripts": {
    "test": "echo "
    Error: no test specified " && exit 1",
    "start": "node app.js",
    "server": "nodemon app.js" // 加上这一行
}
```

### KoroFileHeader

- vscode 函数注释插件
- `https://www.cnblogs.com/suRimn/p/10450372.html`

1. 下载插件
2. 在"setting. json"中添加配置

```js
// 文件头部注释
"fileheader.customMade": {
    "Descripttion": "",
    "version": "",
    "Author": "sueRimn",
    "Date": "Do not edit",
    "LastEditors": "sueRimn",
    "LastEditTime": "Do not Edit"
},
//函数注释
"fileheader.cursorMode": {
    "name": "",
    "test": "test font",
    "msg": "",
    "param": "",
    "return": ""
}
```

3. 使用

```js
// 文件头部注释
crtl + alt + i
// 函数注释
ctrl + alt + t
```

## 疑问收录

### 查询数据

1. 获取详情接口，也是用的 id 精准查询？
2. 列表查询，如何筛选需要的数据
   - 不把数据全部返回
3. 如何处理有查询条件和没有查询条件时的列表获取？
4. 如何获取总条数
