---
type: doc
layout: reference
title: "连接平台相关的 API"
---

# 连接平台相关的 API

最终更新: {{ site.data.releases.latestDocDate }}

> `expect`/`actual` 功能处于 [Beta](../components-stability.html) 阶段.
> 这个功能已经基本稳定, 但将来可能需要进行一些手动的源代码迁移工作.
> 我们会尽力减少你需要进行的代码变更.
{:.warning}

如果你正在开发跨平台应用程序, 需要访问某个实现了你所需要功能的平台相关 API,
(比如, [生成 UUID](#generate-a-uuid))
请使用 Kotlin 的 _预期声明与实际声明(Expected and Actual Declarations)_ 机制.

通过这个机制, 由共通源代码集定义一个 _预期声明(Expected Declaration)_,
各个平台的源代码集需要提供与预期声明对应的 _实际声明(Actual Declaration)_.
这种机制适用于大多数 Kotlin 声明, 比如函数, 类, 接口, 枚举, 属性, 以及注解.

<img src="/assets/docs/images/multiplatform/expect-actual.png" alt="共用模块与平台相关模块中的预期声明与实际声明" width="700"/>

编译器会保证, 共通模块中每个标记 `expect` 关键字的声明, 在所有的平台模块中都存在对应的标记 `actual` 关键字的声明.
IDE 提供了工具帮助你创建缺少的实际声明.

> 请只对存在平台相关依赖项的 Kotlin 声明使用预期声明和实际声明.
> 应该在共用模块中实现尽量多的功能, 虽然这样会耗费更多时间.
>
> 请不要滥用预期声明和实际声明 – 有些情况下, 使用 [接口](../interfaces.html) 可能是更好的选择,
> 因为它更加灵活, 而且更易于测试.
{:.note}

详情请参见 [添加平台相关库的依赖项](multiplatform-add-dependencies.html).

## 示例

为了简单起见, 以下示例使用简化的编译目标名称, 比如 iOS 和 Android.
但是, 在你的 Gradle 构建文件中, 你需要使用 [支持的编译目标](multiplatform-dsl-reference.html#targets) 中的一个确切的编译目标名称.

#### 生成 UUID

假设你正在使用 Kotlin Multiplatform Mobile 开发 iOS 和 Android 应用程序, 你想要生成 Universally Unique Identifier (UUID):

<img src="/assets/docs/images/multiplatform-mobile/expect-actual-example.png" alt="用于得到 UUID 的预期声明与实际声明" width="700"/>

为了达到这个目的, 请在共通模块中使用 `expect` 关键字声明预期函数 `randomUUID()`.
这里不要包括任何实现代码.

```kotlin
// 共通代码
expect fun randomUUID(): String
```

在每个平台相关模块中 (iOS 和 Android), 要为共通模块中预期的函数 `randomUUID()` 提供实际实现.
使用 `actual` 关键字标注实际实现.

以下示例演示这个函数在 Android 和 iOS 上的实现.
平台相关代码使用 `actual` 关键字加上预期函数的名称.

```kotlin
// Android 平台代码
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// iOS 平台代码
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

#### 实现一个 log 框架

另一个例子, 在一个极简化的 log 框架中, 演示如何编写共通代码, 并实现共通代码与平台逻辑之间的交互,
这个例子中的平台是 JS 和 JVM:

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

```kotlin
// JVM 平台代码
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    println("[$logLevel]: $message")
}
```

对于 JavaScript, 可以使用的 API 完全不同, `actual` 声明大致如下.

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

#### 通过 WebSocket 发送和接收消息

假设你在使用 Kotlin Multiplatform Mobile 为 iOS 和 Android 开发一个聊天平台.
我们来看看如何实现通过 WebSocket 发送和接收消息的功能.

为了达到这个目的, 请定义一个共通逻辑, 你不需要在所有平台模块中重复实现这段逻辑 – 只需要在共通模块中实现一次.
但是, WebSocket 类的实际实现在各个平台不同. 所以你应该对这个类使用 `expect`/`actual` 声明.

在共通模块中, 使用 `expect` 关键字声明预期类 `PlatformSocket()`. 不要包含任何实现代码.

```kotlin
// 共通代码
internal expect class PlatformSocket(
    url: String
) {
    fun openSocket(listener: PlatformSocketListener)
    fun closeSocket(code: Int, reason: String)
    fun sendMessage(msg: String)
}
interface PlatformSocketListener {
    fun onOpen()
    fun onFailure(t: Throwable)
    fun onMessage(msg: String)
    fun onClosing(code: Int, reason: String)
    fun onClosed(code: Int, reason: String)
}
```

在每个平台相关模块中 (iOS 和 Android), 要为共通模块中预期的 `PlatformSocket()` 类提供实际实现.
使用 `actual` 关键字标注实际实现.

以下示例演示这个类在 Android 和 iOS 上的实现.

```kotlin
// Android 平台代码
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket

internal actual class PlatformSocket actual constructor(url: String) {
    private val socketEndpoint = url
    private var webSocket: WebSocket? = null
    actual fun openSocket(listener: PlatformSocketListener) {
        val socketRequest = Request.Builder().url(socketEndpoint).build()
        val webClient = OkHttpClient().newBuilder().build()
        webSocket = webClient.newWebSocket(
            socketRequest,
            object : okhttp3.WebSocketListener() {
                override fun onOpen(webSocket: WebSocket, response: Response) = listener.onOpen()
                override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) = listener.onFailure(t)
                override fun onMessage(webSocket: WebSocket, text: String) = listener.onMessage(text)
                override fun onClosing(webSocket: WebSocket, code: Int, reason: String) = listener.onClosing(code, reason)
                override fun onClosed(webSocket: WebSocket, code: Int, reason: String) = listener.onClosed(code, reason)
            }
        )
    }
    actual fun closeSocket(code: Int, reason: String) {
        webSocket?.close(code, reason)
        webSocket = null
    }
    actual fun sendMessage(msg: String) {
        webSocket?.send(msg)
    }
}
```

Android 实现使用第 3 方库 [OkHttp](https://square.github.io/okhttp/).
请向共用模块中的 `build.gradle(.kts)` 添加对应的依赖项:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
sourceSets {
    val androidMain by getting {
        dependencies {
            implementation("com.squareup.okhttp3:okhttp:$okhttp_version")
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
commonMain {
    dependencies {
        implementation "com.squareup.okhttp3:okhttp:$okhttp_version"
    }
}
```

</div>
</div>

iOS 实现使用 Apple 标准 SDK 的 `NSURLSession`, 不需要额外的依赖项.

```kotlin
// iOS 平台代码
import platform.Foundation.*
import platform.darwin.NSObject

internal actual class PlatformSocket actual constructor(url: String) {
    private val socketEndpoint = NSURL.URLWithString(url)!!
    private var webSocket: NSURLSessionWebSocketTask? = null
    actual fun openSocket(listener: PlatformSocketListener) {
        val urlSession = NSURLSession.sessionWithConfiguration(
            configuration = NSURLSessionConfiguration.defaultSessionConfiguration(),
            delegate = object : NSObject(), NSURLSessionWebSocketDelegateProtocol {
                override fun URLSession(
                    session: NSURLSession,
                    webSocketTask: NSURLSessionWebSocketTask,
                    didOpenWithProtocol: String?
                ) {
                    listener.onOpen()
                }
                override fun URLSession(
                    session: NSURLSession,
                    webSocketTask: NSURLSessionWebSocketTask,
                    didCloseWithCode: NSURLSessionWebSocketCloseCode,
                    reason: NSData?
                ) {
                    listener.onClosed(didCloseWithCode.toInt(), reason.toString())
                }
            },
            delegateQueue = NSOperationQueue.currentQueue()
        )
        webSocket = urlSession.webSocketTaskWithURL(socketEndpoint)
        listenMessages(listener)
        webSocket?.resume()
    }
    private fun listenMessages(listener: PlatformSocketListener) {
        webSocket?.receiveMessageWithCompletionHandler { message, nsError ->
            when {
                nsError != null -> {
                    listener.onFailure(Throwable(nsError.description))
                }
                message != null -> {
                    message.string?.let { listener.onMessage(it) }
                }
            }
            listenMessages(listener)
        }
    }
    actual fun closeSocket(code: Int, reason: String) {
        webSocket?.cancelWithCloseCode(code.toLong(), null)
        webSocket = null
    }
    actual fun sendMessage(msg: String) {
        val message = NSURLSessionWebSocketMessage(msg)
        webSocket?.sendMessage(message) { err ->
            err?.let { println("send $msg error: $it") }
        }
    }
}
```

下面是共通模块中的共通逻辑, 它使用平台相关的 `PlatformSocket()` 类.

```kotlin
// 共通代码
class AppSocket(url: String) {
    private val ws = PlatformSocket(url)
    var socketError: Throwable? = null
        private set
    var currentState: State = State.CLOSED
        private set(value) {
            field = value
            stateListener?.invoke(value)
        }
    var stateListener: ((State) -> Unit)? = null
        set(value) {
            field = value
            value?.invoke(currentState)
        }
    var messageListener: ((msg: String) -> Unit)? = null
    fun connect() {
        if (currentState != State.CLOSED) {
            throw IllegalStateException("The socket is available.")
        }
        socketError = null
        currentState = State.CONNECTING
        ws.openSocket(socketListener)
    }
    fun disconnect() {
        if (currentState != State.CLOSED) {
            currentState = State.CLOSING
            ws.closeSocket(1000, "The user has closed the connection.")
        }
    }
    fun send(msg: String) {
        if (currentState != State.CONNECTED) throw IllegalStateException("The connection is lost.")
        ws.sendMessage(msg)
    }
    private val socketListener = object : PlatformSocketListener {
        override fun onOpen() {
            currentState = State.CONNECTED
        }
        override fun onFailure(t: Throwable) {
            socketError = t
            currentState = State.CLOSED
        }
        override fun onMessage(msg: String) {
            messageListener?.invoke(msg)
        }
        override fun onClosing(code: Int, reason: String) {
            currentState = State.CLOSING
        }
        override fun onClosed(code: Int, reason: String) {
            currentState = State.CLOSED
        }
    }
    enum class State {
        CONNECTING,
        CONNECTED,
        CLOSING,
        CLOSED
    }
}
```

## 预期声明与实际声明的规则

关于预期声明与实际声明的主要规则是:
* 预期声明使用关键字 `expect` 标记; 实际声明使用关键字 `actual` 标记.
* `expect` 和 `actual` 声明名称相同, 并在相同的包内 (拥有相同的完整限定名称).
* `expect` 声明 不能包含任何实现代码, 而且默认为 abstract.
* 在接口中, `expect` 声明中的函数不能带有函数体, 但它们对应的 `actual` 函数可以是 非-abstract, 并带有函数体.
这可以允许实现接口的类不必实现这个函数.

要指定共通的继承类不必实现一个函数, 请将它标记为 `open`.
然后这个函数的所有 `actual` 实现, 就都必须带有一个函数体:

```kotlin
// 共通代码
expect interface Mascot {
    open fun display(): String
}

class MascotImpl : Mascot {
    // 这里可以不必实现 `display()`: 所有的 `actual` 接口都必须有一个默认实现
}

// 特定平台代码
actual interface Mascot {
    actual fun display(): String {
        TODO()
    }
}
```

在每个平台的编译期间, 编译器会确保, 在共通源代码集或中间源代码集中的, 使用关键字 `expect` 标记的每个声明,
在所有的平台源代码集中, 都存在对应的, 使用关键字 `actual` 标记的声明.
IDE 提供了工具, 可以帮助你创建缺少的实际声明.

如果你有一个平台相关的库, 希望在共通代码中使用, 同时对其他平台则提供你自己的实现,
这时你可以为已存在的类定义一个类型别名, 以此作为实际声明:

```kotlin
expect class AtomicRef<V>(value: V) {
    fun get(): V
    fun set(value: V)
    fun getAndSet(value: V): V
    fun compareAndSet(expect: V, update: V): Boolean
}
```

```kotlin
actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```
