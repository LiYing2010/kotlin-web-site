[//]: # (title: 上下文参数(Context Parameter))

<primary-label ref="experimental-general"/>

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
```

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

#### 上下文参数的解析 {id="context-parameters-resolution"}

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

#### 限制 {id="restrictions"}

上下文参数还在不断改进中, 目前的一些限制包括:

* 构造器不能声明上下文参数.
* 上下文参数的属性不能拥有后端域变量(Backing Field), 也不能拥有初始化器.
* 带上下文参数的属性 不能使用委托.

尽管存在这些限制, 上下文参数通过简化依赖项注入, 改进 DSL 设计, 以及范围操作, 简化了依赖的管理.

#### 如何启用上下文参数 {id="how-to-enable-context-parameters"}

要在你的项目中启用上下文参数, 请在命令行中使用以下编译器选项:

```Bash
-Xcontext-parameters
```

或者添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段中:

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

这个功能计划在将来的 Kotlin 发布版中成为 [稳定版](components-stability.md#stability-levels-explained), 并继续改进.
希望你能通过我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 提供你的反馈意见.
