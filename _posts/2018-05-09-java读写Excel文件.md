---
layout: post
title: "java读写Excel文件"
date: 2018-05-09
categories: java
tags: java
author: Quan Zhang
---

* content
{:toc} 

这里java的JDK版本为1.8.0X，需要下载[jxl.jar](http://vdisk.weibo.com/s/aQg7p2eKoOm9K)。

利用eclipse新建工程，把jxl.jar导入到工程下。

## 写入Excel

```java
import java.io.File;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
public class WriteExcel
{
    public static void main(String[] args) throws Exception
    {
        String str[][] = { { "helloworld", "aaa" }, { "welcome", "bbb" } };
        File f = new File("C:\\test.xls");
        WritableWorkbook workbook = Workbook.createWorkbook(f);
        WritableSheet sheet = workbook.createSheet("helloworldSheet", 0);
        Label lab = null;
        for (int i = 0; i < str.length; i++)
        {
            for (int j = 0; j < str[i].length; j++)
            {
                lab = new Label(j, i, str[i][j]);
                sheet.addCell(lab);
            }
        }
        workbook.write();
        workbook.close();
    }
}  
```

**生成表格如下：**
|---|---|
|---|---|
|helloworld|aaa|
|welcome|bbb|

## 读取Excel

```java
import java.io.File;
import jxl.Sheet;
import jxl.Workbook;
public class ReadExcel
{
    public static void main(String[] args) throws Exception
    {
        Workbook workbook = Workbook.getWorkbook(new File("C://test.xls"));
        Sheet sheet[] = workbook.getSheets();
        String lab = null;
        for (int a = 0; a < sheet.length; a++)
        {
            for (int i = 0; i < sheet[a].getRows(); i++)
            {
                for (int j = 0; j < sheet[a].getColumns(); j++)
                {
                    lab = sheet[a].getCell(j, i).getContents();
                    System.out.print(lab + " ");
                }
                System.out.println();
            }
        }
    }
}
```
