[//]: # (title: Kotlin 1.6.20 版中的新功能)

_[发布日期: 2022/04/04](releases.md#release-details)_

Kotlin 1.6.20 带来了一些未来语言功能的预览版, 对跨平台项目默认使用层级结构, 还带来了对其它组件的改进.

你也可以观看这个概要介绍视频, 了解这个版本中的变更:

<video src="https://www.youtube.com/v/8F19ds109-o" title="Kotlin 1.6.20 版中的新功能"/>

## 语言功能

在 Kotlin 1.6.20 中, 你可以试用 2 个新的语言功能:

* [Kotlin/JVM 平台的上下文接受者(Context Receiver) 功能原型](#prototype-of-context-receivers-for-kotlin-jvm)
* [明确非 null 类型](#definitely-non-nullable-types)

### Kotlin/JVM 平台的上下文接受者(Context Receiver) 功能原型 {id="prototype-of-context-receivers-for-kotlin-jvm"}

> 这是一个仅限 Kotlin/JVM 平台使用的功能原型.
> 启用 `-Xcontext-receivers` 选项后, 编译器将会产生预发布的二进制文件, 不能用于产品代码中.
> 请只在你的玩具项目中使用上下文接受者功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

在 Kotlin 1.6.20 中, 你的接受者可以不限于只有一个. 如果你需要更多接受者, 你可以让函数, 属性, 和类依赖于上下文 (或者叫做 _与上下文相关_)
方法是向它们的声明添加上下文接受者.
一个与上下文相关的声明会:

* 它要求所有声明的上下文接受者, 都作为隐含的接受者出现在调用者的作用范围内.
* 它将声明的上下文接受者代入函数体的作用范围内, 成为隐含的接受者.

```kotlin
interface LoggingContext {
    val log: Logger // 这个上下文提供一个 logger 的引用
}

context(LoggingContext)
fun startBusinessOperation() {
    // 你可以访问 log 属性, 因为 LoggingContext 是一个隐含的接受者
    log.info("Operation has started")
}

fun test(loggingContext: LoggingContext) {
    with(loggingContext) {
        // 你需要在这个作用范围内存在一个 LoggingContext, 作为隐含的接受者
        // 然后才能调用 startBusinessOperation()
        startBusinessOperation()
    }
}
```

要在你的项目中启用上下文接受者功能, 请使用 `-Xcontext-receivers` 编译器选项.
关于这个功能的详细描述, 以及它的语法, 请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md#detailed-design).

请注意, 目前的实现只是一个原型:

* 启用 `-Xcontext-receivers` 后, 编译器将会产生预发布的二进制文件, 不能用于产品代码中.
* 目前 IDE 对上下文接受者功能只有极少的支持

请在你的玩具项目中试用这个功能, 在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-42435) 中并向我们反馈你的想法和体验.
如果你遇到任何问题, 请 [提交新的 issue](https://kotl.in/issue).

### 明确非 null 类型 {id="definitely-non-nullable-types"}

> 明确非 null 类型目前是 [Beta 版](components-stability.md).
> 已经接近稳定, 但未来可能会需要一些迁移步骤.
> 我们会尽力减少你需要进行的变更.
>
{style="warning"}

为了在扩展泛型的 Java 类和接口时提供更好的互操作性, Kotlin 1.6.20 允许你使用新的语法 `T & Any`, 将一个泛型类型参数标记为在使用端明确非 null.
这个语法来自 [交叉类型(Intersection Types)](https://en.wikipedia.org/wiki/Intersection_type) 的标记形式,
并且现在 `&` 左侧必须是上界可为 null 的类型参数, 右侧必须是非 null 的 `Any`:

```kotlin
fun <T> elvisLike(x: T, y: T & Any): T & Any = x ?: y

fun main() {
    // OK
    elvisLike<String>("", "").length
    // 错误: 'null' 不能作为一个非 null 类型的值
    elvisLike<String>("", null).length

    // OK
    elvisLike<String?>(null, "").length
    // 错误: 'null' 不能作为一个非 null 类型的值
    elvisLike<String?>(null, null).length
}
```
{validate="false"}

请将语言版本设置为 `1.7`, 来启用这个功能:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7'
        }
    }
}
```

</tab>
</tabs>

关于明确非 null 类型, 详情请参见
[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md).

## Kotlin/JVM

Kotlin 1.6.20 引入了以下变更:

* JVM 接口中默认方法的兼容性改进 : [用于接口的新的 `@JvmDefaultWithCompatibility` 注解](#new-jvmdefaultwithcompatibility-annotation-for-interfaces)
  以及 [`-Xjvm-default` 模式中的兼容性变更](#compatibility-changes-in-the-xjvm-default-modes)
* [在 JVM 后端中支持单个模块的并行编译](#support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend)
* [支持对函数式接口构造器的可调用引用](#support-for-callable-references-to-functional-interface-constructors)

### 用于接口的新的 @JvmDefaultWithCompatibility 注解 {id="new-jvmdefaultwithcompatibility-annotation-for-interfaces"}

Kotlin 1.6.20 引入了新的注解 [`@JvmDefaultWithCompatibility`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default-with-compatibility/):
这个注解和 `-Xjvm-default=all` 编译器选项一起使用,
可以为任何 Kotlin 接口中的任何非抽象成员, [在 JVM 接口中创建默认方法](java-to-kotlin-interop.md#default-methods-in-interfaces).

如果已经存在客户代码使用你 Kotlin 接口, 但 Kotlin 接口没有使用 `-Xjvm-default=all` 选项编译,
那么这些客户代码可能与使用这个选项编译后的代码二进制不兼容.
在 Kotlin 1.6.20 之前, 要避免这个兼容性问题,
[推荐的方案](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/#JvmDefaultWithoutCompatibility)
是使用 `-Xjvm-default=all-compatibility` 模式, 并对不需要这种兼容性的接口使用 `@JvmDefaultWithoutCompatibility` 注解.

这个方案存在一些问题:

* 添加新接口时, 你很容易忘记添加注解.
* 在非公开部分中, 通常会存在比公开 API 更多的接口, 因此你不得不在你代码中的很多地方添加这个注解.

现在, 你可以使用 `-Xjvm-default=all` 模式, 并使用 `@JvmDefaultWithCompatibility` 注解标注接口.
这样你就可以向公开 API 中的所有接口一次性添加这个注解, 而且不需要对新的非公开代码使用任何注解.

关于这个新注解, 请在 [这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-48217) 中留下你的反馈意见.

### -Xjvm-default 模式中的兼容性变更 {id="compatibility-changes-in-the-xjvm-default-modes"}

Kotlin 1.6.20 添加了选项, 对使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式编译的模块,
可以使用默认模式(`-Xjvm-default=disable` 编译器选项)编译模块.
以前, 如果所有模块都使用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 模式, 编译也会成功.
你可以在这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47000) 中留下你的反馈意见.

Kotlin 1.6.20 废弃了编译器选项 `-Xjvm-default` 的 `compatibility` 和 `enable` 模式.
在其它模式的描述中关于兼容性的部分也有变更, 但整体逻辑是没有变化.
详情请参见 [更新后的描述](java-to-kotlin-interop.md#compatibility-modes-for-default-methods).

关于与 Java 互操作时的默认方法, 详情请参见 [与 Java 互操作文档](java-to-kotlin-interop.md#default-methods-in-interfaces),
以及 [这篇 blog](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/).

### 在 JVM 后端中支持单个模块的并行编译 {id="support-for-parallel-compilation-of-a-single-module-in-the-jvm-backend"}

> 在 JVM 后端中支持单个模块的并行编译, 是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文), 而且你应该只为评估目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-46085) 提供你的反馈意见.
>
{style="warning"}

我们还在继续 [改善新的 JVM IR 后端的编译时间](https://youtrack.jetbrains.com/issue/KT-46768).
在 Kotlin 1.6.20 中, 我们添加了实验性的 JVM IR 后端模式, 并行的编译一个模块中的所有文件.
并行编译可以减少总的编译时间高达 15%.

要启用实验性的并行后端模式, 请使用 [编译器选项](compiler-reference.md#compiler-options) `-Xbackend-threads`.
对这个选项可以使用以下参数:

* `N` 是你想要使用的线程数量. 这个值不要大于你的 CPU 核数; 否则, 线程间的上下文切换会导致并行编译不会发生更多效果
* `0` 对每个 CPU 核, 使用单独的线程

[Gradle](gradle.md) 可以并行运行 task, 但如果从 Gradle 的观点来看, 一个项目(或一个项目的主要部分)只是一个很大的 task,
那么这种类型的并行带来的帮助不大.
如果你有非常大的单一模块, 请使用并行编译来提高编译速度.
如果你的项目包含很多小模块, 并且由 Gradle 并行的构建, 添加另一层的并行, 可能由于上下文切换反而导致性能损失.

> 并行编译存在一些条件:
> * 它不能与 [kapt](kapt.md) 一起工作, 因为 kapt 会禁用 IR 后端
> * 它的设计要求更多的 JVM heap 内存. heap 内存大小正比于线程数量
>
{style="note"}


### 支持对函数式接口构造器的可调用引用 {id="support-for-callable-references-to-functional-interface-constructors"}

> 支持对函数式接口构造器的可调用引用, 是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文), 而且你应该只为评估目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-47939) 提供你的反馈意见.
>
{style="warning"}

支持对函数式接口构造器的 [可调用引用](reflection.md#callable-references),
增加了一种源代码兼容的方式, 来将带构造器函数的接口迁移到 [函数式接口](fun-interfaces.md).

我们来看看以下代码:

```kotlin
interface Printer {
    fun print()
}

fun Printer(block: () -> Unit): Printer = object : Printer { override fun print() = block() }
```

有了对函数式接口构造器可调用引用, 这个代码可以替换为简单的函数式接口声明:

```kotlin
fun interface Printer {
    fun print()
}
```

它的构造器会隐含的创建, 任何使用 `::Printer` 函数引用的代码都可以正确编译.
比如:

```kotlin
documentsStorage.addPrinter(::Printer)
```
{validate="false"}

为了保持二进制兼容性, 可以对旧的函数 `Printer` 标注
[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)
注解, 废弃级别设置为 `DeprecationLevel.HIDDEN`:

```kotlin
@Deprecated(message = "Your message about the deprecation", level = DeprecationLevel.HIDDEN)
fun Printer(...) {...}
```
{validate="false"}

请使用编译器选项 `-XXLanguage:+KotlinFunInterfaceConstructorReference` 来启用这个功能.

## Kotlin/Native

Kotlin/Native 1.6.20 继续更新了它的新组件. 我们进一步改善了 Kotlin 在各个平台的体验一致性:

* [新内存管理器的更新](#an-update-on-the-new-memory-manager)
* [新内存管理器中内存清理阶段的并发实现](#concurrent-implementation-for-the-sweep-phase-in-new-memory-manager)
* [注解类的实例化](#instantiation-of-annotation-classes)
* [与 Swift async/await 的交互: 返回 Swift 的 Void 类型, 而不是 KotlinUnit 类型](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [使用 libbacktrace 的更好的栈追踪信息(Stack Trace)](#better-stack-traces-with-libbacktrace)
* [支持独立的 Android 可执行文件](#support-for-standalone-android-executables)
* [性能改进](#performance-improvements)
* [cinterop 模块导入时的错误处理改进](#improved-error-handling-during-cinterop-modules-import)
* [支持 Xcode 13 库](#support-for-xcode-13-libraries)

### 新内存管理器的更新 {id="an-update-on-the-new-memory-manager"}

> 新的 Kotlin/Native 内存管理器处于 [Alpha](components-stability.md) 阶段.
> 未来它可能发生不兼容的变更, 并需要手动迁移.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-48525) 提供你的反馈意见.
>
{style="note"}

在 Kotlin 1.6.20 中, 你可以试用新的 Kotlin/Native 内存管理器的 Alpha 版.
它消除 JVM 和 Native 平台之间的差别, 在跨平台项目中为开发者提供一致的体验.
例如, 你可以更加容易的创建新的跨平台移动应用程序, 同时工作在 Android 和 iOS 上.

新的 Kotlin/Native 内存管理器解除了在线程之间共享对象的限制.
还提供了并发编程用的, 无内存泄露的基本数据类型, 它安全, 而且不需要任何特殊的管理或注解.

新内存管理器在未来的版本中将会被默认使用, 因此我们推荐你现在就开始试用.
关于新的内存管理器, 请参见我们的
[blog](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/),
并查看示例项目,
或直接阅读 [迁移指南](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md), 自己来试用它.

请在你的项目中试用新的内存管理器, 看看它如何工作, 并在我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-48525) 提供你的反馈意见.

### 新内存管理器中内存清理阶段(Sweep Phase)的并发实现 {id="concurrent-implementation-for-the-sweep-phase-in-new-memory-manager"}

如果你已经切换到了我们的新内存管理器, 它 [在 Kotlin 1.6 中发布](whatsnew16.md#preview-of-the-new-memory-manager),
你可能会注意到显著的执行时间改善: 我们的评测显示平均改善了 35%.
从 1.6.20 开始, 对于新内存管理器的内存清理阶段(Sweep Phase)还可以使用一个并发实现.
这也能够改进性能, 减少垃圾收集器导致的程序暂停时间.

要为新的 Kotlin/Native 内存管理器启用这个功能, 请传递以下编译器选项:

```bash
-Xgc=cms
```

关于新内存管理器的性能, 欢迎在这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48526) 中提供你的反馈意见.

### 注解类的实例化 {id="instantiation-of-annotation-classes"}

在 Kotlin 1.6.0 中, 对 Kotlin/JVM 和 Kotlin/JS, 注解类的实例化进入 [稳定版](components-stability.md).
1.6.20 版本还提供对 Kotlin/Native 的支持.

详情请参见 [注解类的实例化](annotations.md#instantiation).

### 与 Swift async/await 的交互: 返回 Swift 的 Void 类型, 而不是 KotlinUnit 类型 {id="interop-with-swift-async-await-returning-void-instead-of-kotlinunit"}

> 与 Swift async/await 的并发交互能力是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-47610) 提供你的反馈意见.
>
{style="warning"}

我们继续改进了 [与 Swift's async/await 的交互(实验性功能)](whatsnew1530.md#experimental-interoperability-with-swift-5-5-async-await)
(从 Swift 5.5 开始可用).
在 Kotlin 1.6.20 中, 处理 `Unit` 返回类型的 `suspend` 函数的方式, 与以前的版本不同.

以前的版本中, 这样的函数在 Swift 中表达为 返回 `KotlinUnit` 的 `async` 函数.
但是, 正确的返回类型应该是 `Void`, 与非挂起的函数类似.

为了避免破坏已有的代码, 我们引入一个 Gradle 属性, 让编译器将返回 `Unit` 的挂起函数, 翻译为 Swift 中的 `Void` 返回类型的 `async` 函数:

```none
# gradle.properties
kotlin.native.binary.unitSuspendFunctionObjCExport=proper
```

在未来的 Kotlin 发布版中, 我们计划让这个行为成为默认设置.

### 使用 libbacktrace 的更好的栈追踪信息(Stack Trace) {id="better-stack-traces-with-libbacktrace"}

> 使用 libbacktrace 来解析源代码位置是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-48424) 提供你的反馈意见.
>
{style="warning"}

Kotlin/Native 现在可以输出详细的栈追踪信息(Stack Trace), 其中包括文件位置和行号,
可以用于 `linux*` (`linuxMips32` 和 `linuxMipsel32` 除外) 和 `androidNative*` 编译目标上更好的进行错误调试.

这个功能的实现使用 [libbacktrace](https://github.com/ianlancetaylor/libbacktrace) 库.
请参考以下代码, 看看具体的差别:

```kotlin
fun main() = bar()
fun bar() = baz()
inline fun baz() {
    error("")
}
```

* **在 1.6.20 以前:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x227190       kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96
   at 1   example.kexe        0x221e4c       kfun:kotlin.Exception#<init>(kotlin.String?){} + 92
   at 2   example.kexe        0x221f4c       kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92
   at 3   example.kexe        0x22234c       kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92
   at 4   example.kexe        0x25d708       kfun:#bar(){} + 104
   at 5   example.kexe        0x25d68c       kfun:#main(){} + 12
```
{initial-collapse-state="collapsed" collapsible="true"}

* **在 1.6.20 中, 使用 libbacktrace:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe        0x229550    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 96 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe        0x22420c    kfun:kotlin.Exception#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe        0x22430c    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe        0x22470c    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 92 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
   at 5   example.kexe        0x25fac8    kfun:#bar(){} + 104 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe        0x25fac8    kfun:#bar(){} + 104 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe        0x25fa4c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
```
{initial-collapse-state="collapsed" collapsible="true"}

在 Apple 编译目标上, 栈追踪信息中已经有了文件位置和行号, libbacktrace 对内联函数调用提供更多详细信息:

* **在 1.6.20 以前:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10a85a8f8    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x10a855846    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x10a855936    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x10a855c86    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x10a8489a5    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:1)
   at 5   example.kexe    0x10a84891c    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}


* **在 1.6.20 中, 使用 libbacktrace:**

```text
Uncaught Kotlin exception: kotlin.IllegalStateException:
   at 0   example.kexe    0x10669bc88    kfun:kotlin.Throwable#<init>(kotlin.String?){} + 88 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Throwable.kt:24:37)
   at 1   example.kexe    0x106696bd6    kfun:kotlin.Exception#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:23:44)
   at 2   example.kexe    0x106696cc6    kfun:kotlin.RuntimeException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:34:44)
   at 3   example.kexe    0x106697016    kfun:kotlin.IllegalStateException#<init>(kotlin.String?){} + 86 (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/kotlin-native/runtime/src/main/kotlin/kotlin/Exceptions.kt:70:44)
   at 4   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/opt/buildAgent/work/c3a91df21e46e2c8/kotlin/libraries/stdlib/src/kotlin/util/Preconditions.kt:143:56)
