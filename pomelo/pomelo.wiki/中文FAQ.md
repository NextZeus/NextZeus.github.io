* 使用nodejs开发相对于使用传统语言，C++等，是否会有性能问题？
>基于V8的Node.JS代码本身已经十分快速了，而node.js带给我们的io优势更是传统语言无法比拟的。 node.js唯一的劣势是计算密集型的操作，但是，通过良好的架构设计是可以避免这一问题的。在我们开发游戏demo的过程中，node.js在一些性能指标上得到了比传统语言平台更好的性能！

* 我想使用pomelo，那是不是意味着我的服务端都要用nodejs开发呢？
>现阶段pomelo还不支持跨语言扩展。但执行编译成js的语言都可以使用， 如coffeescript。

* pomelo服务器支持哪些操作系统？
> 支持Linux、Mac和Windows操作系统。
* 非javascript的客户端， 是否可以使用pomelo？
> pomelo是基于socket.io开发的， 目前socket.io几乎支持所有语言的客户端开发包，可参考[socket.io的wiki](https://github.com/LearnBoost/socket.io/wiki)；同时我们提供object-c、java、flash客户端，可参考[pomelo的wiki](https://github.com/NetEase/pomelo/wiki/Home-in-Chinese)。

* 使用pomelo start命令与使用game-server/node app.js启动game server有什么区别？
> 使用pomelo start时， 系统会在文件中记住相关启动选项，如当前的启动模式是production还是development，是否daemon模式等等。使用node app.js则没有记录这些信息， 这有可能导致pomelo stop时出现问题。一般建议用pomelo start。

* 后台进程在跑，没有kill干净，导致端口冲突，怎么处理?
> 本地调试可使用pomelo kill命令，如果还有应用的进程没有kill掉，可以使用命令pomelo kill --force 强制关闭所有应用相关进程。 production环境必须用pomelo stop来完成，否则可能丢数据。

* 如何在某个进程的命令行添加参数， 如调试端口等？
> 修改配置文件./game-server/config/server.json，为目标服务器添加args参数，例如为connector服务器添加参数如下：
```
“connector”:[{"id":"connector-server-1", "host":"127.0.0.1", "port":4050, "wsPort":3050, 
"args":"--debug=[port] --trace --prof --gc"}]
```
* 开发环境的启动与产品环境下的启动有什么不同?
> 开发环境使用development模式（默认模式）， 因此不需要加参数。而产品环境下启动一般使用production模式，而且进程一般使用daemon模式运行，需使用命令： pomelo start production --daemon， 注：daemon模式需要系统安装forever模块。
* 产品环境扩展到多台服务器， 如何配置？
> 如果只是简单的并行扩展，只需要在./game-server/config/server.json中对应服务器类型中加入一行新的server配置就可以了。如果是业务逻辑的拆分，则需要根据具体业务逻辑而定。 

* 本地demo(lord of pomelo)登陆不进去
> 可能出现的情况如下：
   浏览器不支持websocket,需要chrome等支持websocket的浏览器。可以使用网站 http://websocketstest.com/ 检测是否支持websocket; 端口被占用，修改./game-server/config/server.json。

* pomelo 安装失败？
>
```
gyp ERR! build error 
gyp ERR! stack Error: make failed with exit code: 2
gyp ERR! stack at ChildProcess.onExit (/usr/lib/nodejs/npm/node_modules/node-gyp/lib/build.js:236:23)
gyp ERR! stack at ChildProcess.EventEmitter.emit (events.js:99:17)
gyp ERR! stack at Process._handle.onexit (child_process.js:678:10)
gyp ERR! System Linux 3.5.0-17-generic
gyp ERR! command "node" "/usr/lib/nodejs/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /home/benqy/node_modules/v8-profiler
gyp ERR! node -v v0.8.14
gyp ERR! node-gyp -v v0.7.1
gyp ERR! not ok 
npm ERR! v8-profiler@3.6.2-1 install: node-gyp rebuild
npm ERR! sh "-c" "node-gyp rebuild" failed with 1
npm ERR! 
npm ERR! Failed at the v8-profiler@3.6.2-1 install script.
npm ERR! This is most likely a problem with the v8-profiler package,
npm ERR! not with npm itself.
npm ERR! Tell the author that this fails on your system:
npm ERR! node-gyp rebuild
npm ERR! You can get their info via:
npm ERR! npm owner ls v8-profiler
npm ERR! There is likely additional logging output above.
npm ERR! System Linux 3.5.0-17-generic
npm ERR! command "nodejs" "/usr/bin/npm" "install" "v8-profiler"
npm ERR! cwd /home/benqy
npm ERR! node -v v0.8.14
npm ERR! npm -v 1.1.65
npm ERR! code ELIFECYCLE
```
导致该错误的原因可能是node不是源码安装，没有安装g++。

* Mac 安装pomelo失败？
>
```
gyp ERR! command "node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /usr/local/lib/node_modules/pomelo/node_modules/pomelo-admin/node_modules/v8-profiler 
```
原因：Xcode中没有安装command line tools。

* How do I contribute to pomelo?
> Welcome anyone contribute code to pomelo, we will put your name on the contributor list. You can follow us on github, and contribute code or modules to pomelo project.