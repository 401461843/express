var express = require('express');
var router = express.Router();

/* GET home page. */
//七夕
router.get('/', function(req, res) {
	res.render('index.html');
});
router.get('/lfx', function(req, res) {
	res.render('lfx.html');
});
router.get('/game', function(req, res) {
	res.render('game.html');
});


//苏州
router.get('/zbh', function(req, res) {
	res.render('zbh.html');
});
module.exports = router;
