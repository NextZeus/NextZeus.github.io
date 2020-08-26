
# mac install mysql [还是用docker吧，安装到电脑上费劲]

```

brew install mysql@5.7.6
mysql.server start
mysql -uroot
update user set authentication_string=password('123456') where User='root';
mysql.server restart

```

# mysql 5.6.40 日期转换

```
# bigint 类型(存储的时间需要精确到秒，不能是毫秒)

select *, from_unixtime(`createTime`,'%Y-%m-%d %H:%i') AS 'date_formatted' from test

SELECT *, DATE_FORMAT(FROM_UNIXTIME(createTime), '%Y-%m-%d %H:%i') AS 'date_formatted' from test

# timestamp类型

SELECT *, DATE_FORMAT(`createTime`, '%Y-%m-%d %H:%i') AS 'date_formatted' from test

```
