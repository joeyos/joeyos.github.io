---
layout: post
title: "Linux配置JDK和Tomcat"
date: 2019-01-17
categories: Java Linux
tags: Java Linux
author: Quan Zhang
---

* content
{:toc} 

## 配置jdk环境

### 配置

打开配置文件

```shell
vi /etc/profile
```

在文件结尾处添加如下，:wq保存退出，其中/home/java/jdk1.8.0_191为jdk路径。

```shell
export JAVA_HOME=/home/java/jdk1.8.0_191
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$JAVA_HOME/bin:$PATH
```

### 执行source使环境生效

```shell
source /etc/profile
```

### 测试版本

```shell
java -version
```

### 测试编译

```java
javac HelloWorld.java
java HelloWorld
```

## 启动tomcat

进入你的tomcat存放文件夹，进去bin目录

```shell
cd /home/tomcat/bin
```

运行start.sh，启动tomcat服务

```shell
./startup.sh
```

### Permission denied

Permission denied，权限不够，不能运行.sh文件，执行如下命令：

```shell
chmod u+x *.sh
```

### JAVA_HOME与JRE_HOME错误

没有配置jdk环境。

