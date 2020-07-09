---
type: doc
layout: reference
category: "Introduction"
title: "协程(Coroutine) 概述"
---

# 用协程(Coroutine)实现异步程序开发

异步(Asynchronous)程序开发, 或者叫非阻塞(non-blocking)程序开发, 是一种相对来说比较新的程序开发方式.
无论我们开发的是服务器端程序, 桌面程序, 还是移动设备程序, 我们不仅需要为用户提供流畅的使用体验, 而且还需要根据负载大小灵活伸缩, 这二者都是很重要的能力.

为了解决这类问题, 有很多种不同的方法, 在 Kotlin 中, 我们采用一种灵活的方式, 在语言层我们提供了 [协程](https://en.wikipedia.org/wiki/Coroutine) 的支持, 然后将大部分具体功能交给运行库来实现, 这种方式非常符合 Kotlin 的理念.

协程不仅帮助我们实现了异步程序开发, 还提供了更丰富的可能, 比如可以用来实现并发型模式(Concurrency), Actor模式, 等等.


## 如何开始

<div style="display: flex; align-items: center; margin-bottom: 20px">
    <img src="{{ url_for('asset', path='images/landing/native/book.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>教程和文档</b>
</div>

如果你是 Kotlin 新手, 请先阅读 [入门](basic-syntax.html).

精选文档:
- [协程简介](coroutines/coroutines-guide.html)
- [基本概念](coroutines/basics.html)
- [频道(Channel)](coroutines/channels.html)
- [协程上下文与派发器(Dispatcher)](coroutines/coroutine-context-and-dispatchers.html)
- [共享的可变状态与并发](coroutines/shared-mutable-state-and-concurrency.html)
- [异步的执行流(Asynchronous Flow)](coroutines/flow.html)

推荐的教程:
- [使用 Kotlin 开发你的第一个协程](../tutorials/coroutines/coroutines-basic-jvm.html)
- [异步程序开发](../tutorials/coroutines/async-programming.html)
- [协程(Coroutine)与通道(Channel)简介](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/01_Introduction) 实践实验室(hands-on lab)

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="{{ url_for('asset', path='images/landing/native/try.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>示例项目</b>
</div>

- [kotlinx.coroutines 示例和源代码](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf App](https://github.com/JetBrains/kotlinconf-app)

更多示例请参见 [GitHub](https://github.com/JetBrains/kotlin-examples)
