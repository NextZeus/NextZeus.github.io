# Lordofpomelo介绍
Lordofpomelo是一个基于pomelo框架开发的分布式MMO RPG游戏Demo。

## Lordofpomelo 的组队功能模块
组队功能是玩家之间互动的一种方式. 玩家可以创建队伍并邀请其他玩家加入, 其他玩家也可以主动向队长提出申请加入队伍, 队伍的人数上限为3, 如下图所示:

![team](http://pomelo.netease.com/resource/documentImage/lordofpomelo/team.png)

"teamHandler.js"为协议入口模块, 负责处理队伍相关操作的前期判断和后期通知. teamHandler做完前期判断之后, 通过一个rpc将操作所需的参数传给manager服务器. 队伍对象的管理工作是由manager服务器所持有一个全局的"teamManager.js"模块来负责的. 在teamManager中管理所有的team对象的创建,更改及销毁等操作. 

队伍id从"1"开始递增, 所有场景中的队伍使用统一的id序列, 当manager服务器重启时, 队伍id也重新初始化为"1". 在"team.js"模块中维护一个队伍对象中的所有成员及成员身份, 维护一个队伍频道来通知各成员队伍相关的消息及进行队伍内的聊天. 

同一队伍中的玩家可以进入同一个组队副本.

## Lordofpomelo 的副本功能模块
目前有两种副本可以供玩家进入: 组队副本和单人副本. 在desert场景(Scene I)中的Malygos, Illidan可以分别把玩家带入组队副本和单人副本, 如下图所示:

<img src="http://pomelo.netease.com/resource/documentImage/lordofpomelo/gameCopy.png" alt="game copy" width="765px"></img>

当队伍中有两个及以上玩家, 队长点击Malygos进入组队副本时, 队伍中的队员会被同时拉入副本中. 队伍中的队员也可以单独进入组队副本, 但不会触发将队伍中的其他成员拉入副本的操作, 其他成员可以分别进入该副本. 

玩家进入副本也被视为切换场景, 在"areaService.js"模块中的changeArea函数中进行目标场景类型判断, 如果是普通场景则正常切换, 如果是副本场景则通过一个rpc来创建副本. 组队副本创建时的id与队伍id相关, 单人副本创建时的id与玩家id相关. 组队副本创建成功后, 如果是队长触发的操作则向其他队员客户端发送进入副本的命令, 如果是队员则直接进入副本中.

副本("instance.js")本质上是一个临时的场景, 并对进入该临时场景的玩家进行限制. instance由模块"instancePool.js"来统一管理, 这与队伍功能模块的结构是相同的.