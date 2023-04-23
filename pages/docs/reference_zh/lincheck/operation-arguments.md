---
type: doc
layout: reference
category: "Lincheck"
title: "操作参数"
---

# 操作参数

最终更新: {{ site.data.releases.latestDocDate }}

本教程中, 你将会学习如何配置操作参数.

以下面这个简单的 `MultiMap` 实现为例子. 它内部使用 `ConcurrentHashMap`, 其中保存的是一个值列表:

```kotlin
import java.util.concurrent.*

class MultiMap<K, V> {
    private val map = ConcurrentHashMap<K, List<V>>()
   
    // 维护与指定的 key 关联的值列表.
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

这个 `MultiMap` 实现是线性一致的吗?
如果不是, 在访问小范围的 key 时, 并发操作同一个 key 的可能性会变高, 因此这种情况下更可能检测到错误的数据.

对这样的情况, 我们为 `key: Int` 参数配置生成器:

1. 声明 `@Param` 注解.
2. 指定整数生成器类: `@Param(gen = IntGen::class)`.
   Lincheck 默认对几乎所有的基本类型和字符串支持随机参数的生成器.
3. 使用字符串配置 `@Param(conf = "1:2")`, 定义要生成的值的范围.
4. 指定参数配置的名称 (`@Param(name = "key")`), 以便在多个操作中共用这个配置.

   下面是对 `MultiMap` 的压力测试, 它会为 `add(key, value)` 和 `get(key)` 操作生成 key 值, 范围是 `[1..2]`: 
   
   ```kotlin
   import java.util.concurrent.*
   import org.jetbrains.kotlinx.lincheck.annotations.*
   import org.jetbrains.kotlinx.lincheck.check
   import org.jetbrains.kotlinx.lincheck.paramgen.*
   import org.jetbrains.kotlinx.lincheck.strategy.stress.*
   import org.junit.*
   
   class MultiMap<K, V> {
       private val map = ConcurrentHashMap<K, List<V>>()
   
       // 维护与指定的 key 关联的值列表.
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
       fun stressTest() = StressOptions().check(this::class)
   
       @Test
       fun modelCheckingTest() = ModelCheckingOptions().check(this::class)
   }
   ```

5. 运行 `stressTest()`, 会看到以下输出:

   ```text
   = Invalid execution results =
   Parallel part:
   | add(1, 1): void | add(1, 4): void |
   Post part:
   [get(1): [4]]
   ```

6. 最后, 运行 `modelCheckingTest()`. 它会失败, 输出如下:

   ```text
   = Invalid execution results =
   Parallel part:
   | add(1, 6): void | add(1, -8): void |
   Post part:
   [get(1): [-8]]
   = The following interleaving leads to the error =
   Parallel part trace:
   |                      | add(1, -8)                                               |
   |                      |   add(1,-8) at MultiMapTest.add(MultiMapTest.kt:61)      |
   |                      |     get(1): null at MultiMap.add(MultiMapTest.kt:38)     |
   |                      |     switch                                               |
   | add(1, 6): void      |                                                          |
   |   thread is finished |                                                          |
   |                      |     put(1,[-8]): [6] at MultiMap.add(MultiMapTest.kt:40) |
   |                      |   result: void                                           |
   |                      |   thread is finished                                     |
   ```

由于 key 值范围很小, Lincheck 很快发现了竞争情况: 当 2 个值并发的添加到同一个 key 值的时候, 其中 1 个值可能会被覆盖, 并丢失.

> [请在这里查看完整代码](https://github.com/Kotlin/kotlinx-lincheck/blob/guide/src/jvm/test/org/jetbrains/kotlinx/lincheck/test/guide/MultiMapTest.kt).
{:.note}

## 下一步

现在的 `MultiMap` 实现使用一个复杂的 `j.u.c.ConcurrentHashMap` 数据结构作为底层工具,
这个类内部的同步控制, 会显著提升数据的并发处理能力, 因此可能会需要更多时间才能发现 bug. 

如果你认为 `j.u.c.ConcurrentHashMap` 的实现是正确的,
你可以使用模型检查测试策略中的 [模块化测试功能](modular-testing.html), 来提高测试速度, 并增加测试覆盖率.

## 参见

学习如何测试设置了执行中访问 [约束](constraints.html) 的数据结构.
