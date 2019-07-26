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

### HMM 的组成

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

### HMM 的基本假设

1. 马尔科夫假设
$$
P(q_i \mathrel | q_1\dots q_{i-1}) = P(q_i\mathrel | q_{i-1})
$$

2. 观测值独立性假设

$$
P(o_i \mathrel | q_1\dots q_i\dots q_T, o_1\dots o_i \dots o_T) = P(o_i \mathrel | q_i)
$$

---

### HMM - 似然 (Likelihood)

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求观测序列的似然 $P(O \mathrel | \lambda)$。  ( 以下省略 $\lambda$ ) 

#### 前向算法 (Forward Algoithm)

令 $ \alpha_t(i) = P(o_1^t, q_t=S_i)$ , 则似然观测概率的似然可以表示为: 


\begin{align}
P(O)    &= \sum_{i=1}^N P(o_i^T, q_T=S_i) \\
        &= \sum_{i=1}^N \alpha_T(i)
\end{align}

##### 前向递归式
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

### HMM - 解码 (Decoding)

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求最可能的状态序列 $Q$:
\begin{align}
Q   &= \underset{q_1^T}{\mathrm{argmax}}\ P(Q \mathrel | Q) \\
    &= \underset{q_1^T}{\mathrm{argmax}}\ \frac{P(q_1^T, o_1^T)}{P(o_1^T)} \\
    &= \underset{q_1^T}{\mathrm{argmax}}\ P(q_1^T, o_1^T) 
\end{align}

令:
$$
\delta_i(t) = \max_{q_1^{t-1}} P(o_1^t, q_1^{t-1}, q_t=S_i)
$$

则 $Q$ 的最后一个状态为:
$$
\begin{align}
q_T &= \underset{q_1^{T-1}}{\mathrm{argmax}}\ \max_{i=1}^N P(q_1^{T-1}, o_1^T, q_T=S_i) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{T-1}} P(q_1^{T-1}, o_1^T, q_T=S_i) \\
    &= \underset{i}{\mathrm{argmax}}\ \delta_i(T)
\end{align}\label{eq:viterbi-last-state}\tag{1}
$$

#### Viterbi 算法

##### 递归 (Recursion)

$$
\begin{align}
\delta_i(t) &= \max_{q_1^{t-1}} P(o_1^t, q_1^{t-1}, q_t=S_i) \\
            &= \max_{q_1^{t-1}} P(o_1^{t-1}, q_1^{t-1}, q_t=S_i) \cdot P(o_t \mathrel | o_1^{t-1}, q_1^{t-1}, q_t=S_i) \\
            &= \max_{q_1^{t-1}} P(o_1^{t-1}, q_1^{t-1}) \cdot P(q_t=S_i \mathrel | o_1^{t-1}, q_1^{t-1}) \cdot P(o_t \mathrel | q_t=S_i) \\
            &= b_i(o_t) \cdot \max_{q_1^{t-1}} P(o_1^{t-1}, q_1^{t-1}) \cdot P(q_t=S_i \mathrel | q_{t-1}) \\
            &= b_i(o_t) \cdot \max_{q_1^{t-2}} \max_{j=1}^N P(o_1^{t-1}, q_1^{t-2}, q_{t-1}=S_j) \cdot P(q_t=S_i \mathrel | q_{t-1}=S_j) \\
            &= b_i(o_t) \cdot \max_{j=1}^N P(q_t=S_i \mathrel | q_{t-1}=S_j) \cdot \max_{q_1^{t-2}} P(o_1^{t-1}, q_1^{t-2}, q_{t-1}=S_j) \\
            &= b_i(o_t) \max_{j=1}^N a_{ji} \cdot \delta_j(t-1)
\end{align}\label{eq:viterbi-recursion}\tag{2}
$$

其中，初值:
\begin{align}
\delta_i(1) &= P(o_1, q_1=S_i) \\
            &= \pi_i \cdot b_i(o_1)  \\
            &= \alpha_1(i)
\end{align}

此时，将递归式 Eq.(\ref{eq:viterbi-recursion}) 应用到 Eq.(\ref{eq:viterbi-last-state}) 中可以得到最可能路径的最后一个状态。

##### 回溯 (Traceback)
已知最可能路径中的第 $t+1$ 个状态 $q_{t+1}^\*$, 求该路径中的第 $t$ 个状态:

\begin{align}
q_t &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}, q_{t+2}^T} P(q_1^{t-1}, q_{t+2}^T, q_{t+1}^\*, q_t=S_i, o_1^T) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}, q_{t+2}^T} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \cdot P(o_{t+1}^T, q_{t+2}^T \mathrel | q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}, q_{t+2}^T} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \cdot P(o_{t+1}^T, q_{t+2}^T \mathrel | q_{t+1}^\*) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \cdot \max_{q_{t+2}^T} P(o_{t+1}^T, q_{t+2}^T \mathrel | q_{t+1}^\*) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_{t+1}^\*, q_t=S_i, o_1^t) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_t=S_i, o_1^t) \cdot P(q_{t+1}^\* \mathrel | q_1^{t-1}, q_t=S_i, o_1^t) \\
    &= \underset{i}{\mathrm{argmax}}\ \max_{q_1^{t-1}} P(q_1^{t-1}, q_t=S_i, o_1^t) \cdot P(q_{t+1}^\* \mathrel | q_{t-1}) \\
    &= \underset{i}{\mathrm{argmax}}\ \delta_i(t) \cdot a_{iq_{t+1}^*}
