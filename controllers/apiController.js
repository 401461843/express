
const loadsh = require('lodash');
const util =require('../utils/util');
const {redisStrSet, redisStrGet, redisStrDel, redisStrDecr, redisStrAll, redisStrIncr}=require('../db/redis');


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
let test =async function (req,res) {
	// console.log(req)
	res.send({ 
		'code': 200,
		'msg': '成功',
	});
}
//苏州表单提交
let szSubmit = async function (req,res) {
	let {company,name,tell } =req.body

	let create_time= new Date().toLocaleString();
	
	let data ={
		company: company,
		name:name,
		tell:tell,
		create_time: create_time
	};
	let result=await redisStrSet(6, tell+' '+create_time, JSON.stringify(data),86400);
	
	if (result == 'OK') {
		res.send({ 
			'code': 1,
			'msg': '提交成功',
			'data':''
		});
	} else {
		res.send({ 
			'code': 0,
			'msg': '提交失败',
			'data':''
		});
	}
  
}
//小程序接口
//获取用户次数接口
let getUserInfo= async function (req,res) {
	let {uid} =req.body;
	let result =await redisStrGet(5,uid)
	if(!result){
		let res1 = await redisStrSet(5,uid,'3')
		let userInfo ={
			'uid':uid,
			'count':3
		}
		if(res1 =='OK'){
			res.send({ 
				'code': 200,
				'msg': '成功',
				'userInfo':userInfo
			});
		}


	}else{
		let userInfo ={
			'uid':uid,
			'count':result
		}
		res.send({ 
			'code': 200,
			'msg': '成功', 
			'userInfo':userInfo
		});
	}
}

module.exports={
	luckDraw,
	submit,
	giveUp,
	test,
	getUserInfo,
	szSubmit
};
