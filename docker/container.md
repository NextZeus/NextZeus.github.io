# 查看 docker 容器使用的资源

[原文链接](https://www.cnblogs.com/sparkdev/p/7821376.html)

## docker stats 
 - 该命令用来显示容器使用的系统资源。不带任何选项执行 docker stats 命令
 - 默认情况下，stats 命令会每隔 1 秒钟刷新一次输出的内容直到你按下 ctrl + c。下面是输出的主要内容：
    -[CONTAINER]：以短格式显示容器的 ID。
    - [CPU %]：CPU 的使用情况。
    - [MEM USAGE / LIMIT]：当前使用的内存和最大可以使用的内存。
    - [MEM %]：以百分比的形式显示内存使用情况。
    - [NET I/O]：网络 I/O 数据。
    - [BLOCK I/O]：磁盘 I/O 数据。
    - [PIDS]：PID 号。
```shell
# docker stats
CONTAINER           CPU %               MEM USAGE / LIMIT     MEM %               NET I/O             BLOCK I/O           PIDS
8003a39860e2        0.04%               586MiB / 15.26GiB     3.75%               602MB / 592MB       232MB / 251MB       134
eb25d0b3a132        0.01%               779.5MiB / 1GiB       76.13%              41.2MB / 271MB      88MB / 2.88MB       47
```

## docker stats --no-stream
 - 如果不想持续的监控容器使用资源的情况，可以通过 --no-stream 选项只输出当前的状态

## docker stats --no-stream registry 8003a39860e2
 - 如果我们只想查看个别容器的资源使用情况，可以为 docker stats 命令显式的指定目标容器的名称或者是 ID

## docker stats --no-stream $(docker ps --format={{.Names}}) 
 - 显示 container name
```shell
CONTAINER                         CPU %               MEM USAGE / LIMIT     MEM %               NET I/O             BLOCK I/O           PIDS
graylog-docker_graylog_1          0.64%               586MiB / 15.26GiB     3.75%               605MB / 595MB       232MB / 252MB       134
graylog-docker_elasticsearch_1    0.23%               779.5MiB / 1GiB       76.13%              41.3MB / 273MB      88MB / 2.89MB       47
graylog-docker_mongodb_1          0.93%               128.2MiB / 15.26GiB   0.82%               540MB / 315MB       0B / 961MB          52
```
