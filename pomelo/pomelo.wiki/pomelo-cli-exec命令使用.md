**安装**： sudo npm install -g pomelo-cli

master server 设置 : app.enable('systemMonitor'); //设置后 pomelo-cli 才可以使用

```
app.configure('production|development', 'master', function() {
     app.enable('systemMonitor');
}
```

使用命令
```
pomelo-cli -h host -P port -u username -p password  
```
[ host 和 port 是 master.json配置文件中的值 ]
[ username 和 password 是adminUser.json配置文件里的用户名和密码]
默认的pomelo-cli登录参数

```
pomelo-cli -h 127.0.0.1 -P 3005 -u monitor -p monitor

```


exec 命令

show servers 查看服务器列表

例如 : 我要设置data-server-1 的数据, 就 执行 use data-server-1  [use all 不行]


```
game-server/pomelo/node_modules/pomelo-admin/lib/modules/scripts.js_

```

```
//最终执行入口
Module.prototype.monitorHandler = function(agent, msg, cb) {
    //你的脚本里 可以用这些npm module 
    var context = {
        app: this.app,
        require: require,
        os: require('os'),
        fs: require('fs'),
        process: process,
        util: util
    };



    try {//node.js VM 模块
        vm.runInNewContext(msg.script, context);

        var result = context.result;
        if (!result) {
            cb(null, "script result should be assigned to result value to script module context");
        } else {
            cb(null, result);
        }
    } catch (e) {
        cb(null, e.toString());
    }

    //cb(null, vm.runInContext(msg.script, context));
};

```


```

/**
 * //举例 : 修改数据库和内存
 * pomelo app 对象要挂上bearcat, 才可以像下面那样引用bearcat. 其他模块也如此.
 */
var bearcat = app.bearcat; // bearcat 介绍请看: https://github.com/bearcatjs/bearcat 管理自定义module.
var charPo = bearcat.getBean('charPo'); //操作内存中角色信息模块

var charId = 100000000; //角色Id
var charInfo;

charInfo = charPo.getChar(charId); //获取内存中的角色信息

function updateById (tName,obj){
    var sql = "update `" + tName + "` set ";
    var id = obj.id;
    var temp1 = [];
    var dbData = [];
    for(var myKey in obj){
        if(myKey != 'id' && typeof obj[myKey] != 'function'){
            temp1.push(myKey + " = ?");
            dbData.push(obj[myKey]);
        }
    }

    sql += temp1.join(',');
    sql += " where id = ?";
    dbData.push(id);
    return {sql : sql,dbData : dbData};
}

var tName = 'character';


var obj = {//要修改的信息对象
    id : charId,
    name : "Pomelo",
    gold : 888888
}

//在app.js 文件中 设置global.app.mysqlModule = require('mysql'); //否则不能使用mysql模块
var mysql = app.mysqlModule; 

//config/mysql.js 配置 同上 设置 global.app.mysqlConfig = require('./config/mysql.js'); mysql的配置信息
var conf = app.mysqlConfig; 

var connection = mysql.createConnection({//创建数据库连接
    host     : conf.host,
    user     : conf.user,
    password : conf.password,
    database : conf.database
});

connection.connect();

var temp = updateById(tName,obj);
var sql = temp.sql;//sql语句
var dbData = temp.dbData;//参数

connection.query(sql,dbData,function(err){ //执行sql
    if(!err){
        for(var key in charInfo){
            if(charInfo.hasOwnProperty(key)){
                charInfo[key] = obj[key];
            }
        }
        charPo.setChar(charInfo); //设置内存数据
    }
});

connection.end(); //关闭连接

result = obj; //赋值给result 输出obj

```