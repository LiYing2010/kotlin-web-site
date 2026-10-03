[//]: # (title: 可调试性)

你的库的使用者将在它的功能基础上构建自己的应用程序, 他们构建的功能将会包含错误, 需要识别和解决这些错误.
这个错误解决过程, 在开发期间可能在调试器内进行, 或在生产环境中使用日志和观测工具进行.
你的库可以遵循这些最佳实践, 让库更加容易调试.

## 为有状态的类型提供 toString 方法 {id="provide-a-tostring-method-for-stateful-types"}

对每个包含状态的类型, 要提供一个有意义的 `toString` 实现.
这个实现应该对实例的当前内容, 返回一个易于理解的表达, 即使是对内部类型也是如此.

由于类型的 `toString` 表达经常会被写入日志, 在实现这个方法时应该考虑安全性, 不要返回敏感的使用者数据.

对你的库中的不同类型, 要确保用来描述状态的格式尽可能的保持一致.
如果这个格式是你的 API 实现的合同(contract)的一部分, 那么它应该明确的描述, 并留下全面的文档.
你的 `toString` 方法产生的输出可能支持解析, 例如在自动化的测试组中.

例如, 考虑一个支持服务订阅的库中的以下类型:

```kotlin
enum class SubscriptionResultReason {
    Success, InsufficientFunds, IncompatibleAccount
}

class SubscriptionResult(
    val result: Boolean,
    val reason: SubscriptionResultReason,
    val description: String
)
```

如果没有 `toString` 方法, 打印输出一个 `SubscriptionResult` 实例不会有什么用处:

```kotlin
fun main() {
    val result = SubscriptionResult(
       false,
       IncompatibleAccount,
       "Users account does not support this type of subscription"
    )

    // 输出结果为 'org.example.SubscriptionResult@13221655'
    println(result)
}
```

调试器中显示的信息也没什么意义:

![调试器中显示的结果](debugger-result.png){width=500}

添加一个简单的 `toString` 实现, 对这两种情况可以显著的改善输出:

```kotlin
// 输出结果为 'Subscription failed (reason=IncompatibleAccount, description="Users 
// account does not support this type of subscription")'
override fun toString(): String {
    val resultText = if(result) "succeeded" else "failed"
    return "Subscription $resultText (reason=$reason, description=\"$description\")"
}
```

![添加 toString 可以生成更好的结果](debugger-result-tostring.png){width=700}

尽管使用数据类来自动得到 `toString` 方法可能很有吸引力, 但由于向后兼容性的原因, 不推荐这样做.
关于数据类, 在 [不要在你的 API 中使用数据类](api-guidelines-backward-compatibility.md#avoid-using-data-classes-in-your-api) 小节中详细讨论.

注意, `toString` 方法中描述的状态不需要是问题域中的信息.
它可以是正在进行的请求的状态(如上面的示例所示), 与外部服务的连接的健康状况,
或者正在进行的操作的中间状态.

例如, 考虑下面的构建器类型:

```kotlin
class Person(
    val name: String?,
    val age: Int?,
    val children: List<Person>
) {
    override fun toString(): String =
        "Person(name=$name, age=$age, children=$children)"
}

class PersonBuilder {
    var name: String? = null
    var age: Int? = null
    val children = arrayListOf<Person>()

    fun child(personBuilder: PersonBuilder.() -> Unit = {}) {
       children.add(person(personBuilder))
    }

    fun build(): Person = Person(name, age, children)
}

fun person(personBuilder: PersonBuilder.() -> Unit = {}): Person = 
    PersonBuilder().apply(personBuilder).build()
```

你使用这个类型的方式如下:

![构建器类型的使用示例](halt-breakpoint.png){width=500}

如果你在上图显示的断点处暂停代码, 那么显示的信息没什么用处:

![在断点处暂停代码的结果](halt-result.png){width=500}

添加一个简单的 `toString` 实现, 可以产生更加有用的输出:

```kotlin
override fun toString(): String =
    "PersonBuilder(name=$name, age=$age, children=$children)"
```

有了这个添加的方法, 调试器会显示:

![对代码暂停处添加 toString](halt-tostring-result.png){width=700}

通过这个方式, 你可以立即看到哪些域已被设置, 哪些没有设置.

## 采用一种异常处理方案, 并编写文档 {id="adopt-and-document-a-policy-for-handling-exceptions"}

我们在 [选择适当的错误处理机制](api-guidelines-consistency.md#choose-the-appropriate-error-handling-mechanism) 小节中讨论过,
有时候, 为了表示一个错误, 你的库需要抛出一个异常. 你可以为这个目的创建你自己的异常类型.

抽象并简化低级 API 的库也需要处理它们的依赖库抛出的异常.
一个库可能选择压制异常, 原样传递异常, 将异常转换为不同类型的异常, 或者以不同的方式向使用者通知错误.

根据具体的环境, 这些选项的任何一种都是有效的. 例如:

* 如果使用者采用库 A, 纯粹只是为了简化库 B,
  那么对于库 A 来说, 重新抛出库 B 生成的任何异常, 不做任何修改, 这样的处理方式可能是合适的.
* 库 A 采用库 B, 纯粹作为内部的实现细节, 那么库 B 抛出的库专有的异常, 不应该暴露给库 A 的使用者.

你必须对异常处理采用一种一致的方案, 并为此编写文档, 以便使用者能够有效的使用你的库.
这一点对于调试尤其重要. 你的库的使用者应该能够在调试器和日志中识别出异常是来自你的库.

异常的类型应该表明错误类型, 异常中的数据应该帮助使用者确定问题的根本原因.
一种常用的模式是, 将低层的异常封装到库专有的异常中, 通过 `cause` 可以访问原来的异常.

## 支持对自定义异常的协程栈追踪(stack trace)恢复 {id="support-coroutine-stack-trace-recovery-for-custom-exceptions"}
<primary-label ref="experimental-general"/>

你可以对你的库中的自定义的异常类型, 添加协程的 [栈追踪(stack trace)恢复](coroutines-debugging.md#stack-trace-recovery) 功能,
让它们更易于调试.
这样可以增强你的库对 `kotlinx.coroutines` 库和 Kotlin 中的其它运行时的支持.

当一个协程通过挂起函数收到来自另一个协程的异常时, 栈追踪恢复功能会创建异常的一个副本, 其中包含执行到这个函数调用的堆栈帧(stack frame).

如果异常的构造器参数只接受异常信息, 只接受原因, 二者都有, 或者没有参数, `kotlinx.coroutines` 库会自动执行栈追踪恢复.
如果你的库中的异常类型需要更多的构造器参数, 例如行号或错误号, 请实现 [`StackTraceRecoverable`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines.debug/-stack-trace-recoverable/) 接口.

要实现这个接口, 请覆盖 [`copyForStackTraceRecovery()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines.debug/-stack-trace-recoverable/copy-for-stack-trace-recovery.html) 函数.
在覆盖函数中, 返回一个新的异常实例, 用于栈追踪恢复, 或者, 如果你不想让 `kotlinx.coroutines` 库复制异常, 则返回 `null`.

`StackTraceRecoverable` 接口是 Kotlin 标准库的一部分, 因此实现它不需要添加对 `kotlinx.coroutines` 库的依赖项.

下面是一个自定义异常的示例, 在为栈追踪恢复功能创建新的实例时, 它会保留一个 `line` 属性:

```kotlin
import kotlin.coroutines.ExperimentalStdlibCoroutineSupportApi
import kotlin.coroutines.debug.StackTraceRecoverable

@OptIn(ExperimentalStdlibCoroutineSupportApi::class)
class FileEditException
// 这个实现需要一个 private 构造器
// 来将 cause 传递给 IllegalStateException 构造器
private constructor(
    val line: Int,
    private val detail: String,
    cause: Throwable?,
) : IllegalStateException("When editing line $line: $detail", cause),
    // 实现 StackTraceRecoverable, 用于栈追踪恢复
    StackTraceRecoverable<FileEditException> {

    constructor(line: Int, detail: String) : this(line, detail, null)

    // 复制行号, 和详细的错误消息
    override fun copyForStackTraceRecovery(): FileEditException =
        FileEditException(line, detail, this)
    }

fun main() {
    val original = FileEditException(15, "Unexpected token")
    
    // 通常, 你不需要直接调用这个函数, 除非是为了测试它的行为
    // kotlinx.coroutines 库会在栈追踪恢复期间自动调用它
    val copy = original.copyForStackTraceRecovery()

    println(copy.message)
    // 输出结果为: When editing line 15: Unexpected token

    println(copy.cause == original)
    // 输出结果为: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.20"}

## 下一步 {id="next-step"}

在本向导的下一部分, 你将学习可测试性.

[进入下一部分](api-guidelines-testability.md)
