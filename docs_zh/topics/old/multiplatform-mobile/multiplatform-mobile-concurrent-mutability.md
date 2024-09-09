---
type: doc
layout: reference
title: "并发(Concurrency)中的可变性(Mutability)"
---

# 并发(Concurrency)中的可变性(Mutability)

最终更新: {{ site.data.releases.latestDocDate }}

> 本章描述的是旧的内存管理器的功能特性.
> 从 Kotlin 1.7.20 开始会默认启用新的内存管理器, 详情请参见 [Kotlin/Native 内存管理](../native/native-memory-manager.html).
{:.note}

在 iOS 上进行开发时, [Kotlin/Native 的状态和并发模型](multiplatform-mobile-concurrency-overview.html)
有 [2 条简单的规则](multiplatform-mobile-concurrency-overview.html#rules-for-state-sharing).

1. 一个可变的(Mutable), 非冻结的状态, 同一时刻只能被 1 个线程访问.
2. 一个不可变的(Immutable), 冻结的状态, 可以在线程之间共用.

遵循这些规则的结果是, 你不能修改 [全局状态](multiplatform-mobile-concurrency-overview.html#global-state), 而且不能在多个线程中修改同一个共用状态.
很多情况下, 只需要修改你的代码设计方式就可以解决了, 而且你并不需要并发的可变数据.
在 JVM 代码中, 状态曾经是在多个线程中可变的, 但它们其实并不 *需要* 如此.

但是, 在很多其他情况下, 你可能需要在任意的线程中访问一个状态, 或者你可能有一些 _服务_ 对象, 需要在整个应用程序中使用.
或者, 你只是不想花费太多力气重新设计既有的代码. 不论原因是什么, _将可变的状态限制在单个线程内并不总是可行的_.

有很多种技术可以帮助你绕过这些限制, 每一种技术都有自己的有点和缺点:

* [Atomic](#atomics)
* [线程隔离的(Thread-isolated)状态](#thread-isolated-state)
* [Low-level capabilities](#low-level-capabilities)

## Atomic

Kotlin/Native 提供了一组 Atomic 类, 能够冻结, 同时又能够修改其中包含的值.
这些类在 Kotlin/Native 运行期实现状态的特殊情况处理. 也就是说你能够修改一个冻结的状态中的值.

Kotlin/Native 运行期包含 Atomic 的一些不同的变体. 你可以之间使用它们, 或者在一个库内使用它们.

Kotlin 提供一个低层的 [`kotlinx.atomicfu`](https://github.com/Kotlin/kotlinx.atomicfu) 库(实验性功能),
目前只在为内部目的使用, 不要用于一般的用途.
你还可以使用 [Stately](https://github.com/touchlab/Stately),
这是一个工具库, 为 Kotlin/Native 专有的并发实现跨平台兼容性, 由 [Touchlab](https://touchlab.co) 开发. 

### `AtomicInt`/`AtomicLong`

首先介绍的 2 个类是简单的数值: `AtomicInt` 和 `AtomicLong`. 使用它们, 
你可以共用 `Int` 或 `Long`, 从多个线程中读取或修改.

```kotlin
object AtomicDataCounter {
    val count = AtomicInt(3)
  
    fun addOne() {
        count.increment()
    }
}
```

上面的示例是一个全局的 `object`, 在 Kotlin/Native 中它默认是冻结的.
但是, 你能够修改 `count` 的值. 
需要注意的是, 你能够 _在任何线程中_ 修改 `count` 的值.

### `AtomicReference`

`AtomicReference` 保存一个对象实例, 而且你能够修改这个对象实例. 
你放在 `AtomicReference` 中的对象必须是冻结的, 但你能够修改 `AtomicReference` 保存的值.
比如, 下面的示例在  Kotlin/Native 中无法工作:

```kotlin
data class SomeData(val i: Int)

object GlobalData {
    var sd = SomeData(0)

    fun storeNewValue(i: Int) {
        sd = SomeData(i) // 无法工作
    }
}
```

根据 [全局状态的规则](multiplatform-mobile-concurrency-overview.html#global-state), 在 Kotlin/Native 中全局 `object` 值是冻结的,
因此试图修改 `sd` 将会失败. 你可以改用 `AtomicReference` 来实现:

```kotlin
data class SomeData(val i: Int)

object GlobalData {
    val sd = AtomicReference(SomeData(0).freeze())

    fun storeNewValue(i: Int) {
        sd.value = SomeData(i).freeze()
    }
}
```

`AtomicReference` 自身是冻结的, 因此它可以存在于一个冻结的状态之内.
在上面的代码中, `AtomicReference` 实例内的数据是明确的冻结的.
但是, 在跨平台库中, 数据会自动冻结.
如果你使用 Kotlin/Native 运行期的 `AtomicReference`, 你 *应该* 记住明确的调用 `freeze()`.

当你需要共用一个状态时, `AtomicReference` 非常有用. 但是也有一些缺点需要考虑.

*相对于* 一个标准的可变的状态, 访问并修改 `AtomicReference` 内的值, 在性能上耗费很高. 
如果性能问题很重要, 你可能需要考虑其他方案, 使用 [线程隔离的状态](#thread-isolated-state).

还有一个潜在的问题是内存泄露, 这个问题将来会解决.
`AtomicReference` 中保存的对象存在循环引用的情况下, 如果你没有明确的清除, 那么可能会泄露内存:

* 如果你保存的状态可能存在循环引用, 需要回收, 你应该在 `AtomicReference` 中使用一个可为 null 的类型, 
  并在使用完毕时, 明确的设置为 null.
* 如果将 `AtomicReference` 保存在一个全局对象中, 这个全局对象永远不会失效, 那么没有关系
  (因为在进程的整个生命周期中, 这部分内存永远不需要回收).

```kotlin
class Container(a:A) {
    val atom = AtomicReference<A?>(a.freeze())

    /**
     * 当你使用完毕 Container 时, 需要调用这个函数
     */
    fun clear(){
        atom.value = null
    }
}
```

最后, 还存在一致性问题. 设置/读取 `AtomicReference` 中的值, 本身是原子操作,
但如果你的逻辑需要一个更长的线程执行链, 那么你需要自己实现.
比如, 如果你有一个值的 List 保存在 在 `AtomicReference` 中, 你希望扫描这些值, 然后添加一个新值,
那么你需要实现某种并发管理, `AtomicReference` 本身没有提供这种管理.

下面的示例如果在多个线程中调用, 那么不能防止 List 中出现重复的值:

```kotlin
object MyListCache {
    val atomicList = AtomicReference(listOf<String>().freeze())
    fun addEntry(s:String){
        val l = atomicList.value
        val newList = mutableListOf<String>()
        newList.addAll(l)
        if(!newList.contains(s)){
            newList.add(s)
        }
        atomicList.value = newList.freeze()
    }
}
```

你需要实现某种形式的锁, 或者检查-设置逻辑, 来保证正确的并发访问.

## 线程隔离的(Thread-isolated)状态

[Kotlin/Native 状态的首要规则](multiplatform-mobile-concurrency-overview.html#rule-1-mutable-state-1-thread) 是, 可变状态只能在单个线程内访问.
Atomic 允许在任何线程中改变状态.
将可变状态隔离到单个线程, 并且允许其他线程与这个状态通信, 是实现并发的可变状态的一个替代方法.

要做到这一点, 需要创建一个工作队列, 只能从单个线程访问, 并在这个线程中创建一个可变状态.
其它线程通过调度工作队列中的 _工作_, 实现与可变线程的通信.

输入或输出的数据, 如果有的话, 需要冻结, 但隐藏在工作线程中的可变状态保持可变. 

概念上来看, 大致如下: 一个线程向状态处理器(State Worker) push 一个冻结的状态, 处理器将它保存到可变的状态容器中.
之后, 另一个线程调度工作, 读取这个状态.

![线程隔离的状态]({{ url_for('asset', path='docs/images/multiplatform-mobile/isolated-state.animated.gif') }})

线程隔离的状态实现起来略微复杂, 有库提供了这种功能.

### `AtomicReference` 与 线程隔离的状态 比较

对于简单的值, `AtomicReference` 可能是一个更加简单的选择.
对于重要的状态的情况, 并且可能发生变化, 使用线程隔离的状态可能是更好的选择.
主要的性能损失实际上跨越了线程. 但在对集合的性能测试中, 比如, 线程隔离的状态的性能显著的优于使用 `AtomicReference` 实现的可变状态.

线程隔离的状态还避免了 `AtomicReference` 存在的一致性问题. 由于所有的操作都发生在状态线程中, 而且你进行了工作调度,
因此你可以执行多个步骤的操作, 同时还保证一致性, 而不需要管理线程互斥.
线程隔离是 Kotlin/Native 状态规则的一个设计性功能特性, 隔离的可变状态会遵守这些规则.

而且, 对于并发的可变的状态来说, 线程隔离的状态是一种更加灵活的方式.
你可以使用任何类型的可变状态, 而不需要创建复杂的并发实现.

## 低层能力

Kotlin/Native 还有一些更加高级的方式来共用并发的状态. 为了实现高性能, 你可能需要完全避开并发规则. 

> 这是一个更加高级的话题. 你需要深入理解, 在 Kotlin/Native 中并发的底层工作原理,
> 使用这种方法时, 你需要非常小心. 详情请参见 [并发](../native/native-immutability.html#concurrency-in-kotlin-native).
{:.note}

Kotlin/Native 运行在 C++ 之上, 并提供了与 C 和 Objective-C 的交互能力.
如果你在 iOS 上运行, 你还可以从 Swift 中向你的共用代码传递 Lambda 表达式参数.
所有这些原生代码都不受 Kotlin/Native 的状态限制. 

因此, 你能够使用原生语言实现一个并发的可变状态, 然后让 Kotlin/Native 与它交互.

你可以使用 [Objective-C 交互](../native/native-c-interop.html) 访问低层代码.
你还可以使用 Swift 实现 Kotlin 接口, 或者传递 Lambda 表达式参数, Kotlin 代码能够在任何线程中调用这些 Lambda 表达式.

平台原生方案的优势之一是性能. 不好的一面在于, 你需要自行管理并发. 
Objective-C 不理解 `frozen`, 但如果你将来自 Kotlin 的状态在 Objective-C 结构中, 并在线程间共用, Kotlin 状态一定需要冻结. 
Kotlin/Native 的运行期会对各种问题向你提出警告, 但在原生代码中, 有可能会导致非常非常难以追查的并发问题.
而且非常容易发生内存泄露.

在 Kotlin 跨平台应用程序中, 你的编译目标还包括 JVM, 因此你需要替代方法来实现你用平台原生代码实现的功能.
这显然会导致更多的工作量, 而且可能导致平台之间的不一致性.

_本文由 [Touchlab](https://touchlab.co/) 编写, 供 JetBrains 发布._
