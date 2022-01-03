---
type: doc
layout: reference
category:
title: "Kotlin 1.4.30 版中的新功能"
---

# Kotlin 1.4.30 版中的新功能

本页面最终更新: 2021/02/03

_[发布日期: 2021/02/03](releases.html#release-details)_

Kotlin 1.4.30 提供了新的语言功能的预览版, 将 Kotlin/JVM 编译器的新的 IR 后端升级到 Beta,
并带来了很多性能和功能的改进.

关于这个版本的变更概要, 可以查看 [这篇 blog](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/).

## 语言功能

Kotlin 1.5.0 将会发布一些新的语言功能 – 支持 JVM 记录类(Record), 封闭接口(Sealed Interface), 以及内联类(Inline Class)的稳定版.
在 Kotlin 1.4.30 中, 你可以通过预览模式试用这些新功能和新改进.
如果你能够在相应的 YouTrack ticket 中提供你的反馈意见, 我们将会非常感谢, 你的反馈能够帮助我们在 1.5.0 正式发布之前解决这些问题.

* [支持 JVM 记录类(Record)](#jvm-records-support)
* [封闭接口(Sealed Interface)](#sealed-interfaces) 和 [封闭类(Sealed Class)的改进](#package-wide-sealed-class-hierarchies)
* [内联类(Inline Class)的改进](#improved-inline-classes)

要通过预览模式启用这些新功能和新改进, 你需要添加特定的编译器选项, 来表示你明确同意使用.
详情请阅读下面的章节.

关于新功能预览, 详情请参见 [这篇 blog](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30).

### 支持 JVM 记录类(Record)

> JVM 记录类(Record)功能是 [试验性功能](components-stability.html). 它随时有可能变更或被删除.
> 需要明确同意使用(Opt-in)(详情请参见下文), 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-42430) 提供你的反馈意见.
{:.warning}

[JDK 16 版](https://openjdk.java.net/projects/jdk/16/) 中计划稳定新类型的 Java 类, 名为 [Record](https://openjdk.java.net/jeps/395).
为了充分利用 Kotlin 的功能, 并保证与 Java 的交互能力, Kotlin 会增加对记录类的支持(试验性功能).

你可以在 Kotlin 中使用 Java 中声明的记录类, 就和其他有属性的类一样.
不需要其他任何步骤.

从 1.4.30 开始, 你可以在 Kotlin 中对一个 [数据类](data-classes.html) 使用 `@JvmRecord` 注解, 来声明记录类:

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

要试用 JVM 记录类功能的预览版, 请添加编译器选项 `-Xjvm-enable-preview` 和 `-language-version 1.5`.

我们还在继续完善这个功能, 如果你能通过这个 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42430) 提供你的反馈意见,
我们会非常感谢.

关于这个功能的具体实现, 限制, 以及语法, 请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md).

### 封闭接口(Sealed Interface)

> 封闭接口(Sealed Interface)是 [试验性功能](components-stability.html). 它随时有可能变更或被删除.
> 需要明确同意使用(Opt-in)(详情请参见下文), 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-42433) 提供你的反馈意见.
{:.warning}

在 Kotlin 1.4.30 中, 我们发布了 _封闭接口(Sealed Interface)_ 的原型.
这个功能是对封闭类的补充, 可以用来构建更加灵活的类层级关系约束.

封闭接口可以用作 “internal” 接口, 不能在同一个模块之外实现.
你可以利用这一点来实现很多功能, 比如, 编写穷尽式(exhaustive) `when` 表达式.

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() 语句是穷尽式(exhaustive)的: 这个模块编译完成后, 不可能再出现其它的 polygon 实现
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

另一种使用场景是: 使用封闭接口, 你可以从两个或多个封闭的超类继承一个类.

```kotlin
sealed interface Fillable {
   fun fill()
}
sealed interface Polygon {
   val vertices: List<Point>
}

class Rectangle(override val vertices: List<Point>): Fillable, Polygon {
   override fun fill() { /*...*/ }
}
```

要试用封闭接口的预览版, 请添加编译器选项 `-language-version 1.5`.
切换到这个版本之后, 你就可以对接口使用 `sealed` 修饰符了.
如果你能通过这个 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42433) 提供你的反馈意见, 我们会非常感谢.

更多详情请参见 [封闭接口(Sealed Interface)](sealed-classes.html).

### 包范围内的封闭类(Sealed Class)层级结构

> 包范围内的封闭类(Sealed Class)层级结构是 [试验性功能](components-stability.html). 它随时有可能变更或被删除.
> 需要明确同意使用(Opt-in)(详情请参见下文), 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 提供你的反馈意见.
{:.warning}

封闭类(Sealed Class)现在可以组成更加灵活的层级结构. 子类可以存在于同一个编译单元同一个包的所有源代码文件中.
在以前的版本中, 所有子类必须存在于同一个源代码文件中.

直接子类可以是顶层类, 也可以内嵌在任意数量的其他命名类, 命名接口, 或命名对象之内.
封闭类的子类必须拥有适当的限定名称 – 不能是局部类, 也不能是匿名对象.

