
---
type: doc
layout: reference
title: "并发(Concurrency)概述"
---

# 并发(Concurrency)概述

最终更新: {{ site.data.releases.latestDocDate }}

> 本章描述的是旧的内存管理器的功能特性.
> 从 Kotlin 1.7.20 开始会默认启用新的内存管理器, 详情请参见 [Kotlin/Native 内存管理](../native/native-memory-manager.html).
{:.note}

当你的开发经验从 Android 扩展到 Kotlin Multiplatform Mobile 时, 你在 iOS 中将会遇到不同的状态和并发模型.
这是一种 Kotlin/Native 模型, 可以将 Kotlin 代码编译为脱离虚拟机运行的原生的二进制, 比如, 能够在 iOS 上运行. 

存在可变的(Mutable)内存变量, 可以同时从多个线程访问, 如果不加限制, 这样是很危险的, 容易导致错误. 
Java, C++, 以及 Swift/Objective-C 等语言, 允许多个线程不加限制的访问同一个状态.
并发问题不象其他编程问题, 通常很难重现. 在本地开发环境中你可能不会遇到问题, 而在真实环境则可能会偶尔发生. 
有时你只能在高负载的真实生产环境才能看到这些问题.

简单的说, 仅仅因为你的测试通过了, 你也不能确定你的代码没有问题.

并不是所有的语言都是这样设计的. JavaScript 直接禁止并发访问同一个状态.
另一种极端是 Rust, 在语言层管理并发和状态, 使得它非常流行. 

## 状态共享的规则 

Kotlin/Native 对于线程之间共享状态引入了一些规则. 存在这些规则是为了防止对可变状态的不安全的共享访问.
如果你来自 JVM 背景, 并编写并发代码, 你可能需要改变数据的组织方式, 但这样做将会实现相同的结果, 而不会产生危险的副作用.

还需要指出, 存在一些 [绕过这些规则的方法](multiplatform-mobile-concurrent-mutability.html). 
目的是为了对于一些罕见的情况, 提供一些绕过这些规则的方法.

对于状态和并发, 只有 2 条简单的规则.

### 规则 1: 可变的状态 == 单线程

如果你的状态是可变的, 那么在同一时刻只有 1 个线程可以 _看见_ 它.
你在 Kotlin 中通常使用的任何类状态都被 Kotlin/Native 运行库认为是 _可变的(Mutable)_.
如果你没有使用并发, Kotlin/Native 的工作会与其他任何 Kotlin 代码相同, 只有 [全局状态](#global-state) 除外.

```kotlin
data class SomeData(var count:Int)

fun simpleState(){
    val sd = SomeData(42)
    sd.count++
    println("My count is ${sd.count}") // 结果将是 43
}
```

如果只有 1 个线程, 你不会存在并发问题.
技术上, 这种情况称为 _线程禁闭(Thread Confinement)_, 意思是说, 你不能在一个后台线程中修改 UI.
Kotlin/Native 的状态规则对所有线程正式提出了这个概念.

### 规则 2: 不可变的状态 == 多线程

如果一个状态不能被修改, 多个线程就可以安全的访问它.
在 Kotlin/Native 中, _不可变(Immutable)_ 不代表所有的变量都是 `val`. 它的意思是 _冻结状态(Frozen State)_.

## 不可变与冻结状态

下面的示例默认是不可变的 – 它有 2 个 `val` 元素, 而且都是不可变的类型.

```kotlin
data class SomeData(val s:String, val i:Int)
```

下面的示例可能是不可变的, 也可能是可变的. 编译时期不能确定 `SomeInterface` 内部会做什么.
在 Kotlin 中, 在编译时期, 不可能静态的确定深层不可变性(Deep Immutability).

```kotlin
data class SomeData(val s:String, val i:SomeInterface)
```

Kotlin/Native 需要验证一个状态的某个部分在运行期确实是不可变的. 运行期可以简单的遍历整个状态, 验证每个部分都是深层不可变的, 但这样很不灵活.
而且如果每次运行期要检查不可变性时, 你都需要进行这样的验证, 会对性能产生严重的影响.

Kotlin/Native 定义一个新的运行期状态, 称为 _冻结(Frozen)_. 一个对象的任何实例都可以冻结. 如果一个对象被冻结, 那么:

1. 你不能改变它的状态的任何部分. 尝试这样做会导致一个运行期异常: `InvalidMutabilityException`.
   一个冻结的对象实例是 100%, 运行期验证过的, 不可变的.
2. 它引用的任何东西也都是冻结的. 它引用到的所有其他对象也会保证被冻结.
   也就是说, 当运行期需要检查一个对象是否可以与其他线程共用, 它只需要检查对象是否被冻结.
   如果是, 那么整个对象引用图也是被冻结的, 可以安全的在线程之间共用.

Native 运行期对所有类添加了一个扩展函数 `freeze()`. 调用 `freeze()` 将会冻结一个对象, 并递归的冻结这个对象引用的所有对象.

```kotlin
data class MoreData(val strData: String, var width: Float)
data class SomeData(val moreData: MoreData, var count: Int)
//...
val sd = SomeData(MoreData("abc", 10.0), 0)
sd.freeze()
```

![冻结状态]({{ url_for('asset', path='docs/images/multiplatform-mobile/freezing-state.animated.gif') }})

* `freeze()` 是一个单向的操作. 你不能 _解冻(Unfreeze)_ 一个对象.
* `freeze()` 不能在共用的 Kotlin 代码中使用, 但有些库为在共用的代码中使用它提供了预期声明和实际声明.
  但是, 如果你使用一个并发库, 比如 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines),
  它很可能会自动冻结那些跨越线程边界的数据. 

