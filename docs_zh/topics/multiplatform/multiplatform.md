[//]: # (title: Kotlin Multiplatform)
[//]: # (description: Kotlin Multiplatform 可以创建跨平台应用程序, 运行在桌面, Web, 以及移动设备上在共用应用程序逻辑的同时, 还能保持原生应用程序的用户体验.)

Kotlin Multiplatform 技术的设计目的是为了简化跨平台项目的开发工作.
它可以减少对 [不同的平台](#kotlin-multiplatform-use-cases) 编写和维护重复代码所耗费的时间,
同时又保持了原生程序开发的灵活性和其他益处.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## Kotlin Multiplatform 使用场景 {id="kotlin-multiplatform-use-cases"}

### Android 和 iOS 应用程序

在不同的移动平台上共用代码, 是 Kotlin 跨平台项目的一个主要使用场景,
通过 Kotlin Multiplatform, 你可以创建跨平台的移动应用程序,
在 Android 和 iOS 项目中共用代码, 实现网络连接, 数据存储, 数据验证, 分析, 计算, 以及其它应用程序逻辑.

请参见 [Kotlin Multiplatform 入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html) 文档,
以及 [使用 Ktor 和 SQLDelight 创建跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) 教程,
在这个教程中你将创建运行于 Android 和 iOS 的应用程序, 其中包括对这两个平台共用代码的模块.

通过使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/),
JetBrains 开发的、基于 Kotlin 的声明式 UI 框架,
你也可以在 Android 和 iOS 平台共用 UI, 创建完全跨平台的应用程序:

![共用不同的模块层和 UI](multiplatform-compose.svg){width=600}

请参见 [Compose Multiplatform 入门](https://github.com/JetBrains/compose-multiplatform-ios-android-template/#readme) 教程,
创建你自己的、在 Android 和 iOS 平台共用 UI 的移动应用程序.

### 跨平台库

Kotlin Multiplatform 也可以帮助库的开发者. 你可以为 JVM, Web, 和 Native 平台创建一个跨平台的库, 其中包含共通代码, 以及各个平台相关的实现.
发布之后, 跨平台的库可以作为依赖项, 在其他跨平台项目中使用.

详情请参见 [发布跨平台库](multiplatform-publish-lib.md).

### 桌面应用程序

Compose Multiplatform 还可以在不同的桌面平台共用 UI, 例如 Windows, macOS, 以及 Linux.
很多应用程序,
包括 [JetBrains Toolbox app](https://blog.jetbrains.com/kotlin/2021/12/compose-multiplatform-toolbox-case-study/),
已经采用了这样的方案.

请试用这个 [Compose Multiplatform 桌面应用程序](https://github.com/JetBrains/compose-multiplatform-desktop-template#readme)
模板, 来创建你自己的、在不同的桌面平台共用 UI 的项目.

## 在不同平台间共用代码 {id="code-sharing-between-platforms"}

通过 Kotlin Multiplatform, 你可以对 [不同的平台](multiplatform-dsl-reference.md#targets) 维护单一的应用程序逻辑代码库.
你还可以获得原生程序开发的利益, 包括优秀的性能, 以及对平台 SDK 的完全访问能力.

Kotlin 提供了以下代码共用机制:

* 在你的项目中使用的 [所有平台](multiplatform-share-on-platforms.md#share-code-on-all-platforms) 共用代码.
* 在你的项目中使用的 [一部分平台](multiplatform-share-on-platforms.md#share-code-on-similar-platforms) 共用代码, 这样可以在类似的平台上共用大量代码:

    ![在不同的平台共用代码](kotlin-multiplatform-hierarchical-structure.svg){width=700}

* 如果需要在共用代码中访问平台相关的 API, 可以使用 Kotlin [预期声明与实际声明(expected and actual declaration)](multiplatform-expect-actual.md) 机制.

## 入门学习

* 如果你想要使用共通代码创建 iOS 和 Android 应用程序, 请参见 [Kotlin Multiplatform 入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)
* 如果你想要针对其他平台创建应用程序或库, 请参见 [共用代码的原则与示例](multiplatform-share-on-platforms.md)

> 如果你是 Kotlin 新手, 请先阅读 [Kotlin 入门](getting-started.md)
>
{style="tip"}

### 示例项目

请参见 [跨平台应用程序示例](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html),
来理解 Kotlin Multiplatform 的工作方式.
