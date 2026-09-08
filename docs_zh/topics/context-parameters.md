[//]: # (title: 上下文参数(Context Parameter))

> 上下文参数替代了旧的实验性功能 [上下文接受者(Context Receiver)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm).
> 你可以在 [上下文参数的设计文档](https://github.com/Kotlin/KEEP/blob/master/proposals/context-parameters.md#summary-of-changes-from-the-previous-proposal) 中找到它们的主要差别.
> 要从上下文接受者迁移到上下文参数, 你可以使用 IntelliJ IDEA 中的辅助支持,
> 详情请参见相关的 [blog](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/).
>
{style="tip"}

上下文参数(Context Parameter) 允许函数和属性声明在周围上下文(Surrounding Context)中隐含可用的依赖项.

使用上下文参数, 在一组函数调用中, 你就不需要手动的反复传递那些共用而且极少变更的值, 例如服务或依赖项.

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

fun main() {
    val users = object : UserService {
        override fun log(message: String) {
            println(message)
        }

        override fun findUserById(id: Int): String {
            return "User $id"
        }
    }

    context(users) {
        outputMessage("Looking up the first user")
        println(firstUser)
        // 输出结果为: User 1
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

可以使用 `_` 作为上下文参数的名称.
这种情况下, 参数值可以用来解析, 但在代码段内不能通过名称访问:

```kotlin
// 使用 "_" 作为上下文参数名称
context(_: UserService)
fun logWelcome() {
    // 解析结果仍然能够从 UserService 找到适当的 log 函数
    outputMessage("Welcome!")
}
```

## 上下文参数的解析 {id="context-parameters-resolution"}

Kotlin 通过在当前的范围(Scope) 中搜索匹配的上下文值, 在调用端解析上下文参数.
Kotlin 会根据它们的类型进行匹配.
如果在同一个范围层级存在多个兼容的值, 编译器会报告歧义:

```kotlin
// UserService 定义上下文中需要的依赖项
interface UserService {
    fun log(message: String)
}

// 声明一个带有上下文参数的函数
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // 实现 UserService
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // 实现 UserService
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // 在调用端, serviceA 和 serviceB 都匹配期望的 UserService 类型
    context(serviceA, serviceB) {
        // 这会导致歧义错误
        outputMessage("This will not compile")
    }
}
```

### 明确的传递上下文参数 {id="pass-context-arguments-explicitly"}
<primary-label ref="experimental-opt-in"/>

当多个函数重载的区别仅仅只是上下文参数不同, 如果存在多个匹配的上下文值, 那么函数调用就会发生歧义.

为了解决这种歧义, 请在调用处明确指定上下文参数:

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
    // 选择使用 EmailSender 上下文参数的重载函数
    sendNotification(emailSender = defaultEmailSender)

    // 选择使用 SmsSender 上下文参数的重载函数
    sendNotification(smsSender = defaultSmsSender)
}
```

你也可以使用明确的上下文参数, 在某些函数调用中减少嵌套:

* 对单个调用, 使用明确的上下文参数, 可以让调用更加易读.
* 如果多个调用使用相同的上下文参数, 请使用 `context()` 函数.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要表示使用者同意(Opt-in), 请向你的构建脚本文件添加以下编译器选项:

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

## 限制 {id="restrictions"}

上下文参数还在不断改进中, 目前的一些限制包括:

* 构造器不能声明上下文参数.
* 上下文参数的属性不能拥有后端域变量(Backing Field), 也不能拥有初始化器.
* 带上下文参数的属性 不能使用委托.

尽管存在这些限制, 上下文参数通过简化依赖项注入, 改进 DSL 设计, 以及范围操作, 简化了依赖的管理.
