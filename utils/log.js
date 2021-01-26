/**
 * 日志记录
 */
const mongoose = require('../common/db').mongoose;
const linkMongo = require('../common/db').linkMongo;

const schema = {
	ip: {type: String, required: false}, // 访问者的ip
	method: {type: String, required: false}, // 调用方法
	time: {type: Number, required: false}, // 响应时间
	code: {type: Number, required: false}, // 状态码
};

const collectionName = 'logs';
const LogSchema = mongoose.Schema(schema);
const Logs = linkMongo.model(collectionName, LogSchema);

module.exports = Logs;