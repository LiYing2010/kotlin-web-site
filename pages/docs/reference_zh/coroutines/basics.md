---
type: doc
layout: reference
category: "Coroutine"
title: "基本概念"
---


<!--- TEST_NAME BasicsGuideTest -->

**目录**

<!--- TOC -->

* [协程的基本概念](#coroutine-basics)
  * [你的第一个协程](#your-first-coroutine)
  * [联通阻塞与非阻塞的世界](#bridging-blocking-and-non-blocking-worlds)
  * [等待一个任务完成](#waiting-for-a-job)
  * [结构化的并发](#structured-concurrency)
  * [作用范围构建器](#scope-builder)
  * [抽取函数(Extract Function)的重构](#extract-function-refactoring)
  * [协程是非常轻量的](#coroutines-are-light-weight)
  * [全局协程类似于守护线程(Daemon Thread)](#global-coroutines-are-like-daemon-threads)

<!--- END -->

## 协程的基本概念

本章我们介绍协程的基本概念.

### 你的第一个协程

请运行以下代码:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() {
    GlobalScope.launch { // 在后台启动一个新的协程, 然后继续执行当前程序
        delay(1000L) // 非阻塞, 等待 1 秒 (默认的时间单位是毫秒)
        println("World!") // 等待完成后输出信息
    }
    println("Hello,") // 当协程在后台等待时, 主线程继续执行
    Thread.sleep(2000L) // 阻塞主线程 2 秒, 保证 JVM 继续存在
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt).

你将看到以下运行结果:

```text
Hello,
World!
```

<!--- TEST -->

本质上来说, 协程就是轻量级的线程.
在某个 [CoroutineScope] 的上下文环境内, 协程通过 _协程构建器_ [launch] 来启动.
在上面的示例中, 我们在 [GlobalScope] 内启动了新的协程,
也就是说, 新协程的生命周期只受整个应用程序的生命周期限制.

你可以把 `GlobalScope.launch { ... }` 替换为 `thread { ... }`,
把 `delay(...)` 替换为 `Thread.sleep(...)`, 运行的结果仍然一样.
请自己试验一下 (不要忘记 import `kotlin.concurrent.thread`).

如果只把 `GlobalScope.launch` 替换为 `thread`, 编译器会报告以下错误:

```
Error: Kotlin: Suspend functions are only allowed to be called from a coroutine or another suspend function
```

这是因为 [delay] 是一个特殊的 _挂起函数(suspending function)_,
它不会阻塞进程, 但会 _挂起_ 协程, 因此它只能在协程中使用.

### 联通阻塞与非阻塞的世界

在我们的第一个示例程序中, 我们在同一块代码中混合使用了 _非阻塞_ 的 `delay(...)` 函数和 _阻塞_ 的 `Thread.sleep(...)` 函数.
因此很容易搞不清楚哪个函数是阻塞的, 哪个函数不是阻塞的.
所以我们通过 [runBlocking] 协程构建器来明确指定使用阻塞模式:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() {
    GlobalScope.launch { // 在后台启动一个新的协程, 然后继续执行当前程序
        delay(1000L)
        println("World!")
    }
    println("Hello,") // 主线程在这里立即继续执行
    runBlocking {     // 但这个表达式会阻塞主线程
        delay(2000L)  // ... 我们在这里等待 2 秒, 保证 JVM 继续存在
    }
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt).

<!--- TEST
Hello,
World!
-->

这样修改后的执行结果是一样的, 但这段代码只使用非阻塞的 [delay] 函数.
在主线程中, 调用 `runBlocking` 会 _阻塞_, 直到 `runBlocking` 内部的协程执行完毕.

我们也可以用更符合 Kotlin 语言编程习惯的方式重写这个示例程序,
用 `runBlocking` 来包装主函数的运行:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> { // 启动主协程
    GlobalScope.launch { // 在后台启动一个新的协程, 然后继续执行当前程序
        delay(1000L)
        println("World!")
    }
    println("Hello,") // 主协程在这里立即继续执行
    delay(2000L)      // 等待 2 秒, 保证 JVM 继续存在
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt).

<!--- TEST
Hello,
World!
-->

这里 `runBlocking<Unit> { ... }` 起一种适配器的作用, 用来启动最上层的主协程.
我们明确指定了返回值类型为 `Unit`, 因为 Kotlin 语言中, 语法正确的 `main` 函数必须返回 `Unit`.

对挂起函数编写单元测试也可以使用这种方式:

<!--- INCLUDE
import kotlinx.coroutines.*
-->

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyTest {
    @Test
    fun testMySuspendingFunction() = runBlocking<Unit> {
        // 在这里, 我们可以根据需要通过任何断言的方式来使用挂起函数
    }
}
```

</div>

<!--- CLEAR -->

### 等待一个任务完成

当其他协程正在工作时, 等待一段固定的时间, 这是一种不太好的方案.
下面我们(以非阻塞的方式)明确地等待我们启动的后台 [Job] 执行完毕:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = GlobalScope.launch { // 启动一个新的协程, 并保存它的执行任务的引用
        delay(1000L)
        println("World!")
    }
    println("Hello,")
    job.join() // 等待, 直到子协程执行完毕
//sampleEnd
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt).

<!--- TEST
Hello,
World!
-->

这样修改后, 执行结果仍然完全一样,
但主协程的代码不必尝试等待一个确定的, 比后台任务运行时间更长的时间. 这样就好多了.

### 结构化的并发

实际使用协程时, 我们还需要一些其他的东西.
当我们使用 `GlobalScope.launch` 时, 我们创建了一个顶级的协程. 虽然它是轻量的, 但它运行时还是会消耗一些内存资源.
如果我们忘记保存一个新启动的协程的引用, 协程仍然会运行.
假如协程中的代码挂起(比如, 我们错误地等待了一个很长的时间), 那么会怎么样, 如果我们启动了太多的协程, 耗尽了内存, 那么会怎么样?
不得不手工保存所有启动的协程的引用, 然后 [join][Job.join] 所有这些协程, 这样的编程方式是很容易出错的.

我们有更好的解决方案. 我们可以在代码中使用结构化的并发.
我们可以在协程需要工作的那个特定的作用范围内启动协程,
而不是象我们通常操作线程那样(线程总是全局的), 在 [GlobalScope] 内启动协程.

在我们的示例程序中, 有一个 `main` 函数, 它使用 [runBlocking] 协程构建器变换成了一个协程.
所有的协程构建器, 包括 `runBlocking`, 都会向它的代码段的作用范围添加一个 [CoroutineScope] 的实例.
我们在这个作用范围内启动协程, 而不需要明确地 `join` 它们,
因为外层协程 (在我们的示例程序中就是 `runBlocking`) 会等待它的作用范围内启动的所有协程全部完成.
因此, 我们可以把示例程序写得更简单一些:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { // this: CoroutineScope
    launch { // 在 runBlocking 的作用范围内启动一个新的协程
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt).

<!--- TEST
Hello,
World!
-->

### 作用范围(Scope)构建器

除了各种构建器提供的协程作用范围之外, 还可以使用 [coroutineScope][_coroutineScope] 构建器来自行声明作用范围.
这个构建器可以创建一个新的协程作用范围, 并等待在这个范围内启动的所有子协程运行结束.

[runBlocking] 和 [coroutineScope][_coroutineScope] 看起来很类似, 因为它们都会等待自己的代码段以及所有的子任务执行完毕.
主要区别是, [runBlocking] 方法为了等待任务结束, 会 _阻塞_ 当前线程,
而 [coroutineScope][_coroutineScope] 只会挂起协程, 而低层的线程可以被用作其他用途.
由于这种区别, [runBlocking] 是一个通常的函数, 而 [coroutineScope][_coroutineScope] 是一个挂起函数.

具体情况请看下面的示例程序:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { // this: CoroutineScope
    launch {
        delay(200L)
        println("Task from runBlocking")
    }

    coroutineScope { // 创建一个协程作用范围
        launch {
            delay(500L)
            println("Task from nested launch")
        }

        delay(100L)
        println("Task from coroutine scope") // 在嵌套的 launch 之前, 会输出这一行
    }

    println("Coroutine scope is over") // 直到嵌套的 launch 运行结束后, 才会输出这一行
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt).

<!--- TEST
Task from coroutine scope
Task from runBlocking
Task from nested launch
Coroutine scope is over
-->

注意,  "Task from coroutine scope" 消息输出之后(这时正在等待嵌套的 launch)
立刻就会执行并输出 "Task from runBlocking" — 即使 [coroutineScope][_coroutineScope] 还没有结束.

### 抽取函数(Extract Function)的重构

下面我们把 `launch { ... }` 之内的代码抽取成一个独立的函数.
如果在 IDE 中对这段代码进行一个 "Extract function" 重构操作, 你会得到一个带 `suspend` 修饰符的新函数.
这就是你的第一个 _挂起函数_. 在协程内部可以象使用普通函数那样使用挂起函数, 但挂起函数与普通函数的不同在于,
它们又可以使用其他挂起函数(比如下面的例子中使用的 `delay` 函数)来 _挂起_ 当前协程的运行.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch { doWorld() }
    println("Hello,")
}

// 这是你的第一个挂起函数
suspend fun doWorld() {
    delay(1000L)
    println("World!")
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-07.kt).

<!--- TEST
Hello,
World!
-->


但是如果抽取出来的函数包含一个协程构建器, 并且这个构建器需要在当前作用范围上调用, 那么怎么办?
这种情况下, 对于被抽取出来的函数来说只有 `suspend` 修饰符是不够的.
有一种解决办法是把 `doWorld` 变成 `CoroutineScope` 的扩展函数, 但这种办法有时候并不适用, 因为它会使得 API 难于理解.
符合 Kotlin 习惯的解决办法是, 要么明确地把 `CoroutineScope` 作为一个类的域变量, 再让这个类包含我们抽取的函数,
或者让外层类实现 `CoroutineScope` 接口, 于是就可以隐含的实现这个目的.
最后一种办法就是, 可以使用 [CoroutineScope(coroutineContext)][CoroutineScope()],
但这种方法从结构上来说并不安全, 因为你不再能够控制当前方法运行时所属的作用范围.
只有私有 API 才能够使用这个构建器.

### 协程是非常轻量的

请试着运行一下这段代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(100_000) { // 启动非常多的协程
        launch {
            delay(5000L)
            print(".")
        }
    }
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-08.kt).

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(100_000) -->

这个例子会启动 10 万个协程, 5 秒钟之后, 每个协程输出 1 个点.

现在试试用线程来实现同样的功能. 会发生什么结果? (你的程序很可能会发生某种内存耗尽的错误)

### 全局协程类似于守护线程(Daemon Thread)

下面的示例程序会在 [GlobalScope] 作用范围内启动一个长期运行的协程, 协程会每秒输出 "I'm sleeping" 2次,
主程序等待一段时间后, 从 main 函数返回:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    GlobalScope.launch {
        repeat(1000) { i ->
            println("I'm sleeping $i ...")
            delay(500L)
        }
    }
    delay(1300L) // 等待一段时间后, 主程序直接退出
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-09.kt).

你可以试着运行这段程序, 看到它会输出 3 行消息, 然后就结束了:

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
```

<!--- TEST -->

在 [GlobalScope] 作用范围内启动的活跃的协程, 不会保持应用程序的整个进程存活. 它们的行为就象守护线程一样.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->
[launch]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[CoroutineScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[GlobalScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[delay]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[Job]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Job.join]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[_coroutineScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[CoroutineScope()]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope.html
<!--- END -->