\end{align}

---

### HMM - 后验解码 (Posterior Decoding)

对于HMM $\lambda = (A, B, \pi)$ 和观测序列 $O$, 求时间$t$处的最可能状态:

\begin{align}
q_t &= \underset{i}{\mathrm{argmax}}\ P(q_t=S_i \mathrel | O)  \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{P(q_t=S_i, o_1^T)}{P(o_1^T)}  \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{P(q_t=S_i, o_1^T)}{P(o_1^T)}  \\
    &= \underset{i}{\mathrm{argmax}}\ \frac{P(q_t=S_i, o_1^T)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)} 
\end{align}

令:
$$
\beta_i(t) = P(o_{t+1}^T \mathrel | q_t=S_i)
$$

则 $t$ 时间处隐藏状态 $q_t$ 为 $S_i$ 的后验概率可表示为:
\begin{align}
P(q_t=S_i \mathrel |o_1^T)  &= \frac{P(q_t=S_i, o_1^T)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)} \\
                            &= \frac{P(q_t=S_i, o_1^t) \cdot P(o_{t+1}^T \mathrel | q_t=S_i, o_1^t)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)}  \\
                            &= \frac{P(q_t=S_i, o_1^t) \cdot P(o_{t+1}^T \mathrel | q_t=S_i)}{\sum_{k=1}^N P(q_t=S_k, o_1^T)} \\
                            &= \frac{\alpha_i(t)\cdot \beta_i(t)}{\sum_{k=1}^N \alpha_i(k)\cdot \beta_i(k)} \\
\end{align}

#### 后向递归式

\begin{align}
\beta_i(t) &= P(o_{t+1}^T \mathrel | q_t=S_i) \\
           &= \sum_{j=1}^N \frac{P(o_{t+1}^T, q_t=S_i, q_{t+1}=S_j)}{P(q_t=S_i)} \\
           &= \sum_{j=1}^N \frac{P(o_{t+1}^T \mathrel |q_t=S_i, q_{t+1}=S_j) \cdot P(q_t=S_i, q_{t+1}=S_j)}{P(q_t=S_i)} \\
           &= \sum_{j=1}^N P(o_{t+1}^T \mathrel | q_{t+1}=S_j) \cdot P(q_{t+1}=S_j \mathrel | q_{t}=S_i) \\
           &= \sum_{j=1}^N P(o_{t+2}^T \mathrel | q_{t+1}=S_j) \cdot P(o_{t+1} \mathrel | o_{t+2}^T, q_{t+1}=S_j) \cdot P(q_{t+1}=S_j \mathrel | q_{t}=S_i) \\
           &= \sum_{j=1}^N P(o_{t+2}^T \mathrel | q_{t+1}=S_j) \cdot P(o_{t+1} \mathrel | q_{t+1}=S_j) \cdot P(q_{t+1}=S_j \mathrel | q_{t}=S_i) \\
           &= b_j(o_{t+1}) \cdot \sum_{j=1}^N P(o_{t+2}^T \mathrel | q_{t+1}=S_j) \cdot a_{ij} \\
\end{align}


---

### HMM - 参数训练 (Parameter Learning)

对于观测序列 $O$, 求HMM参数 $\lambda=(A, B, \pi)$ 的最大似然估计:

#### EM 算法

##### E步

EM算法的通用E步期望公式:

\begin{align}
H(\theta, P(Z\mathrel | Y, \hat{\theta})) &= E_{Z\sim P(Z\mathrel | Y, \hat{\theta})} [\log P(Y,Z \mathrel | \theta)] \\
                        &= \sum_Z P(Z\mathrel | Y, \hat{\theta}) \cdot \log P(Y,Z \mathrel | \theta)
\end{align}

代入HMM的参数:

\begin{align}
H(\lambda, P(O\mathrel | Q, \hat{\lambda})) &= \sum_Q P(O\mathrel | Q, \hat{\lambda}) \cdot \log P(O,Q \mathrel | \lambda) \\
                                            &= \sum_Q P(O\mathrel | Q, \hat{\lambda}) \cdot \log (P(q_1)\cdot P(o_1 \mathrel | q_1)\prod_{t=2}^T P(q_{t-1} \mathrel | q_t) \cdot P(o_1 \mathrel | q_1)) \\
                                            &= \sum_Q P(O\mathrel | Q, \hat{\lambda}) \cdot \log (\pi_{q_1}\cdot b_{q_1}(o_1)\prod_{t=2}^T a_{q_{t-1}q_{t}} \cdot b_{q_t}(o_t)) \\
                                            &= (\sum_Q P(O\mathrel | Q, \hat{\lambda}) \cdot \log (\pi_{q_1})) + (\sum_Q P(O\mathrel | Q, \hat{\lambda}) \cdot \sum_{t=1}^T \log b_{q_t}(o_t)) + (\sum_Q P(O\mathrel | Q, \hat{\lambda}) \cdot \sum_{t=2}^T \log a_{q_{t-1}q_{t}})
\end{align}
 
##### M步



