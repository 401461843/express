var express = require('express');
var router = express.Router();
var api =require('../controllers/apiController');

/* GET home page. */
router.post('/insertWinInfo', api.insertWinInfo);
router.post('/test', api.test);
//抽奖
router.post('/luckDraw', api.luckDraw);
//提交手机号领奖
router.post('/submit', api.submit);
module.exports = router;