[//]: # (title: Set 相关操作)

Kotlin 的集合包中包含着很多扩展函数, 用来实现常见的 set 操作:
计算两个 set 的交集, 合并两个 set, 或者从一个 set 中减去另一个集合.

要将两个集合合并为一个, 可以使用
[`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html)
函数.
这个函数可以通过中缀的形式来调用: `a union b`.
注意, 对于有序的集合来说, 参与操作的两个集合的顺序是很重要的.
在结果集合中, 第一个集合的元素出现在第二个集合的元素之前:

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 输出结果对应于 set 中的元素顺序
    println(numbers union setOf("four", "five"))
    // 输出结果为 [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // 输出结果为 [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要计算两个集合的交集 (也就是在两个集合中同时出现的元素), 可以使用
[`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html)
函数.
要查找出现在一个集合但没有出现在另一个集合的元素, 可以使用
[`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html)
函数.
这两个函数也都可以通过中缀的形式来调用, 比如, `a intersect b`:

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 输出结果相同
    println(numbers intersect setOf("two", "one"))
    // 输出结果为 [one, two]
    println(numbers subtract setOf("three", "four"))
    // 输出结果为 [one, two]
    println(numbers subtract setOf("four", "three"))
    // 输出结果为 [one, two]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要计算出现在两个集合中的某一个之内, 但并不同时出现在两个集合之内的元素, 可以使用 `union()` 函数.
要实现这个操作(也叫做对称差异(symmetric difference)), 可以计算两个集合的差异, 然后将差异的计算结果合并起来:

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // 将两个差异结果合并
    println((numbers - numbers2) union (numbers2 - numbers))
    // 输出结果为 [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`union()`, `intersect()`, 和 `subtract()` 函数 也可以用于 List.
但是, 操作结果 _永远_ 是一个 `Set`.
在操作结果中, 所有重复的元素都会被合并为同一个, 并且不能根据下标访问元素:

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // 两个 List 的 intersect 结果是一个 Set
    println(list1 intersect list2)
    // 输出结果为 [1, 2, 3, 5]

    // 相等的元素会被合并为一个
    println(list1 union list2)
    // 输出结果为 [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
