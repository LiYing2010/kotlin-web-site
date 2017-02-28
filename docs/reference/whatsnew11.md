---
type: doc
layout: reference
title: "Kotlin 1.1 的新增特性"
---

# Kotlin 1.1 的新增特性

Kotlin 1.1 目前 [已经发布了 beta 版](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-beta-is-here/). 在本章中, 你可以看到这个发布版中的新增特性.
注意, 在 Kotlin 1.1 正式发布之前, 任何新功能都有可能改变.

## JavaScript

从 Kotlin 1.1 开始, JavaScript 编译环境不再是实验性的功能了. 目前已支持 Kotlin 语言的所有功能,
而且有了很多新的工具, 可以实现与前端开发环境的集成. 关于这部分变化的详情, 请阅读[下文](#javascript-backend).

## 协程(coroutine) (实验性功能)

Kotlin 1.1 中关键性的新特性就是 *协程(coroutine)*, 这个特性可以支持 `future`/`await`, `yield` 等等类似的编程模式. Kotlin 的设计特性是, 协程的运行由库来实现, 而不是语言的一部分, 因此你不会被局限到某个特性的编程模式或者并行库.

一个协程实际上是一个轻量级的线程, 它可以被暂停, 然后在以后的时刻恢复运行. 协程通过协程构建函数来启动, 通过特殊的暂停函数来暂停运行. 比如, `future` 函数启动一个协程, 当你使用 `await` 时, 协程的运行会被暂停, 等待其他操作的执行, 当它等待的操作执行完毕之后, 协程就会恢复运行(可能在不同的进程内).

`yield` 和 `yieldAll` 函数可以产生 *延迟生成的序列(lazily generated sequences)*, 标准库使用协程来支持这种功能.
在这类序列中, 当每个元素被取得之后， 产生序列元素的代码段会被暂停, 当请求下一个元素时, 代码的执行又会回复. 示例如下:

``` kotlin
val seq = buildSequence {
    println("Yielding 1")
    yield(1)
    println("Yielding 2")
    yield(2)
    println("Yielding a range")
    yieldAll(3..5)
}

for (i in seq) {
    println("Generated $i")
}
```

上面的示例代码打印的结果将是:

```
Yielding 1
Generated 1
Yielding 2
Generated 2
Yielding a range
Generated 3
Generated 4
Generated 5
```

`future`/`await` 函数的实现以外部库的形式提供, [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines).
这些函数的使用方法如下:

``` kotlin
future {
    val original = asyncLoadImage("...original...") // 创建一个 Future
    val overlay = asyncLoadImage("...overlay...")   // 创建一个 Future
    ...
    // 等待图像载入时会暂停
    // 两个图像都载入完毕后, 会运行 `applyOverlay(...)` 函数
    return applyOverlay(original.await(), overlay.await())
}
```


kotlinx.coroutines 中 `future` 的实现依赖于 `CompletableFuture`, 因此需要 JDK 8, 但它也提供了可移植的 `defer` 基本类型, 可以创建其他实现方式.

[KEEP 文档](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md) 对协程功能进行了更加详细的说明.

注意, 协程目前还是 **实验性功能**, 也就是说, 1.1 正式发布后, Kotlin 开发组不保证这个特性的向后兼容性(backwards compatibility).


## 语言层的其他特性

### 类型别名(Type alias)

类型别名(type alias)功能允许你为已经存在的数据类型定义一个不同的名称.
这个功能对于泛型类型非常有用, 比如集合, 对于函数类型也很有用.
下面是一些例子:

``` kotlin
typealias FileTable<K> = MutableMap<K, MutableList<File>>

typealias MouseEventHandler = (Any, MouseEvent) -> Unit
```

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md).


### 与对象实例绑定的可调用的引用

现在你可以使用 `::` 操作符来得到一个 [成员的引用](reflection.html#function-references), 指向一个具体的对象实例的方法或属性.
从前这样的功能只能通过 lambda 表达式来实现.
下面是示例:

``` kotlin
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
// 这个 list 的结果是 "123", "456"
```

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md).


### 封闭类(sealed class)与数据类(data class)

Kotlin 1.1 中删除了 Kotlin 1.0 中对封闭类(sealed class)与数据类(data class)的一些限制.
过去, 封闭类的子类只能声明为封闭类的内嵌类(nested class), 现在这一限制已经删除, 你可以在同一个源代码文件的任何位置定义封闭类的子类.
数据类现在可以继承自其它类.
这些功能可以用来更好、更清晰地定义表达式类层级:

