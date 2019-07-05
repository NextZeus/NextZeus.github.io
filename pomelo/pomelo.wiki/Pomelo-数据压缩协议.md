# Pomelo 数据压缩协议

在pomelo 0.3中，为了减少数据传输带宽，提高传输效率，我们支持了基于字典的route压缩和基于protobuf的传输数据压缩。

## 基于字典的route压缩

### route字段分析

pomelo中的route是用来确定消息的分发路径，将其交给相应的服务器和服务处理的。route分为两类，由客户端发给服务端消息时使用的route和服务端向客户端广播时使用的route。
* 前一种route是由服务器自动生成的，其中的字段就代表了对应的方法在服务端的位置。如“area.playerHandler.attack”则表示在“area”服务器上的“playerHandler”接口中提供的“attack”方法。
* 后一种route是服务端向客户端推送消息时使用，如“onMove”，“onAttack”等，这些字段是由用户自己定义的。
在一般的web应用等带宽不敏感的环境中，route字段的开销是可以接受的。而在一些移动应用中，带宽～money的情况下，精简route字段就变得有必要了。

### Pomelo中route压缩的问题
原有的route模式不能支持方便的数据压缩；
* 对pomelo生成的route来说，如“area.playerHandler.attack”,其中的每一个都表示系统中的路径，因此除非修改目录和方法名称，否则无法进行精简。
* 用户自定义的route，如“onMove”，“onAttack“等可以较方便的进行精简。但是用户直接可对内容修改会导致route名与实际的语义脱离，从而降低代码的可读性，而简化后的route也增加了路由冲突的可能性，更整个项目的管理带来困难。

### Pomelo 中的route压缩
Pomelo 0.3版中实现了基于字典的route压缩，其实现如下：
* 对于系统生成的route，如“area.playerHandler.attack"，在系统启动时会对每一个route生成唯一的字典（16位的short int）。
* 对于用户自定义的route，如“onMove”，“onAttack”，则需要用户提供一个自定义的route列表，pomelo会根据这一个列表对每个用户自定义的route生成一个字典项。
	在开启字典功能的状态下，当有消息传递时，其中的route在发送时会被替换为在字典项（16bit short int），而接收端会自动还原，这一过程对于用户而言是完全透明的。要使用这一功能，只需要在app.js中配置开启就可以了，具体示例如下：
```
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useDict : true,
			handshake : function(msg, cb){
				cb(null, {});
			}
		});
```

其中的userDic：true就表示打开字典压缩。默认字典包括所有系统自动生成的route，如"area.playerHandler.move"等。用户自定义的route则需要用户自己指定，具体方式是在项目的/game-server/config/dictionary.json文件中列出需要压缩的自定义route，其内容示例如下：

```
[
	"onDropItem",
	"onAttack",
	"onDied",
	"onMove",
	"onUpgrade",
	"onPickItem",
	"onRevive",
	"addEntities",
	"onRemoveEntities",
	"onPathCheckout"
]
```

可以看到，dictionary.json的内容就是一个string的数组，其中的内容是需要压缩的route。Pomelo在启动时会自动读取其中的内容，生成数据字典，并在数据传输时进行替换/还原。

## 基于protobuf的数据编码协议 
在Pomelo 0.3中，我们实现了基于protobuf的数据编码协议，与其他的编码协议如xml，json相比，protobuf有着更好的传输效率和压缩比率。在我们的lordofpomelo项目中，使用protobuf进行数据编码后的消息大小只有基于Json的编码的20%左右。

### protobuf协议介绍
protobuf协议是由Google制定的，主要用于其内部的rpc调用和文件编码。原生的protobuf包括两部分内容：基于二进制的数据编码协议和基于proto元数据的代码生成器。首先，需要根据每条消息来编写对应的proto文件，然后使用google提供的代码生成器，基于proto文件来生成相应的编码器和解码器，然后使用生成的编/解码器来进行编/解码操作，对应的流程如下图：

