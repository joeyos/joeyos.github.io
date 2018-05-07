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

## PreparedStatement 和 Statement

对于两条结构基本相似的SQL语句，只是执行插入时的值不同而已，可以使用占位符（？）参数的SQL语句代替。**相比Statement，PreparedStatement具有效率高、无须拼接字符串、可以防止SQL注入等优点。**

有人主张：“在JDBC应用中，如果你已经是稍有水平开发者，你就应该始终以**PreparedStatement**代替**Statement**。也就是说，在任何时候都不要使用Statement。”

**mysql.ini配置文件(放在工程文件下)：**

```
;mysql配置
[mysql]
;驱动程序名
driver=com.mysql.jdbc.Driver
;URL指向要访问的数据库名scutcs
url=jdbc:mysql://127.0.0.1:3306/scutcs
;用户名
user=root
;密码
password=zhang110
```

**下面将简要比较一下两者的执行100条插入语句的时间：**

```java
import java.sql.*;
import java.util.*;//Properties
import java.io.*;//FileInputStream
public class PreparedStatementTest 
{
	/*
	1.PreparedStatement预编译SQL语句性能更好
	2.PreparedStatement无须拼接SQL语句
	3.PreparedStatement可以防止SQL注入,安全
	4.问号提供占位符，executeUpdate执行前用setXXX赋值
	eg：
		PreparedStatement Pstatement = conn.prepareStatement(
			"insert into student values(null,?,1)");
		Pstatement.setString(1,"姓名1");
		Pstatement.setString(2,"姓名2");
		...
		Pstatement.executeUpdate();
	*/
	private String driver;
	private String url;
	private String user;
	private String password;
	public void initParam(String paramFile)throws Exception
	{
		//使用Properties类来加载属性文件
		//load外部配置文件
		Properties props = new Properties();
		props.load(new FileInputStream(paramFile));
		driver = props.getProperty("driver");
		url = props.getProperty("url");
		user = props.getProperty("user");
		password = props.getProperty("password");
		//加载驱动
		Class.forName(driver);
	}
	public void insertUseStatement()throws Exception
	{
		long start = System.currentTimeMillis();
		try(
			//获取数据库连接
			Connection conn = DriverManager.getConnection(url,user,password);
			//使用Connection来创建一个Statement对象
			Statement stmt = conn.createStatement())
		{
			//需要使用100条SQL语句来插入100条记录
			for(int i=0;i<100;i++)
			{
				stmt.executeUpdate("insert into student_table values("
					+ "null,'姓名"+i+"',1)");
			}
			System.out.println("使用Statement费时："
				+(System.currentTimeMillis()-start));
		}
	}
	public void insertUsePrepare()throws Exception
	{
		long start = System.currentTimeMillis();
		try(
			//获取数据库
			Connection conn = DriverManager.getConnection(url,user,password);
			//使用Connection来创建一个PreparedStatement对象
			PreparedStatement pstmt = conn.prepareStatement(
				"insert into student_table values(null,?,1)"))
		{
			//100次记录时间
			for(int i=0;i<100;i++)
			{
				pstmt.setString(1,"姓名"+i);
				pstmt.executeUpdate();
			}
			System.out.println("PreparedStatement费时："
				+(System.currentTimeMillis()-start));
		}
	}
	public static void main(String[] args)throws Exception
	{
		PreparedStatementTest pt = new PreparedStatementTest();
		pt.initParam("mysql.ini");
		pt.insertUseStatement();
		pt.insertUsePrepare();
	}
}
```

执行的结果为：

|Statement|PreparedStatement
|---|---|
|8193|5380|

很明显，PreparedStatement的**效率要高一些**。

## PreparedStatement创建表并写入实时数据

### 获得相应位数的字符

```java
public class GetString
{
	public static void main(String[] args)
	{
		String str = "窗前明月光，疑是地上霜。";
		int len = str.length();
		System.out.println(len);
		for(int i=0;i<len;i++)
		{
			System.out.print(str.charAt(i));

		}
		System.out.println();
		for(int i=0;i<len;i=i+2)
		{
			System.out.println(str.substring(i, i+2));
		}
	}
}
```

### 获取时间

```java
import java.util.Date;
import java.text.SimpleDateFormat;
public class GetTime
{
	public static void main(String[] args)
	{
		Date day=new Date();    
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
		System.out.println(df.format(day));
	}
}
```

由于程序执行时间很快，第一列时间不设置为关键字(primary key)。

```java
import java.sql.*;
import java.util.Date;
import java.text.SimpleDateFormat;
public class DataBasic 
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
          // pstatement用来执行SQL语句
          // 1.创建数据表SQL语句
          String sql_create = "create table if not exists databasic"
          		+ "(dtime varchar(19) not null,"
				+ "ddata varchar(4) not null);";
				//+ "primary key(dtime));";
          PreparedStatement pstatementCreate = conn.prepareStatement(sql_create);
          //执行SQL语句
          int rs_create = pstatementCreate.executeUpdate();
          PreparedStatement pstatement = conn.prepareStatement("insert into databasic values(?, ?)");
          String str="EFE334EF6D4A5C3D3A3B7E7EEFE334EF6D4A5C3D3A3B7E7EEFE334EF6D4A5C3D3A3B7E7EEFE334EF6D4A5C3D3A3B7E7E";
          //注意主键“时间”不能重复
          for(int i=0;i<str.length();i=i+4)
          {
				Date time=new Date();
				SimpleDateFormat tf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				//System.out.println(tf.format(time));
				pstatement.setString(1, tf.format(time));
				pstatement.setString(2, str.substring(i, i+4));
				pstatement.executeUpdate();
          }
          // 2.查询数据表
		  String sql_select = "select * from databasic";
          ResultSet rs_select = pstatement.executeQuery(sql_select);
          System.out.println("-----------------------------------------------------");
          System.out.println("执行结果如下所示:");
          System.out.println("-----------------------------------------------------");
          System.out.println(" 时间" + "\t" + "\t" + "\t" + " 数据");
          System.out.println("-----------------------------------------------------");
          String dtime = null;
          String ddata = null;
          while(rs_select.next()) 
          {
              // 选择数据
              dtime = rs_select.getString("dtime");
              ddata = rs_select.getString("ddata");
              // 输出结果
              System.out.println(dtime + "\t" + ddata);
          }
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
