---
type: doc
layout: reference
category: "Lincheck"
title: "模块化测试"
---

# 模块化测试

最终更新: {{ site.data.releases.latestDocDate }}

在构建新的算法时, 经常会使用现有的数据结构作为底层工具.
由于这些数据结构通常比较复杂, 因此发生冲突的可能性会显著的增加.

如果你认为这些底层数据结构是正确的, 并把它们的操作当作是原子操作, 那么你可以只检查对你的算法有意义的数据冲突, 因此提高测试质量.
Lincheck 通过[模型检查策略](testing-strategies.html#model-checking) 中的 _模块化测试(modular testing)_ 功能,
可以帮助你实现这一点.

我们来看看下面的 `MultiMap` 实现, 它使用了现代化的 `j.u.c.ConcurrentHashMap`:

```kotlin
import java.util.concurrent.*

class MultiMap<K, V> {
    val map = ConcurrentHashMap<K, List<V>>()

    // 根据指定的 key, 将值添加到列表 
    // 这里包含竞争情况 :(
    fun add(key: K, value: V) {
        val list = map[key]
        if (list == null) {
            map[key] = listOf(value)
        } else {
            map[key] = list + value
        }
    }

    fun get(key: K): List<V> = map[key] ?: emptyList()
}
```

`j.u.c.ConcurrentHashMap` 已经确保是线性一致的, 因此它的操作可以认为是原子操作. 
在你的测试中, 你可以在 `ModelCheckingOptions()` 中使用 `addGuarantee` 选项来指定这一点:

```kotlin
import java.util.concurrent.*
import org.jetbrains.kotlinx.lincheck.annotations.*
import org.jetbrains.kotlinx.lincheck.check
import org.jetbrains.kotlinx.lincheck.paramgen.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.*
import org.jetbrains.kotlinx.lincheck.strategy.managed.modelchecking.*
import org.junit.*

class MultiMap<K,V> {
    val map = ConcurrentHashMap<K, List<V>>()

    // 根据指定的 key, 将值添加到列表 
    // 这里包含竞争情况 :(
    fun add(key: K, value: V) {
        val list = map[key]
        if (list == null) {
            map[key] = listOf(value)
        } else {
            map[key] = list + value
        }
    }

    fun get(key: K): List<V> = map[key] ?: emptyList()
}

@Param(name = "key", gen = IntGen::class, conf = "1:2")
class MultiMapTest {
    private val map = MultiMap<Int, Int>()

    @Operation
    fun add(@Param(name = "key") key: Int, value: Int) = map.add(key, value)

    @Operation
    fun get(@Param(name = "key") key: Int) = map.get(key)

    @Test
    fun modularTest() = ModelCheckingOptions()
        .addGuarantee(forClasses(ConcurrentHashMap::class).allMethods().treatAsAtomic())
        // 注意, 设置过原子性操作保证之后, Lincheck 可以验证所有可能的数据冲突,
        // 因此当调用次数设置为 `Int.MAX_VALUE` 时, 测试可以成功通过
        // 如果你将上面的行注释掉, 测试会执行很长时间, 然后很可能发生 `OutOfMemoryError` 错误而失败.
        .invocationsPerIteration(Int.MAX_VALUE)
        .check(this::class)
}
```

> [请在这里查看完整代码](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/MultiMapTest.kt).
{:.note}

## 下一步

学习如何测试设置了 [执行期访问约束](constraints.html) 的数据结构, 
比如单生成者/单消费者队列.
