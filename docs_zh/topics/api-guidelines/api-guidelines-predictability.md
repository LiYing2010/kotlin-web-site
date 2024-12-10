[//]: # (title: 可预测性)

设计一个健壮而且对使用者友好的 Kotlin 库, 关键在于预见常见的使用场景, 允许扩展, 强制正确的使用.
要遵循那些关于默认设置, 错误处理, 以及状态管理的最佳实践, 确保使用者获得无缝的使用体验,
同时保持库的完整性和质量.

## 默认完整正确的功能

你的库应该对各种使用场景预见到 "幸福路径(happy path)", 并提供相应的默认设置.
要让库正常工作, 使用者应该不需要提供默认的值.

例如, 在使用 [Ktor `HttpClient`](https://ktor.io/docs/client-create-new-application.html) 时, 最常见的使用场景是, 向服务器发送一个 GET 请求.
这个功能可以使用下面的代码完成, 只需要指定必须的信息:

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.get("https://ktor.io/")
```

不需要为必须的 HTTP 头指定值, 也不需要为应答中可能的的状态码提供自定义的事件处理器.

如果对于一个使用场景, 没有明显的 "幸福路径(happy path)", 或者参数应该有默认值, 但不存在没有争议的选项,
那么可能说明需求分析存在问题.

## 提供扩展能力

如果无法预见正确的选择, 那么应该允许使用者指定他们喜欢的方案.
你的库还应该允许使用者提供他们自己的方案, 或者使用第三方扩展.

例如, 使用 [Ktor `HttpClient`](https://ktor.io/docs/client-serialization.html) 时, 会鼓励使用者在配置 client 时安装对内容协商的支持, 并指定他们喜欢的序列化格式:

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}
```

使用者可以选择安装哪些 plugin, 也可以使用 [用于定义 client plugin 的专用 API](https://ktor.io/docs/client-custom-plugins.html) 创建他们自己的 plugin.

此外, 使用者还可以对库中的类型定义扩展函数和属性.
作为库的开发者, 你可以 [在设计时考虑扩展](api-guidelines-readability.md#use-extension-functions-and-properties),
并确保你的库的类型具有清晰的核心概念, 让使用者的扩展更加容易.

## 防止不期望的和不正确的扩展

使用者不应该能够以违反原来设计的方式, 或者问题域的规则所不允许的方式, 扩展你的库.

例如, 在将数据与 JSON 进行相互转换时, 输出格式只支持 6 种类型:
`object`, `array`, `number`, `string`, `boolean`, 和 `null`.

如果你创建一个 open 的类或接口, 名为 `JsonElement`, 使用者就可以创建不正确的派生类型, 例如 `JsonDate`.
相反, 你可以将 `JsonElement` 定义为封闭接口, 并为每种类型提供一个实现:

```kotlin
sealed interface JsonElement

class JsonNumber(val value: Number) : JsonElement
class JsonObject(val values: Map<String, JsonElement>) : JsonElement
class JsonArray(val values: List<JsonElement>) : JsonElement
class JsonBoolean(val value: Boolean) : JsonElement
class JsonString(val value: String) : JsonElement
object JsonNull : JsonElement
```

封闭类型还能够让编译器确保你的 `when` 表达式穷尽了所有的可能分支, 因此不需要提供 `else` 语句, 这样就提高了可读性和一致性.

## 不要暴露可变的状态

在管理可变的值时, 只要有可能, 你的 API 就应该接受并返回只读的集合.
可变的集合是线程不安全的, 并且会对你的库带来复杂性和不可预测性.

例如, 如果一个 API 入口点返回了可变集合, 然后使用者修改这个集合,
那就不清楚使用者修改的是 API 实现中使用的底层数据结构, 还是一个 copy.
类似的, 如果使用者将集合传递给库之后, 又能够修改集合中的值,
那就不清楚这样的修改是否会影响 API 的实现.

由于数组是可变集合, 因此在你的 API 中要避免使用数组.
如果必须使用数据, 那么在使用者与共享数据之前, 要制造防御性的 copy.
这样可以确保你的数据结构保持不变.

编译器会对 `vararg` 参数自动执行这种制造防御性的 copy 的策略.
如果使用展开(spread)操作符, 在需要 `vararg` 参数的地方传递一个已有的数组, 会对你的数组自动创建一个 copy.

下面的示例演示这个行为:

```kotlin
fun main() {
    fun demo(vararg input: String): Array<out String> = input

    val originalArray = arrayOf("one", "two", "three", "four")
    val newArray = demo(*originalArray)

    originalArray[1] = "ten"

    // 输出结果为 "one, ten, three, four"
    println(originalArray.joinToString())

    // 输出结果为 "one, two, three, four"
    println(newArray.joinToString())
}
```

## 校验输入和状态

在实现代码执行之前, 要校验输入和既存的状态, 确保使用者正确的使用你的库.
可以使用 [`require`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函数来校验输入, 使用 [`check`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函数来校验既存的状态.

如果条件的判断结果为 `false`, `require` 函数会抛出 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/#kotlin.IllegalArgumentException) 异常,
导致函数立即失败, 并显示适当的错误消息:

```kotlin
fun saveUser(username: String, password: String) {
    require(username.isNotBlank()) { "Username should not be blank" }
    require(username.all { it.isLetterOrDigit() }) {
        "Username can only contain letters and digits, was: $username"
    }
    require(password.isNotBlank()) { "Password should not be blank" }
    require(password.length >= 7) {
        "Password must contain at least 7 characters"
    }

    /* 校验完成, 实现代码可以继续执行 */
}
```

错误消息应该包含相关的输入, 以帮助使用者确定失败的原因,
如上面的示例所示, 表示用户名称包含无效字符的错误消息, 其中包含了不正确的用户名称.
对这种实践的一个例外情况是, 在错误消息中包含值会泄露信息, 可能被恶意使用, 造成安全漏洞.
因此, 对密码长度的错误消息不应该包含输入的密码.

类似的, 如果条件的判断结果为 `false`, `check` 函数抛出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/#kotlin.IllegalStateException) 异常.
请使用这个函数来校验一个实例的状态, 如下面的示例所示:

```kotlin
class ShoppingCart {
    private val contents = mutableListOf<Item>()

    fun addItem(item: Item) {
        contents.add(item)
    }

    fun purchase(): Amount {
        check(contents.isNotEmpty()) {
            "Cannot purchase an empty cart"
        }
        // 计算并返回金额
    }
}
```

## 下一步

在本向导的下一部分, 你将学习可调试性.

[进入下一部分](api-guidelines-debuggability.md)
