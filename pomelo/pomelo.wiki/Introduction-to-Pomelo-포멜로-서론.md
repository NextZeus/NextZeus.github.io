# Introduction to Pomelo


### What is Pomelo?
Pomelo is a fast, scalable, distributed game server framework for [Node.js](http://nodejs.org).
It provides the basic development framework and a lot of related components, including libraries and tools. 
Pomelo is also suitable for realtime web application, its distributed architecture makes Pomelo scale better than other realtime web frameworks.

The following is the composition of Pomelo:

### 포멜로(Pomelo)는 무엇인가요?
포멜로는 Node.js.을 위한 빠르고, 규모 가변적인, 분산 게임 서버 프레임 워크입니다. 라이브러리와 도구를 포함하며 기본 개발 프레임워크와 많은 관련 컴포넌트를 제공합니다. 포멜로는 실시간 웹 응용 프로그램에 적합한데, 포멜로의 분산 아키텍처는 다른 실시간 웹 프레임워크보다 규모 가변적(Scale)입니다.

다음은 포멜로의 구성입니다:

<center>
 ![pomeloFramework](http://pomelo.netease.com/resource/documentImage/pomeloFramework.png)
</center>

Pomelo includes the following parts:
* Framework is the core of Pomelo, it is a scalable, distributed game server framework, and really easy to use.
* Libraries, we provide a lot of libraries for game development, including AI, path finding, AOI(area of interested) etc.
* Tools, we provide a lot of tools, including admin console, command line tool, stress testing tool.

포멜로는 다음과 같은 파트를 포함합니다:
* 프레임워크는 포멜로의 핵심으로, 그것은 확장 가능한 분산 게임 서버 프레임워크이며, 사용하기 정말 편리합니다.
* 게임 개발에 필요한 라이브러리, AI(인공지능), 경로 탐색, AOI (관심 영역) 등
* 툴, 관리콘솔, 커맨드라인툴, 테스트도구


### Features
#### Fast, scalable

* Distributed (multi-process) architecture
* Flexible server extension
* Full performance optimization and test

#### Easy

* Simple API: request, response, broadcast, etc.
* Lightweight: high development efficiency based on node.js
* Convention over configruation: almost zero config

#### Powerful

* Many libraries and tools
* Good reference materials: full docs, and [an open-source MMO RPG demo](https://github.com/NetEase/pomelo/wiki/Introduction-to--Lord-of-Pomelo)

### 특징
#### 빠름, 규모 가변적

*   분산 (다중 - 프로세스) 아키텍처
*   유연한 서버 확장
*   전체 성능 최적화 및 테스트

#### 쉬움

*   간단한 API : 요청, 응답, 전파 등
*   경량 : node.js를 기본으로 높은 개발 효율
*   설정보다 관습 : 거의 제로에 가까운 설정

#### 강함

*   많은 라이브러리 및 도구
*   좋은 참고 자료 : 전체 문서, 그리고 오픈 소스 MMO RPG 데모


### Why should you use Pomelo?
Fast, scalable, realtime game server development is not an easy job. A good container or framework can reduce the complexity.
Unfortunately, not like web, the game server framework solution is quite rare, especially open source. Pomelo will fill this blank, providing a full solution for building game server framework.
The following are the advantages:
* The architecture is scalable. It uses multi-process, single thread runtime architecture, which has been proved in industry and  especially suitable for Node.js thread model.
* Easy to use, the development model is quite similiar to web, using convention over configuration, almost zero config. The API is also easy to use.
* The framework is extensible. Based on Node.js micro module principle, the core of Pomelo is small. All the components, libraries and tools are individual npm modules, anyone can create their own module to extend the framework.
* The reference is quite complete, we have complete documents. In addition to documents, we also provide a full open source MMO demo(HTML5 client), which is a far more better reference than any books.

### 왜 포멜로를 사용해야 하나요?
빠르고, 규모가변적인, 실시간 게임 서버 개발은 쉬운 일이 아닙니다.
좋은 컨테이너 또는 프레임워크는 복잡성을 줄일 수 있습니다.
불행히도 웹과 다르게 게임 서버 프레임워크 솔루션은 특히 오픈 소스로 매우 드문니다.
포멜로는 게임 서버 프레임워크를 구축하기 위한 풀 솔루션을 제공하여 이러한 공백을 채울 수 있습니다.
따르는 이점들:
* 아키텍처는 규모 가변적입니다. Node.js 쓰레드 모델에 적합하고 업계에 인증된 싱글 쓰레드 런타임 아키텍처의 멀티 프로세서를 이용합니다.
* 웹과 상당히 비슷한 개발 모델, 설정보다는 관례, 거의 없는 설정으로 사용이 쉽습니다. API도 사용하기 쉽습니다.
* 프레임워크는 확장적입니다. Node.js 마이크로 모듈의 원칙에 따라, 포멜로의 핵심은 작습니다. 모든 구성 요소, 라이브러리 및 도구가 개별 npm 모듈이며, 누구나 프레임 워크를 확장하는 위해 자신의 모듈을 만들 수 있습니다.
* 레퍼런스가 상당히 완성적이고, 완료된 문서가 있습니다. 문서뿐만 아니라, 풀 오픈 소스 MMO 데모 (HTML5 클라이언트) 제공하는데, 이것은 어떠한 도서보다 나은 참조가 됩니다.

### How to develop with Pomelo?
With the following references, we can quickly familiar the Pomelo development process:
* [The architecture overview of pomelo](https://github.com/NetEase/pomelo/wiki/Architecture-overview-of-pomelo)
* [Quick start guide](https://github.com/NetEase/pomelo/wiki/Quick-start-guide)
* [Tutorial](https://github.com/NetEase/pomelo/wiki/Tutorial)
* [FAQ](https://github.com/NetEase/pomelo/wiki/FAQ)

You can also learn from our MMO demo:
* [An introduction to demo --- Lord of Pomelo](https://github.com/NetEase/pomelo/wiki/Introduction-to--Lord-of-Pomelo)

### 어떻게 포멜로(Pomelo)로 개발하나요?
다음의 자료들을 통해 Pomelo 개발 프로세스에 빠르게 적응할 수 있습니다:

* [Pomelo 아키텍쳐 개요](https://github.com/NetEase/pomelo/wiki/Pomelo-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-%EA%B0%9C%EC%9A%94)
* [Quick start 가이드](https://github.com/NetEase/pomelo/wiki/Quick-start-guide)
* [튜토리얼](https://github.com/NetEase/pomelo/wiki/Tutorial)
* [FAQ](https://github.com/NetEase/pomelo/wiki/FAQ)

MMO 데모 또한 제공됩니다:
* [데모 소개 --- Lord of Pomelo](https://github.com/NetEase/pomelo/wiki/Introduction-to--Lord-of-Pomelo)