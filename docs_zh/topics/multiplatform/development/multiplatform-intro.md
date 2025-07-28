[//]: # (title: Kotlin Multiplatform 简介)

支持跨平台程序开发是 Kotlin 的关键益处之一.
它可以减少对 [不同的平台](multiplatform-dsl-reference.md#targets) 编写和维护相同的代码从头开始,
同时又保持原生程序开发的灵活性和益处.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## 学习关键概念 {id="learn-key-concepts"}

通过 Kotlin Multiplatform, 你可以在不同的平台之间共用代码, 无论这些平台是 Mobile, Web, 还是 Desktop.
代码编译所针对的平台, 通过 _编译目标_ 的列表来定义.

每个编译目标都有对应的 *源代码集(Source Set)*, 源代码集表示一组源代码文件, 带有自己的依赖项和编译器选项.
平台相关的源代码集, 例如用于 JVM 平台的 `jvmMain`, 可以使用平台相关的库和 API.

要在一组编译目标之间共用代码, 可以使用中间源代码集. 例如, `appleMain` 源代码集表示对所有 Apple 平台共用的代码.
对所有平台共用, 并编译到所有声明的编译目标的代码, 有它自己的源代码集, `commonMain`.
它不能使用平台相关的 API, 但可以利用跨平台的库.

在对一个特定的编译目标进行编译时, Kotlin 会组合共通源代码集, 相关的中间源代码集, 以及编译目标相关的源代码集.

关于这个问题, 更多详情请参见:

* [Kotlin Multiplatform 项目结构的基础知识](multiplatform-discover-project.md)
* [跨平台项目结构的高级概念](multiplatform-advanced-project-structure.md)

## 使用代码共用机制 {id="use-code-sharing-mechanisms"}

有时对一组类似的编译目标共用代码会更加便利. Kotlin Multiplatform 提供了一种方式, 使用 *默认的层级结构模板* 来简化这种共用代码的创建工作.
默认层级模板包含一组预定义的中间源代码集, 这些中间源代码集根据你的项目中指定的编译目标创建.

要在共用的代码中访问平台相关的 API, 你可以使用另一种 Kotlin 机制, *预期声明与实际声明*.
通过这种方式, 你可以在共通代码中声明你 `expect` 一个平台相关的 API, 但对每个编译目标平台, 提供一个单独的 `actual` 实现.
你可以对不同的 Kotlin 概念使用这种机制, 包括函数, 类, 以及接口.
例如, 你可以在共通代码中定义一个函数, 但在一个对应的源代码集中使用平台相关的库提供它的实现.

关于这个问题, 更多详情请参见:

* [在不同的平台之间共用代码](multiplatform-share-on-platforms.md)
* [预期声明与实际声明](multiplatform-expect-actual.md)
* [层级项目结构](multiplatform-hierarchy.md)

## 添加依赖项 {id="add-dependencies"}

一个 Kotlin Multiplatform 项目可以依赖外部的库和其他跨平台项目.
对于共通代码, 你可以在共通源代码集中添加对跨平台库的依赖项. 对其他源代码集, Kotlin 会自动解析并添加适当的平台相关的部分.
如果只要求平台相关的 API, 请在对应的源代码集添加依赖项.

对 Kotlin Multiplatform 项目添加 Android 相关的依赖项, 与向纯 Android 项目添加依赖项是类似的.
在使用 iOS 相关的依赖项时, 你可以无缝的集成 Apple SDK 框架, 不需要额外的配置工作.
对于外部的库和框架, Kotlin 提供了与 Objective-C 和 Swift 的交互能力.

关于这个问题, 更多详情请参见:

* [添加跨平台库依赖项](multiplatform-add-dependencies.md)
* [添加 Android 库依赖项](multiplatform-android-dependencies.md)
* [添加 iOS 库依赖项](multiplatform-ios-dependencies.md)

## 设置与 iOS 的集成 {id="set-up-integration-with-ios"}

如果你的跨平台项目的目标平台是 iOS, 你可以设置 Kotlin Multiplatform 共用模块与你的 iOS App 之间的集成.

为了这个目的, 你需要生成一个 iOS 框架, 然后将它添加为 iOS 项目的一个本地(Local)或远程(Remote)的依赖项:

* **本地(Local)集成**:
  使用一段特别的脚本, 直接连接你的跨平台项目和 Xcode 项目, 或对涉及本地 Pod 依赖项的设置, 使用 CocoaPods
  依赖项管理器.
* **远程(Remote)集成**: 使用 XCFrameworks 设置 SPM 依赖项, 或通过 CocoaPods 发布共用模块.

关于这个问题, 详情请参见 [与 iOS 集成的方法](multiplatform-ios-integration-overview.md).

## 配置编译任务 {id="configure-compilations"}

每个编译目标可以包含多个编译任务, 用于不同的目的, 通常用于产品或测试, 但你也可以定义自定义的编译任务.

通过 Kotlin Multiplatform, 你可以配置项目中所有的编译任务, 设置一个编译目标中特定的编译任务, 甚至创建单独的编译任务.
在配置编译任务时, 你可以修改编译器选项, 管理依赖项, 或配置与原生语言的交互.

关于这个问题, 更多详情请参见 [配置编译任务](multiplatform-configure-compilations.md).

## 构建最终的二进制文件 {id="build-final-binaries"}

默认情况下, 一个编译目标会被编译为一个 `.klib` artifact, 这个 artifact 可以被 Kotlin/Native 自身用作依赖项,
但不能执行, 也不能用作原生库.
但是, Kotlin Multiplatform 提供了额外的机制, 来构建最终的原生二进制文件.

你可以创建可执行的二进制文件, 共用库和静态库, 或 Objective-C 框架, 每个都可配置为不同的构建类型.
Kotlin 还提供了一种方法来构建通用 (fat) 框架和 XCFrameworks, 用于与 iOS 集成.

关于这个问题, 更多详情请参见 [构建原生二进制文件](multiplatform-build-native-binaries.md).

## 创建跨平台库 {id="create-multiplatform-libraries"}

你可以使用共通代码创建一个跨平台库, 以及它在 JVM, Web, 以及原生平台的平台相关实现.

要发布一个 Kotlin Multiplatform 库, 需要在你的 Gradle 构建脚本中进行相关的配置.
你可以使用一个 Maven 仓库和 `maven-publish` plugin 进行发布.
发布之后, 跨平台库就可以在其他跨平台项目中用作依赖项.

关于这个问题, 更多详情请参见 [发布跨平台的库](multiplatform-publish-lib-setup.md).

## 参考文档 {id="reference"}

* [Kotlin Multiplatform Gradle plugin 的 DSL 参考文档](multiplatform-dsl-reference.md)
* [Kotlin Multiplatform 兼容性指南](multiplatform-compatibility-guide.md)
