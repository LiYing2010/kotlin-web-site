[//]: # (title: Kotlin/Native 内存管理)

Kotlin/Native 使用一个现代化的内存管理器, 类似于 JVM, Go, 以及其它主流技术, 包括以下功能:

* 对象存储在共享的堆(heap)中, 可以在任何线程中访问.
* 定期执行追踪垃圾收集器(Tracing Garbage Collection), 回收那些从 "根(roots)" 无法到达的对象, 比如局部变量, 全局变量.

## 垃圾收集器

Kotlin/Native 的垃圾收集 (Garbage Collector, GC) 算法一直在持续演进.
目前使用的算法是 Stop-the-World Mark 和 Concurrent Sweep 收集器,
它不会把堆(heap)分为不同的代(generation).

GC 在单独的线程中执行, 根据内存压力启动, 或由定时器启动.
或者, 它也可以 [手动调用](#enable-garbage-collection-manually).

GC 并行处理多个线程中的标记队列, 包括应用程序线程, GC 线程, 以及可选的标记线程(Marker Thread).
应用程序线程, 以及至少一个 GC 线程, 共同参与标记过程.
默认情况下, 当 GC 正在标记堆(heap)中的对象时, 应用程序线程必须暂停.

> 你可以使用 `kotlin.native.binary.gcMarkSingleThreaded=true` 编译选项, 禁用标记阶段的并行处理.
> 但是, 这样做可能会增加垃圾收集器在大 heap 上的暂停时间.
>
{style="tip"} 

当标记阶段完成时, GC 会处理弱引用(Weak Reference), 并将指向未标记对象的引用(Unmarked Object)设置为 null.
默认情况下, 会并行的处理弱引用, 以减少 GC 的暂停时间.

详情参见, 如何 [监测](#monitor-gc-performance) 和 [优化](#optimize-gc-performance) 垃圾收集.

### 手动启动垃圾收集 {id="enable-garbage-collection-manually"}

要强制启动垃圾收集器, 可以调用 `kotlin.native.internal.GC.collect()`. 这个方法会触发一次新的垃圾收集, 并等待它结束.

### 监测 GC 性能 {id="monitor-gc-performance"}

要监测 GC 性能, 你可以查看它的 log 来进行问题诊断.
要启用 log, 请在你的 Gradle 构建脚本中设置以下编译选项:

```none
-Xruntime-logs=gc=info
```

目前, log 只会被输出到 `stderr`.

在 Apple 平台上, 你可以利用 Xcode Instruments 工具包来调试 iOS App 的性能.
垃圾收集器会使用 Instruments 中的 signpost 来报告暂停.
Signpost 允许在你的 App 中自定义 log, 因此你可以检查应用程序失去响应是不是由于 GC 暂停导致的.

要在你的 App 中追踪 GC 造成的暂停:

1. 要启动这个功能, 请在你的 `gradle.properties` 文件中设置以下编译选项:

   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. 打开 Xcode, 选择 **Product** | **Profile**, 或者按快捷键 <shortcut>Cmd + I</shortcut>.
   这个操作会编译你的 App, 并启动 Instruments.
3. 在模板选择项中, 选择 **os_signpost**.
4. 输入配置, 将 `org.kotlinlang.native.runtime` 指定为 **subsystem**, `safepoint` 指定为 **category**.
5. 点击红色的记录按钮, 运行你的 App, 并开始记录 signpost 事件:

   ![使用 signpost 追踪 GC 暂停](native-gc-signposts.png){width=700}

   这里, 最下方图表上的每个蓝色斑点表示一个 signpost 事件, 也就是一个 GC 暂停.

### 优化 GC 性能 {id="optimize-gc-performance"}

要改善 GC 性能, 你可以启用并行的标记处理来减少 GC 暂停时间.
这样可以让垃圾收集的标记阶段与应用程序的线程同时运行.

这个功能目前是 [实验性功能](components-stability.md#stability-levels-explained).
要启用这个功能, 请在你的 `gradle.properties` 文件中设置以下编译选项:

```none
kotlin.native.binary.gc=cms
```

### 禁用垃圾收集

我们推荐启用 GC. 但是, 某些情况下你也可以禁用它, 例如, 为了测试目的, 或者你遇到问题, 而且程序的生存周期很短.
要禁用 GC, 请在你的 Gradle 构建脚本中设置以下编译选项:

```none
-Xgc=noop
```

> 使用这个选项后, GC 不会收集 Kotlin 对象, 因此只要程序继续运行, 内存消耗就会持续上升.
> 请注意, 不要耗尽系统内存.
>
{style="warning"}

## 内存消耗

Kotlin/Native 使用它自己的 [内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md).
它将系统内存分为多个页面(Page), 允许按连续的顺序进行独立的清理.
每次分配的内存都会成为一个页面(Page)内的内存块(Memory Block), 并且页面会追踪各个块的大小.
各种不同的页面类型进行了不同的优化, 以适应于不同的内存分配大小.
内存块的连续排列保证了可以对所有的分配块进行高效的迭代.

当一个线程分配内存时, 它会根据分配的大小搜索适当的页面.
线程会根据不同的大小类别维护一组页面.
对于一个确定的大小, 当前页通常可以容纳这个内存分配.
如果不能, 那么线程会从共享的分配空间请求一个不同的页面.
这个页面的状态可能是可用, 需要清理, 或需要创建.

Kotlin/Native 内存分配器有一种保护功能, 可以防止突然激增的内存分配请求.
它可以防止转换器(Mutator)迅速的分配大量垃圾, 以至于 GC 线程无法处理, 导致内存使用量无限的增长.
在这种情况下, GC 会强制进入 Stop-the-World 阶段, 直到完成迭代.

你可以自己监控内存消耗, 检查内存泄漏, 并调整内存消耗.

### 检查内存泄露

要访问内存管理器的统计信息, 可以调用 `kotlin.native.internal.GC.lastGCInfo()`.
这个方法返回垃圾收集器最后一次运行的统计信息.
统计信息可以用于:

* 调试使用全局变量时的内存泄漏
* 在运行测试时检查是否存在内存泄漏

```kotlin
import kotlin.native.internal.*
import kotlin.test.*

class Resource

val global = mutableListOf<Resource>()

@OptIn(ExperimentalStdlibApi::class)
fun getUsage(): Long {
    GC.collect()
    return GC.lastGCInfo!!.memoryUsageAfter["heap"]!!.totalObjectsSizeBytes
}

fun run() {
    global.add(Resource())
    // 如果删除下面这行, 测试将会失败
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // 这里使用一个单独的函数, 确保所有的临时对象都被清除
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

### 调整内存消耗

如果程序中不存在内存泄露, 但你仍然观察到异常高的内存消耗, 请尝试将 Kotlin 更新到最新版本.
我们一直在持续改进内存管理器, 因此即使只是一次简单的编译器更新, 也可能改善你的程序的内存消耗情况.

更新 Kotlin 版本后, 如果您还是遇到内存消耗过高的情况, 可以选择以下几种解决方法:

* 在你的 Gradle 构建脚本中使用以下编译选项之一, 切换到不同的内存分配器:

  * `-Xallocator=std`, 使用系统的内存分配器.
  * `-Xallocator=mimalloc`, 使用 [mimalloc](https://github.com/microsoft/mimalloc) 内存分配器.

* 如果你使用 mimalloc 内存分配器, 你可以命令它及时将内存释放回系统.
  具体做法是, 在你的 `gradle.properties` 文件中启用以下二进制文件选项:

  ```none
  kotlin.native.binary.mimallocUseCompaction=true
  ```

  这样的性能损失比较小, 但与系统的内存分配器相比, 它的结果比较不确定.

如果以上方法都不能改善内存消耗问题, 请到 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 报告问题.

## 在后台进行单元测试

在单元测试中, 不会处理主线程队列, 因此, 除非 mock 过 `Dispatchers.Main`, 否则不要使用它.
mock 它的方法是, 调用 `kotlinx-coroutines-test` 中的 `Dispatchers.setMain`.

如果你没有依赖于 `kotlinx.coroutines`, 或者因为某些原因 `Dispatchers.setMain` 不适合你的需求,
请使用以下变通方法, 实现测试启动器(test launcher):

```kotlin
package testlauncher

import platform.CoreFoundation.*
import kotlin.native.concurrent.*
import kotlin.native.internal.test.*
import kotlin.system.*

fun mainBackground(args: Array<String>) {
    val worker = Worker.start(name = "main-background")
    worker.execute(TransferMode.SAFE, { args.freeze() }) {
        val result = testLauncherEntryPoint(it)
        exitProcess(result)
    }
    CFRunLoopRun()
    error("CFRunLoopRun should never return")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

然后, 使用 `-e testlauncher.mainBackground` 编译器选项来编译测试程序的二进制文件.

## 下一步

* [从旧的内存管理器迁移](native-migration-guide.md)
* [学习如何与 Swift/Objective-C ARC 集成](native-arc-integration.md)
