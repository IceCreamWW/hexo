---
title: "[Model] GMM"
catalog: true
toc_nav_num: true
date: 2019-07-22 17:05:15
subtitle: "GMM derivation"
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

> 本文记录了GMM模型的基本理论及其EM算法的优化


## 概率密度函数

设有随机变量 $X$, 则 $D$ 维 $m$ 个高斯的高斯混合模型的概率密度函数为:
\begin{align}
P(x \mathrel | \theta) &= \sum_{k=1}^m \alpha_k \mathcal{N}(x \mathrel | \mu_k, \Sigma_k) \\
     &= \sum_{k=1}^m \alpha_k \cdot [(2\pi)^{-\frac{D}{2}} \lvert \Sigma_k \rvert^{-\frac{1}{2}} \cdot exp(-\frac{1}{2} (x-\mu_k)^T \Sigma_k^{-1} (x-\mu_k))] \\
\end{align}

**高斯混合模型的参数为 $\theta=(\alpha, \mu, \Sigma)$ 。**

---

## [EM算法](/article/EM)

### E步
通用E步期望公式:

\begin{align}
H(\theta, P(Z\mathrel | Y, \hat{\theta})) &= E_{Z\sim P(Z\mathrel | Y, \hat{\theta})} [\log P(Y,Z \mathrel | \theta)] \\
                        &= \sum_Z P(Z\mathrel | Y, \hat{\theta}) \cdot \log P(Y,Z \mathrel | \theta)
\end{align}


代入GMM的参数, 样本个数为 $N$:

\begin{align}
\sum_{i=1}^N H(\theta, P(k\mathrel | x, \hat{\theta})) &= \sum_{i=1}^N \sum_{k=1}^m P(k\mathrel | x^{(i)}, \hat{\theta}) \cdot \log P({x^{(i)}},k \mathrel | \theta)
\end{align}

令 $\gamma_i(k) = P(k\mathrel | x^{(i)}, \hat{\theta})$, 则:
\begin{align}
\gamma_i(k) &= \frac{P(k, x^{(i)} \mathrel | \hat{\theta})}{P(x^{(i)} \mathrel | \hat{\theta})} \\
            &= \frac{P(k \mathrel | \hat{\theta}) \cdot P(x^{(i)} \mathrel | k,\hat{\theta})}{\sum_{j=1}^m P(j \mathrel | \hat{\theta}) \cdot P(x^{(i)} \mathrel | j,\hat{\theta})} \\
\end{align}

---

### M步

\begin{align}
J(\theta) &= \sum_{i=1}^N \sum_{k=1}^m P(k\mathrel | x^{(i)}, \hat{\theta}) \cdot \log P({x^{(i)}},k \mathrel | \theta) \\
          &= \sum_{i=1}^N \sum_{k=1}^m P(k\mathrel | x^{(i)}, \hat{\theta}) \cdot \log [P({x^{(i)}} \mathrel |k, \theta) \cdot P(k \mathrel | \theta)]\\
          &= \sum_{i=1}^N \sum_{k=1}^m \gamma_i(k) \cdot \log [(2\pi)^{-\frac{D}{2}} \lvert \Sigma_k \rvert^{-\frac{1}{2}} \cdot exp(-\frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k)) \cdot \alpha_k] \\
          &= \sum_{i=1}^N \sum_{k=1}^m \gamma_i(k) \cdot [-\frac{D}{2} \log (2\pi) -\frac{1}{2} \log \lvert \Sigma_k \rvert -\frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k) + \log \alpha_k]\\
\end{align}

---

#### $\alpha$ 

$\alpha$ 满足限制条件 $\sum_{k=1}^m \alpha_k = 1$, 因此应用拉尔朗日乘数法，求导式变为:
$$
G(\theta) = J(\theta) + \lambda(1 - \sum_{k=1}^m \alpha_k)
$$

