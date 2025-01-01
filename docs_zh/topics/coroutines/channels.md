<!--- TEST_NAME ChannelsGuideTest -->

[//]: # (title: 通道(Channel))

延迟产生的数据提供了一种方便的方式可以在协程之间传递单个值.
而通道则提供了另一种方式, 可以在协程之间传递数值的流.

## 通道的基本概念

[Channel] 在概念上非常类似于 `BlockingQueue`. 关键的不同是,
它没有阻塞的 `put` 操作, 而是提供挂起的 [send][SendChannel.send] 操作,
没有阻塞的 `take` 操作, 而是提供挂起的 [receive][ReceiveChannel.receive] 操作.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        // 这里可能是非常消耗 CPU 的计算工作, 或者是一段异步逻辑
        // 但在这个例子中我们只是简单地发送 5 个平方数
        for (x in 1..5) channel.send(x * x)
    }
    // 我们在这里输出收到的整数:
    repeat(5) { println(channel.receive()) }
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-01.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-01.kt).
>
{style="note"}

这段示例程序的输出是:

```text
1
4
9
16
25
Done!
```

<!--- TEST -->

## 通道的关闭与迭代

与序列不同, 通道可以关闭, 表示不会再有更多数据从通道传来了.
在通道的接收端可以使用 `for` 循环很方便地从通道中接收数据.

概念上来说, [close][SendChannel.close] 操作类似于向通道发送一个特殊的关闭标记.
收到这个关闭标记之后, 对通道的迭代操作将会立即停止, 因此可以保证在关闭操作以前发送的所有数据都会被正确接收:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<Int>()
    launch {
        for (x in 1..5) channel.send(x * x)
        channel.close() // 我们已经发送完了所有的数据
    }
    // 我们在这里使用 `for` 循环来输出接收到的数据 (通道被关闭后循环就会结束)
    for (y in channel) println(y)
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-02.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-02.kt).
>
{style="note"}

<!--- TEST
1
4
9
16
25
Done!
-->

## 构建通道的生产者(Producer)

在协程中产生一个数值序列, 这是很常见的模式.
这是并发代码中经常出现的 _生产者(producer)/消费者(consumer)_ 模式的一部分.
你可以将生产者抽象为一个函数, 并将通道作为函数的参数, 然后向通道发送你生产出来的值,
但这就违反了通常的函数设计原则, 也就是函数的结果应该以返回值的形式对外提供.

有一个便利的协程构建器, 名为 [produce], 它可以很简单地编写出生产者端的正确代码,
还有一个扩展函数 [consumeEach], 可以在消费者端代码中替代 `for` 循环:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun CoroutineScope.produceSquares(): ReceiveChannel<Int> = produce {
    for (x in 1..5) send(x * x)
}

