[//]: # (title: 取消与超时)

本章介绍协程的取消与超时.

## 取消协程的运行

在一个长期运行的应用程序中, 你可能会需要在你的后台协程中进行一些更加精细的控制.
比如, 使用者可能已经关闭了某个启动协程的页面, 现在它的计算结果已经不需要了, 因此协程的执行可以取消.
[launch] 函数会返回一个 [Job], 可以通过它来取消正在运行的协程:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-01.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-01.kt).
>
{style="note"}

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

## 取消是协作式的

协程的取消是 _协作式的_. 协程的代码必须与外接配合, 才能够被取消.
`kotlinx.coroutines` 库中的所有挂起函数都是 _可取消的_.
这些函数会检查协程是否被取消, 并在被取消时抛出 [CancellationException] 异常.
但是, 如果一个协程正在进行计算, 并且没有检查取消状态, 那么它是不可被取消的,
比如下面的例子:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-02.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-02.kt).
>
{style="note"}

运行一下这个示例, 我们会看到, 即使在取消之后,
协程还是继续输出 "I'm sleeping" 信息, 直到循环 5 次之后, 协程才自己结束.

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm sleeping 3 ...
job: I'm sleeping 4 ...
main: Now I can quit.
```

如果捕获一个 [CancellationException] 然后不再抛出它, 也可以观察到同样的问题:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch(Dispatchers.Default) {
        repeat(5) { i ->
            try {
                // 每秒输出信息 2 次
                println("job: I'm sleeping $i ...")
                delay(500)
            } catch (e: Exception) {
                // 将异常输出到 log
                println(e)
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-03.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-03.kt).
>
{style="note"}

尽管示例中的捕获 `Exception` 是一种反模式, 但在更加微妙的情况下还是会出现这个问题, 比如在使用
[`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html)
函数时, 它不会重新抛出 [CancellationException].

## 使计算代码能够被取消

有两种方法可以让我们的计算代码变得能够被取消.
第一种办法是定期调用一个挂起函数, 检查协程是否被取消. 有一个 [yield] 函数可以用来实现这个目的.
另一种方法是显式地检查协程的取消状态. 我们来试试后一种方法.

我们来把前面的示例程序中的 `while (i < 5)` 改为 `while (isActive)`, 然后再运行, 看看结果如何.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-04.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-04.kt).
>
{style="note"}

你会看到, 现在循环变得能够被取消了. [isActive] 是一个扩展属性,
在协程内部的代码中可以通过 [CoroutineScope] 对象访问到.

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
main: Now I can quit.
```

## 使用 finally 语句来关闭资源

可被取消的挂起函数, 在被取消时会抛出 [CancellationException] 异常, 这个异常可以通过通常的方式来处理.
比如, 可以使用 `try {...} finally {...}` 表达式, 或者 Kotlin 的 `use` 函数,
以便在一个协程被取消时执行结束处理:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-05.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-05.kt).
>
{style="note"}

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

## 运行无法取消的代码段

如果试图在上面示例程序的 `finally` 代码段中使用挂起函数, 会导致 [CancellationException] 异常, 因为执行这段代码的协程已被取消了.
通常, 这不是问题, 因为所有正常的资源关闭操作(关闭文件, 取消任务, 或者关闭任何类型的通信通道)通常都是非阻塞的, 而且不需要用到任何挂起函数.
但是, 在极少数情况下, 如果你需要在已被取消的协程中执行挂起操作,
你可以使用 [withContext] 函数和 [NonCancellable] 上下文,
把相应的代码包装在 `withContext(NonCancellable) {...}` 内,
如下例所示:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-06.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-06.kt).
>
{style="note"}

```text
job: I'm sleeping 0 ...
job: I'm sleeping 1 ...
job: I'm sleeping 2 ...
main: I'm tired of waiting!
job: I'm running finally
job: And I've just delayed for 1 sec because I'm non-cancellable
main: Now I can quit.
```

## 超时

取消一个协程最明显的实际理由就是, 它的运行时间超过了某个时间限制.
当然, 你可以手动追踪协程对应的 [Job], 然后启动另一个协程, 在等待一段时间之后取消你追踪的那个协程,
但 Kotlin 已经提供了一个 [withTimeout] 函数来完成这个任务.
请看下面的例子:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-07.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-07.kt).
>
{style="note"}

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-08.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-08.kt).
>
{style="note"}

这段代码的运行结果不会有异常发生了:

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
Result is null
```

