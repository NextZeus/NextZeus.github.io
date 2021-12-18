# Lua IDE ZeroBrane Studio
[download link](https://studio.zerobrane.com/download?not-this-time)


# packages dir
/Applications/ZeroBraneStudio.app/Contents/ZeroBraneStudio/packages

# ZeroBranePackage
[ZeroBranePackage](https://github.com/pkulchenko/ZeroBranePackage)
- 使用redis package，只需要将 redis.lua 拷贝到 packages dir
	- cp ./redis.lua /Applications/ZeroBraneStudio.app/Contents/ZeroBraneStudio/packages/

# Develop and debug Redis Lua scripts with ZeroBrane Studio
[Develop and debug Redis Lua scripts with ZeroBrane Studio](https://www.youtube.com/watch?v=7mlajCj4QPw)

zeroBrane中
一:project–>lua interpreter --> 选择redis
然后,选择debug就会弹出 url的输入框 输入"redis://ip:port"
下一步,就会弹出密码框

二: project–>command line parameters
输入参数,注意输入框里面,英文逗号分隔keys与args参数,并且英文逗号前后都要留一个空格,然后keys之间空格间隔,args 也是空格间隔 ,“keys1 keys2 keys3 , argv1 argv2 argv3”

local key1=KEYS[1]
local key1=KEYS[2]
local argv1=ARGV[1]
local argv1=ARGV[2]
1
2
3
4
三: project–>Starter Debugger Server 勾选

然后可以 单个三角型符号点击,debug,默认第一行停住
单个三角符号的debug会执行完恢复数据;
但是累加的三角符号(单个三角符号debug的左边图案),执行完不会恢复数据
————————————————
版权声明：本文为CSDN博主「百物易用是苏生」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u010720408/article/details/114582468