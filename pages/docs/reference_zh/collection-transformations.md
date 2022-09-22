---
type: doc
layout: reference
category: "集合"
title: "集合变换操作"
---

# 集合变换(Transformation)操作

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 标准库提供了一组扩展函数用于集合的 _变换(Transformation)_.
这些函数会使用指定的变换规则从原集合创建新的集合.
本节中, 我们概要介绍集合的这些变换函数.

## 映射(Mapping)

_映射(Mapping)_ 变换, 会将集合的每个元素传递给一个函数, 然后用函数结果创建一个新的集合.
最基本的映射函数是
[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html).
它将每个元素传递给指定的 lambda 函数, 然后用 lambda 函数返回的结果创建一个 list.
结果的顺序与原集合中的元素顺序相同.
如果变换时还需要元素下标参数, 请使用
[`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)
函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
</div>

如果对某些元素变换的结果是 `null`, 你可以将这些 `null` 值从结果集合中过滤掉,
方法是使用
[`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)
函数代替 `map()` 函数,
或者相应的使用
[`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html)
函数代替 `mapIndexed()` 函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value -> if (idx == 0) null else value * idx })
//sampleEnd
}
```
</div>

对 map 进行变换时, 有两种选择: 只变换键(key), 不改变值(value), 或者相反.
如果要对键(key)进行指定的变换, 请使用
[`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)
函数;
相应的, 如果要变换值(value), 请使用
[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html)
函数.
这两个函数使用的变换函数参数都是 map 条目(entry), 因此在变换函数中你可以同时操作键(key)和值(value).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })
//sampleEnd
}
```
</div>

## 合并(Zipping)

_合并(Zipping)_ 变换, 将两个集合中相同位置的元素合并为 pair.
Kotlin 标准库中, 这个操作使用
[`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html)
扩展函数实现.

可以对一个集合或数组调用 `zip()` 函数, 参数是另一个集合(或数组), 返回值是 `Pair` 对象构成的 `List`.
接受者对象集合中的元素, 将成为这些 pair 中的第一个元素.

如果两个集合的大小不同, `zip()` 返回的结果只包含较小的那个集合大小;
较大的集合中的末尾元素不会出现在结果中.

`zip()` 也可以使用中缀形式调用, 也就是 `a zip b`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))
//sampleEnd
}
```
</div>

调用 `zip()` 时也可以使用变换函数, 变换函数接受两个参数:
一个是接受者集合中的元素, 另一个是参数集合中的元素.
这时, 结果 `List` 中包含的将是,
使用接受者集合和参数集合相同位置的一对元素, 调用变换函数后返回的结果值.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal -> "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})
//sampleEnd
}
```
</div>

如果已有 `Pair` 构成的 `List`, 你可以做相反的变换 – _分离(unzipping)_ – 它会通过这些 pair 创建两个 list:

* 第一个 list 包含原 `List` 的每个 `Pair` 中的第一个元素.
* 第二个 list 包含 `Pair` 中的第二个元素.

要分离 pair 构成的 list, 请使用
[`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)
函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())
//sampleEnd
}
```
</div>

## 关联(Association)

_关联(Association)_ 变换, 可以使用指定集合的元素以及与各元素对应的值创建 map.
在不同的关联类型中, 原集合的元素可以是结果 map 中的键(key), 也可以是值(value).

基本的关联函数
[`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html)
会创建一个 `Map`,
原集合的元素成为它的键(key), 值(value)由一个变换函数通过这些元素计算得到.
如果两个元素相等, 那么只有后一个会保留在 map 中.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
</div>

如果要把集合元素变换为 map 中的值(value), 请使用
[`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)
函数.
它的参数是一个函数, 这个函数根据元素值返回一个键(key).
如果两个元素的 Key 相等, 那么只有后一个会保留在 map 中.

调用 `associateBy()` 时, 也可以指定一个值变换函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))
//sampleEnd
}
```
</div>

构建 map 的另一种方法是
[`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)
函数, 它根据集合元素通过某种方法同时产生键(key)和值(value).
这个函数的参数是一个 lambda 函数, lambda 函数返回一个 `Pair`: 其中包含对应的 map 条目(entry) 的键(key)和值(value).

注意, `associate()` 产生的是临时存在(short-living)的 `Pair` 对象, 可能会影响性能.
因此, 只有性能问题不是很关键, 或者它比其他方式更合理的情况下, 才应该使用 `associate()` 函数.

后一种情况的例子是, 如果需要从集合元素同时产生键(key)和对应的值(value), 那么就应该使用 `associate()` 函数了.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

//sampleStart
    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name -> parseFullName(name).let { it.lastName to it.firstName } })  
//sampleEnd
}
```
</div>

这个示例中, 我们首先对元素调用一个变换函数, 然后根据变换函数结果的属性创建一个 pair.

## 扁平化(Flattening)

标准库提供了对嵌套集合(nested collection)的元素进行扁平化访问(flat access)的函数,
对于嵌套集合(nested collection)的操作非常便利.

第一个函数是
[`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html).
可以对一个集合的集合调用这个函数, 比如, `Set` 构成的 `List`.
这个函数返回单个 `List`, 其中包含嵌套集合中的所有元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
</div>

另一个函数 –
[`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html)
提供了一种灵活的方式来处理嵌套集合.
它的参数是一个函数, 负责将集合中的一个元素变换为另一个集合.
`flatMap()` 的结果返回单个 list, 其中包括对原集合各个元素调用变换函数后返回的集合中的所有元素.
因此, `flatMap()` 的行为等于调用 `map()` (映射(Mapping)的结果是一个集合) 之后再调用 `flatten()`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

data class StringContainer(val values: List<String>)

fun main() {
//sampleStart
    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })
//sampleEnd
}
```
</div>

## 字符串表达(String representation)

如果你需要将集合内容表达为人类可读的格式, 请使用将集合转换为字符串的函数:
[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html)
和
[`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html).

`joinToString()` 根据指定的参数, 从集合元素创建单个 `String`.
`joinTo()` 执行同样的功能, 但把结果添加到指定的
[`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html)
对象中.

如果使用默认参数调用这些函数, 返回的结果与对集合调用 `toString()` 函数类似:
由各个元素的字符串表达组成的 `String`, 元素之间以逗号加空格分隔.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers)         
    println(numbers.joinToString())

    val listString = StringBuffer("The list of numbers: ")
    numbers.joinTo(listString)
    println(listString)
//sampleEnd
}
```
</div>

如果要创建自定义的字符串表达, 可以指定函数参数 `separator`, `prefix`, 以及 `postfix`.
结果字符串以 `prefix` 开始, 以 `postfix` 结尾.
`separator` 会出现在每个元素之后, 最后一个元素除外.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
</div>

对比较大的集合, 你可能需要指定 `limit` – 结果中包含的最大元素个数.
如果集合大小超过 `limit` 值, 所有超过的元素会被替换为 `truncated` 参数指定的值.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
```
</div>

最后, 如果要控制集合元素本身的字符串表达, 可以指定一个 `transform` 函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})
//sampleEnd
}
```
</div>
