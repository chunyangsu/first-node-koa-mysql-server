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
    var sql = 'SELECT * FROM `userInfo`'
    var result = await dataBase.query(sql)
    dataObj.data = result
    ctx.response.body = dataObj
  }

  // 新增用户
  async createUser(ctx) {
    console.log(121);
    console.log(ctx.request.body);
  }
}

module.exports = new Users()