# Pomelo

基于node.js 简单易用 高性能IO
高实时
高可用 
灵活
可伸缩性好 node.js网络io优势提供高可伸缩性
可扩展 
松耦合  
分布式多进程
服务器端框架


## router

```

// route definition for chat server
var chatRoute = function(session, msg, app, cb) {
  var chatServers = app.getServersByType('chat');

	if(!chatServers || chatServers.length === 0) {
		cb(new Error('can not find chat servers.'));
		return;
	}

	var res = dispatcher.dispatch(session.get('rid'), chatServers);

	cb(null, res.id);
};

app.configure('production|development', function() {
  app.route('chat', chatRoute);
});

```
## Session & SessionService

session 客户端连接抽象
{
    id : <session id> // readonly
    frontendId : <frontend server id> // readonly
    uid : <bound uid> // readonly
    settings : <key-value map> // read and write  
    __socket__ : <raw_socket>
    __state__ : <session state>

    // ...
}

settings维护一个key-value map，用来描述session的一些自定义属性，比如聊天应用中的房间号就可以看作是session的一个自定义属性


在前端服务器中，引入了FrontendSession, 可以把它看作是一个内部session在前端服务器中的傀儡，FrontendSession的字段大致如下:

{
    id : <session id> // readonly
    frontendId : <frontend server id> // readonly
    uid : <bound uid> // readonly
    settings : <key-value map> // read and write  
}

其作用：

通过FrontendSession可以对settings字段进行设置值，然后通过调用FrontendSession的push方法，将设置的settings的值同步到原始session中;
通过FrontendSession的bind调用，还可以给session绑定uid;
当然也可以通过FrontendSession访问session的只读字段，不过对FrontendSession中与session中相同的只读字段的修改并不会反映到原始的session中。

SessionService维护所有的原始的session信息,包括不可访问的字段，绑定的uid以及用户自定义的字段。


BackendSession是由BackendSessionService创建并维护的，在后端服务器接收到请求后，由BackendSessionService根据前端服务器rpc的参数，进行创建。对BackendSessionService的每一次方法调用实际上都会生成一个远程调用，比如通过一个sid获取其BackendSession。同样，对于BackendSession中字段的修改也不会反映到原始的session中，不过与FrontendSession一样，BackendSession也有push，bind，unbind调用，它们的作用与FrontendSession的一样，都是用来修改原始session中的settings字段或者绑定/解绑uid的，不同的是BackendSession的这些调用实际上都是名字空间为sys的远程调用。


channel可以看作是一个玩家id的容器，主要用于需要广播推送消息的场景。可以把某个玩家加入到一个Channel中，当对这个Channel推送消息的时候，所有加入到这个Channel的玩家都会收到推送过来的消息。一个玩家的id可能会被加入到多个Channel中，这样玩家就会收到其加入的Channel推送过来的消息。
需要注意的是Channel都是服务器本地的，应用服务器A和B并不会共享Channel，也就是说在服务器A上创建的Channel，只能由服务器A才能给它推送消息。
channelService.pushMessageByUids(route, msg, uids)
channelService.broadcast('connector', route, msg)
channel.pushMessage(route,msg)


pomelo中有四种消息类型的消息，分别是request，response，notify和push


## Filter
filter分为before和after两类，每类filter都可以注册多个，形成一个filter链，所有的客户端请求都会经过filter链进行一些处理。before filter会对请求做一些前置处理，如：检查当前玩家是否已登录，打印统计日志等。after filter是进行请求后置处理的地方，如：释放请求上下文的资源，记录请求总耗时等。after filter中不应该再出现修改响应内容的代码，因为在进入after filter前响应就已经被发送给客户端。

### global filter
```
//globalFilter.js
var Filter = function(){}

Filter.prototype.before = function (msg,session,next) {
    global.app.rpc.room.roomRemote.getServerStatus(null, function (err) {
        if(!!err){
            return next("SERVER_STOP");
        }
        next();
    });
}

Filter.prototype.after = function (err,msg,session,resp,next) {
    next();
}

module.exports = function(){
    return new Filter();
}


// app.js
app.globalFilter(globalFilter())

```

### special server filter

```
// abuseFilter.js
module.exports = function() {
  return new Filter();
}

var Filter = function() {
};

Filter.prototype.before = function (msg, session, next) {
  if (msg.content.indexOf('fuck') !== -1) {
    session.__abuse__ = true;
    msg.content = msg.content.replace('fuck', '****');
  }
  
  next();
};

Filter.prototype.after = function (err, msg, session, resp, next) {
  if (session.__abuse__) {
    var user_info = session.uid.split('*');
    console.log('abuse:' + user_info[0] + " at room " + user_info[1]);
  }
  next(err);
};


// app.js
var abuseFilter = require('./app/servers/chat/filter/abuseFilter');
app.configure('production|development', 'chat', function() {
	app.filter(abuseFilter());
});

```

