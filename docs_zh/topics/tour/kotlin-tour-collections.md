---
type: doc
layout: reference
category:
title: "集合(Collection)"
---

# 集合(Collection)

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: #D1D1D2">
    <tr>
        <td>
        <div style="display: block">
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-1-done.svg" alt="第 1 步" width="20"/> &nbsp;
                <a href="kotlin-tour-hello-world.html">Hello world</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-2-done.svg" alt="第 2 步" width="20"/> &nbsp;
                <a href="kotlin-tour-basic-types.html">基本类型</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3.svg" alt="第 3 步" width="20"/> &nbsp;
                <strong>集合(Collection)</strong>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-4-todo.svg" alt="第 4 步" width="20"/> &nbsp;
                <a href="kotlin-tour-control-flow.html">控制流</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-5-todo.svg" alt="第 5 步" width="20"/> &nbsp;
                <a href="kotlin-tour-functions.html">函数</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-6-todo.svg" alt="第 6 步" width="20"/> &nbsp;
                <a href="kotlin-tour-classes.html">类</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-7-todo.svg" alt="第 7 步" width="20"/> &nbsp;
                <a href="kotlin-tour-null-safety.html">Null 值安全性</a>
            </div>
        </div>
        </td>
    </tr>
</table>

在程序开发中, 能够将数据组织到数据结构中以供后续的处理, 这样的能力非常有用.
为了这样的目的, Kotlin 提供了集合.

Kotlin 有以下集合来组织数据元素:

| **集合类型** | **描述**                                      |
|----------|---------------------------------------------|
| List     | 有顺序的元素组成的集合                                 |
| Set      | 唯一的、无顺序的元素组成的集合                             |
| Map      | 一组键值对(key-value pair), 其中键是唯一, 并且每个键对应到唯一的值 |

每个集合类型都可以是可变的, 或只读的.

## List

列表按照元素添加的顺序保存它们, 而且允许重复的元素.

