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

//小程序接口
router.post('/getAccessToken', api.getAccessToken);
// router.post('/test2', api.test2);
router.post('/hqjsLuckDraw', api.hqjsLuckDraw);
// 研讨会提交
router.post('/submityYth', api.submityYth);
//audi提交
router.post('/audiSubmit', api.audiSubmit);
//金门国际提交
router.post('/jmgjSubmit', api.jmgjSubmit);

//
module.exports = router; 