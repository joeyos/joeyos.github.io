---
layout: post
title: "Python实现kNN分类器"
date: 2018-08-07
categories: 机器学习 Python
tags: 机器学习 Python
author: Quan Zhang
---

* content
{:toc}

## mat函数将数组转化为矩阵


```python
from numpy import*
randMat = mat(random.rand(4,4))
randMat.I #矩阵求逆
```




    matrix([[ 1.51900945, -0.87326592, -0.98504535,  0.47266687],
            [-3.15648897,  7.26242941,  0.0891794 , -1.79213267],
            [-2.7365492 ,  4.14776454,  0.02475141,  0.2028809 ],
            [ 3.49114515, -7.49137048,  0.98189461,  1.43100589]])




```python
randMat*(randMat.I) #得单位矩阵
```




    matrix([[ 1.00000000e+00, -2.77555756e-16, -1.11022302e-16,
             -5.55111512e-17],
            [-1.66533454e-16,  1.00000000e+00, -1.11022302e-16,
              0.00000000e+00],
            [-3.33066907e-16, -1.55431223e-15,  1.00000000e+00,
             -1.38777878e-17],
            [ 0.00000000e+00, -4.44089210e-16, -1.11022302e-16,
              1.00000000e+00]])




```python
eye(4) #4x4单位矩阵
```




    array([[1., 0., 0., 0.],
           [0., 1., 0., 0.],
           [0., 0., 1., 0.],
           [0., 0., 0., 1.]])



## 使用python导入数据


```python
from numpy import*
import operator #导入云算符
def createDataSet(): #创建数据集和标签
    group = array([[1.0,1.1],(1.0,1.0),[0,0],[0,0.1]])
    labels = ['A','A','B','B']
    return group,labels
group,labels = createDataSet()
```


```python
group
```




    array([[1. , 1.1],
           [1. , 1. ],
           [0. , 0. ],
           [0. , 0.1]])




```python
labels
```




    ['A', 'A', 'B', 'B']



## k近邻算法

对未知数据的每个点依次执行如下操作：

1. 计算已知类别数据集中的点与当前点之间的距离

2. 按照距离递增次序排序

3. 选取与当前点距离最小的k个点

4. 确定前k个点所在类别的出现频率

5. 返回前k个点出现频率最高的类别作为当前点的预测分类

[kNN分类器下载](https://zhangquan1995.github.io/res/20180807/kNN/kNN.zip)

```python
#-*- coding:utf-8 -*-
import kNN
from numpy import *
import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
plt.rcParams['axes.unicode_minus']=False #用来正常显示负号

#kNN.py的路径
#sys.path.append("D:\python")

#（1）创建一个简单标签
group,labels = kNN.createDataSet()
print("group:\n",group,'\n')
print("labels:\n",labels,'\n')

#（2）kNN分类
print("与[0,0]最近的类别:\n",kNN.classify0([0,0],group,labels,3),'\n')

#（3）读数据，绘图
datingDataMat,datingLabels = kNN.file2matrix('datingTestSet2.txt')
#检查数据
#[3, 2, 1, 1, 1, 1, 3, 3, 1, 3, 1, 1, 2, 1, 1, 1, 1, 1, 2, 3]
print("测试读入的数据:\n",datingLabels[0:20],'\n')
fig = plt.figure()
ax = fig.add_subplot(111)
ax.scatter(datingDataMat[:,1],datingDataMat[:,2])
plt.xlabel('玩游戏所耗时间百分比')
plt.ylabel('每周吃冰激凌公升数')
plt.show()

#（4）采用不同色彩区分样本
fig = plt.figure()
ax = fig.add_subplot(111)
ax.scatter(datingDataMat[:,1],datingDataMat[:,2],
           15.0*array(datingLabels),15.0*array(datingLabels))
plt.xlabel('玩游戏所耗时间百分比')
plt.ylabel('每周吃冰激凌公升数')
plt.show()

#（5）分类器测试
kNN.datingClassTest()

#（6）分类器预测
#用户输入，反馈结果
#喜欢的人玩游戏所占时间百分比：10
#每年出差里程数：10000
#每周冰激凌公升数：0.5
#预测结果：small doses
kNN.classifyPerson()


#手写数字识别
#宽高32x32黑白图
#大约2000个训练集，900个测试集
kNN.handwritingClassTest()
#改变变量k的值，修改训练样本和数目都会对错误率产生影响

```
