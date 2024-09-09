---
type: doc
layout: reference
category: "集合"
title: "聚合(Aggregate)操作"
---

# 聚合(Aggregate)操作

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 的集合包含一些函数, 用于实现常见的 _聚合(Aggregate)操作_ – 也就是根据集合内容返回单个结果的操作.
大多数聚合操作都是大家已经熟悉的, 并与其他语言中的类似操作的工作方式相同:

* [`minOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-or-null.html)
  和
  [`maxOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-or-null.html)
  函数, 分别返回最小和最大的元素. 对空集合, 这些函数返回 `null`.
* [`average()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/average.html)
  函数, 返回数值集合中元素的平均值.
* [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)
  函数, 返回数值集合中元素的合计值.
* [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html)
  函数, 返回集合的元素个数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
    val numbers = listOf(6, 42, 10, 4)

    println("Count: ${numbers.count()}")
    println("Max: ${numbers.maxOrNull()}")
    println("Min: ${numbers.minOrNull()}")
    println("Average: ${numbers.average()}")
    println("Sum: ${numbers.sum()}")
}
```
</div>

还有其他函数, 可以取得最小和最大元素, 但使用指定的选择器(selector)函数, 或自定义的
[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html):

* [`maxByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-by-or-null.html)
  和
  [`minByOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-by-or-null.html)
  函数, 参数是一个选择器(selector)函数,
  返回的结果是, 经过选择器(selector)函数计算后的结果值最大或最小的那个元素.
* [`maxWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-with-or-null.html)
  和
  [`minWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-with-or-null.html)
  函数, 参数是一个 `Comparator` 对象,
  返回的结果是, 根据 `Comparator` 的比较结果判定为最大或最小的那个元素.
* [`maxOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-or-null.html)
  和
  [`minOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-or-null.html)
  函数, 参数是一个选择器(selector)函数,
  返回结果是, 选择器函数的结果值中的最大或最小值.
* [`maxOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with-or-null.html)
  和
  [`minOfWithOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with-or-null.html)
  函数, 参数是一个 `Comparator` 对象,
  返回的结果是, 选择器函数的结果值中, 根据 `Comparator` 判定的最大或最小值.

这些函数都对空集合返回 return `null`.
还有其他替代函数 –
[`maxOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of.html),
[`minOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of.html),
[`maxOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max-of-with.html),
以及
[`minOfWith`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/min-of-with.html) –
这些函数与上面的各个函数功能相同, 但对空集合会抛出 `NoSuchElementException` 异常.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minByOrNull { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWithOrNull(compareBy { it.length })
    println(longestString)
//sampleEnd
}
```
</div>

除通常的 `sum()` 函数外, 还有更高级的求和函数
[`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html),
它接受一个选择器函数作为参数, 返回结果是对集合所有元素执行这个选择器函数之后的合计结果.
选择器函数可以返回不同的数值类型:
`Int`, `Long`, `Double`, `UInt`, 以及 `ULong` (对 JVM 平台还支持 `BigInteger` 和 `BigDecimal`).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumOf { it * 2 })
    println(numbers.sumOf { it.toDouble() / 2 })
//sampleEnd
}
```
</div>

## 折叠(fold) 与 简化(reduce)

对于更加专门的情况, 可以使用
[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
和
[`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)
函数, 它们可以对集合中的元素顺序地执行指定的操作, 然后返回累计结果.
这些操作需要两个参数: 前一次计算的累计值, 以及当前处理中的集合元素.

这两个函数的区别是, `fold()` 通过参数指定初始值, 并把它用作第一步处理时的累计值,
而 `reduce()` 的第一步处理, 使用第一个和第二个元素作为操作参数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val simpleSum = numbers.reduce { sum, element -> sum + element }
    println(simpleSum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    // 错误: 计算结果中, 第一个元素没有被加倍
    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 }
    //println(sumDoubledReduce)
//sampleEnd
}
```
</div>

上面的示例演示了它们的区别: 计算元素值加倍之后的合计值时, 我们使用了 `fold()` 函数.
如果将同样的计算函数传递给 `reduce()`, 会得到不同的结果,
因为它在第一步计算时会使用 list 的第一个和第二个元素, 因此第一个元素不会被加倍.

如果要对集合元素以相反的顺序调用处理函数, 可以使用
[`reduceRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html)
和
[`foldRight()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right.html)
函数.
它们的工作方式与 `fold()` 和 `reduce()` 函数类似, 但从最末尾的元素开始, 然后继续处理前面的元素.
注意, 如果从右端开始进行折叠或简化操作, 那么计算函数得到的操作参数顺序也会改变: 第一个参数是元素值, 第二个参数是累计值.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumDoubledRight = numbers.foldRight(0) { element, sum -> sum + element * 2 }
    println(sumDoubledRight)
//sampleEnd
}
```
</div>

执行操作时还可以使用元素下标作为参数.
这时请使用
[`reduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html)
和
 [`foldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html)
函数, 操作的第一个参数会是元素下标.

最后, 还有对应的函数, 可以对集合元素从右向左执行这样的操作 -
[`reduceRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html)
和
[`foldRightIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)
    val sumEven = numbers.foldIndexed(0) { idx, sum, element -> if (idx % 2 == 0) sum + element else sum }
    println(sumEven)

    val sumEvenRight = numbers.foldRightIndexed(0) { idx, element, sum -> if (idx % 2 == 0) sum + element else sum }
    println(sumEvenRight)
//sampleEnd
}
```
</div>

对于空的集合, 所有的简化(reduce) 操作都会抛出异常. 如果要得到 `null` 值, 请使用对应的 `*OrNull()` 函数:
* [`reduceOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-or-null.html)
* [`reduceRightOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-or-null.html)
* [`reduceIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed-or-null.html)
* [`reduceRightIndexedOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed-or-null.html)

如果你需要保存累加计算的中间结果值, 可以使用
[`runningFold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold.html)
(或者它的别名函数 [`scan()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/scan.html))
和
[`runningReduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce.html)
函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">
```kotlin

fun main() {
//sampleStart
    val numbers = listOf(0, 1, 2, 3, 4, 5)
    val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
    val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
//sampleEnd
    val transform = { index: Int, element: Int -> "N = ${index + 1}: $element" }
    println(runningReduceSum.mapIndexed(transform).joinToString("\n", "Sum of first N elements with runningReduce:\n"))
    println(runningFoldSum.mapIndexed(transform).joinToString("\n", "Sum of first N elements with runningFold:\n"))
}
```
</div>

如果执行操作时需要使用元素下标作为参数, 请使用
[`runningFoldIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-fold-indexed.html)
或
[`runningReduceIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/running-reduce-indexed.html)
函数.
