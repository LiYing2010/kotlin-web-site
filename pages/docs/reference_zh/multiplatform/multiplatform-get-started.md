---
type: doc
layout: reference
category: "Other"
title: "Kotlin 跨平台程序开发入门"
---

# Kotlin Multiplatform 入门
[//]: # (description: Learn how to create your first Kotlin cross-platform app or library benefiting from Kotlin Multiplatform.)

最终更新: {{ site.data.releases.latestDocDate }}

> Kotlin Multiplatform 处于 [Beta](../components-stability.html) 阶段.
> 已经基本稳定, 但将来可能会需要手工迁移你的代码. 我们会尽力减少你需要修改的代码量.
{:.note}

支持跨平台程序开发是 Kotlin 的关键益处之一.
它可以减少对 [不同的平台](multiplatform-dsl-reference.html#targets) 编写和维护相同的代码从头开始, 
同时又保持原生程序开发的灵活性和益处.

详情请参见 [Kotlin Multiplatform 的优点](multiplatform.html).

## 从头开始

* [创建并发布一个跨平台库](multiplatform-library.html)
  这个教程讲授如何创建一个跨平台库, 用于 JVM, JS, 以及 Native 平台, 这个库可以被任何其他共同代码使用(比如, 在 Android 和 iOS 平台共用).
  它还演示如何编写测试并在所有平台上运行, 以及如何使用由特定平台提供的高效实现.

* [使用 Kotlin Multiplatform 构建一个全栈 Web 应用程序](multiplatform-full-stack-app.html)
  这个教程创建一个 Client-Server 应用程序, 其中用到共用代码, 序列化, 以及其他各种跨平台开发的范例.
  通过这个例子, 在创建针对 Kotlin/JVM 和 Kotlin/JS 目标平台的应用程序的过程中, 讲授背后的概念.
  还简要介绍了如何将 Ktor 同时用作服务器端框架和客户端框架.

* [创建你的第一个 Kotlin 跨平台移动应用程序](../multiplatform-mobile/multiplatform-mobile-create-first-app.html)
  演示如何使用 [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)
  创建一个移动应用程序, 可以同时工作在 Android 和 iOS 平台.
  学习创建, 运行, 并测试你的第一个跨平台移动应用程序.

## 深入 Kotlin Multiplatform

当你获得 Kotlin Multiplatform 的一些经验, 并且想要知道如何解决特定的跨平台开发任务:

* 在你的 Kotlin 跨平台项目中 [在不同平台间共用代码](multiplatform-share-on-platforms.html).

* 使用 Kotlin 的预期声明与实际声明机制 [连接到平台相关的 API](multiplatform-connect-to-apis.html).

* 为你的 Kotlin 跨平台项目 [手动设置编译目标](multiplatform-set-up-targets.html).

* 对标准库, 测试库, 或其他 kotlinx 库 [添加依赖项](multiplatform-add-dependencies.html).

* 在你的项目中为产品和测试目的 [配置编译任务](multiplatform-configure-compilations.html).

* 为 JVM, JavaScript, Android, Linux, Windows, macOS, iOS, watchOS, 以及 tvOS 模拟器 [运行测试](multiplatform-run-tests.html).

* 向 Maven 仓库 [发布跨平台库](multiplatform-publish-lib.html).

* [构建原生二进制文件](multiplatform-build-native-binaries.html) 生成可执行文件或共用库, 比如通用框架(Universal Framework)或 XCFramework.

## 如何获取帮助

* **Kotlin Slack**: [获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道
* **StackOverflow**: 订阅 ["kotlin-multiplatform" 标签](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* **Kotlin issue tracker**: [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)
