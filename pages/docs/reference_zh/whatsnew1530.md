---
type: doc
layout: reference
category:
title: "Kotlin 1.5.30 版中的新功能"
---

# Kotlin 1.5.30 版中的新功能

最终更新: {{ site.data.releases.latestDocDate }}

_[发布日期: 2021/08/24](releases.html#release-details)_

Kotlin 1.5.30 带来语言更新, 包括功能变更的预览, 平台支持与工具方面的大量改进, 以及新的标准库函数.

下面是主要的功能改进:
* 语言功能, 包括封闭式(sealed) `when` 语句(实验性功能), 明确要求使用者同意的功能(Opt-in Requirement)的使用方法变更, 以及其他更新
* 支持 Apple Silicon 平台的原生(Native)开发
* Kotlin/JS IR 后端升级为 Beta 版
* Gradle plugin 使用体验改进

关于功能变更的简短介绍, 也可以参见 [发布公告](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/),
以及下面的视频:

<iframe width="560" height="360" src="https://www.youtube.com/embed/rNbb3A9IdOo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 语言功能

Kotlin 1.5.30 提供了未来的语言功能变更的预览, 并带来了要求使用者同意的功能(Opt-in Requirement)和类型推断的改进:
* [针对封闭类或布尔值的穷尽式(exhaustive) when 语句](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [挂起函数用作超类型](#suspending-functions-as-supertypes)
* [隐含使用实验性 API 时要求使用者同意](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [要求使用者同意注解对不同目标的使用方式的变更](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [对递归泛型类型的类型推断的改进](#improvements-to-type-inference-for-recursive-generic-types)
* [去掉了构建器推断的限制](#eliminating-builder-inference-restrictions)

### 针对封闭类或布尔值的穷尽式(exhaustive) when 语句

> 封闭 (穷尽式) when 语句是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文), 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-12380) 提供你的反馈意见.
{:.warning}

一个 _穷尽式_ [`when`](control-flow.html#when-expression) 语句包含对应于所有可能的类型或值的分支, 对于某些类型, 再加上 `else` 分支.
也就是说, 它覆盖私有可能的情况.

我们计划很快禁用非穷尽的 `when` 语句, 使得 `when` 语句的动作与 `when` 表达式一致.
为了保证平滑移植, 你可以配置编译器, 对封闭类或布尔值的非穷尽 `when` 语句报告警告.
在 Kotlin 1.6 中默认会出现这些警告, 将来会变为错误.

> 枚举类型已经有了这些警告.
{:.note}

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON -> println("ON")
    }
// 编译器警告: Non exhaustive 'when' statements on sealed classes/interfaces
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// 编译器警告: Non exhaustive 'when' statements on Booleans will be prohibited
// in 1.7, add a 'false' or 'else' branch instead
}
```

要在 Kotlin 1.5.30 中启用这个功能, 请使用语言版本 `1.6`.
你也可以启用 [渐进模式](whatsnew13.html#progressive-mode), 将警告变为错误.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // 默认为 false
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
            //progressiveMode = true // 默认为 false
        }
    }
}
```

</div>
</div>

### 挂起函数用作超类型

> 挂起函数用作超类型是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-18707) 提供你的反馈意见.
{:.warning}

Kotlin 1.5.30 提供了一个功能预览, 可以将一个 `suspend` 函数类型用作一个超类型, 但存在一些限制.

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

使用 `-language-version 1.6` 编译器选项来启用这个功能:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
        }
    }
}
```

</div>
</div>

这个功能存在以下限制:
* 在超类型中, 你不能混合使用一个通常的函数类型与一个的 `suspend` 函数类型. 这是由于 `suspend` 函数类型在 JVM 后端中的实现细节造成的.
  它表达为一个通常的函数类型加上一个标记接口. 由于这个标记接口, 无法区分哪个父接口是挂起函数, 哪个是通常函数.
* 你不能使用多个 `suspend` 函数作为超类型. 如果存在类型检查, 你也不能使用多个通常的函数作为超类型.

### 隐含使用实验性 API 时要求使用者同意

> 要求使用者同意机制是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 参见 [如何明确要求使用者同意](opt-in-requirements.html).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
{:.warning}

库的作者可以将一个试验性 API 标记为 [要求使用者同意](opt-in-requirements.html#create-opt-in-requirement-annotations),
用来提醒使用者这个功能处于试验性状态.
当使用这个 API 时, 编译器会报告一个警告或错误, 并要求 [明确同意使用](opt-in-requirements.html#opt-in-to-using-api) 来消除这些警告或错误.

在 Kotlin 1.5.30 中, 对于签名中存在试验性类型的任何声明, 编译器都认为它们是试验性的.
也就是说, 即使对一个试验性 API 的隐含使用, 它也要求使用者同意.
比如, 如果函数的返回类型标记为试验性 API 元素, 那么使用这个函数会也要求你明确同意, 即使函数声明本身明确没有标记为需要使用者同意.

```kotlin
// 库代码

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // 要求使用者同意的注解

