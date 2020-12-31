---
type: doc
layout: reference
category: "集合"
title: "集合(Collection)概述"
---

# Kotlin 集合概述

Kotlin 标准库提供了丰富的工具用来管理 _集合(Collection)_ – 数量可变的一组项目 (数量允许为 0), 这些集合对于解决我们的问题都非常重要, 而且使用类似的方式进行操作.

对大多数编程语言来说, 集合都是共通的概念, 所以如果你已经熟悉其他编程语言(比如 Java 或 Python)的集合,
那么你可以跳过这部分关于集合的介绍, 直接阅读后面的关于集合细节的章节.

集合通常包含一定数量的类型相同的对象(数量可以为 0). 集合中的对象称为 _元素(element)_ 或 _项目(item)_.
比如, 一个系的所有学生组成一个集合, 这个集合可以用来计算他们的平均年龄.
以下是 Kotlin 中的集合类型:

* _List_ 是一个有顺序的集合, 通过下标来访问 – 下标是指反映元素位置的整数. 在一个 list 中相同的元素可以出现多次. list 的例子是一个句子: 它由许多单词组成, 单词的顺序很重要, 而且单词允许重复.
* _Set_ 是由不重复的元素构成的集合. 它表示数学上的一个集(set): 一组不重复的对象. set 元素的顺序通常不重要. 例如, 字母表就是由字母构成的 set.
* _Map_ (或者叫 _dictionary_) 是由成对的 键(key)-值(value) 构成的 set. 键(key)是不重复的, 并且每个键(key)对应一个值(value). 值(value)可以重复.
Map 适合于存储对象之间的逻辑关联, 比如, 员工 ID 和他们职位之间的对应关系.

Kotlin 提供的集合操作功能, 与集合中元素的具体数据类型无关.
也就是说, 你可以将一个 `String` 元素添加到 `String` 组成的 list 中, 操作方法与 `Int` 组成的 list 完全相同, 与自定义类型组成的 list 也完全相同.
为此目的, Kotlin 标准库提供了泛型的接口, 类, 和函数, 可用于创建, 填充, 和管理任何数据类型组成的集合.

集合接口和相关的函数存放在 kotlin.collections 包之下. 下面我们大致介绍其中的内容.

## 集合类型

Kotlin 标准库实现了基本的集合类型: set, list, 以及 map.
下面的每一对接口代表一种集合类型:

* 一个 _只读(read-only)_ 接口, 提供对集合元素的访问操作.
* 一个 _可变(mutable)_ 接口, 继承对应的只读接口, 另外增加了写操作: 添加, 删除, 以及更新集合元素.

注意, 修改一个可变集合的内容, 并不要求集合变量本身声明为 [`var`](basic-syntax.html#defining-variables):
写操作修改的只是可变集合对象中存储的元素, 集合对象仍然是同一个对象, 因此指向它的引用仍然保持不变.
但是, 如果你想要对 `val` 类型的集合重新赋值, 会发生编译错误.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // 这是可以的    
    //numbers = mutableListOf("six", "seven")      // 编译错误
//sampleEnd
}
```

</div>

只读的集合类型是 [协变的(covariant)](generics.html#variance).
也就是说, 假设 `Rectangle` 类继承自 `Shape` 类, 那么在任何需要 `List<Shape>` 的地方你都可以使用 `List<Rectangle>`.
换句话说, 集合类型之间的父类型-子类型关系, 与集合中的元素类型之间的父类型-子类型关系相同.
Map 类型对于它的值(value)的数据类型是协变的(covariant), 但对它的键(key)的数据类型不是.

与此相反, 可变集合不是协变的(covariant); 否则, 可能会导致运行时错误.
如果我们允许 `MutableList<Rectangle>` 成为 `MutableList<Shape>` 的子类型, 那么你可以向其中添加 `Shape` 的其他子类(比如, `Circle`),
这样就违反了元素类型必须为 `Rectangle` 的类型约束.

下面是 Kotlin 集合接口之间的继承关系图:

![集合接口继承关系图]({{ url_for('asset', path='images/reference/collections-overview/collections-diagram.png') }})

下面我们来介绍这些接口, 以及他们的实现.

### Collection

[`Collection<T>`](/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 是集合类型的最高层根接口.
这个接口表达只读集合的共通行为: 得到集合大小, 检查元素是否属于集合, 等等.
`Collection` 继承自 `Iterable<T>` 接口, 这个接口定义了在元素上遍历的操作.
如果你的函数适用于各种不同的集合类型, 你可以适用 `Collection` 作为参数类型.
如果你的函数只能处理更具体的情况, 请使用 `Collection` 的子接口: [`List`](/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 和 [`Set`](/api/latest/jvm/stdlib/kotlin.collections/-set/index.html).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun printAll(strings: Collection<String>) {
        for(s in strings) print("$s ")
        println()
    }

fun main() {
    val stringList = listOf("one", "two", "one")
    printAll(stringList)

    val stringSet = setOf("one", "two", "three")
    printAll(stringSet)
}
```
</div>

