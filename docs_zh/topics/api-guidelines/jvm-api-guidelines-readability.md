---
type: doc
layout: reference
category:
title: "可读性"
---

# 可读性

最终更新: {{ site.data.releases.latestDocDate }}

本章介绍关于 [API 一致性](#api-consistency) 需要注意的问题, 并提供以下建议:
* [使用构建器 DSL](#use-a-builder-dsl)
* [在适当的情况下, 使用类似构造器风格的函数](#use-constructor-like-functions-where-applicable)
* [适当的使用成员函数和扩展函数](#use-member-and-extension-functions-appropriately)
* [避免在函数中使用 Boolean 参数](#avoid-using-boolean-arguments-in-functions)

## API 一致性

API 保持一致, 并提供良好的文档, 对于良好的开发体验来说是非常重要的.
参数顺序, 整体的命名风格, 超载(overload) 也非常重要.
而且, 对于所有的惯例规约, 也应该编写文档.

例如, 如果你的一个方法接受 `offset` 和 `length` 参数, 那么其它方法也应该使用相同的参数, 而不是, 比如, 接受 `startIndex` 和 `endIndex` 参数.
这样的参数很可能是 `Int` 或 `Long` 类型, 因此很容易搞混它们.

对于参数顺序也是如此: 在各个方法之间, 以及超载的方法直接, 应该保持参数顺序一致.
否则, 库的使用者在传递参数时可能猜错参数的顺序.

下面是一个例子, 它保持了一致的参数顺序和名称:

```kotlin
fun String.chop(length: Int): String = substring(0, length)
fun String.chop(length: Int, startIndex: Int) =
    substring(startIndex, length + startIndex)
```

如果你有很多类似的方法, 应该对它们使用一致并且易于预见的名称.
`stdlib` API 是这样做的: 
有 `first()` 和 `firstOrNull()` 方法, `single()` 和 `singleOrNull()` 方法, 等等.
从它们的名称可以看出这些方法是成对的, 而且有些方法可能返回 `null`, 其它方法可能抛出异常.

## 使用构建器 DSL

在程序开发中, ["构建器(Builder)"](https://en.wikipedia.org/wiki/Builder_pattern#:~:text=The%20builder%20pattern%20is%20a,Gang%20of%20Four%20design%20patterns)
是一个很著名的模式.
你可以用它来构建复杂的实体对象, 不是使用单个表达式一次性构建, 而是逐步的获得更多信息来构建.
当你需要使用构建器时, 最好使用构建器 DSL 语法, 它在二进制上是兼容的, 而且更符合语言习惯.

Kotlin 构建器 DSL 的典型例子是 `kotlinx.html`. 请看下面的示例:

```kotlin
header("modal-card-head") {
    p("modal-card-title") {
        +book.book.name
    }
    button(classes = "delete") {
        attributes["aria-label"] = "close"
        attributes["_"] = closeModalScript
    }
}
```

也可以通过传统的构建器的方式来实现, 但代码会明显的更冗长:

```kotlin
headerBuilder()
    .addClasses("modal-card-head")
    .addElement(
        pBuilder()
            .addClasses("modal-card-title")
            .addContent(book.book.name)
            .build()
    )
    .addElement(
        buttonBuilder()
            .addClasses("delete")
            .addAttribute("aria-label", "close")
            .addAttribute("_", closeModalScript)
            .build()
    )
    .build()
```

这样的实现存在太多你并不需要知道的细节, 而且它要求你构建每一个实体.

如果你需要在一个循环中动态的生成构建器的内容, 情况就变得更糟了.
在这样的情况下, 你必须创建变量实例, 并动态的覆盖它:

```kotlin
var buttonBuilder = buttonBuilder()
    .addClasses("delete")
for ((attributeName, attributeValue) in attributes) {
    buttonBuilder = buttonBuilder.addAttribute(attributeName, attributeValue)
}
buttonBuilder.build()
```

在构建器 DSL 中, 你可以直接使用循环, 以及所有需要的 DSL 调用:

```kotlin
div("tags") {
    for (genre in book.genres) {
        span("tag is-rounded is-normal is-info is-light") {
            +genre
        }
    }
}
```

请记住, 在大括号内, 无法在编译期检查你是否设置了所有必须的属性.
为了避免这个问题, 请将必须的属性作为函数的参数, 而不是构建器的属性.
例如, 
如果你希望 `href` 是一个必须的 HTML 属性, 你的函数应该是这样的:

```kotlin
fun a(href: String, block: A.() -> Unit): A
```

而不仅仅是:

```kotlin
fun a(block: A.() -> Unit): A
```

> 只要你不从构建器 DSL 中删除什么东西, 那么它就是 [向后兼容的](jvm-api-guidelines-backward-compatibility.html).
> 通常情况下不会发生问题, 因为随着时间的推移, 大多数开发者只会向他们的构建器类添加更多的属性.
{:.note}

## 在适当的情况下, 使用类似构造器风格的函数

有时候, 你可以通过使用类似构造器风格的函数, 简化你的 API 的外观.
一个类似构造器风格的函数, 是指函数名称以大写字母开头, 因此看起来象一个类的构造器.
这种方式可以让你的库更易于理解.

假设你想要在你的库中引入一个 [可选类型(Option Type)](https://en.wikipedia.org/wiki/Option_type) :

```kotlin
sealed interface Option<T>
class Some<T : Any>(val t: T) : Option<T>
object None : Option<Nothing>
```

你可以为所有的 `Option` 接口方法定义实现 – `map()`, `flatMap()`, 等等.
但是, 每次你的 API 使用者创建一个这样的 `Option` 时, 他们都必须写一些额外的逻辑, 来检查应该创建什么.
例如:

```kotlin
fun findById(id: Int): Option<Person> {
    val person = db.personById(id)
    return if (person == null) None else Some(person)
}
```

为了让你的用户不必每次都编写这些相同的检查代码, 你只需要在你的 API 中添加 1 行:

```kotlin
fun <T> Option(t: T?): Option<out T & Any> =
    if (t == null) None else Some(t)

// 上面代码的使用方式:
fun findById(id: Int): Option<Person> = Option(db.personById(id))
```

现在, 创建一个正确的 `Option` 变得非常简单: 只需要调用 `Option(x)`, 然后你就有了 null 值安全的, 功能正确的 Option 语法.

类似构造器风格的函数的另一种使用场景是, 当你需要返回某种 "隐藏的" 信息的时候, 例如 private 实例, 或 internal 对象.
作为例子, 我们来看看标准库中的一个方法:

```kotlin
public fun <T> listOf(vararg elements: T): List<T> =
    if (elements.isNotEmpty()) elements.asList() else emptyList()
```

在上面的例子中, `emptyList()` 返回下面的内容:

```kotlin
internal object EmptyList : List<Nothing>, Serializable, RandomAccess
```

你可以编写一个类似构造器风格的函数, 降低你的代码的 [认知复杂度](jvm-api-guidelines-introduction.html#cognitive-complexity),
并减少你的 API 的大小:

```kotlin
fun <T> List(): List<T> = EmptyList

// 上面代码的使用方式:
public fun <T> listOf(vararg elements: T): List<T> =
    if (elements.isNotEmpty()) elements.asList() else List()
```

## 适当的使用成员函数和扩展函数

只有 API 的非常核心的部分才应该写成 [成员函数](../functions.html#member-functions),
其他所有功能应该写成 [扩展函数](../extensions.html#extension-functions).
这样可以帮助你告诉阅读代码的人, 什么是核心功能, 什么不是.

例如, 看看下面的 Graph 类:

```kotlin
class Graph {
    private val _vertices: MutableSet<Int> = mutableSetOf()
    private val _edges: MutableMap<Int, MutableSet<Int>> = mutableMapOf()

    fun addVertex(vertex: Int) {
        _vertices.add(vertex)
    }

    fun addEdge(vertex1: Int, vertex2: Int) {
        _vertices.add(vertex1)
        _vertices.add(vertex2)
        _edges.getOrPut(vertex1) { mutableSetOf() }.add(vertex2)
        _edges.getOrPut(vertex2) { mutableSetOf() }.add(vertex1)
    }

    val vertices: Set<Int> get() = _vertices
    val edges: Map<Int, Set<Int>> get() = _edges
}
```

这个类只包含最少量的内容: vertices 和 edges 的 private 变量, 用于添加 vertices 和 edges 的函数,
以及访问函数, 返回当前状态的不可变的表达.

你可以在类之外添加所有其他功能:

```kotlin
fun Graph.getNumberOfVertices(): Int = vertices.size
fun Graph.getNumberOfEdges(): Int = edges.size
fun Graph.getDegree(vertex: Int): Int = edges[vertex]?.size ?: 0
```

只有属性, 覆盖, 以及访问器才应该作为类的成员.

## 避免在函数中使用 Boolean 参数

理想情况下, 读者应该只靠阅读代码就能够判断函数参数的目的.
然而, 如果使用 `Boolean` 参数, 这就不太可能了, 尤其是如果你没有使用 IDE (例如, 如果你在某个版本管理系统中审查代码).
使用 [命名的参数](../functions.html#named-arguments) 有助于说明参数的目的, 但目前不可能强迫开发者在 IDE 中使用命名的参数.
另一个方案是, 创建一个函数, 让它执行 `Boolean` 参数对应的功能, 并给这个函数一个非常有描述性的名称.

例如, 在标准库中, 有两个 `map()` 函数:

```kotlin
fun map(transform: (T) -> R): List<R>

fun mapNotNull(transform: (T) -> R?): List<R>
```    

我们可以添加一个 `map(filterNulls: Boolean)` 函数, 然后编写这样的代码:

```kotlin
listOf(1, null, 2).map(false) { it.toString() }
```

只看这段代码, 很难推测出 `false` 到底代表什么意思.
但是, 如果你使用 `mapNotNull()` 函数, 读者就能立即理解它的逻辑:

```kotlin
listOf(1, null, 2).mapNotNull { it.toString() } 
```

## 下一步做什么?

学习 API 的:
* [可预测性](jvm-api-guidelines-predictability.html)
* [可调试性](jvm-api-guidelines-debuggability.html)
* [向后兼容性(Backward Compatibility)](jvm-api-guidelines-backward-compatibility.html)
