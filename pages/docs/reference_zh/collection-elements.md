---
type: doc
layout: reference
category: "集合"
title: "获取集合的单个元素"
---

# 获取集合的单个元素

本页面最终更新: 2021/05/05

Kotlin 集合提供了一组函数, 用来获取集合中的单个元素.
本节介绍的函数同时适用于 list 和 set.

如 [List 的定义](collections-overview.html) 所说, list 是元素按顺序存储的集合.
因此, list 的每个元素都有自己的位置下标, 可以通过这个下标来访问元素.
除本节中介绍的函数之外, list 还提供了更多方法, 可以通过下标访问和查找元素.
更多细节, 请参照 [List 相关操作](list-operations.html).

相应的, 根据 [Set 的定义](collections-overview.html), set 是没有元素顺序的集合.
但是, Kotlin 的 `Set` 会按照某种顺序保存元素.
元素的保存顺序可以是它们的插入顺序 (`LinkedHashSet` 的情况), 元素的自然排列顺序(`SortedSet` 的情况), 或者其他顺序.
set 元素的顺序也可能是不可知的.
这种情况下, 元素仍然会是按照某种顺序排列的, 因此依赖于元素位置的那些函数仍然会返回某种结果.
然而, 除非函数调用者知道所使用的 `Set` 的具体实现, 否则结果是不可预知的, .

## 根据位置获取元素

要获取某个指定位置的元素, 可以使用
[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)
函数.
使用一个整数值参数调用这个函数, 将会获取集合在这个位置上的元素.
集合起始元素的位置是 `0`, 最末尾元素的位置是 `(size - 1)`.

对于没有提供按下标访问能力的集合, 或者我们不知道集合具体类型,
因此无法判断集合是否提供按下标访问能力的情况, `elementAt()` 函数是很便利的.
对于 `List` 的情况, 更符合习惯的方法是使用
[按下标访问操作符](list-operations.html#retrieve-elements-by-index) (`get()` 或 `[]`).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // 元素按照字母顺序存储
//sampleEnd
}
```
</div>

还有一些便利的别名函数, 用于获取集合的起始元素和末尾元素:
[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
和
[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
```
</div>

为了避免获取不存在的位置上的元素导致的异常, 可以使用 `elementAt()` 的更安全的变体:

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html)
  函数, 如果指定的位置越出了集合边界之外, 则返回 null.
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html)
  函数, 额外接受一个 lambda 函数作为参数, 这个 lambda 函数负责将 `Int` 参数变换为集合元素类型的一个实例.
  如果指定的位置越出了集合边界之外, `elementAtOrElse()` 函数会返回使用这个位置值调用 lambda 函数的计算结果.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "The value for index $index is undefined"})
//sampleEnd
}
```
</div>

## 根据条件获取元素

[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
和
[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
函数还允许你使用一个指定的判定条件(predicate)来搜索集合中满足条件的元素.
如果调用 `first()` 时指定一个判定条件来检查集合元素, 你会得到使得判定条件计算结果为 `true` 的第一个元素.
相应的, 如果调用 `last()` 时指定一个判定条件, 会返回满足这个判定条件的最后一个元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
```
</div>

如果没有元素满足判定条件, 这两个函数会抛出异常.
要避免异常, 请使用
[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
和
[`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)
函数: 如果没有找到满足条件的元素, 它们会返回 `null`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
</div>

这些函数还有一些别名函数, 如果函数名称更符合你的情况, 你可以使用这些别名函数:

* [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html)
  等价于 `firstOrNull()`
* [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html)
  等价于 `lastOrNull()`

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
```
</div>

## 使用选择器(selector)获取元素

如果你需要在获取元素之前对集合进行映射, 可以使用
[`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)
函数.
这个函数组合了两个操作:
- 使用选择器(selector)函数对集合进行映射
- 返回映射结果中的第一个非 null 值

如果映射后的结果集合不包含非 null 元素, `firstNotNullOf()` 会抛出 `NoSuchElementException` 异常.
这种情况下如果希望返回 null 结果, 请使用
[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
函数.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // 将所有元素转换为字符串, 并返回长度满足条件的第一个元素
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```

</div>

## 随机获取元素

如果你需要获取集合中的任何一个元素, 可以使用
[`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html)
函数.
调用这个函数时, 可以不带参数, 或者使用
[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)
对象作为随机数的产生器.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
</div>

对于空的集合, `random()` 函数会抛出异常. 如果想要得到 `null` 值, 请使用
[`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)
函数.

## 检测元素是否存在

要检查集合中是否存在某个元素, 请使用
[`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html)
函数.
如果集合中存在一个元素与函数参数相等(`equals()`), 那么它会返回 `true`.
也可以用操作符的形式调用 `contains()` 函数, 方法是使用 `in` 关键字.

如果要一次性检查多个元素是否存在, 请使用
[`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)
函数, 它的参数是需要检查的元素的集合.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)

    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))
//sampleEnd
}
```
</div>

此外, 你还可以使用
[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)
或
[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html)
函数, 检查集合中是否存在任何元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())

    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())
//sampleEnd
}
```
</div>
