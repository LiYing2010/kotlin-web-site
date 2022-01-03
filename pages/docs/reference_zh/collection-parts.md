---
type: doc
layout: reference
category: "集合"
title: "获取集合的一部分"
---

# 获取集合的一部分

本页面最终更新: 2022/02/03

Kotlin 标准库包含扩展函数可以用来截取集合中的一部分.
这些函数提供了几种不同的方式来选择结果集合中的元素:
明确指定元素的下标, 或指定结果集合大小, 以及其他方法.

## 切片(Slice)

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html)
函数返回一个 list, 其中包含集合中某些下标的元素.
下标可以通过一个 [range](ranges.html) 或一个整数值的集合来指定.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    
//sampleEnd
}
```
</div>

## 提取(Take) 和 抛弃(Drop)

要从集合头部开始取得指定数量的元素, 可以使用
[`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html)
函数.
要从集合尾部开始取得指定数量的元素, 可以使用
[`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)
函数.
如果参数中指定的期望取得元素数量超过集合大小, 那么这两个函数都会返回整个集合.  

如果要从集合头部或尾部开始, 抛弃指定数量的元素, 并取得剩余的元素, 可以使用
[`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)
和
[`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html)
函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))
//sampleEnd
}
```
</div>

也可以使用判定条件(predicate)来决定取得或抛弃的元素数量.
这类函数有以下 4 个, 与上面介绍的函数类似:

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html)
  等于使用判定条件的 `take()`:
  这个函数从集合头部开始查找, 找到第一个不满足判定条件的元素, 并获取在它之前的所有元素(但不含这个元素).
  如果集合的第一个元素不满足判定条件, 那么结果为空.
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html)
  与 `takeLast()` 类似:
  这个函数从集合尾部开始获取一个的满足判定条件的连续区间内的元素, 这个元素区间的第一个元素,
  是集合中不满足判定条件的最后一个元素之后的那个元素. 如果集合的最后一个元素不满足判定条件, 那么结果为空;
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html)
  与 `takeWhile()` 相反:
  这个函数从集合头部开始查找, 找到第一个不满足判定条件的元素, 并获取从这个元素到集合末尾的所有元素.
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html)
  与 `takeLastWhile()` 相反:
  它查找到最后一个不满足判定条件的元素, 并获取从集合头部到这个元素的所有元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })
//sampleEnd
}
```
</div>

## 分块(Chunk)

要把一个集合按照指定的大小分解为许多部分, 可以使用
[`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html)
函数.
`chunked()` 只有一个参数 – 块(chunk)的大小 – 它返回一个 `List`,
其中的元素又是 `List`, 这些 `List` 中包含指定数量的元素.
第一个块从原来集合的第一个元素开始, 包含 `size` 参数指定个数的元素,
第二个块包含之后的 `size` 参数指定个数的元素, 依此类推.
最后一个块有可能包含较少的元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
</div>

也可以立即对返回的块执行变换(transformation)操作.
这时需要通过 lambda 函数的方式指定变换操作, 并将这个 lambda 函数作为参数传递给 `chunked()` 函数.
lambda 函数本身收到的参数是集合中的一个块.
当使用变换操作参数来调用 `chunked()` 函数时,
各个块都会是临时存在(short-living) 的 `List`, 应该在 lambda 函数内读取它的内容.  

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3) { it.sum() })  // `it` 是原始集合中的一个块
//sampleEnd
}
```
</div>

## 滑动窗口(Window)

你可以指定一个大小, 然后得到集合中所有可能存在的元素区间(element range).
取得这些元素区间的函数是
[`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html):
它返回的结果是一个 list, 其中包含的内容是,
如果通过一个指定大小的滑动窗口(sliding window)来观察某个集合时, 所能看到的所有可能的元素区间(element range).
与 `chunked()` 不同,  `windowed()` 函数返回以集合中 *每个* 元素为起点的元素范围(element range) (也叫做 _窗口(window)_).
`windowed()` 函数的返回值, 就是所有这些元素范围组成的 `List`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
</div>

`windowed()` 通过可选的参数, 可以实现更加灵活的控制:

* `step` 参数指定两个相邻窗口的起始元素之间的距离.
  这个参数默认值是 1, 因此返回结果会包含每个元素开始的窗口.
  如果将窗口的移动步长增加到 2, 那么结果中的窗口都会从奇数元素开始:
  第 1 个元素, 第 3 个元素, 依此类推.
* `partialWindows` 参数, 允许结果中包含那些从集合尾部元素开始, 并且比指定大小更小的窗口.
  比如, 如果你取得大小为 3 的窗口, 那么不会创建从最末尾的 2 个元素开始的窗口.
  如果打开 `partialWindows` 选项, 那么结果中将会包含 2 个新的 list, 大小分别为 2 和 1.

最后, 可以对返回的元素范围立即执行变换(transformation)操作.
这时需要在调用 `windowed()` 函数时, 通过 lambda 函数指定变换操作.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })
//sampleEnd
}
```
</div>

如果需要创建 2 个元素的窗口, 有一个单独的函数 -
[`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html).
这个函数会将集合中邻接的元素创建为许多个 pair.
注意, `zipWithNext()` 不是将集合切断为 pair; 它会创建为 _每个_ 元素创建 `Pair`, 最末尾元素除外,
因此, 对于 `[1, 2, 3, 4]` 的返回结果是 `[[1, 2], [2, 3], [3, 4]]`, 而不是 `[[1, 2`], `[3, 4]]`.
调用 `zipWithNext()` 时也可以指定变换操作函数; 这个函数应该接受原集合中的两个元素作为自己的参数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})
//sampleEnd
}
```
</div>
