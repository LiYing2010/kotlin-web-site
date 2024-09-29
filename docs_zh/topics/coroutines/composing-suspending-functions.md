[//]: # (title: 挂起函数(Suspending Function)的组合)

最终更新: %latestDocDate%

本章介绍将挂起函数组合起来的几种不同方式.

## 默认的连续执行 {id="sequential-by-default"}

假设我们有两个挂起函数, 代表在其他地方进行一些有用的工作, 比如调用某种远程服务或运算.
我们先假定这两个函数都是有真实用途的, 但在示例程序中, 我们的挂起函数只是延迟 1 秒钟:

```kotlin
suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假设我们在这里做了某些有用的工作
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假设我们在这里也做了某些有用的工作
    return 29
}
```

如果我们需要 _连续地_ 调用这两个函数 &mdash; 首先需要调用 `doSomethingUsefulOne` _然后再调用_
`doSomethingUsefulTwo`, 并且计算这两个函数结果的总和, 那么我们应该怎么做呢?
实际应用中, 我们可能需要使用第一个函数的结果来做一些判断, 决定是否需要调用第二个函数, 或者决定应该如何调用第二个函数.

我们使用一个通常的连续调用, 因为在协程内的代码, 就好象通常的代码一样, 默认就是 _连续_ 的.
下面的示例程序会测量执行两个挂起函数时的总执行时间, 演示两个挂起函数执行时的连续行:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = doSomethingUsefulOne()
        val two = doSomethingUsefulTwo()
        println("The answer is ${one + two}")
    }
    println("Completed in $time ms")
//sampleEnd
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假设我们在这里做了某些有用的工作
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假设我们在这里也做了某些有用的工作
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-01.kt).
>
{style="note"}

这个示例程序的输出大致会是:

```text
The answer is 42
Completed in 2017 ms
```

<!--- TEST ARBITRARY_TIME -->

## 使用 async 并发执行 {id="concurrent-using-async"}

如果在 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo` 的调用之间不存在依赖关系,
我们想要 _并发地_ 执行这两个函数, 以便更快得到结果, 那么应该怎么做? 这时 [async] 可以帮助我们.

概念上来说, [async] 就好象 [launch] 一样.
它启动一个独立的协程, 也就是一个轻量的线程, 与其他所有协程一起并发执行.
区别在于,  `launch` 返回一个 [Job], 其中不带有结果值, 而 `async` 返回一个 [Deferred] &mdash;
一个轻量的, 非阻塞的 future, 代表一个未来某个时刻可以得到的结果值.
你可以对一个延期值(deferred value)使用 `.await()` 来得到它最终的计算结果,
但 `Deferred` 同时也是一个 `Job`, 因此如果需要的话, 你可以取消它.

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async { doSomethingUsefulOne() }
        val two = async { doSomethingUsefulTwo() }
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假设我们在这里做了某些有用的工作
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假设我们在这里也做了某些有用的工作
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-02.kt).
>
{style="note"}

这个示例程序的输出大致会是:

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

执行速度快了 2 倍, 因为两个协程的执行是并发的.
注意, 协程的并发总是需要明确指定的.

## 延迟启动的(Lazily started) async {id="lazily-started-async"}

将可选的 `start` 参数设置为 [CoroutineStart.LAZY], 可以让 [async] 延迟启动.
这种模式下, 只有在通过 [await][Deferred.await] 访问协程的计算结果时,
或者调用协程的 `Job` 的 [start][Job.start] 函数时, 才会真正启动协程.
试着运行一下下面的示例程序:

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
        val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
        // 执行某些计算
        one.start() // 启动第一个协程
        two.start() // 启动第二个协程
        println("The answer is ${one.await() + two.await()}")
    }
    println("Completed in $time ms")
//sampleEnd
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假设我们在这里做了某些有用的工作
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假设我们在这里也做了某些有用的工作
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-03.kt).
>
{style="note"}

这个示例程序的输出大致会是:

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

在上面的示例程序中, 我们定义了两个协程, 但并没有开始执行,
程序员负责决定什么时候调用 [start][Job.start] 函数来明确地启动协程的执行.
我们先启动了 `one`, 然后启动了 `two`, 然后等待两个协程分别结束.

注意, 如果我们在 `println` 内调用 [await][Deferred.await], 而在此之前没有对各个协程调用 [start][Job.start],
那么会导致两个协程的执行成为连续的, 而不是并行的,
因为 [await][Deferred.await] 会启动协程并一直等待执行结束, 这并不是我们使用延迟加载功能时期望的效果.
如果计算中使用到的值来自挂起函数的话, 可以使用 `async(start = CoroutineStart.LAZY)` 来代替标准的 `lazy` 函数.

## async 风格的函数 {id="async-style-functions"}

> 在这个例子中展示的这种使用异步函数的编程风格只是为了演示目的, 但在其他编程语言中是一种很流行的风格.
> 我们 **强烈不鼓励** 在 Kotlin 协程中使用这种编程风格, 具体原因将在下文中解释.
>
{style="note"}

我们可以定义一个 async 风格的函数, 它使用一个 [GlobalScope] 引用,
通过 [async] 协程构建器来 _异步地_ 调用 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo`,
以这种方式来关闭结构化的同步.
我们将这类函数的名称加上 "...Async" 后缀, 明确表示这些函数只负责启动异步的计算工作,
函数的使用者需要通过函数返回的延期值(deferred value)来得到计算结果.