`freeze` 并不是 Kotlin 独有的功能.
在 [Ruby](https://www.honeybadger.io/blog/when-to-use-freeze-and-frozen-in-ruby/)
和 [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
中也能找到这个功能.

## 全局状态

Kotlin 允许你将一个状态定义为全局变量. 如果简单的定义为可变的变量, 那么全局状态会违反 [_规则 1_](#rule-1-mutable-state-1-thread).  
为了遵循 Kotlin/Native 的状态规则, 全局状态有一些特殊的条件. 
这些条件会冻结状态, 或使得它只对单个线程可见.

### 全局 `object`

全局 `object` 实例默认会冻结. 也就是说所有线程可以访问它, 但它是不可变的. 以下代码无法工作.

```kotlin
object SomeState{
    var count = 0
    fun add(){
        count++ // 这个操作会抛出一个异常
    }
}
```

试图改变 `count` 将会抛出一个异常, 因为 `SomeState` 是冻结的 (也就是说它的所有数据也是冻结的).

你可以让一个全局对象变成 _线程局部变量(Thread Local)_, 这样将会让它可变, 并为每个线程创建一个它的状态的拷贝. 
请对它标注 `@ThreadLocal` 注解.

```kotlin
@ThreadLocal
object SomeState{
    var count = 0
    fun add(){
        count++ // 👍
    }
}
```

如果不同的线程读取 `count`, 它们会得到不同的值, 因为每个线程都拥有自己的拷贝.

这些全局对象规则也适用于同伴对象(Companion Object).

```kotlin
class SomeState{
    companion object{
        var count = 0
        fun add(){
            count++ // 这个操作会抛出一个异常
        }
    }
}
```

### 全局属性

全局属性是一种特殊情况. *它们只对主线程可见*, 但它们是可变的.
从其他线程访问它们会抛出一个异常.

```kotlin
val hello = "Hello" // 只有主线程可以访问这个属性
```

你可以使用以下注解标注它们:

* `@SharedImmutable`, 这个注解会让它们全局可见, 但被冻结.
* `@ThreadLocal`, 这个注解会为每个线程创建可变的拷贝.

这个规则适用于带有后端域变量(Backing Field)的全局属性. 计算得到的属性, 以及全局函数, 不存在主线程限制.

## 目前和将来的模型

Kotlin/Native 的并发规则会要求对架构设计进行某些调整, 但通过库的帮助, 以及应用最佳实践, 日常开发基本不受影响.
实际上, 遵守 Kotlin/Native 规则的跨平台代码将会使得跨平台移动应用程序中的并发更加安全.

在 Kotlin 跨平台应用程序中, 你的 Android 和 iOS 编译目标将存在不同的状态规则.
有些开发组, 通常开发更大的应用程序, 对非常特定的功能共用代码, 经常会在主机平台中管理并发. 
这会要求明确的冻结从 Kotlin 返回的状态, 但除此之外, 这种方案还是简单直接的. 

一个更加广泛的模型, 在 Kotlin 中管理并发, 主机从它的主线程与共用代码通信, 从状态管理的角度来看更加简单.
并发库, 比如 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines),
将会帮助你自动的冻结状态. 在你的代码中你还可以利用 [coroutines](coroutines-overview.html) 的能力,
共用更多代码, 增加开发效率.

但是, 目前的 Kotlin/Native 并发模型存在一些缺陷. 比如, 移动开发者过去可以在线程之间自由的共用他们的对象,
他们已经为线程之间的数据共享开发了大量的实现方案和架构模式来避免数据间的竞争.
使用 Kotlin/Native 可以编写高效率的应用程序, 不会阻塞主线程, 但要达到这种能力, 存在很陡的学习曲线.

所以我们正在努力为 Kotlin/Native 创建一个新的内存管理器和并发模型, 帮助我们解决这些缺陷.
详情请参见 [我们正在为此进行的工作](https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap/).

_本文由 [Touchlab](https://touchlab.co/) 编写, 供 JetBrains 发布._
