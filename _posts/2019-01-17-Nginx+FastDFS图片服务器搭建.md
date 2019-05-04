---
layout: post
title: "Nginx+FastDFS图片服务器搭建"
date: 2019-01-17
categories: Java Nginx
tags: Java Nginx
author: Quan Zhang
---

* content
{:toc} 

## nginx的反向代理

反向代理应用于服务端，指定那台服务器给客户提供服务。

## 反向代理模拟

使用一台虚拟机，安装一个nginx，多个tomcat来模拟反向代理。

## 复制两个tomcat模拟反向代理

tomcat1是8080端口，使tomcat2用8081端口

### 修改tomcat配置文件

- tomcat2/conf/server.sml
- 8085改成8086
- 8080改成8081
- 8009改成8010

### 无法访问欢迎页面【防火墙问题】

查看防火墙端口配置文件：

```
vi /etc/sysconfig/iptables
```
```
-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
```
添加两个可访问端口：
```
-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 8080 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 8081 -j ACCEPT
```
保存，重启防火墙
```
service iptables restart
```

### 更改两个index.jsp主页

在两个tomcat的webapps/ROOT/index.jsp里面加上-Port:8080或者-Port:8081以示区别：
```
<div id="asf-box">
    <h1>${pageContext.servletContext.serverInfo}-Port:8080</h1>
</div>
```
```
<div id="asf-box">
    <h1>${pageContext.servletContext.serverInfo}-Port:8081</h1>
</div>
```
### 反向代理

把原来/usr/local/nginx/conf/nginx.conf末尾的`server`改为如下：并添加upstream tomcats：
```
    upstream tomcats{
        server 192.168.52.129:8080 weight=2;
        server 192.168.52.129:8081;
    }   
    server {
        listen       80;
        server_name  test.taotao.com;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass   http://tomcats;
            index  index.html index.htm;
        }
    }
```

### 负载均衡【新机器能者多劳】

通过权重weight分配服务概率，值越大分配概率越大。

### 启动tomcat和nginx测试

- 启动两个tomcat
- 运行nginx程序

```
./nginx -s reload
```
#### 执行./nginx -s reload找不到nginx.pid

nginx: [error] open() "/var/run/nginx/nginx.pid" failed (2: No such file or directory)

在sbin文件夹下执行如下命令，指定配置文件路径：
```
./nginx -c /usr/local/nginx/conf/nginx.conf
```

## FastDFS文件上传下载

- client
- tracker-server
- storage-server

### 上传流程

1. storage定时向tracker上传状态信息
2. client向tracker上传请求连接
3. tracker查询可用storage
4. tracker返回可用storage的ip和端口
5. 上传文件
6. storage生成file-id
7. storage将内容写入磁盘
8. storage向client返回file-id路径和文件名
9. client存储文件信息

### 下载流程

1. storage定时向tracker上传状态信息
2. client向tracker上传请求连接
3. tracker查询可用storage
4. tracker返回可用storage的ip和端口
5. client向storage发送file-id路径信息
6. storage查找文件
7. storage返回file-content

## 搭建FastDFS步骤

### 复制压缩包到服务器

- fastdfs-nginx-module_v1.16.tar.gz
- FastDFS_v5.05.tar.gz
- libfastcommonV1.0.7.tar.gz

### 安装libevent和perl

```
yum -y install libevent

yum install perl
```

### 安装libfastcommon

- 解压
- ./make.sh
- ./make.sh install
- 把/usr/lib64/libfastcommon.so文件向/usr/lib/下复制一份

### 安装Tracker

- 解压FastDFS_v5.05.tar.gz
- ./make.sh
- ./make.sh install
- 把cp –r /root/FastDFS/conf目录下的所有的配置文件都复制到/etc/fdfs下
- 注意使用`cp -r`，否则报错`cp: omitting directory ‘/root/FastDFS/conf`

注意：检查/etc/fdfs下`mime.types`和`http.conf`是否成功从/root/FastDFS/conf中拷贝成功，否则后面的nginx服务器访问时一直加载！

- cp ~/FastDFS/conf/mime.types /etc/fdfs
- cp ~/FastDFS/conf/http.conf /etc/fdfs

### 新建文件夹

- 新建文件夹/home/fastdfs/tracker
- 新建文件夹/home/fastdfs/storage
- 新建文件夹/home/fastdfs/client

### 配置tracker服务

修改/root/FastDFS/conf/tracker.conf文件。

```
base_path=/home/fastdfs/tracker
```

复制到/etc/fdfs下cp tracker.conf /etc/fdfs。

