[//]: # (title: 与 Swift/Objective-C ARC 集成)

Kotlin 与 Objective-C 使用不同的内存管理方案. Kotlin 使用跟踪垃圾收集器,
Objective-C 则使用自动引用计数(Automatic Reference Counting, ARC).

这两种方案之间通常可以无缝集成, 不需要额外的工作.
但是, 仍然有一些问题需要注意:

## 线程

### 销毁器(Deinitializer)

如果 Swift/Objective-C 对象和它们引用的对象, 在主线程中传递给 Kotlin/Native 代码,
那么对这些对象的销毁处理, 会在主线程中调用, 例如:

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
deinit on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
```

下面的情况下, Swift/Objective-C 对象的销毁处理会在一个特殊的 GC 线程中调用, 而不是在主线程中:

* Swift/Objective-C 对象在主线程之外的线程中传递给 Kotlin 代码.
* 主派发队列(main dispatch queue) 没有被处理.

如果你想要明确的在特殊的 GC 线程中调用销毁处理,
请在你的 `gradle.properties` 文件中设置 `kotlin.native.binary.objcDisposeOnMain=false`.
这个选项会允许在特殊的 GC 线程中调用销毁处理,
即使 Swift/Objective-C 对象在主线程中传递给 Kotlin 也是如此.

一个特殊的 GC 线程会与 Objective-C 运行库一起编译, 也就是说它拥有一个运行循环(run loop),
以及空的自动释放池(drain autorelease pool).

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

在 [GC 日志](native-memory-manager.md#monitor-gc-performance) 中, 有根对象集中稳定引用的数量.
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

### 循环引用

在 _循环引用_ 中, 多个对象使用强引用相互引用, 形成引用的循环:

![循环引用](native-retain-cycle.png){height=200}

Kotlin 的追踪 GC 和 Objective-C 的 ARC 使用不同的方式处理循环引用.
当对象不可到达时, Kotlin 的 GC 能够正确的回收这样的循环引用, 而 Objective-C 的 ARC 则不能.
因此, Kotlin 对象的循环引用能够被回收,
而 [Swift/Objective-C 对象的循环引用无法被回收](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Strong-Reference-Cycles-Between-Class-Instances).

考虑这样的情况, 如果一个循环引用同时包含 Objective-C 和 Kotlin 对象:

![Retain cycles with Objective-C and Kotlin objects](native-objc-kotlin-retain-cycles.png){height=150}

这就牵涉到将 Kotlin 和 Objective-C 的内存管理模型组合到一起, 而 Objective-C 不能处理 (回收) 循环引用.
也就是说, 只要出现了一个 Objective-C 对象, 整个对象图的循环引用都将无法回收, 而且不可能从 Kotlin 端打破这个循环引用.

不幸的是, 在 Kotlin/Native 的代码中, 目前没有专门的手段能够自动检测循环引用.
为了避免循环引用, 请使用 [弱引用(weak reference)或无主引用(unowned reference)](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/#Resolving-Strong-Reference-Cycles-Between-Class-Instances).

## 支持后台状态和 App 扩展

目前的内存管理器默认不追踪应用程序状态, 而且没有集成 [App 扩展](https://developer.apple.com/app-extensions/).

因此, 内存管理器不会相应的调整 GC 行为, 有些情况下可能造成问题.
要改变这个行为, 请向你的 `gradle.properties` 添加下面的 [实验性](components-stability.md) 二进制选项:

```none
kotlin.native.binary.appStateTracking=enabled
```

这个选项会在应用程序处于后台状态时关闭对垃圾收集器的定时调用, 因此只有当内存消耗量过高时才会调用 GC.

## 下一步做什么?

了解 [与 Swift/Objective-C 交互](native-objc-interop.md).
