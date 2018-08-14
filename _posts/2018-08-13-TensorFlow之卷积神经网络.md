---
layout: post
title: "TensorFlow之卷积神经网络"
date: 2018-08-13
categories: python 机器学习
tags: python 机器学习
author: Quan Zhang
---

* content
{:toc} 

## 卷积网络简介

1. 输入层：三维矩阵的长宽代表图像大小，深度代表色彩通道数。

2. 卷积层：卷积层每个节点的输入只是上一层神经网络的一小块，这个小块常用的大小有3x3和5x5。卷积层试图将神经网络的每一小块进行更加深入的分析，从而得到抽象成都更高的特征，通常经过卷积层之后的节点矩阵的深度会增加。

3. 池化层；池化层不会改变深度，只改变`矩阵大小`，即将分辨率较高的图片变为分辨率较低的图片。

4. 全连接层：经过几轮卷积层和池化层的处理之后，可以认为图像中的信息已经被抽象成了信息含量更高的特征。我们可以将卷积层和池化层看成自动化图像特征提取的过程。在特征提取完成之后，仍然需要使用全连接层来完成`分类`任务。

5. softmax层：主要用于分类问题，得到当前样例属于不同类的概率分布情况。

AlexNet：现代神经网络起源，深度学习开始标志，卷积、池化、全连接

VGG：AlexNet增强版

GoogLeNet：多维度识别

ResNet：机器人超越人类识别

DeepFace：结构化图片的特殊处理

U-Net：图片生成网络

## 卷积层

卷积层的每一个过滤器或者内核可以将当前层神经网络上的一个子节点矩阵转化为下一层网络上的一个单位节点矩阵，单位矩阵的长宽为1，深度不限。

通过tf.get_variable的方式创建过滤器的权重变量和偏置项变量。由于卷积层的参数个数只和过滤器的尺寸、深度以及当前层节点矩阵的深度有关，所以这里声明的参数变量是一个四维矩阵，前面两个维度代表了过滤器的尺寸，第三个维度表示当前层的深度，第四个维度表示过滤器的深度。

    filter_weight = tf.get_variable(
        'weights',[5,5,3,16],
        initializer=tf.truncated_normal_initializer(stddev=0.1))
        
和卷积层的权重类似，当前层矩阵上不同位置的偏置项也是共享的，所以总共有下一层深度个不同的偏置项。

    biases = tf.get_variable(
        'biases',[16],initializer=tf.constant_initializer(0.1))

tf.nn.conv2d提供了一个非常方便的函数来实现卷积层前向传播的算法。这个函数的第一个输入为当前层的节点矩阵。注意这个矩阵是一个四维矩阵，后面三个维度对应一个节点矩阵，第一维对应一个输入batch。比如输入层，input[0,:,:,:]表示第一张图，input[1,:,:,:]表示第二张图，以此类推。第二个参数提供了卷积层的权重，第三个参数为不同维度的步长。虽然第三个参数提供的是一个长度为4的矩阵，但是第一维和最后一维的数字要求一定是1。这是因为卷积层的步长只对矩阵的长和宽有效。最后一个参数是填充的方法，TensorFlow中提供same或者valid两种选择。其中same表示添加全0填充，vaLid表示不添加。

    conv = tf.nn.conv2d(
        input,filter_weight,strides=[1,1,1,1],padding='SAME')

tf.nn.bias_add提供了一个方便的函数给每一个节点加上偏置项。注意这里不能直接使用加法，因为矩阵上不同位置上的节点都要加上同样的偏置项。虽然下一层神经网络的大小为2x2，但是偏置项只有一个数(因为深度为1)，而2x2矩阵中的每一个值都需要加上这个偏置项。

    bias = tf.nn.bias_add(conv,biases)
    #将计算结果通过ReLU激活函数完成线性化
    actived_conv = tf.nn.relu(bias)
    
## 池化层

池化层可以非常有效地缩小矩阵的尺寸，从而减少最后全连接层中的参数，使用池化层既可以加快计算速度，也有防止过拟合的作用。

池化层也是通过移动一个类似过滤器的结构完成的。不过池化层过滤器中的计算不是节点的加权和，而是采用更加简单的最大值或者平均值运算，即`最大池化层`或者`平均池化层`。

tf.nn,max_pool实现了最大池化层的前向传播。ksize提供了过滤器的尺寸，strides提供了步长信息，padding提供了是否使用全0填充

    pool = tf.nn.max_pool(actived_conv,ksize=[1,3,3,1],
            strides=[1,2,2,1],padding='SAME')

## 经典卷积网络模型

### LeNet-5模型

LeNet-5,模型总共有7层：卷积、池化、卷积、池化、全连接、全连接、全连接，训练过程CPU`耗时长`。

与之前的神经网络不同的是，卷积神经网络的输入层为一个三维矩阵，需要调整一下输入数据的格式，以下为`mnist_train.py`的修改部分：

    #调整输入数据placeholder的格式，输入为一个四维矩阵
    x=tf.placeholder(tf.float32,[
        batch_size,#第一维表示一个batch中样例的个数
        mnist_inference.image_size,#第二维和第三维表示图片的尺寸
        mnist_inference.image_size,
        mnist_inference.num_channels],#第四维表示图片深度，rgb格式深度为5
        name='x-input')
    #类似将输入的训练数据格式调整为一个四维矩阵
    #############################################
    reshaped_xs=np.reshape(xs,(batch_size,
        mnist_inference.image_size,
        mnist_inference.image_size,
        mnist_inference.num_channels))
        _,loss_value,step = sess.run([train_op,loss,global_step],
                           feed_dict={x:reshaped_xs,y_:ys})
    ###########################################

