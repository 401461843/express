
const loadsh = require('lodash');
const util =require('../utils/util');
const {redisStrSet, redisStrGet, redisStrDel, redisStrDecr, redisStrAll, redisStrIncr}=require('../db/redis');
const sqlQuery = require('../db/mysql');
const xlsx = require('xlsx');
const request =require('request');
const BaiduB64 = require('@baidu/oap-lib').BaiduB64;
const {encryptionSign} =require('../utils/encryption');
const b64 = new BaiduB64();
// var fs = require('fs');//文件模块


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
let audi1Submit = async function (req,res) {
	let {model,date, name,tell} = req.body;
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	
	let sqlArr =[model,date,name,tell,create_time];
	let sql = 'insert into audi_form1 (model,date,name,tell,create_time) values(?,?,?,?,?)';;
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
let cfhySubmit = async function (req,res) {
	let {name,tell} = req.body;
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	
	let sqlArr =[name,tell,create_time];
	let sql = 'insert into cfhy_form (name,tell,create_time) values(?,?,?)';;
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

//数据查询工具
let query = async function (req,res) {
	let sqlArr =[];
	let sql = 'select * from  audi_form1 ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr)
	let obj ={}
	let tableList =[]
	if(result.length>0){
		result.forEach(function (val) {
			obj ={}
			obj['model']=val.model
			obj['name']=val.name
			obj['tell']=val.tell
			obj['date']=val.date
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
		temp.push(item.date);
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
	
	let {xtoken,code,team_id,share_id,cuid} =req.body
	let accsstoken =''
	let acurl= 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=dKatXb51y13Gizn8EboLkFfHaLU208Zj&client_secret=2GSqlxC7P4KEdHggYoGmp6tkZDIHCn9A&scope=smartapp_snsapi_base'
	if(xtoken){
		request(acurl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				accsstoken =JSON.parse(body).access_token
				let param1={
					'appkey':'dKatXb51y13Gizn8EboLkFfHaLU208Zj',
					'xtoken':xtoken,
					'type':'marketing',
					'clientip':req.ip.split('ffff:')[1],
					'ts':Math.floor(Date.now()/1000),
					'ev':'login'
				}
				request({
						url:'https://openapi.baidu.com/rest/2.0/smartapp/detectrisk?access_token='+accsstoken,
						method: 'POST',
						form: param1,
						headers: {
							"content-type": "Application/x-www-form-urlencoded",
						},
					},async (error, response, body)=>{
						
						if(cuid&& code){
							let param ={
								code:code,
								client_id:'dKatXb51y13Gizn8EboLkFfHaLU208Zj',
								sk:'2GSqlxC7P4KEdHggYoGmp6tkZDIHCn9A'
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
										let userinfo ={}
										let openid =JSON.parse(body)['openid']
										let sqlArr0 =[cuid];
										let sql0 = 'select * from  nhj_user_info where cuid = ? ';
										let result0 = await sqlQuery.SysqlConnect(sql0,sqlArr0);
										if(result0.length>0){
											if(result0[0]['user_id'] != openid){
												res.send({ 
													'code': 2,
													'msg': '该设备已绑定其它账号！',
													'data':''
												});
												return
											}
										}else{
											let sqlArr =[openid];
											let sql = 'select * from  nhj_user_info where user_id = ? ';
											let result = await sqlQuery.SysqlConnect(sql,sqlArr);

											if(result.length ==0){
												let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
												let sqlArr1 =[openid,cuid,JSON.stringify([]),create_time];
												let sql1 = 'insert into nhj_user_info (user_id,cuid,share_count_info,create_time) values(?,?,?,?)';
												await sqlQuery.SysqlConnect(sql1,sqlArr1);
											}else{
												if(result[0]['cuid']==''){
													let sqlArr8 =[cuid,openid];
													let sql8 = 'update nhj_user_info  set cuid = ? where user_id= ? ';
													await sqlQuery.SysqlConnect(sql8,sqlArr8);
												}else{
													if(cuid !=result[0]['cuid']){
														res.send({ 
															'code': 2,
															'msg': '该设备已绑定其它账号',
															'data':''
														});
														return
													}
													
												}
											}

										}
										let sqlArr7 =[openid];
										let sql7 = 'select * from  nhj_user_info where user_id = ? ';
										let result7 = await sqlQuery.SysqlConnect(sql7,sqlArr7);
										userinfo =result7[0]


										// let datetime =new Date('2021/1/28 19:37:00').getTime()
										// let date1 =new Date().getTime()
										// if(date1>datetime ){
										// 	res.send({ 
										// 		'code': 3,
										// 		'msg': '活动已结束',
										// 		'data':userinfo
										// 	});
										// 	return
										// }
										//判断有没有team_id
										if(team_id ==''){
											if(userinfo['join_team_flag'] =='0'){
												userinfo['to']='sy'
												userinfo['to_team_id']=''
												
												res.send({ 
													'code': 1,
													'msg': '用户未加入战队',
													'data':userinfo
												});
											}else{
												let sqlArr1 =[userinfo['team_id']];
												let sql1 = 'select * from  nhj_team_info where team_id = ? ';
												let result1 = await sqlQuery.SysqlConnect(sql1,sqlArr1);
												if(JSON.parse(result1[0]['members']).length<3){
													userinfo['to']='zd'
													userinfo['to_team_id']=userinfo['team_id']
													res.send({ 
														'code': 1,
														'msg': '用户已加入战队，但战队人数不够',
														'data':userinfo
													});
													
												}else{
													userinfo['to']='db'
													userinfo['to_team_id']=userinfo['team_id']
													res.send({ 
														'code': 1,
														'msg': '用户已加入战队，人数已够上榜',
														'data':userinfo
													});
												}
												

											}

										}else{
											
											// 当前用户没有加入战队
											if(userinfo['join_team_flag'] =='0'){
												if(JSON.parse(userinfo['help_team_id']).indexOf(team_id)==-1){
													
													//更新被分享者信息
													let help_team_id_temp =JSON.parse(userinfo['help_team_id'])
													help_team_id_temp.push(team_id)
													
													let sqlArr3 =[JSON.stringify(help_team_id_temp),userinfo['user_id']];
													let sql3 = 'update nhj_user_info  set help_team_id = ? where user_id= ? ';
													let result3 = await sqlQuery.SysqlConnect(sql3,sqlArr3);
													if(result3.affectedRows ==1){
														userinfo['help_team_id']=JSON.stringify(help_team_id_temp)
													}
													//更新分享者的分享信息
													let sqlArr10 =[share_id];
													let sql10 = 'select * from  nhj_user_info where user_id = ? ';
													let result10 = await sqlQuery.SysqlConnect(sql10,sqlArr10);
													let shareinfo=JSON.parse(result10[0]['share_count_info'])

													shareinfo.push(userinfo['user_id'])
													let sqlArr4 =[JSON.stringify(shareinfo),share_id];
													let sql4 = 'update nhj_user_info  set share_count_info = ?  where user_id= ?';
													await sqlQuery.SysqlConnect(sql4,sqlArr4);
													//更新 redis战队票数
												
													let objRes =JSON.parse(await redisStrGet(1,team_id))
													objRes['total_bill']= objRes['total_bill']+30
													await redisStrSet(1, team_id, JSON.stringify(objRes))
													//更新数据库战队票数
													let sqlArr7 =[objRes['total_bill'],team_id];
													let sql7 = 'update nhj_team_info  set total_bill = ?  where team_id= ?';
													await sqlQuery.SysqlConnect(sql7,sqlArr7);

													//查询当前前往哪个页面
													let sqlArr5 =[team_id];
													let sql5 = 'select * from  nhj_team_info where team_id = ? ';
													let result5 = await sqlQuery.SysqlConnect(sql5,sqlArr5);
													if(JSON.parse(result5[0]['members']).length<3){
														userinfo['to']='zd'
														userinfo['to_team_id']=team_id
														res.send({ 
															'code': 1,
															'msg': '被分享战队还差人，判断是否加入当前战队',
															'data':userinfo
														});
														
													}else{
														userinfo['to']='db'
														userinfo['to_team_id']=team_id
														res.send({ 
															'code': 1,
															'msg': '被分享已上榜，判断是否加入当前战队',
															'data':userinfo
														});
													}
											

												}else{
													let sqlArr9 =[team_id];
													let sql9 = 'select * from  nhj_team_info where team_id = ? ';
													let result9 = await sqlQuery.SysqlConnect(sql9,sqlArr9);
													if(JSON.parse(result9[0]['members']).length<3){
														userinfo['to']='zd'
														userinfo['to_team_id']=team_id
														res.send({ 
															'code': 1,
															'msg': '被分享战队还差人，判断是否加入当前战队',
															'data':userinfo
														});
													
													}else{
														userinfo['to']='db'
														userinfo['to_team_id']=team_id
														res.send({ 
															'code': 1,
															'msg': '被分享战队已上榜，判断是否加入当前战队',
															'data':userinfo
														});
													}
													
												}
											}else{
												//查询当前前往哪个页面
											
												let sqlArr6 =[userinfo['team_id']];
												let sql6 = 'select * from  nhj_team_info where team_id = ? ';
												let result6 = await sqlQuery.SysqlConnect(sql6,sqlArr6);
												if(JSON.parse(result6[0]['members']).length<3){
													userinfo['to']='zd'
													userinfo['to_team_id']=userinfo['team_id']
													res.send({ 
														'code': 1,
														'msg': '你的战队已经还差人，快去邀请成员吧！',
														'data':userinfo
													});
													
												}else{
													userinfo['to']='db'
													userinfo['to_team_id']=userinfo['team_id']
													res.send({ 
														'code': 1,
														'msg': '你的战队已经还不差人，快去分享助力吧！',
														'data':userinfo
													});
												}
												
											}
										}


									}

								})
				
						}else{
							res.send({ 
								'code': 1,
								'msg': 'cuid，code数据异常',
								'data':''
							});
						}
						
				})
	
			}
		})
	}else{
		res.send({ 
			'code': 1,
			'msg': 'xtoken数据异常',
			'data':''
		});
	}
	
	
}
//updateUserinfo
let updateUserinfo = async function (req,res) {
	let {name,avatarUrl,user_id} =req.body
	let sqlArr =[name,avᆨatarUrl,user_id];
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
	let {user_id,goods_list} =req.body
	let sqlArr0 =[user_id];
	let sql0 = 'select * from  nhj_user_info where user_id = ? ';
	let result0 = await sqlQuery.SysqlConnect(sql0,sqlArr0);
	if(result0[0]['captain_flag'] =='1'){
		res.send({ 
			'code': 1,
			'msg': '您已经选过年货了，请勿重新提交！'
		});
	}else{
		//设置战队排行榜
		let obj ={}
		obj['team_name'] =result0[0]['user_name']
		obj['user_avatar_url']=result0[0]['user_avatar_url']
		obj['total_bill']=1
		await redisStrSet(1, user_id, JSON.stringify(obj));
		
		let sqlArr =[1,1,user_id,user_id];
		let sql = 'update nhj_user_info  set join_team_flag = ? , captain_flag= ? , team_id = ?  where user_id= ?';
		let result= await sqlQuery.SysqlConnect(sql,sqlArr);
		if(result.affectedRows==1){
			
			let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
			let sqlArr1 =[user_id,obj['team_name'],JSON.stringify([user_id]),goods_list,create_time];
			let sql1 = 'insert into nhj_team_info (team_id,team_name,members,goods_list,create_time) values(?,?,?,?,?)';
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
	

}
//getTeamInfo 战队信息
let getTeamInfo= async function (req,res) {
	let {team_id} =req.body
	let sqlArr =[team_id];
	let sql = 'select * from  nhj_team_info where team_id = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	let team_info =[]
	let data ={}
	let sqlArr8 =[];
	let sql8 = 'select count(*) from  nhj_user_info';
	let result8 = await sqlQuery.SysqlConnect(sql8,sqlArr8);
	data['person_num']=result8[0]['count(*)']
	if(result.length >0){
		data['goods_list']= JSON.parse(result[0]['goods_list'])
		util.customForeach(JSON.parse(result[0]['members']), async (val,index) => {
			let obj ={}
			let sqlArr1 =[val];
			let sql1 = 'select * from  nhj_user_info where user_id = ? ';
			let result1 = await sqlQuery.SysqlConnect(sql1,sqlArr1);
			
			if(result1.length>0){
				obj['user_name'] =result1[0]['user_name']
				obj['user_avatar_url'] =result1[0]['user_avatar_url']
				obj['share_count_info'] =result1[0]['share_count_info']
				team_info.push(obj)
			}
			if((JSON.parse(result[0]['members']).length -1) == index){
				data['team_info']=team_info
				// console.log(data)
				res.send({ 
					'code': 1,
					'msg': '',
					'data':data
				});
			}
		});
		
	}

}
//战队助力页内容
let getTeamzy =async function (req,res) {
	let {team_id,user_id} =req.body
	let sqlArr =[team_id];
	let sql = 'select * from  nhj_team_info where team_id = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	let team_info =[]
	let data ={}
	let sqlArr2 =[];
	let sql2 = 'select * from  nhj_team_info order by total_bill desc';
	let result2 = await sqlQuery.SysqlConnect(sql2,sqlArr2);
	let sqlArr8 =[];
	let sql8 = 'select count(*) from  nhj_user_info';
	let result8 = await sqlQuery.SysqlConnect(sql8,sqlArr8);
	let sqlArr3 =[user_id];
	let sql3 = 'select * from  nhj_user_info where user_id = ? ';
	let result3 = await sqlQuery.SysqlConnect(sql3,sqlArr3);
	let pm =''
	let price =0
	let captain={}
	JSON.parse(result[0]['goods_list']).forEach(function (val,index) { 
		price+=Number(val['goodsPrice'])
	})
	data['total_price']=price.toFixed(2)
	data['task']= JSON.parse(result3[0]['task'])
	data['id']=result[0]['id']
	
	data['create_time'] =result[0]['create_time'].toLocaleString().split(' ')[0].replace(/-/g,'/')
	data['task_total']= JSON.parse(result3[0]['task_total'])
	result2.forEach(function (val,index) {
		if(val.team_id == team_id ){
			pm = index+1
		}
	})
	data['pm'] =pm
	data['person_num']=result8[0]['count(*)']
	if(result.length >0){
		data['total_bill']=result[0]['total_bill']
		data['team_name']=result[0]['team_name']
		util.customForeach(JSON.parse(result[0]['members']), async (val,index) => {
			let obj ={}
			let sqlArr1 =[val];
			let sql1 = 'select * from  nhj_user_info where user_id = ? ';
			let result1 = await sqlQuery.SysqlConnect(sql1,sqlArr1);
			if(result1.length>0){
				if(result1[0]['captain_flag']=='1'){
					captain['user_name'] =result1[0]['user_name']
					captain['user_avatar_url'] =result1[0]['user_avatar_url']
					captain['share_count']=JSON.parse(result1[0]['share_count_info']).length +result1[0]['task_total']
					captain['captain_flag']=result1[0]['captain_flag']
					captain['user_id']=result1[0]['user_id']
				}else{
					obj['user_name'] =result1[0]['user_name']
					obj['user_avatar_url'] =result1[0]['user_avatar_url']
					obj['share_count']=JSON.parse(result1[0]['share_count_info']).length +result1[0]['task_total']
					obj['captain_flag']=result1[0]['captain_flag']
					obj['user_id']=result1[0]['user_id']
					team_info.push(obj)
				}
				
			}
			if((JSON.parse(result[0]['members']).length -1) == index){
				let temp =util.objSort('share_count',team_info)
				temp.unshift(captain)
				data['team_info']=temp

				data['goods_list']=JSON.parse(result[0]['goods_list'])
				
				// 
				res.send({ 
					'code': 1,
					'msg': '',
					'data':data
				});
			}
		});
		
	}

}
//加入战队
let joinTeam = async function (req,res) {
	let {user_id,team_id}=req.body

	//更新当前用户信息
	let sqlArr =[1,team_id,user_id];
	let sql = 'update nhj_user_info  set join_team_flag = ? ,team_id = ? where user_id= ?';
	await sqlQuery.SysqlConnect(sql,sqlArr);

	let sqlArr1 =[team_id];
	let sql1 = 'select * from  nhj_team_info where team_id = ? ';
	let result1 = await sqlQuery.SysqlConnect(sql1,sqlArr1);
	if(result1['0']['members'].indexOf(user_id)>-1){
		res.send({ 
			'code': 1,
			'msg': '您已经加入过战队了！'
		});
	}else{
		
		let obj=JSON.parse(result1[0]['members'])
		obj.push(user_id)
		let sqlArr2 =[JSON.stringify(obj),team_id];
		let sql2 = 'update nhj_team_info  set members = ? where team_id= ?';
		await sqlQuery.SysqlConnect(sql2,sqlArr2);
		res.send({ 
			'code': 1,
			'msg': '更新加入战队成功！'
		});
		
	}
	
	
}
//更新战队名
let updateTeamName =async function (req,res) {
	// let {team_name,team_id}=req.body
	let team_name ='小王八的战队'
	let team_id ='k04HERpS7gftwqxK2-D3zZRRfn'
	let sqlArr =[team_name,team_id];
	let sql = 'update nhj_team_info  set team_name = ? where team_id= ?';
	//更新redis内的战队名
	let result= await sqlQuery.SysqlConnect(sql,sqlArr);
	let obj =JSON.parse(await redisStrGet(1,team_id))
	obj['team_name']= team_name
	await redisStrSet(1, team_id, JSON.stringify(obj))
	
	if(result.affectedRows==1){
		res.send({ 
			'code': 1,
			'msg': '更改名字成功！'
		});
	}else{
		res.send({ 
			'code': 0,
			'msg': '更改名字失败！'
		});
	}

}
//小程序点击分享，生成分享口令
let getCommand = async function (req,res) { 
	let {team_id,user_id} =req.body
	let url ='dKatXb51y13Gizn8EboLkFfHaLU208Zj/pages/index/index?team_id='+team_id+'&share_id='+user_id
	
	let data ={
		"activity_id":"749",//活动id，由cms申请,必选
		"url":url,//跳转地址，或feed的nid，
		"slog":{//非必需，目前口令支持4个维度的统计
			"p1":"chrome|safari|...",//浏览器,
			"p2":"android|ios|...",//系统，
			"p3":"1099a|...",//渠道来源
			"p4":"component|midPage"//组件（component） ，中间页（midPage）
		}
	}
	let result = b64.encode(Buffer.from(JSON.stringify(data)));
	res.send({ 
		'code': 1,
		'msg': '',
		'data':result
	});
}
//获取排行榜信息

let getRankingList   = async function (req,res) { 
	let result = await redisStrAll(1)
	let list =[]
	util.customForeach(result, async (val,index) => {
		let obj =JSON.parse(await redisStrGet(1, val))
		obj['team_id'] =val
		list.push(obj)
		if(index == (result.length-1)){
			res.send({ 
				'code': 1,
				'msg': '',
				'data':util.objSort('total_bill',list)
			});
		}
	});
	
} 

let getPhb =async function (req,res) {

	let result = await redisStrAll(1)
	let list =[]
	util.customForeach(result, async (val,index) => {
		let obj =JSON.parse(await redisStrGet(1, val))
		obj['team_id'] =val
		list.push(obj)

		if(index == (result.length-1)){
			let jq =util.objSort('total_bill',list)
			let w =jq.slice(3,30)
			util.customForeach(w, async (val1,index1) => {
				let sqlArr =[val1.team_id];
				let sql = 'select * from  nhj_user_info where user_id = ? ';
				let result1= await sqlQuery.SysqlConnect(sql,sqlArr);
				if(result1.length>0){
					let sqlArr1 =[index1+3,val1.team_id];
					let sql1 = 'update nhj_user_info  set pm = ?  where user_id= ?';
					await sqlQuery.SysqlConnect(sql1,sqlArr1);
				}
				if(index1 ==( w.length -1)){
					res.send({ 
						'code': 1,
						'msg': '',
						'data':'数据更新成功！'
					});
				}
				
			});
			
		}
	});

}
//签到任务签到
let task =async function (req,res) {
	let {xtoken,cuid,date,user_id,task_id,res_code,add_bill} =req.body
	
	let accsstoken =''
	let acurl= 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=dKatXb51y13Gizn8EboLkFfHaLU208Zj&client_secret=2GSqlxC7P4KEdHggYoGmp6tkZDIHCn9A&scope=smartapp_snsapi_base'
	if(xtoken){
		request(acurl, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				accsstoken =JSON.parse(body).access_token
				let param1={
					'appkey':'dKatXb51y13Gizn8EboLkFfHaLU208Zj',
					'xtoken':xtoken,
					'type':'marketing',
					'clientip':req.ip.split('ffff:')[1],
					'ts':Math.floor(Date.now()/1000),
					'ev':'login'
				}
				request({
						url:'https://openapi.baidu.com/rest/2.0/smartapp/detectrisk?access_token='+accsstoken,
						method: 'POST',
						form: param1,
						headers: {
							"content-type": "Application/x-www-form-urlencoded",
						},
					},async (error, response, body)=>{
						if(cuid && user_id){
							let sqlArr0 =[cuid];
							let sql0 = 'select * from  nhj_user_info where cuid = ? ';
							let result0 = await sqlQuery.SysqlConnect(sql0,sqlArr0);
							if(result0.length>0){
								if(result0[0]['user_id'] == user_id){
									let date1 = new Date();
									let year = date1.getFullYear(); //获取完整的年份(4位)
									let month = date1.getMonth() + 1; //获取当前月份(0-11,0代表1月)
									let day = date1.getDate(); //获取当前日(1-31)
									let time = year + '.' + month + '.' + day
									let map={
										'2021.1.23':1,
										'2021.1.24':2,
										'2021.1.25':3,
										'2021.1.26':4,
										'2021.1.27':5,
										'2021.1.28':6,
										'2021.1.29':7
									}
									let dayNum=map[date]
									let sqlArr =[user_id];
									let sql = 'select * from  nhj_user_info where user_id = ? ';
									let result = await sqlQuery.SysqlConnect(sql,sqlArr);
									let task =JSON.parse(result[0]['task'])
									let zd_info ={}
									let sqlArr7 =[];
									let pm=''
									let sql7 = 'select * from  nhj_team_info order by total_bill desc';
									let result7 = await sqlQuery.SysqlConnect(sql7,sqlArr7);
									result7.forEach(function (val,index) {
										if(val.team_id == result[0]['team_id'] ){
											pm = index+1
										}
									})
									zd_info['pm']=pm
									if(task['task'+task_id].length==5){
										if(task_id == 1){
											task['task'+task_id].push('1')
											task['task'+task_id].push('1')
										}else{
											task['task'+task_id].push('0')
											task['task'+task_id].push('0')
										}
										
									}
									if(time != date || task['task'+task_id][dayNum-1] =='1' ||  add_bill>50){
										res.send({ 
											'code': 1,
											'msg': '数据异常！',
											'data':''
										});
									}else{	
										if(task_id==3){
								
											if(res_code=='nn2021'){
												
												if(task['task'+task_id].indexOf('1')>-1){
													
													res.send({ 
														'code': 1,
														'msg': '您已经关注过公众号了！',
														'data':task
													});
												}else{
													//更新个人任务信息
													task['task'+task_id][dayNum-1]='1'
													let task_total= result[0]['task_total']+add_bill
													let sqlArr1 =[JSON.stringify(task),task_total,user_id];
													let sql1 = 'update nhj_user_info  set task = ? ,task_total = ?  where user_id= ?';
													await sqlQuery.SysqlConnect(sql1,sqlArr1);
													
													// //更新团队牌票数
													let sqlArr5 =[result[0]['team_id']];
													let sql5 = 'select * from  nhj_team_info where team_id = ? ';
													let result5 = await sqlQuery.SysqlConnect(sql5,sqlArr5);
													let total_bill =result5[0]['total_bill']+add_bill
													let sqlArr2 =[total_bill,result[0]['team_id']];
													let sql2 = 'update nhj_team_info  set total_bill = ? where team_id= ?';
													await sqlQuery.SysqlConnect(sql2,sqlArr2);
												
													//更新redis
													let objRes =JSON.parse(await redisStrGet(1,result[0]['team_id']))
													objRes['total_bill']= total_bill
													await redisStrSet(1, result[0]['team_id'], JSON.stringify(objRes))
													zd_info['person_total']=task_total+JSON.parse(result[0]['share_count_info']).length
													zd_info['user_id'] =result[0]['user_id']
													zd_info['total_bill']=total_bill
													zd_info['task'] =task
													res.send({ 
														'code': 1,
														'msg': '任务完成成功',
														'data':zd_info
													});
												}
											
											}else{
												res.send({ 
													'code': 1,
													'msg': '关注码错误了！',
													'data':zd_info
												});
											}
									
										}else{
											//更新个人任务信息
											task['task'+task_id][dayNum-1]='1'
											let task_total= Number(result[0]['task_total'])+add_bill
											let sqlArr1 =[JSON.stringify(task),task_total,user_id];
											let sql1 = 'update nhj_user_info  set task = ? ,task_total = ?  where user_id= ?';
											await sqlQuery.SysqlConnect(sql1,sqlArr1);
											
											// //更新团队牌票数
											let sqlArr5 =[result[0]['team_id']];
											let sql5 = 'select * from  nhj_team_info where team_id = ? ';
											let result5 = await sqlQuery.SysqlConnect(sql5,sqlArr5);
											let total_bill =result5[0]['total_bill']+add_bill
											let sqlArr2 =[total_bill,result[0]['team_id']];
											let sql2 = 'update nhj_team_info  set total_bill = ? where team_id= ?';
											await sqlQuery.SysqlConnect(sql2,sqlArr2);
										
											//更新redis
											let objRes =JSON.parse(await redisStrGet(1,result[0]['team_id']))
											objRes['total_bill']= total_bill
											await redisStrSet(1, result[0]['team_id'], JSON.stringify(objRes))
											zd_info['person_total']=task_total+JSON.parse(result[0]['share_count_info']).length
											zd_info['user_id'] =result[0]['user_id']
											zd_info['total_bill']=total_bill
											zd_info['task'] =task
											
											res.send({ 
												'code': 1,
												'msg': '任务完成成功',
												'data':zd_info
											});
										}
									}



								}else{
									res.send({ 
										'code': 2,
										'msg': '数据异常',
										'data':''
									});
								}
							}else{
								res.send({ 
									'code': 2,
									'msg': '数据异常',
									'data':''
								});
							}

						}else{
							res.send({ 
								'code': 2,
								'msg': '数据异常',
								'data':''
							});
						}
						// if(JSON.parse(body).data.level =='3' ||JSON.parse(body).data.level =='4'){;
							

						// }else{
						// 	res.send({ 
						// 		'code': 2,
						// 		'msg': '数据异常',
						// 		'data':''
						// 	});
						// }
				})
	
			}
		})
	}else{
		res.send({ 
			'code': 1,
			'msg': '数据异常',
			'data':''
		});
	}

}
//专题页抽奖

// 直播抽奖
let zbcj =async function (req,res) { 
	let {cuid,user_id,user_name,tell,prize,adress,pm} =req.body;
	if(cuid !='' && user_id !=''){
		let sqlArr2 =[user_id];
		let sql2 = 'select * from  zbtj where user_id = ? ';
		let result2= await sqlQuery.SysqlConnect(sql2,sqlArr2);
		if(result2.length >0){
			res.send({ 
				'code': 2,
				'msg': '数据已经提交',
				'data':''
			});
		}else{
			let sqlArr =[cuid];
			let sql = 'select * from  nhj_user_info where cuid = ? ';
			let result= await sqlQuery.SysqlConnect(sql,sqlArr);
			if(result.length>0){
				if(result[0]['user_id'] == user_id &&result[0]['pm'] ==pm ){
					let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
					let sqlArr1 =[user_id,user_name,tell,prize,adress,create_time];
					let sql1 = 'insert into zbtj (user_id,user_name,tell,prize,adress,create_time) values(?,?,?,?,?,?)';
					let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1);
					if(result1.affectedRows ==1){
						res.send({ 
							'code': 1,
							'msg': '提交成功',
							'data':''
						});
					}
				}else{
					res.send({ 
						'code': 1,
						'msg': '数据异常',
						'data':''
					});
				}
				
			}else{
				res.send({ 
					'code': 2,
					'msg': '数据异常',
					'data':''
				});
			}

		}

	}else{
		res.send({ 
			'code': 2,
			'msg': '数据异常',
			'data':''
		});
	}



} 