fun main() = runBlocking {
//sampleStart
    val squares = produceSquares()
    squares.consumeEach { println(it) }
    println("Done!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-03.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-03.kt).
>
{style="note"}

<!--- TEST
1
4
9
16
25
Done!
-->

## 管道(Pipeline)

管道也是一种设计模式, 比如某个协程可能会产生出无限多个值:

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // 从 1 开始递增的无限整数流
}
```

其他的协程(或者多个协程)可以消费这个整数流, 进行一些处理, 然后产生出其他结果值.
下面的例子中, 我们只对收到的数字做平方运算:

```kotlin
fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```

主代码会启动这些协程, 并将整个管道连接在一起:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val numbers = produceNumbers() // 从 1 开始产生无限的整数
    val squares = square(numbers) // 对整数进行平方
    repeat(5) {
        println(squares.receive()) // 输出前 5 个数字
    }
    println("Done!") // 运行结束
    coroutineContext.cancelChildren() // 取消所有的子协程
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1
    while (true) send(x++) // 从 1 开始递增的无限整数流
}

fun CoroutineScope.square(numbers: ReceiveChannel<Int>): ReceiveChannel<Int> = produce {
    for (x in numbers) send(x * x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-04.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-04.kt).
>
{style="note"}

<!--- TEST
1
4
9
16
25
Done!
-->

> 所有创建协程的函数都被定义为 [CoroutineScope] 上的扩展函数,
> 因此我们可以依靠 [结构化的并发](composing-suspending-functions.md#structured-concurrency-with-async)
> 来保证应用程序中没有留下长期持续的全局协程.
>
{style="note"}

## 使用管道寻找质数

下面我们来编写一个示例程序, 使用协程的管道来生成质数, 来演示一下管道的极端用法.
首先我们产生无限的整数序列.

```kotlin
fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // 从 start 开始递增的无限整数流
}
```

管道的下一部分会对输入的整数流进行过滤, 删除可以被某个质数整除的数字:

```kotlin
fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```

下面我们来构建整个管道, 首先从 2 开始产生无限的整数流, 然后从当前通道中取得质数, 并对找到的每个质数执行管道的下一步:

```
numbersFrom(2) -> filter(2) -> filter(3) -> filter(5) -> filter(7) ...
```

下面的示例程序会输出前 10 个质数, 整个管道运行在主线程的上下文之内.
由于所有的协程都是在主 [runBlocking] 协程的作用范围内启动的, 因此我们不必维护一个已启动的所有协程的列表.
我们可以在输出完前 10 个质数之后,
使用 [cancelChildren][kotlin.coroutines.CoroutineContext.cancelChildren] 扩展函数来取消所有的子协程.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    var cur = numbersFrom(2)
    repeat(10) {
        val prime = cur.receive()
        println(prime)
        cur = filter(cur, prime)
    }
    coroutineContext.cancelChildren() // 取消所有的子协程, 让 main 函数结束
//sampleEnd
}

fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {
    var x = start
    while (true) send(x++) // 从 start 开始递增的无限整数流
}

fun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {
    for (x in numbers) if (x % prime != 0) send(x)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-05.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-05.kt).
>
{style="note"}

这段示例程序的输出是:

```text
2
3
5
7
11
13
17
19
23
29
```

<!--- TEST -->

注意, 你可以使用标准库的协程构建器 [`iterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/iterator.html) 来创建相同的管道.
把 `produce` 函数替换为 `iterator`, 把 `send` 函数替换为 `yield`,
把 `receive` 函数替换为 `next`, 把 `ReceiveChannel` 替换为 `Iterator`,
就可以不用关心删除协程的作用范围了.
而且你也可以不再需要 `runBlocking`.
但是, 上面的示例中演示的, 使用通道的管道的好处在于,
如果你在 [Dispatchers.Default] 上下文中运行的话, 它可以使用 CPU 的多个核心.

总之, 这是一个极不实用的寻找质数的方法.
在实际应用中, 管道一般会牵涉到一些其他的挂起函数调用(比如异步调用远程服务),
而且这些管道不能使用 `sequence`/`iterator` 来构建,
因为这些函数不能允许任意的挂起, 而不象 `produce` 函数, 是完全异步的.

## 扇出(Fan-out)

多个协程可能会从同一个通道接收数据, 并将计算工作分配给这多个协程.
我们首先来创建一个生产者协程, 它定时产生整数(每秒 10 个整数):

```kotlin
fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // 从 1 开始
    while (true) {
        send(x++) // 产生下一个整数
        delay(100) // 等待 0.1 秒
    }
}
```

然后我们创建多个数据处理协程. 这个示例程序中, 这些协程只是简单地输出自己的 id 以及接收到的整数:

```kotlin
fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }
}
```

现在我们启动 5 个数据处理协程, 让它们运行大约 1 秒. 看看结果如何:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val producer = produceNumbers()
    repeat(5) { launchProcessor(it, producer) }
    delay(950)
    producer.cancel() // 取消生产者协程, 因此也杀死了所有其他数据处理协程
//sampleEnd
}

fun CoroutineScope.produceNumbers() = produce<Int> {
    var x = 1 // 从 1 开始
    while (true) {
        send(x++) // 产生下一个整数
        delay(100) // 等待 0.1 秒
    }
}

