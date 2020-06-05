整个项目部署上线过程
1. 在本地机器上下载 git,node,npm,cnpm,pm2 ，建立本地npm 与github的ssh链接
2. 在要部署的机器上下载 git,node,npm,cnpm,pm2，建立本地npm 与github的ssh链接
3. 在项目根目录终端使用 pm2 ecosystem 命令生成pm2 配置文件

centos 安装 cnpm： npm install -g cnpm --registry=https://registry.npm.taobao.org