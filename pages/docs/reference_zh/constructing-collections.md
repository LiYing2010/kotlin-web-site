---
type: doc
layout: reference
category: "集合"
title: "创建集合"
---

# 创建集合

本页面最终更新: 2021/11/16

## 通过指定的元素创建

创建集合最常用的方法是使用标准库中的函数
[`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html),
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html),
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html),
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html).
如果使用逗号分隔的一系列集合元素作为这些函数的参数, 编译器会自动判定元素类型.
如果要创建空的集合, 就无法从参数推断元素类型, 因此需要明确指定元素类型.

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

创建 map 的方法类似, 使用的函数是
[`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
和
[`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html).
map 的键(key) 和值(value) 通过 `Pair` 对象传递给函数
(通常使用中缀函数 `to` 来创建 键(key) 和值(value) 的 `Pair` 对象).

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

注意, 使用 `to` 这样的写法创建的是短期存在的 `Pair` 对象, 因此只有在性能问题不严重的情况下才推荐这种写法.
为避免消耗过多的内存, 可以使用其他方法. 比如, 可以创建可变的 map, 然后通过写操作向其中填充数据.
这种情况下使用 [`apply()`](scope-functions.html#apply) 函数可以让 map 的初始化过程更加流畅.

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 使用集合构建函数来创建

创建集合的另一种方法是调用构建函数 –
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html),
[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html),
和 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html).
这些函数创建新的, 可变的集合, 然后使用 [写操作](collection-write.html)填充集合内容,
再返回一个只读的集合, 包含相同的元素:

```kotlin
val map = buildMap { // 在这里是 MutableMap<String, Int>, key 和 value 的类型通过下面的 `put()` 调用推断得到
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 创建空集合

还有一些函数可以用来创建不包含元素的空集合:
[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html),
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html),
以及 [`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html).
创建空集合时, 你需要明确指定集合中存储的元素的数据类型.

```kotlin
val empty = emptyList<String>()
```

## 使用 list 的初始化函数

对于 list, 有一个构造器, 它接受的参数是 list 大小, 以及一个初始化函数,
这个初始化函数负责根据元素的下标计算各个元素的值.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // 如果希望将来改变其中的值, 可以使用 MutableList
    println(doubled)
//sampleEnd
}
```
</div>

## 使用具体类型的(Concrete type) 集合构造器

如果希望创建一个具体类型(concrete type)的集合,
比如 `ArrayList` 或 `LinkedList`, 可以使用这些集合类型的构造器.
`Set` 和 `Map` 的实现类也有类似的构造器.

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 从既有的集合复制

如果想要从已有的集合创建一个相同内容的新集合, 可以使用复制(copy)函数.
标准库中提供的集合复制函数创建的是 _浅(shallow)_ 复制的集合, 其中的元素与既有的集合指向相同的对象引用.
因此, 对集合中某个元素进行修改, 会反映到这个元素的所有副本.

集合复制函数, 比如
[`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html),
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html),
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html)
等等, 会创建一个集合在函数调用那一刻的副本(snapshot).
这些函数的结果是一个新的集合, 但包含完全相同的元素.
如果对原来的集合添加或删除元素, 不会影响到副本集合中的内容. 同样的, 对副本的修改也不会影响到原来的集合.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("First item's name is: ${sourceList[0].name} in source and ${copyList[0].name} in copy")
    println("List size is: ${sourceList.size} in source and ${copyList.size} in copy")
//sampleEnd
}
```
</div>

这些函数也可以用来将一个集合转换为其他类型的集合, 比如从一个 list 创建一个 set, 或者相反.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
//sampleEnd
}
```
</div>

另一种方法是, 你可以创建一个新的引用, 指向相同的集合实例.
如果用一个既有的集合初始化赋值给一个集合变量, 这时就创建了一个新的引用.
这种情况下, 如果通过一个引用修改了集合实例的内容, 这些变化会影响到所有其他的引用.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")
//sampleEnd
}
```
</div>

集合的初始化可以用来限制它的可变性. 比如, 如果创建一个 `List` 引用, 指向一个 `MutableList`,
那么如果你当你想要使用这个只读类型的 `List` 引用来修改集合内容, 编译器会报告编译错误.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            // 编译错误
    sourceList.add(4)
    println(referenceList) // 显示 sourceList 的当前状态
//sampleEnd
}
```
</div>

## 调用其他集合的函数

在既有的集合上执行各种操作的结果也可以创建新的集合.
比如, [过滤(filtering)](collection-filtering.html) 一个 list 会创建一个新的 list,
其中只包含满足过滤条件的元素:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)
//sampleEnd
}
```
</div>

[映射(Mapping)](collection-transformations.html#map) 函数会创建一个新的 list,
其中包含各个元素变换后的结果:

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

[关联(Association)](collection-transformations.html#associate) 函数会创建 map:

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

关于 Kotlin 集合的各种操作, 详情请参见 [集合的各种操作(Operation)概述](collection-operations.html).
