[//]: # (title: 协程指南)

Kotlin 只在它的标准库中提供了最少量的低层 API, 让其它库来使用协程.
与拥有类似功能的其他语言不同, `async` 和 `await` 在 Kotlin 中不是关键字, 甚至不是标准库的一部分.
而且, Kotlin 的 _挂起函数_ 的概念, 为异步操作提供了一种比 future 和 promise 更安全, 更不容易出错的的抽象模型.

`kotlinx.coroutines` 是 JetBrain 公司开发的一个功能强大的协程功能库.
本文档将会详细介绍这个库中包含的很多高层的协程基本操作, 包括 `launch`, `async`, 等等.

本文档将会针对各种不同的主题, 通过一系列示例程序来介绍 `kotlinx.coroutines` 库的各种核心功能.

为了使用协程功能, 以及本文档中的各种示例程序, 你需要添加 `kotlinx-coroutines-core` 依赖项,
详细方法请参见 [项目的 README 文件](https://github.com/Kotlin/kotlinx.coroutines/blob/master/README.md#using-in-your-projects).

## 章节目录

* [协程的基本概念](coroutines-basics.md)
* [教程: 协程与通道(Channel)简介](coroutines-and-channels.md)
* [取消与超时](cancellation-and-timeouts.md)
* [挂起函数(Suspending Function)的组合](composing-suspending-functions.md)
* [协程上下文与派发器(Dispatcher)](coroutine-context-and-dispatchers.md)
* [异步的执行流(Asynchronous Flow)](flow.md)
* [通道(Channel)](channels.md)
* [协程的异常处理](exception-handling.md)
* [共享的可变状态与并发](shared-mutable-state-and-concurrency.md)
* [选择表达式 (实验性功能)](select-expression.md)
* [教程: 使用 IntelliJ IDEA 调试协程](debug-coroutines-with-idea.md)
* [教程: 使用 IntelliJ IDEA 调试 Kotlin 数据流(Flow)](debug-flow-with-idea.md)

## 其他参考文档

* [使用协程进行 UI 编程向导](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md)
* [协程功能设计文档 (KEEP)](https://github.com/Kotlin/KEEP/blob/master/proposals/coroutines.md)
* [kotlinx.coroutines API 完整参考文档](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Android 中协程的最佳实践](https://developer.android.com/kotlin/coroutines/coroutines-best-practices)
* [关于 Android 中使用 Kotlin 协程和数据流(Flow) 的更多资源](https://developer.android.com/kotlin/coroutines/additional-resources)
