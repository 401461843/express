module.exports = {
  apps : [{
    script: 'app.js',
    watch: '.',
    env: {
      COMMON_VARIABLE: 'true'
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
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
