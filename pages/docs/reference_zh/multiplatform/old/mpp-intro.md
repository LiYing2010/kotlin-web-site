---
type: doc
layout: reference
title: "Kotlin 跨平台程序开发"
---

# Kotlin 跨平台程序开发

本页面最终更新: 2021/09/13

> 跨平台项目目前处于 [Alpha](/docs/reference_zh/components-stability.html) 阶段.
> 语言功能和相关工具在未来的 Kotlin 版本中都可能发生变化.
{:.note}

支持跨平台程序开发是 Kotlin 的关键性益处之一.
它可以大大减少为 [不同的平台](mpp-supported-platforms.html) 编写和维护相同代码耗费的时间
同时又保持了原生程序开发的灵活性和其他益处.
更多详情请参见 [Kotlin 跨平台程序开发的益处](multiplatform.html).

通过 Kotlin 跨平台程序开发, 可以使用  Kotlin 提供的以下机制来共用代码:

*   [在你的项目中使用的所有平台上共用代码](mpp-share-on-platforms.html#share-code-on-all-platforms).
通过这种方式, 可以共用那些适用于所有平台的共通业务逻辑.

    ![对所有平台共用代码]({{ url_for('asset', path='/docs/images/mpp/flat-structure.png') }})

*   [在你的项目中使用的一部分(但不是所有)平台上共用代码](mpp-share-on-platforms.html#share-code-on-similar-platforms).
可以通过一种阶层结构, 在相似的平台上共用很大部分代码. 你可以对编译目标的共通组合使用 [编译目标的简写](mpp-share-on-platforms.html#use-target-shortcuts),
或者 [手动创建层级结构](mpp-share-on-platforms.html#configure-the-hierarchical-structure-manually).

    ![层级结构]({{ url_for('asset', path='/docs/images/mpp/hierarchical-structure.png') }})

如果需要在共用代码中访问平台相关的 API, 可以使用 Kotlin [预期声明与实际声明(expected and actual declaration)](mpp-connect-to-apis.html) 机制.

## 教程

* [创建跨平台的 Kotlin 库](multiplatform-library.html):
这个教程演示如何创建一个可用于 JVM, JS, 以及原生平台的跨平台库, 可供任何其他的共通代码使用(比如, 在 Android 和 iOS 平台共用).
还演示了如何编写测试, 这些测试将在所有平台上运行, 以及如何使用由特定平台提供的高效率实现.

* [使用 Kotlin Multiplatform 构建一个全栈的(full stack) Web 应用程序](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction):
这个教程创建一个 Client-Server 应用程序, 其中用到共用代码, 序列化, 以及其他各种跨平台开发的范例.
通过这个例子, 在创建针对 Kotlin/JVM 和 Kotlin/JS 目标平台的应用程序的过程中, 讲授背后的概念.
还简要介绍了如何将 Ktor 同时用作服务器端框架和客户端框架.  