对 $\alpha_k$ 求导:
\begin{align}
\frac{\partial G(\theta)}{\partial \alpha_k} &= \frac{\partial \sum_{i=1}^N \sum_{k=1}^m \gamma_i(k) \cdot (-\frac{D}{2} \log (2\pi) -\frac{1}{2} \log \lvert \Sigma_k \rvert -\frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k) + \log \alpha_k) + \lambda(1 - \sum_{k=1}^m \alpha_k)}{\partial \alpha_k} \\
                                             &= \frac{\partial\sum_{i=1}^N \gamma_i(k) \cdot \log \alpha_k - \lambda \alpha_k}{\partial \alpha_k} \\
                                             &= \sum_{i=1}^N \frac{\gamma_i(k)}{\alpha_k} - \lambda \\
                                             &= 0
\end{align}

即:
$$
\alpha_k = \frac{\sum_{i=1}^N \gamma_i(k)}{\lambda}
$$
 
又:
\begin{align}
\because\quad & \sum_{k=1}^m \alpha_k = 1 \\
\therefore\quad & \frac{\sum_{i=1}^N \sum_{k=1}^m \gamma_i(k)}{\lambda} = 1 \\
& \frac{\sum_{i=1}^N 1}{\lambda} = 1 \\
& \lambda = N
\end{align}

故 $\alpha_k$的更新公式为:
$$
\alpha_k = \frac{\sum_{i=1}^N \gamma_i(k)}{N}
$$

---

#### $\mu$

[参考矩阵求导规则:](https://en.wikipedia.org/wiki/Matrix_calculus#Scalar-by-matrix_identities)
$$
\frac{\partial tr(X^TAX)}{\partial X} = X^T(A^T + A)
$$

对 $\mu_k$ 求导:
\begin{align}
\frac{\partial J(\theta)}{\partial \mu_k} &= \frac{\partial \sum_{i=1}^N \sum_{k=1}^m \gamma_i(k) \cdot (-\frac{D}{2} \log (2\pi) -\frac{1}{2} \log \lvert \Sigma_k \rvert -\frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k) + \log \alpha_k)}{\partial \mu_k} \\
                                          &= \frac{\partial \sum_{i=1}^N \gamma_i(k) \cdot (-\frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k))}{\partial \mu_k} \\
                                          &= \frac{\partial \sum_{i=1}^N \gamma_i(k) \cdot (-\frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k))}{\partial (x^{(i)} - \mu_k)} \cdot \frac{\partial (x^{(i)} - \mu_k)}{\partial \mu_k}\\
                                          &= \frac{1}{2} \sum_{i=1}^N \gamma_i(k) \frac{\partial (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k)}{\partial (x^{(i)} - \mu_k)}\\
                                          &= \frac{1}{2} \sum_{i=1}^N \gamma_i(k) \frac{\partial tr[(x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k)]}{\partial (x^{(i)} - \mu_k)}\\
                                          &= \frac{1}{2} \sum_{i=1}^N \gamma_i(k) \cdot (x^{(i)} - \mu_k) \cdot (\Sigma_k^{-1} + (\Sigma_k^{-1})^T) \\
                                          &= \sum_{i=1}^N \gamma_i(k) \cdot (x^{(i)} - \mu_k) \cdot \Sigma_k^{-1} \\
                                          &= 0
\end{align}

即:
\begin{align}
\sum_{i=1}^N \gamma_i(k) \cdot (x^{(i)} - \mu_k) \cdot \Sigma_k^{-1} &= 0\\
\sum_{i=1}^N \gamma_i(k) \cdot (x^{(i)} - \mu_k)                     &= 0\\
\sum_{i=1}^N \gamma_i(k) \cdot x^{(i)}                               &= \sum_{i=1}^N \gamma_i(k) \cdot \mu_k \\
\end{align}

故 $\mu_k$ 的更新公式为:
$$
\mu_k = \frac{\sum_{i=1}^N \gamma_i(k) \cdot x^{(i)}}{\sum_{i=1}^N \gamma_i(k)}
$$

