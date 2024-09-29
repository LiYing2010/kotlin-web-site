[//]: # (title: 协程(Coroutine))

最终更新: %latestDocDate%

异步(Asynchronous)程序开发, 或者叫非阻塞(non-blocking)程序开发, 是一种软件开发的一个重要部分.
当开发服务器端程序, 桌面程序, 或移动设备应用程序时, 不仅需要为用户提供流畅的使用体验,
而且还需要根据负载大小灵活伸缩, 这二者都是很重要的能力.

Kotlin 采用一种灵活的方式解决这类问题,
在语言层提供 [协程](https://en.wikipedia.org/wiki/Coroutine) 的支持,
然后将大部分具体功能交给运行库来实现.

协程不仅帮助我们实现了异步程序开发, 还提供了更丰富的可能,
比如, 可以实现并发型模式(Concurrency), Actor模式.

## 如何开始

如果你是 Kotlin 新手, 请先阅读 [Kotlin 入门](getting-started.md).

### 文档

- [协程简介](coroutines-guide.md)
- [基本概念](coroutines-basics.md)
- [频道(Channel)](channels.md)
- [协程上下文与派发器(Dispatcher)](coroutine-context-and-dispatchers.md)
- [共享的可变状态与并发](shared-mutable-state-and-concurrency.md)
- [异步的数据流(Asynchronous Flow)](flow.md)

### 教程

- [异步程序开发](async-programming.md)
- [协程(Coroutine)与通道(Channel)简介](coroutines-and-channels.md)
- [使用 IntelliJ IDEA 调试协程](debug-coroutines-with-idea.md)
- [使用 IntelliJ IDEA 调试 Kotlin 数据流(Flow)](debug-flow-with-idea.md)
- [在 Android 平台测试 Kotlin 协程](https://developer.android.com/kotlin/coroutines/test)

## 示例项目

- [kotlinx.coroutines 示例和源代码](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf App](https://github.com/JetBrains/kotlinconf-app)