> [GlobalScope] 是一个非常精密的 API, 可能会造成严重的影响, 详情会在下文中解释
> 因此你需要通过 `@OptIn(DelicateCoroutinesApi::class)` 注解来明确的同意使用 `GlobalScope`.
>
{style="note"}

```kotlin
// somethingUsefulOneAsync 函数的返回值类型是 Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

// somethingUsefulTwoAsync 函数的返回值类型是 Deferred<Int>
@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}
```

注意, 这些 `xxxAsync` 函数 **不是** _挂起_ 函数. 这些函数可以在任何地方使用.
但是, 使用这些函数总是会隐含着异步执行(这里的意思是 _并发_)它内部的动作.

下面的示例程序演示在协程之外使用这类函数:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

//sampleStart
// 注意, 这个示例中我们没有在 `main` 的右侧使用 `runBlocking`
fun main() {
    val time = measureTimeMillis {
        // 我们可以在协程之外初始化异步操作
        val one = somethingUsefulOneAsync()
        val two = somethingUsefulTwoAsync()
        // 但是等待它的执行结果必然使用挂起或阻塞.
        // 这里我们使用 `runBlocking { ... }`, 在等待结果时阻塞主线程
        runBlocking {
            println("The answer is ${one.await() + two.await()}")
        }
    }
    println("Completed in $time ms")
}
//sampleEnd

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulOneAsync() = GlobalScope.async {
    doSomethingUsefulOne()
}

@OptIn(DelicateCoroutinesApi::class)
fun somethingUsefulTwoAsync() = GlobalScope.async {
    doSomethingUsefulTwo()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假设我们在这里做了某些有用的工作
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假设我们在这里也做了某些有用的工作
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-04.kt).
>
{style="note"}

```text
The answer is 42
Completed in 1085 ms
```

考虑一下, 如果在 `val one = somethingUsefulOneAsync()` 和 `one.await()` 表达式之间,
代码存在某种逻辑错误, 程序抛出了一个异常, 程序的操作中止了, 那么会怎么样.
通常来说, 一个全局的错误处理器可以捕获这个异常, 将这个错误输出到 log, 报告给开发者, 但程序仍然可以继续运行, 执行其他的操作.
但在这里, 尽管负责启动 `somethingUsefulOneAsync` 的那部分程序其实已经中止了, 但它仍然会在后台继续运行.
如果使用结构化并发(structured concurrency)方式话, 就不会发生这种问题, 下面我们来介绍这种方式.

## 使用 async 的结构化并发 {id="structured-concurrency-with-async"}

我们沿用 [使用 async 并发执行](#concurrent-using-async) 中的示例程序,
从中抽取一个函数, 并发地执行 `doSomethingUsefulOne` 和 `doSomethingUsefulTwo`, 并返回这两个函数结果的和.
由于 [async] 协程构建器被定义为 [CoroutineScope] 上的扩展函数,
因此我们使用这个函数时就需要在作用范围内存在 [CoroutineScope], [coroutineScope][_coroutineScope] 函数可以为我们提供 [CoroutineScope]:

```kotlin
suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
```

通过这种方式, 如果 `concurrentSum` 函数内的某个地方发生错误, 抛出一个异常,
那么在这个函数的作用范围内启动的所有协程都会被取消.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlin.system.*

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        println("The answer is ${concurrentSum()}")
    }
    println("Completed in $time ms")
//sampleEnd
}

suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L) // 假设我们在这里做了某些有用的工作
    return 13
}

suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L) // 假设我们在这里也做了某些有用的工作
    return 29
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-05.kt).
>
{style="note"}

上面的 `main` 函数的输出结果如下, 显然可以看出, 两个函数的执行仍然是并发的:

```text
The answer is 42
Completed in 1017 ms
```

<!--- TEST ARBITRARY_TIME -->

通过协程的父子层级关系, 取消总是会层层传递到所有的子协程, 以及子协程的子协程:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
    try {
        failedConcurrentSum()
    } catch(e: ArithmeticException) {
        println("Computation failed with ArithmeticException")
    }
}

suspend fun failedConcurrentSum(): Int = coroutineScope {
    val one = async<Int> {
        try {
            delay(Long.MAX_VALUE) // 模拟一个长时间的计算过程
            42
        } finally {
            println("First child was cancelled")
        }
    }
    val two = async<Int> {
        println("Second child throws an exception")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-compose-06.kt).
>
{style="note"}

注意, 由于子协程中的某一个(也就是, `two`)失败, 第一个 `async`, 以及等待子协程的父协程都会被取消:
```text
Second child throws an exception
First child was cancelled
Computation failed with ArithmeticException
```

<!--- TEST -->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[async]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html
[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Deferred]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/index.html
[CoroutineStart.LAZY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-start/-l-a-z-y/index.html
[Deferred.await]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html
[Job.start]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/start.html
[GlobalScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html

<!--- END -->
