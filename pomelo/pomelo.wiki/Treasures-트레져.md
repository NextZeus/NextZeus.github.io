#Treasures
##Description

[Treasures](https://github.com/NetEase/treasures) game which extracted from the game [LordOfPomelo](https://github.com/NetEase/lordofpomelo) and remove a lot of game logic, in order to show the working principle and usage of the [Pomelo](https://github.com/NetEase/pomelo) framework more clearly.

Treasures is very simple, just enter a name, a game character will be randomly generated, and then enter the game scene. Some treasures scattered ground in the game scene , each treasure have score, the player operate the game characters to pick up the treasures, and then will be able to get the scores.

##설명
[Pomelo](https://github.com/NetEase/pomelo) 프레임워크의 보다 명확한 사용법과 동작 원리를 보여주기 위해서 [LordOfPomelo](https://github.com/NetEase/lordofpomelo) 게임에서 많은 게임 로직을 제거하고 추출한 [Treasures](https://github.com/NetEase/treasures) 게임입니다.

이름을 입력하고, 램덤으로 게임 캐릭터가 생성되고, 게임 화면이 시작되는 Treasures는 아주 간단합니다. 게임 화면에는 보물들이 흩어져 있고 각 보물에는 점수가 있는데, 플레이어는 게임 캐릭터를 조종해서 보물을 찾고 점수를 획득 할 수 있습니다.

##Install and Run

Install `pomelo` with `npm`
```bash
npm install -g pomelo
```
Get the source code
```bash
git clone git@github.com:NetEase/treasures.git
```
Install the dependencies (enter the project directory first)
```bash
sh npm-install.sh
```
Start the `web-server`  (enter the `web-server` directory first)
```bash
node app.js
```
Start the `game-server` (enter the `game-server` directory first)
```bash
pomelo start
```
visit [http://localhost:3001](http://localhost:3001) in your modern brower(the latest chrome is best), and enter the game.

You can get more details with Pomelo's [quick start guide](https://github.com/NetEase/pomelo/wiki/Quick-start-guide)

And another [tutorial](https://github.com/NetEase/pomelo/wiki/Distributed%20Chat) for study.

##설치와 실행
`npm`으로 `pomelo`설치
```bash
npm install -g pomelo
```
소스 코드 얻기
```bash
git clone git@github.com:NetEase/treasures.git
```
의존 관련 설치(dependencies) (프로젝트 디렉토리로 이동 후에)
```bash
sh npm-install.sh
```
`web-server` 시작하기 (`web-server` 디렉토리로 이동 후에)
```bash
node app.js
```
`game-server` 시작하기 (`game-server` 디렉토리로 이동 후에)
```bash
pomelo start
```
모던한 브라우져(최신 크롬이 가장 적합함)로 [http://localhost:3001](http://localhost:3001) 접속하고, 게임을 시작합니다.

Pomelo's [quick start guide](https://github.com/NetEase/pomelo/wiki/Quick-start-guide) 에서 자세한 사항을 확인 할 수 있습니다.

그리도 또 다른 [tutorial](https://github.com/NetEase/pomelo/wiki/Distributed%20Chat) 스터디 자료가 있습니다.

##Architecture
Treasures  has 2 parts which are `web-Server` and `game-Server`.

* `web-server` is a simple http server, based on Express

* `game-server` is a webSocket server for running the game logic

Let's have a look at the architecture of the `game-server` from the config file `game-server/config/server.json`

##아키텍처
Treasures는 `web-Server`와 `game-Server` 두 부분이 있습니다.

* `web-server` 는 간단한 Express 기반의 http 서버입니다.

* `game-server` 는 게임 로직을 실행하기 위한 webSocket 서버입니다.
`game-server/config/server.json` 설정 파일에서 `game-server`의 아키텍처를 확인해 봅시다.
```javascript
{
  "development": {
    "connector": [
      {"id": "connector-server-1", "host": "127.0.0.1", "port": 3150, "wsPort": 3010},
      {"id": "connector-server-2", "host": "127.0.0.1", "port": 3151, "wsPort": 3011}
    ],
    "area": [
      {"id": "area-server-1", "host": "127.0.0.1", "port": 3250, "areaId": 1}
    ],
    "gate": [
      {"id": "gate-server-1", "host": "127.0.0.1", "wsPort": 3014}
    ]
  }
}
```

It can be seen that the server side is constituted by the following components:

* 2 `connector` servers, for receiving and sending messages.
* A `gate` server is mainly used for load balancing which dispatch the connections to the `connector` servers.
* An `area` server used to drive the game scene, and the game logic.

The relationship between the servers, as the following diagram:

서버 사이드는 아래 컴포넌트들로 구성되는 것으로 볼 수 있습니다.

* 2개의 `connector` 서버는 메시지를 받기(receiving ) 보내기(sending)를 합니다.
* 1개의 `gate` 서버는 `connector` 서버들의 연결을 처리하는 로드 밸런싱에 주로 사용 됩니다.
* 1개의 `area` 서버는 게임 화면과 게임 로직을 만듭니다. 

![treasure-arch](http://pomelo.netease.com/resource/documentImage/treasure-arch.png)

##Source code analysis
Analyzed the code by the flow of the game.

###1. Connect to the server
clinet: `web-server/public/js/main.js`

```javascript
pomelo.request('gate.gateHandler.queryEntry', {uid: name}, function(data) {
  //...
});
```
server: `game-server/app/servers/gate/handler/gateHandler.js`
```javascript
Handler.prototype.queryEntry = function(msg, session, next) {
  // ...
  // return the host and port of the connector server
  next(null, {code: Code.OK, host: res.host, port: res.wsPort});
};
```
So that the client will be able to connect to the `connector` server

##게임 소스 분석
게임의 흐름에 따라 소스를 분석하겠습니다.

###1. 서버에 연결하기
클라이언트: `web-server/public/js/main.js`
```javascript
pomelo.request('gate.gateHandler.queryEntry', {uid: name}, function(data) {
  //...
});
```
서버: `game-server/app/servers/gate/handler/gateHandler.js`
```javascript
Handler.prototype.queryEntry = function(msg, session, next) {
  // ...
  // connector 서버의 host, port 리턴
  next(null, {code: Code.OK, host: res.host, port: res.wsPort});
};
```
그럼 클라이언트는 `connector`서버와 연결을 할 수 있습니다.

###2. Enter the Game
After establishing a connection with the `connector` server, began to enter the game.
```javascript
pomelo.request('connector.entryHandler.entry', {name: name}, function(data) {
  // ...
});
```
When the client sends a request to the `connector` server for the first time, the server will initialize a `session` bind with some events.

```javascript
// session bind with playerId
session.bind(playerId);
// set player's areaId
session.set('areaId', 1);
```

The client send a request to the server for entering game scene
```javascript
pomelo.request("area.playerHandler.enterScene", {name: name, playerId: data.playerId}, function(data) {
  // ...
});
```

After the client sends a request to the server, the request will reach the `connector` server at first, and the `connector` server route the request to the appropriate server `area` (There is only one `area` server in this example) according to the route rules(`game-server/app/util/routeUtil.js`). And then `playerHandler` in `area` server treating the corresponding request. Players added to the game scene.


After a player is added to the game scene, the other players must be able to see the player to join in real time, so the server must broadcast the message to all players in this game scene.

Create a channel, all players in this game scene will be added to the channel.
```javascript
// get the channel. If there is no channel exsit, create one.
channel = pomelo.app.get('channelService').getChannel('area_' + id, true);
// add the player to channel
channel.add(e.id, e.serverId);
```

When someone joins or state changes, these messages will be pushed to each player in this area. 
For example, a player join the area
```javascript
channel.pushMessage({route: 'addEntities', entities: added});
```

These messages are sent to the client through the `connector` server. And the `area` determine which `connector` server sent out by `session.frontendId`.

The client accept messages:
```javascript
// When new players to join, the server will broadcast a message to all players. The client bind through this route, to get the message 
pomelo.on('addEntities', function(data) {
  // ...
});
```

###2. 게임 들어가기
`connector` 서버와 연결이 확인된 후에, 게임이 시작 됩니다. 
```javascript
pomelo.request('connector.entryHandler.entry', {name: name}, function(data) {
  // ...
});
```

먼저 클라이언트에서 `connector` 서버로 요청을 보내면, 서버는 약간은 이벤트들을 묶어서 `session`을 초기화 할 것입니다.
```javascript
// session bind with playerId
session.bind(playerId);
// set player's areaId
session.set('areaId', 1);
```

클라이언트는 게임 화면에 들어가면서 서버에 요청을 보냅니다. 
```javascript
pomelo.request("area.playerHandler.enterScene", {name: name, playerId: data.playerId}, function(data) {
  // ...
});
```

클라이언트가 서버에 요청을 보낸 후, 먼저 요청은 `connector` 서버에 도달할 것이고, `connector` 서버는 적절한 'area'서버에 요청을 전송할 것입니다.(이 예제에는 `area`서버가 오직 한개만 있습니다.). 그 다음 `area`서버의 `playerHandler` 가 해당 요청을 처리합니다. 플레이어는 게임 화면에 나오게 됩니다.

플레이어가 게임 화면에 나온 후에, 다른 플레이어는 실시간으로 참여한 플레이어를 볼 수 있어야 합니다. 그래서 서버는 게임 화면의 모든 플레이어에게 메시지를 전파 해야 합니다.

게임 화면에 있는 모든 플레이어가 추가 될 채널을 만듭니다.
```javascript
// get the channel. If there is no channel exsit, create one.
channel = pomelo.app.get('channelService').getChannel('area_' + id, true);
// add the player to channel
channel.add(e.id, e.serverId);
```

누군가 참여하거나 상태가 변경되면 이런 메시지는 이 구역의 각 플레이어에게 보내(pushed)지게 됩니다.
예를들어, 한 플레이어가 이 area에 참여합니다.
```javascript
channel.pushMessage({route: 'addEntities', entities: added});
```

이 메시지들은 `connector` 서버를 통해 클라이언트에 보내집니다. 그리고 `area`는 `session.frontendId`를 통해 어떤 `connector` 서버에 보낼지 결정 합니다.

클라이언트는 메시지를 받습니다:
```javascript
// When new players to join, the server will broadcast a message to all players. The client bind through this route, to get the message 
pomelo.on('addEntities', function(data) {
  // ...
});
```

###3. Area Server
Are server is a tick-driven game scenes. Each tick will update the status of the entity in the scene, and if the state has changed, these changes will be pushed to the client.

```javascript
function tick() {
  //run all the action
  area.actionManager().update();
  // update entities
  area.entityUpdate();
  // update rank
  area.rankUpdate();
}
```
A player do a `move` action
client:
```javascript
// send a `move` request to server
pomelo.notify('area.playerHandler.move', {targetPos: {x: entity.x, y: entity.y}, target: targetId});
```
server:
```javascript
// in playerHandler
handler.move = function(msg, session, next) {
  // ...
  // create a move action
  var action = new Move({
    entity: player,
    endPos: endPos,
  });
});
```
And this `action` will update in next `tick`.

###3. Area 서버
Area 서버는 틱(tick) 방식의 게임 구성입니다. 각 틱은 장면의 엔티티 상태를 업데이트하고, 상태가 변경되면 클라이언트에게 푸쉬됩니다.

```javascript
function tick() {
  //모든 액션을 실행 합니다.
  area.actionManager().update();
  // 엔티티 업데이트
  area.entityUpdate();
  // 랭크 업데이트
  area.rankUpdate();
}
```
플레이어가 `move` 액션을 합니다.
클라이언트:
```javascript
// `move` 요청을 서버에 보냅니다
pomelo.notify('area.playerHandler.move', {targetPos: {x: entity.x, y: entity.y}, target: targetId});
```
서버:
```javascript
// playerHandler 에서
handler.move = function(msg, session, next) {
  // ...
  // 움직이는 액션을 만듭니다
  var action = new Move({
    entity: player,
    endPos: endPos,
  });
});
```
이 `action`은 다음 `tick`를 업데이트 합니다. 

###4. Client to send and receive messages
The client and server communications in several ways:

* Request - Response

```javascript
// send a request to connector server，params {name: name}
pomelo.request('connector.entryHandler.entry', {name: name}, function(data) {
  // callback
  // do something
});
```

* Notify

```javascript
// send a notification to server
pomelo.notify('area.playerHandler.move', {targetPos: {x: entity.x, y: entity.y}, target: targetId});
```

* Push

```javascript
// When new players to join, the server will broadcast a message to all players.The client bind through this route, to get the message
pomelo.on('addEntities', function(data) {
  // ...
});
```

###4. 클라이언트에게 메시지 주고 받기
클라이언트와 서버의 통신은 여러가지 방식이 있습니다:

* 요청(Request) - 응답(Response)

```javascript
// connector 서버에 요청 보내기，파라메터 {name: name}
pomelo.request('connector.entryHandler.entry', {name: name}, function(data) {
  // callback
  // do something
});
```

* 공지(Notify)

```javascript
// 서버에 공지 보내기
pomelo.notify('area.playerHandler.move', {targetPos: {x: entity.x, y: entity.y}, target: targetId});
```

* 푸쉬(Push)

```javascript
// 새로운 플레이어가 접속할 때, 서버는 모든 플레이어에게 메시지를 전파합니다. 클라이언트는 메시지를 얻기 위해 이 경로에 바인드 됩니다.
pomelo.on('addEntities', function(data) {
  // ...
});
```

###5. Leave the game
When the player leaves the game, the disconnect message is received by connector server, then it needs to removed the user is in area server, and broadcast a message to other online players.

Every server processes are independent, so it need RPC. Fortunately, do an RPC is so easy in Pomelo framework.

The `area` server want to provide a series of remote interface for other server process calls only need to create a `remote` directory in `servers/area` directory. Interface exposed by the files in this directory can be used as an RPC call interface.

For example, a player leave the game:

```javascript
// when the session closed, it will emit a event
session.on('closed', onUserLeave.bind(null, self.app));

var onUserLeave = function (app, session, reason) {
  if (session && session.uid) {
    // do an rpc
    app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), areaId: session.get('areaId')}, null);
  }
};
```
In server: 
```javascript
// area/remote/playerRemote.js
exports.playerLeave = function(args, cb) {
  // push message
  area.getChannel().pushMessage({route: 'onUserLeave', code: consts.MESSAGE.RES, playerId: playerId});
  // ...
};
```
This easily completed an RPC!

###5. 게임 나가기
플레이어가 게임에서 나갈 때, connector 서버에 접속 해제 메시지를 받게 되는데, area 서버에서 유저를 제거하고, 다른 접속 중인 플레이어들에게 메시지를 전파하기 위해 필요합니다. 

모든 서버 프로세서는 독립적이라 RPC가 필요합니다. 다행히 Pomelo 프레임워크에서 RPC는 굉장히 쉽습니다.

`area`서버는 다른 서버 프로세스 호출 하기 위한 일련의 원거리 인터페이스를 제공하기 위해 `servers/area` 디렉토리에 `remote` 디렉토리를 만들기만 하면 됩니다. 이 디렉토리의 파일로 드러난 인터페이스는 RPC call 인터페이스로 사용 될 수 있습니다.

예를들어, 플레이어가 게임에서 나갑니다:

```javascript
// 세션이 끊어 졌을 때 이벤트를 발생 시킵니다
session.on('closed', onUserLeave.bind(null, self.app));

var onUserLeave = function (app, session, reason) {
  if (session && session.uid) {
    // do an rpc
    app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), areaId: session.get('areaId')}, null);
  }
};
```
서버: 
```javascript
// area/remote/playerRemote.js
exports.playerLeave = function(args, cb) {
  // push message
  area.getChannel().pushMessage({route: 'onUserLeave', code: consts.MESSAGE.RES, playerId: playerId});
  // ...
};
```
RPC를 쉽게 완료 합니다!