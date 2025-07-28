[//]: # (title: Kotlin 2.2.0 中的新功能)

_[发布日期: 2025/06/23](releases.md#release-details)_

Kotlin 2.2.0 已经发布了! 以下是它的一些最重要的功能:

* **语言**: 新的预览版语言功能特性, 包括 [上下文参数](#preview-of-context-parameters).
  几个
  [之前的实验性功能特性现在进入稳定版](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation),
  例如保护条件(Guard Condition), 非局部的 `break` 和 `continue`, 以及多 $ 符号字符串插值.
* **Kotlin 编译器**: [统一的编译器警告管理](#kotlin-compiler-unified-management-of-compiler-warnings).
* **Kotlin/JVM**: [对接口函数的默认方法生成的变更](#changes-to-default-method-generation-for-interface-functions).
* **Kotlin/Native**: [LLVM 19, 以及用于追踪和调整内存消耗的新功能特性](#kotlin-native).
* **Kotlin/Wasm**: [单独的 Wasm 编译目标](#build-infrastructure-for-wasm-target-separated-from-javascript-target), 以及 [按项目配置 Binaryen](#per-project-binaryen-configuration) 的功能.
* **Kotlin/JS**: [修正了为 `@JsPlainObject` 接口生成的 `copy()` 方法](#fix-for-copy-in-jsplainobject-interfaces).
* **Gradle**: [Kotlin Gradle plugin 中的二进制兼容性验证](#binary-compatibility-validation-included-in-kotlin-gradle-plugin).
* **标准库**: [Base64 和 HexFormat API 进入稳定版](#stable-base64-encoding-and-decoding).
* **文档**: 开放了我们的 [文档调查](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025), 以及 [对 Kotlin 文档进行了显著的改善](#documentation-updates).

## IDE 支持 {id="ide-support"}

最新版的 IntelliJ IDEA 和 Android Studio 中绑定了支持 2.2.0 的 Kotlin plugin.
你不需要在你的 IDE 中更新 Kotlin plugin.
你需要做的只是在你的构建脚本中 [修改 Kotlin 版本](configure-build-for-eap.md#adjust-the-kotlin-version) 为 2.2.0.

详情请参见 [更新到新的发布版](releases.md#update-to-a-new-kotlin-version).

## 语言 {id="language"}

这个发布版将保护条件(Guard Condition),
非局部的 `break` and `continue`,
以及多 $ 符号字符串插值功能
[提升](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation) 为 [稳定版](components-stability.md#stability-levels-explained).
此外, 还引入了几个预览版功能特性,
例如 [上下文参数](#preview-of-context-parameters) 和 [上下文敏感的解析](#preview-of-context-sensitive-resolution).

### 预览版: 上下文参数(Context Parameter) {id="preview-of-context-parameters"}
<primary-label ref="experimental-general"/>

上下文参数(Context Parameter) 允许函数和属性声明在周围上下文(Surrounding Context)中隐含可用的依赖项.

使用上下文参数, 在一组函数调用中, 你就不需要手动的反复传递那些共用而且极少变更的值, 例如服务或依赖项.

上下文参数替代了旧的实验性功能, 上下文接受者(Context Receiver).
要从上下文接受者迁移到上下文参数, 你可以使用 IntelliJ IDEA 中的辅助支持,
详情请参见这篇 [blog](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/).

这两个功能的主要区别是, 在函数的 body 部, 上下文参数不是作为接受者.
因此, 你需要使用上下文参数的名称来访问其成员, 不象上下文接受者, 上下文可以隐含的使用.

Kotlin 中的上下文参数通过简化依赖项注入, 改进 DSL 设计, 以及范围操作, 显著的改善了依赖的管理.
详情请参见, 这个功能特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md).

#### 如何声明上下文参数 {id="how-to-declare-context-parameters"}

要对属性和函数声明上下文参数, 请使用 `context` 关键字, 之后是参数列表, 每个参数声明为 `name: Type`.
下面是一个示例, 依赖于 `UserService` 接口:

```kotlin
// UserService 定义上下文中需要的依赖项
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 声明一个带有上下文参数的函数
context(users: UserService)
fun outputMessage(message: String) {
    // 使用上下文中的 log
    users.log("Log: $message")
}

// 声明一个带有上下文参数的属性
context(users: UserService)
val firstUser: String
    // 使用上下文中的 findUserById
    get() = users.findUserById(1)
```

可以使用 `_` 作为上下文参数的名称.
这种情况下, 参数值可以用来解析, 但在代码段内不能通过名称访问:

```kotlin
// 使用 "_" 作为上下文参数名称
context(_: UserService)
fun logWelcome() {
    // 能够从 UserService 找到适当的 log 函数
    outputMessage("Welcome!")
}
```

#### 如何启用上下文参数 {id="how-to-enable-context-parameters"}

要在你的项目中启用上下文参数, 请在命令行中使用以下编译器选项:

```Bash
-Xcontext-parameters
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段中:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> 同时指定 `-Xcontext-receivers` 和 `-Xcontext-parameters` 编译器选项会导致错误.
>
{style="warning"}

#### 留下你的反馈意见 {id="leave-your-feedback"}

这个功能计划在将来的 Kotlin 发布版中成为稳定版, 并继续改进.
希望你能通过我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 提供你的反馈意见.

### 预览版: 上下文敏感的解析(Context-Sensitive Resolution) {id="preview-of-context-sensitive-resolution"}
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了预览版功能, 上下文敏感的解析(Context-Sensitive Resolution)功能.

之前, 即使类型能够通过上下文推断得到, 你也必须写明枚举值或封闭类成员的完整名称.
例如:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

fun message(problem: Problem): String = when (problem) {
    Problem.CONNECTION -> "connection"
    Problem.AUTHENTICATION -> "authentication"
    Problem.DATABASE -> "database"
    Problem.UNKNOWN -> "unknown"
}
```

现在, 通过上下文敏感的解析, 如果预期的类型已知, 你可以省略上下文中的类型名称:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 根据已知的 problem 类型, 解析枚举值
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

编译器使用这个上下文类型信息来解析正确的成员. 这个信息包括以下内容:

* `when` 表达式的主语(Subject)
* 明确指定的返回类型
* 声明的变量类型
* 类型检查(`is`) 与转换(`as`)
* 封闭类层级结构的已知类型
* 声明的参数类型

> 上下文敏感的解析不能适用于函数, 带的参数属性, 或带接受者的扩展属性.
>
{style="note"}

要在你的项目中试用上下文敏感的解析, 请在命令行中使用以下编译器选项:

```bash
-Xcontext-sensitive-resolution
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

这个功能计划在将来的 Kotlin 发布版中成为稳定版, 并继续改进.
希望你能通过我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution) 提供你的反馈意见.

### 预览版: 注解的使用目标(Use-site Target) 功能 {id="preview-of-features-for-annotation-use-site-targets"}
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一些功能特性, 让注解的使用目标(Use-site Target) 使用更加便利.

#### 属性的 `@all` meta-target {id="all-meta-target-for-properties"}
<primary-label ref="experimental-general"/>

Kotlin 允许你将注解添加到声明的特定部分, 称为 [使用目标(Use-site Target)](annotations.md#annotation-use-site-targets).
但是, 对每个目标分别添加注解会很复杂, 而且易于出错:

```kotlin
data class User(
    val username: String,

    @param:Email      // 构造器参数
    @field:Email      // 后端域变量(Backing Field)
    @get:Email        // get 方法
    @property:Email   // Kotlin 属性
    val email: String,
) {
    @field:Email
    @get:Email
    @property:Email
    val secondaryEmail: String? = null
}
```

为了简化这个操作, Kotlin 为属性引入了新的 `@all` meta-target.
这个功能特性告诉编译器, 将注解应用于属性的所有相关部分.
当你使用它时, `@all` 会尝试将注解应用于:

* **`param`**: 构造器参数, 如果声明在主构造器中.

* **`property`**: Kotlin 属性本身.

* **`field`**: 后端域变量(Backing Field), 如果存在.

* **`get`**: get 方法.

* **`set_param`**: set 方法的参数, 如果属性定义为 `var`.

* **`RECORD_COMPONENT`**: 如果类是一个 `@JvmRecord`, 注解应用于 [Java 记录组件(Record Component)](#improved-support-for-annotating-jvm-records).
  这个行为模仿 Java 对记录组件上的注解的处理方式.

编译器 只会将注解应用到给定的属性的目标.

下面的示例中, `@Email` 注解会应用于各个属性的所有相关目标:

```kotlin
data class User(
    val username: String,

    // 将 @Email 应用于 `param`, `property`, `field`,
    // `get`, 以及 `set_param` (如果是 `var`)
    @all:Email val email: String,
) {
    // 将 @Email 应用于 `property`, `field`, 以及 `getter`
    // (不应用于 `param`, 因为这个属性声明不在构造器中)
    @all:Email val secondaryEmail: String? = null
}
```

可以对任何属性使用 `@all` meta-target, 包括在主构造器之内和之外的属性.
但是, 不能将 `@all` meta-target 与 [多个注解](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation) 一起使用.

这个新功能能够简化语法, 确保一致性, 而且改进了与 Java 记录(Record)的互操作能力.

要在你的项目中启用 `@all` meta-target, 请在命令行中使用以下编译器选项:

```Bash
-Xannotation-target-all
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

这个功能现在是预览版.
如果遇到问题, 请到我们的问题追踪系统 [YouTrack](https://kotl.in/issue) 中报告.
关于 `@all` meta-target, 详情请阅读这个 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案.

#### 注解的使用目标(Use-site Target)的新的默认规则 {id="new-defaulting-rules-for-use-site-annotation-targets"}
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了将注解传递到参数, 域变量, 和属性的新的默认规则.
之前, 注解默认只会适用到 `param`, `property`, 或 `field` 中的一个, 现在的默认规则更加符合注解的预期.

如果存在多个可用的目标, 会按照下面的方式选择一个或多个:

* 如果构造器参数目标 (`param`)可以使用, 则使用它.
* 如果属性目标 (`property`)可以使用, 则使用它.
* 如果域变量目标 (`field`)可以使用, 而 `property` 不可以使用, 则使用 `field`.

如果存在多个目标, 并且 `param`, `property`, 或 `field` 都不可使用, 那么注解会发生错误.

要启用这个功能特性, 请将它添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段中:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

或者, 在命令行中使用编译器参数:

```Bash
-Xannotation-default-target=param-property
```

如果想要使用旧的行为, 你可以:

* 在特定的情况下, 明确指定需要的目标, 例如, 使用 `@param:Annotation`, 而不是 `@Annotation`.
* 对整个项目, 在你的 Gradle 构建文件中使用以下设置:

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

这个功能现在是预览版.
如果遇到问题, 请到我们的问题追踪系统 [YouTrack](https://kotl.in/issue) 中报告.
关于注解使用目标的新的默认规则, 详情请阅读这个 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案.

### 支持嵌套的类型别名 {id="support-for-nested-type-aliases"}
<primary-label ref="beta"/>

之前, 你只能在 Kotlin 文件的顶层声明 [类型别名](type-aliases.md).
这就意味着, 即使是内部的, 或特定领域相关的类型别名, 也必须位于使用它们的类之外.

从 2.2.0 开始, 你可以在其他声明之内定义类型别名, 只要不从它们的外部类捕获类型参数:

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

嵌套的类型别名存在一些额外的限制, 例如不能引用类型参数.
关于详细的规则, 请参见 [文档](type-aliases.md#nested-type-aliases).

嵌套的类型别名可以改进封装性, 减少包层级的混乱, 简化内部实现, 使得代码更加清晰, 更易于维护.

#### 如何启用嵌套的类型别名 {id="how-to-enable-nested-type-aliases"}

要在你的项目中启用嵌套的类型别名, 请在命令行中使用以下编译器选项:

```bash
-Xnested-type-aliases
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段中:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### 留下你的反馈意见 {id="share-your-feedback"}

嵌套的类型别名现在是 [Beta 版](components-stability.md#stability-levels-explained).
如果遇到问题, 请到我们的问题追踪系统 [YouTrack](https://kotl.in/issue) 中报告.
关于这个功能, 详情请阅读这个 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) 提案.

### 稳定版功能: 保护条件(Guard Condition), 非局部的 `break` 和 `continue`, 以及多 $ 符号字符串插值 {id="stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation"}

在 Kotlin 2.1.0 中, 引进了几个新的语言功能特性的预览版.
我们很高兴的宣布, 在这个发布版中, 以下语言功能特性现在进入 [稳定版](components-stability.md#stability-levels-explained):

* [在带主语(Subject)的 `when` 中的保护条件(Guard Condition)](whatsnew21.md#guard-conditions-in-when-with-a-subject)
* [非局部的 `break` 和 `continue`](whatsnew21.md#non-local-break-and-continue)
* [多 $ 符号字符串插值: 改进了字符串字面值中的 `$` 处理](whatsnew21.md#multi-dollar-string-interpolation)

[查看完整的 Kotlin 语言设计的功能特性和提案列表](kotlin-language-features-and-proposals.md).

## Kotlin 编译器: 统一的编译器警告管理 {id="kotlin-compiler-unified-management-of-compiler-warnings"}
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一个新的编译器选项, `-Xwarning-level`.
它的目的是在 Kotlin 项目中提供一个统一的编译器警告管理方式.

之前, 你只能使用模块范围的一般性规则, 例如使用 `-nowarn` 禁止所有的警告,
使用 `-Werror` 将所有的警告转变为编译错误,
使用 `-Wextra` 或者启用额外的编译器检查.
针对特定的警告进行调整的唯一方法是 `-Xsuppress-warning` 选项.

使用新的解决方案, 你可以通过一致的方式, 覆盖一般性规则, 并排除特定的诊断.

### 如何启用 {id="how-to-apply"}

新的编译器选项的语法如下:

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 只将特定的警告提升为错误.
* `warning`: 发出警告, 这个选项默认启用.
* `disabled`: 对特定的警告在整个模块范围内禁止警告.

要注意, 你只能使用新的编译器选项配置 _警告_ 的严重级别.

### 使用场景 {id="use-cases"}

使用新的解决方案, 你可以组合一般性规则和特定规则, 更好的精确调节你的项目中的警告报告.
请选择你的使用场景:

#### 禁止警告 {id="suppress-warnings"}

| 命令                                                | 说明                |
|---------------------------------------------------|-------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | 编译期间禁止所有警告.       |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | 只禁止特定的警告.         |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 禁止所有警告, 但特定的警告除外. |

#### 将警告提升为错误 {id="raise-warnings-to-errors"}

| 命令                                                | 说明                    |
|---------------------------------------------------|-----------------------|
| [`-Werror`](compiler-reference.md#werror)         | 将所有警告提升为编译错误.         |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | 只将特定的警告提升为错误.         |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 将所有警告提升为错误, 但特定的警告除外. |

#### 启用额外的编译器警告 {id="enable-additional-compiler-warnings"}

| 命令                                                 | 说明                                              |
|----------------------------------------------------|-------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | 启用所有的声明, 表达式, 和类型的额外编译器检查, 如果检查结果为 true, 会产生警告. |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | 只启用特定的 额外编译器检查.                                 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 启用所有的额外检查, 但特定的检查除外.                            |

#### 警告列表 {id="warning-lists"}

如果你想从一般性规则中排除多个警告, 可以使用 [`@argfile`](compiler-reference.md#argfile), 在单独的文件中列出这些警告.

### 留下你的反馈意见 {id="leave-feedback"}

这个新编译器选项现在还是 [实验性功能](components-stability.md#stability-levels-explained).
如果遇到问题, 请到我们的问题追踪系统 [YouTrack](https://kotl.in/issue) 中报告.

## Kotlin/JVM {id="kotlin-jvm"}

Kotlin 2.2.0 带来了对 JVM 的很多更新. 编译器现在支持 Java 24 字节码, 而且引入了对接口函数的默认方法生成的变更.
这个发布版还简化了在 Kotlin metadata 中的注解的使用, 改进了内联的值类与 Java 的互操作能力,
还包括更好的支持对 JVM 记录的注解.

### 对接口函数的默认方法生成的变更 {id="changes-to-default-method-generation-for-interface-functions"}

从 Kotlin 2.2.0 开始, 声明在接口中函数会被编译为 JVM 默认方法, 除非另有其它配置.
这个变更会影响 Kotlin 的带有实现的接口函数如何编译为字节码.

这个行为由新的稳定版编译器选项 `-jvm-default` 来控制, 它替代了废弃的 `-Xjvm-default` 选项.

你可以使用以下值来控制 `-jvm-default` 选项的行为:

* `enable` (默认值):
  生成接口中的默认实现, 并在子类和 `DefaultImpls` 类中包含桥接函数(Bridge Function).
  请使用这个模式来维持与旧 Kotlin 版本的二进制兼容性.
* `no-compatibility`:
  只在接口中生成默认实现.
  这个模式会略过兼容性桥接函数和 `DefaultImpls` 类, 因此只适用于新的 Kotlin 代码.
* `disable`:
  禁用接口中的默认实现. 只生成兼容性桥接函数和 `DefaultImpls` 类,
  与 Kotlin 2.2.0 之前的行为一样.

要配置 `-jvm-default` 编译器选项, 请在你的 Gradle Kotlin DSL 中设置 `jvmDefault` 属性:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### 支持在 Kotlin metadata 中读取和写入注解 {id="support-for-reading-and-writing-annotations-in-kotlin-metadata"}
<primary-label ref="experimental-general"/>

之前, 你必须使用反射或字节码分析, 从编译后的 JVM 类文件读取注解, 并且根据签名手动的匹配注解和 metadata 条目.
这个过程易于出错, 尤其是对重载的函数.

现在, 在 Kotlin 2.2.0 中, [](metadata-jvm.md) 引入了读取 Kotlin metadata 中存储的注解的功能.

要让注解在你的编译后的文件的 metadata 中可以使用, 请添加以下编译器选项:

```kotlin
-Xannotations-in-metadata
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

当你启用这个选项时, Kotlin 编译器会将注解与 JVM 字节码一起写入 metadata,
使 `kotlin-metadata-jvm` 库能够访问它们.

这个库提供了以下 API 来访问注解:

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

这些 API 是 [实验性功能](components-stability.md#stability-levels-explained).
要选择使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 注解.

下面是一个从 Kotlin metadata 读取注解的示例:

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // 输出结果为: [@Label(value = StringValue("Message class"))]
}
```

> 如果在你的项目中使用 `kotlin-metadata-jvm` 库, 我们推荐更新并测试你的代码, 以支持注解.
> 否则, 如果在未来的 Kotlin 版本中, metadata 中的注解变为 [默认启用](https://youtrack.jetbrains.com/issue/KT-75736),
> 你的项目可能会生成不正确的或不完整的 metadata.
>
> 如果你遇到任何问题, 请报告到我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-31857).
>
{style="warning"}

### 改进了内联的值类与 Java 的互操作能力 {id="improved-java-interop-with-inline-value-classes"}
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入一个新的实验性注解: [`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/).
这个注解可以让在 Java 中使用 [内联的值类](inline-classes.md) 变得更加容易.

默认情况下, Kotlin 会将内联的值类编译为使用 **未装箱的表达形式(Unboxed Representation)**,
这样性能更高, 但在 Java 中使用会很困难, 甚至无法使用.
例如:

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

在这个示例中, 由于类没有装箱, 因此不存在构造器可供 Java 调用.
而且 Java 也无法触发 `init` 代码段来确保 `number` 为正数.

如果你对类标注 `@JvmExposeBoxed` 注解, Kotlin 会生成一个 public 的构造器, Java 可以直接调用, 确保 `init` 代码段也会执行.

`@JvmExposeBoxed` 注解可以应用于类, 构造器, 或函数层级, 以便对 Java 公开的内容进行粒度控制:

例如, 在以下代码中, 扩展函数 `.timesTwoBoxed()` 在 Java 中 **不能** 访问:

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

为了能够在 Java 代码中创建 `MyInt` 类的实例, 并调用 `.timesTwoBoxed()` 函数, 请对类和函数都添加 `@JvmExposeBoxed` 注解:

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

有了这些注解, Kotlin 编译器会为 `MyInt` 类生成可供 Java 访问的构造器.
还会为扩展函数生成一个重载, 使用值类的装箱形式.
因此, 以下 Java 代码能够成功运行:

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

如果你不想对你想要公开的内联的值类的每个部分都添加注解, 可以对整个模块适用注解.
要对一个模块适用注解, 请使用 `-Xjvm-expose-boxed` 选项编译模块.
使用这个选项进行编译, 效果等于模块中所有的声明都带有 `@JvmExposeBoxed` 注解.

这个新注解不会改变 Kotlin 内部编译或使用值类的方式, 而且所有既有的编译后的代码仍然有效.
它只会简单的添加新的能力, 改进与 Java 的互操作能力.
使用值类的 Kotlin 代码的性能不会受到影响.

如果库的作者想要公开成员函数的装箱变体, 以及接收装箱的返回类型, `@JvmExposeBoxed` 注解会很有用.
使用这个注解, 就不再需要在内联的值类(高效, 但只能用于 Kotlin) 和数据类 (兼容 Java, 但始终会装箱) 之间进行选择.

关于 `@JvmExposedBoxed` 注解的工作原理, 以及它解决的问题, 更多详细解释请参见这个 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 提案.

### 改进了对 JVM 记录(Record)的注解的支持 {id="improved-support-for-annotating-jvm-records"}

Kotlin 从 Kotlin 1.5.0 开始支持 [JVM 记录(Record)](jvm-records.md).
现在, Kotlin 2.2.0 改进了对记录组件(Record Component)上的注解的处理, 尤其是与 Java [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 目标相关的注解.

首先, 如果你想要使用 `RECORD_COMPONENT` 作为注解目标, 你需要为 Kotlin (`@Target`) 和 Java 手动添加注解.
这是因为 Kotlin 的 `@Target` 注解不支持 `RECORD_COMPONENT`.
例如:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

手动维护两个列表易于出错, 因此 Kotlin 2.2.0 引入了一个编译器警告, 如果 Kotlin 和 Java 的注解目标不匹配, 则会发出警告.
例如, 如果你在 Java 目标列表中省略了 `ElementType.CLASS`, 编译器会报告:

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

第二, 在记录中传播注解时, Kotlin 的行为与 Java 不同.
在 Java 中, 记录组件上的注解会自动适用于后端域变量(Backing Field), 取值方法(Getter), 以及构造器参数.
Kotlin 默认不会如此, 但你现在可以使用 [`@all:` 使用目标](#all-meta-target-for-properties) 复制这个行为.

例如:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

当你将 `@JvmRecord` 和 `@all:` 一起使用时, Kotlin 现在会:

* 将注解传递到属性, 后端域变量(Backing Field), 构造器参数, 以及取值方法(Getter).
* 如果注解支持 Java 的 `RECORD_COMPONENT`, 还会将注解应用到记录组件.

## Kotlin/Native {id="kotlin-native"}

从 2.2.0 开始, Kotlin/Native 使用 LLVM 19. 这个发布版还带来了几个实验性的功能, 用于追踪和调整内存消耗.

### 以对象为单位的内存分配 {id="per-object-memory-allocation"}
<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的 [内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) 现在能够根据每个对象来保留内存.
某些情况下, 这可以帮助你满足严格的内存限制, 或者减少应用程序启动时的内存消耗.

这个新功能特性是为了替代 `-Xallocator=std` 编译器选项, 这个选项会启用系统内存分配器, 而不是使用默认的内存分配器.
现在, 你可以禁用缓冲(分配的分页), 而不需要切换内存分配器.

这个功能特性现在还是 [实验性功能](components-stability.md#stability-levels-explained).
要启用它, 请在你的 `gradle.properties` 文件中设置以下选项:

```properties
kotlin.native.binary.pagedAllocator=false
```

如果遇到问题, 请到我们的问题追踪系统 [YouTrack](https://kotl.in/issue) 中报告.

### 支持在运行期使用 Latin-1 编码的字符串 {id="support-for-latin-1-encoded-strings-at-runtime"}
<primary-label ref="experimental-opt-in"/>

Kotlin 现在支持 Latin 编码的字符串, 类似于 [JVM](https://openjdk.org/jeps/254).
这能够有助于减少应用程序的二进制文件大小, 并调整内存消耗.

默认情况下, Kotlin 中的字符串使用 UTF-16 编码来存储, 每个字符使用 2 个字节表达.
某些情况下, 会导致二进制文件中的字符串与源代码相比占用 2 倍的空间,
从简单的 ASCII 文件读取数据也会比磁盘上的文件存储占用 2 倍的内存.

相对的, [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 编码对前 256 个 Unicode 字符, 只使用 1 个字节来表示.
启用 Latin-1 支持后, 只要所有的字符都在 Latin-1 的编码范围之内, 字符串就会使用 Latin-1 编码来存储.
否则, 会使用默认的 UTF-16 编码.

#### 如何启用 Latin-1 支持 {id="how-to-enable-latin-1-support"}

这个功能现在还是 [实验性功能](components-stability.md#stability-levels-explained).
要启用它, 请在你的 `gradle.properties` 文件中设置以下选项:

```properties
kotlin.native.binary.latin1Strings=true
```

#### 已知的问题 {id="known-issues"}

虽然这个功能还是实验性功能, 但 cinterop 扩展函数
[`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html),
[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html),
和 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)
的效率会降低.
对这些函数的每次调用都可能触发字符串到 UTF-16 的自动转换.

Kotlin 开发者非常感谢我们的我们在 Google 的同事, 尤其是 [Sonya Valchuk](https://github.com/pyos), 实现了这个功能.

关于 Kotlin 中的内存消耗, 详情请参见 [文档](native-memory-manager.md#memory-consumption).

### 改善了 Apple 平台上的内存消耗追踪 {id="improved-tracking-of-memory-consumption-on-apple-platforms"}

从 Kotlin 2.2.0 开始, 由 Kotlin 代码分配的内存会被标记.
这可以帮助你调试 Apple 平台上的内存问题.

如果观察到你的应用程序的内存使用量很高, 现在你可以识别Kotlin 代码使用了多少内存.
Kotlin 的内存占用量会用标识符标记, 可以通过 Xcode Instruments 中的 VM Tracker 之类的工具进行追踪.

这个功能默认启用, 但只能用于 Kotlin/Native 的默认内存分配器, 并且需要满足以下 _所有_ 条件:

* **启用了标记**.
  内存应该使用有效的标识符进行标记. Apple 推荐 240 到 255 之间的数字; 默认值为 246.

  如果你设置 Gradle 属性 `kotlin.native.binary.mmapTag=0`, 标记会被禁用.

* **使用 mmap 进行分配**.
  内存分配器应该使用 `mmap` 系统调用来将文件映射到内存.

  如果你设置 Gradle 属性 `kotlin.native.binary.disableMmap=true`, 默认的内存分配器会使用 `malloc`, 而不是 `mmap`.

* **启用分页**.
  分配的分页(缓冲)应该启用.

  如果你设置 Gradle 属性 [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation),
  则会根据每个对象来保留内存.

关于 Kotlin 中的内存消耗, 详情请参见 [文档](native-memory-manager.md#memory-consumption).

### LLVM 从 16 更新到 19 {id="llvm-update-from-16-to-19"}

在 Kotlin 2.2.0 中, 我们将 LLVM 从版本 16 更新到了 19.
新的版本包括性能改善, bug 修正, 以及安全性更新.

这个更新不会影响你的代码, 但如果你遇到任何问题, 请到我们的 [问题追踪系统](http://kotl.in/issue) 中报告.

### 废弃了 Windows 7 编译目标 {id="windows-7-target-deprecated"}

从 Kotlin 2.2.0, 支持的 Windows 最低版本从 Windows 7 提升到了 Windows 10.
由于 Microsoft 于 2025 年 1 月停止支持 Windows 7, 我们也决定废弃这个旧的编译目标.

详情请参见 [](native-target-support.md).

## Kotlin/Wasm {id="kotlin-wasm"}

在这个发布版中, [Wasm 编译目标的构建基础架构与 JavaScript 编译目标分离](#build-infrastructure-for-wasm-target-separated-from-javascript-target).
此外, 你现在可以 [按项目或模块配置 Binaryen 工具](#per-project-binaryen-configuration).

### Wasm 编译目标的构建基础架构与 JavaScript 编译目标分离 {id="build-infrastructure-for-wasm-target-separated-from-javascript-target"}

之前, `wasmJs` 编译目标使用与 `js` 编译目标相同的基础架构.
因此, 这两个编译目标都存在于相同的目录(`build/js`)中, 而且使用相同的 NPM 任务和配置.

现在, `wasmJs` 编译目标使用自己的基础架构, 与 `js` 编译目标分离.
因此 Wasm 的任务和类型能够与 JavaScript 的任务和类型区分开, 实现独立的配置.

此外, Wasm 相关的项目文件和 NPM 依赖项现在存储在单独的 `build/wasm` 目录中.

为 Wasm 引入了新的 NPM 相关任务, 既有的 JavaScript 任务现在只用于 JavaScript:

| **Wasm 任务**            | **JavaScript 任务**  |
|------------------------|--------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall` |
| `wasmRootPackageJson`  | `rootPackageJson`  |

类似的, 添加了新的 Wasm 专用的声明:

| **Wasm 声明**               | **JavaScript 声明**     |
|---------------------------|-----------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`    |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`        |
| `WasmYarnPlugin`          | `YarnPlugin`          |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension` |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`       |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`     |

你现在可以使用 Wasm 编译目标, 独立于 JavaScript 编译目标, 这样可以简化配置过程.

这个变更默认启用, 不需要额外的设置.

### 按项目配置 Binaryen 配置 {id="per-project-binaryen-configuration"}

Binaryen 工具, 在 Kotlin/Wasm 中用来 [优化生产构建(Production Build)](whatsnew20.md#optimized-production-builds-by-default-using-binaryen), 之前只在根项目中配置一次.

现在, 你可以对各个项目或各个模块配置 Binaryen 工具.
这个变更与 Gradle 的最佳实践保持一致,
并且确保更好的支持 [项目隔离](https://docs.gradle.org/current/userguide/isolated_projects.html) 之类的功能特性, 改善构建性能, 以及复杂构建中的可靠性.

此外, 如果需要, 现在你还可以对不同的模块配置不同的 Binaryen 版本.

这个功能默认启用. 但是, 如果你使用了自定义的 Binaryen 配置, 你现在需要将它应用于各个项目, 而不是只应用于根项目.

## Kotlin/JS {id="kotlin-js"}

这个发布版改进了 [`@JsPlainObject` 接口中的 `copy()` 函数](#fix-for-copy-in-jsplainobject-interfaces),
[带有 `@JsModule` 注解的文件中类型别名](#support-for-type-aliases-in-files-with-jsmodule-annotation), 以及其他 Kotlin/JS 功能特性.

### 对 `@JsPlainObject` 接口中 `copy()` 的修正 {id="fix-for-copy-in-jsplainobject-interfaces"}

Kotlin/JS 有一个实验性的 plugin, 名为 `js-plain-objects`, 它对标注了 `@JsPlainObject` 注解的接口引入了一个 `copy()` 函数.
你可以使用 `copy()` 函数来复制对象.

但是, `copy()` 的初始实现与继承不兼容, 因此当 `@JsPlainObject` 接口扩展其它接口时, 会导致问题.

为了避免对 plain 对象的限制, `copy()` 函数从对象自身中移动到了它的同伴对象中:

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // 这个语法不再有效
    val copy = user.copy(age = 35)
    // 这是正确的语法
    val copy = User.copy(user, age = 35)
}
```

这个变更解决了继承层级结构中的冲突, 并消除了歧义. 从 Kotlin 2.2.0 开始默认启用.

### 支持带有 `@JsModule` 注解的文件中类型别名 {id="support-for-type-aliases-in-files-with-jsmodule-annotation"}

之前, 带有 `@JsModule` 注解的文件, 从 JavaScript 模块导入声明, 只限于外部声明.
这就意味着, 你不能在这样的文件中声明 `typealias`.

从 Kotlin 2.2.0 开始, 可以在标注了 `@JsModule` 的文件中声明类型别名:

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

这个变更减少了 Kotlin/JS 互操作能力的限制的一个方面, 而且计划在未来的发布版中进一步改进.

对带有 `@JsModule` 注解的文件中的类型别名的支持默认启用.

### 支持跨平台的 `expect` 声明中的 `@JsExport` {id="support-for-jsexport-in-multiplatform-expect-declarations"}

之前, 在 Kotlin Multiplatform 项目中使用 [`expect/actual` 机制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) 时,
无法对共通代码中的 `expect` 声明使用 `@JsExport` 注解.

从这个发布版开始, 可以直接对 `expect` 声明使用 `@JsExport`:

```kotlin
// commonMain

// 以前会产生错误, 但现在能够正确工作
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

你还需要对 JavaScript 源代码集中对应的 `actual` 实现添加 `@JsExport` 注解, 而且它只能使用可以导出的类型.

这个修正让 `commonMain` 中定义的共用的代码能够正确的导出到 JavaScript.
现在你可以将你的跨平台代码公开给 JavaScript 使用者, 而不必使用手动的变通方法.

这个变更默认启用.

### 能够对 `Promise<Unit>` 类型使用 `@JsExport` {id="ability-to-use-jsexport-with-the-promise-unit-type"}

之前, 如果你试图使用 `@JsExport` 注解导出一个返回 `Promise<Unit>` 类型的函数, Kotlin 编译器会输出错误.

`Promise<Int>` 之类的返回类型能够正常工作, 而使用 `Promise<Unit>` 会触发 "non-exportable type" 警告,
尽管它能够正确的映射为 TypeScript 中的 `Promise<void>`.

这个限制已经解决了. 现在, 以下代码能够编译, 不会发生错误:

```kotlin
// 之前能够正确工作
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 以前会产生错误, 但现在能够正确工作
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

这个变更删除了 Kotlin/JS 互操作模型中的不必要的限制.
这个修正默认启用.

## Gradle {id="gradle"}

Kotlin 2.2.0 完全兼容于 Gradle 7.6.3 到 8.14 版本. 你也可以使用 Gradle 的最新发布版.
但要小心, 因为可能会导致废弃警告, 而且一些新的 Gradle 功能特性可能无法工作.

在这个发布版中, Kotlin Gradle plugin 的诊断功能有了一些改进.
还引入了一个实验性的 [二进制兼容性验证](#binary-compatibility-validation-included-in-kotlin-gradle-plugin) 功能集成, 使得创建库变得更加容易.

### Kotlin Gradle plugin 中包含的二进制兼容性验证 {id="binary-compatibility-validation-included-in-kotlin-gradle-plugin"}
<primary-label ref="experimental-general"/>

为了更容易的检查库版本之间的二进制兼容性, 我们正在实验将 [二进制兼容性验证器](https://github.com/Kotlin/binary-compatibility-validator) 的功能迁移到 Kotlin Gradle plugin (KGP) 中.
你可以在玩具项目中试用, 但我们目前不建议在生产环境中使用它.

在目前的实验阶段, 原来的 [二进制兼容性验证器](https://github.com/Kotlin/binary-compatibility-validator) 会继续维护.

Kotlin 库可以使用 2 种二进制格式之一: JVM 类文件或 `klib`.
由于这些格式相互不兼容, 因此 KGP 会分别处理它们.

要启用二进制兼容性验证功能集, 请向你的 `build.gradle.kts` 文件中的 `kotlin{}` 代码段添加以下内容:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函数, 确保与旧的 Gradle 版本兼容
        enabled.set(true)
    }
}
```

如果你的项目存在多个模块, 想要检查二进制兼容性, 请对每个模块单独配置.
每个模块可以有自己单独的自定义配置.

启用这个功能后, 请运行 `checkLegacyAbi` Gradle 任务来检查二进制兼容性问题.
你可以在 IntelliJ IDEA 中运行这个任务, 或在你的项目目录中使用以下命令:

```bash
./gradlew checkLegacyAbi
```

这个任务会根据当前代码生成应用程序二进制接口(Application Binary Interface, ABI) dump, 输出为 UTF-8 文本文件.
然后会比较新的 dump 与之前的发布版的 dump. 如果发现差异, 会报告为错误.
在审核错误之后, 如果你决定这些变更是可以接受的, 可以运行 `updateLegacyAbi` Gradle 任务, 更新参考 ABI dump.

#### 过滤类 {id="filter-classes"}

这个功能允许你过滤 ABI dump 中的类.
你可以使用名称或部分名称, 或使用标注类的注解(或注解的部分名称), 来明确的包含或排除类.

例如, 这个示例排除 `com.company` 包中所有的类:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

关于如何配置二进制兼容性验证器, 详情请参见 [KGP API 参考文档](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/).

#### 跨平台限制 {id="multiplatform-limitations"}

在跨平台项目中, 如果你的主机不支持对所有编译目标的交叉编译,
KGP 会检查其它编译目标的 ABI dump, 来尝试推断不支持的编译目标的 ABI 变更.
这中方法可以有助于避免在你之后切换到 **能够** 编译所有编译目标的主机时发生误报的失败.

你可以修改这个默认行为, 让 KGP 不要对不支持的编译目标推断 ABI 变更, 方法是对你的 `build.gradle.kts` 文件添加以下内容:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

但是, 如果你的项目中存在不支持的编译目标, 运行 `checkLegacyAbi` 任务会失败, 因为这个任务无法创建 ABI dump.
如果你倾向于让检查失败, 而不是由于从其它编译目标推断 ABI 变更造成遗漏二进制不兼容的修改, 那么这个行为可能是可取的.

### 支持 Kotlin Gradle plugin 的控制台丰富格式输出 {id="support-for-rich-output-in-console-for-kotlin-gradle-plugin"}

在 Kotlin 2.2.0 中, 我们支持 Gradle 构建过程中的控制台的彩色和其它丰富格式输出, 让报告的诊断信息更加易于阅读和理解.

丰富格式输出目前在 Linux 和 macOS 支持的终端仿真器中可以使用, 我们正在添加对 Windows 的支持.

![Gradle 控制台](gradle-console-rich-output.png){width=600}

这个功能默认启用, 但如果你想要修改它, 请向你的 `gradle.properties` 文件添加以下 Gradle 属性:

```properties
org.gradle.console=plain
```

关于这个属性及其选项, 详情请参见 Gradle 关于 [自定义 log 格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format) 的文档.

### KGP 诊断中问题 API(Problems API)的集成 {id="integration-of-problems-api-within-kgp-diagnostics"}

之前, Kotlin Gradle Plugin (KGP) 只能将警告和错误之类的诊断报告作为纯文本输出到控制台或日志.

从 2.2.0 开始, KGP 引入了一个新的报告机制: 它现在使用 [Gradle 的问题 API(Problems API)](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html),
这是一种标准化方式, 在构建过程中报告丰富格式的, 结构化的问题信息.

KGP 诊断现在更加易于阅读, 而且在不同的接口中, 例如 Gradle CLI 和 IntelliJ IDEA, 更加一致的显示.

从 Gradle 8.6 或更高版本开始, 这个集成默认启用.
由于这个 API 还在继续演化中, 请使用最近的 Gradle 版本, 这样就能够得到最新的改进.

### KGP 与 `--warning-mode` 的兼容性 {id="kgp-compatibility-with-warning-mode"}

之前, Kotlin Gradle Plugin (KGP) 诊断会使用固定的严重性级别报告问题,
因此 Gradle 的 [`--warning-mode` 命令行选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) 不会影响 KGP 如何显示错误.

现在, KGP 诊断能够兼容 `--warning-mode` 选项, 提供更大的灵活性.
例如, 你可以将所有的警告转换为错误, 或者完全禁用警告.

通过这个变更, KGP 诊断会根据选择的警告模式调整输出:

* 当你设置 `--warning-mode=fail` 时, `Severity.Warning` 的诊断现在会升级为 `Severity.Error`.
* 当你设置 `--warning-mode=none` 时, `Severity.Warning` 的诊断现在不会输出到日志.

从 2.2.0 开始, 这个行为默认启用.

要忽略 `--warning-mode` 选项, 请在你的 `gradle.properties` 文件设置以下 Gradle 属性:

```properties
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新的实验性的构建工具 API {id="new-experimental-build-tools-api"}
<primary-label ref="experimental-general"/>

你可以通过各种构建系统来使用 Kotlin, 例如 Gradle, Maven, Amper, 等等.
但是, 将 Kotlin 整合到每个系统, 支持所有的功能集, 例如增量编译, 并兼容 Kotlin 编译器 plugin, daemon, 以及 Kotlin Multiplatform, 需要付出极大的努力.

为了简化这个过程, Kotlin 2.2.0 引入了一个新的实验性的构建工具 API (Build Tools API, BTA).
BTA 是一个通用 API, 充当构建系统与 Kotlin 编译器生态系统之间的抽象层.
通过这种方式, 每个构建系统只需要支持一个单一的 BTA 入口点.

木器, BTA 只支持 Kotlin/JVM.
JetBrains 的 Kotlin 开发组已经在 Kotlin Gradle plugin (KGP) 和 `kotlin-maven-plugin` 中使用它.
你可以通过这些 plugin 试用 BTA, 但 API 本身还不能在你自己的构建工具集成中使用.
如果你对 BTA 提案感兴趣, 或者希望分享你的反馈意见, 请参见这个 [KEEP](https://github.com/Kotlin/KEEP/issues/421) 提案.

试用 BTA 的方法是:

* 在 KGP 中, 向你的 `gradle.properties` 文件添加以下属性:

```properties
kotlin.compiler.runViaBuildToolsApi=true
```   

* 在 Maven 中, 你不需要做任何事. 它默认启用.

BTA 现在还不能为 Maven plugin 带来直接的益处, 但它为更快的开发以下新的功能特性提供了一个坚实的基础,
例如 [支持 Kotlin daemon](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default) 以及 [增量编译的稳定版](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven).

对于 KGP, 使用 BTA 已经带来了以下益处:

* [改进了 "in process" 编译器执行策略](#improved-in-process-compiler-execution-strategy)
* [更加灵活的配置不同的 Kotlin 编译器版本](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 改进了 "in process" 编译器执行策略 {id="improved-in-process-compiler-execution-strategy"}

KGP 支持 3 种 [Kotlin 编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).
"in-process" 策略, 在 Gradle daemon 进程内运行编译器, 之前不支持增量编译.

现在, 使用 BTA, "in-process" 策略 **能够** 支持增量编译.
要使用它, 请向你的 `gradle.properties` 文件添加以下属性:

```properties
kotlin.compiler.execution.strategy=in-process
```

### 灵活的配置不同的 Kotlin 编译器版本 {id="flexibility-to-configure-different-compiler-versions-from-kotlin"}

有时你可能想要在你的代码中使用更新的 Kotlin 编译器版本, 同时让 KGP 使用旧的版本 –
例如, 试用新的语言功能特性, 但又不想处理构建脚本废弃的问题.
或者, 你可能想要更新 KGP 的版本, 但继续使用旧的 Kotlin 编译器版本.

BTA 可以实现这样的需求. 下面是在你的 `build.gradle.kts` 文件中进行配置的示例:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // 与 2.2.0 不同的版本
}

```

相对于 KGP 的版本, BTA 支持配置的 Kotlin 编译器的版本是, 之前的 3 个主版本, 以及未来的 1 个主版本.
因此在 KGP 2.2.0 中, 支持的 Kotlin 编译器版本是 2.1.x, 2.0.x, 和 1.9.25.
KGP 2.2.0 也兼容于未来的 Kotlin 编译器版本 2.2.x 和 2.3.x.

但是要注意, 使用不同的编译器版本和编译器 plugin, 可能导致 Kotlin 编译器异常.
Kotlin 开发组计划在未来的 Kotlin 发布版中解决这类问题.

请通过这些 plugin 试用 BTA, 并在 [KGP](https://youtrack.jetbrains.com/issue/KT-56574) 和 [Maven plugin](https://youtrack.jetbrains.com/issue/KT-73012) 的 YouTrack ticket 中, 告诉我们你的反馈意见.

## Kotlin 标准库 {id="kotlin-standard-library"}

在 Kotlin 2.2.0 中, [`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 和 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现在成为 [稳定版](components-stability.md#stability-levels-explained).

### 稳定版功能: Base64 编码与解码 {id="stable-base64-encoding-and-decoding"}

Kotlin 1.8.20 引入了 [实验性的 Base64 编码与解码功能](whatsnew1820.md#support-for-base64-encoding).
在 Kotlin 2.2.0 中, [Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 现在成为 [稳定版](components-stability.md#stability-levels-explained), 包括 4 种编码方案, 在这个发布版中增加了新的 `Base64.Pem`:

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/):
  使用标准的 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4).

  > `Base64.Default` 是 `Base64` 类的同伴对象.
  > 因此, 你可以使用 `Base64.encode()` 和 `Base64.decode()` 调用它的函数, 而不是使用 `Base64.Default.encode()` 和 `Base64.Default.decode()`.
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html):
  使用 ["URL 和文件名安全的"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 编码方案.
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html):
  使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 编码方案,
  在编码时, 每 76 个字符插入 1 个行分隔符, 在解码时, 略过非法字符.
* `Base64.Pem`:
  使用与 `Base64.Mime` 类似的方式编码数据, 但是将行的长度限制为 64 个字符.

你可以使用 Base64 API 将二进制数据编码为 Base64 字符串, 然后将它解码回字节数据.

下面是一个示例:

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // 结果为 "Zm8="
// 也可以写为:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // 结果为 "Zm9vYmFy"

Base64.Default.decode("Zm8=") // 结果等于 foBytes
// 也可以写为:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // 结果等于 foobarBytes
```

在 JVM 上, 可以使用 `.encodingWith()` 和 `.decodingWith()` 扩展函数, 使用输入和输出流编码和解码 Base64:

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray()) 
    }

    println(output.toString())
    // 输出结果为: SGVsbG8gV29ybGQhIQ==
}
```

### 稳定版功能: 使用 `HexFormat` API 进行 16 进制数的解析和格式化 {id="stable-hexadecimal-parsing-and-formatting-with-the-hexformat-api"}

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现在成为 [稳定版](components-stability.md#stability-levels-explained).
你可以使用它, 在数字值和 16 进制字符串之间进行转换.

例如:

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

详情请参见, [新的 HexFormat 类, 用于 16 进制数的格式化和解析](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals).

## Compose 编译器 {id="compose-compiler"}

在这个发布版中, Compose 编译器引入了对 Composable 函数引用的支持, 并修改了几个功能特性 flag 的默认值.

### 支持 `@Composable` 函数引用 {id="support-for-composable-function-references"}

从 Kotlin 2.2.0 版开始, Compose 编译器支持 Composable 函数引用的声明和使用:

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

在运行期, Composable 函数引用的行为与 Composable Lambda 对象略微不同.
具体来说, Composable Lambda 能够通过扩展 `ComposableLambda` 类, 更加精细的控制跳过操作.
函数引用需要实现 `KCallable` 接口, 因此不能对它们应用相同的优化.

### `PausableComposition` 功能特性 flag 默认启用 {id="pausablecomposition-feature-flag-enabled-by-default"}

从 Kotlin 2.2.0 开始, `PausableComposition` 功能特性 flag 默认启用.
这个 flag 调整 Compose 编译器对可重启动函数(Restartable Function)的输出, 允许运行期的强制跳过行为, 并因此通过跳过每个函数, 有效的暂停组合.
这样可以将比较重的组合在各个帧(Frame)之间拆分, 在未来的发布版中, 这些帧将被用来预取.

要禁用这个功能特性 flag, 请向你的 Gradle 配置添加以下内容:

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 功能特性 flag 默认启用 {id="optimizenonskippinggroups-feature-flag-enabled-by-default"}

从 Kotlin 2.2.0 开始, `OptimizeNonSkippingGroups` 功能特性 flag 默认启用.
这个优化通过改进为非跳过的(non-skipping) Composable 函数生成的组调用, 改善运行期性能.
它应该不会造成任何能够观察到的运行期行为变化.

如果你遇到任何问题, 可以禁用这个功能特性 flag, 来验证是不是由这个变更造成的问题.
如果有问题, 请报告到 [Jetpack Compose 的问题追踪系统](https://issuetracker.google.com/issues/new?component=610764&template=1424126).

要禁用 `OptimizeNonSkippingGroups` flag, 请向你的 Gradle 配置添加以下内容:

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 废弃的功能特性 flags {id="deprecated-feature-flags"}

`StrongSkipping` 和 `IntrinsicRemember` 功能特性 flags 现在已废弃, 并且将在未来的发布版中删除.
如果你遇到任何问题, 导致你禁用这些功能特性 flag, 请报告到 [Jetpack Compose 的问题追踪系统](https://issuetracker.google.com/issues/new?component=610764&template=1424126).

## 破坏性变更与废弃 {id="breaking-changes-and-deprecations"}

本节重点介绍值得注意的重要破坏性变更和废弃.
关于这个发布版中所有的破坏性变更和废弃, 请参见我们的 [兼容性指南](compatibility-guide-22.md).

* 从 Kotlin 2.2.0 开始, 对 [](ant.md) 构建系统的支持已废弃.
  Kotlin 对 Ant 的支持已经很长时间没有积极的开发, 而且没有计划继续维护, 因为使用者数量相对比较少.
  
  我们计划在 2.3.0 中删除对 Ant 的支持. 但是, Kotlin 仍然欢迎你进行 [贡献](contribute.md).
  如果你有兴趣成为 Ant 的外部维护者, 请在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-75875/) 中留言, 并设置为 "jetbrains-team" 可见.

* Kotlin 2.2.0 将 [Gradle 中的 `kotlinOptions{}` 代码段的废弃级别提升为错误](compatibility-guide-22.md#deprecate-kotlinoptions-dsl).
  请改为使用 `compilerOptions{}` 代码段. 关于如何更新你的构建脚本, 详情请参见 [从 `kotlinOptions{}` 迁移到 `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions).
* Kotlin 脚本仍然是 Kotlin 生态系统的重要组成部分, 但为了提供更好的使用体验, 我们重点关注特定的使用场景, 例如
  自定义脚本, 以及 `gradle.kts` 和 `main.kts` 脚本.
  详情请参见我们更新后的 [blog](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/).
  因此, Kotlin 2.2.0 废弃了以下功能:
  
  * REPL:
    要继续通过 `kotlinc` 使用 REPL, 请使用 `-Xrepl` 编译器选项表示使用者同意(Opt-in).
  * JSR-223:
    由于这个 [JSR](https://jcp.org/en/jsr/detail?id=223) 处于 **撤销** 状态, JSR-223 实现可以在语言版本 1.9 中继续使用, 但未来不会迁移到使用 K2 编译器.
  * `KotlinScriptMojo` Maven plugin:
    我们没有看到这个 plugin 很受欢迎. 如果你继续使用它, 会看到编译器警告.

* 在 Kotlin 2.2.0 中, [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函数现在会 [替换已配置的源, 而不是添加源](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources).
  如果你想要添加源, 而不是替换已有的源, 请使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函数.
* `BaseKapt` 中 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 的类型 [从 `MutableList<Any>` 变更为 `MutableList<CommandLineArgumentProvider>`](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property).
  如果你的代码现在会添加 List 作为单个元素, 请使用 `addAll()` 函数, 而不是 `add()` 函数.
* 过去在旧的 Kotlin/JS 后端中使用的死代码剔除(Dead Code Elimination, DCE) 工具已被废弃,
  相应的, 与 DCE 相关的其它 DSL 现在已从 Kotlin Gradle plugin 中删除:
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 接口
  * `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 函数
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 接口
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 接口

  目前的 [JS IR 编译器](js-ir-compiler.md) 直接支持 DCE, 而且 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解允许指定在 DCE 过程中保留哪些 Kotlin 函数和类.

* 过去废弃的 `kotlin-android-extensions` plugin [在 Kotlin 2.2.0 中已删除](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin).
  请改为使用 `kotlin-parcelize` plugin 来生成 `Parcelable` 实现,
  使用 Android Jetpack 的 [视图绑定](https://developer.android.com/topic/libraries/view-binding) 来生成合成视图(Synthetic View).
* 实验性的 `kotlinArtifacts` API  [在 Kotlin 2.2.0 中已被废弃](compatibility-guide-22.md#deprecate-kotlinartifacts-api).
  请使用 Kotlin Gradle plugin 中当前可用的 DSL 来 [构建最终的原生二进制文件](multiplatform-build-native-binaries.md).
  如果这个迁移不能满足你的需求, 请在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-74953) 中留言.
* `KotlinCompilation.source`, 在 Kotlin 1.9.0 中废弃, 现在 [已从 Kotlin Gradle plugin 中删除](compatibility-guide-22.md#deprecate-kotlincompilation-source-api).
* 实验性功能共通化模式(Commonization Mode) 的参数 [在 Kotlin 2.2.0 中已废弃](compatibility-guide-22.md#deprecate-commonization-parameters).
  请清除共通化缓存, 删除无效的编译 artifact.
* 过去废弃的 `konanVersion` 属性现在 [已从 `CInteropProcess` 任务中删除](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess).
  请改为使用 `CInteropProcess.kotlinNativeVersion`.
* 使用过去废弃的 `destinationDir` 属性现在会 [发生错误](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess).
  请改为使用 `CInteropProcess.destinationDirectory.set()`.

## 文档更新 {id="documentation-updates"}

这个发布版带来了显著的文档变更, 包括 Kotlin Multiplatform 文档迁移到 [KMP 门户站](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html).
此外, 我们发起了一个文档调查, 创建了新的页面和教程, 还修改了现有的页面和教程.

### Kotlin 文档调查 {id="kotlin-s-documentation-survey"}

为了改进 Kotlin 文档, 我们正在寻求真实的反馈意见.

调查大约需要花费 15 分钟完成, 你的回答将会有助于塑造 Kotlin 文档的未来.

[请在这里参加调查](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025).

### 新增和修改的教程 {id="new-and-revamped-tutorials"}

* [Kotlin 中级教程](kotlin-tour-welcome.md) –
  提升你对 Kotlin 的理解. 学习何时使用扩展函数, 接口, 类, 等等.
* [构建一个使用 Spring AI 的 Kotlin 应用程序](spring-ai-guide.md) –
  学习如何创建一个 Kotlin 应用程序, 使用 OpenAI 和向量数据库回答问题.
* [](jvm-create-project-with-spring-boot.md) –
  学习如何使用 IntelliJ IDEA 的 **New Project** 向导, 创建一个使用 Gradle 的 Spring Boot 项目.
* [Kotlin 与 C 之间映射的系列教程](mapping-primitive-data-types-from-c.md) –
  学习如何在 Kotlin  C 之间映射各种类型和结构.
* [使用 C interop 和 libcurl 创建一个应用程序](native-app-with-c-and-libcurl.md) –
  使用 libcurl C 库, 创建一个能够原生运行的简单的 HTTP 客户端.
* [创建你的 Kotlin Multiplatform 库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/create-kotlin-multiplatform-library.html) –
  学习如何使用 IntelliJ IDEA 创建和发布一个跨平台库.
* [使用 Ktor 和 Kotlin Multiplatform 构建一个全栈应用程序](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) –
  这个教程现在使用 IntelliJ IDEA 而不是 Fleet, 以及 Material 3, Ktor 和 Kotlin 的最新版本.
* [在你的 Compose Multiplatform 应用程序中管理本地资源环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-resource-environment.html) –
  学习如何管理应用程序的资源环境, 例如应用程序内的主题和语言.

### 新增和修改的页面 {id="new-and-revamped-pages"}

* [使用 Kotlin 进行 AI 应用程序开发概述](kotlin-ai-apps-development-overview.md) –
  探索 Kotlin 构建基于 AI 的应用程序的能力.
* [Dokka 迁移向导](https://kotlinlang.org/docs/dokka-migration.html) –
  学习如何迁移到 Dokka Gradle plugin 的 v2 版本.
* [](metadata-jvm.md) –
  关于针对 JVM 编译的 Kotlin 类, 读取, 修改, 以及生成 metadata 的向导.
* [CocoaPods 集成](multiplatform-cocoapods-overview.md) –
  通过教程和示例项目, 学习如何设置环境, 添加 Pod 依赖项, 或使用 Kotlin 项目作为 CocoaPod 依赖项.
* 新增页面, 关于 Compose Multiplatform 支持 iOS 功能的稳定发布版:
    * 特别是 [导航](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation.html) 和 [深度链接](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-deep-links.html).
    * [在 Compose 中实现布局](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-layout.html).
    * [本地化字符串](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-localize-strings.html), 以及其他 i18n 页面, 例如支持 RTL 语言.
* [Compose 热重载(Hot Reload)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html) –
  学习如何在你的 Desktop 编译目标中使用 Compose 热重载(Hot Reload)功能, 以及如何将这个功能添加到既有的项目.
* [Exposed 迁移](https://www.jetbrains.com/help/exposed/migrations.html) –
  学习 Exposed 提供的工具, 用于管理数据库 schema 变更.

## 如何更新到 Kotlin 2.2.0 {id="how-to-update-to-kotlin-2-2-0"}

Kotlin plugin 作为一个包含在 IntelliJ IDEA 和 Android Studio 中的捆绑 plugin 发布.

要更新到新的 Kotlin 版本, 请在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 到 2.2.0.