@MyDateTime
class DateProvider // 一个要求使用者同意的类

// 客户端代码

// 编译器警告: experimental API usage
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // 这里也会出现编译器警告: experimental API usage
    // ... 
}
```

详情请参见 [明确要求使用者同意](opt-in-requirements.html).

### 要求使用者同意注解对不同目标的使用方式的变更

> 要求使用者同意机制是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 参见 [如何明确要求使用者同意](opt-in-requirements.html).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
{:.warning}

在不同的 [注解目标](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/) 上的要求使用者同意的注解的使用和声明,
Kotlin 1.5.30 现在使用新的规则. 对于编译期无法处理的使用场景, 编译器现在会报告错误. 在 Kotlin 1.5.30 中:
* 在使用端, 禁止对局部变量和值参数标注要求使用者同意的注解.
* 对 override, 只有当它的原始声明也进行了标注, 才允许进行标注.
* 禁止对后端域和 get 方法标注. 你可以改为标注属性.
* 在要求使用者同意的注解的声明端, 禁止将注解目标设置为 `TYPE` 和 `TYPE_PARAMETER`.

详情请参见 [明确要求使用者同意的功能](opt-in-requirements.html).

### 对递归泛型类型的类型推断的改进

在 Kotlin 和 Java 中, 你可以定义一个递归泛型类型, 在它的类型参数中引用它自身.
在 Kotlin 1.5.30 中, 如果一个类型参数是递归泛型, 那么 Kotlin 编译器可以只根据对应的类型参数的上界(upper bound)推断出这个类型参数.
因此, 可以使用递归泛型类型, 创建出 Java 中经常用来创建构建器 API 的很多模式.

```kotlin
// Kotlin 1.5.20
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
    withDatabaseName("db")
    withUsername("user")
    withPassword("password")
    withInitScript("sql/schema.sql")
}

// Kotlin 1.5.30
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
    .withDatabaseName("db")
    .withUsername("user")
    .withPassword("password")
    .withInitScript("sql/schema.sql")
```

你可以传递 `-Xself-upper-bound-inference` 或 `-language-version 1.6` 编译器选项来启用这个改进.
关于新支持的使用场景的其他示例, 请参见 [这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-40804).

### 去掉了构建器推断的限制

构建器推断一种特殊的类型推断, 可以根据一个调用的 Lambda 参数之内的其他调用的类型信息, 来推断这个调用的类型参数.
当调用泛型构建器函数时, 这个功能可以很有用,
比如 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)
或 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html):
`buildList { add("string") }`.

在这样一个 Lambda 参数内部, 以前曾经存在一个限制, 不能使用构建器推断功能尝试推断的类型信息.
因此你只能指定这个类型信息, 而不能通过推断得到它. 比如, 在 `buildList()` 的 Lambda 参数之内,
除非明确指定类型参数, 否则你不能调用 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html).

Kotlin 1.5.30 使用 `-Xunrestricted-builder-inference` 编译器选项去掉了这个限制.
添加这个选项, 可以在泛型构建器函数的 Lambda 参数之内, 启用以前被禁止的调用:

```kotlin
@kotlin.ExperimentalStdlibApi
val list = buildList {
    add("a")
    add("b")
    set(1, null)
    val x = get(1)
    if (x != null) {
        removeAt(1)
    }
}

