/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-08-14 16:22:19
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-08-22 14:53:50
 */
// 引入 mql
var mysql = require("mysql");

// 封装 连接数据库方法
function __connection() {
  // 1. 创建连接
  var connection = mysql.createConnection({
    host: "localhost", // 本地数据库的地址
    user: "root", // 用户名
    password: "root", // 密码
    database: "users" // 数据库名称
  });
  // 2. 连接数据库
  connection.connect();
  return connection;
}

// 3. 执行数据库操作
// 3.1 查询数据
// userInfo：表名称
// connection.query('SELECT * FROM `userInfo`', function (error, results, fields) {
//   if (error) throw error;
//   console.log(results); //返回查询数据库的结果
// })

// 暴露 query 方法，供 model 模块使用
exports.query = function (sql, parmas = null) {
  //1.获取数据库连接对象
  var connection = __connection();
  return new Promise(function (reject, resolve) {
    // 3. 执行数据库操作
    connection.query(sql, parmas, function (error, results, fields) {
      if (error) throw error;
      reject(results);
    });
    // 4. 关闭数据库
    connection.end();
  })
}