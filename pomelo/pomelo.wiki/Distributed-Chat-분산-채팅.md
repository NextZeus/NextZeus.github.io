## Why chat?
Pomelo is a game server framework, why does the tutorial starts from chat?

Pomelo is really a game server framework, but it is essentially a high real-time, scalable, multi-process application framework. In addition to some special parts of the game library in the library section, the rest of the framework can be used for development of real-time web application. And compared with some node.js real-time application frameworks such as derby, socketstream, meteor etc, it is more scalable.

Because of the complexity of the game in scene management, client animation, they are not suitable entry level application for the pomelo. Chat application is usually the first application which developers contact with node.js, and therefore more suitable for the tutorial.

Generally the beginner chat application of node.js is based on socket.io. Because it is based on single-process node.js, it hit a discount in scalability. For example, if you want to improve it to a multi-channels chat room like irc, the increased number of channels will inevitably lead the single-process node.js overloaded.

## 왜 채팅인가요?
포멜로는 게임 서버 프레임워크인데, 왜 튜토리얼을 채팅부터 시작 하나요?

포멜로 실제 게임 서버 프레임워크이지만, 본질적으로 굉장한 리얼타임, 확장성, 멀티 프로세스 응용 프로그램 프레임워크입니다.
라이브러리 섹션의 일부 특별한 게임 라이브러리뿐만 아니라, 프레임워크의 다른 부분들도 실시간 웹 어플리케이션의 개발을 위해 사용될 수 있습니다. 그리고 derby, socketstream, meteor등 일부 node.js의 실시간 애플리케이션 프레임워크에 비해 더 확장성이 있습니다.

게임에서 장면 관리(scene management), 클라이언트 애니메이션(client animation)의 복잡성 때문에, 포멜로의 입문 레벨 애플리케이션으로 적합하지 않습니다. 채팅 애플리케이션은 Node.js를 접하는 개발자들의 첫번째 애플리케이션으로 일반적이고, 튜토리얼로 더욱 적합합니다.

보통 Node.js의 시작 채팅 애플리케이션은 socket.io를 기반으로 합니다. Node.js는 싱글-프로세스 기반이기 때문에, 확장성의 이점이 날아가 버립니다. 예를들어, irc같은 멀티-채널 채팅 룸의 성능을 개선시키기 위해서, 채널의 수를 증가하면 싱글-프로세스의 Node.js는 오버로드가 필연적으로 생길 겁니다.
 
