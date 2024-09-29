<!--- TEST_NAME ExceptionsGuideTest -->

[//]: # (title: 协程的异常处理)

最终更新: %latestDocDate%

本章介绍异常处理, 以及发生异常时的取消.
我们已经知道, 协程被取消时会在挂起点(suspension point)抛出 [CancellationException], 而协程机制忽略会这个异常.
下面我们来看看, 如果在取消过程中发生了异常, 或者同一个协程的多个子协程抛出了异常, 那么会出现什么情况

## 异常的传播(propagation)

协程构建器对于异常的处理有两种风格:
自动传播异常([launch] 构建器), 或者将异常交给使用者处理([async] 和 [produce] 构建器).
如果使用这些构建器创建一个 _根(root)_ 协程, 也就是并不属于其他任何协程的 _子_ 协程,
前一种构建器将异常当作 **未捕获的(uncaught)** 异常, 类似于 Java 的 `Thread.uncaughtExceptionHandler`,
后一种则要求使用者处理最终的异常, 比如使用 [await][Deferred.await] 或 [receive][ReceiveChannel.receive] 来处理异常.
(关于 [produce] 和 [receive][ReceiveChannel.receive] 请参见 [通道(Channel)](channels.md)).

我们通过一个简单的示例程序来演示一下, 我们使用 [GlobalScope] 创建根协程:

> [GlobalScope] 是一个非常精密的 API, 可能会造成严重的影响.
> 需要使用到 `GlobalScope` 的情况非常少, 其中包括为整个应用程序创建一个根协程.
> 因此你需要通过 `@OptIn(DelicateCoroutinesApi::class)` 注解来明确的同意使用 `GlobalScope`.
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

//sampleStart
@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val job = GlobalScope.launch { // 通过 launch 创建根协程
        println("Throwing exception from launch")
        throw IndexOutOfBoundsException() // 这个异常会被 Thread.defaultUncaughtExceptionHandler 输出到控制台
    }
    job.join()
    println("Joined failed job")
    val deferred = GlobalScope.async { // 通过 async 创建根协程
        println("Throwing exception from async")
        throw ArithmeticException() // 这个异常不会被输出, 由使用者调用 await 来得到并处理这个异常
    }
    try {
        deferred.await()
        println("Unreached")
    } catch (e: ArithmeticException) {
        println("Caught ArithmeticException")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-01.kt).
>
{style="note"}

(使用 [调试模式](coroutine-context-and-dispatchers.md#debugging-coroutines-and-threads)时), 这段代码的输出结果是:

```text
Throwing exception from launch
Exception in thread "DefaultDispatcher-worker-2 @coroutine#2" java.lang.IndexOutOfBoundsException
Joined failed job
Throwing exception from async
Caught ArithmeticException
```

<!--- TEST EXCEPTION-->

## CoroutineExceptionHandler

对于 **未捕获的(uncaught)** 异常, 默认的处理方式是输出到控制台, 但也可以自定义如何处理.
_根_ 协程的上下文元素 [CoroutineExceptionHandler] 可以用作这个根协程以及所有子协程的通用的 `catch` 块,
我们可以在这里实现自定义的异常处理逻辑.
它的使用方法类似于 [`Thread.uncaughtExceptionHandler`](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html#setUncaughtExceptionHandler(java.lang.Thread.UncaughtExceptionHandler)).
在 `CoroutineExceptionHandler` 内, 你无法从异常中恢复.
当异常处理器被调用时, 协程已经结束运行, 并返回了相应的异常.
通常, 异常处理器会用来将异常输出到日志, 显示某些错误信息, 结束程序运行, 或重启应用程序.

只有 **未捕获的** 异常 &mdash; 没有被任何其他方式处理的异常, 才会调用 `CoroutineExceptionHandler`.
具体来说, 所有的 _子_ 协程 (在另一个 [Job] 的上下文内创建的协程) 会把它们的异常交给它们的父协程处理,
父协程又会交给自己的父协程, 如此传递, 直到根协程,
因此安装在子协程的上下文中的 `CoroutineExceptionHandler` 不会被使用.
此外, [async] 构建器总是会捕获所有异常, 然后将异常作为函数结果 [Deferred] 对象的内容,
因此它的 `CoroutineExceptionHandler` 同样不会产生任何效果.

> 在监控(supervision)作用范围内运行的协程, 不会将异常传播到它的父协程, 因此属于上述规则的例外情况.
> 详情请参见本章的 [监控(Supervision)](#supervision) 小节.
>
{style="note"}

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception")
    }
    val job = GlobalScope.launch(handler) { // 根协程, 运行在 GlobalScope 内
        throw AssertionError()
    }
    val deferred = GlobalScope.async(handler) { // 也是根协程, 但通过 async 创建, 而不是 launch
        throw ArithmeticException() // 这个异常不会被输出, 由使用者调用 deferred.await() 来得到并处理这个异常
    }
    joinAll(job, deferred)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-02.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
CoroutineExceptionHandler got java.lang.AssertionError
```

<!--- TEST-->

## 取消与异常

协程的取消与异常有着非常紧密的关系.
协程内部使用 `CancellationException` 来实现取消, 这些异常会被所有的异常处理器忽略,
因此它们只能用来在 `catch` 块中输出额外的调试信息.
如果使用 [Job.cancel] 来取消一个协程, 那么协程会终止运行, 但不会取消它的父协程.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-03.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
Cancelling child
Child is cancelled
Parent is not cancelled
```

<!--- TEST-->

如果一个协程遇到了 `CancellationException` 以外的异常, 那么它会使用这个异常来取消自己的父协程.
这种行为不能覆盖, 而且 Kotlin 使用这个机制来实现
[结构化并发](composing-suspending-functions.md#structured-concurrency-with-async)
中的稳定的协程层级关系.
[CoroutineExceptionHandler] 的实现对子协程不会使用.

> 在这些示例程序中, 我们总是在 [GlobalScope] 内创建的协程上安装 [CoroutineExceptionHandler].
> 如果在 main [runBlocking] 的作用范围内启动的协程上安装异常处理器, 是毫无意义的,
> 因为子协程由于异常而终止之后, 主协程一定会被取消, 而忽略它上面安装的异常处理器.
>
{style="note"}

只有当所有的子协程全部终止之后, 最初的异常才会由父协程处理,
请看下面示例程序的演示.

```kotlin
import kotlinx.coroutines.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception")
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-04.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
Second child throws an exception
Children are cancelled, but exception is not handled until all children terminate
The first child finished its non cancellable block
CoroutineExceptionHandler got java.lang.ArithmeticException
```

<!--- TEST-->

## 异常的聚合(aggregation)

如果一个协程的多个子协程都由于发生异常而失败,
通常的规则是 "最先发生的异常优先", 因此第 1 个发生的异常会被处理.
在此之后发生的所有其他异常会被添加到最先发生的异常上, 作为被压制(suppressed)的异常.

<!--- INCLUDE
import kotlinx.coroutines.exceptions.*
-->

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception with suppressed ${exception.suppressed.contentToString()}")
    }
    val job = GlobalScope.launch(handler) {
        launch {
            try {
                delay(Long.MAX_VALUE) // 如果其他兄弟协程由于 IOException 异常而失败, 那么这个协程会被取消
            } finally {
                throw ArithmeticException() // 第二个异常
            }
        }
        launch {
            delay(100)
            throw IOException() // 第一个异常
        }
        delay(Long.MAX_VALUE)
    }
    job.join()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-05.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
CoroutineExceptionHandler got java.io.IOException with suppressed [java.lang.ArithmeticException]
```

<!--- TEST-->

> 注意, 异常聚合机制目前只能在 Java version 1.7+ 以上版本才能正常工作.
> JS 和 原生平台目前暂时不支持异常聚合, 将来会解决这个问题.
>
{style="note"}

协程取消异常是透明的, 默认不会被聚合到其他异常中:

```kotlin
import kotlinx.coroutines.*
import java.io.*

@OptIn(DelicateCoroutinesApi::class)
fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception")
    }
    val job = GlobalScope.launch(handler) {
        val innerJob = launch { // 从这里开始的所有协程都会被取消
            launch {
                launch {
                    throw IOException() // 最初的异常
                }
            }
        }
        try {
            innerJob.join()
        } catch (e: CancellationException) {
            println("Rethrowing CancellationException with original cause")
            throw e // 再次抛出协程被取消的异常, 但仍然是最初的 IOException 被处理
        }
    }
    job.join()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-exceptions-06.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
Rethrowing CancellationException with original cause
CoroutineExceptionHandler got java.io.IOException
```

<!--- TEST-->

## 监控 {id="supervision"}

正如我们前面学到的, 取消是一种双向关系, 它会在整个协程层级关系内传播.
下面我们来看看, 如果需要单向的取消, 会发生什么情况.

这种需求的一个很好的例子就是一个 UI 组件, 在它的作用范围内定义了一个任务.
如果 UI 的任何一个子任务失败, 并不一定有必要取消(最终效果就是杀死) 整个 UI 组件,
但是如果 UI 组件本身被销毁(而且它的任务也被取消了), 那么就有必要终止所有的子任务, 因为子任务的结果已经不再需要了.

另一个例子是, 一个服务器进程启动了多个子任务, 需要 _监控_ 这些子任务的执行,
追踪它们是否失败, 只对那些失败的子任务进行重启.

### 监控任务

[SupervisorJob][SupervisorJob()] 可以用作这类目的.
它与通常的 [Job][Job()] 类似, 唯一的区别在于取消只向下方传播.
我们用下面的示例程序来演示一下:

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val supervisor = SupervisorJob()
    with(CoroutineScope(coroutineContext + supervisor)) {
        // 启动第 1 个子协程 -- 在这个示例程序中, 我们会忽略它的异常 (实际应用中不要这样做!)
        val firstChild = launch(CoroutineExceptionHandler { _, _ ->  }) {
            println("The first child is failing")
            throw AssertionError("The first child is cancelled")
        }
        // 启动第 2 个子协程
        val secondChild = launch {
            firstChild.join()
            // 第 1 个子协程的取消不会传播到第 2 个子协程
            println("The first child is cancelled: ${firstChild.isCancelled}, but the second one is still active")
            try {
                delay(Long.MAX_VALUE)
            } finally {
                // 但监控任务的取消会传播到第 2 个子协程
                println("The second child is cancelled because the supervisor was cancelled")
            }
        }
        // 等待第 1 个子协程失败, 并结束运行
        firstChild.join()
        println("Cancelling the supervisor")
        supervisor.cancel()
        secondChild.join()
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-01.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
The first child is failing
The first child is cancelled: true, but the second one is still active
Cancelling the supervisor
The second child is cancelled because the supervisor was cancelled
```

<!--- TEST-->

### 监控作用范围

对于 *带作用范围* 的并发, 可以使用 [supervisorScope][_supervisorScope] 代替 [coroutineScope][_coroutineScope] 来实现同一目的.
它也只向一个方向传播取消, 并且只在它自身失败的情况下取消所有的子协程.
它在运行结束之前也会等待所有的子协程结束, 和 [coroutineScope][_coroutineScope] 一样.

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    try {
        supervisorScope {
            val child = launch {
                try {
                    println("The child is sleeping")
                    delay(Long.MAX_VALUE)
                } finally {
                    println("The child is cancelled")
                }
            }
            // 使用 yield, 给子协程一个机会运行, 并输出信息
            yield()
            println("Throwing an exception from the scope")
            throw AssertionError()
        }
    } catch(e: AssertionError) {
        println("Caught an assertion error")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-02.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
The child is sleeping
Throwing an exception from the scope
The child is cancelled
Caught an assertion error
```

<!--- TEST-->

#### 被监控的协程中的异常

常规任务与监控任务的另一个重要区别就是对异常的处理方式.
每个子协程都应该通过异常处理机制自行处理它的异常.
区别在于, 子协程的失败不会传播到父协程中.
也就是说, 直接在 [supervisorScope][_supervisorScope] 之内启动的协程, 就象根协程一样,
_会_ 使用安装在其作用范围上的 [CoroutineExceptionHandler],
(详情请参见 [CoroutineExceptionHandler](#coroutineexceptionhandler) 小节).

```kotlin
import kotlin.coroutines.*
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val handler = CoroutineExceptionHandler { _, exception ->
        println("CoroutineExceptionHandler got $exception")
    }
    supervisorScope {
        val child = launch(handler) {
            println("The child throws an exception")
            throw AssertionError()
        }
        println("The scope is completing")
    }
    println("The scope is completed")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-supervision-03.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
The scope is completing
The child throws an exception
CoroutineExceptionHandler got java.lang.AssertionError
The scope is completed
```

<!--- TEST-->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineExceptionHandler]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/index.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[SupervisorJob()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html
[Job()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[_supervisorScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html

<!--- INDEX kotlinx.coroutines.channels -->

[produce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/produce.html
[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html

<!--- END -->
