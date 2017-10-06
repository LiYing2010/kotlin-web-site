---
type: doc
layout: reference
category: "Syntax"
title: "协程(Coroutine)"
---

# 协程(Coroutine)

> 协程(Coroutine) 在 Kotlin 1.1 中仍是 *实验性功能*. 详情请参见 [下文](#experimental-status-of-coroutines)
{:.note}

有些 API 会启动一些长时间运行的操作(比如网络 IO, 文件 IO, CPU 或 GPU 密集的工作, 等等), 并且要求调用者等待, 直到任务完成. 协程提供一种新的方式, 可以避免线程阻塞, 改为更加廉价更加可控的操作: 协程的 *挂起(suspension)*.

通过将复杂的处理包含在库内部, 协程可以帮助我们简化异步模式编程. 在协程中, 可以使用 *有序的形式* 表达程序逻辑, 底层的库将会帮助我们解决异步问题. 底层库会将用户代码的相关部分封装到回调(callback)内, 会订阅相关的事件, 会将代码的执行调度到不同的线程(甚至不同的机器上!), 而我们编写的代码看起来仍然象顺序执行的代码一样简单.

其他语言支持的许多异步机制, 都可以使用 Kotlin 的协程, 以库的形式实现. 包括
C# 和 ECMAScript 的 [`async`/`await`](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md#composing-suspending-functions),
Go 的 [channels](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md#channels) 和 [`select`](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md#select-expression),
以及 C# 和 Python 的 [generators/`yield`](#generators-api-in-kotlincoroutines).
关于提供这些功能的库, 请参见 [下文](#standard-apis).

## 阻塞(Blocking) vs 挂起(Suspending)

简单地讲, 协程就是一段计算过程, 它可以被 *挂起* 而不会 *阻塞线程*. 线程的阻塞通常是代价很高昂的, 尤其是负载很高的情况下, 因为此时实际上能够并行执行的线程相对来说非常少, 因此阻塞其中一个线程, 就可能导致某个重要的任务执行被延迟.

与线程的阻塞不同, 协程的挂起几乎没有代价. 不会需要切换线程上下文, 或者其它的涉及到 OS 的工作. 此外, 挂起可以在很大程度上由用户库来控制, 我们可以决定挂起时执行什么操作, 并且按照我们的需求来进行 性能优化/日志输出/拦截.

另外一个区别就是, 协程不会在某个随机的代码中挂起, 而只能在我们称之为 *挂起点(suspension point)* 的对方挂起, 也就是调用某些特别标记的函数的地方.

## 挂起函数(Suspending function)

如果一个函数使用了 `suspend` 修饰符, 那么当我们调用这个函数时, 就会发生挂起:

``` kotlin
suspend fun doSomething(foo: Foo): Bar {
    ...
}
```

这种函数称为 *挂起函数(suspending function)*, 因为调用这些函数会导致协程挂起(如果这个函数调用的结果已经得到了, 库也可以决定不挂起, 继续执行). 挂起函数也可以接受参数, 可以返回值, 规则与普通的函数一样, 但挂起函数只能被协程调用, 或者被其它的挂起函数调用. 实际上, 要启动一个协程, 至少要存在一个挂起函数, 这个挂起函数通常是匿名函数(也就是说, 是一个挂起的 lambda 表达式). 我们来看一个示例程序, 一个简化版的 `async()` 函数 (来自 [`kotlinx.coroutines`](#generators-api-in-kotlincoroutines) 库):

``` kotlin
fun <T> async(block: suspend () -> T)
```

这里, `async()` 是一个普通的函数(不是挂起函数), 但是 `block` 参数时一个带 `suspend` 修饰符的函数类型: `suspend () -> T`. 因此, 向  `async()` 函数传递一个 lambda 表达式作为参数时, 这个 lambda 表达式将是一个 *挂起 lambda 表达式 (suspending lambda)*, 然后, 我们在这个 lambda 表达式内调用一个挂起函数:

``` kotlin
async {
    doSomething(foo)
    ...
}
```

继续我们的例子, `await()` 可以是一个挂起函数(因此也可以在 `async {}` 代码段内调用), 它挂起一个协程, 直到某些计算结束, 然后返回计算结果:

``` kotlin
async {
    ...
    val result = computation.await()
    ...
}
```

关于 `kotlinx.coroutines` 库内的 `async/await` 函数的详细工作原理, 请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md#composing-suspending-functions).

注意, 挂起函数 `await()` 和 `doSomething()` 不能在普通的函数中调用, 比如在 `main()` 函数中:

``` kotlin
fun main(args: Array<String>) {
    doSomething() // 错误: 在非协程的环境下调用了挂起函数
}
```

还要注意, 挂起函数可以是虚函数, 当覆盖挂起函数时, 也必须指定 `suspend` 修饰符:

``` kotlin
interface Base {
    suspend fun foo()
}

class Derived: Base {
    override suspend fun foo() { ... }
}
```

### `@RestrictsSuspension` 注解

Extension functions (and lambdas) can also be marked `suspend`, just like regular ones. This enables creation of [DSLs](type-safe-builders.html) and other APIs that users can extend. In some cases the library author needs to prevent the user from adding *new ways* of suspending a coroutine.

To achieve this, the [`@RestrictsSuspension`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-restricts-suspension/index.html) annotation may be used. When a receiver class or interface `R` is annotated with it, all suspending extensions are required to delegate to either members of `R` or other extensions to it. Since extensions can't delegate to each other indefinitely (the program would not terminate), this guarantees that all suspensions happen through calling members of `R` that the author of the library can fully control.

This is relevant in the _rare_ cases when every suspension is handled in a special way in the library. For example, when implementing generators through the [`buildSequence()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-sequence.html) function described [below](#generators-api-in-kotlincoroutines), we need to make sure that any suspending call in the coroutine ends up calling either `yield()` or `yieldAll()` and not any other function. This is why [`SequenceBuilder`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-sequence-builder/index.html) is annotated with `@RestrictsSuspension`:

``` kotlin
@RestrictsSuspension
public abstract class SequenceBuilder<in T> {
    ...
}
```

See the sources [on Github](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/coroutines/experimental/SequenceBuilder.kt).   

## The inner workings of coroutines

We are not trying here to give a complete explanation of how coroutines work under the hood, but a rough sense of what's going on is rather important.

Coroutines are completely implemented through a compilation technique (no support from the VM or OS side is required), and suspension works through code transformation. Basically, every suspending function (optimizations may apply, but we'll not go into this here) is transformed to a state machine where states correspond to suspending calls. Right before a suspension, the next state is stored in a field of a compiler-generated class along with relevant local variables, etc. Upon resumption of that coroutine, local variables are restored and the state machine proceeds from the state right after suspension.

A suspended coroutine can be stored and passed around as an object that keeps its suspended state and locals. The type of such objects is `Continuation`, and the overall code transformation described here corresponds to the classical [Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style). Consequently, suspending functions take an extra parameter of type `Continuation` under the hood.

More details on how coroutines work may be found in [this design document](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md). Similar descriptions of async/await in other languages (such as C# or ECMAScript 2016) are relevant here, although the language features they implement may not be as general as Kotlin coroutines.

## Experimental status of coroutines

The design of coroutines is [experimental](compatibility.html#experimental-features), which means that it may be changed in the upcoming releases. When compiling coroutines in Kotlin 1.1, a warning is reported by default: *The feature "coroutines" is experimental*. To remove the warning, you need to specify an [opt-in flag](/docs/diagnostics/experimental-coroutines.html).

Due to its experimental status, the coroutine-related API in the Standard Library is put under the `kotlin.coroutines.experimental` package. When the design is finalized and the experimental status lifted, the final API will be moved to `kotlin.coroutines`, and the experimental package will be kept around (probably in a separate artifact) for backward compatibility.

**IMPORTANT NOTE**: We advise library authors to follow the same convention: add the "experimental" (e.g. `com.example.experimental`) suffix to your packages exposing coroutine-based APIs so that your library remains binary compatible. When the final API is released, follow these steps:
 * copy all the APIs to `com.example` (without the experimental suffix),
 * keep the experimental package around for backward compatibility.

This will minimize migration issues for your users.

## Standard APIs

Coroutines come in three main ingredients:
 - language support (i.s. suspending functions, as described above);
 - low-level core API in the Kotlin Standard Library;
 - high-level APIs that can be used directly in the user code.

### Low-level API: `kotlin.coroutines`

Low-level API is relatively small and should never be used other than for creating higher-level libraries. It consists of two main packages:
- [`kotlin.coroutines.experimental`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/index.html) with main types and primitives such as:
  - [`createCoroutine()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/create-coroutine.html),
  - [`startCoroutine()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/start-coroutine.html),
  - [`suspendCoroutine()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/suspend-coroutine.html);
- [`kotlin.coroutines.experimental.intrinsics`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental.intrinsics/index.html) with even lower-level intrinsics such as [`suspendCoroutineOrReturn`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental.intrinsics/suspend-coroutine-or-return.html).

 More details about the usage of these APIs can be found [here](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md).

### Generators API in `kotlin.coroutines`

The only "application-level" functions in `kotlin.coroutines.experimental` are
- [`buildSequence()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-sequence.html)
- [`buildIterator()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-iterator.html)

These are shipped within `kotlin-stdlib` because they are related to sequences. In fact, these functions (and we can limit ourselves to `buildSequence()` alone here) implement _generators_, i.e. provide a way to cheaply build a lazy sequence:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
//sampleStart
    val fibonacciSeq = buildSequence {
        var a = 0
        var b = 1

        yield(1)

        while (true) {
            yield(a + b)

            val tmp = a + b
            a = b
            b = tmp
        }
    }
//sampleEnd

    // Print the first five Fibonacci numbers
    println(fibonacciSeq.take(8).toList())
}
```

</div>

This generates a lazy, potentially infinite Fibonacci sequence by creating a coroutine that yields consecutive Fibonacci numbers by calling the `yield()` function. When iterating over such a sequence every step of the iterator executes another portion of the coroutine that generates the next number. So, we can take any finite list of numbers out of this sequence, e.g. `fibonacciSeq.take(8).toList()` results in `[1, 1, 2, 3, 5, 8, 13, 21]`. And coroutines are cheap enough to make this practical.

To demonstrate the real laziness of such a sequence, let's print some debug output inside a call to `buildSequence()`:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
//sampleStart
    val lazySeq = buildSequence {
        print("START ")
        for (i in 1..5) {
            yield(i)
            print("STEP ")
        }
        print("END")
    }

    // Print the first three elements of the sequence
    lazySeq.take(3).forEach { print("$it ") }
//sampleEnd
}
```

</div>  

Running the code above prints the first three elements. The numbers are interleaved with `STEP`s in the generating loop. This means that the computation is lazy indeed. To print `1` we only execute until the first `yield(i)`, and print `START` along the way. Then, to print `2` we need to proceed to the next `yield(i)`, and this prints `STEP`. Same for `3`. And the next `STEP` never gets printed (as well as `END`), because we never requested further elements of the sequence.   

To yield a collection (or sequence) of values at once, the `yieldAll()` function is available:

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
//sampleStart
    val lazySeq = buildSequence {
        yield(0)
        yieldAll(1..10)
    }

    lazySeq.forEach { print("$it ") }
//sampleEnd
}
```

</div>  

The `buildIterator()` works similarly to `buildSequence()`, but returns a lazy iterator.

One can add custom yielding logic to `buildSequence()` by writing suspending extensions to the `SequenceBuilder` class (that bears the `@RestrictsSuspension` annotation described [above](#restrictssuspension-annotation)):

<div class="sample" markdown="1" data-min-compiler-version="1.1">

``` kotlin
import kotlin.coroutines.experimental.*

//sampleStart
suspend fun SequenceBuilder<Int>.yieldIfOdd(x: Int) {
    if (x % 2 != 0) yield(x)
}

val lazySeq = buildSequence {
    for (i in 1..10) yieldIfOdd(i)
}
//sampleEnd

fun main(args: Array<String>) {
    lazySeq.forEach { print("$it ") }
}
```

</div>  

### Other high-level APIs: `kotlinx.coroutines`

Only core APIs related to coroutines are available from the Kotlin Standard Library. This mostly consists of core primitives and interfaces that all coroutine-based libraries are likely to use.   

Most application-level APIs based on coroutines are released as a separate library: [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines). This library covers
 * Platform-agnostic asynchronous programming with `kotlinx-coroutines-core`:
   * this module includes Go-like channels that support `select` and other convenient primitives,
   * a comprehensive guide to this library is available [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md);
 * APIs based on `CompletableFuture` from JDK 8: `kotlinx-coroutines-jdk8`;
 * Non-blocking IO (NIO) based on APIs from JDK 7 and higher: `kotlinx-coroutines-nio`;
 * Support for Swing (`kotlinx-coroutines-swing`) and JavaFx (`kotlinx-coroutines-javafx`);
 * Support for RxJava: `kotlinx-coroutines-rx`.

These libraries serve as both convenient APIs that make common tasks easy and end-to-end examples of how to build coroutine-based libraries.
