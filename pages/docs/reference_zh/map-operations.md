---
type: doc
layout: reference
category: "集合"
title: "Map 相关操作"
---

# Map 相关操作

本页面最终更新: 2021/02/11

在 [map](collections-overview.html#map) 中, 键(key)和值(value)的类型都是用户指定的.
通过键(key)对 map 条目(entry) 的访问, 可以实现各种 Map 相关操作,
比如通过键(key)得到值(value), 以及分别过滤键(key)和值(value).
本节中, 我们介绍标准库提供的 map 操作函数.

## 取得键(key)和值(value)

要从 map 中取得值(value), 你需要使用键(key)作为参数调用
[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/get.html)
函数.
更简短的写法是 `[key]` . 如果未找到指定的键(key), 会返回 `null`.
还有一个函数
[`getValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-value.html),
它的功能略有不同: 在 map 中未找到键(key)时它会抛出异常.
此外, 还有另外两个选择, 可以对键(key)不存在的情况进行处理:

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)
  与 list 中的同名函数一样: 对于不存在的键(key), 值(value)由指定的 lambda 函数返回.
* [`getOrDefault()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-default.html):
  如果键(key)不存在, 则返回指定的默认值(value).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.get("one"))
    println(numbersMap["one"])
    println(numbersMap.getOrDefault("four", 10))
    println(numbersMap["five"])               // 得到 null
    //numbersMap.getValue("six")      // 抛出异常!
//sampleEnd
}
```
</div>

如果需要对 map 的所有键(key)或所有值(value)进行操作, 可以分别通过 `keys` 属性和  `values` 属性得到它们.
`keys` 是 map 的所有键(key)构成的 set, `values` 是 map 所有值(value)构成的集合.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap.keys)
    println(numbersMap.values)
//sampleEnd
}
```
</div>

## 过滤(Filtering)