@kotlin.ExperimentalStdlibApi
val map = buildMap {
    put("a", 1)
    put("b", 1.1)
    put("c", 2f)
}
```

你还可以通过 `-language-version 1.6` 编译器选项启用这个功能.

## Kotlin/JVM

在 Kotlin 1.5.30 版中, Kotlin/JVM 新增了以下功能:
* [创建注解类的实例](#instantiation-of-annotation-classes)
* [可否为 null(Nullability) 注解的支持配置的改进](#improved-nullability-annotation-support-configuration)

See the [Gradle](#gradle) section for Kotlin Gradle plugin updates on the JVM platform.

### 创建注解类的实例

> 创建注解类的实例是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-45395) 提供你的反馈意见.
{:.warning}

在 Kotlin 1.5.30 中, 现在你可以在任何代码中调用 [注解类](annotations.html) 的构造器, 来获得一个实例.
这个功能能够用于 Java 中相同的使用场景, 可以实现一个注解接口.

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker) = ...

fun main(args: Array<String>) {
    if (args.size != 0)
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

使用 `-language-version 1.6` 编译器选项来启用这个功能.
注意, 注解类现有的所有限制都继续存在, 比如不能定义 非 `val` 参数, 或与次级构造器(secondary constructor)不同的成员.

关于创建注解类的实例, 更多详情请参见 [这个 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md).

### 可否为 null(Nullability) 注解的支持配置的改进

Kotlin 编译器可以读取多种类型的 [可否为 null(Nullability) 注解](java-interop.html#nullability-annotations),
来从 Java 代码得到可否为 null 信息.
这个信息使得它能够报告 Kotlin 中调用 Java 代码时的可否为 null 不匹配的错误.

在 Kotlin 1.5.30 中, 你可以指定编译器是否根据指定的可否为 null 注解类型的信息来报告可否为 null 不匹配的错误.
只需要使用编译器选项 `-Xnullability-annotations=@<package-name>:<report-level>`.
在参数中, 指定可否为 null 注解的全限定包名称, 以及以下报告级别中的一个:
* `ignore`: 忽略可否为 null 不匹配
* `warn`: 报告为警告
* `strict`: 报告为错误.

详情请参见 [支持的可否为 null 注解列表](jvm/java-interop.html#nullability-annotations) 以及它们的全限定包名称.

下面是一个示例, 演示如何对新支持的 [RxJava](https://github.com/ReactiveX/RxJava) 3 可否为 null 注解启用错误报告:
`-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`.
注意, 所有这些可否为 null 不匹配, 默认设置为警告.

## Kotlin/Native

Kotlin/Native 包含以下变更和改进:
* [支持 Apple Silicon](#apple-silicon-support)
* [CocoaPods Gradle plugin 的 Kotlin DSL 的改进](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [与 Swift 5.5 async/await 的交互(实验性功能)](#experimental-interoperability-with-swift-5-5-async-await)
* [对象和伴随对象到 Swift/Objective-C 的映射的改进](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [对 MinGW 编译目标废弃无导入库的 DLL 链接](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### 支持 Apple Silicon

Kotlin 1.5.30 引入了对 [Apple Silicon](https://support.apple.com/en-us/HT211814) 的原生支持.

在以前的版本中, Kotlin/Native 编译器和工具需要
[Rosetta 翻译环境](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment)
才能在 Apple Silicon 主机上工作.
在 Kotlin 1.5.30 中, 不再需要翻译环境 – 编译器和工具可以在 Apple Silicon 硬件上运行, 不需要任何额外的操作.

我们还引入了新的编译目标, 可以使 Kotlin 代码在 Apple Silicon 上直接运行:
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

这些编译目标可以用于 Intel 和 Apple Silicon 的主机. 所有既有的编译目标也可以在 Apple Silicon 主机上使用.

注意, 在 1.5.30 中, 我们只在 `kotlin-multiplatform` Gradle plugin 中提供对 Apple Silicon 编译目标的基本的支持.
具体来说, 在
[`ios`, `tvos`, 和 `watchos` 编译目标简写(target shortcut)](multiplatform/multiplatform-share-on-platforms.html#use-target-shortcuts)
中没有包含新的模拟器编译目标.
详情请参见, [如何通过编译目标简写使用 Apple Silicon 编译目标](multiplatform/multiplatform-share-on-platforms.html#target-shortcuts-and-arm64-apple-silicon-simulators).
我们会继续改进这些新的编译目标的使用体验.

### CocoaPods Gradle plugin 的 Kotlin DSL 的改进

#### Kotlin/Native Framework 的新参数

Kotlin 1.5.30 带来了 CocoaPods Gradle plugin DSL 关于 Kotlin/Native Framework 的改进.
除了 Framework 名称之外, 你还可以在 pod 配置中指定其他参数:
* 指定 Framework 的动态或静态版本
* 明确启用导出依赖项
* 启用 Bitcode 内嵌

要使用新的 DSL, 请将你的项目更新到 Kotlin 1.5.30, 并在你的 `build.gradle(.kts)` 文件的 `cocoapods` 节中指定参数:

```kotlin
cocoapods {
    frameworkName = "MyFramework" // 这个属性已废弃, 并会在将来的版本中删除
    // Framework 配置的新的 DSL 如下:
    framework {
        // 支持所有的 Framework 属性
        // Framework 名称配置. 使用这个属性代替已废弃的 'frameworkName'
        baseName = "MyFramework"
        // 支持动态 Framework
        isStatic = false
        // 依赖项导出
        export(project(":anotherKMMModule"))
        transitiveExport = false // 这是默认设置.
        // Bitcode 内嵌
        embedBitcode(BITCODE)
    }
}
```

#### 对 Xcode 配置支持自定义名称

Kotlin CocoaPods Gradle plugin 在 Xcode 构建配置中支持自定义名称.
如果你在 Xcode 中为构建配置使用了特殊的名称, 比如 `Staging`, 这个功能也可以帮助你.

要指定一个自定义名称, 请在你的 `build.gradle(.kts)` 文件的 `cocoapods` 节中使用 `xcodeConfigurationToNativeBuildType` 参数:

```kotlin
cocoapods {
    // 将自定义的 Xcode 配置映射到 NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

这个参数不会出现在 Podspec 文件中. 当 Xcode 运行 Gradle 构建过程时, Kotlin CocoaPods Gradle plugin 会选择必要的原生构建类型.

> 不需要声明 `Debug` 和 `Release` 配置, 因为默认支持它们.
{:.note}

### 与 Swift 5.5 async/await 的交互(实验性功能)

> 与 Swift async/await 的并发交互是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-47610) 提供你的反馈意见.
{:.warning}

