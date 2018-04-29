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

## java创建数据表，插入数据

	 Statement有三种执行SQL语句的方法：
	 1.execute()可执行任何SQL语句，返回一个Boolean值
	   如果执行后第一个结果是resultSet,则返回true,否则返回false
	 2.executeQuery()执行select语句，返回查询到的结果集
	 3.executeUpdate()用于执行DML语句，返回一个整数
	   代表被SQL语句影响的记录条数

```java
import java.sql.*;
public class ExecuteDDL 
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
          // 1.创建数据表SQL语句
          String sql_create = "create table if not exists teacher"
          		+ "(tno int auto_increment,"
				+ "tname varchar(8) not null,"
				+ "tsex char(2) not null,"
				+ "tdate date not null,"
				+ "theight dec(5,2) default 000.00,"
				+ "primary key(tno));";
          int rs_create = statement.executeUpdate(sql_create);
          //注意主键“学号”不能重复
          String sql_insert = "insert into teacher"
          		+ "\n"
				+ "values(0,'王小花','女','2018-03-01','168.80'),"
				+ "(0,'韩梅梅','女','2018-04-28','169.70'),"
				+ "(0,'李晓晓','女','2018-02-15','167.65'),"
				+ "(0,'王大锤','男','2018-04-23','178.88'),"
				+ "(0,'赵铁柱','男','2018-12-21','179.35');";
		  int rs_insert = statement.executeUpdate(sql_insert);
          // 2.查询数据表
	      String sql_select = "select * from teacher";
          ResultSet rs_select = statement.executeQuery(sql_select);
          System.out.println("-----------------------------------------------------");
          System.out.println("执行结果如下所示:");
          System.out.println("-----------------------------------------------------");
          System.out.println(" 学号" + "\t" + " 姓名" + "\t" + " 性别" + "\t" + "测试时间" + "\t" + "身高");
          System.out.println("-----------------------------------------------------");
          String tno = null;
          String tname = null;
          String tsex = null;
          String tdate = null;
          String theight = null;
          while(rs_select.next()) 
          {
              // 选择数据
              tno = rs_select.getString("tno");
              tname = rs_select.getString("tname");
              tsex = rs_select.getString("tsex");
              tdate = rs_select.getString("tdate");
              theight = rs_select.getString("theight");
              // 首先使用ISO-8859-1字符集将name解码为字节序列并将结果存储新的字节数组中。
              // 然后使用GB2312字符集解码指定的字节数组
              //name = new String(name.getBytes("ISO-8859-1"),"GB2312");
              // 输出结果
              System.out.println(tno + "\t" + tname + "\t" + tsex + "\t" + tdate + "\t" + theight);
          }
          //rs_create.close();
          rs_select.close();
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

编译执行ExecuteDDL.java文件，执行结果如下：

| 学号 | 姓名 | 性别 | 测试时间 | 身高 |
|-------|--------|--------|--------------|-------|
| 1 | 王小花 | 女 | 2018-03-01 | 168.80 |
| 2 | 韩梅梅 | 女 | 2018-04-28 | 169.70 |
| 3 | 李晓晓 | 女 | 2018-02-15 | 167.65 |
| 4 | 王大锤 | 男 | 2018-04-23 | 178.88 |
| 5 | 赵铁柱 | 男 | 2018-12-21 | 179.35 |

