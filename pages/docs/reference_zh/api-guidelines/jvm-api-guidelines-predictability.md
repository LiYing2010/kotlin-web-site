---
type: doc
layout: reference
category:
title: "可预测性"
---

# 可预测性

最终更新: {{ site.data.releases.latestDocDate }}

本章包含以下建议:
* [使用封闭接口(Sealed Interface) ](#use-sealed-interfaces)
* [通过封闭类(Sealed Class)隐藏具体实现](#hide-implementations-with-sealed-classes)
* [对你的输入和状态进行验证](#validate-your-inputs-and-state)
  * [使用 require() 函数验证输入](#validate-inputs-with-the-require-function)
  * [使用 check() 函数验证状态](#validate-state-with-the-check-function)
* [在 public 签名中不要使用数组](#avoid-arrays-in-public-signatures)
* [不要使用 varargs](#avoid-varargs)

## 使用封闭接口(Sealed Interface)

当你需要对具体的实现进行功能抽象时, 你的 API 中通常会需要接口.
如果你需要使用接口, 请考虑使用 [封闭接口(Sealed Interface)](../sealed-classes.html).
如果你不希望你的 API 使用者扩展你的类层次结构, 这一点是非常重要的.

> 请记住, 如果向一个封闭接口添加一个新的实现类, 会立即导致用户的现有代码变得不正确.
{:.warning}

例如, JSON 类型可能是 6 种类型: 对象, 数组, 数值, 字符串, Boolean, 以及 null.
创建通常的 `interface JsonElement` 可能会导致错误, 因为使用者可能不小心定义一个新的 `JsonElement` 的实现类, 然后就会破坏你的代码.
相反, 你可以让 `interface JsonElement` _封闭_, 并为每个 JSON 类型添加实现类:

```kotlin
sealed interface JsonElement

class JsonNumber(val value: Number) : JsonElement
class JsonObject(val values: Map<String, JsonElement>) : JsonElement
class JsonArray(val values: List<JsonElement>) : JsonElement
class JsonBoolean(val value: Boolean) : JsonElement
class JsonString(val value: String) : JsonElement
object JsonNull : JsonElement
```

这种方案可以帮助你避免错误, 既包括库本身的错误, 也包括使用者的错误.

使用封闭类型最大的好处是在 `when` 表达式中.
如果能够确定条件分支语句覆盖了所有的情况, 你就不必添加 `else` 分支了:

```kotlin
fun processJson(json: JsonElement) = when (json) {
    is JsonNumber -> { /* 作为数值进行处理 */ }
    is JsonObject -> { /* 作为对象进行处理 */ }
    is JsonArray -> { /* 作为数组进行处理 */ }
    is JsonBoolean -> { /* 作为 Boolean 值进行处理 */ }
    is JsonString -> { /* 作为字符串进行处理 */ }
    is JsonNull -> { /* 作为 null 进行处理 */ }
    // 不需要 `else` 分支, 因为已经覆盖了所有的情况
}
```

## 通过封闭类(Sealed Class)隐藏具体实现

如果你的 API 中存在封闭接口, 并不代表你也应该在 API 中暴露所有的实现类.
公开最少的内容通常更好一些.
如果你需要避免抽象泄漏(Leaky Abstraction), 或者想要避免 API 的使用者扩展你的接口,
可以考虑对你的具体实现也使用封闭类(Sealed Class)或封闭接口(Sealed Interface).

例如, 一个库与多种不同的数据库共通工作, 它可能包含一个数据库应答的接口, 如下:

```kotlin
sealed interface DBResponse {
    operator fun <T> get(columnName: String): Sequence<T>
}
```

向 API 使用者暴露这个接口的实现类, 例如 `SQLiteResponse` 或 `MongoResponse`,
是一种 **抽象泄漏(Leaky Abstraction)**, 会使得支持这个 API 变得更加复杂.
在这样的库中, 你可能只处理了你的 `DBResponse` 实现类.
对于一个能够接受 `DBResponse` 的库方法, 如果使用者传入一个他们的 `DBResponse` 实现类, 就可能造成错误.
使用封闭接口和封闭类可以避免这种错误.

## 对你的输入和状态进行验证

### 使用 require() 函数验证输入

使用者有可能会误用一个 API. 为了帮助你的使用者正确使用你的 API, 你应该尽可能早的使用
[require()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函数验证输入.

例如, 这是一个简单的库函数, 将保存用户到某个外部 API:

```kotlin
fun saveUser(username: String, password: String) {
    api.saveUser(User(username, password))
}
```

你应该对函数的参数进行验证, 确保输入符合要求.
例如, 要检查 `username` 是唯一的, 而且不为空, 即使你已经在你的数据库中定义了约束, 也要进行验证:

```kotlin
fun saveUser(username: String, password: String) {
    require(username.isNotBlank()) { "Username should not be blank" }
    require(api.usernameAvailable(username)) { "Username $username is already taken" }
    require(password.isNotBlank()) { "Password should not be blank" }
    require(password.length > 6) { "Password should contain at least 7 letters" }
    require(
        /* 某些复杂的检查 */
    ) { "..." }

    api.saveUser(User(username, password))
}
```

通过这样的方法, 你可以确保你的使用者在遇到错误时不需要深入的分析复杂的、牵涉到数据库的 Stack Trace 信息.
如果出现异常, 将会是一个 `IllegalArgumentException`, 带有能够理解的错误消息, 而不是一个抽象的数据库异常.

> 如果你实现了输入验证, 那么应该对这些检查规则编写文档.
{:.tip}

### 使用 check() 函数验证状态

同样的建议也适用于检查内部状态. 最明显的例子是 `InputStream`, 因为你不能从已经关闭的输入流读取数据.

看看下面的 `InputStream` 类, 它带有 `readByte()` 方法, 使用如下:

```kotlin
class InputStream : Closeable {
    private var open = true
    fun readByte(): Byte { /* 读取并返回一个 byte */ }
    override fun close() {
        // 销毁底层资源
        open = false
    }
}

fun readTwoBytes(inputStream: InputStream): Pair<Byte, Byte> {
    val first = inputStream.use { it.readByte() }
    val second = inputStream.readByte()
    return Pair(first, second)
}
```

`readTwoBytes()` 方法必须抛出 `IllegalStateException`, 因为 [`use{}`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/use.html) 
会关闭 `Closeable` 的输入流, 使用者不应该能够从已关闭的流中读取数据.
要实现这一点, 需要修改 `readByte()` 函数的代码:

```kotlin
fun readByte(): Byte {
    check(open) { "Can't read from the already closed stream" }
    // 读取并返回一个 byte
}
```

在上面的示例中, 使用了 `check()` 函数, 而不是 `require()`.
这些函数会抛出不同的异常:
`require()` 抛出 `IllegalArgumentException`, 而 `check()` 抛出 `IllegalStateException`.
在调试代码时, 这个区别可能会变得非常重要.

## 在 public 签名中不要使用数组

数组永远是可修改的, 而 Kotlin 的基础是安全的 – 只读的, 或者说值不可变的 – 对象.
如果必须在你的 API 中使用数组,
在将它们传递给其他代码之前, 请先复制数组, 这样你就能够数组不会被修改.
另一个选择方案是, 根据你的意图, 使用只读的或可变的集合(Collection).
一般来说, 最好避免使用数组, 如果你必须要用, 需要特别小心.

例如, Kotlin 中的枚举类有 `values()` 函数, 返回一个数组, 其中包含所有的枚举值.
如果数组没有复制, 使用者就可以重写数组中的元素:

```kotlin
enum class Test { A, B }

fun main() { Test.values()[0] = Test.B }
```

如果你在枚举类中缓存了这些值, 运行上面的代码之后, 缓存就会被损坏.
如果没有缓存这些值, 那么每次调用 `values()` 函数都会产生额外的运行时开销.

由于这个原因, Kotlin 从 1.9 开始废弃了 `values()` 函数, 并 [引入了](https://youtrack.jetbrains.com/issue/KT-48872/Provide-modern-and-performant-replacement-for-Enum.values) 
`entries()` 函数, 它返回一个不可变的 Set.

## 不要使用 varargs

`vararg` – [不定数量参数](../functions.html#variable-number-of-arguments-varargs) – 底层以数组的方式工作,
但数组元素会单独传递给函数, 而不是传递整个数组.
这个操作的成本很高, 因为它会不断复制同一个数组.

请看下面的代码:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id ="jvm-api-guide-print-elements">

```kotlin
fun printElements(delimiter: String, vararg elements: String) {
    for (i in elements.indices) {
        print(elements[i])
        if (i < elements.lastIndex) print(delimiter)
    }
}

fun printWithSpace(vararg elements: String) {
    printElements(" ", *elements)
}

fun main() {
    printWithSpace("x", "y", "z")
}
```

</div>

`printElements()` 函数打印 `vararg` 参数 `elements` 中的所有字符串, 中间加上分隔符,
而 `printWithSpace()` 函数调用 `printElements()`, 将分隔符定义为空格.
代码看起来似乎没问题: 你只是将 `elements` 从 `printWithSpace()` 传递给 `printElements()` 而已.
如果没有展开(spread)操作符 `*`, 这段代码将无法编译,
但加上这个操作符, 在传递给 `printElements()` 函数之前, **数组实际上会被复制**.
函数之间的调用链条越长, 就会创建越多的复制, 造成的意外的内存开销也就越大.

## 下一步做什么?

学习 API 的:
* [可调试性](jvm-api-guidelines-debuggability.html)
* [向后兼容性(Backward Compatibility)](jvm-api-guidelines-backward-compatibility.html)
