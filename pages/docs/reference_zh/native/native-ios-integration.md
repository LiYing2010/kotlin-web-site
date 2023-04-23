---
type: doc
layout: reference
category: "Native"
title: "与 iOS 集成"
---

# 与 iOS 集成

最终更新: {{ site.data.releases.latestDocDate }}

> 本章介绍的是从 Kotlin 1.7.20 开始默认启用的新内存管理器.
> 要将你的项目从旧内存管理器迁移到新内存管理器, 请参见我们的 [迁移指南](native-migration-guide.html).
{:.note}

Kotlin/Native 垃圾收集器能够与 Swift/Objective-C ARC 无缝集成, 通常不需要额外的工作.
详情请参见 [与 Swift/Objective-C 代码交互](native-objc-interop.html).

但是, 仍然有一些问题需要注意:

## 线程

### 销毁器(Deinitializer)

如果 Swift/Objective-C 对象和它们引用的对象, 跨越了代码交互的边界, 进入到 Kotlin/Native 中,
那么对这些对象的销毁处理, 会在另一个线程中调用, 例如:

```kotlin
// Kotlin
class KotlinExample {
   fun action(arg: Any) {
      println(arg)
   }
}
```

```swift
// Swift
class SwiftExample {
   init() {
      print("init on \(Thread.current)")
   }

   deinit {
      print("deinit on \(Thread.current)")
   }
}

func test() {
   KotlinExample().action(arg: SwiftExample())
}
```

输出结果如下:

```text
init on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
shared.SwiftExample
deinit on <NSThread: 0x600003b9b900>{number = 7, name = (null)}
```

### 事件完成处理器(Completion handler)

从 Swift 中调用 Kotlin 挂起函数时, 事件完成处理器可能会在主线程之外的其它线程中调用, 例如:

```kotlin
// Kotlin
// coroutineScope, launch, 和 delay 都是 kotlinx.coroutines 中的函数
suspend fun asyncFunctionExample() = coroutineScope {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
```

```swift
// Swift
func test() {
    print("Running test on \(Thread.current)")
    PlatformKt.asyncFunctionExample(completionHandler: { _ in
        print("Running completion handler on \(Thread.current)")
    })
}
```

输出结果如下:

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

### 调用 Kotlin 挂起函数

如果从 Swift 和 Objective-C 的主线程以外的其它线程来调用 Kotlin 挂起函数, Kotlin/Native 内存管理器对于这样的情况存在限制.

这个限制最初是在旧的内存管理器出现的, 针对的是, 代码将挂起后的协程派发到原来的线程上恢复运行.
如果这个线程并没有支持的事件循环, 那么任务将无法运行, 因此协程永远无法恢复.

某些情况下, 不再需要这样的限制. 你可以在你的 `gradle.properties` 文件添加以下选项, 删除这个限制:

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

## 垃圾收集与生存周期

### 对象回收

只有在垃圾收集期间对象才会被回收. 这个规则适用于跨越代码交互边界, 进入 Kotlin/Native 的 Swift/Objective-C 对象, 例如:

```kotlin
// Kotlin
class KotlinExample {
    fun action(arg: Any) {
        println(arg)
    }
}
```

```swift
// Swift
class SwiftExample {
    deinit {
        print("SwiftExample deinit")
    }
}

func test() {
    swiftTest()
    kotlinTest()
}

func swiftTest() {
    print(SwiftExample())
    print("swiftTestFinished")
}

func kotlinTest() {
    KotlinExample().action(arg: SwiftExample())
    print("kotlinTest finished")
}
```

输出结果如下:

```text
shared.SwiftExample
SwiftExample deinit
swiftTestFinished
shared.SwiftExample
kotlinTest finished
SwiftExample deinit
```

### Objective-C 对象生存周期

Objective-C 对象实际存在的时间可能比它应该存在的时间更长, 有时可能导致性能问题.
例如, 一个长时间运行的循环, 在每次循环时创建几个临时对象, 这些对象跨越 Swift/Objective-C 代码交互边界.

