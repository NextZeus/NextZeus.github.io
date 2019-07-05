##介绍
在游戏开发中，服务器的性能与扩展性是开发者心中最关心的问题。其次，根据游戏的不同类型，开发者需要依赖于不同的底层基础服务来完成游戏开发。

在更深入介绍游戏框架测试的性能数据之前，我们需要先简单定义游戏中场景及环境变量，这将使得游戏开发者能更好的评估我们的游戏框架的性能结果。在大型的多人游戏中，最关键的步骤之一就是在游戏上线前，通过性能测试查找到游戏的性能问题及框架瓶颈，这样也可以促使策划根据游戏的性能与部分限制更好的避开一些设计上的缺陷和热点问题。

##关注的问题
1. 最大并发用户数，即包括服务器的最大在线处理能力。<br/>
2. 资源的最大利用率，即为了满足需求的最大并发用户数，需要采用硬件配置或者现存的硬件配置能支持的最大用户数。<br/>
3. 服务器的可扩展性，即服务器能否方便地通过扩展来支撑更多的在线用户。<br/>
4. 服务器的响应时间及吞吐率，即用户的最短服务时间。<br/>

一般来讲，对于上面的这些问题很难提供唯一的答案，还需要其他很多关键的信息，比如：游戏的类型（MMO,SLG等），硬件的参数，消息发送频率，游戏逻辑的复杂性，游戏代码的效率，服务器的适当配置及可使用的网络带宽等。

在大型的多人在线游戏中，最重要的特性之一就是在线用户的并发数（简称CCU），它表明了服务器多人在线交互时的并发处理能力。并发在线用户的数量随着应用环境上下文改变而不同，即根据应用逻辑的复杂程度而不同。如果不考虑这些关键因素，并发用户数也是没有多大意义的。因此，可靠的性能数据需要提供相关的性能测试参数。

##性能考虑参数


CCU：游戏在线用户总数（包括现实和自动机器人）<br/>
消息到达率：每个用户消息的发送频率。<br/>
消息大小：用户发送的消息平均大小。<br/>
带宽使用率：服务器能处理消息的数量及相关开销。<br/>
资源的使用率：即测试服务器使用的资源。<br/>
硬件的环境：即测试所采用的服务器环境，包括CPU类型，内存，系统架构，操作系统类型等。<br/>
测试行为：即测试游戏的相关动作，也就是模拟用户的行为和测试的运行时间。<br/>

##性能测试
###测试环境及方法
测试服务器运行在千兆网卡环境，客户端运行在9台debian 6的虚拟机上。游戏服务器的硬件环境如下表格所示

<table class="confluenceTable"><tbody>
<tr>
<th class="confluenceTh"> 操作系统 </th>
<th class="confluenceTh"> CPU </th>
<th class="confluenceTh"> 内存 </th>
<th class="confluenceTh"> 网络 </th>
</tr>
<tr>
<td class="confluenceTd"> Linux version 3.2.0-3-amd64 (Debian 3.2.23-1) (debian-kernel@lists.debian.org)&nbsp;</td>
<td class="confluenceTd"> CPU核心:24<br class="atl-forced-newline"> </td>
<td class="confluenceTd"> 48394 MB<br class="atl-forced-newline"> </td>
<td class="confluenceTd"> Broadcom NetXtreme II BCM5709 1000Base-SX (C0) PCI Express <br class="atl-forced-newline"> </td>
</tr>
</tbody></table>

尽管上面的服务器配置还好，但是我们没有在所有的核上进行测试，只使用了6个进程（4个CONNECTOR,1个AREA，1个MASTER)来运行服务。CONNECTOR的服务器数据可以减少一半。因此也可以在4核的机器上完全运行。

为了尽可能的模拟测试服务的真实性，首先我们需要对服务器进行简短的预热，然后每次测试运行时间在30分钟左右，重点观察的数据包括服务器的负载，内存增长，连接数据等。

以下所有的测试数据基于nodejs-v0.8.8,socket.io-v0.9.6的版本，64位的debian操作系统。

服务器的资源使用都是通过使用TOP及相关工具进行采样。

###请求响应消息
主要测试服务器的输入与输出网络阻塞性能即网络IO处理能力，客户端与服务端通过Hello-World的模式进行，类似游戏场景的私人聊天或者互不影响的用户操作行为。


这个测试场景比较简单，服务器没有过多的逻辑处理，基本上属于抛球的方式来运行，客户端按每秒发送80字节大小的消息，基本可以达到25000在线并发用户。

考虑到还有其他方面的开销，比如用户连接信息等，保守估计，可以支持的在线用户数据大概在20000左右，

###广播消息
完全模拟正常游戏的逻辑，包括登录，移动，打怪及抢宝等功能。这些操作发生时，每个用户的操作信息都需要发送给其他在线用户，属于广播的类型。
每个在线的用户会每隔2秒发起一次清求，请求的数据大部分在30～240 byte 大小之间。

![boardcast result](http://pomelo.netease.com/resource/documentImage/perform/boardcast.png) 

服务器运行一段时间后的占用资源如下：

![boardcast resource percent](http://pomelo.netease.com/resource/documentImage/perform/bdtop.png) 

##稳定性

最后，我们对服务器进行了用户为期三天的稳定性能测试，在线用户分别为400，600，800并发操作，运行基本正常。下面是运行400个并发操作的系统整体资源使用情况。

###系统CPU运行情况

![boardcast resource percent](http://pomelo.netease.com/resource/documentImage/perform/scpu.png) 

###单个CPU的运行数据

![single cpu percent](http://pomelo.netease.com/resource/documentImage/perform/sscpu.png) 


###系统内存运行结果


![smemoryresource percent](http://pomelo.netease.com/resource/documentImage/perform/smemory.png) 


###系统负载运行结果

![load percent](http://pomelo.netease.com/resource/documentImage/perform/sload.png) 

###网络IO运行结果

![io percent](http://pomelo.netease.com/resource/documentImage/perform/sio.png) 

##总结

尽管随着游戏的功能需求会与我们的测试用例不同，但是抽象后的业务逻辑基本上差不多，本游戏引擎从上面的测试结果完全可以满足大部分的游戏应用。当然，游戏的逻辑操作的性能会影响到整体的性能，从上面引擎的测试数据可以看出，引擎底层的性能表现稳定。用户只需要重点关注本业务的相关性能问题。