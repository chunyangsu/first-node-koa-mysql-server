// 这里引入上面创建的连接mysql的文件
const dataBase = require('../mysql/index')

// 接口成功时的返回结果
let dataObj = {
  status: 200, // 状态码
  data: {}, // 返回数据
  msg: '请求成功'
}

class Users {
  // 获取用户列表(携带查询条件)
  async getUserList(ctx) {
    // const query = ctx.request.query // 获取查询的参数
    // if (query.name && query.name !== '') {
    //   // 查询条件不为空
    //   var sql = `select * from user_list where name = '${query.name}'`
    // } else {
    //   var sql = 'select * from `user_list`'
    // }
    var sql = 'select * from `user_list`'
    var result = await dataBase.query(sql)
    dataObj.data = result
    ctx.response.body = dataObj
    // ctx.response.body = query
  }

  // 新增用户
  async createUser(ctx) {
    // koa-bodyparser 中间件，使用 `ctx.request.body` 进行获取 POST 请求参数
    const tempData = ctx.request.body
    // 往数据库插入数据
    let sql = 'insert into user_list' // user_list为表名
    sql += ` (id, name, mobile, password, email) values ('${tempData.id}','${tempData.name}', '${tempData.mobile}', '${tempData.password}', '${tempData.email}' )`
    dataBase.query(sql)
    // 将post传的参数返回客户端
    ctx.body = tempData
  }

  // 编辑用户
  async updateUser(ctx) {
    // koa-bodyparser 中间件，使用 `ctx.request.body` 进行获取 POST 请求参数
    const tempData = ctx.request.body
    // 修改指定数据
    let sql = 'update user_list set' // user_list为表名
    sql += ` name='${tempData.name}',mobile='${tempData.mobile}',password='${tempData.password}',email='${tempData.email}' where id='${tempData.id}'`
    dataBase.query(sql)
    // 将post传的参数返回客户端
    ctx.body = tempData
  }

  // 删除用户
  async deleteUser(ctx) {
    const {
      id
    } = ctx.params // 获取参数
    // 根据id删除数据
    let sql = `delete from user_list where id = '${id}'` // user_list为表名
    dataBase.query(sql)
    // 将post传的参数返回客户端
    ctx.body = ctx.params
  }

  // 获取用户详情
  async getUserDetail(ctx) {
    const {
      id
    } = ctx.params // 获取参数
    // 根据id获取数据
    var sql = `select * from user_list where id = '${id}'`
    var result = await dataBase.query(sql)
    dataObj.data = result
    ctx.body = dataObj.data[0]
  }
}

module.exports = new Users()