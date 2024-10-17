[//]: # (title: 异步的数据流(Asynchronous Flow))

一个挂起函数可以异步地返回单个结果值, 但我们要如何才能返回多个异步计算的结果值?
这就是 Kotlin 的异步数据流要解决的问题.

## 多个值的表达

在 Kotlin 中, 多个值可以使用 [集合] 表达.
比如, 我们可以通过 `simple` 函数返回一个 [List], 其中包含 3 个数值,
然后使用 [forEach] 输出这些数值:

```kotlin
fun simple(): List<Int> = listOf(1, 2, 3)

fun main() {
    simple().forEach { value -> println(value) }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-01.kt).
>
{style="note"}

这段代码的输出是:

```text
1
2
3
```

<!--- TEST -->

### 序列(Sequence)

如果我们需要通过某些非常消耗 CPU 的阻塞性代码来计算这些数值(每个数值的计算消耗 100ms),
那么我们可以使用 [Sequence] 来表达这些数值:

```kotlin
fun simple(): Sequence<Int> = sequence { // 序列的构建器
    for (i in 1..3) {
        Thread.sleep(100) // 假设这里是数值的计算
        yield(i) // 产生下一个值
    }
}

fun main() {
    simple().forEach { value -> println(value) }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-02.kt).
>
{style="note"}

这段代码输出的数值与前面相同, 但它要在输出每个数值之前等待 100ms.

<!--- TEST
1
2
3
-->

### 挂起函数(Suspending function)

但是, 数值的计算过程会阻塞运行这段代码的主线程.
如果这些数值由异步代码计算, 我们可以对 `simple` 函数添加 `suspend` 标记,
这样这个函数就可以执行它的工作, 而不会发生阻塞, 而且还能将结果返回为 list:

```kotlin
import kotlinx.coroutines.*

//sampleStart
suspend fun simple(): List<Int> {
    delay(1000) // 假设这里在执行某些异步操作
    return listOf(1, 2, 3)
}

fun main() = runBlocking<Unit> {
    simple().forEach { value -> println(value) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-03.kt).
>
{style="note"}

这段代码会等待 1 秒, 然后输出数值.

<!--- TEST
1
2
3
-->

### 数据流(Flow) {id="flows"}

使用 `List<Int>` 作为结果类型, 代码我们只能一次性返回所有的结果值.
为了表达异步计算的多个结果值构成的流(stream), 我们可以使用 [`Flow<Int>`][Flow] 类型,
就象对同步计算的结果值使用 `Sequence<Int>` 类型一样:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow { // 数据流构建器
    for (i in 1..3) {
        delay(100) // 假设我们在这里进行某些计算工作
        emit(i) // 发射(emit)下一个值
    }
}

fun main() = runBlocking<Unit> {
    // 启动一个并发的协程, 检查主线程是否被阻塞
    launch {
        for (k in 1..3) {
            println("I'm not blocked $k")
            delay(100)
        }
    }
    // 收取(collect)流中的内容
    simple().collect { value -> println(value) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-04.kt).
>
{style="note"}

这段代码会在输出每个数值之前等待 100ms, 而不会阻塞主线程.
在主线程中运行的另一个独立的协程中, 每隔 100ms 会输出 "I'm not blocked" 消息,
因此可以确定主线程没有被阻塞:

```text
I'm not blocked 1
1
I'm not blocked 2
2
I'm not blocked 3
3
```

<!--- TEST -->

请注意, 使用 [Flow] 的代码与前面的示例代码之间的区别如下:

* [Flow] 类型的构建器函数叫做 [flow][_flow].
* `flow { ... }` 构建器代码段之内的代码可以挂起.
* `simple` 函数不再带有 `suspend` 标识符.
* 使用 [emit][FlowCollector.emit] 函数, 从流中 _发射(emit)_ 值.
* 使用 [collect][collect] 函数, 从流中 _收取(collect)_ 值.

> 在 `simple` 函数的 `flow { ... }` 代码段之内, 我们可以将 [delay] 替换为 `Thread.sleep`,
> 这时可以看到主线程会被阻塞.
>
{style="note"}

## 数据流(Flow)是 "冷的"(cold)

数据流类似于 sequence, 但它是 _"冷的"(cold)_ 流 &mdash;
直到流中的数据被收集时, 才会执行[flow][_flow] 构建器之内的代码.
下面的示例程序可以演示这个特性:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    println("Flow started")
    for (i in 1..3) {
        delay(100)
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    println("Calling simple function...")
    val flow = simple()
    println("Calling collect...")
    flow.collect { value -> println(value) }
    println("Calling collect again...")
    flow.collect { value -> println(value) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-05.kt).
>
{style="note"}

这段代码的输出是:

```text
Calling simple function...
Calling collect...
Flow started
1
2
3
Calling collect again...
Flow started
1
2
3
```

<!--- TEST -->

`simple` 函数 (负责返回一个数据流) 不使用 `suspend` 标记符, 关键原因在这里.
对 `simple()` 的调用本身会立即返回, 不会等待任何任务.
数据流会在每次被收集的时候启动, 所以, 每次调用 `collect` 时我们都会再次看到 "Flow started" 消息的输出.

## 简要介绍数据流的取消

数据流的取消使用协程通常的协作取消机制.
和通常的机制一样, 如果数据流在一个可取消的挂起函数(比如 [delay])之内被挂起, 那么数据流的收集可以取消.
下面的示例程序会演示, 在 [withTimeoutOrNull] 代码段之内运行时, 如果发生超时, 数据流会被取消,
并停止执行它的代码:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100)
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    withTimeoutOrNull(250) { // 250ms 后超时
        simple().collect { value -> println(value) }
    }
    println("Done")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-06.kt).
>
{style="note"}

注意, `simple` 函数内的数据流只发射(emit)了 2 个数值, 最终的输出结果如下:

```text
Emitting 1
1
Emitting 2
2
Done
```

<!--- TEST -->

更多详情, 请参见 [检查数据流的取消](#flow-cancellation-checks) 小节.

## 数据流构建器

前面的示例代码中使用的 `flow { ... }` 构建器是最基本的数据流构建器.
还有其他一些构建器可以声明数据流:

* [flowOf] 构建器, 定义一个数据流, 发射一组固定的值.
* 使用 `.asFlow()` 扩展函数, 可以将各种集合(collection)和序列(sequence)转换为数据流.

例如, 从数据流输出数值 1 到 3 的那段代码, 可以重写为以下代码:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    // 将整数范围(range)转换为数据流
    (1..3).asFlow().collect { value -> println(value) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-07.kt).
>
{style="note"}

<!--- TEST
1
2
3
-->

## 数据流的中间操作符(Intermediate flow operator)

数据流可以使用操作符进行变换, 与对集合(collection)和序列(sequence)进行变换的方式一样.
中间操作符(Intermediate operator) 应用于上游的数据流(upstream flow), 然后返回一个下游数据流(downstream flow).
与数据流一样, 这些操作符也是"冷的"(cold).
这样的操作符调用本身不是挂起函数. 它的工作会快速结束, 返回结果是, 变换后的数据流的定义.

基本的操作符的名称与 [map] 和 [filter] 类似.
与序列的操作符的一个重要区别在于, 数据流的这些操作符之内的代码段可以调用挂起函数.

比如, 一个包含请求的数据流, 可以使用 [map] 操作符映射为结果值,
即使一个请求的执行是由挂起函数实现的长时间的操作:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
suspend fun performRequest(request: Int): String {
    delay(1000) // 假设这里是一个长时间的异步工作
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // 由请求构成的数据流
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-08.kt).
>
{style="note"}

这段代码会输出以下 3 行, 各行之间等待 1 秒:

```text
response 1
response 2
response 3
```

<!--- TEST -->

### 变换操作符(Transform operator)

数据流的变换操作符中, 最常用的就是 [transform].
它可以用来实现简单的变换, 比如 [map] 和 [filter], 也可以实现更复杂的变换.
使用 `transform` 操作符, 我们可以 [发射(emit)][FlowCollector.emit] 任意次数的任意值.

比如, 使用 `transform` 我们可以在执行一个长时间运行的异步请求之前发射一个字符串,
之后再发射一个应答结果:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

suspend fun performRequest(request: Int): String {
    delay(1000) // 假设这里是一个长时间运行的异步任务
    return "response $request"
}

fun main() = runBlocking<Unit> {
//sampleStart
    (1..3).asFlow() // 由请求构成的数据流
        .transform { request ->
            emit("Making request $request")
            emit(performRequest(request))
        }
        .collect { response -> println(response) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-09.kt).
>
{style="note"}

这段代码的输出是:

```text
Making request 1
response 1
Making request 2
response 2
Making request 3
response 3
```

<!--- TEST -->

### 限制大小操作符(Size-limiting operator)

限制大小(Size-limiting) 的中间操作符, 比如 [take], 在达到相应的大小限制之后, 会取消数据流的执行.
协程的取消总是通过抛出异常来实现的, 因此, 在协程取消时,
所有的资源管理函数 (比如 `try { ... } finally { ... }` 代码段) 都能够正常工作:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun numbers(): Flow<Int> = flow {
    try {
        emit(1)
        emit(2)
        println("This line will not execute")
        emit(3)
    } finally {
        println("Finally in numbers")
    }
}

fun main() = runBlocking<Unit> {
    numbers()
        .take(2) // 只获取最前面的 2 个值
        .collect { value -> println(value) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-10.kt).
>
{style="note"}

这段代码的输出清楚的表面, 在 `numbers()` 函数中, `flow { ... }` 代码体,
会在发射第 2 个数值之后停止执行:

```text
1
2
Finally in numbers
```

<!--- TEST -->

## 数据流的结束操作符(Terminal flow operator)

数据流上的结束操作符(Terminal operator)是 _挂起函数_, 它会开始收集数据流中的值.
最基本的结束操作符是 [collect], 但还有其他结束操作符, 可以方便地实现以下功能:

* 转换为各种集合, 比如 [toList] 和 [toSet].
* 取得 [first] 值的操作符, 而且会确保数据流发射 [single] 值.
* 使用 [reduce] 和 [fold], 将数据流压缩为单个值.

比如:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    val sum = (1..5).asFlow()
        .map { it * it } // 从 1 到 5 的平方
        .reduce { a, b -> a + b } // 求和 (结束操作符)
    println(sum)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-11.kt).
>
{style="note"}

最终结果是单个数值:

```text
55
```

<!--- TEST -->

## 数据流的执行是顺序的(sequential)

数据流的每次单独的收集操作会顺序的执行, 除非使用了特殊的操作符, 比如对多个数据流进行操作.
收集操作直接在调用结束操作符的协程内工作.
默认不会启动新的协程.
每个发射的值, 会由从上游数据流到下游数据流的, 所有的中间操作符处理,
之后, 发送给结束操作符.

请看下面的示例程序, 它会过滤偶数, 然后映射为字符串:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    (1..5).asFlow()
        .filter {
            println("Filter $it")
            it % 2 == 0
        }
        .map {
            println("Map $it")
            "string $it"
        }.collect {
            println("Collect $it")
        }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-12.kt).
>
{style="note"}

输出结果为:

```text
Filter 1
Filter 2
Map 2
Collect string 2
Filter 3
Filter 4
Map 4
Collect string 4
Filter 5
```

<!--- TEST -->

## 数据流的上下文(context)

数据流的收集工作总是会在调用收集函数的协程的上下文中执行.
比如, 如果存在一个数据流 `simple`, 那么不管数据流 `simple` 的具体实现细节如何,
以下代码总是会在这段代码中指定的上下文中执行:

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // 在指定的上下文中执行
    }
}
```

<!--- CLEAR -->

数据流的这种特性称为 _上下文保留(context preservation)_.

因此, 默认情况下 `flow { ... }` 构建器中的代码, 会在由对应的数据流的收集器所提供的上下文中运行.
比如, 假设 `simple` 函数的实现会输出调用它的线程名称, 然后发射 3 个数值:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

//sampleStart
fun simple(): Flow<Int> = flow {
    log("Started simple flow")
    for (i in 1..3) {
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    simple().collect { value -> log("Collected $value") }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-13.kt).
>
{style="note"}

这段代码的输出是:

```text
[main @coroutine#1] Started simple flow
[main @coroutine#1] Collected 1
[main @coroutine#1] Collected 2
[main @coroutine#1] Collected 3
```

<!--- TEST FLEXIBLE_THREAD -->

由于调用 `simple().collect` 的是主线程, `simple` 的数据流的代码体也由主线程调用.
对于快速执行的代码, 或异步执行的代码, 如果不关心执行时的上下文, 并且不阻塞调用者, 这是非常完美的默认动作.

### 使用 withContext 时的一个常见陷阱

但是, 对于长时间运行, 非常消耗 CPU 的代码, 可能需要在 [Dispatchers.Default] 上下文内执行,
而 UI 更新代码需要在 [Dispatchers.Main] 上下文内执行.
通常, 使用 Kotlin 协程的代码可以通过 [withContext] 来切换上下文,
但在 `flow { ... }` 构建器内的代码必须服从数据流的上下文保留(context preservation)特性,
因此不允许在不同的上下文内执行 [emit][FlowCollector.emit].

试试运行以下代码:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    // 在数据流构建器中, 对非常消耗 CPU 的代码切换上下文的错误方式
    kotlinx.coroutines.withContext(Dispatchers.Default) {
        for (i in 1..3) {
            Thread.sleep(100) // 假设我们在这里执行非常消耗 CPU 的计算过程
            emit(i) // 发射下一个值
        }
    }
}

fun main() = runBlocking<Unit> {
    simple().collect { value -> println(value) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-14.kt).
>
{style="note"}

这段代码会产生以下异常:

```text
Exception in thread "main" java.lang.IllegalStateException: Flow invariant is violated:
		Flow was collected in [CoroutineId(1), "coroutine#1":BlockingCoroutine{Active}@5511c7f8, BlockingEventLoop@2eac3323],
		but emission happened in [CoroutineId(1), "coroutine#1":DispatchedCoroutine{Active}@2dae0000, Dispatchers.Default].
		Please refer to 'flow' documentation or use 'flowOn' instead
	at ...
```

<!--- TEST EXCEPTION -->

### flowOn 操作符

这个异常告诉我们, 应该使用 [flowOn] 函数来切换发射数据时的上下文.
我们在下面的示例程序中演示切换数据流上下文的正确方式,
它会输出对应的线程名称, 演示它的工作方式:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun log(msg: String) = println("[${Thread.currentThread().name}] $msg")

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        Thread.sleep(100) // 假设我们在这里执行非常消耗 CPU 的计算过程
        log("Emitting $i")
        emit(i) // 发射下一个值
    }
}.flowOn(Dispatchers.Default) // 在数据流构建器中, 对非常消耗 CPU 的代码切换上下文的正确方式

