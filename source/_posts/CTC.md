---
title: "[Loss] CTC"
catalog: true
toc_nav_num: true
date: 2019-08-05 10:36:17
subtitle: "Connectionest Temporal Classification introduction, illustration and derivation"
header-img: "Demo.png"
top: 0 
tags:
- seq2seq
- loss function
- deep learning
mathjax: true
categories:
- deeplearning

---

> CTC是一种用来训练seq2seq网络的损失函数，它不需要数据和标注的对齐，可用于训练语音识别端到端系统。
> 这是一篇对CTC公式的详细推导，事实上，CTC的直观理解远没有这么复杂。



### 定义

- 样本标注字符集: $L \in \mathbb{R}^n$
- 网络输出字符集: $L^{\prime} = L \cup \{blank\}$
- 路径: $\pi \in (L^{\prime})^T$; 
    - e.g. $(-a a- -a b b -)$, $(a-a b-) $
- 路径到标注的转换规则 $\mathcal{B}$: $(L^{\prime})^{T} \mapsto L^{\leq T}$
    - e.g. $\mathcal{B}(a-a b-)=\mathcal{B}(-a a- -a b b)=aab$

---

### 训练

- 训练集 $S = D_{\mathcal{X} \times \mathcal{Z}}$, $\mathcal{X} = (\mathbb{R}^m)^\*$, $\mathcal{Z} = L^\*$; 对于 $S$ 中的每一个样本 $(\mathbf{x}, \mathbf{z})$:  
    - $\mathbf{x} = (x_1, x_2, \dots, x_T)$, $x_t \in \mathbb{R}^m$
    - $\mathbf{z} = (z_1, z_2, \dots, z_U)$, $z_i \in L$
    - $U \le T$

- 网络 $\mathbf{y} = N_w(\mathbf{x})$: $(\mathbb{R}^{m})^{T} \longmapsto (\mathbb{R}^{n})^{T}$
    - $\mathbf{x} = (x_1, x_2, \dots, x_T)$
    - $\mathbf{y} = (y_1, y_2, \dots, y_T)$, $y_t^k$ 表示第 $k$ 个字符的在时间 $t$ 的激活(softmax)

---

#### 损失函数

使用极大似然训练， 损失函数取极大似然的负对数，即:
$$
O^{M L}\left(S, \mathcal{N}_{w}\right)=-\sum\limits_{(\mathbf{x}, \mathbf{z}) \in S} \ln (P(\mathbf{z} | \mathbf{x}))
$$
其中:
$$
P(\mathbf{z} | \mathbf{x}) = \sum\limits_{\pi \in \mathcal{B}^{-1}(\mathbf{z})} P(\pi | \mathbf{x})
$$


我们希望计算损失函数对时间点 $t$ 上的输出激活 $y_k^t$ 的导数。简单地，即求:
$$
\frac{\partial p(\mathbf{z} | \mathbf{x})}{\partial y_k^t} \label{eq:loss-function-partial}\tag{2.1.1}
$$

CTC使用前向-后向算法高效计算 Eq.(\ref{eq:loss-function-partial})。 事实上, 只需要前向算法即可计算出 $p(\mathbf{z} | \mathbf{x})$ 。

---

#### 前向变量

##### 动机

对于标注序列 $l$, 其似然为:

$$
\begin{align}
P(l | \mathbf{x}) &= \sum\limits_{\pi: \mathcal{B}(\pi) = l} P(\pi | \mathbf{x}) = P(\pi : \mathcal{B}(\pi) = l \mathrel | \mathbf{x})  \\
                  &= P(\pi_1^T : \mathcal{B}(\pi_1^T) = l_1^{|l|} \mathrel | \mathbf{x})  \\
                  &= \sum_{\pi_T} P(\pi_1^T : \mathcal{B}(\pi_1^T) = l_1^{|l|}, \pi_T \mathrel | \mathbf{x})  \\
\end{align}
$$
由于 $\pi_T$ 的取值只可能是 $blank$ 或 $l_{|l|}$: 

