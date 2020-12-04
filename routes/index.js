var express = require('express');
var router = express.Router();

/* GET home page. */
//七夕
router.get('/home/qx', function(req, res) {
	res.render('index.html');
});
router.get('/home/byss', function(req, res) {
	res.render('byss.html');
});
router.get('/home/audi', function(req, res) {
	res.render('audi.html');
});
router.get('/home/jmgj', function(req, res) {
	res.render('jmgj.html');
});

// router.get('/lfx', function(req, res) {
// 	res.render('lfx.html');
// });
// router.get('/game', function(req, res) {
// 	res.render('game.html');
// });
// router.get('/lfx1', function(req, res) {
// 	res.render('lfx1.html');
// });
// router.get('/game1', function(req, res) {
// 	res.render('game1.html');
// });


// //苏州
// router.get('/zbh', function(req, res) {
// 	res.render('zbh.html');
// });
//查询
router.get('/queryjmgj', function(req, res) {
	res.render('queryjmgj.html');
});
router.get('/query', function(req, res) {
	res.render('query.html');
});
router.get('/', function(req, res) {
	res.render('index.html');
});
router.get('/home/jzj', function(req, res) {
	res.render('jzj.html');
});
router.get('/home/sp', function(req, res) {
	res.render('sp.html');
}); 
router.get('/home/cfhy', function(req, res) {
	res.render('cf.html');
}); 
module.exports = router;
