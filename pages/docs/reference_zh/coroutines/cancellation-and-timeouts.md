---
type: doc
layout: reference
category: "Coroutine"
title: "取消与超时"
---


<!--- TEST_NAME CancellationGuideTest -->

**目录**

<!--- TOC -->

* [取消与超时](#cancellation-and-timeouts)
  * [取消协程的运行](#cancelling-coroutine-execution)
  * [取消是协作式的](#cancellation-is-cooperative)
  * [使计算代码能够被取消](#making-computation-code-cancellable)
  * [使用 `finally` 语句来关闭资源](#closing-resources-with-finally)
  * [运行无法取消的代码段](#run-non-cancellable-block)
  * [超时](#timeout)

<!--- END -->

## 取消与超时

本章介绍协程的取消与超时.

### 取消协程的运行

在一个长期运行的应用程序中, 你可能会需要在你的后台协程中进行一些更加精细的控制.
比如, 使用者可能已经关闭了某个启动协程的页面, 现在它的计算结果已经不需要了, 因此协程的执行可以取消.
[launch] 函数会返回一个 [Job], 可以通过它来取消正在运行的协程:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        repeat(1000) { i ->
            println("job: I'm sleeping $i ...")
            delay(500L)
        }
    }
    delay(1300L) // 等待一段时间
    println("main: I'm tired of waiting!")
    job.cancel() // 取消 job
    job.join() // 等待 job 结束
    println("main: Now I can quit.")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-01.kt).

这个示例的运行结果如下:

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
```

<!--- TEST -->

一旦 main 函数调用 `job.cancel`, 我们就再也看不到协程的输出了, 因为协程已经被取消了.
还有一个 [Job] 上的扩展函数 [cancelAndJoin],
它组合了 [cancel][Job.cancel] 和 [join][Job.join] 两个操作.

### 取消是协作式的

协程的取消是 _协作式的_. 协程的代码必须与外接配合, 才能够被取消.
`kotlinx.coroutines` 库中的所有挂起函数都是 _可取消的_.
这些函数会检查协程是否被取消, 并在被取消时抛出 [CancellationException] 异常.
但是, 如果一个协程正在进行计算, 并且没有检查取消状态, 那么它是不可被取消的,
比如下面的例子:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (i < 5) { // 一个浪费 CPU 的计算任务循环
            // 每秒输出信息 2 次
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // 等待一段时间
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // 取消 job, 并等待它结束
    println("main: Now I can quit.")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-02.kt).

运行一下这个示例, 我们会看到, 即使在取消之后,
协程还是继续输出 "I'm sleeping" 信息, 直到循环 5 次之后, 协程才自己结束.

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm sleeping 3 ...
job: I'm sleeping 4 ...
main: Now I can quit.
-->

### 使计算代码能够被取消

有两种方法可以让我们的计算代码变得能够被取消.
第一种办法是定期调用一个挂起函数, 检查协程是否被取消. 有一个 [yield] 函数可以用来实现这个目的.
另一种方法是显式地检查协程的取消状态. 我们来试试后一种方法.

我们来把前面的示例程序中的 `while (i < 5)` 改为 `while (isActive)`, 然后再运行, 看看结果如何.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val startTime = System.currentTimeMillis()
    val job = launch(Dispatchers.Default) {
        var nextPrintTime = startTime
        var i = 0
        while (isActive) { // 可被取消的计算循环
            // 每秒输出信息 2 次
            if (System.currentTimeMillis() >= nextPrintTime) {
                println("job: I'm sleeping ${i++} ...")
                nextPrintTime += 500L
            }
        }
    }
    delay(1300L) // 等待一段时间
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // 取消 job, 并等待它结束
    println("main: Now I can quit.")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-03.kt).

你会看到, 现在循环变得能够被取消了. [isActive] 是一个扩展属性,
在协程内部的代码中可以通过 [CoroutineScope] 对象访问到.

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
-->

### 使用 `finally` 语句来关闭资源

可被取消的挂起函数, 在被取消时会抛出 [CancellationException] 异常, 这个异常可以通过通常的方式来处理.
比如, 可以使用 `try {...} finally {...}` 表达式, 或者 Kotlin 的 `use` 函数,
以便在一个协程被取消时执行结束处理:


<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            println("job: I'm running finally")
        }
    }
    delay(1300L) // 等待一段时间
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // 取消 job, 并等待它结束
    println("main: Now I can quit.")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-04.kt).

[join][Job.join] 和 [cancelAndJoin] 都会等待所有的结束处理执行完毕,
因此上面的示例程序会产生这样的输出:

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
main: Now I can quit.
```

<!--- TEST -->

### 运行无法取消的代码段

如果试图在上面示例程序的 `finally` 代码段中使用挂起函数, 会导致 [CancellationException] 异常, 因为执行这段代码的协程已被取消了.
通常, 这不是问题, 因为所有正常的资源关闭操作(关闭文件, 取消任务, 或者关闭任何类型的通信通道)通常都是非阻塞的, 而且不需要用到任何挂起函数.
但是, 在极少数情况下, 如果你需要在已被取消的协程中执行挂起操作,
你可以使用 [withContext] 函数和 [NonCancellable] 上下文,
把相应的代码包装在 `withContext(NonCancellable) {...}` 内,
如下例所示:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch {
        try {
            repeat(1000) { i ->
                println("job: I'm sleeping $i ...")
                delay(500L)
            }
        } finally {
            withContext(NonCancellable) {
                println("job: I'm running finally")
                delay(1000L)
                println("job: And I've just delayed for 1 sec because I'm non-cancellable")
            }
        }
    }
    delay(1300L) // 等待一段时间
    println("main: I'm tired of waiting!")
    job.cancelAndJoin() // 取消 job, 并等待它结束
    println("main: Now I can quit.")
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-05.kt).

<!--- TEST
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
job: And I've just delayed for 1 sec because I'm non-cancellable
main: Now I can quit.
-->

### 超时

取消一个协程最明显的实际理由就是, 它的运行时间超过了某个时间限制.
当然, 你可以手动追踪协程对应的 [Job], 然后启动另一个协程, 在等待一段时间之后取消你追踪的那个协程,
但 Kotlin 已经提供了一个 [withTimeout] 函数来完成这个任务.
请看下面的例子:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    withTimeout(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
    }
//sampleEnd
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-06.kt).

这个例子的运行结果是:

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Exception in thread "main" kotlinx.coroutines.TimeoutCancellationException: Timed out waiting for 1300 ms
```

<!--- TEST STARTS_WITH -->

[withTimeout] 函数抛出的 `TimeoutCancellationException` 异常是 [CancellationException] 的子类.
我们在前面的例子中, 都没有看到过 [CancellationException] 异常的调用栈被输出到控制台.
这是因为, 在被取消的协程中 `CancellationException` 被认为是协程结束的一个正常原因.
但是, 在这个例子中我们直接在 `main` 函数内使用了 `withTimeout`.

由于协程的取消只是一个异常, 因此所有的资源都可以通过通常的方式来关闭.
如果你需要在超时发生时执行一些额外的操作,
可以将带有超时控制的代码封装在一个 `try {...} catch (e: TimeoutCancellationException) {...}` 代码块中,
也可以使用 [withTimeoutOrNull] 函数, 它与 [withTimeout] 函数类似, 但在超时发生时, 它会返回 `null`, 而不是抛出异常:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val result = withTimeoutOrNull(1300L) {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
        "Done" // 协程会在输出这个消息之前被取消
    }
    println("Result is $result")
//sampleEnd
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-07.kt).

这段代码的运行结果不会有异常发生了:

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Result is null
```

<!--- TEST -->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->
[launch]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[cancelAndJoin]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html
[Job.cancel]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html
[Job.join]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CancellationException]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[yield]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html
[isActive]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[withContext]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[NonCancellable]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable.html
[withTimeout]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout.html
[withTimeoutOrNull]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html
<!--- END -->