过去我们曾经 [在 1.4.0 中添加了从 Objective-C 和 Swift 中调用 Kotlin 关起函数的功能](whatsnew14.html#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c),
现在我们删除这个功能, 改为使用新的 Swift 5.5 功能 – [使用 `async` 和 `await` 修饰符的并发功能](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md).

对于返回类型可为 null 的挂起函数, Kotlin/Native 编译器现在会在生成的 Objective-C 头文件中, 输出 `_Nullable_result` 属性.
因此在 Swift 中可以将这些函数作为 `async` 函数来调用, 并且得到正确的可否为 null 结果.

注意, 这个功能是实验性功能, 未来可能由于 Kotlin 和 Swift 的变化而受到影响.
目前来说, 我们提供这个功能的一个预览版, 带有一些限制, 我们期待得到你的意见反馈.
请在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610) 中查看这个功能目前的状态, 并留下你的反馈意见.

### 对象和伴随对象到 Swift/Objective-C 的映射的改进

对于原生 iOS 开发者来说, 现在可以通过更加符合直觉的方式得到对象和伴随对象. 比如, 如果在 Kotlin 中你有以下对象:

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

要在 Swift 中访问它们, 你可以使用 `shared` 和 `companion` 属性:

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

详情请参见 [与 Swift/Objective-C 代码交互](native/native-objc-interop.html).

### 对 MinGW 编译目标废弃无导入库的 DLL 链接

[LLD](https://lld.llvm.org/) 是 LLVM 项目的一个链接器, 我们计划在 Kotlin/Native 中对 MinGW 编译目标使用它,
因为它的好处比默认的 ld.bfd 更多 – 主要是它的性能更好.

但是, LLD 的最新稳定版本对 MinGW (Windows) 编译目标不支持直接链接到 DLL. 这样的链接需要使用 [导入库](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527).
尽管对于 Kotlin/Native 1.5.30 来说不需要它们, 但我们添加了一个警告, 告知你这样的使用不兼容于 LLD, 将来 LLD 会成为 MinGW 编译目标的默认链接器.

关于转换到 LLD 浏览器, 请在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47605) 中提供你的反馈意见.

