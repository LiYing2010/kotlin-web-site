[//]: # (title: 可读性)

要创建一个具有可读性的 API, 比起仅仅是编写清晰的代码, 涉及更多的问题.
它需要考虑周全的设计, 能够简化集成和使用.
本章讨论如何增强 API 的可读性, 方法包括在构建你的库时考虑可组合能力,
利用特定领域专用语言(Domain-Specific Language, DSL) 实现简洁而且表现力强大的设置,
以及使用扩展函数和属性实现清晰而且易维护的代码.

## 优先使用明确的可组合能力

库通常会提供一些高级操作, 用于进行自定义.
例如, 某个操作可能允许使用者提供他们自己的数据结构, 网络通道, 计时器, 或生存周期观察器.
但是, 通过额外的函数参数引入这些自定义选项, 可能显著的增加 API 的复杂度.

除了添加更多参数用于自定义之外, 设计一个 API, 让不同的行为可以组合在一起, 这样的方式会更加有效.
例如, 在协程的 Flow API 中, [buffering](flow.md#buffering) 和 [conflation](flow.md#conflation) 都实现为单独的函数.
这些函数可以与更加基础的操作连接在一起, 例如 [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 和 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html),
而不是每个基础操作接受参数来控制缓冲和合并.

另一个例子是 [Jetpack Compose 中的 Modifiers API](https://developer.android.com/develop/ui/compose/modifiers).
它允许 Composable 组件接受单个 `Modifier` 参数, 处理共通的自定义选项, 例如填充(padding), 大小, 以及背景颜色.
这种方案避免了每个 Composable 组件都需要为这些自定义接受单独的参数, 简化了 API, 减少了复杂度.

```kotlin
Box(
    modifier = Modifier
        .padding(10.dp)
        .onClick { println("Box clicked!") }
        .fillMaxWidth()
        .fillMaxHeight()
        .verticalScroll(rememberScrollState())
        .horizontalScroll(rememberScrollState())
) {
    // Box 的内容放在这里
}
```

## 使用 DSL

一个 Kotlin 库能够通过提供构建器 DSL, 显著的增强可读性.
使用 DSL 让你能够 以简洁的方式重复进行特定领域专用数据的声明.
例如, 考虑下面的示例, 它来自一个基于 Ktor 的服务器应用程序:

```kotlin
fun Application.module() {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
    routing {
        post("/article") {
            call.respond<String>(HttpStatusCode.Created, ...)
        }
        get("/article/list") {
            call.respond<List<CreateArticle>>(...)
        }
        get("/article/{id}") {
            call.respond<Article>(...)
        }
    }
}
```

这段代码设置一个应用程序, 安装 `ContentNegotiation` plugin, 配置为使用 Json 序列化,
并设置路由, 让应用程序应答多个 `/article` endpoint 上的请求.

关于创建 DSL 的详细介绍, 请参见 [类型安全的构建器](type-safe-builders.md).
在创建库时, 以下几点值得注意:

* DSL 中使用的函数是构建器函数, 这类函数接受一个带接受者的 Lambda 表达式作为最后参数.
  这种设计允许调用这些函数时不使用括号, 让语法更加清晰.
  作为参数传递的 Lambda 表达式可以用来配置正在创建的实体.
  在上面的示例中, 传递给 `routing` 函数的 Lambda 表达式, 用来配置路由的细节.
* 创建类的实例的工厂函数应该使用与它的返回类型相同的名称, 并以大写字母开头.
  在上面的示例中, 你可以在创建 `Json` 实例的地方看到这种工厂函数.
  这些函数也可以接受 Lambda 表达式参数进行配置.
  更多详情请参见 [编码规约](coding-conventions.md#function-names).
* 由于在编译期间, 在提供给构建器函数的 Lambda 表达式内部, 无法确定是否已经设置了必须的属性,
  我们建议将必须的值作为函数参数来传递.

使用 DSL 构建对象不仅能够提高可读性, 还能够改善向后兼容性, 并简化文档过程.
例如, 以下面的函数为例:

```kotlin
fun Json(prettyPrint: Boolean, isLenient: Boolean): Json
```

这个函数可以代替 `Json{}` DSL 构建器. 但是, DSL 方案具有明显的优点:

* DSL 构建器比这个函数更容易维持向后兼容性, 因为添加新的配置选项只需要添加新的属性 (或者在另其它示例中, 是添加新的函数),
  这是向后兼容的变更, 而修改一个既有函数的参数列表则不是.
* 它还使创建和维护文档更加容易.
  你可以对每个属性在它的声明处分别编写文档, 而不是在同一个地方, 对一个函数的很多参数编写文档.

## 使用扩展函数和扩展属性 {id="use-extension-functions-and-properties"}

我们推荐使用 [扩展函数和扩展属性](extensions.md) 提高可读性.

类和接口应该定义定义类型的核心概念.
附加的功能和信息应该写成扩展函数和属性.
这样可以让代码的阅读者清楚的知道, 附加的功能可以在核心概念的基础上实现, 附加的信息可以通过类型中的数据计算得到.

例如, [`CharSequence`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-sequence/) 类型 (`String` 也实现这个接口) 只包含最基本的信息, 以及访问它的内容的最基本的操作符:

```kotlin
interface CharSequence {
    val length: Int
    operator fun get(index: Int): Char
    fun subSequence(startIndex: Int, endIndex: Int): CharSequence
}
```

与字符串相关的共通功能通常定义为扩展函数, 这些函数都可以在类型的核心概念和基本 API 的基础上实现:

```kotlin
inline fun CharSequence.isEmpty(): Boolean = length == 0
inline fun CharSequence.isNotEmpty(): Boolean = length > 0

inline fun CharSequence.trimStart(predicate: (Char) -> Boolean): CharSequence {
    for (index in this.indices)
        if (!predicate(this[index]))
           return subSequence(index, length)
    return ""
}
```

应该考虑将计算得到的属性和一般的方法声明为扩展.
默认情况下, 只有常规属性, 覆盖, 以及重载操作符, 才应该声明为成员.

## 不要使用 boolean 类型作为参数

考虑下面的函数:

```kotlin
fun doWork(optimizeForSpeed: Boolean) { ... }
```

如果在你的 API 中提供这个函数, 它可能会被这样调用:

```kotlin
doWork(true)
doWork(optimizeForSpeed=true)
```

在第一个调用中, 无法推断出这个 boolean 参数代表什么, 除非你在开启了参数名称提示功能的 IDE 中阅读代码.
使用命名参数确实清楚的表示了参数的意图, 但没有办法强制你的使用者采用这样的编码风格.
因此, 为了提高可读性, 你的代码不应该使用 boolean 类型的参数.

另一种选择是, API 可以创建一个单独的函数, 专门执行由 boolean 参数控制的任务.
这个函数应该使用一个描述性的名称, 表明它的功能.

例如, [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/) 接口有下面的扩展:

```kotlin
fun <T, R> Iterable<T>.map(transform: (T) -> R): List<R>
fun <T, R : Any> Iterable<T>.mapNotNull(
    transform: (T) -> R?
): List<R>
```

而不是单个的方法:

```kotlin
fun <T, R> Iterable<T>.map(
    includeNullResults: Boolean = true, 
    transform: (T) -> R
): List<R>
```

另一种好的方案是使用 `enum` 类定义不同的操作模式.
如果存在多种操作模式, 或者你期望这些模式未来会随着时间的推移发生变化, 那么这种方案会很有用.

## 适当使用数字类型

Kotlin 定义了一组数字类型, 你可以使用它们作为你的 API 的一部分.
下面是正确使用数字类型的方法:

* 使用 `Int`,` Long` 和 `Double` 类型作为算数类型.
  它们表示执行计算的值.
* 不要对非算数的实体使用算数类型.
  例如, 如果你将 ID 表示为 `Long`, 你的使用者可能会假设 ID 是按顺序分配的, 并因此比较 ID.
  这肯能导致不可靠的或无意义的结果, 或造成对具体实现的依赖, 而具体实现可能会在没有警告的情况下发生变更.
  更好的策略是为 ID 的抽象定义一个专用的类.
  你可以使用 [内联的值类(Inline value class)](inline-classes.md) 来构建这样的抽象, 而不会影响性能.
  具体的例子请参见 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类.
* `Byte`, `Float` 和 `Short` 类型是内存布局类型.
  它们用来限制存储值时使用的内存容量, 例如, 在缓存中存储数据时, 或通过网络传输数据时.
  只有当底层数据可靠的适合这些类型, 并且不需要进行计算时, 才应该使用这些类型.
* 应该使用无符号整数类型 `UByte`, `UShort`, `UInt` 和 `ULong` 来利用给定格式的全部正数值范围.
  这些类型适合于需要的值超过有符号类型数值范围的情况, 或与原生库交互的的情况.
  但是, 对于领域问题只需要 [无符号整数](unsigned-integer-types.md#non-goals) 的情况, 不要使用这些类型.

## 下一步

在本向导的下一部分, 你将学习一致性.

[进入下一部分](api-guidelines-consistency.md)