要创建一个只读的 List ([`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/)),
请使用 [`listOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 函数.

要创建一个可变的 List ([`MutableList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list.html)),
请使用 [`mutableListOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 函数.

创建 List 时, Kotlin 可以推断它存储的元素类型.
如果要明确声明元素类型,
请在 List 的声明之后的尖括号 `<>` 中添加类型:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-lists-declaration">

```kotlin
fun main() { 
//sampleStart
    // 只读 List
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println(readOnlyShapes)
    // 输出结果为 [triangle, square, circle]
    
    // 可变的 List, 带有明确的类型声明
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    println(shapes)
    // 输出结果为 [triangle, square, circle]
//sampleEnd
}
```

</div>

> 为了防止无意中修改 List 的内容, 你可以将可变的 List 赋值给一个 `List`, 来得到它的一个只读的视图:
> ```kotlin
>     val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
>     val shapesLocked: List<String> = shapes
> ```
> 这种操作也叫做 **类型变换(casting)**.
{:.tip}

List 是有顺序的, 因此要访问 List 内的元素, 请使用 [下标访问操作符](../operator-overloading.html#indexed-access-operator) `[]`:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-access">

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes[0]}")
    // 输出结果为 The first item in the list is: triangle
//sampleEnd
}
```

</div>

要获取 List 中的第一个或最后一个元素, 请分别使用 [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-first">

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("The first item in the list is: ${readOnlyShapes.first()}")
    // 输出结果为 The first item in the list is: triangle
//sampleEnd
}
```

</div>

> [`.first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`.last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
> 函数是 **扩展** 函数.
> 要对一个对象调用扩展函数, 请在对象之后加上点号 `.`, 然后把函数名写在后面.
> 
> 关于扩展函数, 更多详情请参见 [扩展函数](../extensions.html#extension-functions).
> 对于这篇向导而言, 你只需要知道如何调用它们就行了.
{:.note}

要得到 List 中元素的数量, 请使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-count">

```kotlin
fun main() { 
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("This list has ${readOnlyShapes.count()} items")
    // 输出结果为 This list has 3 items
//sampleEnd
}
```

</div>

要检查一个元素是否存在于 List 中, 请使用 [`in` 操作符](../operator-overloading.html#in-operator):

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-in">

```kotlin
fun main() {
//sampleStart
    val readOnlyShapes = listOf("triangle", "square", "circle")
    println("circle" in readOnlyShapes)
    // 输出结果为 true
//sampleEnd
}
```

</div>

要对可变 List 添加或删除元素, 请分别使用 [`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-list-add-remove">

```kotlin
fun main() { 
//sampleStart
    val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
    // 向 List 添加 "pentagon"
    shapes.add("pentagon") 
    println(shapes)  
    // 输出结果为 [triangle, square, circle, pentagon]

    // 从 List 中删除第一个 "pentagon" 
    shapes.remove("pentagon") 
    println(shapes)  
    // 输出结果为 [triangle, square, circle]
//sampleEnd
}
```
</div>

## Set

List 包含有顺序的元素, 并且允许元素重复, Set 则是 **无顺序的**, 并且只保存 **唯一的** 元素.

要创建一个只读的 Set ([`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/)),
请使用 [`setOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html) 函数.

要创建一个可变的 Set ([`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/)),
请使用 [`mutableSetOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html) 函数.

创建 Set 时, Kotlin 可以推断它存储的元素类型.
如果要明确声明元素类型, 请在 Set 的声明之后的尖括号 `<>` 中添加类型:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-sets-declaration">

```kotlin
fun main() {
//sampleStart
    // 只读的 Set
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    // 可变的 Set, 带有明确的类型声明
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    
    println(readOnlyFruit)
    // 输出结果为 [apple, banana, cherry]
//sampleEnd
}
```

</div>

在上面的示例中你可以看到, 由于 Set 只包含唯一的元素, 重复的 `"cherry"` 元素被丢弃了.

> 为了防止无意中修改 Set 的内容, 你可以将可变的 Set 类型变换为 `Set`, 来得到它的一个只读的视图:
> ```kotlin
>     val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
>     val fruitLocked: Set<String> = fruit
> ```
{:.tip}

> 由于 Set 是 **无顺序的**, 你不能访问位于某个下标的元素.
{:.note}

要得到 Set 中元素的数量, 请使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-count">

```kotlin
fun main() { 
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("This set has ${readOnlyFruit.count()} items")
    // 输出结果为 This set has 3 items
//sampleEnd
}
```

</div>

要检查一个元素是否存在于 Set 中, 请使用 [`in` 操作符](../operator-overloading.html#in-operator):

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-in">

```kotlin
fun main() {
//sampleStart
    val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
    println("banana" in readOnlyFruit)
    // 输出结果为 true
//sampleEnd
}
```

</div>

要对可变 Set 添加或删除元素, 请分别使用
[`.add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/add.html)
和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-set-add-remove">

```kotlin
fun main() { 
//sampleStart
    val fruit: MutableSet<String> = mutableSetOf("apple", "banana", "cherry", "cherry")
    fruit.add("dragonfruit")    // 向 Set 添加 "dragonfruit"
    println(fruit)              // 输出结果为 [apple, banana, cherry, dragonfruit]
    
    fruit.remove("dragonfruit") // 从 Set 中删除 "dragonfruit"
    println(fruit)              // 输出结果为 [apple, banana, cherry]
//sampleEnd
}
```

</div>

## Map

Map 将元素保存为键值对(key-value pair). 你通过引用键(Key)来访问值(Value).
你可以将 Map 想象为好像一个食品菜单.
你可以通过寻找你想要吃的食物(键)来找到价格(值).
如果你想要查找一个值, 但不象 List 那样使用数字下标, 那么 Map 是很有用的.

> * Map 中的每个键必须是唯一的, 这样 Kotlin 才能懂得你想要得到哪个值.
> * 在 Map 中你可以有重复的值.
{:.note}

要创建一个只读的 Map ([`Map`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/)),
请使用 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 函数.

要创建一个可变的 Map ([`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/)),
请使用 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 函数.

创建 Map 时, Kotlin 可以推断它存储的元素类型.
如果要明确声明元素类型, 请在 Map 的声明之后的尖括号 `<>` 中添加键和值的类型.
例如: `MutableMap<String, Int>`.
键的类型为 `String`, 值的类型为 `Int`.

创建 Map 的最简单的办法是在每个键和它对应的值之间使用 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) :

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-maps-declaration">

```kotlin
fun main() {
//sampleStart
    // 只读 Map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu)
    // 输出结果为 {apple=100, kiwi=190, orange=100}

    // 可变的 Map, 带有明确的类型声明
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(juiceMenu)
    // 输出结果为 {apple=100, kiwi=190, orange=100}
//sampleEnd
}
```

</div>

> 为了防止无意中修改 Map 的内容, 你可以将可变的 Map 类型变换为 `Map`, 来得到它的一个只读的视图:
> ```kotlin
>     val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
>     val juiceMenuLocked: Map<String, Int> = juiceMenu
> ```
{:.tip}

要访问 Map 中的值, 请使用 [下标操作符](../operator-overloading.html#indexed-access-operator) `[]`, 以它的键为下标:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-access">

```kotlin
fun main() {
//sampleStart
    // 只读 Map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("The value of apple juice is: ${readOnlyJuiceMenu["apple"]}")
    // 输出结果为 The value of apple juice is: 100
//sampleEnd
}
```

</div>

要得到 Map 中元素的数量, 请使用 [`.count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-count">

```kotlin
fun main() {
//sampleStart
    // 只读 Map
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("This map has ${readOnlyJuiceMenu.count()} key-value pairs")
    // 输出结果为 This map has 3 key-value pairs
//sampleEnd
}
```

</div>

要对可变 Map 添加或删除元素, 请分别使用 [`.put()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/put.html)
和 [`.remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-put-remove">

```kotlin
fun main() {
//sampleStart
    val juiceMenu: MutableMap<String, Int> = mutableMapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    juiceMenu.put("coconut", 150) // 向 Map 添加键 "coconut" 和值 150
    println(juiceMenu)
    // 输出结果为 {apple=100, kiwi=190, orange=100, coconut=150}

    juiceMenu.remove("orange")    // 从 Map 删除键 "orange"
    println(juiceMenu)
    // 输出结果为 {apple=100, kiwi=190, coconut=150}
//sampleEnd
}
```

</div>

要检查一个键是否存在于 Map 中, 请使用 [`.containsKey()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-key.html) 函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-contains-keys">

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.containsKey("kiwi"))
    // 输出结果为 true
//sampleEnd
}
```

</div>

要得到 Map 中所有键或所有值的集合, 请分别使用 [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html)
和 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html) 属性:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-keys-values">

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println(readOnlyJuiceMenu.keys)
    // 输出结果为 [apple, kiwi, orange]
    println(readOnlyJuiceMenu.values)
    // 输出结果为 [100, 190, 100]
//sampleEnd
}
```

</div>

> [`keys`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/keys.html) 和 [`values`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/values.html)
> 对象的 **属性**. 要访问一个对象的属性, 请在对象之后加上点号 `.`, 然后把属性名写在后面.
>
> 属性会在 [类](kotlin-tour-classes.html) 的章节中详细介绍.
> 目前你只需要知道如何访问它们就行了.
{:.note}

要检查一个键或值是否存在于 Map 中, 请使用 [`in` 操作符](../operator-overloading.html#in-operator):

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-map-in">

```kotlin
fun main() {
//sampleStart
    val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
    println("orange" in readOnlyJuiceMenu.keys)
    // 输出结果为 true
    println(200 in readOnlyJuiceMenu.values)
    // 输出结果为 false
//sampleEnd
}
```

</div>

关于集合的其它更多功能, 请参见 [集合](../collections-overview.html).

现在你已经知道了基本类型, 以及如何管理集合, 下面我们来看看在你的程序中能够使用的 [控制流](kotlin-tour-control-flow.html).

## 实际练习

### 习题 1

你有一个 “绿色” 数字的 List, 和一个 “红色” 数字的 List.
完成下面的代码, 打印这两个 List 中总共有多少个数字.

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-1">

```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // 在这里编写你的代码
}
```

</div>

#### 参考答案

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" data-highlight-only id="kotlin-tour-collections-solution-1">

```kotlin
fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    val totalCount = greenNumbers.count() + redNumbers.count()
    println(totalCount)
}
```

</div>

### 习题 2

你有一个 Set, 其中包含你的服务器支持的协议. 一个用户要求使用某个协议.
完成下面的程序, 检查用户要求使用的协议是否支持 (`isSupported` 必须是 Boolean 值).

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-2">

```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = // 在这里编写你的代码
    println("Support for $requested: $isSupported")
}
```

</div>

#### 提示
请确保使用字符串的大写格式来检查请求的协议 .
你可以使用 [.uppercase()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函数来帮助你实现这一点.

#### 参考答案

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" data-highlight-only id="kotlin-tour-collections-solution-2">

```kotlin
fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}
```

</div>

### 习题 3

定义一个 Map, 将 1 到 3 的数字对应到它们的拼写.
使用这个 Map 来拼写指定的数字.

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-collections-exercise-3">

```kotlin
fun main() {
    val number2word = // 在这里编写你的代码
    val n = 2
    println("$n is spelt as '${<Write your code here >}'")
}
```

</div>

#### 参考答案

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" data-highlight-only  id="kotlin-tour-collections-solution-3">

```kotlin
fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${number2word[n]}'")
}
```

</div>

## 下一步

[控制流](kotlin-tour-control-flow.html)