let ztyluckDraw =async function ( req,res) { 	
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
				await redisStrDecr(3, prizeName);
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
				res.send({ 
					'code': 200,
					'msg': '抽奖成功',
					'prize': prizeName,
				});
				
			} 
		});
	}
	
};
let getPrize=async function (req,res) { 
	let {name,tell,prize} = req.body;

	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	let sqlArr1 =[tell];
	let sql1 = 'select * from  nhjcj where tell = ? ';
	let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1)
	if(result1.length>0){
		res.send({ 
			'code': 1,
			'msg': '您已经领取过奖品了,请勿重复领取！',
			'data':''
		});
	}else{
		let sqlArr =[name,tell,prize,create_time];
		let sql = 'insert into nhjcj (name,tell,prize,create_time) values(?,?,?,?)';
		let result= await sqlQuery.SysqlConnect(sql,sqlArr)
		if(result.affectedRows==1){
			res.send({ 
				'code': 1,
				'msg': '领取成功！',
				'data':''
			});
		}else{
			res.send({ 
				'code': 2,
				'msg': '领取失败!',
				'data':''
			});
		}
	}
}
//520 活动接口
//用户登录接口

let userLogin =async function (req,res) { 
	let {code,share_id} =req.body
	if(code ){
		let param ={
			code:code,
			client_id:'GP9ZV4hFnB4rHG3pruGK1lusWpGPfaLs',
			sk:'FjFBeoxI7GBgl9NFHMkqOujIV9sGHjB1'
		}
		request({
				url:'https://spapi.baidu.com/oauth/jscode2sessionkey',
				method: 'POST',
				form: param,
				headers: {
					"content-type": "Application/x-www-form-urlencoded",
				},
			},async (error, response, body)=>{
				// console.log(response)1111
				if (!error && response.statusCode == 200) {
					
					let openid =JSON.parse(body)['openid']
					let sqlArr =[openid];
					let sql = 'select * from  qrj_user where user_id = ? ';
					let result = await sqlQuery.SysqlConnect(sql,sqlArr);
					let updateFAlg =false
					if(result.length ==0){
						if(share_id !=''){
							let sqlArr2 =[share_id];
							let sql2 = 'select * from  qrj_user where user_id = ? ';
							let result2 = await sqlQuery.SysqlConnect(sql2,sqlArr2);
							let share_info = JSON.parse(result2[0]['share_info'])
							share_info.push(openid)
							let sqlArr3 =[JSON.stringify(share_info),share_id];
							let sql3 = 'update qrj_user  set share_info = ?  where user_id= ?';
							let result3 = await sqlQuery.SysqlConnect(sql3,sqlArr3);
							if(result3.affectedRows ==1){
								updateFAlg =true
							}	
						}else{
							updateFAlg =true
						}
						let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
						let sqlArr1 =[openid,create_time];
						let sql1 = 'insert into qrj_user (user_id,create_time) values(?,?)';
						let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1);
						if(result1.affectedRows ==1 && updateFAlg){
							res.send({ 
								'code': 1,
								'msg': '数据记录成功',
								'data':{
									"openid":openid,
									"session_key":JSON.parse(body)['session_key'],
									"messageFlag":'0'
								}
							});
						}else{
							res.send({ 
								'code': 3,
								'msg': '数据记录失败',
								'data':''
							});
						}
					}else{
						let sqlArr4 =[openid];
						let sql4 = 'select * from  qrj_user where user_id = ? ';
						let result4 = await sqlQuery.SysqlConnect(sql4,sqlArr4);
						let msg2 =''
						if(result4[0]['message'] === null){
							msg2 =''
						}else{
							msg2= JSON.parse(result4[0]['message'])['msg']
						}
						if(result4[0]['user_name'] ==''  &&  result4[0]['tell'] !=''){
							res.send({ 
								'code': 4,
								'msg': '用户头像和用户名不存在',
								'data':{
									"openid":openid,
									"session_key":JSON.parse(body)['session_key'],
									"messageFlag":result4[0]['message_flag'],
									"message":msg2
								}
							});
						}else if(result4[0]['user_name'] !=''  &&  result4[0]['tell'] =='' ){
							res.send({ 
								'code': 5,
								'msg': '用户手机号不存在',
								'data':{
									"openid":openid,
									"session_key":JSON.parse(body)['session_key'],
									"messageFlag":result4[0]['message_flag'],
									"message":msg2
								}
							});
						}else if(result4[0]['user_name'] ==''  &&  result4[0]['tell'] =='' ){
							res.send({ 
								'code': 6,
								'msg': '用户手机号，用户名，用户头像都不存在！',
								'data':{
									"openid":openid,
									"session_key":JSON.parse(body)['session_key'],
									"messageFlag":result4[0]['message_flag'],
									"message":msg2
								}
							});
						}else{
							res.send({ 
								'code': 7,
								'msg': '用户信息完善！',
								'data':{
									"openid":openid,
									"session_key":JSON.parse(body)['session_key'],
									"messageFlag":result4[0]['message_flag'],
									"message":msg2
								}
							});
						}
						
					}
				}

			})

	}else{
		res.send({ 
			'code': 2,
			'msg': '参数不全',
			'data':''
		});
	}

}
//更新用户信息
let updateUser5 = async function (req,res) {
	let {name,avatarUrl,user_id} =req.body
	let sqlArr =[name,avatarUrl,user_id];
	let sql = 'update qrj_user  set user_name = ? , user_avatar_url= ? where user_id= ?';
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
//提交留言接口
let submitMsg =async function (req,res) { 
	let {msg,tell,user_id,name} =req.body
	let obj ={}
	let url='https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined'
	let access_token ="24.cdd4621376776827695134d8c1cbbf38.2592000.1620457856.282335-23946188"
	let request_url =url + "?access_token=" + access_token
	request({
		url: request_url,
		method: "POST",
		headers: {'content-type': 'application/x-www-form-urlencoded'},
		form:{'text': msg}
	},async function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body) // 请求成功的处理逻辑
			if(JSON.parse(body)['conclusion'] =='不合规'){
				res.send({ 
					'code': 0,
					'msg': JSON.parse(body)['data'][0]['msg']
				});
			}else{
				obj['msg'] =msg
				obj['tell']=tell
				obj['name']=name
				let mgs1 = tell.trim()== '' ? '2':'1'
				let sqlArr =[JSON.stringify(obj),mgs1,user_id];
				let sql = 'update qrj_user  set message = ? , message_flag= ? where user_id= ?';
				let result= await sqlQuery.SysqlConnect(sql,sqlArr);
				if(result.affectedRows==1){
					res.send({ 
						'code': 1,
						'msg': '提交告白宣言成功！'
					});
				}else{
					res.send({ 
						'code': 2,
						'msg': '提交告白宣言失败！'
					});
				}
			}	
		}
	});
	

}
//获取用户个人信息
let getPersonInfo =async function (req,res) { 
	let {user_id}=req.body
	let sqlArr =[user_id];
	let sql = 'select * from  qrj_user where user_id = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	if(result.length >0){
		res.send({ 
			'code': 1,
			'msg': '数据获取成功 ！',
			'data':result[0]
		});
	}else{
		res.send({ 
			'code': 0,
			'msg': '查询的用户不存在 ！',
			'data':''
		});
	}
}
//获取签到状态
let getSignStaus =async function (req,res) { 
	let {user_id}=req.body
	let sqlArr =[user_id];
	let sql = 'select * from  qrj_user where user_id = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	if(result.length>0){
		res.send({ 
			'code': 1,
			'msg': '获取状态成功 ！',
			'data':{
				'sign':JSON.parse(result[0]['sign'])
			}
		});
	}

}
//签到
let sign = async function (req,res) {
	let {date,user_id,sign_flag}=req.body
	let map ={
		'2021-05-17':0,
		'2021-05-18':1,
		'2021-05-19':2
	}
	
	let sqlArr =[user_id];
	let sql = 'select * from  qrj_user where user_id = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	let data ={}
	let sign =false
	let share_info_list = JSON.parse(result[0]['share_info'])
	if(result.length>0){
		// 正常签到
		if(sign_flag ){
			sign =true
		}else{
			//补签
			if( share_info_list.length >0 ){
				share_info_list.shift()
				sign =true
			}else{
				res.send({ 
					'code': 2,
					'msg': '您没有补签卡 ！',
					'data':''
				});
			}


		}
		if(sign){
			let newSign =JSON.parse(result[0]['sign'])
			let newCard =JSON.parse(result[0]['card'])
			
			if(newSign[map[date]]=='1'){
				res.send({ 
					'code': 3,
					'msg': '当天已经签到过了 ！',
					'data':''
				});
			}else{
				newSign[map[date]]='1'
				if(map[date] == 0){
					let prizeNum =await redisStrGet(6, 'dx')
					if(Number(prizeNum)>0){
						data['type']='1'
						data['prize']='小度熊笔记本'
						data['name'] =''
						data['adress']=''
						data['date']='2021.05.08-2021.06.08'
						prizeNum--;
						await redisStrSet(6, 'dx',prizeNum)
					}else{
						data['type']='1'
						data['prize']=''
						data['name'] =''
						data['adress']=''
						data['date']=''
					}

					
				}else if(map[date] == 1){
					let prizeList =JSON.parse(await redisStrGet(6, 'jbl'))
					if(prizeList.length>0){
						let code =prizeList.shift()
						data['type']='2'
						data['prize']='金伯利'
						data['date']='2021.05.08-2021.06.08'
						data['code']=code
						await redisStrSet(6, 'jbl',JSON.stringify(prizeList))
					}else{
						data['type']='2'
						data['prize']=''
						data['date']=''
						data['code']=''
					}
					
				}else if(map[date] == 2){
					let prizeList =JSON.parse(await redisStrGet(6, 'zds'))
					if(prizeList.length>0){
						let code =prizeList.shift()
						data['type']='2'
						data['prize']='周大生'
						data['date']='2021.05.08-2021.06.08'
						data['code']=code
						await redisStrSet(6, 'zds',JSON.stringify(prizeList))
					}else{
						data['type']='2'
						data['prize']=''
						data['date']=''
						data['code']=''
					}
				}
				newCard[map[date]]= data
				let sqlArr1 =[JSON.stringify(newSign),JSON.stringify(newCard),JSON.stringify(share_info_list),user_id];
				let sql1 = 'update qrj_user  set sign = ? , card = ?, share_info=?  where user_id= ?';
				let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1);
				if(result1.affectedRows ==1){
					res.send({ 
						'code': 1,
						'msg': '签到成功 ！',
						'data':data
					});
				}

			}
			
			
		}
	}
}
//提交信息
let dxsubmit =async function (req,res) {
	let {name,adress,user_id}=req.body
	
	let sqlArr =[user_id];
	let sql = 'select * from  qrj_user where user_id = ? ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	let data =JSON.parse(result[0]['card'])
	data[0]['name'] =name
	data[0]['adress']=adress
	let sqlArr1 =[JSON.stringify(data),user_id];
	let sql1 = 'update qrj_user  set  card = ? where user_id= ?';
	let result1= await sqlQuery.SysqlConnect(sql1,sqlArr1);
	if(result1.affectedRows ==1){
		res.send({ 
			'code': 1,
			'msg': '提交成功 ！',
			'data':''
		});
	}
}
//发送信息
let sendMsg =async function (req,res) { 
	
	
	let sqlArr=['1','2']
	let sql = 'select * from  qrj_user where message_flag=? or message_flag=?  ';
	let result = await sqlQuery.SysqlConnect(sql,sqlArr);
	let toTEll =[]
	let toNotell=[]
	let toMsg =[]
	if(result.length>0){
		result.forEach(function(val,index){
			let obj ={}
			if(val.message_flag=='1'){
				obj['mobile'] =JSON.parse(val.message)['tell']
				obj['content'] =JSON.parse(val.message)['msg']
				toTEll.push(obj)
			}else{
				toNotell.push(val.tell)
				toMsg.push(JSON.parse(val.message)['msg'])
			}
		})
	}

	toNotell.forEach(function(val,index){
		let obj ={}
		obj['mobile'] =val
		obj['content'] =toMsg[toMsg.length -index-1]
		toTEll.push(obj)
	})

	for(var i = 0; i < toTEll.length; i++){
		(function(i){
			let header ={
				"content-type": "application/json;charset=utf-8",
				"host":"smsv3.bj.baidubce.com",
				"x-bce-date":"2021-05-06T03:07:05Z",
				"Authorization":"bce-auth-v1/63374f58c0e646f2b5eb127371f5fbc9/2021-05-06T03:07:53Z/3678400/host;x-bce-date/aea6ecfa56cc18f53a3feb76c4c64fb51ac38f4be771cfbcf72ebe65f251f6e6"
			}
			let body={
				"mobile": toTEll[i].mobile,
				"template": "sms-tmpl-qewLpw80252",
				"signatureId": "sms-sign-hkcTgu02982",
				"contentVar": {
				  "content":toTEll[i].content,
				  "name": "朋友"
				}
			  }
			request({
				url:'http://smsv3.bj.baidubce.com/api/v3/sendSms?clientToken=e325ea68-02c1-47ad-8844-c7b93cafaeba',
				method: 'POST',
				body: JSON.stringify(body),
				headers: header,
			},async (err,result)=>{
				let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
				let sqlArr1 =[JSON.stringify(toTEll[i]),create_time];
				let sql1 = 'insert into send_msg_record (record,create_time) values(?,?)';
				await sqlQuery.SysqlConnect(sql1,sqlArr1);
			})
			
		})(i)

	}

	res.send('成功！')
	
	


	


}
//存储手机号
let saveTell =async function (req,res) {
	 
	let {encryptedData,session_key,iv,user_id}=req.body
	let sqlArr1 =[user_id];
	let sql1 = 'select * from  qrj_user where user_id = ? ';
	let result1 = await sqlQuery.SysqlConnect(sql1,sqlArr1);
	if(result1[0]['tell'] !==''){
		res.send({ 
			'code': 2,
			'msg': '手机号已存在！'
		});
	}else{
		let decodeData = Buffer.from(encryptedData, 'base64')
		let decodeIv =Buffer.from(iv, 'base64')
		let decodeSession_key=Buffer.from(session_key, 'base64')
		let data = encryptionSign(decodeData,decodeSession_key,decodeIv)
		let mobile = data.slice(data.indexOf('{'),data.indexOf('}')).split(':')[1].replace(/"/g,"")
		let sqlArr =[mobile,user_id];
		let sql = 'update qrj_user  set tell = ? where user_id= ?';
		let result= await sqlQuery.SysqlConnect(sql,sqlArr);
		if(result.affectedRows==1){
			res.send({ 
				'code': 1,
				'msg': '更新手机号成功！'
			});
		}else{
			res.send({ 
				'code': 0,
				'msg': '更新手机号失败！'
			});
		}
	}


	
	
}
//获取留言
let getMSg =async function(req,res){
	let sqlArr1 =['2'];
	let sql1 = 'select * from  qrj_user where message_flag = ? ';
	let result1 = await sqlQuery.SysqlConnect(sql1,sqlArr1);
	let result =[]
	if(result1.length >0){
		
		result1.forEach(function(val,index){
			let obj ={}
			obj['user_avatar_url'] =val['user_avatar_url']
			obj['msg'] =JSON.parse(val['message'])['msg']
			result.push(obj)
		})
		res.send({ 
			'code': 1,
			'msg': '留言查询成功！',
			'data':result
		});
	}else{
		res.send({ 
			'code': 1,
			'msg': '留言人数不足',
			'data':result
		});
	}

	
}

//唯一旅拍
let wylpSubmit = async function (req,res) {
	let {name,tell} = req.body;
	let create_time= new Date(+new Date() + 8 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
	
	let sqlArr =[name,tell,create_time];
	let sql = 'insert into wylp_form (name,tell,create_time) values(?,?,?)';;
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
	audi1Submit,
	jmgjSubmit,
	cfhySubmit,
	query1,
	download1,
	// 小程序接口
	getOpenid,
	updateUserinfo,
	getUserinfo,
	createGoodsList,
	getTeamInfo,
	getCommand,
	joinTeam,
	updateTeamName,
	getRankingList,
	getTeamzy,
	task,
	ztyluckDraw,
	getPrize,
	getPhb,
	zbcj,
	//520接口
	userLogin,
	updateUser5,
	submitMsg,
	getPersonInfo,
	getSignStaus,
	sign,
	dxsubmit,
	sendMsg,
	saveTell,
	getMSg,
	wylpSubmit
};
