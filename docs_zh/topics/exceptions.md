[//]: # (title: 异常(Exception))

异常能够让你的代码运行更加可预测, 即使发生可能中断程序执行的运行期错误.
Kotlin 默认将所有异常看作 _不受控的(unchecked)_ 异常.
不受控的异常简化了异常的处理过程: 你可以捕获异常, 但你不需要明确的处理或 [声明](java-to-kotlin-interop.md#checked-exceptions) 异常.

> 关于 Kotlin 与 Java, Swift, 和 Objective-C 交互时如何处理异常,
> 详情请参见 [与 Java, Swift, 和 Objective-C 的异常互操作](#exception-interoperability-with-java-swift-and-objective-c) 小节.
>
{style="tip"}

处理异常包括 2 个主要操作:

* **抛出异常:** 指示问题发生.
* **捕获异常:** 通过解决问题, 或通知开发者或应用程序使用者, 手动处理意外的异常.

异常通过
[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 类的子类来表示,
`Exception` 是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类的子类.
关于异常的层级结构, 详情请参见 [异常的层级结构](#exception-hierarchy) 小节.
由于 `Exception` 是一个 [`open 类`](inheritance.md), 因此你可以创建 [自定义异常](#create-custom-exceptions), 以满足你的 应用程序的特定需求.

## 抛出异常 {id="throw-exceptions"}

你可以使用 `throw` 关键字, 手动抛出异常.
抛出一个异常, 表示在代码中发生了一个意外的运行期错误.
异常是 [对象](classes.md#creating-instances-of-classes), 抛出异常会创建一个异常类的一个实例.

你可以抛出一个没有任何参数的异常:

```kotlin
throw IllegalArgumentException()
```

为了更好的理解问题的根源, 请包含更多信息, 例如自定义消息, 以及原始原因:

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// 如果 userInput 为负数, 抛出一个 IllegalArgumentException 异常
// 此外, 它还显示原始原因, 通过 cause IllegalStateException 表示
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

在这个示例中, 当使用者输入负数值时, 会抛出一个 `IllegalArgumentException` 异常.
你可以创建自定义的错误消息, 并保留异常的原始原因(`cause`),
`cause` 会被包含在 [栈追踪(stack trace)](#stack-trace) 中.

### 使用前提条件的检查函数抛出异常

Kotlin 提供了另一种方式, 使用前提条件的检查函数自动抛出异常.
前提条件的检查函数包括以下几种:

| 前提条件的检查函数                        | 使用场景       | 抛出的异常                                                                                                          |
|----------------------------------|------------|----------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 校验使用者的输入   | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/) |
| [`check()`](#check-function)     | 校验对象或变量的状态 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)       |
| [`error()`](#error-function)     | 表示非法状态或条件  | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)       |

这些函数适合于, 如果指定的条件不满足, 程序的流程就无法继续的情况.
使用这些函数可以简化你的代码, 并让这些检查处理变得更加高效.

#### require() 函数 {id="require-function"}

如果输入的参数对函数操作非常重要, 参数不正确函数就无法继续运行,
这样的情况下, 可以使用 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函数来校验输入参数.

如果 `require()` 中的条件不满足, 它会抛出一个 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/) 异常:

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // 这里会失败, 抛出一个 IllegalArgumentException 异常
    println(getIndices(-1))

    // 取消下面的行的注释, 查看一个能够运行的示例
    // println(getIndices(3))
    // 输出结果为: [1, 2, 3]
}
```
{kotlin-runnable="true"}

> `require()` 函数允许编译器执行 [智能类型转换](typecasts.md#smart-casts).
> 检查成功之后, 变量会自动转换为非 null 类型.
> 这些函数经常用来进行 null 检查, 在继续处理之前确保变量不为 null. 例如:
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // null 检查
>     require(str != null) 
>     // 检查成功之后, 'str' 可以确保不为 null,
>     // 并被自动的智能类型转换为非 null 的 String 类型
>     println(str.length)
> }
> ```
>
{style="note"}

#### check() 函数 {id="check-function"}

可以使用 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函数来校验一个对象或变量的状态.
如果检查失败, 表示存在需要解决的逻辑错误.

如果 `check()` 函数中指定的条件为 `false`, 它会抛出一个 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/) 异常:

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {
        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 如果你取消下面的行的注释, 那么程序会失败, 抛出 IllegalStateException 异常
    // getStateValue()

    someState = ""

    // 如果你取消下面的行的注释, 那么程序会失败, 抛出 IllegalStateException 异常
    // getStateValue()
    someState = "non-empty-state"

    // 输出结果为 "non-empty-state"
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> `check()` 函数允许编译器执行 [智能类型转换](typecasts.md#smart-casts).
> 检查成功之后, 变量会自动转换为非 null 类型.
> 这些函数经常用来进行 null 检查, 在继续处理之前确保变量不为 null. 例如:
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // null 检查
>     check(str != null)
>     // 检查成功之后, 'str' 可以确保不为 null,
>     // 并被自动的智能类型转换为非 null 的 String 类型
>     println(str.length)
> }
> ```
>
{style="note"}

#### error() 函数 {id="error-function"}

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 函数用来标记一个不合法的状态, 或代码中逻辑上不应该发生的条件.
它适合于你想要在你的代码中有意抛出一个异常的场景, 例如, 代码遇到了一个预料之外的状态.
这个函数在 `when` 表达式中特别有用, 它提供了一种清晰的方式, 处理逻辑上不应该发生的情况.

在下面的示例中, 使用了 `error()` 函数来处理一个未定义的用户角色.
如果用户角色不是预定义的角色之一, 就会抛出一个 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/) 异常:

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" -> println("${user.name} is an admin.")
        "editor" -> println("${user.name} is an editor.")
        "viewer" -> println("${user.name} is a viewer.")
        else -> error("Undefined role: ${user.role}")
    }
}

fun main() {
    // 这段代码能够正常工作
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // 输出结果为 Alice is an admin.

    // 这段代码会抛出一个 IllegalStateException 异常
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable="true"}

## 使用 try-catch 代码段处理异常 {id="handle-exceptions-using-try-catch-blocks"}

当一个异常被抛出时, 它会中断程序的正常执行.
你可以使用 `try` 和 `catch` 关键字, 优雅的处理异常, 保持你的程序稳定.
`try` 代码段包含可能抛出一个异常的代码, 如果异常发生, `catch` 代码段会捕获并处理异常.
异常会被与异常的类型, 或异常的 [超类](inheritance.md) 匹配第一个 `catch` 代码段捕获.

你可以象下面这样, 共同使用 `try` 和 `catch` 关键字:

```kotlin
try {
    // 可能抛出一个异常的代码
} catch (e: SomeException) {
    // 处理异常的代码
}
```

将 `try-catch` 作为表达式使用, 是一种常见的方法, 这样就可以从 `try` 代码段或从 `catch` 代码段返回一个值:

```kotlin
fun main() {
    val num: Int = try {
        // 如果 count() 成功结束, 它的返回值会赋值给 num
        count()
    } catch (e: ArithmeticException) {
        // 如果 count() 抛出一个异常, catch 代码段返回 -1,
        // 然后赋值给 num
        -1
    }
    println("Result: $num")
}

// 模拟一个可能抛出 ArithmeticException 异常的函数
fun count(): Int {
    // 可以修改这个值, 返回不同的值给 num
    val a = 0

    return 10 / a
}
```
{kotlin-runnable="true"}


你可以对同一个 `try` 代码段使用多个 `catch` 处理块.
你可以根据需要添加任意数量的 `catch` 代码段, 分别处理不同的异常.
如果你使用多个 `catch` 代码段, 要将它们按照从最具体的异常到最不具体的异常的顺序, 在你的代码中排列为从上到下的顺序.
这个排列顺序与程序的执行流程相同.

我们来看看这个使用 [自定义异常](#create-custom-exceptions) 的示例:

```kotlin
open class WithdrawalException(message: String) : Exception(message)
class InsufficientFundsException(message: String) : WithdrawalException(message)

fun processWithdrawal(amount: Double, availableFunds: Double) {
    if (amount > availableFunds) {
        throw InsufficientFundsException("Insufficient funds for the withdrawal.")
    }
    if (amount < 1 || amount % 1 != 0.0) {
        throw WithdrawalException("Invalid withdrawal amount.")
    }
    println("Withdrawal processed")
}

fun main() {
    val availableFunds = 500.0

    // 请修改这个值, 测试不同的场景
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // 代码段的顺序是很重要的!
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

处理 `WithdrawalException` 的一般性的 `catch` 代码段, 会捕获这个类型的所有异常,
包括具体的类型, 例如 `InsufficientFundsException`,
除非这些异常被更加具体的 `catch` 代码段在前面捕获.

### finally 代码段 {id="the-finally-block"}

`finally` 代码段包含的代码始终会执行, 无论 `try` 代码段成功结束, 还是抛出一个异常.
使用 `finally` 代码段, 你可以在 `try` 和 `catch` 代码段的执行之后清理代码.
在处理文件或网络连接这样的资源时, 这是非常重要的, 因为 `finally` 可以保证它们被正确的关闭或释放.

共同使用 `try-catch-finally` 代码段的方法通常如下:

```kotlin
try {
    // 可能抛出一个异常的代码
}
catch (e: YourException) {
    // 异常处理
}
finally {
    // 始终会执行的代码
}
```

`try` 表达式的返回值, 由 `try` 或 `catch` 代码段中最后执行的表达式决定.
如果没有异常发生, 结果来自 `try` 代码段; 如果一个异常被处理了, 结果就来自 `catch` 代码段.
`finally` 代码段始终会被执行, 但它不会改变 `try-catch` 代码段的结果.

我们来看一个示例的演示:

```kotlin
fun divideOrNull(a: Int): Int {
    // try 代码段始终会被执行
    // 这里发生一个异常(被 0 除), 导致立即跳转到 catch 代码段
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }

    // catch 代码段会被执行, 因为发生 ArithmeticException 异常 (当 a ==0 时, 会发生被 0 除的错误)
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    // 修改这个值, 可以得到不同的结果. ArithmeticException 异常会返回: -1
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> 在 Kotlin 中, 对于实现了 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 接口的资源,
> 例如, `FileInputStream` 或 `FileOutputStream` 之类的文件流,
> 符合惯用法的管理方法是使用 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 函数.
> 这个函数会在代码段执行完毕后自动关闭资源, 无论代码段是否抛出异常, 因此不需要使用 `finally` 代码段.
> 所以, Kotlin 不需要 [Java 的 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 那样的特殊的语法来进行资源管理.
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // 在这个代码段之后, .use 函数会自动调用 writer.close(), 与 finally 代码段类似
> }
> ```
>
{style="note"}

如果你的代码需要清理资源, 但不处理异常, 你也可以使用 `try` 和 `finally` 代码段, 但不使用 `catch` 代码段:

```kotlin
class MockResource {
    fun use() {
        println("Resource being used")
        // 模拟一个被使用的资源
        // 这里发生被 0 除错误, 抛出一个 ArithmeticException 异常
        val result = 100 / 0

        // 如果抛出异常, 这行不会执行
        println("Result: $result")
    }

    fun close() {
        println("Resource closed")
    }
}

fun main() {
    val resource = MockResource()
//sampleStart
    try {
        // 尝试使用资源
        resource.use()
    } finally {
        // 即使发生异常, 确保资源始终会被关闭
        resource.close()
    }

    // 如果抛出异常, 这行不会打印输出
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

你可以看到, `finally` 代码段保证资源会被关闭, 无论是否有异常发生.

在 Kotlin 中, 你可以根据需求灵活的选择, 可以只使用 `catch` 代码段, 只使用 `finally` 代码段, 或者两者都使用,
但 `try` 代码段必须伴随至少一个 `catch` 代码段或 `finally` 代码段一起使用.

## 创建自定义异常 {id="create-custom-exceptions"}

在 Kotlin 中, 你可以创建类, 扩展内建的 `Exception` 类, 定义自定义的异常.
通过这种方式, 你可以创建更加具体的错误类型, 以符合你的应用程序的需要.

要创建一个自定义的异常, 你可以定义一个类, 扩展 `Exception` 类:

```kotlin
class MyException: Exception("My message")
```

在这个示例中, 指定了默认的错误消息, "My message", 但如果你需要, 你可以不指定默认错误消息.

> Kotlin 中的异常是有状态的对象, 带有与它们创建时的上下文环境相关的信息, 称为 [栈追踪(stack trace)](#stack-trace).
> 不要使用 [对象声明](object-declarations.md#object-declarations-overview) 来创建异常.
> 相反, 要在每次需要时, 创建异常类的新实例.
> 通过这种方式, 你可以确保异常的状态准确的反映特定的上下文环境.
>
{style="tip"}

自定义异常也可以是任何既有的异常子类的子类, 例如子类 `ArithmeticException`:

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> 如果你想要创建自定义异常的子类, 你必须将父类声明为 `open`,
> 因为 [类默认为 final](inheritance.md), 不能声明子类.
>
> 例如:
>
> ```kotlin
> // 将一个自定义异常声明为 open 类, 让它能够声明子类
> open class MyCustomException(message: String): Exception(message)
>
> // 创建自定义异常的子类
> class SpecificCustomException: MyCustomException("Specific error message")
> ```
>
{style="note"}

自定义异常的行为与内建的异常是一样的. 你可以使用 `throw` 关键字抛出自定义异常, 并使用 `try-catch-finally` 代码段处理它们.
我们来看一个示例的演示:

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    // 修改函数中的这个值, 得到不同的异常
    myFunction(1)
}
```
{kotlin-runnable="true"}

在具有多种错误场景的应用程序中, 创建异常类的层级可以让代码更加清晰, 更加具体.
要做到这一点, 你可以使用一个 [抽象类](classes.md#abstract-classes) 或一个
[封闭类](sealed-classes.md#constructors) 作为基类, 实现共通的异常功能, 并为详细的异常类型创建具体的子类.
此外, 带有可选参数的自定义异常提供一种灵活性, 能够使用不同的消息进行初始化, 实现更加精细的错误处理.

我们来看一个示例, 它使用封闭类 `AccountException` 作为异常类层级的基类,
以及子类 `APIKeyExpiredException` , 演示使用可选参数实现更高级的异常详细信息:

```kotlin
//sampleStart
// 创建一个封闭类, 作为账户相关错误的异常类层级的基类
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// 创建 AccountException 的一个子类
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// 创建 AccountException 的一个子类, 能够指定自定义消息和错误原因
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null): AccountException(message, cause)

// 修改占位函数的值, 得到不同的结果
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// 校验 account 证书 和 API key
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 示例, 抛出 APIKeyExpiredException, 指定具体的原因
        val cause = RuntimeException("API key validation failed due to network error")
        throw APIKeyExpiredException(cause = cause)
    }
}

fun main() {
    try {
        validateAccount()
        println("Operation successful: Account credentials and API key are valid.")
    } catch (e: AccountException) {
        println("Error: ${e.message}")
        e.cause?.let { println("Caused by: ${it.message}") }
    }
}
```
{kotlin-runnable="true"}

## Nothing 类型 {id="the-nothing-type"}

在 Kotlin 中, 每个表达式都有类型.
表达式 `throw IllegalArgumentException()` 的类型是 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html),
这是一个内建类型, 它是所有其它类型的子类型, 也叫做 [底类型(Bottom Type)](https://en.wikipedia.org/wiki/Bottom_type).
也就是说, 在需要其它任何类型的地方, 都可以使用 `Nothing` 作为返回类型, 或泛型类型, 不会导致类型错误.

`Nothing` 是 Kotlin 中的一个特殊类型, 用来表示未能成功执行完毕的函数或表达式,
原因可能是它们总是抛出异常, 或者进入了无法终结的执行路径, 例如无限循环.
你可以使用 `Nothing` 来标记还没有实现的函数, 或者设计为总是抛出异常的函数,
向编译器, 也向代码的阅读者, 明确的表示你的意图.
如果编译器在函数签名中推断出 `Nothing` 类型, 它会提出警告.
将返回类型明确的定义为 `Nothing`, 可以消除这个警告.

这段 Kotlin 代码演示 `Nothing` 类型的使用, 这里编译器将函数调用之后的代码标记为不可到达:

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // 这个函数永远不会成功返回.
    // 它始终抛出一个异常.
}

fun main() {
    // 创建一个 Person 的实例, 'name' 为 null
    val person = Person(name = null)

    val s: String = person.name ?: fail("Name required")

    // 在这个地方, 's' 可以确保已被初始化
    println(s)
}
```
{kotlin-runnable="true"}

Kotlin 的 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 函数, 也使用 `Nothing` 类型, 用作一个占位符, 用来突出表示未来需要实现的代码区域:

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // 这段代码抛出一个 NotImplementedError 异常
    println(result)
}
```
{kotlin-runnable="true"}

你可以看到, `TODO()` 函数永远会抛出一个 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 异常.

## 异常类 {id="exception-classes"}

我们来看看 Kotlin 中的一些常见的异常类型, 它们都是 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 类的子类:

* [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/):
  当一个算数操作无法执行时, 会发生这个异常, 例如被 0 除.

    ```kotlin
    val example = 2 / 0 // 抛出 ArithmeticException 异常
    ```

* [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/):
  抛出这个异常表示, 一个某种类型的下标, 例如一个数组或字符串下标, 超出了范围.

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // 抛出 IndexOutOfBoundsException 异常
    ```

  > 要避免发生这个异常, 请使用更加安全的替代方案, 例如 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 函数:
  >
  > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // 返回 null, 而不是抛出 IndexOutOfBoundsException 异常
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
  >
  {style="note"}

* [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/):
  当一个元素在被访问的集合中不存在时, 会抛出这个异常.
  这个错误发生在使用需要特定元素的方法的情况,
  例如 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html), [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html), 或 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html).

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // 抛出 NoSuchElementException 异常
    ```

  > 要避免发生这个异常, 请使用更加安全的替代方案, 例如 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 函数:
  >
  > ```kotlin
    > val emptyList = listOf<Int>()
    > // 返回 null, 而不是抛出 NoSuchElementException 异常
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
  >
  {style="note"}

* [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/):
  当试图将一个字符串转换为数值类型, 但字符串格式不正确时, 会发生这个异常.

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // 抛出 NumberFormatException 异常
    ```

  > 要避免发生这个异常, 请使用更加安全的替代方案, 例如 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 函数:
  >
  > ```kotlin
    > val nonNumericString = "not a number"
    > // 返回 null, 而不是抛出 NumberFormatException 异常
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
  >
  {style="note"}

* [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/):
  当一个应用程序尝试使用一个值为 `null` 的对象引用时, 会抛出这个异常.
  尽管 Kotlin 的 null 安全性功能大大减少了发生 NullPointerException 的风险,
  但仍然可能发生这个异常, 原因可能是有意的使用 `!!` 操作符, 或者与 Java 交互, 而 Java 缺乏 Kotlin 的 null 安全性.

    ```kotlin
    val text: String? = null
    println(text!!.length) // 抛出 a NullPointerException 异常
    ```

尽管 Kotlin 的所有异常都是不受控的(unchecked), 而且你不必明确的捕获异常, 但你仍然拥有灵活性, 可以在需要的时候捕获异常.

### 异常的层级结构 {id="exception-hierarchy"}

Kotlin 异常层级结构的根是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类.
它有 2 个直接子类, [`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/)
和 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/):

* `Error` 子类表示严重的基础性问题, 应用程序可能无法自行回复.
  这些问题你通常不会尝试去处理, 例如 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 或 `StackOverflowError`.

* `Exception` 子类用于你可能想要处理的条件.
  `Exception` 类型的子类, 例如 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 和 `IOException` (输入/输出异常),
  处理应用程序中的异常事件.

![异常的层级结构 - Throwable 类](throwable.svg){width=700}

`RuntimeException` 通常由程序代码中的检查不足引起, 可以通过编程的方式预防.
Kotlin 会帮助阻止常见的 `RuntimeExceptions`, 例如 `NullPointerException`,
并对潜在的运行期错误提供编译期警告, 例如, 被 0 除.
下图描述 `RuntimeException` 的子类型的层级结构:

![Hierarchy of RuntimeExceptions](runtime-exception.svg){width=700}

## 栈追踪(stack trace) {id="stack-trace"}

_栈追踪(stack trace)_ 由运行期环境生成的报告, 用于调试.
它显示导向程序中特定位置的函数调用序列, 尤其是错误异常发生的位置.

我们来看一个示例, 这里由于发生了 JVM 环境中的一个异常, 栈追踪(stack trace) 会自动打印输出:

```kotlin
fun main() {
//sampleStart
    throw ArithmeticException("This is an arithmetic exception!")
//sampleEnd
}
```
{kotlin-runnable="true"}

在 JVM 环境中运行这段代码, 会产生下面的输出:

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

第 1 行是异常的描述, 包括:

* 异常类型: `java.lang.ArithmeticException`
* 线程: `main`
* 异常消息: `"This is an arithmetic exception!"`

在异常描述之后, 以 `at` 开始的其它所有行, 是栈追踪(stack trace).
每一行称为一个 _栈追踪元素(stack trace element)_ 或者叫一个 _栈帧(stack frame)_:

* `at MainKt.main (Main.kt:3)`: 这行显示方法名称 (`MainKt.main`), 以及调用这个方法的源代码文件和行号 (`Main.kt:3`).
* `at MainKt.main (Main.kt)`: 这行显示异常发生在 `Main.kt` 文件的 `main()` 函数内.

## 与 Java, Swift, 和 Objective-C 的异常互操作 {id="exception-interoperability-with-java-swift-and-objective-c"}

由于 Kotlin 将所有异常当作不受控的(unchecked), 因此, 当从区分受控和不受控异常的语言中调用这些异常时, 可能导致复杂的情况.
为了解决 Kotlin 和 Java, Swift, 和 Objective-C 之类语言之间, 对异常处理的这种差异,
你可以使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 注解.
这个注解会警告调用者可能出现的异常.
详情请参见 [在 Java 中调用 Kotlin](java-to-kotlin-interop.md#checked-exceptions) 和
[与 Swift/Objective-C 交互](native-objc-interop.md#errors-and-exceptions).
