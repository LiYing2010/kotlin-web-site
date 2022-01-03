---
type: doc
layout: reference
category: "Other"
title: "跨平台程序开发"
---

# 跨平台程序开发

本页面最终更新: 2021/09/13

> 跨平台项目还在 [Alpha](/docs/reference_zh/components-stability.html) 状态.
它的语言特性和工具, 在未来的 Kotlin 版本中都有可能发生变更.
>
{:.note}

支持跨平台程序开发是 Kotlin 的重要益处之一.
它可以减少对 [不同的平台](mpp-supported-platforms.html) 编写和维护重复代码所耗费的时间,
同时又保持了原生程序开发的灵活性和其他益处.

下面是 Kotlin 跨平台程序的基本工作原理.

<img class="img-responsive" src="{{ url_for('asset', path='docs/images/mpp/kotlin-multiplatform.png' )}}"
  alt="Kotlin Multiplatform" width="500" />

*   **Common Kotlin** 包括语言, 核心库, 以及基本工具. Common Kotlin 中的代码会在所有平台上运行.
*   通过 Kotlin 跨平台库, 可以在共通代码和平台相关代码之间共用跨平台逻辑.
共通代码依赖于一组库, 其中包括各种常见任务,
比如 [HTTP](https://ktor.io/clients/http-client/multiplatform.html),
[序列化(serialization)](https://github.com/Kotlin/kotlinx.serialization),
以及 [协程管理](https://github.com/Kotlin/kotlinx.coroutines).
*   为了与平台交互, 使用 Kotlin 的平台相关版本.
**Kotlin 的平台相关版本**(Kotlin/JVM, Kotlin/JS, Kotlin/Native) 包括 Kotlin 语言的扩展, 以及平台相关的库和工具.
*   通过这些平台, 你可以访问 **平台原生代码** (JVM, JS, and Native), 利用所有的原生功能.

通过 Kotlin 跨平台程序, 可以花费更少的时间来编写和维护 [不同的平台](mpp-supported-platforms.html) 上的相同代码
 – 只需要通过 Kotlin 提供的机制来共用这些代码就可以了:

* [在你的项目中使用的所有平台上共用代码](mpp-share-on-platforms.html#share-code-on-all-platforms).
通过这种方式, 可以共用那些适用于所有平台的共通业务逻辑.

    ![Code shared for all platforms]({{ url_for('asset', path='docs/images/mpp/flat-structure.png') }})

* [在你的项目中使用的一部分(但不是所有)平台上共用代码](mpp-share-on-platforms.html#share-code-on-similar-platforms).
如果你的代码能够在一部分类似的平台上共用, 可以使用这种方法.

    ![Hierarchical structure]({{ url_for('asset', path='docs/images/mpp/hierarchical-structure.png') }})

    <img class="img-responsive" src="{{ url_for('asset', path='docs/images/mpp/iosmain-hierarchy.png' )}}"
      alt="Code shared for iOS targets" width="400" />

如果需要在共用代码中访问平台相关的 API, 可以使用 Kotlin [预期声明与实际声明(expected and actual declaration)](mpp-connect-to-apis.html) 机制.

使用这种机制, 由共通源代码集定义 *预期声明(expected declaration)*,
然后平台相关的源代码集必须提供与预期声明相符的 *实际声明(actual declaration)*.
对于大多数 Kotlin 声明都是如此, 比如函数, 类, 接口, 枚举, 属性, 以及注解.

<img class="img-responsive" src="{{ url_for('asset', path='docs/images/mpp/expect-actual.png' )}}"
  alt="Expect and actual declarations" width="700" />

```kotlin
//Common
expect fun randomUUID(): String
```

```kotlin
//Android
import java.util.*
actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
//iOS
import platform.Foundation.NSUUID
actual fun randomUUID(): String = NSUUID().UUIDString()
```

## 使用场景

### Android — iOS

在不同的移动平台上共用代码, 是 Kotlin 跨平台项目的主要使用场景之一,
通过 Kotlin 跨平台移动应用程序 (Kotlin Multiplatform Mobile, KMM),
你可以创建跨平台的移动应用程序, 在 Android 和 iOS 平台上共用代码, 比如业务逻辑, 网络连接, 等等.

参见 [KMM 的功能, 案例研究与示例](https://kotlinlang.org/lp/mobile/)

### Client — Server

另一种使用场景是联网的应用程序, 一部分逻辑既可以用在服务器端, 也可以用在浏览器内运行的客户端, 因此代码共用也可以带来很大的益处.
这种情况的代码共用也可以通过 Kotlin 跨平台项目来实现.

[Ktor 框架](https://ktor.io/) 适合于在联网的应用程序中创建异步的服务器端程序和客户端程序.

## 下一步做什么

如果你是 Kotlin 新手, 请先阅读 [Kotlin 入门](/docs/reference_zh/getting-started.html).

### 文档

* [Kotlin Multiplatform Mobile (KMM) 入门](/docs/reference_zh/kmm/kmm-getting-started.html)
* [创建跨平台项目](mpp-create-lib.html)
* [在多个平台间共用代码](mpp-share-on-platforms.html)
* [连接与平台相关的 API](mpp-connect-to-apis.html)

### 教程:

* [创建 KMM 应用程序](/docs/reference_zh/kmm/kmm-create-first-app.html):
  这个教程演示如何使用 [KMM plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile),
  创建一个运行在 Android 和 iOS 的移动应用程序.
你可以学会如何创建, 运行, 测试 你的第一个跨平台移动应用程序.

* [创建跨平台的 Kotlin 库](multiplatform-library.html):
  这个教程演示如何创建一个可用于 JVM, JS, 以及原生平台的跨平台库, 可供任何其他的共通代码使用(比如, 在 Android 和 iOS 平台共用).
  还演示了如何编写测试, 这些测试将在所有平台上运行, 以及如何使用由特定平台提供的高效率实现.

* [使用 Kotlin Multiplatform 构建一个全栈的(full stack) Web 应用程序](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction):
  这个教程创建一个 Client-Server 应用程序, 其中用到共用代码, 序列化, 以及其他各种跨平台开发的范例.
  通过这个例子, 在创建针对 Kotlin/JVM 和 Kotlin/JS 目标平台的应用程序的过程中, 讲授背后的概念.
  还简要介绍了如何将 Ktor 同时用作服务器端框架和客户端框架.

## 示例项目

- [Kotlin Multiplatform Mobile (KMM) 示例](/docs/reference_zh/kmm/kmm-samples.html)
- [KotlinConf App](https://github.com/JetBrains/kotlinconf-app)
- [KotlinConf Spinner App](https://github.com/jetbrains/kotlinconf-spinner)
