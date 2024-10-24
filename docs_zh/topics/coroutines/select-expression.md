<!--- TEST_NAME SelectGuideTest -->

[//]: # (title: 选择表达式(Select expression) (实验性功能))

使用选择表达式, 我们可以同时等待多个挂起函数, 并且 _选择_ 其中第一个执行完毕的结果.

> 选择表达式是 `kotlinx.coroutines` 中的一个实验性功能.
> 在以后的 `kotlinx.coroutines` 新版本库中, 与选择表达式相关的 API 将会发生变化, 可能带来一些不兼容的变更.
>
{style="note"}

## 从通道中选择

假设我们有两个 string 值的生产者: `fizz` 和 `buzz`. 其中 `fizz` 每 500ms 产生一个 "Fizz" 字符串:

```kotlin
fun CoroutineScope.fizz() = produce<String> {
    while (true) { // 每 500ms 发送一个 "Fizz"
        delay(500)
        send("Fizz")
    }
}
```

`buzz` 每 1000ms 产生一个 "Buzz!" 字符串:

```kotlin
fun CoroutineScope.buzz() = produce<String> {
    while (true) { // 每 1000ms 发生一个 "Buzz!"
        delay(1000)
        send("Buzz!")
    }
}
```

使用 [receive][ReceiveChannel.receive] 挂起函数, 我们可以接收这两个通道中的 _任何一个_.
但使用 [select] 表达式的 [onReceive][ReceiveChannel.onReceive] 子句, 我们可以 _同时接收两个通道的数据_:

```kotlin
suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> 表示这个 select 表达式不产生任何结果值
        fizz.onReceive { value ->  // 这是第 1 个 select 子句
            println("fizz -> '$value'")
        }
        buzz.onReceive { value ->  // 这是第 2 个 select 子句
            println("buzz -> '$value'")
        }
    }
}
```

下面我们把这段代码运行 7 次:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.fizz() = produce<String> {
    while (true) { // 每 500ms 发送一个 "Fizz"
        delay(500)
        send("Fizz")
    }
}

fun CoroutineScope.buzz() = produce<String> {
    while (true) { // 每 1000ms 发生一个 "Buzz!"
        delay(1000)
        send("Buzz!")
    }
}

suspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {
    select<Unit> { // <Unit> 表示这个 select 表达式不产生任何结果值
        fizz.onReceive { value ->  // 这是第 1 个 select 子句
            println("fizz -> '$value'")
        }
        buzz.onReceive { value ->  // 这是第 2 个 select 子句
            println("buzz -> '$value'")
        }
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val fizz = fizz()
    val buzz = buzz()
    repeat(7) {
        selectFizzBuzz(fizz, buzz)
    }
    coroutineContext.cancelChildren() // 取消 fizz 和 buzz 协程
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-01.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-01.kt).
>
{style="note"}

这个示例程序的输出结果是:

```text
fizz -> 'Fizz'
buzz -> 'Buzz!'
fizz -> 'Fizz'
fizz -> 'Fizz'
buzz -> 'Buzz!'
fizz -> 'Fizz'
buzz -> 'Fizz!'
```

<!--- TEST -->

## 在通道关闭时选择

如果通道已关闭, 那么 `select` 表达式的 [onReceive][ReceiveChannel.onReceive] 子句会失败,
并导致 `select` 表达式抛出一个异常.
我们可以使用 [onReceiveOrNull][onReceiveOrNull] 子句, 来对通道关闭的情况执行某个操作.
下面的示例程序还演示了 `select` 是一个表达式, 它会返回它的子句的结果:

```kotlin
suspend fun selectAorB(a: ReceiveChannel<String>, b: ReceiveChannel<String>): String =
    select<String> {
        a.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "a -> '$value'"
            } else {
                "Channel 'a' is closed"
            }
        }
        b.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "b -> '$value'"
            } else {
                "Channel 'b' is closed"
            }
        }
    }
```

假设 `a` 通道产生 4 次 "Hello" 字符串, `b` 通道产生 4 次 "World" 字符串, 我们来使用一下这个函数:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

suspend fun selectAorB(a: ReceiveChannel<String>, b: ReceiveChannel<String>): String =
    select<String> {
        a.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "a -> '$value'"
            } else {
                "Channel 'a' is closed"
            }
        }
        b.onReceiveCatching { it ->
            val value = it.getOrNull()
            if (value != null) {
                "b -> '$value'"
            } else {
                "Channel 'b' is closed"
            }
        }
    }

