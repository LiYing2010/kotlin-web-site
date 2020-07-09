---
type: doc
layout: reference
category: "集合"
title: "分组(Grouping)"
---

# 分组(Grouping)

Kotlin 标准库提供了扩展函数, 用于对集合中的元素进行分组操作.
最基本的函数是 [`groupBy()`](/api/latest/jvm/stdlib/kotlin.collections/group-by.html), 它接受一个 lambda 函数为参数, 返回结果是一个 `Map`.
在这个 map 中, 每个键(key)是 lambda 函数的一个返回结果, 与键(key)对应的值(value) 是一个 `List`, 其中包含返回这个结果的所有元素.
这个函数的用途, 举例来说, 我们可以对一个 `String` 组成的 list, 按字符串的首字母进行分组. 

调用 `groupBy()` 函数时, 也可以使用另一个 lambda 函数作为第二个参数 – 这个函数负责对值进行变换.
象这样使用两个 lambda 函数调用 `groupBy()`时, 结果 map 中, 第一个参数(`keySelector` lambda 函数)负责生成键(key),
它对应的值(value) 则是由第二个参数(值转换 lambda 函数)产生的结果组成的 list, 而不是集合中原来元素组成的 list.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    println(numbers.groupBy { it.first().toUpperCase() })
    println(numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.toUpperCase() }))
//sampleEnd
}
```
</div>

如果你希望对元素分组, 同时对所有的分组结果执行某个操作, 可以使用 [`groupingBy()`](/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html) 函数.
这个函数返回一个 [`Grouping`](/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 类型的实例.
这个 `Grouping` 实例可以用来对所有分组结果以 lazy 模式执行操作: 只有在操作执行之前才会真正创建分组结果.

Namely, `Grouping` 支持以下操作:

* [`eachCount()`](/api/latest/jvm/stdlib/kotlin.collections/each-count.html) 函数, 计算每个分组结果中的元素个数. 
* [`fold()`](/api/latest/jvm/stdlib/kotlin.collections/fold.html) 和 [`reduce()`](/api/latest/jvm/stdlib/kotlin.collections/reduce.html)函数, 将每个分组结果作为独立的集合, 执行 [折叠(fold) 与 简化(reduce)](collection-aggregate.html#fold-and-reduce) 操作, 并返回结果.
* [`aggregate()`](/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) 函数, 对每个分组结果中的所有元素反复执行指定的操作, 并返回最后结果.
   这是对 `Grouping` 执行任意操作的通用方式. 如果 折叠(fold) 与 简化(reduce) 不能满足你的需求, 可以用这种方式实现自定义的操作.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.groupingBy { it.first() }.eachCount())
//sampleEnd
}
```
</div>

