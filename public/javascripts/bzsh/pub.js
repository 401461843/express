/**
 * author:kevin
 * date:2016-12-02
 * function:pub
 */
var mobileExp = /^1\d{10}$/i;//手机号码正则
var passwordExp = /^(?![^a-zA-Z]+$)(?!\D+$)[0-9a-zA-Z]{6,16}$/;//密码正则
var nameExp = /^[\u4E00-\u9FA5]{2,5}$/;//姓名正则
var characterExp = /^[\u4E00-\u9FA5]*$/;//文字正则
var idcardExp=/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;//身份证号码验证
var amountExp = /^[0-9]*[1-9][0-9]*$/;//正整数金额
var messageExp = /^[0-9]{4}$/;//验证码正则
var zhshExp=/^[1-9]\d*$/;//验证正整数
var codeExp = /^[0-9]{6}$/;//验证码正则
var bankExp=/^(\d{16}|\d{19})$/;//银行卡号正则
var moneyExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/;//金额正则s
var numberExp= /^[1-9][0-9]*$/;
var emailExp=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var qdcodeExp=/^[A-Z]{2}[0-9]{3,6}$/;  //SH001  SH001001
//var sloganExp=/^[\u4e00-\u9fa5，。！、,.??!a-zA-Z\d]+$/;
var sloganExp=/^[\u4e00-\u9fa5，。！、,.!@？?:：%%％\(\)\（\）a-zA-Z\d]+$/;
//var sloganExp=/^[\u4e00-\u9fa5，。！、,.!@？?:：a-zA-Z\d]+$/;
//var sloganExp=/^[\u4e00-\u9fa5]|[_]|[a-z]|[A-Z]|[0-9]|[\p]+$/;
//var sloganExp=/^[a-zA-Z0-9\u4e00-\u9fa5\,\.\。\?\#\"\'\“\”\:\：\!\！\@\@\-\_]+$/g;
//var emojiExp= /\ud83d[uD800-uDBFF][udc00-udfff]/;
//[\ud83c\udc00-\ud83c\udfff]|[\ud83d\udc00-\ud83d\udfff]|[\u2600-\u27ff]
///[\uD800-\uDBFF][\uDC00-\uDFFF]/g
//阻止表单提交
function formNo(){
	$("form").submit(function(e){
		e.preventDefault();
	});
}
//正则表达式
function reg(val,exp){
	if( !exp.test(val) ){
		return false;
	}
	else{
		return true;
	}
}
//判断是否为空
function is_null(val){
	if(typeof(val) == undefined){
		return true;
	}else if(val == null){
		return true;
	}else if($.trim(val) == ""){
		return true;
	}else{ 
		return false;
	}
	
}
//去掉两端空格
function trim(val){
	return val.replace(/(^\s*)|(\s*$)/g,"");
}
//判断正整数正则
function is_zhsh(val){
	return reg(val,zhshExp);
}
//判断真实姓名正则
function is_character(val){
	return reg(val,characterExp);
}
//判断文字正则
function is_name(val){
	return reg(val,nameExp);
}
//判断手机正则
function is_mobile(val){
	return reg(val,mobileExp);
}
//判断是否有标签符号
function is_slogan(val){
	return reg(val,sloganExp);
}
//判断借款计算器的万元数是否是正整数
function is_number(val){
	return reg(val,numberExp);
}
//判断是否为渠道码
function is_qdcode(val){
	return reg(val,qdcodeExp);
}
//判断密码正则
function is_password(val){
	return reg(val,passwordExp);
}
//判断验证码正则
function is_message(val){
	return reg(val,messageExp);
}
//判断身份证号码正则
function is_cert_no(val){
	return reg(val,idcardExp);
}
//判断金额
function is_amount(val){
	return reg(val,amountExp);
}
//判断验证码正则
function is_code(val){
	return reg(val,codeExp);
}
//判断银行卡号正则
function is_bank(val){
	return reg(val,bankExp);
}

//判断金额正则
function is_money(val){
	return reg(val,moneyExp);
}

//获取url地址
function getHP(){
	return "";
}

// 获取cookie
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

//截取参数
var Q = (function() {
	var qs = (location.search.length > 0 ? location.search.substring(1) : '');

	var args = {};

	var items = qs.split('&');
	var item = null,
		key = null,
		value = null;

	for (var i = 0; i < items.length; i ++) {
		item = items[i].split('=');
		key = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		args[key] = value;
	}
	return args;
})();

//totst2秒自动 消失
function autoModal(){
	setTimeout(function(){
		$("#tipModal").hide();
	}, 2000);
}
