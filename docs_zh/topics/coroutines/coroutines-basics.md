<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程的基本概念)

要创建能够同时执行多个任务的应用程序, 也就是称为并发的概念, Kotlin 使用 _协程(Coroutine)_.
协程是一种可挂起的计算, 让你能够以清晰的顺序风格, 编写并发代码.
协程可以与其他协程并发(Concurrent)运行, 也可以并行(Parallel)运行.

在 JVM 和 Kotlin/Native 中, 所有的并发代码, 例如协程, 都运行在由操作系统管理的 _线程(Thread)_ 上.
协程可以挂起执行, 而不是阻塞线程.
这样, 一个协程可以在等待某些数据到达时挂起, 而另一个协程可以在同一个线程上运行, 从而确保有效利用资源.

![比较并行和并发线程](parallelism-and-concurrency.svg){width="700"}

有关协程与线程的区别, 详情请参见 [比较协程与 JVM 线程](#comparing-coroutines-and-jvm-threads).

## 挂起函数 {id="suspending-functions"}

协程最基本的构建块是 _挂起函数(Suspending Function)_.
它允许一个正在运行的操作暂停, 并在之后恢复, 而不影响代码的结构.

要声明挂起函数, 请使用 `suspend` 关键字:

```kotlin
suspend fun greet() {
    println("Hello world from a suspending function")
}
```

挂起函数只能从另一个挂起函数中调用.
要在 Kotlin 应用程序的入口点调用挂起函数, 请用 `suspend` 关键字标记 `main()` 函数:

```kotlin
suspend fun main() {
    showUserInfo()
}

suspend fun showUserInfo() {
    println("Loading user...")
    greet()
    println("User: John Smith")
}

suspend fun greet() {
    println("Hello world from a suspending function")
}
```
{kotlin-runnable="true"}

这个示例还没有使用并发, 但通过用 `suspend` 关键字标记函数,
你允许它们调用其他挂起函数, 并在其内部运行并发代码.

虽然 `suspend` 关键字是 Kotlin 核心语言的一部分,
但协程的大多数功能, 都通过 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 库提供.

## 向你的项目添加 kotlinx.coroutines 库 {id="add-the-kotlinx-coroutines-library-to-your-project"}

要在你的项目中引入 `kotlinx.coroutines` 库, 请根据你的构建工具, 添加相应的依赖项配置:

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
}
```
</tab>

<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-coroutines-core</artifactId>
            <version>%coroutinesVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

</tab>
</tabs>

## 创建你的第一个协程 {id="create-your-first-coroutines"}

> 本章的示例对协程构建器函数 `CoroutineScope.launch()` 和 `CoroutineScope.async()` 使用了明确的 `this` 表达式.
> 这些协程构建器是 `CoroutineScope` 上的 [扩展函数](extensions.md), `this` 表达式引用当前的 `CoroutineScope` 作为接收者.
>
> 实际的示例请参见 [从协程作用域中提取协程构建器](#extract-coroutine-builders-from-the-coroutine-scope).
>
{style="note"}

要在 Kotlin 中创建协程, 你需要以下内容:

* 一个 [挂起函数](#suspending-functions).
* 一个 [协程作用域](#coroutine-scope-and-structured-concurrency), 挂起函数在其中运行, 例如在 `withContext()` 函数内.
* 一个 [协程构建器](#coroutine-builder-functions), 用于启动挂起函数, 例如 `CoroutineScope.launch()`.
* 一个 [派发器(Dispatcher)](#coroutine-dispatchers), 控制挂起函数使用哪些线程.

我们来看看一个示例, 它在多线程环境中使用多个协程:

1. 导入 `kotlinx.coroutines` 库:

    ```kotlin
    import kotlinx.coroutines.*
    ```

2. 用 `suspend` 关键字标记可以暂停和恢复的函数:

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
    }

    suspend fun main() {}
    ```

    > 虽然在某些项目中你可以将 `main()` 函数标记为 `suspend`, 但在与现有代码集成时, 或使用框架时, 可能无法这样做.
    > 在这种情况下, 请查看框架的文档, 了解它是否支持调用挂起函数.
    > 如果不支持, 请使用 [`runBlocking()`](#runblocking), 通过阻塞当前线程来调用挂起函数.
    >
    {style="note"}

3. 添加 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html#)
   函数来模拟挂起任务, 例如获取数据或写入数据库:

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        delay(1000L)
    }
   ```

    <!-- > Use [`kotlin.time.Duration`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-duration/) from the Kotlin standard library to express durations like `delay(1.seconds)` instead of using milliseconds.
    >
    {style="tip"} -->

4. 使用 [`withContext(Dispatchers.Default)`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#),
   为运行在共享线程池上的多线程并发代码定义入口点:

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) {
            // 在这里添加协程构建器
        }
    }
    ```

   > 挂起函数 `withContext()` 通常用于 [上下文切换](coroutine-context-and-dispatchers.md#jumping-between-threads),
   > 但在这个示例中, 它也为并发代码定义了一个非阻塞的入口点.
   > 它使用 [`Dispatchers.Default` 派发器](#coroutine-dispatchers), 在共享线程池上运行代码, 实现多线程执行.
   > 默认情况下, 这个线程池最多使用与运行时可用 CPU 核心数量相同的线程数, 最少 2 个线程.
   >
   > 在 `withContext()` 代码块内启动的协程, 会共享相同的协程作用域, 这可以确保 [结构化并发](#coroutine-scope-and-structured-concurrency).
   >
   {style="note"}

5. 使用 [协程构建器函数](#coroutine-builder-functions),
   例如 [`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html),
   启动协程:

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) { // this: CoroutineScope
            // 在作用域内, 使用 CoroutineScope.launch() 启动协程
            this.launch { greet() }
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```

6. 组合这些部分, 在共享的线程池上同时运行多个协程:

    ```kotlin
    // 导入协程库
    import kotlinx.coroutines.*

    // 导入 kotlin.time.Duration, 表达秒单位的时间段
    import kotlin.time.Duration.Companion.seconds

    // 定义一个挂起函数
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        // 挂起 1 秒, 并释放线程
        delay(1.seconds)
        // delay() 函数在这里模拟一个挂起的 API 调用
        // 你可以在这里添加挂起的 API 调用, 例如网络请求
    }

    suspend fun main() {
        // 在共享的线程池上, 运行这个代码块之内的代码
        withContext(Dispatchers.Default) { // this: CoroutineScope
            this.launch() {
                greet()
            }

            // 启动另一个协程
            this.launch() {
                println("The CoroutineScope.launch() on the thread: ${Thread.currentThread().name}")
                delay(1.seconds)
                // delay 函数在这里模拟一个挂起的 API 调用
                // 你可以在这里添加挂起的 API 调用, 例如网络请求
            }

            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```
    {kotlin-runnable="true"}

试试多次运行这个示例.
你可能会注意到, 每次运行程序时的输出顺序和线程名称可能都会改变, 因为操作系统决定线程何时运行.

> 你可以在代码的输出中, 在线程名称旁边显示协程名称, 获取更多信息.
> 方法是, 在构建工具, 或 IDE 的运行配置中, 传递 `-Dkotlinx.coroutines.debug` VM 选项.
>
> 详情请参见 [调试协程](debugging.md).
>
{style="tip"}

## 协程作用域与结构化并发 {id="coroutine-scope-and-structured-concurrency"}

当你在应用程序中运行很多协程时, 你需要一种方式, 将它们作为群组来管理.
Kotlin 协程依赖一种称为 _结构化并发(Structured Concurrency)_ 的原则, 提供这种结构.

根据这个原则, 协程组成一个父/子任务的树形层级结构, 具有相互关联的生命周期.
协程的生命周期是指, 从创建到完成, 失败或取消的一系列状态.

父协程在完成之前会等待其子协程完成.
如果父协程失败或被取消, 它的所有子协程也会被递归的取消.
以这种方式保持协程的连接, 使得取消和错误处理变得能够预测, 而且安全.

为了维持结构化并发, 新协程只能在 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) 中启动,
`CoroutineScope` 会定义并管理它们的生命周期.
`CoroutineScope` 包含 _协程上下文(Coroutine Context)_, 它定义了派发器和其他执行属性.
当你在另一个协程内部启动一个协程时, 它会自动成为其父作用域的子协程.

在 `CoroutineScope` 上调用 [协程构建器函数](#coroutine-builder-functions), 例如 `CoroutineScope.launch()`), 会启动与这个作用域关联的协程的子协程.
在构建器的代码块内, [接收者](lambdas.md#function-literals-with-receiver) 是嵌套的 `CoroutineScope`, 因此在这里启动的任何协程都成为它的子协程.

### 使用 `coroutineScope()` 函数创建协程作用域 {id="create-a-coroutine-scope-with-the-coroutinescope-function"}

要使用当前协程上下文创建新的协程作用域, 请使用
[`coroutineScope()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html) 函数.
这个函数创建一个协程子树的根协程.
它是在代码块内启动的协程的直接父协程, 以及这些协程启动的任何协程的间接父协程.
`coroutineScope()` 执行挂起代码块, 并等待代码块, 以及其中启动的任何协程执行完成.

下面是一个示例:

```kotlin
// 导入 kotlin.time.Duration, 表达秒单位的时间段
import kotlin.time.Duration.Companion.seconds

import kotlinx.coroutines.*

// 如果协程上下文没有指定派发器,
// CoroutineScope.launch() 会使用 Dispatchers.Default
//sampleStart
suspend fun main() {
    // 协程子树的根协程
    coroutineScope { // this: CoroutineScope
        this.launch {
            this.launch {
                delay(2.seconds)
                println("Child of the enclosing coroutine completed")
            }
            println("Child coroutine 1 completed")
        }
        this.launch {
            delay(1.seconds)
            println("Child coroutine 2 completed")
        }
    }
    // 只有 coroutineScope 中的所有子协程执行完成后, 下面的代码才会运行
    println("Coroutine scope completed")
}
//sampleEnd
```
{kotlin-runnable="true"}

由于这个示例中没有指定 [派发器](#coroutine-dispatchers), `coroutineScope()` 代码块中的 `CoroutineScope.launch()` 构建器函数会继承当前上下文.
如果这个上下文没有指定派发器, `CoroutineScope.launch()` 会使用 `Dispatchers.Default`, 它在共享线程池上运行.

### 从协程作用域中提取协程构建器 {id="extract-coroutine-builders-from-the-coroutine-scope"}

在某些情况下, 你可能希望将协程构建器的调用, 例如 [`CoroutineScope.launch()`](#coroutinescope-launch), 提取到单独的函数中.

请看以下示例:

```kotlin
suspend fun main() {
    coroutineScope { // this: CoroutineScope
        // 调用 CoroutineScope.launch(), 其中 CoroutineScope 是接收者
        this.launch { println("1") }
        this.launch { println("2") }
    }
}
```

> 对于 `this.launch`, 你也可以不用明确的 `this` 表达式, 直接写成 `launch`.
> 这些示例使用明确的 `this` 表达式, 是为了强调它是 `CoroutineScope` 上的扩展函数.
>
> 关于 Kotlin 中的带接收者的 Lambda 表达式, 详情请参见 [带接收者的函数字面值](lambdas.md#function-literals-with-receiver).
>
{style="tip"}

`coroutineScope()` 函数接受一个带有 `CoroutineScope` 接收者的 Lambda 表达式.
在这个 Lambda 表达式内部, 隐含的接收者是 `CoroutineScope`, 因此构建器函数, 例如 `CoroutineScope.launch()` 和 [`CoroutineScope.async()`](#coroutinescope-async),
会解析为这个接收者上的 [扩展函数](extensions.md#extension-functions).

要将协程构建器提取到另一个函数中, 这个函数必须声明 `CoroutineScope` 接收者, 否则会发生编译错误:

```kotlin
import kotlinx.coroutines.*
//sampleStart
suspend fun main() {
    coroutineScope {
        launchAll()
    }
}

fun CoroutineScope.launchAll() { // this: CoroutineScope
    // 在 CoroutineScope 上调用 .launch()
    this.launch { println("1") }
    this.launch { println("2") }
}
//sampleEnd
/* -- 不将 CoroutineScope 声明为接收者, 调用 launch 会导致编译错误 --

fun launchAll() {
    // 编译错误: this is not defined
    this.launch { println("1") }
    this.launch { println("2") }
}
 */
```
{kotlin-runnable="true"}

## 协程构建器函数 {id="coroutine-builder-functions"}

协程构建器函数是一种接受 `suspend` [Lambda 表达式](lambdas.md) 的函数, 这个 Lambda 表达式定义了要运行的协程.
以下是一些示例:

* [`CoroutineScope.launch()`](#coroutinescope-launch)
* [`CoroutineScope.async()`](#coroutinescope-async)
* [`runBlocking()`](#runblocking)
* [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html)
* [`coroutineScope()`](#create-a-coroutine-scope-with-the-coroutinescope-function)

协程构建器函数需要在一个 `CoroutineScope` 之内运行.
这个作用域可以是现有的作用域, 也可以是使用辅助函数,
例如 `coroutineScope()`, [`runBlocking()`](#runblocking) 或 [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#),
创建的作用域.
每个构建器定义了协程如何启动, 以及你如何与它的结果交互.

### `CoroutineScope.launch()` {id="coroutinescope-launch"}

[`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html#) 协程构建器函数是 `CoroutineScope` 上的扩展函数.
它在现有的 [协程作用域](#coroutine-scope-and-structured-concurrency) 之内, 启动一个新协程, 而不阻塞作用域内的其它协程.

当不需要结果, 或者不想等待结果时, 可以使用 `CoroutineScope.launch()`, 与其他工作并行运行任务:

```kotlin
// 导入 kotlin.time.Duration, 表达毫秒单位的时间段
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        performBackgroundWork()
    }
}

//sampleStart
suspend fun performBackgroundWork() = coroutineScope { // this: CoroutineScope
    // 启动一个协程, 运行时不阻塞作用域
    this.launch {
        // 挂起, 模拟后台工作
        delay(100.milliseconds)
        println("Sending notification in background")
    }

    // 当前一个协程挂起时, 主协程继续执行
    println("Scope continues")
}
//sampleEnd
```
{kotlin-runnable="true"}

运行这个示例后, 你可以看到 `main()` 函数不会被 `CoroutineScope.launch()` 阻塞, 当协程在后台工作时, 会继续运行其他代码.

> `CoroutineScope.launch()` 函数返回一个 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 句柄.
> 可以使用这个句柄, 等待启动的协程完成.
> 详情请参见 [取消与超时](cancellation-and-timeouts.md#cancel-coroutines).
>
{style="tip"}

### `CoroutineScope.async()` {id="coroutinescope-async"}

[`CoroutineScope.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 协程构建器函数是 `CoroutineScope` 上的扩展函数.
它在现有 [协程作用域](#coroutine-scope-and-structured-concurrency) 之内, 启动一个并发计算, 并返回一个 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/) 句柄,
表示最终的结果.
使用 `.await()` 函数挂起代码, 直到得到结果:

```kotlin
// 导入 kotlin.time.Duration, 表达毫秒单位的时间段
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    // 开始下载第一页
    val firstPage = this.async {
        delay(50.milliseconds)
        "First page"
    }

    // 开始并行的下载第二页
    val secondPage = this.async {
        delay(100.milliseconds)
        "Second page"
    }

    // 等待两个结果, 并比较它们
    val pagesAreEqual = firstPage.await() == secondPage.await()
    println("Pages are equal: $pagesAreEqual")
}
//sampleEnd
```
{kotlin-runnable="true"}

### `runBlocking()` {id="runblocking"}

[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 协程构建器函数创建一个协程作用域, 并阻塞当前 [线程](#comparing-coroutines-and-jvm-threads),
直到在这个作用域中启动的协程执行结束.

只有在没有其他方式可以从非挂起代码调用挂起代码时, 才使用 `runBlocking()`:

```kotlin
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.*

// 一个你无法修改的第三方接口
interface Repository {
    fun readItem(): Int
}

object MyRepository : Repository {
    override fun readItem(): Int {
        // 桥接到一个挂起函数
        return runBlocking {
            myReadItem()
        }
    }
}

suspend fun myReadItem(): Int {
    delay(100.milliseconds)
    return 4
}
```

## 协程派发器(Dispatcher) {id="coroutine-dispatchers"}

[_协程派发器(Dispatcher)_](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/#)
控制使用哪个线程或线程池来执行协程.
协程并不一定绑定到单个线程.
根据派发器不同, 协程可以在一个线程上暂停, 在另一个线程上恢复.
这样你就可以同时运行多个协程, 而不需要为每个协程分配单独的线程.

> 尽管协程可以在不同线程上挂起和恢复,
> 在协程挂起之前写入的值, 在同一协程恢复时仍然保证可用.
>
{style="tip"}

派发器与 [协程作用域](#coroutine-scope-and-structured-concurrency) 一起工作, 定义协程何时运行, 以及在哪里运行.
协程作用域控制协程的生命周期, 派发器控制用于执行的线程.

> 你不必为每个协程指定派发器.
> 默认情况下, 协程从父作用域继承派发器.
> 你可以指定一个派发器, 在不同的上下文中运行协程.
>
> 如果协程上下文不包含派发器, 协程构建器会使用 `Dispatchers.Default`.
>
{style="note"}

`kotlinx.coroutines` 库包含各种不同的派发器, 适用于不同的使用场景.
例如, [`Dispatchers.Default`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html)
在共享线程池上运行协程, 独立于主线程之外, 在后台执行工作.
因此它成为 CPU 密集型操作, 例如数据处理, 的理想选择.

要为协程构建器, 例如 `CoroutineScope.launch()`, 指定派发器, 请将它作为参数:

```kotlin
suspend fun runWithDispatcher() = coroutineScope { // this: CoroutineScope
    this.launch(Dispatchers.Default) {
        println("Running on ${Thread.currentThread().name}")
    }
}
```

或者, 你可以使用 `withContext()` 代码块, 在指定的派发器上运行其中的所有代码:

```kotlin
// 导入 kotlin.time.Duration, 表达毫秒单位的时间段
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    println("Running withContext block on ${Thread.currentThread().name}")

    val one = this.async {
        println("First calculation starting on ${Thread.currentThread().name}")
        val sum = (1L..500_000L).sum()
        delay(200L)
        println("First calculation done on ${Thread.currentThread().name}")
        sum
    }

    val two = this.async {
        println("Second calculation starting on ${Thread.currentThread().name}")
        val sum = (500_001L..1_000_000L).sum()
        println("Second calculation done on ${Thread.currentThread().name}")
        sum
    }

    // 等待两个计算结果, 并打印总和
    println("Combined total: ${one.await() + two.await()}")
}
//sampleEnd
```
{kotlin-runnable="true"}

关于协程派发器及其使用, 包括其他派发器,
例如 [`Dispatchers.IO`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-i-o.html)
和 [`Dispatchers.Main`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html),
详情请参见 [协程上下文与派发器](coroutine-context-and-dispatchers.md).

## 比较协程与 JVM 线程 {id="comparing-coroutines-and-jvm-threads"}

尽管协程与 JVM 上的线程类似, 是可挂起计算, 能够并发的运行代码, 但它们的底层工作方式是不同的.

_线程_ 由操作系统管理. 线程可以在多个 CPU 核心上并行运行任务, 是 JVM 上并发的标准方式.
当你创建一个线程时, 操作系统会为它的栈分配内存, 并使用内核在线程之间切换.
这使得线程功能强大, 但也消耗大量资源.
每个线程通常需要几兆字节内存, JVM 通常只能同时处理几千个线程.

另一方面, 协程不绑定到特定的线程.
它可以在一个线程上挂起, 在另一个线程上恢复, 因此多个协程可以共用同一个线程池.
当协程挂起时, 线程不会被阻塞, 可以运行其他任务.
这使得协程比线程轻量很多, 能够在一个进程中运行几百万个协程, 而不会耗尽系统资源.

![比较协程与线程](coroutines-and-threads.svg){width="700"}

我们来看一个示例, 其中 50,000 个协程各自等待 5 秒, 然后打印一个点号 (`.`):

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        // 启动 50,000 个协程, 每个协程等待 5 秒, 然后打印一个点号
        printPeriods()
    }
}

//sampleStart
suspend fun printPeriods() = coroutineScope { // this: CoroutineScope
    // 启动 50,000 个协程, 每个协程等待 5 秒, 然后打印一个点号
    repeat(50_000) {
        this.launch {
            delay(5.seconds)
            print(".")
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

现在让我们看看使用 JVM 线程的相同示例:

```kotlin
import kotlin.concurrent.thread

fun main() {
    repeat(50_000) {
        thread {
            Thread.sleep(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" validate="false"}

运行这个版本会使用更多内存, 因为每个线程都需要自己的内存栈.
对于 50,000 个线程, 内存消耗可能高达 100 GB, 而同等数量的协程只需要大约 500 MB.

根据你的操作系统, JDK 版本和设置,
JVM 线程版本可能会抛出内存不足错误, 或者放慢线程创建速度, 以避免同时运行过多线程.

## 下一步做什么 {id="whats-next"}

* 阅读 [组合挂起函数](composing-suspending-functions.md), 了解关于组合挂起函数的更多内容.
* 阅读 [取消与超时](cancellation-and-timeouts.md), 学习如何取消协程和处理超时.
* 阅读 [协程上下文与派发器](coroutine-context-and-dispatchers.md), 深入了解协程的执行和线程管理.
* 阅读 [异步流](flow.md), 学习如何返回多个异步计算的值.
