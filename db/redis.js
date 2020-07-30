const redis = require('redis');
const config =require('../config/dbConfig');

// 创建客户端
const redisClient = redis.createClient(config.redisConfig.port, config.redisConfig.host);

redisClient.on('ready', ()=> {
	console.log('redis启动成功');
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
	redisStrDecr: function (dbNum, key) {
		return new Promise((resolve, reject)=>{
			redisClient.select(dbNum, function (err) {
				if (err) {
					reject(err);
				} else {
					redisClient.decr(key, function (err, result) { 
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
	redisStrIncr: function (dbNum, key) {
		return new Promise((resolve, reject)=>{
			redisClient.select(dbNum, function (err) {
				if (err) {
					reject(err);
				} else {
					redisClient.incr(key, function (err, result) { 
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
	redisStrAll: function (dbNum) {
		return new Promise((resolve, reject)=>{
			redisClient.select(dbNum, function (err) {
				if (err) {
					reject(err);
				} else {
					redisClient.keys('*', function (err, result) { 
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
