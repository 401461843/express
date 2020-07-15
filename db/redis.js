const redis = require('redis');
const config =require('../config/dbConfig');

// 创建客户端
const redisClient = redis.createClient(config.redisConfig.port, config.redisConfig.host);

redisClient.on('ready', res => {
	console.log('redis启动成功', res);
});

redisClient.on('error', err => {
	console.log('redis启动失败', err);
});


module.exports = {
	redisClient,
	redisStrSet: function (dbNum, key, value, expire) {
		return new Promise((resolve, reject)=>{
			redisClient.select(dbNum, function (err) {
				if (err) {
					reject(err);
				} else {
					redisClient.set(key, value, function (err, result) { 
						if (err) {
							reject(err);
						} else {
							resolve(result);
							if (expire && !isNaN(expire) && expire>0) {
								redisClient.expire(key, parseInt(expire));
							}
						}
					});
				}
			});
		});

	},
	redisStrGet: function (dbNum, key) {
		return new Promise((resolve, reject)=>{
			redisClient.select(dbNum, function (err) { 
				if (err) {
					reject(err);
				} else {
					redisClient.get(key, function (err, result) {
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					});
				}
			});
           
		});
	},
	redisStrDel: function (dbNum, key) {
		return new Promise((resolve, reject)=>{
			redisClient.select(dbNum, function (err) {
				if (err) {
					reject(err);
				} else {
					redisClient.del(key, function (err, result) { 
						if (err) {
							reject(err);
						} else {
							resolve(result);
						}
					});
				}
			});
		});
	},
};