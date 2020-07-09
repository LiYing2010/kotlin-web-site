---
type: doc
layout: reference
category: "Other"
title: "跨平台项目"
---

# 跨平台程序开发

> 跨平台项目是 Kotlin 1.2 和 1.3 版中新增的实验性特性. 本文档描述的所有语言特新和工具特性, 在未来的 Kotlin 版本中都有可能发生变更.
{:.note}

Kotlin 的一个明确目标就是希望能运行在所有平台上, 但是我们认为这个能力是为了实现一个更重要的目标: 在各种不同的平台上共用代码.
有了对各种平台的支持, 比如 JVM, Android, JavaScript, iOS, Linux, Windows, Mac, 甚至 STM32 这样的嵌入式系统, Kotlin 语言可以用来开发一个现代应用程序的任何组成部分.
而且, 由于可以重用源代码, 可以重用程序开发者的专业能力, 我们可以不必在不同的平台上重复实现同样的功能, 而将我们的精力用于实现更重要的功能, 这是无法估量的巨大益处.

## 基本工作原理

总体来说, 跨平台项目并不是简单地针对所有的平台编译所有的源代码.
这种模式存在明显的限制, 而且我们认识到, 现代应用程序需要使用它所运行的平台上的独有功能.
Kotlin 并不限制你只能访问所有 API 的一个共通子集.
应用程序的各个部分之间都可以按照需要共用尽源代码, 同时也随时可以通过 Kotlin 语言提供的 [`expect`/`actual` 机制](platform-specific-declarations.html) 访问平台的 API.

下面的例子是一个极简单的日志框架, 演示如何共用代码, 以及在共通代码与平台逻辑之间如何交互.
共通代码大概是这样:

<div style="display:flex">
<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
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
    <div style="display:flex">├<i style="margin-left:5px">针对所有平台编译</i></div>
    <div style="display:flex">├<i style="margin-left:5px">与平台相关的预期 API</i></div>
    <div style="display:flex">├<i style="margin-left:5px">预期 API 可以在共通代码中使用</i></div>
</div>
</div>

上面的代码预期各个平台的编译目标会为 `writeLogMessage` 函数提供平台相关的实现, 因此共通代码可以使用这个函数, 而不必考虑它具体如何实现.

在 JVM 平台, 你可以为这个函数提供实现, 将日志写到标准输出:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    println("[$logLevel]: $message")
}
```

</div>

在 JavaScript 中, 可以使用的是另一套完全不同的 API, 因此你可以在这个函数的实现中使用 console:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    when (logLevel) {
        LogLevel.DEBUG -> console.log(message)
        LogLevel.WARN -> console.warn(message)
        LogLevel.ERROR -> console.error(message)
    }
}
```

</div>

在 1.3 版中, 我们重构了整个跨平台项目的模型. 我们用来描述跨平台的 Gradle 项目的 [新 DSL](building-mpp-with-gradle.html) 比以前更加灵活, 我们还在继续改进它, 以使项目的配置更加直观.

## 跨平台的库

共通代码可能依赖于一系列的库, 用来实现各种常见任务, 比如 [HTTP](http://ktor.io/clients/http-client/multiplatform.html), [序列化](https://github.com/Kotlin/kotlinx.serialization), 以及 [管理协程](https://github.com/Kotlin/kotlinx.coroutines).
而且, 所有的平台都提供了内容广泛的标准库.

你也可以编写你自己的库, 提供共通的 API, 并在各个平台上提供不同的实现.

## 用例

### Android — iOS

在不同的移动平台上共用代码, 是 Kotlin 跨平台项目的主要使用场景之一,
现在, 为了创建移动设备上的应用程序, 我们可以在 Android 和 iOS 平台上共用一部分代码, 比如业务逻辑, 网络连接, 等等.

参见:
- [跨平台移动应用程序开发功能, 案例研究与示例](https://www.jetbrains.com/lp/mobilecrossplatform/)
- [设置一个跨平台移动应用程序工程](/docs/tutorials/native/mpp-ios-android.html)

### Client — Server

另一种使用场景是联网的应用程序, 一部分逻辑既可以用在服务器端, 也可以用在浏览器内运行的客户端, 因此代码共用也可以带来很大的益处.
这种情况的代码共用也可以通过 Kotlin 跨平台项目来实现.

[Ktor 框架](https://ktor.io/) 适合于在联网的应用程序中创建异步的服务器端程序和客户端程序.

## 如何开始

<div style="display: flex; align-items: center; margin-bottom: 20px">
    <img src="{{ url_for('asset', path='images/landing/native/book.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>教程和文档</b>
</div>

如果你是 Kotlin 新手, 请先阅读 [入门](basic-syntax.html).

推荐的文档:
- [设置跨平台项目](building-mpp-with-gradle.html#setting-up-a-multiplatform-project)
- [与平台相关的声明](platform-specific-declarations.html)

推荐的教程:
- [跨平台的 Kotlin 库](/docs/tutorials/mpp/multiplatform-library.html)
- [跨平台项目: iOS 与 Android](/docs/tutorials/native/mpp-ios-android.html)

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="{{ url_for('asset', path='images/landing/native/try.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>示例项目</b>
</div>

- [KotlinConf App](https://github.com/JetBrains/kotlinconf-app)
- [KotlinConf Spinner App](https://github.com/jetbrains/kotlinconf-spinner)

更多示例请参见 [GitHub](https://github.com/JetBrains/kotlin-examples)