[`MutableCollection`](/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html) 继承了 `Collection`, 并添加了元素的写操作,
比如 `add` 和 `remove`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // 删除冠词(article)
    val articles = setOf("a", "A", "an", "An", "the", "The")
    shortWords -= articles
}

fun main() {
    val words = "A long time ago in a galaxy far far away".split(" ")
    val shortWords = mutableListOf<String>()
    words.getShortWordsTo(shortWords, 3)
    println(shortWords)
}

```
</div>

### List

[`List<T>`](/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 按指定的顺序存储元素, 并使用下标来访问元素.
下标从 0 开始 – 0 是第一个元素的下标 – 直到 `lastIndex` 为止, `lastIndex` 的值等于 `(list.size - 1)`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")
//sampleEnd
}
```
</div>

List 中的元素 (包括 null) 允许重复: list 可以包含任意数量的相等对象, 也允许同一个对象多次出现.
如果两个 list 的元素数量相同, 并且相同位置的元素全都 [结构相等(structurally equal)](equality.html#structural-equality), 那么这两个 list 被认为是相等的.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
data class Person(var name: String, var age: Int)

fun main() {
//sampleStart
    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)
//sampleEnd
}
```
</div>

[`MutableList<T>`](/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) 继承了 `List`, 并添加了 list 专有的写操作,
比如, 在指定的位置添加或删除元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
```
</div>

你可以看到, 从某些角度看 list 与数组(array)非常类似.
但是, 它们之间存在一个重要的区别: 数组的大小是在初始化时固定的, 而且永远不能改变; 而 list 没有预定的大小; list 的大小可以通过写操作来改变: 添加, 更新, 或删除元素.

在 Kotlin 中, `List` 的默认实现是 [`ArrayList`](/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html), 你可以把它看作是一个可以改变大小的数组.

### Set

[`Set<T>`](/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) 存储不重复的元素; 元素的顺序通常是无定义的. `null` 也算是不重复的元素:
`Set` 可以只包含一个 `null`.
如果两个 set 的元素数量相同, 并且一个 set 中的任何一个元素都在另一个 set 中存在一个相等的元素, 那么这两个 set 被看作是相等的.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")
//sampleEnd
}
```
</div>

[`MutableSet`](/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) 继承自 `Set`, 并添加了继承自 `MutableCollection` 的写操作.

`Set` 的默认实现是 [`LinkedHashSet`](/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html) – 它会保留元素插入的顺序.
因此, 依赖于元素顺序的那些函数, 比如 `first()` 或 `last()`, 在这些 set 上会返回可预测的结果.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // 默认实现是 LinkedHashSet
    val numbersBackwards = setOf(4, 3, 2, 1)

    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
</div>

另一个替代实现 – [`HashSet`](/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html) – 对元素顺序不做任何保证,
因此对它调用这些函数会返回不可预知的结果. 但是, 存储相同数量的元素时, `HashSet` 消耗的内存更少.

### Map

[`Map<K, V>`](/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) 不继承自 `Collection` 接口; 但它仍然是 Kotlin 的集合类型.
`Map` 存储成对的 _键(key)-值(value)_ (或者叫 _条目(entry)_); 键(key)是不可重复的, 但不同的键(key)可以对应到相等的值(value).
`Map` 接口提供了专用的函数, 比如根据指定的键(key)来得到对应的值(value), 查找键(key)和值(value), 等等.  

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)

    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // 结果与上面相同
//sampleEnd
}
```
</div>

如果两个 map 包含相等的 键(key)-值(value) 对, 那么这两个 map 被看作是相等的, 无论键(key)-值(value) 对的顺序如何.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)

    println("The maps are equal: ${numbersMap == anotherMap}")
//sampleEnd
}
```
</div>

[`MutableMap`](/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) 继承自 `Map`, 添加了 map 专有的写操作,
比如, 你可以添加新的键(key)-值(value) 对, 或者对指定的键(key)更新它对应的值(value).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)
//sampleEnd
}
```
</div>

`Map` 默认实现是 [`LinkedHashMap`](/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html) – 它会在遍历 map 元素时使用元素插入时的顺序.
与此相反, 另一个替代实现 – [`HashMap`](/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) – 对元素顺序不做任何保证.
