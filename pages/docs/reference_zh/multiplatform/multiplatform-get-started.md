---
type: doc
layout: reference
category: "Other"
title: "Kotlin 跨平台程序开发入门"
---

# Kotlin Multiplatform 入门
[//]: # (description: Learn how to create your first Kotlin cross-platform app or library benefiting from Kotlin Multiplatform.)

最终更新: {{ site.data.releases.latestDocDate }}

支持跨平台程序开发是 Kotlin 的关键益处之一.
它可以减少对 [不同的平台](multiplatform-dsl-reference.html#targets) 编写和维护相同的代码从头开始, 
同时又保持原生程序开发的灵活性和益处.

详情请参见 [Kotlin Multiplatform 的优点](multiplatform.html).

## 从头开始

* [Kotlin Multiplatform 入门教程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html).
  使用 [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)
  创建你的第一个跨平台应用程序, 可以同时工作在 Android 和 iOS 平台.
  学习如何创建, 运行跨平台移动应用程序, 以及添加依赖项.
* [在 iOS 和 Android 平台共用 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html).
  创建一个 Kotlin Multiplatform 应用程序, 使用 [Compose Multiplatform UI framework](https://www.jetbrains.com/lp/compose-multiplatform/)
  在 iOS, Android, 和 Desktop 平台间共用业务逻辑和 UI.

## 深入 Kotlin Multiplatform

当你获得 Kotlin Multiplatform 的一些经验, 并且想要知道如何解决特定的跨平台开发任务:

* 在你的 Kotlin 跨平台项目中 [在不同平台间共用代码](multiplatform-share-on-platforms.html).
* 在开发跨平台应用程序和库时 [连接到平台相关的 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html).
* 为你的 Kotlin 跨平台项目 [手动设置编译目标](multiplatform-set-up-targets.html).
* 对标准库, 测试库, 或其他 kotlinx 库 [添加依赖项](multiplatform-add-dependencies.html).
* 在你的项目中为产品和测试目的 [配置编译任务](multiplatform-configure-compilations.html).
* 向 Maven 仓库 [发布跨平台库](multiplatform-publish-lib.html).
* [构建原生二进制文件](multiplatform-build-native-binaries.html) 生成可执行文件或共用库, 比如通用框架(Universal Framework)或 XCFramework.

## 如何获取帮助

* **Kotlin Slack**: [获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道
* **StackOverflow**: 订阅 ["kotlin-multiplatform" 标签](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* **Kotlin issue tracker**: [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)
