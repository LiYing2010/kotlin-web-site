[//]: # (title: Kotlin 1.7.0 版中的新功能)

<tldr>
   <p>IDE 从 IntelliJ IDEA 2021.2, 2021.3, 和 2022.1 开始支持 Kotlin 1.7.0.</p>
</tldr>

_[发布日期: 2022/06/09](releases.md#release-details)_

Kotlin 1.7.0 已经发布了. 它公布了新的 Kotlin/JVM K2 编译器的 Alpha 版,
发布了语言功能的稳定版, 并为 JVM, JS, 和 Native 平台带来了性能改进.

下面是这个版本中的主要更新:

* [发布了新的 Kotlin K2 编译器 Alpha 版](#new-kotlin-k2-compiler-for-the-jvm-in-alpha),
  它带来很多性能改进. 这个编译器只能用于 JVM, 并且所有的编译器 plugin, 包括 kapt, 都不能使用.
* [Gradle 中增量编译的新方案](#a-new-approach-to-incremental-compilation).
  在依赖的非 Kotlin 模块中的变更, 现在也能支持增量编译, 并且与 Gradle 兼容.
* 我们发布了 [明确要求使用者同意(Opt-in Requirement) 注解](#stable-opt-in-requirements), [明确非 null 类型](#stable-definitely-non-nullable-types),
  以及 [构建器推断](#stable-builder-inference) 的稳定版.
* [类型参数的新的下划线操作符](#underscore-operator-for-type-arguments).
  当其它类型已指定时, 你可以使用这个操作符来自动推断一个参数类型.
* [允许接口的实现代理给内联类的内联值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class).
  现在你可以创建轻量的封装(wrapper)类, 大多数情况下不会消耗内存.

关于这个版本的变更概要, 请参见以下视频:

<video src="https://www.youtube.com/v/54WEfLKtCGk" title="Kotlin 1.7.0 版中的新功能"/>

## JVM 平台的新的 Kotlin K2 编译器 (Alpha 版) {id="new-kotlin-k2-compiler-for-the-jvm-in-alpha"}

这个 Kotlin 发布版引入了新的 Kotlin K2 编译器的 **Alpha** 版.
新的编译器致力于提升新的语言功能的开发速度, 同一 Kotlin 支持的所有平台, 带来性能改进,
并为编译器扩展提供 API.

关于新编译器, 以及它的益处, 我们发布了一些详细解释:

* [Kotlin 新编译器之路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 编译器: 概要介绍](https://www.youtube.com/watch?v=db19VFLZqJM)

需要指出, 在新的 K2 编译器 Alpha 版中, 我们主要集中于性能改进, 并且它只能用于 JVM 项目.
它不支持 Kotlin/JS, Kotlin/Native, 以及其它跨平台项目, 并且所有的编译器 plugin, 包括 [kapt](kapt.md), 都不能使用.

在我们的内部项目中进行的评测结果非常优异:

| 项目            | 现在的 Kotlin 编译器性能 | 新 K2 Kotlin 编译器性能  | 性能提升|
|---------------|------------------|--------------------|--------|
| Kotlin        | 2.2 KLOC/s       | 4.8 KLOC/s         | ~ 2.2倍 |
| YouTrack      | 1.8 KLOC/s       | 4.2 KLOC/s         | ~ 2.3倍 |
| IntelliJ IDEA | 1.8 KLOC/s       | 3.9 KLOC/s         | ~ 2.2倍 |
| Space         | 1.2 KLOC/s       | 2.8 KLOC/s         | ~ 2.3倍 |

> 这里的 KLOC/s 性能数字表示编译器每秒处理的千行代码数.
>
{style="tip"}

你可以在你的 JVM 项目中查看性能提升, 并与旧编译器的结果进行比较.
要启用 Kotlin K2 编译器, 请使用以下编译器选项:

```bash
-Xuse-k2
```

此外, K2 编译器还 [包括很多 bug 修正](https://youtrack.jetbrains.com/issues/KT?q=tag:%20FIR-preview-qa%20%23Resolved).
请注意, 就连这个列表中的状态为 **State: Open** 的问题, 在 K2 中事实上也被修正了.

Kotlin 的下一个发布版本将会改进 K2 编译器的稳定性, 并提供更多功能, 敬请期待!

如果你使用 Kotlin K2 编译器时遇到任何性能问题, 请 [向我们的问题追踪系统提交报告](https://kotl.in/issue).

## 语言功能

Kotlin 1.7.0 引入的新的语言功能, 支持通过代理实现接口, 以及新的类型参数的下划线操作符.
此外, 对于以前版本中引入的几个语言功能预览版, Kotlin 1.7.0 还发布了它们的稳定版:

* [接口的实现代理给内联类的内联值](#allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class)
* [类型参数的下划线操作符](#underscore-operator-for-type-arguments)
* [构建器推断的稳定版](#stable-builder-inference)
* [明确要求使用者同意(Opt-in Requirement)的稳定版](#stable-opt-in-requirements)
* [明确非 null 类型的稳定版](#stable-definitely-non-nullable-types)

### 允许接口的实现代理给内联类的内联值 {id="allow-implementation-by-delegation-to-an-inlined-value-of-an-inline-class"}

如果你想要对一个值或一个类实例创建一个轻量的封装(wrapper), 就需要手动实现所有的接口方法.
通过代理实现结构解决了这个问题, 但在 1.7.0 之前不能用于内联类.
这个限制现在已经解决了, 现在你可以创建轻量的封装, 大多数情况下不会消耗内存.

```kotlin
interface Bar {
    fun foo() = "foo"
}

@JvmInline
value class BarWrapper(val bar: Bar): Bar by bar

fun main() {
    val bw = BarWrapper(object: Bar {})
    println(bw.foo())
}
```

### 类型参数的下划线操作符 {id="underscore-operator-for-type-arguments"}

Kotlin 1.7.0 为类型参数引入了一个下划线操作符, `_`. 当其它类型已指定时, 你可以使用它来自动推断一个类型参数:

```kotlin
abstract class SomeClass<T> {
    abstract fun execute(): T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run(): T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // T 被推断为 String, 因为 SomeImplementation 继承自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 被推断为 Int, 因为 OtherImplementation 继承自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```

> 你可以在参数列表中的任何位置使用下划线操作符来推断一个类型参数.
>
{style="note"}

### 构建器推断的稳定版 {id="stable-builder-inference"}

构建器推断是一种特殊的类型推断, 在调用泛型构建器函数时非常有用.
它可以帮助编译器, 利用一个调用的 Lambda 表达式参数之内的其它调用的类型信息, 推断这个调用本身的类型参数.

过去, [在 1.6.0 中引入](whatsnew16.md#changes-to-builder-inference) 了编译器选项 `-Xenable-builder-inference`.
从 1.7.0 开始, 不需要指定这个编译器选项, 如果通常的类型推断对一个类型无法得到足够的信息, 构建器推断会自动启用.

参见 [如何编写自定义的泛型构建器](using-builders-with-builder-inference.md).

### 明确要求使用者同意(Opt-in Requirement)的稳定版 {id="stable-opt-in-requirements"}

[明确要求使用者同意(Opt-in Requirement)](opt-in-requirements.md) 现在升级为 [稳定版](components-stability.md),
并且不再需要额外的编译器配置.

在 1.7.0 之前, opt-in 功能本身要求参数 `-opt-in=kotlin.RequiresOptIn` 来关闭警告信息.
现在不再需要了; 但是, 你仍然可以使用编译器参数 `-opt-in`,
[对一个模块](opt-in-requirements.md#opt-in-a-module) 同意使用其他注解.

### 明确非 null 类型的稳定版 {id="stable-definitely-non-nullable-types"}

在 Kotlin 1.7.0 中, 明确非 null 类型升级为 [稳定版](components-stability.md).
在扩展泛型的 Java 类和接口时, 这个功能提供了更好的互操作性.

你可以使用新的语法 `T & Any`, 在使用端将一个泛型类型参数标记为明确非 null.
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

关于明确非 null 类型, 详情请参见
[这个 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md).

## Kotlin/JVM

这个发布版带来了对 Kotlin/JVM 编译器的性能改进, 以及一个新的编译器 选项.
此外, 对函数式接口构造器的可调用引用升级为稳定版.
注意, 从 1.7.0 开始, Kotlin/JVM 的默认编译目标版本是 `1.8`.

* [编译器性能优化](#compiler-performance-optimizations)
* [新的编译器选项 `-Xjdk-release`](#new-compiler-option-xjdk-release)
* [对函数式接口构造器的可调用引用: 稳定版](#stable-callable-references-to-functional-interface-constructors)
* [删除了 JVM 编译目标版本 1.6](#removed-jvm-target-version-1-6)

### 编译器性能优化 {id="compiler-performance-optimizations"}

Kotlin 1.7.0 引入了对 Kotlin/JVM 编译器的性能改进.
根据我们的评测, 编译时间与 Kotlin 1.6.0 相比 [平均缩减了 10%](https://youtrack.jetbrains.com/issue/KT-48233/Switching-to-JVM-IR-backend-increases-compilation-time-by-more-t#focus=Comments-27-6114542.0-0).
由于字节码后期处理的改进, 大量使用内联函数的项目, 比如
[使用 `kotlinx.html` 的项目](https://youtrack.jetbrains.com/issue/KT-51416/Compilation-of-kotlinx-html-DSL-should-still-be-faster),
编译速度会变得更快.

### 新的编译器选项: -Xjdk-release {id="new-compiler-option-xjdk-release"}

Kotlin 1.7.0 添加了新的编译器选项, `-Xjdk-release`.
这个选项类似于 [javac 的命令行选项 `--release`](http://openjdk.java.net/jeps/247).
`-Xjdk-release` 选项控制编译目标的字节码版本, 并将 classpath 中的 JDK 的 API 限制为指定的 Java 版本.
比如, `kotlinc -Xjdk-release=1.8` 不会允许引用 `java.lang.Module`, 即使依赖项中的 JDK 是 9 或更高版本.

> 这个选项 [不保证](https://youtrack.jetbrains.com/issue/KT-29974) 对所有的 JDK 分发版都有效.
>
{style="note"}

请在
[这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-29974/Add-a-compiler-option-Xjdk-release-similar-to-javac-s-release-to)
中留下你的反馈.

### 对函数式接口构造器的可调用引用: 稳定版 {id="stable-callable-references-to-functional-interface-constructors"}

对函数式接口构造器的 [可调用的引用](reflection.md#callable-references) 现在升级为 [稳定版](components-stability.md).
请参见, 如何从一个带构造器函数的接口
[迁移](fun-interfaces.md#migration-from-an-interface-with-constructor-function-to-a-functional-interface)
到一个使用可调用引用的函数式接口.

如果你遇到问题, 请在这个 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中提交报告.

### 删除了 JVM 编译目标版本 1.6 {id="removed-jvm-target-version-1-6"}

对 Kotlin/JVM 的默认编译目标版本现在是 `1.8`. 编译目标版本 `1.6` 已被删除.

请迁移到 JVM 编译目标 1.8 或更高版本.
关于如何更新 JVM 编译目标版本, 请参见:

* [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
* [Maven](maven.md#attributes-specific-to-jvm)
* [命令行编译器](compiler-reference.md#jvm-target-version)

## Kotlin/Native

Kotlin 1.7.0 包括 与 Objective-C 和 Swift 交互性的变更, 并且将以前的发布版中引入的功能升级为稳定版.
还带来了对新的内存管理器的性能改进, 以及其他更新:

* [对新的内存管理器的性能改进](#performance-improvements-for-the-new-memory-manager)
* [对 JVM 和 JS IR 后端统一的编译器 plugin ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [支持独立的 Android 可执行文件](#support-for-standalone-android-executables)
* [与 Swift async/await 交互: 返回 `Void` 而不是 `KotlinUnit`](#interop-with-swift-async-await-returning-void-instead-of-kotlinunit)
* [禁止未声明的异常通过 Objective-C 桥](#prohibited-undeclared-exceptions-through-objective-c-bridges)
* [与 CocoaPods 集成的改进](#improved-cocoapods-integration)
* [修改 Kotlin/Native 编译器的下载 URL](#overriding-the-kotlin-native-compiler-download-url)

### 对新的内存管理器的性能改进 {id="performance-improvements-for-the-new-memory-manager"}

> 新的 Kotlin/Native 内存管理器现在是 [Alpha 版](components-stability.md).
> 将来它可能发生不兼容的变化, 并需要手工迁移.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-48525) 提供你的反馈意见.
>
{style="note"}

新的内存管理器还处于 Alpha 版, 但它在稳步的向 [稳定版](components-stability.md) 发展.
这个发布版带来了对新的内存管理器显著的性能改进, 尤其是垃圾收集(GC)功能.
具体来说, [在 1.6.20 中引入](whatsnew1620.md) 的 sweep phase 的并发实现, 现在默认启用了.
这个功能可以帮助减少 GC 执行时的应用程序暂停时间. 新的 GC 时间调度器能够更好的选择 GC 频率, 尤其是对更大的 heap 内存.

此外, 我们还特别优化了 debug 版二进制文件, 确保在内存管理器的实现代码中使用了适当的优化级别和链接时优化.
根据我们的测算, 对 debug 版二进制文件, 这些改进帮助我们改善了执行时间大约 30%.

请在你的项目中试用新的内存管理器, 看看它的效果如何,
并通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-48525) 提供你的反馈意见.

### 对 JVM 和 JS IR 后端统一的编译器 plugin ABI {id="unified-compiler-plugin-abi-with-jvm-and-js-ir-backends"}

从 Kotlin 1.7.0 开始, Kotlin Multiplatform Gradle plugin 对 Kotlin/Native 默认使用内嵌的编译器 jar.
这个功能作为实验性功能 [在 1.6.0 中引入](whatsnew16.md#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends),
现在它已经升级为稳定版, 可以使用了.

这个改进对于库的作者非常方便, 因为它改进了编译器 plugin 的开发体验.
在这个发布版之前, 你必须为 Kotlin/Native 提供单独的 artifact,
现在, 对 Native 和其他支持的平台, 你可以使用相同的编译器 plugin artifact.

> 这个功能可能需要 plugin 开发者对他们既有的 plugin 进行一些迁移步骤.
>
> 关于如何为这个更新调整你的 plugin, 请参见这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48595).
>
{style="warning"}

### 支持独立的 Android 可执行文件 {id="support-for-standalone-android-executables"}

Kotlin 1.7.0 对 Android Native 编译目标生成标准的可执行文件提供了完全的支持.
这个功能 [在 1.6.20 中引入](whatsnew1620.md#support-for-standalone-android-executables), 现在已默认启用.

如果你想要退回到以前的行为, 让 Kotlin/Native 生成共用的库, 请使用以下设置:

```kotlin
binaryOptions["androidProgramType"] = "nativeActivity"
```

### 与 Swift async/await 交互: 返回 `Void` 而不是 `KotlinUnit` {id="interop-with-swift-async-await-returning-void-instead-of-kotlinunit"}

在 Swift 中, Kotlin `suspend` 函数现在返回 `Void` 类型而不是 `KotlinUnit`.
这是与 Swift 的 `async`/`await` 交互功能改进后的结果.
这个功能 [在 1.6.20 中引入](whatsnew1620.md#interop-with-swift-async-await-returning-void-instead-of-kotlinunit),
这个发布版中会默认启用.

你不再需要使用 `kotlin.native.binary.unitSuspendFunctionObjCExport=proper` 属性来对这样的函数返回适当的类型.

### 禁止未声明的异常通过 Objective-C 桥 {id="prohibited-undeclared-exceptions-through-objective-c-bridges"}

当你从 Swift/Objective-C 代码调用 Kotlin 代码时(或者反过来), 如果这个代码抛出一个异常, 它应该被异常发生处的代码来处理,
除非你明确的允许异常经过适当的转换后在语言之间传递(比如, 使用 `@Throws` 注解).

在以前的版本中, Kotlin 的行为不太正确, 某些情况下, 未声明的异常可以从一种语言"泄露"到另一种语言.
Kotlin 1.7.0 修正了这个问题, 现在这样的情况会导致程序终止.

因此, 比如, 如果在 Kotlin 中你有一个 Lambda 表达式 `{ throw Exception() }`, 并从 Swift 调用它,
在 Kotlin 1.7.0 中, 程序会在异常到达 Swift 代码时立即终止.
在以前的 Kotlin 版本中, 这样的异常可以泄露到 Swift 代码中.

`@Throws` 注解会继续向以前一样工作.

### 与 CocoaPods 集成的改进 {id="improved-cocoapods-integration"}

从 Kotlin 1.7.0 开始, 如果想要在你的项目中集成 CocoaPods, 不再需要安装 `cocoapods-generate` plugin.

在以前的版本中, 你需要安装 CocoaPods 依赖项管理器和 `cocoapods-generate` plugin 才能使用 CocoaPods,
比如, 用来在 Kotlin Multiplatform Mobile 项目中管理
[iOS 依赖项](multiplatform-ios-dependencies.md#with-cocoapods).

现在设置与 CocoaPods 的集成变得更加简单, 而且我们解决了 `cocoapods-generate` 不能在 Ruby 3 和更高版本上安装的问题.
现在还支持最新的 Ruby 版本, 它在 Apple M1 上工作得更好.

关于如何设置环境, 请参见 [设置与 CocoaPods 的集成](native-cocoapods.md#set-up-an-environment-to-work-with-cocoapods).

### 修改 Kotlin/Native 编译器的下载 URL {id="overriding-the-kotlin-native-compiler-download-url"}

从 Kotlin 1.7.0 开始, 你可以定制 Kotlin/Native 编译器的下载 URL.
当 CI 环境禁止使用外部链接时, 这个功能会很有用.

默认的起始 URL 是 `https://download.jetbrains.com/kotlin/native/builds`, 如果要修改, 请使用以下 Gradle 属性:

```none
kotlin.native.distribution.baseDownloadUrl=https://example.com
```

> 下载器会向这个起始 URL 添加 native 版本和编译目标 OS, 确保下载到实际的编译器发布版.
>
{style="note"}

## Kotlin/JS

Kotlin/JS 包括对 [JS IR 编译器后端](js-ir-compiler.md) 的更多改进, 以及改善你的开发体验的其他更新:

* [对新的 IR 后端的性能改进](#performance-improvements-for-the-new-ir-backend)
* [使用 IR 时对成员名称极简化(Minification)](#minification-for-member-names-when-using-ir)
* [在 IR 后端中使用 polyfill 支持旧的浏览器](#support-for-older-browsers-via-polyfills-in-the-ir-backend)
* [从 js 表达式动态装载 JavaScript 模块](#dynamically-load-javascript-modules-from-js-expressions)
* [为 JavaScript 测试运行器指定环境变量](#specify-environment-variables-for-javascript-test-runners)

### 对新的 IR 后端的性能改进 {id="performance-improvements-for-the-new-ir-backend"}

这个发布版包含一些大的更新, 可以改进你的开发体验:

* Kotlin/JS 增量编译的性能得到了显著改善. 它可以花费更少的时间来构建你的 JS 项目.
  大多数情况下, 增量重构建现在应该大致和旧的后端差不多.
* Kotlin/JS 最终 bundle 占用更少的空间, 因为我们大大缩减了最终 artifact 的大小.
  对一些大型项目, 我们的评测显示产品 bundle 大小与旧的后端相比缩减了 20%.
* 对接口的类型检查有了数量级程度的改进.
* Kotlin 生成更加高质量的 JS 代码

### 使用 IR 时对成员名称极简化(Minification) {id="minification-for-member-names-when-using-ir"}

Kotlin/JS IR 编译器现在会使用它的内部信息, 分析你的 Kotlin 类和函数的关系, 进行更加高效的极简化, 缩短函数, 属性, 以及类的名称.
这样可以缩减最终产生的捆绑的应用程序大小.

当你在 production 模式下构建 Kotlin/JS 应用程序时, 会自动进行这样的极简化, 并且这个功能默认启用.
如果要禁用成员名称极简化, 请使用 `-Xir-minimized-member-names` 编译器 flag:

```kotlin
kotlin {
    js(IR) {
        compilations.all {
            compileKotlinTask.kotlinOptions.freeCompilerArgs += listOf("-Xir-minimized-member-names=false")
        }
    }
}
```

### 在 IR 后端中使用 polyfill 支持旧的浏览器 {id="support-for-older-browsers-via-polyfills-in-the-ir-backend"}

Kotlin/JS 的 IR 编译器后端现在包含与旧后端相同的 polyfill.
Kotlin 标准库使用的 ES2015 中的方法在旧浏览器上并不全部支持, 包含这些 polyfill, 可以让使用新编译器编译的代码能够在旧浏览器上正确运行.
只有被项目实际使用到的 polyfill 才会包含到最终的 bundle 中, 这样可以尽量减少对 bundle 大小的影响.

在使用 IR 编译器时, 这个功能会默认启用, 你不需要对它进行配置.

### 从 js 表达式动态装载 JavaScript 模块 {id="dynamically-load-javascript-modules-from-js-expressions"}

使用 JavaScript 模块时, 大多数应用程序使用静态导入, 具体的使用方法请参见 [JavaScript 模块集成](js-modules.md).
但是, Kotlin/JS 过去缺少一种机制, 在你的应用程序运行时动态的装载 JavaScript 模块.

从 Kotlin 1.7.0 开始, 在 `js` 代码段内, 支持使用 JavaScript 中的 `import` 语句,
因此你可以在运行时动态的将包引入到你的应用程序中:

```kotlin
val myPackage = js("import('my-package')")
```

### 为 JavaScript 测试运行器指定环境变量 {id="specify-environment-variables-for-javascript-test-runners"}

为了对 Node.js 包的解析进行微调, 或者向 Node.js 测试代码传递外部信息,
现在你可以指定供 JavaScript 测试运行器使用的环境变量.
要定义一个环境变量, 请在你的构建脚本的 `testTask` 代码段之内, 使用 `environment()` 函数, 参数是一个 键-值对:

```kotlin
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}
```

## 标准库

在 Kotlin 1.7.0 中, 标准库有了大量的变更和改进.
引入了新的功能, 将实验性功能升级到稳定版,
还对 Native, JS, 和 JVM 平台统一了对命名捕获组(Named Capturing Group)的支持:

* [集合函数 min() 和 max() 返回非 null 值](#min-and-max-collection-functions-return-as-non-nullable)
* [在明确指定的下标处查找正规表达式匹配](#regular-expression-matching-at-specific-indices)
* [延长对旧的语言和 API 版本的支持](#extended-support-for-previous-language-and-api-versions)
* [通过反射访问注解](#access-to-annotations-via-reflection)
* [深度递归(Deep Recursive) 函数升级为稳定版](#stable-deep-recursive-functions)
* [对默认的时间源(Time Source)使用基于内联类的时间标记器(Time mark)](#time-marks-based-on-inline-classes-for-default-time-source)
* [对 Java Optionals 的新的扩展函数(实验性功能)](#new-experimental-extension-functions-for-java-optionals)
* [在 JS 和 Native 中支持命名捕获组(Named Capturing Group)](#support-for-named-capturing-groups-in-js-and-native)

### 集合函数 min() 和 max() 返回非 null 值 {id="min-and-max-collection-functions-return-as-non-nullable"}

在 [Kotlin 1.4.0](whatsnew14.md) 中, 我们将集合函数 `min()` 和 `max()` 重命名为 `minOrNull()` 和 `maxOrNull()`.
这些新名称更好的反应函数的行为 – 如果接受者集合为空, 则返回 null.
还有助于让 Kotlin 集合 API 的函数行为与命名规约保持整体一致.

对函数 `minBy()`, `maxBy()`, `minWith()`, 和 `maxWith()` 也是如此,
在 Kotlin 1.4.0 中, 所有这些函数都有了对应的 *OrNull() 同义函数.
被这个变更影响的旧函数, 已被逐渐废弃.

Kotlin 1.7.0 重新引入了原来的函数名称, 但返回类型为非 null.
新的 `min()`, `max()`, `minBy()`, `maxBy()`, `minWith()`, 和 `maxWith()` 函数,
现在会严格的返回集合元素, 或抛出一个异常.

```kotlin
fun main() {
    val numbers = listOf<Int>()
    println(numbers.maxOrNull()) // 返回 "null"
    println(numbers.max()) // 抛出异常: "Exception in... Collection is empty."
}
```

### 在明确指定的下标处查找正规表达式匹配 {id="regular-expression-matching-at-specific-indices"}

[在 1.5.30 中引入](whatsnew1530.md#matching-with-regex-at-a-particular-position)
的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函数现在升级为稳定版.
这些函数提供了一种方法, 在一个 `String` 或 `CharSequence` 中的一个指定的位置, 检查正规表达式是否存在一个完整的匹配.

`matchesAt()` 检查一个匹配, 并返回一个 boolean 结果:

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    // 正规表达式: 一个数字, 点号, 一个数字, 点号, 一个或多个数字
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchesAt(releaseText, 0)) // 输出结果为 "false"
    println(versionRegex.matchesAt(releaseText, 7)) // 输出结果为 "true"
}
```

`matchAt()` 如果找到匹配结果, 则返回匹配结果 , 如果没有找到匹配结果, 则返回 `null`:

```kotlin
fun main() {
    val releaseText = "Kotlin 1.7.0 is on its way!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()

    println(versionRegex.matchAt(releaseText, 0)) // 输出结果为 "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // 输出结果为 "1.7.0"
}
```

希望你能通过这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-34021) 提供你的反馈意见.

### 延长对旧的语言和 API 版本的支持 {id="extended-support-for-previous-language-and-api-versions"}

为了支持库的作者开发库供更多旧版本的 Kotlin 使用, 也为了处理快速增长的 Kotlin 主发布版本,
我们延长了对旧的语言和 API 版本的支持.

在 Kotlin 1.7.0 中, 我们支持 3 个版本前的语言和 API 版本, 而不是 2 个.
因此使用 Kotlin 1.7.0 支持开发库, 最低供 Kotlin 1.4.0 版本使用.
关于向后兼容性, 详情请参见 [兼容性模式](compatibility-modes.md).

### 通过反射访问注解 {id="access-to-annotations-via-reflection"}

[在 1.6.0 中引入](whatsnew16.md#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
的扩展函数
[`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html),
现在升级为 [稳定版](components-stability.md).
这个 [反射](reflection.md)
函数对一个元素返回一个指定类型的所有注解, 包括单独使用的注解和重复的注解.

```kotlin
@Repeatable
annotation class Tag(val name: String)

@Tag("First Tag")
@Tag("Second Tag")
fun taggedFunction() {
    println("I'm a tagged function!")
}

fun main() {
    val x = ::taggedFunction
    val foo = x as KAnnotatedElement
    println(foo.findAnnotations<Tag>()) // 输出结果为: [@Tag(name=First Tag), @Tag(name=Second Tag)]
}
```

### 深度递归(Deep Recursive) 函数升级为稳定版 {id="stable-deep-recursive-functions"}

从 [Kotlin 1.4.0](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/#Defining_deep_recursive_functions_using_coroutines) 开始,
深度递归(Deep Recursive)函数作为实验性功能引入, 现在在 Kotlin 1.7.0 中升级为 [稳定版](components-stability.md).
使用 `DeepRecursiveFunction`, 你可以定义一个函数, 让它的调用栈保存在 heap 内存中, 而不是使用实际的调用栈.
因此你可以运行非常深的递归计算. 要调用一个深度递归函数, 只需要 `invoke` 它.

在这个示例中, 一个深度递归函数用来递归的计算一个二叉树的深度.
虽然这个示例函数递归的调用它自身 100,000 次, 也不会抛出 `StackOverflowError`:

```kotlin
class Tree(val left: Tree?, val right: Tree?)

val calculateDepth = DeepRecursiveFunction<Tree?, Int> { t ->
    if (t == null) 0 else maxOf(
        callRecursive(t.left),
        callRecursive(t.right)
    ) + 1
}

fun main() {
    // 生成一个深度为 100_000 的树
    val deepTree = generateSequence(Tree(null, null)) { prev ->
        Tree(prev, null)
    }.take(100_000).last()

    println(calculateDepth(deepTree)) // 输出结果为: 100000
}
```

如果你的递归深度超过 1000 次调用, 就可以考虑在你的代码中使用深度递归函数.

### 对默认的时间源(Time Source)使用基于内联类的时间标记器(Time mark) {id="time-marks-based-on-inline-classes-for-default-time-source"}

Kotlin 1.7.0 改善了时间测量功能的性能, 方法是将 `TimeSource.Monotonic` 返回的时间标记器(Time mark) 改为内联的值类.
因此, 调用 `markNow()`, `elapsedNow()`, `measureTime()`, 和 `measureTimedValue()` 之类的函数,
不会为它们的 `TimeMark` 实例包装类分配内存.
尤其是在测量一个热点部分中的一段代码时, 这个功能可以减少测量对性能的影响:

```kotlin
@OptIn(ExperimentalTime::class)
fun main() {
    val mark = TimeSource.Monotonic.markNow() // 返回的 `TimeMark` 是内联类
    val elapsedDuration = mark.elapsedNow()
}
```

> 只有当获得 `TimeMark` 时所用的时间源(Time Source), 可以静态的确定为是 `TimeSource.Monotonic` 时, 这个优化才起作用.
>
{style="note"}

### 对 Java Optionals 的新的扩展函数(实验性功能) {id="new-experimental-extension-functions-for-java-optionals"}

Kotlin 1.7.0 带来了新的便利函数, 可以简化 Java 中的 `Optional` 类的使用.
这些新函数可以用来在 JVM 上解封和转换 optional 对象, 让使用 Java API 更加简洁.

通过使用扩展函数 `getOrNull()`, `getOrDefault()`, 和 `getOrElse()`,
如果 `Optional` 的值存在, 可以让你得到这个值. 否则, 你会分别得到 `null`, 一个默认值, 或由一个函数返回的值:

```kotlin
val presentOptional = Optional.of("I'm here!")

println(presentOptional.getOrNull())
// 输出结果为: "I'm here!"

val absentOptional = Optional.empty<String>()

println(absentOptional.getOrNull())
// 输出结果为: null
println(absentOptional.getOrDefault("Nobody here!"))
// 输出结果为: "Nobody here!"
println(absentOptional.getOrElse {
    println("Optional was absent!")
    "Default value!"
})
// 输出结果为: "Optional was absent!"
// 输出结果为: "Default value!"
```

使用扩展函数 `toList()`, `toSet()`, 和 `asSequence()`,
如果 `Optional` 有值, 会将值转换为一个 List, Set, 或 Sequence, 否则返回一个空集合.
扩展函数 `toCollection()` 会将 `Optional` 的值添加到一个已经存在的目标集合中:

```kotlin
val presentOptional = Optional.of("I'm here!")
val absentOptional = Optional.empty<String>()
println(presentOptional.toList() + "," + absentOptional.toList())
// 输出结果为: ["I'm here!"], []
println(presentOptional.toSet() + "," + absentOptional.toSet())
// 输出结果为: ["I'm here!"], []
val myCollection = mutableListOf<String>()
absentOptional.toCollection(myCollection)
println(myCollection)
// 输出结果为: []
presentOptional.toCollection(myCollection)
println(myCollection)
// 输出结果为: ["I'm here!"]
val list = listOf(presentOptional, absentOptional).flatMap { it.asSequence() }
println(list)
// 输出结果为: ["I'm here!"]
```

在 Kotlin 1.7.0 中, 这些扩展函数作为实验性功能引入.
关于 `Optional` 的扩展, 更多详情请参见 [这个 KEEP](https://github.com/Kotlin/KEEP/pull/291).
和往常一样, 欢迎在 [Kotlin 问题追踪系统](https://kotl.in/issue) 中反馈你的意见.

### 在 JS 和 Native 中支持命名捕获组(Named Capturing Group) {id="support-for-named-capturing-groups-in-js-and-native"}

从 Kotlin 1.7.0 开始, 命名捕获组(Named Capturing Group) 不仅在 JVM 上支持, 而且在 JS 和 Native 平台也支持了.

要为一个捕获组指定一个名称, 请在你的正规表达式中使用 (`?<name>group`) 语法.
要得到被这个组匹配的文本, 请调用新引入的函数
[`MatchGroupCollection.get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/get.html),
参数是组的名称.

#### 通过名称获取匹配的组的值

我们来看看这个示例, 它匹配城市的座标. 要得到正规表达式匹配的组的集合,
请使用 [`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html).
比较一下得到组的两种方法, 一种是通过组的编号(下标)来得到, 另一种是通过组的名称来得到,
然后使用 `value` 得到组的内容:

```kotlin
fun main() {
    val regex = "\\b(?<city>[A-Za-z\\s]+),\\s(?<state>[A-Z]{2}):\\s(?<areaCode>[0-9]{3})\\b".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    val match = regex.find(input)!!
    println(match.groups["city"]?.value) // 输出结果为: "Austin" — 通过名称得到组
    println(match.groups[2]?.value) // 输出结果为: "TX" — 通过下标得到组
}
```

#### 命名的反向引用

你现在还可以在反向引用组时使用组的名称. 反向引用会匹配在前面曾经被一个捕获组匹配过的相同的文字.
要使用这个功能, 请在你的正规表达式中使用 `\k<name>` 语法:

```kotlin
fun backRef() {
    val regex = "(?<title>\\w+), yes \\k<title>".toRegex()
    val match = regex.find("Do you copy? Sir, yes Sir!")!!
    println(match.value) // 输出结果为: "Sir, yes Sir"
    println(match.groups["title"]?.value) // 输出结果为: "Sir"
}
```

#### 在替换表达式中使用命名的组

命名的组引用可以与替换表达式一起使用.
比如
[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html)
函数, 会使用一个替换表达式替换在输入文本中指定的正规表达式的所有匹配,
以及
[`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html)
函数, 只替换第一个匹配.

在替换字符串中出现的 `${name}` 会被替换为这个名称对应的捕获组的内容.
你可以比较在替换表达式通过名称和通过下标引用组的方法:

```kotlin
fun dateReplace() {
    val dateRegex = Regex("(?<dd>\\d{2})-(?<mm>\\d{2})-(?<yyyy>\\d{4})")
    val input = "Date of birth: 27-04-2022"
    println(dateRegex.replace(input, "\${yyyy}-\${mm}-\${dd}")) // 输出结果为: "Date of birth: 2022-04-27" — 通过名称引用组
    println(dateRegex.replace(input, "\$3-\$2-\$1")) // 输出结果为: "Date of birth: 2022-04-27" — 通过下标引用组
}
```

## Gradle

这个发布版引入了新的构建报告功能, 支持 Gradle plugin 变体(Variant), 在 kapt 中的新的统计功能, 以及其他很多功能:

* [增量编译的新方案](#a-new-approach-to-incremental-compilation)
* [新功能: 构建报告, 用于追踪编译器性能](#build-reports-for-kotlin-compiler-tasks)
* [对 Gradle 和 Android Gradle plugin 的最小支持版本的变更](#bumping-minimum-supported-versions)
* [支持 Gradle plugin 变体(Variant)](#support-for-gradle-plugin-variants)
* [Kotlin Gradle plugin API 中的更新](#updates-in-the-kotlin-gradle-plugin-api)
* [可以通过通过 plugin API 使用 sam-with-receiver plugin](#the-sam-with-receiver-plugin-is-available-via-the-plugins-api)
* [编译任务中的更新](#changes-in-compile-tasks)
* [新功能: 在 kapt 中, 对每个注解处理器生成的文件的统计](#statistics-of-generated-files-by-each-annotation-processor-in-kapt)
* [废弃了系统属性 kotlin.compiler.execution.strategy](#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)
* [删除了废弃的选项, 方法, 和 plugin](#removal-of-deprecated-options-methods-and-plugins)

### 增量编译的新方案 {id="a-new-approach-to-incremental-compilation"}

> 增量编译的新方案是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 需要明确同意使用(Opt-in)(详情请参见下文). 我们鼓励你只为评估目的来使用这个功能,
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

在 Kotlin 1.7.0 中, 我们重写了对跨模块变更的增量编译功能.
对发生在依赖的非 Kotlin 模块内的变更, 现在也支持增量编译了,
而且它兼容于 [Gradle 构建缓存](https://docs.gradle.org/current/userguide/build_cache.html).
对编译回避的支持也有了改进.

如果你使用构建缓存, 或在非 Kotlin Gradle 模块中频繁的进行修改, 那么我们期待你会看到新方案的显著改进.
我们对 Kotlin 项目的 `kotlin-gradle-plugin` 模块的测试显示, 对在缓存命中之后的变更, 性能改善超过 80%.

要试用这个新方案, 请在你的 `gradle.properties` 中设置以下选项:

```none
kotlin.incremental.useClasspathSnapshot=true
```

> 增量编译的新方案目前只能用于 JVM 后端和 Gradle 构建系统.
>
{style="note"}

关于增量编译新方案的实现方式, 详情请参见
[这篇 blog](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/).

我们的计划是继续稳定这个技术, 并添加对其他后端(比如 JS)和其他构建系统的支持.
如果你在这个编译体系中遇到任何问题, 或任何奇怪的行为,
欢迎通过 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 向我们反馈. 谢谢!

Kotlin 开发组非常感谢
[Ivan Gavrilovic](https://github.com/gavra0), [Hung Nguyen](https://github.com/hungvietnguyen),
[Cédric Champeau](https://github.com/melix), 以及其他外部贡献者提供的帮助.

### 对 Kotlin 编译器任务的构建报告 {id="build-reports-for-kotlin-compiler-tasks"}

> Kotlin 构建报告是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.7.0 引入了构建报告功能, 帮助追踪编译器的性能.
报告包括不同编译阶段的执行时间, 以及编译不能增量执行的原因.

如果你想要调查编译器任务相关的问题, 构建报告会很方便, 比如:

* Gradle 构建耗费了太多时间, 你想要调查性能低下的根本原因.
* 相同项目的编译时间发生了变化, 有时花费几秒, 有时花费几分钟.

要启用构建报告, 请在 `gradle.properties` 中声明构建报告输出的保存位置:

```none
kotlin.build.report.output=file
```

可以使用以下值 (以及它们的组合):

* `file` 将构建报告保存到本地文件.
* `build_scan` 将构建报告保存到 [build scan](https://scans.gradle.com/) 的 `custom values` 小节.

  > Gradle Enterprise plugin 会限制 custom values 的数量和长度. 在很大的项目中, 有些值可能会丢失.
  >
  {style="note"}

* `http` 通过 HTTP(S) 提交构建报告.
  使用 POST 方法传送 JSON 格式的测量结果. 数据可能在各个版本中发生变化.
  你可以在
  [Kotlin 代码仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)
  中看到传送的数据的当前版本.

有 2 种常见情况, 对长时间运行的编译, 分析构建报告可以帮助你解决问题:

* 构建没有增加运行. 分析原因并解决底层的问题.
* 构建是增加运行, 但耗费了太多时间.
  可以试试重新组织源代码文件 — 把大的文件切分成小文件, 单独的类保存到不同的文件中, 对大的类进行重构, 在不同的文件中声明顶层函数, 等等.

关于新的构建报告功能, 详情请参见 [这篇 blog](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/).

欢迎在你的开发环境中试用构建报告. 如果你有任何反馈意见, 遇到任何问题, 或有改进意见,
请通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/newIssue) 报告. 谢谢!

### 提升最小支持版本 {id="bumping-minimum-supported-versions"}

从 Kotlin 1.7.0 开始, Gradle 的最小支持版本是 6.7.1.
我们不得不 [提升版本](https://youtrack.jetbrains.com/issue/KT-49733/Bump-minimal-supported-Gradle-version-to-6-7-1)
以便支持 [Gradle plugin 变体(Variant)](#support-for-gradle-plugin-variants) 以及新的 Gradle API.
将来, 由于有了 Gradle plugin 变体功能, 我们应该不会再需要经常提升最小支持版本.

此外, Android Gradle plugin 的最小支持版本现在是 3.6.4.

### 支持 Gradle plugin 变体(Variant) {id="support-for-gradle-plugin-variants"}

Gradle 7.0 为 Gradle plugin 作者引入了一个新功能
— [带变体的 plugin](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants).
在为 Gradle 7.1 以下版本维护兼容性时, 这个功能使得更容易为新的 Gradle 功能添加支持.
详情请参见 [Gradle 中的变体选择](https://docs.gradle.org/current/userguide/variant_model.html).

使用 Gradle plugin 变体, 我们可以为不同的 Gradle 版本发布不同的 Kotlin Gradle plugin 变体.
目标是要在 `main` 变体中支持基本的 Kotlin 编译, 这个变体对应于最旧的 Gradle 支持版本.
每个变体将会拥有来自对应发布版的 Gradle 功能实现. 最新的变体将会支持最大的 Gradle 功能集.
通过这个方案, 我们可以继续支持旧的 Gradle 版本, 但包含功能限制.

目前, Kotlin Gradle plugin 只有 2 个变体:

* `main` 用于 Gradle 版本 6.7.1–6.9.3
* `gradle70` 用于 Gradle 版本 7.0 以及更高版本

在未来的 Kotlin 发布版中, 我们可能会添加更多变体.

要查看你的构建使用哪个变体, 请启用
[`--info` log 级别](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level),
然后在输出日志中查找以 `Using Kotlin Gradle plugin` 开头的字符串, 比如, `Using Kotlin Gradle plugin main variant`.

> 对于 Gradle 中变体选择的一些已知问题, 下面是变通方法:
> * [pluginManagement 中的ResolutionStrategy 不支持有多个变体的 plugin](https://github.com/gradle/gradle/issues/20545)
> * [当一个 plugin 被添加为 `buildSrc` 共通依赖项时, Plugin 变体被忽略](https://github.com/gradle/gradle/issues/20847)
>
{style="note"}

请到 [这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-49227/Support-Gradle-plugins-variants) 提供你的反馈意见.

### Kotlin Gradle plugin API 中的更新 {id="updates-in-the-kotlin-gradle-plugin-api"}

Kotlin Gradle plugin API artifact 有了一些改进:

* 新的接口, 用于带有用户可配置输入的 Kotlin/JVM 和 Kotlin/kapt 任务.
* 一个新的 `KotlinBasePlugin` 接口, 所有的 Kotlin plugin 继承这个接口.
  如果你想要在任何 Kotlin Gradle plugin (JVM, JS, Multiplatform, Native, 以及其他平台) 被应用时触发某些配置动作,
  可以使用这个接口:

  ```kotlin
  project.plugins.withType<org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin>() {
      // 在这里配置你的动作
  }
  ```
  你可以在
  [这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-48008/Consider-offering-a-KotlinBasePlugin)
  中留下关于 `KotlinBasePlugin` 的反馈.

* 我们完成了 Android Gradle plugin 的基础工作, 让它能够配置 Kotlin 编译,
  因此你不需要在你的构建中添加 Kotlin Android Gradle plugin.
  请参见 [Android Gradle Plugin 发布公告](https://developer.android.com/studio/releases/gradle-plugin),
  查看添加了哪些功能, 并试用它!

### 可以通过 plugin API 使用 sam-with-receiver plugin {id="the-sam-with-receiver-plugin-is-available-via-the-plugins-api"}

[sam-with-receiver 编译器 plugin](sam-with-receiver-plugin.md)
现在可以通过 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) 使用:

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.sam.with.receiver") version "$kotlin_version"
}
```

### 编译任务中的更新 {id="changes-in-compile-tasks"}

在这个发布版中, 编译任务也有了很多更新:

* Kotlin 编译任务不再集成 Gradle 的 `AbstractCompile` 任务. 改为只继承 `DefaultTask`.
* `AbstractCompile` 任务拥有 `sourceCompatibility` 和 `targetCompatibility` 输入.
  由于不再继承 `AbstractCompile` 任务, 在 Kotlin 用户的脚本中不再能够使用这些输入.
* `SourceTask.stableSources` 输入不再可用, 你应该使用 `sources` 输入.
  `setSource(...)` 方法仍然可以使用.
* 对于编译所需要的库列表, 所有的编译任务现在使用 `libraries` 输入.
  `KotlinCompile` 任务仍然拥有已废弃的 Kotlin 属性 `classpath`, 将在未来的发布版本中删除.
* 编译任务仍然实现 `PatternFilterable` 接口, 可以过滤 Kotlin 源代码.
  `sourceFilesExtensions` 输入已被删除, 改为使用 `PatternFilterable` 方法.
* 废弃的 `Gradle destinationDir: File` 输出替换为 `destinationDirectory: DirectoryProperty` 输出.
* Kotlin/Native `AbstractNativeCompile` 任务现在继承 `AbstractKotlinCompileTool` 基类.
  这个是迈向将 Kotlin/Native 构建工具集成到所有的其他工具中的第一步.

请在 [这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-32805) 中留下你的反馈意见.

### 在 kapt 中, 对每个注解处理器生成的文件的统计 {id="statistics-of-generated-files-by-each-annotation-processor-in-kapt"}

过去, `kotlin-kapt` Gradle plugin 可以 [对每个处理器报告性能统计](https://github.com/JetBrains/kotlin/pull/4280).
从 Kotlin 1.7.0 开始, 它还可以每个注解处理器报告生成的文件数量统计.

这个功能可以用来追踪构建中是否存在未使用的注解处理器.
你可以使用生成的报告, 查找哪些模块触发了不必要的注解处理器, 然后更新模块, 不再触发这些注解处理器.

要启用统计功能, 需要以下 2 步:

* 在你的 `build.gradle.kts` 中, 将 `showProcessorStats` flag 设置为 `true`:

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* 在你的 `gradle.properties` 中, 将 `kapt.verbose` Gradle 属性设置为 `true` :

  ```none
  kapt.verbose=true
  ```

> 你还可以使用 [命令行选项 `verbose`](kapt.md#use-in-cli), 启用 verbose 输出.
>
{style="note"}

统计结果会出现在 log 中, 级别为 `info`. 你会看到 `Annotation processor stats:` 行, 之后是每个注解处理器的执行时间统计.
再后面, 将是 `Generated files report:` 行, 之后是每个注解处理器生成的文件数量统计.
比如:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

请在
[这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-51132/KAPT-Support-reporting-the-number-of-generated-files-by-each-ann)
中留下你的反馈意见.

### 废弃了系统属性 kotlin.compiler.execution.strategy {id="deprecation-of-the-kotlin-compiler-execution-strategy-system-property"}

Kotlin 1.6.20 中引入了 [新的属性来定义 Kotlin 编译器的执行策略](whatsnew1620.md#properties-for-defining-kotlin-compiler-execution-strategy).
在 Kotlin 1.7.0 中, 开始了旧系统属性 `kotlin.compiler.execution.strategy` 的废弃周期, 改为使用新的属性.

使用系统属性 `kotlin.compiler.execution.strategy` 时, 你将收到一个警告信息.
这个属性将在将来的发布版中删除. 如果要保留旧的行为, 请将系统属性替换为相同名称的 Gradle 属性.
你在 `gradle.properties` 中可以这样做, 比如:

```none
kotlin.compiler.execution.strategy=out-of-process
```

你也可以使用编译任务属性 `compilerExecutionStrategy`.
详情请参见 [Gradle 章节](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).

### 删除了废弃的选项, 方法, 和 plugin {id="removal-of-deprecated-options-methods-and-plugins"}

#### 删除了 useExperimentalAnnotation 方法

在 Kotlin 1.7.0 中, 我们完成了 Gradle 方法 `useExperimentalAnnotation` 的废弃周期.
如果使用一个模块中的一个 API 需要使用者的同意, 请改用 `optIn()`.

比如, 如果你的 Gradle 模块是跨平台模块:

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

详情请参见 Kotlin 中的 [明确要求使用者同意的功能(Opt-in Requirement)](opt-in-requirements.md).

#### 删除了废弃的编译器选项

我们完成了几个编译器选项废弃周期:

* 编译器选项 `kotlinOptions.jdkHome` 在 1.5.30 中被废弃, 在现在的发布版中已被删除.
  如果包含这个选项, Gradle 构建现在会失败.
  我们建议你使用 [Java 工具链](whatsnew1530.md#support-for-java-toolchains), 它从 Kotlin 1.5.30 开始支持.
* 废弃的编译器选项 `noStdlib` 也被删除了.
  Gradle plugin 使用属性 `kotlin.stdlib.default.dependency=true` 来控制是否存在 Kotlin 标准库.

> 编译器参数 `-jdkHome` 和 `-no-stdlib` 仍然可以使用.
>
{style="note"}

#### 删除了废弃的 plugin

在 Kotlin 1.4.0 中, `kotlin2js` 和 `kotlin-dce-plugin` plugin 已被废弃, 并在这个发布版中删除.
请使用新的 `org.jetbrains.kotlin.js` plugin 代替 `kotlin2js`.
如果 [适当配置](javascript-dce.md) Kotlin/JS Gradle plugin, 死代码剔除(Dead Code Elimination, DCE) 功能还会继续工作.

在 Kotlin 1.6.0 中, 我们将 `KotlinGradleSubplugin` 类的废弃级别修改为 `ERROR`.
开发者过去使用这个类来编写编译器 plugin.
在这个发布版中, [这个类已被删除](https://youtrack.jetbrains.com/issue/KT-48831/).
请改为使用 `KotlinCompilerPluginSupportPlugin` 类.

> 最佳实践是在你的整个项目中使用 1.7.0 或更高版本的 Kotlin plugin.
>
{style="tip"}

#### 删除了废弃的 coroutines DSL 选项和属性

我们删除了废弃的 Gradle DSL 选项 `kotlin.experimental.coroutines` 和 `gradle.properties` 中使用的属性 `kotlin.coroutines`.
现在你可以直接使用 _[suspending 函数](coroutines-basics.md#extract-function-refactoring)_
或向你的构建脚本 [添加 `kotlinx.coroutines` 依赖项](gradle-configure-project.md#set-a-dependency-on-a-kotlinx-library).

关于协程, 详情请参见 [协程指南](coroutines-guide.md).

#### 删除了工具链扩展方法中的类型转换

在 Kotlin 1.7.0 之前, 在使用 Kotlin DSL 配置 Gradle 工具链时, 你必须将它类型转换为 `JavaToolchainSpec` 类:

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

现在, 你可以省略 `(this as JavaToolchainSpec)` 部分:

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

## 迁移到 Kotlin 1.7.0 {id="migrating-to-kotlin-1-7-0"}

### 安装 Kotlin 1.7.0 {id="install-kotlin-1-7-0"}

IntelliJ IDEA 2022.1 和 Android Studio Chipmunk (212) 会自动建议将 Kotlin plugin 更新到 1.7.0.

> 对于 IntelliJ IDEA 2022.2, 和 Android Studio Dolphin (213) 或 Android Studio Electric Eel (221),
> Kotlin plugin 1.7.0 会随之后的 IntelliJ IDEA 和 Android Studios 更新一起发布.
>
{style="note"}

新的命令行编译器可以在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.0) 下载.

### 将既有的项目迁移到 Kotlin 1.7.0, 或使用 Kotlin 1.7.0 创建新的项目

* 要将既有的项目迁移到 Kotlin 1.7.0, 请将 Kotlin 版本修改为 `1.7.0`, 然后重新导入你的 Gradle 或 Maven 项目.
  详情请参见 [如何更新到 Kotlin 1.7.0](releases.md#update-to-a-new-kotlin-version).

* 要使用 Kotlin 1.7.0 创建一个新项目, 请更新 Kotlin plugin, 然后通过 **File** | **New** |
  **Project**, 运行项目向导.

### Kotlin 1.7.0 兼容性指南

Kotlin 1.7.0 是一个 [功能发布版](kotlin-evolution-principles.md#language-and-tooling-releases),
因此可能带来一些变更, 与你为更早的语言版本编写的代码不能兼容.
关于这样的变更, 详情请参见 [Kotlin 1.7.0 兼容性指南](compatibility-guide-17.md).
