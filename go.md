# Go 开发服务器器端过程用到的 DB, Cache, Framework, third-party library

## Framework
[gin](https://github.com/gin-gonic/gin)

## DB
[mysql]

## Cache
[Redis]
[Memory]


## Third party library

[fasthttp](https://github.com/valyala/fasthttp)



# Go Module 遇到的问题

## 私有仓库的包无法安装

```

go env -w GO111MODULE=on
# 设置代理
go env -w GOPROXY=https://goproxy.io,direct

(解决方法)# 设置不走 proxy 的私有仓库，多个用逗号相隔（可选）
go env -w GOPRIVATE=gitlab.xxx.com

# 设置不走 proxy 的私有组织（可选）
go env -w GOPRIVATE=example.com/org_name

```
