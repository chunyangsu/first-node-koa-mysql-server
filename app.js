// 引入 koa
const Koa = require('koa')
// const koaBody = require('koa-body')();
// 引入 跨域中间件
const cors = require('koa2-cors')
// 引入user模块
// const user = require('./routes/user')
// 引入routes文件夹下的index.js文件
const routes = require('./routes')

// 引入
const bodyParser = require('koa-bodyparser')

// 创建实例
const app = new Koa()

// 调用
app.use(bodyParser())

app.use(async (ctx, next) => {
  ctx.body = 'hello node!'
  await next();
})

app.use(
  cors({
    origin: function (ctx) { //设置允许来自指定域名请求
      if (ctx.url === '/test') {
        return '*'; // 允许来自所有域名请求
      }
      return '*'; //只允许http://localhost:8080这个域名的请求
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
)

// 进入接口
// get方法取参数 ctx.request.query
// post方法取参数 ctx.request.body
// 向前端返回值 ctx.response.body

// 初始化路由中间件
// app.use(user.routes()).use(user.allowedMethods());
//执行routes方法 把app传进去
routes(app)

// 设置端口号
app.listen(3000, () => {
  console.log('服务启动了！')
})