如下为重新写的`mnist_inference.py`：


```python
# -*- coding:utf-8 -*-
import tensorflow as tf
#配置神经网络的参数
input_node = 784
output_node = 10
image_size = 28
num_channels = 1
num_labels = 10
#第一层卷积层的尺寸和深度
conv1_deep = 32
conv1_size = 5
#第二层卷积层的尺寸和深度
conv2_deep = 64
conv2_size = 5
#全连接层节点数
fc_size = 512
#卷积网络前向传播
#train参数用于区分训练和测试过程
#dropout可以防止过拟合，只在训练使用
def inference(input_tensor,train,regularizer):
    #声明第一层卷积层的变量并实现前向传播
    #输入28x28x1的图片像素，因为图片使用了全0填充
    #所以输出为28x28x32的矩阵
    with tf.variable_scope('layer1-conv1'):
        conv1_weights = tf.get_variable(
            "weight",[conv1_size,conv1_size,num_channels,conv1_deep],
            initializer=tf.truncated_normal_initializer(stddev=0.1))
        conv1_biases=tf.get_variable(
            "bias",[conv1_deep],initializer=tf.constant_initializer(0.0))
        #使用边长为5，深度为32的过滤器，步长为1，全0填充
        conv1 = tf.nn.conv2d(
            input_tensor,conv1_weights,strides=[1,1,1,1],padding='SAME')
        relu1 = tf.nn.relu(tf.nn.bias_add(conv1,conv1_biases))
    #实现第二层池化层的前向传播
    #最大池化层
    #g过滤器边长为2，使用全0填充，步长为2
    #输入28x28x32，输出14x14x32的矩阵
    with tf.name_scope('layer2-pool1'):
        pool1 = tf.nn.max_pool(
            relu1,ksize=[1,2,2,1],strides=[1,2,2,1],padding='SAME')
    #声明第三层卷积层的变量并实现前向传播
    #输入14x14x32，输出14x14x64
    with tf.variable_scope('layer3-conv2'):
        conv2_weights=tf.get_variable(
            "weight",[conv2_size,conv2_size,conv1_deep,conv2_deep],
            initializer=tf.truncated_normal_initializer(stddev=0.1))
        conv2_biases=tf.get_variable(
            "bias",[conv2_deep],initializer=tf.constant_initializer(0.0))
    #使用边长为5，深度为64的过滤器，过滤器步长为1，且使用全0填充
    conv2 = tf.nn.conv2d(
        pool1,conv2_weights,strides=[1,1,1,1],padding='SAME')
    relu2 = tf.nn.relu(tf.nn.bias_add(conv2,conv2_biases))
    #实现第四层池化层的前向传播
    #输入14x14x64,输出7x7x64
    with tf.name_scope('layer4-pool2'):
        pool2=tf.nn.max_pool(
            relu2,ksize=[1,2,2,1],strides=[1,2,2,1],padding='SAME')
    #将第四层池化层的输入转化为第五层的输入格式
    #将7x7x64矩阵拉直成一个向量
    pool_shape = pool2.get_shape().as_list()
    #计算拉直后的长度
    nodes = pool_shape[1]*pool_shape[2]*pool_shape[3]
    reshaped = tf.reshape(pool2,[pool_shape[0],nodes])
    
    #声明第五层全连接层的变量并实现前向传播
    #输入一组3136长度的向量，输出一组512的向量
    #与神经网络一致，除了dropout以避免过拟合
    with tf.variable_scope('layer5-fc1'):
        fc1_weights = tf.get_variable(
            "weight",[nodes,fc_size],
            initializer=tf.truncated_normal_initializer(stddev=0.1))
        #只有全连接层权重需要正则化
        if regularizer != None:
            tf.add_to_collection('losses',regularizer(fc1_weights))
        fc1_biases = tf.get_variable(
            "bias",[fc_size],initializer=tf.constant_initializer(0.1))
        fc1=tf.nn.relu(tf.matmul(reshaped,fc1_weights)+fc1_biases)
        if train : fc1 = tf.nn.dropout(fc1,0.5)
    #声明第6层全连接层的变量并实现前向传播过程
    #这一层的输入为一组长度为512向量
    #输出为一组长度为10的向量
    #这一层的输出通过softmax之后得到最后的分类结果
    with tf.variable_scope('layer6-fc2'):
        fc2_weights = tf.get_variable(
            "weight",[fc_size,num_labels],
            initializer=tf.truncated_normal_initializer(stddev=0.1))
        if regularizer != None:
            tf.add_to_collection('losses',regularizer(fc2_weights))
        fc2_biases = tf.get_variable(
            "bias",[num_labels],
            initializer=tf.constant_initializer(0.1))
        logit = tf.matmul(fc1,fc2_weights)+fc2_biases
    #返回第6层的输出
    return logit
```

### Inception-v3模型

在LeNet-5模型中，不同卷积层通过串联的方式连接在一起，而Inception-v3模型中的Inception结构是将不同的卷积层通过串联的方式结合在一起。
