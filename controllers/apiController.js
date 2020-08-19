
const loadsh = require('lodash');
const util =require('../utils/util');
const {redisStrSet, redisStrGet, redisStrDel, redisStrDecr, redisStrAll, redisStrIncr}=require('../db/redis');
const sqlQuery = require('../db/mysql');

//抽奖
/* eslint-disable */
let luckDraw =async function ( req,res) { 
	let rate ='';
	let sum = 0;
	let section = [0];
	let newArr =[];
	let prizeNumber =Math.floor(Math.random() * 100);
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
//
let luckDrawZy =async function ( req,res) { 
	let rate ='';
	let sum = 0;
	let section = [0];
	let newArr =[];
	let prizeNumber =Math.floor(Math.random() * 100);
	console.log(prizeNumber)
	let allPrize='';
	let count =0;
	let prizeName ='';
	
	// 获取抽奖概率
	rate =JSON.parse(await redisStrGet(5, 'gl'));
	console.log(rate)
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
				await redisStrDecr(3, prizeName);
				res.send({ 
					'code': 200,
					'msg': '抽奖成功',
					'prize': prizeName,
				});
				allPrize=await redisStrAll(0);
				util.customForeach(allPrize, async (val) => {
					if ( await redisStrGet(3, val)==0) {
						let oldGlObj =JSON.parse(await redisStrGet(5, 'gl'));
						let fboldGlObj=JSON.stringify(oldGlObj)
						let oldGl =oldGlObj[val];
						let avater =oldGl/( Object.keys(oldGlObj).length-1);
	
						delete oldGlObj[val];
						loadsh.forEach(oldGlObj, async function (val1, key) { 
							oldGlObj[key] =Number(val1)+avater;
						});	
						await redisStrDel(3, val);
						await redisStrSet(5, 'gl', JSON.stringify(oldGlObj));
						await redisStrSet(5, 'gl1', fboldGlObj);
	
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
//老凤祥提交
let lfxSubmit = async function (req,res) {
	let {name,tell,sign,jx } =req.body
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	let data ={
		name:name,
		tell:tell,
		sign:sign,
		jx:jx,
		create_time: create_time 
	};
	let sqlArr =[data.tell,data.jx];
	let sql = 'select * from  lfx_info where tell = ? and jx = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr)
	let msg=''
	let count=''
	if(jx=='kzj'){
		msg ='恭喜你,老凤祥定制口罩夹领取成功,请及时兑换!'
	}else if(jx == 'ssh'){
		msg ='恭喜你,老凤祥精美首饰盒领取成功,请及时兑换!'
	}else{
		msg ='恭喜你,老凤祥精美餐具领取成功,请及时兑换!'
	}
	if(sign=='fx'){
		count = await redisStrGet(2, 'cj')
		if(count >0){
			await redisStrDecr(2,'cj')
		}else{
			count =0
			msg="您的手速慢了!"
		}
	}
	if(result.length ==0){
		let sqlArr1 =[data.name,data.tell,data.jx,data.sign,data.create_time];
		let sql1 = 'insert into lfx_info (name,tell,jx,sign,create_time) values(?,?,?,?,?)';
		let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1)
		if(result1.affectedRows==1){
			res.send({ 
				'code': 1,
				'msg': msg,
				'data':'',
				'count':count
				 
			});
		}else{
			res.send({ 
				'code': 1,
				'msg': '服务器出错!',
				'data':''
			});
		}
	}else{
		res.send({ 
			'code': 1,
			'msg': '您已经领过此类奖品,请勿重复领取!',
			'data':'',
			'count':count
		});
	}
}
//老凤祥分享
let lfxFx= async function (req,res) { 
	let count = await redisStrGet(2, 'cj')
	if(count){
		res.send({ 
			'code': 1,
			'msg': '剩余餐具数!',
			'count':count
		});
	}
}

let lfxFxsubmit= async function (req,res) { 
	let {name,tell,sign } =req.body
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	let data ={
		name:name,
		tell:tell,
		sign:sign,
		jx:'cj',
		create_time: create_time 
	};
	let sqlArr =[data.tell,data.jx];
	let sql = 'select * from  lfx_info where tell = ? and jx = ? ';
	
	let msg=''
	let count=await redisStrGet(2, 'cj')
	
	if(count >0){
		let result = await sqlQuery.SysqlConnect(sql,sqlArr)
		if(result.length ==0){
			let sqlArr1 =[data.name,data.tell,data.jx,data.sign,data.create_time];
			let sql1 = 'insert into lfx_info (name,tell,jx,sign,create_time) values(?,?,?,?,?)';
			let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1)
			if(result1.affectedRows==1){
				await redisStrDecr(2,'cj')
				res.send({ 
					'code': 1,
					'msg': '恭喜你,老凤祥精美餐具领取成功,请及时兑换!',
					'data':'',
					'count':count-1
					 
				});
			}else{
				res.send({ 
					'code': 1,
					'msg': '服务器出错!',
					'data':''
				});
			}
		}else{
			res.send({ 
				'code': 1,
				'msg': '您已经领过此类奖品,请勿重复领取!',
				'data':'',
				'count':count
			});
		}

	}else{
		res.send({ 
			'code': 1,
			'msg': '您手速慢了,请参与其他活动吧!',
			'data':''
		});
	}
	
	
	
	 
}
//苏州表单提交
let szSubmit = async function (req,res) {
	let {company,name,tell } =req.body

	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	let sjc = new Date().getTime()
	let data ={
		company: company,
		name:name,
		tell:tell,
		create_time: create_time
	};
	let result=await redisStrSet(7, tell+'-'+sjc, JSON.stringify(data),86400);
	
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
	szSubmit,
	lfxSubmit,
	lfxFx,
	lfxFxsubmit,
	luckDrawZy
};
