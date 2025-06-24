[//]: # (title: 异步编程(Asynchronous Programming)技术)

过去几十年来, 作为开发者, 我们始终面对一个问题需要解决 - 怎么样才能让我们的应用程序不要发生阻塞.
无论我们在开发桌面应用程序, 移动应用程序, 甚至服务器端的应用程序,
我们都希望避免让用户等待甚至更糟的情况, 因为会导致瓶颈, 使得应用程序无法扩展到更大规模.

现在已经有了很多种方案来解决这个问题, 包括:

* [线程(Thread)](#threading)
* [回调(Callback)](#callbacks)
* [Future, Promise, 以及其他](#futures-promises-and-others)
* [Reactive Extension](#reactive-extensions)
* [协程(Coroutine)](#coroutines)

在解释协程之前, 先让我们简单回顾一下其他解决方案.

## 线程(Thread) {id="threading"}

要避免程序阻塞, 线程(Thread)可能是大家最熟悉的解决方案.

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // 发起请求, 随后阻塞主线程
    return token
}
```

我们假设上面的代码中的 `preparePost` 是一个长时间执行的处理, 因此会阻塞 UI.
我们可以在一个独立的线程中启动它. 这样我们就可以避免 UI 阻塞.
这是非常常见的技术, 但有很多缺点:

* 线程代价高昂. 线程需要 context 切换, 这个代价很高.
* 线程不是无限的. 底层的操作系统限制了能够启动的线程数量.
  在服务器端应用程序中, 这个限制可能导致显著的瓶颈.
* 线程并不总是可用的. 在某些平台, 比如 JavaScript, 甚至根本不支持线程.
* 线程使用困难. 调试线程, 以及避免竞争条件, 都是我们在多线程编程中遭遇的常见问题.

## 回调(Callback) {id="callbacks"}

使用回调, 基本想法是将回调函数作为参数传给另一个函数, 然后在处理结束后调用这个回调函数.

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token ->
        submitPostAsync(token, item) { post ->
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // 发起请求, 并立即返回
    // 调度回调函数, 在之后的时刻调用它
}
```

这个原则感觉好像是更加优雅的解决方案, 但仍然存在一系列的问题:

* 回调的嵌套很困难.
  通常来说, 被用作回调的函数, 经常会需要它自己的回调. 因此导致一系列的嵌套回调, 代码极难理解.
  这种模式经常被称为回调地狱, 或者叫做 [诅咒金字塔(pyramid of doom)](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming)),
  因为这些深度嵌套的回调造成的缩进会形成三角形.
* 错误处理很复杂.
  嵌套模型导致错误的处理和传播变得更加复杂.

在事件循环架构中, 比如 JavaScript, 回调是非常常见的,
但即使在这种场景, 通常人们也会改为使用其他方案, 比如 Promise 或 Reactive Extension.

## Future, Promise, 以及其他 {id="futures-promises-and-others"}

Future 或 Promise (其他语言或平台也可能使用别的名称),
背后的理念是, 当我们发起一个调用, 我们会得到 _承诺(Promise)_, 这个调用会在某个时间点返回一个 `Promise` 对象,
然后我们可以对它进行操作.

```kotlin
fun postItem(item: Item) {
    preparePostAsync()
        .thenCompose { token ->
            submitPostAsync(token, item)
        }
        .thenAccept { post ->
            processPost(post)
        }

}

fun preparePostAsync(): Promise<Token> {
    // 发起请求, 并返回一个 promise, 它会在之后的时刻完成
    return promise
}
```

这个方案要求我们的编程方式发生很多变化, 具体来说是:

* 不同的编程模型. 与回调类似, 编程模型不再是自顶向下的命令模式(top-down imperative approach),
  而是变为一种由链式调用构成的组合模式(compositional model).
  传统的编程结构比如循环, 异常处理, 等等, 在这种模式中通常不再可用了.
* 不同的 API. 通常需要学习完全不同的新 API, 比如 `thenCompose` 或 `thenAccept`,
  而且这些函数在不同的平台上也可能存在差异.
* 特殊的返回类型. 返回类型不再是我们需要的实际数据, 而是一个新的类型 `Promise`, 我们需要从它得到数据.
* 错误处理很复杂. 错误的传播和链条通常很不直观.

## Reactive Extension {id="reactive-extensions"}

[Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist))
将 Reactive Extension (Rx) 引入到了 C# 中.
尽管它在 .NET 平台得到了大量应用, 但并没有被主流开发者采用, 直到 Netflix 将它移植到 Java, 命名为 RxJava.
在那之后, 对很多平台有了大量的移植, 包括 JavaScript (RxJS).

Rx 背后的理念是所谓 `可观察的流(observable stream)`,
我们将数据看作流(stream)(包含无限数量的数据), 而且可以观察这些流.
从实践层面来讲, Rx 只不过是 [观察者模式(Observer Pattern)](https://en.wikipedia.org/wiki/Observer_pattern),
并带有一系列的扩展, 使得我们可以对数据进行操作.

这个方案与 Future 很类似, 但 Future 可以被看作是返回一个单独的元素, Rx 则返回一个流.
但是, 与前面的方案类似, Rx 也带来了编程模型的全新的理念, 如同下面这句名言所说:

    "任何东西都是流, 而且可以观察"

这表示要用不同的方式来解决问题, 与我们以前编写同步代码相比, 编程方式发生显著的变化.
有一个优点是, 与 Future 不同, 由于 Rx 被移植到了很多平台,
因此不论编程语言是 C#, Java, JavaScript, 还是可以使用 Rx 的任何其他语言,
通常我们可以得到一致的 API 体验.

此外, Rx 还引入了比较好的错误处理方案.

## 协程(Coroutine) {id="coroutines"}

Kotlin 的异步编程解决方案是使用协程(Coroutine),
它的理念是可被挂起的一段计算, 也就是说, 一个函数的执行在某个时刻可以被挂起, 并在之后的某个时刻恢复运行.

协程的优点之一是, 对于开发者来说, 非阻塞代码的编写方式与编写阻塞代码基本上是一样的.
编程模型本身并没有发生变化.

以下面的代码为例:

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // 发起请求, 并挂起协程
    return suspendCoroutine { /* ... */ }
}
```

这段代码会启动一个长时间运行的操作, 但不会阻塞主线程.
`preparePost` 是一个 `挂起函数(suspendable function)`, 因此它的前缀添加了关键字 `suspend`.
上面这段话的意思是说, 从时间序列上来看, 函数会在某个时刻开始运行, 暂停运行, 然后又恢复运行.

* 函数签名完全不变. 唯一的区别是添加 `suspend` 关键字.
  但返回类型仍然是我们希望返回的数据类型.
* 代码的编写方式仍然与编写同步代码的方式一样, 自顶向下,
  除了使用 `launch` 函数来启动协程之外(具体细节在其他教程中解释), 不需要任何特殊的语法.
* 编程模型和 API 仍然保持不变. 我们可以继续使用循环, 错误处理, 等等.
  不需要学习完全不用的一组新 API.
* 平台独立. 无论我们的编译目标是 JVM, JavaScript 还是其他平台, 我们编写的代码是一样的.
  编译器会负责协程代码与各个平台之间的调节工作.

协程不是由 Kotlin 独自发明的一个新概念. 它已经存在了几十年, 并在其他编程语言中大量使用, 比如 Go.
值得注意的是协程在 Kotlin 中的实现方式, 大多数功能交给库来实现.
实际上, 除了 `suspend` 关键字, Kotlin 语言没有添加其他关键字.
这一点与其他语言不同, 比如 C# 的语法添加了 `async` 和 `await`.
而在 Kotlin 中, 这些只是库函数.

更多详情, 请参见 [协程参考文档](coroutines-overview.md).
