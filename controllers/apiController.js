// const sqlQuery = require('../db/mysql');
const loadsh = require('lodash');
const util =require('../utils/util');

const {redisStrSet, redisStrGet, redisStrDel, redisStrDecr, redisStrAll,redisStrIncr}=require('../db/redis');
const redis = require('../db/redis');


// let queryWinInfo = async function (req, res) {
// 	// let sql ='select * from wining_info where device_info =?                                                                                                                                                                                                                                                                                          ';
// 	// let sqlArr =[username, username, username];

// };
// let insertWinInfo = async function () {
// 	let sql = 'insert into wining_info(device_info,prize_info,count,create_time) values(?,?,?,?)';
// 	let sqlArr =['1111111', '华为mate30', 2, ''];
// 	// let result = await sqlQuery.SysqlConnect(sql, sqlArr);
// 	// // if(result.affectedRows ==1){
// 	// 	res.send({
// 	// 		'code':200,

// 	// 	})
// 	// }

// 	// if (result.affectedRows ==1) {
// 	// 	res.send({
// 	// 		'code': 200,
// 	// 		'msg': '记录成功',
// 	// 	});
// 	// } else {
// 	// 	res.send({
// 	// 		'code': 400,
// 	// 		'msg': '记录失败',
// 	// 	});
// 	// }
    
// };
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
/* eslint-disable */
let luckDraw =async function ( req,res) { 
	
	let rate ='';
	let sum = 0;
	let section = [0];
	let newArr =[];
	let prizeNumber =loadsh.random(1, 100);
	let allPrize='';
	let count =0;
	let prizeName ='';
	
	// 获取抽奖概率
	rate =JSON.parse(await redisStrGet(1, 'gl'));
	if(JSON.stringify(rate) =='{}'){
		
		res.send({ 
			'code': 200,
			'msg': '抽奖成功',
			'prize': '没中奖',
		});
	}else{
		loadsh.forEach(rate, function (val) { 
			let temArr=[];
	
			sum+=val;
			section.push(sum);
			temArr[0]=section[count];
			temArr[1]=section[count+1];
			newArr.push(temArr);
			count++;
		});
		util.customForeach(newArr, async function (val, index) { 
			if (prizeNumber>val[0] && prizeNumber<=val[1]) {
				prizeName=Object.keys(rate)[index];
				await redisStrDecr(0, prizeName);
				res.send({ 
					'code': 200,
					'msg': '抽奖成功',
					'prize': prizeName,
				});
				allPrize=await redisStrAll(0);
				util.customForeach(allPrize, async (val) => {
					if ( await redisStrGet(0, val)==0) {
						let oldGlObj =JSON.parse(await redisStrGet(1, 'gl'));
						let fboldGlObj=JSON.stringify(oldGlObj)
						let oldGl =oldGlObj[val];
						let avater =oldGl/( Object.keys(oldGlObj).length-1);
	
						delete oldGlObj[val];
						loadsh.forEach(oldGlObj, async function (val1, key) { 
							oldGlObj[key] =Number(val1)+avater;
						});	
						await redisStrDel(0, val);
						await redisStrSet(1, 'gl', JSON.stringify(oldGlObj));
						await redisStrSet(1, 'gl1', fboldGlObj);
	
					}
				});
				
			} 
		});
	}
	
};
let submit =async function (req, res) {
	let {tell, prize} = req.body;
	let date= new Date().toLocaleString();
	let data ={
		prize: prize,
		date: date,
	};
	let result=await redisStrSet(2, tell, JSON.stringify(data));
	
	if (result == 'OK') {
		res.send({ 
			'code': 200,
			'msg': '领奖成功',
		});
	} else {
		res.send({ 
			'code': 400,
			'msg': '领取失败',
		});
	}

};
let giveUp =async function (req,res) {
	let {prize} =req.body
	let checkFlag =await redisStrGet(0,prize)
	
	if(!checkFlag){
		let fbgl =await redisStrGet(1,'gl1')
		let result =await redisStrSet(0,prize,'1')
		let result1 =await redisStrSet(1,'gl',fbgl)
		if (result == 'OK' && result1 == 'OK') {
			
			res.send({ 
				'code': 200,
				'msg': '放弃成功',
			});
		} else {
			res.send({ 
				'code': 400,
				'msg': '放弃失败',
			});
		}
	}else{
		let result = await redisStrIncr(0,prize)
		if(result){
			res.send({ 
				'code': 200,
				'msg': '放弃成功',
			});
		}else{
			res.send({ 
				'code': 200,
				'msg': '放弃失败',
			});
		}
	}


}
module.exports={
	test,
	luckDraw,
	submit,
	giveUp
};
