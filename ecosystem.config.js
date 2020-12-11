module.exports = {
	'apps': [{
		'script': './bin/www', //改成 ‘./bin/wwww’ 之后才暴露出3000端口，才难被访问
		'watch': '.',
		'name': 'express',
		'instances': 'max',
		'exec_mode': 'cluster',
		'autorestart': true,
		'env': {
			'NODE_ENV': 'development',
		},
		'env_production': {
			'NODE_ENV': 'production',
		},
		'error_file': './logs/pm2_express_err.log',
		'out_file': './logs/pm2_express_out.log',
		//   In cluster mode, each cluster has his own log files. You can use the merge options to gather all logs into a single file
		'merge_logs': true, 
		//   "log_type"："json"
		'log_date_format': 'YYYY-MM-DD HH:mm:ss Z',
	}],


};
