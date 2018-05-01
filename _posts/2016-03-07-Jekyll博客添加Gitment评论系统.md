---
layout: post
title: "Jekyll博客添加Gitment评论系统"
date: 2016-03-07 13:12:06 
categories: Git
tags: Git
author: Quan Zhang
--- 
  
* content
{:toc}

了解一下国内的几个第三方评论系统，如“多说”，“畅言”，“友言”，“新浪云跟贴”：

	1.多说，曾经较火的评论系统，网上介绍文章比较多，但已关闭，无法再用了
	2.畅言，sohu旗下的，但是需要个人博客备案后才能使用，但github pages个人博客感觉备案比较难
	3.友言，jiaThis旗下的，由于时http请求，github pages现在都是https了， 在https站点无法调用http请求，故也无法使用
	4.网易云跟贴，曾被当作“多说”的替代品，可惜官方通报说也将在2017.08.01关闭了
	
Gitment，一款由国内大神imsun开发的基于github issues的评论系统, 具体介绍请看项目主页( github.com/imsun/gitment ).

## 申请一个Github OAuth Application

Github头像下拉菜单 > Settings > 左边Developer settings下的OAuth Application > Register a new application，填写相关信息：

1.Application name, Homepage URL, Application description 都可以随意填写.

2.Authorization callback URL 一定要写自己Github Pages的URL.

3.填写完上述信息后按Register application按钮，得到Client ID和Client Secret.

## 在jekyll博客调用gitment

在你需要添加评论系统的地方，一般是_layout/目录下的 post.html, 添加一下代码:

```html
{% if site.comment_gitment_repo %}
<div id="gitmentContainer"></div>
<link rel="stylesheet" href="https://imsun.github.io/gitment/style/default.css">
<script src="https://imsun.github.io/gitment/dist/gitment.browser.js"></script>
<script>
    var gitment = new Gitment({
		id: '<%= page.date %>',
        owner: '{{site.github_username}}',
        repo: '{{site.comment_gitment_repo}}',
        oauth: {
            client_id: '{{site.comment_gitment_clientId}}',
            client_secret: '{{site.comment_gitment_clientSecret}}',
        },
    });
    gitment.render('gitmentContainer')
</script>
{% endif %}
```

在_config.yml文件里面输入相应的配置：

```html
#gitment
comment_gitment_repo: 你的repo名
comment_gitment_clientId: 你的clientId名
comment_gitment_clientSecret: 你的clientSecret
```

## 为每篇博文初始化评论系统

由于gitment的原理是为每一遍博文以其URL作为标识创建一个github issue， 对该篇博客的评论就是对这个issue的评论。因此，我们需要为每篇博文初始化一下评论系统， 初始化后，你可以在你的github上会创建相对应的issue。

接下来，介绍一下如何初始化评论系统：

1.上面第2步代码添加成功并上传后，你就可以在你的博文页下面看到一个评论框，还 有看到以下错误Error: Comments Not Initialized，提示该篇博文的评论系统还没初始化。

2.点击Login with GitHub后，使用自己的github账号登录后，就可以在上面错误信息 处看到一个Initialize Comments的按钮。


3.点击Initialize Comments按钮后，就可以开始对该篇博文开始评论了， 同时也可以在对应的github仓库看到相应的issue。

## Gitment坑点小结

### Error: Not Found问题

owner或者repo配置错误了，注意名字和仓库名字的大小写。

### Error: Comments Not Initialized

1.在注册OAuth Application这个步骤中，给Authorization callback URL指定的地址错了

2.还没有在该页面的Gitment评论区登陆GitHub账号

### Error：validation failed

issue的标签label有长度限制！labels的最大长度限制是50个字符。需要修改前面插入的gitment的html代码：

1.id用文章的title

**id: '<%= page.title %>'**

2.id用文章的时间

**id: '<%= page.date %>'**

## gitment的汉化

只需到模板里将原来定义CSS和JS的那两行改成：

```html
<link rel="stylesheet" href="https://billts.site/extra_css/gitment.css">
<script src="https://billts.site/js/gitment.js"></script>
```


