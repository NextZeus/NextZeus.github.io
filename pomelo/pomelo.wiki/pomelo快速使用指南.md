# 简介
Pomelo是基于node.js的高性能、分布式游戏服务器框架，通过一些简单的命令，就可以实现强大的功能，帮助你避免游戏开发中枯燥的重复劳动和底层逻辑。目前pomelo(>=0.2.3)已经完全支持Windows、Linux、Mac这三种不同系统。

# 安装
如果是Windows系统，请确保你的Windows系统包含源码编译工具。Node.js的源码主要由C++代码和JavaScript代码构成，但是却用[gyp](http://code.google.com/p/gyp/)工具来做源码的项目管理，该工具采用Python语言写成的。在Windows平台上，Node.js采用gyp来生成Visual Studio Solution文件，最终通过VC++的编译器将其编译为二进制文件。所以，在安装之前请确保你的Windows系统满足以下两个条件：
* [Python](http://python.org/)(2.5<version<3.0)。
* VC++ 编译器，包含在[Visual Studio 2010](http://msdn.microsoft.com/en-us/vstudio/hh388567)中（VC++ 2010 Express亦可）。

使用npm(node包管理工具)全局安装pomelo: 
>npm install pomelo -g（如果是apt-get安装的node，需要单独安装g++，node的版本建议为0.8系列）

可以通过命令`git clone https://github.com/NetEase/pomelo.git`下载源代码。

# 使用方法

## 新建项目
可以使用下面两种方式建立一个新的项目：

### 方式一
  * pomelo init 命令后添加项目路径参数:`pomelo init ./helloWorld`； pomelo命令会自动创建目录helloWorld，并初始化该项目。

### 方式二
  * 本地新建目录：
>mkdir helloWorld

  * 进入新建目录：
>cd helloWorld

  * 初始化项目：
>pomelo init .

  * 安装依赖包：
>sh npm-install.sh(如果是Windows环境直接运行：npm-install.bat )

新建立的项目结构如下图所示：

![新建项目目录结构](http://pomelo.netease.com/resource/documentImage/helloWorldFolder.png)

该目录结构很清楚的展示了游戏项目的前后端分层结构，分别在各个目录下填写相关代码，即可快速开发游戏。下面对各个目录进行简要分析：

### game-server
Game-server是用pomelo框架搭建的游戏服务器，以文件app.js作为入口，运行游戏的所有逻辑和功能。在接下来的开发中，所有游戏逻辑、功能等代码都在该目录下进行。
#### config
Config包括了游戏服务器的所有配置信息。配置信息以JSON文件的格式进行定义，包含有日志、master等服务器的配置信息。该目录还可以进行扩展，对数据库配置信息、地图信息和数值表等信息进行定义。
### logs
日志是项目中不可或缺的，可以对项目的运行情况进行很好的备份，也是系统运维的参考数据之一。logs存放了游戏服务器所有的日志信息。
### shared
Shared存放一些前后端、game-server与web-server共用代码。
### web-server
Web-server是用express框架搭建的web服务器，以文件app.js作为入口，当然开发者可以选择Nginx等其他web服务器。

## 启动项目

启动项目必须分别启动game-server(游戏服务器)和web-server(web服务器)。

启动game-server服务器：>pomelo start [development | production] [--daemon]

启动web-server服务器：>cd web-server && node app

在不同的环境下运行，项目的启动方式稍有不同,如果是开发环境则选择development参数（默认值，可不填），如果是产品环境
则必须选择production参数（跨多服务器需要支持ssh agent forward）。项目默认是前台运行，若想后台运行项目，请选择参数"--daemon"。

daemon模式运行项目需安装forever模块，安装命令：`npm install forever -g`

启动项目后，用支持websocket的浏览器(推荐使用chrome)访问 http://localhost:3001 或者 http://127.0.0.1:3001 即可。


## 服务器状态查看
使用"pomelo list"命令查看各服务器状态，如下图所示:

<center>
![test](http://pomelo.netease.com/resource/documentImage/pomeloList.png)
</center>

服务器状态可以查看6种状态信息：
* serverId：服务器的serverId，同config配置表中的id。
* serverType：服务器的serverType，同config配置表中的type。
* pid：服务器对应的进程pid。
* headUsed：该服务器已经使用的堆大小（单位：兆）。
* uptime：该服务器启动时长（单位：分钟）。

## 关闭项目
可以使用以下两种方式关闭项目：

### pomelo stop [id]

`pomelo stop`优雅地关闭各个服务器，具有以下特点：

* 前端服务器首先断开连接，阻止新玩家进入游戏，用户体验好。
* 各服务器按顺序关闭自身的功能，保证游戏逻辑正常。
* 玩家状态等信息及时写入数据库，保证数据的完整性。

`pomelo stop id` 会关闭特定服务器，该命令需在项目根目录下进行。由于关闭特定服务器会导致服务器状态信息等丢失，所以建议首先做好该服务器状态信息的维护和备份等工作。

### pomelo kill [--force]
该方式直接kill掉项目进程，比较粗暴，安全性低，开发环境下可以使用，产品环境慎用。如果还有残留进程杀不干净可使用--force参数。 

### pomelo add host=[host] port=[port] id=[id] serverType=[serverType]

动态添加服务器，添加的参数必须包括服务器ip地址(host),服务器端口号(port)，服务器标识(id)，服务器类型(serverType)。目前只支持后端服务器的动态添加，该命令需在项目的根目录下使用。

# 管理控制台(adminConsole)
管理控制台是方便用户对项目的运行状态进行监控获取感兴趣的信息，配合pomelo项目使用。该控制台web的形式提供了以下功能：
* 监控服务器状态、日志、在线用户和场景数据等。
* 运用脚本灵活获取相关游戏数据。
* 运用profiler对项目中各个服务器的内存堆栈及cpu消耗动态实时跟踪和分析。

管理控制台会对系统内存、cpu等信息搜集，请确保操作系统(linux)安装了sysstat工具集，参见命令`apt-get install sysstat`.

## 安装管理控制台
>git clone https://github.com/NetEase/pomelo-admin-web.git

>cd pomelo-admin-web

>npm install -d

>node app

如果你的linux系统未安装sysstat， 先执行以下命令

>apt-get install sysstat

浏览器中访问： http://localhost:7001， 就可以打开管理控制台界面。
如果端口有冲突，请在config/admin.json修改端口，访问的浏览器必须支持websocket，推荐使用chrome。系统默认是将监控禁掉了，如果需要开启可以在game-server/app.js配置app.enable('systemMonitor')，具体可以参考lordofpomelo源码。
# production环境背景知识
production环境下，如果游戏服务器各进程运行在多服务器上，则各服务器需支持ssh agent forward， 并且项目在所有服务器里的目录是一致的。

##以下文档是ssh agent forward配置的说明：
* [Getting Started with SSH](http://kimmo.suominen.com/docs/ssh/)
* [What is an SSH Agent](http://en.wikipedia.org/wiki/Ssh-agent)
* [How SSH Agent Forwarding Works](http://unixwiz.net/techtips/ssh-agent-forwarding.html)
* [What are deploy keys?](https://help.github.com/articles/managing-deploy-keys)