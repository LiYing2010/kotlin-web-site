---
type: doc
layout: reference
category:
title: "使用 Kotlin 惯用法的 Advent of Code"
---

# 使用 Kotlin 惯用法的 Advent of Code

最终更新: {{ site.data.releases.latestDocDate }}

[Advent of Code](https://adventofcode.com/) 是每年 12 月举办一次的活动, 从 12 月 1 日开始到 25 日, 每天发布一道节日主题的谜题.
经 Advent of Code 创建者 [Eric Wastl](http://was.tl/) 授权, 我们演示如何使用 Kotlin 风格的惯用法来解决这些谜题:

* [Advent of Code 2021](#advent-of-code-2021)
* [Advent of Code 2020](#advent-of-code-2020)

## Advent of Code 2021

* [准备](#get-ready)
* [第 1 天: Sonar sweep](#day-1-sonar-sweep)
* [第 2 天: Dive!](#day-2-dive)
* [第 3 天: Binary diagnostic](#day-3-binary-diagnostic)
* [第 4 天: Giant squid](#day-4-giant-squid)

### 准备

我们会讲解使用 Kotlin 解决 Advent of Code 问题的基本技巧:

* 阅读我们的 [关于 Advent of Code 2021 的 Blog](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
* 使用 [这个 GitHub 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 来创建项目
* 观看 Kotlin Developer Advocate, Sebastian Aigner 的入门视频:

  <iframe width="560" height="315" src="https://www.youtube.com/embed/6-XSehwRgSY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 1 天: Sonar sweep

使用窗口和计数函数, 来处理整数的对(Pair)和三元组(Triplet).

* 在 [Advent of Code](https://adventofcode.com/2021/day/1) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) 查看 Anton Arhipov 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/76IzmtOyiHw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 2 天: Dive!

学习解构声明和 `when` 表达式.

* 在 [Advent of Code](https://adventofcode.com/2021/day/2) 阅读题目内容
* 在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 查看 Pasha Finkelshteyn 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/4A2WwniJdNc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 3 天: Binary diagnostic

学习处理二进制数值的不同方式.

* 在 [Advent of Code](https://adventofcode.com/2021/day/3) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) 查看 Sebastian Aigner 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/mF2PTnnOi8w" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 4 天: Giant squid

学习如何解析输入, 介绍用于更加便利的处理的一些领域类(Domain Class).

* 在 [Advent of Code](https://adventofcode.com/2021/day/4) 阅读题目内容
* 在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 查看 Anton Arhipov 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/wL6sEoLezPQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Advent of Code 2020

> 你可以在我们的 [GitHub 代码仓库](https://github.com/kotlin-hands-on/advent-of-code-2020/) 找到Advent of Code 2020 谜题的所有解答.
{:.tip}

* [第 1 天: Report repair](#day-1-report-repair)
* [第 2 天: Password philosophy](#day-2-password-philosophy)
* [第 3 天: Toboggan trajectory](#day-3-toboggan-trajectory)
* [第 4 天: Passport processing](#day-4-passport-processing)
* [第 5 天: Binary boarding](#day-5-binary-boarding)
* [第 6 天: Custom customs](#day-6-custom-customs)
* [第 7 天: Handy haversacks](#day-7-handy-haversacks)
* [第 8 天: Handheld halting](#day-8-handheld-halting)
* [第 9 天: Encoding error](#day-9-encoding-error)

### 第 1 天: Report repair

学习输入处理, 遍历列表, 通过不同的方法构建 Map, 使用 [`let`](scope-functions.html#let) 函数简化你的代码.

* 在 [Advent of Code](https://adventofcode.com/2020/day/1) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/o4emra1xm88" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 2 天: Password philosophy

学习字符串工具函数, 正规表达式, 集合上的操作, 以及如何使用 [`let`](scope-functions.html#let) 函数变换你的表达式.

* 在 [Advent of Code](https://adventofcode.com/2020/day/2) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/MyvJ7G6aErQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 3 天: Toboggan trajectory

比较命令式编程与函数式编程风格, 使用 pair 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
函数, 在列选择模式(Column Selection Mode)下编辑代码, 修正整数溢出问题.

* 在 [Advent of Code](https://adventofcode.com/2020/day/3) 阅读题目内容
* 在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 查看 Mikhail Dvorkin 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ounCIclwOAw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 4 天: Passport processing

使用 [`when`](control-flow.html#when-expression) 表达式, 学习如何进行输入校验:
工具函数, 使用数值范围, 检查成员是否属于集合, 匹配特定的正规表达式.

* 在 [Advent of Code](https://adventofcode.com/2020/day/4) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) 查看 Sebastian Aigner 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/-kltG4Ztv1s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 5 天: Binary boarding

使用 Kotlin 标准库函数 (`replace()`, `toInt()`, `find()`) 处理数值的二进制表达,
学习强大的局部函数, 学习如何使用  Kotlin 1.5 的 `max()` 函数.

* 在 [Advent of Code](https://adventofcode.com/2020/day/5) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/XEFna3xyxeY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

### 第 6 天: Custom customs

学习如何分组并统计字符串和集合中的字符, 使用标准库函数: `map()`, `reduce()`, `sumOf()`, `intersect()`, 和 `union()`.

* 在 [Advent of Code](https://adventofcode.com/2020/day/6) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) 查看 Anton Arhipov 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/QLAB0kZ-Tqc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 7 天: Handy haversacks

学习如何使用正规表达式, 在 Kotlin 代码中 使用 Java 的 HashMap 的 `compute()` 方法, 动态计算 Map 中的值,
使用 `forEachLine()` 函数读取文件, 比较两种查找算法: 深度优先查找和广度优先查找.

* 在 [Advent of Code](https://adventofcode.com/2020/day/7) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) 查看 Pasha Finkelshteyn 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/KyZiveDXWHw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 8 天: Handheld halting

使用封闭类和 Lambda 表达式来表达指令, 使用 Kotlin Set 在程序执行中查找循环,
使用序列和 `sequence { }` 构建函数, 创建延迟计算的集合, 试验试验性的 `measureTimedValue()` 函数来检查性能统计指标.

* 在 [Advent of Code](https://adventofcode.com/2020/day/8) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) 查看 Sebastian Aigner 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/0GWTTSMatO8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 第 9 天: Encoding error

学习 Kotlin 中的不同方式操纵 List, 使用 `any()`, `firstOrNull()`, `firstNotNullOfOrNull()`, `windowed()`, `takeIf()`, 和 `scan()` 函数,
这些函数是 Kotlin 编程风格的典型例子.

* 在 [Advent of Code](https://adventofcode.com/2020/day/9) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

<iframe width="560" height="315" src="https://www.youtube.com/embed/vj3J9MuF1mI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 下一步做什么?

* 在 [Kotlin Koans](koans.html) 中完成更多任务  
* 通过免费的 [Kotlin 基础课程](https://hyperskill.org/join/fromdocstoJetSalesStat?redirect=true&next=/tracks/18) 创建真实工作的应用程序
