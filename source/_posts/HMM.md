---
title: "[Model] HMM model"
catalog: true
toc_nav_num: true
date: 2019-07-22 17:05:21
subtitle: "HMM model derivation"
header-img: "Demo.png"
top: 0
tags:
- model
- optimization
- EM
mathjax: true
catagories:
- model
---

> 本文记录了HMM模型的基本理论及其EM算法的优化

## HMM 的组成


### 描述HMM的五元组
|           符号                                |                意义                                                               |
|       -----------                             |                -----------                                                        |
| $S = {s_1, s_2, \dots, s_N}$                 |        隐藏状态集合                                                               | 
| $V = {v_1, v_2, \dots, v_m, \dots}$         |        观测值集合                                                                 | 
| $A = a_{11}, \dots, a_{ij}, \dots, a_{NN}$  |        转移概率矩阵, $\sum_{j=1}^N a_{ij} = 1$                                    | 
| $B = b_i(v_j)$                                |        发射概率: 隐藏状态 $s_i$ 产生观测值 $v_j$ 的概率                           | 
| $\pi = \pi_1, \pi_2, \dots, \pi_n$           |        起始概率: 隐藏状态 $s_i$成为第一个隐藏状态的概率，$\sum_{i=1}^N \pi_i = 1$ | 

### HMM的参数

$$
\lambda = (A, B, \pi)
$$

### 其它符号定义

|           符号                                |                意义                                                               |
|       -----------                             |                -----------                                                        |
| $q_{t_1}^{t_2}$                               |        从时间$t_1$到$t_2$的隐藏状态序列                                           | 
| $Q = q_1q_2\dots q_T$                        |        隐藏状态序列, $q_i \in S$, $q_1^T$                                         | 
| $o_{t_1}^{t_2}$                               |        从时间$t_1$到$t_2$的观测值序列                                             | 
| $O = o_1o_2\dots o_T$                        |        观测值序列, $o_i \in V$, $o_1^T$                                           | 

---

## HMM 的基本假设

### 马尔科夫假设

$$
P(q_i \mathrel | q_1\dots q_{i-1}) = P(q_i\mathrel | q_{i-1})
$$

### 观测值独立性假设

$$
P(o_i \mathrel | q_1\dots q_i\dots q_T, o_1\dots o_i \dots o_T) = P(o_i \mathrel | q_i)
$$

---

## HMM要解决的问题

### 似然

#### 问题定义

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求观测序列的似然 $P(O \mathrel | \lambda)$。  ( 以下省略 $\lambda$ ) 

#### 前向算法

$$
P(O) = \sum_{i=1}^N P(o_i^T, q_T=S_i) 
$$

this is a test

\begin{align}
\alpha_t(i) &=  P(o_1^t, q_t=S_i)\\
            &=  \sum_{j=1}^N P(o_1^t, q_{t-1}=S_j, q_t=S_i)\\
            &=  \sum_{j=1}^N P(o_1^{t-1}, q_{t-1}=S_j, q_t=S_i) \cdot
\end{align}

---


### 解码

#### 问题定义

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求观测序列的似然 $P(O\mathrel | \lambda)$ 

#### 解决方案

test

### 训练

#### 问题定义

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求观测序列的似然 $P(O\mathrel | \lambda)$ 

#### 解决方案

test
