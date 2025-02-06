[//]: # (title: 迁移到新的内存管理器)

> 对旧内存管理器的支持在 Kotlin 1.9.20 中已经完全删除.
> 请将你的项目迁移到现在的内存模式, 它从 Kotlin 1.7.20 开始默认启用.
>
{style="note"}

本向导会对新的 [Kotlin/Native 内存管理器](native-memory-manager.md) 与旧的内存管理器进行比较, 并介绍如何迁移你的项目.

新内存管理器最重要的变化是解除了对象共享的限制.
在线程之间共享对象时, 你不需要冻结对象, 具体来说:

* 顶层属性不需要标注 `@SharedImmutable`, 可以被任意线程访问和修改.
* 通过代码交互传递的对象不需要冻结, 可以被任意线程访问和修改.
* `Worker.executeAfter` 不再要求其中的操作被冻结.
* `Worker.execute` 不再需要生成者返回一个孤立的对象子图(subgraph).
* 包含 `AtomicReference` 和 `FreezableAtomicReference` 的环形引用不会导致内存泄露.

除了对象共享更加容易之外, 新的内存管理器还带来了其他主要变化:

* 全局属性会在定义它们的文件被初次访问时延迟执行它们的初始化. 以前全局属性会在程序启动时初始化.
  作为一个变通方法, 你可以使用 `@EagerInitialization` 注解, 将属性标注为必须在程序启动时初始化.
  使用这个注解之前, 请先阅读它的 [文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/).
* `by lazy {}` 属性支持线程安全模式, 而且不处理无限递归.
* 从 `Worker.executeAfter` 的 `operation` 中抛出的异常, 会和运行时的其它部分一样进行处理,
  尝试执行一个用户自定义的、未被处理的异常处理程序, 如果没有找到异常处理程序, 或异常处理程序自身也抛出异常而失败, 则终止程序.
* 冻结功能已被废弃, 而且始终禁用.

要从旧的内存管理器迁移你的项目, 请遵循下面的步骤:

## 更新 Kotlin {id="update-kotlin"}

从 Kotlin 1.7.20 开始会默认启用新的 Kotlin/Native 内存管理器.
请检查 Kotlin 版本, 如果需要的话, 请 [更新到最新版](releases.md#update-to-a-new-kotlin-version).

## 更新依赖项 {id="update-dependencies"}

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>
            更新到 1.6.0 或更高版本. 不要使用带 <code>native-mt</code> 后缀的版本.
        </p>
        <p>
            关于新内存管理器, 还有一些需要注意的问题:
        </p>
        <list>
            <li>所有的基本元素(通道(Channel), 数据流(Flow), 协程(Coroutine)) 都可以跨越 Worker 边界工作, 因为不再需要冻结.</li>
            <li><code>Dispatchers.Default</code> 在 Linux 和 Windows 上通过 Worker 池来实现, 在 Apple 目标平台上则通过全局队列来实现.</li>
            <li>可以使用 <code>newSingleThreadContext</code> 来创建依靠单个 Worker 实现的协程派发器.</li>
            <li>可以使用 <code>newFixedThreadPoolContext</code> 来创建依靠 <code>N</code> 个 Worker 的池实现的协程派发器.</li>
            <li><code>Dispatchers.Main</code> 在 Darwin 上依靠主队列实现, 在其它平台依靠独立的 Worker 来实现.</li>
        </list>
    </def>
    <def title="Ktor">
        更新到 2.0 或更高版本.
    </def>
    <def title="其他依赖项">
        <p>
            大多数库应该能够平滑升级, 但可能存在少量例外.
        </p>
        <p>
            请确认你的依赖项更新到了最新版本, 针对旧的和新的内存管理器的库版本没有差别.
        </p>
    </def>
</deflist>

## 更新你的代码 {id="update-your-code"}

要支持新的内存管理器, 请删除对受影响的 API 的调用:

| 旧 API                                                                                                                                   | 应该如何更新                                                                                                                   |
|-----------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                          | 你可以删除所有使用它的代码, 尽管在新的内存管理器中使用这个 API 也没有警告.                                                                                |
| [`FreezableAtomicReference` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | 请改为使用 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/).     |
| [`FreezingException` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | 删除所有使用它的代码.                                                                                                              |                                                                                                      |
| [`InvalidMutabilityException` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | 删除所有使用它的代码.                                                                                                              |
| [`IncorrectDereferenceException` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | 删除所有使用它的代码.                                                                                                              |
| [`freeze()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                      | 删除所有使用它的代码.                                                                                                              |
| [`isFrozen` 属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                   | 你可以删除所有使用它的代码. 由于冻结功能已被废弃, 这个属性永远返回 `false`.                                                                             |
| [`ensureNeverFrozen()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)              | 删除所有使用它的代码.                                                                                                              |
| [`atomicLazy()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                             | 请改为使用 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html).                                         |
| [`MutableData` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | 请改为使用通常的集合.                                                                                                              |
| [`WorkerBoundReference<out T : Any>` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | 请直接使用 `T`.                                                                                                               |
| [`DetachedObjectGraph<T>` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | 请直接使用 `T`. 要通过 C 代码交互传递值, 请使用 [StableRef 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/). |

## 下一步做什么 {id="what-s-next"}

* [关于新的内存管理器的更多信息](native-memory-manager.md)
* [了解与 Swift/Objective-C ARC 的集成的细节](native-arc-integration.md)
