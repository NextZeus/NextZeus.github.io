# Tutorial----分布式聊天服务器
## 为什么是聊天？
Pomelo是一款游戏服务器框架， 为什么tutorial会从聊天开始?

Pomelo是游戏服务器框架，本质上也是高实时、可扩展、多进程的应用框架。除了在library部分有一部分游戏专用的库，其余部分框架完全可用于开发高实时web应用。而且与现在有的node.js高实时应用框架如derby、socketstream、meteor等比起来有更好的可伸缩性。

由于游戏在场景管理、客户端动画等方面有一定的复杂性，并不适合作为pomelo的入门应用。聊天应用通常是node.js入门接触的第一个应用，因此更适合做tutorial。

对于大多数开发者而言，node.js的入门应用都是一个基于socket.io开发的普通聊天室， 由于它是基于单进程的node.js开发的， 在可扩展性上打了一定折扣。例如要扩展到类似irc那样的多频道聊天室， 频道数量的增多必然会导致单进程的node.js支撑不住。

而基于pomelo框架开发的聊天应用天生就是多进程的，可以非常容易地扩展服务器类型和数量。

## 从单进程到多进程，从socket.io到pomelo
一个基于socket.io的原生聊天室应用架构， 以[uberchat] (http://github.com/joshmarshall/uberchat )为例。 

它的应用架构如下图所示：

![uberchat](http://pomelo.netease.com/resource/documentImage/uberchat.png)
 

服务端由单个node.js进程组成的chat server来接收websocket请求。


它有以下缺点：

1. 可扩展性差：只支持单进程的node.js， 无法根据room/channel分区， 也无法将广播的压力与处理逻辑的压力分开。

2. 代码量多：基于socket.io做了简单封装，服务端就写了约430行代码。


用pomelo来写这个框架可完全克服以上缺点。

我们要搭建的pomelo聊天室具有如下的运行架构：

 ![multi chat](http://pomelo.netease.com/resource/documentImage/multi_chat.png)

在这个架构里， 前端服务器也就是connector专门负责承载连接， 后端的聊天服务器则是处理具体逻辑的地方。
这样扩展的运行架构具有如下优势：
* 负载分离：这种架构将承载连接的逻辑与后端的业务处理逻辑完全分离，这样做是非常必要的， 尤其是广播密集型应用（例如游戏和聊天）。密集的广播与网络通讯会占掉大量的资源，经过分离后业务逻辑的处理能力就不再受广播的影响。

* 切换简便：因为有了前、后端两层的架构，用户可以任意切换频道或房间都不需要重连前端的websocket。

* 扩展性好：用户数的扩展可以通过增加connector进程的数量来支撑。频道的扩展可以通过哈希分区等算法负载均衡到多台聊天服务器上。理论上这个架构可以实现频道和用户的无限扩展。

下文我们将开始用pomelo搭建这个架构，我们将发现搭建如此复杂的架构竟然不到100行代码。

## 初始化代码结构
在开始之前，首先确保在你的机器上已经安装了pomelo，具体安装步骤可参考：[pomelo快速使用指南](https://github.com/NetEase/pomelo/wiki/pomelo%E5%BF%AB%E9%80%9F%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97)

通过以下命令可初始化应用的代码结构：

>pomelo init chatofpomelo

代码结构图如下：

 ![chat directory](http://pomelo.netease.com/resource/documentImage/chatDir.png)

说明：

* game-server: 游戏服务器，所有的游戏服务器逻辑都放在这个目录下,以文件app.js作为入口，运行游戏的所有逻辑和功能。

* web-server：游戏用到的web服务器（包括登录逻辑）、客户端的js、css和静态资源等。

* config: 游戏服务器的所有配置信息。配置信息以JSON格式定义，包含有日志、master服务器和其他服务器的配置信息。该目录还可以放置其它配置信息，包括对数据库配置信息、地图信息和数值表等信息进行定义。

* logs: 存放游戏服务器所有日志信息。

* shared: 存放game-server与web-server共用代码。

初始化&&测试：

安装npm包

>sh npm-install.sh

启动游戏服务器：

>cd game-server && pomelo start

启动web服务器：

>cd web-server && node app.js

web服务器中包含pomelo客户端，当web服务器启动后，客户端自动加载到浏览器中。客户端通过websocket向游戏服务器发送请求，连接成功后服务端通过pomelo向客户端推送消息。

测试是否运行成功：

在浏览器中输入 http://localhost:3001，如果web服务器运行成功，将出现如下页面：

![welcome page](http://pomelo.netease.com/resource/documentImage/welcome.png)

点击'Test game server'按钮如果显示'game server is ok',pomelo弹出则证明客户端与服务端的通信成功。

## 开始聊天逻辑代码编写
聊天室的逻辑包括以下几个部分：
* 	用户进入聊天室：这部分逻辑负责把用户信息注册到session，并让用户加入聊天室的channel。

* 	用户发起聊天： 这部分包括了用户从客户端发起请求，服务端接收请求等功能。

* 	广播用户的聊天： 所有在同一个聊天室的客户端收到请求并显示聊天内容。

* 	用户退出： 这部分需要做一些清理工作，包括session和channel的清理。


### 用户进入聊天室
实现的功能效果如下图：
用户输入用户名、聊天室名，加入聊天室

![login](http://pomelo.netease.com/resource/documentImage/login.png)

#### 客户端
客户端需要发请求给服务端， 第一次请求要给connector进程，因为首次进入时需要把session信息注册上去（此tutorial中页面相关代码、布局等略去）。

```javascript
pomelo.request('connector.entryHandler.enter', {username: username}, function(){
}); 
```

以上请求字符串’connector.entryHandler.enter’分别代表了服务器类型、服务端相应的文件名及对应的方法名。

#### 服务端
connector接收消息无需任何配置，只要在connector/handler/ 下新建文件entryHandler.js。我们只需实现enter方法，服务端自动会执行对应的handler，以下是handler的代码：

```javascript
handler.enter = function(msg, session, next) {
	session.bind(uid);
	session.on('closed', onUserLeave.bind(null, this.app));
};
```


#### 服务端将用户加到channel
通过调用rpc方法，将登录的用户加入到channel中。

```javascript
app.rpc.chat.chatRemote.add(session, uid, app.get('serverId'), function(data){});
```

其中app是pomelo的应用对象，app.rpc表明了是前后台服务器的Remote rpc调用，后面的参数分别代表服务器的名称、对应的文件名称及方法名。为了实现这个rpc调用，则只需要在对应的chat/remote/中新建文件chatRemote.js，并实现add方法。

```javascript
remote.add = function(uid, sid, cb){
    var channel = channelService.getChannel('pomelo', true); 
    if(!!channel)
        channel.add(uid, sid);
};
```

在add方法中，首先从pomelo提供的channelService中取出channel,然后将用户加入到channel中即可。这样就完成了一个完整的rpc调用，在pomelo里复杂的rpc调用就是这么简单。
 

#### 用户发起聊天并由服务器接收
客户端代码：

```javascript
pomelo.request('chat.chatHandler.send', {content: msg, from: username, target: target}, function(){});
```

服务端代码：

```javascript
handler.send = function(msg, session, next) {
   var param = {route: 'onChat', msg: msg.content, from: msg.from, target: msg.target};
   // send messages
};
```

#### 服务器端广播消息，并由客户端接收
服务端，在上述的send方法中加入广播代码：

```javascript
var channel = channelService.getChannel('pomelo', false);
channel.pushMessage(param);
```

客户端，所有频道的内的用户收到消息并显示：

```javascript
pomelo.on('onChat', function() {
   addMessage(data.from, data.target, data.msg);
   $("#chatHistory").show();
};
```

### 退出房间
session断开时，通过rpc调用将用户从channel中移除。

```javascript
app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), 'pomelo', null);
```

跟用户进入房间一样，在chatRemote中加入对应的kick方法就能够实现用户退出房间的功能。

```javascript
handler.kick = function(uid, sid, name){
    var channel = channelService.getChannel(name, false);
    if (!!channel) {
        channel.leave(uid,sid);
    }
};
```

## 跑起来
### 配置servers.json
具体配置文件如下：
```json
{
  "development":{
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "clientPort":3050, "frontend": true }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }
        ]
   },
  "production":{
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "clientPort":3050, "frontend": true }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }
        ]
   }
}
```
服务器的数量开发者可以根据用户的数量来确定，如果需要增加某个类型的服务器只需要在配置文件中相应的位置增加一行配置指定id、host及端口号即可。


### 运行
>pomelo start

##  scale up
这里我们可以看到在pomelo中扩展服务器的数量是如此的easy。

现在的运行架构如下图：

![single chat](http://pomelo.netease.com/resource/documentImage/single_chat.png)

扩展成更多服务器，只要修改配置文件servers.json。
```json
{
  "development":{
       "gate":[
            { "id":"gate-server-1", "host":"127.0.0.1", "clientPort":3014, "frontend": true }
        ],
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "clientPort":3050, "frontend": true },
            { "id":"connector-server-2", "host":"127.0.0.1", "clientPort":3051, "frontend": true },
            { "id":"connector-server-3", "host":"127.0.0.1", "clientPort":3052, "frontend": true }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }, 
            { "id":"chat-server-2", "host":"127.0.0.1", "port":6051 },
            { "id":"chat-server-3", "host":"127.0.0.1", "port":6052 }
        ]
   },
 "production":{
       "gate":[
            { "id":"gate-server-1", "host":"127.0.0.1", "clientPort":3014, "frontend": true }
        ],
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "clientPort":3050, "frontend": true },
            { "id":"connector-server-2", "host":"127.0.0.1", "clientPort":3051, "frontend": true },
            { "id":"connector-server-3", "host":"127.0.0.1", "clientPort":3052, "frontend": true }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }, 
            { "id":"chat-server-2", "host":"127.0.0.1", "port":6051 },
            { "id":"chat-server-3", "host":"127.0.0.1", "port":6052 }
        ]
   }
}
```

这样我们就轻松地由之前的单台connector、chat服务器扩展成多台connector、chat服务器的架构。扩展后前端存在多个connector服务器，为了平衡不同connector服务器的负载，我们增加了一个gate服务器。gate服务器主要负责为用户分配connector服务器，在这里我们直接根据用户名进行hash处理从而选择用户登录的connector服务器。


扩展后的运行架构如下图：

![multi chat](http://pomelo.netease.com/resource/documentImage/multi_chat.png)

### 配置router
当扩展成多台服务器后,需要为不同类型的服务器添加不同的路由配置。这里主要是chat服务器的路由配置，为了减少应用复杂度，我们根据房间名进行hash处理，详细的配置说明可以参考[app.js配置说明](https://github.com/NetEase/pomelo/wiki/%E6%B8%B8%E6%88%8F%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%9A%84app.js%E9%85%8D%E7%BD%AE%E5%8F%82%E8%80%83)。具体代码如下：
```javascript
//routeUtil.js
exp.chat = function(session, msg, app, cb) {
    var chatServers = app.getServersByType('chat'); 
    if (!chatServers) {
     	cb(new Error('can not find chat servers.'));
		return;
    }
    var res = dispatcher.dispatch(session.get('rid'), chatServers);
    cb(null, res.id);
};
```
```javascript
//app.js
app.configure('production|development', function() {
       app.route('chat', routeUtil.chat);
});
```

### 其它配置

最新的chatofpomelo是基于pomelo的0.3版本，0.3版Pomelo开始支持二进制协议，并支持对请求route的字典压缩和请求内容进行protobuf压缩。0.3版同时兼容以前版本基于socket.io的通讯协议。通过在应用中配置不同的connector component来实现协议的切换或共存。针对pomelo 0.3版本的两种不同的通信方式，chatofpomelo也分别有兼容之前的socket.io版本（chatofpomelo）和websocket版本(chatofpomelo-websocket)。socket.io版本的配置兼容之前版本，只是在servers.json中对connector的配置稍有修改，上文已经给出最新的servers.json的配置说明。对于websocket.io版本需要在app.js中对connector进行配置，具体配置如下：
```javascript
// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
		        connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true,
			useProtobuf : true
		});
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
		});

});
```
上述配置是分别对connector和gate服务器进行websocket的配置，heartbeat是客户端与服务端的心跳时间，单位是秒；useDict是配置是否打开handler字典压缩；useProtobuf是配置是否开启protobuf的压缩；具体可以参考[pomelo 数据压缩协议](https://github.com/NetEase/pomelo/wiki/Pomelo-%E6%95%B0%E6%8D%AE%E5%8E%8B%E7%BC%A9%E5%8D%8F%E8%AE%AE)。


# tutorial源码获取
当前chatofpomelo有两个版本，一种是底层基于socket.io的版本，git地址如下：
>git clone https://github.com/NetEase/chatofpomelo.git

另一种是底层基于websocket的版本，git地址如下：
>git clone https://github.com/NetEase/chatofpomelo-websocket.git

基于Flash客户端的Demo地址如下：
>https://github.com/mani95lisa/PomeloFlashDemo