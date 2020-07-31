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
module.exports = router;