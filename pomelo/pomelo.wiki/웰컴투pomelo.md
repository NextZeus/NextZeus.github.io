Pomelo는 사용하기 쉽고, 빠르고, 확장성 있는 Node.js를 위한 게임 서버 프레임워크입니다. 이것은 코어 네트워크 아키텍쳐와 툴들 그리고 개발자들의 반복작업을 줄일수 있는 라이브러리들도 제공합니다. Pomelo의 목표는 반복된 네트워크와 관련된 프로그래밍을 하는 시간 낭비를 없애서 개발의 효율을 향상시키는 것입니다.

게임을 처음 개발하는 동안, Pomelo는 특정 게임이 아니라 어떤 실시간 웹 어플리케이션에서도 사용할수 있도록 개발하였습니다. Pomelo의 확장성과 유연성은 Pomelo를 범용 분산 실시간 어플리케이션 개발 프레임워크로 사용할수 있게 만들었습니다.

게다가, Pomelo는 여러 클라이언트 SDK들을 지원하며, 게임 서버 breeze로 커뮤니케이션을 만들어 다양한 플랫폼들을 설정할 수 있게 했습니다:

- 자바스크립트: 코어 pomelo init이 설정되면 자동적으로 생성됩니다.
- [.Net](https://github.com/NetEase/pomelo-unityclient-socket)
- [Android](https://github.com/NetEase/pomelo-androidclient)
- [iOS](https://github.com/NetEase/pomelo-ioschat)

이것들이 개발되는 동안, 그것들은 예제 코드로 사용될 수 있습니다. 우리는 또한 기여자를 찾고 있습니다.

Pomelo의 구성요소
=====================

* #### 프레임워크
네트워크 프레임워크는 Pomelo의 핵심입니다.

* #### 라이브러리리
Pomelo는 많은 라이브러리들을 제공합니다. 이것들은 게임 환경 AI, AOI, path-finding 등을 포함하고 있습니다. 게다가 정확한 작업이행, 데이터 동기화 등과 같은 일반적인 기능들도 포함되어있습니다.

* #### 툴
Pomelo는 많은 툴들을 제공하며, 서버 관리 & 관리 도구, 커맨드 라인 툴(예를들어, pmelo list, pomelo kill, pomelo stop), 성능 테스트 도구 등이 포함되어있습니다.

* #### Client SDKs
Pomelo는 JavaScript, C, C#, Android, iOS, 그리고 Unity3D와 같은 주요 플랫폼들의 클라이언트 SDK를 제공합니다. Pomelo의 통신 프로토콜은 열고 사용할수 있어, 개발자들은 그들의 통신 프로토콜을 쉽게 바꿀수 있습니다. 그래서 Pomelo는 클라이언트 플랫폼을 지원하도록 확장될 수 있습니다.

* #### 데모
Pomelo는 개발자들을 돕기 위해 몇가지 데모를 제공합니다:
- [Chat of Pomelo](https://github.com/NetEase/chatofpomelo): 모든 주요 플랫폼에서 실행되는 채팅 메도를 제공합니다. 채널, 멀티 접속 서버 등이 포함되어있습니다.
- [Treasures](https://github.com/NetEase/treasures): HTML5기반의 간단한 게임 데모 입니다.
- [Lord of Pomelo] (http://pomelo.netease.com/lordofpomelo/ "Lordofpomelo"): 풀 HTML5 기반의 MMO 게임 데모입니다  ([source code] (https://github.com/NetEase/lordofpomelo "Lordofpomelo source")) .

왜 Pomelo 인가?
===========

수준 높은 동시실행 실시간 게임서버 개발은 복잡한 일이다. 최근까지 많지 않은 오픈 소스 솔루션들이 게임 서버 개발 분야에 있었다. Pomelo는 이러한 필요한 부분을 메꾸기 위해 제공되고 있다:

* #### 높은 확장성
Pomelo는 싱글 스레드 멀티프로세스 아키텍처이다. 각각의 서버는 각각 노드 베이스 프로세스 이다. 이것은 배치파일의 수정을 통해 존재하는 클러스터를 추가하고 삭제하기 쉬우며, 요구되는 어플리케이션의 소스코드의 어떠한 변경 없이 가능하다.

* #### 손쉬운 사용
Pomelo는 Node.js 베이스 이며  웹 어플리케이션과 유사하게 개발 되었다(Express로 보면 된다). 루비온 레일즈와 유사하며, Pomelo는 “convention over configuration(CoC)”을 지향한다. 원칙적이고 거의 환경설정 없이 기본적인 어플리케이션을 작동할 수 있다.

* #### 느슨한 결홥으로 매우 유연하다
Node.js의 마이크로 모듈을 지향한다, Pomelo는 자기의 작은 코어를 가지고 있다. 모든 컴포넌트, 라이브러리와 툴들은 느슨한 결홥된 NPM 모듈을 통해 제공되며 코어 프레임워크로 확장된다. 우리는 그들의 Pomelo 확장 모듈 개발을 위해 서드 파티를 장려한다.

* #### 문서
모든 주요 기능은 여기에 위키에 문서화 되었다. 우리는 어떤 제안이나 질문도 환영하며, 그래서 우리는 프레임워크의 사용환경을 향상시킬수 있습니다.

* #### 완벽한 MMO 데모
Pomelo는 완벽한 오픈 소스 MMO 게임 데모 [Lord of Pomelo] (http://pomelo.netease.com/lordofpomelo/ "Lord of pomelo online") ([Source Code](https://github.com/NetEase/lordofpomelo "Lordofpomelo source " )) 를 포함하고 있습니다. 이것은 10만 라인 이상의 자바스크립트로 만들어졌습니다.

Pomelo의 목적
==============

Pomelo는 리얼타임 게임, 소셜 게임, 모바일 게임과 같은 모든 규모의 서버 사이드 어플리케이션을 위해 디자인 되었다.

Pomelo는 대규모의 MMORPG게임 서버 개발을 위해 추천되지 않는다, 특히 대규모 3D 게임에 [Bigworld](http://bigworldtech.com/en/)와 같은 상업적인 엔진이 좋은 선택이 될 수 있다.

좋다, [Pomelo 인스톨] (Installation "pomelo Installation")하고 도전해보자!