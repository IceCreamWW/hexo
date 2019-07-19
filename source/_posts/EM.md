---
title: "[EM] EM Algorithm"
catalog: true
toc\_nav\_num: true
date: 2019-07-16 11:08:59
subtitle: "EM algorithm derivation"
header-img: "Demo.png"
top: 0
tags:
- algorithm
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
其中 $Q(Z)$ 是 $Z$ 的某个概率分布函数

---
### 如何优化似然函数
为了优化似然函数$\mathcal{L}(\theta)$, 需要解决两个问题:
**[1] 为什么优化 $\mathcal{H}(\theta, Q(Z))$, 等同于优化 $\mathcal{L}(\theta)$ ?**
**[2] 如何优化 $\mathcal{H}(\theta, Q(Z))$ ?** 

---

#### 使 [优化下界函数] 等同于 [优化似然函数]
我们希望通过优化$\mathcal{H}(\theta, Q(Z))$, 来优化$\mathcal{L}(\theta)$，即我们希望给定$\theta$的一个取值$\hat{\theta}$, 有:
\begin{align}
\forall \bar{\theta},\text{ if }&  \\
& \mathcal{H}(\bar{\theta}, Q(Z)) > \mathcal{H}(\hat{\theta}, Q(Z)) \\
\text{then }&  \\
& \mathcal{L}(\bar{\theta}) > \mathcal{L}(\hat{\theta}) \label{eq:2}\tag{2}
\end{align}
根据Jensen不等式，我们现在有：
\begin{align}
\forall \bar{\theta},\text{ if }&  \\
& \mathcal{H}(\bar{\theta}, Q(Z)) > \mathcal{H}(\hat{\theta}, Q(Z)) \\
\text{then }&  \\
& \mathcal{L}(\bar{\theta}) \ge \mathcal{H}(\bar{\theta}, Q(Z)) > \mathcal{H}(\hat{\theta}, Q(Z)) \le \mathcal{L}(\hat{\theta})
\end{align}

因此要使 Eq.(\ref{eq:2}) 成立，只需:
$$
\mathcal{H}(\hat{\theta}, Q(Z)) = \mathcal{L}(\hat{\theta}) \label{eq:3}\tag{3}
$$

我们希望 Eq.(\ref{eq:3}) 成立，根据Jensen函数的取等条件，有:
\begin{align}
\frac{P(Y,Z \mathrel | \hat{\theta})}{Q(Z)}             &= constant \\
\frac{P(Y,Z \mathrel | \hat{\theta})}{constant}         &= Q(Z) \label{eq:4}\tag{4} \\
\sum_Z \frac{P(Y,Z \mathrel | \hat{\theta})}{constant}  &= \sum_Z Q(Z)=1 \\
\sum_Z P(Y,Z \mathrel | \hat{\theta})                   &= constant \label{eq:5}\tag{5} \\
\end{align}
将 Eq.(\ref{eq:5}) 代入 Eq.(\ref{eq:4}):
\begin{aligned}
Q(Z)    &= \frac{P(Y,Z \mathrel | \hat{\theta})}{\sum_Z P(Y,Z \mathrel | \hat{\theta})} \\
        &= P(Z \mathrel | Y, \hat{\theta})
\end{aligned}
即 $Q(Z) = P(Z \mathrel | Y, \hat{\theta})$时， Eq.(\ref{eq:3}) 成立，即 $\mathcal{H}(\hat{\theta}, P(Z \mathrel | Y, \hat{\theta})) = \mathcal{L}(\hat{\theta})$ ，优化 $\mathcal{H}(\theta, Q(Z))$ 等同于优化 $\mathcal{L}(\theta)$。

---

#### 优化下界函数

根据上一节我们知道，$Q(Z)$ 是 $Z$ 的某个分布，是关于 $\theta$ 的函数。因此，$\mathcal{H}(\theta, Q(Z))$ 可以写成 $\mathcal{H}(\theta^1, \theta^2)$。其中 $\theta^1, \theta^2$ 的定义域均为模型参数 $\theta$ 的取值范围。

根据上一节的结论（也可以在 Eq.(\ref{eq:1}) 中验证）:
$$
\mathcal{L(\bar{\theta})} = \mathcal{H}(\bar{\theta}, \bar{\theta}) \label{eq:6}\tag{6}
$$
由于不满足Jensen不等式的取等条件[mark]， $\forall \bar{\theta} \neq \hat{\theta}$, 有:
$$
\mathcal{L(\bar{\theta})} > \mathcal{H}(\bar{\theta}, \hat{\theta}) \label{eq:7}\tag{7}
$$

根据 Eq.(\ref{eq:6}) 和 Eq.(\ref{eq:7}), 得到, $\forall \bar{\theta} \neq \hat{\theta}$, 有:
$$
\mathcal{H}(\bar{\theta}, \bar{\theta}) > \mathcal{H}(\bar{\theta}, \hat{\theta}) \label{eq:8}\tag{8}
$$

因此，我们可以通过这样的迭代过程优化 $H(\theta^1, \theta^2)$，对于初值 $H(\theta_0, \theta_0)$:
$$
H(\theta_0, \theta_0) < H(\theta_1, \theta_0) < H(\theta_1, \theta_1) < H(\theta_2, \theta_1) < \cdots
$$
在 $\theta_{n}=\theta_{n-1}$ 时收敛。
