Pomelo is a fast, scalable, distributed game server framework for node.js. Some commands can help you simplify the development process. All these commands are thoroughly tested on linux, mac and windows os.

포멜로는 node.js.을 위한 빠르고, 확장 가능한, 분산 게임 서버 프레임 워크입니다. 일부 명령어들은 개발 프로세스를 간소화 할 수 있습니다. 이러한 모든 명령어들은 철저하게 linux, Mac 및 Windows OS에서 테스트 되었습니다.

## Installation
If you are on windows, please make sure you have installed Node.js source code compiling tools. Nodejs is written by C++ and javascript, and it use [gyp](http://code.google.com/p/gyp/) which is written by python to manage the source code. On Windows platform, Node.js use gyp to generate the Visual Studio Solution file, and then is compiled as binary file by VC++ compiler. So you should satisfy the following two conditions to install pomelo on windows platform:
* [Python](http://python.org/)(2.5<version<3.0).
* VC++ compiler，included in[Visual Studio 2010](http://msdn.microsoft.com/en-us/vstudio/hh388567) or VC++ 2010 Express.

Install pomelo globally using npm(node package manager):

>npm install pomelo -g

You can also download the source with following command:
 
`git clone https://github.com/NetEase/pomelo.git `

## 설치
윈도우 사용자라면 Node.js 소스 코드를 컴파일할 도구가 설치 되었는지 확인해 주세요. Node.js는 C++와 JavaScript로 쓰였으며, 소스 코드를 관리하기 위해 파이썬으로 쓰여진 [gyp](http://code.google.com/p/gyp/)를 사용합니다. Windows 플랫폼에서 Node.js는 Visual Studio 솔루션 파일을 생성하기 위해 gyp를 이용하고, VC++ 컴파일러로 바이너리 파일로 컴파일 됩니다. 그래서 Windows 플랫폼에서 포멜로를 인스톨 하려면 두 가지 조건을 충족해야 합니다.
* [Python](http://python.org/)(2.5<version<3.0).
* VC++ compiler，included in[Visual Studio 2010](http://msdn.microsoft.com/en-us/vstudio/hh388567) or VC++ 2010 Express.

npm(node package manager)를 사용해서 pomelo를 글로벌 설치하기:

>npm install pomelo -g

다음 명령어로 소스를 다운로드 할 수 있습니다:

`git clone https://github.com/NetEase/pomelo.git `

## Usage

### Create a new project

Both the command "pomelo init ./helloWorld" and "mkdir helloWorld && cd helloWorld && pomelo init ." 
can create a new project. The first one will automatically create directory and init it.
Then, you can install dependencies with the following command: 'sh npm-install.sh'.

A new project is made up of the following folders :

## 사용법

### 새로운 프로젝트 만들기
명령어 `pomelo init ./helloWorld`와 `mkdir helloWorld && cd helloWorld && pomelo init .`는 둘 다 새로운 프로젝트를 만듭니다. 첫번째는 자동으로 디렉토리는 만들고 그 곳에 초기화 합니다. 그리고 다음 명령어로 의존 모듈을 설치합니다: 'sh npm-install.sh'

다음 폴더들로 새로운 프로젝트가 만들어 집니다:

![directory structure](http://pomelo.netease.com/resource/documentImage/helloWorldFolder.png)

The directory structure clearly classify the game logic, all you should do is filling code in related directory.

The following are details of the directory:

#### game-server

Game-server is the folder contains all of the game logic and components. All the game server logics live here. 

##### config

Generally, a project needs some configuration files, which we use in JSON format.  The game server project contains configuration including master, servers, databases, logs etc.

#### logs

Logs are essential for the project and contain some information which you can get the project running state from.  

#### shared

Both some configurations and codes can be shared between client and server if you choose javascript as client.

#### web-server

Web server contains web page and game client logic, which is based on express . It is quite suitable for web based game client, if you choose other client(unity 3d for example), you can totally ignore this folder.

디렉토리 구조는 게임 로직을 명확히 하며, 해야할 일은 관련 디렉토리에 코드를 채우는 것입니다.

다음은 디렉토리의 세부사항 입니다:

#### game-server

game-server는 모든 게임의 로직과 컴포넌트들을 포함하는 폴더입니다. 모든 게임 서버 로직은 여기에 삽니다.

##### config

일반적으로 프로젝트는 몇몇 설정파일들이 필요한데, 여기서는 JSON 포멧을 사용합니다. 게임 서버 프로젝트가 master, servers, databases, logs 등 관련 설정을 포함하고 있습니다.

#### logs

Logs는 프로젝트에 필수적이고, 프로젝트 실행 상태에서 가져올 수 있는 정보들을 포함하고 있습니다.

#### shared

클라이언트로 JavaScript를 선택한다면 설정과 코드는 클라이언트와 서버 사이에 공유 될 수 있습니다.

#### web-server

web-server는 express를 기반으로 한 웹페이지와 게임 클라이언트 로직을 포함합니다. 이것은 웹 베이스 게임 클라이언트에 매우 적합한데, 만약 다른 클라이언트(예를 들어 unity 3d)를 선택한다면 이 폴더는 완전히 무시 할 수 있습니다.

### Start project

Both game-server and web-server should be started, and game-server can be started by  the following command 

`pomelo start [development | production] [--daemon]` 

while web-server is started like this:
 `cd web-server && node app`

Running in different environment, the project needs different start arguments. If the running environment is development, the argument should be development, otherwise it should be production. By default the project runs in foreground model, and the argument '--daemon' can let project run in background model. 

If you use “–daemon” argument, the module 'forever' should be installed by command `npm install forever -g`

You can also start the game-server with this command:

`node app [env=development | env=production]`

After project started, you can visit website of 'http://localhost:3001' or 'http://127.0.0.1:3001' by browser with
websocket support.

### 프로젝트 시작하기

game-server와 web-server 둘 다 시작하려면, game-server는 다음 명령어로 시작 되고 

`pomelo start [development | production] [--daemon]` 

web-server 는 다음과 같이 시작 됩니다:
 `cd web-server && node app`

다른 환경으로 실행하려면, 다른 시작 arguments가 필요합니다. development 실행 환경이면 development 인자가, 아니면 production이면 됩니다. 디폴트로 프로젝트는 포그라운드 모델로 실행이 되고, '--daemon'인자는 프로젝트를 백그라운드 모델로 실행되게 합니다.

'--daemon'인자를 사용하면, 'forever' 모듈이 `npm install forever -g` 명령어로 설치 됩니다.

또한 game-server를 다음 명령어로 실행 할 수 있습니다:

`node app [env=development | env=production]`

프로젝트가 실행된 후, websocket이 지원되는 브라우저로 'http://localhost:3001' 또는 'http://127.0.0.1:3001' 웹 사이트로 방문할 수 있습니다.

### Query server status

You can query server status with command `pomelo list`, and the example of result is shown as follows:

![test](http://pomelo.netease.com/resource/documentImage/pomeloList.png)

The followings are detail definition of each fields:

* serverId: the id of server which is the same as configuration
* serverType: the type of server which is the same as configuration
* pid: the pid of process corresponding to server
* headUsed: the used heap size of server(Unit: Megabytes)
* uptime: the duration since this server started(Unit: Minute)

### 서버 상태 질의하기

`pomelo list`명령어로 서버 상태를 질의할 수 있으며, 다음과 같은 예시의 결과가 보여집니다:

![test](http://pomelo.netease.com/resource/documentImage/pomeloList.png)

다음은 각 필드의 세부 사항입니다:

* serverId: 설정과 같은 서버 id
* serverType: 설정과 같은 서버 type
* pid: 서버에 해당하는 프로세스 pid
* headUsed: 서버의 사용 heap 크기 (단위: 메가바이트)
* uptime: 서버가 시작된 이후 소요 시간(단위: 분)

### Shutdown project

Both command `pomelo stop` and `pomelo kill` can shutdown the project. The command `pomelo stop` is recommended for some
reasons as follows:

* front-end servers disconnect to keep players from coming in 
* Guarantee game logic with closing all of the servers by certain order
* Ensure data integrity with writing plays' information to the database in time 
 
Please avoid the way with command `pomelo kill` in production environment for it killing process without any remedies. 

### 프로젝트 종료하기

`pomelo stop`과 `pomelo kill` 명령어 둘 다 프로젝프를 종료할 수 있습니다. `pomelo stop`명령어를 다음 몇가지 이유로 권장합니다:

* front-end servers disconnect to keep players from coming in 
* 특정 순서로 모든 서버를 닫을 수 있는 게임 로직 이점
* 플레이 정보를 시간별로 데이터베이스에 저장하는 데이터 무결성을 보장
 
어떠한 개선 사항없이 프로세스를 죽이기 위해서 production 환경에서 `pomelo kill`명령어를 쓰는 방법은 꼭 피하세요.

## AdminConsole

AdminConsole is a powerful tool which can monitor the project and get valuable information. You can do the following things with adminConsole.

* Monitor server status, logs, online users and scene data etc.
* Get related information with scripts flexibly.
* Trace and analyze memory stack, CPU consumption 

## 관리 콘솔 (AdminConsole)

adminConsole 은 프로젝트를 모니터링하고 유용한 정보를 얻을 수 있는 강력한 도구 입니다. adminConsole로 다음을 할 수 있습니다.

* 서버 상태, 로그, 접속 유저, 화면 데이터 등 모니터하기
* 스크립트로 유연하게 관련 정보 얻기
* 메모리 스택, CPU 점유율 추적하고 분석하기

### Install adminConsole

>git clone https://github.com/NetEase/pomelo-admin-web.git

>cd pomelo-admin-web

>npm install -d

>node app

Open the console by visiting website of 'http://localhost:7001' with browser which supports websocket. If any port conflicts, please fix configuration in 'config/admin.json'.The system closes the admin console module in default, so you need to open it in game-server/app.js and add the code app.enable('systemMonitor'). You can refer to the source code of lordofpomelo in detail.

### adminConsole 설치하기

>git clone https://github.com/NetEase/pomelo-admin-web.git

>cd pomelo-admin-web

>npm install -d

>node app

websocket이 지원되는 브라우저로 'http://localhost:7001' 접속하고 콘솔을 열어 주세요. 만약 포트 충돌이 발생하면, 'config/admin.json'의 설정을 수정하세요. 시스템은 디폴트로 관리 콘솔 모듈을 닫기 때문에, `game-server/app.js`을 열고
`app.enable('systemMonitor')`코드를 추가할 필요가 있습니다. lordofpomelo 소스 코드의 세부사항을 참고 할 수 있습니다. 

## Project in production environment

If multi-server environment, not only all the servers should support "ssh agent forward", but also the project directory structure of each
server should be exactly the same.

Here are some references about 'ssh agent forward':

* [Getting Started with SSH](http://kimmo.suominen.com/docs/ssh/)
* [What is an SSH Agent](http://en.wikipedia.org/wiki/Ssh-agent)
* [How SSH Agent Forwarding Works](http://unixwiz.net/techtips/ssh-agent-forwarding.html)
* [What are deploy keys?](https://help.github.com/articles/managing-deploy-keys)

## production 환경의 프로젝트

만약 multi-server 환경이라면, 모든 서버는 "ssh agent forward"를 지원 할 뿐만 아니라, 각 서버의 프로젝트 디렉토리 구조는 정확하게 일치합니다.

'ssh agent forward'에 관한 참고 사항입니다:

* [Getting Started with SSH](http://kimmo.suominen.com/docs/ssh/)
* [What is an SSH Agent](http://en.wikipedia.org/wiki/Ssh-agent)
* [How SSH Agent Forwarding Works](http://unixwiz.net/techtips/ssh-agent-forwarding.html)
* [What are deploy keys?](https://help.github.com/articles/managing-deploy-keys)