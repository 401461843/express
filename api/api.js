var express = require('express');
var router = express.Router();
var api =require('../controllers/apiController');

/* GET home page. */
//抽奖
router.post('/luckDraw', api.luckDraw);
//提交手机号领奖
router.post('/submit', api.submit);
//放弃领奖
router.post('/giveUp', api.giveUp);
//提交表单信息
router.post('/test', api.test);
//获取用户信息接口
router.post('/getUerCount', api.getUserInfo);
//苏州数据提交接口
router.post('/szSubmit', api.szSubmit);
//老凤祥提交
router.post('/lfxSubmit', api.lfxSubmit);
//老凤祥提交
router.post('/lfxFx', api.lfxFx);
//老凤祥分享提交
router.post('/lfxFxsubmit', api.lfxFxsubmit);
//主页抽奖
router.post('/jzjluckDraw', api.jzjluckDraw);
//家装节提交
router.post('/submityJzj', api.submityJzj);

//查询数据
router.post('/query', api.query);
//下载
router.post('/download', api.download);
router.post('/query1', api.query1);
//下载
router.post('/download1', api.download1);
//小程序接口
router.post('/getAccessToken', api.getAccessToken);
// router.post('/test2', api.test2);
router.post('/hqjsLuckDraw', api.hqjsLuckDraw);
// 研讨会提交
router.post('/submityYth', api.submityYth);
//audi提交
router.post('/audiSubmit', api.audiSubmit);
router.post('/audi1Submit', api.audi1Submit);
//金门国际提交
router.post('/jmgjSubmit', api.jmgjSubmit);
//超凡宏宇提交
router.post('/cfhySubmit', api.cfhySubmit);

//小程序接口
//获取用户唯一id
router.post('/getOpenid', api.getOpenid);
//更新用户信息
router.post('/updateUserinfo', api.updateUserinfo);
//查询用户信息
router.post('/getUserinfo', api.getUserinfo);
//生成年货列表
router.post('/createGoodsList', api.createGoodsList);
//获取战队信息
router.post('/getTeamInfo', api.getTeamInfo);
//加入战队信息
router.post('/joinTeam', api.joinTeam);
//更改战队名
router.post('/updateTeamName', api.updateTeamName);
//生成口令的接口
router.post('/getCommand', api.getCommand);
// 获取排行列表
router.post('/getRankingList', api.getRankingList);
// 获取战队主页内容
router.post('/getTeamzy', api.getTeamzy);
// 完成任务接口
router.post('/task', api.task);


module.exports = router; 