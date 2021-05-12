const moment = require('moment');
const fs = require('fs');
const os = require('os');

module.exports ={
	//生成随机数
	rand: function (min, max) {
		return Math.floor(Math.random()*(max-min))+min;
	},
	formatDate: function () {
		return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	},
	customForeach: async (arr, callback) => {
		const length = arr.length;
		const O = Object(arr);

		let k = 0;

		while (k < length) {
			if (k in O) {
				const kValue = O[k];

				await callback(kValue, k, O);
			}
			k++;
		}
	},
	mysqlDatetime: function (val) {
		var date = new Date(val);

		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' 
						+ (date.getHours()>9?date.getHours():'0'+date.getHours()) 
						+ ':' + (date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes()) 
						+ ':' + (date.getSeconds()>9?date.getSeconds():'0'+date.getSeconds()); 
	},
	deleteall(path) {
		var files = [];

		if (fs.existsSync(path)) {
			files = fs.readdirSync(path);
			files.forEach(function(file) {
				var curPath = path + '/' + file;

				if (fs.statSync(curPath).isDirectory()) { // recurse
					this.deleteall(curPath);
				} else {
					fs.unlinkSync(curPath);
				}
			});
		
		}
	},
	deleteFile(path) {
		if (fs.existsSync(path)) {
			fs.unlinkSync(path);
		}
	},
	getIPAdress() {
		var interfaces = os.networkInterfaces();

		for (var devName in interfaces) {
			var iface = interfaces[devName];

			for (var i = 0; i < iface.length; i++) {
				var alias = iface[i];

				if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
					return alias.address;
				}
			}
		}
    
	},
	makeJm() {
		let str ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		let randNumber='';

		let qm ='';

		for (var i =0 ; i<6; i++) {
			randNumber=Math.floor(Math.random() * str.length);
			qm+=str.split('')[randNumber];
		}
		return qm;
	},
	objSort(property, arr) {
		var sort1=function (a, b) {
			var value1 = a[property];
			var value2 = b[property];

			return value2-value1;
		};

		return arr.sort(sort1);	  
	},
	getDateTime() {
		var date=new Date();   
		var year=date.getFullYear(); //获取当前年份   
		var month=date.getMonth()+1; //获取当前月份   
		var dat=date.getDate(); //获取当前日   
		var hour=date.getHours(); //获取小时   
		var minutes=date.getMinutes(); //获取分钟   
		var second=date.getSeconds(); //获取秒   

		return year+'-'+month+'-'+dat+' '+hour+':'+minutes+':'+second;
	},
	
};
 