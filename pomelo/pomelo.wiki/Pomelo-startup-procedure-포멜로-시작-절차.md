## Overview of startup procedure 시작 절차 개요

The startup model diagram of Pomelo is as follow:
포멜로의 시작 모델 다이어그램은 아래와 같다:

![start_model](http://pomelo.netease.com/resource/documentImage/start_model.png)

## Startup Entrance
## 첫 시작

The file app.js in game-server directory is the entrance of the project which you develop with pomelo. The startup code in app.js is as follow:
game-server 폴더안에 있는 파일 app.js는 포멜로기반으로 개발하는 프로젝트의 첫 시작점이다. app.js 파일의 시작부분에는 아래과 같은 코드가 있다.

```javascript
var pomelo = require('pomelo');
var app = pomelo.createApp();
app.set('name', 'nameofproject');
app.defaultConfiguration();
app.start();
``` 

Firstly, it creates an application using pomelo; then it sets the application name. After that it makes default configuration of pomelo. These configurations are necessary environments to create a pomelo project, and finally you can start the application. When app.js is running, pomelo will start different components and servers according to the configurations of the application.
우선 pomelo 를 사용하여 애플리케이션을 창조한 다음 애플리케이션 이름을 설정한다. 다음으로 포멜로의 디폴트 구성설정을 작성한다. 이러한 구성설정들은 포멜로 프로젝트를 창조하는데 필요한 환경설정값들이다. 마지막으로 애플리케이션을 시작한다.  app.js가 정상 실행되면 포멜로는 애플리케이션의 구성 설정에 따라 다른 컴포넌트들과 서버들을 시작할것이다.

### Servers and components startup 서버들과 컴포넌트들의 시작

After starting the application, it first loads components, including handler, filter, master, monitor, proxy, remote, server, sync, connection. Component is the bridge between pomelo and dependencies of pomelo, different servers load different components; developer can load different components based on different requirements of the application, furthermore, developers can customize their own components.
애플리케이션이 시작되면 처음으로 handler, filter, master, monitor, proxy, remote, server, sync, connection을 포함하여 컴포넌트들이 로드된다.

Component also has its life cycle, including before start, start, after start, stop etc. Developers can implement these methods in component and server launch corresponding methods at different life time of component.

Master server will first load master component, and master server is started by the master component. When the master component is started, it loads the adminConsole module. Then it starts all other servers according to user configuration file servers.json and parameters received by the master server. All servers start from app.js, load corresponding components, and launch at last.

## Detail of startup procedure

## Application initiation and startup
All servers are started from app.js. And each server creates an application object in its process after starting, and all server information is attached in this object, which includes server physical information, server logic information and pomelo components information. Moreover, this objects provide management and configuration methods of application. After invoking app.start() method in app.js, application object loads default components using loadDefaultComponents method.

## Load components
When loading components, different servers load different components according to the information of its server type. For example, the framework loads master component and monitor component for master server, and loads proxy, filter, handler and server components for other servers in default. It may load special component in certain server, for example, frontend servers load connection component, and backend servers load remote component, default components are described as follows:

* master: starting the master server.
* monitor: starting each server's monitor service, the service is in charge of collecting information of servers and regularly pushing messages to the master, maintaining the master server's heartbeat connection.
* proxy: generating server RPC client, which is essential for server processes comuniation(except master server).
* handler: loading handlers in front-end server.
* filter: loading filters for requests service, including filters before and after the calling of rpc.
* remote: loading the back-end servers, and generates rpc server.
* server: starting service of user requests handling in all servers.
* connector: starting session service in front-end servers and receiving user requests.
* sync: starting data synchronization service and provide external data synchronization service.
* connection: starting the service of user connection statistical data.

Components loading diagram is as follow：

![components_load](http://pomelo.netease.com/resource/documentImage/components_load.png)
