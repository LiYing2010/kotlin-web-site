---
type: doc
layout: reference
title: "FAQ"
---

# FAQ

本页面最终更新: 2022/02/25

### KMM 是什么?

_KMM (Kotlin Multiplatform Mobile)_ 是一个跨平台移动应用程序开发 SDK.
使用 KMM, 你可以开发跨平台移动应用程序, 并在 Android 和 iOS 之间共用共通代码, 比如核心层, 业务逻辑, 表现逻辑, 等等.

KMM 使用 [Kotlin 的跨平台能力](../mpp/multiplatform.html), 以及针对移动应用程序开发设计的功能,
比如与 CocoaPods 的集成, 以及 [Android Studio Plugin](#what-is-the-kmm-plugin).

你可以想看看介绍 [视频](https://www.youtube.com/watch?v=mdN6P6RI__k),
在这个视频中 Kotlin 产品市场经理 Ekaterina Petrova 解释了 Kotlin Multiplatform Mobile 是什么,
以及在你的项目中如何使用.
和 Ekaterina 一起, 你将会设置开发环境, 准备好使用 KMM 来创建你的第一个跨平台移动应用程序.

### KMM plugin 是什么?

针对 Android Studio 的 _[Kotlin Multiplatform Mobile (KMM) plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)_
可以帮助你开发同时工作于 Android 和 iOS 上的应用程序. 

使用 KMM Plugin, 你能够:
* 直接在 Android Studio 中运行, 测试, 以及调试你的应用程序的 iOS 部分.
* 快速创建新的跨平台项目.
* 向已有的项目添加跨平台模块.

KMM plugin 只能在 macOS 上运行. 这是因为根据 Apple 的要求 iOS 模拟器只能运行在 macOS 上,
而不能运行在其他操作系统上, 比如 Microsoft Windows 或 Linux.

好消息是, 即使没有 KMM plugin 你也可以在 Android 上开发 KMM 项目.
如果你打算开发共用代码, 或 Android 专用代码, 你可以使用 Android Studio 支持的任何操作系统.

### Kotlin/Native 是什么, 它与 KMM 的关系是什么?

_[Kotlin/Native](../native/native-overview.html)_ 是一种技术, 用于将 Kotlin 代码编译为脱离虚拟机直接运行的原生二进制文件.
它包含一个基于 [LLVM](https://llvm.org/) 的后端, 供 Kotlin 编译器使用, 还包含 Kotlin 标准库的原生代码实现.

Kotlin/Native 主要设计用于将代码编译到不适合或无法使用虚拟机的平台, 比如嵌入式设备, 以及 iOS.
具体来说, 它适用于开发者需要生成自包含的程序的情况, 这样的程序不依赖于额外的运行时环境或虚拟机.
这恰恰就是 iOS 开发的情况.

共用代码使用 Kotlin 编写, 对 Android 使用 Kotlin/JVM 编译为 JVM 字节码, 对 iOS 使用 Kotlin/Native 编译为原生二进制文件.
通过 KMM 将这两种平台无缝的集成在一起.
![Kotlin/Native 与 Kotlin/JVM 二进制文件]({{ url_for('asset', path='/docs/images/kmm/kotlin-native-and-jvm-binaries.png') }})

### KMM 的开发计划是什么?

KMM 是 [Kotlin 发展路线图](../roadmap.html) 中的核心部分之一.
要查看我们目前正在开发哪些功能, 请参见 [发展路线图细节](../roadmap.html#roadmap-details). 
KMM 最近的大部分变更反应在 **Kotlin Multiplatform** 和 **Kotlin/Native** 小节.

下面的视频介绍我们关于 Kotlin Multiplatform Mobile 的下一阶段开发计划 – 它将升级到 [Beta版](../components-stability.html): 

<iframe width="560" height="360" src="https://www.youtube.com/embed/LE-Dy9XCLxk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 我能在 Microsoft Windows 或 Linux 上运行 iOS 应用程序吗?

如果你想要编写 iOS 专用代码, 并在模拟器或真实设备上运行 iOS 应用程序, 请使用运行 macOS 操作系统的 Mac 计算机([在这个环境使用 KMM plugin](#what-is-the-kmm-plugin)).
这是因为根据 Apple 的要求 iOS 模拟器只能运行在 macOS 上, 而不能运行在其他操作系统上, 比如 Microsoft Windows 或 Linux.

如果你打算开发共用代码, 或 Android 专用代码, 你可以使用 Android Studio 支持的任何操作系统.

### 我在哪里能够得到完整的示例程序?

* [示例程序列表](kmm-samples.html)
* 几个 [动手实验室(hands-on)教程](https://play.kotlinlang.org/hands-on/overview)

### 我应该在哪个 IDE 中开发我的跨平台应用程序?

你可以使用 [Android Studio](https://developer.android.com/studio).
Android Studio 可以使用 [KMM plugin](#what-is-the-kmm-plugin), 它是 KMM 生态环境的一部分.
如果你想要编写 iOS 专用代码, 并在模拟器或真实设备上启动 iOS 应用程序, 请在 Android Studio 中启用 KMM plugin.
KMM plugin 只能运行在 macOS 上.

我们的大多数用户都使用 Android Studio.
但是, 如果对你来说出于某些理由不使用 Android Studio, 也有其它的选择: 你可以使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/download).
IntelliJ IDEA 也可以通过项目向导创建跨平台移动应用程序, 但你不能通过 IDE 启动 iOS 应用程序.

### 在 KMM 项目中我应该怎样编写并发代码?

你可以通过我们的文档, 学习如何使用 [并发](kmm-concurrency-overview.html).

在 KMM 项目中编写并发代码, 看起来可能并不容易, 因为在 Kotlin/JVM 和 Kotlin/Native 中使用了不同的内存管理机制.
Kotlin/Native 目前的机制存在某些 [限制](../native/native-concurrency.html).
新的 Kotlin/Native 内存管理模型已经列入了 [发展路线图](https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap),
开发组正在为此工作中.

### 我要怎样提高我的 KMM 模型在 iOS 上的编译速度?
请参见 [改善 Kotlin/Native 编译速度的技巧](../native/native-improving-compilation-time.html).
