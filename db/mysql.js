const mysql =require('mysql');
const config = require('../config/dbConfig');

module.exports ={

	//同步查询数据库,立马要显示的最好用同步查询
	sqlConnect: function (sql, sqlArr, callback) {
		var pool =mysql.createPool(config.mysqlConfig);

		pool.getConnection((err, conn)=>{

			if (err) {
				console.log('连接失败');
				return;
			}
			console.log('数据库连接成功!');
			//事件驱动回调
			conn.query(sql, sqlArr, callback);
			//释放连接池
			conn.release();
            
		});
	},
	//异步查询数据库,不是立马要显示的,异步查询
	SysqlConnect: function (sysSql, SysqlArr) {
		return new Promise((resolve, reject)=>{
			var pool =mysql.createPool(config.mysqlConfig);

			pool.getConnection((err, conn)=>{
				if (err) {
					reject(err);
				} else {
					console.log('数据库连接成功!');
					//事件驱动回调
					conn.query(sysSql, SysqlArr, (err, data)=>{
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
					//释放连接池
					conn.release();
				}
                
			});
		});
	},
};
