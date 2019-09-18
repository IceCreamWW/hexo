---
title: "[Code] python"
catalog: true
toc_nav_num: true
date: 2019-08-30 17:20:14
subtitle: "issues related to python"
header-img: "Demo.png"
top: 0
mathjax: true
tags:
- code
- python
catagories:
- code
---

> record python issues encountered, provide solutions and fucking tricks


# Debug

##### debug into pytorch custome autograd backward function

add following code at the beginning of function `backward`
```
import pydevd
pydevd.settrace(suspend=False, trace_only_current_thread=True)
```

- related answers
    - https://stackoverflow.com/questions/34299082/not-working-python-breakpoints-in-c-thread-in-pycharm-or-eclipsepydev
    - https://discuss.pytorch.org/t/pdb-cannot-debug-into-backward-hooks/38038
