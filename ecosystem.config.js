module.exports = {
  apps : [{
    script: './bin/www',
    watch: '.',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : ['116.62.121.90'],
      ref  : 'origin/master', 
      repo : 'git@github.com:401461843/express.git',
      path : '/home/express',
      'pre-deploy-local': '',
      'post-deploy' : 'cnpm install && git pull  && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
