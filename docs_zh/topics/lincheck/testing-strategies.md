---
type: doc
layout: reference
category: "Lincheck"
title: "压力测试与模型检查"
---

# 压力测试与模型检查

最终更新: {{ site.data.releases.latestDocDate }}

Lincheck 提供了 2 种测试策略: 压力测试与模型检查.
下面我们使用 [前一章](introduction.html) 中在 `BasicCounterTest.kt` 文件中编写的 `Counter`, 来学习这 2 种策略的内部机制:

```kotlin
class Counter {
    @Volatile
    private var value = 0

    fun inc(): Int = ++value
    fun get() = value
}
```

## 压力测试

### 编写一个压力测试

我们为 `Counter` 创建一个并发压力测试, 步骤如下:

1. 创建 `CounterTest` 类.
2. 在这个类中, 添加域 `c`, 类型为 `Counter`, 这样会在构建器中创建一个 `Counter` 的实例.
3. 列出计数器的操作, 使用 `@Operation` 注解标记这些操作, 将它们的实现代理到 `c`.
4. 使用 `StressOptions()`, 指定压力测试策略.
5. 调用 `StressOptions.check()` 函数, 运行测试.

最后的代码大致如下:

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始化状态
    
    // 计数器上的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 运行测试
    fun stressTest() = StressOptions().check(this::class)
}
```

### 压力测试的工作原理

首先, Lincheck 使用标注了 `@Operation` 注解的操作生成一组并发场景.
然后, 它启动原生的线程, 开始时同步这些线程, 以保证操作同时发生.
最后, Lincheck 在这些原生的线程上多次执行每个场景, 期待发现导致不正确结果的数据冲突.

下图说明 Lincheck 如何执行生成的并发场景:

<img src="/assets/docs/images/lincheck/counter-stress.png" alt="计数器压力测试的执行情况" width="700"/>

## 模型检查

压力测试的主要问题是, 你可能需要耗费几个小时才能理解如何重现你发现的 bug.
为了帮助你调查 bug, Lincheck 支持有限模型检查, 它可以自动提供数据冲突, 来重现 bug.

模型检查测试的构建方式与压力测试一样. 只需要将指定测试策略的 `StressOptions()` 替换为 `ModelCheckingOptions()`.

### 编写一个模型检查测试

要将压力测试策略修改为模型检查策略, 请将你的测试中的 `StressOptions()` 替换为 `ModelCheckingOptions()`:

```kotlin
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*

class CounterTest {
    private val c = Counter() // 初始化状态

    // 计数器上的操作
    @Operation
    fun inc() = c.inc()

    @Operation
    fun get() = c.get()

