---
type: doc
layout: reference
category: "Other"
title: "Kotlin Multiplatform"
---

# Kotlin Multiplatform
[//]: # (description: Kotlin Multiplatform 可以创建跨平台应用程序, 运行在桌面, Web, 以及移动设备上.
[//]: # 在共用应用程序逻辑的同时, 还能保持原生应用程序的用户体验.)

最终更新: {{ site.data.releases.latestDocDate }}

> Kotlin Multiplatform 还在 [Beta](/docs/reference_zh/components-stability.html) 状态.
> 已经接近稳定, 但未来可能会需要一些迁移步骤. 我们会尽力减少你需要进行的修改工作.
{:.note}

Kotlin Multiplatform 技术的设计目的是为了简化跨平台项目的开发工作.
它可以减少对 [不同的平台](#kotlin-multiplatform-use-cases) 编写和维护重复代码所耗费的时间,
同时又保持了原生程序开发的灵活性和其他益处.

## Kotlin Multiplatform 使用场景

### Android 和 iOS 应用程序

在不同的移动平台上共用代码, 是 Kotlin 跨平台项目的主要使用场景之一,
通过 Kotlin Multiplatform Mobile, 你可以创建跨平台的移动应用程序,
在 Android 和 iOS 平台上共用代码, 比如业务逻辑, 网络连接, 等等.

请参见 [Kotlin Multiplatform Mobile 入门](../multiplatform-mobile/multiplatform-mobile-getting-started.html) 文档,
以及 [使用 Ktor 和 SQLDelight 创建跨平台应用程序](../multiplatform-mobile/multiplatform-mobile-ktor-sqldelight.html) 教程,
在这个教程中你将创建运行于 Android 和 iOS 的应用程序, 其中包括对这两个平台共用代码的模块.

### 全栈(Full-Stack) Web 应用程序

另一种使用场景是联网的应用程序, 一部分逻辑既可以用在服务器端, 也可以用在浏览器内运行的客户端, 因此代码共用也可以带来很大的益处.
这种情况的代码共用也可以通过 Kotlin 跨平台项目来实现.

参见教程 [使用 Kotlin Multiplatform 构建一个全栈 Web 应用程序](multiplatform-full-stack-app.html),
在这个教程中你将创建一个完整的应用程序, 包括服务器端, 使用 Kotlin/JVM 平台, 以及 Web Client 端, 使用 Kotlin/JS 平台.

### 跨平台库

Kotlin Multiplatform 也可以帮助库的开发者. 你可以为 JVM, JS, 和 Native 平台创建一个跨平台的库, 其中包含共通代码, 以及各个平台相关的实现.
发布之后, 跨平台的库可以作为依赖项, 在其他跨平台项目中使用.

参见教程 [创建和发布跨平台库](multiplatform-library.html), 在这个教程中你将创建一个跨平台的库, 测试它, 并发布到 Maven.

### 对移动和 Web 应用程序共用代码

使用 Kotlin Multiplatform 的另一种常见情况是, 对 Android, iOS, 和 Web 应用程序共用一部分代码.
这样可以减少前端开发者编写的业务逻辑代码数量, 有助于更加有效的实现产品, 减少编码和测试的工作量.

参见 [RSS 阅读器](https://github.com/Kotlin/kmm-production-sample/tree/c6a0d9182802490d17729ae634fb59268f68a447) 示例项目
— 一个运行于 对 iOS 和 Android 的跨平台应用程序, 此外, 作为实验性功能, 还有桌面版和 Web 版的实现.

## Kotlin Multiplatform 基本工作原理

<img class="img-responsive" src="{{ url_for('asset', path='docs/images/multiplatform/kotlin-multiplatform.png' )}}"
  alt="Kotlin Multiplatform" width="500" />

* **Common Kotlin** 包括语言, 核心库, 以及基本工具. Common Kotlin 中的代码会在所有平台上运行.
* 通过 Kotlin 跨平台库, 可以在共通代码和平台相关代码之间共用跨平台逻辑.
共通代码依赖于一组库, 其中包括各种常见任务,
比如 [HTTP](https://ktor.io/clients/http-client/multiplatform.html),
[序列化(serialization)](https://github.com/Kotlin/kotlinx.serialization),
以及 [协程管理](https://github.com/Kotlin/kotlinx.coroutines).
* 为了与平台交互, 使用 Kotlin 的平台相关版本.
**Kotlin 的平台相关版本**(Kotlin/JVM, Kotlin/JS, Kotlin/Native) 包括 Kotlin 语言的扩展, 以及平台相关的库和工具.
* 通过这些平台, 你可以访问 **平台原生代码** (JVM, JS, and Native), 利用所有的原生功能.

### 在不同平台间共用代码

通过 Kotlin 跨平台程序, 可以花费更少的时间来编写和维护 [不同的平台](multiplatform-dsl-reference.html#targets) 上的相同代码
 – 只需要通过 Kotlin 提供的机制来共用这些代码就可以了:

* [在你的项目中使用的所有平台上共用代码](multiplatform-share-on-platforms.html#share-code-on-all-platforms).
通过这种方式, 可以共用那些适用于所有平台的共通业务逻辑.
* [在你的项目中使用的一部分(但不是所有)平台上共用代码](multiplatform-share-on-platforms.html#share-code-on-similar-platforms).
如果你的代码能够在一部分类似的平台上共用, 可以使用这种方法:

    <img class="img-responsive" src="{{ url_for('asset', path='docs/images/multiplatform/kotlin-multiplatform-hierarchical-structure.svg' )}}"
      alt="iOS 编译目标之间的代码共用" width="700" />

* 如果需要在共用代码中访问平台相关的 API, 可以使用 Kotlin [预期声明与实际声明(expected and actual declaration)](multiplatform-connect-to-apis.html) 机制.

## 入门学习

* 如果你想要使用共通代码创建 iOS 和 Android 应用程序, 请参见 [Kotlin Multiplatform Mobile 入门](../multiplatform-mobile/multiplatform-mobile-getting-started.html)
* 如果你想要针对其他平台创建应用程序或库, 请参见 [共用代码的原则与示例](multiplatform-share-on-platforms.html)

> 如果你是 Kotlin 新手, 请先阅读 [Kotlin 入门](../getting-started.html)
{:.tip}

### 示例项目

可以查看以下跨平台应用程序示例, 来理解 Kotlin Multiplatform 的工作方式:

* [Kotlin Multiplatform Mobile 示例](../multiplatform-mobile/multiplatform-mobile-samples.html)
* [KotlinConf App](https://github.com/JetBrains/kotlinconf-app)
* [KotlinConf Spinner App](https://github.com/jetbrains/kotlinconf-spinner)
* [使用 Kotlin Multiplatform 构建一个全栈 Web 应用程序](multiplatform-full-stack-app.html)