``` kotlin
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
```

关于这些功能的详情, 请参见 KEEP 文档: [封闭类](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md) 和
[数据类](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md).


### 在 lambda 表达式中使用解构声明

现在你可以使用 [解构声明](multi-declarations.html) 语法, 将对象解构为多个值, 然后作为参数传递给 lambda 表达式.
示例代码如下:

``` kotlin
map.mapValues { (key, value) -> "$value!" }
```

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md).


### 使用下划线代替未使用的参数

对于接受多个参数的 lambda 表达式, 你可以使用 `_` 来代替你不使用的参数:

``` kotlin
map.forEach { _, value -> println("$value!") }
```

这个功能对于 [解构声明](multi-declarations.html) 同样有效:

``` kotlin
val (_, status) = getResult()
```

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md).


### 在数字字面值中使用下划线

与 Java 8 一样, Kotlin 现在也允许在数字字面值中使用下划线, 将数字分隔为多个部分, 以便阅读:

``` kotlin
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md).


### 更加简短的属性语法

如果一个属性没有自定义访问器方法, 或者其取值方法的函数体是一个表达式, 属性类型现在可以省略:

``` kotlin
val name = ""

val lazyName get() = ""
```

对于这两个属性, 编译器都会将属性的数据类型推断为 `String`.


### 内联的属性访问函数

如果属性不存在后端域变量(backing field), 那么你可以使用 `inline` 修饰符来标记属性的访问器方法.
这样的访问器方法将会以 [内联函数](inline-functions.html) 相同的方式来编译.

``` kotlin
val foo: Foo
    inline get() = Foo()
```

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md).


### 局部的委托属性

你现在可以对局部变量使用 [委托属性](delegated-properties.html) 语法.
这个功能可以用来定义一个延迟计算的局部变量:

``` kotlin
fun foo() {
    val data: String by lazy { /* 计算 data 的值 */ }
    if (needData()) {
        println(data)   // data 会在这个时刻进行计算
    }
}
```

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md).


### 委托属性绑定的拦截

对于 [委托属性](delegated-properties.html), 现在可以使用 `provideDelegate` 操作符来拦截委托到属性的绑定.
比如, 如果我们希望在绑定之前检查属性名称, 我们可以编写以下代码:

``` kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, property: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, property.name)
        ... // 创建属性
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

在 `MyUI` 实例的创建过程中, 对每一个属性都会调用 `provideDelegate` 方法, 因此这个方法可以在此时进行必要的验证处理.


### 枚举值访问的通用方式

现在可以使用一种通用的方式来列举一个枚举类(enum class)的所有值:

``` kotlin
enum class RGB { RED, GREEN, BLUE }

print(enumValues<RGB>().joinToString { it.name }) // 打印结果为 RED, GREEN, BLUE
```


### 对 DSL 中的隐含接受者, 控制其范围

`@DslMarker` 注解可以限制从 DSL 上下文的外部范围(outer scope)来访问接受者.
比如, 考虑一下我们经典的 [HTML 构建器的例子](type-safe-builders.html):

``` kotlin
table {
    tr {
        td { +"Text" }
    }
}
```

在 Kotlin 1.0 中, 传递给 `td` 的那个 lambda 表达式中的代码, 可以访问 3 个隐含的接受者: 分别是 `table` 的接受者, `tr` 的接受者, 以及 `td` 的接受者. 这就导致你可以访问在当前上下文中毫无意义的方法 - 比如可以在 `td` 之内调用 `tr`, 因此可以在 `<td>` 之内再放置一个 `<tr>` 标记.

在 Kotlin 1.1 中, 你可以限制对这些接收者的访问, 因此, 在传递给 `td` 的那个 lambda 表达式中, 只有定义在 `td` 的隐含接收者中的方法才可以被调用. 要实现这一点, 你可以定义一个注解, 并用元注解(meta-annotation) `@DslMarker` 标注这个注解, 然后将你的注解标记到 HTML tag 类的基类上:

``` kotlin
@DslMarker
annotation class HtmlTagMarker

@HtmlTagMarker
abstract class Tag(val name: String) { ... }

class TD() : Tag("td") { ... }

fun Tag.td(init: TD.() -> Unit) {
}
```

