---
type: doc
layout: reference
category:
title: "Kotlin 1.7.20-RC 版中的新功能"
---

# Kotlin 1.7.20-RC 版中的新功能

最终更新: {{ site.data.releases.latestDocDate }}

_[发布日期: {{ site.data.releases.kotlinEapReleaseDate }}](eap.html#build-details)_

> 本文档没有包含早期预览版 (EAP) 中的全部的功能, 但重点介绍了新的功能和一些重要改进.
> 关于所有更新, 请参见 [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-RC).
{:.note}

Kotlin 1.7.20-RC 已经发布了! 下面是 Kotlin 的这个预览版中的一些重要功能:

* [新的 Kotlin K2 编译器支持 `all-open`, `no-arg`, SAM with receiver, Lombok, Parcelize, 以及其他编译器 plugin](#support-for-kotlin-k2-compiler-plugins)
* [我们引入了 `..<` 操作符的预览版, 用于创建终止端开放的值范围(open-ended range)](#preview-of-the-operator-for-creating-open-ended-ranges)
* [默认启用新的 Kotlin/Native 内存管理器](#the-new-kotlin-native-memory-manager-is-enabled-by-default)
* [我们为 JVM 引入了一个新的实验性功能: 使用泛型类型的内联类](#generic-inline-classes)
* [Kotlin Gradle plugin 更新, 支持 Gradle 7.1](#support-for-gradle-7-1)

## 对 Kotlin K2 编译器 plugin 的支持

Kotlin 开发组还在继续稳定 K2 编译器.
K2 仍然在 Alpha 阶段 (如同 [Kotlin 1.7.0 发布版中宣布](whatsnew17.html#new-kotlin-k2-compiler-for-the-jvm-in-alpha) 的那样),
但现在它支持几种编译器 plugin.
你可以关注 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604), 从 Kotlin 开发组得到新编译器的最新信息.

从这个预览版本开始, Kotlin K2 编译器支持以下 plugins:

* [`all-open`](all-open-plugin.html)
* [`no-arg`](no-arg-plugin.html)
* [SAM with receiver](sam-with-receiver-plugin.html)
* [Lombok](lombok.html)
* Parcelize
* AtomicFU
* `jvm-abi-gen`

> 新的 K2 编译器的 Alpha 版只能用于 JVM 项目.
> 不支持 Kotlin/JS, Kotlin/Native, 或其他跨平台项目.
{:.warning}

关于新的编译器以及它的益处, 请观看以下视频:
* [通往新 Kotlin 编译器之路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 编译器: 概要介绍](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用并测试 Kotlin K2 编译器, 请使用以下编译器选项:

```bash
-Xuse-k2
```

你可以在你的 JVM 项目中查看性能提升, 并与旧编译器的性能进行比较.

### 留下你对于新 K2 编译器的反馈意见

我们非常感谢你任何形式的反馈意见:
* 在 Kotlin Slack 中直接向 K2 开发者提供你的反馈意见:
  [得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw),
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道.
* 向 [我们的问题追踪系统](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Performance%20Problem&c=Subsystems%20Frontend.%20IR)
  报告你使用新 K2 编译器时遇到的任何问题

## ..< 操作符预览版, 用于创建终止端开放的值范围(open-ended range)

> 这个新操作符是 [实验性功能](components-stability.html#stability-levels-explained), 在 IDE 中只有非常有限的支持.
{:.warning}

这个发布版引入了新的 `..<` 操作符. Kotlin 已经有了 `..` 操作符 来表达一个值范围.
新的 `..<` 操作符与 `until` 函数类似, 帮助你定义终止端开放的值范围.

我们的研究显示, 这个新操作符更适合表示终止端开放的值范围, 更清楚的表示值范围的上界没有包含在内.

下面是在 `when` 表达式中使用 `..<` 操作符的示例:

```kotlin
when (value) {
    in 0.0..<0.25 -> // 第 1 个 1/4
    in 0.25..<0.5 -> // 第 2 个 1/4
    in 0.5..<0.75 -> // 第 3 个 1/4
    in 0.75..1.0 ->  // 最后 1 个 1/4  <- 注意这里是封闭的值范围
}
```

### 标准库 API 的变更

在共通的 Kotlin 标准库的 `kotlin.ranges` 包中, 将会引入以下新的类型和操作:

#### 新的 OpenEndRange<T> 接口

用于表达终止端开放的值范围的新接口与已有的 `ClosedRange<T>` 接口非常类似:

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 下界
    val start: T
    // 上界, 不包含在值范围内
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```

#### 在既有的可遍历的值范围中实现 OpenEndRange 

现在, 如果开发者需要得到一个带封闭的上界的值范围, 他们可以使用相同的值, 通过 `until` 函数高效的产生一个封闭的可遍历的值范围.
为了让这样的值范围能够用于接受 `OpenEndRange<T>` 的新 API, 我们希望在既有的可遍历的值范围中实现这个接口,
包括: `IntRange`, `LongRange`, `CharRange`, `UIntRange`, `ULongRange`.
这样它们就能同时实现 `ClosedRange<T>` 和 `OpenEndRange<T>` 接口.

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```

#### 用于标准类型的 rangeUntil 操作符

对于目前定义了 `rangeTo` 操作符的类型及其组合, 还会提供 `rangeUntil` 操作符.
作为原型, 我们以扩展函数的形式提供这些操作符, 但为了保持一致性, 在终止端开放的值范围 API 的稳定版发布之前, 我们计划让它们成为类的成员.

### 如何启用 `..<` 操作符

要使用 `..<` 操作符, 或为你自己的类型实现这个操作符, 你需要启用 `-XXLanguage:+RangeUntilOperator` 编译器选项.

为支持标准类型的终止端开放值范围, 引入了新的 API 元素, 和通常的实验性标准库 API 一样, 这些元素需要使用者明确同意(opt-in): `@OptIn(ExperimentalStdlibApi::class)`.
或者, 你也可以使用编译器选项: `-opt-in=kotlin.ExperimentalStdlibApi`.

[关于这个新操作符, 详情请参见这个 KEEP 文档](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md).

## 默认启用新的 Kotlin/Native 内存管理器

Kotlin 1.7.20 默认启用新的 Kotlin/Native 内存管理器.
这个发布版带来了更多的稳定性和性能改善, 允许我们将新的内存管理器提升到 [Beta 版](components-stability.html#stability-levels-explained).

以前的内存管理器使得编写并发和异步代码比较复杂, 包括实现 `kotlinx.coroutines` 库时的问题.
这些问题阻碍了 Kotlin Multiplatform Mobile 的应用, 因为同步的限制, 导致在 iOS 和 Android 平台共用 Kotlin 代码会发生问题.
新的内存管理器终于为 [Kotlin Multiplatform Mobile 提升到 Beta 版](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) 铺好了道路.

新的内存管理器还支持编译器缓存, 使得编译时间能够与以前的版本媲美.
关于新内存管理器的更多益处, 请参见我们关于预览版的的 [Blog 文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/).
在 [GitHub 上的迁移指南](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md) 中, 你可以找到更多技术细节.

### 配置与设置

从 Kotlin 1.7.20 开始, 默认使用新的内存管理器. 不需要额外的设置.

如果你已经手动启用了它, 你可以从你的 `gradle.properties` 文件删除 `kotlin.native.binary.memoryModel=experimental` 选项,
或从 `build.gradle(.kts)` 文件删除 `binaryOptions["memoryModel"] = "experimental"`.

如果需要, 你可以在你的 `gradle.properties` 文件中使用 `kotlin.native.binary.memoryModel=strict` 选项, 切换回原来的内存管理器.
但是, 对于原来的内存管理器, 编译器缓存支持就不再可用了, 因此编译时间会恶化.

#### 冻结(Freezing)

在新的内存管理器中, 冻结(Freezing)已被废弃. 请不要使用它, 除非你需要你的代码在原来的内存管理器中工作 (旧内存管理器中继续需要冻结).
对于需要继续支持原来的内存管理器的库开发者, 或开发者在使用新的内存管理器时遇到问题, 想要退回到旧内存管理器的情况, 这个功能可能有帮助.

这种情况下, 你可以临时性的同时支持新的和原来的内存管理器.
要忽略废弃导致的编译警告, 请执行以下步骤中的某一个:

* 在使用废弃的 API 的地方, 标注 `@OptIn(FreezingIsDeprecated::class)` 注解.
* 在 Gradle 中对所有的 Kotlin 源代码集使用 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")`.
* 传递编译器 flag `-opt-in=kotlin.native.FreezingIsDeprecated`.

#### 在 Swift/Objective-C 中调用 Kotlin suspending 函数

对于从 Swift 和 Objective-C 的主线程以外的线程调用 Kotlin `suspend` 函数的情况, 新的内存管理器还存在限制,
但你可以使用一个新的 Gradle 选项 lift it .

这个限制最初是在原来的内存管理器中引入的, 针对代码将自己的后续代码派发在原来的线程中恢复执行的情况.
如果这个线程没有一个支持的事件循环, 这个任务就永远不会执行, 因此协程永远不会恢复执行.

在某些情况下, 可以不再需要这个限制, 但对所有必要条件的检查很难实现.
由于这个原因, 我们决定在新的内存管理器中继续保留这个限制, 同时引入一个选项, 允许你关闭这个限制.
要关闭它, 请向你的 `gradle.properties` 文件添加以下选项:

```properties
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> 如果你使用 `kotlinx.coroutines` 的 `native-mt` 版本, 或采用了相同的 "dispatch to the original thread" 方案的其他库,
> 请不要添加这个选项.
{:.warning}

Kotlin 开发组非常感谢 [Ahmed El-Helw](https://github.com/ahmedre) 实现了这个选项.

### 留下你的反馈意见

对我们的生态系统来说, 这是一个重大的变更. 如果你能够留下反馈意见, 帮助继续改善它, 我们将会非常感谢.

请在你的项目中试用新的内存管理器, 并 [在我们的问题追踪系统 YouTrack 中留下你的反馈意见](https://youtrack.jetbrains.com/issue/KT-48525).

## 泛型的内联类

> 泛型的内联类是 [实验性功能](components-stability.html#stability-levels-explained).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文), 而且你应该只为评估的目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-52994) 提供你的反馈意见.
{:.warning}

Kotlin 1.7.20-RC 允许 JVM 内联类使用类型参数作为它的内部数据的类型.
编译器会将它映射为 `Any?`, 或者, 一般来说, 映射为类型参数的上界.

请参考下面的示例:

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 编译器生成 fun compute-<hashcode>(s: Any?)
```

函数接受内联类作为参数. 参数会被映射为类型参数的上界, 而不是类型参数.

要启用这个功能, 请使用 `-language-version 1.8` 编译器选项.

## 支持 Gradle 7.1

Kotlin 1.7.20-RC 修正了使用 Gradle 7.1 中已废弃的方法和属性的问题, 因此清除了这个 Gradle 发布版带来的废弃警告.

注意, 有一个潜在的不兼容变更 − `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 现在有一个泛型参数, `SingleTargetExtension<T : KotlinTarget>`.

如果你有跨平台项目, 请注意以下变更:

* `kotlin.targets.fromPreset()` 惯用法已被废弃.
  作为代替, 你可以继续使用 `kotlin.targets { fromPreset() }` 方案,
  但我们推荐使用更加 [专门的方法来创建编译目标](multiplatform/multiplatform-set-up-targets.html).
* 在 `kotlin.targets { }` 代码段内, 由 Gradle 自动生成的编译目标访问器不再可用.
  请改为使用 `findByName("targetName")` 方法.
  注意, 对 `kotlin.targets` 情况, 这些访问器仍然可以使用, 比如对 `kotlin.targets.linuxX64`.

## 如何更新到 Kotlin 1.7.20-RC

从 IntelliJ IDEA 2022.2.1, Android Studio Dolphin (2021.3.1), 和 Android Studio Electric Eel (2022.1.1) 开始,
IDE 支持 Kotlin 1.7.20-RC.

你可以通过以下任何一种方式安装 Kotlin 1.7.20-RC:

* 如果你使用 _Early Access Preview_ 更新频道
  IDE 会在 1.7.20-RC 可用时, 自动建议更新到 1.7.20-RC.
* 如果你使用 _Stable_ 更新频道,
  你可以在你的 IDE 中选择 **Tools** \| **Kotlin** \| **Configure Kotlin Plugin Updates**, 将更新频道修改为 _Early Access Preview_.
  然后你就可以安装最新的预览版本了. 详情请参见 [这些文档](install-eap-plugin.html).

安装 1.7.20-RC 之后, 不要忘记在你的构建脚本中 [修改 Kotlin 版本](configure-build-for-eap.html) 到 1.7.20-RC.
