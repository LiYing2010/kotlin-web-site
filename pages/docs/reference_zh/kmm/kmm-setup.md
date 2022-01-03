---
type: doc
layout: reference
title: "KMM 开发环境设置"
---

# KMM 开发环境设置

本页面最终更新: 2022/04/06

在你开始 [创建你的第一个能够同时在 iOS 和 Android 运行的应用程序](kmm-create-first-app.html) 之前,
首先需要设置 Kotlin Multiplatform Mobile (KMM) 的开发环境:

1. 如果你要使用共通代码或 Android 专有代码, 你可以使用 [Android Studio](https://developer.android.com/studio) 支持的操作系统的任何计算机.  
   如果你还想要编写 iOS 专有代码, 并在模拟设备或真实设备上运行 iOS 应用程序, 请使用运行 macOS 操作系统的 Mac 计算机.
   这些步骤不能在其他操作系统上进行, 比如 Microsoft Windows. 这是 Apple 的限制.
2. 安装 [Android Studio](https://developer.android.com/studio) 4.2 或 2020.3.1 Canary 8 或更高版本.   
   你将会使用 Android Studio 来创建你的跨平台应用程序, 以及在模拟设备或真实设备上运行运行这些应用程序.
3. 如果你需要编写 iOS 专有代码, 并运行 iOS 应用程序, 请安装 [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
   –  11.3 或更高版本.                                                                                                                                                                                                                                                                                                                           
   大多数情况下, Xcode 会在后台工作. 你将会使用它在你的 iOS 应用程序中添加 Swift 或 Objective-C 代码.
4. 请确认你安装了 [兼容的 Kotlin plugin](kmm-plugin-releases.html#release-details).
   在 Android Studio 中, 选择菜单 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates**,
   检查当前的 Kotlin plugin 版本. 如果需要, 更新到 **Stable** 更新频道中的最新版本.
5. 安装 *Kotlin Multiplatform Mobile* plugin.
   在 Android Studio 中, 选择菜单 **Preferences** | **Plugins**, 在 **Marketplace** 中搜索 *Kotlin Multiplatform Mobile* plugin, 并安装它.

    <img src="/assets/docs/images/kmm/mobile-multiplatform-plugin.png" alt="Kotlin Multiplatform Mobile plugin" width="500"/>

    参见 [KMM plugin 发布公告](kmm-plugin-releases.html).

6. 如果没有安装 [JDK](https://www.oracle.com/java/technologies/javase-downloads.html), 请安装它.  
   要检查是否已安装 JDK, 请在命令行执行命令 `java -version`.       

好了, 现在可以 [创建你的第一个 KMM 应用程序](kmm-create-first-app.html) 了.
