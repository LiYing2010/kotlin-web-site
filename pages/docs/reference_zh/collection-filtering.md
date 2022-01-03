---
type: doc
layout: reference
category: "集合"
title: "过滤(Filtering)集合"
---

# 过滤(Filtering)集合

本页面最终更新: 2021/10/15

在对集合的处理中, 过滤是最常见的任务之一.
Kotlin 中, 过滤条件使用 _判定条件(predicate)_ 来表示 –
它是一个 lambda 函数, 接受的参数是集合元素, 返回结果是布尔值:
`true` 代表这个元素满足判定条件, `false` 表示不满足判定条件.

标准库提供了一组扩展函数, 你可以只通过一次函数调用就能过滤集合.
这些函数不修改原来的集合, 因此对 [可变集合和只读集合](collections-overview.html#collection-types) 都可以使用.
要操作过滤后的结果集合, 你应该将它赋值给一个变量, 或者在过滤之后链式调用其他函数.

## 使用判定条件进行过滤

最基本的过滤函数是
[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html).
调用这个函数时使用判定条件作为参数, `filter()` 函数会返回集合中满足这个判定条件的元素.
对于 `List` 和 `Set`, 结果集合都是 `List`, 对于 `Map`, 结果集合也是 `Map`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
</div>

在 `filter()` 函数的判定条件中, 只能检查元素的值.
如果在过滤时还想使用元素的位置, 请使用
[`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)
函数.
这个函数的判定条件接受两个参数: 第一个是元素下标, 第二个是元素值.

如果要按照相反的条件来过滤集合, 请使用
[`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)
函数.
它返回判定条件结果为 `false` 的元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val filteredIdx = numbers.filterIndexed { index, s -> (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)
//sampleEnd
}
```
</div>

还有一些函数, 可以根据元素的类型进行过滤, 得到元素类型缩窄后的集合:

* [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)
  函数返回指定类型的集合元素.
  对 `List<Any>` 调用这个函数时, `filterIsInstance<T>()` 返回的结果集合类型为 `List<T>`,
  因此你可以对结果集合的元素调用类型 `T` 的函数.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("All String elements in upper case:")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }
    //sampleEnd
    }
    ```
    </div>

* [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html)
  函数返回不为 null 的元素.
  对 `List<T?>` 调用这个函数时, `filterNotNull()` 返回的结果集合类型为 `List<T: Any>`,
  因此你可以将结果集合的元素作为不为 null 的对象进行处理.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // 对于可为 null 的 String, length 属性是不可访问的
        }
    //sampleEnd
    }
    ```
    </div>

## 划分(Partition)

另一个过滤函数 –
[`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html)
– 根据一个判定条件过滤集合, 并把不满足判定条件的元素保存到另一个 list 中.
因此从返回值可以得到两个 `List` 构成的 `Pair`: 第一个 list 包含满足判定条件的元素, 第二个包含原集合中的所有其他元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)
//sampleEnd
}
```
</div>

## 验证判定条件

最后, 还有一些函数用来对集合验证某个判定条件:

* (https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html)
  函数, 如果至少存在一个元素满足指定的判定条件, 则返回 `true`.
* [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html)
  函数, 如果不存在任何元素满足指定的判定条件, 则返回 `true`.
* [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html)
  函数, 如果所有的元素全部满足指定的判定条件, 则返回 `true`.
  注意, 如果对空集合使用任何合法的判定条件调用 `all()`, 会返回 `true`.
  这个结果在逻辑学上叫做 _[虚空真(vacuous truth)](https://en.wikipedia.org/wiki/Vacuous_truth)_.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth
//sampleEnd
}
```
</div>

`any()` 和 `none()` 函数也可以不指定判定条件: 这种情况下它们只检查集合是否为空.
如果集合中存在元素, 则 `any()` 返回 `true`, 集合中没有元素, 则 `false`; `none()` 的返回值刚好与此相反.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())

    println(numbers.none())
    println(empty.none())
//sampleEnd
}
```
</div>