## error handler
error handler是一个处理全局异常的地方，可以在error handler中对处理流程中发生的异常进行集中处理，如：统计错误信息，组织异常响应结果等

```
//errorHandler.js
var bearcat = require("bearcat");
var GlobalHandler = function () {}

GlobalHandler.prototype.globalHandler = function (err,msg,resp,session,next) {
    var route = msg.route || msg.__route__;
    var errorCode = bearcat.getBean("errorCode");

    console.warn('globalHandlerError route:', route, ' error:', err, ' code: ',errorCode.getErrorCode(route,err));
    if(!!err){
        return next(null,{code: errorCode.getErrorCode(route,err)});
    } else {
        next();
    }
    console.warn('globalHandler-end');
}

module.exports = GlobalHandler;

// app.js
app.set("globalErrorHandler", errorHandler.globalHandler);
app.set("errorHandler", errorHandler.globalHandler);

```


## master, monitor, admin client
monitor运行在各个应用服务器中，它会向master注册自己，向master上报其服务器的信息，当服务器群有变化时，接收master推送来的变化消息，更新其服务器上下文。

master运行在应用服务器中，它会收集整个服务器群的信息，有变化时会将变化推送到各个monitor；同时，master还接受admin client的请求，按照client发出的命令，执行对应的操作，如查询整个服务器群的状态，增加一个服务器等。

client独立运行自己的进程，它会发起到master的连接，然后通过对master发出请求或者命令，来管理整个服务器群。目前工具pomleo-cli就是这样的一个客户端。

## admin module

服务器的监控和管理有三个主体：master，monitor，client
服务器的管理和监控由master服务器加载的master component和普通的应用服务器加载的monitor component，还有服务器管理客户端共同完成


master负责收集所有服务器的信息，下发对服务器的操作指令。
monitor负责上报服务器状态，并对master的命令作出反应。
client是第三方监视的客户端，它注册到master上，通过给master发请求获得服务器群信息，或者给master发指令，管理操作应用服务器群

pomelo中内建实现并使用了console和watchdog这两个admin module

module特指服务器监控管理模块, 在module中实现的是监控逻辑，比如收集进程状态等,每一个module中都会定义下面四种回调函数，不过都是可选的

