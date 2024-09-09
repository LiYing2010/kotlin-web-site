---
type: doc
layout: reference
category: "Syntax"
title: "协程(Coroutine)"
---

# 协程(Coroutine)

> 协程(Coroutine) 在 Kotlin 1.1+ 中仍是 *实验性功能*. 详情请参见 [下文](#experimental-status-of-coroutines)
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

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
suspend fun doSomething(foo: Foo): Bar { ... }
```
</div>

这种函数称为 *挂起函数(suspending function)*, 因为调用这些函数可能会导致协程挂起(如果这个函数调用的结果已经得到了, 库也可以决定不挂起, 继续执行).
挂起函数也可以接受参数, 可以返回值, 规则与普通的函数一样, 但调用挂起函数的, 只能是协程, 或其它挂起函数, 或协程或挂起函数中内联的函数字面值(function literal).

实际上, 要启动一个协程, 至少要存在一个挂起函数, 这个挂起函数通常是一个挂起的 Lambda 表达式. 我们来看一个示例程序, 一个简化版的 `async()` 函数 (来自 [`kotlinx.coroutines`](#generators-api-in-kotlincoroutines) 库):

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun <T> async(block: suspend () -> T)
```
</div>

这里, `async()` 是一个普通的函数(不是挂起函数), 但是 `block` 参数时一个带 `suspend` 修饰符的函数类型: `suspend () -> T`. 因此, 向  `async()` 函数传递一个 lambda 表达式作为参数时, 这个 lambda 表达式将是一个 *挂起 lambda 表达式 (suspending lambda)*, 然后, 我们在这个 lambda 表达式内调用一个挂起函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
async {
    doSomething(foo)
    ...
}
```
</div>

> **注意:** 挂起函数类型目前不能用作超类, 匿名的挂起函数目前还不支持.

继续我们的例子, `await()` 可以是一个挂起函数(因此也可以在 `async {}` 代码段内调用), 它挂起一个协程, 直到某些计算结束, 然后返回计算结果:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
async {
    ...
    val result = computation.await()
    ...
}
```
</div>

关于 `kotlinx.coroutines` 库内的 `async/await` 函数的详细工作原理, 请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md#composing-suspending-functions).

注意, 挂起函数 `await()` 和 `doSomething()` 不能在没有内联到挂起函数内的函数字面值中调用,
也不能在普通的函数中调用, 比如在 `main()` 函数中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun main(args: Array<String>) {
    doSomething() // 错误: 在非协程的环境下调用了挂起函数

    async {
        ...
        computations.forEach { // `forEach` 是一个内联函数, Lambda 表达式会被内联到这里
            it.await() // OK, 可以在这里调用挂起函数
        }

        thread { // `thread` 不是一个内联函数, 因此这个 Lambda 表达式不会被内联
            doSomething() // 错误: 不能在这里调用挂起函数
        }
    }}
```
</div>

还要注意, 挂起函数可以是虚函数, 当覆盖挂起函数时, 也必须指定 `suspend` 修饰符:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
interface Base {
    suspend fun foo()
}

class Derived: Base {
    override suspend fun foo() { ... }
}
```
</div>

### `@RestrictsSuspension` 注解

扩展函数 (以及 lambda 表达式) 与通常的函数一样, 也可以标记为 `suspend`. 因此我们可以创建 [面向特定领域的专有语言 (DSL)](type-safe-builders.html) 以及其他可供用户扩展的 API. 某些情况下, 库的作者需要防止使用者增加 *新方式* 来挂起协程.

为了达到这个目的, 可以使用 [`@RestrictsSuspension`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-restricts-suspension/index.html) 注解. 如果扩展函数的接受者类(或接口) `R` 标注了这个注解, 所有的挂起扩展函数都必须委托给 `R` 的成员函数, 或者 `R` 的其他扩展函数. 由于扩展函数之间的委托关系不能出现无限循环 (否则程序将会陷入死循环), 因此可以保证所有的挂起都必须通过调用 `R` 的成员函数来发生, 而 `R` 的成员函数是库作者能够完全控制的.

在 _少数_ 情况下, 这种功能是有必要的, 比如, 如果所有的挂起都需要在库内以某种特殊的方式处理. 举例来说, 如果要通过 [`buildSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-sequence.html)函数 (详情参见 [下文](#generators-api-in-kotlincoroutines)) 来实现生成器, 我们需要确保协程内所有的挂起调用最终都调用到 `yield()` 或 `yieldAll()` 函数, 而不是其他任何函数. 所以 [`SequenceBuilder`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-sequence-builder/index.html) 标注了 `@RestrictsSuspension` 注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@RestrictsSuspension
public abstract class SequenceBuilder<in T> { ... }
```
</div>

源代码请参见 [on Github](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/coroutines/experimental/SequenceBuilder.kt).   

## 协程的内部工作机制

我们不会在这里对协程的内部工作机制进行一个完整的解释, 但粗略地了解一下大致的工作原理还是很重要的.

协程完全通过编译技术实现 (不需要 VM 或 OS 的特殊支持), 挂起则通过代码转换来实现. 基本上, 每一个挂起函数 (编译时可能会发生代码优化, 但这里我们不讨论这个问题) 都被转换为一个状态机, 状态机中的各个状态对应于挂起调用. 在挂起之前, 状态机的下一个状态, 以及相关的局部变量等信息, 会被保存到编译器生成的类的成员域变量中. 协程恢复执行时, 局部变量会被恢复出来, 状态机会在挂起之后的状态开始继续执行.

协程挂起之后可以作为对象来保存和传递, 对象内保存了协程的挂起后的状态, 以及相关的局部变量等信息. 这种对象的类型是 `Continuation`, 我们在这里描述的整个代码转换过程, 其实就是典型的 [延续性传递编程风格(Continuation-passing style)](https://en.wikipedia.org/wiki/Continuation-passing_style). 因此, 挂起函数的底层实现会接受一个额外的 `Continuation` 类型参数.

协程工作机制的更多的信息请参见 [这篇设计文档](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md). 这篇文档也提到了其他语言中 (比如 C# 或 ECMAScript 2016) 类似的 async/await 功能, 虽然它们实现的语言特性并不象 Kotlin 的协程那样通用.

## 协程还处于试验性阶段

协程的设计仍然处于 [试验阶段](compatibility.html#experimental-features), 也就是说在 Kotlin 发布后续的版本中可能会有变化. 在 Kotlin 1.1+ 中编译协程时, 默认会报告一条警告信息: *"协程" 特性还处于试验阶段*. 你可以使用 [编译参数](/docs/diagnostics/experimental-coroutines.html) 来去掉这条警告.

由于协程还处于试验阶段, 标准库中与协程相关的 API 被放在 `kotlin.coroutines.experimental` 包下. 当设计最终确定, 试验阶段结束时, 最终的 API 将被移动到 `kotlin.coroutines` 包下, 而 `kotlin.coroutines.experimental` 包仍会被保留(可能在一个单独的 artifact 文件内) 以便保证向后兼容性.

**重要注意事项**: 我们建议库的作者遵循以下惯例: 如果你的包向外公布基于协程的 API, 请为包名称添加 "experimental" 后缀 (比如 `com.example.experimental`), 以便保证你的库的二进制兼容性. 当最终的 API 发布后, 请遵循以下步骤:
 * 将所有的 API 复制到 `com.example` (不含 "experimental" 后缀) 包下,
 * 继续保留 "experimental" 包存在, 以保证向后兼容性.

这样可以帮助你的库的使用者, 将库版本迁移时带来的问题减到最少.

## 标准 API

协程功能主要有三个部分组成:
 - 语言层面的支持 (也就是上文所述的挂起函数);
 - Kotlin 标准库中的底层核心 API;
 - 可在用户代码中直接使用的高级 API.

### 底层 API: `kotlin.coroutines`

底层 API 相对来说比较小, 而且, 除了用于创建更高层的库之外, 不应该使用底层 API. 它主要由两个包构成:
- [`kotlin.coroutines.experimental`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/index.html), 包含主要的类型和基本命令, 比如:
  - [`createCoroutine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/create-coroutine.html),
  - [`startCoroutine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/start-coroutine.html),
  - [`suspendCoroutine()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/suspend-coroutine.html);
- [`kotlin.coroutines.experimental.intrinsics`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental.intrinsics/index.html) 包含更底层的内部操作, 比如 [`suspendCoroutineOrReturn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental.intrinsics/suspend-coroutine-or-return.html).

关于这些 API 的使用方法, 更多详细信息请参见 [这里](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md).

### `kotlin.coroutines` 包中的生成器(Generator) API

`kotlin.coroutines.experimental` 包中唯一的 "应用程序层次" 的函数是:
- [`buildSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-sequence.html)
- [`buildIterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-iterator.html)

这两个函数包含在 `kotlin-stdlib` 内, 因为它们与序列的产生相关. 实际上, 这些函数 (这里我们只讨论 `buildSequence()`) 实现了 _生成器(generator)_, 也就是, 提供一种方法, 以比较低的代价构建一个延迟产生的序列:

<div class="sample" markdown="1" theme="idea">

```kotlin
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

    // 打印斐波那契数列的前 8 个数字
    println(fibonacciSeq.take(8).toList())
}
```

</div>

这个示例程序将会产生一个延迟加载的, 内容无限多的斐波那契数列, 示例程序创建一个协程, 协程调用 `yield()` 函数来产生连续的斐波那契数列. 当我们在这个数列上遍历时, 迭代器(iterator)的每一次迭代都会执行协程的下个部分, 产生出数列的下一个数字. 因此, 我们可以从这个数列中取出有限的任意多个数字, 比如, `fibonacciSeq.take(8).toList()` 会得到 `[1, 1, 2, 3, 5, 8, 13, 21]`. 而且, 协程的代价是相当低廉的, 因此这种方案实际是可行的.

为了演示一下数列是延迟加载的, 我们在 `buildSequence()` 调用的内部打印一些 debug 信息:

<div class="sample" markdown="1" theme="idea">

```kotlin
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

    // 打印序列的前 3 个元素
    lazySeq.take(3).forEach { print("$it ") }
//sampleEnd
}
```

</div>  

运行上面的示例出现, 会打印出序列的前 3 个元素. 打印出来的数字之间插入了 `STEP`, 这是在生成数字的循环代码中输出的. 这个结果证明计算过程却是是延迟加载的. 打印 `1` 之前, 我们只执行到了第一次 `yield(i)`, 并且在这之前打印了 `START`. 然后, 打印 `2` 之前, 我们需要继续执行到下一次 `yield(i)`, 因此会打印出 `STEP`. 同样, 打印 `3` 之前也是如此. 下一个 `STEP` 不会被打印出来(`END` 也是如此), 因为在外部的代码中, 我们并没有从序列中获取更多的元素.   

如果要一次性产生所有值的集合(collection) (或序列), 可以使用 `yieldAll()`:

<div class="sample" markdown="1" theme="idea">

```kotlin
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

`buildIterator()` 函数与 `buildSequence()` 类似, 区别是它返回的是延迟加载的迭代器(iterator).

也可以为 `buildSequence()` 函数添加自定义的数值产生逻辑, 方法是编写 `SequenceBuilder` 类的挂起扩展函数(这个类带有 [上文](#restrictssuspension-annotation) 讨论过的 `@RestrictsSuspension` 注解):

<div class="sample" markdown="1" theme="idea">

```kotlin
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

### 其他高阶 API: `kotlinx.coroutines`

Kotlin 标准库只提供了与协程有关的核心 API. 主要包括核心的基本命令, 以及核心接口, 所有与协程相关的库都可能会用到这些基本命令和接口.   

大多数与协程相关的应用程序层次 API 都以单独的库的形式发布: [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines). 这个库包括
 * 使用 `kotlinx-coroutines-core` 实现不依赖于平台的异步编程 :
   * 这个模块包括 Go 风格的 channel, 支持 `select` 和其他便利的基本命令,
   * 关于这个库的详细指南, 请参见 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md);
 * 基于 JDK 8 `CompletableFuture` 的 API: `kotlinx-coroutines-jdk8`;
 * 基于 JDK 7 及更高版本 API 的非阻塞 IO (Non-blocking IO, NIO)): `kotlinx-coroutines-nio`;
 * 对 Swing 的支持 (`kotlinx-coroutines-swing`), 以及对 JavaFx 的支持 (`kotlinx-coroutines-javafx`);
 * 对 RxJava 的支持: `kotlinx-coroutines-rx`.

这些库不仅包含了便利的 API, 帮助你方便地完成常见任务, 此外它本身也可以作为详细的示例, 向你演示如何创建与协程相关的库.
