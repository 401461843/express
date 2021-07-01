var express = require('express');
var router = express.Router();
var api =require('../controllers/apiController');

/* GET home page. */
//抽奖
router.post('/luckDraw', api.luckDraw);
//提交手机号领奖


//下载
router.post('/download', api.download);

router.post('/getAccessToken', api.getAccessToken);
// router.post('/test2', api.test2);
router.post('/hqjsLuckDraw', api.hqjsLuckDraw);


//小程序接口
//获取用户唯一id
router.post('/getOpenid', api.getOpenid);
//更新用户信息
router.post('/updateUserinfo', api.updateUserinfo);
//查询用户信息
router.post('/getUserinfo', api.getUserinfo);
//生成年货列表
router.post('/createGoodsList', api.createGoodsList);
//获取战队信息
router.post('/getTeamInfo', api.getTeamInfo);
//加入战队信息
router.post('/joinTeam', api.joinTeam);
//更改战队名
router.post('/updateTeamName', api.updateTeamName);
//生成口令的接口
router.post('/getCommand', api.getCommand);
// 获取排行列表
router.post('/getRankingList', api.getRankingList);
// 获取战队主页内容
router.post('/getTeamzy', api.getTeamzy);
// 完成任务接口
router.post('/task', api.task);
// // 专题页抽奖接口
router.post('/ztyluckDraw', api.ztyluckDraw);
// 专题页抽奖接口
router.post('/getPrize', api.getPrize);
// 专题页抽奖接口
router.post('/getPhb', api.getPhb);
//直播提交
router.post('/zbcj', api.zbcj);
//520活动
//用户信息记录
router.post('/userLogin', api.userLogin);
//更新用户
router.post('/updateUser5', api.updateUser5);
//提交告白
router.post('/submitMsg', api.submitMsg);
//获取用户信息
router.post('/getPersonInfo', api.getPersonInfo);
//获取用户 签到状态
router.post('/getSignStaus', api.getSignStaus);
//用户签到
router.post('/sign', api.sign);
//用户信息提交
router.post('/dxsubmit', api.dxsubmit);
//下发短信
router.post('/sendMsg', api.sendMsg);
//保存手机号
router.post('/saveTell', api.saveTell);
//获取 留言
router.get('/getMSg', api.getMSg);

//唯一旅拍
router.post('/wylpSubmit', api.wylpSubmit);
//直播抽奖
router.get('/zbcj1', api.zbcj1);
//获取券码
router.post('/getBrandCode', api.getBrandCode);
//提交表单
router.post('/tjbd', api.tjbd);
//提交表单
router.post('/hfjgz', api.hfjgz);
//提交表单
router.post('/queryQm', api.queryQm);

module.exports = router; 