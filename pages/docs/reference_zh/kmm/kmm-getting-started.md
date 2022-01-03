---
type: doc
layout: reference
title: "Kotlin Multiplatform Mobile (KMM) 入门"
---

# Kotlin Multiplatform Mobile (KMM) 入门
[//]: # (description: 使用 Kotlin Multiplatform Mobile 简化跨平台应用程序的开发. 为你的 iOS 和 Android 应用程序的业务逻辑创建单一的代码库.)

本页面最终更新: 2022/04/06

> Kotlin Multiplatform Mobile 目前是 [Alpha 版](../components-stability.html). 在未来的 Kotlin 版本中, 语言特性和工具都可能发生变化.
> 
> 预计 2022 年春季发布 Beta 版. 关于即将发布的新功能, 请参见 [Kotlin Multiplatform Mobile Beta 版开发路线图演讲视频](https://blog.jetbrains.com/kotlin/2021/10/kmm-beta-roadmap-video-highlights/).
> 也可以参见 [各公司](https://kotlinlang.org/lp/mobile/case-studies/) 如何使用 Kotlin 进行跨平台应用程序开发.
{:.note}

Kotlin Multiplatform Mobile (KMM) 是一组 SDK, 用于简化跨平台移动应用程序的开发.
你可以在 iOS 和 Android 应用程序之间共用共通的代码, 只在需要的时候编写平台相关的代码.
比如, 实现原生的 UI, 或者使用平台相关的 API.

请查看 [介绍视频](https://www.youtube.com/watch?v=mdN6P6RI__k), 这个视频中 Kotlin 产品市场经理 Ekaterina Petrova 
解释了 Kotlin Multiplatform Mobile 是什么, 以及在你的项目中如何使用.
和 Ekaterina 一起, 你将会设置开发环境, 准备好创建你的第一个跨平台移动应用程序:

<iframe width="560" height="360" src="https://www.youtube.com/embed/mdN6P6RI__k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

也可以在 YouTube 上观看关于 [Kotlin Multiplatform Multiverse](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) 的其他视频.

## 支持的平台

* Android 应用程序和库
* [Android NDK](https://developer.android.com/ndk) (ARM64 和 ARM32)
* Apple iOS 设备 (ARM64 和 ARM32) 以及模拟器
* Apple watchOS 设备 (ARM64 和 ARM32) 以及模拟器

[Kotlin 跨平台](../mpp/multiplatform.html) 技术还支持 [其他平台](../mpp/mpp-supported-platforms.html),
包括 JavaScript, Linux, Windows, 以及 WebAssembly.

## 从头开始

* [为跨平台移动应用程序设置开发环境](kmm-setup.html)
* [使用 IDE 创建你的第一个能同时在 Android 和 iOS 工作的应用程序](kmm-create-first-app.html)
* [示例项目列表](kmm-samples.html)
* [向你的开发团队介绍跨平台移动应用程序开发](kmm-introduce-your-team.html)

## 让你的 Android 应用程序能在 iOS 上运行

如果你已经有了一个 Android 移动应用程序, 并且希望让它成为跨平台程序, 以下是一些能够帮助你入门的参考资料:

* [为跨平台移动应用程序设置开发环境](kmm-setup.html)
* [让一个 Android 示例应用程序能够在 iOS 上工作](kmm-integrate-in-existing-app.html)

## 如何得到帮助

* **Kotlin Slack**: 首先得到 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up), 然后加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道
* **StackOverflow**: 订阅 [“kotlin-multiplatform” 标签](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* **Kotlin 问题追踪系统**: [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)
