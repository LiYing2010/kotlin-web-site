[//]: # (title: Kotlin 2.2.20 中的新功能)

<web-summary>阅读 Kotlin 2.2.20 发布说明, 包括新的语言功能特性, Kotlin Multiplatform, JVM, Native, JS, 和 Wasm 的更新, 以及对 Gradle 和 Maven 的构建工具支持.</web-summary>

_[发布日期: 2025/09/10](releases.md#release-history)_

<tldr>
    <p>关于 bug 修复版本 2.2.21, 详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v2.2.21">changelog</a></p>
</tldr>

Kotlin 2.2.20 已经发布了, 为 Web 开发带来了重要变更.
[Kotlin/Wasm 现在进入 Beta 版](#kotlin-wasm),
改进了 [JavaScript 互操作中的异常处理](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop),
[npm 依赖项管理](#separated-npm-dependencies),
[内建的浏览器调试支持](#support-for-debugging-in-browsers-without-configuration),
以及为 `js` 和 `wasmJs` 编译目标新增了 [共用源代码集](#shared-source-set-for-js-and-wasmjs-targets).

此外, 还有以下重要功能:

* **Kotlin Multiplatform**:
  [Swift Export 默认可用](#swift-export-available-by-default), [Kotlin 库跨平台编译进入稳定版](#stable-cross-platform-compilation-for-kotlin-libraries), 以及 [声明共通依赖项的新方法](#new-approach-for-declaring-common-dependencies).
* **语言**:
  [将 Lambda 表达式传递给带有挂起函数类型的重载时的解析的改进](#improved-overload-resolution-for-lambdas-with-suspend-function-types).
* **Kotlin/Native**:
  [支持 Xcode 26, 栈金丝雀(Stack Canary), 以及更小的发布版二进制文件](#kotlin-native).
* **Kotlin/JS**:
  [`Long` 值编译为 JavaScript 的 `BigInt`](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type).

> Compose Multiplatform for Web 进入 Beta 版.
> 详情请参见我们的 [博客文章](https://blog.jetbrains.com/kotlin/2025/09/compose-multiplatform-1-9-0-compose-for-web-beta/).
>
{style="note"}

关于本次更新的概要介绍, 你可以观看以下视频:

<video src="https://www.youtube.com/v/QWpp5-LlTqA" title="What's new in Kotlin 2.2.21"/>

> 关于 Kotlin 的发布周期, 详情请参见 [Kotlin 发布过程](releases.md).
>
{style="tip"}

## IDE 支持 {id="ide-support"}

最新版的 IntelliJ IDEA 和 Android Studio 中捆绑了支持 Kotlin 2.2.20 的 Kotlin plugin.
要更新 Kotlin, 你只需要在构建脚本中将 Kotlin 版本修改为 2.2.20.

详情请参见 [更新到新的发布版](releases.md#update-to-a-new-kotlin-version).

## 语言 {id="language"}

在 Kotlin 2.2.20 中, 你可以试用计划在 Kotlin 2.3.0 中发布的即将到来的语言功能特性, 包括
[改进了将 Lambda 表达式传递给带有 `suspend` 函数类型的重载时的解析](#improved-overload-resolution-for-lambdas-with-suspend-function-types)
和 [在带有明确的返回类型的表达式体中支持 `return` 语句](#support-for-return-statements-in-expression-bodies-with-explicit-return-types).
这个版本还改进了
[对 `when` 表达式的穷尽检查(Exhaustiveness Check)](#data-flow-based-exhaustiveness-checks-for-when-expressions),
[实体化(Reified) `Throwable` 的捕获](#support-for-reified-types-in-catch-clauses) 和 [Kotlin 契约](#improved-kotlin-contracts).

### `suspend` 函数类型的 Lambda 表达式的重载解析的改进 {id="improved-overload-resolution-for-lambdas-with-suspend-function-types"}

之前, 使用通常的函数类型和 `suspend` 函数类型重载一个函数, 在传递 Lambda 表达式时会导致歧义.
你可以使用明确的类型转换来绕过这个错误, 但编译器会错误的报告 `No cast needed` 警告:

```kotlin
// 定义两个重载
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // 失败: 重载解析歧义
    transform({ 42 })

    // 使用明确的类型转换, 但编译器错误的报告 "No cast needed" 警告
    transform({ 42 } as () -> Int)
}
```

通过这次变更, 当你同时定义常规函数类型和 `suspend` 函数类型的重载时, 不带类型转换的 lambda 会解析为常规函数的重载.
使用 `suspend` 关键字可以明确的解析为挂起重载:

```kotlin
// 解析为 transform(() -> Int)
transform({ 42 })

// 解析为 transform(suspend () -> Int)
transform(suspend { 42 })
```

这个行为将在 Kotlin 2.3.0 中默认启用.
如果要现在测试它, 请使用以下编译器选项将语言版本设置为 `2.3`:

```kotlin
-language-version 2.3
```

或在你的 `build.gradle(.kts)` 文件中进行配置:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23610) 中提供你的反馈意见.

### 在带有明确的返回类型的表达式体中支持 `return` 语句 {id="support-for-return-statements-in-expression-bodies-with-explicit-return-types"}

之前, 在表达式体中使用 `return` 会导致编译器错误, 因为它可能导致函数的返回类型被推断为 `Nothing`.

```kotlin
fun example() = return 42
// 错误: 禁止在带有表达式体的函数中使用 return
```

通过这次变更, 只要明确的写出返回类型, 你现在就可以在表达式体中使用 `return`:

```kotlin
// 明确指定返回类型
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// 失败, 因为没有明确指定返回类型
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

类似的, 带有表达式体的函数中, Lambda 表达式和嵌套表达式内的 `return` 语句以前会被不正确的编译.
Kotlin 现在支持这些使用场景, 只要明确指定了返回类型. 没有明确返回类型的情况将在 Kotlin 2.3.0 中被废弃:

```kotlin
// 没有明确指定返回类型, 而且 return 语句在 Lambda 表达式内部
// 这种使用场景将被废弃
fun returnInsideLambda() = run { return 42 }

// 没有明确指定返回类型, 而且 return 语句在局部变量的初始化器内部
// 这种使用场景将被废弃
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

这个行为将在 Kotlin 2.3.0 中默认启用.
如果要现在测试它, 请使用以下编译器选项将语言版本设置为 `2.3`:

```kotlin
-language-version 2.3
```

或在你的 `build.gradle(.kts)` 文件中进行配置:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76926) 中提供你的反馈意见.

### 对 `when` 表达式基于数据流的穷尽检查(Exhaustiveness Check) {id="data-flow-based-exhaustiveness-checks-for-when-expressions"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 为 `when` 表达式引入了基于 **数据流的** 穷尽检查(Exhaustiveness Check).
之前, 编译器的检查仅限于 `when` 表达式本身, 通常迫使你添加多余的 `else` 分支.
通过这个更新, 编译器现在会跟踪之前的条件检查和提前返回, 因此你可以删除多余的 `else` 分支.

例如, 编译器现在能够识别出, 函数在满足 `if` 条件时会返回, 因此 `when` 表达式只需要处理其余情况:

```kotlin
enum class UserRole { ADMIN, MEMBER, GUEST }

fun getPermissionLevel(role: UserRole): Int {
    // 已经在 when 表达式之外处理了 Admin 的情况
    if (role == UserRole.ADMIN) return 99

    return when (role) {
        UserRole.MEMBER -> 10
        UserRole.GUEST -> 1
        // 不再需要包含这个 else 分支
        // else -> throw IllegalStateException()
    }
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要启用它, 请在你的 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xdata-flow-based-exhaustiveness")
    }
}
```

### 在 `catch` 子句中支持实体化类型 {id="support-for-reified-types-in-catch-clauses"}
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.2.20 中, 编译器现在允许在 `inline` 函数的 `catch` 子句中使用
[实体化的泛型类型参数](inline-functions.md#reified-type-parameters).

下面是一个示例:

```kotlin
inline fun <reified ExceptionType : Throwable> handleException(block: () -> Unit) {
    try {
        block()
        // 这次变更之后现在允许这样做
    } catch (e: ExceptionType) {
        println("Caught specific exception: ${e::class.simpleName}")
    }
}

fun main() {
    // 尝试执行一个可能抛出 IOException 的操作
    handleException<java.io.IOException> {
        throw java.io.IOException("File not found")
    }
    // 输出结果为: Caught specific exception: IOException
}
```

之前, 在 `inline` 函数中尝试捕获实体化的 `Throwable` 类型会导致错误.

这个行为将在 Kotlin 2.4.0 中默认启用.
如果要现在使用它, 请在你的 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-reified-type-in-catch")
    }
}
```

Kotlin 团队感谢外部贡献者 [Iven Krall](https://github.com/kralliv) 的贡献.

### Kotlin 契约的改进 {id="improved-kotlin-contracts"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 对 [Kotlin 契约](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/contract.html)
引入了几项改进, 包括:

* [在契约类型断言中支持泛型](#support-for-generics-in-contract-type-assertions).
* [在属性访问器和特定的操作符函数中支持使用契约](#support-for-contracts-inside-property-accessors-and-specific-operator-functions).
* [在契约中支持 `returnsNotNull()` 函数](#support-for-the-returnsnotnull-function-in-contracts),
  作为确保在满足条件时返回非 null 值的方式.
* [新的 `holdsIn` 关键字](#new-holdsin-keyword),
  允许你假设在 Lambda 表达式内部传递时条件为 true.

这些改进是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 你仍然需要在声明契约时使用 `@OptIn(ExperimentalContracts::class)` 注解.
`holdsIn` 关键字和 `returnsNotNull()` 函数也需要 `@OptIn(ExperimentalExtendedContracts::class)` 注解.

要使用这些改进, 你还需要添加下面各个章节中描述的编译器选项.

欢迎在我们的 [问题追踪系统](https://kotl.in/issue) 中提供你的反馈意见.

#### 在契约类型断言中支持泛型 {id="support-for-generics-in-contract-type-assertions"}

你现在可以编写契约, 对泛型类型进行类型断言:

```kotlin
import kotlin.contracts.*

sealed class Failure {
    class HttpError(val code: Int) : Failure()
    // 在这里添加其他失败类型
}

sealed class Result<out T, out F : Failure> {
    class Success<T>(val data: T) : Result<T, Nothing>()
    class Failed<F : Failure>(val failure: F) : Result<Nothing, F>()
}

@OptIn(ExperimentalContracts::class)
// 使用契约来断言泛型类型
fun <T, F : Failure> Result<T, F>.isHttpError(): Boolean {
    contract {
        returns(true) implies (this@isHttpError is Result.Failed<Failure.HttpError>)
    }
    return this is Result.Failed && this.failure is Failure.HttpError
}
```

在这个示例中, 契约对 `Result` 对象执行类型断言, 让编译器能够安全的将它 [智能类型转换](typecasts.md#smart-casts) 为断言的泛型类型.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在你的 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 在属性访问器和特定的操作符函数中支持使用契约 {id="support-for-contracts-inside-property-accessors-and-specific-operator-functions"}

你现在可以在属性访问器和特定的操作符函数中定义契约.
因此你能够在更多类型的声明中使用契约, 更加灵活.

例如, 你可以在 getter 中使用契约, 为接收者对象启用智能类型转换:

```kotlin
import kotlin.contracts.*

val Any.isHelloString: Boolean
    get() {
        @OptIn(ExperimentalContracts::class)
        // 当 getter 返回 true 时, 将接收者智能类型转换为 String
        contract { returns(true) implies (this@isHelloString is String) }
        return "hello" == this
    }

fun printIfHelloString(x: Any) {
    if (x.isHelloString) {
        // 将接收者智能类型转换为 String, 然后打印长度
        println(x.length)
        // 输出结果为: 5
    }
}
```

此外, 你可以在以下操作符函数中使用契约:

* `invoke`
* `contains`
* `rangeTo`, `rangeUntil`
* `componentN`
* `iterator`
* `unaryPlus`, `unaryMinus`, `not`
* `inc`, `dec`

下面的示例, 演示在操作符函数中使用契约, 确保在 Lambda 表达式内部完成变量的初始化:

```kotlin
import kotlin.contracts.*

class Runner {
    @OptIn(ExperimentalContracts::class)
    // 允许 Lambda 表达式内部赋值的变量进行初始化
    operator fun invoke(block: () -> Unit) {
        contract {
            callsInPlace(block, InvocationKind.EXACTLY_ONCE)
        }
        block()
    }
}

fun testOperator(runner: Runner) {
    val number: Int
    runner {
        number = 1
    }
    // 由契约保证明确的初始化, 然后打印值
    println(number)
    // 输出结果为: 1
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在你的 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-contracts-on-more-functions")
    }
}
```

#### 在契约中支持 `returnsNotNull()` 函数 {id="support-for-the-returnsnotnull-function-in-contracts"}

Kotlin 2.2.20 为契约引入了 [`returnsNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/returns-not-null.html) 函数.
你可以使用这个函数, 确保函数在满足特定条件时返回非 null 值.
这个功能可以将分别存在的可 null 和非 null 函数重载, 替换为单个简洁的函数, 简化你的代码:

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun decode(encoded: String?): String? {
    contract {
        // 当输入不为 null 时保证返回非 null 值
        (encoded != null) implies (returnsNotNull())
    }
    if (encoded == null) return null
    return java.net.URLDecoder.decode(encoded, "UTF-8")
}

fun useDecodedValue(s: String?) {
    // 使用安全调用, 因为返回值可能为 null
    decode(s)?.length
    if (s != null) {
        // 智能类型转换, 然后将返回值视为非 null
        decode(s).length
    }
}
```

在这个示例中, `decode()` 函数中的契约, 让编译器能够在输入不为 null 时对返回值进行智能类型转换,
因此不要进行额外的 null 值检查, 也不需要多个重载函数.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在你的 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-condition-implies-returns-contracts")
    }
}
```

#### 新的 `holdsIn` 关键字 {id="new-holdsin-keyword"}

Kotlin 2.2.20 为契约引入了新的 [`holdsIn`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/holds-in.html) 关键字.
你可以使用它, 确保在特定的 Lambda 表达式内部, 某个布尔条件能够被假定为 `true`.
这让你能够使用契约构建有条件的智能类型转换的 DSL.

下面是一个示例:

```kotlin
import kotlin.contracts.*

@OptIn(ExperimentalContracts::class, ExperimentalExtendedContracts::class)
fun <T> T.alsoIf(condition: Boolean, block: (T) -> Unit): T {
    contract {
        // 声明 Lambda 表达式最多运行一次
        callsInPlace(block, InvocationKind.AT_MOST_ONCE)
        // 声明在 Lambda 表达式内部 condition 假定为 true
        condition holdsIn block
    }
    if (condition) block(this)
    return this
}

fun useApplyIf(input: Any) {
    val result = listOf(1, 2, 3)
        .first()
        .alsoIf(input is Int) {
            // input 参数在 Lambda 表达式内部被智能类型转换为 Int
            // 打印 input 与列表第 1 个元素的和
            println(input + it)
            // 输出结果为: 2
        }
        .toString()
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在你的 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-holdsin-contract")
    }
}
```

## Kotlin/JVM: 支持 `when` 表达式使用 `invokedynamic` {id="kotlin-jvm-support-invokedynamic-with-when-expressions"}
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.2.20 中, 你现在可以使用 `invokedynamic` 来编译 `when` 表达式.
之前, 带有多个类型检查的 `when` 表达式, 在字节码中会被编译为一长串 `instanceof` 检查.

现在, 当满足以下条件时, 你可以在 `when` 表达式中使用 `invokedynamic`, 生成更小的字节码,
类似于 Java `switch` 语句生成的字节码:

* 除 `else` 外, 所有条件都是 `is` 或 `null` 检查.
* 表达式不包含 [保护条件(Guard Condition) (`if`)](control-flow.md#guard-conditions-in-when-expressions).
* 条件不包含无法直接进行类型检查的类型, 例如可变的 Kotlin 集合 (`MutableList`) 或函数类型 (`kotlin.Function1`, `kotlin.Function2`, 等等).
* 除 `else` 之外, 至少有两个条件.
* 所有的分支, 都检查 `when` 表达式的同一个主语(subject).

例如:

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // 使用 invokedynamic 和 SwitchBootstraps.typeSwitch
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

启用新功能后, 这个示例中的 `when` 表达式会编译为单个 `invokedynamic` type switch,
而不是多个 `instanceof` 检查.

要启用这个功能, 请使用 JVM 21 编译目标或更高版本来编译 Kotlin 代码, 并添加以下编译器选项:

```bash
-Xwhen-expressions=indy
```

或在你的 `build.gradle(.kts)` 文件的 `compilerOptions {}` 代码块中添加:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688) 中提供你的反馈意见.

## Kotlin Multiplatform {id="kotlin-multiplatform"}

Kotlin 2.2.20 为 Kotlin Multiplatform 引入了重大变更: Swift Export 默认可用,
添加了新的共用源代码集, 你可以尝试管理共通依赖项的新方法.

### Swift Export 默认可用 {id="swift-export-available-by-default"}
<primary-label ref="experimental-general"/>

Kotlin 2.2.20 引入了对 Swift Export 的实验性支持.
这个功能让你直接导出 Kotlin 源代码, 并以符合 Swift 习惯的方式从 Swift 调用 Kotlin 代码, 不需要使用 Objective-C 头文件.

这个功能应该会显著改善 Apple 编译目标的跨平台开发.
例如, 如果你有一个带有顶层函数的 Kotlin 模块, Swift Export 可以实现简洁的, 特定模块的导入,
不再需要令人困惑的 Objective-C 下划线和混淆名称.

主要功能包括:

* **多模块支持**.
  每个 Kotlin 模块导出为独立的 Swift 模块, 简化了函数调用.
* **包支持**.
  在导出期间明确的保留 Kotlin 包, 避免在生成的 Swift 代码中发生命名冲突.
* **类型别名**.
  Kotlin 类型别名在导出时会保留在 Swift 中, 提高了可读性.
* **对基本类型增强的可 null 性**.
  Objective-C 互操作需要将 `Int?` 等类型装箱到 `KotlinInt` 等包装类中来保留可 null 性,
  Swift Export 与此不同, 能够直接转换可 null 性信息.
* **重载**.
  你可以在 Swift 中调用 Kotlin 的重载函数, 不会产生歧义.
* **扁平化的包结构**.
  你可以将 Kotlin 包转换为 Swift 枚举, 从生成的 Swift 代码中删除包前缀.
* **模块名称自定义**.
  你可以在 Kotlin 项目的 Gradle 配置中, 自定义生成的 Swift 模块名称.

#### 如何启用 Swift Export {id="how-to-enable-swift-export"}

这个功能目前是 [实验性功能](components-stability.md#stability-levels-explained), 只能在使用 [直接集成](multiplatform-direct-integration.md)
将 iOS 框架连接到 Xcode 项目的项目中使用.
这是使用 IntelliJ IDEA 中的 Kotlin Multiplatform Plugin, 或通过 [Web 向导](https://kmp.jetbrains.com/), 创建跨平台项目的标准配置.

要试用 Swift Export, 请配置你的 Xcode 项目:

1. 在 Xcode 中, 打开项目设置.
2. 在 **Build Phases** 页面, 找到包含 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段.
3. 在 run script 阶段中, 调整脚本, 改为使用 `embedSwiftExportForXcode` 任务:

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![添加 Swift Export 脚本](xcode-swift-export-run-script-phase.png){width=700}

4. 构建项目. Swift 模块会在构建输出的目录中生成.

这个功能默认可用. 如果你在之前的版本中已经启用过它, 现在可以从 `gradle.properties` 文件删除 `kotlin.experimental.swift-export.enabled`.

> 为了节省时间, 请克隆我们的 [公共示例](https://github.com/Kotlin/swift-export-sample), 其中已经配置好了 Swift Export.
>
{style="tip"}

关于 Swift Export, 详情请参见我们的 [文档](native-swift-export.md).

#### 留下反馈意见 {id="leave-feedback"}

我们计划在未来的 Kotlin 版本中扩展并逐步稳定 Swift Export 功能.
在 Kotlin 2.2.20 之后, 我们将专注于改善 Kotlin 和 Swift 之间的互操作性, 特别是围绕协程和流的功能.

对 Swift Export 的支持是 Kotlin Multiplatform 的重大变更. 欢迎提供你的反馈意见:

* 在 Kotlin Slack 中直接联系开发团队 —
  [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  并加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 频道.
* 如果你在使用 Swift Export 时遇到的任何问题, 请在 [YouTrack](https://kotl.in/issue) 中报告.

### `js` 和 `wasmJs` 编译目标的共用源代码集 {id="shared-source-set-for-js-and-wasmjs-targets"}

之前, Kotlin Multiplatform 默认不包含 JavaScript (`js`) 和 WebAssembly (`wasmJs`) Web 编译目标的共用源代码集.
要在 `js` 和 `wasmJs` 之间共用代码, 你必须手动配置自定义源代码集, 或在两个地方编写代码, 一个版本用于 `js`, 另一个用于 `wasmJs`.
例如:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// jsMain
external interface Navigator { val clipboard: Clipboard }
// JS 和 Wasm 中不同的互操作
external interface Clipboard { fun readText(): Promise<String> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    // JS 和 Wasm 中不同的互操作
    return navigator.clipboard.readText().await()
}

// wasmJsMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

从这个版本开始, 当你使用 [默认层次结构模板](multiplatform-hierarchy.md#default-hierarchy-template) 时,
Kotlin Gradle plugin 会为 Web 添加新的共用源代码集 (包含 `webMain` 和 `webTest`).

通过这次变更, `web` 源代码集成为 `js` 和 `wasmJs` 源代码集共同的父源代码集.
更新后的源代码集层次结构如下所示:

![使用带有 web 的默认层次结构模板的示例](default-hierarchy-example-with-web.svg)

新的源代码集让你能够为 `js` 和 `wasmJs` 编译目标编写一段代码.
你可以将共用代码放在 `webMain` 中, 它会自动对两者有效:

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
@OptIn(ExperimentalWasmJsInterop::class)
private suspend fun <R : JsAny?> Promise<R>.await(): R = suspendCancellableCoroutine { continuation ->
    this.then(
        onFulfilled = { continuation.resumeWith(Result.success(it)); null },
        onRejected = { continuation.resumeWithException(it.asJsException()); null }
    )
}

external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

actual suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

这次更新简化了 `js` 和 `wasmJs` 编译目标之间的代码共用. 在两种情况下特别有用:

* 如果你是库的作者, 想要同时支持 `js` 和 `wasmJs` 编译目标, 而不需要重复代码.
* 如果你正在开发面向 Web 的 Compose Multiplatform 应用程序, 为 `js` 和 `wasmJs` 编译目标启用交叉编译,
  以获得更广泛的浏览器兼容性. 通过这种回退模式, 当你创建网站时, 它可以开箱即用的在所有浏览器上工作,
  现代浏览器使用 `wasmJs`, 旧浏览器使用 `js`.

要试用这个功能, 请在你的 `build.gradle(.kts)` 文件的 `kotlin {}` 代码块中使用 [默认层次结构模板](multiplatform-hierarchy.md#default-hierarchy-template):

```kotlin
kotlin {
    js()
    wasmJs()

    // 启用默认源代码集层次结构, 包括 webMain 和 webTest
    applyDefaultHierarchyTemplate()
}
```

在使用默认层次结构之前, 如果你的项目带有自定义的共用源代码集, 或者你重命名了 `js("web")` 编译目标, 请仔细考虑潜在的冲突.
要解决这些冲突, 请重命名冲突的源代码集或编译目标, 或者不使用默认层次结构.

### Kotlin 库跨平台编译进入稳定版 {id="stable-cross-platform-compilation-for-kotlin-libraries"}

Kotlin 2.2.20 完成了一个重要的 [路线图项目](https://youtrack.jetbrains.com/issue/KT-71290),
Kotlin 库的跨平台编译进入稳定版.

你现在可以使用任何 [支持的主机](native-target-support.md#hosts) 来生成 `.klib` artifact, 用于发布 Kotlin 库.
这个功能显著简化了发布流程, 特别是对于之前需要 Mac 机器的 Apple 编译目标.

这个功能默认可用. 如果你已通过 `kotlin.native.enableKlibsCrossCompilation=true` 启用了跨编译,
现在可以从 `gradle.properties` 文件中删除它.

不幸的是, 仍然存在少量限制. 在以下情况下你仍然需要使用 Mac 机器:

* 你的库或任何依赖项模块具有 [cinterop 依赖项](native-c-interop.md).
* 你的项目中设置了 [CocoaPods 集成](multiplatform-cocoapods-overview.md).
* 你需要构建或测试 Apple 编译目标的 [最终二进制文件](multiplatform-build-native-binaries.md).

关于跨平台库的发布, 详情请参见我们的 [文档](multiplatform-publish-lib-setup.md).

### 声明共通依赖项的新方法 {id="new-approach-for-declaring-common-dependencies"}
<primary-label ref="experimental-opt-in"/>

为了更简单的使用 Gradle 设置跨平台项目, 当你的项目使用 Gradle 8.8 或更高版本时,
Kotlin 2.2.20 现在允许你在 `kotlin {}` 代码块中使用顶层 `dependencies {}` 代码块声明共通依赖项.
这些依赖项的行为就像它们在 `commonMain` 源代码集中声明的一样.
这个功能的工作方式类似于你为 Kotlin/JVM 和纯 Android 项目使用的依赖项代码块,
它现在在 Kotlin Multiplatform 中处于 [实验性](components-stability.md#stability-levels-explained) 阶段.

在项目级别声明共通依赖项, 减少了各个源代码集中的重复配置, 有助于简化构建设置.
你仍然可以在各个源代码集中根据需要添加平台特定的依赖项.

要试用这个功能, 请在顶层 `dependencies {}` 代码块前添加 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解,
来表示使用者同意(Opt-in). 例如:

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 中提供你对这个功能的反馈意见.

### 关于依赖项中编译目标支持的新的诊断 {id="new-diagnostic-for-target-support-in-dependencies"}

在 Kotlin 2.2.20 之前, 如果构建脚本中的依赖项不支持源代码集所需的所有编译目标,
Gradle 产生的错误消息让你很难理解问题的原因.

Kotlin 2.2.20 引入了新的诊断, 清楚的显示每个依赖项支持和不支持哪些编译目标.

这个诊断默认启用. 如果由于某种原因你需要禁用它, 请在这个 [YouTrack issue](https://kotl.in/kmp-dependencies-diagnostic-issue) 中留言告诉我们.
你可以在 `gradle.properties` 文件中, 使用以下 Gradle 属性来禁用诊断:

| 属性                                                     | 说明                         |
|----------------------------------------------------------|------------------------------|
| `kotlin.kmp.eagerUnresolvedDependenciesDiagnostic=false` | 只对元数据编译和导入运行诊断 |
| `kotlin.kmp.unresolvedDependenciesDiagnostic=false`      | 完全禁用诊断                 |

## Kotlin/Native {id="kotlin-native"}

这个发布版带来了对 Xcode 26 的支持, 以及对 Objective-C/Swift 互操作性, 调试和新二进制选项的改进.

### 支持 Xcode 26 {id="support-for-xcode-26"}

从 Kotlin 2.2.2**1** 开始, Kotlin/Native 编译器支持 Xcode 26 — Xcode 的最新稳定版本.
你现在可以更新 Xcode, 并访问最新的 API, 继续开发面向 Apple 操作系统的 Kotlin 项目.

### 支持二进制文件中的栈金丝雀(Stack Canary) {id="support-for-stack-canaries-in-binaries"}

从 Kotlin 2.2.20 开始, Kotlin 在生成的 Kotlin/Native 二进制文件中支持栈金丝雀(Stack Canary).
作为栈保护的一部分, 这个安全功能可以防止栈溢出攻击, 缓解一些常见的应用程序安全漏洞.
这个功能在 Swift 和 Objective-C 中已经可用, 现在 Kotlin 也支持了.

Kotlin/Native 中栈保护的实现, 遵循 [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector)
中的栈保护器的行为.

要启用栈金丝雀, 请在你的 `gradle.properties` 文件中添加以下 [二进制选项](native-binary-options.md):

```properties
kotlin.native.binary.stackProtector=yes
```

这个属性为所有容易受到栈溢出攻击的 Kotlin 函数启用这个功能.
其它模式包括:

* `kotlin.native.binary.stackProtector=strong`, 对容易受到栈溢出攻击的函数, 使用更强的启发式方法.
* `kotlin.native.binary.stackProtector=all`, 为所有函数启用栈保护器.

请注意, 在某些情况下, 栈保护可能会带来性能开销.

### 更小的发布版二进制文件 {id="smaller-binary-size-for-release-binaries"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了 `smallBinary` 选项, 可以帮助你减小发布版二进制文件的大小.
这个新选项在 LLVM 编译阶段, 将 `-Oz` 设置为编译器的默认优化参数.

启用 `smallBinary` 选项后, 你可以使发布版二进制文件更小, 并改善构建时间.
但是, 在某些情况下可能会影响运行时性能.

这个新功能目前是 [实验性功能](components-stability.md#stability-levels-explained).
要在你的项目中试用, 请在你的 `gradle.properties` 文件中添加以下 [二进制选项](native-binary-options.md):

```properties
kotlin.native.binary.smallBinary=true
```

Kotlin 团队感谢 [Troels Lund](https://github.com/troelsbjerre) 帮助实现这个功能.

### 调试器对象摘要的改进 {id="improved-debugger-object-summaries"}

Kotlin/Native 现在为 LLDB 和 GDB 等调试器工具生成更清晰的对象摘要.
这个功能改善了生成的调试信息的可读性, 提升你的调试体验.

例如, 对于下面的对象:

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

之前, 检查只会显示少量信息, 包括指向对象内存地址的指针:

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

在 Kotlin 2.2.20 中, 调试器现在会显示更丰富的细节, 包括实际的值:

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlin 团队感谢 [Nikita Nazarov](https://github.com/nikita-nazarov) 帮助实现这个功能.

关于 Kotlin/Native 调试, 详情请参见 [文档](native-debugging.md).

### Objective-C 头文件中代码块类型的明确名称 {id="explicit-names-in-block-types-for-objective-c-headers"}

Kotlin 2.2.20 引入了一个选项, 为从 Kotlin/Native 项目导出的 Objective-C 头文件中 Kotlin 的函数类型, 添加明确的参数名称.
参数名称改善了 Xcode 中的自动补全建议, 有助于避免 Clang 警告.

之前, 在生成的 Objective-C 头文件中, 省略了代码块类型的参数名称.
在这种情况下, Xcode 的自动补全会建议在 Objective-C 代码块中调用这类函数时, 不使用参数名称.
生成的代码块会触发 Clang 警告.

例如, 对于以下 Kotlin 代码:

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

生成的 Objective-C 头文件没有参数名称:

```objc
// Objective-C:
+ (void)greetUserBlock:(void (^)(NSString *))block __attribute__((swift_name("greetUser(block:)")));
```

因此, 当在 Xcode 中从 Objective-C 调用 `greetUserBlock()` 函数时, IDE 会建议:

```objc
// Objective-C:
greetUserBlock:^(NSString *) {
    // ...
};
```

建议中缺少参数名称 `(NSString *)`, 导致 Clang 警告.

使用新选项, Kotlin 将参数名称从 Kotlin 函数类型传递到 Objective-C 代码块类型, 因此 Xcode 会在建议中使用它们:

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

要启用明确的参数名称, 请在你的 `gradle.properties` 文件中添加以下 [二进制选项](native-binary-options.md):

```properties
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

Kotlin 团队感谢 [Yijie Jiang](https://github.com/edisongz) 实现了这个功能.

### 减小了 Kotlin/Native 发行版大小 {id="reduced-size-of-kotlin-native-distribution"}

Kotlin/Native 发行版以前包含两个 JAR 文件, 带有编译器代码:

* `konan/lib/kotlin-native.jar`
* `konan/lib/kotlin-native-compiler-embeddable.jar`.

从 Kotlin 2.2.20 开始, `kotlin-native.jar` 不再发布.

被删除的 JAR 文件是可嵌入编译器的旧版本, 它不再需要. 这次变更显著减小了发行版的大小.

因此, 以下选项现在已被废弃并删除:

* `kotlin.native.useEmbeddableCompilerJar=false` Gradle 属性.
  相反, Kotlin/Native 项目始终使用可嵌入编译器 JAR 文件.
* `KotlinCompilerPluginSupportPlugin.getPluginArtifactForNative()` 函数.
  相反, 始终使用 [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html)
  函数.

详情请参见 [YouTrack issue](https://kotl.in/KT-51301).

### 默认将 KDoc 导出到 Objective-C 头文件 {id="exporting-kdocs-to-objective-c-headers-by-default"}

在编译 Kotlin/Native 最终二进制文件时, 生成 Objective-C 头文件时, 现在默认会导出 [KDoc](kotlin-doc.md) 注释.

之前, 你需要手动在构建文件中添加 `-Xexport-kdoc` 选项. 现在, 它会自动传递给编译任务.

这个选项将 KDoc 注释嵌入到 klib 中, 并在生成 Apple 框架时从 klib 中提取注释.
因此, 例如在 Xcode 中, 自动补全会显示类和方法上的注释.

你可以在你的 `build.gradle(.kts)` 文件的 `binaries {}` 代码块中,
禁用从 klib 到生成的 Apple 框架的 KDoc 注释导出:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework {
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

详情请参见 [我们的文档](native-objc-interop.md#provide-documentation-with-kdoc-comments).

### 废弃 `x86_64` Apple 编译目标 {id="deprecation-of-x86-64-apple-targets"}

Apple 在几年前停止生产搭载 Intel 芯片的设备, 并 [最近宣布](https://www.youtube.com/live/51iONeETSng?t=3288s)
macOS Tahoe 26 将是最后一个支持 Intel 架构的 OS 版本.

这使我们越来越难以在构建代理上正确测试这些编译目标, 尤其是,
在未来 Kotlin 发布版本中, 我们会更新 macOS 26 附带的支持 Xcode 版本.

从 Kotlin 2.2.20 开始, `macosX64` 和 `iosX64` 编译目标被降级为第 2 层支持.
也就是说, 编译目标会在 CI 上进行常规测试, 确保能够编译, 但可能不会自动测试, 确保它能运行.

我们计划在 Kotlin 2.2.20-2.4.0 发布周期中, 逐步废弃所有 `x86_64` Apple 编译目标, 最终删除对它们的支持.
包括以下编译目标:

* `macosX64`
* `iosX64`
* `tvosX64`
* `watchosX64`

关于支持层级, 详情请参见 [Kotlin/Native 编译目标支持](native-target-support.md).

## Kotlin/Wasm {id="kotlin-wasm"}

Kotlin/Wasm 现在进入 Beta 版, 提供更高的稳定性和改进, 例如单独的 npm 依赖项,
[JavaScript 互操作异常处理的改进](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop),
[内置的浏览器调试支持](#support-for-debugging-in-browsers-without-configuration), 等等.

### 单独的 npm 依赖项 {id="separated-npm-dependencies"}

之前, 在你的 Kotlin/Wasm 项目中, 所有 [npm](https://www.npmjs.com/) 依赖项都安装在你的项目文件夹中, 包括 Kotlin 工具依赖项和你自己的依赖项.
它们也一起记录在你的项目锁文件中(`package-lock.json` 或 `yarn.lock`).

因此, 每当 Kotlin 工具依赖项更新时, 你都必须更新锁文件, 即使你没有添加或更改任何内容.

从 Kotlin 2.2.20 开始, Kotlin 工具 npm 依赖项安装在你的项目之外.
现在, 工具依赖项和你的(用户)依赖项使用单独的目录:

* **工具依赖项的目录:**

  `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

* **用户依赖项的目录:**

  `build/wasm/node_modules`

此外, 项目目录中的锁文件只包含用户定义的依赖项.

这个改进让你的锁文件只关注你自己的依赖项, 有助于保持项目整洁, 并减少文件中不必要的更改.

这个更改对 `wasm-js` 编译目标默认启用. 这个更改还没有为 `js` 编译目标实现.
虽然我们计划在未来版本中实现它, 但在 Kotlin 2.2.20 中, `js` 编译目标的 npm 依赖项行为与以前相同.

### Kotlin/Wasm 和 JavaScript 互操作中异常处理的改进 {id="improved-exception-handling-in-kotlin-wasm-and-javascript-interop"}

之前, Kotlin 很难理解在 JavaScript (JS) 中抛出并传递到 Kotlin/Wasm 代码的异常(错误).

在某些情况下, 对相反的方向也会出现问题, 当异常从 Wasm 代码抛出或传递到 JS 时,
会被包装到 `WebAssembly.Exception` 中, 不包含任何详细信息.
这些 Kotlin 异常处理问题会造成调试困难.

从 Kotlin 2.2.20 开始, 异常处理的开发者体验对两个方向都得到了改善:

* 从 JS 抛出异常时, 你可以在 Kotlin 端看到更多信息.
  当这样的异常通过 Kotlin 传播回 JS 时, 它不再被包装到 WebAssembly 中.
* 从 Kotlin 抛出异常时, 现在可以在 JS 端将其作为 JS 错误捕获.

在支持 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag)
功能的现代浏览器中, 会自动启用新的异常处理:

* Chrome 115+
* Firefox 129+
* Safari 18.4+

在旧版本的浏览器中, 异常处理行为保持不变.

### 在浏览器中支持调试, 不需要配置 {id="support-for-debugging-in-browsers-without-configuration"}

之前, 浏览器在调试时, 不能自动访问需要的 Kotlin/Wasm 项目源代码.
为了在浏览器中调试 Kotlin/Wasm 应用程序, 你必须在 `build.gradle(.kts)` 文件中添加以下代码,
手动配置构建来提供这些源代码:

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        add(project.rootDir.path)
    }
}
```

从 Kotlin 2.2.20 开始, 在 [现代浏览器](wasm-configuration.md#browser-versions) 中调试应用程序的功能直接可以使用.
当你运行 Gradle 开发任务 (`*DevRun`) 时, Kotlin 会自动将源代码文件提供给浏览器,
你可以设置断点, 检查变量, 以及单步执行 Kotlin 代码, 不需要额外的设置.

这次变更消除了手动配置的需要, 简化了调试功能. 需要的配置现在已包含在 Kotlin Gradle 插件中.
如果你之前在 `build.gradle(.kts)` 文件中添加了这个配置, 应该删除它, 以避免冲突.

浏览器中的调试功能, 默认对所有 Gradle `*DevRun` 任务启用.
这些任务不仅对浏览器提供应用程序, 还提供它的源代码文件, 因此请只在本地开发中使用它们,
不要在云或生产环境中运行, 在这些环境中源代码会被暴露到公开环境.

#### 处理调试期间的反复加载 {id="handle-repeated-reloads-during-debugging"}

默认提供源代码可能会导致 [在 Kotlin 编译和打包完成之前, 浏览器中应用程序的反复加载](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0).
变通方法是, 请调整你的 webpack 配置, 忽略 Kotlin 源代码文件, 并禁用对提供的静态文件的监视.
在你项目根目录的 `webpack.config.d` 目录中, 添加一个 `.js` 文件, 包含以下内容:

```kotlin
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
        return { directory: file,
                 watch: false,
        }
    } else {
        return file
    }
    })
}
```

### 消除空的 `yarn.lock` 文件 {id="elimination-of-empty-yarn-lock-files"}

之前, Kotlin Gradle plugin (KGP) 会自动生成一个 `yarn.lock` 文件,
其中包含有关 Kotlin 工具链需要的 npm 包的信息, 以及项目或使用库中现有的 [npm](https://www.npmjs.com/) 依赖项.

现在, KGP 单独管理工具链依赖项, 除非项目存在 npm 依赖项, 否则不再生成项目级 `yarn.lock` 文件.

当添加 npm 依赖项时, KGP 会自动创建 `yarn.lock` 文件, 并在删除 npm 依赖项时删除 `yarn.lock` 文件.

这次变更清理了项目结构, 让引入实际的 npm 依赖项时, 更容易追踪.

不需要额外步骤来配置这个行为. 从 Kotlin 2.2.20 开始默认应用于 Kotlin/Wasm 项目.

### 完全限定类名中的新编译器错误 {id="new-compiler-error-in-fully-qualified-class-names"}

在 Kotlin/Wasm 上, 编译器默认不会在生成的二进制文件中存储类的完全限定名称(Fully Qualified Name, FQN).
这种方法能够避免增加应用程序大小.

因此, 在之前的 Kotlin 版本中, 调用 `KClass::qualifiedName` 属性会返回空字符串, 而不是类的限定名称.

从 Kotlin 2.2.20 开始, 除非你明确的启用限定名称功能, 否则在 Kotlin/Wasm 项目中使用 `KClass::qualifiedName` 属性时,
编译器会报告错误.

这个变更防止了调用 `qualifiedName` 属性时出现意外的空字符串, 并在编译时捕获问题, 改善了开发者体验.

诊断默认启用, 错误自动报告.
要禁用诊断并允许在 Kotlin/Wasm 中存储 FQN, 请在你的 `build.gradle(.kts)` 文件中添加以下选项, 指示编译器为所有类存储完全限定名称:

```kotlin
kotlin {
    wasmJs {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

> 请注意, 启用这个选项会增加应用程序大小.
>
{style="note"}

## Kotlin/JS {id="kotlin-js"}

Kotlin 2.2.20 支持使用 `BigInt` 类型来表示 Kotlin 的 `Long` 类型, 使 `Long` 能在导出的声明中使用.
此外, 这个版本添加了一个 DSL 函数来清理 Node.js 参数.

### 使用 `BigInt` 类型来表示 Kotlin 的 `Long` 类型 {id="usage-of-the-bigint-type-to-represent-kotlin-s-long-type"}
<primary-label ref="experimental-opt-in"/>

在 ES2020 标准之前, JavaScript (JS) 不支持大于 53 位的精确整数的基本类型.

因此, Kotlin/JS 以前将 `Long` 值 (64 位宽) 表示为 JavaScript 对象, 它两个 `number` 属性.
这种自定义实现使 Kotlin 和 JavaScript 之间的互操作性更加复杂.

从 Kotlin 2.2.20 开始, Kotlin/JS 在编译到现代 JavaScript (ES2020) 时,
使用 JavaScript 内置的 `BigInt` 类型来表示 Kotlin 的 `Long` 值.

这次变更使 [将 `Long` 类型导出到 JavaScript](#usage-of-long-in-exported-declarations) 成为可能,
这也是 Kotlin 2.2.20 引入的功能. 因此, 这次变更简化了 Kotlin 和 JavaScript 之间的互操作性.

要启用它, 你需要在 `build.gradle(.kts)` 文件中添加以下编译器选项:

```kotlin
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128) 中提供你的反馈意见.

#### 在导出声明中使用 `Long` {id="usage-of-long-in-exported-declarations"}

由于 Kotlin/JS 使用了自定义的 `Long` 表达, 很难提供直接方式, 实现从 JavaScript 与 Kotlin 的 `Long` 的交互.
因此, 你无法将使用 `Long` 类型的 Kotlin 代码导出到 JavaScript.
这个问题影响了所有使用 `Long` 的代码, 例如函数参数, 类属性, 或构造器.

现在 Kotlin 的 `Long` 类型可以编译为 JavaScript 的 `BigInt` 类型, Kotlin/JS 支持将 `Long` 值导出到 JavaScript,
简化了 Kotlin 和 JavaScript 代码之间的互操作性.

启用这个功能的方法是:

1. 在你的 `build.gradle(.kts)` 文件的 `freeCompilerArgs` 属性中添加以下编译器选项,
   允许在 Kotlin/JS 中导出 `Long`:

    ```kotlin
    kotlin {
        js {
            ...
            compilerOptions {
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2. 启用 `BigInt` 类型.
   参见如何启用 [使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型](#usage-of-the-bigint-type-to-represent-kotlin-s-long-type).

### 新的 DSL 函数, 用于清理参数 {id="new-dsl-function-for-cleaner-arguments"}

当使用 Node.js 运行 Kotlin/JS 应用程序时, 传递给程序的参数 (`args`) 以前包含:

* 可执行文件 `Node` 的路径.
* 你的脚本路径.
* 你提供的实际的命令行参数.

但是, `args` 的预期行为是只包含命令行参数.
为了实现这一点, 你必须在你的 `build.gradle(.kts)` 文件或 Kotlin 代码中,
使用 `drop()` 函数手动跳过前两个参数:

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

这种变通方法是重复的, 容易出错, 并且在跨平台共用代码时效果不好.

为了解决这个问题, Kotlin 2.2.20 引入了一个新的 DSL 函数, 名为 `passCliArgumentsToMainFunction()`.

使用这个函数, 只包含命令行参数, 排除了 `Node` 和脚本的路径:

```kotlin
fun main(args: Array<String>) {
    // 不需要 drop(), 只包含你的自定义参数
    println(args.joinToString(", "))
}
```

这个变更减少了样板代码, 防止了手动丢弃参数造成的错误, 并改善了跨平台兼容性.

要启用这个功能, 请在你的 `build.gradle(.kts)` 文件中添加以下 DSL 函数:

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle {id="gradle"}

Kotlin 2.2.20 在 Gradle 构建报告中, 为 Kotlin/Native 任务添加了新的编译器性能指标, 并对增量编译进行了使用体验的改进.

### Kotlin/Native 任务的构建报告中的新的编译器性能指标 {id="new-compiler-performance-metrics-in-build-reports-for-kotlin-native-tasks"}

在 Kotlin 1.7.0 中, 我们引入了 [构建报告](gradle-compilation-and-caches.md#build-reports), 帮助追踪编译器性能.
之后, 我们添加了更多指标, 使这些报告更加详细, 更加有助于调查性能问题.

在 Kotlin 2.2.20 中, 构建报告现在包含 Kotlin/Native 任务的编译器性能指标.

关于构建报告及其配置方式, 详情请参见 [启用构建报告](gradle-compilation-and-caches.md#enabling-build-reports).

### Kotlin/JVM 增量编译的改进(预览版) {id="preview-improved-incremental-compilation-for-kotlin-jvm"}
<primary-label ref="experimental-general"/>

Kotlin 2.0.0 引入了新的 K2 编译器和前端优化.
在此基础上, Kotlin 2.2.20 使用新的前端, 对 Kotlin/JVM 改进了某些复杂的增量编译场景中的性能.

这些改进默认禁用, 我们正在努力稳定这个功能.
要启用这些改进, 请在你的 `gradle.properties` 文件中添加以下属性:

```properties
kotlin.incremental.jvm.fir=true
```

目前, [`kapt` 编译器插件](kapt.md) 与这种新行为不兼容.
我们正在努力, 在未来的 Kotlin 版本中添加支持.

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-72822) 中提供你对这个功能的反馈意见.

### 增量编译检测内联函数中 Lambda 表达式的变更 {id="incremental-compilation-detects-changes-in-lambdas-of-inline-functions"}

在 Kotlin 2.2.20 之前, 如果你启用了增量编译, 并修改了内联函数中的 Lambda 表达式内部的逻辑,
编译器不会重新编译其他模块中对这个内联函数的调用代码.
因此, 那些调用代码会使用 Lambda 表达式的之前版本, 可能会导致意外行为.

在 Kotlin 2.2.20 中, 编译器现在能够检测内联函数中 Lambda 表达式的变更, 并自动重新编译其调用代码.

### 库发布的改进 {id="improvements-for-library-publication"}

Kotlin 2.2.20 添加了新的 Gradle 任务, 使库的发布更加容易.
这些任务能够帮助你生成密钥对, 上传公钥,
并在上传到 Maven Central 仓库之前, 运行本地检查, 以确保验证过程成功.

关于如何在发布流程中使用这些任务, 详情请参见 [将你的库发布到 Maven Central](multiplatform-publish-libraries-to-maven.md).

#### 新的 Gradle 任务, 用于生成和上传 PGP 密钥 {id="new-gradle-tasks-for-generating-and-uploading-pgp-keys"}

在 Kotlin 2.2.20 之前, 如果你想将跨平台库发布到 Maven Central 仓库,
你必须安装第三方程序, 例如 `gpg`, 来为你的发布生成密钥对.
现在, Kotlin Gradle 插件附带了 Gradle 任务, 让你生成密钥对并上传公钥, 而不必安装另一个程序.

##### 生成密钥对 {id="generate-a-key-pair"}

`generatePgpKeys` 任务生成密钥对. 当你运行它时, 必须提供存储私钥的密码, 和你的姓名, 格式如下:

```bash
./gradlew -Psigning.password=example-password generatePgpKeys --name "John Smith <john@example.com>"
```

这个任务将密钥对存储在 `build/pgp` 目录中.

> 请将你的密钥对移到安全位置, 以防止意外删除, 或未经授权的访问.
>
{style="warning"}

##### 上传公钥 {id="upload-the-public-key"}

`uploadPublicPgpKey` 任务将公钥上传到 Ubuntu 的密钥服务器: `keyserver.ubuntu.com`.
运行时, 请提供 `.asc` 格式的公钥路径:

```bash
./gradlew uploadPublicPgpKey --keyring /path_to/build/pgp/public_KEY_ID.asc
```

#### 新的 Gradle 任务, 用于本地测试验证 {id="new-gradle-tasks-to-test-verification-locally"}

Kotlin 2.2.20 还添加了 Gradle 任务, 用于将库上传到 Maven Central 仓库之前, 在本地进行测试验证.

如果你使用 Kotlin Gradle Plugin, 以及 Gradle 的 [Signing Plugin](https://docs.gradle.org/current/userguide/signing_plugin.html) 和 [Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html),
你可以运行 `checkSigningConfiguration` 和 `checkPomFileFor<PUBLICATION_NAME>Publication` 任务, 验证你的设置是否符合 Maven Central 的要求.
请将 `<PUBLICATION_NAME>` 替换为你的发布名称.

这些任务不会作为 `build` 或 `check` Gradle 任务的一部分自动运行, 因此你需要手动运行它们.
例如, 如果你有一个 `KotlinMultiplatform` 发布:

```bash
./gradlew checkSigningConfiguration checkPomFileForKotlinMultiplatformPublication
```

`checkSigningConfiguration` 任务会检查:

* Signing Plugin 是否配置了密钥.
* 配置的公钥是否已上传到 `keyserver.ubuntu.com` 或 `keys.openpgp.org` 密钥服务器.
* 所有发布是否都启用了签名.

如果这些检查中有任何一个失败, 任务会返回一个错误, 包含如何修复问题的信息.

`checkPomFileFor<PUBLICATION_NAME>Publication` 任务会检查 `pom.xml` 文件是否符合 Maven Central 的 [要求](https://central.sonatype.org/publish/requirements/#required-pom-metadata).
如果不符合, 任务会返回一个错误, 包含 `pom.xml` 文件哪些部分不合规的详细信息.

## Maven: 在 `kotlin-maven-plugin` 中支持 Kotlin Daemon {id="maven-support-for-the-kotlin-daemon-in-the-kotlin-maven-plugin"}

Kotlin 2.2.20 在 `kotlin-maven-plugin` 中添加了对 [Kotlin Daemon](kotlin-daemon.md) 的支持,
进一步改进了 [在 Kotlin 2.2.0 中引入的构建工具 API](whatsnew22.md#new-experimental-build-tools-api).
使用 Kotlin Daemon 时, Kotlin 编译器在单独的隔离进程中运行, 可以防止其他 Maven 插件覆盖系统属性.
你可以在这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path)
中查看一个示例.

从 Kotlin 2.2.20 开始, Kotlin Daemon 默认使用.
如果你想恢复到之前的行为, 请在你的 `pom.xml` 文件中将以下属性设置为 `false`, 来选择退出:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin 2.2.20 还引入了一个新的 `jvmArgs` 属性, 你可以使用它来自定义 Kotlin Daemon 的默认 JVM 参数.
例如, 要覆盖 `-Xmx` 和 `-Xms` 选项, 请在你的 `pom.xml` 文件中添加以下内容:

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## Kotlin 编译器选项的新通用模式 {id="new-common-schema-for-kotlin-compiler-options"}

Kotlin 2.2.20 引入了在 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description)
下发布的所有编译器选项的通用模式.
这个 artifact 包含所有编译器选项的代码表达, JSON 等效项目 (用于非 JVM 使用者), 描述, 以及元数据, 例如每个选项引入或稳定的版本.
你可以使用这个模式来生成选项的自定义视图, 或根据需要分析它们.

## 标准库 {id="standard-library"}

这个版本在标准库中引入了新的实验性功能: 支持在 Kotlin/JS 中通过反射识别接口类型,
共通原子类型的更新函数, 以及用于调整数组大小的 `copyOf()` 重载.

### 支持在 Kotlin/JS 中通过反射识别接口类型 {id="support-for-identifying-interface-types-through-reflection-in-kotlin-js"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 在 Kotlin/JS 标准库中添加了 [实验性](components-stability.md#stability-levels-explained)
的 [`KClass.isInterface`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-class/is-interface.html) 属性.

使用这个属性, 你现在可以检查类引用是否表示 Kotlin 接口.
这个功能使得 Kotlin/JS 更接近与 Kotlin/JVM 一致, 在 Kotlin/JVM 中, 你可以使用 `KClass.java.isInterface` 检查类是否表示接口.

要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // 如果是接口, 则打印 true
    println(klass.isInterface)
}
```

欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581) 中提供你的反馈意见.

### 共通原子类型的新更新函数 {id="new-update-functions-for-common-atomic-types"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 引入了新的实验性函数, 用于更新共通原子类型, 及其对应的数组的元素.
每个函数以原子方式, 使用这些更新函数之一, 计算新值并替换当前值, 返回值取决于你使用哪个函数:

* [`update()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update.html) 和 [`updateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-at.html)
  设置新值, 不返回结果.
* [`fetchAndUpdate()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update.html) 和 [`fetchAndUpdateAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/fetch-and-update-at.html)
  设置新值, 返回变更前的值.
* [`updateAndFetch()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch.html) 和 [`updateAndFetchAt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/update-and-fetch-at.html)
  设置新值, 返回变更后的值.

你可以使用这些函数来实现不支持开箱即用的原子变换, 例如乘法或位运算.
在这个变更之前, 要实现递增共通原子类型并读取先前值,
需要一个带有 [`compareAndSet()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-atomic-int/compare-and-set.html) 函数的循环.

与共通原子类型的所有 API 一样, 这些函数是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalAtomicApi::class)` 注解.

下面的示例代码, 执行不同类型更新, 并返回先前值或更新值:

```kotlin
import kotlin.concurrent.atomics.*
import kotlin.random.Random

@OptIn(ExperimentalAtomicApi::class)
fun main() {
    val counter = AtomicLong(Random.nextLong())
    val minSetBitsThreshold = 20

    // 设置新值, 不使用结果
    counter.update { if (it < 0xDECAF) 0xCACA0 else 0xC0FFEE }

    // 获取当前值, 然后更新它
    val previousValue = counter.fetchAndUpdate { 0x1CEDL.shl(Long.SIZE_BITS - it.countLeadingZeroBits()) or it }

    // 更新值, 然后获取结果
    val current = counter.updateAndFetch {
        if (it.countOneBits() < minSetBitsThreshold) it.shl(20) or 0x15BADL else it
    }

    val hexFormat = HexFormat {
        upperCase = true
        number {
            removeLeadingZeros = true
        }
    }
    println("Previous value: ${previousValue.toHexString(hexFormat)}")
    println("Current value: ${current.toHexString(hexFormat)}")
    println("Expected status flag set: ${current and 0xBAD != 0xBADL}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2.20"}

欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76389) 中提供你的反馈意见.

### 支持数组的 `copyOf()` 重载 {id="support-for-copyof-overloads-for-arrays"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.2.20 为 [`copyOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html) 函数引入了实验性的重载.
它适用于泛型类型 `Array<T>` 的数组, 以及所有基本数组类型.

你可以使用这个函数扩大数组, 并使用初始化器 Lambda 表达式的值填充新元素.
这个功能可以帮助你减少自定义样板代码, 并修复了一个常见的痛点, 即调整泛型 `Array<T>` 大小会产生可为 null 的结果 (`Array<T?>`).

下面是一个示例:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val row1: Array<String> = arrayOf("one", "two")
    // 调整数组大小, 并使用 Lambda 表达式填充新元素
    val row2: Array<String> = row1.copyOf(4) { "default" }
    println(row2.contentToString())
    // 输出结果为: [one, two, default, default]
}
```

这个 API 是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解.

欢迎在我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-70984) 中提供你的反馈意见.

## Compose 编译器 {id="compose-compiler"}

在这个版本中, Compose 编译器添加了新的警告, 改进了构建指标的输出使其更加易读, 带来了使用体验的改进.

### 对默认参数的语言版本限制 {id="language-version-restrictions-for-default-parameters"}

在这个版本中, 如果为编译指定的语言版本, 低于在 abstract 或 open 的可组合函数中支持默认参数所需的版本, Compose 编译器会报告错误.

Compose 编译器支持默认参数: 从 Kotlin 2.1.0 开始对 abstract 函数支持, 从 Kotlin 2.2.0 开始对 open 函数支持.
当使用较新版本的 Compose 编译器, 面向旧版 Kotlin 语言版本进行编译时,
库开发者应该注意, 即使语言版本不支持 abstract 或 open 函数中的默认参数, 它们仍然可能出现在公开 API 中.

### K2 编译器的可组合目标(Composable Target)警告 {id="composable-target-warnings-for-the-k2-compiler"}

这个版本在使用 K2 编译器时添加了关于 [`@ComposableTarget`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/ComposableTarget)
不匹配的警告.

例如:

```text
@Composable fun App() {
  Box { // <-- `Box` 是 `@UiComposable`
    Path(...) // <-- `Path` 是 `@VectorComposable`
    ^^^^^^^^^
    warning: Calling a Vector composable function where a UI composable was expected
  }
}
```

### 构建指标中的完全限定名称 {id="fully-qualified-names-in-build-metrics"}

构建指标中报告的类和函数名, 现在使用完全限定名称, 更容易区分不同包中同名的声明.

此外, 构建指标不再包含来自默认参数的复杂表达式的转储, 使它们更加易读.

## 破坏性变更和废弃 {id="breaking-changes-and-deprecations"}

本节重点介绍值得注意的重要破坏性变更和废弃:

* [kapt](kapt.md) 编译器插件现在默认使用 K2 编译器.
  因此, 用来控制插件是否使用 K2 编译器的 `kapt.use.k2` 属性, 已被废弃.
  如果你将这个属性设置为 `false`, 选择不使用 K2 编译器, Gradle 会提示警告.

## 文档更新 {id="documentation-updates"}

Kotlin 文档有了一些值得注意的变更:

* [Kotlin 路线图](roadmap.md)
  — 查看 Kotlin 在语言和生态系统演进方面优先级的最新列表.
* [属性](properties.md)
  — 了解在 Kotlin 中使用属性的各种方式.
* [条件和循环](control-flow.md)
  — 了解 Kotlin 中条件和循环的工作方式.
* [Kotlin/JavaScript](js-overview.md)
  — 探索 Kotlin/JS 的使用场景.
* [面向 Web 编译目标](gradle-configure-project.md#targeting-the-web)
  — 了解 Gradle 为 Web 开发提供的各种编译目标.
* [Kotlin daemon](kotlin-daemon.md)
  — 了解 Kotlin Daemon, 以及它如何与构建系统和 Kotlin 编译器协作.
* [协程概述页面](coroutines-overview.md)
  — 了解协程的概念, 并开始你的学习之旅.
* [Kotlin/Native 二进制选项](native-binary-options.md)
  — 了解 Kotlin/Native 的二进制选项, 以及如何配置它们.
* [调试 Kotlin/Native](native-debugging.md)
  — 探索使用 Kotlin/Native 进行调试的各种方法.
* [自定义 LLVM 后端的技巧](native-llvm-passes.md)
  — 了解 Kotlin/Native 如何使用 LLVM 并调整优化过程(Optimization Pass).
* [Exposed 的 DAO API 入门](https://www.jetbrains.com/help/exposed/get-started-with-exposed-dao.html)
  — 了解如何使用 Exposed 的数据访问对象 (Data Access Object, DAO) API, 在关系数据库中存储和检索数据.
* Exposed 文档中关于 R2DBC 的新页面:
  * [使用数据库](https://www.jetbrains.com/help/exposed/working-with-database.html)
  * [使用 ConnectionFactory](https://www.jetbrains.com/help/exposed/working-with-connectionfactory.html)
  * [自定义类型映射](https://www.jetbrains.com/help/exposed/custom-type-mapping.html)
* [HTMX 集成](https://ktor.io/docs/htmx-integration.html)
  — 了解 Ktor 如何为 HTMX 提供实验性的一级支持.

## 如何更新到 Kotlin 2.2.20 {id="how-to-update-to-kotlin-2-2-20"}

Kotlin Plugin 作为一个包含在 IntelliJ IDEA 和 Android Studio 中的捆绑 Plugin 发布.

要更新到新的 Kotlin 版本, 请在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 到 2.2.20.