## Kotlin Multiplatform

1.5.30 对于 Kotlin Multiplatform 带来了以下重要更新:
* [在共用的原生代码中可以使用自定义 `cinterop` 库](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [支持 XCFramework](#support-for-xcframeworks)
* [对 Android artifact 的新的默认发布设置](#new-default-publishing-setup-for-android-artifacts)

### 在共用的原生代码中可以使用自定义 `cinterop` 库

Kotlin Multiplatform 提供了一个 [选项](multiplatform/multiplatform-share-on-platforms.html#use-native-libraries-in-the-hierarchical-structure),
可以在共用的源代码集中使用平台相关的 interop 库.
在 1.5.30 之前, 这个功能只能用于随 Kotlin/Native 一同发布的 [平台库](native-platform-libs.html).
从 1.5.30 开始, 你可以使用你自定义的 `cinterop` 库.
要启用这个功能, 请在你的 `gradle.properties` 中添加 `kotlin.mpp.enableCInteropCommonization=true` 属性:

```properties
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### 支持 XCFramework

所有的 Kotlin Multiplatform 项目现在可以使用 XCFramework 作为输出格式.
Apple 引入了 XCFramework 来替代通用(Universal) (fat) Framework.
通过使用 XCFramework, 你:
* 可以将所有的编译目标平台和处理器架构的逻辑集中在一个单独的 bundle 中.
* 在将应用程序发布到 App Store 之前, 不必删除所有不需要的处理器架构.

如果你想要对 Apple M1 上的设备和模拟器使用你的 Kotlin Framework, XCFramework 会很有用.

要使用 XCFramework, 请更新你的 `build.gradle(.kts)` 脚本:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform")
}

kotlin {
    val xcf = XCFramework()
  
    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)

    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
}
```

</div>
</div>

当你声明 XCFramework 时, 会注册这些新的 Gradle task:
* `assembleXCFramework`
* `assembleDebugXCFramework` (debug 用 artifact, [包含 dSYMs](native/native-ios-symbolication.html))
* `assembleReleaseXCFramework`

关于 XCFramework, 详情请参见 [这个 WWDC 视频](https://developer.apple.com/videos/play/wwdc2019/416/).

### 对 Android artifact 的新的默认发布设置

使用 `maven-publish` Gradle plugin, 你可以在构建脚本中指定 [Android 变体](https://developer.android.com/studio/build/build-variants) 名称,
[对 Android 编译目标发布你的跨平台库](multiplatform/multiplatform-publish-lib.html#publish-an-android-library).
Kotlin Gradle plugin 会自动生成发布.

在 1.5.30 之前, 生成的发布 [metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)
包含每一个发布的 Android 变体的构建类型属性, 因此只能兼容于库使用者所使用的相同的构建类型.
Kotlin 1.5.30 引入了一个新的默认发布设置:
* 如果项目发布的所有 Android 变体拥有相同的构建类型属性, 那么发布的变体不会拥有构建类型属性, 而且能够兼容于任何构建类型.
* 如果发布的变体拥有不同的构建类型属性, 那么只有带有 `release` 值的, 发布时会不带有构建类型属性.
  因此 release 变体兼容于使者端的任何构建类型, 而 release 之外的其他变体只兼容于匹配的使者端构建类型.

如果要关闭这个功能, 并对所有变体保持构建类型属性, 你可以设置这个 Gradle 属性:
`kotlin.android.buildTypeAttribute.keep=true`.

## Kotlin/JS

在 1.5.30 中, Kotlin/JS 有 2 个主要改进:
* [JS IR 编译器后端升级为 Beta 版](#js-ir-compiler-backend-reaches-beta)
* [使用 Kotlin/JS IR 后端为应用程序带来更好的调试体验](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR 编译器后端升级为 Beta 版

1.4.0 版引入了 Kotlin/JS 的 [基于 IR 的编译器后端](whatsnew14.html#unified-backends-and-extensibility),
当时是 [Alpha 版](components-stability.html), 现在升级为 Beta 版.

以前, 我们发布了 [移植到 JS IR 后端的向导](js/js-ir-migration.html), 来帮助你将你的项目移植到新的后端.
现在我们提供 [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE plugin,
它可以直接在 IntelliJ IDEA 中显示需要哪些修改.

### 使用 Kotlin/JS IR 后端为应用程序带来更好的调试体验

Kotlin 1.5.30 带来了对 Kotlin/JS IR 后端的 JavaScript 源代码映射生成功能.
这个功能可以改善启用 IR 后端时的 Kotlin/JS 调试体验, 支持所有的调试功能, 包括断点, 单步执行, 以及易读的调用栈信息, 带有正确的源代码引用.

详情请参见 [如何在浏览器中或在 IntelliJ IDEA Ultimate 中调试 Kotlin/JS](js/js-debugging.html).

## Gradle

为了 [改进 Kotlin Gradle plugin 使用者体验](https://youtrack.jetbrains.com/issue/KT-45778), 我们实现了以下功能:
* [支持 Java 工具链](#support-for-java-toolchains), 包括 [可以使用 `UsesKotlinJavaToolchain` 接口对 Gradle 旧版本指定 JDK Home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [用更简单的方式明确指定 Kotlin Daemon 的 JVM 参数](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### 支持 Java 工具链

Gradle 6.7 引入了 [支持 Java 工具链](https://docs.gradle.org/current/userguide/toolchains.html) 功能.
使用这个功能, 你可以:
* 使用与 Gradle 不同的 JDK 和 JRE 运行编译, 测试, 和可执行文件.
* 使用未发布的语言版本编译和测试代码.

通过工具链支持, Gradle 可以自动检测本地的 JDK, 并安装 Gradle 构建所需要但缺失的 JDK.
现在 Gradle 自身可以在任何 JDK 上运行, 而且还能够重用 [构建缓存功能](gradle.html#gradle-build-cache-support).

Kotlin Gradle plugin 对 Kotlin/JVM 编译任务支持 Java 工具链.
Java 工具链会:
* 为 JVM 编译目标设置可用的 [`jdkHome` 选项](gradle.html#attributes-specific-to-jvm).
  > [直接设置 `jdkHome` 选项的功能已废弃](https://youtrack.jetbrains.com/issue/KT-46541).
  {:.warning}

* 如果使用者没有明确设置 `jvmTarget` 选项, 会将 [`kotlinOptions.jvmTarget`](gradle.html#attributes-specific-to-jvm) 设置为工具链的 JDK 版本.
  如果工具链没有配置, `jvmTarget` 域会使用默认值. 详情请参见 [JVM 编译目标兼容性](gradle.html#check-for-jvm-target-compatibility-of-related-compile-tasks).

* 影响 [`kapt` worker](kapt.html#running-kapt-tasks-in-parallel) 运行在哪个 JDK 上.

可以使用以下代码来设置一个工具链. 请将 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</div>
</div>

注意, 通过 `kotlin` 扩展设置工具链, 也会对 Java 编译任务更新工具链.

你可以通过 `java` 扩展设置工具链, Kotlin 编译任务会使用它:

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

关于为 `KotlinCompile` 任务设置 JDK 版本, 请参见 [使用 Task DSL 设置 JDK 版本](gradle.html#setting-jdk-version-with-the-task-dsl).

对于 Gradle 版本 6.1 到 6.6, 请 [使用 `UsesKotlinJavaToolchain` 接口来设置 JDK Home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface).

### 使用 UsesKotlinJavaToolchain 接口指定 JDK Home

所有支持通过 [`kotlinOptions`](gradle.html#compiler-options) 设置 JDK 的 Kotlin 任务,
现在都实现 `UsesKotlinJavaToolchain` 接口.
要设置 JDK Home, 请设置你的 JDK 路径, 并替换 `<JDK_VERSION>` 部分:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
project.tasks
    .withType<UsesKotlinJavaToolchain>()
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            "/path/to/local/jdk",
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
project.tasks
    .withType(UsesKotlinJavaToolchain.class)
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            '/path/to/local/jdk',
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</div>
</div>

对 Gradle 6.1 到 6.6 版本, 请使用 `UsesKotlinJavaToolchain` 接口.
从 Gradle 6.7 开始, 请改为使用 [Java 工具链](#support-for-java-toolchains).

使用这个功能时, 请注意, [kapt 任务 worker](kapt.html#running-kapt-tasks-in-parallel) 只使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode), `kapt.workers.isolation` 属性将被忽略.

### 用更简单的方式明确指定 Kotlin Daemon 的 JVM 参数

在 Kotlin 1.5.30 中, 对于 Kotlin Daemon 的 JVM 参数有了新的逻辑.
以下列表中的每个选项都会覆盖它之前的选项:

* 如果没有指定任何参数, Kotlin Daemon 会从 Gradle Daemon 继承参数(和以前一样). 比如, 在 `gradle.properties` 文件中:

    ```properties
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* 如果 Gradle Daemon 的 JVM 参数包含 `kotlin.daemon.jvm.options` 系统属性, 和以前一样使用它:

    ```properties
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* 在 `gradle.properties` 文件中你可以添加 `kotlin.daemon.jvmargs` 属性:

    ```properties
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* 你可以在 `kotlin` 扩展中指定参数:

  <div class="multi-language-sample" data-lang="kotlin">
  <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

  ```kotlin
  kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
  }
  ```
  
  </div>
  </div>
  
  <div class="multi-language-sample" data-lang="groovy">
  <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

  ```groovy
  kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
  }
  ```
  
  </div>
  </div>

* 你可以对一个特定的任务指定参数 :

    <div class="multi-language-sample" data-lang="kotlin">
    <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
  
    ```kotlin
    tasks
        .matching { it.name == "compileKotlin" && it is CompileUsingKotlinDaemon }
        .configureEach {
            (this as CompileUsingKotlinDaemon).kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
        }
    ```
  
    </div>
    </div>
  
    <div class="multi-language-sample" data-lang="groovy">
    <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
  
    ```groovy
    tasks
        .matching {
            it.name == "compileKotlin" && it instanceof CompileUsingKotlinDaemon
        }
        .configureEach {
            kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
        }
    ```
  
    </div>
    </div>

    > 在这种情况中, 在任务执行时可以启动一个新的 Kotlin Daemon 实例.
    > 详情请参见 [Kotlin Daemon 与 JVM 参数的交互](gradle.html#setting-kotlin-daemon-s-jvm-arguments).
    {:.note}

关于 Kotlin Daemon, 详情请参见 [Kotlin Daemon 以及它在 Gradle 中的使用](gradle.html#kotlin-daemon-and-using-it-with-gradle).

## 标准库

Kotlin 1.5.30 包括对标准库的 `Duration` 和 `Regex` API 的改进:
* [改变了 `Duration.toString()` 的输出](#changing-duration-tostring-output)
* [从字符串解析 Duration](#parsing-duration-from-string)
* [在一个指定的位置匹配正规表达式](#matching-with-regex-at-a-particular-position)
* [使用正规表达式将字符串切分为一个序列](#splitting-regex-to-a-sequence)

### 改变了 Duration.toString() 的输出

> Duration API 是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
{:.warning}

在 Kotlin 1.5.30 以前,
[`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html)
函数会返回它的参数的字符串表达, 使用最紧凑的并且可以阅读的数值单位.
从现在开始, 它会返回一个字符串值, 表达为多个数值部分的组合, 每个数值部分使用自己的单位.
每个部分是一个数值, 加上一个单位缩写名称: `d`, `h`, `m`, `s`. 比如:

| **函数调用示例**                              | **以前的输出** | **现在的输出** |
|-----------------------------------------|--------------------|-------------------|
 Duration.days(45).toString()            | `45.0d`            | `45d`             |
 Duration.days(1.5).toString()           | `36.0h`            | `1d 12h`          |
 Duration.minutes(1230).toString()       | `20.5h`            | `20h 30m`         |
 Duration.minutes(2415).toString()       | `40.3h`            | `1d 16h 15m`      |
 Duration.minutes(920).toString()        | `920m`             | `15h 20m`         |
 Duration.seconds(1.546).toString()      | `1.55s`            | `1.546s`          |
 Duration.milliseconds(25.12).toString() | `25.1ms`           | `25.12ms`         |

负值的时间长度表达也发生了同样的变化. 一个负值的时间长度使用负号 (`-`) 前缀, 如果它由多个部分组成, 会用括号括起: `-12m` 和 `-(1h 30m)`.

注意, 少于 1 秒的时间长度表达为单个数值, 使用秒以下单位的. 比如, `ms` (毫秒), `us` (微秒), 或 `ns` (纳秒): `140.884ms`, `500us`, `24ns`.
不再使用科学记数法来表达.

如果你想要使用单个单位来表达时间长度, 请使用超载函数 `Duration.toString(unit, decimals)`.

> 在某些情况下, 我们推荐使用 [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html), 包括序列化和数据交换.
> `Duration.toIsoString()` 使用更加严格的 [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) 格式, 而不是 `Duration.toString()`.
{:.note}

### 从字符串解析 Duration

> Duration API 是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [这个 issue](https://github.com/Kotlin/KEEP/issues/190) 提供你的反馈意见.
{:.warning}

在 Kotlin 1.5.30 中, 有以下新的 Duration API 函数:
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html),
  支持解析以下函数的输出:
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html).
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html).
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html).
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html),
  只解析 `toIsoString()` 输出的格式.
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html)
  和
  [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html),
  与上面的函数类似, 但对于无效的 Duration 格式, 会返回 `null` 而不是抛出 `IllegalArgumentException` 异常.

下面是 `parse()` 和 `parseOrNull()` 的一些使用示例:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    val singleUnitFormatString = "1.5h"
    val invalidFormatString = "1 hour 30 minutes"
    println(Duration.parse(isoFormatString)) // 输出为 "1h 30m"
    println(Duration.parse(defaultFormatString)) // 输出为 "1h 30m"
    println(Duration.parse(singleUnitFormatString)) // 输出为 "1h 30m"
    //println(Duration.parse(invalidFormatString)) // 抛出异常
    println(Duration.parseOrNull(invalidFormatString)) // 输出为 "null"
//sampleEnd
}
```

</div>

下面是 `parseIsoString()` 和 `parseIsoStringOrNull()` 的一些使用示例:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // 输出为 "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // 抛出异常
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // 输出为 "null"
//sampleEnd
}
```

</div>

### 在一个指定的位置匹配正规表达式

> `Regex.matchAt()` 和 `Regex.matchesAt()` 函数是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-34021) 提供你的反馈意见.
{:.warning}

新的 `Regex.matchAt()` 和 `Regex.matchesAt()` 函数提供一种方法,
可以检查一个正规表达式在一个 `String` 或 `CharSequence` 的指定位置是否存在完全匹配.

`matchesAt()` 返回一个 boolean 结果:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // 正规表达式: 1个数字, 点, 1个数字, 点, 1个或多个数字
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // 输出为 "false"
    println(versionRegex.matchesAt(releaseText, 7)) // 输出为 "true"
//sampleEnd
}
```

</div>

如果找到匹配, 则 `matchAt()` 返回匹配结果, 否则返回 `null`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchAt(releaseText, 0)) // 输出为 "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // 输出为 "1.5.30"
//sampleEnd
}
```

</div>

### 使用正规表达式将字符串切分为一个序列

> `Regex.splitToSequence()` 和 `CharSequence.splitToSequence(Regex)` 函数是 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-23351) 提供你的反馈意见.
{:.warning}

新的 `Regex.splitToSequence()` 函数是
[`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html)
函数的 lazy 版本.
它根据正规表达式的匹配结果切分字符串, 但结果返回为一个 [序列(Sequence)](sequences.html),
因此对这个结果的所有操作都会以 lazy 模式执行.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main(){
//sampleStart
    val colorsText = "green, red , brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // 输出为 "brown&blue"
//sampleEnd
}
```

</div>

对 `CharSequence` 也添加了一个类似的函数 :

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```

</div>

## Serialization 的 1.3.0-RC 版

发布了 `kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) 版,
包括新的 JSON 序列化功能:
* Java IO Stream 序列化
* 对默认值的属性级控制
* 一个选项, 可以在序列化中排除 null 值
* 在多态序列化中使用自定义类区分

详情请参见 [changelog](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC).
<!-- 和 the [kotlinx.serialization 1.3.0 release blog post](TODO). -->