要试用包范围内的封闭类层级结构功能, 请添加编译器选项 `-language-version 1.5`.
如果你能通过这个 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42433) 提供你的反馈意见, 我们会非常感谢.

更多详情请参见 [包范围内的封闭类(Sealed Class)层级结构](sealed-classes.html#location-of-direct-subclasses).

### 内联类(Inline Class)的改进

> 内联的数据类目前是 [Beta 版](components-stability.html).
> 已经基本稳定, 但未来可能需要执行一些迁移工作. 我们会尽量减少需要你进行的代码变更工作. 
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-42434) 提供你的反馈意见.
{:.warning}

Kotlin 1.4.30 将 [内联类(Inline Class)](inline-classes.html) 升级到 [Beta 版](components-stability.html),
并带来以下功能和改进:

* 由于内联类是 [基于值的](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html),
  因此你可以使用 `value` 修饰符来定义内联类. `inline` 和 `value` 修饰符现在是相互等价的.
  在未来的 Kotlin 版本中, 我们计划废弃 `inline` 修饰符.

  从现在开始, 对于 JVM 后端, Kotlin 要求在类的声明之前添加 `@JvmInline` 注解:
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // 对于 JVM 后端
  @JvmInline
  value class Name(private val s: String)
  ```

* 内联类可以拥有 `init` 代码段. 你可以添加需要在类实例创建之后立即执行的代码:
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* 在 Java 代码中使用内联类调用函数: 在 Kotlin 1.4.30 之前, 由于代码混淆(mangle), 你不能从 Java 代码中调用接受内联类参数的函数.
  从现在开始, 你可以手动关闭代码混淆. 要从 Java 代码调用这样的函数, 你需要在函数声明前添加 `@JvmName` 注解:

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* 在这个发布版中, 我们修改了对函数的代码混淆机制, 以便修正一些不正确的行为. 这些变更会导致 ABI 变化.

  从 1.4.30 开始, Kotlin 编译器默认使用新的代码混淆机制. 可以使用 `-Xuse-14-inline-classes-mangling-scheme`
  编译器便器 来强制编译器使用使用旧的 1.4.0 代码混淆机制, 以保证二进制兼容性.

Kotlin 1.4.30 将内联类升级为 Beta 版, 我们计划在未来的发布版中将它升级为稳定版.
如果你能通过这个 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-42434) 提供你的反馈意见, 我们会非常感谢.

要试用内联类的预览版, 请添加编译器选项 `-Xinline-classes` 或 `-language-version 1.5`.

关于代码混淆算法, 更多详情请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md).

更多详情请参见 [内联类](inline-classes.html).

## Kotlin/JVM

### JVM IR 编译器后端升级为 Beta 版

Kotlin/JVM 的 [基于 IR 的编译器后端](whatsnew14.html#unified-backends-and-extensibility),
在 1.4.0 版引入时是 [Alpha 版](components-stability.html), 现在升级为 Beta 版.
这是稳定版之前的最后一个测试版, 稳定版发布后, Kotlin/JVM 编译器会默认使用 IR 后端.

我们现在会去掉使用 IR 编译器产生的二进制文件的限制. 以前的版本中, 你必须启用新的后端, 然后才能使用新的 JVM IR 后端编译的代码.
从 1.4.30 开始, 不再存在这样的限制, 因此你可以使用新的后端来构建供第三方使用的组件, 比如库.
请试用新后端的 Beta 版本, 并通过我们的 [issue tracker](https://kotl.in/issue) 提供你的反馈意见.

要启用新的 JVM IR 后端, 请向项目的构建脚本添加以下设置:
* Gradle:
  <div class="multi-language-sample" data-lang="kotlin">
  <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

  ```kotlin
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
    kotlinOptions.useIR = true
  }
  ```
  
  </div>
  </div>
  
  <div class="multi-language-sample" data-lang="groovy">
  <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
    kotlinOptions.useIR = true
  }
  ```
  
  </div>
  </div>

* Maven:

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

关于 JVM IR 后端的变更, 更多详情请参见 [这篇 blog](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together).

## Kotlin/Native

### 性能改善

在 1.4.30 中, Kotlin/Native 有了很多性能改善, 使得编译速度更加提升.
比如, 在 [KMM 网络和数据存储示例项目](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 中,
重新构建框架所需要的时间从 9.5 秒 (1.4.10 版) 减少到了 4.5 秒 (1.4.30 版).

### Apple watchOS 64-bit 模拟器编译目标

从 watchOS 版本 7.0 开始, x86 模拟器编译目标已被废弃.
为与 watchOS 的最新版本保持一致, Kotlin/Native 增加了新的编译目标 `watchosX64` , 用于在 64-bit 架构运行模拟器.

### 支持 Xcode 12.2 库

我们增加了对随 Xcode 12.2 发布的新的库的支持. 你现在可以在 Kotlin 代码中使用这些库了.

## Kotlin/JS

### 顶级属性(top-level property)的延迟初始化(Lazy initialization)

> 顶级属性(top-level property)的延迟初始化(Lazy initialization)是 [试验性功能](components-stability.html). 它随时有可能变更或被删除.
> 需要明确同意使用(Opt-in)(详情请参见下文), 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-44320) 提供你的反馈意见.
{:.warning}

