#Pomelo组件

组件（component）是纳入服务器生命周期管理的服务单元。Pomelo服务器启动的过程实际上就是加载和启动一些列组件的过程（更多关于组件的细节请参考[这里](https://github.com/NetEase/pomelo/wiki/Pomelo-Framework#-6)）。Pomelo框架内部提供了一系列的组件，并默认在启动过程中加载并启动它们，以提供Pomelo中所需的各项服务。本文档将介绍这些内置组件的作用，以及开发者如何对这些组件进行配置。但对于一些不稳定的特性和配置选项暂时先隐藏。

Pomelo内置组件的代码放置在[lib/components/](https://github.com/NetEase/pomelo/tree/master/lib/components)目录下。它们当中大部分充当一个包装器角色，将Pomelo框架内部的服务包装后，使之纳入容器的生命周期管理并暴露给外界使用。

##Pomelo组件配置

开发者可以在`app.js`文件中对各个内置组件进行配置。配置的方式是在app中设置名为 *componentName*Config的属性，该属性的value将被作为初始化参数传递给组件。其中 *componentName* 为对应组件的名字。例如，配置`connector`组件的属性的例子如下：

```
app.set('connectorConfig', {
  connector: pomelo.connectors.hybridconnector,
  heartbeat: 3,
  useDict: true,
  useProtobuf: true
});
```

*注意* :具体的配置参数由对应的组件决定，可能会随组件的升级发生改变。

##组件说明

###channel

提供channel相关的服务的组件。加载该组件后，会在app上下文加入`channelService`，可以通过`app.get('channelService')`获取。`channelService`相关的接口信息请参考[Pomelo API](http://pomelo.netease.com/api.html)。

####配置

* broadcastFilter - broadcast的过滤函数。会在执行broadcast操作时，在每个frontend server上，在将消息发送给每个session之前触发。返回true表示可以将消息发送给该session；false则消息将不会发送给对应的session。

#####参数
	* session - 消息将发往的session。
	* msg - 待发消息。
	* param - broadcast附带参数，在`channelService.broadcast(type, route, {filterParam: param}, cb)`中传递。
	
####使用例子

```
app.set('channelConfig', {
  broadcastFilter: function(session, msg, param) {
	// check some condition
	return true;
  }
});
```

###connection

无配置项。提供统计frontend server连接数服务的组件，组件名`__connection__`，在frontend server上会被加载，主要工作是将`connectionService`封装成组件。`pomelo-admin`依赖这个组件进行frontend server的连接数和登录用户数进行统计。

###connector

管理frontend server底层的连接和通信协议的实现，组件名`__connector__`。配置参数由所使用的connector实现决定。

####配置
* connector - connector工厂方法，创建并返回新的connector实例。

#####参数
	* port - 监听端口
	* host - 监听的host名
	* opts - 额外初始化参数
	
目前Pomelo提供两个connector的实现：`sioconnector`和`hybridconnector`。关于这两个connector的更多信息请参考[Pomelo 0.3新特性](https://github.com/NetEase/pomelo/wiki/Pomelo-0.3%E6%96%B0%E7%89%B9%E6%80%A7#1-)。

###dictionary

生成route字符串压缩编码的组件。该组件会遍历所有handler的route字符串，并为之生成唯一的压缩编码。同时也支持用户配置额外的route字符串，默认配置文件为`config/dictionary.json`，也可以通过配置来指定该文件的位置。

*注意* `dictionary`组件只有在Pomelo 0.3版本中使用`hybridconnector`并且配置`useDict`为true时才有效。

####配置

指定用户自定义route字符串配置文件

```
app.set('dictionaryConfig', {
  dict: path.join(app.getBase(), '/config/dictionary.json')
});
```

###backendSession

无配置项。提供BackendSession相关服务的组件。加载该组件后，会在app上下文中加入`backendSessionService`，可以通过`app.get('backendSessionService')`获取。`backendSessionService`相关的接口信息请参考[Pomelo API](http://pomelo.netease.com/api.html)。

###master

无配置项。在master进程上加载。提供master相关功能，如：根据配置启动各个服务器进程，运行`pomelo-admin`master端并加载master端modules，监控各个进程状态信息等。

###monitor

无配置项。在master之外的各个进程上加载。运行`pomelo-admin`monitor端并加载monitor端modules。

###protobuf

无配置项。该组件负责加载protobuf数据定义文件和提供protobuf相关encode和decode服务（内部使用）。

*注意* `protobuf`组件只有在Pomelo 0.3版本中使用`hybridconnector`并且配置`useProtobuf`为true时才有效。

具体`pomelo-protobuf`的使用，请参考[这里](https://github.com/pomelonode/pomelo-protobuf)。

###proxy

提供rpc客户端代理生成和rpc客户端请求路由计算服务。该模块加载后，会在app上下文加入`rpc`字段。app.rpc是rpc代理对象的根节点，根据各个服务器路径下`remote/`目录下的服务代码自动生成，可以通过`app.rpc.serverType.service.method`的形式发起远程调用。

可以通过`app.route`方法对特定类型的服务器类型配置路由计算函数。路由计算函数的主要工作就是决定某一个消息应该发往哪一个远程服务器。

####使用例子

为area服务器配置路由函数routeFn。

```
app.route('area', routeFn);
```

配置默认的路由函数，所有发往没配置路由函数的服务器类型的请求都会交给默认路由函数计算。

```
app.route('default', defaultRouteFn);
```

路由函数的定义：

```
var routeFn = function(session, msg, app, cb) {
  // 实现路由策略，计算得到目标服务器id
  cb(null, serverId);
};
```

###remote

提供远程服务暴露服务。根据当前服务器类型，加载对应`remote/`目录下的服务器代码，并根据配置的端口将远程服务暴露出来。该模块启动后，其他服务器即可连接配置的端口，向当前服务器发起rpc调用。

更多关于`pomelo-rpc`的使用细节，请参考[这里](https://github.com/NetEase/pomelo-rpc)。

###server

`server`模块使服务器具备处理客户端请求的能力。该模块主要实现了filter服务，根据当前服务器类型，加载对应`handler/`目录下的代码，并决定一个请求应该是在当前服务器处理还是应该路由给其他服务器处理。

###session

无配置项。提供globalSession相关服务的组件。加载该组件后，会在app上下文中加入`sessionService`，可以通过`app.get('sessionService')`获取。`sessionService`相关的接口信息请参考[Pomelo API](http://pomelo.netease.com/api.html)。


###sync

提供定时同步内存数据到数据库的服务。该组件加载后会在app向下文中加上`sync`属性，可以通过`app.get('sync')`来获取。

####配置

配置sync组件

```
app.load(pomelo.sync, {path:__dirname + '/app/dao/mapping', dbclient: dbclient});
```

其中，`path`是实现底层数据同步服务器的目录。`sync`会加载该目录下所有服务，并建立映射关系。`dbclient`是用来实现数据同步服务的回调参数。

数据同步服务示例

```
module.exports = {
  updateBag: function (dbclient, val, cb) {
    var sql = 'update Bag set items = ? where id = ?';
    var items = val.items;
    if (typeof items !== 'string') {
      items = JSON.stringify(items);
    }
    var args = [items, val.id];

    dbclient.query(sql, args, function (err, res) {
      if (err) {
        console.error('write mysql failed!　' + sql + ' ' + JSON.stringify(val));
      }
      cb(!!err);
    });
  }
};
```

通过sync更新数据

```
app.get('sync').exec('bagSync.updateBag', player.bag.id, player.bag);
```

更多关于`pomelo-sync`的使用细节，请参考[这里](https://github.com/NetEase/pomelo-sync)。
