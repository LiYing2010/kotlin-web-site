[//]: # (title: Kotlin 2.4.0 中的新功能)

<show-structure depth="2"/>

<web-summary>阅读 Kotlin 2.4.0 发布说明, 包括新的语言功能特性, Kotlin Multiplatform, JVM, Native, JS, 和 Wasm 的更新, 以及对 Gradle 和 Maven 的构建工具支持.</web-summary>

Kotlin 2.4.0 已经发布了! 以下是它的一些最重要的功能:

* **语言:** [上下文参数, 明确的后端域变量, 以及注解使用目标的多项功能, 升级为稳定版](#stable-features)
* **标准库:** [UUID API 升级为稳定版](#stable-uuid-api-in-the-common-kotlin-standard-library) 和 [检查排序顺序](#support-for-checking-sorted-order)
* **Kotlin/JVM:** [支持 Java 26](#support-for-java-26) 和 [默认启用元数据中的注解](#annotations-in-metadata-enabled-by-default)
* **Kotlin/Native:** [支持将 Swift 包作为依赖项, Swift export 的更新, 以及默认启用 CMS GC](#kotlin-native)
* **Kotlin/Wasm:** [默认启用增量编译, 以及支持 WebAssembly 组件模型(WebAssembly Component Model)](#kotlin-wasm)
* **Kotlin/JS**: [支持值类的导出, 以及 JS 代码内联中的 ES2015 功能特性](#kotlin-js)
* **Gradle:** [兼容 Gradle 9.5.0](#gradle)
* **Maven:** [自动对齐 Java 版本和 JVM 目标版本](#maven)
* **Kotlin 编译器:** [`.klib` 编译期间内联函数行为更加一致](#consistent-intra-module-function-inlining-during-klib-compilation)

> 关于 Kotlin 的发布周期, 详情请参见 [Kotlin 发布过程](releases.md).
>
{style="tip"}

## 升级到 Kotlin 2.4.0 {id="update-to-kotlin-2-4-0"}

Kotlin 的最新版本已包含在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
和 [Android Studio](https://developer.android.com/studio) 的最新版本中.

要升级到新的 Kotlin 版本, 请确保你的 IDE 已更新到最新版本, 并在构建脚本中 [修改 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)
为 2.4.0.

## 新功能特性 {id="new-stable-features"}
<primary-label ref="stable"/>

在之前的 Kotlin 版本中, 引入了几个新的实验性功能特性.
以下功能特性在 Kotlin 2.4.0 中已升级为 [稳定版](components-stability.md#stability-levels-explained),
因此使用这些功能不再需要使用者同意:

* [上下文参数](context-parameters.md), 但 [上下文实参](#explicit-context-arguments-for-context-parameters) 和 [可调用的引用](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references) 除外
* [属性的 `@all` 元目标(meta-target)](annotations.md#all-meta-target)
* [注解的使用目标的新的默认规则](annotations.md#defaults-when-no-use-site-targets-are-specified)
* [明确的后端域变量](properties.md#explicit-backing-fields)
* [Kotlin 共通标准库中的 UUID API 稳定版](#stable-uuid-api-in-the-common-kotlin-standard-library)
* [JVM 上将无符号整数转换为 `BigInteger` 的新 API](#new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm)
* [检查排序顺序](#support-for-checking-sorted-order)
* [将值类导出到 JavaScript/TypeScript](#support-for-value-class-export-to-javascript-typescript)
* [内联 JS 代码时支持 ES2015 功能特性](#support-for-es2015-features-when-inlining-js-code)
* [Maven: 自动对齐 Java版本 和 JVM 目标版本](#automatic-alignment-between-java-and-jvm-target-versions)
* [支持 Maven Toolchains](#support-for-maven-toolchains)

> 在 IntelliJ IDEA 中, 不使用 `-Xexplicit-backing-fields` 编译器选项, 而使用明确的后端域变量,
> 这个功能将在 2026.1.4 中提供.
>
{style = "note"}

## 新功能特性 {id="new-experimental-features"}
<primary-label ref="experimental-exp"/>

* [用于上下文参数的明确的上下文实参](#explicit-context-arguments-for-context-parameters)
* [支持集合字面值](#support-for-collection-literals)
* [编译期常量的改进](#improved-compile-time-constants)
* [对高阶函数未使用结果的检查的改进](#improved-unused-result-checks-for-higher-order-functions)
* [新的 `@IntroducedAt` 注解, 为可选参数生成基于版本的重载](#new-introducedat-annotation-to-generate-version-based-overloads-for-optional-parameters)
* [新的 Map 回退函数, 用于区分 `null` 值和键(Key)缺失](#new-map-fallback-functions-to-distinguish-null-values-and-missing-keys)
* [Swift 包导入](#swift-package-import)
* [Swift export 进入 Alpha 版, 改进了并发支持](#swift-export-goes-alpha-with-improved-concurrency-support)
* [支持 WebAssembly 组件模型(WebAssembly Component Model)](#support-for-the-webassembly-component-model)

## 语言 {id="language"}

Kotlin 2.4.0 将上下文参数, 明确的后端域变量, 以及注解的使用目标功能特性升级为 [稳定版](components-stability.md#stability-levels-explained).
这个版本还引入了 [用于上下文参数的明确的上下文实参](#explicit-context-arguments-for-context-parameters).

### 进入稳定版的功能特性 {id="stable-features"}
<secondary-label ref="language"/>

Kotlin 2.2.0 和 2.3.0 引入了几个 [实验性](components-stability.md#stability-levels-explained) 的语言功能特性.
我们很高兴的宣布, 在这个发布版中, 以下语言功能特性现在进入 [稳定版](components-stability.md#stability-levels-explained):

* [上下文参数](whatsnew22.md#preview-of-context-parameters), 但 [上下文实参](#explicit-context-arguments-for-context-parameters) 和 [可调用的引用](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md#callable-references) 除外
* [属性的 `@all` 元目标(meta-target)](annotations.md#all-meta-target)
* [注解的使用目标的新的默认规则](annotations.md#defaults-when-no-use-site-targets-are-specified)
* [明确的后端域变量](properties.md#explicit-backing-fields)

[查看完整的 Kotlin 语言设计的功能特性和提案列表](kotlin-language-features-and-proposals.md).

### 导入的最后段不再有废弃警告 {id="no-more-deprecation-warnings-on-the-last-segments-of-imports"}
<secondary-label ref="language"/>

在之前的 Kotlin 版本中, 当导入一个已废弃的类时, 会对调用处和 import 指令本身都报告废弃错误.
由于没有办法在导入处禁用废弃错误, 你可能不得不通过压制(Suppress)整个文件的废弃报告, 或使用星号导入, 来绕过这个问题.

对被调用的符号在它的导入处报告废弃错误, 由于在大多数情况下并没有什么用处, 
因此 Kotlin 2.4.0 对 import 指令的最后段中引用已废弃的符号, 不再发出警告.

详情请参见 [KT-30155](https://youtrack.jetbrains.com/issue/KT-30155).

### 用于上下文参数(Context Parameter)的明确的上下文实参(Context Argument) {id="explicit-context-arguments-for-context-parameters"}
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin 2.4.0 为 [上下文参数(Context Parameter)](context-parameters.md) 引入了明确的上下文实参(Context Argument).

Kotlin 2.3.20 [修改了上下文参数的重载解析](whatsnew2320.md#changes-to-overload-resolution-for-context-parameters).
因此, 对于只有上下文参数不同的重载, 调用时可能会出现歧义.

你现在可以通过在调用处传递明确的上下文实参, 来解决这类歧义.

下面是一个示例:

```kotlin
class EmailSender
class SmsSender

context(emailSender: EmailSender)
fun sendNotification() {
    println("Sent email notification")
}

context(smsSender: SmsSender)
fun sendNotification() {
    println("Sent SMS notification")
}

context(defaultEmailSender: EmailSender, defaultSmsSender: SmsSender)
fun notifyUser() {
    // 选择使用带有 EmailSender 上下文参数的重载
    sendNotification(emailSender = defaultEmailSender)

    // 选择使用带有 SmsSender 上下文参数的重载
    sendNotification(smsSender = defaultSmsSender)
}
```

你也可以使用明确的上下文实参代替 `context()` 函数, 这样可以减少嵌套, 让某些调用更易读.
如果你需要在多个调用中使用相同的上下文实参, 请改为使用 `context()` 函数.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-context-arguments")
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
                    <arg>-Xexplicit-context-arguments</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

详情请参见这个功能特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0448-explicit-context-arguments.md).

### 支持集合字面值 {id="support-for-collection-literals"}
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin 2.4.0 引入了集合字面值的实验性功能.
你现在可以使用括号 `[]`, 以更简单, 更简洁的方式创建集合.

例如:

```kotlin
fun main() {
    // 带有明确的类型声明的可变列表
    // val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")

    // 使用括号语法的可变列表
    val shapes: MutableList<String> = ["triangle", "square", "circle"]
    println(shapes)
    // 输出结果为: [triangle, square, circle]
}
```
{validate="false"}

> 目前, 集合字面值不能用来构建 Java 中定义的集合. 详情请参见 [KT-80494](https://youtrack.jetbrains.com/issue/KT-80494).
>
{style="note"}

如果编译器没有足够的信息来推断集合类型, 它默认使用 `List` 类型:

```kotlin
fun main() {
    val fruit = ["apple", "banana", "cherry"]

    println(fruit)
    // 输出结果为: [apple, banana, cherry]
}
```
{validate="false"}

你也可以声明自定义的 `operator fun of` 函数, 将括号语法用于你自己的类型.
例如, 如果你有下面的 `DoubleMatrix` 类:

```kotlin
class DoubleMatrix(vararg val rows: Row) {
    companion object {
        operator fun of(vararg rows: Row) = DoubleMatrix(*rows)
    }
    class Row(vararg val elements: Double) {
        companion object {
            operator fun of(vararg elements: Double) = Row(*elements)
        }
    }
}
```
{validate="false"}

你可以像这样创建类实例 `identityMatrix`:

```kotlin
fun main() {
    val identityMatrix: DoubleMatrix = [
        [1.0, 0.0, 0.0],
        [0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0],
    ]
}
```
{validate="false"}

在这个示例中, 编译器将嵌套的集合字面值翻译为对相应 `operator fun of` 函数调用.
编译器递归的解析这些调用, 并使用预期的类型来选择正确的重载.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcollection-literals")
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
                    <arg>-Xcollection-literals</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

详情请参见这个特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0416-collection-literals.md).

### 编译期常量的改进 {id="improved-compile-time-constants"}
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin 2.4.0 对 [编译期常量](properties.md#compile-time-constants) 进行了实验性的功能改进,
对数字和字符串类型的支持更加一致, 并且易于使用. 这些改进包括对以下内容的支持:

* 无符号类型操作.
* 字符串的标准库函数, 如 `.lowercase()`, `.uppercase()` 和 `.trim()` 函数.
* [枚举常量](enum-classes.md#working-with-enum-constants) 的 `.name` 属性和 [`KCallable` 接口](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.reflect/-k-callable/) 的求值.

为了明确哪些函数在编译期求值, Kotlin 2.4.0 引入了 `IntrinsicConstEvaluation` 注解.
一些函数在编译期求值, 但还没有这个注解. 后续版本会向其余函数添加这个注解.
关于支持的函数列表, 请参见 KEEP [附录](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md#appendix).

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xintrinsic-const-evaluation")
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
                    <arg>-Xintrinsic-const-evaluation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

详情请参见这个特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0444-improve-compile-time-constants.md).

### 对高阶函数未使用结果的检查的改进 {id="improved-unused-result-checks-for-higher-order-functions"}
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin 2.4.0 引入了新的实验性契约(Contract) `returnsResultOf()`, 用于改进 [未使用返回值的检查器](unused-return-value-checker.md).

这个契约让检查器能够区分未使用结果中可以忽略的情况, 和来自高阶函数的, 返回 Lambda 表达式结果的有意义的结果, 例如 `let` 作用域函数.

> Kotlin 契约(Contract)是 [实验性功能](components-stability.md#stability-levels-explained).
> 要表示使用者同意(Opt-in), 请在声明带有契约的函数时添加 `@OptIn(ExperimentalContracts::class)` 注解.
>
{style="warning"}

要使用这个功能, 请将 `returnsResultOf()` 添加到函数的契约中:

```kotlin
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.contract

@OptIn(ExperimentalContracts::class)
inline fun <T, R> T.customLet(block: (T) -> R): R {
    contract {
        returnsResultOf(block)
    }
    return block(this)
}
```

下面是一个示例, 它将自定义 `.customLet()` 函数与可为 null 的值一起使用:

```kotlin
fun handleNullablePackageName(packageName: String?, builder: StringBuilder) {
    // 检查器不报告警告
    // 因为 append() 函数的返回值可以忽略
    packageName?.customLet { builder.append(it) }

    // 检查器会报告警告, 因为返回的字符串未被使用
    packageName?.customLet { "kotlin.$it" }
}
```

未使用返回值检查器是 [实验性功能](components-stability.md#stability-levels-explained),
必须启用才能报告未使用的返回值.
关于启用和配置检查器, 详情请参见 [未使用返回值的检查器](unused-return-value-checker.md#configure-the-unused-return-value-checker).

#### 如何启用 {id="how-to-enable-unused-return-value-checker"}

`returnsResultOf()` 契约是 [实验性功能](components-stability.md#stability-levels-explained).
请注意, 使用它会生成预发布的(Pre-Release)二进制文件, 较早版本的 Kotlin 编译器无法读取.
要表示使用者同意(Opt-in), 请在构建文件中添加以下编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xallow-returns-result-of")
    }
}
```

</tab> <tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xallow-returns-result-of</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```
</tab>
</tabs>

### 新的 `@IntroducedAt` 注解, 为可选参数生成基于版本的重载 {id="new-introducedat-annotation-to-generate-version-based-overloads-for-optional-parameters"}
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="language"/>

Kotlin 2.4.0 引入了 `@IntroducedAt` 注解, 用于在向已发布 API 添加新的可选参数时, 保持二进制兼容性.

之前, 向函数添加可选参数, 通常需要使用 `@JvmOverloads`, 这可能会生成超过需要的重载.
另一种方法是, 为了保持二进制兼容性, 需要将旧签名保留为隐藏的废弃重载.

使用 `@IntroducedAt` 注解, 你可以对新添加的可选参数, 标记引入这些参数的版本.
编译器使用这个信息自动生成对应的隐藏重载.

这个注解是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalVersionOverloading::class)` 注解.

下面是一个示例:

```kotlin
@OptIn(ExperimentalVersionOverloading::class)
fun Button(
    label: String = "",
    color: Color = DefaultColor,
    @IntroducedAt("1.1") borderColor: Color = DefaultBorderColor,
    @IntroducedAt("1.2") borderStyle: Style = DefaultBorderStyle,
    @IntroducedAt("1.2") borderWidth: Int = 1,
    onClick: () -> Unit
) {
    // 函数体
}
```

在这个示例中, 编译器为 `Button()` 函数的旧版本生成隐藏重载.

由于 `@IntroducedAt` 和 `@JvmOverloads` 都会生成重载, 同时使用它们可能会导致重载冲突.
如果你同时使用这两个注解, 编译器会报告警告.
如果你(Suppress)这个警告, 编译器会优先使用由 `@IntroducedAt` 注解生成的重载.

## 标准库 {id="standard-library"}

Kotlin 2.4.0 共通标准库中, 对 UUID 的支持进入稳定版.
它还添加了新的扩展函数, 用于将无符号整数转换为 JVM 上的 `BigInteger`, 以及检查排序顺序.

### Kotlin 共通标准库中的稳定 UUID API {id="stable-uuid-api-in-the-common-kotlin-standard-library"}
<secondary-label ref="standard-library"/>

Kotlin 2.0.20 引入了 [用于生成 UUID (Universally Unique Identifier, 通用唯一标识符) 的类](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library),
并添加了对 Kotlin 和 Java UUID 之间转换的支持.
后续版本逐步改进了这个实验性功能, 添加了对以下内容的支持:

* [使用 `<` 和 `>` 运算符比较 UUID](whatsnew2120.md#changes-in-uuid-parsing-formatting-and-comparability)
* [解析 UUID, 使用 16 进制加横线分隔符格式, 和纯文本格式](uuids.md#parse-uuids)
* [解析无效 UUID 时返回 `null`](whatsnew23.md#support-for-returning-null-when-parsing-invalid-uuids).

在 Kotlin 2.4.0 中, [`kotlin.uuid.Uuid` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/) 进入 [稳定版](components-stability.md#stability-levels-explained).
唯一的例外是 [用于生成 V4 和 V7 UUID 的函数](whatsnew23.md#support-for-generating-v7-uuids-for-specific-timestamps),
它们仍然是 [实验性功能](components-stability.md#stability-levels-explained), 并且仍然需要使用者同意.

关于如何使用 UUID, 详情请参见 [UUID](uuids.md).

### 检查排序顺序 {id="support-for-checking-sorted-order"}
<secondary-label ref="standard-library"/>

Kotlin 2.4.0 添加了新的扩展函数, 用于对可迭代对象(Iterable), 数组(Array), 和序列(Sequence), 检查排序顺序.

包括以下扩展函数:

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

你可以使用这些扩展函数, 来检查元素是否已经排序, 不需要再次排序, 或创建自己的辅助函数.
如果元素已经按指定的顺序排列, 或者少于两个元素, 则返回 `true`, 否则返回 `false`.
这些函数遇到不符合排序顺序的元素对, 就会立即停止, 因此对于大型的输入非常高效.

下面是一个示例, 它使用 `.isSorted()` 和 `.isSortedBy()` 函数检查排序顺序:

```kotlin
data class User(val name: String, val age: Int)

fun main() {
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // 输出结果为: true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // 输出结果为: false
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-check-sorted-order"}

### 新 API, 将无符号整数转换为 JVM 上的 `BigInteger` {id="new-api-for-converting-unsigned-integers-to-biginteger-on-the-jvm"}
<secondary-label ref="standard-library"/>

Kotlin 2.4.0 在 JVM 上引入了扩展函数 `UInt.toBigInteger()` 和 `ULong.toBigInteger()`.

之前, 将 `UInt` 和 `ULong` 值转换为 `BigInteger`, 需要基于字符串的变通方法, 或使用自定义的转换逻辑.
从 Kotlin 2.4.0 开始, 你现在可以使用 `.toBigInteger()`, 将无符号整数值直接转换为 `BigInteger`.

下面是一个示例:

```kotlin
fun main() {
    //sampleStart
    val unsignedLong = Long.MAX_VALUE.toULong() + 1uL
    val unsignedInt = UInt.MAX_VALUE

    println(unsignedLong.toBigInteger())
    // 输出结果为: 9223372036854775808

    println(unsignedInt.toBigInteger())
    // 输出结果为: 4294967295
   //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0-Beta2" id="kotlin-2-4-0-convert-unsigned-int"}

### 新的 Map 回退函数, 用于区分 `null` 值和键(Key)缺失 {id="new-map-fallback-functions-to-distinguish-null-values-and-missing-keys"}
<primary-label ref="experimental-opt-in"/>

<secondary-label ref="standard-library"/>

Kotlin 2.4.0 对值可为 null 的 Map, 为已有的 [Map 扩展函数](map-operations.md)
[`.getOrElse()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/get-or-else.html)
和 [`.getOrPut()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/get-or-put.html) 
添加了新的变体.
这些函数获取键(Key)对应的值, 或者对不存在的键(Key)使用默认值作为回退.
对于值可为 null 的 Map, 新的函数变体让你能够决定如何处理 Map 中存储的 `null` 值, 是作为键缺失, 还是作为已经存在的值,
并在函数名中明确的指明这种选择.

新的扩展函数包括:

* `.getOrElseIfNull(key, defaultValue)` 和 `.getOrPutIfNull(key, defaultValue)`,
  如果键缺失或值为 `null`, 则返回默认值, 类似于现有的 `.getOrElse()` 和 `.getOrPut()` 函数.
* `.getOrElseIfMissing(key, defaultValue)` 和 `.getOrPutIfMissing(key, defaultValue)`,
  只有在 Map 不包含指定的键时, 才返回默认值.

这些 API 是 [实验性功能](components-stability.md#stability-levels-explained), 需要使用 `@OptIn(ExperimentalStdlibApi::class)` 注解表示使用者同意.

下面是一个示例, 演示当键存在且值为 `null` 时 `.getOrPutIfNull()` 和 `.getOrPutIfMissing()` 之间的区别:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val mapForNull = mutableMapOf<String, String?>("user" to null)
    val mapForMissing = mutableMapOf<String, String?>("user" to null)

    // 如果 "user" 的值为 null, 则替换这个值
    mapForNull.getOrPutIfNull("user") { "default_user" }

    println(mapForNull)
    // 输出结果为: {user=default_user}

    // 由于 "user" 已经存在于 Map 中, 所以保留 null 值
    mapForMissing.getOrPutIfMissing("user") { "default_user" }

    println(mapForMissing)
    // 输出结果为: {user=null}
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0" id="kotlin-2-4-0-getorput-diff"}

你还可以将 `.getOrElseIfMissing()` 和 `.getOrPutIfMissing()` 函数用于存储可为 null 值的缓存.
如果 `defaultValue` 返回 `null`, Map 会存储它, 并且不会为相同的键再次调用 `defaultValue`.

下面是一个示例:

```kotlin
data class Response(val body: String)

class Service {
    var queryCount = 0

    fun query(key: String): Response? {
        queryCount += 1
        return null
    }
}

//sampleStart
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val service = Service()
    val cache = mutableMapOf<String, Response?>()

    fun getCachedResponseOrQuery(key: String): Response? =
        cache.getOrPutIfMissing(key) { service.query(key) }

    // 保存 null 值, 因为缓存不包含 "user"
    getCachedResponseOrQuery("user")

    println(cache)
    // 输出结果为: {user=null}

    // 使用已经缓存的 null 值, 并且不会再次查询服务
    getCachedResponseOrQuery("user")

    println(service.queryCount)
    // 输出结果为: 1
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.0" id="kotlin-2-4-0-getorif-missing"}

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-67337) 中提供你的反馈意见.

## Kotlin/JVM {id="kotlin-jvm"}

Kotlin 2.4.0 支持新的 Java 版本, 并默认启用元数据中的注解.

### 支持 Java 26 {id="support-for-java-26"}
<secondary-label ref="jvm"/>

从 Kotlin 2.4.0 开始, 编译器可以生成包含 Java 26 字节码的类.

### 默认启用元数据中的注解 {id="annotations-in-metadata-enabled-by-default"}
<secondary-label ref="jvm"/>

Kotlin 2.2.0 中的 Kotlin Metadata JVM 库 [引入了读取存储在 Kotlin 元数据中的注解的功能](whatsnew22.md#support-for-reading-and-writing-annotations-in-kotlin-metadata).
有了这个功能, Kotlin 编译器会将注解与 JVM 字节码一起写入元数据, 可供 Kotlin Metadata JVM 库访问.
因此, 注解处理器和其他工具可以在元数据级别理解和操作这些注解, 而不需要使用反射或修改源代码.

在 Kotlin 2.4.0 中, 这个功能默认启用.

## Kotlin/Native {id="kotlin-native"}

从 Kotlin 2.4.0 开始, [Swift export 升级为 Alpha 版](#swift-export-goes-alpha-with-improved-concurrency-support).
这个版本还带来了对 [Swift 包导入](#swift-package-import), Xcode 26.4 的支持,
并改进了内存消耗和垃圾回收.

### 垃圾回收器中的默认并发标记 {id="default-concurrent-marking-in-garbage-collector"}
<secondary-label ref="native"/>

在 Kotlin 2.0.20 中, Kotlin 团队对并发标记和清除垃圾回收器 (Concurrent Mark and Sweep Garbage Collector, CMS GC)
[引入了实验性支持](whatsnew2020.md#concurrent-marking-in-garbage-collector).
在处理用户反馈并修复回归问题后, 我们现在已经准备好, 从 Kotlin 2.4.0 开始默认启用 CMS.

之前, 垃圾回收器中的默认并行标记并发清除 (Parallel Mark Concurrent Sweep, PMCS) 设置,
在 GC 标记堆中的对象时, 必须暂停应用程序线程.
相比之下, CMS 允许标记阶段与应用程序线程并发运行.

这显著改善了 GC 暂停的持续时间和应用程序的响应速度, 对于延迟敏感型应用程序的性能很重要.
在使用 [Compose Multiplatform](https://blog.jetbrains.com/kotlin/2024/10/compose-multiplatform-1-7-0-released/#performance-improvements-on-ios)
构建的 UI 应用程序的基准测试中, CMS 已经展示了它的效果.

如果你遇到问题, 可以切换回 PMCS. 方法是, 在 `gradle.properties` 文件中设置以下 [二进制选项](native-binary-options.md):

```properties
kotlin.native.binary.gc=pmcs
```

关于 Kotlin/Native 垃圾回收器, 详情请参见我们的 [文档](native-memory-manager.md#garbage-collector).

### 在去虚拟化分析(Devirtualization Analysis)期间减少内存消耗 {id="reduced-memory-consumption-during-devirtualization-analysis"}
<secondary-label ref="native"/>

之前, 去虚拟化分析(Devirtualization Analysis)是 Kotlin/Native 编译器中内存消耗最大的阶段之一.
具体来收, 链接发布(Link Release)任务消耗了太多内存, 特别是在大型项目中.

Kotlin 2.4.0 引入了改进, 有助于减少链接发布任务期间的峰值内存消耗.

根据我们 EAP 用户之一的基准测试, 改进后的去虚拟化分析, 将链接发布任务的内存消耗减少了一半, 节省了至少 13 GB 内存.

### 支持 Xcode 26.4 {id="support-for-xcode-26-4"}
<secondary-label ref="native"/>

从 Kotlin 2.4.0 开始, Kotlin/Native 编译器支持 Xcode 26.4 – Xcode 的最新稳定版本之一.

你现在可以更新 Xcode 并访问最新的 API, 在针对 Apple 操作系统的 Kotlin 项目上继续工作.

### LLVM 更新至版本 21 {id="llvm-update-to-version-21"}
<secondary-label ref="native"/>

在 Kotlin 2.4.0 中, 我们将 LLVM 从版本 19 更新到 21.
新版本包含性能改进, 并有助于保持 Kotlin/Native 编译器的最新状态.

这个更新不应该影响你的代码, 但如果你遇到任何问题, 请向我们的 [问题追踪系统](http://kotl.in/issue) 报告.

### 对 Apple 编译目标支持的变更 {id="changes-to-apple-target-support"}
<secondary-label ref="native"/>

Kotlin 2.4.0 提高了 Apple 编译目标的默认最低支持版本:

* 对于 iOS 和 tvOS, 从 14.0 提高到 15.0.
* 对于 macOS, 从 11.0 提高到 12.0.
* 对于 watchOS, 从 7.0 提高到 8.0.

如果你的项目需要支持比默认更低的版本, 请在构建文件中使用 `freeCompilerArgs` 选项:

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
        binaries.configureEach {
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.ios=14.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.macos=11.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.tvos=14.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.watchos=7.0"
        }
    }
}
```

### Swift export 进入 Alpha 版, 改进了并发支持 {id="swift-export-goes-alpha-with-improved-concurrency-support"}
<primary-label ref="alpha"/>

<secondary-label ref="native"/>

从 Kotlin 2.4.0 开始, Kotlin 通过 Swift export 与 Swift 的互操作性正式进入 Alpha 版!
这个版本对并发支持进行了重大改进, 为 Swift export 添加了原生和直接的结构化并发,
以及将 `kotlinx.coroutines` 流(Flow)导出到 Swift 的能力.

#### 支持结构化并发 {id="support-for-structured-concurrency"}
你现在可以从 Swift 无缝的调用 Kotlin 的挂起代码.
Kotlin [`suspend` 函数](composing-suspending-functions.md) 和挂起函数类型, 被导出为 Swift 中惯用的 `async` 对应形式:

```kotlin
// Kotlin
suspend fun hello(): String {
    delay(1000)
    return "Hello Swift! This is Kotlin."
}
```

```swift
// Swift
let msg = try await hello()
```
#### 将流(Flow)类型导出到 Swift {id="export-of-flow-types-to-swift"}

这个更新还添加了将 `kotlinx.coroutines` 流(Flow)导出到 Swift 的功能.
`kotlinx.coroutines` 中的流表示异步的数据流, 能够并发的发射和消费.
它们通常用于响应式编程模式, 例如监听数据库更新, 网络请求, 或 UI 事件.

之前, 将
[`kotlinx.coroutines.flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/)
的 `Flow` 接口暴露给 Swift 的唯一方式, 是使用第三方解决方案.
现在, 你可以直接将流导出为 Swift 中惯用的对应物: [`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence).

这个功能默认启用. 你可以将任何带有 `Flow` 类型的 public API 导出到 Swift, 同时保留类型信息.
例如:

```kotlin
// Kotlin
// 导出 Flow 时保留 String 类型
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```Swift
// Swift
var actual: [String] = []

// String 类型从 Kotlin 正确的推断得到
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

关于 Swift export, 详情请参见我们的 [文档](native-swift-export.md).

### Swift 包导入 {id="swift-package-import"}
<primary-label ref="experimental-general"/>

<secondary-label ref="native"/>

Kotlin Multiplatform 项目现在可以在 Gradle 配置中为 iOS 应用声明 [Swift 包](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/) 作为依赖项:

```kotlin
// build.gradle.kts
kotlin {
    swiftPMDependencies {
        swiftPackage(
            url = url("https://github.com/firebase/firebase-ios-sdk.git"),
            version = from("12.11.0"),
            products = listOf(
                product("FirebaseAI"),
                product("FirebaseAnalytics"),
                ...
            )
        )
    }
}
```
{validate="false"}

关于实际示例和更多详细信息, 请参见 [SwiftPM 导入](multiplatform-spm-import.md).

如果你的项目使用 CocoaPods 依赖项, 你可以将当前的设置迁移为使用 Swift 包.
KMP 工具链考虑到了这种场景, 能够帮助你自动的重新配置项目.
详情请参见我们的 [CocoaPods 迁移指南](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html).

## Kotlin/Wasm {id="kotlin-wasm"}

Kotlin 2.4.0 默认为 Kotlin/Wasm 启用增量编译, 并支持 WebAssembly 组件模型(WebAssembly Component Model).

### 默认启用增量编译 {id="incremental-compilation-enabled-by-default"}
<secondary-label ref="wasm"/>

Kotlin/Wasm 在 Kotlin 2.1.0 中引入了增量编译. 从 Kotlin 2.4.0 开始, 它已进入 [稳定版](components-stability.md#stability-levels-explained), 并默认启用.
有了这个功能, 编译器只重新构建受到最近更改影响的文件, 显著减少构建时间.

要禁用增量编译, 请在项目的 `local.properties` 或 `gradle.properties` 文件中添加以下内容:

```properties
# gradle.properties
kotlin.incremental.wasm=false
```

如果遇到任何问题, 请在 [YouTrack](https://kotl.in/issue) 中报告.

### Chrome DevTools 中内部变量显示的改进 {id="improved-display-of-internal-variables-in-chrome-devtools"}
<secondary-label ref="wasm"/>

Kotlin 2.4.0 让临时的, 合成的, 以及内部变量, 更容易与用户定义的变量区分, 改善了 Chrome DevTools 中 Kotlin/Wasm 的调试体验.

Kotlin 编译器和 Compose 等编译器 plugin 会生成这些变量.
它们现在默认使用 `~` 前缀, 因此它们被分组在一起, 并移动到变量列表末尾,
因为 Chrome DevTools 按名称对列表进行排序.

### 支持 WebAssembly 组件模型(WebAssembly Component Model) {id="support-for-the-webassembly-component-model"}
<primary-label ref="experimental-general"/>

<secondary-label ref="wasm"/>

Kotlin/Wasm 在 Kotlin 2.4.0 中更进一步, 引入了对 [WebAssembly 组件模型(WebAssembly Component Model)](https://component-model.bytecodealliance.org/) 的实验性支持.
这个提案定义了一种方式, 通过标准化接口和类型从 Wasm 模块构建组件.
这种方法帮助 Wasm 从低级二进制指令格式, 演变为一个系统, 能够组合可重用, 语言无关的组件.
它让 Kotlin/Wasm 能够超越浏览器.
例如, Kotlin 和 WebAssembly 非常适合函数即服务(Function-as-a-Service, 也叫做 FaaS)或无服务器的应用程序.

要试用这个功能, 请查看 [使用 `wasi:http` 构建的简单的服务器](https://github.com/Kotlin/sample-wasi-http-kotlin/).

<img src="kotlin-wasm-wasi-http.gif" alt="带有 WebAssembly 组件模型的 Kotlin/Wasm" width="600"/>

请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-64569/Kotlin-Wasm-Support-Component-Model) 中分享你的反馈意见.

## Kotlin/JS {id="kotlin-js"}

Kotlin 2.4.0 进一步改进了导出到 JavaScript/TypeScript 的功能,
包括支持导出值类, 接口, 和类型变异(Type Variance), 以及内联 JS 代码时的 ES2015 特性.

### 将值类导出到 JavaScript/TypeScript {id="support-for-value-class-export-to-javascript-typescript"}
<secondary-label ref="js"/>

之前, 只有通常的 Kotlin 类才能导出到 JavaScript/TypeScript.
Kotlin 2.4.0 取消了这一限制. 你现在可以将 Kotlin 的 [内联值类](inline-classes.md) 导出为通常的 TypeScript 类.

要导出值类, 请在 Kotlin 端用 `@JsExport` 注解标注它:

```Kotlin
// Kotlin
@JsExport
@JvmInline
value class Email(val address: String) {
    init { require(address.contains("@")) { "Invalid email" } }
}

@JsExport
class AuthService {
    suspend fun login(email: Email): String = ...
}
```

在 TypeScript 端看来, 它就像一个通常的类:

```TypeScript
// TypeScript
import { AuthService, Email } from "..."
const auth = new AuthService();

console.log(await auth.login(new Email("jane@example.com")));
// 输出结果为: "Welcome, jane@example.com!"
console.log(await auth.login(new Email("not-an-email")));
// 输出结果为: "Invalid email"
```

详情请参见 [`@JsExport` 注解](js-to-kotlin-interop.md#jsexport-annotation).

### 内联 JS 代码时支持 ES2015 功能特性 {id="support-for-es2015-features-when-inlining-js-code"}
<secondary-label ref="js"/>

从 Kotlin 2.4.0 开始, JavaScript 代码内联完全支持 [ES2015 功能特性](js-project-setup.md#support-for-es2015-features).

对于与第三方库的互操作性, 以及对自动应用程序代码生成的直接控制, 这个功能非常有用.

现在你可以在 [`js()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/js.html) 调用中使用现代 JS 功能特性, 包括:

* `const` 和 `let` 变量声明
* ES 类
* 生成器
* Lambda 表达式 ([箭头函数(Arrow Function)](whatsnew21.md#support-for-generating-es2015-arrow-functions))
* 展开(Spread)运算符和剩余(Rest)运算符
* 模板字符串

请记住, `js()` 函数的参数应该是字符串常量, 因为它在编译期被解析, 并"原样"转换为 JavaScript 代码.
例如, 要内联展开运算符, 请使用:

```kotlin
fun spreadExample(): dynamic = js("""
    const add = (a, b, c) => a + b + c;

    const nums = [1, 2, 3];
    const sum = add(...nums);

    const a = [1, 2, 3];
    const b = [...a, 4, 5, 6];

    return { sum, b: b };
""")
```

关于内联 JavaScript 代码, 详情请参见 [我们的文档](js-interop.md#inline-javascript).

### 导出到 TypeScript 时保留类型变异(Type Variance) {id="preserve-type-variance-when-exporting-to-typescript"}
<secondary-label ref="js"/>

之前, 将类型导出到 TypeScript 时, 泛型位置中的 Kotlin [变异(Variance)](generics.md#variance) 信息会丢失.

在 Kotlin 2.4.0 中, 现在在导出时变异注解会被保存, 并映射为 TypeScript 的 [变异注解](https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations).

在你的 Kotlin 代码中, 定义泛型类型参数的变异:

```Kotlin
// Kotlin
// 'out' 表示协变(covariance) (接口只产生 T)
interface Producer<out T> {
    fun produce(): T
}

// 'in' 表示逆变(contravariance) (接口只消费 T)
interface Consumer<in T> {
    fun consume(item: T)
}
```

在 Kotlin 2.4.0 中, `in` 和 `out` 关键字被保留在生成的 TypeScript 输出中:

```TypeScript
// Generated .d.ts
export interface Producer<out T> {
    produce(): T;
}

export interface Consumer<in T> {
    consume(item: T): void;
}
```

### 接口导出到 JavaScript/TypeScript 的改进 {id="improved-interface-export-to-javascript-typescript"}
<secondary-label ref="js"/>

Kotlin 2.4.0 中, 能够更加方便的将 Kotlin 接口导出到 JavaScript/TypeScript.

新的 `@JsNoRuntime` 注解, 删除了之前实现 Kotlin 接口所需的元数据,
允许直接映射到通常的 TypeScript 接口, 类似于默认情况下外部接口的行为方式.

要导出 Kotlin 接口, 例如在 Kotlin Multiplatform 项目中, 请在共通代码中用 `@JsNoRuntime` 注解它:

```kotlin
// commonMain
import kotlin.js.JsNoRuntime

@JsNoRuntime
expect interface DataProcessor {
    fun process(data: String): Int
}
```

然后在 JS 特定的源代码中, 提供实际实现:

```kotlin
// jsMain
@JsNoRuntime
actual interface DataProcessor {
    actual fun process(data: String)
}
```

由于删除了实现 Kotlin 接口需要的元数据, 这个接口被映射为通常的 TypeScript 接口:

```TypeScript
// 生成的 .d.ts 代码
export interface DataProcessor {
    process(data: string): void;
}
```

`@JsNoRuntime` 注解只允许用于标准接口, 让 TypeScript 可以将 Kotlin 接口看作通常的 TypeScript 接口.
因此, 禁止以下操作:

* `is` 和 `as` 类型检查.
* 使用 [`::class` 语法](js-reflection.md) 的类引用.
* 将接口作为实体化的类型参数(reified type argument)传递.

> 不要用 `@JsNoRuntime` 注解外部接口, 因为会导致编译器警告.
>
{type="note"}

### 取消接口导出限制 {id="lifting-restrictions-on-exporting-interfaces"}
<primary-label ref="experimental-general"/>

<secondary-label ref="js"/>

Kotlin 2.4.0 向 `@JsExport` 的稳定化迈出了另一步, 改进了 Kotlin 接口的导出方式.

现在你可以导出带有嵌套类和命名同伴对象的 Kotlin 接口:

```kotlin
@JsExport
interface Identity {
    class Metadata(val tag: String)

    companion object Registry {
        val defaultTag = "GUEST"
    }
}
```

详情请参见 [`@JsExport` 注解](js-to-kotlin-interop.md#jsexport-annotation).

## Gradle {id="gradle"}

Kotlin 2.4.0 完全兼容于 Gradle 7.6.3 到 9.5.0. 你也可以使用最新的 Gradle 版本,
但请注意, 这样做可能会导致废弃警告, 并且某些新的 Gradle 功能特性可能无法正常工作.
Kotlin 2.4.0 还带来了改进, 例如跨平台一致的默认模块名称, 以及对 Kotlin/JVM 将编译器消息写入 Problems API.

### AGP 最低支持版本提升到 8.5.2 {id="minimum-supported-agp-version-bumped-to-8-5-2"}
<secondary-label ref="gradle"/>

从 Kotlin 2.4.0 开始, 最低支持的 Android Gradle plugin 版本为 8.5.2.

### 跨平台一致的模块名称 {id="consistent-module-names-across-platforms"}
<secondary-label ref="gradle"/>

在 Kotlin 2.4.0 之前, 不同平台的默认模块名称不一致.
这种不一致可能导致命名冲突和解析问题. Kotlin 2.4.0 将所有平台的默认名称统一为标准的 `{group}:{project_name}`.

如果你需要将 JVM 的模块名称恢复为其先前版本, 请在 Kotlin/JVM 项目的 `build.gradle.kts` 文件中添加以下内容:

```kotlin
kotlin {
    compilerOptions.moduleName(project.name)
}
```

对于多平台项目:

```kotlin
kotlin {
    jvm {
        compilerOptions.moduleName(project.name)
    }
}
```

### 对 Kotlin/JVM 将编译器消息写入 Problems API {id="compiler-messages-written-to-problems-api-for-kotlin-jvm"}
<secondary-label ref="gradle"/>

在 Kotlin 2.2.0 中, Kotlin Gradle plugin (KGP) 开始向 [Gradle 的 Problems API](https://docs.gradle.org/current/userguide/reporting_problems.html) 报告诊断信息,
以便在 Gradle 的 CLI 和 IntelliJ IDEA 中提供一致的体验.

在 Kotlin 2.4.0 中, 这个 plugin 对 Kotlin/JVM 将编译器消息写入 Problems API,
使 API 更接近于成为所有日志和消息的单一来源.

## Maven {id="maven"}

Kotlin 2.4.0 支持 Maven Toolchains 和自动对齐 Java 版本和 JVM 目标版本, 项目配置更加简便.

### 自动对齐 Java 版本和 JVM 目标版本 {id="automatic-alignment-between-java-and-jvm-target-versions"}
<secondary-label ref="maven"/>

为了简化项目配置并防止兼容性问题, Kotlin Maven plugin 现在会将 JVM 目标版本自动对齐到项目中配置的 Java 编译器版本.

这可以确保 Kotlin 和 Maven 编译器面向相同的字节码版本, 避免 Kotlin 生成的字节码与项目其他部分, 或与预期的部署环境不兼容的问题.

启用 `<extensions>` 选项后, 你不需要设置 `kotlin.compiler.jvmTarget` 或 `kotlin.compiler.jdkRelease` 选项.
如果两者都没有定义, Kotlin Maven plugin 将按以下顺序自动解析 JVM 目标版本:

1. 使用 `maven.compiler.release` 版本, 这个版本定义为项目属性, 或在 `maven-compiler-plugin` 配置中定义.

   在这种情况下, Kotlin 编译器的 `jvmTarget` 和 `jdkRelease` 编译器选项都会被设置, 将 API 限定到特定 JDK 版本.

2. 如果 Maven release 版本未设置, 则使用 `maven.compiler.target` 版本.
   编译器目标可以定义为项目属性, 或在 `maven-compiler-plugin` 配置中定义.

   在这种情况下, 只设置 Kotlin 的 `jvmTarget`, API 不会限定到特定 JDK 版本.

这大大简化了你的 Kotlin 项目配置, 因此你的 `pom.xml` 文件可以如下所示:

```xml
<properties>
    <maven.compiler.release>17</maven.compiler.release>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
    </plugins>
</build>
```

在构建期间, plugin 会输出类似下面的信息:

```none
[INFO] Using jvmTarget=17 (derived from maven.compiler.release=17)
```

> `<extensions>` 选项只检查项目级属性和全局 `maven-compiler-plugin` 配置.
> 它不检查 plugin 的 `<executions>` 节中定义的配置.
>
{style="note"}

关于自动项目配置, 详情请参见 [我们的文档](maven-configure-project.md#jvm-target-version).

### 支持 Maven Toolchains {id="support-for-maven-toolchains"}
<secondary-label ref="maven"/>

Kotlin 2.4.0 为 Kotlin Maven plugin 引入了对 [Maven Toolchains](https://maven.apache.org/guides/mini/guide-using-toolchains.html) 的支持.

这个功能有助于管理构建中的 JDK 版本.
通过 Maven Toolchains, 你可以指定用于 Kotlin 编译的 JDK 版本, 独立于运行 Maven 的 JVM 版本 (在 `JAVA_HOME` 中设置).
当 `maven-toolchains-plugin` 在构建中配置时, Kotlin Maven plugin 会自动选取所选的 JDK 工具链,
与 Maven 编译器 plugin 和其他 Maven plugin 的方式相同.
因此你可以配置单个工具链, 控制构建中所有 plugin 使用的 JDK, 包括 Kotlin 编译:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-toolchains-plugin</artifactId>
    <version>3.2.0</version>
    <executions>
        <execution>
            <goals>
                <goal>toolchain</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <toolchains>
            <jdk>
                <version>21</version>
            </jdk>
        </toolchains>
    </configuration>
</plugin>
```
请记住设置 JDK 版本的不同方式的优先级:

1. `kotlin-maven-plugin` 配置中的 `jdkHome`.
   明确设置的 `jdkHome` 选项始终优先于工具链的版本.
2. `maven-toolchains-plugin` 中的 JDK 版本.
   通过 Maven Toolchains 设置的 JDK 版本会覆盖在 `JAVA_HOME` 路径中设置的 JDK 版本.
3. `JAVA_HOME` 路径.

你也可以使用 plugin 特定的 `<jdkToolchain>` 选项, 在 `kotlin-maven-plugin` 的工具链中直接设置 JDK 版本.
与使用 `maven-toolchains-plugin` 相比, 这个参数只影响 Kotlin 编译, 对构建中的其他 plugin 没有影响.

> 目前, 将 `maven-toolchains-plugin` 设置为使用特定 JDK 版本, 不影响 `kotlin-maven-plugin` 的 `kapt` 和 `test-kapt` goal.
> 要解决这个问题, 请在 `JAVA_HOME` 路径中设置所需版本.
> 详情请参见 [KT-79897](https://youtrack.jetbrains.com/issue/KT-79897).
>
{style="note"}

关于配置 Kotlin Maven 项目, 详情请参见我们的 [文档](maven-configure-project.md).

## 构建工具 API {id="build-tools-api"}

Kotlin 2.4.0 对构建工具 API (Build Tools API, BTA) 进行了许多改进.
BTA:

* 为大多数 JVM 和共通编译器选项引入了新的类型安全抽象.
  BTA 现在处理它们的格式而不是客户端, 降低了错误风险, 并提供了额外的辅助层.
  这个更改在运行期向后兼容, 但可能会破坏源代码兼容性.
* 现在能够在增量编译中跟踪源代码之外的更改, 例如配置不同的 Kotlin 版本, 或更改编译器选项.
  构建系统能够通过 `BaseIncrementalCompilationConfiguration.TRACK_CONFIGURATION_INPUTS` 选项控制这个行为.
* 通过 `AbiValidationToolchain` 支持 [二进制兼容性验证](gradle-binary-compatibility-validation.md),
  使其他构建系统更容易添加这个功能.
* 引入了一个新的功能特性, 使构建系统可以通过
  [`CompilerMessageRenderer`](https://github.com/JetBrains/kotlin/blob/2.4.0/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/CompilerMessageRenderer.kt)
  接口和 [`JvmCompilationOperation` 构建器](https://github.com/JetBrains/kotlin/blob/2.4.0/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/jvm/operations/JvmCompilationOperation.kt#L59)
  自定义编译器信息的显示方式.
* 引入了新的选项, 用于配置 [Kotlin daemon](kotlin-daemon.md) 日志:
  * `LOGS_PATH` — daemon 日志文件的目录.
  * `LOGS_FILE_SIZE_LIMIT` — 最大日志文件大小 (字节单位).
  * `LOGS_FILE_COUNT_LIMIT` — 保留的日志文件最大数.

  默认情况下, 限制设置为 Kotlin 编译器版本相关的值.
  要取消限制, 构建工具必须将选项设置为 `null`.

  构建系统可以在配置 [执行策略](https://github.com/JetBrains/kotlin/blob/2.4.0/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/ExecutionPolicy.kt)
  时设置选项:

  ```kotlin
  val executionPolicy = kotlinToolchains.daemonExecutionPolicy {
      set(ExecutionPolicy.WithDaemon.LOGS_PATH, Paths("/var/log/kotlin-daemon"))
      set(ExecutionPolicy.WithDaemon.LOGS_FILE_SIZE_LIMIT, 10_485_760L)
      set(ExecutionPolicy.WithDaemon.LOGS_FILE_COUNT_LIMIT, 10)
  }
  ```

## Kotlin 编译器 {id="kotlin-compiler"}

Kotlin 2.4.0 中, 在 `.klib` 编译期间, 同一模块内声明的内联函数的行为更加一致.

### 在 klib 编译期间, 模块内函数内联的一致性 {id="consistent-intra-module-function-inlining-during-klib-compilation"}
<secondary-label ref="compiler"/>

之前, [函数内联](inline-functions.md) 在不同的 Kotlin 平台上表现不一致.
JetBrains 团队正在努力统一所有支持的平台上的行为, 以确保相同的兼容性保证.

在 Kotlin/JVM 上, 函数内联发生在编译期间.
因此, 当 Kotlin 源代码使用 Kotlin/JVM 编译器编译时, 生成的类文件的字节码中没有内联函数的调用,
因为内联函数的函数体被内联到调用它们的地方, 因此它们的行为会在编译期间固定.

相反, 在 Kotlin/Native, Kotlin/JS 和 Kotlin/Wasm 上, 函数内联在源代码到 klib 的编译期间不发生, 只在二进制生成期间发生.
因此, 内联函数的行为在 `.klib` 编译期间没有固定,
`.klib` 库对内联函数不能提供与 Kotlin/JVM 相同的兼容性保证.

Kotlin 2.4.0 在生成 `.klib` artifact 时启用模块内的内联, 迈出了统一内联函数行为的第一步:

```kotlin
// 已有的 logging.klib 库
inline fun logDebug(message: String) {
    println("[DEBUG] $message")
}
```

```kotlin
// 当前编译的 App 模块
inline fun greetUser(name: String) {
    println("Hello, $name!")
}

fun main() {
    logDebug("App started") // 不会内联: 声明在另一个模块中
    greetUser("Alice")      // 会内联: 声明在同一模块中
}
```

编译为 `.klib` 时, 代码看起来像这样:

```kotlin
// 伪代码
fun main() {
    logDebug("App started")  // 不会内联, 声明在另一个模块中
    val tmp0 = "Alice"
    println("Hello, $tmp0!") // 从 greetUser() 内联
}
```

这意味着只有在同一模块内声明的内联函数会在 `.klib` 编译期间被内联.
在这种情况下, 其他函数会在生成平台特定二进制文件期间被内联.

#### 如何启用 {id="how-to-enable-intra-module-inlining"}

从 2.4.0 开始, 模块内的内联对于 Kotlin/Native, Kotlin/JS 和 Kotlin/Wasm 默认启用.

如果遇到这个功能的意外问题, 你可以在命令行中使用以下编译器选项禁用它:

```bash
-Xklib-ir-inliner=disabled
```

下一步是启用跨模块的内联, 以确保项目中的所有内联函数都一致的内联.
这个变更计划在未来的 Kotlin 发布版中实现, 但你已经可以在命令行中使用以下编译器选项来试用这个功能:

```bash
-Xklib-ir-inliner=full
```

请在 [YouTrack](https://kotl.in/issue) 中分享你的反馈意见, 并报告任何问题.

### 跨 Kotlin 编译器的部分库链接(Partial Library Linkage)的一致性 {id="consistent-partial-library-linkage-across-kotlin-compilers"}
<secondary-label ref="compiler"/>

在 Kotlin 1.9.0 中, Kotlin/Native 和 Kotlin/JS 编译器默认启用了部分库链接(Partial Library Linkage),
Kotlin/Wasm 在 Kotlin 2.0.0 中启用.
这个功能特性实际上使编译器对 Kotlin 库链接问题的处理, 与 Kotlin/JVM 保持一致.

此后, 我们没有收到负面反馈, 也没有发现用户在其项目中禁用部分链接.
因此, 从 Kotlin 2.4.0 开始, 部分链接始终启用, 并且 `-Xpartial-linkage` 编译器选项现在已废弃.

所有 Kotlin 编译器的默认日志级别是 `SILENT`. 链接问题在编译期间不会报告.
要修改你项目中的这种行为, 请在构建文件中设置 `-Xpartial-linkage-loglevel` 编译器选项:

```kotlin
// build.gradle.kts
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 使用 "info" 日志级别报告链接问题:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 将问题作为错误报告:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```
{validate="false"}

* `INFO` 使用 "info" 日志级别报告链接问题.
* `WARNING` 在编译期间报告警告, 并记录在编译日志中.
* `ERROR` 会在发生链接问题时让编译失败, 并在编译日志中报告错误.
  使用这个选项可以更仔细的检查链接问题.

如果遇到这个功能特性相关的问题, 请在 [我们的问题追踪系统](https://kotl.in/issue) 中报告.

## Kotlin 编译器 plugin {id="kotlin-compiler-plugins"}

在 Kotlin 2.4.0 中, Kotlin 的编译器 plugin 也有了重要更新.
kapt plugin 现在能够从编译类路径中排除不必要的注解处理器,
Power-assert plugin 通过新的运行时库提供了简化的配置.

### kapt: 从编译类路径中排除注解处理器 {id="kapt-exclude-annotation-processors-from-compile-classpath"}

Kotlin 2.4.0 对注解处理器的发现添加了 `includeCompileClasspath` 配置选项, 与 Kotlin Gradle plugin 类似.
新的选项允许你从编译类路径中排除不必要的注解处理器.

要在构建文件中配置这个选项, 请在 kapt plugin 的 `<execution>` 节中将 `includeCompileClasspath` 选项设置为 `false`:

```xml
<execution>
    <id>kapt</id>
        <goals><goal>kapt</goal></goals>
        <configuration>
            <!-- 添加新选项 -->
            <includeCompileClasspath>false</includeCompileClasspath>
            <sourceDirs>...</sourceDirs>
            <annotationProcessorPaths>...</annotationProcessorPaths>
        </configuration>
</execution>
```

或者, 你可以在 `<properties>` 节中对 `kapt.include.compile.classpath` 进行同样的设置:

```xml
<properties>
    <kapt.include.compile.classpath>false</kapt.include.compile.classpath>
</properties>
```

当选项设置为 `false` 时, kapt 配置的 `<annotationProcessorPaths>` 节中没有包含的注解处理器,
将从 kapt 处理中排除.

如果没有设置 `includeCompileClasspath`, 而且 kapt 在编译类路径上检测到一个在 `<annotationProcessorPaths>`
节中没有明确定义的注解处理器, 你会看到以下废弃警告:

```text
[WARNING] Annotation processors discovery from compile classpath is deprecated. Set 'kapt.include.compile.classpath=false' to disable discovery.
```

关于 kapt 配置, 详情请参见我们的 [文档](kapt.md).

### Power-assert: 新的运行时库 {id="power-assert-new-runtime-library"}

Kotlin 2.4.0 使用新的运行时库, 让支持 Power-assert 的函数更易被发现, 更易于配置.

之前, 采用 Power-assert 需要复杂的构建配置和函数参数约定.
从这个版本开始, 支持 Power-assert 的函数可以使用新的运行时库, 直接与编译器 plugin 转换集成.

这为 plugin 的用户和库的开发者带来了重大改进:

* 新的 `CallExplanation` 数据结构提供了关于调用端的详细信息.
  因此能够对断言失败更加动态的渲染图表, 并更好的与外部工具集成.
* 新的 `@PowerAssert` 注解使断言函数可以立即被编译器 plugin 发现.
  这样, 你现在可以为你的库添加直接的 Power-assert 支持.

> 请使用我们的 [示例集合](https://github.com/bnorm/power-assert-examples#power-assert-examples) 作为试验场, 体验这些新功能特性.
>
{style="tip"}

详情请参见我们的 [文档](power-assert.md#use-the-power-assert-plugin).

## Compose 编译器 {id="compose-compiler"}

在 Kotlin 2.4.0 中, Compose 编译器提供了更加一致的增量编译, 并推进了几个功能特性 flag 的废弃周期.

### 对内部声明的一致增量编译 {id="consistent-incremental-compilation-for-internal-declarations"}
<secondary-label ref="compose-compiler"/>

从 Kotlin 2.4.0 开始, Compose 编译器提供了更加一致的增量编译.
内部类型在不同文件之间的稳定性现在在运行期间进行推断.
因此 Compose 即使在类的使用没有被重新编译时, 也能够更新推断的稳定性值.

副作用是, 当 `@Composable` 函数使用来自不同文件的 `internal` 类作为参数时, 你的 artifact 大小可能会增加.
这是由于编译器为稳定的和不稳定的两种情况编码执行路径而引起的, 因为稳定性必须在运行期间决定.
执行全应用程序优化的 minifier (例如 R8), 会消除这种运行期间稳定性的开销, 因为它们能够推断不必要的执行路径, 并清除它.

这个更新不改变最终的稳定性值, 因此 `@Composable` 函数的行为保持不变.

### 功能特性 flag 的废弃 {id="feature-flag-deprecations"}
<secondary-label ref="compose-compiler"/>

Kotlin 2.4.0 对已升级为稳定版, 并且现在默认启用的实验性功能特性的 flag, 推进了它们的废弃周期:

* `StrongSkipping`, `IntrinsicRemember`, 以及相关的 DSL 属性已提升为 `DeprecationLevel.ERROR`.
  它们将在 Kotlin 2.5.0 中删除.
* `OptimizeNonSkippingGroups` 和 `PausableComposition` 现在已废弃.
  它们计划在 Kotlin 2.6.0 中移除.

## 破坏性变更和废弃 {id="breaking-changes-and-deprecations"}

本节重点介绍重要的破坏性变更和废弃.
完整的概述, 请参见我们的 [兼容性指南](compatibility-guide-24.md).

* 从 Kotlin 2.4.0 开始, 编译器不再支持 `-language-version=1.9`.
  因此, K1 编译器不再支持.
* Kotlin 2.4.0 简化了 Kotlin Gradle plugin 中用于二进制兼容性验证的 DSL, 并废弃了某些部分.
  关于最新的 DSL, 请参见 [Kotlin Gradle plugin 中的二进制兼容性验证](gradle-binary-compatibility-validation.md).
* [通过 `KotlinScriptMojo` Maven plugin 执行 Kotlin 脚本的功能, 已被删除](compatibility-guide-22.md#deprecations-to-kotlin-scripting).

## 文档更新 {id="documentation-updates"}
我们对 Kotlin 生态系统进行了以下文档变更:

* [Compose Multiplatform 应用中的 Liquid Glass](https://kotlinlang.org/docs/multiplatform/ios-liquid-glass.html)
  — 将 iOS 应用从完全由 Compose 驱动的导航, 迁移到带有 iOS 26 Liquid Glass 样式的原生 SwiftUI 导航.
* [将 Swift 包添加为 KMP 模块的依赖项](multiplatform-spm-import.md)
  — 学习如何在 KMP 项目中设置 SwiftPM 依赖项.
* 手动 [将 Kotlin Multiplatform 项目从 CocoaPods 切换到 SwiftPM 依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html) 或 [使用 Junie 自动迁移](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html)
  — 学习如何使用 Junie 和 Kotlin AI 技能, 实现更容易的迁移.
* [为 KMP 应用配置 TeamCity](https://kotlinlang.org/docs/multiplatform/configure-teamcity-for-kmp.html)
  — 使用 TeamCity 构建, 测试和部署你的 KMP 应用程序.
* [Navigation 3 的推荐序列化方案](https://kotlinlang.org/docs/multiplatform/compose-navigation-3.html#recommended-serialization-approaches)
  — 寻找在 CMP 应用程序中, 将序列化与 Navigation 3 结合使用的最佳方案.
* [Multiplatform ViewModel](https://kotlinlang.org/docs/multiplatform/compose-viewmodel.html)
  — 学习如何在跨平台项目中设置和使用 ViewModel.
* [使用 Kotlin 进行后端开发](server-overview.md)
  — 探索用于后端开发的不同框架.
* [使用 Spring Boot 和 Claude 创建任务管理应用](spring-boot-claude.md)
  — 学习 Claude 如何帮助你从头开始使用 Spring Boot 创建应用.
* [配置 Maven 项目](maven-configure-project.md)
  — 在你现有的 Java Maven 项目或新的 Kotlin Maven 项目中, 设置 Kotlin 编译.
* [使用 Maven 测试 Kotlin 项目](jvm-test-maven.md)
  — 学习如何使用 JUnit 创建测试, 以及使用 Maven plugin 运行单元测试和集成测试.
* [在 Kotlin 项目中使用注解处理器](jvm-annotation-processors.md)
  — 选择 kapt 或 KSP, 在后端项目中处理注解.
* [Kotlin AI skill](kotlin-ai-skills.md)
  — 使用 agent skill 帮助你执行 Kotlin 特定的任务.
* [Kotlin 语言服务器](kotlin-lsp.md)
  — 阅读 JetBrains 对 Kotlin 语言服务器协议 (Language Server Protocol, LSP)的官方实现.
* [数值](numbers.md)
  — 探索 Kotlin 的数值类型, 以及如何使用.
* [KSP 入门](ksp-quickstart.md)
  — 学习如何向项目添加基于 KSP 的处理器, 或创建自己的处理器.
* [从 kapt 迁移到 KSP](ksp-kapt-migration.md)
  — 迁移你的注解处理器, 以充分利用 Kotlin 的功能特性.
* [Lincheck 概述](lincheck-guide.md)
  — 了解 Lincheck 如何在 JVM 上测试并发代码.
* [Lincheck 入门](lincheck-getting-started.md)
  — 创建项目, 并使用 Lincheck 运行测试.
* [使用 Lincheck 测试任意代码](lincheck-testing-arbitrary-code.md)
  — 学习如何使用 Lincheck 测试并发代码.
* [如何使用 Lincheck 测试数据结构](lincheck-how-to-test-data-structures.md)
  — 深入了解 Lincheck 的数据结构测试过程.
* [Lincheck 测试策略](lincheck-testing-strategies.md)
  — 学习 Lincheck 的测试策略: 模型检查与压力测试.
* [配置 Lincheck 测试策略](lincheck-testing-strategies-options.md)
 – 探索 Lincheck 测试策略的不同选项.
* [使用 Dokku 部署 Ktor 应用程序](https://ktor.io/docs/dokku.html)
  – 学习使用 Dokku 进行部署的流程.
