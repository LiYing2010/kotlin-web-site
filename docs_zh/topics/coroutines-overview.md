[//]: # (title: 协程(Coroutine))

应用程序经常需要同时执行多个任务, 例如响应用户输入, 装载数据, 或更新画面.
为了实现这些功能, 它们依赖于并发, 并发能够允许操作独立运行, 相互不会阻塞.

并发运行任务的最常见方式是使用线程, 线程是由操作系统管理的独立的执行路径.
但是, 线程相对来说比较重, 而且创建太多线程可能导致性能问题.

为了支持高效的并发, Kotlin 使用基于 _协程(Coroutine)_ 构建的异步编程技术,
让你能够使用挂起函数(Suspending Function), 以一种自然的, 顺序的方式编写异步代码.
协程是线程的轻量替代方案.
可以挂起, 而不阻塞系统资源, 并且消耗较少的资源, 因此更适合于细粒度的并发.

大多数协程功能由 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 库提供,
这个库包含各种工具, 用于启动协程, 处理并发, 使用异步的流, 等等.

如果你是 Kotlin 协程的初学者, 请先阅读 [协程的基本概念](coroutines-basics.md) 向导, 然后在深入了解更复杂的内容.
这篇向导通过简单的示例, 介绍一些关键概念, 包括挂起函数, 协程构建器, 以及结构化并发:

<a href="coroutines-basics.md"><img src="get-started-coroutines.svg" width="700" alt="协程入门" style="block"/></a>

> 查看示例项目 [KotlinConf App](https://github.com/JetBrains/kotlinconf-app), 了解协程的具体使用.
>
{style="tip"}

## 协程的概念 {id="coroutine-concepts"}

`kotlinx.coroutines` 库提供了核心的构建代码块, 用于并发运行任务, 构建协程执行, 以及管理状态.

### 挂起函数与协程构建器 {id="suspending-functions-and-coroutine-builders"}

Kotlin 中的协程以挂起函数为基础, 挂起函数能够让代码暂停执行, 之后恢复执行, 而不会阻塞线程.
`suspend` 关键字标记函数, 表示它能够异步的执行长时间运行的操作.

要启动新的协程, 请使用协程构建器,
例如 [`.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)
和 [`.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html).
这些构建器是
[`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/)
上的扩展函数,
`CoroutineScope` 定义协程的生存周期, 并提供协程上下文(Context).

关于这些构建器, 详情请参见 [协程的基本概念](coroutines-basics.md) 和 [组合挂起函数](coroutines-and-channels.md).

### 协程的上下文(Context)和行为 {id="coroutine-context-and-behavior"}

从一个 `CoroutineScope` 启动一个协程, 会创建一个上下文(Context), 控制它的执行.
构建器函数, 例如 `.launch()` 和 `.async()`, 会自动创建一组元素, 定义协程的行为:

* [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 接口,
  追踪协程的生命周期, 并实现结构化并发.
* [`CoroutineDispatcher`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/),
  控制协程在哪里运行, 例如在背景线程中, 还是在 UI 应用程序的主线程中.
* [`CoroutineExceptionHandler`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/),
  处理未被捕获的异常.

这些元素, 以及其他可能的元素, 共同构成 [_协程的上下文(Context)_](coroutine-context-and-dispatchers.md), 默认从协程的父协程继承得到.
这个上下文构成一个层级结构, 实现结构化并发, 在结构化并发中, 相关的协程能够一起 [取消](cancellation-and-timeouts.md),
或者作为一个组来 [处理异常](exception-handling.md).

### 异步的数据流(Asynchronous Flow), 以及共享的可变状态 {id="asynchronous-flow-and-shared-mutable-state"}

Kotlin 提供了几种方式来实现协程的通信.
请根据你想要如何在协程之间共享值, 选择以下几种方案之一:

* [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/):
  只有在协程主动获取值时, 才会产生值.
* [`Channel`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/):
  允许多个协程发送和接收值, 每个值只传递给一个协程.
* [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/):
  与所有活动的收集协程持续的共享每个值.

当多个协程需要访问或更新同一个数据时, 我们称为协程之间 _共享可变的状态_.
如果没有协调, 这可能导致竞争条件, 也就是说多个操作会以不可预测的方式相互干扰.
为了安全的管理共享的可变状态, 请使用
[`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/#)
来封装共享的数据.
之后, 你就可以在一个协程中更新数据, 并在其他协程中获取它的最新值.
<!-- Learn more in [Shared mutable state and concurrency](shared-mutable-state-and-concurrency.md). -->

详情请参见 [异步的数据流(Asynchronous Flow)](flow.md), [通道(Channel)](channels.md), 以及 [协程(Coroutine)与通道(Channel)教程](coroutines-and-channels.md).

## 下一步做什么 {id="what-s-next"}

* 阅读 [协程的基本概念向导](coroutines-basics.md), 了解协程, 挂起函数, 以及构建器的基础知识.
* 阅读 [组合挂起函数](coroutine-context-and-dispatchers.md), 了解如何组合挂起函数, 以及构建协程管道.
* 学习如何在 IntelliJ IDEA 中使用内建的工具 [调试协程](debug-coroutines-with-idea.md).
* 关于数据流(Flow)的调试, 详情请参见 [使用 IntelliJ IDEA 调试 Kotlin 数据流(Flow)](debug-flow-with-idea.md) 教程.
* 阅读 [使用协程进行 UI 编程向导](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md), 学习基于协程的 UI 开发.
* 阅读 [在 Android 中使用协程的最佳实践](https://developer.android.com/kotlin/coroutines/coroutines-best-practices).
* 查看 [`kotlinx.coroutines` API 参考文档](https://kotlinlang.org/api/kotlinx.coroutines/).