$$
P(l | \mathbf{x}) = P(\pi_1^T : \mathcal{B}(\pi_1^T) = l_1^{|l|}, \pi_T=blank \mathrel | \mathbf{x}) + P(\pi_1^T : \mathcal{B}(\pi_1^T) = l_1^{|l|}, \pi_T=l_{|l|} \mathrel | \mathbf{x}) 
$$

其中:
$$
\begin{align}
   & P(\pi_1^T : \mathcal{B}(\pi_1^T) = l_1^{|l|}, \pi_t=blank \mathrel | \mathbf{x}) \\
=  & P(\pi_1^{T-1} : \mathcal{B}(\pi_1^{T-1}) = l_1^{|l|}, \pi_t=l_{|l|} \mathrel | \mathbf{x}) \cdot p(\pi_{T} = blank) + \\
& P(\pi_1^{T-1} : \mathcal{B}(\pi_1^{T-1}) = l_1^{|l|}, \pi_t=blank \mathrel | \mathbf{x}) \cdot P(\pi_{T} = blank) 
\end{align} \label{eq:alpha_t_s_blank_verbose}\tag{2.2.1}
$$

以及:
$$
\begin{align}
   & P(\pi_1^T : \mathcal{B}(\pi_1^t) = l_1^{|l|}, \pi_t=l_{|l|} \mathrel | \mathbf{x}) \\
=  & P(\pi_1^{T-1} : \mathcal{B}(\pi_1^{T-1}) = l_1^{|l|}, \pi_{T-1}=l_{|l|} \mathrel | \mathbf{x}) \cdot P(\pi_{T}=l_{|l|}) + \\
   & P(\pi_1^{T-1} : \mathcal{B}(\pi_1^{T-1}) = l_1^{|l-1|}, \pi_{T-1}=blank \mathrel | \mathbf{x}) \cdot P(\pi_{T}=l_{|l|}) + \\
   & P(\pi_1^{T-1} : \mathcal{B}(\pi_1^{T-1}) = l_1^{|l-1|}, \pi_{T-1}=l_{|l-1|} \mathrel | \mathbf{x}) \cdot P(\pi_{T}=l_{|l|}) \cdot (1 - \delta(l_{|l-1|}, l_{|l|}))
\end{align} \label{eq:alpha_t_s_l_s_verbose}\tag{2.2.2}
$$

根据 Eq.(\ref{eq:alpha_t_s_blank_verbose}), 定义前向变量: 
$$
\begin{align}
\alpha_t(s, blank) =& P(\pi_1^t : \mathcal{B}(\pi_1^t) = l_1^{s}, \pi_t=blank \mathrel | \mathbf{x}) \\
                   =& \alpha_{t-1}(s, blank) \cdot p(\pi_{t} = blank) + \\
                    & \alpha_{t-1}(s, l_s) \cdot p(\pi_{t} = blank) \\
\end{align} \label{eq:alpha_t_s_blank_short}\tag{2.2.3}
$$

根据 Eq.(\ref{eq:alpha_t_s_l_s_verbose}), 定义前向变量: 
$$
\begin{align}
\alpha_t(s, l_s) =& P(\pi_1^t : \mathcal{B}(\pi_1^t) = l_1^{s}, \pi_t=l_s \mathrel | \mathbf{x}) \\
                      =& \alpha_{t-1}(s, l_s) \cdot p(\pi_{t} = l_s) + \\
                       & \alpha_{t-1}(s-1, blank) \cdot p(\pi_{t} = l_s) + \\
                       & \alpha_{t-1}(s-1, l_{s-1}) \cdot p(\pi_{t} = l_s) \cdot (1 - \delta(l_{s-1}, l_{s}))
\end{align} \label{eq:alpha_t_s_l_s_short}\tag{2.2.4}
$$

标注 $l$ 的似然可以写为:
$$
P(l|\mathbf{x}) = \alpha_T(|l|, l_{|l|}) + \alpha_T(|l|, blank)
$$

---

