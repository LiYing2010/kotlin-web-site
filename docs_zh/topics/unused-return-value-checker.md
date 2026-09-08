[//]: # (title: 未使用的返回值检查器)

<primary-label ref="experimental-general"/>

> 这个功能计划在未来的 Kotlin 版本中进入稳定版, 并继续改进.
> 欢迎在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供反馈意见.
>
> 更多信息, 请参见相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md).
>
{style="note"}

未使用的返回值检查器可以检测 _被忽略的结果_.
这些值是从表达式中返回的, 其返回类型不是 `Unit`, `Nothing`, 或 `Nothing?`, 并且没有被:

* 存储到变量或属性中.
* 被返回或抛出.
* 作为参数传递给另一个函数.
* 在调用或安全调用中用作接收者.
* 在 `if`, `when`, 或 `while` 等条件中检查.
* 用作 Lambda 表达式的最后一条语句.

对于 `++` 和 `--` 等递增操作, 以及右侧退出当前函数的布尔快捷方式(例如 `condition || return`),
检查器不会报告被忽略的结果.

你可以使用未使用的返回值检查器来捕获 bug, 即函数调用产生了有意义的结果, 但结果被悄悄的丢弃.
这有助于防止预想之外的行为, 使此类问题更容易追踪.

以下是一个示例, 其中创建了一个字符串但从未使用, 因此检查器将其报告为被忽略的结果:

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 检查器报告一个警告, 说明这个结果被忽略了:
        // "Unused return value of 'plus'."
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

## 配置未使用的返回值检查器 {id="configure-the-unused-return-value-checker"}

你可以使用 `-Xreturn-value-checker` 编译器选项, 控制编译器如何报告被忽略的结果.

它有以下几种模式:

