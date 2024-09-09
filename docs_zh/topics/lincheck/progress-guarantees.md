---
type: doc
layout: reference
category: "Lincheck"
title: "进度保证"
---

# 进度保证

最终更新: {{ site.data.releases.latestDocDate }}

很多并发算法会提供非阻塞的进度保证, 例如无锁(lock-freedom)和无等待(wait-freedom).
由于算法通常比较复杂, 因此很容易加入 bug, 导致算法阻塞.
使用模型检查策略, Lincheck 可以帮助你找到这种存活 bug.

要检查算法的进度保证性, 请在 `ModelCheckingOptions()` 中启用 `checkObstructionFreedom` 选项:

```kotlin
ModelCheckingOptions().checkObstructionFreedom()
```

创建一个 `ConcurrentMapTest.kt` 文件.
然后添加下面的测试代码, 它能够检测出 Java 标准库中的 `ConcurrentHashMap::put(key: K, value: V)` 是一个阻塞操作:

```kotlin
import org.jetbrains.kotlinx.lincheck.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*
import java.util.concurrent.*

class ConcurrentHashMapTest {
    private val map = ConcurrentHashMap<Int, Int>()

    @Operation
    fun put(key: Int, value: Int) = map.put(key, value)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions()
        .actorsBefore(1) // 初始化 HashMap
        .actorsPerThread(1)
        .actorsAfter(0)
        .minimizeFailedScenario(false)
        .checkObstructionFreedom()
        .check(this::class)
}
```

运行 `modelCheckingTest()`. 你会得到以下结果:

```text
= Obstruction-freedom is required but a lock has been found =
| ---------------------- |
|  Thread 1  | Thread 2  |
| ---------------------- |
| put(1, -1) |           |
| ---------------------- |
| put(2, -2) | put(3, 2) |
| ---------------------- |

---
All operations above the horizontal line | ----- | happen before those below the line
---

The following interleaving leads to the error:
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                         Thread 1                                         |                                         Thread 2                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                                          | put(3, 2)                                                                                |
|                                                                                          |   put(3,2) at ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                         |
|                                                                                          |     putVal(3,2,false) at ConcurrentHashMap.put(ConcurrentHashMap.java:1006)              |
|                                                                                          |       table.READ: Node[]@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |
|                                                                                          |       MONITORENTER at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |
|                                                                                          |       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1032) |
|                                                                                          |       next.READ: null at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1046)           |
|                                                                                          |       switch                                                                             |
| put(2, -2)                                                                               |                                                                                          |
|   put(2,-2) at ConcurrentHashMapTest.put(ConcurrentMapTest.kt:11)                        |                                                                                          |
|     putVal(2,-2,false) at ConcurrentHashMap.put(ConcurrentHashMap.java:1006)             |                                                                                          |
|       table.READ: Node[]@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1014)      |                                                                                          |
|       tabAt(Node[]@1,0): Node@1 at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1018) |                                                                                          |
|       MONITORENTER at ConcurrentHashMap.putVal(ConcurrentHashMap.java:1031)              |                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
```

下面我们来为非阻塞的 `ConcurrentSkipListMap<K, V>` 添加一个测试, 这个测试应该成功通过:

```kotlin
class ConcurrentSkipListMapTest {
    private val map = ConcurrentSkipListMap<Int, Int>()

    @Operation
    fun put(key: Int, value: Int) = map.put(key, value)

    @Test
    fun modelCheckingTest() = ModelCheckingOptions()
        .checkObstructionFreedom()
        .check(this::class)
}
```

> 共通的非阻塞进度保证包括 (从最强到最弱):
> 
> * **无等待(wait-freedom)**, 无论其他线程正在做什么, 每个操作都能够在有限次数的步骤内完成.
> * **无锁(lock-freedom)**, 保证系统级别的进度, 至少一个操作能够在有限次数的步骤内完成, 其他某个操作可能会阻塞.
> * **无阻塞(obstruction-freedom)**, 如果其他所有线程都暂停, 那么操作能够在有限次数的步骤内完成.
{type="tip"}

目前, Lincheck 只支持无阻塞(obstruction-freedom)的进度保证.
但是, 大多数现实生活中的存活 bug 都是由于添加了不正确的阻塞代码,
因此无阻塞(obstruction-freedom)检查 也有助于测试无锁(lock-freedom)和无等待(wait-freedom)算法.

> * [请在这里查看示例的完整代码](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/ConcurrentMapTest.kt).
> * 查看 [另一个示例](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/ObstructionFreedomViolationTest.kt),
>  这里会对 Michael-Scott 队列实现测试它的进度保证.
{:.note}

## 下一步

学习如何对被测试的算法明确的 [指定顺序规格](sequential-specification.html), 增加 Lincheck 测试的健壮性.