![原生protobuf](http://pomelo.netease.com/resource/documentImage/protocol/Protobuf_origin.png)

这种方式的优势是代码静态生成，运行时不需要proto文件信息，而且可以根据具体的信息内容对代码进行优化。但缺点也十分明显：使用复杂（涉及到代码生成，编译，部署），改动成本高昂（需要重新生成，编译代码，并对代码进行部署），需要生成大量新代码（每个消息都需要一个独立的编码/解码器）。

关于protobuf协议的更多内容，可以参见其官网[Protobuf项目](https://code.google.com/p/protobuf/)。

### Pomelo 中的protobuf

原生的带有代码生成器的protobuf过于重量级，缺乏灵活性，任何消息的修改都会是一个非常重量级的操作，而这个在pomelo中应该是经常发生的。而随之带来的大量的代码生成会大大增加客户端的体积和部署难度。因此，我们没有采用生成代码的方式，而是根据proto文件的定义，对消息进行即时的解析。

#### Pomelo protobuf实现

在pomelo中，我们实现了一个通用的protobuf编/解码器，以及一个proto文件解析器。通过分析proto文件内容，实现了对消息的编码/解码。这样，当修改/添加消息类型时，只需要修改对应的proto文件就可以了。具体的运行流程如下图：

![pomelo protobuf](http://pomelo.netease.com/resource/documentImage/protocol/Protobuf_pomelo.png)

从上图可以看出，与原生的protobuf生成代码的方式相比，pomelo中的解决方案要更将灵活，轻量。不需要生成任何代码，在运行时通过proto文件中对消息的定义，实现对消息的动态编码/解码功能。

#### Proto 文件定义

原生的protobuf中，每一个消息与一个proto文件对应，而在生成编码/解码器之后，这个proto文件就不再被使用。
而在pomelo中，因为我们需要proto的内容来动态的对消息进行编码/解码，因此需要维护一个完整的protos信息表，一一对应的方式不但管理困难，也没有必要。因此将所有的proto定义放在一个json文件中，通过一个独立的key来进行区分，在pomelo中，key就是消息的route，我们的protos文件格式如下：

```
"onMove" : {
    "required uInt32 entityId" : 1,
    "message Path": {
      "required uInt32 x" : 1,
      "required uInt32 y" : 2
    },
    "repeated Path path" : 2,
    "required uInt32 speed" : 3
  },
  "onAttack" : {
    "required uInt32 attacker" : 1,
    "required uInt32 target" : 2
  }
```

这里的key就相当于原生protobuf中的proto文件中的消息名称，proto定义具体的语法也是按照protobuf标准来实现的，只是采用了对于js更容易解析的json形式。

在pomelo中，对于同样route的消息，如‘area.playerHander.attack'，在客户端和服务端的格式可能完全不同，这就意味着对于客户端的编码器和解码器对于同样route的消息需要不同的定义。因此，我们需要两套protos文件，server protos和client protos，具体的关系如下图：

![pomelo protobuf protos](http://pomelo.netease.com/resource/documentImage/protocol/Server_Client_Protos.png)

#### 使用Protobuf

虽然protobuf的实现看上去十分复杂，但由于这一层对用户是完全透明的，使用会非常简单。用户只需要通过简单的两步定义就可以在原有的项目中开启protobuf功能。
首先，需要在connector组件上打开protobuf开关，在app.js中的配置如下：

```
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			useProtobuf : true,
			handshake : function(msg, cb){
				cb(null, {});
			}
		});
```

实际上需要加入的就是“useProtobuf：true”这一项。当设置这一标识后，pomelo会在客户端握手时将protos内容同步到客户端，并默认开启protobuf压缩功能。
在protobuf功能开启用，用户还需要加入protos定义来实现对具体消息的编码/解码。
protos文件默认在/game-server/config目录下，包括两个文件：serverProtos.json和clientProtos.json，分别表示服务端->客户端消息的protos和 客户端->服务端消息的protos。只要在其中加入有效的proto定义，就可以开启对应消息的protobuf编码功能。

#### 与老项目的兼容性

Pomelo中的protobuf实现对原有项目是完全兼容的，你可以直接在老的项目中打开protobuf开关而不会引起任何问题。只是当proto定义是空的，默认所有的消息都不会经过protobuf压缩，而是采用默认的二进制编码进行传输。
当你相对某个消息进行protobuf编码时，只需要在对应的protos文件（serverProtos.json或clientProtos）中加入对应的protobuf项，pomelo在启动时就会自动识别并对消息进行压缩，而不会对其他未定义的消息产生任何影响。