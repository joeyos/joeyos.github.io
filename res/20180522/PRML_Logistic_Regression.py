# -*- encoding: utf-8 -*-

from __future__ import print_function

import numpy as np
import scipy.optimize as op
import matplotlib.pyplot as plt


def plot_data(X, y):
    """This function plots the data points X and y into a new figure.
    It plots the data points with red + for the positive examples,
    and blue o the negative examples. X is assumed to be a Mx2 matrix.
    """
    plt.figure()
    # ====================== YOUR CODE HERE ======================
    pos = y == 1
    neg = y == 0
    plt.plot(X[pos, 0], X[pos, 1], 'c+', label="Admitted")
    plt.plot(X[neg, 0], X[neg, 1], 'mo', label="Not admitted")
    # ============================================================

    plt.xlabel("Exam 1 Score")
    plt.ylabel("Exam 2 Score")


def plot_decision_boundary(theta, X, y):
    """绘制分类面。"""
    plot_data(X[:, 1:], y)

    _, d = X.shape

    if d <= 3:
        plot_x = np.array([np.min(X[:, 1])-2, np.max(X[:, 1])+2])
        plot_y = -1.0/theta[2]*(theta[1]*plot_x + theta[0])
        plt.plot(plot_x, plot_y, 'm-', label="Decision Boundary")

        plt.xlim([30, 100])
        plt.ylim([30, 100])
    else:
        n_grid = 50
        u = np.linspace(-1, 1.5, n_grid)
        v = np.linspace(-1, 1.5, n_grid)

        z = np.zeros((n_grid, n_grid))

        for i in range(n_grid):
            for j in range(n_grid):
                uu, vv = np.array([u[i]]), np.array([v[j]])
                z[i, j] = np.dot(map_feature(uu, vv), theta)

        z = z.T

        CS = plt.contour(u, v, z, lw=2, levels=[0.0], colors=['m'])
        CS.collections[0].set_label('Decision boundary')

    plt.legend()


def sigmoid(z):
    """Compute sigmoid function"""

    z = np.asarray(z)
    g = np.zeros_like(z)
    # ====================== YOUR CODE HERE ======================
    g = 1.0/(1.0+np.exp(-z))
    # ============================================================

    return g


def cost_function(theta, X, y):
    """逻辑回归的代价函数，无正则项。"""

    J = 0.0
    # ====================== YOUR CODE HERE ======================
    m = 1.0*len(y)
    J = (1/m)*np.sum(-np.dot(np.log(0.000001+sigmoid(np.dot(X, theta))),y)-np.dot(np.log(0.000001+1-sigmoid(np.dot(X, theta))),(1-y)))
    # ============================================================

    return J


def cost_gradient(theta, X, y):
    """逻辑回归的代价函数的梯度，无正则项。"""
    m = 1.0*len(y)
    grad = np.zeros_like(theta)
    # ====================== YOUR CODE HERE ======================
    h_theta = sigmoid(np.dot(X, theta))
    grad = np.dot(X.T, h_theta-y)/m
    # ============================================================

    return grad


def predict(theta, X):
    """Predict whether the label is 0 or 1
    using learned logistic regression parameters theta.
    """
    m, _ = X.shape
    pred = np.zeros((m, 1), dtype=np.bool)

    # ====================== YOUR CODE HERE ======================
    pred = 1/(1+np.exp(-np.dot(X, theta)))
    # ============================================================

    return pred


def map_feature(X1, X2, degree=6):
    """Feature mapping function to polynomial features."""
    m = len(X1)
    assert len(X1) == len(X2)
    n = int((degree+2)*(degree+1)/2)

    out = np.zeros((m, n))

    idx = 0
    for i in range(degree+1):
        for j in range(i+1):
            # print i-j, j, idx
            out[:, idx] = np.power(X1, i-j)*np.power(X2, j)
            idx += 1

    return out


def cost_function_reg(theta, X, y, lmb):
    """逻辑回归的代价函数，有正则项。"""
    m = 1.0*len(y)
    J = 0
    # ====================== YOUR CODE HERE ======================
    J = (1/m)*np.sum(-np.dot(np.log(0.000001+sigmoid(np.dot(X, theta))),y)-np.dot(np.log(0.000001+1-sigmoid(np.dot(X, theta))),(1-y)))+(lmb/(2*m))*np.sum(theta*theta)
    # ============================================================

    return J


