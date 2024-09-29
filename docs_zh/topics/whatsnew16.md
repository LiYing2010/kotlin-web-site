[//]: # (title: Kotlin 1.6.0 版中的新功能)

最终更新: %latestDocDate%

_[发布日期: 2021/11/16](releases.md#release-details)_

Kotlin 1.6.0 引入了新的语言功能, 优化并改进了现有的功能, 并对 Kotlin 标准库进行了大量的改进.

关于这个版本的变更概要, 也可以查看 [release blog](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/).

## 语言

在以前的 1.5.30 版中引入的一些语言功能的预览版, 在 Kotlin 1.6.0 中已变为稳定版:
* [对 enum, 封闭类 和 Boolean 值的穷尽式(exhaustive) when 语句 (稳定版)](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [挂起函数用作超类型 (稳定版)](#stable-suspending-functions-as-supertypes)
* [挂起转换 (稳定版)](#stable-suspend-conversions)
* [注解类的实例化 (稳定版)](#stable-instantiation-of-annotation-classes)

此外还包括类型推断的各种改进, 并对类的类型参数支持注解:
* [改进了对递归泛型类型的类型推断](#improved-type-inference-for-recursive-generic-types)
* [对构建器推断的变更](#changes-to-builder-inference)
* [对类的类型参数支持注解](#support-for-annotations-on-class-type-parameters)

### 对 enum, 封闭类 和 Boolean 值的穷尽式(exhaustive) when 语句 (稳定版) {id="stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects"}

_穷尽式(exhaustive)_ [`when`](control-flow.md#when-expression) 语句
对它的参数的所有可能的类型或值, 都包含对应的分支, 或者对于某些类型还存在一个 `else` 分支.
它可以覆盖所有可能的情况, 使你的代码更加安全.

我们很快会禁止使用非穷尽式的(non-exhaustive) `when` 语句, 使 `when` 语句的行为与 `when` 表达式保持一致.
为保证平滑的迁移, Kotlin 1.6.0 会对使用 enum, 封闭类, 或 Boolean 值的非穷尽式(non-exhaustive) `when` 语句报告警告.
这些警告在未来的发布版中将会变成错误.

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // 错误: 'when' 表达式必须穷尽所有条件
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // 从 1.6.0 开始

    // 警告: 对于 Boolean 值, 非穷尽式的 'when' 语句
    // 在 1.7 中将被禁止, 请添加 'false' 分支或 'else' 分支
    when(message.isEmpty()) {
        true -> return
    }
    // 警告: 对 封闭类/接口, 非穷尽式的 'when' 语句
    // 在 1.7 中将被禁止, 请添加 'is TextMessage' 分支或 'else' 分支
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

关于这个变更及其影响, 详细的解释请参见 [这个 YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-47709).

### 挂起函数用作超类型 (稳定版) {id="stable-suspending-functions-as-supertypes"}

在 Kotlin 1.6.0 中, 挂起函数类型的实现已经成为 [稳定版](components-stability.md).
[在 1.5.30 中](whatsnew1530.md#suspending-functions-as-supertypes) 曾发布过预览版.

在设计 API 时, 如果使用 Kotlin coroutine 并接受挂起函数类型, 功能会很有用.
将需要的行为封装到一个单独的类中, 并让这个类实现挂起函数类型, 这样你可以将你的代码变成流式风格.

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

以前只能使用 lambda 表达式和挂起函数引用的地方, 现在你也可以使用这个类的实例了: `launchOnClick(MyClickAction())`.

这个功能的实现细节目前还存在两个限制:
* 在类的超类型列表中, 你不能混用通常的函数类型和挂起函数类型.
* 你不能使用多个挂起函数超类型.

### 挂起转换 (稳定版) {id="stable-suspend-conversions"}

从通常函数到挂起函数类型的转换功能, Kotlin 1.6.0 引入了 [稳定版](components-stability.md).
从 1.4.0 开始, 这个功能支持只函数字面值和可调用的引用.
从 1.6.0 开始, 这个功能支持支持任意形式的表达式. 在调用参数需要挂起函数的地方, 现在你可以传递值为通常函数类型的任意表达式.
编译器将会自动进行一个隐含的转换.

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### 注解类的实例化 (稳定版) {id="stable-instantiation-of-annotation-classes"}

Kotlin 1.5.30 对 JVM 平台 [引入了](whatsnew1530.md#instantiation-of-annotation-classes) 注解类实例化功能的实验性支持.
从 1.6.0 开始, 这个功能对 Kotlin/JVM 和 Kotlin/JS 平台都默认启用.

关于注解类的实例化, 更多详情请参见[这个 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.html).

### 改进了对递归泛型类型的类型推断 {id="improved-type-inference-for-recursive-generic-types"}

Kotlin 1.5.30 改进了对递归泛型类型的类型推断, 能够根据对应的类型参数的上界(Upper Bound)来推断类型参数.
这个功能可以通过编译器选项启用. 在 1.6.0 和之后的版本中, 这个功能默认启用.

```kotlin
// 在 1.5.30 版以前
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// 在 1.5.30 版中使用编译器选项, 或从 1.6.0 版开始默认启用
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### 对构建器推断的变更 {id="changes-to-builder-inference"}

构建器推断是一种类型推断, 在调用泛型的构建器函数时很有用.
对于一个构建器函数调用, 根据它的 lambda 表达式参数内部的函数调用的类型信息, 可以推断出构建器函数的类型参数.

我们做了很多改变, 使得构建器推断接近完全稳定. 从 1.6.0 开始:
* 在构建器的 lambda 表达式内, 你可以调用一个返回值实例类型还未推断的函数,
而不需要指定 [1.5.30 版中引入](whatsnew1530.md#eliminating-builder-inference-restrictions)的
`-Xunrestricted-builder-inference` 编译器选项.
* 使用 `-Xenable-builder-inference`, 你可以编写你自己的构建器,
而不需要添加 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 注解.

    > 注意, 这些构建器的使用者也同样需要指定 `-Xenable-builder-inference` 编译器选项.
    >
    {style="warning"}

* 使用 `-Xenable-builder-inference`, 如果通常的类型推断无法得到足够的类型信息, 会自动激活构建器推断.

参见[如何编写自定义的泛型构建器](using-builders-with-builder-inference.md).

### 对类的类型参数支持注解 {id="support-for-annotations-on-class-type-parameters"}

对类的类型参数支持注解, 如下:

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

类型参数上的所有注解都会被编译输出到 JVM 字节码, 因此注解处理器能够使用这些注解.

关于这种使用场景的动机, 请参见这个 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-43714).

更多详情请参见 [注解](annotations.md).

## 对旧版本的 API 提供更长时期的支持 {id="supporting-previous-api-versions-for-a-longer-period"}

从 Kotlin 1.6.0 开始, 我们将会支持 3 个版本之前的 API, 而不是 2 个版本, 再加上当前的稳定版 API.
目前我们支持 1.3, 1.4, 1.5 版, 以及 1.6 版.

## Kotlin/JVM

对于 Kotlin/JVM, 从 1.6.0 开始, 编译器使用 JVM 17 字节码版本生成类.
新的语言版本还包括代理属性优化和可重复注解, 我们已将这些功能添加到路线图中:
* [对于 1.8 JVM 编译目标, 在运行期保留的可重复注解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [代理属性优化, 不再在 KProperty 实例上调用 get/set 方法](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 对于 1.8 JVM 编译目标, 在运行期保留的可重复注解 {id="repeatable-annotations-with-runtime-retention-for-1-8-jvm-target"}

Java 8 引入了 [可重复的注解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html),
对单个代码元素, 这种注解可以使用多次.
这个功能要求在 Java 代码中出现两个声明:
可重复注解本身, 标注 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html),
以及容器注解(containing annotation), 来表达可重复注解的值.

Kotlin 也有可重复注解, 但只需要在一个注解的声明中标注 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 来将它变成可重复注解.
在 1.6.0 版之前, 这个功能只支持 `SOURCE` retention 设置, 而且不兼容 Java 的可重复注解.
Kotlin 1.6.0 解除了这些限制. `@kotlin.annotation.Repeatable` 现在可以接受任意的 retention 设置, 而且这些注解在 Kotlin 和 Java 中都可重复.
在 Kotlin 代码中, 现在也支持 Java 的可重复注解.

尽管你可以声明一个容器注解(containing annotation), 但并不是必须的. 比如:
* 如果一个注解 `@Tag` 标注了 `@kotlin.annotation.Repeatable`,
Kotlin 编译器会自动生成容器注解(containing annotation)类, 使用名称 `@Tag.Container`:

    ```kotlin
    @Repeatable
    annotation class Tag(val name: String)

    // 编译器会生成容器注解(containing annotation) @Tag.Container
    ```

* 要对容器注解(containing annotation)设置自定义的名称, 可以标注 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解, 并通过参数明确指定要使用的容器注解类:

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)

    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射通过新的函数 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html), 现在同时支持 Kotlin 和 Java 的可重复注解.

关于 Kotlin 可重复注解, 更多详情请参见 [这个 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.html).

### 代理属性优化, 不再在 KProperty 实例上调用 get/set 方法 {id="optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance"}

我们优化了生成的 JVM 字节码, 省略了 `$delegate` field, 改为直接访问引用的属性.

比如, 在下面的代码中

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再生成 `content$delegate` field.
对 `content` 属性的访问会直接调用 `impl`, 略过代理属性的 `getValue`/`setValue` 操作,
因此不再需要使用[`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 类型的属性引用对象.

感谢我们的 Google 同事实现了这个功能!

更多详情请参见 [代理属性](delegated-properties.md).

## Kotlin/Native

Kotlin/Native 有了很多改进, 以及组件更新, 其中一部分还处于预览状态:
* [新的内存管理器 (预览版)](#preview-of-the-new-memory-manager)
* [支持 Xcode 13](#support-for-xcode-13)
* [在任意的主机上编译到 Windows 编译目标](#compilation-of-windows-targets-on-any-host)
* [LLVM 和链接器更新](#llvm-and-linker-updates)
* [性能改进](#performance-improvements)
* [JVM 和 JS IR 后端统一的编译器 plugin ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [对 klib 链接错误提供详细的错误信息](#detailed-error-messages-for-klib-linkage-failures)
* [重新设计了对未处理异常进行处理的 API](#reworked-unhandled-exception-handling-api)

### 新的内存管理器 (预览版) {id="preview-of-the-new-memory-manager"}

> 新的 Kotlin/Native 内存管理器还处于 [实验阶段](components-stability.md).
> 它随时有可能变更或被删除. 使用这个功能需要明确要求使用者同意(详情请见下文), 而且你应该只用来进行功能评估, 不要用在你的正式产品中.
> 希望你能通过我们的 [问题追踪系统] [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 提供你的反馈意见.
>
{style="warning"}

在 Kotlin 1.6.0 中, 你可以试用新的 Kotlin/Native 内存管理器的开发预览版.
这个新的内存管理器可以帮助我们进一步消除 JVM 和 Native 平台之间的差异, 在跨平台项目中提供一致的开发体验.

一个值得注意的变化是, 顶级属性(top-level property)的延迟初始化(Lazy initialization), 和在 Kotlin/JVM 平台一样.
当同一个源代码文件中的顶级属性或函数第一次被访问时, 顶级属性才会被初始化.
这个模式还包括全局的过程间优化(interprocedural optimization)(只对正式发布版的二进制文件开启), 这个优化会删除多余的初始化检查.

关于新的内存管理器, 我们最近发布了一篇 [blog](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/).
请阅读这篇 blog, 可以了解新内存管理器的当前开发状态, 看到一些演示项目,
或者直接访问 [迁移指南](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md) 来试用这个功能.
请检查新内存管理器在你的项目中工作状况如何, 并向我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 提交你的反馈意见.

### 支持 Xcode 13 {id="support-for-xcode-13"}

Kotlin/Native 1.6.0 支持 Xcode 13 – Xcode 的最新版本.
你可以自由地更新你的 Xcode, 并继续针对 Apple 操作系统开发你的 Kotlin 项目.

> Xcode 13 中新添加的库在 Kotlin 1.6.0 中不可用, 但我们将在后面的版本中支持使用这些库.
>
{style="note"}

### 在任意的主机上编译到 Windows 编译目标 {id="compilation-of-windows-targets-on-any-host"}

从 1.6.0 开始, 你不需要 Windows 主机来编译到 Windows 编译目标 `mingwX64` 和 `mingwX86`.
这些编译目标可以在任何支持 Kotlin/Native 的主机上编译.

### LLVM 和链接器更新 {id="llvm-and-linker-updates"}

我们重新设计了 Kotlin/Native 底层使用的 LLVM 依赖项目. 这个变化带来了很多好处, 包括:
* LLVM 版本更新到 11.1.0.
* 减少依赖项目大小. 比如, 在 macOS 上现在是大约 300 MB, 而在以前的版本中是 1200 MB.
* [删除了对 `ncurses5` 库的依赖](https://youtrack.jetbrains.com/issue/KT-42693),
在现代的 Linux 发布版中这个库已经不可用了.

除 LLVM 的更新之外, 对于 MingGW 编译目标, Kotlin/Native 现在使用 [LLD](https://lld.llvm.org/) 链接器(来自 LLVM 项目的链接器).
与以前使用的 ld.bfd 链接器相比, 这个变化带来很多好处, 使得我们可以改善生成的二进制代码的运行期性能,
并对 MinGW 编译目标支持编译器缓存.
注意, LLD [需要引入用于 DLL 链接的库](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets).
更多详情请参见 [这条 Stack Overflow 讨论主题](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527).

### 性能改进 {id="performance-improvements"}

Kotlin/Native 1.6.0 带来了以下性能改进:

* 编译期: 对于 `linuxX64` 和 `iosArm64` 编译目标, 默认启用编译器缓存.
对于 debug 模式下的大多数编译, 可以提高速度(第一次编译除外).
在我们的测试项目中, 测量显示速度提升了大约 200%.
对于这些编译目标, 从 Kotlin 1.5.0 开始, 使用 [额外的 Gradle 属性](whatsnew15.md#performance-improvements) 可以启用编译器缓存; 你现在可以删除这些 Gradle 属性.
* 运行期: 由于对生成的 LLVM 代码进行了优化, 使用 `for` 循环在数组上进行迭代现在速度最大可以提升 12%.

### JVM 和 JS IR 后端统一的编译器 plugin ABI {id="unified-compiler-plugin-abi-with-jvm-and-js-ir-backends"}

> 对 Kotlin/Native 使用共通的 IR 编译器 plugin ABI 的选项还处于 [实验阶段](components-stability.md).
> 它随时有可能变更或被删除. 使用这个功能需要明确要求使用者同意(详情请见下文), 而且你应该只用来进行功能评估, 不要用在你的正式产品中.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-48595)提供你的反馈意见.
>
{style="warning"}

在之前的版本中, 由于 ABI 的不同, 编译器 plugin 的开发者必须为 Kotlin/Native 提供单独的 artifact.

从 1.6.0 开始, 对 Kotlin/Native, Kotlin 跨平台 Gradle plugin 可以使用内嵌的编译器 jar – 与 JVM 和 JS IR 后端使用的相同.
这是朝向统一编译器 plugin 开发体验的一步, 因为你现在可以对 Native 和其他平台使用相同的编译器 plugin artifact.

这个功能目前还是预览版, 需要使用者明确同意.
要对 Kotlin/Native 使用通用的编译器 plugin artifact, 请在 `gradle.properties` 添加以下内容:
`kotlin.native.useEmbeddableCompilerJar=true`.

我们计划将来对 Kotlin/Native 默认使用内嵌的编译器 jar,
因此这个预览功能在你的环境工作状况如何, 你的反馈意见对于我们来说非常重要.

如果你是编译器 plugin 的开发者, 请试用这个模式, 检查它对你的是否正常工作.
注意, 根据你的 plugin 的结构不同, 可能会需要手工的迁移步骤.
关于迁移指南, 请参见 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48595), 并在评论中留下你的反馈意见.

### 对 klib 链接错误提供详细的错误信息 {id="detailed-error-messages-for-klib-linkage-failures"}

Kotlin/Native 编译器现在会对 klib linkage 错误提供详细的错误信息.
错误信息现在带有清楚的错误描述, 还包括可能的错误原因, 以及如何修复.

比如:
* 1.5.30 版的错误信息:

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0 版的错误信息:

    ```text
    e: The symbol of unexpected type encountered during IR deserialization: IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0].
    IrTypeAliasSymbol is expected.

    This could happen if there are two libraries, where one library was compiled against the different version of the other library than the one currently used in the project.
    Please check that the project configuration is correct and has consistent versions of dependencies.

    The list of libraries that depend on "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" and may lead to conflicts:
    <list of libraries and potential version mismatches>

    Project dependencies:
    <dependencies tree>
    ```

### 重新设计了对未处理异常进行处理的 API {id="reworked-unhandled-exception-handling-api"}

应用程序未处理的异常会抛到 Kotlin/Native 运行期, 我们统一了其处理过程,
并通过 `processUnhandledException(throwable: Throwable)` 函数公开了默认的处理,
可供自定义的执行环境使用, 比如 `kotlinx.coroutines`.
从 `Worker.executeAfter()` 中的操作逃逸的异常, 也适用这个处理,
但只针对新的 [内存管理器](#preview-of-the-new-memory-manager).

API 的改进还影响通过 `setUnhandledExceptionHook()` 设置的 hook.
Kotlin/Native 运行期会使用一个未被处理的异常调用这些 hook,
在之前的版本中, hook 调用结束之后, 这些 hook 会被重置, 而且此时程序总是会终止.
现在, 这些 hook 可以被使用多次, 而且, 如果你希望在发生未被处理的异常时程序总是终止,
那么, 你要么不要对未被处理的异常设置 hook (`setUnhandledExceptionHook()`),
要么在你的 hook 结束之后一定要调用 `terminateWithUnhandledException()`.
这个功能可以会帮助你将异常发送到第三方的崩溃报告服务(比如 Firebase Crashlytics), 并终止程序.
从 `main()` 中逃逸的异常, 以及跨越互操作边界的异常,
总是会终止程序, 即使 hook 没有调用 `terminateWithUnhandledException()`.

## Kotlin/JS

我们正在继续改进 Kotlin/JS 编译器的 IR 后端的稳定性.
Kotlin/JS 现在有一个 [用于关闭 Node.js 和 Yarn 下载的选项](#option-to-use-pre-installed-node-js-and-yarn).

### 使用预安装的 Node.js 和 Yarn 的选项 {id="option-to-use-pre-installed-node-js-and-yarn"}

现在你可以在构建 Kotlin/JS 项目时关闭 Node.js 和 Yarn 的下载, 并使用主机上已安装的实例.
在没有 Internet 连接的服务器上构建时, 比如 CI 服务器, 这个功能会很有用.

要关闭外部组件的下载, 请在你的 `build.gradle(.kts)` 中添加以下代码:

* Yarn:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // 或指定为 true, 使用默认行为
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```

    </tab>
    </tabs>

* Node.js:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // 或指定为 true, 使用默认行为
    }

    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```

    </tab>
    </tabs>

## Kotlin Gradle plugin

在 Kotlin 1.6.0 中, 我们将 `KotlinGradleSubplugin` 类的描述级别改为 'ERROR'.
这个类以前被用来编写编译器 plugin. 在以后的发布版中, 我们将会删除这个类.
请改为使用 `KotlinCompilerPluginSupportPlugin` 类.

我们删除了 `kotlin.useFallbackCompilerSearch` 构建选项, 以及 `noReflect` 和 `includeRuntime` 编译器选项.
`useIR` 编译器选项已被隐藏, 而且将在未来的发布版中删除.

更多详情请参见 Kotlin Gradle plugin [目前支持的编译器选项](gradle-compiler-options.md).

## 标准库

新的标准库 1.6.0 版本稳定了实验性功能, 引入了新的功能, 并在各个平台统一了库的行为:

* [新的 readline 函数](#new-readline-functions)
* [typeOf() 的稳定版](#stable-typeof)
* [集合构建器的稳定版](#stable-collection-builders)
* [Duration API 的稳定版](#stable-duration-api)
* [使用正规表达式将字符串分割为序列](#splitting-regex-into-a-sequence)
* [对整数的位轮转(Bit rotation)操作](#bit-rotation-operations-on-integers)
* [JS 中 replace() 和 replaceFirst() 函数的变更](#changes-for-replace-and-replacefirst-in-js)
* [既有 API 的改进](#improvements-to-the-existing-api)
* [废弃的功能](#deprecations)

### 新的 readline 函数 {id="new-readline-functions"}

Kotlin 1.6.0 提供了新的函数用于处理标准输入:
[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html)
和
[`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html).

> 新函数现在还只能用于 JVM 和 Native 编译目标平台.
>
{style="note"}

|**以前的版本**|**1.6.0 中的替代函数**|**使用方法**|
| --- | --- | --- |
| `readLine()!!` | `readln()` | 从标准输入读取一行, 并返回这一行的内容, 如果遇到 EOF 则抛出 `RuntimeException` 异常. |
| `readLine()` | `readlnOrNull()` | 从标准输入读取一行, 并返回这一行的内容, 如果遇到 EOF 则返回 `null`. |

我们认为, 在读取一行输入时不再需要使用 `!!`, 将会改进新使用者的编程体验, 并使得教授 Kotlin 语言更加简单.
为了让读取一行的操作名称与对应的 `println()` 操作保持一致, 我们决定将新函数的名称缩短为 'ln'.

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
```

```kotlin
fun main() {
//sampleStart
    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless {
            it.isNullOrEmpty()
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

在你的 IDE 代码自动补完时, 既存的 `readLine()` 函数优先度将会低于 `readln()` 和 `readlnOrNull()` 函数.
IDE 检查还会推荐使用新函数代替旧的 `readLine()` 函数.

我们计划在未来的发布版中逐渐废弃 `readLine()` 函数.

### `typeOf()` 的稳定版 {id="stable-typeof"}

Kotlin 1.6.0 版带来了
[`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html)
函数的 [稳定版](components-stability.md),
完成了一个 [主要的 roadmap 项目](https://youtrack.jetbrains.com/issue/KT-45396).

[从 1.3.40 版开始](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/),
在 JVM 平台上提供了 `typeOf()` 的实验性 API.
现在你可以在任何 Kotlin 平台上使用它, 并得到编译器可以推断的任何 Kotlin 类型的
[`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType)
表达:

```kotlin
inline fun <reified T> renderType(): String {
    val type = typeOf<T>()
    return type.toString()
}

fun main() {
    val fromExplicitType = typeOf<Int>()
    val fromReifiedType = renderType<List<Int>>()
}
```

### 集合构建器的稳定版 {id="stable-collection-builders"}

在 Kotlin 1.6.0 中, 集合构建器函数提升为 [稳定版](components-stability.md).
集合构建器返回的集合现在序列化为只读状态.

现在你可以使用
[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html),
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html),
以及 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html),
而不必添加 opt-in 注解:

```kotlin
fun main() {
//sampleStart
    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // 输出结果为: [a, b, c, d]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### Duration API 的稳定版 {id="stable-duration-api"}

[Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类
用于表示不同时间单位的持续时间, 它已被提升为 [稳定版](components-stability.md).
在 1.6.0 中, Duration API 发生了以下变化:

* [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函数
  将持续时间分解为日, 小时, 分, 秒, 和纳秒,
  现在它输出的第一个元素类型为 `Long`, 而不是 `Int`.
  以前, 如果值超过了 `Int` 类型范围, 会被截断到 `Int` 类型范围之内.
  现在, 由于使用了 `Long` 类型, 你可以分解任意范围的持续时间值, 而不必截断超过 `Int` 类型范围的值.

* `DurationUnit` 枚举值现在是独立的类型, 而不是 JVM 平台 `java.util.concurrent.TimeUnit` 的类型别名.
  我们没有发现任何有意义的场景还需要保留 `typealias DurationUnit = TimeUnit`.
  而且, 通过类型别名来公布 `TimeUnit` API 可能导致 `DurationUnit` 使用者的理解混乱.

* 根据社区的返回意见, 我们恢复了 `Int.seconds` 之类的扩展属性.
  但我们希望限制它们的适用范围, 因此我们将它们放在 `Duration` 类的同伴对象内.
  尽管 IDE 在代码补完和自动添加 import 时仍然可以从同伴对象中提供这些扩展,
  但在将来, 我们计划在需要 `Duration` 类型的地方限制这种行为.

  ```kotlin
  import kotlin.time.Duration.Companion.seconds

  fun main() {
  //sampleStart
      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // 输出结果为: There are 166 minutes in 10000 seconds
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

  我们建议将之前引入的伴随函数, 比如 `Duration.seconds(Int)`, 以及已被废弃的顶级扩展, 比如 `Int.seconds`,
  替换为 `Duration.Companion` 中的新的扩展函数.

  > 这样的替换可能导致旧的顶级扩展与新的伴随扩展之间的歧义.
  > 在进行自动迁移之前, 请确认对 kotlin.time 包使用了通配符 import  – `import kotlin.time.*`.
  >
  {style="note"}


### 使用正规表达式将字符串分割为序列 {id="splitting-regex-into-a-sequence"}

`Regex.splitToSequence(CharSequence)`
和
`CharSequence.splitToSequence(Regex)`
函数已被提升为[稳定版](components-stability.md).
这些函数通过匹配正规表达式来分割字符串, 但将结果返回为 [序列(Sequence)](sequences.md),
使得对这个结果的所有操作都会以延迟计算(lazy)模式执行:

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // 或者也可以使用
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // 输出结果为: "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 对整数的位轮转(Bit rotation)操作 {id="bit-rotation-operations-on-integers"}

在 Kotlin 1.6.0 中, 用于位操作的 `rotateLeft()` 和 `rotateRight()` 函数已成为 [稳定版](components-stability.md).
这些函数会将数值的二进制表达向左或向右轮转指定的位数:

```kotlin
fun main() {
//sampleStart
    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 输出结果为: 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 输出结果为: 1000100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

### JS 中 replace() 和 replaceFirst() 函数的变更 {id="changes-for-replace-and-replacefirst-in-js"}

在 Kotlin 1.6.0 以前,
正规表达式函数 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html)
和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html)
在替换包含 group 引用的字符串时, 在 Java 和 JS 平台的行为会有不同.
为了让这些函数在所有编译目标平台的行为保持一致, 我们改变了它们在 JS 平台的实现.

在替换字符串中出现的 `${name}` 或 `$index`, 会被替换为指定的 index 或名称所对应的被捕获的组(captured group):
* `$index` – '$' 之后的第一个数字会被认为是组引用(group reference)的一部分.
  后续的数字只有在形成一个有效的组引用时, 才会被计入 `index`.
  只有数字 '0'–'9' 会被当作组引用的组成部分. 注意, 被捕获的组的 index 值从 '1' 开始计算.
  index 值为 '0' 的组代表正规表达式的整个匹配.
* `${name}` – `name` 可以由字母 'a'–'z', 'A'–'Z', 或数字 '0'–'9' 组成.
  第一个字符必须是字母.

    > 在替换模式中使用有名称的组, 目前只有 JVM 平台支持这个功能.
    >
    {style="note"}

* 如果要把替换字符串中的后续字符当作文字使用, 请使用反斜杠字符 `\` 进行转义:

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // 输出结果为: $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // 输出结果为: \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果要把替换字符串全部当作文字, 你可以使用
    [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)
    函数.

### 既有 API 的改进 {id="improvements-to-the-existing-api"}

* 1.6.0 版增加了 `Comparable.compareTo()` 的中缀扩展函数. 你现在可以使用中缀形式来比较两个对象的顺序:

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 函数现在也变为非 inline, 以便在所有平台上统一它的实现.
* String 的 `compareTo()` 和 `equals()` 函数, 以及 CharSequence 的 `isBlank()` 函数
  在 JS 平台的行为现在与在 JVM 平台完全一致.
  当出现非 ASCII 字符时, 之前版本的行为存在差异.

### 废弃的功能 {id="deprecations"}

在 Kotlin 1.6.0 中, 对某些仅限于 JS 的标准库 API, 我们开始了它的废弃周期, 会提示警告.

#### String 的 concat(), match(), 和 matches() 函数

* 要拼接一个字符串与另一个给定对象的字符串表达, 请使用 `plus()` 函数, 而不是 `concat()` 函数.
* 要在输入字符串中查找一个正规表达式的所有匹配, 请使用 Regex 类的 `findAll()` 函数, 而不是 `String.match(regex: String)` 函数.
* 要检查正规表达式是否匹配整个输入字符串, 请使用 Regex 类的 `matches()`函数, 而不是 `String.matches(regex: String)` 函数.

#### 使用比较函数的数组 sort() 函数

我们废弃了 `Array<out T>.sort()` 函数,
以及 inline 函数 `ByteArray.sort()`, `ShortArray.sort()`, `IntArray.sort()`,
`LongArray.sort()`, `FloatArray.sort()`, `DoubleArray.sort()`, 和 `CharArray.sort()`,
这些函数会按照比较函数决定的顺序来排序数组.
请使用其他标准库函数来对数组排序.

详情请参见 [集合排序](collection-ordering.md).

## 工具

### Kover – 用于 Kotlin 的代码覆盖率工具

> Kover Gradle plugin 还处于实验阶段.
> 欢迎通过 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 提供你的反馈意见.
>
{style="warning"}

在 Kotlin 1.6.0 中, 我们引入了 Kover – 一个 Gradle plugin,
支持 [IntelliJ](https://github.com/JetBrains/intellij-coverage)
和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 代码覆盖率统计工具.
它支持所有的语言结构, 包括 inline 函数.

更多详情请参见 Kover 的 [GitHub 代码仓库](https://github.com/Kotlin/kotlinx-kover),
或这个视频:

<video src="https://youtu.be/jNu5LY9HIbw" title="Kover – 代码覆盖率 Plugin"/>

## 协程 1.6.0-RC 版

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已发布了,
包括很多新功能和改进:

* 支持 [新的 Kotlin/Native 内存管理器](#preview-of-the-new-memory-manager)
* 引入了派发器 _views_ API, 可以限制并发, 而不需要创建额外的线程
* 从 Java 6 迁移到 Java 8 编译目标
* `kotlinx-coroutines-test`, 包括重新设计的 API 和跨平台支持
* 引入 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html),
  允许协程以线程安全的方式写访问 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 变量

更多详情请参见 [变更列表](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC).

## 迁移到 Kotlin 1.6.0 {id="migrating-to-kotlin-1-6-0"}

IntelliJ IDEA 和 Android Studio 会建议你将 Kotlin plugin 更新到 1.6.0.

要将既有的项目迁移到 Kotlin 1.6.0, 请将 Kotlin 版本修改为 `1.6.0`, 然后重新导入你的 Gradle 或 Maven 项目.
更多详情请参见 [如何更新到 Kotlin 1.6.0](releases.md#update-to-a-new-release).

要使用 Kotlin 1.6.0 创建新项目, 请更新 Kotlin plugin, 然后通过菜单 **File** | **New** | **Project** 运行项目向导.

新的命令行编译器可以通过 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0) 下载.

Kotlin 1.6.0 是一个 [功能发布版](kotlin-evolution.md#feature-releases-and-incremental-releases)
因此可能带来一些变化, 造成与你使用以前版本编写的代码不兼容.
关于这些不兼容的变化, 详情请参见 [Kotlin 1.6 兼容性指南](compatibility-guide-16.md).
