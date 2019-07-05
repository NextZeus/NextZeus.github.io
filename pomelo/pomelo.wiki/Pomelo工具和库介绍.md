pomelo 提供了一系列的工具和库供开发者使用，这些工具和库能够协助开发者更好地完成应用开发、调试以及部署等工作。这些工具和库涵盖全面，有管理控制工具，有用来做压力测试的工具，也有一些比较通用的库。

* **命令行工具pomelo**

pomelo框架提供的一个较简单的工具，该工具可以帮助开发者更便捷、更有效地进行应用开发，包括创建项目、启动应用、停止应用、关闭应用等等，请参考[pomelo命令行工具使用](pomelo命令行工具使用)。

* **pomelo-cli**

pomelo-cli是一个pomelo服务器群的管理客户端，通过连接注册到master服务器，可以对服务器群进行较为高级的管理，如运行时动态的添加关闭服务器，查看服务器的状态等等。请参考[pomelo-cli更详细的文档](pomelo-cli使用)。

* **pomelo-robot**

pomelo-robot是一个用来对pomelo游戏框架进行性能测试的工具，可以帮助开发者做一些压力测试，请参考[pomelo-robot更详细的文档](https://github.com/NetEase/pomelo/wiki/pomelo-robot%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)

* **pomelo-daemon**

pomelo-daemon 提供了一个 daemon 服务，可以用这个服务来进行分布式部署以及日志收集。请参考[pomelo-daemon的使用](pomelo-daemon的使用)。

* **pomelo-admin-web**

pomelo-admin-web 是 pomelo 框架中基于[pomelo-admin](https://github.com/NetEase/pomelo-admin)开发的web端监控的模块，可以通过 web 端的方式来对游戏服务器集群的运行状态，性能，日志等进行实时的监控。请参考[pomelo-admin-web工具的使用](pomelo-admin-web工具的使用)。

* **pomelo-sync**

pomelo-sync 模块是用来管理游戏进程中需要持久化的数据在内存与存储系统之间同步的。请参考[pomelo sync 使用文档](https://github.com/NetEase/pomelo/wiki/pomelo-sync%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)

* **pomelo-protobuf**

pomelo-protobuf 是对google protobuf的一个实现，借助javascript的语言特性，实现了类.proto文件的运行时解析，并用在pomelo框架中，完成对要传输消息的压缩。protobuf不仅可以用在服务端，也同样可以用于web客户端。具体请参考[pomelo-protobuf](https://github.com/pomelonode/pomelo-protobuf)。

