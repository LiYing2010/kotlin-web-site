[//]: # (title: 使用 Lincheck 编写你的第一个测试)

最终更新: %latestDocDate%

本教程演示如何编写你的第一个 Lincheck 测试, 设置 Lincheck 框架, 并使用它的基本 API.
你将会创建一个新的 IntelliJ IDEA 项目, 其中包含不正确的并发计数器实现,
为它编写一个测试, 然后查找并分析 bug.

## 创建一个项目

在 IntelliJ IDEA 中, 打开一个既有的 Kotlin 项目, 或 [创建一个新项目](jvm-get-started.md).
创建项目时, 使用 Gradle 构建系统.

## 添加需要的依赖项

1. 打开 `build.gradle(.kts)` 文件, 确认参考列表中添加了 `mavenCentral()`.
2. 在 Gradle 配置中添加以下依赖项:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   repositories {
       mavenCentral()
   }

   dependencies {
       // Lincheck 依赖项
       testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
       // 这个依赖项允许你使用 kotlin.test 和 JUnit:
       testImplementation("junit:junit:4.13")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   repositories {
       mavenCentral()
   }

   dependencies {
       // Lincheck 依赖项
       testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
       // 这个依赖项允许你使用 kotlin.test 和 JUnit:
       testImplementation "junit:junit:4.13"
   }
   ```
   </tab>
   </tabs>

## 编写一个并发的计数器, 并运行测试

1. 在 `src/test/kotlin` 目录中, 创建 `BasicCounterTest.kt` 文件, 并添加以下代码, 这是一个有 bug 的并发计数器, 然后为它编写一个 Lincheck 测试:

   ```kotlin
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.*
   import org.jetbrains.kotlinx.lincheck.strategy.stress.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter() // 初始状态

       // 对计数器的操作
       @Operation
       fun inc() = c.inc()

       @Operation
       fun get() = c.get()

       @Test // JUnit
       fun stressTest() = StressOptions().check(this::class) // 奇迹发生在这里
   }
   ```

   Lincheck 测试会自动完成以下工作:
   * 使用指定的 `inc()` 和 `get()` 操作生成一些随机的并发场景.
   * 对生成的每个场景执行一系列调用.
   * 验证每个调用的结果是否正确.

2. 运行上面的测试, 你将会看到以下错误:

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |
   ```

   这里, Lincheck 发现了测试运行结果违反了计数器的原子性 – 两个并发的增加操作返回了相同的结果 `1` .
   这代表其中一个增加操作丢失了, 计数器的行为不正确.

## 追踪错误的运行结果 {id="trace-the-invalid-execution"}

除了显示错误的运行结果之外, Lincheck 还提供了一种追踪错误原因的方法.
可以通过 [模型检查](testing-strategies.md#model-checking) 测试策略来使用这个功能,
这个测试策略使用有限次数的上下文切换来对多次执行进行检验.

1. 要切换测试策略, 请 `options` 类型从 `StressOptions()` 替换为 `ModelCheckingOptions()`.
修改后的 `BasicCounterTest` 类大致如下:

   ```kotlin
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.check
   import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
   import org.junit.*

   class Counter {
       @Volatile
       private var value = 0

       fun inc(): Int = ++value
       fun get() = value
   }

   class BasicCounterTest {
       private val c = Counter()

       @Operation
       fun inc() = c.inc()

       @Operation
       fun get() = c.get()

       @Test
       fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
   }
   ```

2. 再次运行测试. 你将会得到测试运行中导致错误结果的追踪信息:

   ```text
   = Invalid execution results =
   | ------------------- |
   | Thread 1 | Thread 2 |
   | ------------------- |
   | inc(): 1 | inc(): 1 |
   | ------------------- |

   The following interleaving leads to the error:
   | --------------------------------------------------------------------- |
   | Thread 1 |                          Thread  2                         |
   | --------------------------------------------------------------------- |
   |          | inc()                                                      |
   |          |   inc(): 1 at BasicCounterTest.inc(BasicCounterTest.kt:18) |
   |          |     value.READ: 0 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |     switch                                                 |
   | inc(): 1 |                                                            |
   |          |     value.WRITE(1) at Counter.inc(BasicCounterTest.kt:10)  |
   |          |     value.READ: 1 at Counter.inc(BasicCounterTest.kt:10)   |
   |          |   result: 1                                                |
   | --------------------------------------------------------------------- |
   ```

   根据这个追踪信息信息, 发生了以下事件:

   * **T2**: 第 2 个线程开始了 `inc()` 操作, 读取当前的计数器值 (`value.READ: 0`), 然后暂停.
   * **T1**: 第 1 个线程执行 `inc()`, 返回 `1`, 然后结束.
   * **T2**: 第 2 个线程恢复运行, 对前面得到的计数器值加 1, 错误的将计数器更新为 `1`.

> [请在这里查看完整代码](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/BasicCounterTest.kt).
>
{style="note"}

## 测试 Java 标准库

下面我们来发现一个 Java 标准库的 `ConcurrentLinkedDeque` 中的 bug.
下面的 Lincheck 测试会发现向双向队列头部删除和添加一个元素时发生的竞争情况:

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*
import java.util.concurrent.*

class ConcurrentDequeTest {
    private val deque = ConcurrentLinkedDeque<Int>()

    @Operation
    fun addFirst(e: Int) = deque.addFirst(e)

    @Operation
    fun addLast(e: Int) = deque.addLast(e)

    @Operation
    fun pollFirst() = deque.pollFirst()

    @Operation
    fun pollLast() = deque.pollLast()

    @Operation
    fun peekFirst() = deque.peekFirst()

    @Operation
    fun peekLast() = deque.peekLast()

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

运行 `modelCheckingTest()`. 测试将会失败, 输出信息如下:

```text
= Invalid execution results =
| ---------------------------------------- |
|      Thread 1     |       Thread 2       |
| ---------------------------------------- |
| addLast(22): void |                      |
| ---------------------------------------- |
| pollFirst(): 22   | addFirst(8): void    |
|                   | peekLast(): 22 [-,1] |
| ---------------------------------------- |

---
All operations above the horizontal line | ----- | happen before those below the line
---
Values in "[..]" brackets indicate the number of completed operations
in each of the parallel threads seen at the beginning of the current operation
---

The following interleaving leads to the error:
| --------------------------------------------------------------------------------------------------------------------------------- |
|                                                Thread 1                                                    |       Thread 2       |
| --------------------------------------------------------------------------------------------------------------------------------- |
| pollFirst()                                                                                                |                      |
|   pollFirst(): 22 at ConcurrentDequeTest.pollFirst(ConcurrentDequeTest.kt:17)                              |                      |
|     first(): Node@1 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:915)                     |                      |
|     item.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                     |                      |
|     next.READ: Node@2 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:925)                   |                      |
|     item.READ: 22 at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:917)                       |                      |
|     prev.READ: null at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:919)                     |                      |
|     switch                                                                                                 |                      |
|                                                                                                            | addFirst(8): void    |
|                                                                                                            | peekLast(): 22       |
|     compareAndSet(Node@2,22,null): true at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:920) |                      |
|     unlink(Node@2) at ConcurrentLinkedDeque.pollFirst(ConcurrentLinkedDeque.java:921)                      |                      |
|   result: 22                                                                                               |                      |
| --------------------------------------------------------------------------------------------------------------------------------- |
```

> [请在这里查看完整代码](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/ConcurrentLinkedDequeTest.kt).
>
{style="note"}

## 下一步

选择 [你的测试策略, 并对测试的运行进行配置](testing-strategies.md).

## 参见

* [如何生成操作参数](operation-arguments.md)
* [常见的算法约束](constraints.md)
* [检查非阻塞进度保证(non-blocking progress guarantee)](progress-guarantees.md)
* [定义算法的顺序规格(sequential specification)](sequential-specification.md)
