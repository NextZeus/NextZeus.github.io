## 启动流程概述

pomelo启动的模型如下图：

![start_model](http://pomelo.netease.com/resource/documentImage/start_model.png)

### 启动入口
在使用pomelo进行游戏开发时，工程目录下的app.js是整个游戏服务器的启动运行入口。app.js中创建项目，进行默认配置并启动服务器的代码如下：
```javascript
var pomelo = require('pomelo');
var app = pomelo.createApp();
app.set('name', 'nameofproject');
app.start();
``` 
从上面的代码可以看出，用户首先需要在项目中引入pomelo，然后创建application的实例app，接着完成一些基本的应用配置，最后应用就可以启动了。当app.js运行起来后，pomelo会根据游戏的配置启动不同的相关组件及服务器。

### 服务器与组件
服务器启动流程的主要工作就是逐一启动app.load注册的组件。组件是连接pomelo框架和当前服务器所依赖的服务之间的桥梁。不同的服务器可以选择加载不同的组件。Pomelo提供了一些系统默认的组件，主要包括：handler, filter, master, monitor, proxy, remote, server, sync, connection。开发者也可以根据需要，开发自己的组件，并加载到服务器进程中。

组件同时是具有生命周期的，其生命周期可以包括start, after start, stop等。在组件中可以实现这些方法，应用服务器会在不同的运行阶段执行组件不同生命周期的方法。

## 启动流程详述

## 应用创建及启动
所有服务器的启动都是从运行app.js开始。每一个服务器的启动都首先创建一个全局唯一的application对象，该对象中挂载了所在服务器的所有信息，包括服务器物理信息、服务器逻辑信息、以及pomelo的组件信息等。同时，该对象还提供应用管理和配置等基本方法。
在app.js中调用app.start()方法后，application对象首先会通过loadDefaultComponents方法加载默认的组件。

## 组件加载
在加载组件时，系统会根据application对象中服务器的信息，针对不同的服务器加载不同的组件，从而使得不同服务器进程对外提供不同个服务。对于master服务器，主要加载的组件是master组件。Master组件主要负责根据根据servers.json文件中的配置信息和启动参数去启动其他服务器。对于其它服务器默认加载proxy、channel、sync、backendSession和server组件，特定的服务器还需要加载特定的组件，例如前端服务器会加载统计客户端连接数量的connection组件。具体组件的说明如下：

* master： master组件主要负责启动master服务器。
* monitor： monitor组件主要负责启动各个服务器的monitor服务，该服务负责收集服务器的信息并定期向master进行消息推送，保持master与各个服务器的心跳连接。
* proxy：  proxy组件主要负责生成服务器rpc客户端，由于系统中存在多个服务器进程，不同服务器进程之间相互通信需要通过rpc调用（master服务器除外）。
* remote： remote组件主要负责加载后端服务器的服务并生成服务器rpc服务端。
* server：server组件主要负责启动所有服务器的用户请求处理服务。
* connector: connector组件主要负责启动前端服务器的session服务和接收用户请求。
* sync： sync组件主要负责启动数据同步模块并对外提供数据同步功能。
* connection: connection组件主要负责启动用户连接信息的统计服务。
* channel: channel组件主要负责启动channelService服务，该服务主要提供channel相关的功能包括创建channel，通过channel进行消息推送等。
* session: session组件主要负责启动sessionService服务，该服务主要用来对前端服务器的用户session进行统一管理。
* backendSession: backendSession组件主要负责启动backendSession服务，该服务主要负责维护服务器本地session并与前端服务器进行交互。
* dictionary: dictionary组件主要负责生成handler的字典。
* protobuf: protobuf组件主要负责解析服务端和客户端的proto buffer的定义，从而对客户端和服务端的通信内容进行压缩。

组件加载情况具体如下图所示：

![components_load](http://pomelo.netease.com/resource/documentImage/components_load.png)

## 服务器启动
Master服务器首先会加载master组件，在master组件中会启动master服务器。当master服务器启动后，它首先会加载系统的adminConsole模块，然后根据用户servers.json文件的配置和master服务器传入的参数启动其它服务器 。其它服务器的启动过程和master服务器一样，从app.js进入，然后加载对应的组件，最后完成启动。
