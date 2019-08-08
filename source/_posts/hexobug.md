---
title: "[Hexo] HexoBug"
catalog: true
toc_nav_num: true
date: 2019-07-16 13:08:47
subtitle: "Bugs encountered when using this hexo theme and their respective solutions"
header-img: "Demo.png"
top: 0
tags:
- hexo
catagories:
- hexo
---

> 本文记录了在适用Hexo Hux系列时遇到的一些bug和解决方案的链接


## 公式渲染
- 行间、行内公式无法渲染的解决方案  
参考: https://ranmaosong.github.io/2017/11/29/hexo-support-mathjax/  
其中，mathjax的script地址需要改为  
```javascript
<script src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
```


## github 部署
- 问题： username.github.io 404
- 解决： 
    1. 检查repo命名，前缀需要与github用户名相同
    2. 先hexo init后git init，否则会从根目录push。需要重新hexo init并转移文件

## module
- 找不到module: ```npm install module-name```
- 速度慢，[加命令行代理proxychains4](https://www.hi-linux.com/posts/48321.html)
