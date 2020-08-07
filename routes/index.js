var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index.html');
});
router.get('/zbh', function(req, res) {
	res.render('zbh.html');
});
module.exports = router;
