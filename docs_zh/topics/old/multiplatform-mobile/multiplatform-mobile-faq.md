[//]: # (title: FAQ)

最终更新: %latestDocDate%

### Kotlin Multiplatform Mobile 是什么?

_Kotlin Multiplatform Mobile (KMM)_ 是一个跨平台移动应用程序开发 SDK.
你可以开发跨平台移动应用程序, 并在 Android 和 iOS 之间共用共通代码, 比如核心层, 业务逻辑, 表现逻辑, 等等.

Kotlin Mobile 使用 [Kotlin 的跨平台能力](../multiplatform/multiplatform.html), 以及针对移动应用程序开发设计的功能,
比如与 CocoaPods 的集成, 以及 [Android Studio Plugin](#what-is-the-kotlin-multiplatform-mobile-plugin).

你可以想看看介绍 [视频](https://www.youtube.com/watch?v=mdN6P6RI__k),
在这个视频中 Kotlin 产品市场经理 Ekaterina Petrova 解释了 Kotlin Multiplatform Mobile 是什么,
以及在你的项目中如何使用.
和 Ekaterina 一起, 你将会设置开发环境, 准备好使用 Kotlin Multiplatform Mobile 来创建你的第一个跨平台移动应用程序.

### Kotlin Multiplatform Mobile plugin 是什么?

针对 Android Studio 的 _[Kotlin Multiplatform Mobile plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)_
可以帮助你开发同时工作于 Android 和 iOS 上的应用程序.

使用 Kotlin Multiplatform Mobile plugin, 你能够:
* 直接在 Android Studio 中运行, 测试, 以及调试你的应用程序的 iOS 部分.
* 快速创建新的跨平台项目.
* 向已有的项目添加跨平台模块.

Kotlin Multiplatform Mobile plugin 只能在 macOS 上运行. 这是因为根据 Apple 的要求 iOS 模拟器只能运行在 macOS 上,
而不能运行在其他操作系统上, 比如 Microsoft Windows 或 Linux.

好消息是, 即使没有 Kotlin Multiplatform Mobile plugin 你也可以在 Android 上开发跨平台项目.
如果你打算开发共用代码, 或 Android 专用代码, 你可以使用 Android Studio 支持的任何操作系统.

### Kotlin/Native 是什么, 它与 Kotlin Multiplatform Mobile 的关系是什么?

_[Kotlin/Native](../native/native-overview.html)_ 是一种技术, 用于将 Kotlin 代码编译为脱离虚拟机直接运行的原生二进制文件.
它包含一个基于 [LLVM](https://llvm.org/) 的后端, 供 Kotlin 编译器使用, 还包含 Kotlin 标准库的原生代码实现.

Kotlin/Native 主要设计用于将代码编译到不适合或无法使用虚拟机的平台, 比如嵌入式设备, 以及 iOS.
具体来说, 它适用于开发者需要生成自包含的程序的情况, 这样的程序不依赖于额外的运行时环境或虚拟机.
这恰恰就是 iOS 开发的情况.

共用代码使用 Kotlin 编写, 对 Android 使用 Kotlin/JVM 编译为 JVM 字节码, 对 iOS 使用 Kotlin/Native 编译为原生二进制文件.
通过 Kotlin Multiplatform Mobile 将这两种平台无缝的集成在一起.
![Kotlin/Native 与 Kotlin/JVM 二进制文件]({{ url_for('asset', path='docs/images/multiplatform-mobile/kotlin-native-and-jvm-binaries.png') }})

### 相关技术的开发计划是什么?

Kotlin Multiplatform Mobile 是 [Kotlin 发展路线图](../roadmap.html) 中的核心部分之一.
要查看我们目前正在开发哪些功能, 请参见 [发展路线图细节](../roadmap.html#roadmap-details).
最近的大部分变更反应在 **Kotlin Multiplatform** 和 **Kotlin/Native** 小节.

下面的视频介绍 Kotlin Multiplatform Mobile 的当前状态, 以及我们的开发计划:

<iframe width="560" height="360" src="https://www.youtube.com/embed/CngKDGBlFxk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### 我能在 Microsoft Windows 或 Linux 上运行 iOS 应用程序吗?

如果你想要编写 iOS 专用代码, 并在模拟器或真实设备上运行 iOS 应用程序,
请使用运行 macOS 操作系统的 Mac 计算机([在这个环境使用 Kotlin Multiplatform Mobil plugin](#what-is-the-kotlin-multiplatform-mobile-plugin)).
这是因为根据 Apple 的要求 iOS 模拟器只能运行在 macOS 上, 而不能运行在其他操作系统上, 比如 Microsoft Windows 或 Linux.

如果你打算开发共用代码, 或 Android 专用代码, 你可以使用 Android Studio 支持的任何操作系统.

### 我在哪里能够得到完整的示例程序?

* [示例程序列表](multiplatform-mobile-samples.html)
* [教程 - 使用 Ktor 和 SQLDelight 创建跨平台应用程序](multiplatform-mobile-ktor-sqldelight.html)

### 我应该在哪个 IDE 中开发我的跨平台应用程序?

你可以使用 [Android Studio](https://developer.android.com/studio).
Android Studio 可以使用 [Kotlin Multiplatform Mobile plugin](#what-is-the-kotlin-multiplatform-mobile-plugin),
它是 Kotlin 生态环境的一部分.
如果你想要编写 iOS 专用代码, 并在模拟器或真实设备上启动 iOS 应用程序, 请在 Android Studio 中启用 Kotlin Multiplatform Mobile plugin.
这个 plugin 只能运行在 macOS 上.

我们的大多数用户都使用 Android Studio.
但是, 如果对你来说出于某些理由不使用 Android Studio, 也有其它的选择: 你可以使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/download).
IntelliJ IDEA 也可以通过项目向导创建跨平台移动应用程序, 但你不能通过 IDE 启动 iOS 应用程序.

### 在 Kotlin Multiplatform Mobile 项目中我应该怎样编写并发代码?

通过使用新的 [Kotlin/Native 内存管理器](../native/native-memory-manager.html), 在你的跨平台移动项目中可以很容易的编写并发代码,
这个新的内存管理器消除了以前的限制, 并统一了在 Kotlin/JVM 和 Kotlin/Native 上的行为.
从 Kotlin 1.7.20 开始, 已经默认启用了新的内存管理器.

### 我要怎样提高我的 Kotlin Multiplatform 模型在 iOS 上的编译速度?
请参见 [改善 Kotlin/Native 编译速度的技巧](../native/native-improving-compilation-time.html).

## 你们支持哪些平台?

Kotlin Multiplatform Mobile 支持以下平台的开发:

* Android 应用程序和库
* [Android NDK](https://developer.android.com/ndk) (ARM64 和 ARM32)
* Apple iOS 设备和模拟器
* Apple watchOS 设备和模拟器

[Kotlin Multiplatform](../multiplatform/multiplatform.html) 技术还支持 [其他平台](../multiplatform/multiplatform-dsl-reference.html#targets),
包括 JavaScript, Linux, Windows, 以及 WebAssembly.
