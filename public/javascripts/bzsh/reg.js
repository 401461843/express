// 验证手机
const phoneReg = function (tel) {
  let phone = /^1\d{10}$/i;
  if (tel === '') {
    message('手机号不能为空');
    return false;
  } else if (!phone.test(tel)) {
    message('请输入正确的手机号');
    return false;
  }
  return true;
};
// 验证码验证
const fourCodeReg = function (code) {
  let reg = /^\d{1,18}$/;
  if (reg === '') {
    message('请输入验证码');
    return false;
  } else if (reg.test(code)) {
    return true;
  } else {
    message('正确输入验证码');
    return false;
  }
};
// 姓名验证
const nameReg = function (name) {
  let reg = /^[\u4E00-\u9FA5A-Za-z]+$/;
  if (
    typeof (name) === 'undefined' ||
    name === null ||
    trim(name) === ''
  ) {
    message('请输入姓名！');
    return false;
  } else if (reg.test(name)) {
    return true;
  } else {
    message('请输入正确姓名！');
    return false;
  }
};
// 邮箱验证
const emailReg = function (email) {
  let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (email === '') {
    message('请输入邮箱号！');
    return false;
  } else if (reg.test(email)) {
    return true;
  } else {
    message('请输入正确邮箱号！');
    return false;
  }
}
// 中文验证
const addressReg = function (name, title) {
  let reg = /^[\u4E00-\u9FA5]+$/;
  if (name === '') {
    message('请输入' + title);
    return false;
  } else if (reg.test(name)) {
    return true;
  } else {
    message('请输入正确的' + title);
    return false;
  }
};
// 判断是否是数字
const numN_ = function (num, title) {
  let reg = /^(0\.?\d{0,2}|[1-9]\d*\.?\d{0,2})$/;
  if (num === '') {
    message('请输入数据！');
    return false;
  }
  if (!reg.test(num)) {
    message('请输入正确数据');
    return false;
  }
  return true;
};
// 删除左右两端的空格
const trim = function (str) {
  console.log(str)
  return str.replace(/(^\s*)|(\s*$)/g, '');
};
// 删除左边的空格
const ltrim = function (str) {
  return str.replace(/(^\s*)/g, '');
};
// 删除右边的空格
const rtrim = function (str) {
  return str.replace(/(\s*$)/g, '');
};
// 验证是否为空
const isNull = function (val, title) {
  if (
    typeof (val) === 'undefined' ||
    val === null ||
    trim(val) === ''
  ) {
    message(title);
    return false;
  }
  return true;
};
// 金额正则
const isMoney = function (val, title) {
  var moneyExp = /^([1-9]{1}[0-9]{0,7}|0){1}(.[0-9]{1,2}){0,1}$/;
  if (val === '') {
    message('请输入金额！');
    return false;
  }
  if (!moneyExp.test(val)) {
    message('请输入正确金额！');
    return false;
  }
  return true;
}
// 正则表达式
const reg = function (val, exp, title) {
  if (!exp.test(val)) {
    message(title);
    return false;
  } else {
    return true;
  }
}
// 富文本图片居中
const richImg = function (title) {
  return new Promise((resolve, reject) => {
    let str = title.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"');
    resolve(str);
  })
}
const getTimeF = function (time) {
  let time1 = time.replace(/-/g, '/')
  let day = new Date(time1).getTime(); // 苹果 /

  if (!day) {
    time1 = time1.replace(/\//g, '-')
    day = new Date(time1).getTime(); // 安卓 -
  }
  if (!day) {
    day = disposeTime(time1) // 苹果 24:00:00 报错
  }
  return day
}
const disposeTime = function (a) {
  a = a || new Date().getTime() + 24 * 60 * 60 * 1000;
  let timeArr0 = a.split(' ');
  let timeArr1 = timeArr0[1].split(':');
  return new Date(timeArr0[0]).getTime() + timeArr1[0] * 3600000 + timeArr1[1] * 60000 + timeArr1[2] * 1000 - 8 * 3600 * 1000;
}