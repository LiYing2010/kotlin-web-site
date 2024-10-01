[//]: # (title: Kotlin/Native 中的并发)

最终更新: %latestDocDate%

Kotlin/Native 平台不鼓励使用经典的面向线程的并发模型, 包括互斥代码段, 以及有条件的变量,
因为这种模型易于出错, 可靠性差.
相反, 我们建议使用一组替代方案, 可以帮助你使用硬件并发, 并实现阻塞式 IO.
这些方案如下, 我们会在后面的章节中进行详细的介绍:

* 使用消息传递的 Worker
* 对象子图(Object subgraph) 的所有权转换(ownership transfer)
* 对象子图的冻结(freezing)
* 对象子图的分离(detachment)
* 使用 C 全局变量的原生共享内存(Raw shared memory)
* 基本数据类型的原子化封装(Atomic primitive) 和原子化引用(Atomic Reference)
* 用于阻塞操作的协程 (本文档不作介绍)

## Worker

Kotlin/Native 平台不鼓励使用线程, 而是提供了工作者(Worker)的概念: 与请求队列相关联, 并且并发执行的一系列控制流.
Worker 与 Actor 模型中的 actor 非常类似.
一个 worker 可以与另一个 worker 交换 Kotlin 对象,
因此任何一个时刻, 每个可变对象都只属于唯一的一个 worker, 但这种所有权可以转换.
详情请参见 [对象传输(transfer)与冻结(freezing)](#transfer).

通过 `Worker.start` 函数调用启动一个 worker 之后, 可以通过它的唯一整数 worker id 来追踪它.
其他 worker, 或者非 worker 的并发元素, 比如 OS 线程, 可以使用 `execute` 函数调用来向它发送消息.

```kotlin
val future = execute(TransferMode.SAFE, { SomeDataForWorker() }) {
   // 第 2 个函数参数所返回的数据, 会被传入到 worker 程序内, 成为 'input' 参数
   input ->
   // 这里我们创建一个实例, 当某个外面的某段代码消费 worker 的结果值时, 就会返回这个实例.
   WorkerResult(input.stringParam + " result")
}

future.consume {
  // 在这里我们会看到上面的 worker 程序返回的结果.
  // 注意, future 对象或 id 可以被传输给另一个 worker,
  // 因此我们并不需要在得到这个 future 的同一个执行上下文内消费它.
  result -> println("result is $result")
}
```

调用 `execute` 时使用一个函数作为第 2 个参数, 这个函数负责生产一个对象子图(object subgraph)
(也就是, 一组可变的引用对象),
这个对象子图再被整体传递给 worker, 然后, 在启动这个请求的线程内它就不再能够访问了.
如果第 1 个参数是 `TransferMode.SAFE`, 那么会在访问对象子图时检查这个属性,
如果第 1 个参数是 `TransferMode.UNSAFE`, 那么会假定这个属性为 true.
`execute` 的最后一个参数是一个特殊的 Kotlin Lambda 表达式,
它不允许捕捉任何状态数据, 而且会在目标 worker 的上下文中调用它.
一旦处理完毕, 结果就会被传输给某个未来的消费者, 它会被绑定在这个 worker/线程 的对象图上.

如果使用 `UNSAFE` 模式来传输对象, 而且还可以在多个并发执行器中访问到它,
那么程序可能会意外崩溃, 因此这种方式只能作为程序优化时的最终手段, 而不要用作通常的编程机制.

关于更完整的示例程序, 请参见 Kotlin/Native 代码仓库中的
[worker 示例程序](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/samples/workers).

## 对象传输(transfer)与冻结(freezing)

Kotlin/Native 平台维持的一个重要的不变性(invariant)机制就是, 对象要么属于单个线程或 worker, 否则它就必须是不可变的
(_要么是共享的不可变对象, 要么是不共享的可变对象_).
这个机制保证同一个数据只可能被单个访问者修改, 因此不需要锁的存在.
为了实现这个不变性(invariant)机制, 我们使用一种概念, 就是不被外界引用的对象子图(object subgraph).
对象子图是指, 不存在来自这个子图外部的引用, 这一点可以使用(在 ARC 系统中)复杂度为 O(N) 的算法进行检查, 其中 N 是子图中元素的个数.
这种子图通常由一个 Lambda 表达式(比如某些构建器)的结果产生, 而且可能也不包含引用到外部对象的对象.

冻结(Freezing) 是一种运行期操作, 使得一个给定的对象子图不可变更,
通过修改对象头(object header), 因此将来试图修改对象将会抛出 `InvalidMutabilityException` 异常.
冻结是一种深度操作, 因此如果一个对象拥有指向其他对象的指针 - 那么由这些对象构成的一个传递性的包, 全部都会被冻结.
冻结是一种单方向的变换, 冻结后的对象不能被解冻.
由于冻结后的对象不可变更, 因此它有一个很好的性质, 它可以在多个 worker/线程之间共享,
而不会破坏 "要么是共享的不可变对象, 要么是不共享的可变对象" 不变性原则.

对象是否被冻结, 可以通过扩展属性 `isFrozen` 来检查, 如果已被冻结, 那么对象的共享是被允许的.
目前, Kotlin/Native 平台只会在创建后冻结枚举对象, 但是将来可能会自动冻结其他确定不可变的对象.

## 对象子图的分离(detachment)

不带外部引用的对象子图可以使用 `DetachedObjectGraph<T>` 来解除连接, 变成一个 `COpaquePointer` 值, 这个值可以保存在 `void*` 数据中,
因此解除连接后的对象子图可以保存到 C 数据结构中, 然后将来在任意的线程或  worker 中, 使用 `DetachedObjectGraph<T>.attach()` 连接回来.
如果对于某个任务 worker 机制还不足以完成任务, 这个功能与 [原生的共享内存(raw memory sharing)](#raw-shared-memory) 结合在一起,
可以实现在并发的线程中传输旁路对象(side channel object).
注意, 对象的分离可能需要函数明确的保持对象引用, 然后执行循环垃圾回收.
比如, 下面这样的代码:

```kotlin
val graph = DetachedObjectGraph {
    val map = mutableMapOf<String, String>()
    for (entry in map.entries) {
        // ...
    }
    map
}
```

不会象期望的那样工作, 而会抛出运行期异常, 因为在分离的对象子图中存在未被回收的对象环,
而以下代码:

```kotlin
val graph = DetachedObjectGraph {
    {
     val map = mutableMapOf<String, String>()
     for (entry in map.entries) {
         // ...
     }
     map
    }().also {
      kotlin.native.internal.GC.collect()
    }
 }
```

能够正常工作, 因为它保持的对象引用会被释放, 然后影响引用计数器的循环垃圾会被回收.

## 原生的共享内存(Raw shared memory)

考虑到 Kotlin/Native 和 C 交互时极强的关联性, 将上文提到的那些机制结合在一起,
可以使用 Kotlin/Native 创建出常用的数据结构, 比如 并发的 hashmap, 或共享的缓存.
这些数据结构可以依赖于共享的 C 数据, 并且将分离后的对象子图的引用保存在 C 数据中.
我们来看看下面的 .def 文件:

```c
package = global

---
typedef struct {
  int version;
  void* kotlinObject;
} SharedData;

SharedData sharedData;
```

运行 cinterop 工具后, 这段代码可以使用一个带版本号的全局数据结构来共享 Kotlin 数据,
使用自动生成的 Kotlin 代码, 可以在 Kotlin 代码中与这段代码透明地互动, 如下:

```kotlin
class SharedData(rawPtr: NativePtr) : CStructVar(rawPtr) {
    var version: Int
    var kotlinObject: COpaquePointer?
}
```

因此, 结合上面声明的顶级变量, 可以用来从不同的线程访问同一块内存,
并使用平台相关的同步机制, 创建出传统的并发数据结构.

## 全局变量与单子(singleton)

很多时候, 全局变量会导致预料之外的并发错误, 因此 _Kotlin/Native_ 实现了以下机制,
来避免预料之外的通过全局对象共享状态数据:

* 全局变量, 除非明确指定, 只能从主线程中访问 (也就是, _Kotlin/Native_ 平台最早初始化的那个线程),
  如果其他线程访问了这样的全局变量, 会抛出 `IncorrectDereferenceException` 异常
* 对标注了 `@kotlin.native.ThreadLocal` 注解的全局变量,
  每个线程都会保存一份本线程内的 copy, 因此线程之间相互不会影响
* 对标注了 `@kotlin.native.SharedImmutable` 注解的全局变量, 会被所有的线程共享,
  但在此之前先会被冻结, 因此所有的线程都会读到相同的值
* 单子对象(singleton object), 如果没有标注 `@kotlin.native.ThreadLocal` 注解, 也会被冻结并共享,
  允许使用延迟初始化的值(lazy value), 除非试图创建循环的冻结结构(cyclic frozen structures)
* 枚举值总是会被冻结

将这些机制结合在一起, 可以在多平台项目(MPP project)中实现跨平台的代码重用, 实现非常自然的无并发竞争(race-free)编程.

## 基本数据类型的原子化封装(Atomic primitive) 和原子化引用(Atomic Reference)

Kotlin/Native 标准库提供了一些基本数据类型, 用于安全的操作并发的可变数据,
这些数据类型在 `kotlin.native.concurrent` 包中,
名为 `AtomicInt`, `AtomicLong`, `AtomicNativePtr`, `AtomicReference` 和 `FreezableAtomicReference`.
这些基本数据类型的原子化封装(Atomic primitive), 可以用来实现安全的并发更新操作,
比如加1, 减1, 以及比较并交换(compare-and-swap)操作,
还提供了值的取得和设置方法.
基本数据类型的原子化封装在运行时总是会被冻结, 尽管其中封装的值可以使用通常的 `field.value += 1` 操作来更新,
但这种操作其实不是并发安全的. 必须使用专门的操作来更新值, 这样它才能实现并发安全的全局计数器, 以及类似的数据结构.

有些算法要求在多个 Worker 之间共享可变的引用, 比如全局的,可变的配置信息,
可以通过属性列表的可变实例来实现, 当配置更新时, 它会自动的在单个事务内(transaction)被整体替换为新版本.
通过这种方式, 使用者不会访问到不一致的配置信息, 而同时又能够根据需要更新配置.
为了实现这样的功能, Kotlin/Native 运行库提供了 2 个相关的类:
`kotlin.native.concurrent.AtomicReference` 和 `kotlin.native.concurrent.FreezableAtomicReference`.
原子化引用(Atomic reference) 保存指向冻结对象或可变对象的引用,
可以通过设值操作, 或比较并交换(compare-and-swap)操作来更新它的值.
因此, 可以使用一组专用的对象, 来创建(不可变对象的)可变的共享对象图.
使用原子化引用可以在共享内存中创建出循环引用的对象.
当通过 `AtomicReference` 或冻结的 `FreezableAtomicReference` 出现循环引用时,
Kotlin/Native 运行库不支持这种循环数据的垃圾回收.
因此, 为了避免内存泄漏, 如果原子化引用可能成为共享的循环数据的一部分, 那么在不需要的时候, 应该将它们清除.

如果试图将原子化引用的值设置为未冻结的值, 会抛出运行时异常.

可冻结的原子化引用与通常的原子化引用类似, 但在冻结之前, 它就好像一个引用的通常的装箱(box).
在冻结之后, 它的行为好像一个原子化引用, 并且只能包含指向冻结对象的引用.
