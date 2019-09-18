---
title: "[Book] HTK"
catalog: true
toc_nav_num: true
date: 2019-07-22 17:05:21
subtitle: "Hidden Markov Model derivation"
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

** HMM的参数: $ \lambda = (A, B, \pi) $**

|           五元组                              |                                                                                   |
|       -----------                             |                -----------                                                        |
| $S = {s_1, s_2, \dots, s_N}$                  |        隐藏状态集合                                                               | 
| $V = {v_1, v_2, \dots, v_m, \dots}$           |        观测值集合                                                                 | 
| $A = a_{11}, \dots, a_{ij}, \dots, a_{NN}$    |        转移概率矩阵, $\sum_{j=1}^N a_{ij} = 1$                                    | 
| $B = b_i(v_j)$                                |        发射概率: 隐藏状态 $s_i$ 产生观测值 $v_j$ 的概率                           | 
| $\pi = \pi_1, \pi_2, \dots, \pi_n$            |        起始概率: 隐藏状态 $s_i$成为第一个隐藏状态的概率，$\sum_{i=1}^N \pi_i = 1$ | 


|           其它符号                            |                                                                                   |
|       -----------                             |                -----------                                                        |
| $q_{t_1}^{t_2}$                               |        从时间$t_1$到$t_2$的隐藏状态序列                                           | 
| $Q = q_1q_2\dots q_T$                         |        隐藏状态序列, $q_i \in S$, $q_1^T$                                         | 
| $o_{t_1}^{t_2}$                               |        从时间$t_1$到$t_2$的观测值序列                                             | 
| $O = o_1o_2\dots o_T$                         |        观测值序列, $o_i \in V$, $o_1^T$                                           | 


---

## HMM 的基本假设

1. 马尔科夫假设
$$
P(q_i \mathrel | q_1\dots q_{i-1}) = P(q_i\mathrel | q_{i-1})
$$

2. 观测值独立性假设

$$
P(o_i \mathrel | q_1\dots q_i\dots q_T, o_1\dots o_i \dots o_T) = P(o_i \mathrel | q_i)
$$

---

## HMM - 似然 (Likelihood)

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求观测序列的似然 $P(O \mathrel | \lambda)$。  ( 以下省略 $\lambda$ ) 

### 前向算法 (Forward Algorithm)

令 $ \alpha_t(i) = P(o_1^t, q_t=S_i)$ , 则似然观测概率的似然可以表示为: 


\begin{align}
P(O)    &= \sum_{i=1}^N P(o_1^T, q_T=S_i) \\
        &= \sum_{i=1}^N \alpha_T(i)
\end{align}

#### 前向递归式
\begin{align}
\alpha_t(i) &=  P(o_1^t, q_t=S_i)\\
            &=  \sum_{j=1}^N P(o_1^t, q_{t-1}=S_j, q_t=S_i) \\
            &=  \sum_{j=1}^N P(o_1^{t-1}, q_{t-1}=S_j, q_t=S_i) \cdot P(o_t \mathrel | o_1^{t-1}, q_{t-1}=S_j, q_t=S_i) \\
            &=  \sum_{j=1}^N P(o_1^{t-1}, q_{t-1}=S_j, q_t=S_i) \cdot P(o_t \mathrel | q_t=S_i) \\
            &=  \sum_{j=1}^N P(o_1^{t-1}, q_{t-1}=S_j) \cdot P(q_t=S_i \mathrel | o_1^{t-1}, q_{t-1}=S_j) \cdot P(o_t \mathrel | q_t=S_i) \\
            &=  \sum_{j=1}^N P(o_1^{t-1}, q_{t-1}=S_j) \cdot P(q_t=S_i \mathrel | q_{t-1}=S_j) \cdot P(o_t \mathrel | q_t=S_i) \\
            &=  \sum_{j=1}^N \alpha_{t-1}(j) \cdot a_{ji} \cdot b_i(o_t)
\end{align}

其中，初值:
\begin{align}
\alpha_1(i) &= P(o_1, q_1=S_i) \\
            &= P(q_1=S_i) \cdot P(o_1 \mathrel | q_1=S_i) \\
            &= \pi_i \cdot b_i(o_1) 
\end{align}

---

## HMM - 解码 (Decoding)

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求最可能的状态序列 $Q$:
\begin{align}
Q   &= \underset{q_1^T}{\mathrm{argmax}}\ P(Q \mathrel | Q) \\
    &= \underset{q_1^T}{\mathrm{argmax}}\ \frac{P(o_1^T, q_1^T)}{P(o_1^T)} \\
    &= \underset{q_1^T}{\mathrm{argmax}}\ P(o_1^T, q_1^T) 