fun main() = runBlocking<Unit> {
    simple().collect { value ->
        log("Collected $value")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-15.kt).
>
{style="note"}

注意 `flow { ... }` 工作在后台线程中, 而数据收集发生在主线程中:

<!--- TEST FLEXIBLE_THREAD
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 1
[main @coroutine#1] Collected 1
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 2
[main @coroutine#1] Collected 2
[DefaultDispatcher-worker-1 @coroutine#2] Emitting 3
[main @coroutine#1] Collected 3
-->

另外还值得注意的是, [flowOn] 操作符改变了数据流默认的顺序性(sequential)特性.
现在, 数据的收集发生在一个线程内("coroutine#1"), 而数据的发射发生在另一个协程内("coroutine#2"),
而且发射协程在另一个线程内, 与收集协程并行执行.
当上游数据流在它的上下文内需要切换 [CoroutineDispatcher] 时, [flowOn] 操作符为它创建了另一个协程.

## 缓冲(Buffering)

让数据流的不同部分在不同的协程中执行, 收集数据流所耗费的总时间可能会有所改进, 尤其是涉及长时间运行的异步操作的情况.
比如, 假设 数据流 `simple` 的数据发射操作很慢, 每产生一个元素需要 100 ms;
而数据收集操作也很慢, 处理每个元素需要 300 ms.
那么我们来看看, 从这样的数据流收集 3 个数值需要多长时间:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设这里的异步操作需要等待 100 ms
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> {
    val time = measureTimeMillis {
        simple().collect { value ->
            delay(300) // 假设处理值需要 300 ms
            println(value)
        }
    }
    println("Collected in $time ms")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-16.kt).
>
{style="note"}

输出的结果类似以下内容, 整个数据流的收集过程需要大约 1200 ms (3 个数值, 每个需要 400 ms):

```text
1
2
3
Collected in 1220 ms
```

<!--- TEST ARBITRARY_TIME -->

我们可以对数据流使用 [buffer] 操作符, 让数据流 `simple` 的数据发射代码, 与数据收集代码并行执行,
而不是让它们顺序执行:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设这里的异步操作需要等待 100 ms
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        simple()
            .buffer() // 对数据发射进行缓冲, 不要等待
            .collect { value ->
                delay(300) // 假设处理值需要 300 ms
                println(value)
            }
    }
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-17.kt).
>
{style="note"}

这段代码会输出同样的数值, 但运行速度更快, 因为我们实际上创建了数据的处理管道(processing pipeline),
只对第一个数值需要等待 100 ms, 然后对每个数值的处理花费 300 ms.
这种方式下, 整个运行过程花费大约 1000 ms:

```text
1
2
3
Collected in 1071 ms
```

<!--- TEST ARBITRARY_TIME -->

> 注意, [flowOn] 操作符在需要切换 [CoroutineDispatcher], 会使用相同的缓冲机制,
> 但在这里, 我们明确的要求使用缓冲, 而不要切换协程执行的上下文.
>
{style="note"}

### 合并(Conflation)

如果一个数据流只代表操作结果(或操作状态变更)的一部分, 可能没有必要处理每一个结果值,
而可以只处理最近的一部分结果.
这种情况下, 如果收集器速度太慢无法快速处理数据流中的所有值, 可以使用 [conflate] 操作符跳过中间值.
在前面的示例程序的基础上, 我们可以编写这样的代码:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设这里的异步操作需要等待 100 ms
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        simple()
            .conflate() // 对发射操作进行合并, 并不处理每一个值
            .collect { value ->
                delay(300) // 假设处理值需要 300 ms
                println(value)
            }
    }
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-18.kt).
>
{style="note"}

我们可以看到, 当第 1 个数值还在处理时, 第 2 个和第 3 个数值已经产生了,
因此第 2 个数值 _被合并(conflated)_, 于是只有最近的(第 3 个数值) 被发送给了收集器:

```text
1
3
Collected in 758 ms
```

<!--- TEST ARBITRARY_TIME -->

### 处理最后的值 {id="processing-the-latest-value"}

当数据的发射端和收集端都非常慢的时候, 合并(Conflation) 是提高处理速度的方法之一. 它的实现方法是丢弃发射的值.
另一种方法是, 每当数据流发射新值时, 将运行缓慢(未能即使处理完成)的收集器取消, 然后重新启动收集器.
有一组 `xxxLatest` 操作符, 它们执行与 `xxx` 操作符相同的逻辑, 区别在于, 如果出现新值则会取消它代码体中的代码.
我们试试将前面的示例程序中的 [conflate] 替换为 [collectLatest]:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.system.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100) // 假设这里的异步操作需要等待 100 ms
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val time = measureTimeMillis {
        simple()
            .collectLatest { value -> // 对前面的值取消收集代码, 并最后一个值重新执行
                println("Collecting $value")
                delay(300) // 假设处理值需要 300 ms
                println("Done $value")
            }
    }
    println("Collected in $time ms")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-19.kt).
