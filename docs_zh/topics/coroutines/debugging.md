[//]: # (title: 调试协程)

**目录**

<!--- TOC -->

* [调试协程](#debugging-coroutines)
* [调试模式](#debug-mode)
* [栈追踪(Stacktrace)恢复](#stacktrace-recovery)
  * [栈追踪恢复的机制](#stacktrace-recovery-machinery)
* [调试代理](#debug-agent)
* [Android 优化](#android-optimization)

<!--- END -->

## 调试协程 {id="debugging-coroutines"}

调试异步程序是很困难的, 因为通常会有多个并发协程同时在工作.
为了解决这个问题, `kotlinx.coroutines` 提供了额外的调试功能: 调试模式, 栈追踪(Stacktrace)恢复, 以及调试代理.

## 调试模式 {id="debug-mode"}

`kotlinx.coroutines` 的第一个调试功能是调试模式.
这个功能可以设置系统属性 [DEBUG_PROPERTY_NAME] 来启用, 或者启用断言运行 Java (使用 `-ea` 标志) 来启用.
后一种方式能够在单元测试中默认启用调试模式.

调试模式会为每个启动的协程附加一个唯一的 [名称][CoroutineName].
协程名称可以在通常的 Java 调试器中看到,
也可以在协程的字符串表示中, 或者在执行命名协程的线程名称中看到.
这个功能的开销可以忽略不计, 可以安全地默认启用, 以简化日志记录和诊断.

## 栈追踪(Stacktrace)恢复 {id="stacktrace-recovery"}

栈追踪(Stacktrace)恢复是调试模式的另一个有用功能. 这个功能在调试模式下默认启用,
但可以将系统属性 `kotlinx.coroutines.stacktrace.recovery` 设置为 `false`, 来单独禁用这个功能.

栈追踪恢复会通过复制的方式, 尝试将异步异常的栈追踪与接收者的栈追踪拼接在一起,
不仅提供异常抛出的位置信息, 还提供异常被异步重新抛出或捕获的位置信息.

可以运行同一个程序, 查看它在 `main` 函数中等待异步操作时的实际的栈追踪, 来演示这个功能
(可运行的代码在 [这里](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-debug/test/RecoveryExample.kt)):

| 没有栈追踪恢复                 | 有栈追踪恢复                |
|--------------------------------|-----------------------------|
| ![before](before.png "before") | ![after](after.png "after") |

这种方式唯一的缺点, 是失去了异常的引用透明性.

> 注意, 被压制的异常不会被复制, 在 cause 中保持原样,
> 以防止异常链中发生循环, 出现难以理解的 `[CIRCULAR REFERENCE]` 消息,
> 甚至在某些框架中导致 [崩溃](https://jira.qos.ch/browse/LOGBACK-1027)

### 栈追踪恢复的机制 {id="stacktrace-recovery-machinery"}

本节解释栈追踪恢复的内部机制, 可以跳过.

当异常在协程之间重新抛出时 (例如, 穿过 `withContext` 或 `Deferred.await` 边界),
栈追踪恢复机制会尝试创建原始异常的副本 (以原始异常作为 cause), 然后使用协程相关的栈帧(Stack Frame),
重写副本的栈追踪 (使用 [Throwable.setStackTrace](https://docs.oracle.com/javase/9/docs/api/java/lang/Throwable.html#setStackTrace-java.lang.StackTraceElement:A-)),
然后抛出结果异常, 而不是原始异常.

异常复制逻辑很简单:
  1) 如果异常类实现了 [CopyableThrowable], 则使用 [CopyableThrowable.createCopy].
     `createCopy` 可以返回 `null`, 这样可以选择性退出特定异常的恢复.
  2) 如果异常类有特定于类的字段, 不是从 Throwable 继承得到, 则异常不复制.
  3) 否则, 通过反射调用异常的某个 public 构造函数, 并选择性的调用 `initCause`.
  4) 如果反射创建的副本的消息发生了变化 (异常构造函数将修改后的 `message` 参数传递给了父类),
     则不复制异常, 以保留人类可读的消息.
     [CopyableThrowable] 没有这种限制, 允许副本的 `message` 与原始异常不同.

## 调试代理 {id="debug-agent"}

[kotlinx-coroutines-debug](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-debug)
模块提供了 `kotlinx.coroutines` 中最强大的调试功能之一.

这是一个带有 JVM 代理的单独模块, 这个 JVM 代理追踪所有活跃的协程, 对它们进行内省(introspect)和转储, 与线程转储(thread dump)命令类似,
并且还增强了栈追踪, 添加了协程创建位置的信息.

关于如何使用调试代理的完整教程, 请参见相应的 [readme](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-debug/README.md).

<!---
Make an exception googlable
java.lang.NoClassDefFoundError: Failed resolution of: Ljava/lang/management/ManagementFactory;
        at kotlinx.coroutines.repackaged.net.bytebuddy.agent.ByteBuddyAgent$ProcessProvider$ForCurrentVm$ForLegacyVm.resolve(ByteBuddyAgent.java:1055)
        at kotlinx.coroutines.repackaged.net.bytebuddy.agent.ByteBuddyAgent$ProcessProvider$ForCurrentVm.resolve(ByteBuddyAgent.java:1038)
        at kotlinx.coroutines.repackaged.net.bytebuddy.agent.ByteBuddyAgent.install(ByteBuddyAgent.java:374)
        at kotlinx.coroutines.repackaged.net.bytebuddy.agent.ByteBuddyAgent.install(ByteBuddyAgent.java:342)
        at kotlinx.coroutines.repackaged.net.bytebuddy.agent.ByteBuddyAgent.install(ByteBuddyAgent.java:328)
        at kotlinx.coroutines.debug.internal.DebugProbesImpl.install(DebugProbesImpl.kt:39)
        at kotlinx.coroutines.debug.DebugProbes.install(DebugProbes.kt:49)
-->

## Android 优化 {id="android-optimization"}

在使用 R8 版本 1.6.0 或更高版本的优化 (Release) 构建中,
[调试模式](#debug-mode) 和
[栈追踪恢复](#stacktrace-recovery)
都会被永久关闭.
详情请参见 [Android 的"优化"章节](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/kotlinx-coroutines-android/README.md#optimization).

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines -->

[DEBUG_PROPERTY_NAME]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-d-e-b-u-g_-p-r-o-p-e-r-t-y_-n-a-m-e.html
[CoroutineName]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/index.html
[CopyableThrowable]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-throwable/index.html
[CopyableThrowable.createCopy]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-throwable/create-copy.html

<!--- MODULE kotlinx-coroutines-debug -->
<!--- END -->
