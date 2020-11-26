
const loadsh = require('lodash');
const util =require('../utils/util');
const {redisStrSet, redisStrGet, redisStrDel, redisStrDecr, redisStrAll, redisStrIncr}=require('../db/redis');
const sqlQuery = require('../db/mysql');
const xlsx = require('xlsx');
const request =require('request');

global.dataList =[];
global.dataList1 =[];

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
let jzjluckDraw =async function ( req,res) { 
	let rate ='';
	let sum = 0;
	let section = [0];
	let newArr =[];
	let prizeNumber =Math.floor(Math.random() * 200);
	let allPrize='';
	let count =0;
	let prizeName ='';
	
	// 获取抽奖概率
	rate =JSON.parse(await redisStrGet(5, 'gl'));
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
				console.log(prizeName)
				await redisStrDecr(3, prizeName);
				res.send({ 
					'code': 200,
					'msg': '抽奖成功',
					'prize': prizeName,
				});
				allPrize=await redisStrAll(3);
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

let audiSubmit = async function (req,res) {
	let {model, name,tell} = req.body;
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	
	let sqlArr =[model,name,tell,create_time];
	let sql = 'insert into audi_form (model,name,tell,create_time) values(?,?,?,?)';;
	let result1= await sqlQuery.SysqlConnect(sql,sqlArr)
	if(result1.affectedRows==1){
		res.send({ 
			'code': 1,
			'msg': '提交成功！',
			'data':''
			
			 
		});
	}else{
		res.send({ 
			'code': 2,
			'msg': '提交失败!',
			'data':''
		});
	}
}
let jmgjSubmit = async function (req,res) {
	let {name,tell} = req.body;
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	
	let sqlArr =[name,tell,create_time];
	let sql = 'insert into jmgj_form (name,tell,create_time) values(?,?,?)';;
	let result1= await sqlQuery.SysqlConnect(sql,sqlArr)
	if(result1.affectedRows==1){
		res.send({ 
			'code': 1,
			'msg': '提交成功！',
			'data':''
			
			 
		});
	}else{
		res.send({ 
			'code': 2,
			'msg': '提交失败!',
			'data':''
		});
	}
}
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
//智能研讨会
let submityYth =async function (req,res) {
	let {name,tell,dz,jx } =req.body
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	let map={
		'kz':'米思米海绵口罩',
		'gz':'度熊星座公仔',
		'yx':'小度智能音响大金刚',
		'bjb':'MT定制笔记本',
		'hbd':'MT环保袋'
	}
	let data ={
		name:name,
		tell:tell,
		dz:dz,
		jx:jx,
		create_time: create_time 
	};
	let sqlArr =[data.tell];
	let sql = 'select * from  znyth_info where tell = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr)
	
	if(result.length ==0){
		let sqlArr1 =[data.name,data.tell,data.dz,data.jx,data.create_time];
		let sql1 = 'insert into znyth_info (name,tell,dz,jx,create_time) values(?,?,?,?,?)';
		let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1)
		if(result1.affectedRows==1){
			res.send({ 
				'code': 1,
				'msg': '领取成功',
				'data':''
			});
		}else{
			res.send({ 
				'code': 1,
				'msg': '服务器出错!',
				'data':''
			});
		}
	}else{
		// console.log(result[0]['jx'])
		res.send({ 
			'code': 1,
			'msg': '您已经领过'+map[result[0]['jx']]+'奖品了!',
			'data':''

		});
	}
}
//家装
let submityJzj =async function (req,res) {
	let {name,tell,dz,jx } =req.body
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	let data ={
		name:name,
		tell:tell,
		dz:dz,
		jx:jx,
		create_time: create_time 
	};
	let sqlArr =[data.tell];
	let sql = 'select * from  jzj_info where tell = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr)
	
	if(result.length ==0){
		let sqlArr1 =[data.name,data.tell,data.dz,data.jx,data.create_time];
		let sql1 = 'insert into jzj_info (name,tell,dz,jx,create_time) values(?,?,?,?,?)';
		let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1)
		if(result1.affectedRows==1){
			res.send({ 
				'code': 1,
				'msg': '领取成功',
				'data':''
			});
		}else{
			res.send({ 
				'code': 1,
				'msg': '服务器出错!',
				'data':''
			});
		}
	}else{
		// console.log(result[0]['jx'])
		res.send({ 
			'code': 1,
			'msg': '您已经领过'+result[0]['jx']+'奖品了!',
			'data':''

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
let getAccessToken = async function (req,res) { 

	// request('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=W229ytlqVG9EQTNcafLteSymT9xWNF6C&client_secret=obskiUt1LeqXv2N5UEkyeImxgLryY57O&scope=smartapp_snsapi_base',function (error, response, data) {
	// 	if (!error && response.statusCode == 200) {
	// 		// console.log(data)
	// 		console.log(JSON.parse(data).access_token)
			
	// 		request('https://openapi.baidu.com/rest/2.0/smartapp/template/templatelist?access_token='+JSON.parse(data).access_token+'&count=10&offset=0',function (error,response,data1) {
	// 			console.log(data1)
	// 		})
	// 		res.send({ 
	// 			'code': 1,
	// 			'msg': '成功',
	// 			'data':''
	// 		});
	// 	}
	// });
 }
// let test2 =async function(req,res){
	
// 	let {formId,swanid} =req.body
// 	let formId =''
// 	let swanid=''
// 	let param ={
// 		accessToken:'24.7c296337d474b78e44828ce6d5530f0b.2592000.1601026870.282335-18005672',
// 		template_id:'9933055a93484023ad6b76adaae4183f',
// 		touser:swanid,
// 		data:{
// 			keyword1: {
// 				value: "百度直播夜"
// 			},
// 			keyword2: {
// 				value: '今天20:00 开播时间'
// 			},
// 			keyword3: {
// 				value: "2020-09-10 13:00"
// 			},
// 		},
// 		page:'test/test',
// 		scene_id:formId,
// 		scene_type:1

// 	}
// 	let url ='https://openapi.baidu.com/rest/2.0/smartapp/template/send?access_token=24.7c296337d474b78e44828ce6d5530f0b.2592000.1601026870.282335-18005672'
// 	request({
// 		url:url,
// 		method: 'POST',
// 		data: param
// 	},(reslut)=>{
// 		console.log(reslut)
// 		res.send({ 
// 			'code': 1,
// 			'msg': '成功',
// 			'data':reslut
// 		});
		
// 	})
		
// }
//好奇集市接口
let hqjsLuckDraw =async function ( req,res) { 
	let rate ='';
	let sum = 0;
	let section = [0];
	let newArr =[];
	let prizeNumber =Math.floor(Math.random() * 1000);
	let allPrize='';
	let count =0;
	let prizeName ='';
	let qm =''
	// 获取抽奖概率
	rate =JSON.parse(await redisStrGet(10, 'gl'));
	// console.log(prizeNumber)
	
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
		// console.log(newArr)
		
			util.customForeach(newArr, async function (val, index) { 
				if (prizeNumber>val[0] && prizeNumber<=val[1]) {
					prizeName=Object.keys(rate)[index];
					await redisStrDecr(9, prizeName);
					if(prizeName !='xxhg'){
						qm =util.makeJm()
						let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
						let sqlArr1 =[qm,prizeName,create_time];
						let sql1 = 'insert into hqjs (qm,jp,create_time) values(?,?,?)';
						let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1)
					}
					res.send({ 
						'code': 200,
						'msg': '抽奖成功',
						'prize': prizeName,
						'qm':qm
					});
					 
					allPrize=await redisStrAll(9);
					util.customForeach(allPrize, async (val) => {
						if ( await redisStrGet(9, val)==0) {
							let oldGlObj =JSON.parse(await redisStrGet(10, 'gl'));
							let fboldGlObj=JSON.stringify(oldGlObj)
							let oldGl =oldGlObj[val];
							let avater =oldGl/( Object.keys(oldGlObj).length-1);
		
							delete oldGlObj[val];
							loadsh.forEach(oldGlObj, async function (val1, key) { 
								oldGlObj[key] =Number(val1)+avater;
							});	
							await redisStrDel(9, val);
							await redisStrSet(10, 'gl', JSON.stringify(oldGlObj));
							await redisStrSet(10, 'gl1', fboldGlObj);
		
						}
					});
					
				} 
			});
		
	}
}

//





//数据查询工具
let query = async function (req,res) {
	let sqlArr =[];
	let sql = 'select * from  audi_form ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr)
	let obj ={}
	let tableList =[]
	if(result.length>0){
		result.forEach(function (val) {
			obj ={}
			obj['model']=val.model
			obj['name']=val.name
			obj['tell']=val.tell
			obj['create_time']=util.mysqlDatetime(val.create_time) 
			tableList.push(obj)
		})
		dataList=tableList
		res.send({ 
			'code': 1,
			'msg': '成功',
			'tab_list':tableList
		});
	}
  }

let download = function (req,res) {
	let arrayWorkSheet = '';
	let workBook='';
	let arrayData = [
		['序号', '车型','姓名','电话','预约时间']
	  ];
	dataList.forEach((item,index)=>{
		var temp = [];
		temp.push((index+1));
		temp.push(item.model);
		temp.push(item.name);
		temp.push(item.tell);
		temp.push(item.create_time);
		arrayData.push(temp)
	})
	arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
	workBook = {
		SheetNames: ['arrayWorkSheet'],
		Sheets: {
		  'arrayWorkSheet': arrayWorkSheet
		}
	  };
	//删除文件
	util.deleteFile('./excel/表单信息.xlsx') 
	// 将workBook写入文件
	try{
		xlsx.writeFile(workBook, "./excel/表单信息.xlsx");
		res.send({ 
			'code': 1,
			'msg': 'excel生成成功'
		});
	} catch(err){
		res.send(
			{ 
				'code': 1,
				'msg': 'excel生成失败'
			}
		);
	}
	
	
}
//数据查询工具
let query1= async function (req,res) {
	let sqlArr =[];
	let sql = 'select * from  jmgj_form ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr)
	let obj ={}
	let tableList =[]
	if(result.length>0){
		result.forEach(function (val) {
			obj ={}
			obj['name']=val.name
			obj['tell']=val.tell
			obj['create_time']=util.mysqlDatetime(val.create_time) 
			tableList.push(obj)
		})
		dataList1=tableList
		res.send({ 
			'code': 1,
			'msg': '成功',
			'tab_list':tableList
		});
	}
  }

let download1 = function (req,res) {
	let arrayWorkSheet = '';
	let workBook='';
	let arrayData = [
		['序号','姓名','电话','预约时间']
	  ];
	dataList1.forEach((item,index)=>{
		var temp = [];
		temp.push((index+1));
		temp.push(item.name);
		temp.push(item.tell);
		temp.push(item.create_time);
		arrayData.push(temp)
	})
	arrayWorkSheet = xlsx.utils.aoa_to_sheet(arrayData);
	workBook = {
		SheetNames: ['arrayWorkSheet'],
		Sheets: {
		  'arrayWorkSheet': arrayWorkSheet
		}
	  };
	//删除文件
	util.deleteFile('./excel/表单信息1.xlsx') 
	// 将workBook写入文件
	try{
		xlsx.writeFile(workBook, "./excel/表单信息1.xlsx");
		res.send({ 
			'code': 1,
			'msg': 'excel生成成功'
		});
	} catch(err){
		res.send(
			{ 
				'code': 1,
				'msg': 'excel生成失败'
			}
		);
	}
	
	
}




//小程序接口
let getOpenid=async function (req,res) {
	let {code} =req.body
	let param ={
		code:code,
		client_id:'W229ytlqVG9EQTNcafLteSymT9xWNF6C',
		sk:'DA3xBCohPOzCECCCKGKpgAesd4dOZGuR'
	}
	request({
		url:'https://spapi.baidu.com/oauth/jscode2sessionkey',
		method: 'POST',
		form: param,
		headers: {
			"content-type": "Application/x-www-form-urlencoded",
		},
	},async (error, response, body)=>{
		if (!error && response.statusCode == 200) {
			let openid =JSON.parse(body)['openid']
			let sqlArr =[openid];
			let sql = 'select * from  nhj_user_info where user_id = ? ';
			let result = await sqlQuery.SysqlConnect(sql,sqlArr);
			if(result.length ==0){
				let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
				let sqlArr1 =[openid,create_time];
				let sql1 = 'insert into nhj_user_info (user_id,create_time) values(?,?)';
				let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1);
				if(result1.affectedRows==1){
					res.send({ 
						'code': 1,
						'msg': '用户记录成功！',
						'user_id':openid
					});
				}else{
					res.send({ 
						'code': 0,
						'msg': '用户记录失败！'
					});
				}
			}else{
				res.send({ 
					'code': 2,
					'msg': '用户已经存在！',
					'data':result[0]

				});
			}
		}
		
	});
}
//updateUserinfo
let updateUserinfo = async function (req,res) {
	let {name,avatarUrl,user_id} =req.body
	let sqlArr =[name,avatarUrl,user_id];
	let sql = 'update nhj_user_info  set user_name = ? , user_avatar_url= ? where user_id= ?';
	let result= await sqlQuery.SysqlConnect(sql,sqlArr);
	if(result.affectedRows==1){
		res.send({ 
			'code': 1,
			'msg': '更新用户信息成功！'
		});
	}else{
		res.send({ 
			'code': 0,
			'msg': '更新用户信息失败！'
		});
	}

}
//getUserinfo
let getUserinfo = async function (req,res) {
	let {user_id} =req.body
	let sqlArr =[user_id];
	let sql = 'select * from  nhj_user_info where user_id = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	if(result.length>0){
		res.send({ 
			'code': 1,
			'msg': '获取用户信息成功！',
			'data':result[0]
		});
	}else{
		res.send({ 
			'code': 0,
			'msg': '获取用户信息失败！'
		});
	}

}
//createGoodsList
let createGoodsList = async function (req,res) {
	let {user_id,user_name,goods_list} =req.body
	let sqlArr =[1,1,user_id,user_id];
	let sql = 'update nhj_user_info  set join_team_flag = ? , captain_flag= ? , team_id = ?  where user_id= ?';
	let result= await sqlQuery.SysqlConnect(sql,sqlArr);
	// console.log(1111)
	if(result.affectedRows==1){
		let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
		let sqlArr1 =[user_id,user_name,goods_list,create_time];
		let sql1 = 'insert into nhj_team_info (team_id,team_name,goods_list,create_time) values(?,?,?,?)';
		let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1);
		if(result1.affectedRows==1){
			res.send({ 
				'code': 1,
				'msg': '年货清单生成成功！'
				
			});
		}else{
			res.send({ 
				'code': 0,
				'msg': '年货清单生成失败！'
			});
		}
		
	}else{
		res.send({ 
			'code': 0,
			'msg': '年货清单生成失败！'
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
	jzjluckDraw,
	query,
	download,
	getAccessToken,
	hqjsLuckDraw,
	submityYth,
	submityJzj,
	audiSubmit,
	jmgjSubmit,
	query1,
	download1,
	getOpenid,
	updateUserinfo,
	getUserinfo,
	createGoodsList

};
