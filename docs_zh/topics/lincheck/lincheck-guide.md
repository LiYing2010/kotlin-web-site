[//]: # (title: 概述)
[//]: # (description: Lincheck 是一个用于在 JVM 平台上测试并发代码的框架. Lincheck 会探索你的代码中潜在的线程交叉执行情况, 找到那些导致错误行为的部分.)

Lincheck 是一个用于在 JVM 平台上测试并发代码的框架. 在运行测试时, Lincheck 会探索程序中潜在的
线程交叉执行情况, 并报告那些导致错误行为的部分.

> 在 [Kotlin Multiplatform](get-started.topic) 项目中, 你只能在 JVM 平台上使用 Lincheck 测试代码.
>
{style="note"}

在 Lincheck 中编写并发测试, 只需要列出每个线程的操作和预期的断言.
Lincheck 会处理其余的工作:

```kotlin
class CounterTest {
    @Test // 声明测试函数
    fun test() = Lincheck.runConcurrentTest {
        var counter = 0

        // 并发的递增 counter
        val t1 = thread { counter++ }
        val t2 = thread { counter++ }

        // 等待线程结束
        t1.join()
        t2.join()

        // 检查两次递增操作是否都已生效
        assertEquals(2, counter)
    }
}
```

如果测试失败, Lincheck 会提供导致错误的线程交叉执行(Interleaving)和线程切换点(Switch Point):

```text
| ------------------------------------------------------------------------------- |
|                   Main Thread                   |   Thread 1    |   Thread 2    |
| ------------------------------------------------------------------------------- |
| thread(block = Lambda#2): Thread#1              |               |               |
| thread(block = Lambda#3): Thread#2              |               |               |
| switch (reason: waiting for Thread 1 to finish) |               |               |
|                                                 |               | run()         |
|                                                 |               |   counter ➜ 0 |
|                                                 |               |   switch      |
|                                                 | run()         |               |
|                                                 |   counter ➜ 0 |               |
|                                                 |   counter = 1 |               |
|                                                 |               |   counter = 1 |
| Thread#1.join()                                 |               |               |
| Thread#2.join()                                 |               |               |
| counter.element ➜ 1                             |               |               |
| assertEquals(2, 1): threw AssertionFailedError  |               |               |
| ------------------------------------------------------------------------------- |
```

## Lincheck 的工作原理 {id="how-lincheck-works"}

每次 JVM 运行并发代码时, 各线程间操作的执行顺序可能会发生变化.
例如, 一个操作可能会被另一个线程中的操作打断.
这本身并不是错误, 但如果代码存在并发 bug, 则可能导致错误.

![这个图片比较了程序的执行场景与执行调度. 在第一个执行调度中, 操作逐个执行. 在第二个执行调度中, 第一个操作被第二个操作打断.](scenario-vs-schedule.png){ width="700" }

> _执行场景(Execution Scenario)_ 定义了操作在各线程内如何分布, 以及在每个线程内的执行顺序.
>
> _执行调度(Execution Schedule)_ (也称为_线程交叉执行(Interleaving)_) 定义了所有线程中所有操作的执行顺序.
>
{style="tip"}

Lincheck 实现了两种测试策略, 用于查找导致错误行为的执行调度:
* **模型检查(Model Checking)**.
  Lincheck 向程序中插入明确的的线程切换指令, 控制调度.
  这些指令被放置在同步点或共享内存访问处.
  模型检查使 Lincheck 能够生成导致错误的精确的执行追踪.
* **压力测试(Stress Testing)**.
  由操作系统控制调度.
  Lincheck 对每个场景多次执行, 以增加发现错误的机会.

## 探索 Lincheck 的功能 {id="explore-lincheck"}

* 阅读 [Lincheck 入门](lincheck-getting-started.md) 章节, 逐步学习 Lincheck 的功能特性.
* 阅读 [测试策略](testing-strategies.md) 章节, 学习如何使用声明式方案测试并发数据结构.

## 了解更多 {id="learn-more"}

* Nikita Koval 的演讲 "我们如何测试 Kotlin Coroutine 中的并发算法":
  [视频](https://youtu.be/jZqkWfa11Js).
  KotlinConf 2023
* 由 Maria Sokolova 主持的研讨会 "Lincheck: 在 JVM 上测试并发程序":
  [视频第 1 部分](https://www.youtube.com/watch?v=YNtUK9GK4pA),
  [视频第 2 部分](https://www.youtube.com/watch?v=EW7mkAOErWw).
  Hydra 2021
* Nikita Koval 等人撰写的 "Lincheck: 一个在 JVM 上测试并发数据结构的实用框架":
  [论文](https://nikitakoval.org/publications/cav23-lincheck.pdf).
  2023
