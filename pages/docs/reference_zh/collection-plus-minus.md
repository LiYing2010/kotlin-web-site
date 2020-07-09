---
type: doc
layout: reference
category: "集合"
title: "加法(Plus)和减法(Minus)操作符"
---

# `加法(Plus)` 和 `减法(Minus)` 操作符

在 Kotlin 中, 也为集合定义了 [`加法(Plus)`](/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`减法(Minus)`](/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 操作符.
这些操作符使用一个集合作为第一个操作数; 第二个操作数可以是单个元素, 也可以是另一个集合.
返回值是一个新的只读集合:

* `加法(Plus)` 的返回值包含原来集合中的元素 _和_ 第二个操作数的元素.
* `减法(Minus)` 的返回值包含原来集合中的元素, 但要 _除去_ 第二个操作数的元素.
   如果第二个操作数是单个元素, `减法(Minus)` 只删除原来的集合中 _第一次_ 出现的这个元素; 如果第二个操作数是一个集合, 那么原来的集合中 _所有_ 出现的这些元素都会被删除.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
```
</div>

关于 map 的 `加法(Plus)` 和 `减法(Minus)` 操作的详情, 请参见 [Map 相关操作](map-operations.html).
对于集合, 也定义了 [计算并赋值操作符](operator-overloading.html#assignments) [`加然后赋值(plusAssign)`](/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`减然后赋值(minusAssign)`](/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`).
但是, 对于只读集合, 这些操作符实际上会使用 `加法(Plus)` 或 `减法(Minus)` 操作符, 然后将结果重新赋值给同一个变量.
因此, 如果集合是只读的, 那么这些操作符只能用于 `var` 类型的变量.
对于可变的集合, 如果是 `val` 类型的变量, 那么这些操作符会修改集合内容. 详情请参见 [集合写入操作](collection-write.html).
