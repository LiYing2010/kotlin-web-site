<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 取消与超时)

取消允许你在协程完成之前停止它.
它可以停止不再需要的工作, 例如当协程仍在运行时, 用户关闭了窗口, 或者在用户界面中导航离开.
你也可以使用它来提前释放资源, 以及阻止协程在对象销毁后继续访问它们.

> 如果一个长时间运行的协程持续产生值, 那么当其他协程不再需要这些值, 你可以使用取消来停止它, 例如 [管道](channels.md#pipelines) 的情况.
>
{style="tip"}

取消通过 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 句柄工作,
`Job` 表示协程的生命周期, 以及它的父子关系.
`Job` 允许你检查协程是否处于活跃状态, 并允许你取消它, 以及按照 [结构化并发](coroutines-basics.md#coroutine-scope-and-structured-concurrency) 定义的子协程.

## 取消协程 {id="cancel-coroutines"}

在协程的 `Job` 句柄上调用 [`cancel()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/cancel.html)
函数时, 协程会被取消.
[协程构建器函数](coroutines-basics.md#coroutine-builder-functions), 例如 [`.launch()`](coroutines-basics.md#coroutinescope-launch)),
会返回一个 `Job`.
[`.async()`](coroutines-basics.md#coroutinescope-async) 函数返回一个 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/),
它实现了 `Job`, 并支持相同的取消行为.

你可以手动调用 `cancel()` 函数, 这个函数也可以在父协程被取消时, 通过取消的传播, 自动调用.

当协程被取消时, 它在下次检查取消时会抛出 [`CancellationException`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/).
关于这个异常何时发生以及如何发生, 详情请参见 [挂起点(Suspension Point)与取消](#suspension-points-and-cancellation).

> 你可以使用 [`awaitCancellation()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/await-cancellation.html) 函数, 挂起一个协程, 直到它被取消.
>
{style="tip"}

下面是一个示例, 演示如何手动取消协程:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 用作信号, 表示协程已开始运行
        val job1Started = CompletableDeferred<Unit>()

        val job1: Job = launch {
            println("The coroutine has started")

            // 完成 CompletableDeferred, 表示协程已开始运行
            job1Started.complete(Unit)
            try {
                // 无限期挂起
                // 如果没有取消, 这个调用永远不会返回
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")

                // 始终重新抛出取消异常!
                throw e
            }
            println("This line will never be executed")
        }

        // 在取消 job1 之前, 等待它启动
        job1Started.await()

        // 取消协程, delay() 会抛出 CancellationException
        job1.cancel()

        // async 返回一个 Deferred 句柄, 它继承自 Job
        val job2 = async {
            // 如果协程在其代码体开始执行之前被取消,
            // 则这一行可能不会打印
            println("The second coroutine has started")

            try {
                // 等同于 delay(Duration.INFINITE)
                // 挂起, 直到这个协程被取消
                awaitCancellation()

            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    // 协程构建器, 例如 withContext() 或 coroutineScope(),
    // 会等待所有子协程完成, 即使子协程被取消
    println("All coroutines have completed")
}
//sampleEnd
```
{kotlin-runnable="true" id="manual-cancellation-example"}

在这个示例中, [`CompletableDeferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-completable-deferred/)
用作信号, 表示协程已开始运行.
协程在开始执行时调用 `complete()`, 而 `await()` 直到 `CompletableDeferred` 完成后才返回.
这样, 取消只在协程开始运行后才发生.
由 `.async()` 创建的协程没有这个检查, 因此它可能在代码块内的代码运行之前就被取消.

> 捕获 `CancellationException` 可能会破坏取消的传播.
> 如果必须捕获这个异常, 请重新抛出它, 让取消在协程层次结构中正确的传播.
>
> 详情请参见 [协程的异常处理](exception-handling.md#cancellation-and-exceptions).
>
{style="warning"}

### 取消的传播 {id="cancellation-propagation"}

[结构化并发](coroutines-basics.md#coroutine-scope-and-structured-concurrency)
会确保取消一个协程时也会取消它的所有子协程.
这可以防止父协程已经停止后子协程继续工作.

下面是一个示例:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        // 用作信号, 表示子协程已启动
        val childrenLaunched = CompletableDeferred<Unit>()

        // 启动两个子协程
        val parentJob = launch {
            launch {
                println("Child coroutine 1 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 1 has been canceled")
                }
            }
            launch {
                println("Child coroutine 2 has started running")
                try {
                    awaitCancellation()
                } finally {
                    println("Child coroutine 2 has been canceled")
                }
            }
            // 完成 CompletableDeferred, 表示子协程已启动
            childrenLaunched.complete(Unit)
        }
        // 等待父协程发出信号, 表示它已启动所有子协程
        childrenLaunched.await()

        // 取消父协程, 这会取消它的所有子协程
        parentJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="cancellation-propagation-example"}

在这个示例中, 每个子协程使用 [`finally` 代码块](exceptions.md#the-finally-block),
因此其中的代码会在协程被取消时运行.
这里, `CompletableDeferred` 信号表示子协程在被取消之前已经启动, 但不保证它们已经开始运行.
如果它们先被取消, 则不会打印任何内容.

## 让协程响应取消 {id="cancellation-is-cooperative"}

在 Kotlin 中, 协程的取消是 _协作式的_.
也就是说, 协程只有在通过 [挂起](#suspension-points-and-cancellation) 或 [明确的检查取消](#check-for-cancellation-explicitly) 来协作时,
才能响应取消.

在本节中, 你将学习如何创建可取消的协程.

### 挂起点(Suspension Point)与取消 {id="suspension-points-and-cancellation"}

当协程被取消时, 它会继续运行, 直到到达代码中可能挂起的位置, 也称为 _挂起点(Suspension Point)_.
如果协程在这里挂起, 挂起函数会检查协程是否已被取消.
如果已被取消, 协程辉停止, 并抛出 `CancellationException` 异常.

对 `suspend` 函数的调用是一个挂起点, 但它并不总是挂起.
例如, 当等待 `Deferred` 结果时, 只有在这个 `Deferred` 还没有完成时, 协程才会挂起.

下面的示例, 使用了常用的挂起函数, 这些函数会挂起, 使协程能够检查取消, 并在已取消时停止:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.channels.Channel
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJobs = listOf(
            launch {
                // 挂起, 直到被取消
                awaitCancellation()
            },
            launch {
                // 挂起, 直到被取消
                delay(Duration.INFINITE)
            },
            launch {
                val channel = Channel<Int>()
                // 挂起, 等待一个永远不会发送的值
                channel.receive()
            },
            launch {
                val deferred = CompletableDeferred<Int>()
                // 挂起, 等待一个永远不会完成的值
                deferred.await()
            },
            launch {
                val mutex = Mutex(locked = true)
                // 挂起, 等待一个永远保持锁定的互斥锁 
                mutex.lock()
            }
        )

        // 给子协程时间启动并挂起
        delay(100.milliseconds)

        // 取消所有子协程
        childJobs.forEach { it.cancel() }
    }
    println("All child jobs completed!")
}
```
{kotlin-runnable="true" id="suspension-points-example"}

> `kotlinx.coroutines` 库中所有的挂起函数, 都会与取消协作, 因为它们在内部使用 [`suspendCancellableCoroutine()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/suspend-cancellable-coroutine.html),
> 这个函数会在协程挂起时检查取消.
> 相反, 使用 [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html)
> 的自定义挂起函数, 不会响应取消.
>
{style="tip"}

### 明确的检查取消 {id="check-for-cancellation-explicitly"}

如果协程长时间不 [挂起](#suspension-points-and-cancellation), 除非它明确的检查取消, 否则被取消时不会停止.

要检查取消, 请使用以下 API:

* [`isActive`](#isactive) 属性, 如果协程被取消, 则为 `false`.
* [`ensureActive()`](#ensureactive) 函数, 如果协程被取消, 立即抛出 `CancellationException`.
* [`yield()`](#yield) 函数, 挂起协程, 释放线程, 并给其他协程在这个线程上运行的机会.
  挂起协程让它能够检查取消, 如果被取消, 则抛出 `CancellationException`.

如果你的协程在挂起点之间长时间运行, 或者不太可能在挂起点挂起, 这些 API 非常有用.

#### isActive {id="isactive"}

在长时间运行的计算中, 请使用 [`isActive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/is-active.html) 属性, 定期检查取消.
当协程不再活跃时, 这个属性为 `false`, 当协程不再需要继续操作时, 你可以使用这个属性优雅的停止协程:

下面是一个示例:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.random.Random

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val unsortedList = MutableList(10) { Random.nextInt() }

        // 启动一个长时间运行的计算
        val listSortingJob = launch {
            var i = 0

            // 在协程保持活跃时, 反复对列表排序
            while (isActive) {
                unsortedList.sort()
                ++i
            }
            println(
                "Stopped sorting the list after $i iterations"
            )
        }
        // 对列表排序 100 毫秒, 然后认为排序已经足够好
        delay(100.milliseconds)

        // 当结果足够好时, 取消排序
        listSortingJob.cancel()

        // 在访问共享列表之前, 等待排序协程结束, 以避免数据竞争
        listSortingJob.join()
        println("The list is probably sorted: $unsortedList")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="isactive-example"}

在这个示例中, [`join()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html)
函数挂起协程, 直到它结束. 这样可以确保排序协程仍在运行时不会访问列表.

> 你可以使用 [`cancelAndJoin()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-and-join.html)
> 函数, 通过一次调用取消协程并等待它结束.
>
{style="note"}

#### ensureActive() {id="ensureactive"}

使用 [`ensureActive()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html)
函数检查取消, 如果协程已被取消, 抛出 `CancellationException`, 停止当前计算:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            var start = 0
            try {
                while (true) {
                    ++start
                    // 检查当前数字的 Collatz 猜想
                    var n = start
                    while (n != 1) {
                        // 如果协程已被取消, 则抛出 CancellationException
                        ensureActive()
                        n = if (n % 2 == 0) n / 2 else 3 * n + 1
                    }
                }
            } finally {
                println("Checked the Collatz conjecture for 0..${start-1}")
            }
        }
        // 运行计算 100 毫秒
        delay(100.milliseconds)

        // 取消协程
        childJob.cancel()
    }
}
```
{kotlin-runnable="true" id="ensurective-example"}

#### yield() {id="yield"}

[`yield()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/yield.html)
函数挂起协程, 并在恢复前检查取消.
如果不挂起, 同一线程上的协程会顺序运行.

使用 `yield`, 可以在一个协程完成之前, 允许其他协程在同一线程或线程池上运行:

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() {
    // runBlocking 使用当前线程运行所有协程
    runBlocking {
        val coroutineCount = 5
        repeat(coroutineCount) { coroutineIndex ->
            launch {
                val id = coroutineIndex + 1
                repeat(5) { iterationIndex ->
                    val iteration = iterationIndex + 1
                    // 暂时挂起, 给其他协程运行的机会
                    // 如果没有机制, 所有的协程会顺序运行
                    yield()
                    // 打印协程索引和迭代索引
                    println("$id * $iteration = ${id * iteration}")
                }
            }
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="yield-example"}

在这个示例中, 每个协程使用 `yield()`, 让其他协程在迭代之间运行.

### 在协程被取消时, 中断阻塞代码 {id="interrupt-blocking-code-when-coroutines-are-canceled"}

在 JVM 上, 某些函数, 例如 `Thread.sleep()` 或 `BlockingQueue.take()`, 可以阻塞当前线程.
这些阻塞函数可以中断, 这样就能提前停止它们.
但是, 当从协程中调用它们时, 取消不会中断线程.

要在取消协程时中断线程, 请使用 [`runInterruptible()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-interruptible.html) 函数:

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun main() {
    withContext(Dispatchers.Default) {
        val childStarted = CompletableDeferred<Unit>()
        val childJob = launch {
            try {
                // 取消会触发线程中断
                runInterruptible {
                    childStarted.complete(Unit)
                    try {
                        // 阻塞当前线程很长时间
                        Thread.sleep(Long.MAX_VALUE)
                    } catch (e: InterruptedException) {
                        println("Thread interrupted (Java): $e")
                        throw e
                    }
                }
            } catch (e: CancellationException) {
                println("Coroutine canceled (Kotlin): $e")
                throw e
            }
        }
        childStarted.await()

        // 取消协程, 并中断运行 Thread.sleep() 的线程
        childJob.cancel()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="interrupt-cancellation-example"}

## 取消协程时, 安全的处理值 {id="handle-values-safely-when-canceling-coroutines"}

当一个挂起的协程被取消时, 它会恢复运行, 并抛出 `CancellationException` 异常, 而不是返回任何值, 即使这些值已经可用.
这种行为称为 _立即取消(Prompt Cancellation)_.
它能够防止你的代码在已取消的协程作用域中继续执行, 例如更新已经关闭的屏幕.

下面是一个示例:

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// 定义一个协程作用域, 它使用 UI 线程
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            val contents = withContext(Dispatchers.IO) {
                Files.newBufferedReader(
                    path, Charset.forName("US-ASCII")
                ).use {
                    it.readLines()
                }
            }
            // 在这里可以安全的调用 updateUi,
            // 如果取消, withContext() 不会返回任何值
            updateUi(contents)
        }
    }

    // 如果在用户离开屏幕后调用, 会抛出异常
    private fun updateUi(contents: List<String>) {
        contents.forEach { line -> addOneLineToUi(line) }
    }

    private fun addOneLineToUi(line: String) {
        // 这里需要向 UI 添加一行内容
    }

    // 只能从 UI 线程调用
    fun leaveScreen() {
        // 离开屏幕时取消作用域
        // 你不能再更新 UI 了
        scope.cancel()
    }
}
```

在这个示例中, `withContext(Dispatchers.IO)` 与取消协作, 如果 `leaveScreen()` 函数在协程返回文件内容之前就取消了协程,
则防止 `updateUI()` 运行.

虽然立即取消能够防止在值不再有效后使用它们, 但它也可能在重要的值仍在使用时停止你的代码, 这可能导致丢失这些值.
如果协程接收到一个值, 例如 `AutoCloseable` 资源, 但在执行关闭它的代码之前, 协程被取消, 就会发生这种情况.
为了防止这种情况, 请将清理逻辑放在, 即使接收值的协程被取消时, 也确保能够运行的地方.

下面是一个示例:

```kotlin
import java.nio.file.*
import java.nio.charset.*
import kotlinx.coroutines.*
import java.io.*

// scope 是使用 UI 线程的协程作用域
class ScreenWithFileContents(private val scope: CoroutineScope) {
    fun displayFile(path: Path) {
        scope.launch {
            // 将 reader 保存在变量中, 让 finally 代码块能够关闭它
            var reader: BufferedReader? = null

            try {
                withContext(Dispatchers.IO) {
                    reader = Files.newBufferedReader(
                        path, Charset.forName("US-ASCII")
                    )
                }
                // 在 withContext() 完成后, 使用保存的 reader
                updateUi(reader!!)
            } finally {
                // 即使协程被取消, 也确保关闭 reader
                reader?.close()
            }
        }
    }

    private suspend fun updateUi(reader: BufferedReader) {
        // 显示文件内容
        while (true) {
            val line = withContext(Dispatchers.IO) {
                reader.readLine()
            }
            if (line == null)
                break
            addOneLineToUi(line)
        }
    }

    private fun addOneLineToUi(line: String) {
        // 这里需要向 UI 添加一行内容
    }

    // 只能从 UI 线程调用
    fun leaveScreen() {
        // 离开屏幕时取消作用域
        // 你不能再更新 UI 了
        scope.cancel()
    }
}
```

在这个示例中, 将 `BufferedReader` 保存在变量中, 并在 `finally` 代码块中关闭它, 这样可以确保, 即使协程被取消, 也会释放资源.

### 运行不可取消的代码块 {id="run-non-cancelable-blocks"}

你可以防止取消影响协程的某些部分.
方法是, 将 [`NonCancellable`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/) 作为参数,
传递给 `withContext()` 协程构建器函数.

> 不要将 `NonCancellable` 与其他协程构建器一起使用, 例如 `.launch()` 或 `.async()`.
> 这样做会破坏父子关系, 从而破坏结构化并发.
>
{style="warning"}

即使协程在结束之前被取消, 如果你需要确保某些操作必须完成, 例如使用挂起的 `close()` 函数关闭资源, `NonCancellable` 非常有用.

下面是一个示例:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
val serviceStarted = CompletableDeferred<Unit>()

fun startService() {
    println("Starting the service...")
    serviceStarted.complete(Unit)
}

suspend fun shutdownServiceAndWait() {
    println("Shutting down...")
    delay(100.milliseconds)
    println("Successfully shut down!")
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val childJob = launch {
            startService()
            try {
                awaitCancellation()
            } finally {
                withContext(NonCancellable) {
                    // 如果没有 withContext(NonCancellable),
                    // 这个函数不会完成, 因为协程已经被取消
                    shutdownServiceAndWait()
                }
            }
        }
        serviceStarted.await()
        childJob.cancel()
    }
    println("Exiting the program")
}
//sampleEnd
```
{kotlin-runnable="true" id="noncancellable-blocks-example"}

## 超时 {id="timeout"}

超时, 允许你在指定的时间之后自动取消协程.
对于停止耗时过长的操作, 超时很有用, 有助于让应用程序保持响应, 避免不必要的阻塞线程.

要指定超时, 请使用 [`withTimeoutOrNull()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html) 函数,
指定 `Duration` 参数:

```kotlin
import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

//sampleStart
suspend fun slowOperation(): Int {
    try {
        delay(300.milliseconds)
        return 5
    } catch (e: CancellationException) {
        println("The slow operation has been canceled: $e")
        throw e
    }
}

suspend fun fastOperation(): Int {
    try {
        delay(15.milliseconds)
        return 14
    } catch (e: CancellationException) {
        println("The fast operation has been canceled: $e")
        throw e
    }
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        val slow = withTimeoutOrNull(100.milliseconds) {
            slowOperation()
        }
        println("The slow operation finished with $slow")
        val fast = withTimeoutOrNull(100.milliseconds) {
            fastOperation()
        }
        println("The fast operation finished with $fast")
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="timeout-example"}

如果运行时间超过了指定的 `Duration`, `withTimeoutOrNull()` 返回 `null`.
