---
type: doc
layout: reference
category: "Introduction"
title: "在 Android 开发中使用 Kotlin"
---

# 使用 Kotlin 进行 Android 开发

Kotlin 非常适合于开发 Android 应用程序, 它可以将一种现代化语言的所有优势带入 Android 平台, 同时又没有引入任何新的限制:

  * **兼容性**: Kotlin 完全兼容于 JDK 6, 因此可以保证 Kotlin 应用程序能够在较旧的 Android 设备上运行, 不会产生问题. Android Studio 完全支持各种 Kotlin 开发工具, 并且兼容于 Android 构建系统.
  * **性能**: 由于编译产生的字节码结构非常类似, 因此Kotlin 应用程序可以达到等价的 Java 程序同样的运行速度. 由于 Kotlin 对内联函数(inline function)的支持, 使用 lambda 表达式的代码通常可以比等价的 Java 代码运行得更快.
  * **互操作性**: Kotlin 100% 支持与 Java 的互操作, 因此在 Kotlin 应用程序中可以使用既有的 Android 库. 这种支持也包括注解处理(annotation processing), 因此数据绑定, Dagger 都可以正常工作.
  * **大小(Footprint)**: Kotlin 的运行库非常紧凑, 而且还可以通过使用 ProGuard 来进一步缩减. 在一个 [真实的应用程序](https://blog.gouline.net/kotlin-production-tales-62b56057dc8a)中, Kotlin 运行库仅仅增加了几百个方法, 以及不到 100K 的 .apk 文件大小.
  * **编译时间**: Kotlin 支持高效率的增量编译(incremental compilation), 因此, 虽然对于全新的编译(clean build)会存在一些额外的开销, 但[增量编译通常与 Java 同样快, 甚至更快](https://medium.com/keepsafe-engineering/kotlin-vs-java-compilation-speed-e6c174b39b5d).
  * **学习曲线**: 对于 Java 开发者, Kotlin 是非常易于学习的. Kotlin 插件中包含了 Java 代码到 Kotlin 代码的自动转换器, 可以帮助你完成最初的工作. [Kotlin Koans](/docs/tutorials/koans.html) 中有一系列的交互式练习题, 可以指导你学习 Kotlin 语言的关键特性.

## 使用 Kotlin 进行 Android 开发的案例研究

已有许多大公司成功地采用了 Kotlin, 其中一些公司分享了他们的经验:

  * Pinterest 成功地 [将 Kotlin 引入到他们的应用程序中](https://www.youtube.com/watch?v=mDpnc45WwlI), 每月有 1.5 亿用户使用这些应用程序.
  * Basecamp 的 Android 应用程序 [100% 使用 Kotlin 编写](https://m.signalvnoise.com/how-we-made-basecamp-3s-android-app-100-kotlin-35e4e1c0ef12), 他们报告说程序员们更加快乐, 并且产品质量和开发速度都有了巨大的改善.
  * Keepsafe 的 App Lock 应用程序也 [100% 转换为 Kotlin](https://medium.com/keepsafe-engineering/lessons-from-converting-an-app-to-100-kotlin-68984a05dcb6), 代码行数减少了 30%, 方法数量减少了 10%.

## Android 开发的相关工具

除 Kotlin 语言本身的特性之外, Kotlin 开发团队还提供了一系列用于 Android 的开发工具:

 * [Kotlin Android Extensions](/docs/tutorials/android-plugin.html) 是一个编译器扩展, 可以帮助你消除 `findViewById()` 调用, 替换为编译器生成的伪属性.
 * [Anko](http://github.com/kotlin/anko) 是一个库, 针对 Android API 提供了一系列便于 Kotlin 使用的包装函数, 还提供了一种 DSL, 可以帮助你将 .xml 布局文件替换为 Kotlin 代码.

## 下一步

* 下载并安装 [Android Studio 3.0 预览版](https://developer.android.com/studio/preview/index.html), 其中已包含了对 Kotlin 的支持.
* 学习 [Android 与 Kotlin 入门](/docs/tutorials/kotlin-android.html) 教程, 创建你的第一个 Kotlin 应用程序.
* 关于对 Kotlin 语言的更加深入介绍, 请参加本站的 [参考文档](index.html), 以及 [Kotlin Koans](/docs/tutorials/koans.html).
* 还有一个很好的学习资源是 [针对 Android 开发者的 Kotlin 教程](https://leanpub.com/kotlin-for-android-developers), 这本书会一步步地指导你使用 Kotlin 创建一个真实的 Android 应用程序.
* 查看 Google 的 [使用 Kotlin 编写的示例工程](https://developer.android.com/samples/index.html?language=kotlin).
