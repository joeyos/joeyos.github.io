---
layout: post
title: "利用Python+matplotlib库进行绘图"
date: 2018-04-08
categories: python
tags: python matplotlib
author: Quan Zhang
---

* content
{:toc} 

**Github个人主页：**[zhangquan1995.github.io](https://zhangquan1995.github.io)
## 安装Python3.6

windows系统在python官网下载exe文件安装即可，**记住安装路径**。

## 安装matplotlib库

### 下载matplotlib库

在这个网站上下载正确版本的matplotlib https://pypi.python.org/pypi/matplotlib/ 

注意正确版本的matplotlib是指对应所安装的python型号和系统的版本，例如我的电脑下载的是3.6版本32位系统的python，就要找到带有cp36(表示3.6版）和win32字样的matplotlib，版本若不对会提示版本错误，安装不了。电脑系统若是64位，但安装的python是32位的话，还是需要安装32位的matplotlib。

把下载好的matplotlib移到python的script目录下，我的python安装默认路径是：**C:\Users\Administrator\AppData\Local\Programs\Python\Python36-32\script**，注意这个目录里面有pip3.6，利用cmd命令行的cd命令进入此文件夹目录下。

### 安装

在目标路径下输入pip3.6 install matplotlib-2.2.0rc1-cp36-cp36m-win32.whl

**可能错误1：** pip版本需要更新，按照错误提示更新即可。

**可能错误2：** 下载的matplotlib版本与系统不匹配，请下载64或者32位对应版本。

回车后系统就开始安装了。打开pycharm，输入import matplotlib，没有错误提示就是装好了。

### 测试

显示一幅PNG格式图片：

```python
import matplotlib.pyplot as plt # plt 用于显示图片
import matplotlib.image as mpimg # mpimg 用于读取图片
import numpy as np

lena = mpimg.imread('lena.png') # 读取和代码处于同一目录下的 lena.png
# 此时 lena 就已经是一个 np.array 了，可以对它进行任意处理
lena.shape #(512, 512, 3)

plt.imshow(lena) # 显示图片
plt.axis('off') # 不显示坐标轴
plt.show()
```
### 绘图

```python
# 导入 matplotlib 的所有内容（nympy 可以用 np 这个名字来使用）
from pylab import *

# 创建一个 8 * 6 点（point）的图，并设置分辨率为 80
figure(figsize=(8,6), dpi=80)

# 创建一个新的 1 * 1 的子图，接下来的图样绘制在其中的第 1 块（也是唯一的一块）
subplot(1,1,1)

X = np.linspace(-np.pi, np.pi, 256,endpoint=True)
C,S = np.cos(X), np.sin(X)

# 绘制余弦曲线，使用蓝色的、连续的、宽度为 1 （像素）的线条
plot(X, C, color="blue", linewidth=1.0, linestyle="-")

# 绘制正弦曲线，使用绿色的、连续的、宽度为 1 （像素）的线条
plot(X, S, color="green", linewidth=1.0, linestyle="-")

# 设置横轴的上下限
xlim(-4.0,4.0)

# 设置横轴记号
xticks(np.linspace(-4,4,9,endpoint=True))

# 设置纵轴的上下限
ylim(-1.0,1.0)

# 设置纵轴记号
yticks(np.linspace(-1,1,5,endpoint=True))

# 以分辨率 72 来保存图片
# savefig("exercice_2.png",dpi=72)

# 在屏幕上显示
show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408205552998?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**改变线条的颜色和粗细**

```python
figure(figsize=(10,6), dpi=80)
plot(X, C, color="blue", linewidth=2.5, linestyle="-")
plot(X, S, color="red",  linewidth=2.5, linestyle="-")
show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408210752734?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**设置边界**

```python
xlim(X.min()*1.1, X.max()*1.1)
ylim(C.min()*1.1, C.max()*1.1)
```
![这里写图片描述](https://img-blog.csdn.net/20180408211329776?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**设置记号**

```python
xticks( [-np.pi, -np.pi/2, 0, np.pi/2, np.pi])
yticks([-1, 0, +1])
```
![这里写图片描述](https://img-blog.csdn.net/20180408211637656?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**设置记号标签**

```python
xticks([-np.pi, -np.pi/2, 0, np.pi/2, np.pi],
       [r'$-\pi$', r'$-\pi/2$', r'$0$', r'$+\pi/2$', r'$+\pi$'])

yticks([-1, 0, +1],
       [r'$-1$', r'$0$', r'$+1$'])
```
![这里写图片描述](https://img-blog.csdn.net/20180408211802912?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**移动中轴线**

```python
ax = gca()
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')
ax.xaxis.set_ticks_position('bottom')
ax.spines['bottom'].set_position(('data',0))
ax.yaxis.set_ticks_position('left')
ax.spines['left'].set_position(('data',0))
```
![这里写图片描述](https://img-blog.csdn.net/20180408211921275?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**添加图注**

```python
plot(X, C, color="blue", linewidth=2.5, linestyle="-", label="cosine")
plot(X, S, color="red",  linewidth=2.5, linestyle="-", label="sine")

legend(loc='upper left')
```
![这里写图片描述](https://img-blog.csdn.net/20180408212042808?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**标注特殊点**

```python
t = 2*np.pi/3
plot([t,t],[0,np.cos(t)], color ='blue', linewidth=2.5, linestyle="--")
scatter([t,],[np.cos(t),], 50, color ='blue')

annotate(r'$\sin(\frac{2\pi}{3})=\frac{\sqrt{3}}{2}$',
         xy=(t, np.sin(t)), xycoords='data',
         xytext=(+10, +30), textcoords='offset points', fontsize=16,
         arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))

plot([t,t],[0,np.sin(t)], color ='red', linewidth=2.5, linestyle="--")
scatter([t,],[np.sin(t),], 50, color ='red')

annotate(r'$\cos(\frac{2\pi}{3})=-\frac{1}{2}$',
         xy=(t, np.cos(t)), xycoords='data',
         xytext=(-90, -50), textcoords='offset points', fontsize=16,
         arrowprops=dict(arrowstyle="->", connectionstyle="arc3,rad=.2"))
```
![这里写图片描述](https://img-blog.csdn.net/20180408212324789?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
### 一些常见类型图
**普通图**

```python
from pylab import *

n = 256
X = np.linspace(-np.pi,np.pi,n,endpoint=True)
Y = np.sin(2*X)

plot (X, Y+1, color='blue', alpha=1.00)
plot (X, Y-1, color='blue', alpha=1.00)
show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408213132791?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
美化一下：
```python
import numpy as np
import matplotlib.pyplot as plt

n = 256
X = np.linspace(-np.pi,np.pi,n,endpoint=True)
Y = np.sin(2*X)

plt.axes([0.025,0.025,0.95,0.95])

plt.plot (X, Y+1, color='blue', alpha=1.00)
plt.fill_between(X, 1, Y+1, color='blue', alpha=.25)

plt.plot (X, Y-1, color='blue', alpha=1.00)
plt.fill_between(X, -1, Y-1, (Y-1) > -1, color='blue', alpha=.25)
plt.fill_between(X, -1, Y-1, (Y-1) < -1, color='red',  alpha=.25)

plt.xlim(-np.pi,np.pi), plt.xticks([])
plt.ylim(-2.5,2.5), plt.yticks([])
# savefig('../figures/plot_ex.png',dpi=48)
plt.show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408213145718?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

**散点图**

```python
from pylab import *

n = 1024
X = np.random.normal(0,1,n)
Y = np.random.normal(0,1,n)

scatter(X,Y)
show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408213421116?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
美化一下：
```python
import numpy as np
import matplotlib.pyplot as plt

n = 1024
X = np.random.normal(0,1,n)
Y = np.random.normal(0,1,n)
T = np.arctan2(Y,X)

plt.axes([0.025,0.025,0.95,0.95])
plt.scatter(X,Y, s=75, c=T, alpha=.5)

plt.xlim(-1.5,1.5), plt.xticks([])
plt.ylim(-1.5,1.5), plt.yticks([])
# savefig('../figures/scatter_ex.png',dpi=48)
plt.show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408213437586?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**条形图**

```
from pylab import *

n = 12
X = np.arange(n)
Y1 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)
Y2 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)

bar(X, +Y1, facecolor='#9999ff', edgecolor='white')
bar(X, -Y2, facecolor='#ff9999', edgecolor='white')

for x,y in zip(X,Y1):
    text(x+0.4, y+0.05, '%.2f' % y, ha='center', va= 'bottom')

ylim(-1.25,+1.25)
show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408213759197?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
美化一下：
```python
import numpy as np
import matplotlib.pyplot as plt

n = 12
X = np.arange(n)
Y1 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)
Y2 = (1-X/float(n)) * np.random.uniform(0.5,1.0,n)

plt.axes([0.025,0.025,0.95,0.95])
plt.bar(X, +Y1, facecolor='#9999ff', edgecolor='white')
plt.bar(X, -Y2, facecolor='#ff9999', edgecolor='white')

for x,y in zip(X,Y1):
    plt.text(x+0.4, y+0.05, '%.2f' % y, ha='center', va= 'bottom')

for x,y in zip(X,Y2):
    plt.text(x+0.4, -y-0.05, '%.2f' % y, ha='center', va= 'top')

plt.xlim(-.5,n), plt.xticks([])
plt.ylim(-1.25,+1.25), plt.yticks([])

# savefig('../figures/bar_ex.png', dpi=48)
plt.show()

```
![这里写图片描述](https://img-blog.csdn.net/20180408213811677?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
**3D图**
```python
from pylab import *
from mpl_toolkits.mplot3d import Axes3D

fig = figure()
ax = Axes3D(fig)
X = np.arange(-4, 4, 0.25)
Y = np.arange(-4, 4, 0.25)
X, Y = np.meshgrid(X, Y)
R = np.sqrt(X**2 + Y**2)
Z = np.sin(R)

ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap='hot')

show()
```
![这里写图片描述](https://img-blog.csdn.net/20180408213938274?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5ncXVhbjIwMTU=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

