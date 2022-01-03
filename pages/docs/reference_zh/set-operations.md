---
type: doc
layout: reference
category: "集合"
title: "Set 相关操作"
---

# Set 相关操作

本页面最终更新: 2021/12/23

Kotlin 的集合包中包含着很多扩展函数, 用来实现常见的 set 操作:
计算两个 set 的交集, 合并两个 set, 或者从一个 set 中减去另一个集合.

要将两个集合合并为一个, 可以使用
[`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html)
函数.
这个函数可以通过中缀的形式来调用: `a union b`.
注意, 对于有序的集合来说, 参与操作的两个集合的顺序是很重要的:
在结果集合中, 第一个集合的元素出现在第二个集合的元素之前.

要计算两个集合的交集 (也就是在两个集合中同时出现的元素), 可以使用
[`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html)
函数.
要查找出现在一个集合但没有出现在另一个集合的元素, 可以使用
[`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html)
函数.
这两个函数也都可以通过中缀的形式来调用, 比如, `a intersect b`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    println(numbers union setOf("four", "five"))
    println(setOf("four", "five") union numbers)

    println(numbers intersect setOf("two", "one"))
    println(numbers subtract setOf("three", "four"))
    println(numbers subtract setOf("four", "three")) // 输出结果相同
//sampleEnd
}
```
</div>

`union`, `intersect`, 和 `subtract` 也可以用于 `List`.
但是, 操作结果 _永远_ 是一个 `Set`, 即使操作对象是 List.
在操作结果中, 所有重复的元素都会被合并为同一个, 并且不能根据下标访问元素.
