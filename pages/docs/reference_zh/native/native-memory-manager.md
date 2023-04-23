---
type: doc
layout: reference
category: "Native"
title: "Kotlin/Native 内存管理"
---

# Kotlin/Native 内存管理

最终更新: {{ site.data.releases.latestDocDate }}

> 本章描述的是新内存管理器的功能特性, 这个新内存管理器从 Kotlin 1.7.20 开始默认使用.
> 如果要将你的项目从旧内存管理器迁移到新内存管理器, 请参见我们的 [迁移指南](native-migration-guide.html).
{:.note}

Kotlin/Native 使用一个现代化的内存管理器, 类似于 JVM, Go, 以及其它主流技术:
* 对象存储在共享的堆(heap)中, 可以在任何线程中访问.
* 定期执行追踪垃圾收集器(Garbage Collector, GC), 回收那些从 "根(roots)" 无法到达的对象, 比如局部变量, 全局变量.

内存管理器对 Kotlin/Native 的所有目标平台都是相同的, wasm32 除外, 只有 [旧的内存管理器](#legacy-memory-manager) 支持这个目标平台.

## 垃圾收集器

GC 的具体算法一直在持续演进. 对于 1.7.20, 使用的算法是 Stop-the-World Mark 和 Concurrent Sweep 收集器,
它不会把堆(heap)分为不同的代(generation).

GC 在单独的线程中执行, 由定时器和内存压力来启动, 或者也可以 [手动调用](#enable-garbage-collection-manually).

### 手动启动垃圾收集

要强制启动垃圾收集器, 可以调用 `kotlin.native.internal.GC.collect()`. 这个函数会触发一个新的垃圾收集, 并等待它结束.

### 监测 GC 性能

目前还没有专门的指标来监测 GC 性能. 但是, 还是可以查看 GC log 来进行诊断分析.
要启用 log, 请在 Gradle 构建脚本中设置以下编译选项:

```none
-Xruntime-logs=gc=info
```

目前, log 只会被输出到 `stderr`.

### 禁用垃圾收集

我们推荐启用 GC. 但是, 某些情况下你也可以禁用它, 例如, 为了测试目的, 或者你遇到问题, 而且程序的生存周期很短.
要禁用 GC, 请在 Gradle 构建脚本中设置以下编译选项:

```none
-Xgc=noop
```

> 使用这个选项后, GC 不会收集 Kotlin 对象, 因此只要程序继续运行, 内存消耗就会持续上升.
> 请注意, 不要耗尽系统内存.
{:.warning}

## 内存消耗

如果程序中不存在内存泄露, 但你仍然观察到异常高的内存消耗, 请尝试将 Kotlin 更新到最新版本.
我们一直在持续改进内存管理器, 因此即使只是一次简单的编译器更新, 也可能改善你的程序的内存消耗情况.  

解决高内存消耗问题的另一种方式与 [`mimalloc`](https://github.com/microsoft/mimalloc) 有关, 它是很多目标平台的默认的内存分配器.
它会预先分配并保持住系统内存, 以便提高内存分配的速度.

要避免这种方式造成的内存消耗, (代价是损失性能), 有以下几种方法:
* 将内存分配器从 `mimalloc` 切换到系统的分配器. 具体做法是, 在你的 Gradle 构建脚本中设置 `-Xallocator=std` 编译选项.
* 从 Kotlin 1.8.0-Beta 开始, 你也可以指示 `mimalloc` 及时将内存释放回系统. 这样的性能损失比较小, 但结果比较不确定.

  具体做法是, 在你的 `gradle.properties` 文件中启用以下二进制文件选项:

  ```none
  kotlin.native.binary.mimallocUseCompaction=true
  ```

如果以上方法都不能改善内存消耗问题, 请到 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 报告问题.

## 在后台进行单元测试

在单元测试中, 不会处理主线程队列, 因此不要使用 `Dispatchers.Main`,
除非有对它设置 mock, 具体方法是调用 `kotlinx-coroutines-test` 中的 `Dispatchers.setMain`.

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

然后, 使用 `-e testlauncher.mainBackground` 编译器选项来编译测试程序的二进制文件.

## 旧的内存管理器

如果有必要, 你可以切换回旧的内存管理器. 方法是在你的 `gradle.properties` 文件中设置以下选项:

```none
kotlin.native.binary.memoryModel=strict
```

> * 对旧的内存管理器, 不能使用编译器缓存功能, 因此编译时间可能变慢.
> * 这个 Gradle 选项用于回退到旧的内存管理器, 在未来的发布版本中会被删除.
{:.note}

如果你从旧的内存管理器迁移时遇到问题, 或者你希望临时性的同时支持当前的和旧的内存管理器,
请参见 [迁移指南](native-migration-guide.html) 中我们的建议.

## 下一步

* [从旧的内存管理器迁移](native-migration-guide.html)
* [与 iOS 集成的配置](native-ios-integration.html)
