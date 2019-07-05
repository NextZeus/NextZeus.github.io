##关于

pomelo sync 模块是管理游戏进程内需要持久化的数据在内存和存储系统之间的同步，提供一种异步的同步方式，根据用户配置定时的同步数据到持久层，如MYSQL，Redis，文件等。
##目的
由于在游戏应用场景中，需要大量的数据更新与同步，如用户的位置，血量，装备值等，如果频繁的操作数据层，会产生很大的IO操作开销，采用定时批量的方式处理变动的数据是避免压力过大的方法之一，pomelo sync就是为了满足这样的需求而开发的。

类似与IBatis的配置，但是ORM完全由用户配置控制，具有很大的灵活性，因此，可以应用于自己的不同数据层中，如其他的Mongdb等。

##模块结构
pomelo sync模块内部结构如下：

![boardcast result](http://pomelo.netease.com/resource/documentImage/pomelo-sync.png) 

Logic Interface：提供侵入式的数据更新调用接口，包括常规的add、update、delete和立即执行持久化的接口<br/>

Invoke Interface：提供持久化的实际调用执行：<br/>
Queue：提供本周期内需要持久化的对象，可支持多节点转发的数据<br/>
Timer：提供定时静态配置、动态修改<br/>
Mapping：提供在持久化时同步方法的映射<br/>

Store Interface：封装了各存储引擎的持久化接口以<br/>
Log：提供对数据变动时的AOF日志记录<br/>
Mysql,Redis,File：根据用户传入的对象执行用户自定义的同步方法。<br/>


## 安装
npm install pomelo-sync

## 使用示例

###创建sync对象
``` javascript
//引用库
var DBsync = require('pomelo-sync');
//配置客户端连接,即同步的连接，如mysqlclient;
var dbclient = mysqlclient;
var opts = opts || {};
//配置映射的路径方法
opts.client = dbclient;
opts.interval = opts.interval || 60 * 1000;
var sync = new DBsync(opts) ;
```
###配置同步对象映射关系
目前，本库支持用户自行定义和设置映射路径，代码分别如下：

####自定义传入的方法
``` javascript

var updateTask = function(dbclient,val) {
	var sql = 'update Task set taskState = ?, startTime = ?, taskData = ? where id = ?';
	var taskData = val.taskData;
	if (typeof taskData !== 'string') {
		taskData = JSON.stringify(taskData);
	}
	var args = [val.taskState, val.startTime, taskData, val.id];	
	dbclient.query(sql, args, function(err, res) {
		if (err) {
			console.error('write mysql failed! ' + sql + JSON.stringify(val));
		} else {
			callback && callback(!!err);
		}
	});
}

var optKey = 'taskSync.updateTask';
sync.mapping = {optKey:updateTask}; 
​
``` 
####传入用户自定义路径
由模块扫描配置的文件夹的所有JS文件，并把JS的文件名和导出的方法作为Key与对应的导出方法映射。
``` javascript
var mappingPath = __dirname+ '/mapping';
sync.mapping = sync.loadMapping(mappingPath);
``` 
mapping文件夹下的taskSync.js文件内容
``` javascript
module.exports = {
	updateTask: function(dbclient, val, callback) {
		var sql = 'update Task set taskState = ?, startTime = ?, taskData = ? where id = ?';
		var taskData = val.taskData;
		if (typeof taskData !== 'string') {
			taskData = JSON.stringify(taskData);
		}
		var args = [val.taskState, val.startTime, taskData, val.id];	
		dbclient.query(sql, args, function(err, res) {
			if (err) {
				console.error('write mysql failed! ' + sql + JSON.stringify(val));
			} else {
				callback && callback(!!err);
			}
		});
	}
};
``` 
###添加需要同步的对象
需要传入同步时回调方法的关键词，同步对象的主键及同步对象，定时器会把添加的对象同步到数据库中。
``` javascript
var id = 10001;
var task = {"taskState":1,"startTime":Date.now(),"taskData":1,"id":id};
sync.exec(optKey,id,task);
​
``` 


##API
###sync.exec(key,id,val,cb)
添加异步定时执行的操作
####Arguments
+ key -  方法映射的关键词，使用时需要唯一。
+ id  -  实体对象主键。
+ val -  需要同步对象，添加后会克隆此对象。
+ cb  -  同步完成后的异步回调，可以为空。

具体使用见上示例


###sync.flush(key,id,val,cb)
立即同步某个对象到持久层
####Arguments
+ key -  方法映射的关键词，使用时需要唯一。
+ id  -  实体对象主键。
+ val -  需要同步对象。
+ cb  -  同步完成后的异步回调，可以为空。


具体使用同上示例。

###sync.sync()
用户手工立即执行同步过程，不等到定时器调用。一般使用在服务器关闭关调用。代码如下：
``` javascript
var stop = function(cb) {
  var self = this;
  self.sync.sync();
  self.state = STATE_STOPED;
  var interval = setInterval(function(){
    if (self.sync.isDone()) {
      clearInterval(interval);
      cb();
    }
  }, 200);
};
​
``` 
###sync.isDone
获得内存是否还有需要同步对象的状态，有的话为FALSE，用户可以根据状态判断是否关闭。
一般配置sync()方法一起使用，具体使用见上面的代码

##其他参数选项
系统默认的同步间隔时间为 1000 * 60（即1分钟）,需要修改的在opts.interval传入即可。<br/>
系统默认是关闭aof日志记录，如需要可使用opts.aof = ture打开。

##注意
使用外部的持久化时需要设置对应的CLIENT对象，在调用方法时会按第一个参数传给调用方法。需要同步的对象传出在第二个参数位置上。
本模块需要采用持久层的内置事务模型来保证对事务的支持，本身不提供。 


##其他
更详细的示例，请参考库的[源代码](https://github.com/NetEase/pomelo-sync)与[游戏DEMO](https://github.com/NetEase/lordofpomelo)。