---
title: "[Algorithm] EM algorithm"
catalog: true
toc_nav_num: true
date: 2019-07-16 11:08:59
subtitle: "EM algorithm derivation"
header-img: "Demo.png"
top: 10
tags:
- algorithm
- optimization
- EM
mathjax: true
catagories:
- algorithm
---

> 本文记录了EM算法的思想及其推导过程, 仍然感觉自己对EM算法的本质理解有所欠缺，以后补充

## 介绍
> The EM algorithm is used to find (local) maximum likelihood parameters of a statistical model in cases where the equations cannot be solved directly. Typically these models involve latent variables in addition to unknown parameters and known data observations. That is, either missing values exist among the data, or the model can be formulated more simply by assuming the existence of further unobserved data points.  
[https://en.wikipedia.org/wiki/Expectation-maximization_algorithm]

<!-- -->
> 对于最大似然式无法被直接优化的统计模型, EM算法的目的是找到其局部最优参数解。这样的模型通常涉及**隐变量 ($Z$)、未知参数 ($\theta$) 以及可观测的数据 ($Y$) **。EM算法可以解决两类问题:  
1. 数据缺失的问题: 在缺失部分数据的情况下建模。  
2. 模型存在隐变量: 通过进一步定义不可观测的隐变量, 可以使模型更加简单(似然式更加简单)。

## 算法推导

### 似然函数
对于一个含有隐变量 $Z$ 的模型，目的是极大化观测数据 $Y$ 关于参数 $\theta$ 的对数似然函数, 即:
$$
\mathcal{L}(\theta) =\log P(Y\mathrel|\theta) = \log \sum_Z P(Y,Z \mathrel | \theta) 
$$
---

#### 似然函数的下界
通过构造Jensen不等式，可以得到似然函数的下界函数:
$$
\begin{align}
\mathcal{L}(\theta) &= \log \sum_Z P(Y,Z \mathrel | \theta) \\
                    &= \log \sum_Z (Q(Z) \cdot \frac{P(Y,Z \mathrel | \theta)}{Q(Z)}) \\
                    &\ge \sum_Z (Q(Z) \cdot \log (\frac{P(Y,Z \mathrel | \theta)}{Q(Z)})) \\
                    &= \mathcal{H}(\theta, Q(Z))
\end{align}\label{eq:1}\tag{1} 
$$
构造Jensen不等式要求 $Q(Z)$ 满足 $\sum_Z Q(Z)=1$, 因此它可以视为 $Z$ 的某个概率分布函数.

---
### 如何优化似然函数
为了优化似然函数$\mathcal{L}(\theta)$, 需要解决两个问题:
**[1] 为什么优化 $\mathcal{H}(\theta, Q(Z))$, 等价于优化 $\mathcal{L}(\theta)$ ?**
**[2] 如何优化 $\mathcal{H}(\theta, Q(Z))$ ?** 

---

#### 为何优化下界函数
我们希望通过优化$\mathcal{H}(\theta, Q(Z))$, 来优化$\mathcal{L}(\theta)$，即:
\begin{align}
\forall \bar{\theta}, \hat{\theta}: \\
\text{ if } &  \\
& \mathcal{H}(\bar{\theta}, Q(Z)) > \mathcal{H}(\hat{\theta}, Q(Z)) \\
\text{then }&  \\
& \mathcal{L}(\bar{\theta}) > \mathcal{L}(\hat{\theta}) \label{eq:2}\tag{2}
\end{align}
而根据Jensen不等式，我们现在有：
$$
\begin{align}
\forall \bar{\theta}, \hat{\theta}: \\
\text{ if } &  \\
& \mathcal{H}(\bar{\theta}, Q(Z)) > \mathcal{H}(\hat{\theta}, Q(Z)) \\
\text{then }&  \\
& \mathcal{L}(\bar{\theta}) \ge \mathcal{H}(\bar{\theta}, Q(Z)) > \mathcal{H}(\hat{\theta}, Q(Z)) \le \mathcal{L}(\hat{\theta})
\end{align}\label{eq:3}\tag{3}
$$ 

因此要使 Eq.(\ref{eq:2}) 成立，只需 $\mathcal{H}(\hat{\theta}, Q(Z)) = \mathcal{L}(\hat{\theta})$, 即Jensen不等式 Eq.(\ref{eq:1}) 在 $\theta=\hat{\theta}$ 处取等, 根据Jensen不等式的取等条件, 有:

\begin{align}
\frac{P(Y,Z \mathrel | \hat{\theta})}{Q(Z)}             &= constant \\
\frac{P(Y,Z \mathrel | \hat{\theta})}{constant}         &= Q(Z) \label{eq:4}\tag{4} \\
\sum_Z \frac{P(Y,Z \mathrel | \hat{\theta})}{constant}  &= \sum_Z Q(Z)=1 \\
\sum_Z P(Y,Z \mathrel | \hat{\theta})                   &= constant \label{eq:5}\tag{5} \\
\end{align}
将 Eq.(\ref{eq:5}) 代入 Eq.(\ref{eq:4}), 得到 $Q(Z)$ 的表达式:
\begin{aligned}
Q(Z)    &= \frac{P(Y,Z \mathrel | \hat{\theta})}{\sum_Z P(Y,Z \mathrel | \hat{\theta})} \\
        &= P(Z \mathrel | Y, \hat{\theta})
\end{aligned}

即:
$$
\begin{align}
\text{if and only if: } & Q(Z) = P(Z \mathrel | Y, \hat{\theta}) \\
\text{then: } & L(\hat{\theta}) = H(\hat{\theta}, Q(Z))  \\
\text{otherwise: } & L(\hat{\theta}) > H(\hat{\theta}, Q(Z))
\end{align}\label{eq:6}\tag{6}
$$

---

根据 Eq.(\ref{eq:3}) 和 Eq.(\ref{eq:6}), 我们得到如下结论:

\begin{align}
\forall \bar{\theta}, \hat{\theta}: \\
\text{ if } &  \\
& \mathcal{H}(\bar{\theta}, P(Z \mathrel | Y, \hat{\theta})) > \mathcal{H}(\hat{\theta}, P(Z \mathrel | Y, \hat{\theta})) \\
\text{then }&  \\
& \mathcal{L}(\bar{\theta}) > \mathcal{H}(\bar{\theta}, P(Z \mathrel | Y, \hat{\theta})) > \mathcal{H}(\hat{\theta}, P(Z \mathrel | Y, \hat{\theta})) = \mathcal{L}(\hat{\theta})
\end{align}

> **即, 在似然函数的参数 $\theta = \hat{\theta}$ 处, 取下界函数 $H(\hat{\theta}, Q(Z))$ 的参数 $Q(Z) = P(Z \mathrel | Y, \hat{\theta})$ 时，优化下界函数 $\mathcal{H}(\hat{\theta}, Q(Z))$ 等价于优化似然函数 $\mathcal{L}(\hat{\theta})$。**

---

#### 如何优化下界函数

根据 Eq.(\ref{eq:6}):
$$
\begin{align}
& \forall \hat{\theta} \neq \bar{\theta} \\
\because & \mathcal{L(\bar{\theta})} = \mathcal{H}(\bar{\theta}, P(Z \mathrel | Y, \bar{\theta})) \\
& \mathcal{L(\bar{\theta})} > \mathcal{H}(\bar{\theta}, P(Z \mathrel | Y, \hat{\theta})) \\
\therefore & \mathcal{H}(\bar{\theta}, P(Z \mathrel | Y, \bar{\theta})) > \mathcal{H}(\bar{\theta}, P(Z \mathrel | Y, \hat{\theta}))
\end{align}\label{eq:7}\tag{7}
$$

---
又:
$$
\begin{align}
\forall \hat{\theta},  \exists \bar{\theta} &= \underset{\theta}{\mathrm{argmax}}\ \mathcal{H}(\theta, P(Z \mathrel | Y, \hat{\theta})) \\
&= \underset{\theta}{\mathrm{argmax}}\ \sum_Z (P(Z \mathrel | Y, \hat{\theta}) \cdot \log (\frac{P(Y,Z \mathrel | \theta)}{P(Z \mathrel | Y, \hat{\theta})})) \\
&= \underset{\theta}{\mathrm{argmax}}\ \sum_Z (P(Z \mathrel | Y, \hat{\theta}) \cdot \log (P(Y,Z \mathrel | \theta))) \\
&= \underset{\theta}{\mathrm{argmax}}\ E_{Z\sim P(Z \mathrel | Y, \hat{\theta})} [\log (P(Y,Z \mathrel | \theta)))] \\
s.t.\  & \mathcal{H}(\bar{\theta}, P(Z \mathrel | Y, \hat{\theta})) \ge \mathcal{H}(\hat{\theta}, P(Z \mathrel | Y, \hat{\theta}))
\end{align}\label{eq:8}\tag{8}
$$

