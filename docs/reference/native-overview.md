---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin 原生(Native)程序开发"
---

# Kotlin/Native

[Kotlin/Native](https://github.com/JetBrains/kotlin-native/) 是一种 Kotlin 代码编译技术, 可以将 Kotlin 代码编译为原生二进制代码(native binary), 脱离 VM 运行.
它包含一个基于 LLVM 的后端, 用于编译 Kotlin 源代码, 以及一个原生代码实现的 Kotlin 运行库.
Kotlin/Native 的主要设计目的是, 用来编译 Kotlin 代码, 使其能够运行在那些不应该使用虚拟机, 或无法使用虚拟机的平台上 (比如 iOS, 以及嵌入式平台),
或者帮助开发者生成大小合理的, 不依赖于额外运行库的独立程序.

Kotlin/Native 完全支持与原生代码的互操作性. 对于依赖于平台的库, 对应的互操作库直接可用.
对于其他库, 我们提供了一个从 C 头文件[生成互操作库的工具](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md), 完全支持所有的 C 语言特性.
在 macOS 和 iOS 上, 也支持与 Objective-C 代码的互操作.

Kotlin/Native 目前还在开发阶段; 你可以试用预览版. 针对 [CLion](https://www.jetbrains.com/clion/) 和 [AppCode](https://www.jetbrains.com/objc/) IDE 都提供了插件来支持 Kotlin/Native 开发, 在这两种 IDE 中, 都需要通过菜单 *Plugins -> Install JetBrains plugin...* 来安装相应的插件.

### 目标平台

Kotlin/Native 目前支持以下平台:

   * Windows (目前只支持 x86_64)
   * Linux (x86_64, arm32, MIPS, MIPS 小尾序(little endian))
   * MacOS (x86_64)
   * iOS (arm32 和 arm64)
   * Android (arm32 和 arm64)
   * WebAssembly (只支持 wasm32)

### 示例项目

我们编写了一些示例项目, 演示 Kotlin/Native 的各种功能:

 * [Kotlin/Native GitHub 代码仓库](https://github.com/JetBrains/kotlin-native/tree/master/samples) 中包含一些示例项目;
 * [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner) 是一个简单的跨平台移动端多用户游戏, 完全使用 Kotlin/Native 编写, 包含以下部分:
     - 后端, 使用 SQLite 存储数据, 并提供 REST/JSON API;
     - iOS 和 Android 上的客户端, 使用 OpenGL;
     - 使用 WebAssembly 创建的浏览器前端, 用来查看游戏得分.
 * [KotlinConf app](https://github.com/JetBrains/kotlinconf-app/tree/master/ios) 是一个 iOS 应用程序, 使用 UIKit 构建 UI, 演示 Kotlin/Native 与 Objective-C 代码的互操作功能.
