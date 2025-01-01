[//]: # (title: 使用 Kotlin/Native 进行原生(Native)程序开发)

Kotlin/Native 是一种代码编译技术, 可以将 Kotlin 代码编译为原生二进制代码(native binary), 脱离 VM 运行.
它包含一个基于 [LLVM](https://llvm.org/) 的后端, 用于编译 Kotlin 源代码, 以及一个原生代码实现的 Kotlin 运行库.

## 为什么要使用 Kotlin/Native?

Kotlin/Native 的主要设计目的是, 用来编译 Kotlin 代码, 使其能够运行在那些不应该使用 _虚拟机_ , 或无法使用 _虚拟机_ 的平台上, 比如嵌入式设备, 或 iOS.
它适合用于帮助开发者生成完整独立的, 不依赖于额外运行库和虚拟机的独立程序.

## 目标平台 {id="target-platforms"}

Kotlin/Native 支持以下平台:
* macOS
* iOS, tvOS, watchOS
* Linux
* Windows (MinGW)
* Android NDK

> 要编译到 Apple 平台的编译目标, macOS, iOS, tvOS, 和 watchOS, 你需要安装 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
> 以及它的命令行工具.
>
{style="note"}

[请参见所有支持的目标平台](native-target-support.md).

## 互操作性

Kotlin/Native 支持与各种操作系统的原生编程语言之间的双向互操作.
编译器会创建:
* 各种 [平台](#target-platforms) 的可执行文件
* 静态库, 或 [动态](native-dynamic-libraries.md) 库, 以及供 C/C++ 项目使用的 C 头文件
* 供 Swift 和 Objective-C 项目使用的 [Apple 框架](apple-framework.md)

Kotlin/Native 也支持在 Kotlin/Native 源代码中直接使用既有的库:
* 静态或动态的 [C 库](native-c-interop.md)
* C, [Swift 和 Objective-C](native-objc-interop.md) 框架

在既有的 C, C++, Swift, Objective-C 和其他语言的项目中, 可以很容易地包含编译后的 Kotlin 代码.
在 Kotlin/Native 代码中, 也可以很容易地直接使用既有的原生代码,
静态或动态的 [C 库](native-c-interop.md),
Swift/Objective-C [框架](native-objc-interop.md),
图形引擎, 以及其他任何东西.

Kotlin/Native 的 [库](native-platform-libs.md) 可以帮助你在多个项目中共享 Kotlin 代码.
POSIX, gzip, OpenGL, Metal, Foundation, 以及其他许多流行的库和 Apple 框架,
都已预先导入为 Kotlin/Native 库形式, 包含在编译器的包中了.

## 在不同的平台上共享代码

[Kotlin Multiplatform](multiplatform-intro.md) 可以帮助你在多个不同的平台上共用代码,
包括 Android, iOS, JVM, Web, 以及原生平台.
跨平台库为共通的 Kotlin 代码提供了必要的 API, 帮助我们用 Kotlin 代码编写项目中共通的部分, 这些代码只需要编写一次.

你可以通过 [创建你的第一个跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
教程来创建应用程序, 并在 iOS 和 Android 平台共用业务逻辑.
如果要在 iOS, Android, Desktop, 以及 Web 平台上共用 UI,
请完成 [Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html) 的教程,
Compose Multiplatform 是 JetBrains 开发的, 基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 开发的声明式 UI 框架.

## 如何入门

如果你是 Kotlin 新手, 请先阅读 [Kotlin 入门](getting-started.md).

推荐文档:

* [Kotlin Multiplatform 简介](multiplatform-intro.md)
* [与 C 代码交互](native-c-interop.md)
* [与 Swift/Objective-C 代码交互](native-objc-interop.md)

推荐教程:

* [Kotlin/Native 入门](native-get-started.md)
* [创建你的第一个跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)
* [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md)
* [使用 Kotlin/Native 开发动态链接库](native-dynamic-libraries.md)
* [使用 Kotlin/Native 开发 Apple 框架](apple-framework.md)
