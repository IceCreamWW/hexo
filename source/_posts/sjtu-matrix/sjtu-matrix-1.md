---
title: "lecture 1"
catalog: true
toc_nav_num: true
date: 2019-09-19 11:07:56
header-img: "../Demo.png"
mathjax: true
hide: true

---

## 矩阵运算

- 矩阵乘法
    - 有：结合律，分配律
    - 无：消去律，交换律
- 矩阵加法
    - 有：消去律，交换律，结合律

### 多项式

$A \in \mathbb{R}^{n \times n}$ ，令:
$$
\begin{align}
f(x) &= a_0 + a_1x + a_2x^2 + \dots + a_sx^s \\
g(x) &= a_0 + a_1x + a_2x^2 + \dots + a_lx^l
\end{align}
$$

则 $f(A)=a_0E + a_1A + \dots + a_sA^s$ 称为 $A$ 的一个多项式:
$$
\begin{align}
& \because A^iA^j = A^jA^i \\
& \therefore f(A)g(A) = g(A)f(A)
\end{align}
$$


### 迹

- $tr(A) = \sum_{i=1}^n \lambda_i(A)$
- $tr(AB) = tr(BA)$
- $tr(A^{-1}) = tr(A)$
- $tr(AA^\ast) = \sum_{i,j=1}^n \vert a_{ij} \vert^2$  
  $tr(AA^\ast) = 0 \Leftrightarrow A=0$  

---

### 秩

**$A \in \mathbb{R}^{m \times n}$**
- $r(A) = 0 \Leftrightarrow A = 0$
- $r(A) = r \Leftrightarrow r$ 阶子式至少有一个不为0，大于$r$阶子式全为0 
- $r(A) = m$: 行满秩; $r(A) = n$: 列满秩
- $r(A) + r(B) \le r(A) + r(B)$
- $r(A) + r(C) - n \le r(AC) \le min\{r(A), r(C)\}$ (Sylvester unequality)
- 对于可逆的方阵 $P, Q$  
  $r(A) = r(PA) = r(AQ) = r(PAQ)$  
  (初等变换不改变矩阵的秩)

设$A \in \mathbb{R}^{m \times n}$, 有:
$$
\begin{align}
& r(A) = 1  \\
\Leftrightarrow \quad & \exists \alpha \in \mathbb{R}^m, \beta \in \mathbb{R}^n  \\
& s.t. A = \alpha\beta^T 
\end{align}
$$
因此有秩1方阵的高次幂计算方法:

$$
A^{m}=\left(\alpha \beta^{T}\right)^{m}=\left(\beta^{T} \alpha\right)^{m-1} \alpha \beta^{T}=\left(\beta^{T} \alpha\right)^{m-1} A
$$

$r(A) = 1 \Leftrightarrow \exists \alpha \in \mathbb{R}^m, \beta \in \mathbb{R}^n, s.t. A = \alpha\beta^T$ 


---

**$ A \in \mathbb{R}^{n \times n}$**
- $r(A) = n$: 满秩，非奇异，非退化
- $r(A) < n$: 降秩，奇异，退化

### 代数余子式
设 $A \in \mathbb{R}^{n \times n}$, 去掉第 $i$ 行第 $j$ 列后所剩余的 $n − 1$ 阶方阵的行列式称为 $a_{ij}$ 的余子式 , 记为 $M_{ij}$ . 称 $A_{ij} = (−1)^{i+j}M_{ij}$ 为 $a_{ij}$ 的代数余子式 .
A的伴随矩阵 $\operatorname{adj} A$ 定义为:
$$
\operatorname{adj} A=\left(\begin{array}{cccc}{A_{11}} & {A_{21}} & {\cdots} & {A_{n 1}} \\ {A_{12}} & {A_{22}} & {\cdots} & {A_{n 2}} \\ {\cdots} & {\cdots} & {\cdots} & {\cdots} \\ {A_{1 n}} & {A_{2 n}} & {\cdots} & {A_{n n}}\end{array}\right)
$$

- $A(\operatorname{adj}A) = (\operatorname{adj}A)A = \vert A \vert E$
- 若 $\vert A \vert \ne 0$, 则: $A\frac{\operatorname{adj}A}{\vert A \vert} = \frac{\operatorname{adj}A}{\vert A \vert}A = E$  
  即: A^{-1} = \frac{\operatorname{adj}A}{\vert A \vert}

### 分块矩阵

矩阵的直和:
$$
\left(\begin{array}{ccc}{A_{1}} & {}  & {} \\ {} & {\ddots} & {} \\ {} & {} & {A_{s}}\end{array}\right)=A_{1} \oplus \cdots \oplus A_{s}
$$

---

## 矩阵与向量乘法的意义

$A^i$ 矩阵 $A$ 的第 $i$ 行
$A_j$ 矩阵 $A$ 的第 $j$ 列

### 右乘列向量

$$
\begin{align}
A\left(\begin{array}{c}{x_{1}} \\ {x_{2}} \\ {\vdots} \\ {x_{n}}\end{array}\right) &= \left(\begin{array}{cccc}{a_{11}} & {a_{12}} & {\cdots} & {a_{1 n}} \\ {a_{21}} & {a_{22}} & {\cdots} & {a_{2 n}} \\ {\cdots} & {\cdots} & {\cdots} & {\cdots} \\ {a_{m 1}} & {a_{m 2}} & {\cdots} & {a_{m n}}\end{array}\right)\left(\begin{array}{c}{x_{1}} \\ {x_{2}} \\ {\vdots} \\ {x_{n}}\end{array}\right) \\
&= \left(\begin{array}{c}{a_{11} x_{1}+a_{12} x_{2}+\cdots+a_{1 n} x_{n}} \\ {a_{21} x_{1}+a_{12} x_{2}+\cdots+a_{2 n} x_{n}} \\ {\vdots} \\ {a_{m 1} x_{1}+a_{m 2} x_{2}+\cdots+a_{m n} x_{n}}\end{array}\right) \\
&= x_{1}\left(\begin{array}{c}{a_{11}} \\ {a_{21}} \\ {\vdots} \\ {a_{m 1}}\end{array}\right)+x_{2}\left(\begin{array}{c}{a_{12}} \\ {a_{22}} \\ {\vdots} \\ {a_{m 2}}\end{array}\right)+\cdots+x_{n}\left(\begin{array}{c}{a_{1 n}} \\ {a_{2 n}} \\ {\vdots} \\ {a_{m n}}\end{array}\right)  \\
&= x_1A_1 + x_2A_2 + \cdots + x_nA_n
\end{align} 
$$

**矩阵 $A$ 右乘列向量 $x$ 是对 $A$ 的列向量的线性组合，组合系数为 $x$ 的对应元素。**

特别地, 对于第 $j$ 个标准单位列向量 $e_j$:
$$
Ae_j = A_j, j=1,2,\dots,n
$$

### 左乘行向量
$$
\left(y_{1}, y_{2}, \ldots, y_{m}\right)\left(\begin{array}{cccc}{a_{11}} & {a_{12}} & {\cdots} & {a_{1 n}} \\ {a_{21}} & {a_{22}} & {\cdots} & {a_{2 n}} \\ {\cdots} & {\cdots} & {\cdots} & {\cdots} \\ {a_{m 1}} & {a_{m 2}} & {\cdots} & {a_{m n}}\end{array}\right)=y_{1} A^{1}+y_{2} A^{2}+\cdots+y_{m} A^{m}
$$

**矩阵 $A$ 左乘行向量 $y^T$ 是对 $A$ 的行向量的线性组合，组合系数为 $y^T$ 的对应元素。**
