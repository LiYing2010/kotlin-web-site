---
type: doc
layout: reference
title: "连接平台相关的 API"
---

# 连接平台相关的 API

> `expect`/`actual` 功能目前处于 [Beta](evolution/components-stability.html) 阶段.
本文档介绍的所有的语言特性和工具特性在未来的 Kotlin 版本中都可能发生变更.
{:.note}

如果你正在开发跨平台应用程序, 需要访问某个实现了你所需要功能的平台相关 API,
请使用 Kotlin 的 *预期声明与实际声明(expected and actual declarations)* 机制.

通过这个机制, 由共通源代码集定义一个 *预期声明(expected declaration)*,
各个平台的源代码集需要提供与预期声明对应的 *实际声明(actual declaration)*.
这种机制适用于大多数 Kotlin 声明, 比如函数, 类, 接口, 枚举, 属性, 以及注解.

![预期声明与实际声明]({{ url_for('asset', path='images/reference/mpp/expect-actual.png') }})

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 共通代码
expect fun randomUUID(): String
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Android 平台代码
import java.util.*
actual fun randomUUID() = UUID.randomUUID().toString()
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// iOS 平台代码
import platform.Foundation.NSUUID
actual fun randomUUID(): String = NSUUID().UUIDString()
```

</div>

下面是另一个例子, 在一个极简化的 log 框架中, 演示如何编写共通代码, 并实现共通代码与平台逻辑之间的交互.

<div style="display:flex">
<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 共通代码
enum class LogLevel {
    DEBUG, WARN, ERROR
}

internal expect fun writeLogMessage(message: String, logLevel: LogLevel)

fun logDebug(message: String) = writeLogMessage(message, LogLevel.DEBUG)
fun logWarn(message: String) = writeLogMessage(message, LogLevel.WARN)
fun logError(message: String) = writeLogMessage(message, LogLevel.ERROR)
```

</div>
<div style="margin-left: 5px;white-space: pre-line; line-height: 18px; font-family: Tahoma;">
    <div style="display:flex">├<i style="margin-left:5px">对所有平台编译</i></div>
    <div style="display:flex">├<i style="margin-left:5px">预期的平台相关 API</i></div>
    <div style="display:flex">├<i style="margin-left:5px">预期的 API 可以在共通代码中使用</i></div>
</div>
</div>

这段代码预期目标平台对 `writeLogMessage` 函数提供平台相关的实现,
然后共通代码可以使用这个声明, 而不必考虑它如何实现.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// JVM 平台代码
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    println("[$logLevel]: $message")
}
```

</div>

对于 JavaScript, 可以使用的 API 完全不同, `actual` 声明大致如下.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// JS 平台代码
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    when (logLevel) {
        LogLevel.DEBUG -> console.log(message)
        LogLevel.WARN -> console.warn(message)
        LogLevel.ERROR -> console.error(message)
    }
}
```

</div>

关于预期声明与实际声明的主要规则是:
* 预期声明使用关键字 `expect` 标记; 实际声明使用关键字 `actual` 标记.
* `expect` 和 `actual` 声明名称相同, 并在相同的包内 (拥有相同的完整限定名称).
* `expect` 声明 不能包含任何实现代码.

在每个平台的编译期间, 编译器会确保, 在共通源代码集或中间源代码集中的, 使用关键字 `expect` 标记的每个声明,
在所有的平台源代码集中, 都存在对应的, 使用关键字 `actual` 标记的声明.
IDE 提供了工具, 可以帮助你创建缺少的实际声明.

如果你有一个平台相关的库, 希望在共通代码中使用, 同时对其他平台则提供你自己的实现,
这时你可以为已存在的类定义一个类型别名, 以此作为实际声明:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
expect class AtomicRef<V>(value: V) {
    fun get(): V
    fun set(value: V)
    fun getAndSet(value: V): V
    fun compareAndSet(expect: V, update: V): Boolean
}
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```

</div>

> 我们推荐只对存在平台相关依赖项的 Kotlin 声明使用预期声明和实际声明.
> 在共用模块中应该实现尽量多的功能, 虽然这样会耗费更多时间.
>
> 请不要滥用预期声明和实际声明 – 有些情况下, 使用 [接口](interfaces.html) 可能是更好的选择,
> 因为它更加灵活, 而且更易于测试.
{:.note}
