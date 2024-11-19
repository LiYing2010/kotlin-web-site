[//]: # (title: 与 iOS 集成的方法)

你可以将一个 Kotlin Multiplatform 共用模块集成到你的 iOS App.
要做到这一点, 你要从共用模块生成一个 [iOS 框架](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/Concepts/WhatAreFrameworks.html),
然后将它添加为 iOS 项目的依赖项:

![iOS 集成方案](ios-integration-scheme.svg)

这个框架可以作为本地依赖项或远程依赖项使用.
如果你想要完全控制整个代码库, 并且在共通代码发生变更时立即更新最终应用程序, 请选择本地集成(Local Integration).

如果你想要明确的 分隔你的最终应用程序代码库和共通代码库, 请设置远程集成(Remote Integration).
这种情况下, 共用的代码会和一个通常的第三方依赖项一样, 集成进入最终应用程序.

## 本地集成(Local Integration)

在本地设置中, 有两种主要的集成选择. 你可以使用直接集成, 通过一段特别的脚本, 让 Kotlin 构建成为 iOS 构建的一部分.
如果在你的 Kotlin Multiplatform 项目中有 Pod 依赖项, 请使用 CocoaPods 集成方案.

### 直接集成(Direct Integration)

你可以向你的 Xcode 项目添加一段特别的脚本, 直接连接来自 Kotlin Multiplatform 项目的iOS 框架.
这段脚本会集成到你的项目的构建设置的构建阶段中.

如果在你的 Kotlin Multiplatform 项目中 **没有** 导入 CocoaPods 依赖项, 那么可以使用这种集成方法.

如果你在 Android Studio 中创建项目, 请选择 **Regular framework** 选项, 可以自动生成这个设置.
如果你使用 [Kotlin Multiplatform Web 向导](https://kmp.jetbrains.com/), 默认会使用直接集成.

更多详情请参见 [直接集成](multiplatform-direct-integration.md).

### 使用本地 podspec 的 CocoaPods 集成

你可以通过 [CocoaPods](https://cocoapods.org/) 连接来自 Kotlin Multiplatform 项目的 iOS 框架,
CocoaPods 是一个用于 Swift 和 Objective-C 项目的常用的依赖项管理器.

对于以下情况, 可以使用这种集成方法:

* 你有一个使用 CocoaPods 的 iOS 项目单一代码仓库设置
* 在你的 Kotlin Multiplatform 项目中导入了 CocoaPods 依赖项

要设置使用本地 CocoaPods 依赖项的工作流, 你可以手动编辑脚本, 或者也可以使用 Android Studio 中的向导生成项目.

更多详情请参见 [CocoaPods 概述与设置](native-cocoapods.md).

## 远程集成(Remote Integration)

对于远程集成, 你的项目可以使用 Swift 包管理器 (Swift Package Manager, SPM), 或者使用 CocoaPods 依赖项管理器,
来连接来自 Kotlin Multiplatform 项目的 iOS 框架.

### 使用 XCFrameworks 的 Swift 包管理器

你可以使用 XCFrameworks 设置 Swift 包管理器管理器 (Swift Package Manager, SPM) 依赖项,
来连接来自 Kotlin Multiplatform 项目的 iOS 框架.

更多详情请参见 [Swift 包导出的设置](native-spm.md).

### 使用 XCFrameworks 的 CocoaPods 集成

你可以使用 Kotlin CocoaPods Gradle plugin 构建 XCFrameworks, 然后将你的项目的共用的部分与移动 App 分离, 通过 CocoaPods 单独发布.

更多详情请参见 [构建最终的原生二进制文件](multiplatform-build-native-binaries.md#build-frameworks).
