Pomelo is based on Node.js, now it has been full supported for Windows, Linux, Mac, etc.. 

Pomelo는 Node.js를 기반으로 윈도우, 리눅스, 맥 등을 지원합니다.

Prerequisites 전제조건
=============

* During the process of installation, it will download dependency npm modules for pomelo from the Internet via npm, so make sure your machine can access Internet;

설치 과정 동안, 그것은 인터넷 via npm으로 부터 Pomelo를 위해 종속성 npm 모듈을 다운하게 될것입니다 그래서 당신의 컴퓨터가 인터넷에 액세스 할수 있는지 확인합니다;

* Make sure your system has installed Node.js. You can install Node using the latest precompiled binary package, Node provides the binary for Windows, Mac and Linux, [here] (http://nodejs.org/download/ " Download Node installation package " ) is the download linkage. You can also use the traditional way to install Node from source code, but it may be more complex. 

당신의 시스템이 Node.js가 설치되었는지 확인합니다. 당신은 최신 프리컴파일 바이너리 패키지를 이용해 노드를 설치할수 있습니다, 노드는 윈도우, 맥 그리고 리눅스를 위해 바이너리를 제공합니다 여기 다운로드 링크입니다 (http://nodejs.org/download/ " Download Node installation package " ). 당신은 또한 소스코드에서 노드를 설치하는 전통적인 방법을 사용할 수 있지만 그것은 좀더 복잡 할수도 있습니다.

* Make sure your system has installed python (2.5 <version <3.0) and a C++ compiler. The Node's source code is mainly written in C++ and JavaScript, but it use [gyp] (http://code.google.com/p/gyp/ "gyp") tool to do the project management, and gyp is written in Python, so python is required. For non-Windows platform, python has been pre-installed generally, so does C++ compiler; But for Windows, make sure your Windows has installed the source code compiler, Visaul Studio is recommended. Node.js uses gyp to generate Visual Studio Solution File, and then use the VC++ to compile it to binary.

당신의 시스템이 Python (2.5 <version <3.0)과 C++ 컴파일러가 설치 되었는지 확인합니다. 노드의 소스 코드는 주로 C++와 자바스크립트로 작성되어있지만 그것은 gyp 툴을 사용해 프로젝트 관리를 하고, gyp는 Python으로 작성되어 있습니다, 그래서 Python이 필요합니다. 비 윈도우 플랫폼의 경우, Python은 일반적으로 미리 설치되어 있어서 C++ 컴파일러가 합니다. 그러나 윈도우의 경우 윈도우에 소스코드 컴파일러가 설치 되어있는지 확인하고 Visaul Studio를 추천합니다. Node.js는 Vusual Studieo 솔루션 파일을 생성하는 gyp를 사용하고 바이너리로 VC++ 컴파일을 사용합니다. 

* Pomelo is written in Javascript, but there are some pomelo dependencies written in C++, so the installation of pomelo will use the C++ compiler. Therefore, please make sure the following two conditions be met if you are on Windows:
    - [Python] (http://python.org/) (2.5 <version <3.0).
    - VC++ compiler, included in the [Visual Studio 2010] (http://msdn.microsoft.com/en-us/vstudio/hh388567)(VC++ 2010 Express also be ok).

Pomelo는 자바스크립트로 작성되어 있지만 C++로 작성된 일부 Pomelo는 종속성이 있습니다, 그래서 Pomelo의 설치는 C++ 컴파일러를 사용해야 할것입니다. 그러므로 당신의 운영체제가 윈도우즈인 경우 다음과 같은 두가지 조건이 충족되야 합니다:
    - [Python] (http://python.org/) (2.5 <version <3.0).
    - VC++ 컴파일러는, [Visual Studio 2010] (http://msdn.microsoft.com/en-us/vstudio/hh388567)에 포함되어있습니다.(VC++ 2010 Express 역시 괜찮다).

* **Mac**의 경우, 당신은 [Xcode Command Line Tools](https://developer.apple.com/downloads/index.action?q=xcode) 또는 full [Xcode] (https://developer.apple.com/xcode/)를 설치했는지 먼저 확인해야 합니다.


Installation 설치
================

Using npm (node package management tool) to install pomelo globally:

npm을 사용할 경우 (node package management tool) Pomelo는 글로벌로 설치합니다.

    $ npm install pomelo -g

You can also download the source code to install pomelo using the following command:

당신은 또한 다음과 같은 명령어를 사용하여 Pomelo를 설치할 수 있는 소스코드를 다운로드 할 수 있습니다:

    $ git clone https://github.com/NetEase/pomelo.git
    $ cd pomelo
    $ npm install -g

Where -g option means the global installation. For more infomation on npm, please refer to . 

-g 옵션은 global 설치를 의미합니다. npm의 추가 정보는, [npm documentation](https://npmjs.org/doc/ "npm Documents")를 참고하십시오.

If the installation does not report any error, that means you have a successful installation.

설치 오류가 발생하지 않으면 그것은 당신이 성공적인 설치를 했다는 것을 의미합니다.

Next, we will test our installation was successful or not by a [HelloWorld project](Helloworld-of-pomelo "HelloWorld").

다음은 우리의 설치가 성공적이었는지 [HelloWorld 프로젝트](Helloworld-of-pomelo "HelloWorld")로 확인할 것입니다.