\end{align}

令:
$$
\delta_t(i) = \max_{q_1^{t-1}} P(o_1^t, q_1^{t-1}, q_t=S_i)
$$

则 $Q$ 的最后一个状态为:
$$
\begin{align}
q_T &= \underset{q_T}{\mathrm{argmax}}\ P(o_1^T, q_1^T) \\
    &= \underset{q_T}{\mathrm{argmax}}\ \max_{q_1^{T-1}} P(o_1^T, q_1^{T-1}, q_T) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{T-1}} P(o_1^T, q_1^{T-1}, q_T=S_i) \\
    &= \underset{i}{\mathrm{argmax}}\ \delta_T(i)
\end{align}\label{eq:viterbi-last-state}\tag{1}
$$

### Viterbi 算法

#### 递归 (Recursion)

$$
\begin{align}
\delta_t(i) &= \max_{q_1^{t-1}} P(o_1^t, q_1^{t-1}, q_t=S_i) \\
            &= \max_{q_1^{t-1}} P(o_1^{t-1}, q_1^{t-1}, q_t=S_i) \cdot P(o_t \mathrel | o_1^{t-1}, q_1^{t-1}, q_t=S_i) \\
            &= \max_{q_1^{t-1}} P(o_1^{t-1}, q_1^{t-1}) \cdot P(q_t=S_i \mathrel | o_1^{t-1}, q_1^{t-1}) \cdot P(o_t \mathrel | q_t=S_i) \\
            &= b_i(o_t) \cdot \max_{q_1^{t-1}} P(o_1^{t-1}, q_1^{t-1}) \cdot P(q_t=S_i \mathrel | q_{t-1}) \\
            &= b_i(o_t) \cdot \max_{q_1^{t-2}} \max_{j=1}^N P(o_1^{t-1}, q_1^{t-2}, q_{t-1}=S_j) \cdot P(q_t=S_i \mathrel | q_{t-1}=S_j) \\
            &= b_i(o_t) \cdot \max_{j=1}^N P(q_t=S_i \mathrel | q_{t-1}=S_j) \cdot \max_{q_1^{t-2}} P(o_1^{t-1}, q_1^{t-2}, q_{t-1}=S_j) \\
            &= b_i(o_t) \max_{j=1}^N a_{ji} \cdot \delta_{t-1}(j)
\end{align}\label{eq:viterbi-recursion}\tag{2}
$$

其中，初值:
\begin{align}
\delta_1(i) &= P(o_1, q_1=S_i) \\
            &= \pi_i \cdot b_i(o_1)  \\
            &= \alpha_1(i)
\end{align}

此时，将递归式 Eq.(\ref{eq:viterbi-recursion}) 应用到 Eq.(\ref{eq:viterbi-last-state}) 中可以得到最可能路径的最后一个状态。

#### 回溯 (Traceback)
已知最可能路径中的第 $t+1$ 个状态 $q_{t+1}^\*$, 求该路径中的第 $t$ 个状态:

\begin{align}
q_t &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}, q_{t+2}^T} P(q_1^{t-1}, q_{t+2}^T, q_{t+1}^\*, q_t=S_i, o_1^T) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}, q_{t+2}^T} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \cdot P(o_{t+1}^T, q_{t+2}^T \mathrel | q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}, q_{t+2}^T} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \cdot P(o_{t+1}^T, q_{t+2}^T \mathrel | q_{t+1}^\*) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \cdot \max_{q_{t+2}^T} P(o_{t+1}^T, q_{t+2}^T \mathrel | q_{t+1}^\*) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_t=S_i, o_1^t) \cdot P(q_{t+1}^\* \mathrel | q_1^{t-1}, q_t=S_i, o_1^t) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_t=S_i, o_1^t) \cdot P(q_{t+1}^\* \mathrel | q_t=S_i) \\
    &= \underset{i}{\mathrm{argmax}}\ \delta_t(i) \cdot a_{iq_{t+1}^*}
\end{align}

---

## HMM - 后验解码 (Posterior Decoding)

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求时间$t$处的最可能状态:

\begin{align}
q_t &= \underset{i}{\mathrm{argmax}}\ P(q_t=S_i \mathrel | O)  \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{P(q_t=S_i, o_1^T)}{P(o_1^T)}  \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{P(q_t=S_i, o_1^T)}{P(o_1^T)}  \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{P(q_t=S_i, o_1^T)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)} \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{P(q_t=S_i, o_1^t) \cdot P(o_{t+1}^T \mathrel | q_t=S_i)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)} \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{\alpha_t(i) \cdot P(o_{t+1}^T \mathrel | q_t=S_i)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)}
\end{align}

### 后向算法 (Backward Algorithm)
令:
$$
\beta_t(i) = P(o_{t+1}^T \mathrel | q_t=S_i)
$$

则 $t$ 时间处隐藏状态 $q_t$ 为 $S_i$ 的后验概率可表示为:
\begin{align}
P(q_t=S_i \mathrel |o_1^T)  &= \frac{\alpha_t(i) \cdot P(o_{t+1}^T \mathrel | q_t=S_i, o_1^t)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)}  \\
                            &= \frac{\alpha_t(i) \cdot P(o_{t+1}^T \mathrel | q_t=S_i)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)} \\
                            &= \frac{\alpha_t(i) \cdot \beta_t(i)}{\sum_{k=1}^N \alpha_t(k)\cdot \beta_t(k)} \\
\end{align}

#### 后向递归式

\begin{align}
\beta_t(i) &= P(o_{t+1}^T \mathrel | q_t=S_i) \\
           &= \sum_{j=1}^N \frac{P(o_{t+1}^T, q_t=S_i, q_{t+1}=S_j)}{P(q_t=S_i)} \\
           &= \sum_{j=1}^N \frac{P(o_{t+1}^T \mathrel |q_t=S_i, q_{t+1}=S_j) \cdot P(q_t=S_i, q_{t+1}=S_j)}{P(q_t=S_i)} \\
           &= \sum_{j=1}^N P(o_{t+1}^T \mathrel | q_{t+1}=S_j) \cdot P(q_{t+1}=S_j \mathrel | q_{t}=S_i) \\
           &= \sum_{j=1}^N P(o_{t+2}^T \mathrel | q_{t+1}=S_j) \cdot P(o_{t+1} \mathrel | o_{t+2}^T, q_{t+1}=S_j) \cdot P(q_{t+1}=S_j \mathrel | q_{t}=S_i) \\
           &= \sum_{j=1}^N P(o_{t+2}^T \mathrel | q_{t+1}=S_j) \cdot P(o_{t+1} \mathrel | q_{t+1}=S_j) \cdot P(q_{t+1}=S_j \mathrel | q_{t}=S_i) \\
           &= b_j(o_{t+1}) \cdot \sum_{j=1}^N P(o_{t+2}^T \mathrel | q_{t+1}=S_j) \cdot a_{ij} \\
           &= b_j(o_{t+1}) \cdot \sum_{j=1}^N \beta_{t+1}(j) \cdot a_{ij}
\end{align}


为了使 $\beta_{T-1}(i) = P(o_T \mathrel | q_{T-1}=S_i)$ 计算正确, 取 $\beta$ 的初值为:

$$
\beta_T(i) = 1
$$

---

## HMM - 参数训练 (Parameter Learning)

对于观测序列 $O$, 求HMM参数 $\lambda=(A, B, \pi)$ 的最大似然估计:

### 符号定义及其计算

#### $I(x)$

$$
I(x)=
\begin{cases}
0& x \neq 1\\
1& x=1
\end{cases}
$$

---

#### $\gamma_t(i)$

