const moment = require('moment');
const fs = require('fs');

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
    
};
 