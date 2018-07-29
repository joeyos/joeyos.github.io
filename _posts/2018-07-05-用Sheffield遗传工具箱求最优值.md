---
layout: post
title: "用Sheffield遗传工具箱求最优值"
date: 2018-07-05
categories: 遗传算法 Matlab
tags: 遗传算法 Matlab
author: Quan Zhang
---

* content
{:toc}

## 遗传算法工具箱的安装

下载[gatbx工具箱](https://pan.baidu.com/s/19xh1CmdPPXhj-t0G5hYh4w)，将其放在Matlab的tootbox目录下，file-》Set Path->Add Folder，找到gatbx文件夹，单击OK，Save后退出。

**查看是否安装成功：**

```matlab
v=ver('gatbx')
```

出现Name，Version，Release等信息则安装完成。

## 寻求一元函数的最小值

利用遗传算法寻求如下函数的最小值：

<center>$$f(x)=\frac{sin(10\pi x)}{x}, x\in [1,2]$$</center>

遗传算法参数设置：

|种群大小|最大遗传代数|个体长度|代沟|交叉概率|变异概率|
|-|-|-|-|-|-|
|40|20|20|0.95|0.7|0.01|

```matlab
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% 寻求f(X)=sin(10*pi*X)./X;的最小值
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
close all;clear all;clc;
%% 画出函数图
figure(1);
hold on;
lb=1;ub=2;% 函数自变量范围【1,2】
ezplot('sin(10*pi*X)/X',[lb,ub]);% 画出函数曲线
xlabel('自变量/X');
ylabel('函数值/Y');
%% 定义遗传算法参数
NIND=40;% 种群大小
MAXGEN=20;%最大遗传代数
PRECI=20;%个体长度
GGAP=0.95;%代沟
px=0.7;%交叉概率
pm=0.01;%变异概率
trace=zeros(2,MAXGEN);%寻优结果的初始值
FieldD=[PRECI;lb;ub;1;0;1;1];%区域描述器
Chrom=crtbp(NIND,PRECI);%创建任意离散随机种群
%% 优化
gen=0;
X=bs2rv(Chrom,FieldD);%初始种群二进制到十进制的转换
ObjV=sin(10*pi*X)./X;%计算目标函数值
while gen<MAXGEN
    FitnV=ranking(ObjV);%分配适应度值
    SelCh=select('sus',Chrom,FitnV,GGAP);%选择
    SelCh=recombin('xovsp',SelCh,px);%重组
    SelCh=mut(SelCh,pm);%变异
    X=bs2rv(SelCh,FieldD);%子代个体的十进制转换
    ObjVSel=sin(10*pi*X)./X;%计算子代的目标函数值
    [Chrom,ObjV]=reins(Chrom,SelCh,1,1,ObjV,ObjVSel);%重插人子代到父代，得到新种群
    X=bs2rv(Chrom,FieldD);
    gen=gen+1;%代计数器增加
    %获取每代的最优解及其序号，Y为最优解，I为个体的序号
    [Y,I]=min(ObjV);
    trace(1,gen)=X(I);%记下每代的最优值
    trace(2,gen)=Y;%记下每代的最优值
end
plot(trace(1,:),trace(2,:),'bo');%画出每代的最优点
grid on;
plot(X,ObjV,'b*');%画出最后一代的种群
hold off
%% 画进化图
figure(2);
plot(1:MAXGEN,trace(2,:));
grid on
xlabel('遗传代数');
ylabel('解的进化');
title('进化过程');
bestY=trace(2,end);
bestX=trace(1,end);
fprintf(['最优解：\nX=',num2str(bestX),'\nY=',num2str(bestY),'\n']);
```

其中，$\circ$是每代的最优解，$\ast$是优化20代后的种群分布，$\circ$和$\ast$集中的点就是最优解。

	最优解：
	X=1.1491
	Y=-0.8699

![](/images/blog/20180705/1.jpg)

![](/images/blog/20180705/2.jpg)

## 寻求多元函数的最大值

利用遗传算法寻找一下函数的最大值：

<center>$$f(x,y)=xcos(2\pi y)+ysin(2\pi x), x\in [-2,2], y\in [-2,2]$$</center>

|种群大小|最大遗传代数|个体长度|代沟|交叉概率|变异概率|
|-|-|-|-|-|-|
|40|50|40(两长度为20的自变量)|0.95|0.7|0.01|

```matlab
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% 寻求f(X,Y)=Y.*sin(2*pi*X)+X.*cos(2*pi*Y)的最大值
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
close all;clear all;clc;
%% 画出函数图
figure(1);
lbx=-2;ubx=2;% 函数自变量x范围[-2,2]
lby=-2;uby=2;% 函数自变量y范围[-2,2]
ezmesh('y*sin(2*pi*x)+x*cos(2*pi*y)',[lbx,ubx,lby,uby],50);% 画出函数曲线
hold on;
%% 定义遗传算法参数
NIND=40;% 种群大小
MAXGEN=50;% 最大遗传代数
PRECI=20;% 个体长度
GGAP=0.95;% 代沟
px=0.7;% 交叉概率
pm=0.01;% 变异概率
trace=zeros(3,MAXGEN);%寻优结果的初始值
FieldD=[PRECI PRECI;lbx lby;ubx uby;1 1;0 0;1 1;1 1];% 区域描述器
Chrom=crtbp(NIND,PRECI*2);% 创建任意离散随机种群
%% 优化
gen=0;% 代计数器
XY=bs2rv(Chrom,FieldD);% 初始种群的十进制转换
X=XY(:,1);
Y=XY(:,2);
ObjV=Y.*sin(2*pi*X)+X.*cos(2*pi*Y);% 计算目标函数值
while gen<MAXGEN
    FitnV=ranking(-ObjV);% 分配适应度值
    SelCh=select('sus',Chrom,FitnV,GGAP);% 选择
    SelCh=recombin('xovsp',SelCh,px);% 重组
    SelCh=mut(SelCh,pm);% 变异
    XY=bs2rv(SelCh,FieldD);% 子代个体的十进制转换
    X=XY(:,1);
    Y=XY(:,2);
    ObjVSel=Y.*sin(2*pi*X)+X.*cos(2*pi*Y);% 计算子代目标函数值
    [Chrom,ObjV]=reins(Chrom,SelCh,1,1,ObjV,ObjVSel);% 重插入子代到父代，得到新种群
    XY=bs2rv(Chrom,FieldD);
    gen=gen+1;% 代计数器增加
    % 获取每代的最优解及其序号，y为最优解，I为个体的序号
    [Y,I]=max(ObjV);
    trace(1:2,gen)=XY(I,:);% 记下每代的最优值
    trace(3,gen)=Y;% 记下每代的最优值
end
plot3(trace(1,:),trace(2,:),trace(3,:),'bo');% 每代的最优点
grid on;
plot3(XY(:,1),XY(:,2),ObjV,'bo');% 画出最后一代的种群
hold off
%% 画进化图
figure(2);
plot(1:MAXGEN,trace(3,:));
grid on;
xlabel('遗传代数');
ylabel('解的变化');
title('进化过程');
bestZ=trace(3,end);
bestX=trace(1,end);
bestY=trace(2,end);
fprintf(['最优解:\nX=',num2str(bestX),'\nY=',num2str(bestY),'\nZ=',num2str(bestZ),'\n']);
```

	最优解：
	X=1.7625
	Y=-2
	Z=3.7563

![](/images/blog/20180705/3.jpg)

![](/images/blog/20180705/4.jpg)

## 其他算法

### 遗传算法

用于**非线性函数优化，路线规划**。

先种群初始化，适应度函数，选择操作，交叉操作，变异操作，进化逆转操作，画路线轨迹图。

### 粒子群算法

用于**多目标搜索**，**路线规划**。先种群初始化，种群更新，更新个体最优粒子，非劣迹筛选。

还有**混合粒子群算法**、**动态粒子群算法**。

### 免疫优化算法

用于物流配送中心**选址**中的应用。

### 鱼群算法

用语**函数寻优**。先鱼群初始化，觅食行为，聚群行为，追尾行为，目标函数，一元函数优化，二元函数优化。

### 模拟退火

用于**路线规划**。计算距离矩阵，初始解，生成新解，准则函数，画路线轨迹，可行解长度。

**加热过程 -> 恒温过程 -> 降温过程**

### 遗传模拟退火算法

遗传模拟退火算法课用于**聚类**。

### 蚁群算法

一群算法可用于**路线规划**。