fun main() = runBlocking<Unit> {
//sampleStart
    val a = produce<String> {
        repeat(4) { send("Hello $it") }
    }
    val b = produce<String> {
        repeat(4) { send("World $it") }
    }
    repeat(8) { // 输出前 8 个结果
        println(selectAorB(a, b))
    }
    coroutineContext.cancelChildren()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-02.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-02.kt).
>
{style="note"}

这个示例程序的输出结果比较有趣, 所以我们来分析一下其中的细节:

```text
a -> 'Hello 0'
a -> 'Hello 1'
b -> 'World 0'
a -> 'Hello 2'
a -> 'Hello 3'
b -> 'World 1'
Channel 'a' is closed
Channel 'a' is closed
```

<!--- TEST -->

从这个结果我们可以观察到几件事.

首先, `select` 会 _偏向_ 第 1 个子句. 如果同时存在多个通道可供选择, 那么会优先选择其中的第 1 个.
在上面的示例中, 两个通道都在不断产生字符串, 因此第 1 个通道, 也就是 `a`, 会被优先使用.
然而, 由于我们使用了无缓冲区的通道, 因此 `a` 在调用 [send][SendChannel.send] 时有时会挂起, 因此 `b` 通道也有机会可以发送数据.

第 2 个现象是, 当通道被关闭时, 会立即选择 [onReceiveCatching][ReceiveChannel.onReceiveCatching] 子句.

## 发送时选择

选择表达式也可以使用 [onSend][SendChannel.onSend] 子句, 它可以与选择表达式的偏向性结合起来, 起到很好的作用.

下面我们来编写一个示例程序, 有一个整数值的生产者,
当主通道的消费者的消费速度跟不上生产者的发送速度时, 会把它的值改为发送到 `side` 通道:

```kotlin
fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // 产生 10 个数值, 从 1 到 10
        delay(100) // 每隔 100 ms
        select<Unit> {
            onSend(num) {} // 发送到主通道
            side.onSend(num) {} // 或者发送到 side 通道
        }
    }
}
```

我们让消费者的运行速度变得比较慢一些, 每隔 250 ms 处理一个数值:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {
    for (num in 1..10) { // 产生 10 个数值, 从 1 到 10
        delay(100) // 每隔 100 ms
        select<Unit> {
            onSend(num) {} // 发送到主通道
            side.onSend(num) {} // 或者发送到 side 通道
        }
    }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val side = Channel<Int>() // 创建 side 通道
    launch { // 这是 side 通道上的一个非常快速的消费者
        side.consumeEach { println("Side channel has $it") }
    }
    produceNumbers(side).consumeEach {
        println("Consuming $it")
        delay(250) // 我们多花点时间慢慢分析这个数值, 不要着急
    }
    println("Done consuming")
    coroutineContext.cancelChildren()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-03.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-03.kt).
>
{style="note"}

下面我们来看看运行结果会怎么样:

```text
Consuming 1
Side channel has 2
Side channel has 3
Consuming 4
Side channel has 5
Side channel has 6
Consuming 7
Side channel has 8
Side channel has 9
Consuming 10
Done consuming
```

<!--- TEST -->

## 选择延迟的值

可以使用 [onAwait][Deferred.onAwait] 子句来选择延迟的值(Deferred value).
我们先从一个异步函数开始, 它会延迟一段随机长度的时间, 然后返回一个延迟的字符串值:

```kotlin
fun CoroutineScope.asyncString(time: Int) = async {
    delay(time.toLong())
    "Waited for $time ms"
}
```

然后我们用随机长度的延迟时间, 来启动这个函数 12 次.

```kotlin
fun CoroutineScope.asyncStringsList(): List<Deferred<String>> {
    val random = Random(3)
    return List(12) { asyncString(random.nextInt(1000)) }
}
```

下面, 我们让 main 函数等待这些异步函数的第 1 个运行完毕, 然后统计仍处于激活状态的延迟值的数量.
注意, 这里我们利用了 `select` 表达式是 Kotlin DSL 的这种特性, 因此我们可以使用任意的代码来作为它的子句.
在这个示例程序中, 我们在一个延迟值的 List 上循环, 为每个延迟值产生一个 `onAwait` 子句.

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.selects.*
import java.util.*

fun CoroutineScope.asyncString(time: Int) = async {
    delay(time.toLong())
    "Waited for $time ms"
}

fun CoroutineScope.asyncStringsList(): List<Deferred<String>> {
    val random = Random(3)
    return List(12) { asyncString(random.nextInt(1000)) }
}

