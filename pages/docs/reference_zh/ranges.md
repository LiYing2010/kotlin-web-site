---
type: doc
layout: reference
category: "Syntax"
title: "值范围(Range)与数列(Progression)"
---

# 值范围(Range)与数列(Progression)

本页面最终更新: 2021/02/11

在 Kotlin 中可以非常便利的创建值范围, 方法是使用 `kotlin.ranges` 包中的
[`rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)
函数, 或者使用这个函数的操作符形式 `..`.
`rangeTo()` 函数通常会伴随 `in` 或 `!in` 函数一起使用.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val i = 1
//sampleStart
    if (i in 1..4) { // 等价于: 1 <= i && i <= 4
        print(i)
    }
//sampleEnd
}
```
</div>


整数型的值范围
([`IntRange`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-range/index.html),
[`LongRange`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-range/index.html),
[`CharRange`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-range/index.html))
还有一种额外的功能: 可以对这些值范围进行遍历.
这些值范围同时也是相应的整数类型的
[数列(Progression)](https://en.wikipedia.org/wiki/Arithmetic_progression).

这些值范围通常用来在 `for` 循环中遍历.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 1..4) print(i)
//sampleEnd
}
```
</div>

如果需要按反序遍历整数, 请使用标准库中的
[`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)
函数代替 `..`.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
//sampleEnd
}
```
</div>

还可以使用任意步长(不一定是 1)来遍历整数.
可以通过
[`step`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html)
函数实现.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    println()
    for (i in 8 downTo 1 step 2) print(i)
//sampleEnd
}
```
</div>

要创建一个不包含其末尾元素的值范围, 可以使用
[`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html)
函数:

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 1 until 10) {       // i in [1, 10), 不包含 10
        print(i)
    }
//sampleEnd
}
```
</div>

## 值范围(Range)

值范围代表数学上的一个闭区间(closed interval):
由两个边界值构成, 并且这两个边界值都包含在值范围之内.
值范围适用于可比较大小的数据类型(comparable type):
有顺序, 因此可以判断任意一个值是否处于两个值构成的范围之内.

值范围的主要操作是 `contains` 函数, 通常以 `in` 和 `!in` 操作符的形式来使用.

如果要为你的类创建一个值范围, 应该对值范围的起点值调用 `rangeTo()` 函数, 值范围的结束值作为参数传入.
`rangeTo()` 函数通常以 `..` 操作符的形式调用.

<div class="sample" markdown="1" theme="idea">

```kotlin

class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }
        return this.minor - other.minor
    }
}

fun main() {
//sampleStart
    val versionRange = Version(1, 11)..Version(1, 30)
    println(Version(0, 9) in versionRange)
    println(Version(1, 20) in versionRange)
//sampleEnd
}

```
</div>

## 数列(Progression)

如上面的例子所示, 整数类型(比如 `Int`, `Long`, 和 `Char`)的值范围,
可以被当作这些整数类型的 [算数数列(Arithmetic Progression)](https://en.wikipedia.org/wiki/Arithmetic_progression).
在 Kotlin 中, 这些数列由相应的类型来定义:
[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html),
[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html),
以及 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html).

数列有 3 个基本属性: `first` 元素, `last` 元素, 以及一个非 0 的 `step`.
数列的第一个元素就是 `first`, 后续的所有元素等于前一个元素加上 `step`.
在 step 为正数的数列上的遍历, 等价于 Java/JavaScript 中基于下标的 `for` 循环:

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

当你在值范围上遍历时会隐含地创建一个数列,
这个数列的 `first` 和 `last` 元素就是值范围的边界值, `step` 为 1.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 1..10) print(i)
//sampleEnd
}
```
</div>

如果要自定义数列的步长, 可以在值范围上使用 `step` 函数.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
//sampleEnd
}
```
</div>

数列的 `last` 元素计算方法如下:
* 如果步长为正: 小于或等于值范围结束值的最大值, 并且满足 `(last - first) % step == 0`.
* 如果步长为负: 大于或等于值范围结束值的最小值, 并且满足 `(last - first) % step == 0`.

因此, `last` 元素并不一定等同于值范围中指定的结束值.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // 数列最末元素是 7
//sampleEnd
}
```
</div>

如果要创建一个反方向遍历的数列, 定义值范围时需要使用 `downTo` 而不是 `..`.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
//sampleEnd
}
```
</div>

如果你已经有了一个数列, 你可以使用 `reversed` 函数反向遍历:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    for (i in (1..4).reversed()) print(i)
//sampleEnd
}
```
</div>

数列实现了 `Iterable<N>` 接口, 这里的 `N` 分别是 `Int`, `Long`, 或 `Char`,
因此数列可以用于很多 [集合函数](collection-operations.html), 比如 `map`, `filter`, 等等.

<div class="sample" markdown="1" theme="idea">

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
//sampleEnd
}
```
</div>