fun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {
    for (msg in channel) {
        println("Processor #$id received $msg")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-06.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-06.kt).
>
{style="note"}

这个示例程序的输出可能类似如下结果, 但处理协程的 id 和实际收到的具体的整数值可能会略微不同:

```text
Processor #2 received 1
Processor #4 received 2
Processor #0 received 3
Processor #1 received 4
Processor #3 received 5
Processor #2 received 6
Processor #4 received 7
Processor #0 received 8
Processor #1 received 9
Processor #3 received 10
```

<!--- TEST lines.size == 10 && lines.withIndex().all { (i, line) -> line.startsWith("Processor #") && line.endsWith(" received ${i + 1}") } -->

注意, 取消生产者协程会关闭它的通道, 因此最终会结束各个数据处理协程中对这个通道的迭代循环.

而且请注意, 在 `launchProcessor` 中, 我们是如何使用 `for` 循环明确地在通道上进行迭代, 来实现扇出(fan-out).
与 `consumeEach` 不同, 这个 `for` 循环模式完全可以安全地用在多个协程中.
如果某个数据处理协程失败, 其他数据处理协程还会继续处理通道中的数据,
而使用 `consumeEach` 编写的数据处理协程, 无论正常结束还是异常结束, 总是会消费(取消) 它的通道.

## 扇入(Fan-in)

多个协程也可以向同一个通道发送数据.
比如, 我们有一个字符串的通道, 还有一个挂起函数, 不断向通道发送特定的字符串, 然后暂停一段时间:

```kotlin
suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```

现在, 我们启动多个发送字符串的协程, 来看看结果如何
(在这个示例程序中我们在主线程的上下文中启动这些协程, 作为主协程的子协程):

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking {
//sampleStart
    val channel = Channel<String>()
    launch { sendString(channel, "foo", 200L) }
    launch { sendString(channel, "BAR!", 500L) }
    repeat(6) { // 接收前 6 个字符串
        println(channel.receive())
    }
    coroutineContext.cancelChildren() // 取消所有的子协程, 让 main 函数结束
//sampleEnd
}

suspend fun sendString(channel: SendChannel<String>, s: String, time: Long) {
    while (true) {
        delay(time)
        channel.send(s)
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-07.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-07.kt).
>
{style="note"}

输出结果是:

```text
foo
foo
BAR!
foo
foo
BAR!
```

<!--- TEST -->

## 带缓冲区的通道

到目前为止我们演示的通道都没有缓冲区. 无缓冲区的通道只会在发送者与接收者相遇时(也叫做会合(rendezvous))传输数据.
如果先调用了发送操作, 那么它会挂起, 直到调用接收操作,
如果先调用接收操作, 那么它会被挂起, 直到调用发送操作.

[Channel()] 工厂函数和 [produce] 构建器都可以接受一个可选的 `capacity` 参数, 用来指定 _缓冲区大小_.
缓冲区可以允许发送者在挂起之前发送多个数据, 类似于指定了容量的 `BlockingQueue`, 它会在缓冲区已满的时候发生阻塞.

我们来看看以下示例程序的运行结果:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

fun main() = runBlocking<Unit> {
//sampleStart
    val channel = Channel<Int>(4) // 创建带缓冲区的通道
    val sender = launch { // 启动发送者协程
        repeat(10) {
            println("Sending $it") // 发送数据之前, 先输出它
            channel.send(it) // 当缓冲区满时, 会挂起
        }
    }
    // 不接收任何数据, 只是等待
    delay(1000)
    sender.cancel() // 取消发送者协程
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-08.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-08.kt).
>
{style="note"}

使用缓冲区大小为 _4_ 的通道时, 这个示例程序会输出 "sending" _5_ 次:

```text
Sending 0
Sending 1
Sending 2
Sending 3
Sending 4
```

<!--- TEST -->

前 4 个数据会被添加到缓冲区中, 然后在试图发送第 5 个数据时, 发送者协程会挂起.

## 通道是平等的

如果从多个协程中调用通道的发送和接收操作, 从调用发生的顺序来看, 这些操作是 _平等的_.
通道对这些方法以先进先出(first-in first-out)的顺序进行服务,
也就是说, 第一个调用 `receive` 的协程会得到通道中的数据.
在下面的示例程序中, 有两个 "ping" 和 "pong" 协程, 从公用的一个 "table" 通道接收 "ball" 对象.

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
data class Ball(var hits: Int)

fun main() = runBlocking {
    val table = Channel<Ball>() // 一个公用的通道
    launch { player("ping", table) }
    launch { player("pong", table) }
    table.send(Ball(0)) // 把 ball 丢进通道
    delay(1000) // 延迟 1 秒
    coroutineContext.cancelChildren() // 游戏结束, 取消所有的协程
}

suspend fun player(name: String, table: Channel<Ball>) {
    for (ball in table) { // 使用 for 循环不断地接收 ball
        ball.hits++
        println("$name $ball")
        delay(300) // 延迟一段时间
        table.send(ball) // 把 ball 送回通道内
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-09.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-09.kt).
>
{style="note"}

"ping" 协程首先启动, 因此它会先接收到 ball.
虽然 "ping" 协程将 ball 送回到 table 之后, 立即再次开始接收 ball,
但  ball 会被 "pong" 协程接收到, 因为它一直在等待:

```text
ping Ball(hits=1)
pong Ball(hits=2)
ping Ball(hits=3)
pong Ball(hits=4)
```

<!--- TEST -->

注意, 由于使用的执行器(executor)的性质, 有时通道的运行结果可能看起来不是那么平等.
详情请参见 [这个 issue](https://github.com/Kotlin/kotlinx.coroutines/issues/111).

## 定时器(Ticker)通道

定时器(Ticker)通道是一种特别的会合通道(rendezvous channel), 每次通道中的数据耗尽之后, 它会延迟一个固定的时间, 并产生一个 `Unit`.
虽然它单独看起来好像毫无用处, 但它是一种很有用的零件,
可以创建复杂的基于时间的 [produce] 管道, 以及操作器, 执行窗口操作和其他依赖于时间的处理.
定时器通道可以用在 [select] 中, 执行 "on tick" 动作.

可以使用 [ticker] 工厂函数来创建这种通道.
使用通道的 [ReceiveChannel.cancel] 方法来指出不再需要它继续产生数据了.

下面我们看看它的实际应用:

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*

//sampleStart
fun main() = runBlocking<Unit> {
    val tickerChannel = ticker(delayMillis = 200, initialDelayMillis = 0) // 创建定时器通道
    var nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("Initial element is available immediately: $nextElement") // 没有初始延迟

    nextElement = withTimeoutOrNull(100) { tickerChannel.receive() } // 之后产生的所有数据的延迟时间都是 200ms
    println("Next element is not ready in 100 ms: $nextElement")

    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("Next element is ready in 200 ms: $nextElement")

    // 模拟消费者端的长时间延迟
    println("Consumer pauses for 300ms")
    delay(300)
    // 下一个元素已经产生了
    nextElement = withTimeoutOrNull(1) { tickerChannel.receive() }
    println("Next element is available immediately after large consumer delay: $nextElement")
    // 注意, `receive` 调用之间的暂停也会被计算在内, 因此下一个元素产生得更快
    nextElement = withTimeoutOrNull(120) { tickerChannel.receive() }
    println("Next element is ready in 100ms after consumer pause in 300ms: $nextElement")

    tickerChannel.cancel() // 告诉通道, 不需要再产生更多元素了
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-channel-10.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-channel-10.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
Initial element is available immediately: kotlin.Unit
Next element is not ready in 100 ms: null
Next element is ready in 200 ms: kotlin.Unit
Consumer pauses for 300ms
Next element is available immediately after large consumer delay: kotlin.Unit
Next element is ready in 100ms after consumer pause in 300ms: kotlin.Unit
```

<!--- TEST -->

注意, [ticker] 会感知到消费端的暂停, 默认的, 如果消费端发生了暂停,
它会调整下一个元素产生的延迟时间, 尽量保证产生元素时维持一个固定的间隔速度.

另外一种做法是, 将 `mode` 参数设置为 [TickerMode.FIXED_DELAY], 可以指定产生元素时维持一个固定的间隔速度.

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[CoroutineScope]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/index.html
[runBlocking]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html
[kotlin.coroutines.CoroutineContext.cancelChildren]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/cancel-children.html
[Dispatchers.Default]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html

<!--- INDEX kotlinx.coroutines.channels -->

[Channel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/index.html
[SendChannel.send]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/send.html
[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html
[SendChannel.close]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/close.html
[produce]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/produce.html
[consumeEach]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/consume-each.html
[Channel()]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel.html
[ticker]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/ticker.html
[ReceiveChannel.cancel]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/cancel.html
[TickerMode.FIXED_DELAY]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-ticker-mode/-f-i-x-e-d_-d-e-l-a-y/index.html

<!--- INDEX kotlinx.coroutines.selects -->

[select]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.selects/select.html

<!--- END -->
