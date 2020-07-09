---
type: doc
layout: reference
category: "集合"
title: "聚合(Aggregate)操作"
---

# 集合的聚合(Aggregate)操作

Kotlin 的集合包含一些函数, 用于实现常见的 _聚合(Aggregate)操作_ – 也就是根据集合内容返回单个结果的操作.
大多数聚合操作都是大家已经熟悉的, 并与其他语言中的类似操作的工作方式相同:

* [`min()`](/api/latest/jvm/stdlib/kotlin.collections/min.html) 和 [`max()`](/api/latest/jvm/stdlib/kotlin.collections/max.html) 函数, 分别返回最小和最大的元素;
* [`average()`](/api/latest/jvm/stdlib/kotlin.collections/average.html) 函数, 返回数值集合中元素的平均值;
* [`sum()`](/api/latest/jvm/stdlib/kotlin.collections/sum.html) 函数, 返回数值集合中元素的合计值;
* [`count()`](/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数, 返回集合的元素个数;

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(6, 42, 10, 4)

    println("Count: ${numbers.count()}")
    println("Max: ${numbers.max()}")
    println("Min: ${numbers.min()}")
    println("Average: ${numbers.average()}")
    println("Sum: ${numbers.sum()}")
//sampleEnd
}
```
</div>

还有其他函数, 可以取得最小和最大元素, 但使用指定的选择器(selector)函数, 或自定义的 [`Comparator`](/api/latest/jvm/stdlib/kotlin/-comparator/index.html):

* [`maxBy()`](/api/latest/jvm/stdlib/kotlin.collections/max-by.html)/[`minBy()`](/api/latest/jvm/stdlib/kotlin.collections/min-by.html) 参数是一个选择器(selector)函数, 返回的结果是, 经过选择器(selector)函数计算后的结果值最大或最小的那个元素.
* [`maxWith()`](/api/latest/jvm/stdlib/kotlin.collections/max-with.html)/[`minWith()`](/api/latest/jvm/stdlib/kotlin.collections/min-with.html) 参数是一个 `Comparator` 对象, 返回的结果是, 根据 `Comparator` 的比较结果判定为最大或最小的那个元素. 

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 42, 10, 4)
    val min3Remainder = numbers.minBy { it % 3 }
    println(min3Remainder)

    val strings = listOf("one", "two", "three", "four")
    val longestString = strings.maxWith(compareBy { it.length })
    println(longestString)
//sampleEnd
}
```
</div>

此外, 还有更高级的求和函数, 可以接受一个函数为参数, 然后计算所有元素经这个函数计算后的结果值的总和: 

* [`sumBy()`](/api/latest/jvm/stdlib/kotlin.collections/sum-by.html) 对集合元素调用返回值为 `Int` 的函数.
* [`sumByDouble()`](/api/latest/jvm/stdlib/kotlin.collections/sum-by-double.html) 使用返回值为 `Double` 的函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart    
    val numbers = listOf(5, 42, 10, 4)
    println(numbers.sumBy { it * 2 })
    println(numbers.sumByDouble { it.toDouble() / 2 })
//sampleEnd
}
```
</div>

## 折叠(fold) 与 简化(reduce)

对于更加专门的情况, 可以使用 [`reduce()`](/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 和 [`fold()`](/api/latest/jvm/stdlib/kotlin.collections/fold.html) 函数, 它们可以对集合中的元素顺序地执行指定的操作, 然后返回累计结果.
这些操作需要两个参数: 前一次计算的累计值, 以及当前处理中的集合元素.

这两个函数的区别是, `fold()` 通过参数指定初始值, 并把它用作第一步处理时的累计值, 而 `reduce()` 的第一步处理, 使用第一个和第二个元素作为操作参数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf(5, 2, 10, 4)

    val sum = numbers.reduce { sum, element -> sum + element }
    println(sum)
    val sumDoubled = numbers.fold(0) { sum, element -> sum + element * 2 }
    println(sumDoubled)

    //val sumDoubledReduce = numbers.reduce { sum, element -> sum + element * 2 } // 错误: 计算结果中, 第一个元素没有被加倍
    //println(sumDoubledReduce)
//sampleEnd
}
```
</div>

上面的示例演示了它们的区别: 计算元素值加倍之后的合计值时, 我们使用了 `fold()` 函数.
如果将同样的计算函数传递给 `reduce()`, 会得到不同的结果, 因为它在第一步计算时会使用 list 的第一个和第二个元素, 因此第一个元素不会被加倍.

如果要对集合元素以相反的顺序调用处理函数, 可以使用 [`reduceRight()`](/api/latest/jvm/stdlib/kotlin.collections/reduce-right.html) 和 [`foldRight()`](/api/latest/jvm/stdlib/kotlin.collections/fold-right.html) 函数.
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

还可以执行使用元素下标为参数的操作.
这时请使用 [`reduceIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/reduce-indexed.html) 和 [`foldIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/fold-indexed.html) 函数, 操作的第一个参数会是元素下标. 

最后, 还有对应的函数, 可以对集合元素从右向左执行这样的操作 - [`reduceRightIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/reduce-right-indexed.html) 和 [`foldRightIndexed()`](/api/latest/jvm/stdlib/kotlin.collections/fold-right-indexed.html). 

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

