var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var indexRouter = require('./routes/index');
var apiRouter = require('./api/api');
var app = express();
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var {redisStrGet, redisStrAll}=require('./db/redis');
var sqlQuery = require('./db/mysql');
var util =require('./utils/util');
// var getData =async function () { 
// 	let redisData = await redisStrAll(2);
// 	let tell ='';
// 	let prize='';
// 	let time ='';
// 	let sqlArr =[];
// 	let sql = 'insert into win_prize_record (tell,prize,time) values(?,?,?)';

// 	util.customForeach(redisData, async function (val) { 
// 		let record =JSON.parse(await redisStrGet(2, val));

// 		tell = val;
// 		prize=record.prize;
// 		time =record.date;
// 		sqlArr =[tell, prize, time];
// 		await sqlQuery.SysqlConnect(sql, sqlArr);
// 	});
// };
var szgetData =async function () { 
	let redisData = await redisStrAll(6);
	let company ='';
	let name='';
	let tell ='';
	let createTime='';
	let sqlArr =[];
	let sql = 'insert into zbh_form (company,name,tell,create_time) values(?,?,?,?)';

	util.customForeach(redisData, async function (val) { 
		let record =JSON.parse(await redisStrGet(6, val));

		company = record.company;
		name=record.name;
		tell =record.tell;
		createTime=record.create_time;
		sqlArr =[company, name, tell, createTime];
		await sqlQuery.SysqlConnect(sql, sqlArr);
	});
};
var scheduleCronstyle = ()=>{
	//每分钟的第30秒定时执行一次:
	schedule.scheduleJob('0 25 9 * * *', ()=>{
		szgetData(); 
	}); 
};
//设置定时任务

scheduleCronstyle();

// view engine setup

app.set('views', path.join(__dirname, '/views'));
app.engine('.html', ejs.__express);  
app.set('view engine', 'html');

app.all('*', function(req, res, next) {
	//设置允许跨域的域名，*代表允许任意域名跨域
	res.header('Access-Control-Allow-Origin', '*');
	//允许的header类型
	res.header('Access-Control-Allow-Headers', 'Content-type');
	//跨域允许的请求方式
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS,PATCH');
	//可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。
	res.header('Access-Control-Max-Age', 1728000);//预请求缓存20天
	next(); 
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/'))); //路径得设置为根路径，页面中的css才能以app.js 出发的路查找

app.use('/', indexRouter);
app.use('/api', apiRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
