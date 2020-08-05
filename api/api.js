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
router.post('/getUerCount',api.getUserInfo)
module.exports = router;