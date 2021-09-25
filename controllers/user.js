// 这里引入上面创建的连接mysql的文件
const dataBase = require('../mysql/index')

// 接口成功时的返回结果
let dataObj = {
  status: 200, // 状态码
  data: {}, // 返回数据
  msg: '请求成功'
}

class Users {
  // 获取用户列表
  async getUserList(ctx) {
    var sql = 'SELECT * FROM `user_list`'
    var result = await dataBase.query(sql)
    dataObj.data = result
    ctx.response.body = dataObj
  }

  // 新增用户
  async createUser(ctx) {
    // koa-bodyparser 中间件，使用 `ctx.request.body` 进行获取 POST 请求参数
    const postData = ctx.request.body
    // 往数据库插入数据
    let sql = "INSERT INTO user_list" // user_list为表名
    sql += ` (id, name, mobile, password, email) VALUES ('${postData.id}','${postData.name}', '${postData.mobile}', '${postData.password}', '${postData.email}' )`
    dataBase.query(sql)
    // 将post传的参数返回客户端
    ctx.body = postData
  }
}

module.exports = new Users()