这样一来, 传递给 `td` 函数的 `init` lambda 表达式的隐含接受者, 将是一个带有 `@HtmlTagMarker` 注解的类, 因此, 外层的接受者的类型假如带有同样的注解, 那么这些接受者将会被屏蔽, 无法访问.

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md).


### `rem` 操作符

`mod` 操作符现在已被废弃, 改为使用 `rem` 操作符. 关于这个变更的原因, 请参见 [这个问题](https://youtrack.jetbrains.com/issue/KT-14650).

## 标准库

### 字符串到数值的转换

对于 String 类, 新增了许多扩展函数, 用来将字符串转换为数值, 并且对不正确的数值不会抛出异常:
`String.toIntOrNull(): Int?`, `String.toDoubleOrNull(): Double?` 等等.

同样也增加了整数的转换函数, 比如 `Int.toString()`, `String.toInt()`, `String.toIntOrNull()`,
这些函数都有带 `radix` 参数的重载版本, 这个参数可用来指定转换时使用的底数(base).

### onEach()

对于集合和序列来说, `onEach` 是一个小的, 但非常有用的扩展函数, 这个函数可以对集合或序列中的所有元素来执行相同的操作, 这个操作可能会带有副作用(side effect). 这个函数能够以操作链(chain of operation)的形式来使用. 对于 iterable, 这个函数类似 `forEach`, 但它最后会返回这个 iterable 实例. 对于 sequence, 这个函数会返回一个包装过的 sequence, 这个包装过的 sequence 会延迟地对每个元素执行你给定的操作.

### takeIf() 和 also()

新增了两个多用途的扩展函数, 可以用于任意类型的接受者.

`also` 函数类似于 `apply`: 它得到一个接受者, 对它执行某种操作, 然后返回这个接受者.
区别在于, 在 `apply` 的代码段内部, 接受者可以通过 `this` 得到,
而在 `also` 的代码段内部, 接受者是 `it` (而且如果你愿意, 也可以指定其他名称).
如果你不希望其他范围内的 `this` 被屏蔽掉, 那么这个功能就很方便了:

```kotlin
fun Block.copy() = Block().also { it.content = this.content }
```

`takeIf` 函数类似于 `filter`, 但适用于单个值. 这个函数首先检查接受者是否符合某些条件, 如果满足条件则返回接受者, 否则返回 `null`.
将这个函数与 Elvis 操作符, 以及快速返回(early return)组合起来, 可以编写下面这样的代码:

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// 对于已经存在的 outDirFile 进行某些处理

val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
// 在  字符串中查找 keyword 子串, 如果找到, 对 keyword 在 input 内的 index 位置进行某些处理
```


### groupingBy()

这个 API 可以用来对一个集合按照某个 key 进行分组, 并同时合并所有的组. 比如, 可以用来计算一段文字中各个字符的出现频度:

``` kotlin
val frequencies = words.groupingBy { it }.eachCount()
```

### Map.toMap() 和 Map.toMutableMap()

这两个函数可以用来简化 Map 的复制处理:

``` kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### minOf() 和 maxOf()

这两个函数可以用来得到两个给定的数值中的小值和大值.

### 类似数组风格的 List 创建函数

与 `Array` 的参见函数类似, 现在新增了用来创建 `List` 和 `MutableList` 实例的函数, 并且会通过调用 lambda 表达式来初始化列表中的元素:

``` kotlin
List(size) { index -> element }
MutableList(size) { index -> element }
```

### Map.getValue()

`Map` 的这个方法会接受一个 key 作为参数, 如果这个 key 对应的值已经存在, 则返回这个值, 否则抛出一个异常, 表示没有找到这个 key.
如果 Map 在创建时使用了 `withDefault`, 那么对于未找到的 key, 这个方法将会返回默认值, 而不会抛出异常.


### 抽象的集合类

实现 Kotlin 集合类时, 可以使用这些抽象类作为基类.
为了实现只读集合, 可以使用的基类有 `AbstractCollection`, `AbstractList`, `AbstractSet` 以及 `AbstractMap`,
对于可变的集合, 可以使用的基类有 `AbstractMutableCollection`, `AbstractMutableList`, `AbstractMutableSet` 以及 `AbstractMutableMap`.
在 JVM 环境中, 这些可变集合的抽象类的大多数功能, 通过继承 JDK 的集合抽象类得到.

## JVM 环境(JVM Backend)

### 对 Java 8 字节码的支持

Kotlin 现在增加了编译选项, 可以编译产生 Java 8 字节码(使用命令行选项 `-jvm-target 1.8`, 或 Ant/Maven/Gradle 中的对应选项). 这个选项目前不会改变字节码的语义(具体来说, 接口内的默认方法以及 lambda 表达式的编译输出方式会与 Kotlin 1.0 中完全相同), 但我们将来计划对这个选项做更多的改进.


### 对 Java 8 标准库的支持

Kotlin 的标准库目前存在不同的版本, 分别支持 Java 7 和 8 中新增的 JDK API.
如果你需要使用新的 API, 请不要使用标准的 Maven artifact `kotlin-stdlib`, 改用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`.
这些 artifact 在 `kotlin-stdlib` 之上进行了微小的扩展, 而且会将 `kotlin-stdlib` 以传递依赖的方式引入到你的项目中.


### 字节码中的参数名称

Kotlin 现在支持在字节码中保存参数名称. 可以使用命令行参数 `-java-parameters` 打开这个功能.


### 常数内联(Constant inlining)

编译器现在可以将 `const val` 属性的值内联到这些属性被使用的地方.


### 可变的闭包变量(Mutable closure variable)

用于捕获 lambda 中的可变的闭包变量的封装类(box class) 不再拥有可变的域变量. 这个变化改进了性能, 但在某些罕见的使用场景下, 可能会导致新的竞争条件(race condition). 如果你受到这个问题的影响, 那么你在访问这些变量时, 需要自行实现同步控制.


### 对 javax.scripting 的支持

Kotlin 目前集成了 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223). [这里](https://github.com/JetBrains/kotlin/tree/master/libraries/examples/kotlin-jsr223-local-example) 是一个使用这个 API 的示例工程.


## JavaScript 环境(JavaScript Backend)

### 统一的标准库

编译为 JavaScript 的 Kotlin 代码, 现在可以访问 Kotlin 标准库中更多的部分了.
具体来说, 许多关键性的类, 比如集合(`ArrayList`, `HashMap` 等等.), 异常(`IllegalArgumentException` etc.) 以及其他一些类(`StringBuilder`, `Comparator`) 现在被定义在 `kotlin` 包之下. 在 JVM 环境中, 这些名称是指向对应的 JDK 类的类型别名, 在 JS 环境中, 这些类在 Kotlin 标准库中实现.

### 更好的代码生成能力

JavaScript 环境生成的代码现在更容易进行静态检查了, 因此对于 JS 的代码处理工具更加友好, 比如代码压缩器(minifier), 优化器(optimiser), 校验检查器(linter), 等等.

### `external` 修饰符

如果你需要在 Kotlin 中以类型安全的方式来访问一个 JavaScript 中实现的类, 你可以使用 `external` 修饰符编写一个 Kotlin 声明. (在 Kotlin 1.0 中, 使用的是 `@native` 注解.)
与 JVM 编译对象不同, JS 编译对象允许对类和属性使用 `external` 修饰符.
比如, 你可以这样声明 DOM 的 `Node` 类:

``` kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // 等等
}
```

### import 处理的改进

现在你可以更加精确地指定需要从 JavaScript 模块中导入哪些声明.
如果你将 `@JsModule("<module-name>")` 注解添加到一个外部声明上, 那么在编译过程中它就会被正确地导入模块系统中(无论是 CommonJS 还是 AMD). 比如, 在 CommonJS 中, 这个声明将会通过 `require(...)` 函数导入.
此外, 如果你希望导入一个声明, 无论是作为一个模块还是作为一个全局 JavaScript 对象, 你都可以使用 `@JsNonModule` 注解.

比如, 你可以这样将 JQuery 导入到 Kotlin 模块中:

``` kotlin
@JsNonModule
@JsName("$")
external abstract class JQuery {
    fun toggle(duration: Int = 0): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun JQuery(selector: String): JQuery
```

在这段示例代码中, JQuery 将会导入为一个模块, 模块名称是 `jquery`. 或者, 也可以作为一个 $-对象来使用, 具体如何, 取决于 Kotlin 编译器被设置为使用哪种模块系统.

在你的应用程序中, 你可以这样使用这些声明:

``` kotlin
fun main(args: Array<String>) {
    JQuery(".toggle-button").click {
        JQuery(".toggle-panel").toggle(300)
    }
}
```
