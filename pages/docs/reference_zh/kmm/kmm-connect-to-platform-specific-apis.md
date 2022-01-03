---
type: doc
layout: reference
title: "连接到平台相关 API"
---

# 连接到平台相关 API

本页面最终更新: 2022/02/28

如果你正在使用 Kotlin Multiplatform Mobile 开发为不同的平台移动应用程序, 并且需要访问平台相关的 API 来实现需要的功能(比如, 生成一个 UUID),
你可以使用 Kotlin 的 [预期声明与实际声明](../mpp/mpp-connect-to-apis.html) 机制.

通过这种机制, 一个共通模块定义一个 _预期声明(Expected Declaration)_, 各平台模块必须提供与之对应的 _实际声明(Actual Declaration)_.
对大多数 Kotlin 声明都可以如此工作, 比如函数, 类, 接口, 枚举, 属性, 以及注解.

<img src="/assets/docs/images/kmm/expect-actual-general.png" alt="共通模块和平台相关模块中的预期声明与实际声明" width="700"/>

编译器会保证, 共通模块中每个标记 `expect` 关键字的声明, 在所有的平台模块中都存在对应的标记 `actual` 关键字的声明.
IDE 提供了工具帮助你创建缺少的实际声明.

> 我们推荐只对存在平台相关依赖项的 Kotlin 声明使用预期声明与实际声明.  
> 在共通模块中实现所有可能的功能会比较好, 即使这样做会耗费更多时间.
> 请不要滥用预期声明与实际声明 – 对于有些情况, 接口可能是更好的选择, 因为它更加灵活, 而且易于测试.
{:.note}

详情请参见 [添加平台相关库的依赖项](kmm-add-dependencies.html).

## 示例

为了简单起见, 以下示例使用简化的编译目标名称 iOS 和 Android. 但是, 在你的 Gradle 构建文件中,
你需要使用 [支持的编译目标](../mpp/mpp-supported-platforms.html) 中的一个确切的编译目标名称.

* [生成 UUID](#example-generate-a-uuid)
* [通过 WebSocket 发送和接收消息](#example-send-and-receive-messages-from-a-websocket)

### 示例: 生成 UUID

假设你正在使用 Kotlin Multiplatform Mobile 开发 iOS 和 Android 应用程序, 你想要生成 Universally Unique Identifier (UUID).

<img src="/assets/docs/images/kmm/expect-actual-example.png" alt="用于得到 UUID 的预期声明与实际声明" width="700"/>

为了达到这个目的, 请在共通模块中使用 `expect` 关键字声明预期函数 `randomUUID()`. 
这里不要包括任何实现代码.

```kotlin
// 共通模块代码
expect fun randomUUID(): String
```

在每个平台相关模块中 (iOS 和 Android), 要为共通模块中预期的函数 `randomUUID()` 提供实际实现.
使用 `actual` 关键字标注实际实现. 

以下示例演示这个函数在 Android 和 iOS 上的实现.
平台相关代码使用 `actual` 关键字加上预期函数的名称.

```kotlin
// Android 代码
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// iOS 代码
import platform.Foundation.NSUUID
        
actual fun randomUUID(): String = NSUUID().UUIDString()
```

### 示例: 通过 WebSocket 发送和接收消息

最后, 假设你在使用 Kotlin Multiplatform Mobile 为 iOS 和 Android 开发一个聊天平台. 
我们来看看你如何通过 WebSocket 发送和接收消息.

为了达到这个目的, 请定义一个共通逻辑, 你不需要在所有平台模块中重复实现这段逻辑 – 只需要在共通模块中实现一次.
但是, WebSocket 类的实际实现在各个平台不同. 所以你应该对这个类使用 `expect`/`actual` 声明. 

在共通模块中, 使用 `expect` 关键字声明预期类 `PlatformSocket()`. 不要包含任何实现代码.

```kotlin
// 共通模块代码
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
// Android 代码
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
// iOS 代码
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
// 共通模块代码
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
