---
type: doc
layout: reference
category: "Coroutine"
title: "协程上下文与派发器(Dispatcher)"
---


<!--- INCLUDE .*/example-([a-z]+)-([0-9a-z]+)\.kt
/*
 * Copyright 2016-2018 JetBrains s.r.o. Use of this source code is governed by the Apache 2.0 license.
 */

// This file was automatically generated from coroutines-guide.md by Knit tool. Do not edit.
package kotlinx.coroutines.guide.$$1$$2
-->
<!--- KNIT     ../core/kotlinx-coroutines-core/test/guide/.*\.kt -->
<!--- TEST_OUT ../core/kotlinx-coroutines-core/test/guide/test/DispatcherGuideTest.kt
// This file was automatically generated from coroutines-guide.md by Knit tool. Do not edit.
package kotlinx.coroutines.guide.test

import org.junit.Test

class DispatchersGuideTest {
-->

**目录**

<!--- TOC -->

* [协程上下文与派发器(Dispatcher)](#coroutine-context-and-dispatchers)
  * [派发器与线程](#dispatchers-and-threads)
  * [非受限派发器(Unconfined dispatcher)与受限派发器(Confined dispatcher)](#unconfined-vs-confined-dispatcher)
  * [协程与线程的调试](#debugging-coroutines-and-threads)
  * [在线程间跳转](#jumping-between-threads)
  * [在上下文中的任务](#job-in-the-context)
  * [协程的子协程](#children-of-a-coroutine)
  * [父协程的职责](#parental-responsibilities)
  * [为协程命名以便于调试](#naming-coroutines-for-debugging)
  * [组合上下文中的元素](#combining-context-elements)
  * [使用显式任务来取消协程](#cancellation-via-explicit-job)
  * [线程的局部数据](#thread-local-data)

<!--- END_TOC -->

## 协程上下文与派发器(Dispatcher)

协程执行时总是属于某个上下文环境, 上下文环境通过 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 类型的值来表示, 这个类型是 Kotlin 标准库中定义的.

协程的上下文是一组不同的元素. 最主要的元素是协程的 [Job], 这个概念我们前面已经介绍过了, 此外还有任务的派发器(Dispatcher), 本章我们来介绍派发器.

### 派发器与线程

协程上下文包含了一个 _协程派发器_ (参见 [CoroutineDispatcher]), 它负责确定对应的协程使用哪个或哪些线程来执行. 协程派发器可以将协程的执行限定在某个特定的线程上, 也可以将协程的执行派发给一个线程池, 或者不加限定, 允许协程运行在任意的线程上.

所有的协程构建器, 比如 [launch] 和 [async], 都接受一个可选的 [CoroutineContext](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/) 参数, 这个参数可以用来为新创建的协程显式地指定派发器, 以及其他上下文元素.

我们来看看下面的示例程序:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch { // 使用父协程的上下文, 也就是 main 函数中的 runBlocking 协程
        println("main runBlocking      : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) { // 非受限 -- 将会在主线程中执行
        println("Unconfined            : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(Dispatchers.Default) { // 会被派发到 DefaultDispatcher
        println("Default               : I'm working in thread ${Thread.currentThread().name}")
    }
    launch(newSingleThreadContext("MyOwnThread")) { // 将会在独自的新线程内执行
        println("newSingleThreadContext: I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-01.kt)

这个示例程序的输出如下 (顺序可能略有不同):

```text
Unconfined            : I'm working in thread main
Default               : I'm working in thread DefaultDispatcher-worker-1
newSingleThreadContext: I'm working in thread MyOwnThread
main runBlocking      : I'm working in thread main
```

<!--- TEST LINES_START_UNORDERED -->

当 `launch { ... }` 没有参数时, 它将会从调用它的代码的 [CoroutineScope] 继承相同的上下文(因此也继承了相应的派发器). 在上面的示例程序中, 它继承了运行在 `main` 线程中主 `runBlocking` 协程的上下文.

[Dispatchers.Unconfined] 是一个特殊的派发器, 在我们的示例程序中, 它似乎也是在 `main` 线程中执行协程, 但实际上, 它是一种不同的机制, 我们在后文中详细解释.

当协程在 [GlobalScope] 内启动时, 会使用默认派发器, 用 [Dispatchers.Default] 表示, 它会使用后台共享的线程池, 因此 `launch(Dispatchers.Default) { ... }` 会使用与 `GlobalScope.launch { ... }` 相同的派发器.

[newSingleThreadContext] 会创建一个新的线程来运行协程. 一个专用的线程是一种非常昂贵的资源.
在真实的应用程序中, 当这样的线程, 必须在不再需要的时候使用 [close][ExecutorCoroutineDispatcher.close] 函数释放它, 或者保存在一个顶层变量中, 并在应用程序内继续重用.

### 非受限派发器(Unconfined dispatcher)与受限派发器(Confined dispatcher)

[Dispatchers.Unconfined] 协程派发器会在调用者线程内启动协程, 但只会持续运行到第一次挂起点为止. 在挂起之后, 它会在哪个线程内恢复执行, 这完全由被调用的挂起函数来决定. 非受限派发器(Unconfined dispatcher) 适用的场景是, 协程不占用 CPU 时间, 也不更新那些限定于某个特定线程的共享数据(比如 UI).

另一方面, 默认情况下, 会继承外层 [CoroutineScope] 的派发器.
具体来说, 对于 [runBlocking] 协程, 默认的派发器会限定为调用它的那个线程, 因此继承这个派发器的效果就是, 将协程的执行限定在这个线程上, 并且执行顺序为可预测的先进先出(FIFO)调度顺序.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Unconfined) { // 非受限 -- 将会在主线程中执行
        println("Unconfined      : I'm working in thread ${Thread.currentThread().name}")
        delay(500)
        println("Unconfined      : After delay in thread ${Thread.currentThread().name}")
    }
    launch { // 使用父协程的上下文, 也就是 main 函数中的 runBlocking 协程
        println("main runBlocking: I'm working in thread ${Thread.currentThread().name}")
        delay(1000)
        println("main runBlocking: After delay in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-02.kt)

上面的示例程序的输出如下:

```text
Unconfined      : I'm working in thread main
main runBlocking: I'm working in thread main
Unconfined      : After delay in thread kotlinx.coroutines.DefaultExecutor
main runBlocking: After delay in thread main
```

<!--- TEST LINES_START -->

因此, 继承了 `runBlocking {...}` 协程的上下文的协程会在 `main` 线程内恢复运行, 而非受限的协程会在默认的执行器线程内恢复运行, 因为它是挂起函数 [delay] 所使用的线程.

> 非受限派发器是一种高级机制, 对于某些极端情况, 如果我们不需要控制协程在哪个线程上执行, 或者由于协程中的某些操作必须立即执行, 因此对其进行控制会导致一些不希望的副作用, 这时使用非受限派发器就非常有用. 在通常的代码中不应该使用非受限派发器.

### 协程与线程的调试

协程可以在一个线程内挂起, 然后在另一个线程中恢复运行. 即使协程的派发器只使用一个线程, 也很难弄清楚协程在哪里, 在什么时间, 具体做了什么操作. 调试多线程应用程序的常见办法是在日志文件的每一条日志信息中打印线程名称. 在各种日志输出框架中都广泛的支持这个功能. 在使用协程时, 仅有线程名称还不足以确定协程的上下文, 因此 `kotlinx.coroutines` 包含了一些调试工具来方便我们的调试工作.

请使用 JVM 选项 `-Dkotlinx.coroutines.debug` 来运行下面的示例程序:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking<Unit> {
//sampleStart
    val a = async {
        log("I'm computing a piece of the answer")
        6
    }
    val b = async {
        log("I'm computing another piece of the answer")
        7
    }
    log("The answer is ${a.await() * b.await()}")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-03.kt)

上面的例子中会出现 3 个协程. 主协程 (#1) -- `runBlocking` 协程, 以及另外 2 个计算延迟值的协程 `a` (#2) 和 `b` (#3). 这些协程都在 `runBlocking` 的上下文内运行, 并且都被限定在主线程中.
这个示例程序的输出是:

```text
[main @coroutine#2] I'm computing a piece of the answer
[main @coroutine#3] I'm computing another piece of the answer
[main @coroutine#1] The answer is 42
```

<!--- TEST FLEXIBLE_THREAD -->

`log` 函数会在方括号内打印线程名称, 你可以看到, 是 `main` 线程, 但线程名称之后还加上了目前正在执行的协程 id.
当打开调试模式时, 会将所有创建的协程 id 设置为连续的数字顺序.

关于调试工具的详情, 请参见 [newCoroutineContext] 函数的文档.

### 在线程间跳转

请使用 JVM 参数 `-Dkotlinx.coroutines.debug` 运行下面的示例程序 (参见 [debug](#debugging-coroutines-and-threads)):

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() {
//sampleStart
    newSingleThreadContext("Ctx1").use { ctx1 ->
        newSingleThreadContext("Ctx2").use { ctx2 ->
            runBlocking(ctx1) {
                log("Started in ctx1")
                withContext(ctx2) {
                    log("Working in ctx2")
                }
                log("Back to ctx1")
            }
        }
    }
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-04.kt)

上面的示例程序演示了几种技巧. 一是使用明确指定的上下文来调用 [runBlocking], 另一个技巧是使用 [withContext] 函数, 在同一个协程内切换协程的上下文, 运行结果如下, 你可以看到切换上下文的效果:

```text
[Ctx1 @coroutine#1] Started in ctx1
[Ctx2 @coroutine#1] Working in ctx2
[Ctx1 @coroutine#1] Back to ctx1
```

<!--- TEST -->

注意, 这个示例程序还使用了 Kotlin 标准库的 `use` 函数, 以便在 [newSingleThreadContext] 创建的线程不再需要的时候释放它.

### 在上下文中的任务

协程的 [Job] 是协程上下文的一部分. 协程可以通过自己的上下文来访问到 [Job], 方法是使用 `coroutineContext[Job]` 表达式:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    println("My job is ${coroutineContext[Job]}")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-05.kt)

在 [调试模式](#debugging-coroutines-and-threads) 下运行时, 这个示例程序的输出类似于:

```
My job is "coroutine#1":BlockingCoroutine{Active}@6d311334
```

<!--- TEST lines.size == 1 && lines[0].startsWith("My job is \"coroutine#1\":BlockingCoroutine{Active}@") -->

注意, [CoroutineScope] 中的 [isActive] 只是 `coroutineContext[Job]?.isActive == true` 的一个简写.

### 协程的子协程

当一个协程在另一个协程的 [CoroutineScope] 内启动时, 它会通过 [CoroutineScope.coroutineContext] 继承这个协程的上下文, 并且新协程的 [Job] 会成为父协程的任务的一个 _子任务_. 当父协程被取消时, 它所有的子协程也会被取消, 并且会逐级递归, 取消子协程的子协程.

但是, 如果使用 [GlobalScope] 来启动一个协程, 那么这个协程不会被绑定到启动它的那段代码的作用范围, 并会独自运行.


<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // 启动一个协程, 处理某种请求
    val request = launch {
        // 它启动 2 个其他的任务, 其中一个使用 GlobalScope
        GlobalScope.launch {
            println("job1: I run in GlobalScope and execute independently!")
            delay(1000)
            println("job1: I am not affected by cancellation of the request")
        }
        // 另一个继承父协程的上下文
        launch {
            delay(100)
            println("job2: I am a child of the request coroutine")
            delay(1000)
            println("job2: I will not execute this line if my parent request is cancelled")
        }
    }
    delay(500)
    request.cancel() // 取消对请求的处理
    delay(1000) // 延迟 1 秒, 看看结果如何
    println("main: Who has survived request cancellation?")
//sampleEnd
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-06.kt)

这个示例程序的运行结果是:

```text
job1: I run in GlobalScope and execute independently!
job2: I am a child of the request coroutine
job1: I am not affected by cancellation of the request
main: Who has survived request cancellation?
```

<!--- TEST -->

### 父协程的职责

父协程总是会等待它的所有子协程运行完毕. 父协程不必明确地追踪它启动的子协程, 也不必使用 [Job.join] 来等待子协程运行完毕:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    // 启动一个协程, 处理某种请求
    val request = launch {
        repeat(3) { i -> // 启动几个子协程
            launch  {
                delay((i + 1) * 200L) // 各个子协程分别等待 200ms, 400ms, 600ms
                println("Coroutine $i is done")
            }
        }
        println("request: I'm done and I don't explicitly join my children that are still active")
    }
    request.join() // 等待 request 协程执行完毕, 包括它的所有子协程
    println("Now processing of the request is complete")
//sampleEnd
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-07.kt)

这个示例程序的运行结果如下:

```text
request: I'm done and I don't explicitly join my children that are still active
Coroutine 0 is done
Coroutine 1 is done
Coroutine 2 is done
Now processing of the request is complete
```

<!--- TEST -->

### 为协程命名以便于调试

如果协程频繁输出日志, 而且你只需要追踪来自同一个协程的日志, 那么使用系统自动赋予的协程 id 就足够了.
然而, 如果协程与某个特定的输入处理绑定在一起, 或者负责执行某个后台任务, 那么最好明确地为协程命名, 以便于调试.
对协程来说, 上下文元素 [CoroutineName] 起到与线程名类似的作用. 当 [调试模式](#debugging-coroutines-and-threads) 开启时, 协程名称会出现在正在运行这个协程的线程的名称内.

下面的示例程序演示这个概念:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

fun main() = runBlocking(CoroutineName("main")) {
//sampleStart
    log("Started main coroutine")
    // 启动 2 个背景任务
    val v1 = async(CoroutineName("v1coroutine")) {
        delay(500)
        log("Computing v1")
        252
    }
    val v2 = async(CoroutineName("v2coroutine")) {
        delay(1000)
        log("Computing v2")
        6
    }
    log("The answer for v1 / v2 = ${v1.await() / v2.await()}")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-08.kt)

使用 JVM 参数 `-Dkotlinx.coroutines.debug` 运行这个示例程序时, 输出类似于以下内容:

```text
[main @main#1] Started main coroutine
[main @v1coroutine#2] Computing v1
[main @v2coroutine#3] Computing v2
[main @main#1] The answer for v1 / v2 = 42
```

<!--- TEST FLEXIBLE_THREAD -->

### 组合上下文中的元素

有些时候我们会需要对协程的上下文定义多个元素. 这时我们可以使用 `+` 操作符.
比如, 我们可以同时使用明确指定的派发器, 以及明确指定的名称, 来启动一个协程:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
//sampleStart
    launch(Dispatchers.Default + CoroutineName("test")) {
        println("I'm working in thread ${Thread.currentThread().name}")
    }
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-09.kt)

使用 JVM 参数 `-Dkotlinx.coroutines.debug` 运行这个示例程序时, 输出结果是:

```text
I'm working in thread DefaultDispatcher-worker-1 @test#2
```

<!--- TEST FLEXIBLE_THREAD -->

### 使用显式任务来取消协程

下面我们把关于上下文, 子协程, 任务的相关知识综合起来. 假设我们的应用程序中有一个对象, 它存在一定的生命周期, 但这个对象不是一个协程. 比如, 我们在编写一个 Android 应用程序, 在一个 Android activity  的上下文内启动了一些协程, 执行一些异步操作, 来取得并更新数据, 显示动画, 等等等等. 当 activity 销毁时, 所有这些协程都必须取消, 以防内存泄漏.

我们创建 [Job] 的实例, 并将它与 activity 的生命周期相关联, 以此来管理协程的生命周期.
当 activity 创建时, 使用工厂函数 [Job()] 来创建任务的实例, 当 activity 销毁时取消这个任务, 如下例所示:


<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Activity : CoroutineScope {
    lateinit var job: Job

    fun create() {
        job = Job()
    }

    fun destroy() {
        job.cancel()
    }
    // 待续 ...
```

</div>

我们还在这个 `Actvity` 类中实现 [CoroutineScope] 接口. 我们只需要实现这个接口的 [CoroutineScope.coroutineContext] 属性, 来指明在这个作用范围内启动的协程所使用的上下文.
我们将希望使用的派发器(这个例子中使用 [Dispatchers.Default])与任务结合在一起:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
    // Activity 类的内容继续
    override val coroutineContext: CoroutineContext
        get() = Dispatchers.Default + job
    // 待续 ...
```

</div>

然后, 在这个 `Activity` 的作用范围内启动协程, 不必明确指定上下文.
在这个示例程序中, 我们启动 10 个协程, 分别延迟一段不同长度的时间:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
    // Activity 类的内容继续
    fun doSomething() {
        // 启动 10 个协程, 每个工作一段不同长度的时间
        repeat(10) { i ->
            launch {
                delay((i + 1) * 200L) // 分别延迟 200ms, 400ms, ... 等等
                println("Coroutine $i is done")
            }
        }
    }
} // Activity 类结束
```

</div>

在我们的 main 函数中, 我们创建 activity, 调用我们的 `doSomething` 测试函数, 然后在 500ms 后销毁 activity.
销毁 activity 会取消所有的协程, 如果我们继续等待, 就会注意到协程不再向屏幕打印信息, 因此我们知道协程已经被取消了:

<!--- CLEAR -->

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

class Activity : CoroutineScope {
    lateinit var job: Job

    fun create() {
        job = Job()
    }

    fun destroy() {
        job.cancel()
    }
    // 待续 ...

    // Activity 类的内容继续
    override val coroutineContext: CoroutineContext
        get() = Dispatchers.Default + job
    // 待续 ...

    // Activity 类的内容继续
    fun doSomething() {
        // 启动 10 个协程, 每个工作一段不同长度的时间
        repeat(10) { i ->
            launch {
                delay((i + 1) * 200L) // 分别延迟 200ms, 400ms, ... 等等
                println("Coroutine $i is done")
            }
        }
    }
} // Activity 类结束

fun main() = runBlocking<Unit> {
//sampleStart
    val activity = Activity()
    activity.create() // 创建一个 activity
    activity.doSomething() // 运行测试函数
    println("Launched coroutines")
    delay(500L) // 等待半秒
    println("Destroying activity!")
    activity.destroy() // 取消所有协程
    delay(1000) // 确认协程不再继续工作
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-10.kt)

这个示例程序的输出如下:

```text
Launched coroutines
Coroutine 0 is done
Coroutine 1 is done
Destroying activity!
```

<!--- TEST -->

你会看到, 只有前面的 2 个协程打印出了信息, 由于 `Activity.destroy()` 中调用了 `job.cancel()`, 其他所有协程都被取消了.

### 线程的局部数据

有些时候, 如果能够传递一些线程局部的数据(thread-local data)将是一种很方便的功能, 但是对于协程来说, 它并没有关联到某个具体的线程, 因此, 不写大量的样板代码, 通常很难自己写代码来实现这个功能.

对于 [`ThreadLocal`](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html), 有一个扩展函数 [asContextElement] 可以帮助我们. 它会创建一个额外的上下文元素, 用来保持某个给定的 `ThreadLocal` 的值, 并且每次当协程切换上下文时就恢复它的值.

我们通过一个例子来演示如何使用这个函数:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

val threadLocal = ThreadLocal<String?>() // 声明线程局部变量

fun main() = runBlocking<Unit> {
//sampleStart
    threadLocal.set("main")
    println("Pre-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    val job = launch(Dispatchers.Default + threadLocal.asContextElement(value = "launch")) {
       println("Launch start, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
        yield()
        println("After yield, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
    }
    job.join()
    println("Post-main, current thread: ${Thread.currentThread()}, thread local value: '${threadLocal.get()}'")
//sampleEnd
}
```

</div>                                                                                       

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-context-11.kt)

在这个示例程序中, 我们使用 [Dispatchers.Default], 在后台线程池中启动了一个新的协程, 因此协程会在线程池的另一个线程中运行, 但它还是会得到我们通过 `threadLocal.asContextElement(value = "launch")` 指定的线程局部变量的值,
无论协程运行在哪个线程内.
因此, (使用 [调试模式](#debugging-coroutines-and-threads)时)的输出结果是:

```text
Pre-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
Launch start, current thread: Thread[DefaultDispatcher-worker-1 @coroutine#2,5,main], thread local value: 'launch'
After yield, current thread: Thread[DefaultDispatcher-worker-2 @coroutine#2,5,main], thread local value: 'launch'
Post-main, current thread: Thread[main @coroutine#1,5,main], thread local value: 'main'
```

<!--- TEST FLEXIBLE_THREAD -->

`ThreadLocal` 在协程中得到了一级支持, 可以在 `kotlinx.coroutines` 提供的所有基本操作一起使用.
它只有一个关键的限制: 当线程局部变量的值发生变化时, 新值不会传递到调用协程的线程中去
(因为上下文元素不能追踪对 `ThreadLocal` 对象的所有访问) 而且更新后的值会在下次挂起时丢失.
请在协程内使用 [withContext] 来更新线程局部变量的值, 详情请参见 [asContextElement].

另一种方法是, 值可以保存在可变的装箱类(mutable box)中, 比如 `class Counter(var i: Int)`, 再把这个装箱类保存在线程局部变量中. 然而, 这种情况下, 对这个装箱类中的变量可能发生并发修改, 你必须完全负责对此进行同步控制.

对于高级的使用场景, 比如与日志 MDC(Mapped Diagnostic Context) 的集成, 与事务上下文(transactional context)的集成, 或者与其他内部使用线程局部变量来传递数据的库的集成, 应该实现 [ThreadContextElement] 接口, 详情请参见这个接口的文档.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->
[Job]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[CoroutineDispatcher]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html
[launch]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[CoroutineScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[Dispatchers.Unconfined]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-unconfined.html
[GlobalScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[Dispatchers.Default]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[newSingleThreadContext]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/new-single-thread-context.html
[ExecutorCoroutineDispatcher.close]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-executor-coroutine-dispatcher/close.html
[runBlocking]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[delay]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[newCoroutineContext]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/new-coroutine-context.html
[withContext]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[isActive]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope.coroutineContext]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/coroutine-context.html
[Job.join]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CoroutineName]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/index.html
[Job()]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job.html
[asContextElement]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/java.lang.-thread-local/as-context-element.html
[ThreadContextElement]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-thread-context-element/index.html
<!--- END -->