\begin{align}
\gamma_t(i) &= P(q_t = S_i \mathrel | O, \hat{\lambda}) \\
            &= \frac{P(q_t = S_i, O \mathrel | \hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
            &= \frac{P(q_t = S_i, o_1^t, o_{t+1}^T \mathrel | \hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
            &= \frac{P(q_t = S_i, o_1^t \mathrel | \hat{\lambda}) \cdot P(o_{t+1}^T \mathrel | o_1^t, q_t=S_i, \hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
            &= \frac{P(q_t = S_i, o_1^t \mathrel | \hat{\lambda}) \cdot P(o_{t+1}^T \mathrel | q_t=S_i, \hat{\lambda})}{\sum_{j=1}^N P(q_t=S_j, O \mathrel | \hat{\lambda})} \\
            &= \frac{\alpha_t(i)\beta_t(i)}{\sum_{j=1}^N \alpha_t(j)\beta_t(j)} \\
\end{align}

---

#### $\xi_t(i, j) $

\begin{align}
\xi_t(i,j) &= P(q_{t-1}=i, q_t=j \mathrel | O, \hat{\lambda}) \\
           &= \frac{P(q_{t-1}=i, q_t=j, O \mathrel | \hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
           &= \frac{P(q_{t-1}=i, q_t=j, o_1^{t-1}, o_t, o_{t+1}^T \mathrel | \hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
           &= \frac{P(q_{t-1}=i, o_1^{t-1} \mathrel | \hat{\lambda}) \cdot P(q_t=j, o_t, o_{t+1}^T \mathrel | q_{t-1}=i, o_1^{t-1} ,\hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
           &= \frac{\alpha_{t-1}(i) \cdot P(q_t=j \mathrel | q_{t-1}=i, o_1^{t-1}, \hat{\lambda}) \cdot P(o_t, o_{t+1}^T \mathrel | q_{t-1}=i, q_t=j, o_1^{t-1} ,\hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
           &= \frac{\alpha_{t-1}(i) \cdot P(q_t=j \mathrel | q_{t-1}=i \hat{\lambda}) \cdot P(o_t, o_{t+1}^T \mathrel | q_t=j ,\hat{\lambda})}{P(O \mathrel | \hat{\lambda})} \\
           &= \frac{\alpha_{t-1}(i) \cdot a_{ij} \cdot P(o_t \mathrel | q_t=j ,\hat{\lambda}) \cdot P(o_{t+1}^T \mathrel | q_t=j, o_t, \lambda)}{P(O \mathrel | \hat{\lambda})} \\
           &= \frac{\alpha_{t-1}(i) \cdot a_{ij} \cdot b_j(o_t) \cdot \beta_t(j)}{P(O \mathrel | \hat{\lambda})} \\
           &= \frac{\alpha_{t-1}(i) \cdot a_{ij} \cdot b_j(o_t) \cdot \beta_t(j)}{\sum_{i=1}^N \sum_{j=1}^N \alpha_{t-1}(i) \cdot a_{ij} \cdot b_j(o_t) \cdot \beta_t(j)}
\end{align}

---

### [EM 算法](/article/EM)

#### E步

EM算法的通用E步期望公式:

\begin{align}
H(\theta, P(Z\mathrel | Y, \hat{\theta})) &= E_{Z\sim P(Z\mathrel | Y, \hat{\theta})} [\log P(Y,Z \mathrel | \theta)] \\
                        &= \sum_Z P(Z\mathrel | Y, \hat{\theta}) \cdot \log P(Y,Z \mathrel | \theta)
\end{align}

代入HMM的参数, 以一个样本为例:

\begin{align}
H(\lambda, P(Q\mathrel | O, \hat{\lambda})) &= \sum_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \log P(O,Q \mathrel | \lambda) \\
                                            &= \sum_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \log (P(q_1)\cdot P(o_1 \mathrel | q_1)\prod_{t=2}^T P(q_{t} \mathrel | q_{t-1}) \cdot P(o_t \mathrel | q_t)) \\
                                            &= \sum_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \log (\pi_{q_1}\cdot b_{q_1}(o_1)\prod_{t=2}^T a_{q_{t-1}q_{t}} \cdot b_{q_t}(o_t)) \\
                                            &= (\sum_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \log (\pi_{q_1})) + (\sum_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \sum_{t=1}^T \log b_{q_t}(o_t)) + (\sum_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \sum_{t=2}^T \log a_{q_{t-1}q_{t}})
\end{align}
 
---

#### M步

##### $\pi$

$\pi$ 满足限制条件 $\sum_{i=1}^N \pi_i = 1$, 应用拉尔朗日乘数法，求导式变为:
$$
G(\theta) = J(\theta) + \Lambda(1 - \sum_{i=1}^N \pi_i)
$$

对 $\pi_i$ 求导:
\begin{align}
\frac{\partial G(\theta)}{\partial \pi_i} &= \frac{\partial [(\sum\limits_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \log (\pi_{q_1})) + \Lambda(1 - \sum_{i=1}^N \pi_i)]}{\partial \pi_i} \\
                                          &= \frac{\partial [\sum\limits_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \log (\pi_{q_1})]}{\partial \pi_i} - \Lambda \\
                                          &= \frac{\partial [\sum\limits_{q_2^T} \sum\limits_{i=1}^N P(q_2^T, q_1=S_i \mathrel | O, \hat{\lambda}) \cdot \log (\pi_i)]}{\partial \pi_i} - \Lambda \\
                                          &= \frac{\partial [\sum\limits_{i=1}^N P(q_1=S_i \mathrel | O, \hat{\lambda}) \cdot \log (\pi_i)]}{\partial \pi_i} - \Lambda \\
                                          &= \frac{\sum\limits_{i=1}^N P(q_1=S_i \mathrel | O, \hat{\lambda})}{\pi_i} - \Lambda \\
                                          &= 0
\end{align}


即:
$$
\pi_i = \frac{\sum\limits_{i=1}^N P(q_1=S_i \mathrel | O, \hat{\lambda})}{\Lambda}
$$
 
又:
\begin{align}
\because\quad & \sum_{i=1}^N \pi_i = 1 \\
\therefore\quad & \frac{\sum\limits_{i=1}^N P(q_1=S_i \mathrel | O, \hat{\lambda})}{\Lambda} = 1 \\
& \Lambda = 1
\end{align}

故 $\pi_i$的更新公式为:
\begin{align}
\pi_i &= \sum\limits_{i=1}^N P(q_1=S_i \mathrel | O, \hat{\lambda})
\end{align}

---

##### $A$

$a_{ij}$ 满足限制条件 $\sum_{j=1}^N a_{ij} = 1$, 应用拉尔朗日乘数法，求导式变为:
$$
G(\theta) = J(\theta) + \Lambda(1 - \sum_{j=1}^N a_{ij})
$$

对 $a_{ij}$ 求导:
\begin{align}
\frac{\partial G(\theta)}{\partial a_{ij}} &= \frac{\partial [(\sum\limits_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \sum\limits_{t=2}^T \log a_{q_{t-1}q_{t}}) + \Lambda(1 - \sum\limits_{j=1}^N a_{ij})]}{\partial a_{ij}} \\
                                           &= \frac{\partial  (\sum\limits_{q_1^T} P(q_1^T\mathrel | O, \hat{\lambda}) \cdot \sum\limits_{t=2}^T \log a_{q_{t-1}q_{t}})}{\partial a_{ij}}  - \Lambda \\
                                           &= \frac{\partial  (\sum\limits_{t=2}^T \sum\limits_{q_1^T} P(q_1^T\mathrel | O, \hat{\lambda}) \cdot  \log a_{q_{t-1}q_{t}})}{\partial a_{ij}}  - \Lambda \\
                                           &= \frac{\partial  (\sum\limits_{t=2}^T \sum\limits_{q_1^{t-2}, q_{t+1}^T} \sum\limits_{q_{t-1}, q_t} P(q_1^{t-2}, q_{t-1}, q_t, q_{t+1}^T \mathrel | O, \hat{\lambda}) \cdot  \log a_{q_{t-1}q_{t}})}{\partial a_{ij}}  - \Lambda \\
                                           &= \frac{\partial  (\sum\limits_{t=2}^T \sum\limits_{q_1^{t-2}, q_{t+1}^T} \sum\limits_{i=1}^N \sum\limits_{j=1}^N P(q_1^{t-2}, q_{t-1}=S_i, q_t=S_j, q_{t+1}^T \mathrel | O, \hat{\lambda}) \cdot  \log a_{ij})}{\partial a_{ij}}  - \Lambda \\
                                           &= \frac{\partial  (\sum\limits_{t=2}^T \sum\limits_{i=1}^N \sum\limits_{j=1}^N P(q_{t-1}=S_i, q_t=S_j \mathrel | O, \hat{\lambda}) \cdot  \log a_{ij})}{\partial a_{ij}}  - \Lambda \\
                                           &= \frac{\sum\limits_{t=2}^T P(q_{t-1}=S_i, q_t=S_j \mathrel | O, \hat{\lambda})}{a_{ij}}  - \Lambda \\
                                           &= 0
\end{align}


即:
$$
a_{ij} = \frac{\sum\limits_{t=2}^T P(q_{t-1}=S_i, q_t=S_j \mathrel | O, \hat{\lambda})}{\Lambda}
$$
 
又:
\begin{align}
\because\quad & \sum_{j=1}^N a_{ij} = 1 \\
\therefore\quad & \frac{\sum\limits_{t=2}^T \sum\limits_{j=1}^N P(q_{t-1}=S_i, q_t=S_j \mathrel | O, \hat{\lambda})}{\Lambda} = 1 \\
& \Lambda = \sum\limits_{t=2}^T P(q_{t-1}=S_i \mathrel | O, \hat{\lambda}) \\
\end{align}

故 $a_{ij}$的更新公式为:
\begin{align}
a_{ij} &= \frac{\sum\limits_{t=2}^T P(q_{t-1}=S_i, q_t=S_j \mathrel | O, \hat{\lambda})}{\sum\limits_{t=2}^T P(q_{t-1}=S_i \mathrel | O, \hat{\lambda})} \\
       &= \frac{\sum\limits_{t=2}^T \xi_t(i, j)}{\sum\limits_{t=2}^T \gamma_{t-1}(i)} \\
\end{align}

---

##### $B$

$b_i(v_k)$ 满足限制条件 $\sum_{k=1}^N b_i(v_k) = 1$, 应用拉尔朗日乘数法，求导式变为:
$$
G(\theta) = J(\theta) + \Lambda(1 - \sum_{k=1}^M b_i(v_k) = 1)
$$

对 $b_i(v_k)$ 求导:
\begin{align}
\frac{\partial G(\theta)}{\partial \pi_i} &= \frac{\partial (\sum\limits_Q P(Q\mathrel | O, \hat{\lambda}) \cdot \sum\limits_{t=1}^T \log b_{q_t}(o_t)) + \Lambda(1 - \sum\limits_{k=1}^M b_i(v_k) = 1)}{\partial b_i(v_k)} \\
                                          &= \frac{\partial (\sum\limits_{q_1^T} P(q_1^T\mathrel | O, \hat{\lambda}) \cdot \sum\limits_{t=1}^T \log b_{q_t}(o_t))}{\partial b_i(v_k)} - \Lambda\\
                                          &= \frac{\partial (\sum\limits_{t=1}^T \sum\limits_{q_1^T} P(q_1^T \mathrel | O, \hat{\lambda}) \cdot \log b_{q_t}(o_t))}{\partial b_i(v_k)} - \Lambda\\
                                          &= \frac{\partial (\sum\limits_{t=1}^T \sum\limits_{q_1^{t-1}, q_{t+1}^T} \sum\limits_{i=1}^N P(q_1^{t-1}, q_t=S_i, q_{t+1}^T \mathrel | O, \hat{\lambda}) \cdot \log b_i(o_t))}{\partial b_i(v_k)} - \Lambda\\
                                          &= \frac{\partial (\sum\limits_{t=1}^T \sum\limits_{i=1}^N P(q_t=S_i \mathrel | O, \hat{\lambda}) \cdot \log b_i(o_t))}{\partial b_i(v_k)} - \Lambda\\
                                          &= \frac{\sum\limits_{t=1}^T P(q_t=S_i \mathrel | O, \hat{\lambda}) \cdot I(o_t=v_k)}{b_i(v_k)} - \Lambda\\
                                          &= 0
\end{align}


即:
$$
b_i(v_k) = \frac{\sum\limits_{t=1}^T P(q_t=S_i \mathrel | O, \hat{\lambda}) \cdot I(o_t=v_k)}{\Lambda}
$$
 
又:
\begin{align}
\because\quad & \sum_{k=1}^M b_i(v_k) = 1 \\
\therefore\quad & \frac{\sum\limits_{t=1}^T \sum\limits_{k=1}^M P(q_t=S_i \mathrel | O, \hat{\lambda}) \cdot I(o_t=v_k)}{\Lambda} = 1 \\
& \Lambda = \sum\limits_{t=1}^T P(q_t=S_i \mathrel | O, \hat{\lambda})
\end{align}

故 $\pi_i$的更新公式为:
\begin{align}
b_i(v_k) &= \frac{\sum\limits_{t=1}^T P(q_t=S_i \mathrel | O, \hat{\lambda}) \cdot I(o_t=v_k)}{\sum\limits_{t=1}^T P(q_t=S_i \mathrel | O, \hat{\lambda})} \\
         &= \frac{\sum\limits_{t=1}^T \gamma_t(i) \cdot I(o_t=v_k)}{\sum\limits_{t=1}^T \gamma_t(i)} \\
\end{align}

---

#### 参数更新汇总

$$
\pi_i = \sum\limits_{i=1}^N P(q_1=S_i \mathrel | O, \hat{\lambda})
$$

$$
a_{ij} = \frac{\sum\limits_{t=2}^T \xi_t(i, j)}{\sum\limits_{t=2}^T \gamma_{t-1}(i)} 
$$

$$
b_i(v_k) = \frac{\sum\limits_{t=1}^T \gamma_t(i) \cdot I(o_t=v_k)}{\sum\limits_{t=1}^T \gamma_t(i)}
$$


---

## 相关链接

- [HMM实际应用: 概率对数缩放](./HMM-rescale.pdf)
