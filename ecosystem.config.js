module.exports = {
  'apps' : [{
    'script': './bin/www', //改成 ‘./bin/wwww’ 之后才暴露出3000端口，才难被访问
    'watch': '.',
    'name':'express',
    'instances': "max",
    'exec_mode': "cluster",
    'autorestart':true,
    'env': {
      'NODE_ENV': 'development'
    },
    'env_production' : {
      'NODE_ENV': 'production'
    },
    "error_file": "./logs/pm2_express_err.log",
    "out_file": "./logs/pm2_express_out.log",
  //   In cluster mode, each cluster has his own log files. You can use the merge options to gather all logs into a single file
    "merge_logs": true, 
  //   "log_type"："json"
    "log_date_format": "YYYY-MM-DD HH:mm:ss Z"
  }],

  'deploy' : {
    'production' : {
      'user' : 'root',
      'host' : ['116.62.121.90','106.12.69.208'],//这里可以多个远程服务器地址
      'ref'  : 'origin/master', 
      'repo' : 'git@github.com:401461843/express.git',
      'path' : '/home/express',
      "ssh_options": "StrictHostKeyChecking=no",//第一次连接服务器时候避免出现大量的提示
      'pre-deploy-local': '',
      "pre-deploy": "git pull",//解决更新无法拉取github最新的commit
      'post-deploy' : 'cnpm install  && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
