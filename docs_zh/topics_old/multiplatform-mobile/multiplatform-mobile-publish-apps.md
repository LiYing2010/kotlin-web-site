[//]: # (title: 发布你的应用程序)

最终更新: %latestDocDate%

当你的移动应用程序准备好之后, 现在可以将它们发布到应用程序商店, 交给用户使用了.
对各个平台存在很多应用程序商店. 但是, 本文我们只介绍官方商店:
[Google Play Store](https://play.google.com/store) 和 [Apple App Store](https://www.apple.com/ios/app-store/).
你将会学习如何准备 Kotlin Multiplatform Mobile 应用程序的发布工作, 我们会集中介绍需要特别注意的部分.

## Android 应用程序

由于 [Kotlin 是 Android 开发的主要语言](https://developer.android.com/kotlin),
Kotlin Multiplatform Mobile 对编译项目和构建 Android 应用程序没有明显的影响.
由共用模块产生的 Android 库, 以及 Android 应用程序本身, 二者都是通常的 Android Gradle 模块; 它们与其他 Android 库和应用程序没有区别.
因此, 发布 Kotlin Multiplatform 项目开发的 Android 应用程序,
与 [Android 开发者文档](https://developer.android.com/studio/publish) 中描述的通常发布过程没有区别.

## iOS 应用程序

Kotlin Multiplatform 项目开发的 iOS 应用程序由通常的 Xcode 项目来构建, 发布中涉及的因此主要阶段与
[iOS 开发者文档](https://developer.apple.com/ios/submit/) 描述的相同.

Kotlin Multiplatform 项目特有的部分是, 将共用的 Kotlin 模块编译为框架(Framework), 以及链接到 Xcode 项目.
通常来说, 共用模块与 Xcode 项目之间的所有的集成会由
[Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)
自动完成.
但是, 如果你没有使用这个 plugin, 在 Xcode 中构建和捆绑(bundle) iOS 项目时, 请记住以下几点:

* 共用 Kotlin 库编译为原生的框架(Framework).
* 你需要将为特定平台编译的框架连接到 iOS 应用程序项目.
* 在 Xcode 项目设定中, 为构建系统指定框架的查找路径.
* 构建项目之后, 你应该启动并测试应用程序, 确保在运行期使用框架不存在问题.

有 2 中方式 你可以将共用的 Kotlin 模块连接到 iOS 项目:
* 使用 [Kotlin/Native CocoaPods plugin](../native/native-cocoapods.html), 它可以允许你在 iOS 项目中, 将一个含原生编译目标的跨平台项目用作 CocoaPods 依赖项.
* 手动配置你的跨平台项目, 创建 iOS 框架和 Xcode 项目, 取得它的最新版本.
  Kotlin Multiplatform Mobile plugin for Android Studio 通常会进行这个配置.
  要自己实现, 请 [理解项目结构](multiplatform-mobile-understand-project-structure.html#ios-application).

### 符号化(Symbolicate) 崩溃报告(Crash Report)

为了帮助开发者改进他们的应用程序, iOS 提供一种手段来分析应用程序的崩溃. 为了更详细的崩溃分析,
它使用特殊的调试符号 (`.dSYM`) 文件, 将崩溃报告(Crash Report) 中的内存地址匹配到源代码中的位置, 比如函数和行号.

默认情况下, 从共用的 Kotlin 模块产生的 iOS 框架的发布版本, 有一个伴随的 `.dSYM` 文件.
它可以帮助你分析在共用模块代码中发生的崩溃.

当 iOS 应用程序从字节码重新构建时, 它的 `dSYM` 文件会变得无效. 对于这种情况, 你可以将共用模块编译为静态的框架, 它会将调试信息保存在自身内部.
关于如何为从 Kotlin 模块产生的二进制文件设置崩溃报告的符号化, 请参见 [Kotlin/Native 文档](../native/native-ios-symbolication.html).
