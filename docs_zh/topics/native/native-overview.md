[//]: # (title: Kotlin/Native)

Kotlin/Native 是一种代码编译技术, 可以将 Kotlin 代码编译为原生二进制代码(native binary), 脱离 VM 运行.
它包含一个基于 [LLVM](https://llvm.org/) 的后端, 用于编译 Kotlin 源代码, 以及一个原生代码实现的 Kotlin 运行库.

## 为什么要使用 Kotlin/Native?

Kotlin/Native 的主要设计目的是, 用来编译 Kotlin 代码, 使其能够运行在那些不应该使用 _虚拟机_ ,
或无法使用 _虚拟机_ 的平台上, 比如嵌入式设备, 或 iOS.
它适合用于帮助你生成完整独立的, 不依赖于额外运行库和虚拟机的独立程序.

在使用 C, C++, Swift, Objective-C, 和其它语言编写的既有项目中, 可以很容易的包含编译后的 Kotlin 代码.
在 Kotlin/Native 代码中, 也可以很容易地直接使用既有的原生代码,
静态或动态的 C 库, Swift/Objective-C 框架, 图形引擎, 以及其他任何东西.

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="Kotlin/Native 开发入门" style="block"/></a>

## 目标平台 {id="target-platforms"}

Kotlin/Native 支持以下平台:

* Linux
* Windows (通过 [MinGW](https://www.mingw-w64.org/) 支持)
* [Android NDK](https://developer.android.com/ndk)
* 针对 macOS, iOS, tvOS, 和 watchOS 的 Apple 平台

  > 要编译到 Apple 平台的编译目标, 你需要安装 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
  > 以及它的命令行工具.
  >
  {style="note"}

[请参见所有支持的目标平台](native-target-support.md).

## 互操作性

Kotlin/Native 支持与各种操作系统的原生编程语言之间的双向互操作.
编译器能够创建各种平台的可执行文件, 静态或动态的 C 库, 以及 Swift/Objective-C 框架.

### 与 C 的交互能力

Kotlin/Native 提供了 [与 C 的交互能力](native-c-interop.md).
在 Kotlin 代码中, 你可以直接使用既有的 C 库.

要了解更多详情, 请完成以下教程:

* [为 C/C++ 项目创建一个带 C 头文件的动态库](native-dynamic-libraries.md)
* [学习 C 类型如何映射到 Kotlin](mapping-primitive-data-types-from-c.md)
* [使用 C interop 和 libcurl 创建一个原生的 HTTP 客户端](native-app-with-c-and-libcurl.md)

### 与 Swift/Objective-C 的交互能力

Kotlin/Native 提供了 [与 Swift 和 Objective-C 的交互能力](native-objc-interop.md).
你可以在 macOS 和 iOS 平台的 Swift/Objective-C 应用程序中直接使用 Kotlin 代码.

要了解更多详情, 请完成 [使用 Kotlin/Native 开发 Apple Framework](apple-framework.md) 教程.

## 在不同的平台上共享代码

Kotlin/Native 包含一组预构建的 [平台库](native-platform-libs.md), 能够帮助你在项目之间共用 Kotlin 代码.
POSIX, gzip, OpenGL, Metal, Foundation, 以及很多其它流行的库和 Apple 框架都已预先导入,
并作为 Kotlin/Native 库包含在编译器包中.

Kotlin/Native 是 [Kotlin Multiplatform](multiplatform-intro.md) 技术的一部分,
Kotlin Multiplatform 能够帮助你在多个不同的平台上共用代码, 包括 Android, iOS, JVM, Web, 以及原生平台.
跨平台库为共通的 Kotlin 代码提供了必要的 API, 帮助我们用 Kotlin 代码编写项目中共通的部分, 这些代码只需要编写一次.

## 内存管理器

Kotlin/Native 使用一个自动化的 [内存管理器](native-memory-manager.md), 与 JVM 和 Go 类似.
它有自己的追踪垃圾收集器, 并与 Swift/Objective-C 的 ARC 集成.

内存消耗由自定义的内存分配器控制. 它能够优化内存的使用量, 而且有助于防止突然的内存分配激增.
