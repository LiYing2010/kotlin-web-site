---
type: doc
layout: reference
category: "Lincheck"
title: "数据结构约束"
---

# 数据结构约束

最终更新: {{ site.data.releases.latestDocDate }}

有些数据结构可能要求一部分操作不能并发执行, 例如单生成者/单消费者队列.
Lincheck 对这样的约束提供了现成的支持, 会根据约束条件生成并发场景.

以 [JCTools 库](https://github.com/JCTools/JCTools) 中的
[单消费者队列](https://github.com/JCTools/JCTools/blob/66e6cbc9b88e1440a597c803b7df9bd1d60219f6/jctools-core/src/main/java/org/jctools/queues/atomic/MpscLinkedAtomicQueue.java) 为例.
我们来编写一个测试, 检查它的 `poll()`, `peek()`, 以及 `offer(x)` 操作的正确性.

为了满足单消费者约束条件, 需要确保所有的 `poll()` 和 `peek()` 消费操作都只会从单个线程中调用.
为了做到这一点, 需要为 _非并行_ 执行声明一组操作:

1. 声明 `@OpGroupConfig` 注解, 为非并行执行创建一个操作组, 对组命名, 并将 `nonParallel` 参数设置为 `true`.
2. 在 `@Operation` 注解中指定组的名称, 将所有的非并行操作添加到这个组.

Here is the resulting test:

```kotlin
import org.jctools.queues.atomic.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*

// 声明一个不应该并行执行的操作组:
@OpGroupConfig(name = "consumer", nonParallel = true)
class MPSCQueueTest {
    private val queue = MpscLinkedAtomicQueue<Int>()

    @Operation
    fun offer(x: Int) = queue.offer(x)

    @Operation(group = "consumer") 
    fun poll(): Int? = queue.poll()

    @Operation(group = "consumer")
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
Execution scenario (init part):
[offer(1), offer(4), peek(), peek(), offer(-6)]
Execution scenario (parallel part):
| poll()   | offer(6)  |
| poll()   | offer(-1) |
| peek()   | offer(-8) |
| offer(7) | offer(-5) |
| peek()   | offer(3)  |
Execution scenario (post part):
[poll(), offer(-6), peek(), peek(), peek()]

```

注意, 所有的消费操作 `poll()` 和 `peek()` 的调用, 都通过单个线程执行, 因此满足了 "单消费者" 约束.

> [请在这里查看完整代码](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/MPSCQueueTest.kt).
{:.note}

## 下一步

学次如何使用模型检查策略来 [检查你的算法的进度保证](progress-guarantees.html).