>
{style="note"}

由于 [collectLatest] 的代码体执行需要 300 ms, 而每隔 100 ms 就会发射新的值,
所以我们会看到代码体会对每个值执行, 但只对最后一个值执行完毕:

```text
Collecting 1
Collecting 2
Collecting 3
Done 3
Collected in 741 ms
```

<!--- TEST ARBITRARY_TIME -->

## 多个数据流的组合

有很多种方法可以组合多个数据流.

### Zip

就象 Kotlin 标准库中的 [Sequence.zip] 扩展函数一样,
数据流也有一个 [zip] 操作符, 可以将两个数据流中相应的值组合在一起:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    val nums = (1..3).asFlow() // 数值 1..3
    val strs = flowOf("one", "two", "three") // 字符串
    nums.zip(strs) { a, b -> "$a -> $b" } // 组合为一个字符串
        .collect { println(it) } // 收集最后结果, 并输出
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-20.kt).
>
{style="note"}

这段示例程序的输出结果是:

```text
1 -> one
2 -> two
3 -> three
```

<!--- TEST -->

### 结合(Combine)

如果数据流代表一个变量的最近的值, 或者一个操作的最近的结果(参见相关小节 [合并(Conflation)](#conflation)),
那么有可能需要根据相应的数据流中最近的值进行某种计算, 而且当某个上游数据流发射新值时, 又需要重新计算.
这组对应的操作符称为 [combine].

比如, 如果前面示例程序中的数值每 300ms 更新一次, 而字符串每 400ms 更新一次,
那么使用 [zip] 操作符组合它们, 还是会产生相同的结果,
然而结果需要每 400ms 输出一次:

> 在这个示例程序中, 我们使用 [onEach] 中间操作符实现每个元素的延迟,
> 让示例数据流的代码更加接近声明式风格, 而且更加简短.
>
{style="note"}

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    val nums = (1..3).asFlow().onEach { delay(300) } // 数值 1..3, 每隔 300 ms 发射一个值
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 字符串, 每隔 400 ms 发射一个值
    val startTime = System.currentTimeMillis() // 记录开始时刻
    nums.zip(strs) { a, b -> "$a -> $b" } // 使用 "zip", 组合为一个字符串
        .collect { value -> // 收集最后结果, 并输出
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-21.kt).
>
{style="note"}

<!--- TEST ARBITRARY_TIME
1 -> one at 437 ms from start
2 -> two at 837 ms from start
3 -> three at 1243 ms from start
-->

但是, 如果使用 [combine] 操作符, 而不是 [zip]:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking<Unit> {
//sampleStart
    val nums = (1..3).asFlow().onEach { delay(300) } // 数值 1..3, 每隔 300 ms 发射一个值
    val strs = flowOf("one", "two", "three").onEach { delay(400) } // 字符串, 每隔 400 ms 发射一个值
    val startTime = System.currentTimeMillis() // 记录开始时刻
    nums.combine(strs) { a, b -> "$a -> $b" } // 使用 "combine", 组合为一个字符串
        .collect { value -> // 收集最后结果, 并输出
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-22.kt).
>
{style="note"}

我们会得到非常不同的输出结果, 每当 `nums` 或 `strs` 数据流发射一个值, 就会输出一行结果:

```text
1 -> one at 452 ms from start
2 -> one at 651 ms from start
2 -> two at 854 ms from start
3 -> two at 952 ms from start
3 -> three at 1256 ms from start
```

<!--- TEST ARBITRARY_TIME -->

## 压平(Flatten)数据流

数据流代表异步接收的值序列, 因此很容易遇到这种的情况, 每个值触发一个请求, 得到另外一组值.
比如, 假设我们有下面这样的函数, 它返回一个数据流, 发送 2 个字符串, 中间间隔 500ms:

```kotlin
fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First")
    delay(500) // 等待 500 ms
    emit("$i: Second")
}
```

<!--- CLEAR -->

然后, 如果我们有一个数据流, 包含 3 个整数, 并对每个整数调用 `requestFlow`, 如下:

```kotlin
(1..3).asFlow().map { requestFlow(it) }
```

<!--- CLEAR -->

然后我们会得到一个数据流的数据流 (`Flow<Flow<String>>`), 这样的情况下,
就需要将它 _压平(Flatten)_, 变为单个数据流, 然后才能进行进一步处理.
集合和序列都有 [flatten][Sequence.flatten] 和 [flatMap][Sequence.flatMap] 操作符来实现这样的功能.
但是, 由于数据流的异步特性, 需要使用不同的 _模式(mode)_ 来进行压平(Flatten)处理,
因此, 对于数据流, 存在一组压平(Flatten)操作符.

### flatMapConcat

将数据流的数据流串联(Concatenate)起来的功能, 由 [flatMapConcat] 和 [flattenConcat] 操作符提供.
这两个操作符与序列的对应的操作符最类似.
在收集下一个值之前, 它们会等待内层的数据流完成,
如下例所示:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First")
    delay(500) // 等待 500 ms
    emit("$i: Second")
}

fun main() = runBlocking<Unit> {
//sampleStart
    val startTime = System.currentTimeMillis() // 记录开始时刻
    (1..3).asFlow().onEach { delay(100) } // 每隔 100 ms 发射一个数值
        .flatMapConcat { requestFlow(it) }
        .collect { value -> // 收集最后结果, 并输出
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-23.kt).
>
{style="note"}

输出结果如下, 清楚的显示出 [flatMapConcat] 顺序执行的特性:

```text
1: First at 121 ms from start
1: Second at 622 ms from start
2: First at 727 ms from start
2: Second at 1227 ms from start
3: First at 1328 ms from start
3: Second at 1829 ms from start
```

<!--- TEST ARBITRARY_TIME -->

### flatMapMerge

另一种压平操作是, 同时收集所有的输入数据流, 然后将它们的值合并为单个数据流,
因此能够尽可能快的发射最终结果值.
这个模式由 [flatMapMerge] 和 [flattenMerge] 操作符实现.
这两个操作符都接受一个可选的 `concurrency` 参数,
用来限制允许同时收集的数据流个数 (默认值等于 [DEFAULT_CONCURRENCY]).

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First")
    delay(500) // 等待 500 ms
    emit("$i: Second")
}

fun main() = runBlocking<Unit> {
//sampleStart
    val startTime = System.currentTimeMillis() // 记录开始时刻
    (1..3).asFlow().onEach { delay(100) } // 每隔 100 ms 发射一个数值
        .flatMapMerge { requestFlow(it) }
        .collect { value -> // 收集最后结果, 并输出
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-24.kt).
>
{style="note"}

输出结果如下, 很清楚的显示出, [flatMapMerge] 是并发的:

```text
1: First at 136 ms from start
2: First at 231 ms from start
3: First at 333 ms from start
1: Second at 639 ms from start
2: Second at 732 ms from start
3: Second at 833 ms from start
```

<!--- TEST ARBITRARY_TIME -->

> 注意, [flatMapMerge] 对它的代码体 (上面示例程序中是 `{ requestFlow(it) }`) 的调用是顺序的,
> 但对结果数据流的收集是并发的, 最后结果等于首先顺序的执行 `map { requestFlow(it) }`,
> 然后对结果调用 [flattenMerge].
>
{style="note"}

### flatMapLatest

在 ["处理最后的值"](#processing-the-latest-value) 小节中我们介绍过 [collectLatest] 操作符,
与它类似, 有一个对应的 "Latest" 压平模式, 每次发射新的数据流, 对之前的数据流的收集(如果未完成)就会被取消.
这种模式由 [flatMapLatest] 操作符实现.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun requestFlow(i: Int): Flow<String> = flow {
    emit("$i: First")
    delay(500) // 等待 500 ms
    emit("$i: Second")
}

fun main() = runBlocking<Unit> {
//sampleStart
    val startTime = System.currentTimeMillis() // 记录开始时刻
    (1..3).asFlow().onEach { delay(100) } // 每隔 100 ms 发射一个数值
        .flatMapLatest { requestFlow(it) }
        .collect { value -> // 收集最后结果, 并输出
            println("$value at ${System.currentTimeMillis() - startTime} ms from start")
        }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-25.kt).
>
{style="note"}

输出结果如下, 清楚的演示了 [flatMapLatest] 的工作方式:

```text
1: First at 142 ms from start
2: First at 322 ms from start
3: First at 425 ms from start
3: Second at 931 ms from start
```

<!--- TEST ARBITRARY_TIME -->

> 注意, 在收到新值时, [flatMapLatest] 会取消它代码体中的所有代码 (在上面的例子中是 `{ requestFlow(it) }`).
> 在这个示例中不会产生差别, 因为 `requestFlow` 的调用是很快的, 不会发生挂起, 而且无法取消.
> 但是, 如果我们在 `requestFlow` 代码体之内使用挂起函数, 比如 `delay`, 那么在输出中就能够看到差别.
>
{style="note"}

## 数据流的异常

如果发射器或操作符之内的代码抛出异常, 数据流的收集就会异常结束.
有几种方法来处理这些异常.

### 在收集器中使用 try/catch

收集器可以使用 Kotlin 的 [`try/catch`][exceptions] 代码段来处理异常:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i) // 发射下一个值
    }
}

fun main() = runBlocking<Unit> {
    try {
        simple().collect { value ->
            println(value)
            check(value <= 1) { "Collected $value" }
        }
    } catch (e: Throwable) {
        println("Caught $e")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-26.kt).
>
{style="note"}

这段代码成功地捕获在 [collect] 结束操作符中发生的异常,
而且我们看到, 在这个异常之后, 没有发射其他值:

```text
Emitting 1
1
Emitting 2
2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST -->

### 一切异常都会被捕获

前面的示例程序实际上会捕获任何异常, 包括发射器之内, 任何中间操作符之内, 以及结束操作符之内发生的一切异常.
比如, 我们来修改一下代码, 将发射的值 [映射(map)][map] 为字符串,
但这段代码会产生一个异常:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<String> =
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // 发射下一个值
        }
    }
    .map { value ->
        check(value <= 1) { "Crashed on $value" }
        "string $value"
    }

fun main() = runBlocking<Unit> {
    try {
        simple().collect { value -> println(value) }
    } catch (e: Throwable) {
        println("Caught $e")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-27.kt).
>
{style="note"}

这个异常仍然会被捕获, 然后收集处理会停止:

```text
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
```

<!--- TEST -->

## 异常的透明性(transparency)

但是数据流发射器的代码要怎么样才能封装它自己的异常处理逻辑呢?

数据流必须 _对异常透明(transparent to exception)_,
因此, 从 `try/catch` 代码块内部的 `flow { ... }` 构建器中 [发射][FlowCollector.emit] 值, 是违反异常透明性的.
这个规则保证了, 如果收集器会抛出异常, 那么总是能够使用 `try/catch` 捕获这些异常, 就象前面的示例程序那样.

发射器可以使用 [catch] 操作符, 既能够符合这种异常透明性, 又能够封装它自己的异常处理代码.
`catch` 操作符的代码体能够分析异常, 并根据捕获的异常类型作出不同的反应:

* 可以使用 `throw` 再次抛出异常.
* 在 [catch] 代码体中使用 [emit][FlowCollector.emit], 可以将异常转换为值的发射.
* 异常可以忽略, 输出到日志, 或被其它代码处理.

比如, 我们可以对捕获的异常, 发射它的文字:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<String> =
    flow {
        for (i in 1..3) {
            println("Emitting $i")
            emit(i) // 发射下一个值
        }
    }
    .map { value ->
        check(value <= 1) { "Crashed on $value" }
        "string $value"
    }

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .catch { e -> emit("Caught $e") } // 根据异常, 发射值
        .collect { value -> println(value) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-28.kt).
>
{style="note"}

这个示例程序的输出是相同的, 尽管我们没有在代码中使用 `try/catch`.

<!--- TEST
Emitting 1
string 1
Emitting 2
Caught java.lang.IllegalStateException: Crashed on 2
-->

### 透明捕获(Transparent catch)

[catch] 中间操作符遵守异常透明性规则, 只捕获上游数据流中的异常
(也就是在 `catch` 之前的所有操作符中发生的异常, 但不包含 `catch` 之后的).
如果 `collect { ... }` 之内的代码 (位置在 `catch` 之后) 抛出了异常, 那么这个异常不会被捕获:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    simple()
        .catch { e -> println("Caught $e") } // 不会捕捉下游数据流中的异常
        .collect { value ->
            check(value <= 1) { "Collected $value" }
            println(value)
        }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-29.kt).
>
{style="note"}

尽管存在 `catch` 操作符, 但这段示例代码不会输出 "Caught ..." 消息:

```text
Emitting 1
1
Emitting 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
	at ...
```

<!--- TEST EXCEPTION -->

### 声明式异常捕捉

我们能够将 [catch] 操作符的声明式特性, 与处理所有的异常的需求结合在一起,
方法是将 [collect] 操作符的代码体移动到 [onEach] 之内, 并放在 `catch` 操作符之前.
然后, 需要通过不带参数调用 `collect()`, 来触发对这个数据流的收集:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .onEach { value ->
            check(value <= 1) { "Collected $value" }
            println(value)
        }
        .catch { e -> println("Caught $e") }
        .collect()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-30.kt).
>
{style="note"}

现在我们可以看到, 会输出 "Caught ..." 消息, 因此我们可以捕获所有的异常, 而不需要明确使用 `try/catch` 代码块:

```text
Emitting 1
1
Emitting 2
Caught java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 数据流的完成

当数据流的收集完成时 (无论是正常完成, 还是异常完成), 它可能会需要执行某种操作.
你可能以及注意到了, 可以通过两种方式实现: 命令式, 或声明式.

### 命令式的 finally 代码块

除了 `try`/`catch` 之外, 收集器还可以使用 `finally` 代码块, 在 `collect` 完成时执行某种操作.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = (1..3).asFlow()

fun main() = runBlocking<Unit> {
    try {
        simple().collect { value -> println(value) }
    } finally {
        println("Done")
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-31.kt).
>
{style="note"}

这段代码会输出 `simple` 数据流产生的 3 个数值, 之后输出一个 "Done" 字符串:

```text
1
2
3
Done
```

<!--- TEST  -->

### 声明式的完成处理

对于声明风格的方式, 数据流有 [onCompletion] 中间操作符, 当数据流收集完成时会调用它.

前面的示例程序可以使用 [onCompletion] 操作符改写如下, 输出结果相同:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun simple(): Flow<Int> = (1..3).asFlow()

fun main() = runBlocking<Unit> {
//sampleStart
    simple()
        .onCompletion { println("Done") }
        .collect { value -> println(value) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-32.kt).
>
{style="note"}

<!--- TEST
1
2
3
Done
-->

[onCompletion] 的重要优点是, Lambda 表达式可以接受一个可为 null 的 `Throwable` 参数,
通过这个参数来确定数据流的收集是正常完成还是异常完成.
在下面的示例程序中, `simple` 数据流在发射数值 1 之后会抛出一个异常:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = flow {
    emit(1)
    throw RuntimeException()
}

fun main() = runBlocking<Unit> {
    simple()
        .onCompletion { cause -> if (cause != null) println("Flow completed exceptionally") }
        .catch { cause -> println("Caught exception") }
        .collect { value -> println(value) }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-33.kt).
>
{style="note"}

如你希望的那样, 这段代码的输出是:

```text
1
Flow completed exceptionally
Caught exception
```

<!--- TEST -->

[onCompletion] 操作符, 与 [catch] 不同, 不会处理异常.
从上面的示例我们可以看到, 异常仍然会流向下游.
它会被发送到更远的 `onCompletion` 操作符, 也可以由使用 `catch` 操作符来处理.

### 数据流的成功完成

与 [catch] 操作符的另一个不同在于, [onCompletion] 可以收到所有的异常,
而且只有在上游数据流成功完成(没有取消, 也没有失败)的情况下, 才会收到一个 `null` 的异常 .

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun simple(): Flow<Int> = (1..3).asFlow()

fun main() = runBlocking<Unit> {
    simple()
        .onCompletion { cause -> println("Flow completed with $cause") }
        .collect { value ->
            check(value <= 1) { "Collected $value" }
            println(value)
        }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-34.kt).
>
{style="note"}

我们可以看到数据流完成的 cause 不是 null, 因为数据流被下游的异常终止了:

```text
1
Flow completed with java.lang.IllegalStateException: Collected 2
Exception in thread "main" java.lang.IllegalStateException: Collected 2
```

<!--- TEST EXCEPTION -->

## 命令式 vs 声明式

现在我们知道了如何收集数据流, 以及如何通过命令式和声明式方式, 处理它的完成事件和异常.
下面自然要问, 通常应该使用哪种方式, 为什么?
作为一个库, 我们并不具体的主张使用哪一种方式, 而是相信这两种选择都有价值,
应该按照你自己的偏好和代码风格来进行选择.

## 启动数据流

很容易使用数据流来表达从某个来源得到的异步的事件.
这种情况下, 我们需要某种类似 `addEventListener` 函数的机制,
用来注册一段代码, 表示对收到的事件的响应, 然后继续后面的工作.
[onEach] 操作符可以实现这个目的. 但是, `onEach` 是一个中间操作符.
我们还需要一个结束操作符来收集数据流. 否则, 仅仅调用 `onEach` 是没有效果的.

如果我们在 `onEach` 之后使用 [collect] 结束操作符, 那么它之后的代码将会等待, 直到数据流开始收集 :

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
// 模拟一个事件的数据流
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .collect() // <--- 数据流的收集处理会等待
    println("Done")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-35.kt).
>
{style="note"}

你可以看到, 这段代码的输出是:

```text
Event: 1
Event: 2
Event: 3
Done
```

<!--- TEST -->

在这里, 使用 [launchIn] 结束操作符就很方便.
将 `collect` 替换为 `launchIn`, 我们可以在一个单独的协程内启动数据流的收集处理,
因此后面的代码可以立即执行:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

// 模拟一个事件的数据流
fun events(): Flow<Int> = (1..3).asFlow().onEach { delay(100) }

//sampleStart
fun main() = runBlocking<Unit> {
    events()
        .onEach { event -> println("Event: $event") }
        .launchIn(this) // <--- 在一个单独的协程内启动数据流
    println("Done")
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-36.kt).
>
{style="note"}

这段代码的输出是:

```text
Done
Event: 1
Event: 2
Event: 3
```

<!--- TEST -->

`launchIn` 需要通过参数指定一个 [CoroutineScope], 收集数据流的协程会在这个作用范围(scope)中启动.
上面的示例程序中, 这个作用范围(scope)来自 [runBlocking] 协程构建器,
因此当数据流运行时, 这个 [runBlocking] 作用范围(scope)会等待它的子协程完成,
因此能保证这个示例程序的 main 函数不会返回并终止运行.

在真正的应用程序中, 协程作用范围应该来自一个生存期有限的实体.
一旦这个实体的生存期结束, 对应的协程作用范围也会被取消, 并且会取消对应的数据流的收集处理.
通过这种方式, `onEach { ... }.launchIn(scope)` 的组合, 可以象 `addEventListener` 一样工作.
但是, 我们不需要相应的 `removeEventListener` 函数, 因为协程的取消以及结构化的并发功能已经实现了这个功能.

注意, [launchIn] 也会返回一个 [Job], 这个任务(Job)可以用来 [取消(cancel)][Job.cancel] 相应的数据流收集协程,
但不会取消整个协程作用范围,
还可以用来 [join][Job.join], 等待这个任务(Job)完成.

### 检查数据流的取消 {id="flow-cancellation-checks"}

为了使用方便, [flow][_flow] 构建器会对每个发射的值额外执行一个 [ensureActive] 检查, 用来检查数据流是否被取消.
也就是说, 如果在 `flow { ... }` 之内通过繁忙的循环代码来发射值, 这样的数据流是可以取消的:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun foo(): Flow<Int> = flow {
    for (i in 1..5) {
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    foo().collect { value ->
        if (value == 3) cancel()
        println(value)
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-37.kt).
>
{style="note"}

我们得到的数值只到 3, 然后在试图发射 4 的时候发生 [CancellationException] 异常:

```text
Emitting 1
1
Emitting 2
2
Emitting 3
3
Emitting 4
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@6d7b4f4c
```

<!--- TEST EXCEPTION -->

但是, 考虑到性能问题, 数据流的其他大多数操作符不会自己做这样的额外的取消检查.
比如, 如果使用 [IntRange.asFlow] 扩展, 编写同样的繁忙的循环代码, 并且不在任何地方挂起协程,
那么不会检查数据流是否取消:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun main() = runBlocking<Unit> {
    (1..5).asFlow().collect { value ->
        if (value == 3) cancel()
        println(value)
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-38.kt).
>
{style="note"}

从 1 到 5 的所有数值都会被收集, 而协程的取消只有在从 `runBlocking` 返回之前才会被检测到:

```text
1
2
3
4
5
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@3327bd23
```

<!--- TEST EXCEPTION -->

#### 让繁忙的循环代码变得可以取消

如果你的协程中存在繁忙的循环, 那么就必须明确的检查协程是否被取消.
你可以添加代码 `.onEach { currentCoroutineContext().ensureActive() }`,
但已经有了现成可用的 [cancellable] 操作符来实现这样的功能:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

//sampleStart
fun main() = runBlocking<Unit> {
    (1..5).asFlow().cancellable().collect { value ->
        if (value == 3) cancel()
        println(value)
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 完整的示例代码请参见 [这里](https://github.com/kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-flow-39.kt).
>
{style="note"}

使用 `cancellable` 操作符之后, 收集的数值只有从 1 到 3:

```text
1
2
3
Exception in thread "main" kotlinx.coroutines.JobCancellationException: BlockingCoroutine was cancelled; job="coroutine#1":BlockingCoroutine{Cancelled}@5ec0a365
```

<!--- TEST EXCEPTION -->

## 数据流与响应式(Reactive) Stream

很多开发者已经熟悉了 [响应式(Reactive) Stream](https://www.reactive-streams.org/), 或者其他响应式(Reactive)框架, 比如 RxJava 和 Project Reactor,
对这些开发者来说, 数据流的设计看起来应该非常熟悉.

确实如此, 数据流的设计参考了响应式(Reactive) Stream 和它的各种实现.
但是数据流的主要目标是, 要采用尽可能简单的设计, 要与 Kotlin 和协程挂起协调, 并且要遵守结构化并发的各种原则.
没有响应式(Reactive)项目的先驱者和他们的大量工作, 要达到这些目标是不可能的.
完整的故事请阅读 [响应式(Reactive) Stream 与 Kotlin 数据流](https://medium.com/@elizarov/reactive-streams-and-kotlin-flows-bfd12772cda4).

尽管存在不同, 但在概念上, 数据流 *是* 一个响应式(Reactive) Stream,
数据流可以将转换为响应式发布者(Reactive Publisher) (规格兼容, 而且 TCK 兼容),
也能反过来转换.
`kotlinx.coroutines` 包已经提供了这类直接可用的转换器, 可以在相应的响应式(Reactive)模块内找到
(对响应式(Reactive) Stream 是 `kotlinx-coroutines-reactive`,
对 Project Reactor 是 `kotlinx-coroutines-reactor`,
对 RxJava2/RxJava3 是 `kotlinx-coroutines-rx2`/`kotlinx-coroutines-rx3`).
集成模块包含从 `Flow` 的转换, 向 `Flow` 的转换, 与 Reactor 的 `Context` 的集成,
以及, 与协程挂起协调的, 与各种响应式(Reactive)实体共通工作.

<!-- stdlib references -->

[集合]: collections-overview.md
[List]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/
[forEach]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/for-each.html
[Sequence]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/
[Sequence.zip]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/zip.html
[Sequence.flatten]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/flatten.html
[Sequence.flatMap]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/flat-map.html
[exceptions]: exceptions.md

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[delay]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html
[withTimeoutOrNull]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-timeout-or-null.html
[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html
[Dispatchers.Main]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html
[withContext]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html
[CoroutineDispatcher]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/index.html
[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[Job]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/index.html
[Job.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel.html
[Job.join]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/join.html
[ensureActive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/ensure-active.html
[CancellationException]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-cancellation-exception/index.html

<!--- INDEX kotlinx.coroutines.flow -->

[Flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html
[_flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html
[FlowCollector.emit]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html
[collect]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html
[flowOf]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow-of.html
[map]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html
[filter]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html
[transform]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html
[take]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/take.html
[toList]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/to-list.html
[toSet]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/to-set.html
[first]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/first.html
[single]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/single.html
[reduce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/reduce.html
[fold]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/fold.html
[flowOn]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow-on.html
[buffer]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html
[conflate]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/conflate.html
[collectLatest]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect-latest.html
[zip]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/zip.html
[combine]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/combine.html
[onEach]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/on-each.html
[flatMapConcat]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-concat.html
[flattenConcat]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flatten-concat.html
[flatMapMerge]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-merge.html
[flattenMerge]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flatten-merge.html
[DEFAULT_CONCURRENCY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-d-e-f-a-u-l-t_-c-o-n-c-u-r-r-e-n-c-y.html
[flatMapLatest]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flat-map-latest.html
[catch]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/catch.html
[onCompletion]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/on-completion.html
[launchIn]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/launch-in.html
[IntRange.asFlow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/as-flow.html
[cancellable]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/cancellable.html

<!--- END -->