在 [GC 日志](native-memory-manager.html#monitor-gc-performance) 中, 有根对象集中稳定引用的数量.
如果这个数量持续增加, 可能代表 Swift/Objective-C 对象在需要释放的时候, 实际上没有被释放.
这种情况下, 请在执行代码交互调用的循环体外部, 使用 `autoreleasepool` 代码段:

```kotlin
// Kotlin
fun growingMemoryUsage() {
    repeat(Int.MAX_VALUE) {
        NSLog("$it\n")
    }
}

fun steadyMemoryUsage() {
    repeat(Int.MAX_VALUE) {
        autoreleasepool {
            NSLog("$it\n")
        }
    }
}
```

### Swift 与 Kotlin 对象链的垃圾收集

我们来看看下面的例子:

```kotlin
// Kotlin
interface Storage {
    fun store(arg: Any)
}

class KotlinStorage(var field: Any? = null) : Storage {
    override fun store(arg: Any) {
        field = arg
    }
}

class KotlinExample {
    fun action(firstSwiftStorage: Storage, secondSwiftStorage: Storage) {
	// 这里, 我们创建下面的对象链:
	// firstKotlinStorage -> firstSwiftStorage -> secondKotlinStorage -> secondSwiftStorage.
        val firstKotlinStorage = KotlinStorage()
        firstKotlinStorage.store(firstSwiftStorage)
        val secondKotlinStorage = KotlinStorage()
        firstSwiftStorage.store(secondKotlinStorage)
        secondKotlinStorage.store(secondSwiftStorage)
    }
}
```

```swift
// Swift
class SwiftStorage : Storage {

    let name: String

    var field: Any? = nil

    init(_ name: String) {
        self.name = name
    }

    func store(arg: Any) {
        field = arg
    }

    deinit {
        print("deinit SwiftStorage \(name)")
    }
}

func test() {
    KotlinExample().action(
        firstSwiftStorage: SwiftStorage("first"),
        secondSwiftStorage: SwiftStorage("second")
    )
}
```

在 log 中输出 "deinit SwiftStorage first" 和 "deinit SwiftStorage second" 消息之间, 会存在一些间隔时间.
原因是, `firstKotlinStorage` 和 `secondKotlinStorage` 会被不同的 GC 周期回收.
事件序列如下:

1. `KotlinExample.action` 结束.
    `firstKotlinStorage` 被认为处于 "dead" 状态, 因为没有任何对象引用它,
    而 `secondKotlinStorage` 还不是 "dead" 状态, 因为它被 `firstSwiftStorage` 引用.
2. 第 1 次 GC 周期开始, `firstKotlinStorage` 被回收.
3. 没有对象引用 `firstSwiftStorage`, 因此它也处于 "dead" 状态, 并且调用它的 `deinit`.
4. 第 2 次 GC 周期开始. `secondKotlinStorage` 被回收, 因为 `firstSwiftStorage` 不再引用它.
5. 最后, `secondSwiftStorage` 被回收.

需要 2 次 GC 周期才能回收这 4 个对象, 因为 Swift 和 Objective-C 对象的销毁过程发生在 GC 周期之后.
这个限制是由于 `deinit` 造成的, 它可以调用任意的代码, 包括在 GC 造成的应用程序暂停时期无法运行的 Kotlin 代码.

## 支持后台状态和 App 扩展

目前的内存管理器默认不追踪应用程序状态, 而且没有集成 [App 扩展](https://developer.apple.com/app-extensions/).

因此, 内存管理器不会相应的调整 GC 行为, 有些情况下可能造成问题.
要改变这个行为, 请向你的 `gradle.properties` 添加下面的 [实验性](components-stability.html) 二进制选项:

```none
kotlin.native.binary.appStateTracking=enabled
```

这个选项会在应用程序处于后台状态时关闭对垃圾收集器的定时调用, 因此只有当内存消耗量过高时才会调用 GC.
