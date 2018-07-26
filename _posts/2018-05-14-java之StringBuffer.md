---
layout: post
title: "java之StringBuffer"
date: 2018-05-14
categories: Java
tags: Java
author: Quan Zhang
---

* content
{:toc} 

StringBuffer中的append方法是将一个字符拼接到另一个字符上，效率比“+”的方式高，一般应用于数据库。如下void无返回值，但是append会执行。

```java
public class StringBufferTest{
	public static void main(String[] args){
		StringBuffer buf1 = new StringBuffer("hello");
		StringBuffer buf2 = new StringBuffer("java");
		test(buf1,buf2);
		System.out.println("out..."+buf1);
		System.out.println(buf1+"..."+buf2);
	}
	public static void test(StringBuffer buf3,StringBuffer buf4){
		buf3.append(buf4);
		//buf1 = buf2;//invalid statement
	}
}
```
