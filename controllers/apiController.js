const sqlQuery = require('../db/mysql');
// const util =require('../utils/util');
// const redis = require('../db/redis').redisClient;
// const {redisStrSet, redisStrGet, redisStrDel}=require('../db/redis');

// let queryWinInfo = async function (req, res) {
// 	// let sql ='select * from wining_info where device_info =?                                                                                                                                                                                                                                                                                          ';
// 	// let sqlArr =[username, username, username];

// };
let insertWinInfo = async function (req, res) {
	let sql = 'insert into wining_info(device_info,prize_info,count,create_time) values(?,?,?,?)';
	let sqlArr =['1111111', '华为mate30', 2, ''];
	let result = await sqlQuery.SysqlConnect(sql, sqlArr);

	if (result.affectedRows ==1) {
		res.send({
			'code': 200,
			'msg': '记录成功',
		});
	} else {
		res.send({
			'code': 400,
			'msg': '记录失败',
		});
	}
    
};
let test = async function (res) { 
    
	// let {mobile} = req.body;
	// var ab= 'www.baidu.com1';
	// var stat= await redisStrSet(5, 'wz', ab);
	// var val = await redisStrGet(1,'a')
	// let mobile =111;

	res.send({
		'code': 200,
		'msg': '抽奖成功',
	});
};
//抽奖
let luckDraw =function () { 

	console.log(11111);
};

module.exports={
	insertWinInfo,
	test,
	luckDraw,
};