以 $T=8$, $l=apple$ 为例，该动态规划如图所示， $\alpha$计算的是紫色路径的概率:
> 为什么是这个图？
> 图中的路径表示了 $\pi$ 在不同时刻的取值，对$\pi$左边的路径取 $\mathcal{B}$ 即可得到 $\mathcal{B}(\pi)$
> 从理论上，上文的推导可以说明该图的正确性，但这样的解释过于复杂
> 直观上，要使路径正确，如果当前点是字符，下一时刻可以取<当前字符，空白，下一（不同）字符>; 如果当前点是空白，下一时刻可以取<空白，下一字符>。该图很好地描述了这一过程, 展示了所有可能的**正确**路径。

<img src="dp.forward.prob.png" width="450" style="float: left;">
<span style="color: red">红色</span>表示: $\alpha_{t=6}(s=4, l_s)$
<span style="color: yellow">黄色</span>表示: 似然 $p(l | \mathbf{x})$
<div style="clear:both">

情况 Eq.(\ref{eq:alpha_t_s_blank_short}) 
<img src="dp.forward.2.png" width="350" style="float: left;">
<div style="clear:both">

情况 Eq.(\ref{eq:alpha_t_s_l_s_short})
<img src="dp.forward.1.png" width="350" style="float: left;">
<img src="dp.forward.3.png" width="350" style="float: left; transform: translate(0, -30px)">

<div style="clear:both">

--- 

##### 简化

进一步，根据图示的信息，可以重写前向公式。对于标注序列 $l$, 定义其扩展 $l^{\prime}$ 为: 在 $l$ 的两侧以及所有字符间插入空白字符。
>e.g. 
>$l=aabcdda$
>$l^{\prime}=-a-a-b-c-d-d-a-$

如图通过奇偶简化定义:
$$
\begin{align}
& \alpha_t(2s) = \alpha_t(s, l_s) = P(\pi_1^t : \mathcal{B}(\pi_1^t) = l_1^s, \pi_t=l^{\prime}_{2s} \mathrel | \mathbf{x}) \\
& \alpha_t(2s+1) = \alpha_t(s, blank) = P(\pi_1^t : \mathcal{B}(\pi_1^t) = l_1^s, \pi_t=l^{\prime}_{2s+1} \mathrel | \mathbf{x}) \\
\end{align} \label{eq:alpha_simple_double}\tag{2.2.5}
$$

进一步简化为同时适用于奇偶两种情况定义的公式:
$$
\alpha_t(s^{\prime}) = P(\pi_1^t : \mathcal{B}(\pi_1^t) = l_1^{\lfloor\frac{s^{\prime}}{2}\rfloor}, \pi_t=l^{\prime}_{s^{\prime}} \mathrel | \mathbf{x}) = \sum\limits_{\substack{\pi_1^t \\ \pi_t=l^{\prime}_{s^{\prime}} \\ \mathcal{B}(\pi_1^t) = l_1^{\lfloor\frac{s^{\prime}}{2}\rfloor} }} \prod_{t^{\prime}=1}^t y_{\pi_{t^{\prime}}}^{t^{\prime}} \label{eq:alpha}\tag{2.2.6}
$$