<!--- TEST -->

## 异步的超时与资源管理

<!--
  NOTE: Don't change this section name. It is being referenced to from within KDoc of withTimeout functions.
-->

[withTimeout] 中的超时事件异步于它的代码段中运行的代码, 超时事件可以在任何时刻发生, 甚至刚好在从超时的代码段中返回之前.
如果你在代码段之内打开或获取某种资源, 而且需要在代码段之外关闭或释放这些资源, 那么请牢记这一点.

比如, 我们使用 `Resource` 类模拟一个可关闭的资源, 它只是记录自己被创建了多少次,
在创建时增加 `acquired` 计数器, 并在 `close` 函数中减少计数器.
现在我们来创建很多个协程, 每个协程在 `withTimeout` 代码段的末尾创建一个 `Resource`,  然后在代码段之外释放资源.
我们添加一个小的延迟, 因此更可能在 `withTimeout` 代码段结束之后发生超时, 导致资源泄露.

```kotlin
import kotlinx.coroutines.*

//sampleStart
var acquired = 0

class Resource {
    init { acquired++ } // 获取资源
    fun close() { acquired-- } // 释放资源
}

fun main() {
    runBlocking {
        repeat(10_000) { // 启动 10K 个协程
            launch {
                val resource = withTimeout(60) { // 超时设定为 60 ms
                    delay(50) // 延迟 50 ms
                    Resource() // 获取资源, 然后从 withTimeout 代码段返回这个资源
                }
                resource.close() // 释放资源
            }
        }
    }
    // 在 runBlocking 之外, 所有的协程都已运行结束
    println(acquired) // 输出未被释放的资源数量
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-09.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-09.kt).
>
{style="note"}

<!--- CLEAR -->

运行上面的代码, 你会看到输出结果并不总是 0, 具体情况依赖于你的机器的时间.
你可能需要调整示例代码中的超时设置, 才能看到非 0 的结果.

> 请注意, 这个例子中, 从 10K 个协程中增加和减少 `acquired` 计数器, 完全是线程安全的,
> 因为这个处理永远发生在 `runBlocking` 所使用的同一个线程内.
> 更多细节将在下一章, 关于协程上下文的部分中解释.
>
{style="note"}

这个问题的解决方法是, 可以将资源的引用保存到一个变量中, 而不是从 `withTimeout` 代码段直接返回资源.

```kotlin
import kotlinx.coroutines.*

var acquired = 0

class Resource {
    init { acquired++ } // 获取资源
    fun close() { acquired-- } // 释放资源
}

fun main() {
//sampleStart
    runBlocking {
        repeat(10_000) { // 启动 10K 个协程
            launch {
                var resource: Resource? = null // 这时资源还没有获取
                try {
                    withTimeout(60) { // 超时设定为 60 ms
                        delay(50) // 延迟 50 ms
                        resource = Resource() // 如果获取成功, 将资源保存到变量
                    }
                    // 我们可以在这里对资源进行一些其他操作
                } finally {
                    resource?.close() // 如果获取成功, 释放资源
                }
            }
        }
    }
    // 在 runBlocking 之外, 所有的协程都已运行结束
    println(acquired) // 输出未被释放的资源数量
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-cancel-10.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-cancel-10.kt).
>
{style="note"}

这段示例程序永远会输出 0. 也就是说, 没有发生资源泄露:

```text
0
```

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[cancelAndJoin]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[yield]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html
[isActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[NonCancellable]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/index.html
[withTimeout]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout.html
[withTimeoutOrNull]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html

<!--- END -->