## From a single process To multi-process, From socket.io To pomelo
A native chat room application based socket.io, take [uberchat] (http://github.com/joshmarshall/uberchat ) for example.

Its application architecture diagram is as below:

## 싱글 프로세스에서 멀티 프로세스로, socket.io에서 pomelo로
기존 채팅룸 애플리케이션은 socket.io를 기본으로 합니다. 예를 들어 uberchat 입니다.

이 애플리케이션 아키텍처 다이어그램은 다음과 같습니다:

![uberchat](http://pomelo.netease.com/resource/documentImage/uberchat.png)

The server which only contains a single node.js process handle all requests from websocket.

It has following disadvantages:

1. Poor scalability: it only supports single process node.js, can not be distributed according to room/channel, and can not separate broadcast pressure from logic business processing either.

2. Code redundancy: it just makes simple encapsulation of socket.io, and only the server side contains 430 lines of code.

Using pomelo to write this framework can be completely overcome these shortcomings.

The distributed chat application architecture which we want to build is as follow:

오직 하나의 node.js 프로세스를 가지는 서버는 websocket에서 모든 요청을 처리 합니다.

이것은 다음과 같은 단점을 갖습니다. 

1. 열악한 확장: 그것은 싱글 프로세스 Node.js만 서포트하며, 방/채널에 따라 분리 될 수 없으며, 비지니스 로직 처리에서 전파 presure를 떼어 놓을 수 없습니다.

2. 코드 중복: socket.io의 캡슐화는 간단하게 하고, 서버 사이드만 430 라인을 포함합니다.

포멜로의 사용으로 이런 단점들을 확실히 극복 할 수 있습니다.

우리가 만들기 원하는 분산 채팅 애플리케이션은 다음과 같습니다.

 ![multi chat](http://pomelo.netease.com/resource/documentImage/multi_chat.png)

In this architecture, the front-end servers named connector is responsible for holding connections, the chat server is in charge of processing business logic.

Such scale-up architecture has following advantages:

* Load separation: The architecture totally separates the connection code from the business logic code, and this is really necessary especially in broadcast-intensive application like game.Network communication can consume large amount of resource, however, the business logic processing  ability will not be influenced by broadcasting because of the separated architecture.

* Simplify channel switch: Users can switch channels or rooms without reconnecting websocket because of this separated architecture.

* Scale better: We can launch more connector processes to deal with the increase of users, and use hash algorithm to map channels to different servers.

We will start to build this application with pomelo, and you will be amazed to find that it only takes less than 100 lines of code to build such a complex architecture.

이 아키텍처에서, 커넥터(connector)라는 이름의 프런트 엔드 서버는 연결을 유지 할 책임이 있고, 채팅 서버는 비즈니스 로직 처리를 담당 합니다.

이러한 스케일-업 구조는 다음 장점이 있습니다:

* 로드 분리: 아키텍처는 연결 코드와 비즈니스 로직 코드를 완전히 분리하고 특히 게임 같은 전파-집약적인 애플리케이션에서는 정말 꼭 필요합니다. 네트워크 통신은 많은 양의 리소스를 소비할 수 있지만, 비즈니스 로직 처리 기능은 아키텍처의 분리로 인해 전파의 영향을 받지 않습니다. 

* 채널 스위치 단순화: 이 아키텍처로 인해 사용자는 wobsocket 재연결 없이도 채널 또는 방을 전환 할 수 있습니다.

* 확장 추가: 우리는 사용자의 증가를 처리하기 위해서 커넥터 프로세스를 좀 더 실행 할 수 있으며, 다른 서버와 채널을 매핑하기 위해 해쉬 알고리즘을 사용할 수 있습니다.

우리는 이 애플리케이션을 포멜로와 함께 만들기 시작 할 것이고, 당신은 이런 복잡한 아키텍처를 만드는데 코드가 100라인도 안된다는 것에 놀랄 것 입니다.

## Initialization of Code Structure
Application of the code structure can be initialized by using the following command:

## 코드 구조의 초기화
애플리케이셔의 코드구조는 다음 명령어의 사용으로 초기화 됩니다.

>pomelo init chatofpomelo

The code structure is shown below:

코드 구조는 다음과 같습니다 :

![chat directory](http://pomelo.netease.com/resource/documentImage/chatDir.png)

Description:

* game-server: all the game business logic code is in this directory.The file app.js is the entrance of the server, and all the game logic and functions start from here.

* web-server: web server which used by game server(including login logic), the client js, css and static resources.

* config: Generally, a project needs a lot of configurations and you can use JSON files here. In game project, some configurations have been created such as log, master-server and other servers at initialization. Also, you can add database, map and numerical tabular configuration etc.

* logs: Logs are essential for the project and contain a lot of information which you can get the project runing state from.

* shared: Both some configurations and code resources can be shared between front end and back end if you choose javascript as client language.

설명:

* game-server: 모든 게임 비즈니스 로직 코드는 이 디렉토리에 있습니다. app.js파일은 서버의 시작이며, 모든 게임 로직와 기능이 여기에서 시작 합니다.

* web-server: game-sever에 의해 사용 되는 web-server, 클라이언트 자바스크립트, css, static 리소스

* config: 일반적으로 프로젝트는 많은 설정이 필요한데, 여기에 JSON 파일을 사용할 수 있습니다. 게임 프로젝트에서 일부 구성은 이러한 초기화에서 로그 마스터 서버와 다른 서버로 개발되었습니다. 또한 데이터베이스, 맵, 수치표 설정을 추가 할 수 있습니다.

* 로그 : 로그는 프로젝트에서 필수적이며, 프로젝트 실행 상태에서 가져올 수 있는 정보를 많이 포함하고 있습니다.

* 공유: 클라이언트 언어로 자바스크립트를 선택하면, 일부 설정 및 코드 리소스 모두 프론트엔드와 백엔드 사이에서 공유 될 수 있습니다.

Initialization && Test:

install npm package

>sh npm-install.sh

start game server

>cd game-server && pomelo start

start web server

>cd web-server && node app.js

The web server contains the pomelo client code, when the web server is started, the client is automatically loaded into the browser. Clients send requests to the game server via websocket, the server can push messages to the client after connected by pomelo.

Visit http://localhost:3001, if the web server is running successfully, the following page will appear in  browser:

초기화 && 테스트 :

npm package 설치

>sh npm-install.sh

game server 시작

>cd game-server && pomelo start

web server 시작

>cd web-server && node app.js

web server가 시작될 때 web server는 포멜로 클라이언트 코드를 포함하고 클라이언트는 자동적으로 브라우저에 로드 됩니다.
클라이언트는 websocket를 통해서 요청(request)를 game server에 보내고, 서버는 포멜로에 연결 후 클라이언트에 메시지를 푸쉬(push)할 수 있습ㄴ다.

web server 실행이 완료하면 http://localhost:3001에 접속하면, 다음 페이지가 브라우져에 나타납니다.

![welcome page](http://pomelo.netease.com/resource/documentImage/welcome.png)

Click the Test Game Server button, the pop of 'game server is ok.' verify the success of the client and server communication.

'Test Game Server' 버튼을 클릭해 'game server is ok.'이 팝업되고, 클라이언트와 서버 통신의 성공을 확인하세요.


## Let's start Chat Logic Coding

The logic of chat includes the following sections:

*   Entering: this part of the logic is responsible for registering user information to session, and add user into the channel of chat room.

*   Chatting: this section includes sending requests from the client, and receiving requests by the server.

*   Broadcasting: all clients in the same chat room will receive messages and show messages in browser.

*   Leaving: this section needs to do some clean-up work, including cleaning up the session and channel information.

## 채팅 로직 코딩을 시작하자

채팅 로직은 다음과 같은 섹션이 포함되어 있습니다:

*   Entering: 로직의 이부분은 유저 정보를 세션에 등록할 책임이 있으며, 채팅방 채널에 유저를 추가합니다.

*   Chatting: 이 섹션은 클라이언트의 요청을 전송하고 서버에서 요청을 수신하는 것을 포함합니다.

*   Broadcasting: 같은 채팅방에 있는 모든 클라이언트가 브라우저에서 메시지를 보내고 메시지를 봅니다.

*   Leaving: 이 섹션은 세션과 채널 정보를 지우는 정리 작업을 수행해야 합니다.


### Entering

Entering page is as shown below:
User enters user name, name of chat room, user joins the chat room.

### 입력

입력 페이지는 아래와 같이 보여집니다:
유저는 이름, 채팅룸 이름을 입력하고, 채팅룸에 조인 합니다. 

![login](http://pomelo.netease.com/resource/documentImage/login.png)

#### Client

Clients need to send a request to the server, the first request must route to the connector process, because the server needs to register the session information for the first time(page code layout in this tutorial omitted).

#### 클라이언트 (Client)

클라이언트는 요청을 서버로 보내야 하고, 처음 요청은 커넥터에 프로세스를 보내야 하는데, 서버는 최초에 세션 정보를 저장해야 하기 때문입니다(이번 튜토리얼에서 페이지 코드 레이아웃은 생략합니다).

```javascript
pomelo.request('connector.entryHandler.enter', {username: username}, function(){
}); 
```

The above request string 'connector.entryHandler.enter' representing the name of server type, the file name of the service and the corresponding method name respectively.

위의 요청 문자열 'connector.entryHandler.enter'은 서버 타입명, 서비스 파일명, 각 메서스명에 상응되는 것을 나타냅니다. 

#### Server

The connector can receive messages without any configuration, all you have to do is creating a new file named entryHandler.js under the connector/handler directory. We need to implement the enter method, and the server will automatically invoke the corresponding handler, the specific code is as follows:

#### 서버 (Server)

커넥터는 어떤 설정 없이도 메세지를 받을 수 있는데, 할 일은 커넥터/핸들러 디렉토리 아래에 entryHandler.js 파일을 만드는 것입니다. enter 메소드를 구현해야 하며, 서버는 자동으로 해당 핸들러를 작동시킬 것입니다. 세부 코드는 아래와 같습니다: 

```javascript
handler.enter = function(request, session, next) {
	session.bind(uid);
	session.on('closed', onUserLeave.bind(null, this.app));
};
```

#### Server add user into channel

Using the rpc method to add the logged in user into the channel.

#### 서버는 유저를 채널에 추가합니다.

로그한 유저를 채널에 추가하기 위해 rpc 메소드를 사용합니다. 

```javascript
app.rpc.chat.chatRemote.add(session, uid, app.get('serverId'), function(data){});
```

app is the application object of pomelo, app.rpc represents the remote rpc call between the front and the end servers, the last three parameters correspond to the server name, the file name and the name of the method respectively. In order to finish this rpc call, you only need to create a new file named chatRemote.js in chat/remote directory, and implement the add method.

app은 포멜로의 애플리케이션 객체이고, app.rpc는 프론트와 끝단 서버 사이의 원격 rpc 호출을 나타내고, 마지막으로 3개의 파라메터들은 각가 서버명, 파일명, 메서드명에 해당 합니다. 이 RPC 호출을 완료하기 위해, 당신은 단지 chat/remote 디렉토리에 chatRemote.js 라는 이름의 새 파일을 생성하고, add 메서드를 구현하면 됩니다.

```javascript
handler.add = function(uid, sid, cb){
    var channel = channelService.getChannel('pomelo', true); 
    if(!!channel)
        channel.add(uid, sid);
};
```

In the add method, firstly get the channel from channelService provided by pomelo, then add the user into the channel. This completes a full rpc call, in pomelo it is that easy to finish complex rpc call.

add 메서드에서, 첫째로 포멜로에서 제공되는 channelService에서 채널을 얻고(get), 다음엔 channel에 user를 추가합니다.
이것으로 전체 RPC 호출을 완료시키는데, 포멜로에서 이것은 복잡한 RPC 호출을 끝내는 쉬운 일입니다.

#### User initiate chatting and server receive message

client code:

#### 유저는 채팅을 시작하고 서버는 메시지를 받음

클라이언트 코드:

```javascript
pomelo.request('chat.chatHandler.send', {content: msg, from: username, target: target}, function(){});
```

server code:

서버 코드:

```javascript
handler.send = function(request, session, next) {
 var param = {route: 'onChat', msg: msg.content, from: msg.from, target: msg.target};
 // send messages
};
```

#### Server broadcast message and client receive

In server side, add the code into the send method:

#### 서버는 메시지를 전파하고 클라이언트는 받음

서버 측에서 Send 메서드에 코드를 추가 :

```javascript
var channel = channelService.getChannel('pomelo', false);
channel.pushMessage(param);
```

In client side, all users in the same channel receive and show messages.

클라이언트 측에서, 동일한 채널의 모든 사용자가 메시지를 수신하고 보여줍니다.

```javascript
pomelo.on('onChat', function() {
   addMessage(data.from, data.target, data.msg);
   $("#chatHistory").show();
};
```

### Leaving

When user's session is disconnected, remove the user from the channel.

### 나가기

유저의 세션이 끊어질때, 채널에서 유저를 제거합니다.

```javascript
app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), 'pomelo', null);
```

Like entering into the chat room, add the kick method in chatRemote can achieve the functionality of user exits chat room.

채팅방에 입장하는 거와 같이, chatRemote에 유저가 채팅방을 나가는 기능 구현을 할 수 있는 킥(kick)메소드를 추가합니다.

```javascript
handler.kick = function(uid, sid, name){
    var channel = channelService.getChannel(name, false);
    if (!!channel) {
        channel.leave(uid,sid);
    }
};
```

## Start
### Configure servers.json
the specific configuration is as follows：

## 시작하기
### servers.json 설정하기
상세 설정은 아래와 같습니다：
```json
{
  "development":{
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "port":3050 }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }
        ]
   },
  "production":{
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "port":3050 }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }
        ]
   }
}
```
The number of servers that developers can determine based on the number of users, which only need to add a line of code including server id, server type, host and port number in corresponding position in the configuration file.

유저의 숫자를 기준으로 개발자가 결정할 수 있는 서버의 숫자는 서버id, 서버type, 호스트(host), 포트(port) 숫자를 포함한 코드 라인을 설정 파일의 해당 위치에 추가 하기만 하면 됩니다.

### Run
### 실행하기
>pomelo start

##  scale up
Next we can see the scale up in pomelo is so easy.

The architecture diagram now is below:

##  스케일 확장
다음은 포멜로에서 스케일 확인이 쉽다는 것을 볼 수 있습니다.

아키텍처 다이어그램은 이제 아래와 같습니다:
 
![single chat](http://pomelo.netease.com/resource/documentImage/single_chat.png)

If we want to scale up, we just need to modify servers.json.
스케일을 확장하려면, servers.json만 수정하면 됩니다.
```json
{
  "development":{
       "gate":[
            { "id":"gate-server-1", "host":"127.0.0.1", "port":3014 }
        ],
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "port":3050 },
            { "id":"connector-server-2", "host":"127.0.0.1", "port":3051 },
            { "id":"connector-server-3", "host":"127.0.0.1", "port":3052 }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }, 
            { "id":"chat-server-2", "host":"127.0.0.1", "port":6051 },
            { "id":"chat-server-3", "host":"127.0.0.1", "port":6052 }
        ]
   },
 "production":{
       "gate":[
            { "id":"gate-server-1", "host":"127.0.0.1", "port":3014 }
        ],
       "connector":[
            { "id":"connector-server-1", "host":"127.0.0.1", "port":3050 },
            { "id":"connector-server-2", "host":"127.0.0.1", "port":3051 },
            { "id":"connector-server-3", "host":"127.0.0.1", "port":3052 }
        ],
       "chat":[
            { "id":"chat-server-1", "host":"127.0.0.1", "port":6050 }, 
            { "id":"chat-server-2", "host":"127.0.0.1", "port":6051 },
            { "id":"chat-server-3", "host":"127.0.0.1", "port":6052 }
        ]
   }
}
```

This way we easily change the single connector, chat server into multiple connector, chat server architecture. After scale up, there are more than one connector server in front, in order to balance the load of different connector servers, we add a gate server. The gate server is mainly responsible for allocate users in different connector servers, in this application we use the user name's hash value to select connector server.

The architecture diagram after scale up is as follow:

이 방법은 싱글 커넥터, 채팅 서버에서 멀티 커넥터, 채팅 서버 아키텍처로 쉽게 바꾸는 것입니다. 스케일 확장 후, 프론트에 커넥터를 한개 이상으로 하고, 다른 커넥터 서버들간에 로드 발란스를 위해 게이트(gate) 서버를 추가하였습니다. gate 서버는 주로 다른 커넥터 서버들에 유저를 할당하는데, 이 애플리케이션에서는 유저 이름의 해쉬 값을 커넥터 서버를 선택하는데 사용합니다.

스케일 확장 후 아키텍처 다이어그램은 아래와 같습니다.

![multi chat](http://pomelo.netease.com/resource/documentImage/multi_chat.png)

### Configure router
When extended to multiple servers, we need to add different routing configurations for different types of servers.The code below is the chat server routing configuration, in order to reduce application's complexity, we just do hash processing on room name, the detailed description of the configuration can refer to[Reference configuration of app.js](https://github.com/NetEase/pomelo/wiki/Reference-configuration-of-app.js)。Specific code is as follow：

### 라우터 구성하기
멀티 서버로 확장 할때, 서버 타입을 구별하기 위해 다른 라우팅 설정을 추가해야 합니다. 아래 코드는 설정의 복잡함을 줄이기 위한 채팅 서버 라우팅 설정인데, 방 이름으로 해쉬 처리한 것입니다. 자세한 설정에 관한 설명은 Reference configuration of app.js 문서를 참조 하세요. 상세 코드는 아래 입니다:

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

# Source Code
The tutorial source code can be obtained by using the following command:
>git clone https://github.com/NetEase/chatofpomelo.git

# 소스 코드
튜토리얼 소스 코드는 아래 명령어 사용으로 얻을 수 있습니다.