Pomelo is a game server framework. Comparing to a single-process game server framework, pomelo is a fast, scalable , distributed game server framework for Node.js, and it is easy to use. It provides the core development framework and a series of related tools and libraries that can help developers to eliminate boring duplicate work for some common underlying logic. Based on pomelo, developers don't need to "re-invent the wheel", so they can focus more on game-specific logic, and it will also improve developmental efficiency observably. 

Pomelo는 게임서버 프레임워크이다. 싱글-프로세스 게임서버 프레임워크와 비교할 때, pomelo는 Node.js를 위한 매우 빠르고, 확장성이 있는 분산처리 게임서버 프레임워크이다, 그리고 매우 사용하기 쉽다. pomelo는 핵심 개발 프레임워크와 관련된 일련의  툴과 라이브러리르 제공한다. 이를 통해 개발을 하며 생기는 중복 작업을 근본적으로 없앨 수 있다. pomelo로 개발을 하면, 개발자들은 쓸데없이 시간을 낭비할 필요가 없다. 그래서 게임 로직에 더욱 집중을 할수 있고, 개발상 능률을 눈에 띄게 올릴 수 있다.

Also, the powerful scalability and flexibility of pomelo makes pomelo can be used as a general-purpose distributed real-time application development framework. It is more scalable and adaptable than the existing real-time application framework. Pomelo supports all major platform clients and provides client SDKs, it makes the development of client become very friendly.

또한, 포멜로는 강력한 확장성 및 유연성은 포멜로를 범용 분산적인 실시간 응용 프로그램 개발 프레임워크로 사용할 수 있게 한다. 그것은 기존의 실시간 어플리케이션 프레임워크보다 더 확장하고 적응할 수 있다. Pomelo는 모든 주요 플랫폼 클라이언트와 클라이언트 SDK를 제공 한다. 이것은 클라이언트 개발을 매우 편리하게 만든다.


Composition of Pomelo Pomelo의 구성
===================
Pomelo is a combination of a number of parts, every part is loosely coupled to each other, it includes:
Pomelo는 다수의 파트로 조합되어 있다. 모든 파트는 각각 loosely coupled로 연결되어 있다. 이것은 포함한다:

* #### Framework 프레임워크
Framework is the core of pomelo.
프레임워크는 pomelo의 코어이다.

* #### Libraries 라이브러리

Pomelo provides a lot of libraries, some of them are perfectly related with game logic, such as AI, AOI, path-finding, etc.; but some have nothing to do with game logic but are general functionalities to application, such as timing task execution, data synchronization, etc.

Pomelo는 많은 라이브러리를 제공한다. 그것중 몇가지는 게임로직과 완벽하게 관련되어있다. 예를들어 AI, AOI, path-finding, 등등이 있다.; 그러나 일부는 게임 로직과 관련이 없지만, 그것들은 일반기능으로 어플레이케이션에 이용된다. 예를들어  timeing task execution, 데이터 동기화 등이 있다.

* #### Tools 툴
Pomelo provides a lot of tools, including server management & control tool, command-line tool, stress testing tool, etc.

Pomelo는 서버 관리 도구, command-line 툴, stress 테스트 툴 등과 같은 많은 툴을 제공한다.

* #### Client SDK 클라이언트 SDK
Pomelo provides client SDK for various platforms, including js, C, C#, Android, iOS, Unity3D, etc., which covers all the major platforms now. As communication protocol of pomelo is open and customizable, developers can easily customize their own communication protocol to support special platforms.So, pomelo can supports the client on any platforms.

Pomelo는 현재 모든주요 플랫폼을 커버하는 js, C, C#, Android, iOS, Unity3D 등과 같은 다양한 플랫폼을 위한 클라이언트 SDK를 제공한다. Pomelo의 통신 프로토콜은 열려있고 사용자 정의할 수 있기 때문에, 개발자들은 특별한 플랫폼을 제공하기 위해 그들의 통신 프로토콜을 사용자 정의 할수 있다. 그래서, Pomelo는 클라이언트를 어떤 플랫폼에도 제공할 수 있다.

