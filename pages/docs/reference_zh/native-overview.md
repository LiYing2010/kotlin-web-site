---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin 原生(Native)程序开发"
---

# **使用Kotlin/Native 进行原生(Native)程序开发**

![编译器图]({{ url_for('asset', path='images/landing/native/native_overview.png')}})

Kotlin/Native 是一种代码编译技术, 可以将 Kotlin 代码编译为原生二进制代码(native binary), 脱离 VM 运行.
它包含一个基于 [LLVM](https://llvm.org/ 的后端, 用于编译 Kotlin 源代码, 以及一个原生代码实现的 Kotlin 运行库.

## 为什么要使用 Kotlin/Native?

Kotlin/Native 的主要设计目的是, 用来编译 Kotlin 代码, 使其能够运行在那些不应该使用 *虚拟机* , 或无法使用 *虚拟机* 的平台上, 比如嵌入式设备, 或 iOS.
它可以帮助开发者生成完整独立的, 不依赖于额外运行库和虚拟机的独立程序.

## 目标平台

Kotlin/Native 支持以下平台:
   * iOS (arm32, arm64, 以及 x86_64 上的模拟器平台)
   * macOS (x86_64)
   * watchOS (arm32, arm64, x86)
   * tvOS (arm64, x86_64)
   * Android (arm32, arm64, x86, x86_64)
   * Windows (mingw x86_64, x86)
   * Linux (x86_64, arm32, arm64, MIPS, MIPS 小尾序(little endian))
   * WebAssembly (wasm32)


## 互操作性

Kotlin/Native 支持与原生代码的双向互操作.
一方面, 编译器会创建:
- 各种 [平台](#target-platforms) 的可执行文件
- 静态库, 或 [动态](/docs/tutorials/native/dynamic-libraries.html) 库, 以及供 C/C++ 项目使用的 C 头文件
- 供 Swift 和 Objective-C 项目使用的 [Apple 框架](/docs/tutorials/native/apple-framework.html)

另一方面, Kotlin/Native 也支持在 Kotlin/Native 源代码中直接使用既有的库:
- 静态或动态的 [C 库](native/c_interop.html)
- C, [Swift 和 Objective-C](native/objc_interop.html) 框架

在既有的 C, C++, Swift, Objective-C 和其他语言的项目中, 可以很容易地包含编译后的 Kotlin 代码.
在 Kotlin/Native 代码中, 也可以很容易地直接使用既有的原生代码, 静态或动态的 [C 库](native/c_interop.html), Swift/Objective-C [框架](native/objc_interop.html), 图形引擎, 以及其他任何东西.

Kotlin/Native 的 [库](native/platform_libs.html) 可以帮助你在多个项目中共享 Kotlin 代码.
POSIX, gzip, OpenGL, Metal, Foundation, 以及其他许多流行的库和 Apple 框架, 都已预先导入为 Kotlin/Native 库形式, 包含在编译器的包中了.

## 在不同的平台上共享代码

通过不同的 Kotlin 和 Kotlin/Native 编译目标, 我们支持 [跨平台项目](multiplatform.html).
这是一种在各种平台上共享 Kotlin 源代码的方式, 包括 Android, iOS, 服务器端, JVM, 客户端, JavaScript, CSS, 以及原生平台.

[跨平台库](multiplatform.html#multiplatform-libraries) 为共通的 Kotlin 代码提供了必要的 API, 帮助我们以 Kotlin 代码的方式编写项目中共通的部分, 这些代码只需要编写一次, 然后就可以在所有的目标平台上共用.

## 如何开始

<div style="display: flex; align-items: center; margin-bottom: 20px">
    <img src="{{ url_for('asset', path='images/landing/native/book.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>教程和文档</b>
</div>

如果你是 Kotlin 新手, 请先阅读 [入门](basic-syntax.html).

推荐的文档:
- [与 C 代码交互](native/c_interop.html)
- [与 Swift/Objective-C 代码交互](native/objc_interop.html)

推荐的教程:
- [Hello Kotlin/Native](/docs/tutorials/native/using-command-line-compiler.html)
- [跨平台项目: iOS 与 Android](/docs/tutorials/native/mpp-ios-android.html)
- [C 与 Kotlin/Native 之间的类型映射](/docs/tutorials/native/mapping-primitive-data-types-from-c.html)
- [使用 Kotlin/Native 开发动态链接库](/docs/tutorials/native/dynamic-libraries.html)
- [使用 Kotlin/Native 开发 Apple 框架](/docs/tutorials/native/apple-framework.html)

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="{{ url_for('asset', path='images/landing/native/try.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>示例项目</b>
</div>

- [Kotlin/Native 源代码与示例](https://github.com/JetBrains/kotlin-native/tree/master/samples)
- [KotlinConf App](https://github.com/JetBrains/kotlinconf-app)
- [KotlinConf Spinner App](https://github.com/jetbrains/kotlinconf-spinner)
- [Kotlin/Native 源代码与示例 (.tgz)](https://download.jetbrains.com/kotlin/native/kotlin-native-samples-1.0.1.tar.gz)
- [Kotlin/Native 源代码与示例 (.zip)](https://download.jetbrains.com/kotlin/native/kotlin-native-samples-1.0.1.zip)

更多示例请参见 [GitHub](https://github.com/JetBrains/kotlin-examples).
