// 引入 路由中间件
const Router = require('koa-router')
const router = new Router()

// 引入控制器里面的方法
const {
  getUserList,
  createUser,
  updateUser,
  getUserDetail,
  deleteUser
} = require('../controllers/user')

// 总路由添加前缀/user,总地址变为http://localhost:3000/user
router.prefix('/user')

// 子路由添加前缀/users,最后访问地址变为http://localhost:3000/api/users/user
// router.use('/users', user.routes());

// 获取用户列表的路由
router.get('/list', getUserList)

// 新增用户的路由
router.post('/', createUser)

// 编辑用户的路由
router.put('/', updateUser)

// 获取用户详情的路由
router.get('/detail/:id', getUserDetail)

// 删除用户的路由
router.delete('/:id', deleteUser)

// 导出路由备用
module.exports = router