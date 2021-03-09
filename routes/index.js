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
router.get('/home/update', function(req, res) {
	res.render('update.html');
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
router.get('/home/szysf', function(req, res) {
	res.render('szysf.html');
}); 
router.get('/home/czysf', function(req, res) {
	res.render('czysf.html');
}); 
router.get('/home/audi1', function(req, res) {
	res.render('audi1.html');
});
router.get('/home/mainHome', function(req, res) {
	res.render('nhjzhc.html');
});
router.get('/home/rule', function(req, res) {
	res.render('rule.html');
});
//苏分 1314 
router.get('/home/sfqrj', function(req, res) {
	res.render('1314.html');
});
module.exports = router;
