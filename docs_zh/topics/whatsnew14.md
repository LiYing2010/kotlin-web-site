---
type: doc
layout: reference
title: "Kotlin 1.4.0 版中的新功能"
---

# Kotlin 1.4.0 版中的新功能

最终更新: {{ site.data.releases.latestDocDate }}

_[发布日期: 2020/08/17](releases.html#release-details)_

在 Kotlin 1.4.0 中, 我们对所有组件发布了许多改进, [专注于改善质量和性能](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/).
下文详细介绍 Kotlin 1.4.0 中最重要的变化.

## 语言方面的新功能和改进

Kotlin 1.4.0 包含很多语言方面的新功能和改进.
包括:

* [对 Kotlin 接口的 SAM 转换](#sam-conversions-for-kotlin-interfaces)
* [供库作者使用的明确 API 模式](#explicit-api-mode-for-library-authors)
* [混合使用命名参数和按位置传递的参数](#mixing-named-and-positional-arguments)
* [尾随逗号(trailing comma)](#trailing-comma)
* [可调用引用的改进](#callable-reference-improvements)
* [在循环内部的 `when` 表达式中使用 `break` 和 `continue`](#using-break-and-continue-inside-when-expressions-included-in-loops)

### 对 Kotlin 接口的 SAM 转换

在 Kotlin 1.4.0 之前, 只有 [在 Kotlin 中使用 Java 方法和 Java 接口](jvm/java-interop.html#sam-conversions) 时,
才可以进行 SAM (Single Abstract Method) 转换.
现在, 也可以对 Kotlin 接口进行 SAM 转换了.
要进行这种转换, 需要使用 `fun` 修饰符, 将 Kotlin 接口明确标记为函数接口.

如果函数接收的参数是一个仅有单个抽象方法的接口, 而你传递一个 Lambda 表达式作为实际参数, 这时就适用 SAM 转换.
这种情况下, 编译器将 Lambda 表达式自动转换为实现这个抽象成员函数的类的一个实例.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
    println("Is 7 even? - ${isEven.accept(7)}")
}
```

</div>

[更多详情请参见 Kotlin 函数式接口与 SAM 转换](fun-interfaces.html).

### 供库作者使用的明确 API 模式

Kotlin 编译器对库作者提供了 _明确 API 模式(explicit API mode)_.
在这种模式下, 编译器会进行额外的检查, 让库的 API 更加清晰更加一致.
对导出到库的公开 API 的声明, 它会增加以下要求:

* 如果默认可见度会导出声明到公开 API, 那么对于声明必须指定可见度修饰符.
这个限制可以保证声明不会无意中导出到公开 API.
* 对于导出到公开 API 的属性和函数, 必须明确指定类型.
这个限制可以保证 API 使用者注意到他们所使用的API 成员的类型.

根据你的配置不同, 这些明确的 API 检查可以产生错误 (_strict_ 模式) 或产生警告 (_warning_ 模式).
考虑到代码可读性, 以及通常的习惯, 这些检查不包含以下类型的声明:

* 主构造器
* 数据类的属性
* 属性的 get 方法和 set 方法
* `override` 方法

明确 API 模式只会分析一个模块的产品源代码(production source).

要在明确 API 模式下编译你的模块, 请在你的 Gradle 构建脚本中添加以下代码:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {    
    // 用于 strict 模式
    explicitApi()
    // 或
    explicitApi = ExplicitApiMode.Strict

    // 用于 warning 模式
    explicitApiWarning()
    // 或
    explicitApi = ExplicitApiMode.Warning
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {    
    // 用于 strict 模式
    explicitApi()
    // 或
    explicitApi = 'strict'

    // 用于 warning 模式
    explicitApiWarning()
    // 或
    explicitApi = 'warning'
}
```

</div>
</div>

使用命令行编译器时, 要切换到明确 API 模式,
可以添加编译器选项 `-Xexplicit-api`, 指定值为 `strict` 或 `warning`.

```bash
-Xexplicit-api={strict|warning}
```

[关于明确 API 模式的更多细节, 请参见 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md).

### 混合使用命名参数和按位置传递的参数

在 Kotlin 1.3 中, 如果使用 [命名参数](functions.html#named-arguments) 来调用一个函数,
那么必须将所有的无名称参数 (按位置传递的参数) 放在第一个命名参数之前.
比如, 可以调用 `f(1, y = 2)`, 但不能调用 `f(x = 1, 2)`.

如果所有的参数都在正确的位置, 但你希望对中间的一个参数指定名称, 这时这种限制就很麻烦.
如果能够标识清楚一个 boolean 值或 `null` 值到底属于哪个参数, 对于我们的代码是非常有帮助的.

在 Kotlin 1.4 中, 不再存在这样的限制可 – 现在, 在一组按位置传递的参数中, 你可以对一个位于中间的参数指定名称.
而且, 可以按任意方式混合使用按位置传递的参数和命名参数, 只要它们保持正确的顺序就可以了.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

// 使用一个位于中间的命名参数来调用函数
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 尾随逗号(trailing comma)

在 Kotlin 1.4 中, 可以在各种列举中添加尾随逗号,
比如: 实际参数, 参数声明, `when` 语句的分支条件, 以及解构声明的元素.
通过使用尾随逗号, 可以添加新元素, 以及修改元素顺序, 而不必添加或删除逗号.

如果你对参数或值使用多行语法, 这个功能很有帮助.
添加尾随逗号之后, 对参数或值可以很容易的交换各行的位置.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', // 尾随逗号
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", // 尾随逗号
)
```

### 可调用引用的改进

Kotlin 1.4 对于可调用引用的使用, 支持更多情况:

* 对带默认参数值的函数的引用
* 在返回值为 `Unit` 的函数内使用函数引用
* 根据函数参数个数适用的引用
* 对可调用引用的挂起转换

#### 对带默认参数值的函数的引用

现在, 你可以使用带默认参数值的函数的可调用引用.
如果对函数 `foo` 的可调用引用没有参数, 那么会使用默认值 `0`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```

</div>

在以前, 必须对函数 `apply` 编写额外的重载(overload)版, 才能使用默认参数值.

```kotlin
// 一些新的重载版本
fun applyInt(func: (Int) -> String): String = func(0)
```

#### 在返回值为 Unit 的函数内使用函数引用

在 Kotlin 1.4 中, 在返回 `Unit` 的函数内, 可以使用返回任何类型的函数的可调用引用.
在 Kotlin 1.4 之前, 这种情况下只能使用 Lambda 参数. 现在既可以使用 Lambda 参数也可以使用可调用引用.

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // 在 1.4 版以前, 这是唯一的方法
    foo(::returnsInt) // 从 1.4 版开始, 也可以使用这种方法
}
```

#### 根据函数参数个数适用的引用

当传递可变数量的参数(`vararg`)时, 现在可以适用函数的可调用引用.
在传递的参数列表的最后, 可以传递任意数量的相同类型参数.

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) -> Unit) {}
fun use1(f: (Int, String) -> Unit) {}
fun use2(f: (Int, String, String) -> Unit) {}

fun test() {
    use0(::foo)
    use1(::foo)
    use2(::foo)
}
```

#### 对可调用引用的挂起转换

除了对 Lambda 表达式的挂起转换之外, 从 1.4.0 版开始, Kotlin 现在还支持对可调用引用的挂起转换.

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // 在 1.4 版以前可以这样
    takeSuspend(::call) // 在 Kotlin 1.4 版中, 也可以这样
}
```

### 在循环内部的 when 表达式中使用 break 和 continue

在 Kotlin 1.3 中, 在循环内部的 `when` 表达式之内, 不能使用没有位置标签的 `break` 和 `continue`.
原因是这些关键字被保留用于 `when` 表达式的可能的 [跳过(fall-through)行为](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough).

因此, 如果想要在循环内部的 `when` 表达式中使用 `break` 和 `continue`, 你必须对它们 [添加标签](returns.html#break-and-continue-labels),
所以代码会变得比较笨重.

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 -> continue@LOOP
            17 -> break@LOOP
            else -> println(x)
        }
    }
}
```

在 Kotlin 1.4 中, 在循环内部的 `when` 表达式中可以使用不带标签的 `break` 和 `continue`.
这两条语句的会象我们预期的那样, 结束最内层的循环, 或者跳转到循环的下一步.

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 -> continue
            17 -> break
            else -> println(x)
        }
    }
}
```

`when` 之内的跳过(fall-through)行为, 我们留待未来的设计解决.

## IDE 中的新工具

在 Kotlin 1.4 中, 可以在 IntelliJ IDEA 中使用新工具来简化 Kotlin 开发:

* [新的灵活的项目向导](#new-flexible-project-wizard)
* [协程调试器](#coroutine-debugger)

### 新的灵活的项目向导

使用新的灵活的 Kotlin 项目向导, 可以非常简便的创建并配置不同类型的 Kotlin 项目,
包括 跨平台 项目, 没有 UI 的帮助是很难配置的.

![Kotlin 项目向导 – 跨平台项目]({{ url_for('asset', path='docs/images/whatsnew/multiplatform-project-1-wn.png') }})

新的 Kotlin 项目向导既简单又灵活:

1. *选择项目模板*, 可以根据你的目的来不同的模板. 未来还会添加更多模板.
2. *选择构建系统* – Gradle (Kotlin 或 Groovy DSL), Maven, 或 IntelliJ IDEA.  
    Kotlin 项目向导只会显示你选择的项目模板支持的构建系统.
3. *预览项目接口*, 可以直接在主画面上预览.

然后可以完成你的项目的创建, 或者也可以, 在下一个画面 *配置项目*:

4. *添加/删除这个项目模板支持的模块和编译目标*.
5. *配置模块和编译目标的设置*, 比如, 目标 JVM 版本, 目标模板, 以及测试框架.

![Kotlin 项目向导 - 配置 编译目标]({{ url_for('asset', path='docs/images/whatsnew/multiplatform-project-2-wn.png') }})

将来, 我们还会添加更多配置选项和模板, 让 Kotlin 项目向导更加灵活.

你可以学习以下教程来试用新的 Kotlin 项目向导:

* [创建一个基于 Kotlin/JVM 的控制台应用程序](jvm/jvm-get-started.html)
* [创建一个针对 React 的 Kotlin/JS 应用程序](js/js-react.html)
* [创建一个 Kotlin/Native 应用程序](native/native-get-started.html)

### 协程调试器

很多用户已经在异步程序开发中使用了 [协程](coroutines/coroutines-guide.html).
但在 Kotlin 1.4 以前, 协程的调试非常困难.
由于协程在不同的线程之间跳转, 因此很难理解某个协程正在做什么, 也很难查看它的上下文.
有些情况下, 在代码断点上单步运行根本无法工作.
因此, 你不得不依靠日志, 花费巨大的精力来调试使用协程的代码.

在 Kotlin 1.4 中, 有了 Kotlin plugin 的新功能, 调试协程现在变得更加方便了.

> 协程调试功能适用于 `kotlinx-coroutines-core` 的 1.3.8 或更高版本.
{:.note}

**Debug** Tool Window 现在包含新的 **Coroutines** 页. 在这个页中, 你可以查看当前正在运行的以及挂起的协程信息.
协程按照它运行时所属的派发器分组显示.

![调试协程]({{ url_for('asset', path='docs/images/whatsnew/coroutine-debugger-wn.png') }})

现在你可以:
* 很容易的查看每个协程的状态.
* 对运行中的和挂起的协程, 查看局部变量和捕获变量的值.
* 查看完整的协程创建栈, 以及协程内的调用栈.
  栈包括所有的栈层次(frame)及变量值, 甚至在标准调试时会丢失的那些变量值也可以查看.

如果你需要完整的报告, 包含每个协程的状态和它的栈, 可以在 **Coroutines** 页内点击鼠标右键, 然后点击 **Get Coroutines Dump**.
目前, 协程 dump 还很简单, 但在 Kotlin 的未来版本中, 我们会让它更加易读, 更能为你提供帮助.

![协程 Dump]({{ url_for('asset', path='docs/images/whatsnew/coroutines-dump-wn.png')}})

关于协程调试, 更多信息请参见 [这篇 Blog](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)
以及 [IntelliJ IDEA 文档](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html).


## 新编译器

Kotlin 的新编译器将会非常快; 它还能统一所有支持的平台, 并为编译器扩展提供 API.
这是一个长期的项目, 在 Kotlin 1.4.0 中我们已经完成了一些部分:

* [新的更强大的类型推断算法](#new-more-powerful-type-inference-algorithm), 默认情况下已启用.
* [新的 JVM 和 JS IR 后端](#unified-backends-and-extensibility). 开发达到稳定状态之后, 将会成为默认后端.

### 新的更强大的类型推断算法

Kotlin 1.4 使用一个新的, 更强大的类型推断算法.
在 Kotlin 1.3 中, 可以通过指定一个编译器选项来试用这个新算法, 现在它已经默认使用了.
你可以在 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20) 找到新算法中修正的所有问题.
下面是一部分最值得注意的改进:

* [更多情况下类型能够自动推断](#more-cases-where-type-is-inferred-automatically)
* [对 Lambda 内最后一条表达式的智能类型转换](#smart-casts-for-a-lambda-s-last-expression)
* [对可调用引用的智能类型转换](#smart-casts-for-callable-references)
* [对委托属性更好的类型推断](#better-inference-for-delegated-properties)
* [使用不同的参数对 Java 接口进行 SAM 转换](#sam-conversion-for-java-interfaces-with-different-arguments)
* [在 Kotlin 中使用 Java SAM 接口](#java-sam-interfaces-in-kotlin)

#### 更多情况下类型能够自动推断

对很多情况下旧算法无法推断类型, 因此要求你明确指定类型, 而新的推断算法能够正确推断类型.
比如, 下面示例程序中, Lambda 表达式的 `it` 参数类型能够正确的推断为 `String?`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
//sampleStart
val rulesMap: Map<String, (String?) -> Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)
//sampleEnd

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```
</div>

在 Kotlin 1.3 中, 你需要引入一个明确的 Lambda 表达式参数,
或者把 `to` 替换为 `Pair` 构造函数, 并使用明确的泛型参数, 代码才能正确工作.

#### 对 Lambda 内最后一条表达式的智能类型转换

在 Kotlin 1.3 中, Lambda 之内的最后一条表达式无法智能类型转换, 除非你明确指定类型.
因此, 在下面的示例程序中, Kotlin 1.3 将 `result` 变量的类型推断为 `String?`:

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // Kotlin 编译器知道这里的 str 不是 null
}
// 'result' 的类型在 Kotlin 1.3 中是 String?, 在 Kotlin 1.4 中则是 String
```

在 Kotlin 1.4 中, 由于新推断算法的帮助, Lambda 中最后一条表达式能够进行智能类型转换了,
并且, 这个新的更加准确的类型会被用来推断 Lambda 表达式的结果类型.
因此, `result` 变量的类型变成了 `String`.

在 Kotlin 1.3 中, 你经常需要添加明确的类型转换 (使用 `!!` 或 `as String` 之类的类型转换)
才能让这些代码正常工作,
现在, 这些类型转换代码不再需要了.

#### 对可调用引用的智能类型转换

在 Kotlin 1.3 中, 你不能访问智能转换类型的成员引用. 在 Kotlin 1.4 中, 现在你可以了:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
import kotlin.reflect.KFunction

sealed class Animal
class Cat : Animal() {
    fun meow() {
        println("meow")
    }
}

class Dog : Animal() {
    fun woof() {
        println("woof")
    }
}

//sampleStart
fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat -> animal::meow
        is Dog -> animal::woof
    }
    kFunction.call()
}
//sampleEnd

fun main() {
    perform(Cat())
}
```

</div>

animal 变量经过智能类型转换变为具体的类型 `Cat` 和 `Dog`,
在此之后, 你可以使用不同的成员引用 `animal::meow` 和 `animal::woof`.
在类型检查之后, 你可以访问对应的子类型的成员引用.

#### 对委托属性更好的类型推断

在分析 `by` 关键字之后的委托表达式时, 不会考虑委托属性的类型.
比如, 下面的代码在以前的版本中无法编译, 但现在编译器对 `old` 和 `new` 参数的类型,
能够正确的推断为 `String?`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new ->
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```

</div>

#### 使用不同的参数对 Java 接口进行 SAM 转换

Kotlin 从一开始就支持对 Java 接口的 SAM 转换, 但有一种情况不支持, 因此在使用既有的 Java 库时造成一些麻烦.
如果你调用一个 Java 方法, 这个方法接受两个 SAM 接口作为参数, 两个参数必须都是 Lambda 表达式, 或者都是通常的对象.
这时你不能传递 Lambda 表达式给一个参数, 同时传递对象给另一个参数.

新算法解决了这个问题, 因此任何情况下你都可以象你很自然的预期的那样,
传递 Lambda 表达式, 而不需要传递 SAM 接口.

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // 在 Kotlin 1.4 可以正常工作
}
```

#### 在 Kotlin 中使用 Java SAM 接口

在 Kotlin 1.4 中, 你可以在 Kotlin 中使用 Java SAM 接口, 并对它们进行 SAM 转换.

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() {
    foo { } // OK
}
```

在 Kotlin 1.3 中, 你需要在 Java 代码中声明上面的函数 `foo`, 然后才能进行 SAM 转换.

### 统一的后端和扩展性

在 Kotlin 中, 我们有 3 种后端用来生成可执行代码: Kotlin/JVM, Kotlin/JS, 和 Kotlin/Native.
Kotlin/JVM 和 Kotlin/JS 之间没有太多共用代码, 因为它们是分别独立开发的.
Kotlin/Native 基于一种新的基础架构, 它对 Kotlin 代码使用一种中间表达形式(IR, intermediate representation).

我们现在将 Kotlin/JVM 和 Kotlin/JS 一直到同样的 IR.
因此, 所有这 3 种后端共用很多逻辑, 并且使用相同的输入输出管道.
所以对所有的平台, 我们对大多数功能特性, 优化, 以及 bug 修复, 只需要实现一次.
这 2 种新的基于 IR 的后端都处于 [Alpha](components-stability.html) 阶段.

这种共通的后端基础架构还使得我们可以开发跨平台的编译器扩展.
你可以在编译过程的输入输出管道中添加 plugin, 添加自定义的处理和转换, 你的扩展代码可以自动适用于所有的平台.

我们鼓励你使用我们的新 [JVM IR](#new-jvm-ir-backend) 和 [JS IR](#new-js-ir-backend) 后端,
它们还处于 Alpha 阶段, 希望你能向我们反馈意见.


## Kotlin/JVM

Kotlin 1.4.0 包含很多针对 JVM 的改进, 比如:

* [新的 JVM IR 后端](#new-jvm-ir-backend)
* [在接口中生成默认方法的新模式](#new-modes-for-generating-default-methods)
* [对 null 值检查统一异常类型](#unified-exception-type-for-null-checks)
* [在 JVM 字节码中的类型注解](#type-annotations-in-the-jvm-bytecode)

### 新的 JVM IR 后端

和 Kotlin/JS 一样, 我们正在将 Kotlin/JVM 移植到 [统一的 IR 后端](#unified-backends-and-extensibility),
这个后端使得我们可以对大多数功能特性和 bug 修复在所有的平台只需要实现一次.
你也能够对这个后端创建跨平台的扩展, 可以在所有的平台上工作.

Kotlin 1.4.0 还没有提供公开的 API 对这些扩展, 但我们正在和我们的伙伴密切合作,
包括 [Jetpack Compose](https://developer.android.com/jetpack/compose),
他们已经使用我们的新后端, 创建了他们的编译器 plugin.

我们鼓励你试用新的 Kotlin/JVM 后端, 它目前还处于 Alpha 阶段, 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交问题和新特性请求.
你的帮助能够使我们更快的统一编译器的输入输出管道, 并将编译器扩展, 比如 Jetpack Compose, 带入 Kotlin 开发社区.

要启用新的 JVM IR 后端, 需要在你的 Gradle 构建脚本中指定一个额外的编译器选项:

```kotlin
kotlinOptions.useIR = true
```

> 如果 [启用 Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en),
> 将会自动开始使用新的 JVM 后端, 而不必在 `kotlinOptions` 中指定编译器选项.
{:.note}

使用命令行编译器时, 需要添加编译器选项 `-Xuse-ir`.

> 只有在启用新后端时, 你才可以使用新的 JVM IR 后端编译的代码. 否则将会发生错误.
> 考虑到这一点, 我们不推荐库的作者在产品代码中切换到新的后端.
{:.note}

### 在接口中生成默认方法的新模式

编译 Kotlin 代码到 JVM 1.8 或以上版本时, 可以将 Kotlin 接口中的非抽象方法编译为 Java 的 `default` 方法.
实现这个目的的方式是, 使用 `@JvmDefault` 注解用来标记这些方法, 并使用 `-Xjvm-default` 编译器选项来启用对这个注解的处理.

在 1.4.0 中, 我们添加了一种新模式来生成默认方法:
`-Xjvm-default=all` 将 *所有的* Kotlin 接口的非抽象方法 编译为 `default` 的 Java 方法.
对于那些编译为没有 `default` 方法的接口, 为了兼容使用它们的代码, 还添加了 `all-compatibility` 模式.

关于与 Java 交互时的默认方法, 更多详细信息请参见 [Kotlin 与 Java 交互的相关文档](jvm/java-to-kotlin-interop.html#default-methods-in-interfaces) 和
[这篇 Blog](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/).

### 对 null 值检查统一异常类型

从 Kotlin 1.4.0 开始, 所有的运行时 null 值检查会抛出一个 `java.lang.NullPointerException` 异常,
而不是 `KotlinNullPointerException`, `IllegalStateException`, `IllegalArgumentException`, 和 `TypeCastException`.
这个规则适用于: `!!` 操作符, 在方法开始处的参数 null 值检查, 平台类型表达式的 null 值检查, 以及使用非 null 类型的 `as` 操作符.
但不适用于 `lateinit` null 值检查, 以及明确的库函数调用, 比如 `checkNotNull` 或 `requireNotNull`.

这个变化使得我们可以增加对 null 值检查的优化, 这些优化可以由 Kotlin 编译器执行, 或由各种字节码处理工具执行,
比如 Android [R8 优化器](https://developer.android.com/studio/build/shrink-code).

注意, 从开发者的角度来看, 并没有太大变化: Kotlin 代码还是会抛出异常, 错误消息和以前一样.
异常的类型变了, 但异常附带的信息是一样的.

### 在 JVM 字节码中的类型注解

Kotlin 现在可以在 JVM 字节码 (1.8+ 版本) 中生成类型注解, 因此在运行时可以通过 Java 反射得到这些信息.
要在字节码中产生类型注解, 需要以下步骤:

1. 确定你声明的注解指定了正确的注解目标 (Java 的 `ElementType.TYPE_USE`, 或 Kotlin 的 `AnnotationTarget.TYPE`),
以及正确的 retention (`AnnotationRetention.RUNTIME`).
2. 将注解类声明编译为版本 1.8+ 的 JVM 字节码. 你可以通过编译器选项 `-jvm-target=1.8` 来指定 JVM 字节码.
3. 将使用注解的代码编译为版本 1.8+ 的 JVM 字节码(`-jvm-target=1.8`), 并添加 `-Xemit-jvm-type-annotations` 编译器选项.

注意, 标准库中的类型注解现在不会生成到字节码中, 因为标准库编译使用的字节码版本是 1.6.

到目前位置, 只支持一些基本的场景:

- 方法参数, 方法返回类型, 以及属性类型上的类型注解;
- 类型参数的不可变投射(Invariant Projection), 比如 `Smth<@Ann Foo>`, `Array<@Ann Foo>`.

在下面的示例程序中, `String` 类型上的 `@Foo` 注解可以生成到字节码中, 然后可以供库代码使用:

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```


## Kotlin/JS

对 JS 平台, Kotlin 1.4.0 提供了以下改进:

- [新的 Gradle DSL](#new-gradle-dsl)
- [新的 JS IR 后端](#new-js-ir-backend)

### 新的 Gradle DSL

`kotlin.js` Gradle plugin 带有调整过的 Gradle DSL, 它提供一些新的配置选项,
而且更加接近 `kotlin-multiplatform` plugin 使用的 DSL.
影响最大的变化包括:

- 通过 `binaries.executable()` 明确的创建可执行文件.
关于可执行的 Kotlin/JS 及其环境, 更多详情请阅读 [Kotlin/JS 的运行及其环境](js/js-project-setup.html#choosing-execution-environment).
- 在 Gradle 配置内, 通过 `cssSupport` 来配置 webpack 的 CSS 和样式装载器.
关于如何使用这些功能, 更多详情请阅读 [使用 CSS 与样式装载器(Style Loader)](js/js-project-setup.html#configuring-css).
- 对 npm 依赖项管理的改进, 需要指定版本号, 或者 [semver](https://docs.npmjs.com/misc/semver#versions) 版本范围,
以及使用 `devNpm`, `optionalNpm` 和 `peerNpm` 支持 _development_, _peer_, 和 _optional_ npm 依赖项.
关于 npm 包的依赖项管理, 更多详情请阅读 [直接使用 Gradle 管理 npm 的包依赖项目](js/js-project-setup.html#npm-dependencies).
- 对 Kotlin 外部声明生成器 [Dukat](https://github.com/Kotlin/dukat) 提供了更强的集成.
外部声明现在可以在构建时期生成, 也可以通过 Gradle 任务手动生成.

### 新的 JS IR 后端

[用于 Kotlin/JS 的 IR 后端](js/js-ir-compiler.html), 稳定性现在处于 [Alpha](components-stability.html) 阶段,
它针对 Kotlin/JS 编译目标提供了一些新的功能, 主要包括, 通过死代码消除来改善生成代码的大小,
以及改进与 JavaScript 和 TypeScript 的交互, 以及其他功能.

要启用 Kotlin/JS IR 后端, 请在你的 `gradle.properties` 文件中设置 `kotlin.js.compiler=ir`,
或者在 你的 Gradle build 脚本中, 向 `js` 函数传递 `IR` 编译器类型:

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // 或者使用: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

关于如何配置新的编译器后端, 更多详情请阅读 [Kotlin/JS IR 编译器文档](js/js-ir-compiler.html).

使用新的 [@JsExport](js/js-to-kotlin-interop.html#jsexport-annotation) 注解,
以及 **从 Kotlin 代码 [生成 TypeScript 定义](js/js-ir-compiler.html#preview-generation-of-typescript-declaration-files-d-ts)** 的能力,
Kotlin/JS IR 编译器后端改进了与 JavaScript & TypeScript 的交互能力.
也使得 Kotlin/JS 代码更容易与既有的工具集成, 来创建 **混合应用程序**, 并在跨平台项目利用代码共用功能.

[关于 Kotlin/JS IR 编译器后端的详细功能特性, 请阅读这篇文档](js/js-ir-compiler.html).


## Kotlin/Native

在 1.4.0 中, Kotlin/Native 有了大量的新功能和改进, 包括:

* [在 Swift 和 Objective-C 中支持挂起函数](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [默认支持 Objective-C 泛型](#objective-c-generics-support-by-default)
* [在与 Objective-C/Swift 交互中的异常处理](#exception-handling-in-objective-c-swift-interop)
* [默认为 Apple 平台生成发行版的 .dSYM 文件](#generate-release-dsyms-on-apple-targets-by-default)
* [性能改进](#performance-improvements)
* [简化 CocoaPods 依赖项管理](#simplified-management-of-cocoapods-dependencies)

### 在 Swift 和 Objective-C 中支持 Kotlin 的挂起函数

在 1.4.0 中, 我们对 Swift 和 Objective-C 的挂起函数添加了基本的支持.
现在, 如果你将 Kotlin 模块编译为 Apple 框架, 挂起函数可以作为带有回调的函数来使用(用 Swift/Objective-C 术语来说就是 `completionHandler`).
如果在生成的框架头文件中中存在这样的函数, 可以从你的 Swift 或 Objective-C 代码中调用这些函数, 还可以覆盖它们.

比如, 如果你编写了这样的 Kotlin 函数:

```kotlin
suspend fun queryData(id: Int): String = ...
```

...那么可以从 Swift 代码中调用它, 如下:

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[关于在 Swift 和 Objective-C 中使用挂起函数, 请阅读这篇文档](native/objc_interop.html).

### 默认支持 Objective-C 泛型

以前的 Kotlin 版本 提供了实验性功能, 在与 Objective-C 交互时支持泛型.
从 1.4.0 开始, Kotlin/Native 默认情况下会从 Kotlin 代码生成带有泛型的 Apple 框架.
在一些情况下, 这个结果可能会导致既有的, 调用 Kotlin 框架的 Objective-C 或 Swift 代码无法工作.
如果要让生成的框架头文件不带泛型, 请添加编译器选项 `-Xno-objc-generics`.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

请注意, [关于与 Objective-C 交互的文档](native/native-objc-interop.html#generics) 中列出的所有功能细节和限制, 仍然有效.

### 在与 Objective-C/Swift 交互中的异常处理

在 1.4.0 中, 我们稍微修改了从 Kotlin 生成的 Swift API, 使其符合异常翻译的方式.
Kotlin 和 Swift 的错误处理存在根本的差别. 所有的 Kotlin 异常都是不受控的(unchecked), 而 Swift 只存在受控的(checked)错误.
因此, 要让 Swift 代码能够知道存在哪些预期的异常, Kotlin 函数应该标记 `@Throws` 注解, 指明这个函数可能发生的异常类型列表.

在编译为 Swift 或 Objective-C 框架时, 标记了或继承了 `@Throws` 注解的函数会被表达为 Objective-C 中的产生 `NSError*` 的方法,
以及 Swift 中的 `throws` 方法.

在以前的版本中, 除 `RuntimeException` 和 `Error` 之外的任何异常都会作为 `NSError` 来传递.
现在这个变更为:
只对`@Throws` 注解的参数中指定的异常类(或它们的子类)的实例才会抛出 `NSError`.
到达 Swift/Objective-C 的其他 Kotlin 异常将被认为是未处理的错误, 并导致程序终止.

### 默认为 Apple 平台生成发行版的 .dSYM 文件

从 1.4.0 开始, 在 Darwin 平台下, Kotlin/Native 编译器对发行版的二进制文件默认会产生 [调试符号文件(debug symbol file)](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information) (`.dSYM` 文件).
这个功能可以使用编译器选项 `-Xadd-light-debug=disable` 关闭.
在其他平台下, 这个功能默认是关闭的. 要在 Gradle 中设置这个选项, 请使用:

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[关于应用程序崩溃报告的符号化, 请阅读这篇文档](native/native-ios-symbolication.html).

### 性能改进

Kotlin/Native 完成了很多性能改进, 提高了开发速度, 也提高了执行速度.
下面是一些例子:

- 为了改善对象分配的速度, 我们现在提供 [mimalloc](https://github.com/microsoft/mimalloc) 内存分配器,
作为系统默认分配器的一个替代选项. 在一些新能评测中, mimalloc 工作速度要快 2 倍.
目前, 在 Kotlin/Native 中使用 mimalloc 还是实验性功能; 你可以使用编译器选项 `-Xallocator=mimalloc` 来切换到 mimalloc.

- 我们重写了 C 交互库的构建工具. 使用新的工具, Kotlin/Native 产生交互库的速度达到以前的 4 倍,
而且库文件大小只有以前的 25% 到 30%.

- 通过 GC 中的优化改善了运行时的整体性能. 在在使用大量长生存齐对象的项目中, 这个性能改进尤其明显.
由于去掉了多余的对象装箱(boxing)处理, `HashMap` 和 `HashSet` 现在工作更加快速了.

- 在 1.3.70 中我们引入了 2 个改善 Kotlin/Native 编译性能的新功能:
[缓存项目依赖项, 以及从 Gradle daemon 中运行编译器](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native).
在这之后, 我们修复了很多问题, 并改善了这些功能的整体稳定性.

### 简化 CocoaPods 依赖项管理

在以前的版本中, 只要你的项目集成了依赖项管理器 CocoaPods,
你的项目与 iOS, macOS, watchOS, 或 tvOS 相关的部分就只能在 Xcode 中构建,
这部分将与你的跨平台项目的其它部分分离. 其他部分可以在 IntelliJ IDEA 中构建.

而且, 每次你添加一个保存在 CocoaPods (Pod 库) 中的 Objective-C 库的依赖项,
你都必须从 IntelliJ IDEA 切换到 Xcode, 调用 `pod install`, 然后在 Xcode 中执行构建.

现在, 你可以直接在 IntelliJ IDEA 中管理 Pod 依赖项, 同时又能在编码时享受它提供的好处, 比如代码高亮度和自动完成.
你还可以使用 Gradle 构建整个 Kotlin 项目, 不再需要切换到 Xcode.
这就意味着, 只有在需要编写 Swift/Objective-C 代码时, 或需要在模拟器或设备上运行你的应用程序时, 才需要切换到 Xcode.

现在你还可以使用存储在本地的 Pod 库.

根据你的需求不同, 可以添加以下依赖项:
* Kotlin 项目 与 存储在远程 CocoaPods 仓库的或存储在本地机器的 Pod 库之间的依赖.
* Kotlin Pod (作为 CocoaPods 依赖项使用的 Kotlin 项目) 与 带有一个或多个编译目标的 Xcode 项目之间的依赖.

完成初始配置时, 以及添加新依赖项到 `cocoapods` 时, 只需要在 IntelliJ IDEA 中重新导入项目.
新依赖项会添加自动. 不需要额外的操作步骤.

[关于如何添加依赖项, 请阅读这篇文档](native/native-cocoapods-libraries.html).


## Kotlin Multiplatform

> 跨平台项目功能现在处于 [Alpha](components-stability.html) 阶段.
> 在未来的 Kotlin 版本中, 这个功能的兼容性可能会改变, 需要手工迁移.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
{:.note}

[Kotlin Multiplatform](multiplatform/multiplatform.html) 可以减少对 [不同的平台](multiplatform/multiplatform-dsl-reference.html#targets) 编写和维护相同代码的时间,
又能同时保持原生程序开发的灵活性便利. 我们一直在努力开发各种跨平台的新功能特性和改进:

* [使用层级项目结构在多个编译目标中共用代码](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [在层级结构中使用原生库](#leveraging-native-libs-in-the-hierarchical-structure)
* [kotlinx 依赖项只需要指定一次](#specifying-dependencies-only-once)

> 跨平台项目需要 Gradle 6.0 或更高版本.
{:.note}

### 使用层级项目结构在多个编译目标中共用代码

使用新的层级项目结构, 在一个 [跨平台项目](multiplatform/multiplatform-discover-project.html) 中,
你可以在 [多个平台](multiplatform/multiplatform-dsl-reference.html#targets) 间共用代码.

在以前的版本中, 添加到跨平台项目的代码, 可以放在平台相关的源代码集中, 只限于一个编译目标使用, 不能被其他任何平台重用,
也可以放在共通源代码集中, 比如 `commonMain` 或 `commonTest`, 被项目中的所有平台共用.
在共通源代码集中, 你只能通过使用
[`expect` 声明(需要对应的平台相关的 `actual` 实现)](multiplatform/multiplatform-expect-actual.html) 来调用平台相关的 API.

通过这种机制很容易实现 [在所有的平台上共用代码](multiplatform/multiplatform-share-on-platforms.html#share-code-on-all-platforms),
但不容易 [只在一部分编译目标中共用代码](multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms),
尤其是对于那些类似的编译目标, 本来可能重用很多共通逻辑和第三方 API.

比如, 在一个针对 iOS 平台的典型的跨平台项目中, 有 2 个 iOS 相关的编译目标: 一个针对 iOS ARM64 设备, 另一个针对 x64 模拟器.
它们的平台相关源代码集是分离的, 但实际上, 对真实设备和模拟器极少需要不同的代码, 并且它们的依赖项也是非常类似的.
因此对这 2 个编译目标, iOS 相关的代码是可以共用的.

显然, 在这样的设置中, 我们需要有 *对 2 个 iOS 编译目标的共用的源代码集*,
其中包含 Kotlin/Native 代码, 并且仍然能够直接调用那些对于 iOS 设备和模拟器共通的 API.

<img class="img-responsive" src="{{ url_for('asset', path='docs/images/multiplatform/iosmain-hierarchy.png') }}" alt="对于 iOS 编译目标的代码共用" width="300"/>

现在你可以通过 [层级项目结构](multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 来实现这样的代码共用,
它能够通过使用源代码集合的编译目标, 来推断和适用各个源代码集中可用的 API 和语言功能特性.

对于共通的编译目标组合, 你可以使用编译目标的简写(shortcut)来创建层级结构.
比如, 可以通过 `ios()` 简写, 创建上面例子中的 2 个 iOS 编译目标以及共用的源代码集:

```kotlin
kotlin {
    ios() // 这里会创建 iOS 设备和模拟器的编译目标; iosMain 和 iosTest 源代码集
}
```

关于编译目标的其他组合, 请使用 `dependsOn` 关系连接源代码集,
来 [手动创建层级结构](multiplatform/multiplatform-hierarchy.html#manual-configuration).

![层级结构]({{ url_for('asset', path='docs/images/multiplatform/manual-hierarchical-structure.png') }})

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}

```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin{
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</div>
</div>

有了层级项目结构的帮助, 库也可以对一部分编译目标提供共通的 API.
更多详情请参见 [在库中共用代码](multiplatform/multiplatform-share-on-platforms.html#share-code-in-libraries).

### 在层级结构中使用原生库

在几个原生编译目标间共用的源代码集中, 可以使用平台依赖的库, 比如 Foundation, UIKit, 和 POSIX.
这个功能可以帮助你共用更多的原生代码, 不受平台相关依赖项的限制.

不需要额外的步骤 – 所有事情都会自动完成. IntelliJ IDEA 会帮助你发现可以在共用代码中使用的共通声明.

更多详情请参见 [使用平台依赖的库](multiplatform/multiplatform-share-on-platforms.html#connect-platform-specific-libraries).

### 依赖项只需要指定一次

从现在开始, 在共用的和平台相关的源代码集中, 不再需要对同一个库的不同的变体指定依赖项,
只需要在共用的源代码集中指定依赖项一次.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}

```

</div>
</div>

不要使用 kotlinx 库的带有平台后缀的 artifact 名, 比如  `-common`, `-native`, 或其他类似名称, 因为这些名称已经不再支持了.
而应该使用库的基本 artifact 名, 在上面的示例程序中是 `kotlinx-coroutines-core`.

但是, 这个变化不适用于以下情况:
* `stdlib` 库 – 从 Kotlin 1.4.0 开始, [stdlib 依赖项会添加自动](#dependency-on-the-standard-library-added-by-default).
* `kotlin.test` 库 – 你还是应该使用 `test-common` 和 `test-annotations-common`.
这些依赖项会在后文中讨论.

如果你只对一个特定的平台需要某个依赖项, 你仍然可以使用标准库和 kotlinx 库的平台相关的, 带后缀 `-jvm` 或 `-js` 的变体,
比如 `kotlinx-coroutines-core-jvm`.

[关于配置依赖项, 请阅读这篇文档](gradle/gradle-configure-project.html#configure-dependencies).


## Gradle 项目的改进

除了 [Kotlin Multiplatform](#kotlin-multiplatform), [Kotlin/JVM](#kotlin-jvm),
[Kotlin/Native](#kotlin-native), 和 [Kotlin/JS](#kotlin-js) 的 Gradle 项目功能特性和改进之外,
对于所有的 Kotlin Gradle 项目, 还有以下变化:

* [标准库的依赖项现在会默认添加](#dependency-on-the-standard-library-added-by-default)
* [Kotlin 项目需要新版本的 Gradle](#minimum-gradle-version-for-kotlin-projects)
* [IDE 中对 Kotlin Gradle DSL 支持的改进](#improved-gradle-kts-support-in-the-ide)

### 标准库的依赖项现在会默认添加

在任何 Kotlin Gradle 项目中, 不再需要声明对 `stdlib` 库的依赖项, 包括跨平台项目.
这个依赖项会默认添加.

自动添加的标准库版本与 Kotlin Gradle plugin 相同,
因为它们使用相同的版本号发布.

对于平台相关的源代码集, 会使用标准库在对应的平台上的变体, 对其他源代码集会添加共通标准库.
Kotlin Gradle plugin 会根据你的 Gradle build 脚本中的 `kotlinOptions.jvmTarget` [编译器选项](gradle/gradle-compiler-options.html),
来选择适当的 JVM 标准库.

[关于如何改变默认行为, 请阅读这篇文档](gradle/gradle-configure-project.html#dependency-on-the-standard-library).

### Kotlin 项目需要的 Gradle 最低版本

要在你的 Kotlin 项目中使用新的功能特性, 需要将 Gradle 更新到 [最新版本](https://gradle.org/releases/).
跨平台项目需要 Gradle 6.0 或更高版本, 其他 Kotlin 项目可以使用 Gradle 5.4 或更高版本.

### IDE 中对 *.gradle.kts 支持的改进

在 1.4.0 中, 我们继续改进了 IDE 对 Gradle Kotlin DSL 脚本(`*.gradle.kts` 文件) 的支持.
新版本的带来的新功能如下:

- _脚本配置的明确加载_. 以前的版本中, 你对构建脚本的变更会在后台自动加载.
为了改善性能, 在 1.4.0 中我们关闭了构建脚本配置的自动加载.
现在只有在你明确适用时, IDE 才会加载这些变更.

  Gradle 6.0 以前的版本中, 你需要在编辑器中点击 **Load Configuration** 来手动加载脚本配置.

  ![*.gradle.kts – 加载配置]({{ url_for('asset', path='docs/images/whatsnew/gradle-kts-load-config.png') }})

  在 Gradle 6.0 及以上的版本, 你可以点击 **Load Gradle Changes** 来明确适用变更, 或者也可以重新导入 Gradle 项目.

  我们在 IntelliJ IDEA 2020.1 (使用 Gradle 6.0 及以上的版本) 中添加了一种新的动作 – **Load Script Configurations**,
  它会加载脚本配置的变更, 而不会更新整个项目. 这样可以比重新导入整个项目花费更少的时间.

  ![*.gradle.kts – 加载脚本变更和加载 Gradle 变更]({{ url_for('asset', path='docs/images/whatsnew/gradle-kts.png') }})

  对新创建的脚本, 或使用新版本的 Kotlin plugin 第一次打开项目时,也应该 **Load Script Configurations**.

  使用 Gradle 6.0 及以上的版本, 你现在可以一次性加载所有的脚本, 以前的版本则不同, 这些脚本会分别独立加载.
  由于每次加载都需要执行 Gradle 配置过程, 因此对大的 Gradle 项目可能消耗大量资源.

  目前这些加载仅限于 `build.gradle.kts` 和 `settings.gradle.kts` 文件 (请投票支持相关的 [issue](https://github.com/gradle/gradle/issues/12640)).
  如果要对 `init.gradle.kts` 或应用的 [脚本 plugin](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins) 启用语法高亮,
  请使用旧机制 – 将它们添加到独立脚本. 对这个脚本的配置会在你需要它的时候单独加载.
  你也可以对这个脚本启用自动重加载 .

  ![*.gradle.kts – 添加到独立脚本]({{ url_for('asset', path='docs/images/whatsnew/gradle-kts-standalone.png') }})

- _更好的错误报告_. 在以前的版本中, Gradle Daemon 发生的错误只能在分离的日志文件中看到.
现在 Gradle Daemon 直接返回错误的所有信息, 并显示到 Build 工具窗口.
这个改进可以节省你很多时间和精力.


## 标准库

Kotlin 标准库 1.4.0 中最重要的变化如下:

- [共通的异常处理 API](#common-exception-processing-api)
- [用于数组和集合的新函数](#new-functions-for-arrays-and-collections)
- [字符串操作函数](#functions-for-string-manipulations)
- [位操作](#bit-operations)
- [委托属性的改进](#delegated-properties-improvements)
- [KType 转换为 Java 类型](#converting-from-ktype-to-java-type)
- [用于 Kotlin 反射的 Proguard 配置](#proguard-configurations-for-kotlin-reflection)
- [既有 API 的改进](#improving-the-existing-api)
- [stdlib 库文件的 module-info 描述符](#module-info-descriptors-for-stdlib-artifacts)
- [废弃的功能](#deprecations)
- [删除了已废弃的实验性协程](#exclusion-of-the-deprecated-experimental-coroutines)

### 共通的异常处理 API

以下 API 移动到了共通库中:

* `Throwable.stackTraceToString()` 扩展函数, 返回这个 throwable 的详细描述信息和 stack trace,
以及 `Throwable.printStackTrace()` 函数, 将这个描述信息打印到标准错误输出.
* `Throwable.addSuppressed()` 函数, 你可以指定被压制的异常, 用来传递这些异常,
以及 `Throwable.suppressedExceptions` 属性, 返回所有的被压制的异常的列表.
* `@Throws` 注解, 它列出(在 JVM 或 原生 平台)当函数编译为平台方法时, 需要检查的那些异常类型.

### 用于数组和集合的新函数

#### 集合

在 1.4.0 中, 标准库包括一组有用的函数, 可用于处理 **collections**:

* `setOfNotNull()`, 根据参数指定的集合生成一个 set, 其中包含所有的非 null 元素.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    </div>

* `shuffled()`, 用于序列.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) // 100 以内的 5 个随机偶数
    //sampleEnd
    }
    ```
    </div>

* `*Indexed()` 版的 `onEach()` 和 `flatMap()`函数.
 用于集合元素的操作, 参数是元素的下标.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
        listOf("a", "b", "c", "d").onEachIndexed {
            index, item -> println(index.toString() + ":" + item)
        }

       val list = listOf("hello", "kot", "lin", "world")
              val kotlin = list.flatMapIndexed { index, item ->
                  if (index in 1..2) item.toList() else emptyList()
              }
    //sampleEnd
              println(kotlin)
    }
    ```
    </div>

* `*OrNull()` 版的 `randomOrNull()`, `reduceOrNull()`, 和 `reduceIndexedOrNull()` 函数.
这些函数对空集合返回 `null` .

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // 异常: 空集合不能执行 reduce 操作.
    //sampleEnd
    }
    ```
    </div>

* `runningFold()`, 它是 `scan()` 的同义函数, 以及 `runningReduce()`, 对集合元素顺序的执行给定的操作,
 这两个函数与 `fold()` 以及 `reduce()` 类似; 区别是这些新函数返回整个中间结果的序列.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = mutableListOf(0, 1, 2, 3, 4, 5)
        val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
        val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
    //sampleEnd
        println(runningReduceSum.toString())
        println(runningFoldSum.toString())
    }
    ```
    </div>

* `sumOf()` , 参数是一个选择器函数, 返回结果是集合所有元素的合计值.
`sumOf()` 可以产生 `Int`, `Long`, `Double`, `UInt`, 和 `ULong` 类型的合计值.
在 JVM 平台, 还可以使用 `BigInteger` 和 `BigDecimal`.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)

    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))

        val total = order.sumOf { it.price * it.count } // 结果为 Double 类型
        val count = order.sumOf { it.count } // 结果为 Int 类型
    //sampleEnd
        println("You've ordered $count items that cost $total in total")
    }
    ```
    </div>

* `min()` 和 `max()` 函数改名为 `minOrNull()` 和 `maxOrNull()`, 以便符合 Kotlin 集合 API 中使用的命名规约.
函数名称后缀 `*OrNull` 代表, 如果接受者集合为空, 它会返回 `null`.
同样的规则也适用于 `minBy()`, `maxBy()`, `minWith()`, `maxWith()` 函数 – 在 1.4 中,
这些函数都存在 `*OrNull()` 版本.
* 新的 `minOf()` 和 `maxOf()` 扩展函数, 指定的选择器函数, 返回集合元素的最小值和最大值.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)

    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    </div>

    还有 `minOfWith()` 和 `maxOfWith()` 函数, 参数是 `Comparator`,
    以及所有这 4 个函数的 `*OrNull()` 版本, 对空集合会返回 `null`.

* `flatMap` 和 `flatMapTo` 的新的重载版本, 变换处理的返回类型允许与接受者类型不匹配, 也就是:
    * 将 `Iterable`, `Array`, 和 `Map` 变换为 `Sequence`
    * 将 `Sequence` 变换为 `Iterable`

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
        val list = listOf("kot", "lin")
        val lettersList = list.flatMap { it.asSequence() }
        val lettersSeq = list.asSequence().flatMap { it.toList() }    
    //sampleEnd
        println(lettersList)
        println(lettersSeq.toList())
    }
    ```
    </div>

* `removeFirst()` 和 `removeLast()` 便捷函数, 从可变列表中删除元素, 以及这些函数的 `*orNull()` 版本.

#### 数组

为了在使用不同的容器类型时提供一致的体验, 我们还为 **数组** 添加了新的函数:

* `shuffle()` 将数组元素按随机顺序排列.
* `onEach()` 对每个数组元素执行给定的操作, 返回数组自身.
* `associateWith()` 和 `associateWithTo()` 函数, 使用数组元素作为键(key), 构建 map.
* `reverse()` 对数组的子范围内的元素反转顺序.
* `sortDescending()` 对数组的子范围内的元素逆排序.
* `sort()` 和 `sortWith()` 共通库中现在有了用于数组的子范围的版本.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
//sampleStart
    var language = ""
    val letters = arrayOf("k", "o", "t", "l", "i", "n")
    val fileExt = letters.onEach { language += it }
       .filterNot { it in "aeuio" }.take(2)
       .joinToString(prefix = ".", separator = "")
    println(language) // "kotlin"
    println(fileExt) // ".kt"

    letters.shuffle()
    letters.reverse(0, 3)
    letters.sortDescending(2, 5)
    println(letters.contentToString()) // [k, o, t, l, i, n]
//sampleEnd
}
```
</div>

此外, 还有用于 `CharArray`/`ByteArray` 和 `String` 之间转换的新函数:
* `ByteArray.decodeToString()` 和 `String.encodeToByteArray()`
* `CharArray.concatToString()` 和 `String.toCharArray()`

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
//sampleStart
	val str = "kotlin"
    val array = str.toCharArray()
    println(array.concatToString())
//sampleEnd
}
```
</div>

#### ArrayDeque

我们还添加了 `ArrayDeque` 类 – 双端队列(double-ended queue) 的一个实现.
对双端队列, 既可以从队列头部也可以从队列尾部添加或删除元素, 操作的平摊时间固定(amortized
constant time).
如果你的代码需要队列或栈, 那么默认可以使用双端队列.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
</div>

`ArrayDeque` 的实现在它的底层使用一个可变大小的数组: 它将队列内容保存在一个环形缓冲区, 也就是一个 `Array`,
并且只有当 `Array` 已满的时候才会调整这个 `Array` 的大小.

### 字符串操作函数

1.4.0 的标准库中, 字符串操作 API 包含一系列改进:

* `StringBuilder` 有很多有用的新扩展函数: `set()`, `setRange()`, `deleteAt()`, `deleteRange()`, `appendRange()`,
以及其他函数.
    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
        val sb = StringBuilder("Bye Kotlin 1.3.72")
        sb.deleteRange(0, 3)
        sb.insertRange(0, "Hello", 0 ,5)
        sb.set(15, '4')
        sb.setRange(17, 19, "0")
        print(sb.toString())
    //sampleEnd
    }
    ```
    </div>

* 在共通库中可以使用 `StringBuilder` 的一些既有函数. 包括 `append()`, `insert()`,
`substring()`, `setLength()`, 以及其他函数.
* 共通库添加了新函数 `Appendable.appendLine()` 和 `StringBuilder.appendLine()`.
这些函数替代了这些类的 `appendln()` 函数, 它只能用于 JVM 平台.

    <div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

    ```kotlin
    fun main() {
    //sampleStart
        println(buildString {
            appendLine("Hello,")
            appendLine("world")
        })
    //sampleEnd
    }
    ```
    </div>

### 位操作

用于位操作的新函数:
* `countOneBits()`
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()`
* `rotateLeft()` 和 `rotateRight()` (实验性功能)

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun main() {
//sampleStart
    val number = "1010000".toInt(radix = 2)
    println(number.countOneBits())
    println(number.countTrailingZeroBits())
    println(number.takeHighestOneBit().toString(2))
//sampleEnd
}
```
</div>

### 委托属性的改进

在 1.4.0 中, 我们添加了新的功能特性 改进 Kotlin 委托属性的使用体验:
- 现在一个属性可以委托给另一个属性.
- 新接口 `PropertyDelegateProvider` 帮助你使用单条声明来创建委托 provider.
- `ReadWriteProperty` 现在继承 `ReadOnlyProperty`, 因此对只读属性这两个接口都可以使用.

除了这些新 API 之外, 我们还做了一些优化, 来减少编译产生的字节码大小.
关于这些优化, 请参见 [这篇 Blog](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties).

[关于委托属性, 请阅读这篇文档](delegated-properties.html).

### KType 转换为 Java 类型

标准库中的一个新的扩展属性 `KType.javaType` (目前还在实验状态) 可以帮助你从 Kotlin 类型获取 `java.lang.reflect.Type`,
而不需要使用完整的 `kotlin-reflect` 依赖项.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
import kotlin.reflect.javaType
import kotlin.reflect.typeOf

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T> accessReifiedTypeArg() {
   val kType = typeOf<T>()
   println("Kotlin type: $kType")
   println("Java type: ${kType.javaType}")
}

@OptIn(ExperimentalStdlibApi::class)
fun main() {
   accessReifiedTypeArg<String>()
   // Kotlin type: kotlin.String
   // Java type: class java.lang.String

   accessReifiedTypeArg<List<String>>()
   // Kotlin type: kotlin.collections.List<kotlin.String>
   // Java type: java.util.List<java.lang.String>
}
```
</div>

### 用于 Kotlin 反射的 Proguard 配置

从 1.4.0 开始, 我们在 `kotlin-reflect.jar` 中嵌入了对 Kotlin 反射的 Proguard/R8 配置.
使用这个内置配置, 大多数使用 R8 或 Proguard 的 Android 项目可以与 kotlin-reflect 协同工作, 不需要任何额外的配置.
你不再需要复制粘贴用于 kotlin-reflect 的 Proguard 规则.
但要注意, 你仍然需要明确列出你需要反射的所有 API.

### 既有 API 的改进

* 一些函数现在可以使用 null 接受者, 比如:
    * 用于字符串的 `toBoolean()`
    * 用于数组的 `contentEquals()`, `contentHashcode()`, `contentToString()`

* `Double` 和 `Float` 中的 `NaN`, `NEGATIVE_INFINITY`, 和 `POSITIVE_INFINITY` 现在定义为 `const`,
因此你可以将它们用作注解参数.

* `Double` 和 `Float` 中的新常数 `SIZE_BITS` 和 `SIZE_BYTES`, 常数值为这些类型的二进制表达形式使用的位数和字节数.

* 顶级函数 `maxOf()` 和 `minOf()` 可以接受可变数量的参数(`vararg`).

### stdlib 库文件的 module-info 描述符

Kotlin 1.4.0 对标准库的默认 artifact 添加了 `module-info.java` 模块信息.
因此你可以使用在 [jlink tool](https://docs.oracle.com/en/java/javase/11/tools/jlink.html) 中使用它们,
这个工具会生成自定义的 Java 运行时可执行文件, 其中只包含 你的 App 所需要的平台模块.
以前, 你可能已经用 Kotlin 标准库 artifact 使用过 jlink, 但那时你需要使用分离的 artifact – 带有 "modular" 分类的那个 –
而且整个设置也不直观.
在 Android 中, 必须使用 Android Gradle plugin 版本 3.2 或更高版本, 这个版本可以正确处理带有模块信息的 jar 文件.

### 废弃的功能

#### Double 和 Float 的 toShort() 和 toByte() 函数

我们废弃了 `Double` 和 `Float` 的 `toShort()` 和 `toByte()` 函数, 原因是, 由于变量的取值范围变小, 这些函数可能产生预料之外的结果.

要将浮点数转换为 `Byte` 或 `Short`, 请使用二步转换: 首先, 转换为 `Int`, 然后再转换为目标类型.

#### 浮点数数组的 contains(), indexOf(), 和 lastIndexOf() 函数

我们废弃了 `FloatArray` 和 `DoubleArray` 的 `contains()`, `indexOf()`, 和 `lastIndexOf()` 扩展函数,
因为它们使用 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 标准的相等比较,
在一些极端情况下会与全顺序相等性(total order equality)矛盾. 详情请参见 [这个 issue](https://youtrack.jetbrains.com/issue/KT-28753).

#### 集合的 min() 和 max() 函数

我们废弃了集合函数 `min()` 和 `max()`, 改用 `minOrNull()` 和 `maxOrNull()`,
新的函数名更能反映它们的行为 – 对空集合返回 `null`.
详情请参见 [这个 issue](https://youtrack.jetbrains.com/issue/KT-38854).

### 删除了已废弃的实验性协程

在 1.3.0 中 `kotlin.coroutines.experimental` API 已被废弃, 改用 kotlin.coroutines.
在 1.4.0 中, 我们结束了 `kotlin.coroutines.experimental` 的废弃周期, 将它从标准库删除.
对于还在 JVM 上使用它的开发者, 我们提供了一个兼容的库 `kotlin-coroutines-experimental-compat.jar`,
其中包含所有的实验性协程 API.
我们已经将它发布到了 Maven, 而且在 Kotlin 发布版中, 除标准库之外也包括了这个库.


## JSON 序列化的稳定版

在 Kotlin 1.4.0 中, 我们发布了 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
的第一个稳定版本 - 1.0.0-RC.
现在我们高兴的宣布 `kotlinx-serialization-core` (以前称为 `kotlinx-serialization-runtime`)
中的 JSON 序列化 API 已经达到稳定状态.
用于其他序列化格式的库, 以及核心库的一些高级模块, 还继续处在实验状态.

我们还大量重写了 JSON 序列化 API, 使它更加统一, 而且更加易于使用.
今后我们还会继续开发 JSON 序列化 API, 并保持向后兼容.
但是, 如果你使用了这些 API 的以前的版本, 迁移到 1.0.0-RC 版时, 你将会需要重写你的一部分代码 .
为了帮助你进行版本迁移, 我们提供了一份 **[Kotlin 序列化 指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)** –
`kotlinx.serialization` 的完整文档.
这篇文档可以指导你如何使用那些最重要的功能特性 而且可以帮助你解决可能遇到的问题.

>**注意**: `kotlinx-serialization` 1.0.0-RC 只能在 Kotlin 编译器 1.4 下使用. 以前的编译器版本不能兼容.
{:.note}


## 脚本与 REPL

在 1.4.0 中, Kotlin 脚本有了很多功能和性能的改进, 以及其他更新.
下面是一些关键性的改变:

- [新的依赖项解析 API](#new-dependencies-resolution-api)
- [新的 REPL API](#new-repl-api)
- [脚本编译缓存](#compiled-scripts-cache)
- [Artifact 重命名](#artifacts-renaming)

为了帮助你熟悉 Kotlin 脚本, 我们贮备了一个 [示例项目](https://github.com/Kotlin/kotlin-script-examples).
其中包含标准脚本 (`*.main.kts`) 示例, 以及 Kotlin 脚本 API 的使用和自定义脚本定义的示例.
欢迎试用, 并通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 反馈你的意见.

### 新的依赖项解析 API

在 1.4.0 中, 我们引入了一个新的 API 来解析外部依赖项 (比如 Maven artifact), 以及它的实现.
这个 API 已经发布到了新的 artifact `kotlin-scripting-dependencies` 和 `kotlin-scripting-dependencies-maven` 中.
以前在 `kotlin-script-util` 库中的依赖项解析功能现在已经废弃.

### 新的 REPL API

新的实验性的 REPL API 现在是 Kotlin 脚本 API 的一部分.
在发布的 artifact 中存在几个实现, 以及一些高级功能, 比如代码完成.
我们在 [Kotlin Jupyter kernel](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/) 中使用了这个 API,
现在你可以在你自己的自定义 shell 和 REPL 中试用这个 API.

### 脚本编译缓存

Kotlin 脚本 API 现在能够实现脚本编译的缓存, 显著的提高了随后的未修改的脚本的执行速度.
我们的默认高级脚本实现 `kotlin-main-kts` 已经有了它自己的缓存.

### Artifact 重命名

为了避免 artifact 的名称混淆, 我们将 `kotlin-scripting-jsr223-embeddable` 和 `kotlin-scripting-jvm-host-embeddable`
重命名为 `kotlin-scripting-jsr223` 和 `kotlin-scripting-jvm-host`.
这些 artifact 依赖于 `kotlin-compiler-embeddable` artifact, 它会对打包的第三方库进行 shade, 以避免库的使用冲突.
通过这次重命名, 我们让脚本 artifact 默认使用 `kotlin-compiler-embeddable` (它通常更加安全).
如果出于某些原因, 你希望使用的 artifact 依赖于没有 shade 的 `kotlin-compiler`,
那么请使用带 `-unshaded` 后缀的 artifact 版本, 比如 `kotlin-scripting-jsr223-unshaded`.
注意, 这次重命名只影响那些应该直接使用的脚本 artifact; 其他 artifact 的名称维持不变.


## 迁移到 Kotlin 1.4.0

Kotlin plugin 的迁移工具, 可以帮助你将项目从更早的 Kotlin 版本迁移到 1.4.0.

只需要修改 Kotlin 版本到 `1.4.0`, 然后重新 import 你的 Gradle 或 Maven 项目.
然后 IDE 会询问你是否迁移.

如果你同意, IDE 会执行迁移代码审查, 这个过程会检查你的代码,
找出在 1.4.0 中不能正确工作的代码, 或不推荐的做法, 并建议如何修正.

<img class="img-responsive" src="{{ url_for('asset', path='docs/images/whatsnew/run-migration-wn.png' )}}" alt="执行迁移" width="300"/>

代码审查有不同的 [严重等级](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html),
可以帮助你决定接受哪些修正建议, 忽略哪些修正建议.

![迁移审查]({{ url_for('asset', path='docs/images/whatsnew/migration-inspection-wn.png') }})

Kotlin 1.4.0 是一个 [功能性发布版(Feature Release)](kotlin-evolution.html#feature-releases-and-incremental-releases),
因此会对语言带来一些不兼容的变更.
关于这些变更的详情, 请参加 **[Kotlin 1.4 兼容性指南](compatibility-guide-14.html)**.

<!-- ### 迁移跨平台项目

为了帮助你在既有的项目中开始使用 [Kotlin multiplatform](#kotlin-multiplatform) 的新功能特性,
我们发布了 [跨平台项目的迁移指南](multiplatform/multiplatform-hierarchy.html). -->
