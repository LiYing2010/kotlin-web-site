[//]: # (title: 使用 Kotlin 惯用法的 Advent of Code)

[Advent of Code](https://adventofcode.com/) 是每年 12 月举办一次的活动, 从 12 月 1 日开始到 25 日, 每天发布一道节日主题的谜题.
经 Advent of Code 创建者 [Eric Wastl](http://was.tl/) 授权, 我们演示如何使用 Kotlin 风格的惯用法来解决这些谜题:

* [Advent of Code 2024](https://www.youtube.com/playlist?list=PLlFc5cFwUnmwHaD3-qeoLHnho_PY2g9JX)
* [Advent of Code 2023](https://www.youtube.com/playlist?list=PLlFc5cFwUnmzk0wvYW4aTl57F2VNkFisU)
* [Advent of Code 2022](#advent-of-code-2022)
* [Advent of Code 2021](#advent-of-code-2021)
* [Advent of Code 2020](#advent-of-code-2020)

## 准备进入 Advent of Code {id="get-ready-for-advent-of-code"}

我们会讲解使用 Kotlin 解决 Advent of Code 问题的基本技巧:

* 阅读我们的 [关于 Advent of Code 2021 的 Blog](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
* 使用 [这个 GitHub 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) 来创建项目
* 观看 Kotlin Developer Advocate, Sebastian Aigner 的入门视频:

<video width="560" height="315" src="https://www.youtube.com/v/6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

## Advent of Code 2022 {id="advent-of-code-2022"}

### 第 1 天: Calorie counting {id="day-1-calorie-counting"}

学习 [Kotlin Advent of Code 模板](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template),
以及在 Kotlin 中处理字符串和集合的便利函数,
例如 [`maxOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html)
和 [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html).
了解扩展函数如何帮助你以更好的方式构建解决方案.

* 在 [Advent of Code](https://adventofcode.com/2022/day/1) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 1 天 | Kotlin](https://www.youtube.com/watch?v=ntbsbqLCKDs)

### 第 2 天: Rock paper scissors {id="day-2-rock-paper-scissors"}

理解 Kotlin 中对 `Char` 类型的操作 , 了解在模式匹配中如何使用 `Pair` 类型和 `to` 构造器.
理解如何使用 [`compareTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/compare-to.html) 函数对你自己的对象排序.

* 在 [Advent of Code](https://adventofcode.com/2022/day/2) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 2 天 | Kotlin](https://www.youtube.com/watch?v=Fn0SY2yGDSA)

### 第 3 天: Rucksack reorganization {id="day-3-rucksack-reorganization"}

学习 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库如何帮助你理解你的代码的性能特性.
了解 `intersect` 等 Set 操作如何帮助你选择重叠的数据,
查看同一解决方案的不同具体实现之间的性能比较.

* 在 [Advent of Code](https://adventofcode.com/2022/day/3) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 3 天 | Kotlin](https://www.youtube.com/watch?v=IPLfo4zXNjk)

### 第 4 天: Camp cleanup {id="day-4-camp-cleanup"}

`infix` 和 `operator` 函数如何提升你的代码的表现能力,
以及 `String` 和 `IntRange` 类型的扩展函数如何简化输入解析的工作.

* 在  [Advent of Code](https://adventofcode.com/2022/day/4) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 4 天 | Kotlin](https://www.youtube.com/watch?v=dBIbr55YS0A)

### 第 5 天: Supply stacks {id="day-5-supply-stacks"}

了解如何使用工厂函数构建更加复杂的对象,
如何使用正规表达式, 以及双向的(Double-Ended) [`ArrayDeque`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 类型.

* 在 [Advent of Code](https://adventofcode.com/2022/day/5) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 5 天 | Kotlin](https://www.youtube.com/watch?v=lKq6r5Nt8Yo)

### 第 6 天: Tuning trouble {id="day-6-tuning-trouble"}

查看如何使用 [kotlinx.benchmark](https://github.com/Kotlin/kotlinx-benchmark) 库进行更加深入的性能调查,
比较同一个解决方案的16种不同的遍体的性能特性.

* 在 [Advent of Code](https://adventofcode.com/2022/day/6) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 6 天 | Kotlin](https://www.youtube.com/watch?v=VbBhaQhW0zk)

### 第 7 天: No space left on device {id="day-7-no-space-left-on-device"}

学习如何构建树结构模型, 查看一个示例程序, 演示如何通过编程方式生成 Kotlin 代码.

* 在 [Advent of Code](https://adventofcode.com/2022/day/7) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 7 天 | Kotlin](https://www.youtube.com/watch?v=Q819VW8yxFo)

### 第 8 天: Treetop tree house {id="day-8-treetop-tree-house"}

学习 `sequence` 构建器的实际使用,
以及一个程序最初的草稿和符合 Kotlin 惯用法的解决方案之间能有多大的差异 (和特邀嘉宾 Roman Elizarov 一起!).

* 在 [Advent of Code](https://adventofcode.com/2022/day/8) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 8 天 | Kotlin](https://www.youtube.com/watch?v=6d6FXFh-UdA)

### 第 9 天: Rope bridge {id="day-9-rope-bridge"}

学习 `run` 函数, 带标签的返回(Labeled Return), 以及便利的标准库函数, 例如 `coerceIn`, 或 `zipWithNext`.
学习如何使用 `List` 和 `MutableList` 构建器构建指定大小的 List,
查看这个题目基于 Kotlin 的可视化.

* 在 [Advent of Code](https://adventofcode.com/2022/day/9) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 9 天 | Kotlin](https://www.youtube.com/watch?v=ShU9dNUa_3g)

### 第 10 天: Cathode-ray tube {id="day-10-cathode-ray-tube"}

学习值范围和 `in` 操作符如何让数值范围的检查变得更加自然,
如何将函数参数转换为接受者, 简要的探索 `tailrec` 修饰符.

* 在 [Advent of Code](https://adventofcode.com/2022/day/10) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 10 天 | Kotlin](https://www.youtube.com/watch?v=KVyeNmFHoL4)

### 第 11 天: Monkey in the middle {id="day-11-monkey-in-the-middle"}

学习如何从可变的、命令式(imperative)的代码转变为更加函数式的方案, 这种方案使用不可变的、只读的数据结构.
学习上下文接受者(Context Receiver), 以及我们的嘉宾如何为 Advent of Code 构建他自己的可视化库.

* 在 [Advent of Code](https://adventofcode.com/2022/day/11) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 11 天 | Kotlin](https://www.youtube.com/watch?v=1eBSyPe_9j0)

### 第 12 天: Hill Climbing algorithm {id="day-12-hill-climbing-algorithm"}

使用队列, `ArrayDeque`, 函数引用, 以及 `tailrec` 修饰符, 用 Kotlin 解决路径寻找问题.

* 在 [Advent of Code](https://adventofcode.com/2022/day/12) 阅读题目内容
* 观看视频中的解答:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2022, 第 12 天 | Kotlin](https://www.youtube.com/watch?v=tJ74hi_3sk8)

## Advent of Code 2021 {id="advent-of-code-2021"}

> 阅读我们的 [关于 Advent of Code 2021 的 Blog](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
>
{style="tip"}

### 第 1 天: Sonar sweep {id="day-1-sonar-sweep"}

使用窗口和计数函数, 来处理整数的对(Pair)和三元组(Triplet).

* 在 [Advent of Code](https://adventofcode.com/2021/day/1) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1) 查看 Anton Arhipov 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2021 in Kotlin, 第 1 天: Sonar Sweep](https://www.youtube.com/watch?v=76IzmtOyiHw)

### 第 2 天: Dive! {id="day-2-dive"}

学习解构声明和 `when` 表达式.

* 在 [Advent of Code](https://adventofcode.com/2021/day/2) 阅读题目内容
* 在 [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt) 查看 Pasha Finkelshteyn 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2021 in Kotlin, 第 2 天: Dive!](https://www.youtube.com/watch?v=4A2WwniJdNc)

### 第 3 天: Binary diagnostic {id="day-3-binary-diagnostic"}

学习处理二进制数值的不同方式.

* 在 [Advent of Code](https://adventofcode.com/2021/day/3) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/) 查看 Sebastian Aigner 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2021 in Kotlin, 第 3 天: Binary Diagnostic](https://www.youtube.com/watch?v=mF2PTnnOi8w)

### 第 4 天: Giant squid {id="day-4-giant-squid"}

学习如何解析输入, 介绍用于更加便利的处理的一些领域类(Domain Class).

* 在 [Advent of Code](https://adventofcode.com/2021/day/4) 阅读题目内容
* 在 [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt) 查看 Anton Arhipov 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[Advent of Code 2021 in Kotlin, 第 4 天: Giant Squid](https://www.youtube.com/watch?v=wL6sEoLezPQ)

## Advent of Code 2020 {id="advent-of-code-2020"}

> 你可以在我们的 [GitHub 代码仓库](https://github.com/kotlin-hands-on/advent-of-code-2020/) 找到Advent of Code 2020 谜题的所有解答.
>
{style="tip"}

### 第 1 天: Report repair {id="day-1-report-repair"}

学习输入处理, 遍历列表, 通过不同的方法构建 Map, 使用 [`let`](scope-functions.md#let) 函数简化你的代码.

* 在 [Advent of Code](https://adventofcode.com/2020/day/1) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #1](https://www.youtube.com/watch?v=o4emra1xm88)

### 第 2 天: Password philosophy {id="day-2-password-philosophy"}

学习字符串工具函数, 正规表达式, 集合上的操作, 以及如何使用 [`let`](scope-functions.md#let) 函数变换你的表达式.

* 在 [Advent of Code](https://adventofcode.com/2020/day/2) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #2](https://www.youtube.com/watch?v=MyvJ7G6aErQ)

### 第 3 天: Toboggan trajectory {id="day-3-toboggan-trajectory"}

比较命令式编程与函数式编程风格, 使用 pair 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
函数, 在列选择模式(Column Selection Mode)下编辑代码, 修正整数溢出问题.

* 在 [Advent of Code](https://adventofcode.com/2020/day/3) 阅读题目内容
* 在 [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt) 查看 Mikhail Dvorkin 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #3](https://www.youtube.com/watch?v=ounCIclwOAw)

### 第 4 天: Passport processing {id="day-4-passport-processing"}

使用 [`when`](control-flow.md#when-expressions-and-statements) 表达式, 学习如何进行输入校验:
工具函数, 使用数值范围, 检查成员是否属于集合, 匹配特定的正规表达式.

* 在 [Advent of Code](https://adventofcode.com/2020/day/4) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/) 查看 Sebastian Aigner 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #4](https://www.youtube.com/watch?v=-kltG4Ztv1s)

### 第 5 天: Binary boarding {id="day-5-binary-boarding"}

使用 Kotlin 标准库函数 (`replace()`, `toInt()`, `find()`) 处理数值的二进制表达,
学习强大的局部函数, 学习如何使用  Kotlin 1.5 的 `max()` 函数.

* 在 [Advent of Code](https://adventofcode.com/2020/day/5) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #5](https://www.youtube.com/watch?v=XEFna3xyxeY)

### 第 6 天: Custom customs {id="day-6-custom-customs"}

学习如何分组并统计字符串和集合中的字符, 使用标准库函数: `map()`, `reduce()`, `sumOf()`, `intersect()`, 和 `union()`.

* 在 [Advent of Code](https://adventofcode.com/2020/day/6) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/) 查看 Anton Arhipov 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #6](https://www.youtube.com/watch?v=QLAB0kZ-Tqc)

### 第 7 天: Handy haversacks {id="day-7-handy-haversacks"}

学习如何使用正规表达式, 在 Kotlin 代码中 使用 Java 的 HashMap 的 `compute()` 方法, 动态计算 Map 中的值,
使用 `forEachLine()` 函数读取文件, 比较两种查找算法: 深度优先查找和广度优先查找.

* 在 [Advent of Code](https://adventofcode.com/2020/day/7) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/) 查看 Pasha Finkelshteyn 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #7](https://www.youtube.com/watch?v=KyZiveDXWHw)

### 第 8 天: Handheld halting {id="day-8-handheld-halting"}

使用封闭类和 Lambda 表达式来表达指令, 使用 Kotlin Set 在程序执行中查找循环,
使用序列和 `sequence { }` 构建函数, 创建延迟计算的集合, 试验试验性的 `measureTimedValue()` 函数来检查性能统计指标.

* 在 [Advent of Code](https://adventofcode.com/2020/day/8) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/) 查看 Sebastian Aigner 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #8](https://www.youtube.com/watch?v=0GWTTSMatO8)

### 第 9 天: Encoding error {id="day-9-encoding-error"}

学习 Kotlin 中的不同方式操纵 List, 使用 `any()`, `firstOrNull()`, `firstNotNullOfOrNull()`, `windowed()`, `takeIf()`, 和 `scan()` 函数,
这些函数是 Kotlin 编程风格的典型例子.

* 在 [Advent of Code](https://adventofcode.com/2020/day/9) 阅读题目内容
* 在 [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/) 查看 Svetlana Isakova 的解答,
  或观看这个视频:

![YouTube](youtube.svg){width=25}{type="joined"}
[和 Kotlin Team 一起学习 Kotlin: Advent of Code 2020 #9](https://www.youtube.com/watch?v=vj3J9MuF1mI)

## 下一步做什么? {id="what-s-next"}

* 在 [Kotlin Koans](koans.md) 中完成更多任务
* 通过 JetBrains Academy 的 [Kotlin 核心教程](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)
  创建真实工作的应用程序
