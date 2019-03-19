---
type: doc
layout: reference
category: "Syntax"
title: "值范围(Range)"
---

# 值范围(Range)

值范围表达式使用 `rangeTo` 函数来构造, 这个函数的操作符形式是 `..`, 另外还有两个相关操作符 *in*{: .keyword } 和 *!in*{: .keyword }.
任何可比较大小的数据类型(comparable type)都可以定义值范围, 但对于整数性的基本类型, 值范围的实现进行了特殊的优化. 下面是使用值范围的一些示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if (i in 1..10) { // 等价于: 1 <= i && i <= 10
    println(i)
}
```

</div>

整数性的值范围(`IntRange`, `LongRange`, `CharRange`) 还有一种额外的功能: 可以对这些值范围进行遍历.
编译器会负责将这些代码变换为 Java 中基于下标的 *for*{: .keyword } 循环, 不会产生不必要的性能损耗:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
for (i in 1..4) print(i)
//sampleEnd
}
```

</div>

如果你需要按反序遍历整数, 应该怎么办? 很简单. 你可以使用标准库中的 `downTo()` 函数:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
for (i in 4 downTo 1) print(i)
//sampleEnd
}
```

</div>

可不可以使用 1 以外的任意步长来遍历整数? 没问题, `step()` 函数可以帮你实现:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
for (i in 1..4 step 2) print(i)

for (i in 4 downTo 1 step 2) print(i)
//sampleEnd
}
```

</div>

要创建一个不包含其末尾元素的值范围, 可以使用 `until` 函数:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
for (i in 1 until 10) {
     // i in [1, 10), 不包含 10
     println(i)
}
//sampleEnd
}
```

</div>

## 值范围的工作原理

值范围实现了标准库中的一个共通接口: `ClosedRange<T>`.

`ClosedRange<T>` 表示数学上的一个闭区间(closed interval), 由可比较大小的数据类型(comparable type)构成.
这个区间包括两个端点: `start` 和 `endInclusive`, 这两个端点的值都包含在值范围内.
主要的操作是 `contains`, 主要通过 *in*{: .keyword }/*!in*{: .keyword } 操作符的形式来调用.

整数性类型的数列(`IntProgression`, `LongProgression`, `CharProgression`) 代表算术上的一个整数数列.
数列由 `first` 元素, `last` 元素, 以及一个非 0 的 `step` 来定义.
第一个元素就是 `first`, 后续的所有元素等于前一个元素加上 `step`. 除非数列为空, 否则遍历数列时一定会到达 `last` 元素.

数列是 `Iterable<N>` 的子类型, 这里的 `N` 分别代表 `Int`, `Long` 和 `Char`, 因此数列可以用在 *for*{: .keyword } 循环内, 还可以用于 `map` 函数, `filter` 函数, 等等.
在 `step` 为正数的 `Progression` 上的遍历等价于 Java/JavaScript 中基于下标的 *for*{: .keyword } 循环:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

</div>

对于整数性类型, `..` 操作符将会创建一个实现了 `ClosedRange<T>` 和 `*Progression` 接口的对象.
比如, `IntRange` 实现了 `ClosedRange<Int>`, 并继承 `IntProgression` 类, 因此 `IntProgression` 上定义的所有操作对于 `IntRange` 都有效.
`downTo()` 和 `step()` 函数的结果永远是一个 `*Progression`.

要构造一个数列, 可以使用对应的类的同伴对象中定义的 `fromClosedRange` 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
IntProgression.fromClosedRange(start, end, step)
```

</div>

数列的 `last` 元素会自动计算, 对于 `step` 为正数的情况, 会求得一个不大于 `end` 的最大值, 对于 `step` 为负数的情况, 会求得一个不小于 `end` 的最小值, 并且使得 `(last - first) % step == 0`.



## 工具函数

### `rangeTo()`

整数性类型上定义的 `rangeTo()` 操作符只是简单地调用 `*Range` 类的构造器, 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Int {
    //...
    operator fun rangeTo(other: Long): LongRange = LongRange(this, other)
    //...
    operator fun rangeTo(other: Int): IntRange = IntRange(this, other)
    //...
}
```

</div>

浮点型数值(`Double`, `Float`) 的 `rangeTo` 操作符返回一个值范围, 这个值范围在将一个数值与自己的范围边界进行比较时, [遵照 IEEE-754 标准](basic-types.html#floating-point-numbers-comparison).
这个操作符返回的值范围不是一个数列, 不能用来遍历.

### `downTo()`

`downTo()` 扩展函数可用于一对整数类型值, 下面是两个例子:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun Long.downTo(other: Int): LongProgression {
    return LongProgression.fromClosedRange(this, other.toLong(), -1L)
}

fun Byte.downTo(other: Int): IntProgression {
    return IntProgression.fromClosedRange(this.toInt(), other, -1)
}
```

</div>

### `reversed()`

对每个 `*Progression` 类都定义了 `reversed()` 扩展函数, 所有这些函数都会返回相反的数列:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun IntProgression.reversed(): IntProgression {
    return IntProgression.fromClosedRange(last, first, -step)
}
```

</div>

### `step()`

对每个 `*Progression`  类都定义了 `step()` 扩展函数, 所有这些函数都会返回使用新 `step` 值(由函数参数指定)的数列.
步长值参数要求永远是正数, 因此这个函数不会改变数列遍历的方向:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun IntProgression.step(step: Int): IntProgression {
    if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
    return IntProgression.fromClosedRange(first, last, if (this.step > 0) step else -step)
}

fun CharProgression.step(step: Int): CharProgression {
    if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
    return CharProgression.fromClosedRange(first, last, if (this.step > 0) step else -step)
}
```

</div>

注意, 函数返回的数列的 `last` 值可能会与原始数列的 `last` 值不同, 这是为了保证 `(last - first) % step == 0` 原则. 下面是一个例子:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
(1..12 step 2).last == 11  // 数列中的元素为 [1, 3, 5, 7, 9, 11]
(1..12 step 3).last == 10  // 数列中的元素为 [1, 4, 7, 10]
(1..12 step 4).last == 9   // 数列中的元素为 [1, 5, 9]
```

</div>
