# The architecture overview of pomelo

This article is about the design and technical choice of pomelo. 
Why we choose node.js, why we use this architecture and why we design in this way. It is based on our experience of game development and a lot of studies on previous game server solutions.

이 문서는 포멜로의 디자인과 기술적인 선택에 관한 것 입니다. 우리가 왜 Node.js를 선택했는지, 왜 이 기술을 사용했는지, 그리고 왜 이러한 방식을 구상했는지. 그것은 우리의 게임 개발의 경험과 이전의 게임 서버 솔루션에 대한 많은 연구에 기반을 두고 있습니다.

## Why do we choose node.js?
Node.js is astonishingly suitable for game server development.
In the definition of node.js, fast, scalable, realtime, network, all these features are quite suitable for game server. 

Game server is a high density real time network application, the network io advantage makes node.js and game server a perfect match.
But IO is not the only reason for us to choose node.js, here is all the reasons why we choose node.js:
* Network IO and scalability. Perfect match for game servers, which requires realtime, scalability, high density network IO.
* The node.js thread model. Single thread is quite suitable for game server, it helps us to handle all the troubles about concurrency, lock and other annoying questions. Multi-process, single thread is ideal for game server.
* The language advantages. Javascript is powerful, popular and performance good. Further more, if you choose HTML 5 for client, you can reuse a lot of code logic between server and client.

## 왜 Node.js를 선택해야 하나요?

Node.js는 게임 서버 개발에 놀라울 정도로 적합합니다. Node.js에 정의된 고속, 규모 가변적, 리얼타임, 네트워크등의 이러한 모든 기능들은 게임 서버 개발에 굉장히 적합합니다. 

게임 서버는 고밀도 리얼타임 네트워크 어플리케이션인데, 이 네트워크 IO의 장점은 Node.js와 게임 서버를 완벽하게 매치되게 합니다. 그러나 IO는 우리가 node.js를 선택하게된 유일한 이유는 아니고, 다음에 우리가 왜 node.js를 선택하게 된 모든 이유가 있습니다:
* 네트워크 IO 및 확장 성. 실시간, 확장성, 고밀도 네트워크 IO가 요구되는 게임 서버와 완벽한 일치.
* Node.js 스레드 모델입니다. 싱글 스레드는 게임 서버에 대한 매우 적합한데, 우리가 병렬처리(concurrency), 자원고정(lock) 그리고 다른 성가신 의문에 대한 모든 문제를 처리하는 데 도움이됩니다. 멀티 프로세스, 싱글 스레드는 게임 서버에 이상적입니다.
* 언어의 장점. 자바 스크립트는 강력하고 인기있으며 성능이 좋습니다. 뿐만아니라 당신이 클라이언트로 HTML5를 선택한다면, 서버와 클라이언트의 많은 코드 로직을 재사용 할 수 있습니다.

### The game server runtime architecture

