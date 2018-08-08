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

```python
'''
Created on Sep 16, 2010
kNN: k Nearest Neighbors

Input:      inX: vector to compare to existing dataset (1xN)
            dataSet: size m data set of known vectors (NxM)
            labels: data set labels (1xM vector)
            k: number of neighbors to use for comparison (should be an odd number)
            
Output:     the most popular class label

@author: pbharrin
'''
from numpy import *
import operator
from os import listdir

#kNN分类器
def classify0(inX, dataSet, labels, k):
    dataSetSize = dataSet.shape[0]
    diffMat = tile(inX, (dataSetSize,1)) - dataSet
    sqDiffMat = diffMat**2
    sqDistances = sqDiffMat.sum(axis=1)
    distances = sqDistances**0.5#欧氏距离
    sortedDistIndicies = distances.argsort()     
    classCount={}          
    for i in range(k):
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel,0) + 1
    #sortedClassCount = sorted(classCount.iteritems(), key=operator.itemgetter(1), reverse=True)
    # python3中iteritems为items
    sortedClassCount = sorted(classCount.items(), key=operator.itemgetter(1), reverse=True)
    return sortedClassCount[0][0]

#创建简单标签类
def createDataSet():
    group = array([[1.0,1.1],[1.0,1.0],[0,0],[0,0.1]])
    labels = ['A','A','B','B']
    return group, labels

#将文本记录转换为矩阵
def file2matrix(filename):
    fr = open(filename)
    numberOfLines = len(fr.readlines()) #得到文件行数
    returnMat = zeros((numberOfLines,3))#创建返回矩阵
    classLabelVector = []               #解析数据到列表
    fr = open(filename)
    index = 0
    for line in fr.readlines():
        line = line.strip()#截取掉所以的回车符
        listFromLine = line.split('\t')#用tab符创建列表
        returnMat[index,:] = listFromLine[0:3]#选取前3个元素存储到特征矩阵中
        classLabelVector.append(int(listFromLine[-1]))#列表最后一列存储到向量中
        index += 1
    return returnMat,classLabelVector

#为了均衡特征的权重，将特征值归一化
#newValue = (oldValue-min)/(max-min)
#特征矩阵有1000x3个值
#minVals和range的值都为1x3
#使用tile函数将变量内容复制成输入矩阵同样大小的矩阵
def autoNorm(dataSet):
    minVals = dataSet.min(0)
    maxVals = dataSet.max(0)
    ranges = maxVals - minVals
    normDataSet = zeros(shape(dataSet))
    m = dataSet.shape[0]
    normDataSet = dataSet - tile(minVals, (m,1))
    normDataSet = normDataSet/tile(ranges, (m,1))#特征值相除
    return normDataSet, ranges, minVals

#分类器测试函数
def datingClassTest():
    hoRatio = 0.50      #hold out 10%
    datingDataMat,datingLabels = file2matrix('datingTestSet2.txt')#load data setfrom file
    normMat, ranges, minVals = autoNorm(datingDataMat)
    m = normMat.shape[0]
    numTestVecs = int(m*hoRatio)
    errorCount = 0.0
    for i in range(numTestVecs):
        classifierResult = classify0(normMat[i,:],normMat[numTestVecs:m,:],datingLabels[numTestVecs:m],3)
        print("the classifier came back with: %d, the real answer is: %d" %(classifierResult, datingLabels[i]))
        if (classifierResult != datingLabels[i]): errorCount += 1.0
    print("the total error rate is: %f" % (errorCount/float(numTestVecs)))
    print(errorCount)

#预测函数：用户输入，反馈预测结果
def classifyPerson():
    resultList=['not at all','small doses','large doses']
    percentTats = float(input(\
        "你喜欢玩游戏所占时间百分比？"))
    ffMiles = float(input("每年出差里程数？"))
    iceCream = float(input("每周冰激凌公升数？"))
    datingDataMat,datingLabels = file2matrix('datingTestSet2.txt')
    normMat,ranges,minVals = autoNorm(datingDataMat)
    inArr = array([ffMiles,percentTats,iceCream])
    classifierResult = classify0((inArr-\
                        minVals)/ranges,normMat,datingLabels,3)
    print("你喜欢的人可能在如下人群中：",resultList[classifierResult-1])

#手写数字识别
#图像转换为向量
#32x32 转 1x1024
def img2vector(filename):
    returnVect = zeros((1,1024))
    fr = open(filename)
    for i in range(32):
        lineStr = fr.readline()
        for j in range(32):
            returnVect[0,32*i+j] = int(lineStr[j])
    return returnVect

def handwritingClassTest():
    hwLabels = []
    trainingFileList = listdir('trainingDigits')           #load the training set
    m = len(trainingFileList)
    trainingMat = zeros((m,1024))
    for i in range(m):
        fileNameStr = trainingFileList[i]
        fileStr = fileNameStr.split('.')[0]     #take off .txt
        classNumStr = int(fileStr.split('_')[0])
        hwLabels.append(classNumStr)
        trainingMat[i,:] = img2vector('trainingDigits/%s' % fileNameStr)
    testFileList = listdir('testDigits')        #iterate through the test set
    errorCount = 0.0
    mTest = len(testFileList)
    for i in range(mTest):
        fileNameStr = testFileList[i]
        fileStr = fileNameStr.split('.')[0]     #take off .txt
        classNumStr = int(fileStr.split('_')[0])
        vectorUnderTest = img2vector('testDigits/%s' % fileNameStr)
        classifierResult = classify0(vectorUnderTest, trainingMat, hwLabels, 3)
        print("the classifier came back with: %d, the real answer is: %d" %(classifierResult, classNumStr))
        if (classifierResult != classNumStr): errorCount += 1.0
    print("\nthe total number of errors is: %d" % errorCount)
    print("\nthe total error rate is: %f" % (errorCount/float(mTest)))
```