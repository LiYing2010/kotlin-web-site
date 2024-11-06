[//]: # (title: 分组(Grouping))

Kotlin 标准库提供了扩展函数, 用于对集合中的元素进行分组操作.
最基本的函数是
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html),
它接受一个 lambda 函数为参数, 返回结果是一个 `Map`.
在这个 map 中, 每个键(key)是 lambda 函数的一个返回结果, 与键(key)对应的值(value) 是一个 `List`, 其中包含返回这个结果的所有元素.
这个函数的用途, 举例来说, 我们可以对一个 `String` 组成的 list, 按字符串的首字母进行分组.

调用 `groupBy()` 函数时, 也可以使用另一个 lambda 函数作为第二个参数 – 这个函数负责对值进行变换.
象这样使用两个 lambda 函数调用 `groupBy()`时, 结果 map 中, 第一个参数(`keySelector` lambda 函数)负责生成键(key),
它对应的值(value) 则是由第二个参数(值转换 lambda 函数)产生的结果组成的 list, 而不是集合中原来元素组成的 list.

下面的示例演示如何使用 `groupBy()` 函数, 根据字符串的第一个字母进行分组,
对分组结果的 `Map` 使用 `for` 操作符遍历各个组,
然后使用 `keySelector` 函数将值转换为大写:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // 使用 groupBy(), 根据字符串的第一个字母进行分组
    val groupedByFirstLetter = numbers.groupBy { it.first().uppercase() }
    println(groupedByFirstLetter)
    // 输出结果为 {O=[one], T=[two, three], F=[four, five]}

    // 遍历每个组, 输出 key 和对应的值
    for ((key, value) in groupedByFirstLetter) {
        println("Key: $key, Values: $value")
    }
    // 输出结果为
    // Key: O, Values: [one]
    // Key: T, Values: [two, three]
    // Key: F, Values: [four, five]

    // 根据字符串的第一个字母进行分组, 并将值转换为大写
    val groupedAndTransformed = numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() })
    println(groupedAndTransformed)
    // 输出结果为 {o=[ONE], t=[TWO, THREE], f=[FOUR, FIVE]}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果你希望对元素分组, 同时对所有的分组结果执行某个操作, 可以使用
[`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)
函数.
这个函数返回一个
[`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html)
类型的实例.
这个 `Grouping` 实例可以用来对所有分组结果以 lazy 模式执行操作: 只有在操作执行之前才会真正创建分组结果.

`Grouping` 支持以下操作:

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html)
  函数, 计算每个分组结果中的元素个数.
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)
  和
  [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
  函数, 将每个分组结果作为独立的集合,
  执行 [折叠(fold) 与 简化(reduce)](collection-aggregate.md#fold-and-reduce) 操作,
  并返回结果.
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html)
  函数, 对每个分组结果中的所有元素反复执行指定的操作, 并返回最后结果.
  这是对 `Grouping` 执行任意操作的通用方式. 如果 折叠(fold) 与 简化(reduce) 不能满足你的需求, 可以用这种方式实现自定义的操作.

你可以对分组结果的 `Map` 使用 `for` 操作符, 来遍历 `groupingBy()` 函数创建的各个组.
这样就可以访问每个 key , 以及这个 key 关联的元素个数.

下面的示例演示如何使用 `groupingBy()` 函数, 根据字符串的第一个字母进行分组,
计算每个组中的元素, 然后遍历遍历各个组, 输出 key 和对应的元素个数:

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // 使用 groupingBy(), 根据字符串的第一个字母进行分组, 并计算每个组中的元素个数
    val grouped = numbers.groupingBy { it.first() }.eachCount()

    // 遍历每个组, 输出 key 和对应的值
    for ((key, count) in grouped) {
        println("Key: $key, Count: $count")
        // 输出结果为
        // Key: o, Count: 1
        // Key: t, Count: 2
        // Key: f, Count: 2
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
