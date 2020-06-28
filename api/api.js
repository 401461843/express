var express = require('express');
var router = express.Router();
var api =require('../controllers/apiController')


//数据提交
router.post('/submit_info', api.submit_info);

module.exports = router;