---
layout: post
title: "CentOS7安装Nginx图片服务器"
date: 2019-01-17
categories: Java Nginx
tags: Java Nginx
author: Quan Zhang
---

## 安装nginx依赖包

### 安装gcc

```
yum -y install gcc-c++
```

### 安装PCRE正则表达式解析

```
yum install -y pcre pcre-devel
```

### 安装zlib解压缩

```
yum install -y zlib zlib-devel
```

### 安装openssl

```
yum install -y openssl openssl-devel
```

## nginx安装步骤

### 把nginx的压缩包上传到linux系统

在root用户下，在secureCRT界面下按Alt+p进入sftp，把文件拖到窗口，文件就传到了~目录下

### 解压

- z表示格式
- x解压
- v进度
- f指定文件
```
tar -zxvf nginx-1.8.0.tar.gz
```
### 新建临时缓存文件夹

在`/var`下创建`temp`及`nginx`目录，即·/var/temp/nginx。

### 进入nginx-1.8.0运行configure

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
--http-scgi-temp-path=/var/temp/nginx/scgi
```
### make并且make install

进入nginx-1.8.0，执行make和make install命令
```
[root@localhost nginx-1.8.0]# make
```
```
[root@localhost nginx-1.8.0]# make install
```
### 启动

在/usr/local/nginx/sbin文件夹下：
```
[root@localhost sbin]# ./nginx
```
### 查看进程

```
ps aux|grep nginx
```
应该有两个nginx进程`master`和`worker`

### 在浏览器输入服务器域名192.168.52.129访问nginx

#### 无法访问欢迎页面【防火墙问题】

查看防火墙端口配置文件：

```
vim /etc/sysconfig/iptables
```

如果访问`ip地址`无法显示`nginx`的欢迎页面，大概是防火墙的原因，设置防火墙`80`端口打开：
```
[root@localhost ]# /sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT
[root@localhost ]# cd /etc/init.d/iptables save
[root@localhost ]# service iptables save
[root@localhost ]# service iptables restart
```

如果`service iptables save`命令执行失败报出：

`The service command supports only basic LSB actions (start, stop, restart, try-restart, reload, force-reload, status). For other actions, please try to use systemctl.`

```
解决方法：
systemctl stop firewalld 关闭防火墙
yum install iptables-services 安装或更新服务
再使用systemctl enable iptables 启动iptables
最后 systemctl start iptables 打开iptables

再执行防火墙配置
```

### 关闭nginx

```
[root@localhost sbin]# ./nginx -s stop
```

## 配置文件nginx.conf

在文件/usr/local/nginx/conf/nginx.conf的末尾 `“}”`前添加如下`server`后保存:
- 可以根据端口号区分：如80和81
- 可以通过域名区分：修改host文件，test.taotao.com，并添加主页html-test/index.html
```
    server {
        listen       80;
        server_name  test.taotao.com;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html-test;
            index  index.html index.htm;
        }
    }
```

### 修改主机host文件

推荐使用switchost软件，在主机host文件中添加如下映射：
```
192.168.52.129 test.taotao.com
```

### 复制index主页

复制nginx下的html文件夹为html-test
```
cp -r html html-test
```
编辑html-test里面的index.html文件，随便修改几个内容，以示区别。
```
vi html-test/index.html
```

### 在sbin目录下执行./nginx -s reload启动nginx并更新配置

#### 执行./nginx -s reload找不到nginx.pid

如果出现如下错误：
```
nginx: [error] open() "/var/run/nginx/nginx.pid" failed (2: No such file or directory)
```
在sbin文件夹下执行如下命令，指定配置文件路径：
```
./nginx -c /usr/local/nginx/conf/nginx.conf
```

### 浏览器输入test.taotao.com访问html-test下的index.html页面
