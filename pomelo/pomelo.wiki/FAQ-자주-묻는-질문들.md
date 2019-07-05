* c++ 언어와 같은 전통적인 언어와 비교해서 node.js는 성능 이슈가 있나요?

> node.js는 상당히 빠른 크롬 v8 자바스크립트 엔진 기반으로 작성되었습니다. IO 측면에서 node.js의 장점은 굉장한 것으로, 기존의 다른 언어에 비해 우수합니다. 단점이 하나 있다면 그것은 컴퓨팅 작업이 많은 작업(compute-intensive)에서 나타나는데, 이것은 우수한 아키텍쳐 설계로써 해결될 수 있습니다. 실제 게임 개발에서 느낀 우리의 경험 상, node.js 플랫폼은 기존의 다른 언어에 비해 우수합니다.

* pomelo 프레임워크는 서버 사이드에서 node.js 밖에 지원하지 않습니까?

> 현재, pomelo는 다중 언어 확장을 지원하지 않습니다. 하지만 자바스크립트로 컴파일되는 coffeescript와 같은 언어를 사용할 수 있습니다.

* pomelo 프레임워크가 지원하는 운영체제는 무엇입니까?

> 리눅스, 윈도우즈와 Mac os 가 있습니다.

* pomelo 프레임워크는 클라이언트 사이드에서 자바스크립트를 사용하지 않는 경우에도 잘 작동합니까?

> 그렇습니다. pomelo는 여러 언어로 작성된 대부분의 클라이언트에서 지원하는 socket.io 를 기반으로 작성되었기 때문에 거의 모든 클라이언트 언어 상에서 사용이 가능합니다. [wiki of socket.io](https://github.com/LearnBoost/socket.io/wiki) 에서 관련 정보를 확인할 수 있습니다.

* Is there any difference between `pomelo start` and `cd game-server && node app` to start game server?

* 게임 서버를 시작시킬 때 `pomelo start` 커맨드와 `cd game-server && node app` 상에 차이가 있습니까?

> 대개의 경우에 'pomelo start' 를 추천합니다. 'pomelo start'는 daemon 그리고 production/development 모드와 같은 시작되는 서버의 정보를 기록하고, 또한 `pomelo stop` 이 모든 서버를 잘 중지(shutdown)시킬 수 있기 때문입니다. 만약 `cd game-server && node app`를 사용할 경우에는, 모든 서버가 완전히 멈추지 않기 때문에 서버를 다시 시작시킬 때 포트 상의 충돌이 있을 수 있습니다.

* 기존에 이미 백그라운드에서 돌고 있던 프로젝트로 인해서 생기는 포트 상의 충돌은 어떻게 해결할 수 있습니까?

> 만약 서버가 development 모드라면, ‘pomelo kill’ 또는 ‘pomelo kill –force’ 명령어로 백그라운드 프로세스를 정지시킬 수 있습니다. production 모드에서는 ‘pomelo stop’ 커맨드가 보다 안전합니다.

* 특정 프로세스에 대하여 커맨드 라인 패러미터를 줄 수 있는 방법이 있나요?

> './game-server/config/server.json' 안에서 타겟 서버에 대해 패러미터를 설정하면 됩니다. 예를 들어, connect 서버에 패러미터를 다음과 같이 추가할 수 있습니다: 

```json
 {"connector":[{"id":"connector-server-1", "host":"127.0.0.1", "port":4050, "wsPort":3050, 
"args":"--debug=[port] --trace --prof --gc"}]}
```

* development 모드와 production 모드의 다른 점은 무엇입니까?

> Default로는 프로젝트는 development 환경에서 동작합니다. production 환경에서 동작시키기 위해서는 start 커맨드에 'production' 패러미터를 추가해야 합니다. 또한 --daemon 옵션은 프로젝트가 백그라운드에서 작동을 하게 하는데, 이를 위해서는 'forever' 모듈이 미리 설치되어 있어야 합니다.

* production 환경에서 서버를 확장하는 방법은 무엇입니까?

> 서버의 수를 확장하고자 한다면, 간단하게 './game-server/config/server.json' 파일에서 서버 설정을 추가하면 됩니다. 만약 비즈니스 로직을 다른 서버로 나눈다면, 그것은 어느 정도 복잡한 작업이 필요합니다.

* local에서 deploy한 lordofpomelo에 로그인할 수 없다면 어떠한 해결책이 있습니까?

> 브라우저 설정을 다시 한번 확인해보십시오. 브라우저는 websocket을 지원할 수 있어야 합니다. websocket 지원 여부는 http://websocketstest.com 에서 확인 가능합니다.
포트 충돌이 일어날 경우에는, './game-server/config/server.json' 설정 파일을 수정하십시오.

* pomelo 프로젝트에 기여할 방법이 있습니까?

> pomelo 프로젝트에 대한 코드 수정은 언제나 환영입니다. 참여자의 이름은 contributor list에 등록됩니다. github에서 우리 프로젝트를 follow 하고, 코드 혹은 모듈을 수정하세요.