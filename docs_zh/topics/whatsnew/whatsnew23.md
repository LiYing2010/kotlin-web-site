[//]: # (title: Kotlin 2.3.0 中的新功能)

<web-summary>阅读 Kotlin 2.3.0 发布说明, 包括新的语言功能特性, Kotlin Multiplatform, JVM, Native, JS, 和 Wasm 的更新, 以及对 Gradle 和 Maven 的构建工具支持.</web-summary>

_[发布日期: 2025/12/16](releases.md#release-history)_

<tldr>
    <p>关于 bug 修复版本 2.3.10, 详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.3.10">changelog</a></p>
</tldr>

Kotlin 2.3.0 已经发布了! 以下是它的一些最重要的功能:

* **语言**: [更多功能特性升级为稳定版和默认启用, 未使用返回值检查器, 明确的后端域变量, 以及对上下文敏感的解析的变更](#language).
* **Kotlin/JVM**: [支持 Java 25](#kotlin-jvm-support-for-java-25).
* **Kotlin/Native**: [通过 Swift export 改进互操作, 发布 task 的构建时间更快, C 和 Objective-C 库导入功能进入 Beta 版](#kotlin-native).
* **Kotlin/Wasm**: [默认启用完全限定名称和新的异常处理提案, 以及 Latin-1 字符的新的紧凑存储方式](#kotlin-wasm).
* **Kotlin/JS**: [新的实验性挂起函数导出, `LongArray` 表示, 统一了同伴对象的访问, 等等](#kotlin-js).
* **Gradle**: [兼容 Gradle 9.0, 以及新的 API, 用于注册生成的源代码](#gradle).
* **Compose 编译器**: [经过代码压缩(混淆)的 Android 应用程序的栈追踪](#compose-compiler-stack-traces-for-minified-android-applications).
* **标准库**: [时间追踪功能进入稳定版, 以及 UUID 生成和解析的改进](#standard-library).

关于本次更新的概要介绍, 你可以观看以下视频:

<video src="https://www.youtube.com/v/_6PSSkqwbp8" title="Hands-on with Kotlin 2.3"/>

> 关于 Kotlin 的发布周期, 详情请参见 [Kotlin 发布过程](releases.md).
>
{style="tip"}

## IDE 支持 {id="ide-support"}

最新版的 IntelliJ IDEA 和 Android Studio 中捆绑了支持 2.3.0 的 Kotlin plugin.
你不需要在你的 IDE 中更新 Kotlin plugin.
你需要做的只是在你的构建脚本中 [修改 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 为 2.3.0.

详情请参见 [更新到新的发布版](releases.md#update-to-a-new-kotlin-version).

## 语言 {id="language"}

Kotlin 2.3.0 专注于功能特性的稳定化, 引入了新机制, 用来检测未使用的返回值, 并改进了上下文敏感的解析.

### 进入稳定版的功能特性 {id="stable-features"}

在之前的 Kotlin 版本中, 几个新的语言功能特性作为实验性和 Beta 版引入.
以下功能特性在 Kotlin 2.3.0 中已升级为 [稳定版](components-stability.md#stability-levels-explained):

* [支持嵌套的类型别名](whatsnew22.md#support-for-nested-type-aliases)
* [对 `when` 表达式基于数据流的穷尽检查(Exhaustiveness Check)](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### 默认启用的功能特性 {id="features-enabled-by-default"}

在 Kotlin 2.3.0 中, 现在默认支持 [表达式体中的带有明确返回类型的 `return` 语句](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types).

[查看 Kotlin 语言功能特性和提案的完整列表](kotlin-language-features-and-proposals.md).

### 未使用返回值检查器 {id="unused-return-value-checker"}
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 引入了未使用返回值检查器, 能够帮助防止忽略返回结果值.
如果表达式返回 `Unit` 或 `Nothing` 以外的值, 而且这个结果值没有传递给函数,
没有在条件中检查, 也没有以其他方式使用时, 它会发出警告.

这个检查器能够帮助发现函数调用产生了有意义的结果却被悄悄丢弃的 bug,
这可能导致意外行为, 或难以追踪的问题.

> 检查器会忽略从自增操作返回的值, 例如 `++` 和 `--`.
>
{style="note"}

请看以下示例:

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 检查器报告警告, 这个返回结果被忽略
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

在这个示例中, 创建了一个字符串, 但从未使用, 所以检查器将其报告为被忽略的结果.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-checker=check</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

使用这个选项, 检查器只报告来自标注过的表达式的被忽略结果, 例如 Kotlin 标准库中的大多数函数.

要标注你的函数, 请使用 `@MustUseReturnValues` 注解, 标注你希望检查器报告被忽略返回值的作用范围.

例如, 你可以标注整个文件:

```kotlin
// 标注这个文件中的所有函数和类, 让检查器报告未使用的返回值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或者, 你可以标注特定类:

```kotlin
// 标注这个类中的所有函数, 让检查器报告未使用的返回值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

你也可以在构建文件中添加以下编译器选项, 标注整个项目:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-checker=full</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

使用这个设置, Kotlin 会自动将被编译的文件视为标注了 `@MustUseReturnValues` 注解,
检查器会报告项目中所有的函数返回值.

你可以使用 `@IgnorableReturnValue` 注解标注特定的函数, 来抑制警告.
请标注那些忽略返回值是常见的预期行为的函数, 例如 `MutableList.add`:

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

你可以抑制警告, 但不将函数本身标注为可忽略.
方法是, 将结果赋值给一个特殊的未命名变量, 下划线 (`_`):

```kotlin
// 不可忽略的函数
fun computeValue(): Int = 42

fun main() {
    // 报告警告: 结果被忽略
    computeValue()

    // 使用特殊的未使用的变量, 只在这个调用处抑制警告
    val _ = computeValue()
}
```

详情请参见这个功能特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md).

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供你的反馈意见.

### 明确的后端域变量 {id="explicit-backing-fields"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0 引入了明确的后端域变量
- 一种新语法, 用于明确的声明保存属性值的底层域变量, 与现有的隐含的后端域变量相反.

关于这个功能特性的概要介绍, 你可以观看这个视频:

<video src="https://www.youtube.com/v/PU-VdH8HhVA" title="Explicit Backing Fields are experimental in Kotlin 2.3"/>

新的明确语法简化了常见的后端属性模式(Backing Property Pattern), 这种模式中, 属性的内部类型与其公开的 API 类型不同.
例如, 你可能使用 `ArrayList`, 但将它公开为只读的 `List` 或 `MutableList`.
在之前的版本中, 这种做法需要使用额外的私有属性.

有了明确的后端域变量, `field` 的实现类型直接在属性的作用域内定义.
因此不再需要单独的私有属性, 而且让编译器能够在同一个私有作用域内, 自动执行到后端域变量类型的智能类型转换.

在之前的版本中:

```kotlin
private val _city = MutableStateFlow<String>("")
val city: StateFlow<String> get() = _city

fun updateCity(newCity: String) {
    _city.value = newCity
}
```

在之后的版本中:

```kotlin
val city: StateFlow<String>
    field = MutableStateFlow("")

fun updateCity(newCity: String) {
    // 智能类型转换会自动进行
    city.value = newCity
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-backing-fields")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-backing-fields</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

详情请参见这个功能特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md).

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-14663) 中提供你的反馈意见.

### 上下文敏感解析的变更 {id="changes-to-context-sensitive-resolution"}
<primary-label ref="experimental-general"/>

上下文敏感解析(Context-Sensitive Resolution)仍然是 [实验性功能](components-stability.md#stability-levels-explained),
但我们正在根据用户反馈意见, 持续的改进这个功能特性:

* 当前类型的密封超类和封闭超类, 现在被作为搜索上下文作用范围的一部分. 不考虑其他超类型的作用范围.
  关于这样做的动机和示例, 请参见 YouTrack issue [KT-77823](https://youtrack.jetbrains.com/issue/KT-77823).
* 当涉及类型运算符和相等性时, 如果使用上下文敏感解析使解析发生歧义, 编译器现在会报告警告.
  例如, 当导入了与某个类冲突的声明时, 就可能发生这种情况.
  关于这样做的动机和示例, 请参见 YouTrack issue [KT-77821](https://youtrack.jetbrains.com/issue/KT-77821).

请在 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md) 中查看当前提案的完整文本.

## Kotlin/JVM: 支持 Java 25 {id="kotlin-jvm-support-for-java-25"}

从 Kotlin 2.3.0 开始, 编译器可以生成包含 Java 25 字节码的类.

## Kotlin/Native {id="kotlin-native"}

Kotlin 2.3.0 引入了对 Swift export 支持的改进, C 和 Objective-C 库的导入功能,
还改善了发布 task 的构建时间.

### 通过 Swift export 互操作的改进 {id="improved-interop-through-swift-export"}
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 进一步改善了 Kotlin 与 Swift 通过 Swift export 的互操作功能,
添加了对原生枚举类和可变参数函数的支持.

之前, Kotlin 枚举被导出为普通的 Swift 类.
现在映射是直接的, 你可以使用通常的原生 Swift 枚举. 例如:

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get }
}
```

此外, Kotlin 的 [`vararg`](functions.md#variable-number-of-arguments-varargs) 函数现在直接映射到
Swift 的可变参数函数.

这类函数允许你传递数量可变的参数.
如果你事先不知道参数数量, 或者想要创建或传递集合而不指定其类型时, 这很有用.
例如:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
public func log(messages: Swift.String...)
```

> 目前还不支持可变参数函数中的泛型类型.
>
{style="note"}

### C 和 Objective-C 库导入功能进入 Beta 版 {id="c-and-objective-c-library-import-is-in-beta"}
<primary-label ref="beta"/>

对 Kotlin/Native 项目 [导入 C](native-c-interop.md) 和 [Objective-C](native-objc-interop.md) 库的功能,
现在进入 [Beta 版](components-stability.md#stability-levels-explained).

与不同版本的 Kotlin, 依赖项, 以及 Xcode 的完全兼容性仍然没有保证,
但在发生二进制兼容性问题时, 编译器现在会输出更好的诊断信息.

导入功能还没有稳定, 在你的项目中使用 C 和 Objective-C 库时, 对于某些与 C 和 Objective-C 互操作相关的事项,
仍然需要使用者同意(Opt-in) 注解 `@ExperimentalForeignApi`, 包括:

* `kotlinx.cinterop.*` 包中的某些 API, 在使用原生库或内存时, 需要使用者同意(Opt-in) 注解.
* 原生库中的所有声明, 需要使用者同意(Opt-in) 注解, [平台库](native-platform-libs.md) 除外.

为了兼容性, 并防止你不得不修改源代码, 新的稳定性状态没有反映在注解名称中.

详情请参见 [C 和 Objective-C 库导入的稳定性](native-lib-import-stability.md).

### 默认启用 Objective-C 头文件中代码块类型的明确名称 {id="default-explicit-names-in-block-types-for-objective-c-headers"}

Kotlin 函数类型中明确的参数名称, [在 Kotlin 2.2.20 中引入](whatsnew2220.md#explicit-names-in-block-types-for-objective-c-headers),
现在对 Kotlin/Native 项目导出的 Objective-C 头文件默认启用.
这些参数名称改善了 Xcode 中的自动补全建议, 而且有助于避免 Clang 警告.

请看以下 Kotlin 代码:

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin 将参数名称从 Kotlin 函数类型转发到 Objective-C 代码块类型,
因此 Xcode 能够在建议中使用这些名称:

```ObjC
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

如果遇到问题, 你可以禁用明确的参数名称.
方法是, 在你的 `gradle.properties` 文件中添加以下 [二进制选项](native-binary-options.md):

```properties
kotlin.native.binary.objcExportBlockExplicitParameterNames=false
```

如果遇到任何问题, 请在 [YouTrack](https://kotl.in/issue) 中报告.

### 发布 task 的构建时间更快 {id="faster-build-time-for-release-tasks"}

Kotlin/Native 在 2.3.0 中有了几项性能改善.
这些改善让 `linkRelease*` 发布 task 的构建时间更快, 例如 `linkReleaseFrameworkIosArm64`.

根据我们的基准测试, 发布构建速度最高可提升 40%, 具体取决于项目大小.
这些改善在面向 iOS 的 Kotlin Multiplatform 项目中最为明显.

关于改善项目编译时间的技巧, 详情请参见 [文档](native-improving-compilation-time.md).

### Apple 编译目标支持的变更 {id="changes-to-apple-target-support"}

Kotlin 2.3.0 提高了 Apple 编译目标的最低支持版本:

* 对于 iOS 和 tvOS, 从 12.0 提高到 14.0.
* 对于 watchOS, 从 5.0 提高到 7.0.

根据公开数据, 旧版本的使用已经非常少.
这个变更简化了我们对 Apple 编译目标的整体维护,
并为在 Kotlin/Native 中支持 [Mac Catalyst](https://developer.apple.com/documentation/uikit/mac-catalyst)
提供了机会.

如果你需要在项目中保留旧版本, 请在构建文件中添加以下内容:

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
        binaries.configureEach {
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.ios=12.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.tvos=12.0"
        }
    }
}
```

请注意, 这样的设置不保证能够成功编译, 并且可能在构建期间或运行期间破坏你的应用程序.

这个版本还在 [基于 Intel 芯片的 Apple 编译目标的废弃周期](whatsnew2220.md#deprecation-of-x86-64-apple-targets) 中更进了一步.

从 Kotlin 2.3.0 开始, `macosX64`, `iosX64`, `tvosX64` 和 `watchosX64` 编译目标被降级到第 3 层支持.
也就是说, 我们不保证 CI 测试正确, 而且我们可能不会在不同的编译器版本之间提供源代码和二进制兼容性.
我们计划最终在 Kotlin 2.4.0 中删除对 `x86_64` Apple 编译目标的支持.

详情请参见 [Kotlin/Native 编译目标支持](native-target-support.md).

## Kotlin/Wasm {id="kotlin-wasm"}

Kotlin 2.3.0 为 Kotlin/Wasm 编译目标默认启用完全限定名称, 为 `wasmWasi` 编译目标默认启用新的异常处理提案,
并引入 Latin-1 字符的紧凑存储.

### 默认启用完全限定名称 {id="fully-qualified-names-enabled-by-default"}

在 Kotlin/Wasm 编译目标上, 运行期间默认没有启用完全限定名称 (Fully Qualified Name, FQN).
你必须手动启用对 `KClass.qualifiedName` 属性的支持来使用 FQN.

只能得到类名(不含包名), 这对从 JVM 移植到 Wasm 编译目标的代码, 或期望在运行期间使用完全限定名称的库,
造成了问题.

在 Kotlin 2.3.0 中, 在 Kotlin/Wasm 编译目标上默认启用了 `KClass.qualifiedName` 属性.
这意味着在运行期间可以访问 FQN, 不需要任何额外的配置.

默认启用 FQN 改善了代码可移植性, 并且显示完全限定名称, 使运行期间错误更具参考价值.

由于编译器的优化, 对 Latin-1 字符串字面值使用紧凑存储, 减少了元数据大小,
因此这个变更不会增加编译后的 Wasm 二进制文件大小.

### Latin-1 字符的紧凑存储 {id="compact-storage-for-latin-1-characters"}

之前的版本中, Kotlin/Wasm 按原样存储字符串字面值数据, 也就是说, 每个字符都以 UTF-16 编码.
这对于只包含或主要包含 Latin-1 字符的文本来说并不理想.

从 Kotlin 2.3.0 开始, Kotlin/Wasm 编译器对只包含 Latin-1 字符的字符串字面值, 使用 UTF-8 格式存储.

这个优化显著减少了元数据大小, JetBrains 的 [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app) 的实验已经证明了这一点.
结果是:

* 与没有这个优化的构建相比, Wasm 二进制文件最多减小 13%.
* 即使启用完全限定名称, 与以前不存储它们的版本相比, Wasm 二进制文件最多减小 8%.

这种紧凑存储对于下载和启动时间至关重要的 Web 环境非常重要.
此外, 这个优化消除了之前阻碍 [默认存储类的完全限定名称并启用 `KClass.qualifiedName`](#fully-qualified-names-enabled-by-default) 的大小限制.

这个变更默认启用, 不需要额外的操作.

### 对 `wasmWasi` 默认启用新的异常处理提案 {id="new-exception-handling-proposal-enabled-by-default-for-wasmwasi"}

之前, Kotlin/Wasm 对所有编译目标都使用 [旧版本的异常处理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md),
包括 [`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi).
但是, 大多数独立 WebAssembly 虚拟机 (VM) 都支持 [新版本的异常处理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md).

从 Kotlin 2.3.0 开始, 新的 WebAssembly 异常处理提案, 对 `wasmWasi` 编译目标默认启用,
确保更好的兼容现代 WebAssembly 运行时.

对于 `wasmWasi` 编译目标, 提前引入这个变更是安全的,
因为针对这个环境的应用程序, 通常运行在较少差别的运行环境中(通常运行在单个特定的 VM 上),
运行环境通常由用户控制, 从而降低了兼容性问题的风险.

对于 [`wasmJs` 编译目标](wasm-overview.md#kotlin-wasm-and-compose-multiplatform), 新的异常处理提案仍然默认关闭.
你可以使用 `-Xwasm-use-new-exception-proposal` 编译器选项, 手动启用.

## Kotlin/JS {id="kotlin-js"}

Kotlin 2.3.0 带来了向 JavaScript 导出挂起函数的实验性功能,
以及使用 `BigInt64Array` 类型来表示 Kotlin `LongArray` 类型的功能.

在这个版本中, 你现在可以以统一的方式访问接口内的同伴对象,
在带有同伴对象的接口中使用 `@JsStatic` 注解, 在单独的函数和类中使用 `@JsQualifier` 注解,
以及通过新注解 `@JsExport.Default` 支持默认导出.

### 使用 `JsExport` 导出挂起函数 {id="new-export-of-suspend-function-with-jsexport"}
<primary-label ref="experimental-opt-in"/>

之前, `@JsExport` 注解不允许将挂起函数 (或包含这种函数的类和接口) 导出到 JavaScript.
你必须手动包装每个挂起函数, 这样很麻烦, 而且容易出错.

从 Kotlin 2.3.0 开始, 挂起函数可以使用 `@JsExport` 注解直接导出到 JavaScript.

支持挂起函数导出减少了样板代码, 并改善了 Kotlin/JS 与 JavaScript/TypeScript (JS/TS) 之间的互操作性.
Kotlin 的异步函数现在可以直接从 JS/TS 调用, 不需要额外的代码.

要启用这个功能, 请在你的 `build.gradle.kts` 文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xenable-suspend-function-exporting")
    }
}
```

启用后, 使用 `@JsExport` 注解标注的类和函数, 可以包含挂起函数, 不需要额外的包装.

它们可以作为通常的 JavaScript 异步函数使用, 也可以作为异步函数来覆盖:

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions) 中提供你的反馈意见.

### 使用 `BigInt64Array` 类型表示 Kotlin 的 `LongArray` 类型 {id="usage-of-the-bigint64array-type-to-represent-kotlins-longarray-type"}
<primary-label ref="experimental-opt-in"/>

之前, Kotlin/JS 将其 `LongArray` 表示为 JavaScript 的 `Array<bigint>`.
这种方案可行, 但在与期望类型化数组的 JavaScript API 交互时, 并不理想.

从这个版本开始, 在编译到 JavaScript 时, Kotlin/JS 现在使用 JavaScript 的内建的 `BigInt64Array`
类型来表示 Kotlin 的`LongArray` 值.

使用 `BigInt64Array` 能够简化与使用类型化数组的 JavaScript API 的互操作.
它还能让接受或返回 `LongArray` 的 API 更自然的从 Kotlin 导出到 JavaScript.

要启用这个功能, 请在你的 `build.gradle.kts` 文件中添加以下编译器选项:

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 中提供你的反馈意见.

### 对所有的 JS 模块系统, 统一了同伴对象的访问方式 {id="unified-companion-object-access-across-js-module-systems"}

之前, 当你使用 `@JsExport` 注解将带有同伴对象的 Kotlin 接口导出到 JavaScript/TypeScript 时,
在 TypeScript 中使用这个接口的方式, 在 ES 模块中与其他模块系统不同.

因此, 你必须根据不同的模块系统, 在 TypeScript 端调整输出的使用方式.

请看以下 Kotlin 代码:

```kotlin
@JsExport
interface Foo {
    companion object {
        fun bar() = "OK"
    }
}
```

你必须根据不同的模块系统, 以不同方式调用它:

```kotlin
// 适用于 CommonJS, AMD, UMD, 以及无模块
Foo.bar()

// 适用于 ES 模块
Foo.getInstance().bar()
```

在这个版本中, Kotlin 统一了所有 JavaScript 模块系统中的同伴对象导出.

现在, 对于每个模块系统 (ES 模块, CommonJS, AMD, UMD, 无模块),
接口内的同伴对象的访问方式始终相同(就像类中的同伴对象一样):

```kotlin
// 适用于所有模块系统
Foo.Companion.bar()
```

这个改进还修复了集合互操作性的问题.
之前, 集合工厂函数必须根据不同的模块系统, 以不同方式访问:

```kotlin
// 适用于 CommonJS, AMD, UMD, 以及无模块
KtList.fromJsArray([1, 2, 3])

// 适用于 ES 模块
KtList.getInstance().fromJsArray([1, 2, 3])
```

现在, 在所有模块系统中访问集合工厂函数的方式都相同:

```kotlin
// 适用于所有模块系统
KtList.fromJsArray([1, 2, 3])
```

这个变更减少了模块系统之间的不一致行为, 避免了 bug 和互操作性问题.

这个功能默认启用.

### 在带有同伴对象的接口中支持 `@JsStatic` 注解 {id="support-for-jsstatic-annotations-in-interfaces-with-companion-objects"}

之前, 在导出的带有同伴对象的接口内, 不允许使用 `@JsStatic` 注解.

例如, 以下代码会产生错误, 因为只有类的同伴对象的成员, 才能使用 `@JsStatic` 标注:

```kotlin
@JsExport
interface Foo {
    companion object {
        @JsStatic // 错误
        fun bar() = "OK"
    }
}
```

在这种情况下, 你必须删除 `@JsStatic` 注解, 并通过以下方式从 JavaScript (JS) 访问同伴对象:

```kotlin
// 适用于所有模块系统
Foo.Companion.bar()
```

现在, 在带有同伴对象的接口中支持 `@JsStatic` 注解.
你可以在这种同伴对象上使用这个注解, 并直接从 JS 调用函数, 就像类一样:

```kotlin
// 适用于所有模块系统
Foo.bar()
```

这个变更简化了 JS 中的 API 使用, 允许在接口上使用静态工厂方法, 并消除了类和接口之间的不一致性.

这个功能默认启用.

### 在单独的函数和类中, 允许使用 `@JsQualifier` 注解 {id="jsqualifier-annotation-allowed-in-individual-functions-and-classes"}

之前, 你只能在文件级别使用 `@JsQualifier` 注解, 因此所有的外部 JavaScript (JS) 声明必须放在单独的文件中.

从 Kotlin 2.3.0 开始, 你可以直接对单独的函数和类使用 `@JsQualifier` 注解,
就像 `@JsModule` 和 `@JsNonModule` 注解一样.

例如, 你现在可以在同一个文件中, 与通常的 Kotlin 声明一起, 编写下面的外部函数代码:

```kotlin
@JsQualifier("jsPackage")
private external fun jsFun()
```

这个变更简化了 Kotlin/JS 互操作, 使项目结构更简洁, 并使 Kotlin/JS 与其他平台处理外部声明的方式保持一致.

这个功能默认启用.

### 支持 JavaScript 默认导出 {id="support-for-javascript-default-exports"}

之前, Kotlin/JS 无法从 Kotlin 代码生成 JavaScript 的默认导出.
相反, Kotlin/JS 只会生成命名导出, 例如:

```javascript
export { SomeDeclaration };
```

如果你需要默认导出, 你必须在编译器内部使用变通方法,
例如使用 `@JsName` 注解, 将 `default` 加一个空格作为参数:

```kotlin
@JsExport
@JsName("default ")
class SomeDeclaration
```

Kotlin/JS 现在通过新的注解, 直接支持默认导出:

```kotlin
@JsExport.Default
```

如果你将这个注解应用于 Kotlin 声明 (类, 对象, 函数, 或属性),
生成的 JavaScript 会自动为 ES 模块包含一个 `export default` 语句:

```javascript
export default HelloWorker;
```

> 对于 ES 之外的其它模块系统, 新的 `@JsExport.Default` 注解的工作方式与通常的 `@JsExport` 注解类似.
>
{style="note"}

这个变更使 Kotlin 代码能够符合 JavaScript 规约, 对于 Cloudflare Workers 等平台, 或 `React.lazy` 等框架非常重要.

这个功能默认启用. 你只需要使用 `@JsExport.Default` 注解.

## Gradle {id="gradle"}

Kotlin 2.3.0 完全兼容于 Gradle 7.6.3 到 9.0.0. 你也可以使用最新的 Gradle 版本,
但请注意, 这样做可能会导致废弃警告, 并且某些新的 Gradle 功能特性可能无法正常工作.

此外, 最低支持的 Android Gradle plugin 版本现在是 8.2.2, 最高支持版本是 8.13.0.

Kotlin 2.3.0 还引入了新的 API, 用于在 Gradle 项目中注册生成的源代码.

### 新 API, 用于在 Gradle 项目中注册生成的源代码 {id="new-api-for-registering-generated-sources-in-gradle-projects"}
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 在 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/)
接口中引入了新的 [实验性](components-stability.md#stability-levels-explained) API,
你可以用它在 Gradle 项目中注册生成的源代码.

这个新 API 是一项提升开发体验的改进, 能够帮助 IDE 区分生成的代码和通常的源文件.
通过这个 API, IDE 能够在 UI 中以不同方式高亮显示生成的代码, 并在导入项目时触发生成 task.
我们目前正在努力在 IntelliJ IDEA 中添加这种支持.
这个 API 对于生成代码的第三方插件或工具也非常有用, 例如 [KSP (Kotlin Symbol Processing)](ksp-overview.md).

详情请参见 [注册生成的源代码](gradle-configure-project.md#register-generated-sources).

## 标准库 {id="standard-library"}

Kotlin 2.3.0 中, 新的时间追踪功能 [`kotlin.time.Clock` 和 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)
进入稳定版, 并对实验性的 UUID API 进行了一些改进.

### UUID 生成和解析的改进 {id="improved-uuid-generation-and-parsing"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0 为 UUID API 引入了一些改进, 包括:

* [支持在解析无效 UUID 时返回 `null`](#support-for-returning-null-when-parsing-invalid-uuids)
* [新函数, 用于生成 v4 和 v7 UUID](#new-functions-to-generate-v4-and-v7-uuids)
* [支持为特定的时间戳生成 v7 UUID](#support-for-generating-v7-uuids-for-specific-timestamps)

标准库中的 UUID 支持是 [实验性功能](components-stability.md#stability-levels-explained),
但 [计划在未来稳定化](https://youtrack.jetbrains.com/issue/KT-81395).
要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalUuidApi::class)` 注解, 或在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-81395)
或 [相关的 Slack 频道](https://slack-chats.kotlinlang.org/c/uuid) 中提供你的反馈意见.

#### 支持在解析无效 UUID 时返回 `null` {id="support-for-returning-null-when-parsing-invalid-uuids"}

Kotlin 2.3.0 引入了新函数, 用于从字符串创建 `Uuid` 实例,
如果字符串不是有效的 UUID, 这些函数返回 `null` 而不是抛出异常.

这些函数包括:

* `Uuid.parseOrNull()`
  — 解析 16 进制加横线分隔符格式, 或 16 进制格式的 UUID.
* `Uuid.parseHexDashOrNull()`
  — 只解析 16 进制加横线分隔符格式的 UUID, 否则返回 `null`.
* `Uuid.parseHexOrNull()`
  — 只解析纯 16 进制格式的 UUID, 否则返回 `null`.

下面是一个示例:

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    val valid = Uuid.parseOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(valid)
    // 输出结果为: 550e8400-e29b-41d4-a716-446655440000

    val invalid = Uuid.parseOrNull("not-a-uuid")
    println(invalid)
    // 输出结果为: null

    val hexDashValid = Uuid.parseHexDashOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(hexDashValid)
    // 输出结果为: 550e8400-e29b-41d4-a716-446655440000

    val hexDashInvalid = Uuid.parseHexDashOrNull("550e8400e29b41d4a716446655440000")
    println(hexDashInvalid)
    // 输出结果为: null
}
```
{kotlin-runnable="true"}

#### 新函数, 用于生成 v4 和 v7 UUID {id="new-functions-to-generate-v4-and-v7-uuids"}

Kotlin 2.3.0 引入了两个新函数, 用于生成 UUID: `Uuid.generateV4()` 和 `Uuid.generateV7()`.

使用 `Uuid.generateV4()` 函数生成版本 4 UUID, 或使用 `Uuid.generateV7()` 函数生成版本 7 UUID.

> `Uuid.random()` 函数保持不变, 仍然生成版本 4 UUID, 与 `Uuid.generateV4()` 一样.
>
{style="note"}

下面是一个示例:

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // 生成 v4 UUID
    val v4 = Uuid.generateV4()
    println(v4)

    // 生成 v7 UUID
    val v7 = Uuid.generateV7()
    println(v7)

    // 生成 v4 UUID
    val random = Uuid.random()
    println(random)
}
```
{kotlin-runnable="true"}

#### 支持为特定的时间戳生成 v7 UUID {id="support-for-generating-v7-uuids-for-specific-timestamps"}

Kotlin 2.3.0 引入了新的 `Uuid.generateV7NonMonotonicAt()` 函数,
你可以使用它, 为特定的时刻生成版本 7 UUID.

> 与 `Uuid.generateV7()` 不同, `Uuid.generateV7NonMonotonicAt()` 不保证单调排序,
> 因此为同一个时间戳创建的多个 UUID 可能不是顺序的.
>
{style="note"}

当你需要与已知时间戳绑定的 ID 时, 请使用这个函数,
例如在重新创建事件 ID 时, 或者生成反映事物最初发生时间的数据库条目时.

例如, 要为特定的时刻创建版本 7 UUID, 请使用以下代码:

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

@OptIn(ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    val timestamp = Instant.fromEpochMilliseconds(1577836800000) // 2020-01-01T00:00:00Z

    // 为特定的时间戳生成 v7 UUID (不保证单调性)
    val v7AtTimestamp = Uuid.generateV7NonMonotonicAt(timestamp)
    println(v7AtTimestamp)
}
```
{kotlin-runnable="true"}

## Compose 编译器: 经过代码压缩(混淆)的 Android 应用程序的栈追踪 {id="compose-compiler-stack-traces-for-minified-android-applications"}

从 Kotlin 2.3.0 开始, 当应用程序被 R8 压缩(混淆)时, 编译器为 Compose 栈追踪输出 ProGuard 映射.
这个功能扩展了实验性的栈追踪功能, 栈追踪功能以前只在可调试的变体中可用.

发布变体的栈追踪包含分组键(Group Key), 可用于在经过代码压缩(混淆)的应用程序中识别可组合函数, 而不会产生在运行期间记录源代码信息的开销.
分组键栈追踪需要你的应用程序使用 Compose runtime 1.10 或更高版本构建.

要启用分组键栈追踪, 请在初始化任何 `@Composable` 内容之前, 添加以下内容:

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

启用这些栈追踪后, Compose 运行时将在组合, 测量, 或绘制阶段捕获崩溃时, 添加它自己的栈追踪, 即使应用程序经过了代码压缩(混淆):

```text
java.lang.IllegalStateException: <message>
        at <original trace>
    Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
        at $$compose.m$123(SourceFile:1)
        at $$compose.m$234(SourceFile:1)
        ...
```

Jetpack Compose 1.10 在这种模式下产生的栈追踪, 只包含仍然需要去混淆(deobfuscate)的分组键.
在 Kotlin 2.3.0 版本中, 通过 Compose Compiler Gradle plugin 解决了这个问题,
它现在将分组键条目添加到 R8 生成的 ProGuard 映射文件.
如果你看到新的警告信息, 表示编译器无法为某些函数创建映射,
请向 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 报告.

> 只有在对构建启用了 R8 时, Compose Compiler Gradle plugin 才会为分组键栈追踪创建去混淆映射(Deobfuscation Mapping),
> 因为依赖于 R8 映射文件.
>
{style="note"}

默认情况下, 无论你是否启用追踪, 都会运行映射文件 Gradle task.
如果它们在你的构建中造成问题, 你可以完全禁用这个功能.
在 Gradle 配置的 `composeCompiler {}` 代码块中添加以下属性:

```kotlin
composeCompiler {
    includeComposeMappingFile.set(false)
}
```

> 有一个已知的问题, 对于 Android Gradle plugin 提供的项目文件,
> 某些代码不会显示在栈追踪中: [KT-83099](https://youtrack.jetbrains.com/issue/KT-83099).
>
{style="warning"}

如果你遇到任何问题, 请向 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 报告.

## 破坏性变更和废弃 {id="breaking-changes-and-deprecations"}

本节重点介绍重要的破坏性变更和废弃.
完整的概述, 请参见我们的 [兼容性指南](compatibility-guide-23.md).

* 从 Kotlin 2.3.0 开始, 编译器 [不再支持 `-language-version=1.8`](compatibility-guide-23.md#drop-support-in-language-version-for-1-8-and-1-9).
  在非 JVM 平台上也不支持 `-language-version=1.9`.
* 不再支持早于 2.0 的语言功能集 (JVM 平台的 1.9 除外), 但语言本身与 Kotlin 1.0 完全向后兼容.

  如果你在 Gradle 项目中同时使用 `kotlin-dsl` **和** `kotlin("jvm")` 插件,
  你可能会看到 Gradle 警告信息, 提示不支持的 Kotlin 插件版本.
  关于迁移步骤的指南, 请参见我们的 [兼容性指南](compatibility-guide-23.md#unsupported-kgp-version-warning-when-using-kotlin-dsl-and-kotlin-jvm-plugins).

* 在 Kotlin Multiplatform 中, 对 Android 编译目标的支持现在通过 Google 的 [`com.android.kotlin.multiplatform.library` plugin](https://developer.android.com/kotlin/multiplatform/plugin) 提供.
  请将带有 Android 编译目标的项目迁移到新 plugin, 并将你的 `androidTarget` 代码块重命名为 `android`.

* 如果你继续对 Android Gradle plugin (AGP) 9.0.0 或更高版本的 Android 编译目标使用 Kotlin Multiplatform Gradle plugin,
  你在使用 `androidTarget` 代码块时会看到配置错误, 以及提供迁移指导的诊断消息.
  你可以使用 AGP 8.x, 并更新到 Kotlin 2.3.10 来避免这个错误,
  或者 [对 Android 编译目标迁移到 Google 的 plugin](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migrate-to-google-s-plugin-for-android-targets).

* AGP 9.0.0 包含 [对 Kotlin 的内置支持](https://developer.android.com/build/releases/agp-preview#android-gradle-plugin-built-in-kotlin).
  从 Kotlin 2.3.0 开始, [如果你使用这个版本的 AGP, 同时使用 `kotlin-android` plugin, 你会看到配置错误](compatibility-guide-23.md#deprecate-kotlin-android-plugin-for-agp-versions-9-0-0-and-later),
  因为不再需要这个 plugin. 新的诊断消息可帮助你迁移.
  如果你使用旧版 AGP, 你会看到废弃警告.

* 不再支持 Ant 构建系统.

## 文档更新 {id="documentation-updates"}

Kotlin Multiplatform 文档已移动到 kotlinlang.org. 现在你可以在一个地方切换 Kotlin 和 KMP 文档.
我们还更新了语言指南的目录, 并引入了新的导航.

自前一次的 Kotlin 发布版以来, 其他重要的变更包括:

* [KMP 概述](kmp-overview.md)
  — 在单个页面上探索 Kotlin Multiplatform 生态系统.
* [Kotlin Multiplatform 快速入门](quickstart.md)
  — 学习如何使用 KMP IDE plugin 设置环境.
* [Compose Multiplatform 1.9.3 的新功能](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html)
  — 了解最新版本的重要功能.
* [Kotlin/JS 入门](js-get-started.md)
  — 使用 Kotlin/JavaScript, 创建面向浏览器的 Web 应用程序.
* [类](classes.md)
  — 学习在 Kotlin 中使用类的基础知识和最佳实践.
* [扩展](extensions.md)
  — 学习如何在 Kotlin 中扩展类和接口.
* [协程基础](coroutines-basics.md)
  — 探索协程的关键概念, 并学习如何创建你的第一个协程.
* [取消与超时](cancellation-and-timeouts.md)
  — 学习协程取消的工作原理, 以及如何使协程响应取消.
* [Kotlin/Native 库](native-libraries.md)
  — 学习如何生成 `klib` 库 artifact.
* [Kotlin Notebook 概述](kotlin-notebook-overview.md)
  — 使用 Kotlin Notebook plugin, 创建交互式 notebook 文档.
* [将 Kotlin 添加到 Java 项目](mixing-java-kotlin-intellij.md)
  — 配置 Java 项目, 同时使用 Kotlin 和 Java.
* [使用 Kotlin 测试 Java 代码](jvm-test-using-junit.md)
  — 使用 JUnit, 测试 Java-Kotlin 的混合项目.
* [新案例研究页面](https://kotlinlang.org/case-studies/)
— 探索各家公司如何应用 Kotlin.

## 如何更新到 Kotlin 2.3.0 {id="how-to-update-to-kotlin-2-3-0"}

Kotlin plugin 作为一个包含在 IntelliJ IDEA 和 Android Studio 中的捆绑 plugin 发布.

要更新到新的 Kotlin 版本, 请在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 到 2.3.0.
