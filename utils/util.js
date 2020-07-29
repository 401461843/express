const moment = require('moment');

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
    
};
 