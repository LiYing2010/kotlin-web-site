---
type: doc
layout: reference
category: "Coroutine"
title: "协程指南"
---

Kotlin 语言只在它的标准库中提供了最少量的低层 API, 让其它各种不同的库来使用协程.
与拥有类似功能的其他语言不同, `async` 和 `await` 在 Kotlin 中不是关键字, 甚至不是标准库的一部分.
而且, Kotlin 的 _挂起函数_ 的概念, 为异步操作提供了一种比 future 和 promise 更安全, 更不容易出错的的抽象模型.

`kotlinx.coroutines` 是 JetBrain 公司开发的一个功能强大的协程功能库.
本文档将会详细介绍这个库中包含的很多高层的协程基本操作, 包括 `launch`, `async`, 等等.

本文档将会针对各种不同的主题, 通过一系列示例程序来介绍 `kotlinx.coroutines` 库的各种核心功能.

为了使用协程功能, 以及本文档中的各种示例程序, 你需要添加 `kotlinx-coroutines-core` 依赖项,
详细方法请参见 [项目的 README 文件](https://github.com/kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects).

## 章节目录

* [基本概念](basics.html)
* [取消与超时](cancellation-and-timeouts.html)
* [挂起函数(Suspending Function)的组合](composing-suspending-functions.html)
* [协程上下文与派发器(Dispatcher)](coroutine-context-and-dispatchers.html)
* [异步的执行流(Asynchronous Flow)](flow.html)
* [通道(Channel)](channels.html)
* [异常处理与监视](exception-handling.html)
* [共享的可变状态与并发](shared-mutable-state-and-concurrency.html)
* [选择表达式 (实验性功能)](select-expression.html)

## 其他参考文档

* [使用协程进行 UI 编程向导](https://github.com/kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
* [协程功能设计文档 (KEEP)](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md)
* [kotlinx.coroutines API 完整参考](http://kotlin.github.io/kotlinx.coroutines)
