---
layout: post
title: "Solr+Zookeeper搭建分布式系统"
date: 2019-01-17
categories: Java 分布式
tags: Java 分布式
author: Quan Zhang
---

* content
{:toc} 

## 安装solr

前提，已经安装tomcat和jdk。

- 解压solr压缩包
- 新建文件夹/usr/local/solr
- 把tomcat放里面
- 复制cp dist/solr-4.10.3.war tomcat/webapps/
- 启动tomcat，会安装solr-4.10.3.war
- 删除war包
- 把/root/solr-4.10.3/example/lib/ext目录下的所有的jar包复制到tomcat/webapps/solr-4.10.3/WEB-INF/lib下
- 复制cp /root/solr-4.10.3/example/solr /usr/local/solrhome
- 在solr的web.xml中配置solrhome路径

```shell
  <!-- People who want to hardcode their "Solr Home" directly into the
       WAR File can set the JNDI property here...
   -->
   
    <env-entry>
       <env-entry-name>solr/home</env-entry-name>
       <env-entry-value>/usr/local/solr/solrhome</env-entry-value>
       <env-entry-type>java.lang.String</env-entry-type>
    </env-entry>
```

- 启动tomcat，http://192.168.52.129:8080/solr-4.10.3/

### 无法访问solr

查看tomcat的log文件localhost.log，Could not find necessary SLF4j logging jars. 

1. 从/root/solr/example/lib/ext下的全部jar拷贝到tomcat7/webapps/solr-4.10.3/WEB-INF/lib

2. 在webapps/solr-4.10.3新建文件夹resource，从~/solr-4.10.3/example/resources/中拷贝log4j.properties到此文件夹
3. 注意solrhome在web.xml的配置路径/usr/local/solr/solrhome的solr/solrhome名称因人而异

```shell
[root@localhost solr-4.10.3]# cp ~/solr-4.10.3/example/resources/log4j.properties ./resources/
```

### 访问http://192.168.52.129:8080/solr-4.10.3/

注意solr-4.10.3路径！！

## 配置中文分析器

分析器使用IKAnalyzer。

使用方法：

第一步：把IKAnalyzer依赖的jar包添加到solr工程中。把分析器使用的扩展词典添加到classpath中。

```shell
cp IKAnalyzer2012FF_u1.jar /usr/local/solr/tomcat7/webapps/solr-4.10.3/WEB-INF/lib
```

```shell
cp ext_stopword.dic  IKAnalyzer.cfg.xml mydict.dic /usr/local/solr/tomcat7/webapps/solr-4.10.3/WEB-INF/classes
```

第二步：需要自定义一个FieldType。Schema.xml中定义。可以在FieldType中指定中文分析器。

修改/usr/local/solr/solrhome/collection1/conf/schema.xml

```shell
<fieldType name="text_ik" class="solr.TextField">
  <analyzer class="org.wltea.analyzer.lucene.IKAnalyzer"/>
</fieldType>
```

设置要查询的关键词：

```shell
<field name="item_title" type="text_ik" indexed="true" stored="true"/>
<field name="item_sell_point" type="text_ik" indexed="true" stored="true"/>
<field name="item_price"  type="long" indexed="true" stored="true"/>
<field name="item_image" type="string" indexed="false" stored="true" />
<field name="item_category_name" type="string" indexed="true" stored="true" />
<field name="item_desc" type="text_ik" indexed="true" stored="false" />

<field name="item_keywords" type="text_ik" indexed="true" stored="false" multiValued="true"/>
<copyField source="item_title" dest="item_keywords"/>
<copyField source="item_sell_point" dest="item_keywords"/>
<copyField source="item_category_name" dest="item_keywords"/>
<copyField source="item_desc" dest="item_keywords"/>
```

## solr集群(solr+zookeeper)

solrClound需要用到solr+zookeeper。

    1、集群管理
    主从的管理、负载均衡、高可用的管理。集群的入口。Zookeeper必须是集群才能保证高可用。Zookeeper有选举和投票的机制。集群中至少应该有三个节点。
    2、配置文件的集中管理
    搭建solr集群时，需要把Solr的配置文件上传zookeeper，让zookeeper统一管理。每个节点都到zookeeper上取配置文件。
    3、分布式锁
    
    Zookeeper：3台
    Solr：4台
    伪分布式，zookeeper三个实例、tomcat（solr）需要四个实例。
    Zookeeper需要安装jdk。

## 搭建zookeeper

- 解压
- 新建文件夹/usr/local/solr-cloud
- 把解压的zookeeper拷贝三份到上面的文件夹zookeeper01、zookeeper02、zookeeper03
- zookeeper01目录下创建一个data/myid，myid写入1（02写入2，03写入3）
- 配置zookeeper01-zookeeper03端口


    把/usr/local/solr-cloud/zookeeper01/conf里面的zoo_sample.cfg复制一份zoo.cfg【依次类推】
    修改配置文件zoo.zfg【依次类推】
    路径：dataDir=/usr/local/solr-cloud/zookeeper01/data/【依次类推】
    端口：clientPort=2181【依次类推】
    末尾添加：
    server.1=192.168.52.129:2881:3881
    server.2=192.168.52.129:2882:3882
    server.3=192.168.52.129:2883:3883


