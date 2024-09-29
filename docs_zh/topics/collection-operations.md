[//]: # (title: 集合操作概述)

最终更新: %latestDocDate%

Kotlin 标准库提供了大量的函数用来在集合上进行各种操作.
包括简单的操作, 比如获取元素, 添加元素,
以及更复杂的操作, 比如查找, 排序, 过滤(Filtering), 变换(Transformation), 等等.  

## 扩展函数与成员函数

标准库中定义的操作有两类: 集合接口的 [成员函数](classes.md#class-members), 以及 [扩展函数](extensions.md#extension-functions).

成员函数定义了的集合类型的基本操作. 比如,
[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html)
包含函数
[`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)
用来检查集合是否为空;
[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)
包含
[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)
函数, 用于按下标访问元素, 等等.

当你自己实现集合接口时, 你必须实现集合的成员函数.
为了更简单地实现集合, 你可以使用标准库中集合接口的框架实现类:
[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html),
[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html),
[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html),
[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html),
以及与它们对应的可变集合类.

其他集合操作声明为扩展函数.
包括过滤, 变换, 排序, 以及其他的集合处理函数.

## 共通操作

共通操作对 [只读和可变集合](collections-overview.md#collection-types) 都有效.
共通操作包括以下几组:

* [变换](collection-transformations.md)
* [过滤](collection-filtering.md)
* [加法和减法操作符](collection-plus-minus.md)
* [分组](collection-grouping.md)
* [截取集合中的一部分](collection-parts.md)
* [取得集合中的单个元素](collection-elements.md)
* [排序](collection-ordering.md)
* [聚合操作](collection-aggregate.md)

这些章节中介绍的集合操作返回的结果不会影响原来的集合.
比如, 过滤操作会产生一个 _新集合_, 其中包含符合过滤条件的所有元素.
因此, 这些操作的结果需要保存在变量中, 或者通过其他方式使用, 比如作为参数传递给其他函数.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // `numbers` 不会受影响, 过滤结果会丢失
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // 过滤结果保存在变量 `longerThan3` 中
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对某些集合操作, 可以指定 _目标_ 对象.
这里的目标集合是一个可变的集合, 集合操作函数会将结果添加到目标集合中, 而不是创建新的集合作为返回值.
要使用目标集合来进行操作, 需要使用其他函数, 函数名带有 `To` 后缀,
比如, 要使用
[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html)
而不是
[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html),
或者使用
[`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html)
而不是
[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html).
这些函数接受一个额外的参数来指定目标集合.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  // 目标集合
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // 目标集合中包含两次操作的全部结果
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

为了方便使用, 这些函数会将目标集合作为返回值,
因此你可以在调用这些函数的参数中直接创建目标函数的实例:

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    // 过滤 numbers, 结果直接保存到一个新创建的 hash set,
    // 因此, 结果中重复的数字会被删除
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

带目标集合的函数可以用来执行过滤, 关联(associate), 分组, 压扁(flatten), 以及其他操作.
关于带目标集合的所有操作, 请参见
[Kotlin 集合 API 文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html).

## 写入操作

对于可变的集合, 还有 _写操作_ 可以改变集合的状态. 这类写操作包括添加元素, 删除元素, 以及变更元素.
关于写入操作的详情, 请参见 [集合写入操作](collection-write.md),
以及 [List 相关操作](list-operations.md#list-write-operations)
和 [Set 相关操作](map-operations.md#map-write-operations) 中对应的章节.

对于特定的写入操作, 存在一对函数用来执行相同的操作:
一个函数直接在原来的集合上进行变更, 另一个则将变更后的结果作为新的集合返回, 而不影响原来的集合.
比如,
[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)
函数直接对一个可变集合进行排序, 因此集合状态会发生变化;
而
[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html)
函数则会创建一个新的集合, 其中包含相同的元素排序后的结果, 而原来的集合不会变化.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // 结果为 false
    numbers.sort()
    println(numbers == sortedNumbers)  // 结果为 true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
