---
title: "[Awk] Awk Scripts"
catalog: true
toc_nav_num: true
date: 2019-07-15 18:40:06
subtitle: "Aggregation of awk techniques and examples"
header-img: "Demo.png"
top: 0
tags:
- scripts
- awk
catagories:
- scripts
---
> 本文收录了工作中用到的经典的awk脚本, 并通过这些脚本解释awk的一些语法和技巧

# speech processing

## common

###  sort\_to\_field.awk

- 目标

#### AWK 脚本

```awk
FNR==NR{
    record[$f] = $0
}
FNR != NR {
    if ($f in record)
        print record[$f]
}
```


---

## VAD

### compare\_mlf.awk 

- 目标: 对比两个mlf标注文件中，标注一致和不一致的时间段 (compare\_mlf.awk 1.mlf 2.mlf)
- 介绍: mlf文件是描述音频vad的常用格式, 是一行[uttid]后接着若干行[start end spc/sil]格式的对某一段时间是语音帧/静音帧的判定

---

#### AWK 知识

1. PROCINFO 控制遍历列表的顺序，取值包括:
    - "@unsorted" (默认)
    - "@ind\_num\_asc", "ind\_num\_desc" (按索引大小排序)
    - "@val\_type\_asc" (按值类型排序，数字在字符串前)
    - "@val\_str\_asc"
    - etc.
2. ARGIND 记录当前文件在ARGV中的索引，从1开始
3. asort(src, dest, method) 第三个参数从PROCINFO中取值

---

#### AWK 脚本

```awk
#! /bin/awk -f
function get_frame_type(_frame2type, target)
{
    PROCINFO["sorted_in"]="@ind_num_asc";
    for (_frame in _frame2type)
        if (_frame+0 >= target+0)
            return _frame2type[_frame]==0 ? "sil":"spc";
    return _frame2type[_frame]==0 ? "sil":"spc";
}
NF==1{
    uttid=$1;
}
NF>1{
    frame2type[ARGIND][uttid][$2+0] = ($3=="sil" ? 0:1);
    frames[uttid][$2] = $2; 
    uttids[uttid]=uttid;
    idx2file[ARGIND]=FILENAME;
}
END {
    printf "%-8s%-8s%-9s", "start", "end", "durat";
    for (idx_file in idx2file)
        printf "%-8s", substr(idx2file[idx_file], 1,7);
    printf "%-8s\n\n", "judge";

    PROCINFO["sorted_in"]="@ind_str_asc";
    for (uttid in uttids)
    {   
        print uttid;
        start=0;
        PROCINFO["sorted_in"]="@ind_num_asc";
        for(frame in frames[uttid])
        {
            if (frame+0 <= start+0)  continue;
            printf "%-8s%-8s%-9s", start, frame, frame - start;
            judge = "same"; _type=-1;
            for (idx_file in idx2file)
            {
                _type_new = get_frame_type(frame2type[idx_file][uttid], frame);
                printf "%-8s", _type_new;
                if (_type != -1 && _type != _type_new)
                    judge = "diff";
                _type = _type_new;
            }
            printf "%-8s\n", judge;
            start=frame;
        }
        printf "\n";
    }   
}
```

---

- mlf示例文件

```text
440c02010
0       610     sil
610     4680    spc
4680    5730    sil

440c02017
0       610     sil
610     4680    spc
4680    5730    sil
```

```text
440c02010
0       620     sil
620     1600    spc
1600    1810    sil
1810    4720    spc
4720    5730    sil

440c02017
0       620     sil
620     1540    spc
1540    1560    sil
1560    1570    spc
1570    1820    sil
1820    4590    spc
4590    4600    sil
4600    4610    spc
4610    5730    sil
```

---

- 示例输出 (compare\_mlf.awk 1.mlf 2.mlf)

```text
start   end     durat    gold.ml pred.lo judge   

440c02010
0       610     610      sil     sil     same    
610     620     10       spc     sil     diff    
620     1600    980      spc     spc     same    
1600    1810    210      spc     sil     diff    
1810    4680    2870     spc     spc     same    
4680    4720    40       sil     spc     diff    
4720    5730    1010     sil     sil     same    

440c02017
0       610     610      sil     sil     same    
610     620     10       spc     sil     diff    
620     1540    920      spc     spc     same    
1540    1560    20       spc     sil     diff    
1560    1570    10       spc     spc     same    
1570    1820    250      spc     sil     diff    
1820    4590    2770     spc     spc     same    
4590    4600    10       spc     sil     diff    
4600    4610    10       spc     spc     same    
4610    4680    70       spc     sil     diff    
4680    5730    1050     sil     sil     same 

```