#### 启动tracker服务

```
/usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf
```
重新启动：
```
/usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf restart
```
### 配置storage服务

如果是在不同的服务器安装，需要重新执行配置tracker之前的四步。

配置storage服务：修改/root/FastDFS/conf/storage.conf文件

```
base_path=/home/fastdfs/storage
store_path0=/home/fastdfs/storage
tracker_server=192.168.52.129:22122
```

#### 启动storage服务

```
/usr/bin/fdfs_storaged /etc/fdfs/storage.conf restart
```
### 测试服务

- 进入/etc/fdfs/文件夹
- 复制配置文件/etc/fdfs/client.conf.sample为/etc/fdfs/client.conf
- 复制一个图片zxc.jpg到/etc/fdfs/文件夹
- 编辑client.conf

```
base_path=/home/fastdfs/client
tracker_server=192.168.52.129:22122
```

#### 测试

```
/usr/bin/fdfs_test /etc/fdfs/client.conf upload zxc.jpg
```
如果显示如下信息则成功：
```
tracker_query_storage_store_list_without_group: 
        server 1. group_name=, ip_addr=192.168.52.129, port=23000

group_name=group1, ip_addr=192.168.52.129, port=23000
storage_upload_by_filename
group_name=group1, remote_filename=M00/00/00/wKg0gVvliFOAFTCcAAIEbfjnAjM334.jpg
source ip address: 192.168.52.129
file timestamp=2018-11-09 08:14:59
file size=132205
file crc32=4175888947
example file url: http://192.168.52.129/group1/M00/00/00/wKg0gVvliFOAFTCcAAIEbfjnAjM334.jpg
storage_upload_slave_by_filename
group_name=group1, remote_filename=M00/00/00/wKg0gVvliFOAFTCcAAIEbfjnAjM334_big.jpg
source ip address: 192.168.52.129
file timestamp=2018-11-09 08:14:59
file size=132205
file crc32=4175888947
example file url: http://192.168.52.129/group1/M00/00/00/wKg0gVvliFOAFTCcAAIEbfjnAjM334_big.jpg
```

## 搭建nginx提供http服务

参考博客（https://www.cnblogs.com/tc520/p/6822412.html）

可以使用官方提供的nginx插件，要使用nginx插件需要重新编译。

1. 解压fastdfs-nginx-module_v1.16.tar.gz
2. 改/root/fastdfs-nginx-module/src/config文件，把其中的三个local去掉
3. 安装nginx重新config

```
./configure \
--prefix=/usr/local/nginx \
--pid-path=/var/run/nginx/nginx.pid \
--lock-path=/var/lock/nginx.lock \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-http_gzip_static_module \
--http-client-body-temp-path=/var/temp/nginx/client \
--http-proxy-temp-path=/var/temp/nginx/proxy \
--http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
--http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
--http-scgi-temp-path=/var/temp/nginx/scgi \
--add-module=/root/fastdfs-nginx-module/src
```
4. make
5. make install
6. /root/fastdfs-nginx-module/src/mod_fastdfs.conf文件复制到/etc/fdfs目录下
7. 编辑/etc/fdfs/mod_fastdfs.conf

```
base_path=/tmp
tracker_server=192.168.52.129:22122
url_hava_group_name=true
store_path0=/home/fastdfs/storage
```
8. 在nginx的配置文件/usr/local/nginx/conf/nginx.conf中修改Server：

```
    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location ~/group([0-9])/M00/{
                ngx_fastdfs_module;
        }
```
9. libfdfsclient.so拷贝至/usr/lib下

```
cp /usr/lib64/libfdfsclient.so /usr/lib/
```
10. 启动nginx，浏览器访问localhost
11. 测试：/usr/bin/fdfs_test /etc/fdfs/client.conf upload girl.jpg
12. 访问生成的链接http://192.168.52.129/group1/M00/00/00/wKg0gVvmcmCAXXqFAAChaTZy5ds776_big.jpg

### 访问不了nginx

1. 检查防火墙是否端口可访问


```
vi /etc/sysconfig/iptables
```
检查如下端口是否打开：
```
-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 22122 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 23000 -j ACCEPT
```
保存，重启防火墙
```
service iptables restart
```


2. 检查/etc/fdfs下`mime.types`和`http.conf`是否成功从/root/FastDFS/conf中拷贝成功，否则后面的nginx服务器访问时一直加载！

- cp ~/FastDFS/conf/mime.types /etc/fdfs
- cp ~/FastDFS/conf/http.conf /etc/fdfs