---

#### $\Sigma$

[参考矩阵求导规则:](/pdfs/matrix-cookbook.pdf)
$$
\frac{\partial \log \lvert A \rvert}{\partial A} = (A^{-1})^T \\
\frac{\partial tr(A^{-1}B)}{\partial A} = -(A^{-1})^TB(A^{-1})^T \\
tr(AB) = tr(BA)
$$

对 $\Sigma_k$ 求导:
\begin{align}
\frac{\partial J(\theta)}{\partial \Sigma_k} &= \frac{\partial \sum_{i=1}^N \sum_{k=1}^m \gamma_i(k) \cdot (-\frac{D}{2} \log (2\pi) -\frac{1}{2} \log \lvert \Sigma_k \rvert -\frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k) + \log \alpha_k)}{\partial \Sigma_k} \\
                                          &= \frac{\partial \sum_{i=1}^N \gamma_i(k) \cdot (-\frac{1}{2} \log \lvert \Sigma_k \rvert - \frac{1}{2} (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k))}{\partial \Sigma_k} \\
                                          &= -\frac{1}{2} \sum_{i=1}^N \gamma_i(k) \frac{\partial (x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k)}{\partial \Sigma_k} - \frac{1}{2} \frac{\log \lvert \Sigma_k \rvert}{\partial \Sigma_k}\\
                                          &= -\frac{1}{2} \sum_{i=1}^N \gamma_i(k) \frac{\partial tr[(x^{(i)}-\mu_k)^T \Sigma_k^{-1} (x^{(i)}-\mu_k)]}{\partial \Sigma_k} - \frac{1}{2} (\Sigma_k^{-1})^T \\
                                          &= -\frac{1}{2} \sum_{i=1}^N \gamma_i(k) \frac{\partial tr[\Sigma_k^{-1} (x^{(i)}-\mu_k) (x^{(i)}-\mu_k)^T ]}{\partial \Sigma_k} - \frac{1}{2} \Sigma_k^{-1} \\
                                          &= \frac{1}{2} \sum_{i=1}^N \gamma_i(k) \cdot [(\Sigma_k^{-1})^T(x^{(i)}-\mu_k) (x^{(i)}-\mu_k)^T(\Sigma_k^{-1})^T] - \frac{1}{2}\Sigma_k^{-1} \\
                                          &= \frac{1}{2} \sum_{i=1}^N \gamma_i(k) \cdot [\Sigma_k^{-1}(x^{(i)}-\mu_k) (x^{(i)}-\mu_k)^T\Sigma_k^{-1} - \frac{1}{2}\Sigma_k^{-1}] \\
                                          &= 0
\end{align}

即:
\begin{align}
\sum_{i=1}^N \gamma_i(k) \cdot [\Sigma_k^{-1}(x^{(i)}-\mu_k) (x^{(i)}-\mu_k)^T\Sigma_k^{-1}] &= \gamma_i(k) \cdot \sum_{i=1}^N \Sigma_k^{-1} \\
\sum_{i=1}^N \gamma_i(k) \cdot [(x^{(i)}-\mu_k) (x^{(i)}-\mu_k)^T] &= \sum_{i=1}^N \gamma_i(k) \cdot \Sigma_k \\
\sum_{i=1}^N \gamma_i(k) \cdot [(x^{(i)}-\mu_k) (x^{(i)}-\mu_k)^T] &= \sum_{i=1}^N \gamma_i(k) \cdot \Sigma_k \\
\end{align}

故 $\Sigma_k$ 的更新公式为:
$$
\Sigma_k = \frac{\sum_{i=1}^N \gamma_i(k) \cdot [(x^{(i)}-\mu_k) (x^{(i)}-\mu_k)^T]}{\sum_{i=1}^N \gamma_i(k)} \\
$$

---

## 参考资料

1. [Matrix Cookbook](/pdfs/matrix-cookbook.pdf)
