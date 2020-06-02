```shell
# 启动kubectl cluster (不要开着VPN)
$ minikube start --image-repository='registry.cn-hangzhou.aliyuncs.com/google_containers' --vm-driver=hyperkit
# download Istio 需要指定版本(需要开VPN shit)
$ curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.5.1 sh - 
$ cd istio-1.5.1

(brew install istioctl最好使 手动安装不知道哪就出问题了 shit)
# https://formulae.brew.sh/formula/istioctl
$ brew install istioctl
# 运行demo
$ istioctl manifest apply --set profile=demo
# 添加一个名称空间标签来指示 Istio 在稍后部署应用程序时自动注入 envoy sidecar 代理
$ kubectl label namespace default istio-injection=enabled
# 部署 Bookinfo 示例应用程序
$ kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
```



安装istioctl

![image-20200331082816203](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331082816203.png)

运行demo

![image-20200331111227358](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331111227358.png)

部署 Bookinfo 示例应用程序

![image-20200331111540671](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331111540671.png)



![image-20200331111737334](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331111737334.png)

![image-20200331111836440](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331111836440.png)

下面全是手动安装过程问题

![image-20200331080831765](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331080831765.png)

![image-20200331082232294](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331082232294.png)



![image-20200331082311059](/Users/xiaodong/Desktop/k8sTutorial/images/Istio/image-20200331082311059.png)



【Waiting for resources to become ready 是因为镜像下载不下来】https://blog.51cto.com/14625168/2477719

```
touch /etc/docker/daemon.json

vim /etc/docker/daemon.json

{

"registry-mirrors": [
		"https://registry.docker-cn.com",
		"https://dockerhub.azk8s.cn",
		"https://docker.mirrors.ustc.edu.cn",
		"https://reg-mirror.qiniu.com",
		"https://hub-mirror.c.163.com",
		"https://mirror.ccs.tencentyun.com",
	]
}


systemctl daemon-reload

systemctl restart docker

```



