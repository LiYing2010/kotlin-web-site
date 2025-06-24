[//]: # (title: 顺序规格)

为了确认算法实现了正确的顺序行为, 你可以为测试数据结构编写一个简单的顺序化实现,
用来定义算法的 _顺序规格(sequential specification)_.

> 使用这个功能, 你只需要编写单个测试, 而不必分别编写顺序测试和并发测试.
>
{style="tip"}

要指定需要验证的算法的顺序规格, 你需要:

1. 实现一个所有测试方法的顺序化版本.
2. 将带有顺序化实现的类传递给 `sequentialSpecification()` 选项:

   ```kotlin
   StressOptions().sequentialSpecification(SequentialQueue::class)
   ```

例如, 这里是一个测试, 它检查 Java 标准库的 `j.u.c.ConcurrentLinkedQueue` 类的正确性.

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.stress.*
import org.junit.*
import java.util.*
import java.util.concurrent.*

class ConcurrentLinkedQueueTest {
    private val s = ConcurrentLinkedQueue<Int>()

    @Operation
    fun add(value: Int) = s.add(value)

    @Operation
    fun poll(): Int? = s.poll()

    @Test
    fun stressTest() = StressOptions()
        .sequentialSpecification(SequentialQueue::class.java)
        .check(this::class)
}

class SequentialQueue {
    private val s = LinkedList<Int>()

    fun add(x: Int) = s.add(x)
    fun poll(): Int? = s.poll()
}
```

> [请在这里查看示例的完整代码](https://github.com/JetBrains/lincheck/blob/master/src/jvm/test/org/jetbrains/kotlinx/lincheck_test/guide/ConcurrentLinkedQueueTest.kt).
>
{style="note"}