Kotlin/JS 的 [IR 后端](js/js-ir-compiler.html) 有了顶级属性(top-level property)的延迟初始化(Lazy initialization)功能的原型实现.
这个功能可以在应用程序启动时减少需要初始化的顶级属性, 可以显著改善应用程序的启动时间.

我们会继续改进延迟初始化功能, 我们希望你试用目前的原型实现,
并通过这个 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-44320)
或官方 [Kotlin Slack](https://kotlinlang.slack.com) (请在 [这里](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 得到邀请)
的 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道,
反馈你的想法和试用结果.

要使用延迟初始化功能, 请在使用 JS IR 编译器编译代码时添加 `-Xir-property-lazy-initialization` 编译器选项.

## Gradle 项目的改进

### 支持 Gradle 配置缓存

从 1.4.30 开始, Kotlin Gradle plugin 支持 [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)
功能. 这个功能会提高构建过程的速度: 一旦你执行命令, Gradle 会执行配置过程, 并计算任务图(task graph).
Gradle 会缓存计算结果, 并在以后的构建中重用这些结果.

要启用这个功能, 你可以 [使用 Gradle 命令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
或 [设置 IntelliJ based IDE]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij).

## 标准库

### 针对大写/小写文字的 Locale 无关 API 

> Locale 无关 API 功能是 [试验性功能](components-stability.html). 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-42437) 提供你的反馈意见.
{:.warning}

本次发布版增加了改变字符串和字符大小写的 Locale 无关 API (实验性功能).
现在的 `toLowerCase()`, `toUpperCase()`, `capitalize()`, `decapitalize()` API 函数是与 Locale 相关的.
也就是说, 不同的平台 Locale 设置可能影响代码的行为.
比如, 在 Turkish locale 中, 使用 `toUpperCase` 来转换字符串 “kotlin”, 结果会是 "KOTLİN", 而不是 "KOTLIN".

```kotlin
// 使用现在的 API
println("Needs to be capitalized".toUpperCase()) // 结果是: NEEDS TO BE CAPITALIZED

// 使用新 API
println("Needs to be capitalized".uppercase()) // 结果是: NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 提供了以下替代函数:

* 对 `String` 函数:
  
  | **以前的版本**                |**1.4.30 的替代函数**| 
-------------------------| --- | --- |
  | `String.toUpperCase()`  |`String.uppercase()`|
  | `String.toLowerCase()`  |`String.lowercase()`|
  | `String.capitalize()`   |`String.replaceFirstChar { it.uppercase() }`|
  | `String.decapitalize()` |`String.replaceFirstChar { it.lowercase() }`|

* `Char` 函数:

  |**以前的版本**|**1.4.30 的替代函数**| 
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 对于 Kotlin/JVM 平台, 还有明确使用 `Locale` 参数的 overload 版本的 `uppercase()`, `lowercase()`, 和 `titlecase()` 函数 
{:.note}

关于文字处理函数的所有变更, 请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md).

### 明确的 "字符到代码" 和 "字符到数值" 转换

> 意义明确的 `Char` 转换 API 是 [试验性功能](components-stability.html). 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-44333) 提供你的反馈意见.
{:.warning}

目前的 `Char` 到数值的转换函数, 返回不同数值类型表达的 UTF-16 代码,
经常会与类似的字符串到整数值的转换混淆, 后一种转换会返回字符串表示的数值:

```kotlin
"4".toInt() // 返回 4
'4'.toInt() // 返回 52
// 而且没有共通函数可以对字符 '4' 返回数值 4 
```

为了避免这样的混淆, 我们决定将 `Char` 转换分离为以下两组名称更加清晰的函数:

* 第一组的函数, 用于得到 `Char` 的整数代码, 以及通过指定的代码构建 `Char`:
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* 第二组的函数, 将 `Char` 转换为它所表达的数字的整数值:

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* `Int` 的一个扩展函数, 可以将整数表达的单个非负数字, 转换为对应的 `Char` 表达:

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

更多详情请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md).

## 序列化库的更新

随 Kotlin 1.4.30 一起, 我们还发布了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC),
其中包含一些新功能:

* 支持内联类的序列化
* 支持无符号基本类型(Unsigned Primitive Type)的序列化

### 支持内联类的序列化

从 Kotlin 1.4.30 开始, 你可以让内联类 [可序列化](serialization.html):

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 这个功能需要新的 1.4.30 IR 编译器.
{:.note}

当可序列化内联类被用在另一个可序列化类之内时, 序列化框架不会对可序列化内联类装箱.

更多详情请参见 `kotlinx.serialization` 的 [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes).

### 支持无符号基本类型(Unsigned Primitive Type)的序列化

从 1.4.30 开始, 你可以对无符号基本类型(Unsigned Primitive Type): `UInt`, `ULong`, `UByte`, 和 `UShort`,
使用
[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
的标准的 JSON 序列化器:

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

更多详情请参见 `kotlinx.serialization` 的 [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only).
