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
router.post('/luckDrawZy', api.luckDrawZy);
//查询数据
router.post('/query', api.query);
//下载
router.post('/download', api.download);
module.exports = router; 