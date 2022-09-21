---
type: doc
layout: reference
category: "Coroutine"
title: "协程的基本概念"
---

# 协程的基本概念

最终更新: {{ site.data.releases.latestDocDate }}

本章我们介绍协程的基本概念.

## 你的第一个协程

_协程_ 是可挂起的计算代码的一个实例. 概念上类似于线程, 它包含一段需要运行的代码, 与其他代码并行工作.
但是, 协程并没有绑定到任何特定的线程上. 它的运行可以在一个线程上挂起, 然后在另一个线程中恢复运行.

协程可以看作是轻量的线程, 但有很多重要的区别, 使得协程的使用与线程非常不同.

下面请运行以下代码, 看看你的第一个协程:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { // 启动一个新的协程, 然后继续执行当前程序
        delay(1000L) // 非阻塞, 等待 1 秒 (默认的时间单位是毫秒)
        println("World!") // 等待完成后输出信息
    }
    println("Hello") // 当前一个协程在后台等待时, 主协程继续执行
}
//sampleEnd
```

</div>

> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-01.kt).
{:.note}

你将看到以下运行结果:

```text
Hello
World!
```

<!--- TEST -->

我们来分析一下这段代码做了什么.

[launch] 是一个 _协程构建器_. 它启动一个新的协程, 协程会与其他代码并行执行,
其他代码则会继续自己的工作. 所以 `Hello` 会先输出.

[delay] 是一个特殊的 _挂起函数_. 它 _挂起_ 协程一段指定的时间.
挂起一个协程不会 _阻塞_ 底层的线程, 而是允许其他协程运行, 并使用底层的线程执行它们的代码.

[runBlocking] 也是一个协程构建器, 它负责联通通常的 `fun main()` 内的非协程的世界
与 `runBlocking { ... }` 括号之内使用协程的代码.
IDE 会在 `runBlocking` 的开括号之后会提示 `this: CoroutineScope`.

如果你在这段代码中删除或者忘记了 `runBlocking`, 那么会在 [launch] 调用处发生错误,
因为 `launch` 声明在 [CoroutineScope] 之内:

```text
Unresolved reference: launch
```

`runBlocking` 的名称表示, 运行它的线程 (在这个示例中 &mdash; 是主线程) 在调用期间之内会被 _阻塞_,
直到 `runBlocking { ... }` 之内的所有协程执行完毕.
你会经常在应用程序的最顶层看到这样使用 `runBlocking`, 而在真正的代码之内则很少如此,
因为线程是代价高昂的资源, 阻塞线程是比较低效的, 我们通常并不希望阻塞线程.

### 结构化的并发

协程遵循 **结构化的并发** 原则, 意思就是说新的协程只能在一个指定的 [CoroutineScope] 之内启动,
CoroutineScope 界定了协程的生命周期.
上面的示例代码中 [runBlocking] 建立了相应的作用范围(Scope),
所以前面的示例程序会等待, 直到延迟 1 秒后 `World!` 打印完毕, 然后才会退出.

在真实的应用程序中, 你会启动很多协程. 结构化的并发保证协程不会丢失或泄露.
直到所有子协程结束之前, 外层的作用范围不会结束.
结构化的并发还保证代码中的任何错误都会正确的向外报告, 不会丢失.

## 代码重构, 抽取函数

下面我们把 `launch { ... }` 之内的代码抽取成一个独立的函数.
如果在 IDE 中对这段代码进行一个 "Extract function" 重构操作, 你会得到一个带 `suspend` 修饰符的新函数.
这就是你的第一个 _挂起函数_. 在协程内部可以象使用普通函数那样使用挂起函数, 但挂起函数与普通函数的不同在于,
它们又可以使用其他挂起函数(比如下面的例子中使用的 `delay` 函数)来 _挂起_ 当前协程的运行.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking { // this: CoroutineScope
    launch { doWorld() }
    println("Hello")
}

// 这是你的第一个挂起函数
suspend fun doWorld() {
    delay(1000L)
    println("World!")
}
//sampleEnd
```

</div>

> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-02.kt).
{:.note}

<!--- TEST
Hello
World!
-->

