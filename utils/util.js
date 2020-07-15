const moment = require('moment');

module.exports ={
	//生成随机数
	rand: function (min, max) {
		return Math.floor(Math.random()*(max-min))+min;
	},
	formatDate: function () {
		return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	},
    
};
