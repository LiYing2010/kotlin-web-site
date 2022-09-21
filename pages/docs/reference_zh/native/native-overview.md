---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin 原生(Native)程序开发"
---

# 使用 Kotlin/Native 进行原生(Native)程序开发

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin/Native 是一种代码编译技术, 可以将 Kotlin 代码编译为原生二进制代码(native binary), 脱离 VM 运行.
它包含一个基于 [LLVM](https://llvm.org/) 的后端, 用于编译 Kotlin 源代码, 以及一个原生代码实现的 Kotlin 运行库.

## 为什么要使用 Kotlin/Native?

Kotlin/Native 的主要设计目的是, 用来编译 Kotlin 代码, 使其能够运行在那些不应该使用 _虚拟机_ , 或无法使用 _虚拟机_ 的平台上, 比如嵌入式设备, 或 iOS.
它适合用于帮助开发者生成完整独立的, 不依赖于额外运行库和虚拟机的独立程序.

## 目标平台

Kotlin/Native 支持以下平台:
* macOS
* iOS, tvOS, watchOS
* Linux
* Windows (MinGW)
* Android NDK

> 要编译到 Apple 平台的编译目标, macOS, iOS, tvOS, 和 watchOS, 你需要安装 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
> 以及它的命令行工具.
{:.note}

[支持的所有目标平台请参见此处](../multiplatform/multiplatform-dsl-reference.html#targets).


## 互操作性

Kotlin/Native 支持与各种操作系统的原生编程语言之间的双向互操作.
编译器会创建:
* 各种 [平台](#target-platforms) 的可执行文件
* 静态库, 或 [动态](native-dynamic-libraries.html) 库, 以及供 C/C++ 项目使用的 C 头文件
* 供 Swift 和 Objective-C 项目使用的 [Apple 框架](apple-framework.html)

Kotlin/Native 也支持在 Kotlin/Native 源代码中直接使用既有的库:
* 静态或动态的 [C 库](native-c-interop.html)
* C, [Swift 和 Objective-C](native-objc-interop.html) 框架

在既有的 C, C++, Swift, Objective-C 和其他语言的项目中, 可以很容易地包含编译后的 Kotlin 代码.
在 Kotlin/Native 代码中, 也可以很容易地直接使用既有的原生代码,
静态或动态的 [C 库](native-c-interop.html),
Swift/Objective-C [框架](native-objc-interop.html),
图形引擎, 以及其他任何东西.

Kotlin/Native 的 [库](native-platform-libs.html) 可以帮助你在多个项目中共享 Kotlin 代码.
POSIX, gzip, OpenGL, Metal, Foundation, 以及其他许多流行的库和 Apple 框架,
都已预先导入为 Kotlin/Native 库形式, 包含在编译器的包中了.

## 在不同的平台上共享代码

通过 [跨平台项目](../multiplatform/multiplatform.html), 可以在各种平台上共用 Kotlin 源代码,
包括 Android, iOS, JVM, JavaScript, 以及原生平台.
跨平台库为共通的 Kotlin 代码提供了必要的 API, 帮助我们用 Kotlin 代码编写项目中共通的部分,
这些代码只需要编写一次, 然后就可以在多个目标平台甚至所有的目标平台上共用.

你可以使用 [Kotlin 跨平台移动应用(Kotlin Multiplatform Mobile)](https://kotlinlang.org/lp/mobile/)
来创建跨平台移动应用, 代码可以在 Android 和 iOS 平台共用.

## 如何入门

### 教程与文档

如果你是 Kotlin 新手, 请先阅读 [Kotlin 入门](../getting-started.html).

推荐文档:

* [Kotlin 跨平台移动应用(Kotlin Multiplatform Mobile) 文档](../multiplatform-mobile/multiplatform-mobile-getting-started.html)
* [跨平台项目文档](../multiplatform/multiplatform-get-started.html)
* [与 C 代码交互](native-c-interop.html)
* [与 Swift/Objective-C 代码交互](native-objc-interop.html)

推荐教程:
* [Kotlin/Native 入门](native-get-started.html)
* [创建你的第一个跨平台移动应用程序](../multiplatform-mobile/multiplatform-mobile-create-first-app.html)
* [C 与 Kotlin/Native 之间的类型映射](mapping-primitive-data-types-from-c.html)
* [使用 Kotlin/Native 开发动态链接库](native-dynamic-libraries.html)
* [使用 Kotlin/Native 开发 Apple 框架](apple-framework.html)
