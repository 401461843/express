var express = require('express');
var router = express.Router();
var api =require('../controllers/apiController');

/* GET home page. */
router.post('/insertWinInfo', api.insertWinInfo);
router.post('/test', api.test);
//抽奖
router.get('/luckDraw', api.luckDraw);
module.exports = router;