* `disable`: 禁用未使用的返回值检查器(这是默认值).
* `check`: 启用检查器, 并对来自 [已标记函数](#mark-functions-to-check-ignored-results) 的被忽略结果报告警告.
* `full`: 启用检查器, 将项目中的所有函数视为 [已标记](#mark-functions-to-check-ignored-results), 并对被忽略结果报告警告.

> 所有已标记函数会被相应的传播, 如果一个项目将你的代码作为依赖项, 并且启用了检查器, 则会报告被忽略的结果.
>
{style="note"}

要在项目中使用未使用的返回值检查器, 请将编译器选项添加到构建配置文件中:

<tabs>
<tab id="kotlin" title="Gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```
</tab>

<tab id="maven" title="Maven">

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    ..
    <configuration>
        <args>
            <arg>-Xreturn-value-checker=check</arg>
        </args>
    </configuration>
</plugin>
```

</tab>
</tabs>

## 标记函数, 检查被忽略的结果 {id="mark-functions-to-check-ignored-results"}

将 [`-Xreturn-value-checker` 编译器选项](#configure-the-unused-return-value-checker) 设置为 `check` 时,
检查器只对已标记的表达式报告被忽略的结果, 例如 Kotlin 标准库中的大多数函数.

要标记你自己的代码,
请使用 [`@MustUseReturnValues`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-must-use-return-value/) 注解.
你可以将它应用于文件, 类, 或函数, 具体取决于你希望检查器覆盖的范围.

例如, 你可以标记整个文件:

```kotlin
// 标记这个文件中的所有函数和类, 使检查器报告未使用的返回值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或者标记特定的类:

```kotlin
// 标记这个类中的所有函数, 使检查器报告未使用的返回值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```

> 你可以将 `-Xreturn-value-checker` 编译器选项设置为 `full`, 将检查器应用于整个项目.
> 使用这个选项时, 不必用 `@MustUseReturnValues` 来注解你的代码.
>
{style="note"}

## 压制对被忽略结果的报告 {id="suppress-reports-for-ignored-results"}

你可以使用 [`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/)
注解, 压制对特定函数的报告.
对那些忽略结果是常见情况和预期情况的函数, 请添加注解, 例如 `MutableList.add`:

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

你可以在不注解函数本身的情况下压制警告.
方法是, 使用下划线语法 (`_`) 将结果赋值给一个特殊的无名变量:

```kotlin
// 不允许忽略的函数
fun computeValue(): Int = 42

fun main() {

    // 报告警告: 结果被忽略
    computeValue()

    // 使用特殊的未使用变量, 仅对这个调用压制警告
    val _ = computeValue()
}
```

### 函数覆盖中的被忽略结果 {id="ignored-results-in-function-overrides"}

当你覆盖一个函数时, 覆盖函数会继承基类声明上注解所定义的报告规则.
这个规则同样适用于基类声明是 Kotlin 标准库或其他库依赖项的一部分的情况,
因此检查器会对像 `Any.hashCode()` 这样的函数的覆盖函数, 报告被忽略结果.

此外, 你不能用另一个 [要求使用其返回值](#mark-functions-to-check-ignored-results) 的函数
来覆盖标记了 `@IgnorableReturnValue` 的函数.
但是, 如果结果可以安全的忽略, 你可以在标注了 `@MustUseReturnValues` 的类或接口中,
用 `@IgnorableReturnValue` 标记覆盖函数:

```kotlin
@MustUseReturnValues
interface Greeter {
    fun greet(name: String): String
}

object SilentGreeter : Greeter {
    @IgnorableReturnValue
    override fun greet(name: String): String = ""
}

fun check(g: Greeter) {
    // 报告警告: 未使用的返回值
    g.greet("John")

    // 没有警告
    SilentGreeter.greet("John")
}
```

## 检查高阶函数中的未使用结果 {id="check-for-unused-results-in-higher-order-functions"}

一些高阶函数, 例如 `let` 作用域函数, 会返回 Lambda 表达式的结果.
要检查高阶函数的未使用的 Lambda 表达式结果, 请将 [实验性的](components-stability.md#stability-levels-explained)
`returnsResultOf()` 契约添加到函数的契约中.

> Kotlin 契约是实验性功能. 要选择使用者同意(Opt-in), 请在声明带有契约的函数时,
> 添加 `@OptIn(ExperimentalContracts::class)` 注解.
>
{style="warning"}

以下是一个示例:

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

然后, 你可以使用带有这个契约的函数, 例如 `.customLet()`, 来检查 Lambda 结果是否被使用:

```kotlin
fun handleNullablePackageName(packageName: String?, builder: StringBuilder) {
    // 检查器不报告警告, 因为 append() 的返回值可以被忽略
    packageName?.customLet { builder.append(it) }

    // 检查器报告警告, 因为返回的字符串未被使用
    packageName?.customLet { "kotlin.$it" }
}
```

> `returnsResultOf()` 契约需要单独的编译器选项才能选择启用.
> 请注意, 使用它会产生预发布的(Pre-Release)二进制文件, 2.4.0 版本之前的 Kotlin 编译器无法读取这些文件.
>
{style="warning"}

要对你的项目标注使用者同意(Opt-in), 请将以下编译器选项添加到构建文件中:

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

</tab>
<tab title="Maven" group-key="maven">

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

## 与 Java 注解的互操作性 {id="interoperability-with-java-annotations"}

一些 Java 库使用不同注解实现类似的机制.
未使用的返回值检查器将以下注解视为等同于使用 `@MustUseReturnValues`:

* [`com.google.errorprone.annotations.CheckReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CheckReturnValue.html)
* [`edu.umd.cs.findbugs.annotations.CheckReturnValue`](https://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/CheckReturnValue.html)
* [`org.jetbrains.annotations.CheckReturnValue`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/CheckReturnValue.html)
* [`org.springframework.lang.CheckReturnValue`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/lang/CheckReturnValue.html)
* [`org.jooq.CheckReturnValue`](https://www.jooq.org/javadoc/latest/org.jooq/org/jooq/CheckReturnValue.html)

它还将
[`com.google.errorprone.annotations.CanIgnoreReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CanIgnoreReturnValue.html)
视为等同于使用 `@IgnorableReturnValue`.