## 作用范围(Scope)构建器

除了各种构建器提供的协程作用范围之外, 还可以使用 [coroutineScope][_coroutineScope] 构建器来自行声明作用范围.
这个构建器可以创建一个新的协程作用范围, 并等待在这个范围内启动的所有子协程运行结束.

[runBlocking] 和 [coroutineScope][_coroutineScope] 构建器看起来很类似, 因为它们都会等待自己的代码段以及所有的子任务执行完毕.
主要区别是, [runBlocking] 方法为了等待任务结束, 会 _阻塞_ 当前线程,
而 [coroutineScope][_coroutineScope] 只会挂起协程, 而低层的线程可以被用作其他用途.
由于这种区别, [runBlocking] 是一个通常的函数, 而 [coroutineScope][_coroutineScope] 是一个挂起函数.

你可以在任何挂起函数中使用 `coroutineScope`.
比如, 你可以将打印 `Hello` 和 `World` 并发代码移动到一个 `suspend fun doWorld()` 函数之内:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

//sampleStart
fun main() = runBlocking {
    doWorld()
}

suspend fun doWorld() = coroutineScope {  // this: CoroutineScope
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
//sampleEnd
```

</div>

> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-03.kt).
{:.note}

这段代码的输出同样是:

```text
Hello
World!
```

<!--- TEST -->

## 作用范围构建器与并发

在任何挂起函数之内, 可以使用 [coroutineScope][_coroutineScope] 构建器来执行多个并发的操作.
我们在 `doWorld` 挂起函数内启动 2 个并发的协程:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

//sampleStart
// 顺序执行 doWorld, 然后输出 "Done"
fun main() = runBlocking {
    doWorld()
    println("Done")
}

// 并发执行 2 段代码
suspend fun doWorld() = coroutineScope { // this: CoroutineScope
    launch {
        delay(2000L)
        println("World 2")
    }
    launch {
        delay(1000L)
        println("World 1")
    }
    println("Hello")
}
//sampleEnd
```
</div>

> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-04.kt).
{:.note}

`launch { ... }` 之内的 2 段代码会 _并发_ 执行, 启动之后 1 秒会先输出 `World 1`, 启动之后 2 秒会输出 `World 2`.
直到 2 段代码都结束之后, `doWorld` 之内的 [coroutineScope][_coroutineScope] 才会结束,
然后 `doWorld` 函数会返回, 直到这时才会输出 `Done`:

```text
Hello
World 1
World 2
Done
```

<!--- TEST -->

## 明确控制的 job

[launch] 协程构建器会返回一个 [Job] 对象, 它是被启动的协程的管理器, 可以用来明确的等待协程结束.
比如, 你可以等待子协程结束, 然后再输出 "Done":

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
//sampleStart
    val job = launch { // 启动一个新的协程, 并保存它的 Job 实例
        delay(1000L)
        println("World!")
    }
    println("Hello")
    job.join() // 等待子协程结束
    println("Done")
//sampleEnd    
}
```
</div>

> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-05.kt).
{:.note}

这段代码的输出是:

```text
Hello
World!
Done
```

<!--- TEST -->

## 协程是非常轻量的

与 JVM 线程相比, 协程消耗更少的资源.
有些代码使用线程时会耗尽 JVM 的可用内存, 如果用协程来表达, 则不会达到资源上限.
比如, 以下代码启动 100000 个不同的协程, 每个协程等待 5 秒, 然后打印一个点号('.'),
但只消耗非常少的内存:

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
<!-- 尽管协程比线程消耗更少的内存, 但这个示例程序还是会耗尽 playground 的堆内存; 请不要在 上运行这个示例. -->

> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-basic-06.kt).
{:.note}

<!--- TEST lines.size == 1 && lines[0] == ".".repeat(100_000) -->

如果你使用线程来实现同样的功能
(删除 `runBlocking`, 将 `launch` 替换为 `thread`, 将 `delay` 替换为 `Thread.sleep`).
你的程序很可能会消耗太多内存, 抛出内存不足(out-of-memory)的错误.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[launch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html
[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[_coroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html

<!--- END -->