重写 Eq.(\ref{eq:alpha_t_s_blank_short}) 和 Eq.(\ref{eq:alpha_t_s_l_s_short}):
$$
\alpha_{t}(s^{\prime})=y_{l_{s^{\prime}}^{\prime}}^{t}\left\{\begin{array}{ll}{\sum_{i=s^{\prime}-1}^{s^{\prime}} \alpha_{t-1}(i)} & {\text { if } l_{s^{\prime}}^{\prime}=blank \text { or } l_{s^{\prime}-2}^{\prime}=l_{s^{\prime}}^{\prime}} \\ {\sum_{i=s^{\prime}-2}^{s^{\prime}} \alpha_{t-1}(i)} & {\text { otherwise }}\end{array}\right. \label{eq:alpha_t_s}\tag{2.2.7}
$$ 

初值:
$$
\begin{alignat}{2}
& \alpha_1(1) = y_1^{blank} && \\
& \alpha_1(2) = y_1^{l_1} && \\
& \alpha_1(s^{\prime}) = 0 &&, \forall s^{\prime} > 2 \\
\end{alignat}
$$

似然:
$$
P(l|\mathbf{x}) = \alpha_T(2|l|) + \alpha_T(2|l| + 1) 
$$


---

此时, 该动态规划为:
<img src="dp.forward.path.png" width="440" style="float: left;">
<span style="color: red">红色</span>表示: $\alpha_{t=4}(s^{\prime}=4)$
<span style="color: green">绿色</span>表示: $\alpha_{t=4}(s^{\prime}=5)$

---

<span style="color: green">绿色</span>和<span style="color: orange">橙色</span> 为 Eq.(\ref{eq:alpha_t_s})的情况1。
<span style="color: red">红色</span> 为 Eq.(\ref{eq:alpha_t_s})的情况2。
<div style="clear:both">

---


#### 后向变量

类似 Eq.(\ref{eq:alpha_simple_double}), 定以后向变量:
$$
\begin{align}
& \beta_t(2s) = \beta_t(s, l_s) = P(\pi_{t+1}^T : \mathcal{B}(\pi_t^T) = l_s^{|l|}, \pi_t=l^{\prime}_{2s} \mathrel | \mathbf{x}) \\
& \beta_t(2s-1) = \beta_t(s, blank) = P(\pi_{t+1}^T : \mathcal{B}(\pi_t^T) = l_s^{|l|}, \pi_t=l^{\prime}_{2s-1} \mathrel | \mathbf{x}) \\
\end{align}
$$

进一步简化为同时适用于奇偶两种情况定义的公式:
$$
\beta_t(s^{\prime}) = P(\pi_{t+1}^T : \mathcal{B}(\pi_t^T) = l_{\lceil\frac{s^{\prime}}{2}\rceil}^{|l|}, \pi_t=l^{\prime}_{s^{\prime}} \mathrel | \mathbf{x}) = \sum\limits_{\substack{\pi: \\ \pi_t=l^{\prime}_{s^{\prime}} \\ \mathcal{B}(\pi_t^T)=l_{\lceil\frac{s^{\prime}}{2}\rceil}^{|l|}}} \prod_{t^{\prime}=t+1}^T y_{\pi_{t^{\prime}}}^{t^{\prime}} \label{eq:beta}\tag{2.3.1}
$$

$\beta$计算的是紫色路径中，实线部分的概率:
<img src="dp.backward.prob.png" width="450" style="float: left;">
<div style="clear:both">

则 $\beta$ 的递推公式为:
$$
\beta_{t}(s^{\prime})=\left\{\begin{array}{ll}{\sum_{i=s^{\prime}}^{s^{\prime}+1} \beta_{t+1}(i) y_{l_{i}^{\prime}}^{t}} & {\text { if } l_{s^{\prime}}^{\prime}=blank \text { or } l_{s^{\prime}+2}^{\prime}=l_{s^{\prime}}^{\prime}} \\ {\sum_{i=s^{\prime}}^{s^{\prime}+2} \beta_{t+1}(i) y_{l_{i}^{\prime}}^{t}} & {\text { otherwise }}\end{array}\right.
$$

初值:

$$
\begin{align}
\beta_T(|l^{\prime}|) = 1 & \\
\beta_{T}(|l^{\prime}|-1) = 1 & \\
\beta_{T}(s^{\prime}) = 0 &, \forall s^{\prime} < |l^{\prime}| - 1
\end{align}
$$

---

#### 前-后向算法


$$
\begin{align}
\frac{\partial p(l|\mathbf{x})}{\partial y_k^t} &= \frac{\partial p(\pi: \mathcal{B}(\pi)=l | \mathbf{x})}{\partial y_k^t} \\
                                                &= \frac{\partial p(\pi: \{\mathcal{B}(\pi)=l, \pi_t=k\} | \mathbf{x})}{\partial y_k^t}
\end{align}
$$

即只需要考虑在 $t$ 时刻经过字符 $k$ 的所有路径的概率。
<img src="dp.passthrough.png" width="450" style="float:left;"> 
<span style="color:purple;">在 $t=6$ 处经过字符 $l$ 的所有路径。</span>
字符 $p$ 和 $blank$ 出现多次，需要对每次分别计算后求和。
<div style="clear:both;"/>


前-后向算法:
$$
\begin{align}
& p(\pi : \{\mathcal{B}(\pi)=l, \pi_{t}=k\} \mathrel | \mathbf{x}) \\
=& \sum\limits_{\substack{\pi: \\ \pi_t=k \\ \mathcal{B}(\pi)=l}} P(\pi | \mathbf{x}) \\
=& \sum_{s \in [0, |l|]} \sum\limits_{\substack{\pi: \\ \pi_t=k \\ \mathcal{B}(\pi)=l \\ \mathcal{B}(\pi_1^t)=l_1^s}}P(\pi | \mathbf{x}) \\
=& \sum_{s \in [0, |l|]} \sum\limits_{\substack{\pi: \\ \pi_t=k \\ \mathcal{B}(\pi)=l \\ \mathcal{B}(\pi_1^t)=l_1^s}}P(\pi_1^t | \mathbf{x}) \cdot P(\pi_{t+1}^T | \mathbf{x})\\
=& \sum_{s \in [0, |l|]} \left\{\begin{array}{ll}{\sum\limits_{\substack{\pi_1^t: \\ \pi_t=k \\ \mathcal{B}(\pi_1^t)=l_1^s}}P(\pi_1^t | \mathbf{x})  \sum\limits_{\substack{\pi_t^T: \\ \pi_t=k \\ \mathcal{B}(\pi_t^T)=l_s^{|l|}}} P(\pi_{t+1}^T | \mathbf{x})} & {\text { if } k=l_s} \\ {\sum\limits_{\substack{\pi_1^t: \\ \pi_t=k \\ \mathcal{B}(\pi_1^t)=l_1^s}}P(\pi_1^t | \mathbf{x})  \sum\limits_{\substack{\pi_t^T: \\ \pi_t=k \\ \mathcal{B}(\pi_t^T)=l_{s+1}^{|l|}}} P(\pi_{t+1}^T | \mathbf{x})} & {\text { if } k=blank} \\ 0 & {\text { otherwise }}\end{array}\right. \\
=& \sum_{s \in [0, |l|]} \left\{\begin{array}{ll}{\alpha_t(2s) \cdot \beta_t(2s)} & {\text { if } k=l_s} \\ \alpha_t(2s+1) \cdot \beta_t(2(s+1)-1) & {\text { if } k=blank} \\ 0 & {\text { otherwise }}\end{array}\right. \\
=& \sum_{s^{\prime} \in [0, |l^{\prime}|]} \left\{\begin{array}{ll}{\alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime})} & {\text { if } k=l^{\prime}_{s^{\prime}} } \\ 0 & {\text { otherwise }}\end{array}\right. \\
=& \sum_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) \\
=& \sum_{s^{\prime} \in lab(k, l^{\prime})} \sum\limits_{\substack{\pi: \\ \mathcal{B}(\pi)=l \\ \pi_t=k}} \prod_{t^{\prime}=1}^T y_{\pi_{t^{\prime}}}^{t^{\prime}}
\end{align}
$$

其中$lab(k, l^{\prime})$ 为所有使得 $l_{s^{\prime}}=k$ 的 $s^\prime$。e.g. $lab(p, l^{\prime})=\{4,6\}$。
并用到了如下结论:

$$
\begin{alignat}{2}
& \mathcal{B}(\pi)=l, \mathcal{B}(\pi_1^t)=l_1^s, \pi_t=l_s && \Rightarrow \mathcal{B}(\pi_t^T)=l_s^{|l|} \\
& \mathcal{B}(\pi)=l, \mathcal{B}(\pi_1^t)=l_1^s, \pi_t=blank && \Rightarrow {B}(\pi_t^T)=l_{s+1}^{|l|} \\
\end{alignat}
$$

<img src="dp.fb.blank.png" style="float: left; margin-right:2%; height:360px;">
<img src="dp.fb.nonblank.png"  style="float: left; transform: translate(0, -25px); height:360px;">
<div style="clear:both">

---

#### 反向传播

损失函数对 $softmax$ 的输出 $y_k^t$ 导数为:
$$
\begin{align}
\frac{\partial O}{\partial y_{k}^{t}} &= -\frac{\partial \ln p(\mathbf{z} \mathrel | \mathbf{x})}{\partial y_{k}^{t}} \\
                                      &=-\frac{1}{p(\mathbf{z} | \mathbf{x})} \frac{\partial p(\mathbf{z} \mathrel | \mathbf{x})}{\partial y_{k}^{t}} \\
                                      &=-\frac{1}{p(\mathbf{z} | \mathbf{x})} \frac{\partial \sum\limits_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime})}{\partial y_{k}^{t}} \\
                                      &=-\frac{1}{p(\mathbf{z} | \mathbf{x})} \frac{\partial \sum_{s^{\prime} \in lab(k, l^{\prime})} \sum\limits_{\substack{\pi: \\ \mathcal{B}(\pi)=l \\ \pi_t=k}} \prod_{t^{\prime}=1}^T y_{\pi_{t^{\prime}}}^{t^{\prime}}}{\partial y_{k}^{t}}  \\
                                      &=-\frac{1}{p(\mathbf{z} | \mathbf{x}) y_k^t} \sum\limits_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime})
