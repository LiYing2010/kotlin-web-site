---
type: doc
layout: reference
category: "Coroutine"
title: "基本概念"
---


<!--- INCLUDE .*/example-([a-z]+)-([0-9a-z]+)\.kt
/*
 * Copyright 2016-2018 JetBrains s.r.o. Use of this source code is governed by the Apache 2.0 license.
 */

// This file was automatically generated from coroutines-guide.md by Knit tool. Do not edit.
package kotlinx.coroutines.guide.$$1$$2
-->
<!--- KNIT     ../core/kotlinx-coroutines-core/test/guide/.*\.kt -->
<!--- TEST_OUT ../core/kotlinx-coroutines-core/test/guide/test/BasicsGuideTest.kt
// This file was automatically generated from coroutines-guide.md by Knit tool. Do not edit.
package kotlinx.coroutines.guide.test

import org.junit.Test

class BasicsGuideTest {
-->

## 目录

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

<!--- END_TOC -->


## 协程的基本概念

本节我们介绍协程的基本概念.

### 你的第一个协程

请运行以下代码:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() {
    GlobalScope.launch { // 在后台启动新的协程, 然后继续执行当前程序
        delay(1000L) // 非阻塞, 等待 1 秒 (默认的时间单位是毫秒)
        println("World!") // 等待完成后打印信息
    }
    println("Hello,") // 当协程在后台等待时, 主线程继续执行
    Thread.sleep(2000L) // 阻塞主线程 2 秒, 保证 JVM 继续存在
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-01.kt)

你将看到以下运行结果:

```text
Hello,
World!
```

<!--- TEST -->

本质上来说, 协程就是轻量级的线程.
在某个 [CoroutineScope] 的上下文环境内, 协程通过 _协程构建器_ [launch] 来启动.
在上面的示例中, 我们在 [GlobalScope] 内启动了新的协程, 也就是说, 新协程的生命周期只受整个应用程序的生命周期限制.

你可以把 `GlobalScope.launch { ... }` 替换为 `thread { ... }`, 把 `delay(...)` 替换为 `Thread.sleep(...)`, 运行的结果仍然一样.
请自己试验一下.

如果只把 `GlobalScope.launch` 替换为 `thread`, 编译器会报告以下错误:

```
Error: Kotlin: Suspend functions are only allowed to be called from a coroutine or another suspend function
```

这是因为 [delay] 是一个特殊的 _挂起函数(suspending function)_, 它不会阻塞进程, 但会 _挂起_ 协程, 因此它只能在协程中使用.

### 联通阻塞与非阻塞的世界

在我们的第一个示例程序中, 我们在同一块代码中混合使用了 _非阻塞_ 的 `delay(...)` 函数和 _阻塞_ 的 `Thread.sleep(...)` 函数.
因此很容易搞不清楚哪个函数是阻塞的, 哪个函数不是阻塞的.
所以我们通过 [runBlocking] 协程构建器来明确指定使用阻塞模式:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() {
    GlobalScope.launch { // 在后台启动新的协程, 然后继续执行当前程序
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

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-02.kt)

<!--- TEST
Hello,
World!
-->

这样修改后的执行结果是一样的, 但这段代码只使用非阻塞的 [delay] 函数.
在主线程中, 调用 `runBlocking` 会 _阻塞_, 直到 `runBlocking` 内部的协程执行完毕.

我们也可以用更符合 Kotlin 语言编程习惯的方式重写这个示例程序, 用 `runBlocking` 来包装主函数的运行:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> { // 启动主协程
    GlobalScope.launch { // 在后台启动新的协程, 然后继续执行当前程序
        delay(1000L)
        println("World!")
    }
    println("Hello,") // 主协程在这里立即继续执行
    delay(2000L)      // 等待 2 秒, 保证 JVM 继续存在
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-02b.kt)

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
    val job = GlobalScope.launch { // 启动新的协程, 并保存它的执行任务的引用
        delay(1000L)
        println("World!")
    }
    println("Hello,")
    job.join() // 等待, 直到子协程执行完毕
//sampleEnd
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-03.kt)

<!--- TEST
Hello,
World!
-->

这样修改后, 执行结果仍然完全一样, 但主协程的代码不必尝试等待一个确定的, 比后台任务运行时间更长的时间. 这样就好多了.

### 结构化的并发

实际使用协程时, 我们还需要一些其他的东西.
当我们使用 `GlobalScope.launch` 时, 我们创建了一个顶级的协程. 虽然它是轻量的, 但它运行时还是会消耗一些内存资源.
如果我们忘记保存一个新启动的协程的引用, 协程仍然会运行.
假如协程中的代码挂起(比如, 我们错误地等待了一个很长的时间), 那么会怎么样, 如果我们启动了太多的协程, 耗尽了内存, 那么会怎么样?
不得不手工保存所有启动的协程的引用, 然后 [join][Job.join] 所有这些协程, 这样的编程方式是很容易出错的.

我们有更好的解决方案. 我们可以在代码中使用结构化的并发.
我们可以在协程需要工作的那个特定的作用范围内启动协程, 而不是象我们通常操作线程那样(线程总是全局的), 在 [GlobalScope] 内启动协程.

在我们的示例程序中, 有一个 `main` 函数, 它使用 [runBlocking] 协程构建器变换成了一个协程.
所有的协程构建器, 包括 `runBlocking`, 都会向它的代码段的作用范围添加一个 [CoroutineScope] 的实例.
我们在这个作用范围内启动协程, 而不需要明确地 `join` 它们, 因为外层协程 (在我们的示例程序中就是 `runBlocking`) 会等待它的作用范围内启动的所有协程全部完成.
因此, 我们可以把示例程序写得更简单一些:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { // this: CoroutineScope
    launch { // 在 runBlocking 的作用范围内启动新的协程
        delay(1000L)
        println("World!")
    }
    println("Hello,")
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-03s.kt)

<!--- TEST
Hello,
World!
-->

### 作用范围(Scope)构建器
In addition to the coroutine scope provided by different builders, it is possible to declare your own scope using
[coroutineScope] builder. It creates new coroutine scope and does not complete until all launched children
complete. The main difference between [runBlocking] and [coroutineScope] is that the latter does not block the current thread
while waiting for all children to complete.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { // this: CoroutineScope
    launch {
        delay(200L)
        println("Task from runBlocking")
    }

    coroutineScope { // Creates a new coroutine scope
        launch {
            delay(500L)
            println("Task from nested launch")
        }

        delay(100L)
        println("Task from coroutine scope") // This line will be printed before nested launch
    }

    println("Coroutine scope is over") // This line is not printed until nested launch completes
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-04.kt)

<!--- TEST
Task from coroutine scope
Task from runBlocking
Task from nested launch
Coroutine scope is over
-->

### 抽取函数(Extract Function)的重构

Let's extract the block of code inside `launch { ... }` into a separate function. When you
perform "Extract function" refactoring on this code you get a new function with `suspend` modifier.
That is your first _suspending function_. Suspending functions can be used inside coroutines
just like regular functions, but their additional feature is that they can, in turn,
use other suspending functions, like `delay` in this example, to _suspend_ execution of a coroutine.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    launch { doWorld() }
    println("Hello,")
}

