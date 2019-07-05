#pomelo-robot
pomelo-robot 是一个用来对pomelo游戏框架进行性能测试的工具，也可以测试其他基于socket.io的服务的性能。
本模块可以采用单机测试模式，也可以采用分布式测试模式。

#目的
为了能对游戏项目进行性能对比分析与自动化操作，同时为游戏服务器提供机器人的功能和指令配置方式对游戏服务器进行测试。
目前主要考虑二种功能：运行简单指令的机器人和多线程的性能测试。后者依赖于前者的功能实现，同时还可能考虑输出性能分析报告。
pomelo-robot 模块通过沙箱的方式执行用户自定义的Javascript脚本，运行中各客户端会自动把数据汇报给主节点，
主节点把所有节点的测试数据进行清洗与合并，算出最大最小及平均响应时间等统计数据，然后定时发关给内置的HTTP服务器进行界面展示。

#模块结构

模块内部运行结构如下：

![boardcast result](http://pomelo.netease.com/resource/documentImage/Robot.png) 

Master负责启动各Agent客户端，同时在界面展示报告统计中心与数据来源等相关配置。<br/>
Agent负责启动游戏客户端的连接及运行自定义脚本同时向Master汇报运行数据。


##使用示例
新建NODEJS测试工程,工程目录结构如下图所示：<br/>
![boardcast result](http://pomelo.netease.com/resource/documentImage/Robot-demo.png) <br/>
安装依赖库<br/>
npm install pomelo-robot
###app.json配置
app.json分为二种运行环境本地开发或线上测试，文件内容如下：
``` javascript
{
  "dev":
  {
  "master":{"host": "127.0.0.1","port":8888,"webport":8889},
  "apps":[{"host":"127.0.0.1","port":3050}],
  "mysql":{"host":"pomelo.163.com","user":"xy","password":"dev","database":"Pomelo"},
  "clients":["127.0.0.1"]
  },
  "prod":
  {
  "master":{"host": "app47v2.photo.163.org","port":8888,"webport":8889},
  "apps":[{"host":"mon2.photo.163.org","port":3051}],
  "mysql":{"host":"app56v1.photo.163.org","user":"xy","password":"dev","database":"Pomelo"},
  "clients":["127.0.0.1","app47v3.photo.163.org","app47v4.photo.163.org"]
  }
}
```
master：主服务器的IP，客户端通信端口，WEB界面端口。<br/>
apps：应用服务器即游戏服务器的对外提供的接口，支持多台服务器配置，客户端会均衡的连接各服务器。<br/>
mysql：配置测试用的数据来源。<br/>
clients：测试客户端，线上运行时采用ssh运行时，此模式需要各机器配置同样环境无密码的ssh登录。<br/>
###实现自定义脚本配置
库本身对用户提供Iuser对象和robot对象，Iuser示例中主要包括用户名和密码，robot采用event的模式支持如pomele client类型的request和on方法。<br/>
实现自定义脚本LORD.JS。
``` javascript
var login = function(){
  var data = {route:'connector.loginHandler.login', username:Iuser.username, password:Iuser.passwd};
  robot.request(data,loginRes,true);
};
/**
 * 处理登录请求
 */
var loginRes = function(data){
  //console.log('longined %j',data);
};

login();

```
上面代码运行在沙箱引擎中，首先登录游戏服务器，成功后会回调loginRes函数，用户可以继续后续的相关操作，这里不再给出具体代码。<br/>
###配置启动文件main.js
示例启动文件main.js因为本身简单，直接负责了根据参数判断启动master服务或agent服务。<br/>
master服务负责启动agent服务并传入相关的启动参数，包括（agent名称，运行的机器人数量）<br/>
整体代码如下：
``` javascript
var Robot = require('pomelo-robot').Robot;
//服务相关配置
var config = require('./app/config/config');
var robot = new Robot(config);
if (robot.server==='master') {     //启动master 服务
    robot.runMaster(__filename);
} else {
    //示例中第5个参数为mysql数据源分页参数
    var i = 5;
    var limit = process.argv[i++];
    var offset= process.argv[i++];
    //载入用户自定义的脚本。
    var script = require('fs').readFileSync(process.cwd() + '/app/config/lord.js', 'utf8');
    queryHero(client,limit,offset,function(error,users){     //启动Agent 服务
	robot.runAgent(users,script)
    });
}

``` 
上面代码示例，获得Mysql数据源的代码如下：
``` javascript
//数据库配置
var mysql =config[robot.env].mysql;
var Client = require('mysql').Client;
var client = new Client();
client.host = mysql.host;
client.user = mysql.user;
client.password = mysql.password;
client.database = mysql.database;

queryHero = function(client,limit,offset,cb){
    var users = [];
    var sql = "SELECT User.* FROM User,Player where User.id = Player.userId  and User.name like 'pomelo%' limit ? offset ? ";
    var args = [parseInt(limit),parseInt(offset)];
    client.query(sql,args,function selectCb(error, results, fields) {
        if (!!error) {
            console.log('queryHero Error: ' + error.message);
            cb(null,users);
        }
        for (var i = 0;i<results.length;i++) {
      	    var user = {uid:results[i]['id'],username:results[i]['name'],passwd:results[i]['passwd']||'123'};
    	      users.push(user);
        };
        cb(null,users);
    });
};

``` 
###运行测试
运行如下命令：<br/>
node main.js
默认启动开发环境，如需要启动线上测试环境，在线上master机器上执行node main.js prod即可。<br/>
打开浏览器访问如下地址<br/>
http://masterIp:8889

点击准备按钮，可以看到连接上来的客户端，当所有的客户端准备好了，点击运行即可。<br/>
管理界面会定时得到后台数据与展示出来。<br/>
运行界面如下图所示：<br/>

![boardcast result](http://pomelo.netease.com/resource/documentImage/perform/boardcast.png) 

###注意
当分布时使用时，各客户端配置的机器的目录是统一的，并且主节点能通过SSH无密码访问到各节点。<br/>
另外，开发人员也可以自行登录到各客户端通过参数根据主服务器生成的命令手工启动。<br/>

###其他
详细的使用及完全的源代码请参考[工程](https://github.com/NetEase/pomelo-robot) 