>>  at 5   example.kexe    0x106689d35    kfun:#bar(){} + 117 [inlined] (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:4:5)
   at 6   example.kexe    0x106689d35    kfun:#bar(){} + 117 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:2:13)
   at 7   example.kexe    0x106689cac    kfun:#main(){} + 12 (/private/tmp/backtrace/src/commonMain/kotlin/app.kt:1:14)
...
```
{initial-collapse-state="collapsed" collapsible="true"}

要使用 libbacktrace 输出更好的栈追踪信息, 请在 `gradle.properties` 中添加以下内容:

```none
# gradle.properties
kotlin.native.binary.sourceInfoType=libbacktrace
```

请在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48424) 中,
告诉我们你使用 libbacktrace 调试 Kotlin/Native 程序的效果如何.

### 支持独立的 Android 可执行文件 {id="support-for-standalone-android-executables"}

以前, Kotlin/Native 中的 Android Native 可执行文件实际上并不是可执行文件, 而是共用的库, 你可以使用将它用作 NativeActivity.
现在有了一个选项, 可以为 Android Native 编译目标生成标准的可执行文件.

为了使用这个功能, 请在你的项目的 `build.gradle(.kts)` 中, 配置你的 `androidNative` 编译目标的 executable 代码段.
添加 the 以下 binary 选项:

```kotlin
kotlin {
    androidNativeX64("android") {
        binaries {
            executable {
                binaryOptions["androidProgramType"] = "standalone"
            }
        }
    }
}
```

注意, 在 Kotlin 1.7.0 中这个功能将成为默认设定.
如果你想要保留目前的行为, 请使用以下设置:

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

感谢 Mattia Iavarone 提供的 [实现](https://github.com/jetbrains/kotlin/pull/4624)!

### 性能改进 {id="performance-improvements"}

我们在努力改进 Kotlin/Native 来 [提升编译速度](https://youtrack.jetbrains.com/issue/KT-42294), 改善你的开发体验.

Kotlin 1.6.20 带来了一些性能改进和 bug 修正, 影响到 Kotlin 生成的 LLVM IR.
根据我们内部项目的评测, 平均结果显示我们实现了下面的性能提升:

* 执行时间减少了 15%
* release 和 debug 二进制文件代码大小都减少了 20%
* release 二进制文件的编译时间减少了 26%

在一个大型的内部项目中, 这些变更也让 debug 二进制文件编译时间减少了 10%.

为了达到这个成果, 我们对一些编译器生成的合成对象实现了静态初始化, 改进了我们为每个函数组织 LLVM IR 的方式, 并优化了编译器缓存.

### cinterop 模块导入时的错误处理改进 {id="improved-error-handling-during-cinterop-modules-import"}

这个发布版改进了使用 `cinterop` 工具导入 Objective-C 模块时(通常用于 CocoaPods pod)的错误处理.
以前的版本中, 如果你在尝试使用 Objective-C 模块时发生错误(比如, 处理头文件中的编译错误),
你只能得到意义不明的错误消息, 比如 `fatal error: could not build module $name`.
我们对 `cinterop` 工具改进了这个部分, 因此你现在得到错误消息会包括更加详细的描述信息.

### 支持 Xcode 13 库 {id="support-for-xcode-13-libraries"}

这个发布版对 Xcode 13 携带的库有了完全的支持.
你可以在你的 Kotlin 代码的任何地方使用这些库.

## Kotlin Multiplatform

1.6.20 版中, Kotlin Multiplatform 有了以下重要更新:

* [对所有的新的跨平台项目, 现在默认支持层级结构](#hierarchical-structure-support-for-multiplatform-projects)
* [Kotlin CocoaPods Gradle plugin 有了一些与 CocoaPods 集成的便利功能](#kotlin-cocoapods-gradle-plugin)

### 对跨平台项目的层级结构支持 {id="hierarchical-structure-support-for-multiplatform-projects"}

Kotlin 1.6.20 默认启用层级结构支持.
自从 [在 Kotlin 1.4.0 中引入这个功能](whatsnew14.md#sharing-code-in-several-targets-with-the-hierarchical-project-structure) 以来,
我们大大的改善了前端, 并稳定了 IDE 导入功能.

在以前的版本中, 有 2 种方法在跨平台项目中添加代码. 第 1 种是插入到平台相关的源代码集中, 这种方法只限于一个编译目标, 并且不能由其它平台重用.
第 2 种是使用一个共通源代码集, 在 Kotlin 目前支持的所有平台共用.

现在你可以在几个相似的原生编译目标中 [共用源代码](#better-code-sharing-in-your-project), 这些编译目标可以重用很多共通逻辑和第 3 方 API.
这个技术将会提供正确的默认依赖项, 并找到共用的代码中可用的 API.
以前的版本中需要使用复杂的构建设置, 而且必须使用变通办法来让 IDE 支持在多个原生编译目标共用源代码集, 这个功能消除了这些问题.
这个功能还有助于防止使用那些本来应该用于不同的编译目标的不安全的 API.

这个技术对于 [库作者](#more-opportunities-for-library-authors) 也很方便, 因为层级项目结构允许他们对一部分编译目标发布和使用带有共通 API 的库.

默认情况下, 使用层级项目结构发布的库只兼容于层级结构的项目.

#### 在你的项目中更好的共用代码 {id="better-code-sharing-in-your-project"}

没有层级结构支持, 就没有直接的方法在 _一部分_ 而不是在 _所有_
[Kotlin 编译目标](multiplatform-dsl-reference.md#targets) 中共用代码.
一个常见的例子是, 对所有的 iOS 编译目标共用代码,
并使用 iOS 专有的 [依赖项](multiplatform-share-on-platforms.md#connect-platform-specific-libraries),
比如 Foundation.

感谢层级项目结构, 你现在可以直接达到这个目的.
在新的结构中, 源代码集组成一个层级结构.
你可以使用平台专有的语言功能, 以及一个源代码集所属的每个编译目标可用的依赖项.

例如, 假设有一个典型的跨平台项目, 带有 2 个编译目标 — `iosArm64` 和 `iosX64`, 分别用于 iOS 设备和模拟器.
Kotlin 工具会理解, 2 个编译目标都拥有相同的函数, 并允许你从公共的源代码集, `iosMain`, 访问这些函数.

![iOS 源代码层级结构示例](ios-hierarchy-example.jpg){width=700}

Kotlin 工具链会提供正确的默认依赖项, 比如 Kotlin/Native 标准库, 或原生库.
而且, Kotlin 工具会尽量查找共用的代码中可用的正确的 API 接口.
这样可以防止不正确的情况, 例如, 在针对 Windows 的共用代码中使用 macOS 专有的函数.

#### 库作者的更多选择 {id="more-opportunities-for-library-authors"}

在跨平台库发布之后, 它的共用源代码集的 API 现在也会和它一起正确的发布, 并可以供库的用户使用.
而且, Kotlin 工具链会自动判断出在库使用者的源代码集中能够使用哪些 API , 并密切注意不安全的使用, 比如在 JS 代码中使用针对 JVM 的 API.
详情请参见 [在库中共用代码](multiplatform-share-on-platforms.md#share-code-in-libraries).

#### 配置与设置

从 Kotlin 1.6.20 开始, 你所有的新的跨平台项目都将使用层级项目结构. 不需要额外的设置.

* 如果你已经进行了 [手工转换](multiplatform-share-on-platforms.md#share-code-on-similar-platforms),
  你可以从 `gradle.properties` 中删除废弃的选项:

  ```none
  # gradle.properties
  kotlin.mpp.enableGranularSourceSetsMetadata=true
  kotlin.native.enableDependencyPropagation=false // 或 'true', 取决于你以前的设置
  ```

* 对于 Kotlin 1.6.20, 我们建议使用 [Android Studio 2021.1.1](https://developer.android.com/studio) (Bumblebee) 或更高版本,
  以获得最好的开发体验.

* 你可以也选择性禁用(opt out)这个功能. 要禁用层级结构支持, 请在 `gradle.properties` 中设置以下选项:

  ```none
  # gradle.properties
  kotlin.mpp.hierarchicalStructureSupport=false
  ```

#### 提供你的反馈意见

这是对整个生态系统的一个重大变更. 我们期望你能提供反馈意见, 帮助我们继续完善这个功能.

请开始试用这个功能, 并向 [我们的问题追踪系统](https://kotl.in/issue) 报告你遇到的任何问题.

### Kotlin CocoaPods Gradle plugin

为了简化与 CocoaPods 的集成, Kotlin 1.6.20 发布了以下功能:

* CocoaPods plugin 现在有了 task, 可以对所有已注册的编译目标构建 XCFramework, 并生成 Podspec 文件.
  当你不想直接与 Xcode 集成, 但想要构建 artifact 并部署到你的本地 CocoaPods 仓库, 这个功能可以很便利.

  详情请参见 [构建 XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks).

* 如果在你的项目中使用 [CocoaPods 集成](multiplatform-cocoapods-overview.md), 过去你需要对整个 Gradle 项目指定需要的 Pod 版本.
  现在有了更多选择:
  * 在 `cocoapods` 代码块中直接指定 Pod 版本
  * 继续使用 Gradle 项目版本

  如果这些属性都没有配置, 会出现错误.

* 你现在可以在 `cocoapods` 代码块中配置 CocoaPod 名称, 而不需要修改整个 Gradle 项目的名称.

* CocoaPods plugin 引入了新的 `extraSpecAttributes` 属性, 你可以使用它来配置 Podspec 文件中的属性,
  以前这些属性必须硬编码, 比如 `libraries` 或 `vendored_frameworks`.

```kotlin
kotlin {
    cocoapods {
        version = "1.0"
        name = "MyCocoaPod"
        extraSpecAttributes["social_media_url"] = 'https://twitter.com/kotlin'
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        extraSpecAttributes["libraries"] = 'xml'
    }
}
```

关于 Kotlin CocoaPods Gradle plugin 的完整信息, 请参见 [DSL 参考文档](multiplatform-cocoapods-dsl-reference.md).

## Kotlin/JS

在 1.6.20 中, Kotlin/JS 的改进主要涉及 IR 编译器:

* [对开发阶段二进制文件的增量编译 (IR)](#incremental-compilation-for-development-binaries-with-ir-compiler)
* [默认对顶级属性(Top-Level Property)延迟初始化(Lazy initialization) (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler)
* [默认对项目模块输出单独的 JS 文件 (IR)](#separate-js-files-for-project-modules-by-default-with-ir-compiler)
* [Char 类优化 (IR)](#char-class-optimization)
* [导出功能的改进 (IR 后端和旧后端)](#improvements-to-export-and-typescript-declaration-generation)
* [对异步的测试确保 @AfterTest](#aftertest-guarantees-for-asynchronous-tests)

### IR 编译器对开发阶段二进制文件的增量编译 {id="incremental-compilation-for-development-binaries-with-ir-compiler"}

为了提高使用 IR 编译器时的 Kotlin/JS 开发效率, 我们引入了新的 _增量编译_ 模式.

在这个模式下, 使用 `compileDevelopmentExecutableKotlinJs` Gradle task 构建 **开发阶段二进制文件** 时,
编译器会在模块层级缓存前一次编译的结果.
它会在后续的编译中对未变更的源代码文件使用缓存的编译结果, 让编译更加快速, 尤其是对小的变更.
注意, 这个改进仅仅针对开发阶段(缩短 编辑-构建-调试 循环的时间), 而不会影响产品 artifact 的构建.

要对开发阶段二进制文件启用增量编译, 请向项目的 `gradle.properties` 文件添加以下内容:

```none
# gradle.properties
kotlin.incremental.js.ir=true // 默认为 false
```

在我们的测试项目中, 新模式让增量编译的速度提高了 30%. 但是, 这个模式下的完整构建变得更慢, 因为需要创建和生成缓存.

请在你的 Kotlin/JS 项目中使用增量编译功能, 并在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-50203) 中向我们提供你的反馈意见.

### IR 编译器默认对顶级属性(Top-Level Property)延迟初始化(Lazy initialization) {id="lazy-initialization-of-top-level-properties-by-default-with-ir-compiler"}

在 Kotlin 1.4.30 中, 我们发布了 JS IR 编译器中
[对顶级属性延迟初始化](whatsnew1430.md#lazy-initialization-of-top-level-properties) 功能的原型.
在应用程序启动时不再需要初始化所有属性, 因此延迟初始化可以缩短启动时间.
在一个真实的 Kotlin/JS 应用程序, 我们的评测结果是速度提升了大约 10%.

现在, 对这个机制进行改进和完善的测试之后, 我们在 IR 编译器中, 将顶级属性的延迟初始化作为默认模式.

```kotlin
// 延迟初始化
val a = run {
    val result = // 假设这里是一段计算密集的代码
        println(result)
    result
} // 直到变量初次使用时才会执行 run
```

如果由于某些原因你需要(在应用程序启动阶段)提早初始化一个属性, 可以对它标注
[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)
注解.

### IR 编译器默认对项目模块输出单独的 JS 文件 {id="separate-js-files-for-project-modules-by-default-with-ir-compiler"}

以前的版本中, JS IR 编译器可以为项目模块 [生成单独的 `.js` 文件]( https://youtrack.jetbrains.com/issue/KT-44319).
默认选项是 – 对整个项目生成单个 `.js` 文件.
这个文件可能会非常巨大, 不便于使用, 因为如果你想要使用你的项目的一个函数, 你不得不将整个 JS 文件作为依赖项.
生成多个文件可以提高灵活性, 减少这些依赖项的大小. 这个功能可以通过 `-Xir-per-module` 编译器选项来使用.

从 1.6.20 开始, JS IR 编译器默认为项目模块生成单独的 `.js` 文件.

编译项目为单个的 `.js` 文件, 现在可以通过以下 Gradle 属性来使用:

```none
# gradle.properties
kotlin.js.ir.output.granularity=whole-program // 默认值为 `per-module`
```

在以前的版本中, 实验性的 per-module 模式 (可以通过 `-Xir-per-module=true` 选项启用)会在每个模块中调用 `main()` 函数.
这种行为与通常的单独 `.js` 模式不一致.
从 1.6.20 开始, 对这两种情况, `main()` 函数都只会在 main 模块中调用. 如果你确实需要在模块装载时运行某些代码,
你可以使用顶级属性(Top-Level Property), 并标注 `@EagerInitialization` 注解.
参见 [默认对顶级属性(Top-Level Property)延迟初始化(Lazy initialization) (IR)](#lazy-initialization-of-top-level-properties-by-default-with-ir-compiler).

### Char 类优化 {id="char-class-optimization"}

`Char` 类现在由 Kotlin/JS 编译器处理, 不产生装箱(boxing)处理(类似于 [内联类](inline-classes.md)).
这样可以提高 Kotlin/JS 代码中对字符操作的速度.

除了性能改进之外, 这个功能还变更了 `Char` 输出到 JavaScript 的方式: 它现在被翻译为 `Number`.

### 导出功能的改进, 对 TypeScript 声明生成的改进 {id="improvements-to-export-and-typescript-declaration-generation"}

Kotlin 1.6.20 带来了很多修正, 并改进了导出机制([`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解),
包括 [TypeScript 声明 (`.d.ts`) 的生成](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts).
我们添加了导出接口和枚举的功能, 我们还修正了以前报告给我们的, 某些边界情况下的不正确的导出行为.
详情请参见 [YouTrack 中导出功能的改进](https://youtrack.jetbrains.com/issues?q=Project:%20Kotlin%20issue%20id:%20KT-45434,%20KT-44494,%20KT-37916,%20KT-43191,%20KT-46961,%20KT-40236).

详情请参见 [在 JavaScript 中使用 Kotlin 代码](js-to-kotlin-interop.md).

### 对异步的测试确保 @AfterTest {id="aftertest-guarantees-for-asynchronous-tests"}

Kotlin 1.6.20 确保 [`@AfterTest`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-after-test/) 函数
能够与 Kotlin/JS 异步的测试一同正确工作.
如果一个测试函数的返回类型静态的解析为 [`Promise`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/),
编译器现在能够将 `@AfterTest` 函数的执行调度到对应的
[`then()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-promise/then.html) 回调.

## 安全性

Kotlin 1.6.20 包含了一些功能, 改进你的代码的安全性:

* [在 klibs 中使用相对路径](#using-relative-paths-in-klibs)
* [对 Kotlin/JS Gradle 项目保持 yarn.lock 文件](#persisting-yarn-lock-for-kotlin-js-gradle-projects)
* [默认使用 `--ignore-scripts` 安装 npm 依赖项](#installation-of-npm-dependencies-with-ignore-scripts-by-default)

### 在 klibs 中使用相对路径 {id="using-relative-paths-in-klibs"}

一个 `klib` 格式的库 [包含](native-libraries.md#library-format) 源代码文件的序列化后的 IR 表达,
其中包含文件路径, 用于生成正确的调试信息.
在 Kotlin 1.6.20 以前, 保存的文件路径是绝对路径. 由于库作者可能不希望公开他们的绝对路径, 1.6.20 版本引入了一个替代选项.

如果你正在发布一个 `klib`, 并且希望在 artifact 中只使用源代码文件的相对路径,
现在你可以传递 `-Xklib-relative-path-base` 编译器选项, 参数是 一个或多个源代码文件基准路径:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile::class).configureEach {
    // $base 是源代码文件的基准路径
    kotlinOptions.freeCompilerArgs += "-Xklib-relative-path-base=$base"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions {
        // $base 是源代码文件的基准路径
        freeCompilerArgs += "-Xklib-relative-path-base=$base"
    }
}
```

</tab>
</tabs>

### 对 Kotlin/JS Gradle 项目保持 yarn.lock 文件 {id="persisting-yarn-lock-for-kotlin-js-gradle-projects"}

> 这个功能也被反向导入到 Kotlin 1.6.10.
>
{style="note"}

Kotlin/JS Gradle plugin 现在提供了保持 `yarn.lock` 文件的功能, 因此可以为你的项目锁定 npm 依赖项的版本, 而不需要额外的 Gradle 配置.
这个功能修改了默认的项目结构, 在项目的根目录下添加了自动生成的 `kotlin-js-store` 目录.
这个目录内保存 `yarn.lock` 文件.

我们强烈建议将 `kotlin-js-store` 目录及其内容提交到你的版本控制系统.
将这个锁文件提交到你的版本控制系统是一种
[推荐的实践(Recommended Practice)](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/),
因为可以保证你的应用程序在所有机器上都使用完全相同的依赖项树进行构建, 无论是在其他机器上的开发环境中, 还是在 CI/CD 服务中.
当项目在一台新机器上 check out 时, 锁文件也可以防止你的 npm 依赖项被静悄悄的更新, 这样会导致安全性问题.

[Dependabot](https://github.com/dependabot) 之类的工具可以也解析你的 Kotlin/JS 项目的 `yarn.lock` 文件,
如果你依赖的任何 npm 包存在安全问题, 它会向你提示警告.

如果需要, 你可以在构建脚本中变更目录和锁文件的名称:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
```

</tab>
</tabs>

> 修改 lock 文件名称, 可能会导致依赖项检查工具不再正确读取这个文件.
>
{style="warning"}

### 默认使用 `--ignore-scripts` 安装 npm 依赖项 {id="installation-of-npm-dependencies-with-ignore-scripts-by-default"}

> 这个功能也被反向导入到 Kotlin 1.6.10.
>
{style="note"}

Kotlin/JS Gradle plugin 在安装 npm 依赖项时, 现在默认会阻止执行
[Life Cycle 脚本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts).
这个变更的目的是, 如果使用了存在安全问题的 npm 包, 可以减少执行恶意代码的可能性.

如果要回滚到旧的配置, 你可以明确的允许 Life Cycle 脚本执行, 方法是向 `build.gradle(.kts)` 文件添加以下设置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
```

</tab>
</tabs>

详情请参见 [Kotlin/JS Gradle 项目的 npm 依赖项](js-project-setup.md#npm-dependencies).

## Gradle

Kotlin 1.6.20 包含对 Kotlin Gradle Plugin 的以下变更 :

* 新的 [属性 `kotlin.compiler.execution.strategy` 和 `compilerExecutionStrategy`](#properties-for-defining-kotlin-compiler-execution-strategy) 用于定义 Kotlin 编译器执行策略
* [废弃选项 `kapt.use.worker.api`, `kotlin.experimental.coroutines`, 和 `kotlin.coroutines`](#deprecation-of-build-options-for-kapt-and-coroutines)
* [删除构建选项 `kotlin.parallel.tasks.in.project`](#removal-of-the-kotlin-parallel-tasks-in-project-build-option)

### 用于定义 Kotlin 编译器执行策略的属性 {id="properties-for-defining-kotlin-compiler-execution-strategy"}

在 Kotlin 1.6.20 之前, 你可以使用系统属性 `-Dkotlin.compiler.execution.strategy` 来定义 Kotlin 编译器执行策略.
这个属性对于某些情况可以很便利.
Kotlin 1.6.20 引入一个相同名称的 Gradle 属性, `kotlin.compiler.execution.strategy`, 以及编译 task 属性 `compilerExecutionStrategy`.

系统属性继续起作用, 但在未来的发布版本中会被删除.

目前的属性优先度如下:

* task 属性 `compilerExecutionStrategy` 优先度高于系统属性和 Gradle 属性 `kotlin.compiler.execution.strategy`.
* Gradle 属性优先度高于系统属性.

有 3 种编译器执行策略, 你可以赋值给这些属性:

| 策略       | Kotlin 编译器在哪里执行          | 增量编译 | 其它特征                              |
|----------------|--------------------------|------|-----------------------------------|
| Daemon         | 在 Kotlin 自己的 daemon 进程之内 | 是    | *默认策略*. 可以在不同的 Gradle daemon 之间共用 |
| In process     | 在 Gradle daemon 进程之内     | 否    | 可以与 Gradle daemon 共用 heap         |
| Out of process | 对每个编译都在单独的进程内            | 否    | —                                 |


相应的, 对于 (系统属性和 Gradle 属性) `kotlin.compiler.execution.strategy`, 可以设置的值是:
1. `daemon` (默认)
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中, 使用 Gradle 属性 `kotlin.compiler.execution.strategy`:

```none
# gradle.properties
kotlin.compiler.execution.strategy=out-of-process
```

对于 task 属性 `compilerExecutionStrategy`, 可以设置的值是:

1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (默认)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在 `build.gradle.kts` 构建脚本中, 使用 task 属性 `compilerExecutionStrategy`:

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<KotlinCompile>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

请在 [这个 YouTrack task](https://youtrack.jetbrains.com/issue/KT-49299)中提供你的反馈意见.

### 废弃用于 kapt 和 coroutines 的构建选项 {id="deprecation-of-build-options-for-kapt-and-coroutines"}

在 Kotlin 1.6.20 中, 我们修改了这些属性的废弃级别 :

* 我们废弃了使用 `kapt.use.worker.api` 来通过 Kotlin daemon 运行 [kapt](kapt.md) 的功能 –
  现在这个选项会在 Gradle 的输出中产生一条警告信息.
  默认情况下, 从 1.3.70 版开始 [kapt 使用 Gradle worker](kapt.md#run-kapt-tasks-in-parallel), 我们建议继续使用这种方法.

  我们将会在未来的发布版中删除选项 `kapt.use.worker.api`.

* 我们废弃了在 `gradle.properties` 中使用的 Gradle DSL 选项 `kotlin.experimental.coroutines` 和属性 `kotlin.coroutines`.
  请直接使用 _挂起函数_, 或向你的 `build.gradle(.kts)` 文件 [添加 `kotlinx.coroutines` 依赖项](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library).

  关于协程, 详情请参见 [协程指南](coroutines-guide.md).

### 删除构建选项 kotlin.parallel.tasks.in.project {id="removal-of-the-kotlin-parallel-tasks-in-project-build-option"}

在 Kotlin 1.5.20 中, 我们 [废弃了构建选项 `kotlin.parallel.tasks.in.project`](whatsnew1520.md#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property).
在 Kotlin 1.6.20 中, 这个选项已被删除.

根据项目不同, 在 Kotlin daemon 中的并行编译可能需要更多的内存.
为了减少内存消耗, 请 [对 Kotlin daemon 增加 heap 大小](gradle-compilation-and-caches.md#setting-kotlin-daemon-s-jvm-arguments).

详情请参见, 在 Kotlin Gradle plugin 中 [目前支持的编译器选项](gradle-compiler-options.md).
