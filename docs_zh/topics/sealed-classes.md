[//]: # (title: 封闭类(Sealed Class)与封闭接口(Sealed Interface))

_封闭_ 类和接口提供了对类的继承关系进行控制的方式.
一个封闭类的所有的直接子类(Direct Subclass)在编译时刻就能够确定.
在定义封闭类的模块和包之外, 不可能再出现其他子类.
对于封闭接口和它们的实现类也是如此: 在含有封闭接口的模块编译完成之后, 就不可能再创建新的实现类.

> 直接子类(Direct Subclass) 是指直接从父类继承的那些类.
>
> 间接子类(Indirect Subclass) 是指从父类继承, 但继承关系超过一层的那些类.
>
{style="note"}

当你将封闭类和接口与 `when` 表达式一起使用时,
你可以覆盖所有可能的子类的行为, 并保证不会有新的子类创建出来, 对你的代码产生不利的影响.

封闭类最适合使用的场景是:

* **期望限制类的继承:**
  你有一组预定义的, 有限的子类, 来扩展一个类, 所有这些子类在编译期都是已知的.
* **需要实现类型安全的设计:**
  安全性和模式匹配在你的项目中至关重要. 特别是对于状态管理, 或处理复杂的条件逻辑.
  例如, 请参见 [和 when 表达式一起使用封闭类](#use-sealed-classes-with-when-expression).
* **使用封闭的 API:**
  你希望为库提供健壮而且可维护的公开 API, 确保第三方客户端按预期的方式使用 API.

更详细的实际应用, 请参见 [使用场景](#use-case-scenarios).

> Java 15 引入了 [一个类似的概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F),
> 它的封闭类使用 `sealed` 关键字和 `permits` 子句, 来定义受限制的层级结构.
>
{style="tip"}

## 声明封闭类或接口

要声明一个封闭类或接口, 请使用 `sealed` 修饰符:

```kotlin
// 创建一个封闭接口
sealed interface Error

// 创建一个封闭类, 实现封闭接口 'Error'
sealed class IOError(): Error

// 定义子类, 继承封闭类 'IOError'
class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

// 创建一个单子对象, 实现封闭接口 'Error'
object RuntimeError : Error
```

这个示例可以代表一个库的 API, 其中包含很多错误类, 以便类的使用者能够处理库可能抛出的错误.
如果这些错误类的继承层级包含在公开 API 可见的接口或抽象类,
那么就不能禁止其他开发者在他们的代码中实现这些接口或扩展这些抽象类.
由于库不知道在它外部定义的错误类, 因此库不能象它自己定义的类那样一致的处理这些外部定义的类.
如果将错误类的继承阶层封闭起来, 库的作者就能够确定的知道所有可能的错误类型, 并且能够确定以后不会出现其他错误类型.
但是, 使用 **封闭的** 错误类层级结构, 库的作者就能够确定他们知道了所有可能的错误类型, 而且之后也不会出现其他的错误类型.

示例代码中的层级关系如下:
![封闭类和封闭接口层级结构示意图](sealed-classes-interfaces.svg){width=700}

### 构造器 {id="constructors"}

封闭类本身永远是 [抽象(abstract)类](classes.md#abstract-classes), 因此, 不能直接生成它的实例.
但是, 它可以包含或继承构造器.
这些构造器不是用来创建封闭类自身的实例, 而是用来创建它的子类.
我们来看看下面的例子, 有一个封闭类 `Error`, 以及它的几个子类, 我们创建这些子类的实例:

```kotlin
sealed class Error(val message: String) {
    class NetworkError : Error("Network failure")
    class DatabaseError : Error("Database cannot be reached")
    class UnknownError : Error("An unknown error has occurred")
}

fun main() {
    val errors = listOf(Error.NetworkError(), Error.DatabaseError(), Error.UnknownError())
    errors.forEach { println(it.message) }
}
// 输出结果为
// Network failure
// Database cannot be reached
// An unknown error has occurred
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

你可以在你的封闭类中使用 [`enum`](enum-classes.md) 类, 用枚举常数来表示状态, 并提供更多细节信息.
每个枚举常数只存在 **单个** 实例, 而封闭类的子类可以有 **多个** 实例.
在下面的示例中, `sealed class Error` 和它的几个子类, 使用 `enum` 来表示错误的严重级别.
每个子类的构造器会初始化 `severity`, 并改变它的状态:

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // 这里可以添加更多错误类型
}
```

封闭类的构造器的 [可见度](visibility-modifiers.md) 必须是: `protected` (默认值) 或 `private`:

```kotlin
sealed class IOError {
  // 封闭类的构造器默认可见度为 protected. 构造器在这个类和它的子类中可见.
  constructor() { /*...*/ }

  // private 构造器, 只在这个类中可见.
  // 在封闭类中使用 private 构造器, 可以更加严格的控制实例的创建, 实现类中特定的初始化过程.
  private constructor(description: String): this() { /*...*/ }

  // 这里会发生错误, 因为在封闭类中不允许使用 public 和 internal 构造器
  // public constructor(code: Int): this() {}
}
```

## 继承 {id="inheritance"}

封闭类和接口的直接子类必须定义在同一个包之内. 可以是顶级位置, 也可以嵌套在任意多的其他有名称的类, 有名称的接口, 或有名称的对象之内.
子类可以设置为任意的 [可见度](visibility-modifiers.md), 只要它们符合 Kotlin 中通常的类继承规则.

封闭类的子类必须拥有一个适当的限定名称. 不能是局部对象或匿名对象.

> `enum` 类不能扩展封闭类, 也不能扩展任何其他类. 但是, 它们可以实现封闭接口:
>
> ```kotlin
> sealed interface Error
>
> // 枚举类扩展封闭接口 'Error'
> enum class ErrorType : Error {
>     FILE_ERROR, DATABASE_ERROR
> }
> ```
>
{style="note"}

这些限制不适用于非直接子类. 如果封闭的类一个直接子类没有标记为封闭,
那么它可以按照其修饰符允许的方式任意扩展:

```kotlin
// 封闭接口 'Error' 只在相同的模块和包中存在实现类
sealed interface Error

// 封闭类 'IOError' 扩展 'Error', 只能在相同的包中扩展 'IOError'
sealed class IOError(): Error

// 开放类 'CustomError' 扩展 'Error', 可以在 'CustomError' 可见的任何地方扩展这个类
open class CustomError(): Error
```

### 跨平台项目中的继承

在 [跨平台项目](multiplatform-get-started.md)中还存在一种继承限制:
封闭类的直接子类必须放在同一个 [源代码集(Source Set)](multiplatform-discover-project.md#source-sets) 中.
这个限制适用于没有使用 [`expect` 和 `actual` 修饰符](multiplatform-expect-actual.md) 的封闭类.

如果封闭类声明为共通源代码集(common source set)中的 `expect`, 并且在平台相关的代码集内拥有 `actual` 实现类,
那么 `expect` 和 `actual` 的版本在各自的源代码集内都可以拥有子类.
此外, 如果你使用了层级结构(hierarchical structure),
你可以在 `expect` 和 `actual` 声明之间的任何源代码集内创建子类.

更多详情请参见 [跨平台项目的层级结构(hierarchical structure)](multiplatform-hierarchy.md).

## 和 `when` 表达式一起使用封闭类 {id="use-sealed-classes-with-when-expression"}

`when` 表达式和封闭类一起使用时, Kotlin 编译器能够进行穷尽的检查, 是否覆盖了所有可能的情况.
这样的情况下, 你可以不必添加 `else` 分支:

```kotlin
// 封闭类和它的子类
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

//sampleStart
// 将错误输出到日志的函数
fun log(e: Error) = when(e) {
    is Error.FileReadError -> println("Error while reading file ${e.file}")
    is Error.DatabaseError -> println("Error while reading from database ${e.source}")
    Error.RuntimeError -> println("Runtime error")
    // 不需要 `else` 分支, 因为已经覆盖了所有的可能情况
}
//sampleEnd

// 所有错误的列表
fun main() {
    val errors = listOf(
        Error.FileReadError("example.txt"),
        Error.DatabaseError("usersDatabase"),
        Error.RuntimeError
    )

    errors.forEach { log(it) }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

> 在跨平台项目中, 如果与 `when` 表达式一起使用的封闭类, 是你的共通代码中的 [预期声明](multiplatform-expect-actual.md),
> 那么仍然需要 `else` 分支.
> 这是因为, `actual` 平台实现中的子类可以扩展封闭类, 但在共通代码中, 无法确定这些子类.
>
{style="note"}

## 使用场景 {id="use-case-scenarios"}

我们来看看一些实际的使用场景, 封闭类和封闭接口可以非常有用.

### 管理 UI 应用程序中的状态

你可以使用封闭类来表示应用程序中的不同 UI 状态.
这种方法可以实现结构化并且安全的 UI 变更管理.
下面的例子演示如何管理不同的 UI 状态:

```kotlin
sealed class UIState {
    data object Loading : UIState()
    data class Success(val data: String) : UIState()
    data class Error(val exception: Exception) : UIState()
}

fun updateUI(state: UiState) {
    when (state) {
        is UIState.Loading -> showLoadingIndicator()
        is UIState.Success -> showData(state.data)
        is UIState.Error -> showError(state.exception)
    }
}
```

### 管理支付方式

在一些实际的商业应用程序中, 高效的处理各种支付方式是一种常见的需求.
你可以使用封闭类 和 `when` 表达式来实现这样的业务逻辑.
将不同的支付方式表达为封闭类的子类, 可以为交易过程的处理实现一个清晰而且易于管理的结构:

```kotlin
sealed class Payment {
    data class CreditCard(val number: String, val expiryDate: String) : Payment()
    data class PayPal(val email: String) : Payment()
    data object Cash : Payment()
}

fun processPayment(payment: Payment) {
    when (payment) {
        is Payment.CreditCard -> processCreditCardPayment(payment.number, payment.expiryDate)
        is Payment.PayPal -> processPayPalPayment(payment.email)
        is Payment.Cash -> processCashPayment()
    }
}
```

`Payment` 是一个封闭类, 表示电子商务系统中的各种支付方式: `CreditCard`, `PayPal`, 和 `Cash`.
每个子类可以拥有它独自的属性, 例如 `CreditCard` 有 `number` 和 `expiryDate`, `PayPal` 有 `email`.

`processPayment()` 函数演示如何处理不同的支付方式.
这种方案可以确保考虑到了所有可能的支付类型, 而且系统保持了灵活性, 可以在将来添加新的支付方式.

### 处理 API 请求/应答

你可以使用封闭类和封闭接口来实现一个用户认证系统, 它处理 API 的请求和应答.
用户认证系统有登入和登出功能.
`ApiRequest` 封闭接口定义了特定的请求类型: `LoginRequest` 用于登入操作, `LogoutRequest` 用于登出操作.
封闭类, `ApiResponse`, 包括不同的应答场景: `UserSuccess`, 其中包含用户数据, `UserNotFound`, 表示用户不存在, `Error`, 表示失败.
`handleRequest` 函数使用 `when` 表达式, 以一种类型安全的方式处理这些请求, `getUserById` 函数模拟用户检索:

```kotlin
// 引入必须的模块
import io.ktor.server.application.*
import io.ktor.server.resources.*

import kotlinx.serialization.*

// 定义封闭接口, 表示使用 Ktor 资源的 API 请求
@Resource("api")
sealed interface ApiRequest

@Serializable
@Resource("login")
data class LoginRequest(val username: String, val password: String) : ApiRequest

@Serializable
@Resource("logout")
object LogoutRequest : ApiRequest

// 定义封闭类 ApiResponse, 包括具体的应答类型
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// 用户数据类, 在成功应答中使用
data class UserData(val userId: String, val name: String, val email: String)

// 这个函数校验用户凭证 (只为演示用)
fun isValidUser(username: String, password: String): Boolean {
    // 使用固定的校验逻辑 (这只是一段演示代码)
    return username == "validUser" && password == "validPass"
}

// 这个函数使用具体的应答来处理 API 请求
fun handleRequest(request: ApiRequest): ApiResponse {
    return when (request) {
        is LoginRequest -> {
            if (isValidUser(request.username, request.password)) {
                ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail"))
            } else {
                ApiResponse.Error("Invalid username or password")
            }
        }
        is LogoutRequest -> {
            // 这个示例假设 logout 操作永远成功
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // 演示用
        }
    }
}

// 这个函数模拟一个 getUserById 调用
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // 错误处理也会生成错误应答.
}

// 主函数, 演示使用方法
fun main() {
    val loginResponse = handleRequest(LoginRequest("user", "pass"))
    println(loginResponse)

    val logoutResponse = handleRequest(LogoutRequest)
    println(logoutResponse)

    val userResponse = getUserById("validUserId")
    println(userResponse)

    val userNotFoundResponse = getUserById("invalidId")
    println(userNotFoundResponse)
}
```