fun main() = runBlocking<Unit> {
//sampleStart
    val list = asyncStringsList()
    val result = select<String> {
        list.withIndex().forEach { (index, deferred) ->
            deferred.onAwait { answer ->
                "Deferred $index produced answer '$answer'"
            }
        }
    }
    println(result)
    val countActive = list.count { it.isActive }
    println("$countActive coroutines are still active")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-04.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-04.kt).
>
{style="note"}

运行结果是:

```text
Deferred 4 produced answer 'Waited for 128 ms'
11 coroutines are still active
```

<!--- TEST -->

## 在延迟值的通道上切换

下面我们来编写一个通道生产者函数, 它从一个通道得到延迟的字符串值, 等待每一个接收到的值,
但如果下一个延迟值到达, 或者通道被关闭, 就不再等待了.
这个示例程序在同一个 `select` 中结合使用了
[onReceiveCatching][ReceiveChannel.onReceiveCatching] 子句
和 [onAwait][Deferred.onAwait] 子句:

```kotlin
fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {
    var current = input.receive() // 从第 1 个接收到的延迟值开始
    while (isActive) { // 无限循环, 直到通道被取消/关闭
        val next = select<Deferred<String>?> { // 这个 select 表达式返回下一个延迟值, 或者 null
            input.onReceiveCatching { update ->
                update.getOrNull()
            }
            current.onAwait { value ->
                send(value) // 如果当前正在等待的延迟值已经产生, 将它发送出去
                input.receiveCatching().getOrNull() // 再继续使用从输入通道得到的下一个延迟值
            }
        }
        if (next == null) {
            println("Channel was closed")
            break // 循环结束
        } else {
            current = next
        }
    }
}
```

要测试这段程序, 我们使用一个简单的异步函数, 它会等待一段指定的时间, 然后返回一个指定的字符串:

```kotlin
fun CoroutineScope.asyncString(str: String, time: Long) = async {
    delay(time)
    str
}
```

main 函数启动一个协程来输出 `switchMapDeferreds` 的结果, 并向它发送一些测试数据:

<!--- CLEAR -->

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.selects.*

fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {
    var current = input.receive() // 从第 1 个接收到的延迟值开始
    while (isActive) { // 无限循环, 直到通道被取消/关闭
        val next = select<Deferred<String>?> { // 这个 select 表达式返回下一个延迟值, 或者 null
            input.onReceiveCatching { update ->
                update.getOrNull()
            }
            current.onAwait { value ->
                send(value) // 如果当前正在等待的延迟值已经产生, 将它发送出去
                input.receiveCatching().getOrNull() // 再继续使用从输入通道得到的下一个延迟值
            }
        }
        if (next == null) {
            println("Channel was closed")
            break // 循环结束
        } else {
            current = next
        }
    }
}

fun CoroutineScope.asyncString(str: String, time: Long) = async {
    delay(time)
    str
}

fun main() = runBlocking<Unit> {
//sampleStart
    val chan = Channel<Deferred<String>>() // 用来测试的通道
    launch { // 启动输出结果的协程
        for (s in switchMapDeferreds(chan))
            println(s) // 输出每个收到的字符串
    }
    chan.send(asyncString("BEGIN", 100))
    delay(200) // 延迟足够长的时间, 让 "BEGIN" 输出到通道
    chan.send(asyncString("Slow", 500))
    delay(100) // 延迟的时间不够长, "Slow" 没有输出到通道
    chan.send(asyncString("Replace", 100))
    delay(500) // 在发送最后一条测试数据之前等待一段时间
    chan.send(asyncString("END", 500))
    delay(1000) // 给它一点时间运行
    chan.close() // 关闭通道 ...
    delay(500) // 等待一段时间, 让它结束运行
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
<!--- KNIT example-select-05.kt -->
> 完整的代码请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/jvm/test/guide/example-select-05.kt).
>
{style="note"}

这个示例程序的运行结果是:

```text
BEGIN
Replace
END
Channel was closed
```

<!--- TEST -->

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[Deferred.onAwait]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/on-await.html

<!--- INDEX kotlinx.coroutines.channels -->

[ReceiveChannel.receive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html
[ReceiveChannel.onReceive]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/on-receive.html
[ReceiveChannel.onReceiveCatching]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/on-receive-catching.html
[SendChannel.send]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/send.html
[SendChannel.onSend]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-send-channel/on-send.html

<!--- INDEX kotlinx.coroutines.selects -->

[select]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.selects/select.html

<!--- END -->