* #### Demo 데모
A framework requires powerful demos to show its features and demonstrate how to use it to developers. Pomelo offers a chat demo that can run on all the major platforms, "treasures" that is simple game demo and its client is HTML5-based. Pomelo also provides a big HTML5-based MMO game demo [Lordofpomelo] (http://pomelo.netease.com/lordofpomelo/ "Lordofpomelo") ([source code] (https://github.com/NetEase/lordofpomelo "Lordofpomelo source")) .

프레임워크는 그것들의 특징을 보여주고, 개발자들에게 그것을 어떻게 사용하는지 설명하기위해 파워풀한 데모를 필요로한다. Pomelo는 모든 주요 플랫폼에서 실행할 수 있는 chat 데모를 제공한다. "treasures"라는 간단한 게임 데모는 클라이언트가 HTML5로 바탕으로 되어있다. Pomelo는 강력한 HTML5를 바탕으로 된 MMO 게임 데모 [Lordofpomelo]를 제공한다.
(http://pomelo.netease.com/lordofpomelo/ "Lordofpomelo") ([source code] (https://github.com/NetEase/lordofpomelo "Lordofpomelo source")) .

Why Pomelo? 왜 Pomelo 인가?
==================

The development of high concurrency and high real-time game server is a complex task. As web application, a powerful framework for game server can reduce developmental complexity greatly. Unfortunately, There is no  suitable open source solutions in the field of game server development now. Given this situation, pomelo aims to create a completely open-source, high-performance, high-concurrency game server framework. The advantages of pomelo are presented as follows:

높은 동시성 및 실시간 게임 서버 개발은 복잡한 작업이다. 웹 애플리케이션으로 게임 서버에 대한 강력한 프레임워크는 개발의 복잡성을 크게 줄일 수 있다. 불행히도 게임 서버 개발 분야에 적합한 오픈 소스 솔루션은 현재 없다. 이러한 상황을 감안할 때, Pomelo는 완전히 오픈 소스, 고성능, 동시성 게임 서버 프레임워크를 만드는 것을 목표로 하고 있다.

* #### High scalability 높은 확장성
Pomelo introduces a single-threaded multi-process architecture, it is very convenient to scale servers up or down through modifying the configuration file of servers easily without impacting the source code of application. Node.js's advantages on network io provides high scalability, too. 

Pomelo는 싱글 스레드로 멀티 프로세스 아키텍처를 제공하는데, 그것은 어플리케이션의 소스코드에 영향없이 configuration파일의 수정을 통해 쉽게 서버를 신축할수 있다. 네트워크 IO상의 Node.js의 장점 역시 높은 확장성을 제공한다. 

* #### Easy to Use 사용하기 쉽다
Pomelo is based on nodejs that is very lightweight. And its development model is similar to web application. It follows a principle "convention over configuration" to reduce configuration work, that makes the application be almost zero-configured. Its api design is also very simple and very easy to use, so development of game server based on pomelo will be very quick and easy;

Pomelo는 node.js를 바탕으로 매우 lightweight 하다. 그리고 그것의 개발 모델은 웹 어플리케이션과 비슷하다. 그것은 거의 zero 구성 어플리케이션을 만드는 configuration 작업을 줄이기 위해 "convention over configuration"의 원칙을 따른다. 그것의 api 디자인 역시 매우 간단하고 사용하기 쉽다. 그래서 Pomelo을 바탕으로한 게임서버의 개발은 매우 빠르고 쉽다.

* #### Loosely coupled and High-extensibility 
Following micro module principle of node.js, pomelo itself is a small core, all the components, libraries, tools can be a npm module that can be used to extend the framework, and they are all loosely coupled to others. Any third-party can develop customized module according to their own demands, and integrate it into pomelo.

느슨한 결합과 높은 확장성
Node.js의 마이크로 단위의 원리에 따라, Pomelo 자체가 작은 코어, 모든 컴포넌트, 라이브러리, 도구가 NPM 모듈일 수 있으며 프레임워크를 확장하는데 사용될 수 있고, 그것들 모두 느슨한 결합으로 다른것들에 연결한다. third-party들은 그들의 요구에 따라 사용자정의 할 수 있고, Pomelo에 통합 할 수 있다.

* #### Complete Demo and Documentation
Pomelo provides all its documentation and a complete and powerful open source MMO game demo - [Lordofpomelo] (http://pomelo.netease.com/lordofpomelo/ "Lord of pomelo online") ([Source Code](https://github.com/NetEase/lordofpomelo "Lordofpomelo source " )), which is implemented by more than 10,000 lines source code written in javascript, so developers can always learn its design and development ideas from the demo.

완료된 데모와 문서
Pomelo는 그것들의 모든 문서와 10,000줄 이상의 자바스크립트 소스코드로 작성한 완성된 파워풀한 오픈 소스 MMO game 데모를 제공한다. - [Lordofpomelo] (http://pomelo.netease.com/lordofpomelo/ "Lord of pomelo online") ([Source Code](https://github.com/NetEase/lordofpomelo "Lordofpomelo source " )). 그래서 개발자는 언제나 그 데모로부터 디자인과 개발 아이디어를 배울 수 있다. 

Pomelo Positioning Pomelo의 위치
=====================

Pomelo is a lightweight server framework, the most suitable fields of pomelo are the server-side application for web games, social games, mobile games, etc.. Developers will find that it is possible to achieve high-scalability and high-flexibility by only writing so little code. Of course, pomelo is also suitable to high real-time web applications, and it makes the application be more scalable than other frameworks.

It is not recommended to use pomelo when developing large-scale MMORPG game server, especially large-scale 3D games, the commercial engine such as Bigworld may be a better choice.

Well, let's [Install pomelo] (Installation "pomelo Installation") and try it .

Pomelo는 가벼운 서버 프레임워크이다, Pomelo는 웹 게임, 소셜 게임, 모바일 게임 등을 개발하기 위한 최적의 서버사이드 어플리케이션이다. 개발자는 매우 적은코드로 작성된 높은 확장성과 높은 유연성을 달성할 수 있음을 발견할 것이다. 물론, Pomelo 역시 높은 리얼타임 웹 어플리케이션에 적합하고, 그것은 그 어플리케이션을 다른 프레임워크들 보다 좀더 확장성 있게 만든다.

그것은 대규모 MMORPG 게임 서버, 특히 대규모 3D 게임을 개발할 때 포멜로를 사용하지 않는 것이 좋습니다, ​​같은 Bigworld 같은 상용 엔진은 더 나은 선택이 될 수 있습니다.

음, 자  [Pomelo 설치] (Pomelo의 설치)와 시도 해봅시다.