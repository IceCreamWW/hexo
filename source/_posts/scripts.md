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
#
# -------------------------------------------------------------------------------
# Name:     compare_mlf.awk
# Purpose:  give comparison of two or more standard mlf files
# Author:   Wei Wang


# -------------------------------------------------------------- get_frametype --
# get the type of a frame given the uttid and file id
#
function get_frametype(fileidx, uttid, targetframe,
                       endframe)
{
    # make sure frames are in numeric ascending order in fileidx_uttid_endframe2type[fileidx][uttid]
    PROCINFO["sorted_in"]="@ind_num_asc";
    # forward search endframe to get the interval of target frame
    for (endframe in fileidx_uttid_endframe2type[fileidx][uttid])
        if (endframe+0 >= targetframe+0)
            return fileidx_uttid_endframe2type[fileidx][uttid][endframe]==0 ? "sil":"spc";

    # if target frame exceeds all end boundary frames,
    # assume it to be of same type as the last frame interval
    return fileidx_uttid_endframe2type[fileidx][uttid][endframe]==0 ? "sil":"spc";
}

# record it when the whole line consists of only one field (utterance id)
NF==1{
    uttid=$1;
}

# $1: start boundary frame number
# $2: end boundary frame number
# $3: type of this frame interval "sil" / "spc"
NF>1{
    # fileidx_uttid_frame2type
        # map a end boundary frame to its type (silence or speech), 3D array
            # dim1: file id (specified by ARGIND)
            # dim2: uttid
            # dim3: end boundary frame number
            # value: 0/1
    fileidx_uttid_endframe2type[ARGIND+0][uttid][$2+0] = ($3=="sil" ? 0:1);

    # record all end boundary frames of a utterance
    endframes[uttid][$2] = $2;
    # record all utterances
    uttids[uttid]=uttid;
    # record all files
    idx2file[ARGIND]=FILENAME;
}
END {
    printf "%-8s%-8s%-9s", "start", "end", "durat";

    # truncate the first 7 characters to be displayed as file name
    for (idx in idx2file)
        printf "%-8s", substr(idx2file[idx], 1,7);
    printf "%-8s\n\n", "judge";

    # make sure utterance info are output in ascending order (not necessary for correctness)
    PROCINFO["sorted_in"]="@ind_str_asc";
    for (uttid in uttids)
    {
        print uttid;
        startframe=0;

        # make sure endframes are sorted in numeric ascending order (necessary for algorithm correctness)
        PROCINFO["sorted_in"]="@ind_num_asc";
        for(endframe in endframes[uttid])
        {
            if (endframe+0 <= startframe+0)  continue;
            printf "%-8s%-8s%-9s", startframe, endframe, endframe - startframe;
            judge = "same"; frametype=-1;

            # search for current end frame type in each mlf files, check their consistency
            for (idx in idx2file)
            {
                frametype_new = get_frametype(idx, uttid, endframe);
                printf "%-8s", frametype_new;
                if (frametype != -1 && frametype != frametype_new)
                    judge = "diff";
                frametype = frametype_new;
            }
            printf "%-8s\n", judge;
            startframe=endframe;
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
