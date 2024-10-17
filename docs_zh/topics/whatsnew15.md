[//]: # (title: Kotlin 1.5.0 版中的新功能)

_[发布日期: 2021/05/05](releases.md#release-details)_

Kotlin 1.5.0 引入了新的语言功能, 基于 IR 的 JVM 编译器后端的稳定版, 以及性能改善,
以及一些微小变更, 比如实验性功能的稳定版, 以及废弃了一些旧功能.

关于这个版本的变更概要, 也可以查看 [release blog](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/).

## 语言功能

Kotlin 1.5.0 带来了 [1.4.30 中提供预览](whatsnew1430.md#language-features) 的新语言功能的稳定版:
* [支持 JVM 记录类](#jvm-records-support)
* [封闭接口](#sealed-interfaces) 和 [封闭类的改进](#package-wide-sealed-class-hierarchies)
* [内联类(Inline Class)](#inline-classes)

关于这些功能详情, 请参见 [这篇 blog](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/),
以及 Kotlin 文档的对应页面.

### 支持 JVM 记录类 {id="jvm-records-support"}

Java 正在快速演化, 为了让 Kotlin 保持与 Java 的兼容, 我们现在支持它的最新功能之一 – [记录类](https://openjdk.java.net/jeps/395).

Kotlin 对 JVM 记录类的支持包括双向的交互能力:
* 在 Kotlin 代码中, 你可以使用 Java 记录类, 就象使用通常的带属性的类一样.
* 要在 Java 代码中将 Kotlin 类当作记录类来使用, 可以将它声明为 `data` 类, 并标注 `@JvmRecord` 注解.

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

详情请参见 [在 Kotlin 中使用 JVM 记录类](jvm-records.md).

<video src="https://youtu.be/iyEWXyuuseU" title="在 Kotlin 1.5.0 中支持 JVM 记录类"/>

### 封闭接口 {id="sealed-interfaces"}

Kotlin 接口现在可以标注 `sealed` 修饰符, 它对接口的功能与对类相同: 在编译时刻能够确定一个封闭接口的所有实现.

```kotlin
sealed interface Polygon
```

你可以利用这一点来实现很多功能, 比如, 编写穷尽式(exhaustive) `when` 表达式.

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle -> // ...
   is Triangle -> // ...
   // 这里不需要 else 分支 - 上面已经覆盖了所有可能的实现
}

```

此外, 封闭接口可以实现对类层级更加灵活的限制, 因为一个类可以直接继承多个封闭接口.

```kotlin
class FilledRectangle: Polygon, Fillable
```

详情请参见 [封闭接口](sealed-classes.md).

<video src="https://youtu.be/d_Mor21W_60" title="封闭接口与封闭类的改进"/>

### 包范围内的封闭类层级 {id="package-wide-sealed-class-hierarchies"}

封闭类的子类现在可以分布在同一个编译单元的同一个包下的所有文件中.
以前, 所有子类必须出现在同一个文件中.

直接子类可以是顶层类, 或嵌套在任意数量的其他有名称的类, 有名称的接口, 或有名称的对象之内.

一个封闭类的子类必须拥有正确限定的名称 – 不能是局部对象或匿名对象.

详情请参见, [封闭类的层级结构](sealed-classes.md#inheritance).

### 内联类(Inline Class) {id="inline-classes"}

内联类(Inline Class) 是一种 [基于值的类](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md), 这种类只包含值.
你可以将它用做某种类型的值的封装类, 而不会产生内存分配导致的额外的性能开销.

可以在类名称之前添加 `value` 修饰符来声明内联类:

```kotlin
value class Password(val s: String)
```

JVM 后端也需要专门的 `@JvmInline` 注解:

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline` 修饰符现在已废弃, 会出现编译警告.

详情请参见 [内联类](inline-classes.md).

<video src="https://youtu.be/LpqvtgibbsQ" title="内联类变为值类"/>

## Kotlin/JVM {id="kotlin-jvm"}

Kotlin/JVM 也有了很多改进, 包括内部的, 和面向用户的变更. 重要的变更如下:

* [JVM IR 后端的稳定版](#stable-jvm-ir-backend)
* [新的默认 JVM 编译目标: 1.8](#new-default-jvm-target-1-8)
* [使用 invokedynamic 实现 SAM 转换](#sam-adapters-via-invokedynamic)
* [使用 invokedynamic 编译 Lambda 表达式](#lambdas-via-invokedynamic)
* [废弃 @JvmDefault 和旧的 Xjvm-default 模式](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [可否为 null(Nullability) 注解处理的改进](#improvements-to-handling-nullability-annotations)

### JVM IR 后端的稳定版 {id="stable-jvm-ir-backend"}

Kotlin/JVM 编译器的 [基于 IR 的后端](whatsnew14.md#new-jvm-ir-backend) 现在进入 [稳定版](components-stability.md), 并默认启用.

从 [Kotlin 1.4.0](whatsnew14.md) 开始, 可以预览使用基于 IR 的后端的早期版本,
现在对于语言版本 `1.5`, 它成为了默认后端. 对于更早的语言版本, 继续默认使用旧的后端.

关于 IR 后端优点以及它未来的开发, 更多详情请参见 [这篇 blog](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/).

如果你需要在 Kotlin 1.5.0 中使用旧的后端, 可以向项目的配置文件添加以下内容:

* 在 Gradle 中:

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
      kotlinOptions.useOldBackend = true
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
      kotlinOptions.useOldBackend = true
  }
  ```

  </tab>
  </tabs>

* 在 Maven 中:

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-old-backend</arg>
      </args>
  </configuration>
  ```

### 新的默认 JVM 编译目标: 1.8 {id="new-default-jvm-target-1-8"}

Kotlin/JVM 编译的默认目标版本现在是 `1.8`. 目标版本 `1.6` 已被废弃.

如果你需要针对 JVM 1.6 进行构建, 你仍然可以切换到这个目标版本. 具体方法是:

* [在 Gradle 中切换版本](gradle-compiler-options.md#attributes-specific-to-jvm)
* [在 Maven 中切换版本](maven.md#attributes-specific-to-jvm)
* [在命令行编译器中切换版本](compiler-reference.md#jvm-target-version)

### 使用 invokedynamic 实现 SAM 转换 {id="sam-adapters-via-invokedynamic"}

Kotlin 1.5.0 现在使用动态调用 (`invokedynamic`) 来编译 SAM (Single Abstract Method) 转换:
* 如果 SAM 类型 是一个 [Java 接口](java-interop.md#sam-conversions), 可以将任何表达式转换为 SAM
* 如果 SAM 类型是一个 [Kotlin 函数接口](fun-interfaces.md#sam-conversions), 可以将 Lambda 表达式转换为 SAM

新的实现使用 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-),
而且编译期间不再生成辅助的包装类.
这样可以减少应用程序JAR 文件的大小, 改善 JVM 启动时的性能.

要回退到旧的基于匿名类生成的实现方式, 可以添加编译器选项 `-Xsam-conversions=class`.

详情请参见, 如何在 [Gradle](gradle-compiler-options.md), [Maven](maven.md#specify-compiler-options),
以及 [命令行编译器](compiler-reference.md#compiler-options) 中添加编译器选项.

### 使用 invokedynamic 编译 Lambda 表达式 {id="lambdas-via-invokedynamic"}

> 将普通的 Kotlin Lambda 表达式编译为 invokedynamic 是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-45375) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.5.0 引入实验性的功能, 能够将普通的 Kotlin Lambda 表达式 (which are not converted to an instance
of a functional 接口) 编译为动态调用(`invokedynamic`).
这个实现使用
[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-),
它能够在运行期高效的生成需要的类, 因此可以产生更轻量的二进制代码,
目前, 与通常的 Lambda 表达式编译相比, 它存在 3 个限制:

* 编译为 invokedynamic 之后的 Lambda 表达式不能序列化.
* 对这样的 Lambda 表达式调用 `toString()` 会产生比较难以阅读的字符串表达.
* 试验性的 [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API
  不支持使用 `LambdaMetafactory` 创建的 Lambda 表达式.

要试用这个功能, 请添加 `-Xlambdas=indy` 编译器选项.
如果你能够在这个 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-45375) 中提供你的反馈意见, 我们十分感谢.

详情请参见, 如何在 [Gradle](gradle-compiler-options.md), [Maven](maven.md#specify-compiler-options),
以及 [命令行编译器](compiler-reference.md#compiler-options) 中添加编译器选项.

### 废弃 @JvmDefault 和旧的 Xjvm-default 模式 {id="deprecation-of-jvmdefault-and-old-xjvm-default-modes"}

在 Kotlin 1.4.0 之前, 我们支持 `@JvmDefault` 注解以及 `-Xjvm-default=enable` 和 `-Xjvm-default=compatibility` 模式.
它们用来对 Kotlin 接口中的特定的非抽象成员创建 JVM 默认方法.

在 Kotlin 1.4.0 中, 我们 [引入了新的 `Xjvm-default` 模式](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/),
它会对整个项目切换默认方法的生成.

在 Kotlin 1.5.0 中, 我们废弃了 `@JvmDefault` 和旧的 Xjvm-default 模式: `-Xjvm-default=enable` 和 `-Xjvm-default=compatibility`.

详情请参见 [与 Java 交互时的默认方法](java-to-kotlin-interop.md#default-methods-in-interfaces).

### 可否为 null(Nullability) 注解处理的改进 {id="improvements-to-handling-nullability-annotations"}

Kotlin 能够从 Java 代码的 [可否为 null(Nullability) 注解](java-interop.md#nullability-annotations) 得到类型可否为 null(Nullability) 信息.
Kotlin 1.5.0 对这个功能引入了很多改进:

* 对于编译后的 Java 库作为依赖项使用时, 可以读取其中的类型参数上的 nullability 注解.
* 对于以下类型, 支持 target 为 `TYPE_USE` 的 nullability 注解:
  * 数组
  * 可变参数
  * 域(Field)
  * 类型参数和它的类型边界(bound)
  * 基类和接口的类型参数
* 如果一个 nullability 注解拥有适用于一个类型的多个 target, 而且其中之一是 `TYPE_USE`, 那么会优先使用 `TYPE_USE`.
  例如, 如果 `@Nullable` 同时支持 `TYPE_USE` 和 `METHOD` target,
  那么 Java 中的方法签名 `@Nullable String[] f()` 会被识别为 Kotlin 的 `fun f(): Array<String?>!`.

对于这些新支持的情况, 在 Kotlin 中调用 Java 时如果使用错误的类型 nullability, 会导致编译警告.
对这样的情况, 可以使用 `-Xtype-enhancement-improvements-strict-mode` 编译器选项来启用严格模式 (产生编译错误).

详情请参见 [null 值安全性与平台数据类型](java-interop.md#null-safety-and-platform-types).

## Kotlin/Native

Kotlin/Native 有了性能提高, 并更加稳定. 重要的变更包括:
* [性能改善](#performance-improvements)
* [禁用内存泄露检查器](#deactivation-of-the-memory-leak-checker)

### 性能改善 {id="performance-improvements"}

在 1.5.0 中, Kotlin/Native 有了很多性能改善, 提升了编译和执行速度.

对 `linuxX64` (只适用于 Linux 主机) 和 `iosArm64` 编译目标, 在 debug 模式中现在可以支持
[编译器缓存](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native).
启用编译器缓存后, 除第 1 次编译之外, 大多数 debug 编译可以更快完成.
在我们的测试项目中, 测量结果显示速度提高了大约 200%.

要对新的编译目标使用编译器缓存, 需要明确同意, 方法是向项目的 `gradle.properties` 文件添加以下内容:
* 对于 `linuxX64` 编译目标: `kotlin.native.cacheKind.linuxX64=static`
* 对于 `iosArm64` 编译目标: `kotlin.native.cacheKind.iosArm64=static`

如果你在启用编译器缓存之后遇到任何问题, 请到我们的 [问题追踪系统](https://kotl.in/issue) 中报告.

还有其他改进, 提升了 Kotlin/Native 代码的执行速度:
* Trivial 属性访问器变成了内联模式.
* 字符串字面值的 `trimIndent()` 会在编译期间计算其结果.

### 禁用内存泄露检查器 {id="deactivation-of-the-memory-leak-checker"}

内建的 Kotlin/Native 内存泄露检查器默认被禁用.

这个检查器原来计划供内部使用, 它只能发现少数情况下的内存泄露, 而不是所有情况.
而且后来发现存在问题, 可能导致应用程序崩溃. 因此我们决定关闭这个内存泄露检查器.

内存泄露检查器对某些情况仍然是有用的, 例如, 单元测试. 对这样的情况, 你可以添加以下代码来启用它:

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

注意, 不推荐对运行期的应用程序启用这个检查器.

## Kotlin/JS

Kotlin/JS 在 1.5.0 中有了一些演进变更. 我们正在继续开发 [JS IR 编译器后端](js-ir-compiler.md)
的稳定版, 并发布了以下更新:

* [更新到 webpack 版本 5](#upgrade-to-webpack-5)
* [针对 IR 编译器的框架和库](#frameworks-and-libraries-for-the-ir-compiler)

### 更新到 webpack 5 {id="upgrade-to-webpack-5"}

Kotlin/JS Gradle plugin 现在对浏览器编译目标使用 webpack 5 而不是以前的 webpack 4.
这是 webpack 的一个大版本更新, 因此带来了一些不兼容的变更.
如果你在使用自定义 webpack 配置, 请查看 [webpack 5 发布公告](https://webpack.js.org/blog/2020-10-10-webpack-5-release/).

详情请参见 [使用 webpack 构建 Kotlin/JS 项目](js-project-setup.md#webpack-bundling).

### 针对 IR 编译器的框架和库 {id="frameworks-and-libraries-for-the-ir-compiler"}

> Kotlin/JS IR 编译器现在是 [Alpha](components-stability.md) 版.
> 它将来可能发生不兼容的变更, 并需要手动迁移.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

在开发 Kotlin/JS 编译器基于 IR 的后端的同时, 我们鼓励并帮助库作者以 `both` 模式构建他们的项目.
这样可以产生适用于两种 Kotlin/JS 编译器的 artifact, 为新编译器扩大生态环境.

很多广为人知的框架和库已经可以在 IR 后端中使用了: [KVision](https://kvision.io/), [fritz2](https://www.fritz2.dev/),
[doodle](https://github.com/nacular/doodle), 等等.
如果你在你的项目中使用这些框架和库, 你可以使用 IR 后端来构建你的项目, 看看它带来的益处.

如果你在编写自己的库, [使用 'both' 模式编译它](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility),
这样你的客户也可以在新的编译器中使用你的库.


## Kotlin Multiplatform

在 Kotlin 1.5.0 中, [对每个平台选择测试依赖项的工作得到了简化](#simplified-test-dependencies-usage-in-multiplatform-projects),
现在可以由 Gradle plugin 自动完成.

在跨平台项目中现在可以 [使用新的 API 来得到字符种类](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code).

## 标准库

标准库有了很多变更和改进, 有些实验性功能已经变为稳定版, 还添加了新的功能:

* [无符号整数类型已成为稳定版](#stable-unsigned-integer-types)
* [用于文字大小写变换的 locale 无关 API 已成为稳定版](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [字符到整数编码的转换 API 已成为稳定版](#stable-char-to-integer-conversion-api)
* [Path API 已成为稳定版](#stable-path-api)
* [向下取整除法(floored division) 与 mod 操作符](#floored-division-and-the-mod-operator)
* [时间长度 API 的变更](#duration-api-changes)
* [在跨平台代码中可以使用新的 API 来得到字符种类](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新的集合函数 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean() 的严格版本](#strict-version-of-string-toboolean)

关于标准库的变更, 详情请参见 [这篇 blog](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released).

<video src="https://youtu.be/MyTkiT2I6-8" title="标准库中的新功能"/>

### 无符号整数类型已成为稳定版 {id="stable-unsigned-integer-types"}

无符号整数类型 `UInt`, `ULong`, `UByte`, `UShort` 现在已成为 [稳定版](components-stability.md).
对这些类型的操作, 以及这些类型的范围(range), 数列(progression) 也是如此.
无符号数组及其操作还处于 Beta 版.

详情请参见 [无符号整数类型](unsigned-integer-types.md).

### 用于文字大小写变换的 locale 无关 API 已成为稳定版 {id="stable-locale-agnostic-api-for-upper-lowercasing-text"}

这次的发布带来一个新的 locale 无关 API, 用于文字的大小写变换.
它可以替代 `toLowerCase()`, `toUpperCase()`, `capitalize()`, 和 `decapitalize()` API 函数,
这些既有的函数是与 locale 相关的.
新 API 可以帮助你避免由于不同的 locale 设定带来的错误.

Kotlin 1.5.0 提供了以下完全 [稳定版](components-stability.md) 的替代:

* 对于 `String` 函数:

  | **以前的版本**                |**1.5.0 版的替代**|
-------------------------| --- | --- |
  | `String.toUpperCase()`  |`String.uppercase()`|
  | `String.toLowerCase()`  |`String.lowercase()`|
  | `String.capitalize()`   |`String.replaceFirstChar { it.uppercase() }`|
  | `String.decapitalize()` |`String.replaceFirstChar { it.lowercase() }`|

* 对于 `Char` 函数:

  |**以前的版本**|**1.5.0 版的替代**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 对于 Kotlin/JVM, 也有 `uppercase()`, `lowercase()`, 和 `titlecase()` 函数的覆盖版, 可以明确指定 `Locale` 参数.
>
{style="note"}

旧的 API 函数已经标注为已废弃, 会在未来的发布版中删除.

关于文本处理函数的完整的变更列表, 请参见
[KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions.md).

### 字符到整数编码的转换 API 已成为稳定版 {id="stable-char-to-integer-conversion-api"}

从 Kotlin 1.5.0 开始, 新的 "字符到编码" 和 "字符到数字" 转换函数已成为 [稳定版](components-stability.md).
这些函数替代目前的 API 函数, 旧函数经常会与类似的 "字符串到整数" 转换混淆.

新的 API 去掉了函数名中的混乱, 使得代码的行为更加清晰明确.

这个发布版引入了 `Char` 转换, 分为以下几组清晰命名的函数:

* 得到 `Char` 的整数代码, 以及将指定的代码转换到 `Char`:

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* 将 `Char` 转换为它的数字对应的整数值:

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* `Int` 的扩展函数, 将它表达的非负的单个数字转换为对应的 `Char` 表达:

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

旧的转换 API, 包括 `Number.toChar()` 及其实现 (`Int.toChar()` 除外),
以及 `Char` 转换到数值类型的扩展函数, 比如 `Char.toInt()`, 现在都已废弃.

关于字符到整数的转换 API, 详情请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md).

### Path API 已成为稳定版 {id="stable-path-api"}

[实验性的 Path API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/),
以及对 `java.nio.file.Path` 的扩展, 现在已成为 [稳定版](components-stability.md).

```kotlin
// 使用除 (/) 操作符构造路径
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// 列出一个目录中的文件
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

详情请参见 [Path API](whatsnew1420.md#extensions-for-java-nio-file-path).

### 向下取整除法(floored division) 与 mod 操作符 {id="floored-division-and-the-mod-operator"}

标准库添加了新的模运算操作:
* `floorDiv()` 返回 [向下取整除法(floored division)](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions) 结果.
  这个函数可用于整数类型.
* `mod()` 返回向下取整除法(floored division) 的余数 (_模数(modulus)_).
  这个函数可用于所有数值类型.

这些操作看起来与既有的
[整数除法](numbers.md#operations-on-numbers) and [rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)
函数 (或 `%` 操作符) 非常类似,
但它们对于负数的处理不同:
* `a.floorDiv(b)` 与通常的 `/` 不同, `floorDiv` 将结果向下(向更小的整数方向)取整,
  而 `/` 将结果截断, 得到更接近 0 的整数.
* `a.mod(b)` 是 `a` 和 `a.floorDiv(b) * b` 之间的差. 它要么是 0, 要么与 `b` 的正负号相同,
  而 `a % b` 可能得到不同的正负号.

```kotlin
fun main() {
//sampleStart
    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")

    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 时间长度 API 的变更 {id="duration-api-changes"}

> 时间长度 API 是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

Kotlin 中有一个实验性的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类,
表达不同单位的时间长度.
在 1.5.0 中, Duration API 有了以下变更:

* 内部的值表达现在使用 `Long` 而不是 `Double`, 以提供更好的精度.
* 有了新的 API 用于转换到指定的时间单位, 结果类型为 `Long`. 新 API 会替代旧 API, 旧 API 使用 `Double` 值, 现在已废弃.
  例如, 新 API [`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html)
  返回 `Long` 表达的时间长度值, 替代了旧的 API `Duration.inMinutes`.
* 有了新的伴随函数, 用于从一个数值构造 `Duration`.
  例如, [`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)
  创建一个 `Duration` 对象, 表示整数值的秒.
  旧的扩展属性, 比如 `Int.seconds` 现在已废弃.


```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")
//sampleEnd
}
```
{validate="false"}

### 在跨平台代码中可以使用新的 API 来得到字符种类 {id="new-api-for-getting-a-char-category-now-available-in-multiplatform-code"}

Kotlin 1.5.0 引入了新的 API , 可以在跨平台项目中得到字符在 Unicode 中的种类(category).
这些函数现在可以在所有平台和共通代码中使用.

检查字符是字母还是数字的函数:
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

检查字符大小写的函数:
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

其他函数:
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

属性 [`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html)
以及它的返回类型 enum 类 [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/),
现在也可以在跨平台项目中使用了,
其中 `CharCategory` 表示一个字符在 Unicode 中的一般种类.

详情请参见 [字符](characters.md).

### 新的集合函数 firstNotNullOf() {id="new-collections-function-firstnotnullof"}

新的 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)
和 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
函数,
组合了 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)
和 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
或 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html).
它们使用自定义的选择函数来对原来的集合进行变换, 并返回第 1 个非 null 的值.
如果不存在非 null 的值, `firstNotNullOf()` 会抛出异常, `firstNotNullOfOrNull()` 会返回 null.

```kotlin
fun main() {
//sampleStart
    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### String?.toBoolean() 的严格版本 {id="strict-version-of-string-toboolean"}

相对于原有的 [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html),
有 2 个新函数引入了大小写相关的严格版本:
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html)
  除字符串 `true` 和 `false` 之外, 对所有其他输入抛出异常.
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html)
  除字符串 `true` 和 `false` 之外, 对所有其他输入返回 null.

```kotlin
fun main() {
//sampleStart
    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // 这里会抛出 Exception
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## kotlin-test 库
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) 库引入了一些新功能:
* [简化测试依赖项在跨平台项目中的使用](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [对 Kotlin/JVM 源代码集自动选择测试框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [断言函数的更新](#assertion-function-updates)

### 简化测试依赖项在跨平台项目中的使用 {id="simplified-test-dependencies-usage-in-multiplatform-projects"}

现在你可以使用 `kotlin-test` 依赖项, 对 `commonTest` 源代码集中的测试代码添加依赖项,
Gradle plugin 会对每个测试源代码集推断出对应的平台依赖项:
* 对 JVM 源代码集使用 `kotlin-test-junit`, 参见 [对 Kotlin/JVM 源代码集自动选择测试框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* 对 Kotlin/JS 源代码集使用 `kotlin-test-js`
* 对共通源代码集使用 `kotlin-test-common` 和 `kotlin-test-annotations-common`
* 对 Kotlin/Native 源代码集不会添加额外的依赖项

此外, 你还可以在任何共享的或平台相关的源代码集中, 使用 `kotlin-test` 依赖项.

既有的, 带有明确指定依赖项的 kotlin-test 设置, 在 Gradle 中和在 Maven 中都可以继续使用.

详情请参见 [设置测试库的依赖项](gradle-configure-project.md#set-dependencies-on-test-libraries).

### 对 Kotlin/JVM 源代码集自动选择测试框架 {id="automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets"}

Gradle plugin 现在会自动选择并添加测试框架的依赖项. 你只需要在共通源代码集中添加依赖项 `kotlin-test`.

Gradle 默认使用 JUnit 4. 因此, `kotlin("test")` 依赖项会解析为 JUnit 4 变体, 名为 `kotlin-test-junit`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // 这个设置会导致对 JUnit 4 的传递依赖
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 这个设置会导致对 JUnit 4 的传递依赖
            }
        }
    }
}
```

</tab>
</tabs>

你可以在 test task 中调用
[`useJUnitPlatform()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
或 [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG)
来选择 JUnit 5 或 TestNG:

```groovy
tasks {
    test {
        // 使用 TestNG
        useTestNG()
        // 或
        // 使用 JUnit Platform (a.k.a. JUnit 5)
        useJUnitPlatform()
    }
}
```

你可以向项目的 `gradle.properties` 添加 `kotlin.test.infer.jvm.variant=false`, 来禁用测试框架的自动选择.

详情请参见 [设置测试库的依赖项](gradle-configure-project.md#set-dependencies-on-test-libraries).

### 断言函数的更新 {id="assertion-function-updates"}

这个发布版带来了新的断言函数, 并改进了既有的函数.

`kotlin-test` 库现在包含以下功能:

* **检查一个值的类型**

  你可以使用新的 `assertIs<T>` 和 `assertIsNot<T>` 来检查一个值的类型:

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // 如果断言失败会抛出 AssertionError, 错误信息包含 s 的实际类型
      // 可以现在打印 s.length, 因为在 assertIs 中已经判断了 s 的类型是字符串
      println("${s.length}")
  }
  ```

  由于类型擦除, 在以下示例中, 这个断言函数只能检查 `value` 是不是 `List` 类型,
  但不能检查它是不是具体的 `String` 元素类型构成的 List:
     `assertIs<List<String>>(value)`.

* **对数组, 序列(Sequence), 以及任意的 iterable, 比较容器内容**

  对 `assertContentEquals()` 函数, 有了一组新的覆盖版本, 对没有实现 [结构相等](equality.md#structural-equality) 的各种集合, 可以比较其内容:

  ```kotlin
  @Test
  fun test() {
      val expectedArray = arrayOf(1, 2, 3)
      val actualArray = Array(3) { it + 1 }
      assertContentEquals(expectedArray, actualArray)
  }
  ```

* **对于 `Double` 和 `Float` 数值, `assertEquals()` 和 `assertNotEquals()` 函数有了新的覆盖版本**

  对 `assertEquals()` 函数, 有了新的覆盖版本, 可以使用绝对精度比较 2 个 `Double` 或 `Float` 数值.
  精度值通过比较函数的第 3 个参数指定:

  ```kotlin
   @Test
  fun test() {
      val x = sin(PI)

      // 精度参数
      val tolerance = 0.000001

      assertEquals(0.0, x, tolerance)
  }
  ```

* **检查集合和元素内容的新函数**

  你现在可以使用 `assertContains()` 函数来检查集合或元素是否包含某个内容.
  这个函数可以用于拥有 `contains()` 操作符的 Kotlin 集合和元素, 比如 `IntRange`, `String`, 等等:

  ```kotlin
  @Test
  fun test() {
      val sampleList = listOf<String>("sample", "sample2")
      val sampleString = "sample"
      assertContains(sampleList, sampleString)  // 元素在集合中存在
      assertContains(sampleString, "amp")       // 子字符串在字符串中存在
  }
  ```

* **`assertTrue()`, `assertFalse()`, `expect()` 函数现在成为内联函数**

  从现在开始, 你可以将这些函数作为内联函数来使用, 因此可以在 Lambda 表达式之内调用 [挂起函数](composing-suspending-functions.md):

  ```kotlin
  @Test
  fun test() = runBlocking<Unit> {
      val deferred = async { "Kotlin is nice" }
      assertTrue("Kotlin substring should be present") {
          deferred.await().contains("Kotlin")
      }
  }
  ```

## kotlinx 库

和 Kotlin 1.5.0 一起, 我们还发布了 kotlinx 库的新版本:
* `kotlinx.coroutines` [1.5.0-RC](#coroutines-1-5-0-rc)
* `kotlinx.serialization` [1.2.1](#serialization-1-2-1)
* `kotlinx-datetime` [0.2.0](#datetime-0-2-0)

### Coroutines 1.5.0-RC

`kotlinx.coroutines` [1.5.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC) 的新功能包括:
* [新的通道(Channel) API](channels.md)
* [与 reactive 集成](async-programming.md#reactive-extensions)的稳定版
* 其他

从 Kotlin 1.5.0 开始, 禁用了 [实验性协程](whatsnew14.md#exclusion-of-the-deprecated-experimental-coroutines),
并且不再支持 `-Xcoroutines=experimental` 标记.

详情请参见 [changelog](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)
以及
[`kotlinx.coroutines` 1.5.0 release blog](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/).

<video src="https://youtu.be/EVLnWOcR0is" title="kotlinx.coroutines 1.5.0"/>

### serialization 1.2.1

`kotlinx.serialization` [1.2.1](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1) 的新功能包括:
* JSON 序列化的性能改善
* 在 JSON 序列化中支持多名称
* 实验性功能: 从 `@Serializable` 类生成 .proto schema
* 其他

详情请参见 [changelog](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)
以及
[`kotlinx.serialization` 1.2.1 release blog](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-serialization-1-2-released/).

<video src="https://youtu.be/698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

### dateTime 0.2.0

`kotlinx-datetime` [0.2.0](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0) 的新功能包括:
* `@Serializable` Datetime 对象
* `DateTimePeriod` 和 `DatePeriod` 的规范化 API
* 其他

详情请参见 [changelog](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)
以及
[`kotlinx-datetime` 0.2.0 release blog](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-datetime-0-2-0-is-out/).

## 迁移到 Kotlin 1.5.0

当 Kotlin plugin 1.5.0 可用之后, IntelliJ IDEA 和 Android Studio 会建议你更新这个版本.

要将既有的项目迁移到 Kotlin 1.5.0, 只需要修改 Kotlin 版本到 `1.5.0`, 然后重新导入你的 Gradle 或 Maven 项目.
详情请参见 [如何更新到 Kotlin 1.5.0](releases.md#update-to-a-new-release).

要使用 Kotlin 1.5.0 创建新项目, 请更新 Kotlin plugin, 并通过菜单 **File** | **New** | **Project** 运行项目向导.

新的命令行编译器可以通过 [GitHub release 页面](https://github.com/JetBrains/kotlin/releases/tag/v1.5.0) 下载.

Kotlin 1.5.0 是一个 [功能发布版](kotlin-evolution.md#feature-releases-and-incremental-releases),
因此可能在语言层带来不兼容的变更.
关于这些变更的完整列表, 请参见 [Kotlin 1.5 兼容性指南](compatibility-guide-15.md).
