var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html')
});
router.get('/qc', function(req, res, next) {
  res.render('qc.html')
});
module.exports = router;
