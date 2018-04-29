---
layout: post
title: "java使用JDBC连接mysql数据库"
date: 2018-04-29
categories: java
tags: java mysql
author: Quan Zhang
---

* content
{:toc} 

这里java的JDK版本为1.8.0X，mysql版本为5.7。mysql的用户名为：root,密码为：zhang110。

## 下载JDBC驱动

下载JDBC驱动mysql-connector-java-5.1.46.zip，将其解压到java的安装目录(随便哪个路径都行，但是要记住这个路径)。

配置JDBC的环境变量，目的是让电脑任何一个地方的java程序能够调用这个jar包。

"我的电脑"->"属性"->"高级"->"环境变量"->classpath，将"解压路径\mysql-connector-java-5.1.46-bin\mysql-connector-java-5.1.46-bin.jar;"添加到classpath后。

注意：路径一定要访问到.jar文件为止。

## 创建数据库

用SQLyog数据库管理软件创建Database scutcs：

```sql
create database scutcs;
create table student
(
sno char(7) not null,
sname varchar(8) not null,
sex char(2) not null,
bdate date not null,
height dec(5,2) default 000.00,
primary key(sno)
);
```

然后插入若干数据。

## java访问数据库

```java
import java.sql.*;
public class JDBCTest 
{
  public static void main(String[] args)
  {
      // 驱动程序名
      String driver = "com.mysql.jdbc.Driver";
      // URL指向要访问的数据库名scutcs
      String url = "jdbc:mysql://127.0.0.1:3306/scutcs";
      // MySQL配置时的用户名
      String user = "root"; 
      // MySQL配置时的密码
      String password = "zhang110";
      try 
      { 
          // 加载驱动程序
          Class.forName(driver);
          // 连续数据库
          Connection conn = DriverManager.getConnection(url, user, password);
          if(!conn.isClosed()) 
              System.out.println("Succeeded connecting to the Database!");
          // statement用来执行SQL语句
          Statement statement = conn.createStatement();
          //执行SQL语句
          /*
          Statement有三种执行SQL语句的方法：
          1.execute()可执行任何SQL语句，返回一个Boolean值
            如果执行后第一个结果是resultSet,则返回true,否则返回false
          2.executeQuery()执行select语句，返回查询到的结果集
          3.executeUpdate()用于执行DML语句，返回一个整数
            代表被SQL语句影响的记录条数
          */
          // 要执行的SQL语句
          String sql = "select * from student";
          // 结果集
          ResultSet rs = statement.executeQuery(sql);
          System.out.println("-----------------");
          System.out.println("执行结果如下所示:");
          System.out.println("-----------------");
          System.out.println(" 学号" + "\t" + " 姓名");
          System.out.println("-----------------");
          String name = null;
          while(rs.next()) 
          {
              // 选择sname这列数据
              name = rs.getString("sname");
              // 首先使用ISO-8859-1字符集将name解码为字节序列并将结果存储新的字节数组中。
              // 然后使用GB2312字符集解码指定的字节数组
              //name = new String(name.getBytes("ISO-8859-1"),"GB2312");
              // 输出结果
              System.out.println(rs.getString("sno") + "\t" + name);
          }
          rs.close();
          conn.close();
      }
      catch(ClassNotFoundException e)
      {
          System.out.println("Sorry,can't find the Driver!"); 
          e.printStackTrace();
      }
      catch(SQLException e)
      {
          e.printStackTrace();
      }
      catch(Exception e)
      {
          e.printStackTrace();
      }
  }
}
```

编译执行JDBCTest.java文件，执行结果如下：

Succeeded connecting to the Database!

| 学号 | 姓名 |
|------|-----|
| 201801 | 张三
| 201802 | 李四
| 201803 | 王红
| 201804 | 冯莉莉