def cost_gradient_reg(theta, X, y, lmb):
    """逻辑回归的代价函数的梯度，有正则项。"""

    m = 1.0*len(y)
    grad = np.zeros_like(theta)
    # ====================== YOUR CODE HERE ======================
    h_theta = sigmoid(np.dot(X, theta))
    grad = np.dot(X.T, h_theta-y)/m+(lmb/m)*theta
    # ============================================================

    return grad


def logistic_regression():
    """针对第一组数据建立逻辑回归模型。"""

    # 加载数据
    data = np.loadtxt("Logistic_data1.txt", delimiter=",")
    X, y = data[:, :2], data[:, 2]

    # 可视化数据
    plot_data(X, y)
    plt.legend()
    plt.show()

    # 计算代价与梯度
    m, _ = X.shape
    X = np.hstack((np.ones((m, 1)), X))

    # 初始化参数
    theta_initial = np.zeros_like(X[0])

    # 测试 sigmoid 函数
    z = np.array([-10.0, -5.0, 0.0, 5.0, 10.0])
    g = sigmoid(z)
    print("Value of sigmoid at [-10, -5, 0, 5, 10] are:\n", g)

    # 计算并打印初始参数对应的代价与梯度
    cost = cost_function(theta_initial, X, y)
    grad = cost_gradient(theta_initial, X, y)
    print("Cost at initial theta (zeros): ", cost)
    print("Gradient at initial theta (zeros): \n", grad)

    # 使用 scipy.optimize.fmin_cg 优化模型参数
    args = (X, y)
    maxiter = 200
    # ====================== YOUR CODE HERE ======================
    ret = op.fmin_cg(cost_function,
                     theta_initial,
                     fprime = cost_gradient,
                     args = (X,y),
                     maxiter = 200,
                     full_output = True)
    # ============================================================
    theta_opt, cost_min, _, _, _ = ret
    print("Cost at theta found by fmin_cg: ", cost_min)
    print("theta: \n", theta_opt)

    # 绘制分类面
    plot_decision_boundary(theta_opt, X, y)
    plt.show()

    # 预测考试一得45分，考试二得85分的学生的录取概率
    x_test = np.array([1, 45, 85.0])
    prob = sigmoid(np.dot(theta_opt, x_test))
    print("For a student with scores 45 and 85, we predict")
    print("an admission probability of ", prob)

    # 计算在训练集上的分类正确率
    p = predict(theta_opt, X)
    print("Train Accuracy: ", np.mean(p == y)*100)


def logistic_regression_reg(lmb=1.0):
    """针对第二组数据建立逻辑回归模型。"""

    # 加载数据
    data = np.loadtxt("Logistic_data2.txt", delimiter=",")
    X, y = data[:, :2], data[:, 2]

    # 可视化数据
    plot_data(X, y)
    plt.legend()
    plt.show()

    # 计算具有正则项的代价与梯度

    # 注意map_feature会自动加入一列 1
    X = map_feature(X[:, 0], X[:, 1])

    # 初始化参数
    theta_initial = np.zeros_like(X[0, :])

    # 计算并打印初始参数对应的代价与梯度
    cost = cost_function_reg(theta_initial, X, y, lmb=lmb)
    grad = cost_gradient_reg(theta_initial, X, y, lmb=lmb)
    print("Cost at initial theta (zeros): ", cost)
    print("Gradient at initial theta (zeros): \n", grad)

    # 使用 scipy.optimize.fmin_cg 优化模型参数
    args = (X, y, lmb)
    maxiter = 200
    # ====================== YOUR CODE HERE ======================
    ret = op.fmin_cg(cost_function_reg,
                     theta_initial,
                     fprime = cost_gradient_reg,
                     args = (X,y,lmb),
                     maxiter = 200,
                     full_output = True)
    # ============================================================
    theta_opt, cost_min, _, _, _ = ret
    print("Cost at theta found by fmin_cg: ", cost_min)
    print("theta: \n", theta_opt)

    # 绘制分类面
    plot_decision_boundary(theta_opt, X, y)
    plt.title("lambda = " + str(lmb))
    plt.show()

    # 计算在训练集上的分类正确率
    pred = predict(theta_opt, X)
    print("Train Accuracy: ", np.mean(pred == y)*100)


if "__main__" == __name__:

    # 分别完成无正则项和有正则项的逻辑回归问题
    logistic_regression()

    # 可选：尝试不同正则化系数lmb = 0.0, 1.0, 10.0, 100.0对分类面的影响
    logistic_regression_reg(lmb=1.0)
