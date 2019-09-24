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

## 矩阵乘法的意义

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


### 矩阵乘矩阵
设 $A \in \mathbb{R}^{m \times p}, B \in \mathbb{R}^{p \times n}, C=A B$, 则:
$$
\begin{align}
& C_{j}=A B_{j}, \quad j=1, \ldots, n, \\
& C^{i}=A^{i} B, \quad i=1, \ldots, m
\end{align}
$$
- AB 的列是 A 的列向量的线性组合, 组合系数为 B 的对应列的元素
- AB 的行是 B 的行向量的线性组合, 组合系数为 A 的对应行的元素.

从分块矩阵的角度看:
$$
\left(C_{1}, \ldots, C_{n}\right)=A B=A\left(B_{1}, \ldots, B_{n}\right)=\left(A B_{1}, \ldots, A B_{n}\right)
$$
$$
\left(\begin{array}{c}{C^{1}} \\ {\vdots} \\ {C^{m}}\end{array}\right)=A B=\left(\begin{array}{c}{A^{1}} \\ {\vdots} \\ {A^{m}}\end{array}\right) B=\left(\begin{array}{c}{A^{1} B} \\ {\vdots} \\ {A^{m} B}\end{array}\right)
$$
$AB=0$ 的意义: B的所有列向量都是 $Ax=0$ 的解


## 矩阵的初等变化及应用
### 三类初等变换

其中 $E_ij$ 为基本矩阵, 即第 $i$ 行第 $j$ 列元素为 1, 其余元素均为 0
#### 交换第i行(列)与第j行(列)
$$
E-E_{i i}-E_{j j}+E_{i j}+E_{j i}
$$
#### 非零数 $a$ 乘第 i 行(列)
$$
E + (a-1)E_{ii}
$$
#### 第 $j$ 行 (列) 的 $a$ 倍加到第 $i$ 行 (列),
$$
E + aE_{ij}
$$

---

- 左乘行变换, 右乘列变换
- 初等变换不改变矩阵的秩
- A 可逆 $\Leftrightarrow$ A 为初等矩阵的乘积

特别的, 任意可逆阵可经过行 (列) 初等变换化为单位阵, 例如:
$$
A_{s} \cdots A_{2} A_{1} A=E \Longrightarrow A=A_{1}^{-1} A_{2}^{-1} \cdots A_{s}^{-1}
$$

### 矩阵求逆

> 行变换相当于左乘 $A^{-1}$, 列变换相当于右乘 $A^{-1}$:

实用求逆法($AX=E$):
$$
(A, E) \stackrel{\text{行变换}}{\longrightarrow}(E, X) \Longrightarrow X=A^{-1}
$$
求解 $AX=B$:
$$
(A, B) \stackrel{\text{行变换}}{\longrightarrow}(E, X) \Longrightarrow X=A^{-1}B
$$
求解 $YA=B$
$$
\left(\begin{array}{c}{A} \\ {B}\end{array}\right) \stackrel{列变换}{\longrightarrow}\left(\begin{array}{c}{E} \\ {Y}\end{array}\right) \quad \Longrightarrow \quad Y=B A^{-1}
$$


## 矩阵的标准型

### 初等变换标准型

设 $A \in \mathbb{C}^{m \times n}, r(A)=r$, 则:
$$
A \stackrel{行变换}{\longrightarrow}\left(\begin{array}{cc}{E_{r}} & {0} \\ {0} & {0}\end{array}\right)
$$
称 $$\left(\begin{array}{cc}{E_{r}} & {0} \\ {0} & {0}\end{array}\right)$$ 为 $A$ 的初等变换标准型，$A$ 等价于$$\left(\begin{array}{cc}{E_{r}} & {0} \\ {0} & {0}\end{array}\right)$$

> 等价: 两个 $m \times n$ 矩阵等价当且仅当它们具有相同的秩

### Hermite 标准型

设 $H \in \mathbb{C}^{m \times n}, r(H)=r$, 则 $H$ 满足下列条件时，称其为 Hermite 标准型或简化行阶梯型:
1. 非零行出现在前 $r$ 行, 且每一行的第一个非零元是 1;
2. 每一个非零行的第一个非零元 1 出现的位置在前一个非零行的第一个非零元 1 的位置的右边;  
   即若第 i 行的第一个非零元 1 出现在第 $j_i$ 列, 则 $j_1 < j_2 < · · · < j_r$
3. 每一个非零行的第一个非零元 1 所在的列的其他元素都为 0, 即第 $j_i$ 列为标准单位列向量 $e_i$ ;

e.g.
$$
\left(\begin{array}{cccc}{1} & {0} & {10} &{0} \\ {0} & {0} & {1} & {0} \\ {0} & {0} & {0} & {1} \\ {0} & {0} & {0} & {0} \end{array}\right)
$$

---
定理: 任一矩阵 $A$ 都可经过一系列行初等变换化为 Hermite 标准形 $H_A$
设 $A \stackrel{\text{行变换}}{\longrightarrow} H_A$, 则存在可逆阵 $P$, 使得:
$$
P A=H_{A}=\left(\begin{array}{c}{H_{r}} \\ {0}\end{array}\right)
$$

---


行变换不改变列的线性组合关系，即$A$与$H_A$的线性关系一样, 证明:
$$
\begin{align}
& P A = H_A \\
& (P A)_j = (H_A)_j \\
& k_1 A_1 + k_2 A_2 + \dots + k_n A_n = 0 \\
& k_1P A_1 + k_2P A_2 + \dots + k_nP A_n = 0 \\
& k_1(H_A)_1 + k_2(H_A)_2 + \dots + k_n(H_A)_n = 0 \\
\end{align}
$$

### 应用: 满秩分解
设 $A \ne 0$. 如果列满秩矩阵 $L$ 与行满秩矩阵 $R$ 使得 $A = LR$, 则称 $A = LR$ 是 $A$ 的一个**满秩分解**

设 $A \stackrel{\text{行变换}}{\longrightarrow} H_A$, 即有:
$$
P A=H_{A}=\left(\begin{array}{c}{H_{r}} \\ {0}\end{array}\right)
$$

设 $H_r$ 的第 i 行的第一个非零元 1 所在的列标为 $j_i$ , 则 $H_r$ 的 $j_1 , j_2 , \cdots , j_r$ 列组成一个 r 阶单位矩阵, 故 $A$ 的 $j_1 , j_2 , \cdots , j_r$ 列线性无关, 且
$$
A=\left(A_{j_{1}}, A_{j_{2}}, \cdots, A_{j_{r}}\right) H_{r}
$$
此为 $A$ 的一个满秩分解

