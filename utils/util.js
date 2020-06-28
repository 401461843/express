const moment = require('moment')
module.exports ={
    //生成随机数
    rand:function (min,max) {
        return  Math.floor(Math.random()*(max-min))+min
      },
    formatDate:function () {
      return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    },
    formatData:function (param) { 
        var data=[]
        for(key in param ){
            var obj ={}
            obj[key] =param[key]
            data.push(obj)
        }
        return JSON.stringify(data)
     },
     getDateTime:function () {
          var date =new Date()
          var year = date.getFullYear();
      
          var month = date.getMonth() + 1;
      
          var day = date.getDate();
      
          var hh = date.getHours();
      
          var mm = date.getMinutes();
      
          var ss = date.getSeconds();
      
          return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss; 
      }
      
    
}