根据 Eq.(\ref{eq:7}) 和 Eq.(\ref{eq:8}),对于初值 $\mathcal{H}(\theta_0, P(Z \mathrel | Y, \theta_0))$, 我们可以通过这样的迭代过程优化它: 
$$
\begin{align}
& \mathcal{H}(\theta_0, P(Z \mathrel | Y, \theta_0)) \le \mathcal{H}(\theta_1, P(Z \mathrel | Y, \theta_0)) \\
< &\ \mathcal{H}(\theta_1, P(Z \mathrel | Y, \theta_1)) \le \mathcal{H}(\theta_2, P(Z \mathrel | Y, \theta_1)) \\
< &\ \cdots
\end{align}\label{eq:9}\tag{9}
$$
在 $\mathcal{H}(\theta_{n+1}, P(Z \mathrel | Y, \theta_{n}))=\mathcal{H}(\theta_{n}, P(Z \mathrel | Y, \theta_{n}))$ 时收敛。

---

## 算法流程

Eq.(\ref{eq:9}) 的迭代中包含了两个优化过程: 一个是 Eq.(\ref{eq:7})，另一个是 Eq.(\ref{eq:8})。而 Eq.(\ref{eq:7}) 的过程是简单的将下界函数  $\mathcal{H}(\theta_{i+1}, P(Z \mathrel | Y, \theta_{i}))$ 替换为 $\mathcal{H}(\theta_{i+1}, P(Z \mathrel | Y, \theta_{i+1}))$ 。因此, EM算法的流程指的是 Eq.(\ref{eq:8}) 的优化 (即产生 $\theta_{i+1}$ 的过程)。

### E步

根据当前的 $\hat{\theta}$ 写出 Eq.(\ref{eq:8}) 的优化目标:
$$
J(\theta) = E_{Z\sim P(Z \mathrel | Y, \theta_i)} [\log (P(Y,Z \mathrel | \theta)))] \\
$$

在M步求导时 $P(Z \mathrel | Y, \theta_i)$ 对于各个参数的更新公式来说都是常数项, 因此在E步还要计算出**隐藏状态关于观测值和上一轮参数的后验概率** $P(Z \mathrel | Y, \theta_i)$。

### M步

对 $J(\theta)$ 关于 $\theta$ 求导等于0, 得到 $\theta_{i+1}$:
$$
\theta_{i+1} = \underset{\theta}{\mathrm{argmax}}\ J(\theta) \\
\frac{d J(\theta)}{d \theta} = 0  \Rightarrow  \theta = \theta_{i+1}
$$

---


## 相关链接

- [EM算法的应用: GMM](/article/GMM)
- [EM算法的应用: HMM](/article/HMM)
- [Jensen 不等式的证明 - 数学归纳法](./jensen_inequality.pdf)