\end{align}
$$

输出层输出为 $a_k^t$, 有:
$$
y_{k}^{t}=\frac{e^{a_{k}^{t}}}{\sum_{k^{\prime}} e^{a_{k^{\prime}}^{t}}}
$$

故 $y_{k^{\prime}}^t$ 对 $a_k^t$ 的导数为:

$$
\begin{align}
\frac{\partial y_{k^{\prime}}^{t}}{\partial a_{k}^{t}}&=y_{k^{\prime}}^{t} \delta(k, k^{\prime})-y_{k^{\prime}}^{t} y_{k}^{t} \\
                                                      &=y_{k^{\prime}}^{t} (\delta(k, k^{\prime})- y_{k}^{t})
\end{align}
$$


损失函数对输出层的导数为:
$$
\begin{align}
\frac{\partial O}{\partial a_{k}^{t}} &=\sum_{k^{\prime}} \frac{\partial O}{\partial y_{k^{\prime}}^{t}} \frac{\partial y_{k^{\prime}}^{t}}{\partial a_{k}^{t}} \\
                                      &=-\sum_{k^{\prime}} \frac{1}{p(\mathbf{z} | \mathbf{x}) y_{k^{\prime}}^t} \sum\limits_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) \cdot y_{k^{\prime}}^{t} (\delta(k, k^{\prime})- y_{k}^{t}) \\
                                      &=-\sum_{k^{\prime}} \frac{1}{p(\mathbf{z} | \mathbf{x})} \sum\limits_{s^{\prime} \in lab(k^{\prime}, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) \cdot (\delta(k, k^{\prime})- y_{k}^{t}) \\
                                      &=-\frac{1}{p(\mathbf{z} | \mathbf{x})} \sum\limits_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) + \sum_{k^{\prime}} \frac{1}{p(\mathbf{z} | \mathbf{x})} \sum\limits_{s^{\prime} \in lab(k^{\prime}, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) \cdot y_{k}^{t} \\
                                      &=-\frac{1}{p(\mathbf{z} | \mathbf{x})} \sum\limits_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) + \frac{y_{k}^{t}}{p(\mathbf{z} | \mathbf{x})} \sum_{k^{\prime}}  \sum\limits_{s^{\prime} \in lab(k^{\prime}, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) \\
                                      &=-\frac{1}{p(\mathbf{z} | \mathbf{x})} \sum\limits_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) + \frac{y_{k}^{t}}{p(\mathbf{z} | \mathbf{x})} \sum\limits_{s^{\prime} \in [1,|l^{\prime}|]} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime}) \\
                                      &= y_k^t - \frac{1}{p(\mathbf{z} | \mathbf{x})} \sum\limits_{s^{\prime} \in lab(k, l^{\prime})} \alpha_t(s^{\prime}) \cdot \beta_t(s^{\prime})
\end{align}
$$

---

### 解码

#### best path decoding

---

#### prefix search decoding

---

#### beam search decoding

---

### 受限解码

---

### 相关链接

1. [Kleene star](https://en.wikipedia.org/wiki/Kleene_star)
2. [CTC 完整实现]