    @Test // 运行测试
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

> 在 Java 9 或更高版本上要使用模型检查策略, 请添加以下 JVM 属性:
>
> ```text
> --add-opens java.base/jdk.internal.misc=ALL-UNNAMED
> --add-exports java.base/jdk.internal.util=ALL-UNNAMED
> ```
>
> 如果测试代码使用了 `java.util` 包中的类, 会需要这些属性,
> 因为有些类的内部实现使用了 `jdk.internal.misc.Unsafe`, 或其他类似的内部类.
> 如果你是 Gradle, 请在 `build.gradle.kts` 文件添加下面的内容:
>
> ```
> tasks.withType<Test> {
>   jvmArgs(
>     "--add-opens", "java.base/java.lang=ALL-UNNAMED",
>     "--add-opens", "java.base/jdk.internal.misc=ALL-UNNAMED",
>     "--add-exports", "java.base/jdk.internal.util=ALL-UNNAMED",
>     "--add-exports", "java.base/sun.security.action=ALL-UNNAMED"
>   )
> }
> ```
{:.tip}

### 模型检查的工作原理

要重现复杂并发算法中的大多数 bug, 可以使用典型的数据冲突, 同时将代码的执行切换从一个线程切换到另一个线程.
此外, 对于弱内存模型的模型检查器非常复杂, 
因此 Lincheck 使用_循序一致性(sequential consistency)内存模型_ 下的有限模型检查.

简单的说, Lincheck 会分析所有的数据冲突, 从一个上下文切换开始, 然后是两个, 持续这个过程, 直到检测到指定数量的数据冲突.
这个策略可以使用最少的上下文切换次数找到不正确的数据冲突, 使得后面的 bug 调查更加容易. 

为了控制运行, Lincheck 会在测试代码中插入特殊的切换点. 这些切换点标识可以执行上下文切换的位置.
本质上, 这些切换点是对共享内存的访问, 例如在 JVM 中读取或更新域和数组元素, 以及 `wait/notify` 和 `park/unpark` 调用.
为了插入切换点, Lincheck 会使用 ASM 框架, 在运行过程中转换测试代码, 对已有的代码添加内部函数调用.

由于模型检查策略会控制执行过程, Lincheck 能够对导致错误数据冲突的情况提供追踪信息, 实际运用中这些信息会非常有用.
在 [使用 Lincheck 编写你的第一个测试](introduction.html#trace-the-invalid-execution) 教程中,
你可以看到对 `Counter` 的不正确执行的追踪信息的示例.

## 哪个测试策略更好?

_模型检查策略_ 更适合在循序一致性内存模型下查找 bug, 因为它能够确保更好的覆盖率, 并在找到错误时提供执行失败的追踪信息.

尽管 _压力测试_ 不保证覆盖率, 对算法中由于底层效应造成的 bug, 例如缺少 `volatile` 修饰符, 这种测试策略对这类 bug 的检查仍然很有帮助.
对于那些需要大量上下文切换才能重现的少见 bug, 压力测试也非常有用,
而模型检查策略, 由于目前的限制, 还无法分析这类 bug.

## 配置测试策略

要配置测试策略, 请在 `<TestingMode>Options` 类中设置选项.

1. 为 `CounterTest` 的场景生成和运行设置选项:

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.stress.*
    import org.junit.*

    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
    
        @Test
        fun stressTest() = StressOptions() // 压力测试选项:
            .actorsBefore(2) // 并行运行部分之前的操作数量 
            .threads(2) // 并行运行部分中的线程数量
            .actorsPerThread(2) // 并行运行部分的每个线程中的操作数量
            .actorsAfter(1) // 并行运行部分之后的操作数量
            .iterations(100) // 生成 100 个随机的并发场景
            .invocationsPerIteration(1000) // 对生成的每个场景运行 1000 次
            .check(this::class) // 运行测试
    }
    ```

2. 在此运行 `stressTest()`, Lincheck 会生成类似于下面的场景:

   ```text 
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc()    |          |
   | inc()    |          |
   | ------------------- |
   | get()    | inc()    |
   | inc()    | get()    |
   | ------------------- |
   | inc()    |          |
   | ------------------- |
   ```

   这里, 在并行运行部分之前有 2 个操作, 在并行运行部分中, 对每个操作都有 2 个线程,
   最后是 1 个操作.

你也可以通过同样的方式来配置模型检查测试.

## 场景最小化

你可能已经注意到了, 检测到的错误通常代表的场景比在测试配置中指定的场景要小.
Lincheck 会尝试对错误进行最小化, 努力删除操作, 同时又确保测试失败.

对上面的计数器测试最小化后的场景如下:

```text
= Invalid execution results =
| ------------------- |
| Thread 1 | Thread 2 |
| ------------------- |
| inc()    | inc()    |
| ------------------- |
```

由于对更小的场景更容易分析, 因此默认会启用场景最小化.
要关闭这个功能, 请对 `[Stress, ModelChecking]Options` 配置添加 `minimizeFailedScenario(false)` 选项.

## 对数据结构状态输出日志

对于调试 bug 另一个非常有用的功能是 _状态日志_.
在分析导致错误的数据冲突时, 你通常会在纸上画出数据结构变化图, 在每个事件后修改它的状态.
为了自动完成这个过程, 你可以提供一个特别的方法, 返回数据结构的一个 `String` 表达,
然后 Lincheck 可以在每个修改数据结构的事件之后打印状态数据状态.

为了做到这一点, 请定义一个没有参数的方法, 并标注 `@StateRepresentation` 注解.
和这个方法应该线程安全, 无阻塞, 而且绝不修改数据结构.

1. 在 `Counter` 示例中, `String` 表达仅仅是计数器的值.
因此, 要在追踪信息中打印计数器状态, 请对 `CounterTest` 添加 `stateRepresentation()` 函数:

    ```kotlin
    import org.jetbrains.kotlinx.lincheck.annotations.*
    import org.jetbrains.kotlinx.lincheck.check
    import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
    import org.junit.Test

    class CounterTest {
        private val c = Counter()
    
        @Operation
        fun inc() = c.inc()
    
        @Operation
        fun get() = c.get()
        
        @StateRepresentation
        fun stateRepresentation() = c.get().toString()
        
        @Test
        fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
    }
    ```

2. 运行 `modelCheckingTest()`, 确认 `Counter` 的状态会在修改计数器状态的切换点被打印输出
   (输出的文字以 `STATE:` 开始):

    ```text
    = Invalid execution results =
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | STATE: 0            |
    | ------------------- |
    | inc(): 1 | inc(): 1 |
    | ------------------- |
    | STATE: 1            |
    | ------------------- |
    
    The following interleaving leads to the error:
    | -------------------------------------------------------------------- |
    | Thread 1 |                         Thread 2                          |
    | -------------------------------------------------------------------- |
    |          | inc()                                                     |
    |          |   inc(): 1 at CounterTest.inc(CounterTest.kt:10)          |
    |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |     switch                                                |
    | inc(): 1 |                                                           |
    | STATE: 1 |                                                           |
    |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10) |
    |          |     STATE: 1                                              |
    |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)  |
    |          |   result: 1                                               |
    | -------------------------------------------------------------------- |
    ```

对于压力测试的情况, Lincheck 会在场景的并行运行部分之前和之后打印状态信息, 还会在结束时打印.

> * 查看 [这些示例的完整代码](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/CounterTest.kt)
> * 查看更多 [测试示例](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/StackTest.kt)
{:.note}

## 下一步

学习如何 [配置传递给操作的参数](operation-arguments.html), 以及在什么情况下需要如此.
