---
type: doc
layout: reference
category: "Coroutine"
title: "异常处理"
---


<!--- INCLUDE .*/example-([a-z]+)-([0-9a-z]+)\.kt
/*
 * Copyright 2016-2018 JetBrains s.r.o. Use of this source code is governed by the Apache 2.0 license.
 */

// This file was automatically generated from coroutines-guide.md by Knit tool. Do not edit.
package kotlinx.coroutines.guide.$$1$$2
-->
<!--- KNIT     ../core/kotlinx-coroutines-core/test/guide/.*\.kt -->
<!--- TEST_OUT ../core/kotlinx-coroutines-core/test/guide/test/ExceptionsGuideTest.kt
// This file was automatically generated from coroutines-guide.md by Knit tool. Do not edit.
package kotlinx.coroutines.guide.test

import org.junit.Test

class ExceptionsGuideTest {
-->
**目录**

<!--- TOC -->

* [异常处理](#exception-handling)
  * [异常的传播(propagation)](#exception-propagation)
  * [CoroutineExceptionHandler](#coroutineexceptionhandler)
  * [取消与异常](#cancellation-and-exceptions)
  * [异常的聚合(aggregation)](#exceptions-aggregation)
* [监控](#supervision)
  * [监控任务](#supervision-job)
  * [监控作用范围](#supervision-scope)
  * [被监控的协程中的异常](#exceptions-in-supervised-coroutines)

<!--- END_TOC -->

## 异常处理


本章介绍异常处理, 以及发生异常时的取消.
我们已经知道, 协程被取消时会在挂起点(suspension point)抛出 [CancellationException], 而协程机制忽略会这个异常.
但如果在取消过程中发生了异常, 或者同一个协程的多个子协程抛出了异常, 那么会怎么样?

### 异常的传播(propagation)

协程构建器对于异常的处理有两种风格: 自动传播异常([launch] 和 [actor] 构建器), 或者将异常交给使用者处理([async] 和 [produce] 构建器).
前一种方式部队异常进行处理, 类似于 Java 的 `Thread.uncaughtExceptionHandler`, 后一种则要求使用者处理最终的异常, 比如使用 [await][Deferred.await] 或 [receive][ReceiveChannel.receive] 来处理异常.
(关于 [produce] 和 [receive][ReceiveChannel.receive] 请参见 [通道(Channel)](channels.html)).

我们通过一个简单的示例程序来演示一下, 我们在 [GlobalScope] 内创建协程:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val job = GlobalScope.launch {
        println("Throwing exception from launch")
        throw IndexOutOfBoundsException() // 这个异常会被 Thread.defaultUncaughtExceptionHandler 打印到控制台
    }
    job.join()
    println("Joined failed job")
    val deferred = GlobalScope.async {
        println("Throwing exception from async")
        throw ArithmeticException() // 这个异常不会被打印, 由使用者调用 await 来得到并处理这个异常
    }
    try {
        deferred.await()
        println("Unreached")
    } catch (e: ArithmeticException) {
        println("Caught ArithmeticException")
    }
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-exceptions-01.kt)

(使用 [调试模式](coroutine-context-and-dispatchers.html#debugging-coroutines-and-threads)时), 这段代码的输出结果是:

```text
Throwing exception from launch
Exception in thread "DefaultDispatcher-worker-2 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```

<!--- TEST EXCEPTION-->

### CoroutineExceptionHandler

但是如果我们不想把所有的异常都输出到控制台, 那么应该怎么办呢?
协程的上下文元素 [CoroutineExceptionHandler] 会被作为协程的通用的 `catch` 块, 我们可以在这里实现自定义的日志输出, 或其他异常处理逻辑.
它的使用方法与 [`Thread.uncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setUncaughtExceptionHandler(java.lang.Thread.UncaughtExceptionHandler)) 类似.

在 JVM 平台, 可以通过 [`ServiceLoader`](https://docs.oracle.com/javase/8/docs/api/java/util/ServiceLoader.html) 注册一个 [CoroutineExceptionHandler], 为所有的协程重定义全局的异常处理器.
全局的异常处理器类似于 [`Thread.defaultUncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setDefaultUncaughtExceptionHandler(java.lang.Thread.UncaughtExceptionHandler)), 如果没有注册更具体的异常处理器, 就会使用这个 `Thread.defaultUncaughtExceptionHandler` 异常处理器.
在 Android 平台, 默认安装的协程全局异常处理器是 `uncaughtExceptionPreHandler`.

有些异常是我们预计会被使用者处理的, 只有发生了这类异常以外的其他异常时, 才会调用 [CoroutineExceptionHandler],
因此, 对 [async] 或其他类似的协程构建器注册异常处理器, 不会产生任何效果.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("Caught $exception")
    }
    val job = GlobalScope.launch(handler) {
        throw AssertionError()
    }
    val deferred = GlobalScope.async(handler) {
        throw ArithmeticException() // 这个异常不会被打印, 由使用者调用 deferred.await() 来得到并处理这个异常
    }
    joinAll(job, deferred)
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-exceptions-02.kt)

这个示例程序的输出结果是:

```text
Caught java.lang.AssertionError
```

<!--- TEST-->

### 取消与异常

协程的取消与异常有着非常紧密的关系. 协程内部使用 `CancellationException` 来实现取消, 这些异常会被所有的异常处理器忽略, 因此它们只能用来在 `catch` 块中输出额外的调试信息.
如果使用 [Job.cancel] 来取消一个协程, 而且不指明任何原因, 那么协程会终止运行, 但不会取消它的父协程.
父协程可以使用不指明原因的取消机制, 来取消自己的子协程, 而不取消自己.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        val child = launch {
            try {
                delay(Long.MAX_VALUE)
            } finally {
                println("Child is cancelled")
            }
        }
        yield()
        println("Cancelling child")
        child.cancel()
        child.join()
        yield()
        println("Parent is not cancelled")
    }
    job.join()
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-exceptions-03.kt)

这个示例程序的输出结果是:

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

如果一个协程遇到了 `CancellationException` 以外的异常, 那么它会使用这个异常来取消自己的父协程.
这种行为不能覆盖, 而且 Kotlin 使用这个机制来实现 [结构化并发](composing-suspending-functions.html#structured-concurrency-with-async) 中的稳定的协程层级关系, 而不是依赖于 [CoroutineExceptionHandler] 的实现.
当所有的子协程全部结束后, 原始的异常会被父协程处理.

> 这也是为什么, 在这些示例程序中, 我们总是在 [GlobalScope] 内创建的协程上安装 [CoroutineExceptionHandler].
> 如果在 main [runBlocking] 的作用范围内启动的协程上安装异常处理器, 是毫无意义的, 因为子协程由于异常而终止后之后, 主协程一定会被取消, 而忽略它上面安装的异常处理器.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("Caught $exception")
    }
    val job = GlobalScope.launch(handler) {
        launch { // 第 1 个子协程
            try {
                delay(Long.MAX_VALUE)
            } finally {
                withContext(NonCancellable) {
                    println("Children are cancelled, but exception is not handled until all children terminate")
                    delay(100)
                    println("The first child finished its non cancellable block")
                }
            }
        }
        launch { // 第 2 个子协程
            delay(10)
            println("Second child throws an exception")
            throw ArithmeticException()
        }
    }
    job.join()
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-exceptions-04.kt)

这个示例程序的输出结果是:

```text
Second child throws an exception
Children are cancelled, but exception is not handled until all children terminate
The first child finished its non cancellable block
Caught java.lang.ArithmeticException
```
<!--- TEST-->

### 异常的聚合(aggregation)

如果一个协程的多个子协程都抛出了异常, 那么会怎么样?
通常的规则是 "最先发生的异常优先", 因此第 1 个发生的异常会被传递给异常处理器.
但是这种处理发生可能会导致丢失其他异常, 比如, 如果另一个协程在它的 `finally` 块中抛出了另一个异常.
为了解决这个问题, 我们将其他异常压制(suppress)到最先发生的异常内.

> 有一种解决办法是, 我们可以将各个异常分别向外抛出, 但是这样一来 [Deferred.await] 部分就必须实现相同的机制, 捕获多个异常, 以保持异常抛出与捕获的一致性. 这就会导致协程内部的具体实现细节(比如, 它是否将部分工作代理给了自己的子协程) 暴露给了它的异常处理器.


<!--- INCLUDE

import kotlinx.coroutines.exceptions.*
-->

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*
import java.io.*

fun main() = runBlocking {
    val handler = CoroutineExceptionHandler { _, exception ->
        println("Caught $exception with suppressed ${exception.suppressed.contentToString()}")
    }
    val job = GlobalScope.launch(handler) {
        launch {
            try {
                delay(Long.MAX_VALUE)
            } finally {
                throw ArithmeticException()
            }
        }
        launch {
            delay(100)
            throw IOException()
        }
        delay(Long.MAX_VALUE)
    }
    job.join()  
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-exceptions-05.kt)

> 注意: 上面的示例程序只能在支持 `suppressed` 异常的 JDK7+ 以上版本才能正常运行

这个示例程序的输出结果是:

```text
Caught java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> 注意, 异常聚合机制目前只能在 Java version 1.7+ 以上版本才能正常工作.
JS 和 原生平台目前暂时不支持异常聚合, 将来会解决这个问题.

协程取消异常是透明的, 默认不会被聚合到其他异常中:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*
import java.io.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("Caught original $exception")
    }
    val job = GlobalScope.launch(handler) {
        val inner = launch {
            launch {
                launch {
                    throw IOException()
                }
            }
        }
        try {
            inner.join()
        } catch (e: CancellationException) {
            println("Rethrowing CancellationException with original cause")
            throw e
        }
    }
    job.join()
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-exceptions-06.kt)

这个示例程序的输出结果是:

```text
Rethrowing CancellationException with original cause
Caught original java.io.IOException
```
<!--- TEST-->

## 监控

正如我们前面学到的, 取消是一种双向关系, 它会在整个协程层级关系内传播. 但是如果我们需要单向的取消, 那么应该怎么办呢?

这种需求的一个很好的例子就是一个 UI 组件, 在它的作用范围内定义了一个任务. 如果 UI 的任何一个子任务失败, 并不一定有必要取消(最终效果就是杀死) 整个 UI 组件, 但是如果 UI 组件本身被销毁(而且它的任务也被取消了), 那么就有必要终止所有的子任务, 因为子任务的结果已经不再需要了.

另一个例子是, 一个服务器进程启动了几个子任务, 需要 _监控_ 这些子任务的执行, 追踪它们是否失败, 并且重启那些失败的子任务.

### 监控任务

为了这类目的, 我们可以使用 [SupervisorJob][SupervisorJob()]. 它与通常的 [Job][Job()] 类似, 唯一的区别在于取消只向下方传播. 我们用一个示例程序来演示一下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val supervisor = SupervisorJob()
    with(CoroutineScope(coroutineContext + supervisor)) {
        // 启动第 1 个子协程 -- 在这个示例程序中, 我们会忽略它的异常 (实际应用中不要这样做!)
        val firstChild = launch(CoroutineExceptionHandler { _, _ ->  }) {
            println("First child is failing")
            throw AssertionError("First child is cancelled")
        }
        // 启动第 2 个子协程
        val secondChild = launch {
            firstChild.join()
            // 第 1 个子协程的取消不会传播到第 2 个子协程
            println("First child is cancelled: ${firstChild.isCancelled}, but second one is still active")
            try {
                delay(Long.MAX_VALUE)
            } finally {
                // 但监控任务的取消会传播到第 2 个子协程
                println("Second child is cancelled because supervisor is cancelled")
            }
        }
        // 等待第 1 个子协程失败, 并结束运行
        firstChild.join()
        println("Cancelling supervisor")
        supervisor.cancel()
        secondChild.join()
    }
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-supervision-01.kt)

这个示例程序的输出结果是:

```text
First child is failing
First child is cancelled: true, but second one is still active
Cancelling supervisor
Second child is cancelled because supervisor is cancelled
```
<!--- TEST-->


### 监控作用范围

对于 *带作用范围* 的并发, 可以使用 [supervisorScope] 代替 [coroutineScope] 来实现同一目的. 它也只向一个方向传播取消, 并且只在它自身失败的情况下取消所有的子协程. 它和 [coroutineScope] 一样, 在运行结束之前也会等待所有的子协程结束.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
    try {
        supervisorScope {
            val child = launch {
                try {
                    println("Child is sleeping")
                    delay(Long.MAX_VALUE)
                } finally {
                    println("Child is cancelled")
                }
            }
            // 使用 yield, 给子协程一个机会运行, 并打印信息
            yield()
            println("Throwing exception from scope")
            throw AssertionError()
        }
    } catch(e: AssertionError) {
        println("Caught assertion error")
    }
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-supervision-02.kt)

这个示例程序的输出结果是:

```text
Child is sleeping
Throwing exception from scope
Child is cancelled
Caught assertion error
```
<!--- TEST-->

### 被监控的协程中的异常

常规任务与监控任务的另一个重要区别就是对异常的处理方式.
每个子协程都应该通过异常处理机制自行处理它的异常.
区别在于, 子协程的失败不会传播到父协程中.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
    val handler = CoroutineExceptionHandler { _, exception ->
        println("Caught $exception")
    }
    supervisorScope {
        val child = launch(handler) {
            println("Child throws an exception")
            throw AssertionError()
        }
        println("Scope is completing")
    }
    println("Scope is completed")
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/core/kotlinx-coroutines-core/test/guide/example-supervision-03.kt)

这个示例程序的输出结果是:

```text
Scope is completing
Child throws an exception
Caught java.lang.AssertionError
Scope is completed
```
<!--- TEST-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->
[CancellationException]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[launch]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[Deferred.await]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[GlobalScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineExceptionHandler]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/index.html
[Job.cancel]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html
[runBlocking]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[SupervisorJob()]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html
[Job()]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job.html
[supervisorScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html
[coroutineScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
<!--- INDEX kotlinx.coroutines.channels -->
[actor]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/actor.html
[produce]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/produce.html
[ReceiveChannel.receive]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html
<!--- END -->
