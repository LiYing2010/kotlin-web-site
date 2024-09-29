[//]: # (title: 并发(Concurrency)与协程(Coroutine))

最终更新: %latestDocDate%

> 本章描述的是旧的内存管理器的功能特性.
> 从 Kotlin 1.7.20 开始会默认启用新的内存管理器, 详情请参见 [Kotlin/Native 内存管理](../native/native-memory-manager.html).
>
{style="note"}

在移动平台上工作时, 你可能需要编写同时运行的多线程代码.
为了这个目的, 你可以使用 [标准的](#coroutines) `kotlinx.coroutines` 库, 或它的 [多线程版本](#multithreaded-coroutines),
以及 [替代方案](#alternatives-to-kotlinx-coroutines).

请评估每个方案的优点和缺点, 选择最适合你情况的那个.

详情请参见 [并发, 目前的方案, 以及未来的改进](multiplatform-mobile-concurrency-overview.html).

## 协程

协程是轻量的线程, 你可以用来编写异步的非阻塞代码.
Kotlin 提供了 
[`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 库,
其中包括很多高层的, 支持协程的基本功能.

目前版本的 `kotlinx.coroutines`, 可以用于 iOS, 支持只在单一线程中使用.
你不能通过改变 [派发器](#dispatcher-for-changing-threads), 将工作发送到其他线程.

对于 Kotlin {{ site.data.releases.latest.version }}, 推荐的协程版本是 `{{ site.data.releases.latest.coroutines.version }}`.

使用不同的机制来调度和管理工作任务, 你可以将执行挂起, 在其他线程中继续工作.
但是, 这个版本的 `kotlinx.coroutines` 不能改变自身的线程.

还有 [另一个版本的 `kotlinx.coroutines`](#multithreaded-coroutines), 提供了多线程支持.

首先请理解使用协程的主要概念:

* [异步(Asynchronous)与并行处理(Parallel Processing)](#asynchronous-vs-parallel-processing)
* [用于改变线程的派发器(Dispatcher)](#dispatcher-for-changing-threads)
* [被捕获数据的冻结](#frozen-captured-data)
* [返回数据的冻结](#frozen-returned-data)

### 异步(Asynchronous)与并行处理(Parallel Processing)

异步和并行处理是不同的. 

在一个协程中, 处理序列可能被挂起, 并在以后恢复.
这样可以实现异步非阻塞的代码, 不需要使用回调或 promise.
这是异步处理, 但与这个协程有关的一切可以发生在单个线程中. 

以下代码使用 [Ktor](https://ktor.io/) 发起一个网络调用.
在主线程中, 调用被初始化, 然后挂起, 同时由另一个底层过程执行实际的网络访问.
结束后, 代码在主线程中恢复执行.

```kotlin
val client = HttpClient()
// 在主线程运行中, 启动一个 `get` 调用
client.get<String>("https://example.com/some/rest/call")
// get 调用会被挂起, 允许其他工作在主线程中执行, 然后在 get 调用结束时恢复执行 
```

这种机制与并行代码不同, 并行代码需要运行在另一个线程中.
根据你的目的和你使用的库不同, 你可能不需要使用多线程.

### 用于改变线程的派发器(Dispatcher)

协程由一个派发器(Dispatcher)来执行, 派发器定义协程将在哪个线程上执行.
你可以通过很多方法为协程指定派发器, 或改变派发器. 例如: 

```kotlin
suspend fun differentThread() = withContext(Dispatchers.Default){
    println("Different thread")
}
```

`withContext` 的参数是一个派发器, 和一个代码块, 这个代码块将由派发器定义的线程来执行.
详情请参见 [协程上下文与派发器](../coroutines/coroutine-context-and-dispatchers.html).

要在一个不同的线程上执行工作, 请指定一个不同的派发器, 以及一个需要执行的代码块.
一般来说, 派发器和线程的切换与在 JVM 上相似, 但关于被捕获数据和返回数据的冻结存在一些区别.

### 被捕获数据的冻结

要在一个不同的线程上运行代码, 你需要传递一个 `functionBlock`, 它被冻结, 然后在另一个线程中运行. 

```kotlin
fun <R> runOnDifferentThread(functionBlock: () -> R)
```

你要按以下方式调用这个函数:

```kotlin
runOnDifferentThread {
    // 在另一个线程中运行的代码
}
```

如 [并发概述](multiplatform-mobile-concurrency-overview.html) 所述, 在 Kotlin/Native 中, 在线程之间共享的状态必须冻结.
一个函数参数本身也是一个状态, 也会与它捕获的所有数据一起被冻结.

跨线程的协程函数使用相同的模式. 要让函数块在另一个线程上执行, 它们也会被冻结.

在以下示例中, 数据类实例 `dc` 会被函数块捕获, 并在跨越线程时被冻结.
`println` 语句会打印输出 `true`.

```kotlin
val dc = DataClass("Hello")
withContext(Dispatchers.Default) {
    println("${dc.isFrozen}")
}
```

运行并行代码时, 要注意被捕获的状态. 
状态何时会被捕获, 有些情况下是很明显, 但并不总是如此. 例如:

```kotlin
class SomeModel(val id:IdRec){
    suspend fun saveData() = withContext(Dispatchers.Default){
        saveToDb(id)
    }
}
```

`saveData` 之内的代码运行在另一个线程上. 因此会冻结 `id`, 但由于 `id` 是父类的一个属性, 
因此也会冻结父类.

### 返回数据的冻结

从一个不同的线程返回的数据也会被冻结.
尽管推荐返回不可变的数据, 当你还是可以通过某种方法返回可变的状态, 但不允许返回值被修改.

```kotlin
val dc = withContext(Dispatchers.Default) {
    DataClass("Hello Again")
}

println("${dc.isFrozen}")
```

如果一个可变的状态隔离在单个线程中, 并使用协程的线程操作进行通信, 那么可能导致问题.
如果你试图返回一个数据, 其中保持一个可变状态的引用, 那么也会冻结关联的数据.

详情请参见 [线程隔离的(Thread-isolated)状态](multiplatform-mobile-concurrent-mutability.html#thread-isolated-state).

## 多线程协程

`kotlinx.coroutines` 库的一个 [特殊分支](https://github.com/Kotlin/kotlinx.coroutines/tree/native-mt) 
提供了使用多线程的支持.
这是一个单独的分支, 原因请参见 [Blog: 未来的并发模型](https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap/). 

但是, 只要注意考虑它的具体细节, 你还是可以在产品代码中使用 `kotlinx.coroutines` 的多线程版本.

对于 Kotlin {{ site.data.releases.latest.version }}, 目前的版本是 `{{ site.data.releases.latest.coroutines.version }}-native-mt`. 

要使用多线程版本, 请在 `build.gradle(.kts)` 中对 `commonMain` 源代码集添加一个依赖项:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
val commonMain by getting {
    dependencies {
        implementation ("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}-native-mt")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
commonMain {
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}-native-mt'
    }
}
```

</div>
</div>

如果使用了依赖于 `kotlinx.coroutines` 的其他库, 比如 Ktor, 请确定指定了 `kotlinx-coroutines` 的多线程版本.
你可以使用 `strictly`:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
implementation ("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}-native-mt") {
    version {
        strictly("{{ site.data.releases.latest.coroutines.version }}-native-mt")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}-native-mt' {
    version {
        strictly '{{ site.data.releases.latest.coroutines.version }}-native-mt'
    }
}
```

</div>
</div>

由于 `kotlinx.coroutines` 的主版本是单线程版, 库几乎都会依赖于这个版本. 
如果你看到一个协程操作发生了 `InvalidMutabilityException`, 那么很有可能你使用了错误的版本.

> 使用多线程协程可能导致 _内存泄露_. 对于高负载的复杂协程场景, 这可能会成为问题.
> 我们正在解决这个问题.
>
{style="note"}

参见 [在 Kotlin Multiplatform 应用程序中使用多线程协程的完整示例](https://github.com/touchlab/KaMPKit).

## `kotlinx-coroutines` 之外的替代方案

还有一些替代方法来运行并行代码.

### CoroutineWorker

[`CoroutinesWorker`](https://github.com/Autodesk/coroutineworker) 是 AutoDesk 发布的一个库,
它使用 `kotlinx.coroutines` 的单线程版本, 实现了一些跨线程的协程功能. 

对于简单的挂起函数, 这是一个很好的选择, 但它不支持数据流(Flow) 和其他结构.

### Reaktive

[Reaktive](https://github.com/badoo/Reaktive) 是一个类似 Rx 的库,
它为 Kotlin Multiplatform 实现了 Reactive 扩展. 
它包含一些协程扩展, 但主要是围绕 RX 和线程设计的.

### 自定义处理器

对于更简单的后台任务, 你可以创建自己的处理器, 封装平台相关代码. 
参见一个 [简单的示例](https://github.com/touchlab/KMMWorker).

### 平台并发

在产品代码中, 你也可以依赖平台功能来处理并发. 
如果共用的 Kotlin 代码被用于业务逻辑或数据操作, 而不是用于系统架构, 这种方式可能很有用.

要在 iOS 中跨线程共用一个状态, 这个状态需要被 [冻结](multiplatform-mobile-concurrency-overview.html#immutable-and-frozen-state).
这里提到的并发库将会自动冻结你的数据. 你极少会需要明确的冻结数据.

如果你返回数据到 iOS 平台, 并且会被跨线程共用, 在离开 iOS 代码边界之前, 请确保数据已被冻结.

Kotlin 的数据冻结概念只适用于 Kotlin/Native 平台, 包括 iOS.
要让 `freeze` 在共通代码中可以使用,
你可以为 `freeze` 创建 expect 和 actual 实现,
或使用 [`stately-common`](https://github.com/touchlab/Stately#stately-common), 它提供了这个功能.
在 Kotlin/Native 中, `freeze` 将会冻结你的状态, 在 JVM 平台它什么也不做.

要使用 `stately-common`, 请在 `build.gradle(.kts)` 中为 `commonMain` 源代码集添加一个依赖项:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
val commonMain by getting {
    dependencies {
        implementation ("co.touchlab:stately-common:1.0.x")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
commonMain {
    dependencies {
        implementation 'co.touchlab:stately-common:1.0.x'
    }
}
```

</div>
</div>

_本文由 [Touchlab](https://touchlab.co/) 编写, 供 JetBrains 发布._
