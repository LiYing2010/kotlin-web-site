[//]: # (title: Kotlin 1.7.20 版中的新功能)

<tldr>
   <p>IDE 从 IntelliJ IDEA 2021.3, 2022.1, 和 2022.2 开始支持 Kotlin 1.7.20.</p>
</tldr>

_[发布日期: 2022/09/29](releases.md#release-details)_

Kotlin 1.7.20 已经发布了! 以下是它的一些重要功能:

* [新的 Kotlin K2 编译器支持 `all-open`, SAM with receiver, Lombok, 以及其它编译器 plugin](#support-for-kotlin-k2-compiler-plugins)
* [我们引入了 `..<` 操作符的预览版, 用于创建终止端开放的值范围(open-ended range)](#preview-of-the-operator-for-creating-open-ended-ranges)
* [默认启用新的 Kotlin/Native 内存管理器](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [我们为 JVM 引入了一个新的实验性功能: 使用泛型类型的内联类](#generic-inline-classes)

关于这个版本的变更概要, 请参见以下视频:

<video src="https://www.youtube.com/v/OG9npowJgE8" title="Kotlin 1.7.20 版中的新功能"/>

## 对 Kotlin K2 编译器 plugin 的支持 {id="support-for-kotlin-k2-compiler-plugins"}

Kotlin 开发组还在继续稳定 K2 编译器.
K2 仍然在 **Alpha** 阶段
(如同 [Kotlin 1.7.0 发布版中宣布](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha) 的那样),
但现在它支持几种编译器 plugin.
你可以关注 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604), 从 Kotlin 开发组得到新编译器的最新信息.

从 1.7.20 版开始, Kotlin K2 编译器支持以下 plugin:

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> 新的 K2 编译器的 Alpha 版只能用于 JVM 项目.
> 不支持 Kotlin/JS, Kotlin/Native, 或其他跨平台项目.
>
{style="warning"}

关于新的编译器以及它的益处, 请观看以下视频:
* [通往新 Kotlin 编译器之路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 编译器: 概要介绍](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用并测试 Kotlin K2 编译器, 请使用以下编译器选项:

```bash
-Xuse-k2
```

你可以在你的 `build.gradle(.kts)` 文件中指定这个选项:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</tab>
</tabs>

你可以在你的 JVM 项目中查看性能提升, 并与旧编译器的性能进行比较.

### 留下你对于新 K2 编译器的反馈意见

我们非常感谢你任何形式的反馈意见:
* 在 Kotlin Slack 中直接向 K2 开发者提供你的反馈意见: [得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw),
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道.
* 如果在使用新 K2 编译器时遇到的任何问题, 请向 [我们的问题追踪系统](https://kotl.in/issue) 提交报告.
* [开启 **Send usage statistics** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html),
  允许 JetBrains 收集关于 K2 使用情况的匿名统计数据.

## 语言功能

Kotlin 1.7.20 引入了一些新的语言功能特性的预览版, 并对构建器类型推断增加了一些限制:

* [..< 操作符的预览版, 用于创建终止端开放的值范围(open-ended range)](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 data object 声明](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [构建器类型推断的限制](#new-builder-type-inference-restrictions)

### `..<` 操作符的预览版, 用于创建终止端开放的值范围(open-ended range) {id="preview-of-the-operator-for-creating-open-ended-ranges"}

> 这个新操作符是 [实验性功能](components-stability.md#stability-levels-explained), 在 IDE 中只有非常有限的支持.
>
{style="warning"}

这个发布版引入了新的 `..<` 操作符. Kotlin 已经有了 `..` 操作符来表达一个值范围.
新的 `..<` 操作符与 `until` 函数类似, 帮助你定义终止端开放的值范围.

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="用于创建终止端开放的值范围(open-ended range)的新操作符"/>

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
{validate="false"}

#### 标准库 API 的变更

在共通的 Kotlin 标准库的 `kotlin.ranges` 包中, 将会引入以下新的类型和操作:

##### 新的 OpenEndRange&lt;T&gt; 接口

用于表达终止端开放的值范围的新接口与已有的 `ClosedRange<T>` 接口非常类似:

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 值范围的下界
    val start: T
    // 值范围的上界, 不包含在值范围内
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 在既有的可遍历的值范围中实现 OpenEndRange

现在, 如果开发者需要得到一个带开放的上界的值范围, 他们可以使用相同的值, 通过 `until` 函数等效的产生一个封闭的可遍历的值范围.
为了让这样的值范围能够用于接受 `OpenEndRange<T>` 的新 API, 我们希望在既有的可遍历的值范围中实现这个接口,
包括: `IntRange`, `LongRange`, `CharRange`, `UIntRange`, 和 `ULongRange`.
这样它们就能同时实现 `ClosedRange<T>` 和 `OpenEndRange<T>` 接口.

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 用于标准类型的 rangeUntil 操作符

对于目前由 `rangeTo` 操作符定义的类型及其组合, 还会提供 `rangeUntil` 操作符.
作为原型, 我们以扩展函数的形式提供这些操作符, 但为了保持一致性, 在终止端开放的值范围 API 的稳定版发布之前, 我们计划让它们成为类的成员.

#### 如何启用 ..&lt; 操作符

要使用 `..<` 操作符, 或为你自己的类型实现这个操作符, 你需要启用 `-language-version 1.8` 编译器选项.

为支持标准类型的终止端开放值范围, 引入了新的 API 元素, 和通常的实验性标准库 API 一样, 这些元素需要使用者明确同意(opt-in):
`@OptIn(ExperimentalStdlibApi::class)`.
或者, 你也可以使用编译器选项: `-opt-in=kotlin.ExperimentalStdlibApi`.

[关于这个新操作符, 详情请参见这个 KEEP 文档](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md).

### 对单子(Singleton)与带 data object 的封闭类层级结构(Sealed Class Hierarchy), 改善了它们的字符串表示 {id="improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects"}

> Data object 是 [实验性功能](components-stability.md#stability-levels-explained), 目前在 IDE 中只有非常有限的支持.
>
{style="warning"}

这个发布版引入了新类型的 `object` 声明供你使用: `data object`.
[Data object](https://youtrack.jetbrains.com/issue/KT-4107)
的行为与通常的 `object` 声明相同, 但默认带有更加良好格式化的 `toString` 表示.

<video src="https://www.youtube.com/v/ovAqcwFhEGc" title="Kotlin 1.7.20 中的数据对象"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // 输出结果是 org.example.MyObject@1f32e575
    println(MyDataObject) // 输出结果是 MyDataObject
}
```

因此封闭类层级结构(Sealed Class Hierarchy)很适合使用 `data object` 声明,  你可以和其他 `data class` 声明一起使用.
在下面的代码中, 我们将 `EndOfFile` 声明为 `data object`, 而不是单纯的 `object`,
因此它将带有良好格式化的 `toString`, 而不必手动编写这个函数, 同时又保持这个对象与其他 `data class` 定义的一致性:

```kotlin
sealed class ReadResult {
    data class Number(val value: Int) : ReadResult()
    data class Text(val value: String) : ReadResult()
    data object EndOfFile : ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // 输出结果是 Number(value=1)
    println(ReadResult.Text("Foo")) // 输出结果是 Text(value=Foo)
    println(ReadResult.EndOfFile) // 输出结果是 EndOfFile
}
```

#### 如何启用 data object

要在你的代码中使用 data object 声明, 请启用 `-language-version 1.9` 编译器选项.
在 Gradle 项目中, 你可以在你的 `build.gradle(.kts)` 文件中添加以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</tab>
</tabs>

关于 data object 的更多信息, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/pull/316),
对于它们的实现, 也可以在这里提供你的反馈意见.

### 构建器类型推断的新限制 {id="new-builder-type-inference-restrictions"}

Kotlin 1.7.20 对 [构建器类型推断](using-builders-with-builder-inference.md) 功能添加了一些重要的限制, 可能会影响你的代码.
这些限制影响包含构建器 lambda 函数的代码, 在这些代码中, 不对 lambda 函数本身进行分析就无法判断参数类型. 而参数需要被用作类型参数.
现在, 编译器会对这样的代码一律报告错误, 要求你明确指定参数类型.

这是一个不兼容的变更, 但我们的研究演示, 这样的情况非常少见, 而且这样的限制通常不会影响你的代码.
如果有影响, 请参考下面的情况:

* 构建器推断包含扩展函数, 隐藏了同名的成员函数.

  如果你的代码包含扩展函数, 它的名称与在构建器推断中使用的名称相同, 那么编译器会提示错误:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }

    fun <T> T.doSmth() {} // 2

    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // 这里解析的结果是函数 2 , 并导致错误
        }
    }
    ```
    {validate="false"}

  要修正这段代码, 你需要明确指定类型:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }

    fun <T> T.doSmth() {} // 2

    fun test() {
        buildList<Data> { // 使用类型参数!
            this.add(Data())
            this.get(0).doSmth() // 这里解析的结果是函数 1
        }
    }
    ```

* 构建器推断使用多个 lambda 函数, 而且没有明确指定类型参数.

  如果在构建器推断中存在 2 个或以上的 lambda 代码段, 它们会影响到类型. 为了避免错误, 编译器会要求你明确指定类型:

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() -> Unit,
        second: MutableList<T>.() -> Unit
    ): List<T> {
        val list = mutableListOf<T>()
        list.first()
        list.second()
        return list
    }

    fun main() {
        buildList(
            first = { // this 的类型是: MutableList<String>
                add("")
            },
            second = { // this 的类型是: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```
    {validate="false"}

  要修正这个错误, 你需要明确指定类型, 修正类型不匹配的问题:

    ```kotlin
    fun main() {
        buildList<Int>(
            first = { // this 的类型是: MutableList<Int>
                add(0)
            },
            second = { // this 的类型是: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```

如果你遇到了以上情况以外的错误, 请向我们的团队 [提交一个 issue](https://kotl.in/issue).

关于构建器推断的这次更新, 详情请参见这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797).

## Kotlin/JVM

Kotlin 1.7.20 引入了泛型的内联类(Generic Inline Class), 对委托属性增加了更多的字节码优化,
还在 kapt stub 生成 task 中支持 IR, 因此可以在 kapt 中使用 Kotlin 的所有最新功能:

* [泛型的内联类(Generic Inline Class)](#generic-inline-classes)
* [对委托属性的更多优化](#more-optimized-cases-of-delegated-properties)
* [在 kapt stub 生成 task 中支持 JVM IR 后端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 泛型的内联类(Generic Inline Class) {id="generic-inline-classes"}

> 泛型的内联类是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文), 而且你应该只为评估的目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-52994) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.7.20 允许 JVM 内联类使用类型参数作为它的内部数据的类型.
编译器会将它映射为 `Any?`, 或者, 一般来说, 映射为类型参数的上界.

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Kotlin 1.7.20 中的泛型的内联类"/>

请参考下面的示例:

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 编译器生成 fun compute-<hashcode>(s: Any?)
```

函数接受内联类作为参数.
参数会被映射为类型参数的上界, 而不是类型参数.

要启用这个功能, 请使用 `-language-version 1.8` 编译器选项.

欢迎你通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-52994) 提供你的反馈意见.

### 对委托属性的更多优化 {id="more-optimized-cases-of-delegated-properties"}

在 Kotlin 1.6.0 中, 我们优化了委托到一个属性的情况, 具体做法是,
省略域变量 `$delegate`, 并 [生成对被引用的属性的直接访问](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance).
在 1.7.20 中, 我们对更多情况实现了这样的优化.
如果委托是以下情况, 现在也会省略域变量 `$delegate`:

* 命名对象:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```
  {validate="false"}

* 同一个模块内, 带有 [后端域变量](properties.md#backing-fields) 和默认 getter 的 final `val` 属性:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 常数表达式, 枚举值(Enum Entry), `this`, 或 `null`. 下面是 `this` 的例子:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...

      val s by this
  }
  ```
  {validate="false"}

详情请参见 [委托属性](delegated-properties.md).

欢迎你通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-23397) 提供你的反馈意见.

### 在 kapt stub 生成 task 中支持 JVM IR 后端 {id="support-for-the-jvm-ir-backend-in-kapt-stub-generating-task"}

> 在 kapt stub 生成 task 中支持 JVM IR 后端是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
>
{style="warning"}

在 1.7.20 以前, kapt stub 生成 task 使用旧的编译器后端,
并且 [kapt](kapt.md) 无法处理 [可重复的注解](annotations.md#repeatable-annotations).
在 Kotlin 1.7.20 中, 我们添加了在 kapt stub 生成 task 中对 [JVM IR 后端](whatsnew15.md#stable-jvm-ir-backend) 的支持.
因此在 kapt 中可以使用 Kotlin 的所有新功能, 包括可重复的注解.

要在 kapt 中使用 IR 后端, 请在你的 `gradle.properties` 文件中添加以下选项:

```none
kapt.use.jvm.ir=true
```

欢迎你通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-49682) 提供你的反馈意见.

## Kotlin/Native

Kotlin 1.7.20 开始默认使用新的 Kotlin/Native 内存管理器, 并提供了选项来定制 `Info.plist` 文件:

* [默认使用新的内存管理器](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [定制 Info.plist 文件](#customizing-the-info-plist-file)

### 默认启用新的 Kotlin/Native 内存管理器 {id="the-new-kotlin-native-memory-manager-enabled-by-default"}

这个发布版中, 改进了新内存管理器的稳定性, 并改善了性能, 因此我们将新内存管理器提升到 [Beta 版](components-stability.md).

以前的内存管理器使得编写并发和异步代码比较复杂, 包括实现 `kotlinx.coroutines` 库时的问题.
这些问题阻碍了 Kotlin Multiplatform Mobile 的应用, 因为同步的限制, 导致在 iOS 和 Android 平台共用 Kotlin 代码会发生问题.
新的内存管理器终于为 [Kotlin Multiplatform Mobile 提升到 Beta 版](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) 铺好了道路.

新的内存管理器还支持编译器缓存, 使得编译时间能够与以前的版本媲美.
关于新内存管理器的更多益处, 请参见我们关于预览版的 [Blog 文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/).
关于更多技术细节, 请参见这篇 [文档](native-memory-manager.md).

#### 配置与设置

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
* 传递编译器选项 `-opt-in=kotlin.native.FreezingIsDeprecated`.

#### 在 Swift/Objective-C 中调用 Kotlin suspending 函数

对于从 Swift 和 Objective-C 的主线程以外的线程调用 Kotlin `suspend` 函数的情况, 新的内存管理器还存在限制,
但你可以使用一个新的 Gradle 选项来解决.

这个限制最初是在原来的内存管理器中引入的, 针对代码将自己的后续代码派发在原来的线程中恢复执行的情况.
如果这个线程没有一个支持的事件循环, 这个任务就永远不会执行, 因此协程永远不会恢复执行.

在某些情况下, 可以不再需要这个限制, 但对所有必要条件的检查很难实现.
由于这个原因, 我们决定在新的内存管理器中继续保留这个限制, 同时引入一个选项, 允许你关闭这个限制.
要关闭它, 请向你的 `gradle.properties` 文件添加以下选项:

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> 如果你使用 `kotlinx.coroutines` 的 `native-mt` 版本, 或采用了相同的 "dispatch to the original thread" 方案的其他库,
> 请不要添加这个选项.
>
{style="warning"}

Kotlin 开发组非常感谢 [Ahmed El-Helw](https://github.com/ahmedre) 实现了这个选项.

#### 留下你的反馈意见

对我们的生态系统来说, 这是一个重大的变更. 如果你能够留下反馈意见, 帮助继续改善它, 我们将会非常感谢.

请在你的项目中试用新的内存管理器, 并 [在我们的问题追踪系统 YouTrack 中留下你的反馈意见](https://youtrack.jetbrains.com/issue/KT-48525).

### 定制 Info.plist 文件 {id="customizing-the-info-plist-file"}

生成框架时, Kotlin/Native 编译器会生成信息属性列表文件, `Info.plist`.
在以前的版本中, 定制这个文件的内容会很麻烦. 从 Kotlin 1.7.20开始, 你可以直接设置以下属性:

| 属性                         | 二进制选项                  |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

要设置这些属性, 请使用对于的二进制选项.
可以指定编译器选项 `-Xbinary=$option=$value`, 或对需要的框架设置 `binaryOption(option, value)` Gradle DSL.

Kotlin 开发组非常感谢 Mads Ager 实现了这个功能.

## Kotlin/JS

Kotlin/JS 有了一些功能增强, 改进了开发者体验, 并提升了性能:

* 由于依赖项装载的性能改进, 在增量构建和完全构建中, Klib 的生成都更加快速了.
* 重新实现了 [对开发阶段二进制文件的增量编译](js-ir-compiler.md#incremental-compilation-for-development-binaries) 功能,
  实现了完全构建时的很大改进, 更快的增量构建, 以及稳定性提升.
* 我们对内嵌对象, 封闭类, 以及构造器中的可选参数, 改进了 `.d.ts` 文件的生成.

## Gradle

Kotlin Gradle plugin 的更新主要是兼容新的 Gradle 功能和最新的 Gradle 版本.

Kotlin 1.7.20 包含的变更是支持 Gradle 7.1.
删除或替换了已废弃的方法和属性, 减少了由 Kotlin Gradle plugin 造成的废弃警告的数量, 而且有助于将来支持 Gradle 8.0.

但是, 存在一些潜在的不兼容的变更, 需要你注意:

### 编译目标的配置

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 现在有一个泛型参数, `SingleTargetExtension<T : KotlinTarget>`.
* `kotlin.targets.fromPreset()` convention 已被废弃.
  作为代替, 你可以继续使用 `kotlin.targets { fromPreset() }` 方案,
  但我们推荐使用更加 [专门的方法来创建编译目标](multiplatform-set-up-targets.md).
* 在 `kotlin.targets { }` 代码段内, 由 Gradle 自动生成的编译目标访问器不再可用.
  请改为使用 `findByName("targetName")` 方法.

  注意, 对 `kotlin.targets` 的情况, 这些访问器仍然可以使用, 比如对 `kotlin.targets.linuxX64`.

### 源代码目录的配置

Kotlin Gradle plugin 对 Java `SourceSet` 组添加了 Kotlin `SourceDirectorySet`, 作为一个 `kotlin` 扩展.
因此可以在 `build.gradle.kts` 文件内, 以类似于对
[Java, Groovy, 和 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl)
的方式来配置源代码目录:

```kotlin
sourceSets {
    main {
        kotlin {
            java.setSrcDirs(listOf("src/java"))
            kotlin.setSrcDirs(listOf("src/kotlin"))
        }
    }
}
```

你不再需要使用已废弃的 Gradle 方式来为 Kotlin 指定源代码目录.

记住, 你还可以使用 `kotlin` 扩展来访问 `KotlinSourceSet`:

```kotlin
kotlin {
    sourceSets {
        main {
            // ...
        }
    }
}
```

### JVM toolchain 配置的新方法

这个发布版提供了一个新的 `jvmToolchain()` 方法, 用来启用 [JVM toolchain 功能](gradle-configure-project.md#gradle-java-toolchains-support).
如果你不需要任何额外的 [配置设定](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html),
比如 `implementation` 或 `vendor`, 你可以通过 Kotlin 扩展使用这个方法:

```kotlin
kotlin {
    jvmToolchain(17)
}
```

这样可以简化 Kotlin 项目的设置过程, 无需添加额外的配置.
在这次的发布版之前, 你只能通过以下方式指定 JDK 版本:

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 标准库

Kotlin 1.7.20 对 `java.nio.file.Path` 类提供了新的 [扩展函数](extensions.md#extension-functions), 可以用来遍历文件树:

* `walk()`
   惰性的(lazily)遍历以指定路径为根的文件树.
* `fileVisitor()`
   可以单独创建一个 `FileVisitor`. `FileVisitor` 定义遍历目录和文件时的行为.
* `visitFileTree(fileVisitor: FileVisitor, ...)`
   接收一个预先定义的 `FileVisitor`, 然后使用 `java.nio.file.Files.walkFileTree()` 来遍历文件树.
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)`
  使用 `builderAction` 创建一个 `FileVisitor`, 然后调用 `visitFileTree(fileVisitor, ...)` 函数.
* `FileVisitResult`
  是 `FileVisitor` 的返回类型, 默认值是 `CONTINUE`, 表示继续文件遍历过程.

> `java.nio.file.Path` 的这些新扩展函数是 [实验性功能](components-stability.md).
> 随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
>
{style="warning"}

下面是使用这些新扩展函数能够实现的一些功能:

* 明确创建一个 `FileVisitor`, 然后使用它:

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // 这里可以实现访问目录时的某些逻辑
          FileVisitResult.CONTINUE
      }

      onVisitFile { file, attributes ->
          // 这里可以实现访问文件时的某些逻辑
          FileVisitResult.CONTINUE
      }
  }

  // 这里可以实现某些逻辑

  projectDirectory.visitFileTree(cleanVisitor)
  ```

* 使用 `builderAction` 创建一个 `FileVisitor`, 然后立即使用它:

  ```kotlin
  projectDirectory.visitFileTree {
      // builderAction 的定义:
      onPreVisitDirectory { directory, attributes ->
          // 这里可以实现访问目录时的某些逻辑
          FileVisitResult.CONTINUE
      }

      onVisitFile { file, attributes ->
          // 这里可以实现访问文件时的某些逻辑
          FileVisitResult.CONTINUE
      }
  }
  ```

* 使用 `walk()` 函数, 遍历以指定的路径为根的文件树:

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ ->
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }

          onVisitFile { file, _ ->
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }

      val rootDirectory = createTempDirectory("Project")

      rootDirectory.resolve("src").let { srcDirectory ->
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }

      rootDirectory.resolve("build").let { buildDirectory ->
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }


      // 使用 walk 函数:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")

      rootDirectory.visitFileTree(cleanVisitor)

      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")
  }
  ```

和其他的实验性 API 一样, 这些新扩展函数需要使用者同意(Opt-in):
`@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi`.
或者, 你可以使用编译器选项: `-opt-in=kotlin.io.path.ExperimentalPathApi`.

对于 [`walk()` 函数](https://youtrack.jetbrains.com/issue/KT-52909) 和
[visit 扩展函数](https://youtrack.jetbrains.com/issue/KT-52910),
我们期待你能通过 YouTrack 提供返回意见.

## 文档更新

从上一次发布之后, Kotlin 文档有了很大的变更:

### 文档的改进和新增

* [基本类型概述](basic-types.md) –
  学习 Kotlin 中使用的基本类型: 数值, Booleans, 字符, 字符串, 数组, 以及无符号整数.
* [Kotlin 开发使用的 IDE](kotlin-ide.md) –
  查看带有官方 Kotlin 支持的 IDE, 以及带有社区支持的 plugin 的工具.

### Kotlin Multiplatform 期刊中的新文章

* [原生(Native)应用程序开发与跨平台(cross-platform)移动应用程序开发: 如何选择?](native-and-cross-platform.md) –
  阅读我们的概述, 以及跨平台(cross-platform)应用程序开发和原生(Native)方案各自的优势.
* [跨平台应用程序开发最流行的 6 种框架](cross-platform-frameworks.md) –
  查看各个框架的关键要素, 帮助你为跨平台项目选择正确的框架.

### 教程的改进和新增

* [Kotlin Multiplatform 入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
  – 学习使用 Kotlin 进行跨平台移动应用程序开发, 并创建一个可以同时运行于 Android 和 iOS 平台的应用程序.
* [使用 React 和 Kotlin/JS 创建 Web 应用程序](js-react.md)
  – 创建一个浏览器应用程序, 学习一个典型的 React 程序中用到的 Kotlin 的 DSL 和功能特性.

### Kotlin 的发布版本文档的变更

我们不再对各个发布版提供推荐的 kotlinx 库列表.
这个列表只包含推荐的版本, 以及 Kotlin 本身测试过的版本.
其中不包括各个库直接的相互依赖, 以及它们需要 kotlinx 的哪个版本, 这些版本可能与推荐的 Kotlin 版本不同.

我们正在寻找方法来提供库之间相互关联相互依赖的信息,
以便于你来判断, 当你升级你的项目的 Kotlin 版本时, 应该使用 kotlinx 库的哪个版本.

## 安装 Kotlin 1.7.20 {id="install-kotlin-1-7-20"}

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3, 2022.1, 和 2022.2
会自动建议将 Kotlin plugin 更新到版本 1.7.20.

> 对于 Android Studio Dolphin (213), Electric Eel (221), 和 Flamingo (222),
> Android Studios 的后续更新会带有 Kotlin plugin 1.7.20.
>
{style="note"}

新的命令行编译器可以通过 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20) 下载.

### Kotlin 1.7.20 的兼容性指南 {id="compatibility-guide-for-kotlin-1-7-20"}

尽管 Kotlin 1.7.20 是一个增量发布版, 但我们仍然不得不进行了一些不兼容的变更, 以解决 Kotlin 1.7.0 中的一些问题.

关于这些不兼容的变更, 详情请参见 [Kotlin 1.7.20 兼容性指南](compatibility-guide-1720.md).
