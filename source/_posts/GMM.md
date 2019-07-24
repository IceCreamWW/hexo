---
title: "[Model] GMM model"
catalog: true
toc_nav_num: true
date: 2019-07-22 17:05:15
subtitle: "GMM model derivation"
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

设有随机变量 $X$, 则高斯混合模型的概率密度函数为:
$$
p(x) = \sum_{m=1}^k C_m \mathcal{N}(x \mathrel | \mu_k, \Sigma_k)
$$
