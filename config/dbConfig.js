
let env =process.env.NODE_ENV; //环境变量

let mysqlConfig;

let redisConfig;

if ( env=='dev') {
	mysqlConfig ={
		host: 'localhost',
		port: '3306',
		user: 'root',
		password: '123456',
		database: 'qx',
	};
	redisConfig ={
		host: '127.0.0.1',
		port: 6379,
	};
} else {
	mysqlConfig ={
		host: '106.12.75.244',
		port: '3306',
		user: 'root',
		password: 'baidu@123',
		database: 'qx',
	};
	redisConfig ={
		host: 'redis.kfdctebchxge.scs.su.baidubce.com',
		port: 6379,
	};
}


module.exports ={
	mysqlConfig,
	redisConfig,
};