masterHandler(agent, msg, cb) 当有应用服务器给master发监控数据时，这个回调函数会由master进程进行回调，完成应用服务器的消息处理;
monitorHandler(agent, msg, cb) 当有master请求应用服务器的一些监控信息时，由应用服务器进行回调，完成对master请求的处理;
clientHandler(agent, msg, cb）当由管理客户端向master请求服务器群信息时，由master进程进行回调处理客户端的请求。
start(cb) 当admin module，注册加载完成后，这个回调会被执行，在这里可以做一些初始化工作。


一个module有两个属性很重要，type和interval
	type指出的是数据所采用的方式，有两种pull和push
		pull方式是让master定时给monitor发请求，monitor给其上报信息
		push的方式则是monitor定时上报自己的信息
	interval就是这个信息上报的时间周期了
默认使用pull方式，上报周期为5秒

```
// notice.js
module.exports = function(opts){
    return new Module(opts);
}

// 必须指定moduleId
module.exports.moduleId = 'notice';

var Module = function(opts){
    this.app = opts.app;
    this.type = opts.type || 'pull';
    this.interval = opts.interval || 5;
}


// pomelo-admin 向master发起请求 master向room server发起请求
Module.prototype.clientHandler = function(agent,msg,cb){
    var server = app.getServersByType('room')[0];
    agent.request(server.id, module.exports.moduleId, msg, cb);
}

// room server 完成对master请求的处理
Module.prototype.monitorHandler = function(agent,msg,cb){
    var self = this;
    self.app.rpc.room.roomRemote.sendNotice(null,msg,cb);
}

// admin module可以通过对Application调用app.enable('systemMonitor')完成开启
app.enable('systemMonitor');
app.registerAdmin(notice, {app : app});


```

## route压缩 增加数据包的有效数据率 节省网络资源
目前pomelo的路由信息压缩仅仅支持使用hybridconnector的方式
如果使用了路由信息压缩，在客户端与服务器建立连接的握手过程中，服务器会将整个字典传给客户端，这样在以后的通信中，对于路由信息，将全部使用定义的小整数进行标记，大大地减少了额外信息开销

```
声明所有客户端使用的路由
config/dictionary.json

[
	"onAdd",
	"onChat",
	"onLive"
]

// app.js
app.configure('production|development','connector', function() {
  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector,
    heartbeat: 3,
    useDict: true // enable dict
  });
});

app.configure('production|development','gate', function() {
  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector,
    useDict: true // enable dict
  });
});

```

## Protobuf压缩
pomelo的protobuf实现，借助了javascript的动态性，使得应用程序可以在运行时解析proto文件，不需要进行proto文件的编译。pomelo的实现中，为了更方便地解析proto文件，使用了json格式，与原生的proto文件语法是相通的
服务端的proto配置放在config/serverProtos.json
客户端的proto配置放在config/clientProtos.json

如果在其配置文件里，配置了所有类型的proto信息，那么在通信过程中，将会全部使用二进制的方式对消息进行编码; 如果没有定义某一类消息相应的proto，pomelo还是会使用初始的json格式对消息进行编码

```
// config/clientProtos.json
{
  "chat.chatHandler.send": {
    "required string rid": 1,
    "required string content": 2,
    "required string from": 3,
    "required string target": 4
  },

  "connector.entryHandler.enter": {
    "required string username": 1,
    "required string rid": 2
  },

  "gate.gateHandler.queryEntry": {
    "required string uid": 1
  }
}

// config/serverProtos.json
{
  "onChat": {
    "required string msg": 1,
    "required string from": 2,
    "required string target": 3
  }
}

//app.js 开启protobuf
app.configure('production|development', 'connector',  function() {
  app.set('connectorConfig', {
    connector: pomelo.connectors.hybridconnector,
    heartbeat: 3,
    useDict: true,
    useProtobuf: true //enable useProtobuf
  });
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig', {
			connector : pomelo.connectors.hybridconnector,
			useDict: true,
      useProtobuf: true //enable useProtobuf
		});
});

```

## RPC调用


```
// chatRemote.js
// 工厂函数 
module.exports = function(app) {
	return new ChatRemote(app);
};

// 对象
// timeRemote.js
module.exports.getCurrentTime(arg1, arg2, cb) {
  // ...
};


当进行rpc调用的时候，可以跳过路由计算而直接将调用发送到一个具体的服务器或者广播到一类服务器的调用方式，代码示例如下：
// route
var routeParam = session;
app.rpc.area.playerRemote.leaveTeam(routeParam, args..., cb);

// to specified server 'area-server-1'
app.rpc.area.playerRemote.leaveTeam.toServer('area-server-1', args..., cb);

// broadcast to all the area servers
app.rpc.area.playerRemote.leaveTeam.toServer('*', args..., cb);


```

## component

```

// components/HelloWorld.js
module.exports = function(app, opts) {
  return new HelloWorld(app, opts);
};

var DEFAULT_INTERVAL = 3000;

var HelloWorld = function(app, opts) {
  this.app = app;
  this.interval = opts.interval || DEFAULT_INTERVAL;
  this.timerId = null;
};

HelloWorld.name = '__HelloWorld__';

HelloWorld.prototype.start = function(cb) {
  console.log('Hello World Start');
  var self = this;
  this.timerId = setInterval(function() {
    console.log(self.app.getServerId() + ": Hello World!");
    }, this.interval);
  process.nextTick(cb);
}

HelloWorld.prototype.afterStart = function (cb) {
  console.log('Hello World afterStart');
  process.nextTick(cb);
}

HelloWorld.prototype.stop = function(force, cb) {
  console.log('Hello World stop');
  clearInterval(this.timerId);
  process.nextTick(cb);
}


让master服务器来加载我们的这个component
// app.js
var helloWorld = require('./app/components/HelloWorld');

app.configure('production|development', 'master', function() {
  app.load(helloWorld, {interval: 5000});
});

```

我们看到每一个component一般都要定义start，afterStart，stop这些hook函数，供pomelo管理其生命周期时进行调用。对于component的启动，pomelo总是先调用其加载的每一个component提供的start函数，当全部调用完后，才会去调用其加载的每一个component的afterStart方法，这里总是按顺序调用的
在afterStart中，一些需要全局就绪的工作可以放在这里完成，因为调用afterStart的时候，**所有**component的start已经调用完毕。
stop用于程序结束时对component进行清理时使用

## 协议
pomelo核心提供两种connector，sioconnector, hybridconnector
sioconnector基于socket.io, 使用json作为通信格式
hybridconnectory则用于tcp/websocket通信，底层使用的是二进制协议，同时听过route字典压缩和protobuf压缩，提高带宽利用率，上层接口仍保持json格式的接口


proxy component 负责创建 rpc client
remote component 负责创建 rpc server