A scalable game server runtime architecture must be multi-process, single process does not scale, even node.js. [gritsgame](http://code.google.com/p/gritsgame) from google and [browserquest](https://github.com/mozilla/BrowserQuest) from mozilla all use node.js as game server, but only single process, which means their online users are limited.

### 게임 서버 런타임 아키텍처

규모 가변적인 게임 서버 런타임 아키텍처는 반드시 멀티 프로세스여야 합니다. 싱글 프로세스는 가변적이지 않습니다. 구글의 gritsgame과 mozilla의 browerquest는 모두 Node.js를 게임 서버로 씁니다. 오직 싱글 프로세스라면 이것은 온라인 유저의 제한을 뜻합니다.

### A typical multi-process MMO runtime is following:

### 전형적인 멀티-프로세스 MMO 런타임은 다음과 같습니다:

 ![runtime architecture of MMO](http://pomelo.netease.com/resource/documentImage/mmoArchitecture.png)


#### Memo of runtime architecture
* Clients connect to the servers through websocket
* Connectors do not handle logic, it just forward the messages to backend server
* The backend servers include area, chat, status and other type servers, they all handle logic. Most of the game related logics are handled in area servers.
* The backend servers will send back the result to connector, connector then broadcast to related clients.
* Master manages all these servers, including startup, monitor, close etc.

#### 런타임 아키텍처의 요점
* 클라이언트는 웹소켓(websocket)을 통해 서버에 연결
* 커넥터(Connectors)는 로직을 처리하지 않고, 그냥 백엔드 서버(backend server)로 메시지를 전달
* 백엔드 서버는 area, chat, status 그리고 다른 타입의 서버들 포함하고 그것들이 로직을 처리합니다. 게임과 관련되 대부분의 로직은 area 서버에서 처리됩니다.
* 백엔드 서버가 커넥터에 결과를 다시 보내고, 그 다음 커넥터는 관련 고객에게 전파 합니다.
* 마스터(Master)는 시작, 모니터, 종료등을 포함해서 이러한 서버들을 관리합니다.

### The difference between game servers and web servers
It looks like web servers and game servers are similar, but actually it's not:
* Long connection VS short connection. The game servers must connect with socket, which is critical for realtime network application. Long connection architecture makes it all different, since all the servers are tightly coupled.
* Difference partition strategies. Game server is based on area based partition strategy, because it can minimize cross process invocation. But web servers can be partitioned based on any load balance strategies, which makes web app more scalable.
* Stateful VS stateless. Because of the partition strategy, the game server is stateful, which limits game server's scalability.
* Broadcast VS request/response. Not like web, Game servers need a lot of broadcasts, even a small action must be notified to related players. These broadcasts make network communication a big burden.

### 게임 서버와 웹 서버의 차이점
웹 서버와 게임 서버는 유사한 것처럼 보이지만 실제로는 그렇지 않습니다:
* 롱 커넥션 대 숏 커넥션. 게임 서버는 실시간 네트워크 응용 프로그램에 중요한 소켓과 연결해야합니다. 모든 서버가 긴밀하게 결합되어 있기 때문에 롱 커넥션 아키텍처는 모든게 다릅니다.
* 파티션 전략 차이. 크로스 프로세스 호출을 최소화 할 수 있기 때문에 게임 서버는 에어리어 파티션 전략을 기반으로 합니다. 그러나 웹 서버는 웹 응용 프로그램을 더욱 확장하는 로드 밸런싱 전략을 바탕으로 분할 될 수 있습니다.
* 상태 유지 대 상태 비유지. 분할 전략으로, 게임 서버는 확장을 막도록 상태를 유지 합니다.
* 전파 대 요청/응답. 웹과 달리, 게임 서버는 많은 전파를 필요로 하는데, ​​심지어 작은 액션도 관련 플레이어들에게 통지 되어야 해야합니다.

### The runtime architecture of a game is so complicated that we need a framework to simplify it.
Not like web, there are not so much open source game frameworks, not event this architecture.
Pomelo is a rescue, it let you write as little code as possible to support this complicated runtime architecture.

### 게임의 런타임 아키텍처는 매우 복잡해서 우리는 그것을 단순화하는 프레임워크를 필요로 합니다.
웹과 달리, 오픈소스 게임프레임워크는 많지 않으며, 이러한 아키텍터도 아닙니다.
포멜로는 구제이며, 아주 적은 코드로 복잡한 런타임 아키텍처를 지원하도록 합니다.

## Introduction to pomelo framework
The following is components of pomelo framework:

## 포멜로 프레임워크 소개
다음은 포멜로 프레임워크의 구성 요소입니다

 ![pomelo framework](http://pomelo.netease.com/resource/documentImage/pomelo-arch.png)

* server management, it is especially important in this multi-process, distributed architecture.
* network, request/response, broadcast, RPC, session, all these construct the game logic flow.
* application, this is crucial for loosely coupled architecture, app DSL, component, context makes pomelo pluggable and easy to extend.

* 서버 관리, 그것은 분산 아키텍처, 멀티 프로세스에 특히 중요합니다.
* 네트워크, 요청/응답, 전파, RPC, 세션, 이러한 모든 것들은 게임 로직 흐름을 구성합니다.
* 어플리케이션, 이것은 느슨한 결합 아키텍처에 매우 중요하고, app DSL, 컨포넌트, 콘텍스트는 포멜로가 플러그 가능하게 쉽게 확장하록 합니다.

### The design goal of pomelo

* Servers abstraction and extension.

In web app, servers are stateless, loosely coupled, so there is 
no need for a framework to manager all these servers.
Game apps, however, are different. All these servers work tightly together, and there are a lot of server types. We need to support all these server types and servers extension.

* Request/response, broadcast abstraction

We need a request, response mechanism, or more specifically, a request/broadcast mechanism. Since broadcast is the most usual action in game servers, and potentially a performance bottleneck.

* Servers rpc communication

Servers need to talk to each other, although we try to avoid it.We need a rpc framework as simple as possible.

### 포멜로의 디자인 목표

* 서버 추상과 확장.

웹 어플리케이션에서는 서버 상태가 유지되지 않고, 느슨하게 결합되기 때문에, 이러한 서버들은 관리할 프레임워크가 필요없습니다. 그러나 게임 어플리케이션은 다릅니다. 모든 서버는 밀접하게 작동하고, 다양한 서버 종류가 있습니다. 우리는 모든 서버 종류 및 서버 확장을 지원해야합니다. 이러한 서버 종류들과 서버 확장을 지원해야 할 필요가 있습니다.

* 요청/응답, 전파 추상화

우리는 요청, 응답 메커니즘, 또는 좀 더 특별한 요청/전파 메커니즘이 필요합니다. 전파는 게임 서버에서 일반적으로 쓰이고, 병목 현상 처리에 가능성이 있기 때문입니다.

* 서버 RPC 통신

우리가 피하려 해도, 서버는 서로 대화 할 수 있어야 합니다. 간단하게 가능한 rpc 프레임워크가 필요합니다. 

### Introduction to server abstraction and extenstion
#### Servers types
Pomelo divides servers in two types: frontend and backend, here it is:

### 서버의 추상화와 확장성 소개
#### 서버들의 종류
포멜로는 두 종류의 서버로 나눕니다. 프론트엔드와 백엔드 이와같이:

![server abstractions](http://pomelo.netease.com/resource/documentImage/serverAbstraction.png)

The responsibility of frontend servers :
 * handle client connection
 * maintain session information
 * forward request to backend
 * broadcast messages to clients

The responsibility of backend servers :
 * handle logic, including rpc and frontend logic
 * push result back to fronend

프런트 엔드 서버의 책임 :
* 클라이언트 연결 처리
* 세션 정보 유지
* 백엔드에 요청을 전달
* 클라이언트에게 메시지 전파

백엔드 서버의 책임 :
* rpc와 프론트엔드을 포함한 로직 처리
* 결과를 프론트엔드로 다시 푸쉬하기


#### The server duck type
Duck type is commonly used in OOP of dynamic language.
Servers, however can also use duck type idea. There are only two types of interfaces for a server:
 * handle client request, we call it handler
 * handle rpc call, we call it remote

All we have to do is to define handler and remote, which can define what the server looks like.

#### 서버 덕 타입
덕 타입은 동적 언어의 OOP에서 일반적으로 쓰입니다. 그렇지만 서버들도 덕타입 사상을 이용할 수 있습니다. 서버에 대한 두 종류의 인터페이스가 있습니다 :
* 핸들러에게 호출한 클라이언트 요청 처리
* 리모트에게 호출한 rpc 콜 처리

우리가 해야할 일은 서버가 무엇과 같이 보일지 정할 수 있는 핸들러와 리모트를 정의 하는 것입니다.

#### The implementation of server abstraction
The simplest way is to corresponding directory structure with server.  

Here is the example:

We just design a server called 'area', the behavior of the server is determined by the code in 'handler' and 'remote'.
All we need to do is to fill the code in handler and remote.
To make the server run, we need a small config file called servers.json. Here is the example file:

```json
{
  "development":{
    "connector": [
      {"id": "connector-server-1", "host": "127.0.0.1", "port": 3150, "wsPort":3010},
      {"id": "connector-server-2", "host": "127.0.0.1", "port": 3151, "wsPort":3011}
    ],
    "area": [
      {"id": "area-server-1", "host": "127.0.0.1", "port": 3250, "area": 1},
      {"id": "area-server-2", "host": "127.0.0.1", "port": 3251, "area": 2},
      {"id": "area-server-3", "host": "127.0.0.1", "port": 3252, "area": 3}
    ],
    "chat":[
      {"id":"chat-server-1","host":"127.0.0.1","port":3450}
    ]
  }
}
```

#### 서버 추상화의 구현
가장 단순한 방법은 디렉토리 구조를 서버와 일치시키는 것 입니다.

여기 예제가 있습니다:
![directory structure](http://pomelo.netease.com/resource/documentImage/directory.png)

우리는 '핸들러'와 '리모트'의 코드에 의해 행동이 결정되는 '에어리어(area)'라는 서버를 단지 설계 합니다. 우리가 해야할 일은 핸들러와 리모트에 코드를 채우는 것입니다. 서버를 실행하려면 servers.json 파일명의 조금만 설정 파일이 필요합니다.
예제 파일은 다음과 같습니다 :
```
{
  "development":{
    "connector": [
      {"id": "connector-server-1", "host": "127.0.0.1", "port": 3150, "wsPort":3010},
      {"id": "connector-server-2", "host": "127.0.0.1", "port": 3151, "wsPort":3011}
    ],
    "area": [
      {"id": "area-server-1", "host": "127.0.0.1", "port": 3250, "area": 1},
      {"id": "area-server-2", "host": "127.0.0.1", "port": 3251, "area": 2},
      {"id": "area-server-3", "host": "127.0.0.1", "port": 3252, "area": 3}
    ],
    "chat":[
      {"id":"chat-server-1","host":"127.0.0.1","port":3450}
    ]
  }
}
```

### Client request, response, broadcast
Although we use long connection, but the request/response api looks like web. Here is the example:

### 클라이언트 요청, 응답, 전파(broadcast)
우리는 롱 커넥션을 사용하지만, 요청/응답 API는 웹과 같아 보입니다. 예제:

![request example](http://pomelo.netease.com/resource/documentImage/request.png)

The api looks like ajax request, although it's actually a long connection cross server request. Based on convention over configuration rules, there is no config.
Pomelo also have filter, broadcast and other mechanisms, you make see the details in [pomelo framework reference](https://github.com/NetEase/pomelo/wiki/Pomelo-Framework)

api는 ajax 요청처럼 보이는데, 실제로는 롱 커넥션 크로스 서버 요청입니다. 환경 설정보다는 관례를 따르고 있습니다.
포멜로는 필터, 브로드캐스트, 그리고 다른 메커니즘을 가지고 있으며, 포멜로 프레임워크 레퍼런스에서 세부사항을 볼 수 있습니다.

### rpc abstraction
The rpc framework is really simple, it can automatically choose route strategy and route to the target server with no configuration.Here is the picture:

### RPC 추상화
RPC 프레임워크는 정말 간단한데, 설정 없이도 자동으로 경로 전략(route strategy)과 타켓 서버의 경로를 선택할 수 있습니다. 여기 그림이 있습니다.

![rpc invocation](http://pomelo.netease.com/resource/documentImage/rpcInterface.png)

The picture above defined a rpc interface in chatRemotejs, the definition is following:

위 그림은 chatRemote.js의 rpc 인터페이스를 정의합니다.
```
chatRemote.kick = function(uid, player, cb) {
}
```

The rpc client just invoke like this:

RPC 클라이언트는 다음과 같이 호출하면 됨:
```
app.rpc.chat.chatRemote.kick(session, uid, player, function(data){
});
```

Notice the session parameter, it's crucial for router. The framework will help you send the message to certain server.

세션 파라메터를 공지하는 것은 라우터에게 중요합니다. 프레임워크는 특정 서버로 메시지를 보내는데 도움이 될 것입니다.

### The pluggable component architecture
Component is pluggable module in pomelo, developers can implement their own component, and just load it. The [framework reference of pomelo](https://github.com/NetEase/pomelo/wiki/Framework-reference-of-pomelo) will discuss it detail. Following are the life cycle of components:

### 플러그 컴포넌트 아키텍처
포멜로에서 플러그처럼 사용 가능한 모듈은 컴포넌트 이며, 개발자는 자신의 컴포넌트를 가질 수 있고 로드 할 수도 있습니다. 포멜로 프레임워크 레퍼런스는 세부사항을 다룹니다. 컴포넌트의 라이프 사이클은 다음과 같습니다.

<center>
![components](http://pomelo.netease.com/resource/documentImage/components.png)
</center>

All user have to do is implementing all these interfaces: start, afterStart, stop, and then we can load it in app.js:

모든 사용자가 할일은 다음의 인터페이스를 구현하는 것입니다: start, afterStart, stop, 그 다음에는 app.js에 로드 할 수 있습니다. 

```javascript
app.load([name], comp, [opts])
```

## conclusion
The above framework mechanisms construct the base of pomelo framework.  Above these, we can construct libraries and tools, or framework in another abstract level. The following [tutorial](https://github.com/NetEase/pomelo/wiki/Tutorial) will help us use it in real cases. 

## 결론
위의 프레임워크 메커니즘은 포멜로 프레임워크를 기반으로 구성합니다. 우리는 위와 같이 라이브러리와 툴로 또는 다른 추상 레벨의 프로임워크를 구성할 수 있습니다. 이어지는 학습은 실제 사례에서 사용하는 것을 돕습니다.