// this is your first suspending function
suspend fun doWorld() {
    delay(1000L)
    println("World!")
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-05.kt)

<!--- TEST
Hello,
World!
-->


But what if the extracted function contains a coroutine builder which is invoked on the current scope?
In this case `suspend` modifier on the extracted function is not enough. Making `doWorld` extension
method on `CoroutineScope` is one of the solutions, but it may not always be applicable as it does not make API clearer.
Idiomatic solution is to have either explicit `CoroutineScope` as a field in a class containing target function
or implicit when outer class implements `CoroutineScope`.
As a last resort, [CoroutineScope(coroutineContext)][CoroutineScope()] can be used, but such approach is structurally unsafe
because you no longer have control on the scope this method is executed. Only private API can use this builder.

### 协程是非常轻量的

Run the following code:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    repeat(100_000) { // launch a lot of coroutines
        launch {
            delay(1000L)
            print(".")
        }
    }
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-06.kt)

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(100_000) -->

It launches 100K coroutines and, after a second, each coroutine prints a dot.
Now, try that with threads. What would happen? (Most likely your code will produce some sort of out-of-memory error)

### 全局协程类似于守护线程(Daemon Thread)

The following code launches a long-running coroutine in [GlobalScope] that prints "I'm sleeping" twice a second and then
returns from the main function after some delay:

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
    delay(1300L) // just quit after delay
//sampleEnd    
}
```

</div>

> 完整的代码请参见 [这里](../core/kotlinx-coroutines-core/test/guide/example-basic-07.kt)

You can run and see that it prints three lines and terminates:

```text
I'm sleeping 0 ...
I'm sleeping 1 ...
I'm sleeping 2 ...
```

<!--- TEST -->

Active coroutines that were launched in [GlobalScope] do not keep the process alive. They are like daemon threads.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->
[launch]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[CoroutineScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[GlobalScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-global-scope/index.html
[delay]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[Job]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Job.join]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[coroutineScope]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[CoroutineScope()]: https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope.html
<!--- END -->
