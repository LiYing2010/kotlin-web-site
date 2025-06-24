[//]: # (title: 数据结构约束)

有些数据结构可能要求一部分操作不能并发执行, 例如单生成者(single-producer)/单消费者(single-consumer) 队列.
Lincheck 对这样的约束提供了现成的支持, 会根据约束条件生成并发场景.

以 [JCTools 库](https://github.com/JCTools/JCTools) 中的
[单消费者队列](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java) 为例.
我们来编写一个测试, 检查它的 `poll()`, `peek()`, 以及 `offer(x)` 操作的正确性.

在你的 `build.gradle(.kts)` 文件中, 添加 JCTools 依赖项:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // jctools 依赖项
       testImplementation("org.jctools:jctools-core:%jctoolsVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // jctools 依赖项
       testImplementation "org.jctools:jctools-core:%jctoolsVersion%"
   }
   ```
   </tab>
   </tabs>

为了满足单消费者约束条件, 需要确保所有的 `poll()` 和 `peek()` 消费操作都只会从单个线程中调用.
为了做到这一点, 我们可以将对应的 `@Operation` 注解的 `nonParallelGroup` 参数设置为相同的值, 例如, `"consumers"`.

下面是测试代码:

```kotlin
import org.jctools.queues.atomic.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

class MPSCQueueTest {
    private val queue = MpscLinkedAtomicQueue<Int>()

    @Operation
    fun offer(x: Int) = queue.offer(x)

    @Operation(nonParallelGroup = "consumers")
    fun poll(): Int? = queue.poll()

    @Operation(nonParallelGroup = "consumers")
    fun peek(): Int? = queue.peek()

    @Test
    fun stressTest() = StressOptions().check(this::class)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
}
```

下面是为这个测试生成的并发场景的例子:

```text
= Iteration 15 / 100 =
| --------------------- |
| Thread 1  | Thread 2  |
| --------------------- |
| poll()    |           |
| poll()    |           |
| peek()    |           |
| peek()    |           |
| peek()    |           |
| --------------------- |
| offer(-1) | offer(0)  |
| offer(0)  | offer(-1) |
| peek()    | offer(-1) |
| offer(1)  | offer(1)  |
| peek()    | offer(1)  |
| --------------------- |
| peek()    |           |
| offer(-2) |           |
| offer(-2) |           |
| offer(2)  |           |
| offer(-2) |           |
| --------------------- |
```

注意, 所有的消费操作 `poll()` 和 `peek()` 的调用, 都通过单个线程执行, 因此满足了 "单消费者" 约束.

> [请在这里查看完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/MPSCQueueTest.kt).
>
{style="note"}

## 下一步

学次如何使用模型检查策略来 [检查你的算法的进度保证](progress-guarantees.md).