- 启动，zookeeper目录下有个bin/zkServer.sh start启动服务

新建shell脚本zookeeper-start-all.sh，并chmod -x zookeeper-start-all.sh

```shell
zookeeper01/bin/zkServer.sh start
zookeeper02/bin/zkServer.sh start
zookeeper03/bin/zkServer.sh start
```

- 关闭，bin/zkServer.sh stop
- 查看服务状态：./zkServer.sh status

正确开启的状态信息，否则查看防火墙及配置文件端口号

```shell
[root@localhost solr-cloud]# ./zookeeper-status
JMX enabled by default
Using config: /usr/local/solr-cloud/zookeeper01/bin/../conf/zoo.cfg
Mode: follower
JMX enabled by default
Using config: /usr/local/solr-cloud/zookeeper02/bin/../conf/zoo.cfg
Mode: leader
JMX enabled by default
Using config: /usr/local/solr-cloud/zookeeper03/bin/../conf/zoo.cfg
Mode: follower
```

## solr集群搭建

1. 新建文件夹/usr/local/solr-cloud
2. 拷贝4个tomcat到solr-cloud，tomcat01-tomcat04

|tomcat|端口1|端口2|端口3|
|---|---|----|---|
|tomcat01|8006|8081|8010|
|tomcat02|8007|8082|8011|
|tomcat03|8008|8083|8012|
|tomcat04|8049|8084|8013|

注意tomcat04的端口1不能为8009，有冲突。

3. 从单机版的solr拷贝webapps/solr到tomcat【重命名为solr，不能为solr-4.10.3，否则后面启动的时候只有一个active，其他都是Recovering】

```shell
cp -r /usr/local/solr/tomcat7/webapps/solr-4.10.3/ /usr/local/solr-cloud/tomcat04/webapps/
```

4. 拷贝单击版的solrhome到/usr/local/solr-cloud，拷贝4份，solrhome01-solrhome04，修改/usr/local/solr-cloud/solrhome01的web.xml的host、hostPort两个属性，8081-8084端口依情况而定。

```shell
vi tomcat04/webapps/solr-4.10.3/WEB-INF/web.xml
```

```shell
<str name="host">192.168.52.129</str>
<int name="hostPort">8081</int>
```

5. 上传任意solrhome的配置文件到zookeeper。【确保zookeeper已经启动】

```shell
/root/solr-4.10.3/example/scripts/cloud-scripts/zkcli.sh
```

在/root/solr-4.10.3/example目录下执行 java -jar start.jar 命令。 Ctrl+C或另打开一个连接窗口

```shell
./zkcli.sh -zkhost 192.168.52.129:2181,192.168.52.129:2182,192.168.52.129:2183 -cmd upconfig -confdir /usr/local/solr-cloud/solrhome01/collection1/conf -confname myconf
```

6. 查看是否上传成功，使用zookeeper的zkCli.sh，然后ls /configs/myconf
7. 在每个tomcat告诉solr zookeeper的位置，在如下文件如下位置添加JAVA_OPTS：【注意ip地址和端口号】

vi /usr/local/solr-cloud/tomcat04/bin/catalina.sh

```shell
# Uncomment the following line to make the umask available when using the
# org.apache.catalina.security.SecurityListener
#JAVA_OPTS="$JAVA_OPTS -Dorg.apache.catalina.security.SecurityListener.UMASK=`umask`"

JAVA_OPTS="-DzkHost=192.168.52.129:2181,192.168.52.129:2182,192.168.52.129:2183"
```

8. 启动全部tomcat

查看某个tomcat是否成功启动：

```shell
tail -f /usr/local/solr-cloud/tomcat04/logs/catalina.out
```

```shell
log4j:WARN Please initialize the log4j system properly.
log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
Nov 14, 2018 8:46:31 AM org.apache.catalina.startup.HostConfig deployDirectory
INFO: Deployment of web application directory /usr/local/solr-cloud/tomcat04/webapps/solr-4.10.3 has finished in 95,114 ms
Nov 14, 2018 8:46:31 AM org.apache.coyote.AbstractProtocol start
INFO: Starting ProtocolHandler ["http-bio-8084"]
Nov 14, 2018 8:46:32 AM org.apache.coyote.AbstractProtocol start
INFO: Starting ProtocolHandler ["ajp-bio-8013"]
Nov 14, 2018 8:46:32 AM org.apache.catalina.startup.Catalina start
INFO: Server startup in 104390 ms
```

tomcat8开始，默认启动的是NIO模式，7默认启动的是BIO模式，还可以通过配置设置APR模式启动，至于APR，NIO和BIO的区别，是和tomcat并发性能有关的，高并发的系统应该将tomcat的模式设置成APR模式，会大幅度的提高服务器的处理和响应性能。感兴趣的可以自己百度下。当然这个不用在意，跟本文集群搭建没啥关系，就是想到了说一下。

9. 访问http://192.168.52.129:8081/solr/#/~cloud，查看是否全部active【绿色】，且有一个黑的【Leader】

10. 集群分片

```shell
http://192.168.52.129:8081/solr/admin/collections?action=CREATE&name=collection2&numShards=2&replicationFactor=2
```

假使不用collection1，可以删除collection1：

```shell
http://192.168.52.129:8081/solr/admin/collections?action=DELETE&name=collection1
```