可以使用
[`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)
函数和其他函数对 map 进行 [过滤(filter)](collection-filtering.html).
对 map 调用 `filter()` 时, 使用的参数是一个判定条件(predicate), 判定条件的参数是一个 `Pair`.
因此可以在过滤的判定条件中同时使用键(key)和值(value).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
</div>

还有两种特定的方式来过滤 map: 根据键(key)过滤, 以及根据值(value)过滤.
对每一种方式, 都有一个函数:
[`filterKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-keys.html)
和
[`filterValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-values.html).
这两个函数都会返回新的 map, 其中包含满足判定条件的条目(entry).
`filterKeys()` 的判定条件只检查元素的键(key), `filterValues()` 的判定条件只检查元素的值(value).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredKeysMap = numbersMap.filterKeys { it.endsWith("1") }
    val filteredValuesMap = numbersMap.filterValues { it < 10 }

    println(filteredKeysMap)
    println(filteredValuesMap)
//sampleEnd
}
```
</div>

## `加法(plus)` 和 `减法(minus)` 运算符

由于 map 是通过键(key)访问的, 因此
[`加法(plus)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`)
和
(https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`)
运算符对 map 的工作方式与对其他集合不同.
`加法(plus)` 返回一个 `Map`, 其中包含运算符两侧的所有元素:
运算符左侧是一个 `Map`, 右侧是一个 `Pair` 或者另一个 `Map`.
如果运算符右侧的键(key)在左侧的 `Map` 中已经存在, 那么结果 map 包含的是来自右侧的条目(entry).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap + Pair("four", 4))
    println(numbersMap + Pair("one", 10))
    println(numbersMap + mapOf("five" to 5, "one" to 11))
//sampleEnd
}
```
</div>

`减法(minus)` 创建一个 `Map`, 其中包含左侧 `Map` 的条目(entry), 但键(key)出现在右侧的条目(entry)会被排除.
因此, 减法操作符的右侧可以是单个键(key), 也可以是键(key)的集合: list, set, 等等.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("one" to 1, "two" to 2, "three" to 3)
    println(numbersMap - "one")
    println(numbersMap - listOf("two", "four"))
//sampleEnd
}
```
</div>

对于可变 map 如何使用
[`加然后赋值(plusAssign)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`)
和
[`减然后赋值(minusAssign)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)
操作符, 详情请参见下文的 [Map 的写入操作](#map-write-operations).

## Map 的写入操作

[可变的](collections-overview.html#collection-types) map 允许执行 map 相关的写入操作.
执行操作允许你使用通过键(key)访问值(value)的方式修改 map 内容.

关于 map 的写入操作, 有一些特定的规则:

* 值(value)可以更新. 相反, 键(key)不能变化: 一旦添加了一个条目(entry), 它的键(key)将会是固定的.
* 对于每个键(key), 永远只有单个的值(value)与它关联. 你可以添加或删除整个条目(entry).

下面是关于可变 map 写入操作的标准库函数的介绍.

### 增加和更新条目(entry)

要向 map 添加新的 键(key)-值(value) 对, 可以使用
[`put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)
函数.
向 `LinkedHashMap` (map 的默认实现类) 添加新的条目(entry)时, 它添加的位置会使它在遍历 map 时出现在最后.
对于排序的 map, 新添加元素的位置由它的键(key)的顺序决定.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    println(numbersMap)
//sampleEnd
}
```
</div>

如果要一次性添加多个条目(entry), 可以使用
[`putAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/put-all.html)
函数. 它的参数可以是一个 `Map`, 或一组 `Pair` 对象: `Iterable`, `Sequence`, 或 `Array`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.putAll(setOf("four" to 4, "five" to 5))
    println(numbersMap)
//sampleEnd
}
```
</div>

如果指定的键(key)已经存在于 map 中, 那么 `put()` 和 `putAll()` 都会覆盖原有的值(value).
因此, 可以使用这些函数来更新 map 条目(entry)中的值(value).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    val previousValue = numbersMap.put("one", 11)
    println("value associated with 'one', before: $previousValue, after: ${numbersMap["one"]}")
    println(numbersMap)
//sampleEnd
}
```
</div>

也可以使用更简短的操作符形式, 向 map 添加新的条目(entry). 由两种方式:

* [`加然后赋值(plusAssign)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)
  (`+=`) 操作符.
* `[]` 操作符, 它是 `set()` 函数的别名(alias).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap["three"] = 3     // 会调用 numbersMap.put("three", 3)
    numbersMap += mapOf("four" to 4, "five" to 5)
    println(numbersMap)
//sampleEnd
}
```
</div>

如果调用时使用 map 中已存在的键(key), 这些操作符会覆盖对应条目(entry)中的值(value).

### 删除条目(entry)

要从可变 map 中删除条目(entry), 请使用
[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/remove.html)
函数.
调用 `remove()` 时, 传递的参数可以是键(key), 也可以是整个 键(key)-值(value)-对(pair).
如果同时指定键(key)和值(value), 那么只有在键(key)和值(value)都与参数匹配时, 才会删除对应的元素.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap.remove("one")
    println(numbersMap)
    numbersMap.remove("three", 4)            // 不会删除任何条目
    println(numbersMap)
//sampleEnd
}
```
</div>

也可以使用可变 map 的所有键(key)或所有值(value)来删除条目(entry).
方法是对 map 的 `keys` 或 `values` 属性调用 `remove()` 函数, 参数是想要删除的条目(entry)的键(key)或值(value).
如果是对 `values` 调用 `remove()`, 那么只会删除与指定值(value)匹配的第一个条目(entry).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3, "threeAgain" to 3)
    numbersMap.keys.remove("one")
    println(numbersMap)
    numbersMap.values.remove(3)
    println(numbersMap)
//sampleEnd
}
```
</div>


对于可变 map, 还可以使用
[`减然后赋值(minusAssign)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)
操作符.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2, "three" to 3)
    numbersMap -= "two"
    println(numbersMap)
    numbersMap -= "five"             // 不会删除任何条目
    println(numbersMap)
//sampleEnd
}
```
</div>
