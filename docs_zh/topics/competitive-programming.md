[//]: # (title: 在编程竞赛(Competitive Programming)中使用 Kotlin)

本教程针对的读者是以前未使用过 Kotlin 的编程竞赛参加者, 以及以前未参加过编程竞赛的 Kotlin 开发者.
对这两种情况, 我们假设读者已经具备相应的编程技能.

[编程竞赛](https://en.wikipedia.org/wiki/Competitive_programming) 是一种智力竞赛,
参赛者编写程序来解决指定的算法问题, 并要满足严格的限定条件.
这里的程序可能很简单, 任何开发者都能够解决, 只需要很少的代码就能得到答案,
也可能很复杂, 需要知道特定的算法, 数据结构, 以及大量的实践经验.
尽管 Kotlin 并不是针对编程竞赛特别设计的, 但它恰好适合这一领域,
能够大量减少程序员需要编写和阅读的样板代码(Boilerplate Code),
因此程序员既能够象使用动态类型(dynamically-typed)脚本语言那样高效率的读写代码,
同时又拥有静态类型(statically-typed)语言提供的工具支持和性能优势.

关于如何设置 Kotlin 开发环境, 请参见 [Kotlin/JVM 入门](jvm-get-started.md).
在编程竞赛中, 通常会创建单个项目, 然后每个问题的解答会在单个源代码文件中编写.

## 简单的示例: 可达数(Reachable Number)问题

下面我们来看一个具体的例子.

[Codeforces](https://codeforces.com/)
第 555 轮已于 4月26日 举办了第 3 组, 因此它有很多问题可供任何开发者尝试.
你可以通过 [这个链接](https://codeforces.com/contest/1157) 来阅读这些问题.
其中最简单的问题是 [问题 A: 可达数(Reachable Number)](https://codeforces.com/contest/1157/problem/A).
它要求实现题干部分描述的一个简单算法.

我们来解决这个问题, 首先创建一个任意名称的 Kotlin 源代码文件. `A.kt` 也可以.
首先, 你需要实现题干部分指定的一个函数, 如下:

我们的函数 f(x) 如下: 我们对 x 加 1, 然后, 如果结果数字的末尾存在至少 1 个 0, 我们删除这个 0.

Kotlin 是一种注重实践、无固定成见的语言, 既支持命令式(imperative), 也支持函数式(function programming)编程风格,
并不强迫开发者使用哪一种.
你可以用函数式编程风格来实现函数 `f`, 使用 Kotlin 的 [尾递归(tail recursion)](functions.md#tail-recursive-functions) 功能:

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x

fun f(x: Int) = removeZeroes(x + 1)
```

或者, 你也可以为函数 `f` 编写命令式(imperative)的实现,
使用传统的 [while 循环](control-flow.md), 和可变的变量,
在 Kotlin 中表达为 [var](basic-syntax.md#variables):

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

在 Kotlin 中, 由于普遍使用类型推断(type-inference), 很多地方的类型声明是可选的,
但在编译时刻, 每一个声明仍然具有一个确定的静态类型.

现在, 只需要编写 main 函数, 读取输入, 以及实现题目要求的算法的其他部分 —
通过标准输入给定的初始整数 `n`, 对它反复执行函数 `f`, 计算产生的不同的整数的个数.

默认, Kotlin 运行在 JVM 平台, 能够直接访问大量而且高效的库,
包括通用的集合与数据结构, 比如动态大小的数组 (`ArrayList`),
基于 hash 的 map 和 set (`HashMap`/`HashSet`),
基于树(tree) 的有序 map 和 set (`TreeMap`/`TreeSet`).
我们使用整数的 hash set 来追踪执行函数 `f` 时已经到达过的数值,
这个问题的简单的命令式编程风格的版本可以编写如下:

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及以后版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    var n = readln().toInt() // 从标准输入读取整数
    val reached = HashSet<Int>() // 可变的 hash set
    while (reached.add(n)) n = f(n) // 反复执行函数 f
    println(reached.size) // 将答案打印到标准输出
}
```

在编程竞赛中不需要处理输入错误的情况. 编程竞赛中的输入格式永远是正确的, 实际的输入不会与题目中描述的不同.
因此你可以使用 Kotlin 的
[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)
函数.
它假定输入字符串存在, 否则会抛出异常.
类似的, 如果输入字符串不是整数,
[`String.toInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)
函数会抛出异常.

</tab>
<tab title="旧版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    var n = readLine()!!.toInt() // 从标准输入读取整数
    val reached = HashSet<Int>() // 可变的 hash set
    while (reached.add(n)) n = f(n) // 反复执行函数 f
    println(reached.size) // 将答案打印到标准输出
}
```

注意, 在
[readLine()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/read-line.html)
函数调用之后使用了 Kotlin 的 [null 判断操作符](null-safety.md#not-null-assertion-operator) `!!`.
Kotlin 的 `readLine()` 函数定义是返回一个
[可为 null 的类型](null-safety.md#nullable-types-and-non-nullable-types) `String?`,
并在输入结束时返回 `null`, 因此要求开发者处理没有输入的情况.

在编程竞赛中, 没有必要处理输入格式不正确的情况.
输入格式总是会明确指定, 而且实际输入不会违反题目描述中指定的输入格式.
这就是 null 判断操作符 `!!` 的含义 — 它假定输入字符串总是存在, 否则抛出一个异常.
[String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)
也与此类似.

</tab>
</tabs>

所有的在线编程竞赛都允许使用预先编写的代码, 因此你可以定义自己的工具函数库,
让你的解题代码更加简短, 容易阅读, 也容易编写.
然后可以使用这些代码作为解题答案的模板.
比如, 在编程竞赛中可以定义下面的辅助函数, 来读取输入:

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及以后版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 读取单个字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
// 对你的解答中需要用到的其他类型, 编写类似函数
```

</tab>
<tab title="旧版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 读取单个字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
// 对你的解答中需要用到的其他类型, 编写类似函数
```

</tab>
</tabs>

注意这里使用了 `private` [可见度修饰符](visibility-modifiers.md).
虽然可见度修饰符的概念与编程竞赛无关,
但通过使用它, 你可以从相同的代码模板创建多个解答文件, 而不会由于相同的包内存在多个同名的 public 声明而出现编译错误.

## 函数式操作符示例: 长数(Long Number)问题

对于更复杂的问题, Kotlin 对集合的函数式操作的扩展库可以很便利的减少样板代码,
让代码变成自顶向下的线性结构, 以及从左向右的数据变换管道.
比如, [问题 B: 长数(Long Number)](https://codeforces.com/contest/1157/problem/B)
要求实现一个贪婪算法, 这个算法可以通过这种风格来实现, 完全不需要使用可变的变量:

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及以后版本" group-key="kotlin-1-6">

```kotlin
fun main() {
    // 读取输入
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // 定语局部函数 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 贪婪查找第一个和最后一个下标
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合答案, 并输出
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
<tab title="旧版本" group-key="kotlin-1-5">

```kotlin
fun main() {
    // 读取输入
    val n = readLine()!!.toInt()
    val s = readLine()!!
    val fl = readLine()!!.split(" ").map { it.toInt() }
    // 定语局部函数 f
    fun f(c: Char) = '0' + fl[c - '1']
    // 贪婪查找第一个和最后一个下标
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // 组合答案, 并输出
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

</tab>
</tabs>

在这段密集的代码中, 除了集合的变换之外, 你还看到很多 Kotlin 的便利功能, 比如局部函数,
以及 [elvis 操作符](null-safety.md#elvis-operator) `?:`,
它可以将 [惯用法](idioms.md) "如果值为正, 则使用这个值, 否则使用字符串长度",
写成简洁可读的表达式 `.takeIf { it >= 0 } ?: s.length`,
但是 Kotlin 也完全可以定义额外的值可变的变量, 以命令式的风格来表达同样的代码.

在编程竞赛中, 为了让这种读取输入的任务更加简洁, 你可以定义下面这些辅助性的输入读取函数:

<tabs group="kotlin-versions">
<tab title="Kotlin 1.6.0 及以后版本" group-key="kotlin-1-6">

```kotlin
private fun readStr() = readln() // 读取单个字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
private fun readStrings() = readStr().split(" ") // 读取多个字符串
private fun readInts() = readStrings().map { it.toInt() } // 读取多个整数
```

</tab>
<tab title="旧版本" group-key="kotlin-1-5">

```kotlin
private fun readStr() = readLine()!! // 读取单个字符串行
private fun readInt() = readStr().toInt() // 读取单个整数
private fun readStrings() = readStr().split(" ") // 读取多个字符串
private fun readInts() = readStrings().map { it.toInt() } // 读取多个整数
```

</tab>
</tabs>

通过这些辅助函数, 读取输入的那部分代码可以变得更简单, 可以与题目描述的输入规格逐行对应:

```kotlin
// 读取输入
val n = readInt()
val s = readStr()
val fl = readInts()
```

注意, 在编程竞赛中为变量取的名字, 经常会比实际工作中要短, 因为代码只编写一次, 之后就不再维护了.
但是, 这些变量名仍然遵守一些规则, 以便于记忆 —
`a` 表示数组, `i`, `j`, 等等表示下标, `r`, 和 `c` 表述表中的行和列数, `x` 和 `y` 表示座标, 等等.
对输入数据使用与题目描述中相同的名称会比较简单.
但是, 更加复杂的问题要求更多的代码, 因此需要变量和函数的名称更长, 而且含义清晰.

## 更多提示和技巧

编程竞赛题目的输入通常类似如下:

输入的第一行包含两个整数 `n` 和 `k`

在 Kotlin 中, 可以对整数 List 使用 [解构声明(Destructuring Declaration)](destructuring-declarations.md) 功能,
简洁的解析这样的输入行:

```kotlin
val (n, k) = readInts()
```

也可能会使用 JVM 的 `java.util.Scanner` 类来解析缺少结构的输入格式.
Kotlin 被设计为能够与 JVM 的库良好交互, 因此在 Kotlin 中使用这些库会感到非常自然.
但是, 请注意 `java.util.Scanner` 非常的慢.
实际上, 它太慢了, 以至于解析 10<sup>5</sup> 以上个整数时, 可能会超过题目通常要求的 2 秒运行时间限制,
这样的输入, 使用简单的 Kotlin 函数 `split(" ").map { it.toInt() }` 就可以解决.

在 Kotlin 中输出通常使用简单的 [println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 调用,
并使用 Kotlin 的 [字符串模板](strings.md#string-templates).
但是, 如果输出包含 10<sup>5</sup> 行以上时, 一定要注意.
调用这样多次的 `println` 会非常的慢, 因为在 Kotlin 中标准输出会在每一行之后自动刷出.
要从数组或列表输出大量行内容, 更快的方式是使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数, 用 `"\n"` 作为分隔符, 比如:

```kotlin
println(a.joinToString("\n")) // 数组/列表的每个元素成为单独的行
```

## 学习 Kotlin

Kotlin 很容易学习, 尤其是对于那些已经熟悉 Java 的程序员.
针对软件开发者的 Kotlin 基本语法简短介绍, 请参见在本站参考文档: [基本语法](basic-syntax.md).

IDEA 已经内置了 [Java 到 Kotlin 转换器](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html).
可供熟悉 Java 的人用来学习对应的 Kotlin 语法结构,
但它并不完美, 还需要你自己来熟悉 Kotlin, 并学习 [Kotlin 惯用法](idioms.md).

要学习 Kotlin 语法和 Kotlin 标准库 API, 一个很好的资源是 [Kotlin Koan](koans.md).
