const sqlQuery = require('../db/mysql')
const util =require('../utils/util')
const redis =require('../db/redis').redisClient

queryWinInfo = async function (req,res) {
    let sql =`select * from wining_info where device_info =?                                                                                                                                                                                                                                                                                          `
    let sqlArr =[username,username,username]

}
insertWinInfo = async function (req,res) {
    let sql = `insert into wining_info(device_info,prize_info,count,create_time) values(?,?,?,?)`;
    let sqlArr =['1111111','华为mate30',2,'']
    let result = await  sqlQuery.SysqlConnect(sql,sqlArr)
    if(result.affectedRows ==1){
        res.send({
            'code':200,
            'msg':'记录成功'
        })
    }else{
        res.send({
            'code':400,
            'msg':'记录失败'
        })
    }
    
}
submit_info = async function (req,res) { 
    let param= req.body
    console.log(param)
    let data = util.formatData(param.form_info) 
    let company_name =param.company_name
    let create_time =util.getDateTime()
    let sql = `insert into form_info(company_name,form_info,create_time) values(?,?,?)`;
    let sqlArr =[company_name,data,create_time]
    let result =await sqlQuery.SysqlConnect(sql,sqlArr)
    if(result.affectedRows ==1){
        res.send({
            'code':200,
            'msg':'数据提交成功'
        })
    }else{
        res.send({
            'code':400,
            'msg':'数据提交失败'
        })
    }
    
 }
 //抽奖
luckDraw =function (req,res) { 



 }
module.exports={
    submit_info
    
}