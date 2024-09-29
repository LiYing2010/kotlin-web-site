[//]: # (title: 排序(Ordering))

最终更新: %latestDocDate%

对于一些集合类型来说, 元素的排序是非常重要的问题.
比如, 包含相同元素的两个 list, 如果元素顺序不同, 会被认为不相等.

在 Kotlin 中, 对象之间的顺序可以通过几种不同的方式来定义.

首先, 有 _自然(natural)_ 排序. 这个概念是指
[`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
接口的实现类.
对于这些类来说, 如果不指定其他排序方式, 则默认使用自然顺序.

Kotlin 的大多数内建数据类型都是可比较大小的:

* 数值(Numeric)类型使用数学上的大小顺序: `1` 大于 `0`; `-3.4f` 大于 `-5f`, 等等.
* `Char` 和 `String` 使用 [字典顺序(lexicographical order)](https://en.wikipedia.org/wiki/Lexicographical_order):
  `b` 大于 `a`; `world` 大于 `hello`.

对于用户自定义的类型, 想要定义自然顺序, 需要让这个类型实现 `Comparable` 接口.
因此需要实现 `compareTo()` 函数. `compareTo()` 函数的参数是相同类型的另一个对象, 返回结果是一个整数, 表示两个对象哪个更大:

* 正的整数值表示 `compareTo()` 函数的接受者对象比参数对象大.
* 负的整数值表示 `compareTo()` 函数的接受者对象比参数对象小.
* 0 表示两个对象相等.

下面是一个有排序能力的版本号类, 由 major 和 minor 两部分组成.

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // 这里是 compareTo() 函数的中缀调用形式
        this.minor != other.minor -> this.minor compareTo other.minor
        else -> 0
    }
}

fun main() {
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

另一种排序方式称为 _自定义(Custom)_ 排序, 你可以对任何类型的实例以任意的方式进行排序.
具体来说, 你可以对不可比较的对象定义顺序, 也可以对可比较的对象定义与自然顺序不同的另一种顺序.
要对一个类型定义自定义顺序, 需要为它创建一个
[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html).
`Comparator` 包含 `compare()` 函数: 它的参数是同一个类的两个实例, 返回一个整数, 代表它们的比较结果.
返回值代表的含义与上面介绍的 `compareTo()` 函数相同.

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有了 `lengthComparator`, 我们可以对字符串按照长度来排序, 而不是按照默认的字典顺序排序.

定义 `Comparator` 的一种简便方式是标准库提供的
[`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html)
函数.
`compareBy()` 函数的参数是一个 lambda 函数,
这个 lambda 函数负责将一个对象实例变换为一个 `Comparable` 值,
自定义排序的结果就是这个 `Comparable` 值的自然顺序.

使用 `compareBy()` 函数, 前面例子中的字符串长度比较器可以写成下面这样:

```kotlin
fun main() {
//sampleStart
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Kotlin 集合包提供了用于集合排序的各种函数, 可以使用自然顺序, 自定义顺序, 甚至随机顺序.
本节中, 我们会介绍适用于 [只读](collections-overview.md#collection-types) 集合的排序函数.
这些函数的返回结果是一个新集合, 其中包含原集合的元素按照指定顺序排序后的结果.
对 [可变](collections-overview.md#collection-types) 集合进行原地(in place)排序的函数,
请参见 [List 相关操作](list-operations.md#sort).

## 使用自然顺序排序 {id="natural-order"}

最基本的
[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)
和
[`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)
函数, 返回新的集合, 其中的元素分别使用自然顺序的正序和逆序排序.
这些函数适用于 `Comparable` 元素组成的集合.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 使用自定义顺序排序

如果要使用自定义顺序排序, 或者对不可比较的对象排序, 可以使用
[`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html)
和
[`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)
函数.
这些函数的参数是一个选择器函数, 负责将集合元素变换为 `Comparable` 值, 然后再按照这些 `Comparable` 值的自然顺序对集合进行排序.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要对集合排序指定一个自定义顺序, 你可以提供一个自己的 `Comparator`.
为了实现这个目的, 可以调用
[`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html)
函数, 并使用你的 `Comparator` 作为参数.
使用这个函数对字符串按照长度排序的示例如下:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 逆序集合

可以按照相反的顺序访问集合, 方法是使用
[`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html)
函数.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`reversed()` 函数的返回值是一个新的集合, 其中复制了原集合中的所有元素.
因此, 如果之后改变了原元集合的内容, 不会影响到之前通过 `reversed()` 函数得到的结果.

另一个逆序函数 -
[`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) -
返回原 List 的一个逆序的视图(view),
因此, 如果原 List 不会改变, 那么这个函数可能比 `reversed()` 函数更轻量, 更适用.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果原 List 是可变的, 那么它的所有修改都会影响它的逆序视图, 反过来也是如此.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

但是, 如果不知道 List 是否可变, 或者原集合根本不是 List,
那么更适用使用 `reversed()` 函数, 因为它的结果是原集合的一个复制, 内容不会随原集合一起改变.

## 随机排序

最后, 还有一个函数, 它返回一个新的 `List`, 其中的元素按照随机顺序排列 -
[`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)
函数.
调用时可以不带参数, 或指定一个
[`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)
对象作为参数.

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
